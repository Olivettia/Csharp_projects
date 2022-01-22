/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
//
// Begin anonymous function. This is used to contain local scope variables without polutting global scope.
//
var SyntaxHighlighter = function() { 

// CommonJS
if (typeof(require) != 'undefined' && typeof(XRegExp) == 'undefined')
{
	XRegExp = require('XRegExp').XRegExp;
}

// Shortcut object which will be assigned to the SyntaxHighlighter variable.
// This is a shorthand for local reference in order to avoid long namespace 
// references to SyntaxHighlighter.whatever...
var sh = {
	defaults : {
		/** Additional CSS class names to be added to highlighter elements. */
		'class-name' : '',
		
		/** First line number. */
		'first-line' : 1,
		
		/**
		 * Pads line numbers. Possible values are:
		 *
		 *   false - don't pad line numbers.
		 *   true  - automaticaly pad numbers with minimum required number of leading zeroes.
		 *   [int] - length up to which pad line numbers.
		 */
		'pad-line-numbers' : false,
		
		/** Lines to highlight. */
		'highlight' : null,
		
		/** Title to be displayed above the code block. */
		'title' : null,
		
		/** Enables or disables smart tabs. */
		'smart-tabs' : true,
		
		/** Gets or sets tab size. */
		'tab-size' : 4,
		
		/** Enables or disables gutter. */
		'gutter' : true,
		
		/** Enables or disables toolbar. */
		'toolbar' : true,
		
		/** Enables quick code copy and paste from double click. */
		'quick-code' : true,
		
		/** Forces code view to be collapsed. */
		'collapse' : false,
		
		/** Enables or disables automatic links. */
		'auto-links' : true,
		
		/** Gets or sets light mode. Equavalent to turning off gutter and toolbar. */
		'light' : false,
		
		'html-script' : false
	},
	
	config : {
		space : '&nbsp;',
		
		/** Enables use of <SCRIPT type="syntaxhighlighter" /> tags. */
		useScriptTags : true,
		
		/** Blogger mode flag. */
		bloggerMode : false,
		
		stripBrs : false,
		
		/** Name of the tag that SyntaxHighlighter will automatically look for. */
		tagName : 'pre',
		
		strings : {
			expandSource : 'expand source',
			help : '?',
			alert: 'SyntaxHighlighter\n\n',
			noBrush : 'Can\'t find brush for: ',
			brushNotHtmlScript : 'Brush wasn\'t configured for html-script option: ',
			
			// this is populated by the build script
			aboutDialog : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>About SyntaxHighlighter</title></head><body style="font-family:Geneva,Arial,Helvetica,sans-serif;background-color:#fff;color:#000;font-size:1em;text-align:center;"><div style="text-align:center;margin-top:1.5em;"><div style="font-size:xx-large;">SyntaxHighlighter</div><div style="font-size:.75em;margin-bottom:3em;"><div>version 3.0.83 (July 02 2010)</div><div><a href="http://alexgorbatchev.com/SyntaxHighlighter" target="_blank" style="color:#005896">http://alexgorbatchev.com/SyntaxHighlighter</a></div><div>JavaScript code syntax highlighter.</div><div>Copyright 2004-2010 Alex Gorbatchev.</div></div><div>If you like this script, please <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2930402" style="color:#005896">donate</a> to <br/>keep development active!</div></div></body></html>'
		}
	},
	
	/** Internal 'global' variables. */
	vars : {
		discoveredBrushes : null,
		highlighters : {}
	},
	
	/** This object is populated by user included external brush files. */
	brushes : {},

	/** Common regular expressions. */
	regexLib : {
		multiLineCComments			: /\/\*[\s\S]*?\*\//gm,
		singleLineCComments			: /\/\/.*$/gm,
		singleLinePerlComments		: /#.*$/gm,
		doubleQuotedString			: /"([^\\"\n]|\\.)*"/g,
		singleQuotedString			: /'([^\\'\n]|\\.)*'/g,
		multiLineDoubleQuotedString	: new XRegExp('"([^\\\\"]|\\\\.)*"', 'gs'),
		multiLineSingleQuotedString	: new XRegExp("'([^\\\\']|\\\\.)*'", 'gs'),
		xmlComments					: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
		url							: /\w+:\/\/[\w-.\/?%&=:@;]*/g,
		
		/** <?= ?> tags. */
		phpScriptTags 				: { left: /(&lt;|<)\?=?/g, right: /\?(&gt;|>)/g },
		
		/** <%= %> tags. */
		aspScriptTags				: { left: /(&lt;|<)%=?/g, right: /%(&gt;|>)/g },
		
		/** <script></script> tags. */
		scriptScriptTags			: { left: /(&lt;|<)\s*script.*?(&gt;|>)/gi, right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi }
	},

	toolbar: {
		/**
		 * Generates HTML markup for the toolbar.
		 * @param {Highlighter} highlighter Highlighter instance.
		 * @return {String} Returns HTML markup.
		 */
		getHtml: function(highlighter)
		{
			var html = '<div class="toolbar">',
				items = sh.toolbar.items,
				list = items.list
				;
			
			function defaultGetHtml(highlighter, name)
			{
				return sh.toolbar.getButtonHtml(highlighter, name, sh.config.strings[name]);
			};
			
			for (var i = 0; i < list.length; i++)
				html += (items[list[i]].getHtml || defaultGetHtml)(highlighter, list[i]);
			
			html += '</div>';
			
			return html;
		},
		
		/**
		 * Generates HTML markup for a regular button in the toolbar.
		 * @param {Highlighter} highlighter Highlighter instance.
		 * @param {String} commandName		Command name that would be executed.
		 * @param {String} label			Label text to display.
		 * @return {String}					Returns HTML markup.
		 */
		getButtonHtml: function(highlighter, commandName, label)
		{
			return '<span><a href="#" class="toolbar_item'
				+ ' command_' + commandName
				+ ' ' + commandName
				+ '">' + label + '</a></span>'
				;
		},
		
		/**
		 * Event handler for a toolbar anchor.
		 */
		handler: function(e)
		{
			var target = e.target,
				className = target.className || ''
				;

			function getValue(name)
			{
				var r = new RegExp(name + '_(\\w+)'),
					match = r.exec(className)
					;

				return match ? match[1] : null;
			};
			
			var highlighter = getHighlighterById(findParentElement(target, '.syntaxhighlighter').id),
				commandName = getValue('command')
				;
			
			// execute the toolbar command
			if (highlighter && commandName)
				sh.toolbar.items[commandName].execute(highlighter);

			// disable default A click behaviour
			e.preventDefault();
		},
		
		/** Collection of toolbar items. */
		items : {
			// Ordered lis of items in the toolbar. Can't expect `for (var n in items)` to be consistent.
			list: ['expandSource', 'help'],

			expandSource: {
				getHtml: function(highlighter)
				{
					if (highlighter.getParam('collapse') != true)
						return '';
						
					var title = highlighter.getParam('title');
					return sh.toolbar.getButtonHtml(highlighter, 'expandSource', title ? title : sh.config.strings.expandSource);
				},
			
				execute: function(highlighter)
				{
					var div = getHighlighterDivById(highlighter.id);
					removeClass(div, 'collapsed');
				}
			},

			/** Command to display the about dialog window. */
			help: {
				execute: function(highlighter)
				{	
					var wnd = popup('', '_blank', 500, 250, 'scrollbars=0'),
						doc = wnd.document
						;
					
					doc.write(sh.config.strings.aboutDialog);
					doc.close();
					wnd.focus();
				}
			}
		}
	},

	/**
	 * Finds all elements on the page which should be processes by SyntaxHighlighter.
	 *
	 * @param {Object} globalParams		Optional parameters which override element's 
	 * 									parameters. Only used if element is specified.
	 * 
	 * @param {Object} element	Optional element to highlight. If none is
	 * 							provided, all elements in the current document 
	 * 							are returned which qualify.
	 *
	 * @return {Array}	Returns list of <code>{ target: DOMElement, params: Object }</code> objects.
	 */
	findElements: function(globalParams, element)
	{
		var elements = element ? [element] : toArray(document.getElementsByTagName(sh.config.tagName)), 
			conf = sh.config,
			result = []
			;

		// support for <SCRIPT TYPE="syntaxhighlighter" /> feature
		if (conf.useScriptTags)
			elements = elements.concat(getSyntaxHighlighterScriptTags());

		if (elements.length === 0) 
			return result;
	
		for (var i = 0; i < elements.length; i++) 
		{
			var item = {
				target: elements[i], 
				// local params take precedence over globals
				params: merge(globalParams, parseParams(elements[i].className))
			};

			if (item.params['brush'] == null)
				continue;
				
			result.push(item);
		}
		
		return result;
	},

	/**
	 * Shorthand to highlight all elements on the page that are marked as 
	 * SyntaxHighlighter source code.
	 * 
	 * @param {Object} globalParams		Optional parameters which override element's 
	 * 									parameters. Only used if element is specified.
	 * 
	 * @param {Object} element	Optional element to highlight. If none is
	 * 							provided, all elements in the current document 
	 * 							are highlighted.
	 */ 
	highlight: function(globalParams, element)
	{
		var elements = this.findElements(globalParams, element),
			propertyName = 'innerHTML', 
			highlighter = null,
			conf = sh.config
			;

		if (elements.length === 0) 
			return;
	
		for (var i = 0; i < elements.length; i++) 
		{
			var element = elements[i],
				target = element.target,
				params = element.params,
				brushName = params.brush,
				code
				;

			if (brushName == null)
				continue;

			// Instantiate a brush
			if (params['html-script'] == 'true' || sh.defaults['html-script'] == true) 
			{
				highlighter = new sh.HtmlScript(brushName);
				brushName = 'htmlscript';
			}
			else
			{
				var brush = findBrush(brushName);
				
				if (brush)
					highlighter = new brush();
				else
					continue;
			}
			
			code = target[propertyName];
			
			// remove CDATA from <SCRIPT/> tags if it's present
			if (conf.useScriptTags)
				code = stripCData(code);
				
			// Inject title if the attribute is present
			if ((target.title || '') != '')
				params.title = target.title;
				
			params['brush'] = brushName;
			highlighter.init(params);
			element = highlighter.getDiv(code);
			
			// carry over ID
			if ((target.id || '') != '')
				element.id = target.id;
			
			target.parentNode.replaceChild(element, target);
		}
	},

	/**
	 * Main entry point for the SyntaxHighlighter.
	 * @param {Object} params Optional params to apply to all highlighted elements.
	 */
	all: function(params)
	{
		attachEvent(
			window,
			'load',
			function() { sh.highlight(params); }
		);
	}
}; // end of sh

