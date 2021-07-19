
(function() {
    var GrandCentral = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = GrandCentral;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('grandcentral', function(Y) {
            Y.GrandCentral = GrandCentral;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.GrandCentral = GrandCentral;
    } else {
        return;
    }
    
    var operators = GrandCentral.Operators = {};
    
    operators[""] = function(testValue, value) {
        if (testValue instanceof Array) {
            return operators["in"].apply(this, arguments);
        } else if (testValue instanceof RegExp) {
            return operators["re"].apply(this, arguments);
        } else if (testValue instanceof Function) {
            return operators["ld"].apply(this, arguments);
        } else {
            return operators["eq"].apply(this, arguments);
        }
    };
    
    operators["eq"] = function(testValue, value) {
        if (arguments.length < 2) {
            return false;
        }
        if (testValue === null || testValue === undefined || value === null || value === undefined) {
            return (value === testValue);
        }
        switch (testValue.constructor) {
            case String:
            case Number:
            case Boolean:
                return testValue.constructor == value.constructor && testValue == value;
            default:
                if (testValue instanceof Array) {
                    if (!(value instanceof Array)) {
                        return false;
                    }
                    if (value.length != testValue.length) {
                        return false;
                    }
                    for (var i = 0; i < testValue.length; i++) {
                        if (!operators["eq"](testValue[i], value[i])) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    if (!(value instanceof Object)) {
                        return false;
                    }
                    /* assuming that something is neither String, Number, Boolean, nor Array is Object */
                    for (var key in testValue) {
                        var index = key.lastIndexOf("$");
                        var valueKey;
                        var childValue;
                        var childTestValue = testValue[key];
                        var operator;
                        if (index < 0) {