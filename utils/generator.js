const crypto = require('crypto');
const util = require('util');

const createMessierPassword = async (username, password) => {
    try {
        const _salt = crypto.createHmac("SHA1", username).update(username).digest();
        const aesKeyLength = 32;
        const aesIVLength = 16;

        const pbkdf2Async = util.promisify(crypto.pbkdf2);
        const pbkdfResult = await pbkdf2Async(username, _salt, 10, aesKeyLength + aesIVLength, 'sha1');
        const key = pbkdfResult.subarray(0, aesKeyLength);
        const iv = pbkdfResult.subarray(aesKeyLength);

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let generatedPassword = cipher.update(password, 'utf16le', 'base64');
        generatedPassword += cipher.final('base64');

        return generatedPassword;
    } catch (error) {
        console.error(error);
        throw new Error('Password generation failed');
    }
};

module.exports = createMessierPassword