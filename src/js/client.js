const GLITCH_ICON = 'https://cdn.glitch.com/2442c68d-7b6d-4b69-9d13-feab530aa88e%2Fglitch-icon.svg?1489773457908';
const GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
const WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';
const BLACK_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg';

function trelloAlert(t,alertMsg){
  t.alert({
    message: alertMsg
  });
}

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Popup List Example',
    items: [
      {
        text: 'Open Modal',
        callback: function(t){
          return t.modal({            
            url: 'src/html/modal.html', // The URL to load for the iframe
            args: { text: 'Hello' }, // Optional args to access later with t.arg('text') on './modal.html'
            accentColor: '#F2D600', // Optional color for the modal header 
            height: 500, // Initial height for iframe; not used if fullscreen is true
            fullscreen: true, // Whether the modal should stretch to take up the whole screen
            callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
            title: 'Hello, Modal!', // Optional title for modal header
            // You can add up to 3 action buttons on the modal header - max 1 on the right side.
            actions: [{
              icon: GRAY_ICON,
              url: 'https://depaul.edu', // Opens the URL passed to it.
              alt: 'Leftmost',
              position: 'left',
            }, {
              icon: GRAY_ICON,
              callback: (tr) => tr.popup({ // Callback to be called when user clicks the action button.
                title: 'Settings',
                url: 'src/html/settings.html',
                height: 164,
              }),
              alt: 'Second from left',
              position: 'left',
            }, {
              icon: GRAY_ICON,
              callback: () => console.log('🏎'),
              alt: 'Right side',
              position: 'right',
            }],
          })
        }
      },
      {
        text: 'Open Board Bar',
        callback: function(t){
          return t.boardBar({
            url: 'src/html/board-bar.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      }
    ]
  });
};

TrelloPowerUp.initialize({
  'card-buttons': function (t, opts) {
    return [{
      icon: GRAY_ICON,
      text: 'Open Popup Sample (Hello World)',
      callback: function(t) {
        trelloAlert(t,'Hello World!');
      },
      condition: 'always'
    }, {
      // but of course, you could also just kick off to a url if that's your thing
      icon: GRAY_ICON,
      text: 'Insert into Google Calendar',
      condition: 'always',
      callback: insertEventClick
    }, {
      // but of course, you could also just kick off to a url if that's your thing
      icon: GRAY_ICON,
      text: 'Remove Google Calendar Event',
      condition: 'always',
      callback: removeEventClick
    }];
  },
  'board-buttons': function(t, options){
    return [{
      // we can either provide a button that has a callback function
      // that callback function should probably open a popup, overlay, or boardBar
      icon: WHITE_ICON,
      text: 'Popup',
      callback: boardButtonCallback
    }, {
      // or we can also have a button that is just a simple url
      // clicking it will open a new tab at the provided url
      icon: WHITE_ICON,
      text: 'URL',
      url: 'https://trello.com/inspiration',
      target: 'Inspiring Boards' // optional target for above url
    }];
  },
});



//Google Stuff
function googleCalendarAuth(t) {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      console.log('login error');
      trelloAlert(t,'google login error');
      throw (resp);
    }
    console.log('login success');
    trelloAlert(t,'google login success');
    isOauth = true;
    
    switch (calendarAction){
      case 0:
        console.log('insert action');
        insertEvent(t);
        break;
      case 1:
        console.log('delete action');
        removeEvent(t);
        break;
      default:
        console.log('Calendar Action not match '+calendarAction);
    }
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: ''});//disable now for fast testing
    // tokenClient.requestAccessToken({prompt: 'consent'}); 
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}
var getEventList = async function(t) {
  if(!(isOauthLoad&&isOauth)){
    trelloAlert(t,'Google account did not logged or Google service is not ready')
    return;
  }
  let response;
  try {
    //put parameters in the request https://developers.google.com/calendar/api/v3/reference/events/list#python
    const request = {
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime',
    };
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    trelloAlert(t,err.message);
    return;
  }
  //check response for which part to use https://developers.google.com/calendar/api/v3/reference/events/list#python
  const events = response.result.items;
  if (!events || events.length == 0) {
    trelloAlert(t,'No events found.');
    return;
  }
  // Flatten to string to display
  const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n');
  trelloAlert(t,output);
}

var insertEventClick = function(t) {
  console.log("card info");
  t.card('all').then(function (card) {
    currentCard = card;
  });
  // console.log("card end");
  t.popup({
    type: 'datetime',
    title: 'Setup Calendar Event Time',
    callback:  dateCallback ,// opts.date is an ISOString
  })
}
var removeEventClick = function(t) {
  t.card('all').then(function (card) {
    currentCard = card;
  });
  // console.log("card end");
  calendarAction = 1;
  googleCalendarAuth(t);
}

var dateCallback = function(t, opts){
  selectTime = opts.date;
  calendarAction = 0;
  googleCalendarAuth(t);
}
async function removeEvent(t) {
  let eventID = t.loadSecret(currentCard.id);
  console.log('event id '+eventID);
  if(!eventID){
    console.log('eventID not found');
    trelloAlert(t,'Calendar Event not Found');
    calendarAction = -1;
    return;
  }
  console.log("Waiting for response")

  let response;
  try {
    //put parameters in the request https://developers.google.com/calendar/api/v3/reference/events/list#python
    const request = {
      'calendarId': 'primary',
      "eventId": eventID,
    };
    response = await gapi.client.calendar.events.delete(request);
  } catch (err) {
    console.log(err);
    trelloAlert(t,err.status);
    return;
  }
  //check response for which part to use https://developers.google.com/calendar/api/v3/reference/events/list#python
  console.log(response.result);
  t.clearSecret(currentCard.id);

  trelloAlert(t,'Event Delete');
  calendarAction = -1;
}

async function insertEvent(t) {
  const timeZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(timeZ);
  console.log("Waiting for response")

  let response;
  try {
    //put parameters in the request https://developers.google.com/calendar/api/v3/reference/events/list#python
    const request = {
      'calendarId': 'primary',
      "summary": currentCard.name,
      "description":  currentCard.url,
      "start": {
        "dateTime": selectTime,
        "timeZone": timeZ
      },
      "end": {
        "dateTime":selectTime,
        "timeZone":timeZ
      },
    };
    response = await gapi.client.calendar.events.insert(request);
  } catch (err) {
    console.log(err);
    trelloAlert(t,err.status);
    return;
  }
  //check response for which part to use https://developers.google.com/calendar/api/v3/reference/events/list#python
  const id = response.result.id;
  console.log(response.result.id);
  if (!id || id<=0) {
    const error = response.result.error;
    console.log(response.result.error);

    if(!error)
      trelloAlert(t,'Error. No error code found.');
    trelloAlert(t,'Error. '+error.code+'\n'+error.message);
    return;
  }
  // Flatten to string to display
  t.storeSecret(currentCard.id,response.result.id);
  console.log(response.result);

  trelloAlert(t,'Event Create');
  calendarAction = -1;
}