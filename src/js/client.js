const GLITCH_ICON = 'https://cdn.glitch.com/2442c68d-7b6d-4b69-9d13-feab530aa88e%2Fglitch-icon.svg?1489773457908';
const GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
const WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';
const BLACK_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg';


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

var onBtnClick = function (t, opts) {
  t.alert({
    message: 'Someone clicked the button'
  })
};

TrelloPowerUp.initialize({
  'card-buttons': function (t, opts) {
    return [{
      icon: 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg',
      text: 'Open Popup',
      callback: function(t) {
          t.alert({
            message: 'Hello World!'
          })
      },
      condition: 'always'
    }, {
      // but of course, you could also just kick off to a url if that's your thing
      icon: GRAY_ICON,
      text: 'get calendar event list',
      condition: 'always',
      url: 'https://developer.atlassian.com/cloud/trello',
      target: 'Trello Developer Site' // optional target for above url
    }];
  },
  // 'board-buttons': function(t, options){
  //   return [{
  //     // we can either provide a button that has a callback function
  //     // that callback function should probably open a popup, overlay, or boardBar
  //     icon: WHITE_ICON,
  //     text: 'Popup',
  //     callback: boardButtonCallback
  //   }, {
  //     // or we can also have a button that is just a simple url
  //     // clicking it will open a new tab at the provided url
  //     icon: WHITE_ICON,
  //     text: 'URL',
  //     url: 'https://trello.com/inspiration',
  //     target: 'Inspiring Boards' // optional target for above url
  //   }, {
  //     // we can either provide a button that has a callback function
  //     icon: WHITE_ICON,
  //     text: 'Callback',
  //     callback: onBtnClick,
  //     condition: 'edit'
  //   }];
  // },
  // 'show-authorization': function(t, options){
  //   // return what to do when a user clicks the 'Authorize Account' link
  //   // from the Power-Up gear icon which shows when 'authorization-status'
  //   // returns { authorized: false }
  //   // in this case we would open a popup
  //   return t.popup({
  //     title: 'Google Oauth2 Popup',
  //     url: './src/html/Oauth2.html',
  //     height: 140,
  //   });
  // },
  // 'authorization-status': function(t, options){
  //   // return a promise that resolves to the object with
  //   // a property 'authorized' being true/false
  //   // you can also return the object synchronously if you know
  //   // the answer synchronously
  //   return new TrelloPowerUp.Promise((resolve) => resolve({ authorized: isOauth }));
  // }
});