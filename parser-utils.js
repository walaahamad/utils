'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseCaroselItems = exports.parseBreadCrumb = exports.parseInput = exports.parsePageMeta = exports.parseProductID = exports.parseSelect = exports.parseOption = exports.parseImage = exports.parseButton = exports.parseTextLink = exports.TextLink = exports.getTextFrom = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTextFrom = exports.getTextFrom = function getTextFrom($element, selector) {
    return $element.find(selector).text().trim();
};

var TextLink = exports.TextLink = _immutable2.default.Record({
    href: '',
    text: '',
    title: ''
});

var parseTextLink = exports.parseTextLink = function parseTextLink($link) {
    return TextLink({
        href: $link.attr('href'),
        text: $link.text().trim(),
        title: $link.attr('title')
    });
};

var parseButton = exports.parseButton = function parseButton($button) {
    return {
        // An interim solution since I don't know what we'll need from here a priori
        children: $button.html().trim(),
        type: $button.attr('type'),
        name: $button.attr('name'),
        value: $button.attr('value'),
        disabled: !!$button.attr('disabled'),
        text: $button.text().trim()
    };
};

var parseImage = exports.parseImage = function parseImage($img) {
    return {
        title: $img.attr('title'),
        alt: $img.attr('alt'),
        src: $img.attr('data-mobile-src') ? $img.attr('data-mobile-src') : $img.attr('src') || $img.attr('x-src') || $img.attr('xx-src')
    };
};

var parseOption = exports.parseOption = function parseOption($option) {
    var value = $option.attr('value');
    return {
        key: value,
        value: value,
        selected: !!$option.attr('selected'),
        text: $option.text().trim()
    };
};

var parseSelect = exports.parseSelect = function parseSelect($, $select) {
    return {
        name: $select.attr('name'),
        options: $.makeArray($select.children()).map(function (item) {
            return parseOption($(item));
        })
    };
};

var parseProductID = exports.parseProductID = function parseProductID($product) {
    // wishlist is the only element containing the product ID
    // when the item is out of stock
    var $wishlist = $product.find('.towishlist');
    var productData = JSON.parse($wishlist.attr('data-post'));
    return productData.data.product;
};

var parsePageMeta = exports.parsePageMeta = function parsePageMeta($, $response) {
    return {
        pageMeta: {
            // eslint-disable-next-line
            title: $response.find('title').last().text(),
            description: $response.find('meta[name="description"]').attr('content'),
            keywords: $response.find('meta[name="keywords"]').attr('content')
        }
    };
};

var parseInput = exports.parseInput = function parseInput($input) {

    return {
        type: $input.attr('type') || '',
        name: $input.attr('name') || '',
        value: $input.attr('value') || '',
        placeholder: $input.attr('placeholder') || '',
        disabled: !!$input.attr('disabled'),
        checked: !!$input.attr('checked'),
        onClick: $input.attr('onclick') || ''
    };
};

var parseBreadCrumb = exports.parseBreadCrumb = function parseBreadCrumb($, $response) {
    var listItems = $response.find('.breadcrumbs li, .sli_browse_cat');
    var activeItem = parseTextLink($(listItems[listItems.length - 2]));
    console.log(activeItem);
};

var parseCaroselItems = exports.parseCaroselItems = function parseCaroselItems($, $caroselItems) {
    var items = [].map.call($caroselItems.find('.gwt-we-suggest-panel-img-link-panel'), function (items) {
        var $items = $(items);
        return _extends({}, parseTextLink($items.find('a')).toJS(), {
            image: parseImage($items.find('img'))
        });
    });
    return items;
};