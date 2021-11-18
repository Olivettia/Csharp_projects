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

Result of the asynchronous operation. It should be undefinied before yield is called. It should be the same value as the argument of 