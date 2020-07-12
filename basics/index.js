process.env.UV_THREADPOOL_SIZE = 2; //every child's thread volume

const cluster = require("cluster");
// console.log(cluster.isMaster()); // ==> true; with worker instance, this propety returns false
if (cluster.isMaster) {
  // cause. index.js to be executed again in child mode
  cluster.fork();
  cluster.fork();
} else {
  // I'm a child, acting like a server
  const express = require("express");
  const crypto = require("crypto");
  const app = express();
  const Worker = require("webworker-threads").Worker;

  // function doWork(duration) {
  //   const start = Date.now();
  //   while (Date.now() - start < duration) {}
  // }

  app.get("/", (req, res) => {
    const worker = new Worker(function () {
      this.onmessage =
        /*note This loosely represents a thread object */
        /*that's why can't use => function, since this will refer app handler  */
        function () {
          //stuff the worker does  when we call postmessage to the worker
          let counter = 0;
          while (counter < 1e9) {
            counter++;
          }
          //worker communicates back to us
          postMessage(counter);
        };
    });

    worker.onmessage = function (message) {
      console.log(message.data);
      res.send("" + message.data);
    };

    worker.postMessage();

    // crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    //   res.send("Hi there");
    // });
  });

  app.get("/fast", (req, res) => {
    res.send("This was fast!");
  });

  app.listen(3000);
}
