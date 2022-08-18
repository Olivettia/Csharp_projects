# List 说明文档

List 是一个用于进行数据集合运算的组件，它提供类似于 Haskell List 或 Python List/Generator 的功能，同时支持无穷列表。

List 与 Array 的主要区别在于， List 只计算和存储你访问的元素（及其依赖的元素）。对于你不访问的元素， List 并不进行计算或存储，这些运算仅存在于运算表达式中。因此，你可以使用类似 Python Generator 的形式创建无穷 List ，然后访问其中有穷的区间。

## List

* type: constructor
* input:
	* none | initialArray : argume