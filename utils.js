'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateFormValues = exports.changeRoute = exports.formatURL = exports.stringToTitleCase = exports.isStandalone = exports.validateCCNumber = exports.validateCCExpiry = exports.validateFullName = exports.buildQueryString = exports.createTypedAction = exports.typecheck = exports.requestIdleCallback = exports.splitFullName = exports.getCookieValue = exports.makeQueryString = exports.getURL = exports.getPath = exports.stripEvent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

var _reduxActions = require('redux-actions');

var _isReactRoute = require('progressive-web-sdk/dist/routing/is-react-route');

var _routing = require('progressive-web-sdk/dist/routing');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Wraps an action creator function so that the React synthetic action
 * is not passed in. This is necessary to avoid spurious warnings from
 * the React code.
 * @param {function} fn - an action creator function
 * @returns {function} - the wrapped action creator
 */
var stripEvent = exports.stripEvent = function stripEvent(fn) {
    return (
        /* istanbul ignore next */
        function () {
            return fn();
        }
    );
};

/**
 * Returns a path given a `location` object.
 * @param {object} location - a location object from React Router
 * @returns {string} - the `path` and `search` concatenated together
 */
var getPath = exports.getPath = function getPath(_ref) {
    var pathname = _ref.pathname,
        search = _ref.search;
    return pathname + search;
};

/**
 * Returns a full URL given a `location` object.
 * @param {object} location - a location object from React Router
 * @returns {string} - the full URL for the given location
 */
var getURL = exports.getURL = function getURL(location) {
    return window.location.origin + getPath(location);
};

/**
 * Returns query string given an object of parameters
 * @param {object} params - contains list of keys and values
 * @returns {string} - url query string
 */
var makeQueryString = exports.makeQueryString = function makeQueryString(params) {
    if (typeof params === 'undefined' || (typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
        return '';
    }

    var query = '?';
    var index = 0;

    for (var key in params) {
        if (params[key]) {
            index++;
            var param = key;
            var value = params[key];
            if (index === 1) {
                query += param + '=' + value;
            } else {
                query += '&' + param + '=' + value;
            }
        }
    }
    if (query.length <= 1) {
        return '';
    }
    return query;
};

// Regex courtesy of https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
var getCookieValue = exports.getCookieValue = function getCookieValue(cookieName) {
    var result = document.cookie.replace(new RegExp('(?:(?:^|.*;\\s*)' + cookieName + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1');
    return result;
};

var splitFullName = exports.splitFullName = function splitFullName(fullname) {
    if (!fullname) {
        return {};
    }
    var names = fullname.trim().split(' ');

    // filter out any empty strings
    names = names.filter(function (name) {
        return name;
    });

    return {
        firstname: names.slice(0, 1).join(' '),
        lastname: names.slice(1).join(' ')
    };
};

/**
 * Currently requestIdleCallback is only supported in Chrome,
 * TODO: We'll have to provide a fallback for iOS Safari
 * https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 * http://caniuse.com/#feat=requestidlecallback
 */
var requestIdleCallback = exports.requestIdleCallback = function requestIdleCallback(fn) {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(fn);
    } else {
        return setTimeout(function () {
            return fn();
        }, 1);
    }
};

var typecheck = exports.typecheck = function typecheck(type, value) {
    try {
        type.check(value);
    } catch (e) {
        console.error('Type check failed: ', e, '\n\nValue: ', value);
    }
    return value;
};

/**
 * Create an action creator that typechecks its argument.
 *
 * The action creator argument is passed unchanged as the payload if
 * no key is passed, while if a key is provided the action creator
 * argument is wrapped in an object under that key. This allows the
 * action to set a specific key within the Redux store using mergePayload.
 *
 * @param description {string} The description of the action (seen in dev tools)
 * @param type {Runtype} The type to check the action argument against
 * @param key {string} (optional) The key in the store to set with the payload
 * @returns {function} The action creator.
 */
var createTypedAction = exports.createTypedAction = function createTypedAction(description, type, key) {
    return (0, _reduxActions.createAction)(description, key ? function (payload) {
        return _defineProperty({}, key, typecheck(type, payload));
    } : function (payload) {
        return typecheck(type, payload);
    });
};

var buildQueryString = exports.buildQueryString = function buildQueryString(query) {
    return '?q=' + query.replace(/ /g, '+');
};

var validateFullName = exports.validateFullName = function validateFullName(fullName) {
    return (/\w+\s+\w+/.test(fullName)
    );
};

/**
 * Checks to see if a credit card has expired given the expiry date.
 *
 * @param ccExpiry {string} expects a numeric string with the format "mmyy"
 */
var validateCCExpiry = exports.validateCCExpiry = function validateCCExpiry(ccExpiry) {
    // Expects 'mmyy' format
    if (ccExpiry.length !== 4) {
        return false;
    }
    var today = new Date();
    var thisMonth = today.getMonth() + 1; // month indexing begins at 0
    var thisYear = today.getFullYear() % 100;
    var expMonth = parseInt(ccExpiry.substring(0, 2));
    var expYear = parseInt(ccExpiry.substring(2));

    if (thisYear > expYear) {
        return false;
    } else if (thisYear === expYear && expMonth < thisMonth) {
        return false;
    } else {
        return true;
    }
};

// Luhn Checksum Algorithm - CC validation
// https://en.wikipedia.org/wiki/Luhn_algorithm
var validateCCNumber = exports.validateCCNumber = function validateCCNumber(ccNumber) {
    // Only allow for numbers spaces as input
    if (/[^0-9-\s]+/.test(ccNumber)) {
        return false;
    }
    // Sanitize the input
    ccNumber = ccNumber.replace(/\D/g, '');

    var checkSum = 0;
    var isCheckDigit = false;
    for (var i = ccNumber.length - 1; i >= 0; i--) {
        var currentDigit = parseInt(ccNumber.charAt(i), 10);

        if (isCheckDigit) {
            currentDigit = (currentDigit *= 2) > 9 ? currentDigit -= 9 : currentDigit;
        }
        checkSum += currentDigit;
        isCheckDigit = !isCheckDigit;
    }

    return checkSum !== 0 && checkSum % 10 === 0;
};

var isStandalone = exports.isStandalone = function isStandalone() {
    return (/homescreen=1/.test(window.location.href) || window.matchMedia('(display-mode: standalone)').matches
    );
};

// Converts a string into title case
// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
var stringToTitleCase = exports.stringToTitleCase = function stringToTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

// TODO:: Test formatURL when changing the path manually.
var formatURL = exports.formatURL = function formatURL(href) {
    var newHref = href;
    if (href) {
        newHref = href.replace('../', '');
        if (newHref[0] !== '/' && !/javascript:/i.test(newHref) && !/^https?:\/\//i.test(newHref) && !/^http?:\/\//i.test(newHref)) {
            newHref = '/' + newHref;
        }
    }
    return newHref;
};

var changeRoute = exports.changeRoute = function changeRoute(path) {
    if (path) {
        if ((0, _isReactRoute.isReactRoute)(path)) {
            _routing.browserHistory.push(formatURL(path));
        } else {
            window.location.href = path;
        }
    }
};

var generateFormValues = exports.generateFormValues = function generateFormValues(inputs) {
    var result = {};
    inputs.forEach(function (_ref3) {
        var name = _ref3.name,
            value = _ref3.value;

        result[name] = value;
    });
    return result;
};