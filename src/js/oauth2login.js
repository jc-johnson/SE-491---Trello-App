

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