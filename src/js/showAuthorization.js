TrelloPowerUp.initialize({
    'show-authorization': function(t, options){
      // return what to do when a user clicks the 'Authorize Account' link
      // from the Power-Up gear icon which shows when 'authorization-status'
      // returns { authorized: false }
      // in this case we would open a popup
      return t.popup({
        title: 'Google Oauth2 Popup',
        url: './src/html/Oauth2.html',
        height: 140,
      });
    }
  });