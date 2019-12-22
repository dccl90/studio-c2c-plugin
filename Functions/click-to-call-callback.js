const fetchTask = (client, context, taskSid) => {
  return client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks(taskSid)
      .fetch();
};

const updateTaskAttributes = (client, context, taskSid, attributes) => {
  return client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks(taskSid)
      .update({
          attributes: JSON.stringify(attributes)
      });
};

exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  let attributes = {};

  if (event.SequenceNumber === '1') {
      console.log("Customer placed in conference")
      callback(null, "Customer Joined")
  }


  if (event.StatusCallbackEvent === 'participant-join') {
      fetchTask(client, context, event.FriendlyName)
          .then(task => {
              attributes = {
                  ...JSON.parse(task.attributes)
              }
              if (attributes.conference) {
                  attributes.conference.sid = event.ConferenceSid;
                  attributes.conference.participants.worker = event.CallSid;
                  console.log(attributes)
              }
          })
          .then(result => {
              console.log("Updating task...")
              updateTaskAttributes(client, context, event.FriendlyName, attributes)
                  .then(result => {
                      console.log("Attributes Updated")
                      callback(null, null)
                  });

          })
  } else if (event.StatusCallbackEvent === 'conference-end') {
      console.log("End")
      return client.taskrouter
          .workspaces(context.TWILIO_WORKSPACE_SID)
          .tasks(event.FriendlyName)
          .update({
              assignmentStatus: 'wrapping',
              reason: 'conference ended'
          })
          .then(() => {
              client
                  .studio
                  .v1.flows(context.FLOW_SID)
                  .executions(event.execution)
                  .remove()
                  .then(() => callback(null, null))
          })
          .catch(error => callback(error));
  } else {
      callback(null, "OK");
  }
};