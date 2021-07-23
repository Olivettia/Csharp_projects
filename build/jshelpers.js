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
            