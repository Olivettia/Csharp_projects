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
	
	var