//External Imports
const convict = require('convict');

const config = convict({
    server:{
        session:{
            cookieSecret: {
                doc: 'For sliding window of a session',
                format: String,
                default: ""
            }
        },
        http: {
            port: {
                doc: 'HTTP port to bind',
                format: 'port',
                default: 3000,
                env: 'PORT'
            }
        },
        enableAuthentication: {
            doc: 'Enable Express api authentication',
            format: Boolean,
            default: true
        },
        JWT: {
            jwtPrivateKey: {
                doc: 'jwt private key',
                format: String,
                default: "app-secret"
            },
            jwtExpiresIn: {
                doc: 'jwt expiration time',
                format: String,
                default: "168h"
            }
        },
        enableCompression:{
            doc: 'Enable compression',
            format: Boolean,
            default: true
        },
        enableStatic:{
            doc: 'Enable Express static server',
            format: Boolean,
            default: false
        },
        static: {
            directory: {
                doc: 'Express static server content directory',
                format: String,
                default: '/uploads/'
            }
        },
        CORS:{
            allowedHosts:{
                doc: 'Allowed host for CORS',
                format: Array,
                default: ['']
            },
            allowedMethods: {
                doc: 'Allowed HTTP Methods for CORS',
                format: String,
                default: 'GET,POST,PUT,PATCH,OPTIONS'
            },
            allowedHeaders: {
                doc: 'Allowed HTTP Headers for CORS',
                format: String,
                default: 'accept, x-auth-token, content-type, certificate'
            },
            exposedHeaders: {
                doc: 'Exposed HTTP Headers for CORS',
                format: String,
                default: 'XSRF-TOKEN'
            }
        },
        security:{
            enableApiKey:{
                doc:'Enable api key authentication',
                format: Boolean,
                default: true
            },
            enableCORS: {
                doc: 'Enable CORS',
                format: Boolean,
                default: true
            },
            clientApiKey:{
                doc: 'Client api key to access node rest api.',
                format: String,
                default: "de3f162b-b9d4-4015-9363-e83e6ea7cce7"
            }
        },
        bodyParser: {
            limit: {
                doc: 'maximum request body size',
                format: String,
                default: '100mb'
            }
        }
    },
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "production",
        env: "NODE_ENV"
    },
    redis: {
        enableRedis: {
            doc: "To use redis in application",
            format: Boolean,
            default: false
        },
        host: {
            doc: "Redis host name/IP",
            format: String,
            default: ""
        },
        database: {
            doc: "Database name",
            format: String,
            default: ""
        },
        port: {
            doc: "Redis Port",
            format: Number,
            default: 6379
        },
        password: {
            doc: "Redis Database password",
            format: String,
            default: ""
        },
    },
    multer:{
    	uploadDirectoryPath:{
    	    doc: "Multer upload directory path",
            format: String,
            default: "../uploads/"
    	}
    },
    AWS: {
        accessKeyId: {
            doc: 'AWS access key id',
            format: String,
            default: ""
        },
        secretAccessKey: {
            doc: 'Service Access Key',
            format: String,
            default: ""
        },
        region: {
            doc: 'AWS region',
            format: String,
            default: ""
        }
    },
});

let env = config.get('env');

config.loadFile(`${__dirname}/${env}.json`);

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
