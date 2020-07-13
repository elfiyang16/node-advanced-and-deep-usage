const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ""); //set top level key
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply();
  }
  console.log("about to run the query");
  console.log(this.getQuery());
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //see if we have a value in reids
  const cacheValue = await client.hget(this.hashKey, key);
  //return if we do have
  if (cacheValue) {
    console.log(cacheValue);
    const doc = new this.model(JSON.partse(cacheValue));
    Array.isArray(doc)
      ? doc.map((d) => {
          new this.mdoel(d);
        })
      : new this.model(doc);
  }
  //otherwise isseue the query and store in redis
  const result = await exec.apply(this, arguments); //WHAT DOES THIS MEAN
  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
