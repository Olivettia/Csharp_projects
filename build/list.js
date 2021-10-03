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
            throw "incorrec