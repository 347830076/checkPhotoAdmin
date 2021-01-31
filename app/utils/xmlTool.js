// xmlTool.js
const xml2js = require('xml2js');
const parseXML = async (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true}, function (err, obj) {
            if (err) {
                return reject(err);
            }
            resolve(obj);
        });
    });
};
const formatMessage = (result) => {
    let message = {};
    if (typeof result === 'object') {
        for (let key in result) {
            if (!(result[key] instanceof Array) || result[key].length === 0) {
                continue;
            }
            if (result[key].length === 1) {
                let val = result[key][0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message[key] = result[key].map(function (item) {
                    return formatMessage(item);
                });
            }
        }
    }
    return message;
};

module.exports = {
    parseXML,
    formatMessage
};