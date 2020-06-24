//Internal Imports
const fs = require('fs');

//External Imports
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Blob = require('node-blob');

//Custom Imports
const config = require('../configuration');
const db = require('../sqldb');

//autoJagat
const s3 = new AWS.S3({
    accessKeyId: config.get('AWS.accessKeyId'),
    secretAccessKey: config.get('AWS.secretAccessKey'),
    region: config.get('AWS.region'),
});

const upload = multer();

// const upload = multer({
//     storage: multerS3({
//         s3,
//         bucket: 'invoice',
//         acl: 'public-read',
//         metadata(req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key(req, file, cb) {
//             const type = file.originalname.split('.');
//             const fullPath = `users/${Date.now().toString()}.${type[type.length - 1]}`;
//             cb(null, fullPath);
//         },
//     }),
// });

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, config.get('multer.uploadDirectoryPath'))
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
})


//upload image file
let imageUpload = async (file, profile, user_id) => {
    try {
        let type = file.originalname.split('.');

        const params = {
            Bucket: 'invoices',
            Key: `users/${Date.now().toString()}.${type[type.length - 1]}`,
            Body: file.buffer
        };

        s3.upload(params, async (err, data) => {
            if (err) throw err;
            if (profile === 'user_profile') {
                await db.query(`update user_profile SET profile_image_url = ? WHERE id = ?`,
                    [data.Location.toString(), user_id])
            }
        })
    } catch (error) {
        throw error;
    }
};


module.exports = {upload, imageUpload};
