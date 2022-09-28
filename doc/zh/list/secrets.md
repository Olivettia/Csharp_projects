# List 内部实现

如果你需要使用 List ，请参考对应的<a href="List_Features.text">接口文档</a>。本文档用于解释接口文档中没有提及的内部实现，但这部分实现随时可能被修改。

## List.cache()

* type: instance
* input: none
* output: Array

导出列表级别的缓存，以数组形式表示，仅用于调试时监视。修改导出缓存不影响 List 内部的实际缓存。

## List.enumerator()

* type: instance
* input: none
* output: AbstractEnumerator

获取列表的枚举器。枚举器应该是 AbstractEnumerator 的派生类。

## List.enumerator().cache()

* type: instance
* input: none
* output: Array

只有 CachedEnumerator 实例拥有该方法。导出枚举器级别的缓存，以数组形式表示，仅用于调试时监视。修改导出缓存不影响 List 内部的实际缓存。

## List.ES5Array

表示 ECMAScript 5 Array 的类，提供 ECMAScript 5 Array 的数组方法，并且基于 List 构建。

    var array = new List.ES5Array(1, 2, 3, 4, 5, 4, 3, 2, 1, 0);
    alert(array.indexOf(2));
    alert(array.indexOf(2, 5));
    alert(array.reduce(function(acc, i) { return acc * i; }));

### List.ES5Array.indexOf()

* type: instance
* input:
	* searchElement
	* fromIndex : Number (optional)
* output: index : Number

搜索特定元素首次出现的位置，并返回索引。可以从指定的索引开始从左向右搜索。

    var array = new List.ES5Array(1, 2, 3, 4, 5, 4, 3, 2, 1, 0);
    alert(array.indexOf(2));
    alert(array.indexOf(2, 5));
    

### List.ES5Array.lastIndexOf()

* type: instance
* input:
	* sear