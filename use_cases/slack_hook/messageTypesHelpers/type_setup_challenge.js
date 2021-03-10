
/**
 * 
 * @param {Object} bodyMessage - Message content
 * 
 * Used when the Slack needs to check the hook url only during set up
 */

const results = function (bodyMessage){ 
    
        
        let objectType = {}
    
        objectType.type = "challenge"
        objectType.valid = true;
        objectType.text = bodyMessage.challenge
        
    
        return objectType
     
    }
    
    module.exports = results; 