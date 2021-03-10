const axios = require('axios');
const config = require('../../config.json')

/**
  * 
  * @param {Object} body_trigger - Content of the Webhook payload used in Landbot bot
  * 
  * On request create a Channel in Slack
  *  
  * It will add a specific name ("replyfromslacktestv")
  * and attach a date as the title of the channel has always to be unique
  * 
  * We will use the structure of the name to be identified as a valid channel later
  * 
  * It will return the channel id in the payload to be stored in Landbot as a control variable
  * to deal with the flow
  */

const results = async function (body_trigger){ 

    let landbot_id = body_trigger.id;

    const now = new Date()  
    const utcMilllisecondsSinceEpoch = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)  
    const timestamp = Math.round(utcMilllisecondsSinceEpoch / 1000) 
    
    let slackChannelName = `${config.slack_app_channel_name}-${timestamp}-${landbot_id}`
    
    let slackRequestUrl = `https://slack.com/api/conversations.create?token=${config.slack_app_token}&name=${slackChannelName}&is_private=false`;
    let slackRequestBody = {};
    let slackRequestOptions = {};
    let triggerResponse;
    
    await axios.post(slackRequestUrl, slackRequestBody, slackRequestOptions)
        .then(resp => {
            if (resp.data.ok == false){
                return {msg: `Failed to create channel:${resp.data}`}
            } else {
                triggerResponse = resp.data
            }
        })
        .catch(err=> {
            console.log("Error:",err)
        })
    return triggerResponse
}

module.exports = results;