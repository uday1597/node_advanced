const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () { //arrow function is not used as to refer exec instance on this at line 8
    console.log('IM ABOUT TO RUN A QUERY');
    console.log(this.getQuery());
    console.log(this.mongooseCollection.name);

    return exec.apply(this, arguments); //here this has control on Query that gets produced
}