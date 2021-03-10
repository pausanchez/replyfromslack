const axios = require('axios');
const config = require('../../config.json')

/**
 * 
 * @param {string} slack_channel_id - Id of the slack channel
 * @param {Object} landbot_body_trigger - Content with information extra for the first message in Slack after creating the channel
 * 
 * Once the channel has been created and we have the id, we will send a message with some information to the agent
 */

const results = async function (slack_channel_id,landbot_body_trigger){ 

    let nameUser = landbot_body_trigger.name;
    let userId = landbot_body_trigger.id;
    let otherdata = landbot_body_trigger.otherdata;
    
    let slackRequestUrl = `https://slack.com/api/chat.postMessage`;
    let slackRequestBody = {
        "channel": slack_channel_id,
        "text": `replyfromslack: Hi ${config.slack_agent_to_mention} the user ${nameUser} from ${otherdata} with the id ${userId} needs assistance`,
        "link_names":true
      };
    let slackRequestOptions = {headers: {
        "Authorization":`Bearer ${config.slack_app_token}`,
        "Content-Type":"application/json"
    }}
    
    await axios.post(slackRequestUrl, slackRequestBody, slackRequestOptions)
        .then(resp => {
            console.log("Message posted:", resp.data)
        })
        .catch(err=> {
            console.log("Error:",err)
            return res.status(400).json({
                msg: 'Failed to invite to post message',
                err
            })
        })

    return
 
}

module.exports = results; 

