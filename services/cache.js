const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.01:6379';
const client = redis.createClient(redisUrl);
const util = require('util');
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.cacheable = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function () { //arrow function is not used as to refer exec instance on this at line 8
    if (!this.cacheable) {
        return exec
            .apply(this, arguments);
    }
    else {
        // console.log('IM ABOUT TO RUN A QUERY');
        // console.log(this.getQuery());
        // console.log(this.mongooseCollection.name);
        const key = JSON.stringify(Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        }));
        // console.log(key);

        //see if the key has any value in redis
        const cachedValue = await client.hget(this.hashKey, key);

        //if do return that value
        if (cachedValue) {
            const doc = JSON.parse(cachedValue);

            return Array.isArray(doc) ?
                doc.map(d => new this.model(d)) :
                new this.model(doc);
        }

        //else return the data from mongo and set the key with value
        const result = await exec.apply(this, arguments); //here this has control on Query that gets produced

        client.hset(this.hashKey, key, JSON.stringify(result));

        return result;
    }
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}