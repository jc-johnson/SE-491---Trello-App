

function handleSignoutClick(t) {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
    }
    isOauth = false;
    t.alert({
        message: 'google login out'
    });
}