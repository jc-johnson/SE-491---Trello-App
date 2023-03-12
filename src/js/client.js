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
      icon: WHITE_ICON,
      text: 'Google Login',
      callback: onGoogleLoginClick
    }];
  },
});


//Google Stuff
function googleAuth(t) {
  if (!isOauthLoad){
    console.log('google not load');
    trelloAlert(t,'Google Service Error. Please Try Later.');
    return;
  }
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
        t.loadSecret(currentCard.id).then(function (secret) {
          console.log(secret);
          if(!secret){
            console.log('eventID not found');
            trelloAlert(t,'Calendar Event not Found');
            calendarAction = -1;
            return;
          }
          removeEvent(t, secret);
        });
        break;
      default:
        console.log('Calendar Action not match '+calendarAction);
    }
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    //disable now for fast testing
    // tokenClient.requestAccessToken({prompt: ''});
    tokenClient.requestAccessToken({prompt: 'consent'}); 
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

var onGoogleLoginClick = googleAuth;

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
  calendarAction = 1;
  t.loadSecret(currentCard.id).then(function (secret) {
    console.log(secret);
    if(!secret){
      console.log('eventID not found');
      trelloAlert(t,'Calendar Event not Found');
      calendarAction = -1;
      return;
    }
    removeEvent(t, secret);
  });
}

var dateCallback = function(t, opts){
  selectTime = opts.date;
  t.closePopup();
  calendarAction = 0;
  insertEvent(t) ；
}
async function removeEvent(t, eventID) {
  if(!isOauth){
    googleAuth(t);
    return;
  }
  console.log("remove event "+eventID);
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
    googleAuth(t);
    return;
  }
  //check response for which part to use https://developers.google.com/calendar/api/v3/reference/events/list#python
  calendarAction = -1;

  if (!response.result) {
    console.log(response.result);
    t.clearSecret(currentCard.id);
    trelloAlert(t,'Event Delete');
  }
  else trelloAlert(t,'Error. '+error.code+'\n'+error.message);
}

async function insertEvent(t) {
  if(!isOauth){
    googleAuth(t);
    return;
  }
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
    googleAuth(t);
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
  console.log(currentCard);
  console.log(response.result);
  trelloAlert(t,'Event Create');
  calendarAction = -1;
}