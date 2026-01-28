const mongoose = require('mongoose');
const User = mongoose.Model('User');

module.exports = () => {
    return new User({}).save();
}