const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.01:6379';
const client = redis.createClient(redisUrl);
const util = require('util');
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
    this.cacheable = true;
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
    const key=JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));
    // console.log(key);

    //see if the key has any value in redis
    const cachedValue = await client.get(key);

    //if do return that value
    if (cachedValue) {
        const doc = JSON.parse(cachedValue);

        return Array.isArray(doc) ?
            doc.map(d => new this.model(d)) :
            new this.model(doc);
    }

    //else return the data from mongo and set the key with value
    const result = await exec.apply(this, arguments); //here this has control on Query that gets produced

    client.set(key, JSON.stringify(result));

    return result; 
    }
    
}