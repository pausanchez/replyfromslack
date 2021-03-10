const config = require('../../../config.json')
const baseURL = config.baseURL


/**
 * 
 * @param {Object} bodyMessage  - Message content
 * @param {string} filename - Name of the file
 * @param {boolean} picture - Is picture or other type of file
 * 
 * Message that has a file (type picture or not)
 * 
 */

const results = function (bodyMessage, filename, picture){ 
    
        
        let objectType = {}

        objectType.slack_channel_id = bodyMessage.event.channel
        objectType.type = picture ? "picture" : "fileshare"
        objectType.valid = true;
        objectType.file_source = `${baseURL}/tmp/${filename}`
        objectType.text = bodyMessage.event.text == "" ? filename : bodyMessage.event.text
    
        return objectType
     
    }
    
    module.exports = results; 