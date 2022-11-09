function testGrandCentral() {
	module("grand central core");
	
	var argument = {};
	
	test("grand central existence", function() {
		expect(4);
		
		ok(GrandCentral, "GrandCentral exists");
		ok(GrandCentral.listen, "GrandCentral.listen exists");
		ok(GrandCentral.call, "GrandCentral.call exists");
		ok(GrandCentral.extend, "GrandCentral.extend exists");
	});
	
	test("listen only", function() {
		expect(0);
		
		GrandCentral.listen({ command: "listen-only" }, function(e) {
			ok(false, "nobody calls this");
		});
	});
	
	test("call only", function() {
		expect(0);
		
		GrandCentral.call({ command: "call-only", value: argument });
	});
	
	test("single call single listen function", function() {
		expect(2);
		
		GrandCentral.listen(function(e) {
		    return e.command == "single-call-single-listen-function";
		}, function(e) {
			ok(true, "listener called");
			same(e, { command: "single-call-single-listen-function", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "single-call-single-listen-function", value: argument });
	});
	
	test("multiple call single listen function", function() {
		expect(4);
		
		GrandCentral.listen(function(e) {
		    return e.command == "multiple-call-single-listen-function";
		}, function(e) {
			ok(true, "listener called");
			same(e, { command: "multiple-call-single-listen-function", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "multiple-call-single-listen-function", value: argument });
		GrandCentral.call({ command: "multiple-call-single-listen-function", value: argument });
	});
	
	test("single call multiple listen function", function() {
		expect(4);
		
		GrandCentral
			.listen(functio