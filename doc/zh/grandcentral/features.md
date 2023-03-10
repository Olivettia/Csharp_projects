
# GrandCentral 说明文档

GrandCentral 是一个用于在 JavaScript 环境中快速创建 JSON 派发者的组件，关注 JSON 的组件可以通过模式匹配捕获符合特定条件的 JSON 。

## GrandCentral

用于匹配 JSON 和派发 JSON 的静态类。

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

使用函数过滤 JSON 或使用模式匹配 JSON ，并使用处理函数处理符合条件的 JSON 。

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

如果不使用任何的 Operator ，则视为 Default Operator 。如果值是 Array ，按照 in Operator 处理；如果值是 RegExp ，按照 re Operator 处理；如果值是 Function ，按照 f Operator 处理；否则，按照 eq Operator 处理。

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

eq Operator 用于比较两个值是否相等。对于 String 、 Number 、 Boolean ，比较值是否全等；对于 Array ，对 Array 中的每一个元素使用 eq Operator 进行比较；对于 Object ，对 Object 中的每一个元素使用 Default Operator 进行比较。对于 null 和 undefined ，比较值是否全等。

	GrandCentral.listen({
		value1$eq: "hello world",
		value2$eq: 42,
		value3$eq: true,
		value4$eq: ["hello", "world"],
		value5$eq: {
			value5_1: 42,
			value5_2: ["hello", "world"]
		}
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: "hello world",
		value2: 42,
		value3: true,
		value4: ["hello", "world"],
		value5: {
			value5_1: 42,
			value5_2: "world",
			value5_3: "other"
		},
		value6: "other"
	});

#### ne Operator

ne Operator 用于比较两个值是否不等。其比较结果相当于对 eq Operator 比较结果取反。

	GrandCentral.listen({
		value1$ne: "hello world",
		value2$ne: 42
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: "",
		value2: 24,
		value3: "other"
	});

#### lt Operator

lt Operator 用于比较数值是否小于某个给定值。

	GrandCentral.listen({
		value1$lt: 0
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: -1,
		value2: "other"
	});

#### lte Operator

lte Operator 用于比较数值是否小于或等于某个给定值。

	GrandCentral.listen({
		value1$lte: 0,
		value2$lte: 0
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: -1,
		value2: 0,
		value3: "other"
	});

#### gt Operator

gt Operator 用于比较数值是否小于某个给定值。

	GrandCentral.listen({
		value1$gt: 0
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: 1,
		value2: "other"
	});

#### gte Operator

gte Operator 用于比较数值是否小于或等于某个给定值。

	GrandCentral.listen({
		value1$gte: 0,
		value2$gte: 0
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: 1,
		value2: 0,
		value3: "other"
	});

#### in Operator

in Operator 用于检测值是否等于 Array 中的任一值。其中等于指的是 eq Operator 。

	GrandCentral.listen({
		value1$in: ["hello", "world"],
		value2$in: [{
			value2_1: 0
		}, {
			value2_1: 1
		}]
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: "world",
		value2: {
			value2_1: 0,
			value2_1: "other"
		},
		value3: "other"
	});

#### nin Operator

nin Operator 用于检测是否不等于 Array 中的任一值。相对于对 in Operator 结果取反。

	GrandCentral.listen({
		value1$nin: ["hello", "world"],
		value2$nin: [{
			value2_1: 0
		}, {
			value2_1: 1
		}]
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: "",
		value2: {
			value2_1: -1,
			value2_1: "other"
		},
		value3: "other"
	});

#### all Operator

all Operator 用于检查 Array 中的值是否都属于某个给定的 Array 。其中属于指的是 in Operator 。

	GrandCentral.listen({
		value1$all: ["hello", "world"]
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: ["hello", "and", "world"],
		value2: "other"
	});

#### ex Operator

ex Operator 用于检测某个值是否存在，或者是某个值是否不存在。

	GrandCentral.listen({
		value1$ex: true,
		value2$ex: false
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: "hello world",
		value3: "other"
	});

#### re Operator

re Operator 用于检测 String 是否匹配给定的 RegExp 。

	GrandCentral.listen({
		value1$re: /^A.*/
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: "A13579",
		value2: "other"
	});

#### f Operator

f Operator 用于检测值是否能够通过给定的函数表达式。

	GrandCentral.listen({
		value1$f: function(json) { return json.x > json.y; },
		value2$f: function(json) { return !json; }
	}, function(json) {
		/* will capture call below */
	});
	
	GrandCentral.call({
		value1: {
			x: 1,
			y: 0
		},
		value2: false,
		value3: "other"
	});

### GrandCentral.call()

* type: static
* input:
	* json : Object
* output: Central

派发 JSON 。

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

## GrandCentral.extend()

* type: static
* input: target : Object
* output: target : Object

扩展指定对象，使其拥有 Central 功能。

### GrandCentral.extend().listen()

* type: instance
* input:
	* filter : Function || Object
	* handler : Function
* output: this

使用函数过滤 JSON 或使用模式匹配 JSON ，并使用处理函数处理符合条件的 JSON 。

	var controller = new Controller();
	
	GrandCentral.extend(controller);
	
	controller.listen(function(json) {
		return (json.status == 200 && json.command == "friendstatus")
	}, function(json) {
		/* update friend status */
	});

### GrandCentral.extend().call()

* type: instance
* input:
	* json : Object
* output: this

派发指定名称的 JSON 。

	var controller = new Controller();
	
	Central.extend(controller);
	
	controller.call({
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