sh['all']			= sh.all;
sh['highlight']		= sh.highlight;

/**
 * Checks if target DOM elements has specified CSS class.
 * @param {DOMElement} target Target DOM element to check.
 * @param {String} className Name of the CSS class to check for.
 * @return {Boolean} Returns true if class name is present, false otherwise.
 */
function hasClass(target, className)
{
	return target.className.indexOf(className) != -1;
};

/**
 * Adds CSS class name to the target DOM element.
 * @param {DOMElement} target Target DOM element.
 * @param {String} className New CSS class to add.
 */
function addClass(target, className)
{
	if (!hasClass(target, className))
		target.className += ' ' + className;
};

/**
 * Removes CSS class name from the target DOM element.
 * @param {DOMElement} target Target DOM element.
 * @param {String} className CSS class to remove.
 */
function removeClass(target, className)
{
	target.className = target.className.replace(className, '');
};

/**
 * Converts the source to array object. Mostly used for function arguments and 
 * lists returned by getElementsByTagName() which aren't Array objects.
 * @param {List} source Source list.
 * @return {Array} Returns array.
 */
function toArray(source)
{
	var result = [];
	
	for (var i = 0; i < source.length; i++) 
		result.push(source[i]);
		
	return result;
};

/**
 * Splits block of text into lines.
 * @param {String} block Block of text.
 * @return {Array} Returns array of lines.
 */
