// let Emitter = require("./emitter");
let Emitter = require("events");

let emtr = new Emitter();

emtr.on("greet", function () {
  console.log("hello hello");
});

emtr.on("greet", function () {
  console.log("a hello is tossed");
});

console.log("Hello");

emtr.emit("greet");
