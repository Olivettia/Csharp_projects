# Overload 说明文档

Overload 是一个用于在 JavaScript 环境中快速创建函数重载的组件，让使用者能够通过简单的语言描述不同的重载入口，免除各个函数自行处理函数重载的麻烦。 Overload 的细设计目标及实现机制请参考 Weblab 系列文章《让 JavaScript 轻松支持函数重载 (Part <a href="http://www.cnblogs.com/cathsfz/archive/2009/07/02/1515188.html">1</a>, <a href="http://www.cnblogs.com/cathsfz/archive/2009/07/02/1515566.html">2</a>)》，本文仅用作面向开发者用户的说明文档。

## Overload

用于创建重载入口函数的静态类。

	var sum = Overload
		.add("Number, Number",
			function(x, y) { return x + y; })
		.add("Number, Number, Number",
			function(x, y, z) { return x + y + z; });
	
	alert(sum(1, 2));
	alert(sum(3, 4, 5));

### Overload.add()

* type: static and instance
* input:
	* types : String or Array
	* handler : Function
* output: overloaded : Function

创建重载入口函数，并添加函数重载，或在已有入口函数上添加重载。

	var concatenate = Overload
		.add("String, String"),
			function(s1, s2) { return s1 + s2; })
		.add("String, String, String"),
			function(s1, s2, s3) { return s1 + s2 + s3; });
	
	concatenate
		.add("Array",
			function(array) { return array.join(""); })
		.add("Array, String",
			function(array, separator) { return array.join(separator); });
	
	alert(concatenate("hello", " ", "world"));
	alert(concatenate([1, 2, 3], " + "));

#### Any Argument

如果重载包括可以匹配任意类型的形参，这个类型使用 "*" 代替。

	var add = Overload
		.add("*, *",
			function(x, y) { return x + y; })
		.add("*, *, *",
			function(x, y, z) { return x + y + z; });
	
	alert(add(1, 2, 3));
	alert(add("hello", " ", "world"));

#### More Argument

如果重载的形参个数可以是 n 个到无数个，将第 n 个参数使用 "..." 表示。

	var sum = Overload
	    .add("Number",
	        function(x) { return x; })
		.add("Number, Number",
			function(x, y) { return x + y; })
		.add("Number, Number, Number",
			function(x, y, z) { return x + y + z; })
		.add("Number, Number, Number, ...",
			function(x, y, z, more) {
				return x + y + z + sum.apply(this, more);
			});
	
	alert(sum(1, 2));
	alert(sum(1, 2, 3))