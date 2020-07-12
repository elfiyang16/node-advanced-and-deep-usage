let obj = {
  name: "elfi",
  greet: function () {
    console.log(`hello ${this.name}`);
  },
};

obj.greet();

obj.greet.call({ name: "julia" }); //call denotes where "this" points to
obj.greet.apply({ name: "jone" }); //similar to apply--only different in how params are passed in
