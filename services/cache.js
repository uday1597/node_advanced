const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.01:6379';
const client = redis.createClient(redisUrl);
const util = require('util');
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () { //arrow function is not used as to refer exec instance on this at line 8
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
        console.log(cachedValue);
    }

    //else return the data from mongo and set the key with value
    const result = await exec.apply(this, arguments); //here this has control on Query that gets produced
    console.log(result);
}