
# List Features

List is a component for data set operations. It's like Haskell List or Python List/Generator with infinite set support.

The difference between List and Array is that List only compute and store the items you access. List won't compute or store any item you don't access and these items only exist in the computational expression. Thus you can create infinite List in a way like Python Generator and access a finite area of it.

## List

* type: constructor
* input:
	* none | initialArray : arguments (length > 1) | intialArray : Array
* output: this : List

List represents a one dimensional set. It's like Array and every instance represents a data set.

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

Look up the given index and retrieve the corresponding item.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.at(0));
    alert(list.at(4));

### List.length()

* type: instance
* input: none
* output: length : Number

Return the length of the List.

    var list = new List(1, 2, 3, 4, 5);
    alert(list.length());

### List.each()

* type: instance
* input:
    * iterator : Function
* output: this : List

Iterate through the list and pass every item to the iterator function as an argument.

    var list = new List(1, 2, 3, 4, 5);
    list.each(function(object) { alert(object); });

### List.reverse()

* type: instance
* input: none
* output: list : List

Return the reversed List.

    var list = new List(1, 2, 3, 4, 5);
    var reversedList = list.reversed();
    alert(reversedList.toArray().join(', '));

### List.map()

* type: instance
* input:
    * predicate : Function
* output: list : List

Run the map function on every item of the List and return a List containing each corresponding result.

    var list = new List(1, 2, 3, 4, 5);
    var mappedList = list.map(function(i) { return i * i; });
    alert(mappedList.toArray().join(', '));

### List.filter()

* type: instance
* input:
    * predicate : Function