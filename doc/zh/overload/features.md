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
	* 