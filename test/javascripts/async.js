
function testAsync() {
	module("async");

	test("async existence", function() {
		expect(14);

		ok(Async, "Async exists");
		ok(Async.Operation, "Async.Operation exists");

		var operation = new Async.Operation();
		ok(operation.yield, "operation.yield exists");
		ok(operation.go, "operation.go exists");
		ok(operation.addCallback, "operation.addCallback exists");
		ok(operation.next, "operation.next exists");
		ok(operation.onerror, "operation.onerror exists");

		ok(Async.chain, "Async.chain exists");
		ok(Async.go, "Async.go exists");
		ok(Async.wait, "Async.wait exists");
		ok(Async.instant, "Async.instant exists");
		ok(Async.onerror, "Async.onerror exists");

		ok(Function.prototype.asyncCall, "Function.prototype.asyncCall exists");
		ok(Function.prototype.asyncApply, "Function.prototype.asyncApple exists");
	});

    module("async operation");

	test("async operation callback", function() {
		expect(9);

		var testValue = "-- this is the callback result --";
		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;
		var asyncFunction = function(value) {
			var operation = new Async.Operation();
			setTimeout(function() { operation.yield(value); }, asyncFunctionDelay);
			return operation;
		};

		stop();

		var operation = asyncFunction(testValue)
			.addCallback(function(result) {
				ok(true, "first callback called");
				equals(result, testValue, "first callback result");
			})
			.addCallback(function(result) {
				ok(true, "second callback called");
				equals(result, testValue, "second callback result");
			});

		setTimeout(function() {
			operation.addCallback(function(result) {
				ok(true, "late callback called");
				equals(result, testValue, "late callback result");
			});
		}, asyncFunctionDelay * 2)

		setTimeout(function() {
    		equals(operation.result, testValue, "operation.result after yield");
    		equals(operation.state, "completed", "operation.state after yield");
    		equals(operation.completed, true, "operation.completed after yield");
			start();
		}, asyncFunctionDelay * 3)
	});

	test("async operation callback without yield value", function() {
		expect(5);

		var testValue = "-- this is the callback result --";
		var asyncFunctionDelay = 200;
		var syncFunctionDelay = 100;
		var asyncFunction = function(value) {
			var operation = new Async.Operation();
			setTimeout(function() { operation.yield(); }, asyncFunctionDelay);