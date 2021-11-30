# GrandCentral Features

GrandCentral is a component for quick and easy JSON dispatcher in JavaScript. Any module observing these JSON packets can retrieve only those it needs by identifying there pattern.

## GrandCentral

A static class use to match and dispatch JSON.

	GrandCentral.listen({
		status: 200,
		command: "friendstatus"
	}, function(json) {
		/* update friend status */
	});
	
	GrandCentral.call({
		status: 200,
		command: "friendstatus",
		content: [
			{
				username: "user0",
				status: "online"
			},
			{
				username: "user42",
				status: "away"
			}
		]
	});

### GrandCentral.listen()

* type: static
* input:
	* filter : Function || Object
	* handler : Function
* output: Central

Use a test function or a JSON pattern to match JSON packets. The handler will only receive JSON packets passed the test function or matched with the JSON pattern.

	GrandCentral.listen(function(json) {
		return (json.status == 200 && json.command == "friendstatus")
	}, function(json) {
		/* update friend status */
	});
	
	GrandCentral.listen({
		status: 200,
		command: "friendstatus"
	}, function(json) {
		/* update friend status */
	});

#### Default Operator

If no Operator is used, it will be considered as Default Operator in use. If the condition is an Array, Default Operator acts as in Operator; If the condition is a RegExp, Default Operator acts as re Operator; If the condition is a Function, Default Operator acts as f Operator. Otherwise, Default Operator acts as eq Operator.

	GrandCentral.listen({
		value1: 42,
		value2: ["hello", "world"]
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: 42,
		value2: "world",
		value3: "other"
	});

#### eq Operator

eq Operator is used to compare if two values are equal. For String, Number, and Boolean, the value is compared directly; For Array, every item in the Array is compared with eq Operator; For Obejct, every item in the Object is compared with Default Operator. For null and undefined, the value is compared directly.

	GrandCentral.listen({
		value1$eq: "hello world",
		value2$eq: 42,
		value3$eq: true,
		value4$eq: ["hello", "world"],
		value5$eq: {
			value5_1: 42,
			value5_2: ["hello", "