# Async Features

Async is a component for the unification of JavaScript asynchronous programming style. It let all asynchronous functions return instances of Async.Operation and they don't have to handle callback functions themselves.

## Async.Operation

A class represents an asynchronous operation. Every asynchronous operation should instantiate an Async.Operation object.

	/* jQuery required for this sample */
	
	var getAsync = function(url, data) {
		var operation = new Async.Operation();
		$.get(url, data, function(result) { operation.yield(result); }, "json");
		return operation;
	};
	
	var getOperation = getAsync("/ping", "")
	getOperation.addCallback(function(result) { alert("ping returns: " + result); });

### Async.Operation.result

* type: instance

Result of the asynchronous operation. It should be undefinied before yield is called. It should be the same value as the argument of yield after yield is called.

### Async.Operation.state

* type: instance

State of the asynchronous operation. It should be "running" before yield is called. It should be "completed" after yield is called.

### Async.Operation.completed

* type: instance

Indicator of whether the asynchronous operation is completed. It should be false before yield is called. It should be true after yield is called.

### Async.Operation.yield()

* type: instance
* input:
	* value (optional)
* output: this : Operation

Return value for a specific asynchronous operation.

	var waitAsync = function(delay) {
		var operation = new Async.Operation();
		setTimeout(function() {
			var result = "You have waited " + delay + " millisecond(s)."
			operation.yield(result);
		}, delay);
		return operation;
	}

### Async.Operation.addCallback()

* type: instance
* input:
	* callback : Function
* output: this : Operation

Add callback function to a specific asynchronous operation. These callback functions will be executed one by one and they will receive one argument as the result of the asynchronous operation.

	var waitOperation = wait(999);
	waitOperation.addCallback(function(result) { alert(result)