function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        console.log('login error');
        window.TrelloPowerUp.iframe().alert({
            message: 'google login error'
        });
        throw (resp);
      }
      console.log('login success');
      window.TrelloPowerUp.iframe().alert({
        message: 'google login success'
      }); 
      isOauth = true;
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({prompt: ''});
    }
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
    }
    isOauth = false;
    window.TrelloPowerUp.iframe().alert({
        message: 'google login out'
    });
}