function splitLines(block)
{
	return block.split('\n');
}

/**
 * Generates HTML ID for the highlighter.
 * @param {String} highlighterId Highlighter ID.
 * @return {String} Returns HTML ID.
 */
function getHighlighterId(id)
{
	var prefix = 'highlighter_';
	return id.indexOf(prefix) == 0 ? id : prefix + id;
};

/**
 * Finds Highlighter instance by ID.
 * @param {String} highlighterId Highlighter ID.
 * @return {Highlighter} Returns instance of the highlighter.
 */
function getHighlighterById(id)
{
	return sh.vars.highlighters[getHighlighterId(id)];
};

/**
 * Finds highlighter's DIV container.
 * @param {String} highlighterId Highlighter ID.
 * @return {Element} Returns highlighter's DIV element.
 */
function getHighlighterDivById(id)
{
	return document.getElementById(getHighlighterId(id));
};

/**
 * Stores highlighter so that getHighlighterById() can do its thing. Each
 * highlighter must call this method to preserve itself.
 * @param {Highilghter} highlighter Highlighter instance.
 */
function storeHighlighter(highlighter)
{
	sh.vars.highlighters[getHighlighterId(highlighter.id)] = highlighter;
};

/**
 * Looks for a child or parent node which has specified classname.
 * Equivalent to jQuery's $(container).find(".className")
 * @param {Element} target Target element.
 * @param {String} search Class name or node name to look for.
 * @param {Boolean} reverse If set to true, will go up the node tree instead of down.
 * @return {Element} Returns found child or parent element on null.
 */
