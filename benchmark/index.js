"use strict";

var apiBenchmark = require('api-benchmark');
var fs = require('fs');

var service = {
  server1: "http://192.168.100.8/"
};

var routes = {
  "index": "/",
  "toggleGame1": {
    method: 'post',
    route: "/toggle/game1",
    headers: {
      'Accept': 'application/json'
    }
  }
  ,
  "toggleGame2": {
    method: 'post',
    route: "/toggle/game2",
    headers: {
      'Accept': 'application/json'
    }
  },
  "toggleGame3": {
    method: 'post',
    route: "/toggle/game3",
    headers: {
      'Accept': 'application/json'
    }
  },
};

var options = {
  debug: true,
  minSamples: 500,
  maxTime: 10,
  runMode: "parallel",
  maxConcurrentRequests: 50
};

apiBenchmark.measure(service, routes, options, function(err, results) {
  apiBenchmark.getHtml(results, function(error, html){
    var date = new Date().toISOString();
    fs.writeFile("./" + date + "_benchmark.html", html, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
})

// ab command
// ab -n 500 -c 500 http://localhost:5566/user/86f050f21f024d1096ba709e6fe8e78b
