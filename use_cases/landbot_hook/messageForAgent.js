const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../../config.json')

/**
 * 
 * @param {string} userName - The Whatsapp user name stored in the variable @name
 * @param {Object} dataMessage - Contains information about the message like type or text
 * @param {string} slack_channel_id - The Slack channel id where the message should be sent to
 * 
 * Controller to send message to Slack based on the type and content of message 
 * received from Landbot MessageHook 
 */

const results = async function (userName, dataMessage,slack_channel_id){
 
    let slackRequest = {};
    
    //When message from Landbot is type text or the user has shared the location
    if (dataMessage.type == "text" || dataMessage.type == "location"){
        slackRequest.url = `https://slack.com/api/chat.postMessage`;
        slackRequest.body = {
            "channel": slack_channel_id,
            "username": userName,
            "icon_url":config.slack_icon_pic_src,
            "text": dataMessage.text,
            "link_names":true
        };
        slackRequest.options = {headers: {
            "Authorization":`Bearer ${config.slack_app_token}`,
            "Content-Type":"application/json"
        }}
    //When message from Landbot is a picture and have or not a message
    } else if (dataMessage.type == "image") {
        slackRequest.url = `https://slack.com/api/chat.postMessage`;
        slackRequest.body = {
            "channel": slack_channel_id,
            "username": userName,
            "icon_url":config.slack_icon_pic_src,
            "text": dataMessage.text,
            "link_names":true,
            "blocks": [
                  {
                      "type": "image",
                      "title": {
                          "type": "plain_text",
                          "text": dataMessage.text || "picture",
                          "emoji": true
                      },
                      "image_url": dataMessage.url_source,
                      "alt_text": dataMessage.text || "picture"
                  }
              ]
        };
        slackRequest.options = {headers: {
            "Authorization":`Bearer ${config.slack_app_token}`,
            "Content-Type":"application/json"
        }}
    //When message from Landbot is a file (document), audio or video (Gifs are considered videos MP4)
    } else { //document / audio / video
        if (dataMessage.text == ""){
            dataMessage.text = dataMessage.url_source.split('/').pop()
        }

        const url = dataMessage.url_source; // link to file you want to download
        const path = `./tmp/${dataMessage.text}` // where to save a file

        var data = new FormData();
        data.append('token', config.slack_app_token);
        data.append('channels', slack_channel_id);
        data.append('filename', dataMessage.text || "file");
        data.append('filetype', dataMessage.text.split('.').pop());

       axios({ method: "get", url: dataMessage.url_source, responseType: "stream"})
       .then(function (response) {
            return response.data.pipe(fs.createWriteStream(path));
       })
       .then(wrt => {
         wrt.on('finish',()=>{
            data.append('file', fs.createReadStream(`./tmp/${dataMessage.text}`));
            slackRequest.url = 'https://slack.com/api/files.upload',
            slackRequest.options = {headers: { 
                ...data.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
            }
            slackRequest.body = data
            axios.post(slackRequest.url, slackRequest.body, slackRequest.options)
            .then(()=>{
                fs.unlinkSync(`./tmp/${dataMessage.text}`)
                return
            })
            .catch(err=> {
                console.log("Error:",err)
            })
        })
       
        })
        .catch(err=> {
            console.log("Error:",err)
        })   
    return    
    }
    
    //Send Message to Slack according to the type of message
    await axios.post(slackRequest.url, slackRequest.body, slackRequest.options)
        .then(resp => {
            console.log("Message posted:", resp.data.message.text)
        })
        .catch(err=> {
            console.log("Error:",err)
        })

    return
 
}

module.exports = results; 

