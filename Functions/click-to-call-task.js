exports.handler = function(context, event, callback) {

    const workspace = context.TWILIO_WORKSPACE_SID;
    const workflowSid = context.TWILIO_WORKFLOW_SID;
    const client = context.getTwilioClient();
    const twiml = new Twilio.twiml.VoiceResponse();

    client
        .taskrouter.workspaces(workspace)
        .tasks
        .create({
            attributes: JSON.stringify({
                to: event.To,
                type: 'click-to-call',
                name: event.To,
                from: event.From,
                url: context.RUNTIME_DOMAIN,
                targetWorker: event.targetWorker,
                autoAnswer: 'true',
                conference: {
                    participants: {
                        customer: event.CallSid
                    }
                }
            }),
            workflowSid: workflowSid,
            taskChannel: 'voice',
            timeout: 30
        })
        .then(task => {
            twiml.dial()
                .conference({
                    statusCallback: "/click-to-call-callback?execution=" + event.executionSid,
                    statusCallbackEvent: 'start end join leave mute hold'
                }, task.sid);
            callback(null, twiml)
        })
        .catch((error) => {
            console.log(error);
            callback(error);
        });
};