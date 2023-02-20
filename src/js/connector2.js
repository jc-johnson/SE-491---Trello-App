console.log('Hello World from Connector2.js')

window.TrelloPowerUp.initialize({
    "card-badges": function (t, opts) {
        return t.getAll()
        .then(function (data) {
            console.log(JSON.stringify(data, null, 2));
            return[];
        });
    }
});