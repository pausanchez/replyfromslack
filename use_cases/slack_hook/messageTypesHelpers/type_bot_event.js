/**
 * 
 * @param {Object} bodyMessage - Message content
 * 
 * Message when is a Slack event but not a message to be sent
 */

const results = function (bodyMessage){ 
    
        
        let objectType = {}
    
        objectType.slack_channel_id = bodyMessage.event.channel
        objectType.valid = false;
    
        return objectType
     
    }
    
    module.exports = results; 