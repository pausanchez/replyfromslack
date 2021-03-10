const axios = require('axios');
const config = require('../../config.json')

/**
 * 
 * @param {string} slack_channel_id - Slack Channel ID
 * 
 * After the creation of the Slack channel, we will "invite/add" slack users to the conversation
 * With this we will get notifications with every update on the channel
 * 
 */

const results = async function (slack_channel_id){ 
    let agents_slack_users_ids = config.slack_agent_ids
    let slackRequestUrl = `https://slack.com/api/conversations.invite?token=${config.slack_app_token}&channel=${slack_channel_id}&users=${agents_slack_users_ids}`;
    let slackRequestBody = {};
    let slackRequestOptions = {};
    
    await axios.post(slackRequestUrl, slackRequestBody, slackRequestOptions)
        .then(resp => {
            console.log("Agents Invited created")
        })
        .catch(err=> {
            console.log("Error:",err)
        })

    return
}
module.exports = results;