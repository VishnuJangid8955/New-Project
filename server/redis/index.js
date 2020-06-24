//External Imports
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//Internal Imports
const config = require('../configuration');


let client = redis.createClient({
    port: config.get('redis.port'),
    host: config.get('redis.host'),

    retry_strategy: function (options) {
        if(options.error && options.error.code === 'ECONNREFUSED'){
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }

        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }

        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

client.on('error', function (err) {
    console.error(__filename, 'redisClient', '', 'Redis connection error on ' + new Date(), JSON.stringify(err));
});

client.on('ready', function (success) {
    console.info('redisClient', 'Redis is ready for use');
});

client.on('connect', function (success) {
    console.info('redisClient', '', 'redis connected successfully');
});

client.on('reconnecting', function (success) {
    console.info(__filename, 'redisClient', '', 'Redis reconnecting:' + new Date(), success);
});

client.on('end', function (end) {
    console.info(__filename, 'redisClient', '', 'Redis server connection has closed:' + new Date(), end);
});

client.on('warning', function (warning) {
    console.info(__filename, 'redisClient', '', 'Redis password was set but none is needed:' + new Date(), warning);
});

module.exports = client;