function findElement(target, search, reverse /* optional */)
{
	if (target == null)
		return null;
		
	var nodes			= reverse != true ? target.childNodes : [ target.parentNode ],
		propertyToFind	= { '#' : 'id', '.' : 'className' }[search.substr(0, 1)] || 'nodeName',
		expectedValue,
		found
		;

	expectedValue = propertyToFind != 'nodeName'
		? search.substr(1)
		: search.toUpperCase()
		;
		
	// main return of the found node
	if ((target[propertyToFind] || '').indexOf(expectedValue) != -1)
		return target;
	
	for (var i = 0; nodes && i < nodes.length && found == null; i++)
		found = findElement(nodes[i], search, reverse);
	
	return found;
};

/**
 * Looks for a parent node which has specified classname.
 * This is an alias to <code>findElement(container, className, true)</code>.
 * @param {Element} target Target element.
 * @param {String} className Class name to look for.
 * @return {Element} Returns found parent element on null.
 */
function findParentElement(target, className)
{
	return findElement(target, className, true);
};

/**
 * Finds an index of element in the array.
 * @ignore
 * @param {Object} searchElement
 * @param {Number} fromIndex
 * @return {Number} Returns index of element if found; -1 otherwise.
 */
function indexOf(array, searchElement, fromIndex)
{
	fromIndex = Math.max(fromIndex || 0, 0);

	for (var i = fromIndex; i < array.length; i++)
		if(array[i] == searchElement)
			return i;
	
	return -1;
};

/**
 * Generates a unique element ID.
 */
function guid(prefix)
{
	return (prefix || '') + Math.round(Math.random() * 1000000).toString();
};

/**
 * Merges two objects. Values from obj2 override values in obj1.
 * Function is NOT recursive and works only for one dimensional objects.
 * @param {Object} obj1 First object.
 * @param {Object} obj2 Second object.
 * @return {Object} Returns combination of both objects.
 */
