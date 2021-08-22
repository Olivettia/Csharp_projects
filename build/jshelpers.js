(function() {
    var Async = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Async;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('async', function(Y) {
            Y.Async = Async;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.Async = Async;
    } else {
        return;
    }
    
    var globalErrorCallbacks = [];
    
    var raiseGlobalError = function(operation) {
        for (var i = 0; i < globalErrorCallbacks.length; i++) {
            try {
                globalErrorCallbacks[i](operation);
            } catch (error) {}
        }
    };

    Async.Operation = function(options) {
        options = options || {};

        var callbackQueue = [];
        var errorCallbacks = [];
        var chain = (options.chain && options.chain === true) ? true : false;
        var started = false;
        var innerChain = null;
        
        this.result = undefined;
        this.error = undefined;
        this.state = chain ? "waiting" : "running";
        this.completed = false;
        
        var raiseError = function(operation) {
            for (var i = 0; i < errorCallbacks.length; i++) {
                try {
                    errorCallbacks[i](operation);
                } catch (error) {}
            }
            raiseGlobalError(operation);
        };

        this["yield"] = function(result) {
            var self = this;
            
            if (self.error) {
                /* will not proceed if any error occured before */
                return this;
            }

            if (!chain) {
                self.result = result;
                self.state = "completed";
                self.completed = true;
            } else {
                started = true;
                self.result = result;
                self.state = "chain running";
                self.completed = false;
            }

            setTimeout(function() {
                if (!innerChain) {
                    /* there is no inner chain constructed and no error occured before */
                    /* we will call all functions in the queue until we encounter an asynchronous function */
                    while (callbackQueue.length > 0 && !self.error) {
                        var callback = callbackQueue.shift();
                        if (chain) {
                            try {
                                var callbackResult = callback.call(self, self.result);
                            } catch (error) {
                                self.error = error;
                                self.state = "error";
                                raiseError(self);
                                break;
                            }
                            if (callbackResult && callbackResult instanceof Async.Operation) {
                                /* the result tells that this is an asynchronous function */
                                /* we will construct a inner chain and move all functions in queue to the inner chain */
                                innerChain = Async.chain();
                                innerChain.onerror(function(operation) {
                                    self.error = innerChain.error;
                                    self.state = "error";
                                    raiseError(self);
                                });
                                while (callbackQueue.length > 0) {
                                    innerChain.next(callbackQueue.shift());
                                    innerChain.next(function(result) {
                                        self.result = result;
                                        return result;
                                    });
                                }
                                innerChain.next(function(result) {
                                    self.state = "completed";
                                    self.completed = true;
                                    return result;
                                });
                                callbackResult.addCallback(function(result) {
                                    self.result = result;
                                    innerChain.go(result);
                                });
                            } else {
                                self.result = callbackResult;
                            }
                        } else {
                            try {
                                callback.call(self, self.result);
                            } catch (error) {
                                self.error = error;
                                self.state = "error";
                                raiseError(self);
                                break;
                            }
                        }
                    }

                    if (!innerChain && !self.error) {
                        /* there is no inner chain constructed in this yield call */
                        /* which means there is no asynchronous function has been called in this chain */
                        /* then the chain is completed */
                        self.state = "completed";
                        self.completed = true;
                    }
                } else {
                    /* there is inner chain constructed by former yield */
                    /* we will move all functions in queue to the inner chain */
                    while (callbackQueue.length > 0) {
                        innerChain.next(callbackQueue.shift());
                    }
                    innerChain.next(function(result) {
                        self.result = result;
                        self.state = "completed";
                        self.completed = true;
                        return result;
                    });
                }
            }, 1);
            return this;
        };

        this.go = function(initialArgument) {
            return this["yield"](initialArgument);
        };

        this.addCallback = function(callback) {
            callbackQueue.push(callback);
            if (this.completed || (chain && started)) {
                this["yield"](this.result);
            }
            return this;
        };

        this.next = function(nextFunction) {
            return this.addCallback(nextFunction);
        };
        
        this.wait = function(delay) {
            var self = this;
            if (chain) {
                this.next(function() { return Async.wait(delay, self.result); });
            }
            return this;
        };
        
        this.onerror = function(callback) {
            errorCallbacks.push(callback);
            return this;
        };
    };

    Async.chain = function(firstFunction) {
        var chain = new Async.Operation({ chain: true });
        if (firstFunction) {
            chain.next(firstFunction);
        }
        return chain;
    };

    Async.go = function(initialArgument) {
        return Async.chain().go(initialArgument);
    };
    
    Async.collect = function(functions, functionArguments) {
        var operation = new Async.Operation();
        var results = [];
        var count = 0;
        
        var checkCount = function() {
            if (count == functions.length) {
                operation["yield"](results);
            }
        };
        
        for (var i = 0; i < functions.length; i++) {
            (function(i) {
                var functionResult;
                if (functionArguments && functionArguments[i]) {
                    functionResult = functions[i].apply(this, functionArguments[i]);
                } else {
                    functionResult = functions[i].apply(this, []);
                }
                if (functionResult && functionResult instanceof Async.Operation) {
                    functionResult.addCallback(function(result) {
                        results[i] = result;
                        count++;
                        checkCount();
                    });
                } else {
                    results[i] = functionResult;
                    count++;
                    checkCount();
                }
            })(i);
        }
        
        return operation;
    };

    Async.wait = function(delay, context) {
        var operation = new Async.Operation();
        setTimeout(function() {
            operation["yield"](context);
        }, delay);
        return operation;
    };
    
    Async.instant = function(context) {
        return Async.wait(0, context);
    };
    
    Async.onerror = function(callback) {
        globalErrorCallbacks.push(callback);
        return Async;
    };

    Function.prototype.asyncCall = function() {
        var thisReference = arguments[0];
        var argumentsArray = [];
        for (var i = 1; i < arguments.length; i++) {
            argumentsArray.push(arguments[i]);
        }
        return this.asyncApply(thisReference, argumentsArray);
    };

    Function.prototype.asyncApply = function(thisReference, argumentsArray) {
        var operation = new Async.Operation();
        var self = this;
        setTimeout(function() {
            operation["yield"](self.apply(thisReference, argumentsArray || []));
            /* default value for argumentsArray is empty array */
            /* IE8 throws when argumentsArray is undefined */
        }, 1);
        return operation;
    };
})();
(function() {
    var Central = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Central;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('central', function(Y) {
            Y.Central = Central;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.Central = Central;
    } else {
        return;
    }
    
    var initiateCentralService = function(target) {
        var listeners = {};

        target.listen = function(command, handler) {
            listeners[command] = listeners[command] || [];
            var i = 0;
            var handlers = listeners[command];
            while (i < handlers.length && handlers[i] != handlers.length) {
                i++;
            }
            if (i == handlers.length) {
                handlers[handlers.length] = handler;
            }
            return target;
        };

        target.call = function(command, argument) {
            if (listeners[command]) {
                var i;
                var handlers = listeners[command];
                for (i = 0; i < handlers.length; i++) {
                    try {
                        handlers[i](argument);
                    } catch (error) {}
                }
            }
            return target;
        };
    };
    
    Central.extend = function(target) {
        initiateCentralService(target);
        return target;
    };
    
    Central.extend(Central);
})();
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
                            valueKey = key;
                            operator = "";
                        } else {
                            valueKey = key.substr(0, index);
                            operator = key.substr(index + 1);
                        }
                        if (operators[operator]) {
                            if (valueKey in value) {
                                childValue = value[valueKey];
                                if (!operators[operator](childTestValue, childValue)) {
                                    return false;
                                }
                            } else {
                                if (!operators[operator](childTestValue)) {
                                    return false;
                                }
                            }
                        } else {
                            throw "operator doesn't exist: " + operator;
                        }
                    }
                    return true;
                }
        }
    };
    
    operators["ne"] = function(testValue, value) { return !operators["eq"](testValue, value); };
    operators["lt"] = function(testValue, value) { return arguments.length == 2 && value < testValue; };
    operators["lte"] = function(testValue, value) { return arguments.length == 2 && value <= testValue; };
    operators["gt"] = function(testValue, value) { return arguments.length == 2 && value > testValue; };
    operators["gte"] = function(testValue, value) { return arguments.length == 2 && value >= testValue; };
    
    operators["in"] = function(testValue, value) {
        if (arguments.length < 2) {
            return false;
        }
        for (var i = 0; i < testValue.length; i++) {
            if (operators["eq"](testValue[i], value)) {
                return true;
            }
        }
        return false;
    };
    
    operators["nin"] = function(testValue, value) { return arguments.length == 2 && !operators["in"](testValue, value); };
    
    operators["all"] = function(testValue, value) {
        if (arguments.length < 2) {
            return false;
        }
        if (!(value instanceof Array)) {
            return false;
        }
        var found;
        for (var i = 0; i < testValue.length; i++) {
            found = false;
            for (var j = 0; j < value.length; j++) {
                if (operators["eq"](testValue[i], value[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    };
    
    operators["ex"] = function(testValue, value) {
        if (testValue === true) {
            return arguments.length == 2;
        } else if (testValue === false) {
            return arguments.length == 1;
        }
        return false;
    };
    
    operators["re"] = function(testValue, value) { return arguments.length == 2 && value && value.match && value.match(testValue); };
    
    operators["f"] = function(testValue, value) { return testValue.call(value, value); };
    
    var createFilter = function(condition) {
        return function(json) {
            if (arguments.length > 0) {
                return operators[""](condition, json);
            } else {
                return operators[""](condition);
            }
        };
    };

    var initiateGrandCentralService = function(target) {
        var filterHandlerBundles = [];

        target.listen = function(filter, handler) {
            if (!(filter instanceof Function)) {
                filter = createFilter(filter);
            }
            filterHandlerBundles.push({
                filter: filter,
                handler: handler
            });
            return target;
        };

        target.call = function(json) {
            for (var i = 0; i < filterHandlerBundles.length; i++) {
                if (filterHandlerBundles[i].filter.apply(this, arguments)) {
                    filterHandlerBundles[i].handler(json);
                }
            }
            return target;
        };
    };
    
    GrandCentral.extend = function(target) {
        initiateGrandCentralService(target);
        return target;
    };
    
    GrandCentral.extend(GrandCentral);
})();
(function() {
    var AbstractEnumerator = function() {
    };
    
    AbstractEnumerator.prototype.item = function() { throw "abstract enumerator should not be instantiated"; };
    AbstractEnumerator.prototype.next = function() { throw "abstract enumerator should not be instantiated"; };
    AbstractEnumerator.prototype.reset = function() { throw "abstract enumerator should not be instantiated"; };
    
    var ArrayEnumerator = function(array) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var state = BEFORE;
        var index = 0;
        
        this.item = function() {
            if (state == RUNNING) {
                return array[index];
            } else if (state == BEFORE) {
                throw "incorrect index";
            } else if (state == AFTER) {
                throw "incorrect index";
            }
        };

        this.next = function() {
            switch (state) {
                case BEFORE:
                    if (array.length === 0) {
                        state = AFTER;
                    } else {
                        state = RUNNING;
                    }
                    break;
                case RUNNING:
                    index++;
                    if (index >= array.length) {
                        state = AFTER;
                    }
                    break;
                case AFTER:
                    break;
            }
            return (state != AFTER);
        };

        this.reset = function() {
            state = BEFORE;
            index = 0;
        };
    };
    
    ArrayEnumerator.prototype = new AbstractEnumerator();
    
    var CachedEnumerator = function(innerEnumerator) {
        var index = NaN;
        var arrayCache = [];
        
        this.item = function() {
            if (index >= 0) {
                if (!(index in arrayCache)) {
                    arrayCache[index] = innerEnumerator.item();
                }
                return arrayCache[index];
            } else {
                return innerEnumerator.item();
            }
        };
        
        this.next = function() {
            if (index >= -1) {
                index++;
            }
            return innerEnumerator.next();
        };
        
        this.reset = function() {
            index = -1;
            return innerEnumerator.reset();
        };
        
        this.cache = function() {
            /* this method is for debug only */
            return [].slice.call(arrayCache, 0);
        };
    };
    
    CachedEnumerator.prototype = new AbstractEnumerator();
    
    var BaseEnumerator = function(extensions) {
        this.item = extensions.item;
        this.next = extensions.next;
        this.reset = extensions.reset;
    };
    
    BaseEnumerator.prototype = new AbstractEnumerator();
    
    var StackedEnumerator = function(innerEnumerator, extensions) {
        this.item = innerEnumerator.item;
        this.next = innerEnumerator.next;
        this.reset = innerEnumerator.reset;
        
        if (extensions.item) {
            this.item = function() {
                return extensions.item(innerEnumerator);
            };
        }
        
        if (extensions.next) {
            this.next = function() {
                return extensions.next(innerEnumerator);
            };
        }
        
        if (extensions.reset) {
            this.reset = function() {
                return extensions.reset(innerEnumerator);
            };
        }
    };
    
    StackedEnumerator.prototype = new AbstractEnumerator();
    
    var GeneratorProxy = function(handlers) {
        this["yield"] = function(object) {
            if (handlers["yield"]) {
                handlers["yield"](object);
            }
        };
        
        this.end = function() {
            if (handlers.end) {
                handlers.end();
            }
        };
    };
    
    var List = function(source) {
        var enumerator;
        var arrayCache = [];
        var lengthCache = -1;
        
        if (!source) {
            enumerator = new ArrayEnumerator([]);
            arrayCache = [];
            lengthCache = 0;
        } else if (arguments.length > 1) {
            enumerator = new ArrayEnumerator([].slice.call(arguments, 0));
            arrayCache = [].slice.call(arguments, 0);
            lengthCache = arrayCache.length;
        } else if (source instanceof Array) {
            enumerator = new ArrayEnumerator([].slice.call(source, 0));
            arrayCache = [].slice.call(source, 0);
            lengthCache = arrayCache.length;
        } else if (source instanceof AbstractEnumerator) {
            enumerator = source;
        } else {
            throw "source should be an array";
        }
        
        this.at = function(index) {
            var cacheIndex = 0;
            
            if (index < 0) {
                throw "incorrect index";
            }
            
            if (arrayCache.length > index) {
                return arrayCache[index];
            } else if (lengthCache >= 0 && index >= lengthCache) {
                throw "incorrect index";
            }
            
            enumerator.reset();
            while (enumerator.next()) {
                arrayCache[cacheIndex] = enumerator.item();
                if (index === 0) {
                    var item = arrayCache[cacheIndex];
                    return item;
                } else {
                    index--;
                    cacheIndex++;
                }
            }
            
            lengthCache = cacheIndex;
            throw "incorrect index";
        };
        
        this.length = function() {
            if (lengthCache < 0) {
                enumerator.reset();
                lengthCache = 0;
                while (enumerator.next()) {
                    lengthCache++;
                }
            }
            return lengthCache;
        };
        
        this.each = function(iterator) {            
            enumerator.reset();
            for (var index = 0; index < arrayCache.length; index++) {
                enumerator.next();
                iterator.call(arrayCache[index], arrayCache[index]);
            }
            
            var cacheIndex = arrayCache.length;
            while (enumerator.next()) {
                arrayCache[cacheIndex] = enumerator.item();
                iterator.call(arrayCache[cacheIndex], arrayCache[cacheIndex]);
                cacheIndex++;
            }
            
            lengthCache = cacheIndex;
            return this;
        };
        
        this.toArray = function() {
            if (lengthCache < 0 || arrayCache.length < lengthCache) {
                enumerator.reset();
                for (var index = 0; index < arrayCache.length; index++) {
                    enumerator.next();
                }

                var cacheIndex = arrayCache.length;
                while (enumerator.next()) {
                    arrayCache[cacheIndex] = enumerator.item();
                    cacheIndex++;
                }

                lengthCache = cacheIndex;
            }
            
            return [].slice.call(arrayCache, 0);
        };
        
        this.enumerator = function() {
            return enumerator;
        };
        
        this.cache = function() {
            /* this method is for debug only */
            return [].slice.call(arrayCache, 0);
        };
    };
    
    List.prototype.reverse = function() {
        return new List(this.toArray().reverse());
    };
    
    List.prototype.map = function(predicate) {
        var self = this;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            item: function(innerEnumerator) {
                return predicate.call(innerEnumerator.item(), innerEnumerator.item());
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.filter = function(predicate) {
        var self = this;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var active = true;
                while ((active = active && innerEnumerator.next()) && !predicate.call(innerEnumerator.item(), innerEnumerator.item()));
                return active;
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.fold = function(predicate, start) {
        var accumulation = start;
        
        this.each(function(object) {
            accumulation = predicate.call(object, accumulation, object);
        });
        
        return accumulation;
    };
    
    List.prototype.scan = function(predicate, start) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var self = this;
        var state = BEFORE;
        var current;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            item: function(innerEnumerator) {
                switch (state) {
                    case BEFORE:
                        throw "incorrect index";
                    case RUNNING:
                        return current;
                    case AFTER:
                        throw "incorrect index";
                }
            },

            next: function(innerEnumerator) {
                var object;
                var active;

                switch (state) {
                    case BEFORE:
                        state = RUNNING;
                        current = start;
                        break;
                    case RUNNING:
                        active = innerEnumerator.next();
                        if (active) {
                            object = innerEnumerator.item();
                            current = predicate.call(object, current, object);
                        } else {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = BEFORE;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.takeWhile = function(predicate) {
        var RUNNING = 0, AFTER = 1;
        var self = this;
        var state = RUNNING;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var active = true;
                switch (state) {
                    case RUNNING:
                        active = innerEnumerator.next() && predicate.call(innerEnumerator.item(), innerEnumerator.item());
                        if (!active) {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = RUNNING;
                innerEnumerator.reset();
            }
        });
                
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.take = function(number) {
        var self = this;
        var count = 0;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            item: function(innerEnumerator) {
                if (count <= number) {
                    return innerEnumerator.item();
                } else {
                    throw "incorrect index";
                }
            },

            next: function(innerEnumerator) {
                if (count < number) {
                    count++;
                    return innerEnumerator.next();
                } else {
                    return false;
                }
            },

            reset: function(innerEnumerator) {
                count = 0;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.dropWhile = function(predicate) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var self = this;
        var state = BEFORE;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var active = true;
                switch (state) {
                    case BEFORE:
                        while ((active = innerEnumerator.next()) && predicate.call(innerEnumerator.item(), innerEnumerator.item()));
                        if (active) {
                            state = RUNNING;
                        } else {
                            state = AFTER;
                        }
                        break;
                    case RUNNING:
                        active = innerEnumerator.next();
                        if (!active) {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = BEFORE;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.drop = function(number) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var self = this;
        var state = BEFORE;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                var count = 0;
                var active = true;
                switch (state) {
                    case BEFORE:
                        while ((active = innerEnumerator.next()) && count < number) {
                            count++;
                        }
                        if (active) {
                            state = RUNNING;
                        } else {
                            state = AFTER;
                        }
                        break;
                    case RUNNING:
                        active = innerEnumerator.next();
                        if (!active) {
                            state = AFTER;
                        }
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function(innerEnumerator) {
                state = BEFORE;
                innerEnumerator.reset();
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.prototype.cycle = function() {
        var self = this;
        
        var enumerator = new StackedEnumerator(self.enumerator(), {
            next: function(innerEnumerator) {
                if (innerEnumerator.next()) {
                    return true;
                } else {
                    innerEnumerator.reset();
                    if (innerEnumerator.next()) {
                        return true;
                    } else {
                        /* empty list produces empty list after cycling */
                        return false;
                    }
                }
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.generate = function(generator) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var current;
        var state = BEFORE;
        var yieldState = RUNNING;
        var arrayCache = [];
        var index = NaN;
        
        var proxy = new GeneratorProxy({
            "yield": function(object) {
                if (yieldState != AFTER) {
                    arrayCache[arrayCache.length] = object;
                }
            },
            end: function() {
                yieldState = AFTER;
            }
        });
        
        var enumerator = new BaseEnumerator({
            item: function() {
                switch (state) {
                    case BEFORE:
                        throw "incorrect index";
                    case RUNNING:
                        return arrayCache[index];
                    case AFTER:
                        throw "incorrect index";
                }
            },

            next: function() {
                switch (state) {
                    case BEFORE:
                    case RUNNING:
                        index++;
                        if (yieldState != AFTER) {
                            while (index >= arrayCache.length && yieldState != AFTER) {
                                generator.call(proxy, proxy);
                            }
                        }
                        state = yieldState;
                        break;
                    case AFTER:
                        break;
                }
                return (state != AFTER);
            },

            reset: function() {
                index = -1;
                state = BEFORE;
            }
        });
        
        return new List(new CachedEnumerator(enumerator));
    };
    
    List.iterate = function(generator, start) {
        var BEFORE = 0, RUNNING = 1;
        var current;
        var state = BEFORE;
        
        var enumerator = new BaseEnumerator({
            item: function() {
                switch (state) {
                    case BEFORE:
                        throw "incorrect index";
                    case RUNNING:
                        return current;
                }
            },

            next: function() {
                switch (state) {
                    case BEFORE:
                        current = start;
                        state = RUNNING;
                        break;
                    case RUNNING:
                        cur