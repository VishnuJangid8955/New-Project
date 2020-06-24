//Custom Imports
const client = require('./index');

module.exports = {
    /**
     * Set value as key value pair
     * @param key
     * @param value
     * @param time
     */
    redisSetValue: (key, value, time) => {
        return new Promise((resolve, reject) => {
            try {
                time = parseInt(time);
                if (time > 0) {
                    client.setAsync(key, value, 'EX', time).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    })
                } else {
                    client.setAsync(key, value).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    })
                }
            } catch (e) {
                reject(e);
            }
        })
    },

    /**
     * get value by key
     * @param key
     * @returns {Promise<unknown>}
     */
    redisGetValue: (key) => {
        return new Promise((resolve, reject) => {
            try {
                client.getAsync(key).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    },
    /**
     * delete key
     * @param key
     * @returns {Promise<unknown>}
     */

    redisDeleteKey: (key) => {
        return new Promise((resolve, reject) => {
            try {
                client.delAsync(key).then((response) => {
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    },

    /**
     * Set value in object like baseKey:{key1: value, key2:value}
     * @param baseKey
     * @param key
     * @param value
     * @returns {Promise<unknown>}
     */
    redisHSetStore: (baseKey, key, value) => {
        return new Promise((resolve, reject) => {
            try {
                client.hsetAsync(baseKey, key, value)
                    .then((response) => {
                        resolve(response);
                    }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    },

    /**
     * get value from object by baseKey and key by baseKey.key = value;
     * @param baseKey
     * @param key
     * @returns {Promise<unknown>}
     */
    redisHGet: (baseKey, key) => {
        return new Promise((resolve, reject) => {
            try {
                client.hgetAsync(baseKey, key).then((response) => {
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    },

    /**
     * delete from object by baseKey and key delete(baseKey.key)
     * @param baseKey
     * @param key
     * @returns {Promise<unknown>}
     */
    redisHDelete: (baseKey, key) => {
        return new Promise((resolve, reject) => {
            try {
                client.hdelAsync(baseKey, key).then((response) => {
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    },
    /**
     * get all key in an object
     * @param baseKey
     * @returns {Promise<unknown>}
     */
    redisHGetAll: (baseKey) => {
        return new Promise((resolve, reject) => {
            try {
                client.hgetallAsync(baseKey)
                    .then((response) => {
                        resolve(response);
                    }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    },

    /**
     * set an object baseKey: {key2: value, key2: value}
     * @param baseKey
     * @param object
     * @returns {Promise<unknown>}
     */
    redisHMSet: (baseKey, object) => {
        return new Promise((resolve, reject) => {
            try {
                client.hmsetAsync(baseKey, object)
                    .then((response) => {
                        resolve(response);
                    }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    },

    redisHMGet: (baseKey, keyList) => {
        return new Promise((resolve, reject) => {
            try {
                client.hmgetAsync(baseKey, keyList)
                    .then((response) => {
                        resolve(response);
                    }).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                reject(e);
            }
        })
    }

};