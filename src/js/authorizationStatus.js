TrelloPowerUp.initialize({
    'authorization-status': function(t, options){
      // return a promise that resolves to the object with
      // a property 'authorized' being true/false
      // you can also return the object synchronously if you know
      // the answer synchronously
      return new TrelloPowerUp.Promise((resolve) => resolve({ authorized: isOauth }));
    }
  });