function merge(obj1, obj2)
{
	var result = {}, name;

	for (name in obj1) 
		result[name] = obj1[name];
	
	for (name in obj2) 
		result[name] = obj2[name];
		
	return result;
};

/**
 * Attempts to convert string to boolean.
 * @param {String} value Input string.
 * @return {Boolean} Returns true if input was "true", false if input was "false" and value otherwise.
 */
function toBoolean(value)
{
	var result = { "true" : true, "false" : false }[value];
	return result == null ? value : result;
};

/**
 * Opens up a centered popup window.
 * @param {String} url		URL to open in the window.
 * @param {String} name		Popup name.
 * @param {int} width		Popup width.
 * @param {int} height		Popup height.
 * @param {String} options	window.open() options.
 * @return {Window}			Returns window instance.
 */
function popup(url, name, width, height, options)
{
	var x = (screen.width - width) / 2,
		y = (screen.height - height) / 2
		;
		
	options +=	', left=' + x + 
				', top=' + y +
				', width=' + width +
				', height=' + height
		;
	options = options.replace(/^,/, '');

	var win = window.open(url, name, options);
	win.focus();
	return win;
};

/**
 * Adds event handler to the target object.
 * @param {Object} obj		Target object.
 * @param {String} type		Name of the event.
 * @param {Function} func	Handling function.
 */
function attachEvent(obj, type, func, scope)
{
	function handler(e)
	{
		e = e || window.event;
		
		if (!e.target)
		{
			e.target = e.srcElement;
			e.preventDefault = function()
			{
				this.returnValue = false;
			};
		}
			
		func.call(scope || window, e);
	};
	
	if (obj.attachEvent) 
	{
		obj.attachEvent('on' + type, handler);
	}
	else 
	{
		obj.addEventListener(type, handler, false);
	}
};

/**
 * Displays an alert.
 * @param {String} str String to display.
 */
function alert(str)
{
	window.alert(sh.config.strings.alert + str);
};

/**
 * Finds a brush by its alias.
 *
 * @param {String} alias		Brush alias.
 * @param {Boolean} showAlert	Suppresses the alert if false.
 * @return {Brush}				Returns bursh constructor if found, null otherwise.
 */
function findBrush(alias, showAlert)
{
	var brushes = sh.vars.discoveredBrushes,
		result = null
		;
	
	if (brushes == null) 
	{
		brushes = {};
		
		// Find all brushes
		for (var brush in sh.brushes) 
		{
			var info = sh.brushes[brush],
				aliases = info.aliases
				;
			
			if (aliases == null) 
				continue;
			
			// keep the brush name
			info.brushName = brush.toLowerCase();
			
			for (var i = 0; i < aliases.length; i++) 
				brushes[aliases[i]] = brush;
		}
		
		sh.vars.discoveredBrushes = brushes;
	}
	
	result = sh.brushes[brushes[alias]];

	if (result == null && showAlert != false)
		alert(sh.config.strings.noBrush + alias);
	
	return result;
};

/**
 * Executes a callback on each line and replaces each line with result from the callback.
 * @param {Object} str			Input string.
 * @param {Object} callback		Callback function taking one string argument and returning a string.
 */
function eachLine(str, callback)
{
	var lines = splitLines(str);
	
	for (var i = 0; i < lines.length; i++)
		lines[i] = callback(lines[i], i);
		
	return lines.join('\n');
};

/**
 * This is a special trim which only removes first and last empty lines
 * and doesn't affect valid leading space on the first line.
 * 
 * @param {String} str   Input string
 * @return {String}      Returns string without empty first and last lines.
 */
function trimFirstAndLastLines(str)
{
	return str.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, '');
};

/**
 * Parses key/value pairs into hash object.
 * 
 * Understands the following formats:
 * - name: word;
 * - name: [word, word];
 * - name: "string";
 * - name: 'string';
 * 
 * For example:
 *   name1: value; name2: [value, value]; name3: 'value'
 *   
 * @param {String} str    Input string.
 * @return {Object}       Returns deserialized object.
 */
