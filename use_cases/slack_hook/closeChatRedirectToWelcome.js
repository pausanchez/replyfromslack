const axios = require('axios');
const config = require('../../config.json')

/**
 * 
 * @param {string} landbot_customerId - Landbot customer id
 * @param {string} slack_channel_id - Slack Channel id
 * 
 * When a conversation arrives to the end and the Agent in Slack wants to:
 * 1. Delete the control variable used to mantain the user out of restarting the bot
 * 2. "Send" the user to a specific part of the bot, so when the user starts a new interaction it will be from a specific step
 * 3. "Close" the Slack channel to avoid clutter
 */

const results = async function (landbot_customerId, slack_channel_id){ 

    let botID = config.landbot_bot_id_redirection 
    let nodeLandbot =  config.landbot_node_id_redirection
    let keyVariable = config.landbot_control_variable 
    
    let landbotRequestUrl = `https://api.landbot.io/v1/customers/${landbot_customerId}/fields/${keyVariable}/`;
    let landbotRequestBody = {};
    let landbotRequestOptions = {headers: {
        "Authorization":`Token ${config.landbot_token}`,
        "Content-Type":"application/json"
    }};

    //Delete "slack_channel_id" variable from Landbot
    await axios.delete(landbotRequestUrl, landbotRequestOptions)
        .then(() => {
            //Redirect user to start of the bot nodeLandbot
            landbotRequestUrl = `https://api.landbot.io/v1/customers/${landbot_customerId}/assign_bot/${botID}/`;
            landbotRequestBody = {
                "launch": false,
                "node": nodeLandbot
            };
            return axios.put(landbotRequestUrl, landbotRequestBody, landbotRequestOptions)
            
        })
        .then(() => {
            //Close Slack channel
            let slackRequestUrl = `https://slack.com/api/conversations.archive?token=${config.slack_app_token}&channel=${slack_channel_id}`;
            let slackRequestBody = {}
            let slackRequestOptions = {}
            return axios.post(slackRequestUrl, slackRequestBody, slackRequestOptions)
            
        })
        .catch(err=> {
            console.log("Error:",err)
        })
}

module.exports = results;