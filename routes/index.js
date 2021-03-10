const routes = require('express').Router();

//Config variables
const config = require('../config.json')

//slack_hook
const typeMessageSlack = require('../use_cases/slack_hook/typeMessageSlack');
const validateChannelId = require('../use_cases/slack_hook/validateChannelId');
const sendMessageToLandbot = require('../use_cases/slack_hook/sendMessageToLandbot');
const closeChatRedirectToWelcome = require('../use_cases/slack_hook/closeChatRedirectToWelcome')

//landbot_hook
const typeMessageLandbot = require('../use_cases/landbot_hook/typeMessageLandbot');
const messageForAgent = require('../use_cases/landbot_hook/messageForAgent')

//landbot_trigger
const createSlackChannel = require('../use_cases/landbot_trigger/createSlackChannel')
const inviteAgents = require('../use_cases/landbot_trigger/inviteAgents')
const infoForAgent = require('../use_cases/landbot_trigger/infoForAgent')

/**
 * route to capture requests from other platform, 
 * in this case Slack, 
 * sample url: https://<your hook url>/slack_hook
 */

routes.post('/slack_hook', function(req, res){
    const bodyMessage = req.body;

    //Parse to message from Slack
    let typeSlack = typeMessageSlack(bodyMessage)
    
    if("challenge" in bodyMessage){
        //Slack Event webhook validation challenge
        res.status(200).send({"challenge":bodyMessage.challenge});
        return

    } else if (typeSlack.valid){
        res.status(200).send({"botmessage_sent":true})

        //Validate if message is from a replyfromslack app slack channel
        validateChannelId(bodyMessage.event.channel)
            .then(resp => {
                if (!resp.valid){
                    console.log({"botmessage_type":"NOT reply from slack message"});
                } else {
                    if (bodyMessage.event.text !== "CLOSECHAT"){
                        //If message is valid, send to Landbot API
                        sendMessageToLandbot(resp.channelName, typeSlack)
                        console.log({"botmessage_type":"message sent to Landbot"});
                    } else {
                        //If agent in Slack types special keyword, instructs to delete channel in Slack and reset user
                        closeChatRedirectToWelcome(resp.channelName, bodyMessage.event.channel)
                        console.log({"botmessage_type":"chat closed and user redirected"});
                        
                    }                    
                }
            })
    } else {
        //response to Slack Hook, in case of other type of messages app bot
        res.status(200).send({"bot message":true});
        return
    }
})

/**
 * route to capture requests from Landbot, 
 * sample url: https://<your hook url>/landbot_hook
 */ 

routes.post('/landbot_hook', function(req, res){
    const bodyMessage = req.body;
    
    let forAgent = config.landbot_control_variable in bodyMessage.messages[0].customer ? true : false
    let isCustomer = bodyMessage.messages[0].sender.type == 'customer' ? true : false

    if (forAgent && isCustomer) {
        let userName = bodyMessage.messages[0].customer.name;
        let slack_channel_id = bodyMessage.messages[0].customer.slack_channel_id

        //Parse to message from Landbot
        let userMessage = typeMessageLandbot(bodyMessage.messages[0])
        
        //Send message to slack as user
        messageForAgent(userName, userMessage,slack_channel_id)
        .then(() => {
            res.status(200).send({"messagefor":"agent"});
        })
        .catch(err => {
            res.status(500).send({
              errorMessage: "error!"
            });
            console.log(err);
        });
    }     
})

/**
 * Capture requests from Webhook block in Landbot,
 * to initiate channel in Slack 
 * sample url: https://<your hook url>/landbot_trigger
 */

routes.post('/landbot_trigger', async function(req, res){
    
    let landbot_body_trigger = req.body
    let slack_channel_id;

    //Create Channel using customer id (Slack API)
    createSlackChannel(landbot_body_trigger) 
    .then(resp => {
        slack_channel_id = resp.channel.id;
        //Invite agent/s to channel id (Slack API)
        return inviteAgents(resp.channel.id)
    })
    .then(() => {
        //Send message with information form the user and mention agent (Slack API)
        return infoForAgent(slack_channel_id,landbot_body_trigger)
    })
    .then(() => {
         res.status(200).json({
             "channel_created":true,
             "agent_invited":true,
             "agent_notified":true,
             [config.landbot_control_variable]:slack_channel_id
            })
    })
    .catch(err => {
        res.status(500).send({
          errorMessage: "error!"
        });
        console.log(err);
    });    
    
})

module.exports = routes;