function parseParams(str)
{
	var match, 
		result = {},
		arrayRegex = new XRegExp("^\\[(?<values>(.*?))\\]$"),
		regex = new XRegExp(
			"(?<name>[\\w-]+)" +
			"\\s*:\\s*" +
			"(?<value>" +
				"[\\w-%#]+|" +		// word
				"\\[.*?\\]|" +		// [] array
				'".*?"|' +			// "" string
				"'.*?'" +			// '' string
			")\\s*;?",
			"g"
		)
		;

	while ((match = regex.exec(str)) != null) 
	{
		var value = match.value
			.replace(/^['"]|['"]$/g, '') // strip quotes from end of strings
			;
		
		// try to parse array value
		if (value != null && arrayRegex.test(value))
		{
			var m = arrayRegex.exec(value);
			value = m.values.length > 0 ? m.values.split(/\s*,\s*/) : [];
		}
		
		result[match.name] = value;
	}
	
	return result;
};

/**
 * Wraps each line of the string into <code/> tag with given style applied to it.
 * 
 * @param {String} str   Input string.
 * @param {String} css   Style name to apply to the string.
 * @return {String}      Returns input string with each line surrounded by <span/> tag.
 */
function wrapLinesWithCode(str, css)
{
	if (str == null || str.length == 0 || str == '\n') 
		return str;

	str = str.replace(/</g, '&lt;');

	// Replace two or more sequential spaces with &nbsp; leaving last space untouched.
	str = str.replace(/ {2,}/g, function(m)
	{
		var spaces = '';
		
		for (var i = 0; i < m.length - 1; i++)
			spaces += sh.config.space;
		
		return spaces + ' ';
	});

	// Split each line and apply <span class="...">...</span> to them so that
	// leading spaces aren't included.
	if (css != null) 
		str = eachLine(str, function(line)
		{
			if (line.length == 0) 
				return '';
			
			var spaces = '';
			
			line = line.replace(/^(&nbsp;| )+/, function(s)
			{
				spaces = s;
				return '';
			});
			
			if (line.length == 0) 
				return spaces;
			
			return spaces + '<code class="' + css + '">' + line + '</code>';
		});

	return str;
};

/**
 * Pads number with zeros until it's length is the same as given length.
 * 
 * @param {Number} number	Number to pad.
 * @param {Number} length	Max string length with.
 * @return {String}			Returns a string padded with proper amount of '0'.
 */
function padNumber(number, length)
{
	var result = number.toString();
	
	while (result.length < length)
		result = '0' + result;
	
	return result;
};

/**
 * Replaces tabs with spaces.
 * 
 * @param {String} code		Source code.
 * @param {Number} tabSize	Size of the tab.
 * @return {String}			Returns code with all tabs replaces by spaces.
 */
function processTabs(code, tabSize)
{
	var tab = '';
	
	for (var i = 0; i < tabSize; i++)
		tab += ' ';

	return code.replace(/\t/g, tab);
};

/**
 * Replaces tabs with smart spaces.
 * 
 * @param {String} code    Code to fix the tabs in.
 * @param {Number} tabSize Number of spaces in a column.
 * @return {String}        Returns code with all tabs replaces with roper amount of spaces.
 */
function processSmartTabs(code, tabSize)
{
	var lines = splitLines(code),
		tab = '\t',
		spaces = ''
		;
	
	// Create a string with 1000 spaces to copy spaces from... 
	// It's assumed that there would be no indentation longer than that.
	for (var i = 0; i < 50; i++) 
		spaces += '                    '; // 20 spaces * 50
			
	// This function inserts specified amount of spaces in the string
	// where a tab is while removing that given tab.
	function insertSpaces(line, pos, count)
	{
		return line.substr(0, pos)
			+ spaces.substr(0, count)