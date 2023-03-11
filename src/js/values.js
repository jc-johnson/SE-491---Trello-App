
const CLIENT_ID = '695030822144-rdkeqou0cenai8bguj6q159g0qrf3ri8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAqzEmB1ydpBLYNybMsjKL3xavYhj3fHPA';
const CalendarScope = 'https://www.googleapis.com/auth/calendar';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

let tokenClient;
let isOauth = false;
let isOauthLoad = false;
let currentCard ;
let selectTime ;
let calendarAction ;