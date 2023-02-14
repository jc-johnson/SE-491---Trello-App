window.TrelloPowerUp.initialize({
    "card-detail-badges": function (t, opts) {
      return t
        .card("name")
        .get("name")
        .then(function (cardName) {
          console.log("We just loaded the card name for fun: " + cardName);
  
          return [
            {
              // dynamic badges can have their function rerun after a set number
              // of seconds defined by refresh. Minimum of 10 seconds.
              dynamic: function () {
                // we could also return a Promise that resolves to this
                // as well if we needed to do something async first
                return {
                  title: "Detail Badge",
                  text: "Dynamic " + (Math.random() * 100).toFixed(0).toString(),
                  color: randomBadgeColor(),
                  refresh: 10, // in seconds
                };
              },
            },
            {
              // its best to use static badges unless you need your badges
              // to refresh you can mix and match between static and dynamic
              title: "Detail Badge",
              text: "Static",
              color: null,
            },
            {
              // card detail badges (those that appear on the back of cards)
              // also support callback functions so that you can open for example
              // open a popup on click
              title: "Popup Detail Badge",
              text: "Popup",
              callback: function (t, opts) {
                // function to run on click
                // do something
              },
            },
            {
              // or for simpler use cases you can also provide a url
              // when the user clicks on the card detail badge they will
              // go to a new tab at that url
              title: "URL Detail Badge",
              text: "URL",
              url: "https://trello.com/home",
              target: "Trello Landing Page", // optional target for above url
            },
          ];
        });
    },
  });