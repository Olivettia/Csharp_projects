# Overload 快速入门

使用 Overload.add ，我们可以创建一个支持重载的函数，并添加第一个重载。

	var sum = Overload
		.add("Number, Number",
			function(x, y) { return x + y; })

再次使用 add ，可以添加下一个重载。

	sum
		.add("Number, Number, Number",
			funct