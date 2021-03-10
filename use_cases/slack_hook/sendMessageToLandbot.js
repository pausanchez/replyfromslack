const axios = require('axios');
const config = require('../../config.json')

/**
 * 
 * @param {string} customerId - Landbot customer id (@id)
 * @param {Object} messagedata - Message data to be sent to Landbot
 * 
 * Controller to send messages to Landbot user depending on type of message
 */

const results = async function (customerId, messagedata){ 

    let landbotRequestUrl;
    let landbotRequestBody;
    let landbotRequestOptions = {headers: {
        "Authorization":`Token ${config.landbot_token}`,
        "Content-Type":"application/json"
    }};
    // Message doesn't contain a picture
    if (messagedata.type !== "picture"){
        landbotRequestUrl = `https://api.landbot.io/v1/customers/${customerId}/send_text/`;
        landbotRequestBody = {
            "message": messagedata.type == "message" ? messagedata.text : `${messagedata.text} : ${messagedata.file_source}`
        };
    // Message contains a picture
    } else {
        landbotRequestUrl = `https://api.landbot.io/v1/customers/${customerId}/send_image/`;
        landbotRequestBody = {
            "url": messagedata.file_source,
            "caption": messagedata.text
        };
    }
    
    await axios.post(landbotRequestUrl, landbotRequestBody, landbotRequestOptions)
        .then(resp => {
            return resp.data
        })
        .catch(err=> {
            console.log("Error:",err)
        })
    return
}

module.exports = results; 

