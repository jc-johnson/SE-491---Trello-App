console.log('Hello World from Connector2.js')

window.TrelloPowerUp.initialize({
    "card-badges": function (t, opts) {
        // return an array of card badges for the given card
        return [];
    }
});