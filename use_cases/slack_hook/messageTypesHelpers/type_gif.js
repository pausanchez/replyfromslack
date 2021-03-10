/**
 * 
 * @param {Object} bodyMessage - Message content
 * 
 * Message when is a Slack Giphy message
 */


const results = function (bodyMessage){ 
    
        
        let objectType = {}

        objectType.slack_channel_id = bodyMessage.event.channel
        objectType.type = "gif"
        objectType.valid = true;
        objectType.file_source = bodyMessage.event.blocks[0].image_url;
        objectType.text = bodyMessage.event.blocks[0].title.text
    
        
    
        return objectType
     
    }
    
    module.exports = results; 