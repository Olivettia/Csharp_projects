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
		
		Central.call("call-only", argu