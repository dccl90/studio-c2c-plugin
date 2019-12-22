import { Actions } from '@twilio/flex-ui';

export default function (runtimeDomain, manager) {

  Actions.replaceAction('AcceptTask', (payload, original) => {
    return new Promise((resolve, reject) => {
      const reservation = payload.task.sourceObject;

      if (payload.task.attributes.type === 'click-to-call') {
          console.log('2')
          console.log(runtimeDomain);
          reservation.call(reservation.task.attributes.from,
            `https://${runtimeDomain}/agent-outbound-join?taskSid=${payload.task.taskSid}`, {
              accept: true
            }
          )    
      } else {
        original(payload)
      }
      resolve();
    })
  })

  Actions.replaceAction('HoldCall', (payload, original) => {
    return new Promise((resolve, reject) => {

      const task = payload.task;
      const reservation = payload.task.sourceObject;
      const conference = task.attributes.conference.sid;
      const participant = task.attributes.conference.participants.customer;
      const hold = true;

      if (task.attributes.type === 'click-to-call') {
        toggleHold(conference, participant, hold, original, payload, reservation);
      } else {
        original(payload);
      }
      resolve();
    })
  })

  Actions.replaceAction('UnholdCall', (payload, original) => {
    return new Promise((resolve, reject) => {

      const task = payload.task;
      if (typeof(task.attributes.conference) === 'undefined') {
        original(payload)
      } else {

        const reservation = payload.task.sourceObject;
        const conference = task.attributes.conference.sid;
        const participant = task.attributes.conference.participants.customer;
        const hold = false;

        if (task.attributes.type === 'click-to-call') {
          toggleHold(conference, participant, hold, original, payload, reservation);
        } else {
          original(payload);
        }
      }
      resolve();
    })
  })

  const toggleHold = function (conference, participant, hold, original, payload) {

    const jweToken = manager.store.getState().flex.session.ssoTokenPayload.token

    return fetch(`https://${runtimeDomain}/hold-call`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `conference=${conference}&participant=${participant}&hold=${hold}&Token=${jweToken}`
    })
    .then(response => {
      original(payload);
    })
    .catch(error => {
      console.log(error);
    });
  }

}