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
			.listen(function(e) {
			    return e.command == "single-call-multiple-listen-function";
			}, function(e) {
				ok(true, "first listener called");
				same(e, { command: "single-call-multiple-listen-function", value: argument }, "json");
			})
			.listen(function(e) {
			    return e.command == "single-call-multiple-listen-function";
			}, function(e) {
				ok(true, "second listener called");
				same(e, { command: "single-call-multiple-listen-function", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "single-call-multiple-listen-function", value: argument });
	});
	
	test("multiple call multiple listen function", function() {
		expect(8);
		
		GrandCentral
		    .listen(function(e) {
		        return e.command == "multiple-call-multiple-listen-function";
		    }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "multiple-call-multiple-listen-function", value: argument}, "json");
			})
		    .listen(function(e) {
		        return e.command == "multiple-call-multiple-listen-function";
		    }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "multiple-call-multiple-listen-function", value: argument}, "json");
			});
		
		GrandCentral.call({ command: "multiple-call-multiple-listen-function", value: argument});
		GrandCentral.call({ command: "multiple-call-multiple-listen-function", value: argument});
	});
	
	test("multiple command function", function() {
		expect(8);
		
		GrandCentral
	        .listen(function(e) {
	            return e.command == "command-one-function";
	        }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-function", value: argument }, "json");
			})
	        .listen(function(e) {
	            return e.command == "command-two-function";
	        }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-function", value: argument }, "json");
			});
		
		GrandCentral
            .listen(function(e) {
                return e.command == "command-one-function";
            }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-function", value: argument }, "json");
			})
	        .listen(function(e) {
	            return e.command == "command-two-function";
	        }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-function", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "command-one-function", value: argument });
		GrandCentral.call({ command: "command-two-function", value: argument });
	});
	
	test("empty listen function", function() {
		expect(0);
		
		GrandCentral
			.listen(function(e) { }, function(e) {
				ok(false, "listener called");
			})
    		GrandCentral.call({ command: "empty-listen-function", value: argument });
	});
	
	test("single call single listen object", function() {
		expect(2);
		
		GrandCentral.listen({ command: "single-call-single-listen-object" }, function(e) {
			ok(true, "listener called");
			same(e, { command: "single-call-single-listen-object", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "single-call-single-listen-object", value: argument });
	});
	
	test("multiple call single listen object", function() {
		expect(4);
		
		GrandCentral.listen({ command: "multiple-call-single-listen-object" }, function(e) {
			ok(true, "listener called");
			same(e, { command: "multiple-call-single-listen-object", value: argument }, "json");
		});
		
		GrandCentral.call({ command: "multiple-call-single-listen-object", value: argument });
		GrandCentral.call({ command: "multiple-call-single-listen-object", value: argument });
	});
	
	test("single call multiple listen object", function() {
		expect(4);
		
		GrandCentral
			.listen({ command: "single-call-multiple-listen-object" }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "single-call-multiple-listen-object", value: argument }, "json");
			})
			.listen({ command: "single-call-multiple-listen-object" }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "single-call-multiple-listen-object", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "single-call-multiple-listen-object", value: argument });
	});
	
	test("multiple call multiple listen object", function() {
		expect(8);
		
		GrandCentral
			.listen({ command: "multiple-call-multiple-listen-object" }, function(e) {
				ok(true, "first listener called");
				same(e, { command: "multiple-call-multiple-listen-object", value: argument}, "json");
			})
			.listen({ command: "multiple-call-multiple-listen-object" }, function(e) {
				ok(true, "second listener called");
				same(e, { command: "multiple-call-multiple-listen-object", value: argument}, "json");
			});
		
		GrandCentral.call({ command: "multiple-call-multiple-listen-object", value: argument});
		GrandCentral.call({ command: "multiple-call-multiple-listen-object", value: argument});
	});
	
	test("multiple command object", function() {
		expect(8);
		
		GrandCentral
			.listen({ command: "command-one-object" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-object", value: argument }, "json");
			})
			.listen({ command: "command-two-object" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-object", value: argument }, "json");
			});
		
		GrandCentral
			.listen({ command: "command-one-object" }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-object", value: argument }, "json");
			})
			.listen({ command: "command-two-object" }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-object", value: argument }, "json");
			});
		
		GrandCentral.call({ command: "command-one-object", value: argument });
		GrandCentral.call({ command: "command-two-object", value: argument });
	});
	
	test("empty listen object", function() {
		expect(2);
		
		GrandCentral
			.listen({}, function(e) {
				ok(true, "listener called");
				same(e, { command: "empty-listen-object", value: argument }, "json");
			})
    		GrandCentral.call({ command: "empty-listen-object", value: argument });
	});
	
    module("grand central extension");
    
	test("grand central extension", function() {
		expect(2);
		
		var extended = GrandCentral.extend({});
		
		ok(extended.listen, "extended.listen exists");
		ok(extended.call, "extended.call exists");
	});
	
	test("extension multiple command function", function() {
		expect(8);
		
		var extended = GrandCentral.extend({});
		
		extended
	        .listen(function(e) {
	            return e.command == "command-one-function";
	        }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "command-one-function", value: argument }, "json");
			})
	        .listen(function(e) {
	            return e.command == "command-two-function";
	        }, function(e) {
				ok(true, "command-two listener called");
				same(e, { command: "command-two-function", value: argument }, "json");
			});
		
		extended
            .listen(function(e) {
                return e.command == "command-one-function";
            }, function(e) {
				ok(true, "command-one listener called");
				same(e, { command: "comman