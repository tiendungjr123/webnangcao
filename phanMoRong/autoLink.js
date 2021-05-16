const autoLink = require('auto-link');

exports.textAutolink = function textAutolink (text) {
    result = autoLink.link('<p>Welcom to www.google.com</p>', {
        target: '_blank'
    });

    return result;
}