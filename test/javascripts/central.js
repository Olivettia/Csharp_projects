function testCentral() {
	module("central core");
	
	var argument = {};
	
	test("central existence", function() {
		expect(4);
		
		ok(Central, "Central exists");
		ok(Central.listen, "Central.listen exists");
		ok(Central.call, "Central.call exists");
		ok(Central.extend, "Central.extend exists");
	});
	
	test("listen only", function() {
		expect(0);
		
		Central.listen("listen-only", function(e) {
			ok(false, "nobody calls this");
		});
	});
	
	test("call only", function() {
		expect(0);
		
		Central.call("call-only", argument);
	});
	
	test("single call single listen", function() {
		expect(2);
		
		Central.listen("single-call-single-listen", function(e) {
			ok(true, "listener called");
			equals(e, argument, "argument");
		});
		
		Central.call("single-call-single-listen", argument);
	});
	
	test("multiple call single listen", function() {
		expect(4);
		
		Central.listen("multiple-call-single-listen", function(e) {
			ok(true, "listener called");
			equals(e, argument, "argument");
		});
		
		Central.call("multiple-call-single-listen", argument);
		Central.call("multiple-call-single-listen", argument);
	});
	
	