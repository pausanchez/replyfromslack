/**
 * 
 * @param {Object} bodyMessage - Content of the message payload
 * 
 * Create a common structured object for all type of messages
 * for easier parsing of different types of messages that can be captured
 * from the messagehook request
 */


const results = function (bodyMessage){ 

    let messageData = {
        type : bodyMessage.type,
        text : "",
        url_source : "url" in bodyMessage.data ? bodyMessage.data.url : undefined,
        latitude: "latitude" in bodyMessage.data ? bodyMessage.data.latitude : undefined,
        longitude: "longitude" in bodyMessage.data ? bodyMessage.data.longitude : undefined
    }
    
    if (messageData.type == "text"){
        messageData.text = bodyMessage.data.body
    } else if (messageData.type == "location"){
        messageData.text = bodyMessage._raw.address
    } else {
        messageData.text = bodyMessage.data.caption    
    }

    return messageData
}

module.exports = results; 

