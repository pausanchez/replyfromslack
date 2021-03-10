const axios = require('axios');
const config = require('../../config.json')

/**
 * 
 * @param {string} channel_id - Slack Channel ID
 * 
 * Controller to check if the channel is one of the channels created by the app or other public Slack Channel message/event in the Workspace
 */

const results = async function (channel_id){ 

    let slackRequestUrl = `https://slack.com/api/conversations.info?token=${config.slack_app_token}&channel=${channel_id}`;
    let slackRequestBody = {};
    let slackRequestOptions = {};
    
    let validation;

    await axios.get(slackRequestUrl, slackRequestBody, slackRequestOptions)
        .then(resp => {
            let channel_name = resp.data.channel.name
            if (channel_name.includes(config.slack_base_channel_name)){
                validation = {"valid": true, "channelName":channel_name.slice(-8)}
            } else {
                validation = {"valid": false, "channelName":channel_name}
            }
        })
        .catch(err=> {
            console.log("Error:",err)
        })

    return validation   
 
}

module.exports = results; 

