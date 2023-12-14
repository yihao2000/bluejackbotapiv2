const axios = require('axios');

module.exports = function (url, headers, xml, timeout = 10000) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url,
            headers,
            data: xml,
            timeout,
        }).then((response) => {
            resolve({
                response: {
                    body: response.data,
                    statusCode: response.status,
                },
            });
        }).catch((error) => {
            if (error.response) {
                console.log(`SOAP fail: ${error}`);
                reject(error.response.data);
            } else {
                console.log(`SOAP FAIL: ${error}`);
                reject(error);
            }
        });
    });
}