# List 说明文档

List 是一个用于进行数据集合运算的组件，它提供类似于 Haskell List 或 Python List/Generator 的功能，同时支持无穷列表。

List 与 Array 的主要区别在于， List 只计算和存储你访问的元素（及其依赖的元素）。对于你不访问的元素， List 并不进行计算或存储，这些运算仅存在于运算表达式中。因此，你可以使用类似 Python Generator 的形式创建无穷 List ，然后访问其中有穷的区间。

## List

* type: constructor
* input:
	* none | initialArray : arguments (length > 1) | intialArray : Array
* output: this : List

表示一维数据集合的类。类似于 Array ，每一个实例代表一组一维数据集合。

    var originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var originalList = new List(originalArray);
    
    var calculatedList = originalList
        .map(function(i) { return i * (i + 1) / 2; })
        .filter(function(i) { return i > 10 && i < 50; })
    
    var calculatedArray = calculatedList.toArray();
    assert(calculatedArray == [15, 21, 28, 36, 45]);

### List.at()

* type: instance
* input:
    * index : Number
* output: item

根据给定的索引，获取对应的项。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.at(0));
    alert(list.at(4));

### List.length()

* type: instance
* input: none
* output: length : Number

返回列表长度。

    var list = new List(1, 2, 3, 4, 5);
    alert(list.length());

### List.each()

* type: instance
* input:
    * iterator : Function
* output: this : List

迭代遍历列表，将每一项作为参数传递给迭代器函数。

    var list = new List(1, 2, 3, 4, 5);
    list.each(function(object) { alert(object); });

### List.reverse()

* type: instance
* input: none
* output: list : List

返回逆序列表。

    var list = new List(1, 2, 3, 4, 5);
    var reversedList = list.reversed();
    alert(reversedList.toArray().join(', '));

### List.map()

* type: instance
* input:
    * predicate : Function
* output: list : List

对列表进行投影运算，返回运算结果组成的列表。

    var list = new List(1, 2, 3, 4, 5);
    var mappedList = list.map(function(i) { return i * i; });
    alert(mappedList.toArray().join(', '));

### List.filter()

* type: instance
* input:
    * predicate : Function
* output: list : List

对列表进行筛选运算，返回运算结果组成的列表。

    var list = new List(1, 2, 3, 4, 5);
    var filteredList = list.filter(function(i) { return i > 1 && i < 5; });
    alert(filteredList.toArray().join(', '));

### List.fold()

* type: instance
* input:
    * predicate : Function
    * start
* output: result

对列表进行归并运算，返回运算结果。

    var list = new List(1, 2, 3, 4, 5);
    var sum = List.fold(function(acc, i) { return acc + i; }, 0);
    alert(sum);

### List.scan()

* type: instance
* input:
    * predicate : Function
    * start
* output: list : List

对列表进行聚合操作，返回聚合操作每一步结果组成的列表。

    var list = new List(1, 2, 3, 4, 5);
    var sums = List.scan(function(acc, i) { return acc + i; }, 0);
    alert(sums.toArray().join(', '));

### List.takeWhile()

* type: instance
* input:
    * predicate : Function
* output: list : List

从列表左侧开始获取项，直到检测函数返回 false 或到达列表末端为止，然后返回获取项组成的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var lessThanThree = List.takeWhile(function(i) { return i < 3; });
    alert(lessThanThree.toArray().join(', '));

### List.take()

* type: instance
* input:
    * number : Number
* output: list : List

从列表左侧开始获取项，直到获取到指定数量的项或到达列表末端，然后返回获取项组成的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var firstThree = List.take(3);
    alert(firstThree.toArray().join(', '));

### List.dropWhile()

* type: instance
* input:
    * predicate : Function
* output: list : List

从列表左侧开始删除项，直到检测函数返回 false 或到达列表末端为止，然后返回原列表减去删除项后的子列表。

    var list = new List(1, 2, 3, 4, 5);
    var noLessThanThree = List.dropWhile(function(i) { return i < 3; });
    alert(noLessThanThree.toArray().join(', '));

### List.drop()

* type: instance
* input:
    * number : Number
* output: list : List

从列表左侧开始删除项，直到删除了指定数量的项或到达列表末端为止，然后返回原列表减去删除项后的子列表。

  