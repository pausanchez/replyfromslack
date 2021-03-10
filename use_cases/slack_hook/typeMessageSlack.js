const axios = require('axios');
const fs = require('fs');
const config = require('../../config.json')

const type_picture = require('./messageTypesHelpers/type_picture')
const type_gif = require('./messageTypesHelpers/type_gif')
const type_message = require('./messageTypesHelpers/type_message')
const type_setup_challenge = require('./messageTypesHelpers/type_setup_challenge')
const type_bot_event = require('./messageTypesHelpers/type_bot_event')

/**
 * 
 * @param {Object} bodyMessage - Data from Slack event message
 * 
 * Return type of message according to bodyMessage data
 */

const results = function (bodyMessage){ 
    
    let objectType = {};

    if ("event" in bodyMessage && "subtype" in bodyMessage.event && bodyMessage.event.subtype == "file_share" && bodyMessage.event.upload == false){

        let filename = bodyMessage.event.files[0].url_private.split("/").pop()
        const path = `./tmp/${filename}`
        axios({ method: "get", url: bodyMessage.event.files[0].url_private, headers: {
            "Authorization":`Bearer ${config.slack_app_token}`,
            
        },responseType: "stream"})
       .then(function (response) {
           
            return response.data.pipe(fs.createWriteStream(path));
       })
       .catch(err=> {
        console.log("Error:",err)
       })

       let picture = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(filename)

        objectType = type_picture(bodyMessage, filename, picture)
        
    } else if ("event" in bodyMessage && "bot_profile" in bodyMessage.event && bodyMessage.event.bot_profile.name == "giphy"){
        
        objectType = type_gif(bodyMessage)

    } else if ("event" in bodyMessage && "channel" in bodyMessage.event && "client_msg_id" in bodyMessage.event && !bodyMessage.event.text.includes("replyfromslack:")){
        
        objectType = type_message(bodyMessage)

    } else if ("challenge" in bodyMessage) {

        objectType = type_setup_challenge(bodyMessage)
    
    } else {

        objectType = type_bot_event(bodyMessage)

    }

    return objectType
 
}

module.exports = results; 

