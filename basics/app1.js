let EventEmitter = require("events");
let util = require("util");

function Greetr() {
  EventEmitter.call(this);
  this.greeting = "hellow";
}

util.inherits(Greetr, EventEmitter);

Greetr.prototype.greet = function () {
  console.log(this.greeting);
  this.emit("greet");
};

var greeter1 = new Greetr();
greeter1.on("greet", function () {
  console.log("someone greeted!");
});

greeter1.greet();
