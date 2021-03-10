/**
 * 
 * @param {Object} bodyMessage - Message content
 * 
 * Message only text
 */

const results = function (bodyMessage){ 
    
        
        let objectType = {};


        objectType.slack_channel_id = bodyMessage.event.channel
        objectType.type = "message"
        objectType.valid = true;
        objectType.text = bodyMessage.event.text
    
        
    
        return objectType
     
    }
    
    module.exports = results; 