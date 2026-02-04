const AWS = require('aws-sdk');
const Keys = require('../config/keys');
const uuid = require('uuid/V1');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: Keys.accessKeyId,
    secretAccessKey: Keys.secretAccessKey,
    region: 'us-east-2',
    signatureVersion: 'v4'
})

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {

        const key = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl('putObject', {
            Bucket: 'my-blog-uday',
            // ContentType: 'image/jpeg',
            Key: key
        },
            (err, url) => res.send({ key, url })
        );
    });
};