# Overload 内部实现

如果你需要使用 Overload ，请参考对应的<a href="Overload_Features.text">接口文档</a>。本文档用于解释接口文档中没有提及的内部实现，但这部分实现随时可能被修改。

## Overload

### Overload.create()

* type: static
* input: none
* output: overloaded : Function

创建重载方法入口，但不添加任何函数重载。静态的 add 方法实际上是调用了静态的 create 方法后，获得了实例再调用实例的 add 方法。

	var sum = Overload.create();
	
	sum
		.add("Number, Number",
			function(x, y) { return x + y; })
	
	sum
		.add("Number, Number, Number"