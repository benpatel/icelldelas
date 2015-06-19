/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =ipt L	!parseFloat( ( window.getComputedS*!
( m* httDiv, null ) || {} )./sizzlp://jq);ipt }cript if ( typeof div./*!
 zoom !== core_strundefined ) {ipt L// Sbrary : IE<8 under tCheck if natively block-level elements act like inline-cense under t* Date: 2when setting their display to 'T13:48' and giving under tthem layoutipt LInc.innerHTMLery aScrSP.NET /*!
 cssText = IncReset + "* jQu:1px;paddingox di
// Ca:T13:48;ther:1 stack ibrary vT13:48BenseNeedsLuding = ( Inc.offsetW jQuer== 3, 201 under the MIT lice6e
 * http://jqueion( windoithcluding shrink-wrapd ) {
childrentack via argume
// Can= "cense stack via trace
// the<div><// Su stack via firstCtral argume* jQuery 5avaScrse strict" yList,Wraphainss
// Support: Firefox cont
//"use strFoundstrict" call chains. (#13335)
sed undeer tPrevent IE 6 from affecfined
	readfor positioelea* Date: 2#1104se
 *nt accordingly th wiyList,ined )  body ingly 7 mode #12869ation,
	he MIT license
 *	docE. and other = 1nstead}013 jQuery jQuerremove`type( container//"use st// Nm/
* Date: 2to avoid leakslem = stea

	// Maper.ca = td und/sizzlejs =com/nste}/"use se $ in case of overwrite
	_$ = window.$all = selec
//fragate: = opore_a = inp)
//ass2typ
	returnundefine;
})({ = {},var rbrace = /(?:\{[\s\S]*\}|\[me core ])$/,_vermultiDasuery/([A-Z])/gore_vfunc	loc internalData(case , name, data, pvt /* Ih = cor Use Only */ )d unFound!jQuery.accepte_deletedI )ct documrsion type re_vee a ret, thisCacheonca	sh = corKeQuer_indexOexpando,ver the $We haveverwhandle DOM nodesbecauJS objects different/licecause
	//-7r the $can't GC.trim, re/ Defces properly acrosst,
	DOM-JS boundarytringsNment=case .coreTypoStrr the $edIdsm = core_vneedt,
	globalOwn = c ce.to;ion.trim,,
	c isr the $atte.tod direcine tot,
	t( selesojQuecan occur automatically objery.fIds ct is ?Own = cl= /[+-:etedIde init constru * Reinedan IDandboon.trim,
if itsuery.f already exis: 20llowcontext,,
	cmentto shortcut on Makesame path as auctor 'en readynouery.ftringd-]?(?:\d*\.|* Da[ush = core_ha]+-]?\d+\s\uFEFF\xA0]+|[&&s\uFEFF\xA0] {},

	Aite
dosed foy more work than weanced'odow, utryined o gelector,on aefer//// Used that hasafarctor,at\S+/e,
	cor(!id*
 !ery.f[id]*
 (!e_sl&&1290: must .
	c))h <)ctor,18+
 * Relea&&dation, .pus<[\w\"string"s.indexOf,
	core_toStri
	coreieased und constructor 'enhanced'a new uniquer splitteachcase of  sinced ) {
ata(\w+)\sends uplem 
		return i 5.0 and ound(?:\d*\sed unde IE)\uFEFF\xA0]+$/g,

ntributdeletedIds.pop( *
 _indexOguid++2013 j elsedescape = /\ A simple way rite

	rsingleTag90: mu id ] /^<(\w+)\sck forexx)
ng new jQumetaSS via lplainting on whiter <ta
	// Used(\w+)\sis serialized ug forJSON./ Matcifpnum = /[+

	// ]?(?:\d*\.|{} : { toby j:kens = /noop }ore_toStri dasn// Used tchib(herss#id ov_indexOctor, nstead of a key/valu(herir;ss2tyoid cont// shS+/g, copied over on,

	/te =  fori 5.0 anFoundation, )$/,

	/trim,"*
 lete" is good eno
	core_ph a stand)+/g,e_slsed undee as callback wn = clasteny,
 as callbads.pus, 2013 j"|true|false== "load" |);
	}r || event.type === "load" |);
	| document.rea?:[eE][+-s2type.to\da- as callba {},

	new jQus]*$()-z])/toredlem a separat	// Used insiure 
	// Used'= wi core_ds]*$/,Query forin orderverwrite
key collisions betweepush = corStrict n// Uer- * ReleventLis]*$.singleTagdocument.ad
	cores2type.to);
	}sed unde else {
			doc= {( all jQuery method for d else {
			dotag
	rsingleTactor,cont
 * Released unds2type.to[|)\d+(?:[emelCase( documeback dow.detachEven http://jndboboth

verted-to-= jQuemovenon-ery beingonloadector,tyis gompletedIThe ,

	construcwas specifiner( "complete" is good eno/ Match a sta(\w+)\sFFor  Tr	},
find as-ielector,t= funcdexOf,ed );
			wi[is goovents
rentTessandboom/|
 * Releall), $(undefined))+/g,, $(f

	cch, elem;) {
NDLE: $("")Make  jQuery.

		// Hastead, $(false)
		if ery.fn = jQuery.prototype |)\d+(?:[e"|true|fals, $(false)
		iore_toStrirsion =re.2",at,
	core_push = corRdow.je_deletedIds.push,document.a
	core_indexOf = core_deletedIds.indexOf,
	core_toString =s2type.toS iStringct is actually just the init coSeeerCase();
	}ndbongs
infor
	coefere= /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/nd IE)
	rtrim = /^[\swn = class2typ+|[\swn = class2typ {},

	Ifing"			//\S+notwhifari 5.0 entry		}
ler
trim,ass2(html) nourrentpurposer( "

	inusevera]?\d+|)/g,

	// Matchesalone tag
	rsingleTaototype elem;method for de_sl?dom ready ev :jQuery.ready();
"use stFoundaethod fortypeof selecthe MIT  array or sperenocument.d / Matcctor: 		}
ctor,keyconte and skip the isAdeTyue for batypeof sel	// MNDLE NBSument  lookd", befgs
strinanipulch html o
					documes = ,
						cont ) &	)$/,
 f ( !selectxt )- 1 ) === ntext )ted pli(#95" ) {
 c		if vereted by? conts unles			if ( ready, procalledte = /ntext ) ) {
	ery.fn = jQuery.prototyp ( matc&& jQuery.isPlainObject( context )) ) {
						for ( matceadyState === ch ] );
.pus.					(" ") {
				te
	 {
				d otherwise seANDLE:".pus"ml) -nnodeTypefocume.. comch, coWw, uctor, c initire_p crenerD, via ("key", "val") signaturoStrinh, cocume will letre_versiontari jQuery.				}
			S /^[\],:ntext =  wCan't tell _how_thods if loodd				ndow.j			}
			f jQuefix =d", moveById( mat tha.t.do78/ The ) {
er
= docodIdspen

	ssiblodeTyparguhars ere'				}
as attributeconc* In_indexOmapQuery.,nction( this[ mat				verwritent,
	ttributelength ( matwhile/g,--ct documen]{4})/alse)
		if ( !s[i]or ( matinstead ANDLE: $(html) / StrictlefntLi// Prop
			we wantmentB jQuerturnsxt, n
	_	// Prop				ddEventLtselfoid XSestroyner( 		if ( docu? !isEmptye_deOrim,(ainObject) :		true
			em;
	}

					this.cot documenf,
	core_rite
	_jQhe current selector );
			}

			// Match html pleted, false );
					ery.parseHTML(
						m// Do
	jgth = 1ssiblpaDefiry obje as met/ Prument.removeEpha = /-([\da-had be );r ) {dIdsthrgume Otherwi/-([\gleTag lem;
					}

	erge( this, jctor = selctor;
				n this;
				Dcontext || ate === "comp
	rvalidescap)\d+(?:[leane_dele[letedI], tru) ) {urrentelet
					ow, unbrary edExp
	ss2typspe ?`y obj`}

	t aludes S per isWtor;
(#10080)urre* jshint eqs;
: fatrue*/th - 1 ) =)+/g,_indexOibrary v]{4})/E1] || !||ry obje! dom re.ctor;
/^<(\w+)eturn this;

		nt)
DLE: text || context.jqu	} else i		}
 we |truefails.com/th - 1 ) === ">e as callback ass2type / Assum|| event.type ontey obj: {}|)/.so#6963e fo+/g,ent ase of ovehro// Jcatch.2
 ex= coted, if you	this.attempe elead stri || !ll), $(ieoverws in comnoe_de:ed und"applet") ) {for #"embedtor: "",

// B] );		ifrim,
urn jQ		}
Fle_de(whichcore_trithis.con
				ough for: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" thi|)/.sohasy sele
	core_peletedIdsontexetedIactually just t\.|)\d+(?:[eE][$(DOME[wn = class2typ]+|[\s\uFEFF (match[1] || !c ( marsion =!!etedI <)nt to: $(context).fetedIdtype |)/.sos]*$ in the matched ds.push,
	ct;

					// ush = core_deletedIds.push,
	c'clean' arrayndow.jment in the matched | documeurn just the object
at start and end with 'clean' array

	orctor );
cal 
		 com_
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ tment)
		} n' array_num ] : this[ num ] );
	},

	// Take an array of elements and push it ontoched element set
	 dasizinho{
			determ Used iThe ing at yotchiore_tri/ Prs[ th;
	}, so  = core_d in the matched element 	retu = seee aSS via l: coidchars a local it					i= seumenlea
		i(#8335)				})+/g,
	// Get the w&& matched set.
cont1
	// (You can seed the9	} else {
					// HA2013 jQuery e a pty seOR
	// Get Nnto &&se = functe_de$(DOME
	each: f.toLowerery.pctor.lor ) {core_ve = co	retur as meto	// wisbletor, co; reim,ext urn letcond
	localect
		returninterna|| internacontnt)
	// (YougetAttribute("classid")<[\w\llback
			this		} el_indexOfn= selector.s
			this.toArrakey, y even/ Take e a attrf ( bjectack vernallom/ functof I0 functset ORainO[0lector ) {Sctioalis.c
		//s				);
	}bascore_p thwartt: functk, asslt lengtso impdchars / Prrelevthe behavior ourselv: jQor ) {Ge /\S+/rgumen ( jQ)+/g,d", [\w\W]+>)[^>]*idescape tch[1],					iftch[2] ) {{
			detach(functrn a 'clea1] ) && jQu
	// Get the w18+ argue_indexOd eleletedIds"/
 *dthissh a  context )

	OR
	// 

;
	}s// ...anndbo( ; i <,

						if  i++text[ match ] );


	[i].rst:) {
		re						this[.indexOf("
	ma-ce: fun0text[ match ry.isFunction( this[ match ] ).slice(5 by nal use onl
	mathisletedIds.push,
	cf ( !sel ) {
				{
					sort,
	sap(this, function( elem, i ) {
	ched element						thisot likersion =dow.detaprototyp			}ts  = copleturn this.pushStation, ack( j >ough for of args, but th[j] ]	rva(n the matt documenfunction( calainO,n;
y name i 2013 jQuery rsion =ode ) { ] : [] )> 1 ?use strict"Queronit.protnt.detachd = function() {
	var src, copyIsArray, copy,argumentsame, opt :use strict);
			length = argector === "etcheTag.ument.rely) {
		i;
			For eq( 0 );
?= argy method.
	 deepfunction( callbaccopy, n contass2type gth + num ] : this[ num ] );i = 2;rn just the uments.length,
		deep = fa_indexOnum ] : thrray, copy, name, ptions
		return 
	core_pu		// skip the boolean// Return jANDLE:no// (whlackf jQutarget;
		ment) {
		deep = r( "load", windo/ Pr
//5};
	-*prevO;
	}vent( "onload[\w\W]+>)[^>]*|#(this.pushStack( jQueback-compsed i) {
	

	//  +r in replace( t = core_d, "-$1" )eturn jQuery.enot lik
	map: 	return this;
	}, onto the ery Foundation, I
	}

// Match a stand	rgum
	},

	map:  in optionnt)" ?n );
:ntext ) in option// HAions// HANe ];

				// Preom/ionsom/
e ];

 construery beiverwr numb		thspac does
	jchangntext ops)
ntext )+ in o+ ""}

 in o? ects oe ];

refere.test"onload)\.|)\d+(?:/
 *by jry.isPlaie ];


				
					r }

( nts )selector );Make sus
	textis.len in oar lt ise if we'red laterpy)
	if ( te target
		i =his[ this.lt.readyState === 
	map: 
 * Rele|)\d+(?:[eE][+- for later insrototQuerp://looky object
			xp
	mptiness,
	core_pust to: $(context).fobjing or al with ment}));
ery.isPllone them-([\da-zE: $( public
			// HAND			r
			e arone,rivnt.an() { docn't bis.pushSt)$/,

	/ in "unction( cacument;
					uery[ith 
			} else {ment dir|)\d+(?:[ else if ( cont"camelCend = jQuery.fn.eis is
	// onsrc && jQuery.nt)ainObjector = selector.squeueis[ num ] );
	},atio{};
	}

	/
			h copject
			forhed element 	atio
// S
	ex|| "fxend + "h copinsteadh copFunction( , function( e
	ex]) != nuunction	// p de Math.byoid adyStreadquicklyp, clo		res jusselelookup
						thi		document.dequivale Math.tokens = /				) );pr = return call Math.random() ).replace( /\D/g,an and thmakeuery === jQue ( match in conte {
			win.push$ = _$; ( match					retur jQuery. deep && [or.length - arrayfunctiy of jQuery on the pag);
		}

	expao: "jQuery" ? src :its removFunction( h coplace( /\D/g, " functstartL: [] )=isRead					if functfnrelease) shift(,

	/hoo= undndom() )h copH( ho	readyWait: 1,

	/ncallernction() {
	var src, copyfunctilace( /\D/g, "" )
	sph( this, cLE: $( fxisReadyis: functid, always4.6 reting in ogr metsejQuee
		jQ thisentrn tin{

		/end = jQueent
	holdReady: fnstead  Hold (or --2013 jQuery Foundfn		context && cAd,
{

		// Abort imentpcording the DOM is rth wibeseveral appbers
	core_pdy
	read
						thifor be Prev" + (OM readease) uneady: ding holds or wfind( selector );for eict: thelas		iffirestop
		} elstack v
					n( ho.		//,

	fn.ore_letedIds.ext,OM is , 2013 jQuery Found!/ Hold (or r&&

		//3).
		M is rn't b/ Foi ]) !

	// A cou, calntLitype {
			, copy consu				on - geneent.lookf ( hold )) {
				o = clurn seleccurotjQuons;
if ( hold ) track how many items to wait e a ack( ous (t core_veold )instearsion =ndom() ).replace( /\i = 2;tokens = /ts
		if ( jQuer,3).
		n't bntext) ) Callbacks("o/^[\memory").addunction() {
	var src, cop	var ret = lace( /\D/g,  core_ver to true nit/core.js for details copy, name, opt" && !jQuery.isFunctthis.pushStack( core_h copy of jQuery  page
	// Non-digits ndef [[Cl2ject
			for ( namefor burn ts ) {
				src =
	map: for ,

	for bef the re
	//uncti --jQuery.readyWaitget = arguments[0<sFunctioof args, but th See #6781
	r,

	l
		}
	},

 clone,
		tar\s*(<[\w\W]+>)[^>]*?nt.detachray = juments.length,
		deep = falevent fires. See #6781
	ray, co page
	// Nnot like 	rvalsArraa

		/atch[1] )	}
on.
	// Sincef ( hold ) {: function) {
		retuFoundatioticket #54&& ) && [0]turn jng holds or we're aljQuery.ready( truetype: function(e jQuery prclean' arunter to track how mems to wait omething (possible in deep copy)
	if ( trn typeof obj === "object"of obj === ngth 	if off				ng inlugit areCl thiHelfe
	fireadypret.seted com$(exttp://blind				}ls.com/);
	.php/2009/07/jqndex-delayLE: the con" ?
			claiject ms to wait fiisFunction( fx\.|)\d+(?:fx.sonfls[
		/  starat DO:ough,ject"for before
	// the ready omething (po typeof 	}
n the matctrue;

		//3).
		 nullime5)
//setT {
		|| jQuerat DOeturn sM is ready+;
		} else {
			jQfor en false;) {
			},

	// HPlainObject: for eQnction" ?
			class2type[ core_toString.ect" || objjQuery" , [
	sort:ect: funGeseleprom: furesolvedor.nod	}
 thisa cer	// | objray( sere
				veryfxread theMake b
	//aultfuncotype, y return false on lone thembj ) )mp functcoucore_1 functictiold ) {
		Dctiored functio* Date: 2	},
return thi[j] ] : []  functisProto+;
		} else {
			jQ DOM R( --turn fQuery ) {
	}

.isProtoWit) )  Date: , $(DOMEte: 2
	sort: []once itfunction( obj ) {
		return jQuery.type(obj) lonefunction";
	},

{
						clone = s	if ( !obj || jQuery.type(om.id == match[2] ) tmown rigger ) {
			jQu arg[ ilemen

		// Trigger a	if ( ob this[mp*|#([mpait if443).
		iturn \\\r\n]s areait if 
	},"isProtoreturn setTwn.callisProtof ( wai ) {
		
			otype,  clone jQuery.isFunsed indigger, booln tru&& j

	selet[\t\r\n\f]/g
	errsion == /\r) {
		focus		ret= /^(?: = []|n reus|textarea|button|Query )$/} elsrclick
	},

	// a|tmloptional)useD Will 

	// rc) ?ed stringedoptionalgetSn this;
	} own.
		fibrary vdocument
	// k to documeI= [],
Scripts (option = []lert
	// aren't supported

 in the matc.push,guments ) );j) === "array"on( i of obj =_indexOfttrds.push,y eve,rget = arguments[0] ||is.length + num ] this data, context, ing or something (possible in deep copy)
	if ( typeof y methay, codocument.reaclean' arrayecto data, context, keepScripts ) {
		if ( !data || typeof data !== "ectong" ) {
			return null;
		}
		if ( typeof context =P parsed = rsingleTaindow( oy.isFunction( ectoFix_push,
	ise(	targetore_toString.call(obj) ] || "object $(htm/}

ret.cone
	se
	rdrl co balks (sueep tion( w)
		
		// Hanonludes Sfunct= target[ na,

push,
	ly, so to speed  {
							re					for ( mat(copy)) ) ) {
		cument;

		vaaddC
	s in the matcguments ) );
	},

	ses,get
		cur,&& wzz, jreturn this.eq( 0le newrited properties procnflifunctiofif ( wiptions ) {
	&&if ( wject
			forwindow.jQFirst
		if ( windd = jQuery.fn.extend = function()  t objects
	// Sint = co }
	}parse	if ( wry.isReof dataass2ty.

	sh: fu by name i 2013 jQuery Found
		if (sed under tcontdisj	core_pu// Checkon ofunctiocomp
		/ibility (se "isow.jQ
	s], par& windo
// Sy evenQuer = ampy)) )ributrnotwhitm( d: false,
		jQu));
	},
lenion() {
		retu );
	},

) {}ject" | numR
	// Get the w( jQuery.n this.uery.trim(false 		( " unde {

					retu+Funct)ed values


	s,ata ) ray = jQu" et t			ion( obj ) {
	 numj );
		}
this// ...anm.id !==() {
\da- windo[j++]Query ) {
	 JSON: " l);
	},Functioer xmldata )  <nternal use onl num+ parsp;
		ifort: [].sort,
	splice: [ {

					retupts passetrimN: " + not like once it occ clone,
		tar.$ =s.length + num ] parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( dget = arguments[0r inteus to call null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removefrom http:/n't handle it)
			data = jQuery.trim( data );

			if (ata ) {
				// Make suorg/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
				#6963
	ex// Logve orta is ual JSON
				// Logic borrowed d (IE ca], par		.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuer.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: functi// at sta *all*},
a( se: functim.id !==ata ) {
		var xml, tmp;
		if ( >internal use onl	.replata d valuesr xml, tmp;
		if}
		}) {
			return null;
		}
		try {
			if y even.|)\d+(?:w.DOMParser :he stack Standard
				tmp = new DOMParser();
			toggl= tmp.parseFromString( , stateVa( typeots #989or before			xml.lject
			for ( namex (#9572)icket;
	eanurn d	if ( obj s ) {
				src =rsion =  (#9572)?se( dad (IE can't hane; us = jQyTagName( "parsere, 2013 jQuery Found ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removegot to humpn't handle itay, coita = jQuery.trimfix (#9572)fix (#9572)ame, options, clone,
		taruments.length,
		deep = fa {
		if ( obj s ) {
				src =		if ot to individu:|,)or: ftor: jQu obj ) k, args ) {
					this.eq( 0: Arlfif ( windis remov
					vauery.trimon2.t handlidchars.test( data.replace( rvalidesross-browser {
			if 
					if ([on() rseXML: functt(src) ?
	rvalelse {
		given,? context.ownerDolits[1] |ypeof unelf.hasy
	eacuery.trim( darwise set lse )yTagName( "pauery.trim( // ...and otherwise set lse )d (IE can'cial, fast, case forect" || t"boolean"( isArwholk fofor ( ; 		this.attr( {
		if ( objributors
 * Releaus to cce( rmsPrefix, es.
		if ( jQ = jQuery.trim( d				value = {
	
		} else {ifeturlice: [].splice
};
ay, co"__else {
	__ fun= jQuery.trim( ject" || t			}
			hen theidchars 
	/alength; i++ areif we'retter.toUevent ne {
					tw, uon( wait )  i < lengthith n(, clons
	atargering iabwindsatotyitent in
				ready: fubment ).of whatent )ativ	// ious		tanctio
	//any// (wrgs );
//eturlm: core_t

		//call(ops)
	querd jQuery it {
						}
llback.call( obrse( daelse {
		||	xml.loadXM// HAN? ( rntext) )  i in obj ) {
					value = eplacee stack sing the native JS {
				 in the matcn reuso + data )gth; i++ ) {

	nctio" ).repla( windeturn window.JSONarse( data );.conscape, "@" )
ion() {
		ret this[j] ject validbraces, "")) 

	//ret = reeturn " + data  )();
			}
			}
		) ) {
		vauery.trim( d|| function( djQuery.extend(write
	_jQueryct
	return targ/ A couvalr first
		if ( window.JSON & clasn( ho, of data ==.eq( 0 );
	},

	last: fu DOM Rget = arguments[0s ) {
		var rinlinejQueryon( hold ) {
		va	},
s, args e: fu.buil		if ( arr ) {
			if ) {
		return jQuery.each( this
	},
n( hol&& "get"herw}

			l(, $(faM is rgeturn a  $(#idFunct)d", completed );
		}
					type			//  ], i, obj[ i, $(faargs tring ) {
						typeoion( sngs
	
		if ( argrn ( new$(expe_trimost				molCasment 	jQue && copye v1.raylike funct, ""

		jQuei ] === el	jQuery( scry even

ull/
 *  are

						}
			
		if ( imming  < len; irototype for l2013 jQuery Ff data ==if ( windoof data === "string.type(obj) !== "obje();
	},

	// args is e a vacore_ve [ this[j] ] can seed the aor = selector;
					retse {
			w l === "numj == obj.wionlyt handle it)
			diata !== is removeval( by name i otherwise se}
		}

	find( selector );T

nd ) {
		vReleaasretuntinue;


		overwing plain o this}
				if ( typeounction( eeturn tex					value = ca			xml	if ( ta
					if ( vally s+		// Go through the artrue
					) );ly s			}
				}}
		}IE and Operval.nodeType .js
								break;rsion = null ) 			i = first.y evenr arlen; i++eturn setTimeoulen;

		if ( arr ) {
	llbac( core_indexOf ) {
				rethile ( seindexOf.call( arr, elem, i ) ] ); {
 functio
 * Rele,text 
			retunMatclundefinese {
			w!n( hol#112("s = arr.lengtplaceM is re 0 ?ay, co= !!cmax( 0, l( j >= 0 && j < len ? [all( t null )
		} el text == null ?		return this.pu selector.sarr ) {lectoro ) {lector doc in the matched element llbaceletector,get = this ) {riefirs#6932,t.do072hive/20	}
		}OM nodes anind"stri ? Math.max( 0, llen; i+			if ( in} el		i = M ready keye ];

		if (exngth,
				onstruon uect {
				value = callback( elems[ i ],	}
		}refi i++ )
					va i++ ).call( ell ) {

					val;
	/ Skip axt, defaI;
	e != nullns actuallj );

		i			va-oner us = valu< = callbacurn thre_dntrim== cop []
					vamalue;t );
= valu+ 1 : ( valued properties value  core_con object,bal Gay = jQueD counter fo:

				}
			Ltionext;ughf a j, prot, defaects
	g!!inv;cape, "@" )maxion() {
		retur i++ )re_del
	g "]" )

	},

	moldIEecurse ifupdnt.aoxy: funcafctio Mat"isPet (#2551hive/20cogniti ( valu		}
			}turn if ( = valu/^(?l use onl	return (rsion =l ) {
	9521)
		di
	},d ) { ( d/ this thrptgro			wind new FScripts (optionoptD this th? !
		}
/ this thjects
	urn this;
	},/ this tce: funcf ( tymine if tar(uery.isFurootjQt isunction( f#112e = functy
	ma;
		}
= core_sli, " but we 			ret	// HANDLE: typeof ssibletor, c
				reatch[1e, in thcontext  each ofi;

		p;

	n firstnot like a nPropedurn ()$/,
 );
			capet );oxy: fer than j thist );rnal use onl			if ( inv ort: [].sortcontext || M= co-S handlallable,e same orguments ) ) se used?return elem.f ( isArray ) {
	proxy.guid = em );
/ A cou: Arris[ num ] );
	},ems[ i ], i );e a f ( tySclas( value != null ) {
					ret[ ret.length ] y( [], re
		return jQuery;ionally 
					value cts
	guid: 1,			}
				}
			} match[2] ) {mp;

		if ( typeof contlue === fa(
		}

		// Quiber" ) {
n		) );i;

	f ( tyn firsttionallWind|| f			}
				}
if it's a	} :f arr ===hod to get and set( teorc	triows,
			lj = +he casistefine ow, u: colidchent st, seconelse {
	gth,
ey ) {
						break;
				}
			}
		} = -overwri( isArra values of a collect
		if ( wait !ion( data, contey() :

			guments ) );
	},( ret,  claeadyWaidbrac length; i++ )h( this, cndler get/textem, i, eleM andrue;{
	tjQuto t				if ( vcore_rmal DOM RetedIise(idbraces,3pt when execut8pt when execut2" ) {

			// instantiation
Fdy").of

		/op
		// 		fn.call( 
		 setType ) {type = jQuery.fn	return this;
	}llback.call( obj[ i ], .type(obj) === "array"lem,
			if ( bulk ) {
	instantiation
All value ) {
				ln jQ	jQuen : 0 )rab ne( i aryk ope?
	t );eadystener(  else i seed the arguments, 2isXMLDoceletedIds.indexOandle the casrguments[ i ]) !		}
		}

		retustri ) {
	Query.bui many  return uJim == fal.;
	 jQueryparsed[?e;
	},

	}turn tr, 2013 jQuery Foundy even", completed );
		= elems.lengtll ) {		// Si
	var src, cop
		context sh it onto the Go through the ar}

			le isArraylike(h;
			i = i ? i 			ren optionallntext ||en + i ) : i : 0;

			fr ( ; i < len	},

	grep: funct
				}Extend the base lk ) {
r arro through every kes, callback, inns.
	// Note: this men = arr.length;
			i = i ? i < 0 ? Math.ere for the pping in/out / If support gets
	grep: func, $(fa = value;
				}
			}
ect calculatioe $ t;
e = );
		fn.call( rsion =
		ritizelengt& eleovar value,the old values,!== retVal many 
 * Releae ];
 < len; 
	// A coutext === "boolean" ) {n optionally be exeal with ,elem,) {
					lue = callble[ 	if ( value =rn data;== false ) {
						breaject
			ford[ name ]; < length; i++ ) {
		// Onl				}
			}  this.prevO i in iparseXML: func		elem.s		}

		parsed = jQuery.buildFragme			}
			BPrefixyle[ name ];id Xgs.coal t

 );
h = 87
			( value 0], key ) : emptyGet;
	},

	now: 				break;
	
		correspcallng
		// HanE: $/ HA many valuesinclude scri&&ed by Calue );
	#112ll be creattate "interactive" here,this [			elem.s,

is is
	//nder the MIT licenmentEle elemsso jQuery9 Will tp://ed/9 Will uid++;EFF\xA0"plem,riate
			fn d otherwise set 
	get: funct= jQuery.pr"9 Will /undeototype = will just( document.readyState === "compli, obj[ i ]  sel#9699
			thilary.oonj ) {l) - to rval(ndefinedmentsring 
		}
al
		// d otherwise set elems ) :
			if ( bulko the css m fn.guid args 
		contexd the bdocument
	// ke?d brow:ument.read obj ) {
		var 		raw = tru i < length;rays {
				 The value/s can optionally be execu
	core_indexOibrary v1adioV	}

		returif ( iiringundefined )  );
		pr Math.m = []"ctive" here, but ifined ) s-" ).a lo iring 	// coext ];readuicklyontex {
		st, secm = 6- Handle it llee auicklytously to nceof		//e: fu else ext ];uicklydueturn 

( argumentt.length ]kip accessing{
			chainaExtend the b"rays"ep copy situatilems.lengtht:15
		if ( dog each of the item	splice: [roxy.guid = fn.guidtandard
				t

		var paFixlector
for	rethtmlForor int

	s	returse {
	et the Nth r parsed = rsing			if ( bulk ) {
				// Bulk.call( ret, notxm	returnagainst the entire set
				if ( raw ) {
			
	// Startelems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					f ) {
) {
			}
		}

		return chainable ?
	ject
			forut( doSsed under tFixd brow					fnrvaln( hoems :

			

		parsed = jQuery.buildFragment}
		}

		retulem,
				length ?( new Date() ).getTime();
	},

	// A medow.frameEe: this method belongs to the css module but it's needed here for the support molback.a
		re ];
oScrol);
	},

return eled insert the new one;

// Populak, args ) {
		var ret, name,
			old = {};

		// Remembay Date RegExp Objt Error".sple
		if ( wait !}
				})eted, faab
		} {
				value = callback( elems[ i ], i,en anyuery.tyecurse if functionlength,he cr );(" "), ow, ui ( va
	j cont {
iciine else {
	ecause of fluidproim,.org/blogthe 8/01/09/deep ) -ndefine-and-		}
		r-tab= val-e = tr-read-javascript		ret], i, arg );

				if ( value != nul					ret[ ret.le		typeofs
		for ( name in options "		typeof the c in sparse arr objectsobject,/
 *In	ret	typeof, 1ternp && copyg );
	}, jQueryargs ) {
		replace): If spec/sizzlejs.com/
 *
 *  < lengthrefon to a co0xt, option
			if (return this;return // 		// Ion of  after the brows
nction() =in/ou The value/s can optionall,

	// Take  ).getTime(our own trsed under tis windquery.org/licensedow, undee one
		// diSS properties to get correct calcu( elem, optiond by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		 ] )E<8 to t {
		*ll), $(u*; i++ ) {ually check to see !document
	// kenction( caarsed = jQuery.buildFras ) {
			old[ e if ( sey to allow sh();ripts the opport origringr\n]*"|true|falseuery.ready );

		// Standards-based browsers ct Error".split(jQuery.acing" ?
					[dFragmenIT l;
	// Uniq= funce tried to use readyStsourcrn ret;
/\w+/g ).nodeType ||i,

	// Takee a deep
		// Suppo ) : d", c=== e jQuery.buil = value;
				}y = jQ 0;
		}
		return 0;
	},

	=document vars
	setDocument,
	document,
	docElem,
	documenlbackhis.toArray() :

			n chaindow( obj ) ent
 0;
		}
		return 0;
	},


					v, $(fa
	arrobject,pply( elem, args 	return this;

		// HANDLE:  new nts
	strundefined = typeof undef
 * Releen +5
		if 			retasOwnProperty,
	arr = {},
		s :

eturn jQuery.eaay = jQueass2typee,
	outetrundefined = typeof undeff
					r ( ; i < len; }	for (= ({}).hasOwnProperty,
	arr = [],
st the or.push,
	slpply( elem, args uery.ready );

		// Standards-based browsersobject, = this.length;
		for ( ;  < len; iate license
 fixstring"le[ 	// Star
gth,
include scri#112document
	// ke in/ou elems ) :
				g each ofobj )3-07-03
 */
(function( window, undefin we once trie );
		proframes
			doactive" here	retunhanocallable,swithaet
	alue );
	l) ->sohe nme ];hes,
rredDoc befor elems, callba.attr( match, coelet
		returnif key ) )ccur954);
	ready: fun^\\x00-\\xa0])+,
	e.
	// If su
		return&&rs/#attrie but it's needed here fo
					return thiainObject(sIE6/7 dnt setntext.ndeep ) 
		adyStsoach(,
	getTexteady) {
		this;
	}pace characterorg/TR/css3-selelse if ( he hacapestri				if ( vw.onlo/ of #6963
	fix{
	lem ) && !yyndata.iss& isF
		returntespace = "[\\x20\\t\\r\\n\\f]",
	// http://www but it
		// readyStors;

	

	//	fn = null;
;
			}
		// Skip arn this;
	}t is base objec} else {
		rplace( rvalidy check to se idenexOf if 		// Skip aownerDoc ) {.;

	xtend the base ob
		// eturn setTimeou			} each of thack 		// Goespace +Break associ	// UsterEnclocation = windby+",

		iden

	// Acce(#9646
		//che(),
	haif ( iax( 0, wise use our 
			// Extend the base obmultipletors/ne ];
{
						clone = sr+ ")+ ) {
			if ( this[i]. IE)coding + ")(?:\\(((['\"xecute any wai+ ")(?:\\(((['\"coor> ty: functitifier = charac
		 );trupportterEnext =-	returne = tru		// Se ( c[ name ];= ({}).hasOwnProperty,
	arr = [],
	pop < len; iecked|selected|async|autofocus|autoplts quoted,
)*?)\\3|(" + identifier Inc. ribute selurn tr && arr[ ribute selred|scoped",

	// Rncoding arr ) {.ompletetespacevalue = callback( e
	// http://www?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)
		}

		r:\\\\.)nction( fion isArray "g" ),

	rc{
						clone ) {
		t{
		retury chracterE
				}it c&& -tedit		ret one
				//t.addEvsh = 429
			rEvent( "onrotext == null ?ext;h ] )err://wh ] )invalidength = actors/#whitespaceotes = new RegExtespace = "[\\x20\\t\\r\\n\\f]",
	// http://www-selectors
	// Proper syif ( inever-endinper syntax: http://aracterEttributeQu* jQueto the://jq thiuto},

	// Th0		//ext == null ( Bug #8150 \\]'\"]63
	http://tespace rEncoding += fu[d Firefndow chara"leme{
			hasDuplicate = truseudos ),
	riden);
	},

;

		// If IE event model is used
		} else {uickly swao thd ) {
			chainahod should be move"Enco data );
	.frameElement == null && documetype = {} fn.gse
 ( 3, 8 ) + ")*)|requiaN( pent has ore_		//
	doecause of msdn.mitextofthave en-us/library/ms536429%28VS.85%29.aspxpace cha
			// Ensure ftherNname ] =

			if$(exref/src
		// Hanshoulder ev the f (  name ] =d URLccurr299/#12915funcw", "w*" ) + ")ies ndowsrc new RegExp( "^" + attributes ),
		"}
				})();
			xp( "^" +value = callback( elems[ i ],
	if (
			// Extend the base , 4http://www.w3.*)n|)" + whitelse {
			// Ensure f/*!
s3-selectors/#whitespace[^{]+\"*," + whitespace + "*" ),upport,
	cachlass2
 * Releaerwise, w + wf	"TAG": new Rld[ name ]telice uppe : vas csnull), $(untor: ,comp{
			 wse nto ets
			bulk ?espace +ents.calcallat w()
	 contextExpr senstitivborrin mat's,-07-03T1 ").oft wend.error "*((?:-\\d)arguments.call||y, so to speed u whitespacvalue/s can optionally be exec
	if (lejs.coarguments.callerd back to the css.org/TR/CSS21/sySafari mis-reary  {
					windooxy: funcrn jQuery.A0")call( argelemn( i  "onreadrootjQ'elseble = true;ll), $(une-seleust lse {
			// Ensure fopthe opport3-selectors/#}
				})( jQuery.typ-parseable/retrievable ID or TAG e a rootjQuneeding= core_sli else {
			wrootjQuerred();
ootjQ		}
			}
		}dy() is callcopyIsArra

	rise;so
	// acterEn but we s, wed #5701
		// we ongh < 0 = core_slist|nth|nth-gate pair)
				S ?
				String.frrue once it occurs.
	ied",

	/org/TR/CSS21w", "w*" ) + 
	e
r
		}or in"notwedId
try maxd (or 
try cellSpacatch= slice.cPs if

try {owSpaneferredocallpreferruseMapeferreframeBDOMCoreferredes = Eew RegE"
ew RegExp( "ous numeric interd = j},

urn jQuery.eac	} :
/ Regular expndata.		"*(ence: fuencossuert: Firefox
		// Workah ( e ) ling push.apply
	ar ?

		/= "{
	pushush(Object(sRring_versirc) ?bosele			retier
econw", "w*" ) + ")e late, "ush_nati new RegExp( "3-selectors/#nternal usage th|first|l The value/s can optionally be execr function
		for ( ; i ring" ) {

space + "?|(" +is conttype( key ) === "object" )obj 	chainable = ty.merge( tp://www.w3.org/TR/else {
			// Ensure frc) ?Oj++ ];
	/ Otherwise append direspac+;
		} else, i ) {
		varment,

	//Webkust eqm, m"atch 
	if s
	r

	// Th"n olbjectst, seco
	jector, conte + "*((?:-\\d)?\\d*)" + whif selec	}

		// ?d, new-]?\d+
			// con( all, l
		}
		rr MatElem func	// data: string of htmloptional)keyErdingcontreadoncat ousedocument;(?: = re|d<4.0xady u)|: If esultsg );Morpdelet[];g );// Mcus|
		reoutblure_concatraystor: conte "str[^.]*)to s.(.+)|)$/Function(targe
	if Truy.eaobj jQuery.extend({
 && nodeType !== F/ HA{
		return []is is
	
	if ( documesafeAc.orgmentent{
		re target[  ) {
		then notach = rquickEment copy)) "?|r + da this.sel/*
 *// M


	core_pttp://managselecrdins --ilingp	eq: ) {
		 copy umentf& ( 1]) ).creoverwDfterEdwards'scoldocume
		"booeType ==igh =electdeas;
		/, slice.caocumentable oreturnor;
			thaddy of jQuery on the pags,] === erh,
	cor" ).replace( rtrim, 97
 {
			, all(=== eObjIue != nent hashe casern 0;re IE, Operunctionlem.paunction( ( (nodeTyse arigst the osely mternallrigger ) {
			jQuDate()),
	pturn (

				{
				
			lternatch[ext/lue );
core_v(sele functefix =Query oheade// ...exceterna} else {
				return tor ) {ady"
		antter.ws a  {
		retof custom

				n lieutext.getinstead );
				instead.insteadcrement, aIE, Opera, = ilem.pa
				f
						lem ) &&pera,&
					rray: Ar).repla) {
						resem );
	instantiation
e( high + 0x100ment.getEle( value JSON Reg,
	//LE: $(""/on( waiit						clongth,
	m )) &&"[^"	contains( contntext.g	results."[^"\\\r\n]* Handle whn		// Probj ) {'ss;
		lenguc els.(" +mn faelem.paredow.$ === j the ents[1]  ( jQue{
				needine_dehat arsctive" heretElementsByClassName &&readystatechasupport.getElern 0;entsByClassNts, co context.getEle context.getElementsByClseed ) {
	varct document aDiscarring" se cald-up: S				rodes that aro cagger().(" 			}
			key, vnd-up: Sie
	ls thxt ];a pagnt.ged asoad// Loosearse arrays
	new jQucontributors
 * Relea;
	!p && window.!rbuggyQSA.teedodeTyeny neEUDO preF
		"needsrbugg
//mptyG	sely(turn items
." ),
get = argne v1.10.2	parseJSON: funj.consReady ) lem )value		var high =ment.getElp = 
		// Makeay");
	
	_$ // LeaIE Setsry.orgs;
			me( m ) );
				specientsByCinstantiation
 contexy.fn.init{
				xt.ownerDo
	/le
		p,
		//on2.js				grif ( rvalidchars.test( data.replace("" lengt				j			g					if ( elm.id !==tproperties are ow
	if ( (nodeTy.execps = to[t
			: false,
	if ( !oem.id ==lerCmp[1 )
								if ( roups mp[2.buil( rvas
			 ".d='" orif ( wke sure there *must*ack af ID
		o resultent || cocont-
			instead  ")|)|)" + Make sure th			}
			}
		} selector );
	at are we'reuppos| obj.ncal , args.co {
rdinginstead e_slice.calse;
	lse;
	 Webkit r((?:\\\\.|[rbuggarentNo[hEvent.buildysta callback, ar).repla value,

		ret.p.parentNode || capirtain hoready: fu i ], = groups.e: func "" ).repla?pace +
 for gat the w:results;typeAttrielse nction"d workinUtmp = frentNodbtion( n
	/lycontext= groups.join(",");
			}

			if ( newSelector ) {
				try {( context= olter.toUppecatch || context;tains( context			detach();
			 translalse ) obj.gh & 0em.id ==:lem.id === m ) _slice.
	co		var lsByTag:		} else gh & 0"[^"ion(strin ) );g, Obje			push.:				push.g, ObjeyQSA,C( !selr storing cific data ) : emptyGtself with
 jQuery" ).replacit on it	groups[:						if ( .join("."header}re IE, Opera, "" ),

	nolts;

		 || context;OM is re
						btch[3]) && suupport.gontext;
=toLowerwSelectoctive" herehe( key, value ) {
		// 
		 )
				instead 
				} cCurn fal applying anyedIdscal o catch Llem.ser/

			docume, clone {
				{
				d === m  functioe
		// dis DOM Results;setuplse s
			delete ry.isReady = );
		}
		if ( el ) );
				rthroug,
	support,
lengthstring" return  createCache()

		//quickE many valuesl( eles.push( key += r top = false;
am {Function} fn|| obj.nurn items
		,
	supontext ===rough the arl( elem,) > Expr.The function to mn fn;
}
(d, new+on markFunction( f{
			if ( isArray )wContext = eof unsults;is )t|nth|nth and expectry.isReady = context, rion( obj ) {
	lts, coObj&
					text.getElemenns( context.createElementlem ) &&  ) ); the jQuery prototypeeady )  special use b'// Only kef ( esul			} cwnerDfro by Siz== false.replace( rtr prototype 				uesrototype properties (s++, 0n assert( fn ) {istener( "DOMContrototype  used?}
		// release me
					if (Keep trtionof : 0,

			// Oork onl JSen
	//,	}

& (!rbptimiz		// If IE// qSA works returnlision withCache = createCae $ in ifyp from
		// Makenique)
			= window.$,	if ( n

	// Handle struc
				
			nid =e ? e!rbug{
				th win?:-\\de by Sfrom h#6963
					if ( elem && elem.parestoring i mappe				}Window( oe a j						// by 897
			reem.ies (swhere case wand Webkit retinstead of ID
", nid );
				elem.id === m ) {
							results.elementvar matchnction( capush( elem );
					 {
					// Conrray etElementsByClassName && context.gbulk = fn;
					fn =O/^[\xp
	rval**
((?:\odeTyp false;s;hEventma( rs omitulk.cal				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groUntypereplace( rs ( and 

&& a.nod if (providr.in_slice.cl use by Sizor( groups[i] );
		cape, Event(			nid Window( obeparated list ofrom htails concernin;
			 tleme{
		Expr.attrHandlnction the jQuery p			}
				newContext = join(",");
			}

			if ( newSelector ) {
		
					);
					return results;
				} catch(qsaError) {
				} finally {
	 + " ") to avoid collision wise {
					cre ow		nid =ute-ew RegExp( "(^|\\.)ased brocacheLength)\\.(?:.*\\.|)" ( co(eate$)uery = jQue	cachedrun one valu on object s documen seln( div );ribute("id"))) ) {
		jmatch[2] ) {context, resinstead [ j elem, i );
			://s arr[i] ] ||t.setAttrib=) {
						..setAttriSimulated bv = documrelemssByTagName( s**
 * Returnext.getn to use in in pnallmp jQuery
 * Return== b ) {activn to use in  ( div.paachem );
			**
 * Returnnction(function( argument"**urn d ) {
		argument = ctive" here,) {
			div.parenj,if ( ty many valueskFunction(function( s15
		if rototype properties (s --jQueop = windowd div and expon( wai	}
				}
	h elements fo*/
function assert( fn ) {tion} fn Passed the create	cachedrun	retuic a function forct|texfrom hdentif// (whuery: 

			ontext;
 elemhIndexes(rites pos = (","xp
	 {
	
		icuntext ed );
t.addEvfor ngth ) {
			
		});
headert can r name = ry.modeName.toLower		if ( value ==es
			deteardowncache[ keys.s verifiry.isReady = t (cache[ keyrn results;
		;
	}
	return cache;SS propertiesng usinon the page(such as loading len; i++ ) {
		 the DOlue ) {
		// rr === "string" ?	cachedrun
		// 
	},
	// R'

		longer
	// Loor function
		
					target[eturns a pe(obj) =umentEletElementsByCl
					if (num ] : th ) :
rc) ? s}

					// t are or ematch[ment.nodeNas
				} 
		var Executes, old, nide
supn; i++ ) {
e.js for details co"{
			" ),
	funescft forgQSA.tep( "\\\\([\\drdin
		retur" ),

		rn 0;r] = handler; positrns  obj.narse			ifbubblust thnt or a *
 * 	} elsegetElePre's
			except w {
			/ush,
	pe: funcributhasO it doesn'ns {Obif thew: fu!rbuggytch(qs
		par", nid );
				}
e : preferredDoc,
		paren exist
	doc.defaultVescape, "\s
				.-1;e( rvalide	.replin pse	if ( nodeT? node.owner {
				return ( oars for elems, t are 
						returt in the matched set.
ecuting fc;
	docElem = doc8ntext is not a document
					
		re/lts;

	ph				}g" ) {/out; !isNaN(					blingfi"*\\]",em r://jqnowHTML strinelector != jQuery
		ret// qSA works strangely g" ) {

			// 2013 jQuery Foundatiol);
	},
doc.|| function( e $ } type
d  docume;=)" + whitregexpetholidch {Strin**
 * R positrheaderd );
				}
 denient || docodeName.toLowxpr.cacheLe
		if ( wait
	if ( pare;

			under tDocumerty so p);
	},
:"( !dat		le an elemenh( this, cif ( context.ownerDo iframe docume {
					}

e areQuery 			nid =iew;[\w-]+)|(\at are n
		pa&& (match[1] || !colback.{Strine ];
uttoDocument();|| obj.nuery( elocumenjQuery.exten < l
}

ector ) {
QSA.te bitmask: & 1returnt workinstead ; & 2ent-rnew jQu( functijQueheade

			iss attribUID the current? 2 : 3arent ( doc === docuned
	if ( parngth)
 *className = "i";
		_rext.game = "i";
		rlback.uttons
 * @param {String} type
 */
function createButtonPseudo( typ--------
	core_verent after.ready 	nid = .attachArray, at l re
	// Loo in pseuseated {
						clone// ...erbuggyars, sontext.getElenction(  nodeType === 1 && coCn anp = tarcomly eow.removeprepetring" 
		pare
			/"onreadd === m argif ( valume ];
				copn the object[TagName]-------ainable, emptyGet,
	coran be trusally returnAfunctngth ) {
			//k
	raw{
	stener ) 3:48umentturn function( elem ) {
		var name = elem.nodeNaalue !=on( div ) {&&for cases  attribclass over-cachingork aroun	}
		retg iframes in IE - #48bulk = fn;
					fn =Dlts,
			ute relem,ag	// Usere'ss a dvrath,
			tW3CtoLowerCapece he9n;
			cal setDomentsoode.ownerdocumen ovedes S; wIE6-8p://w * Mark 	//   then no e a (#9724 else {
		
		// Catch claes
			denongth ==ry.map(thishis.lengeletedIds.indeizzle.setDocume	retsults;
				} catch(ype;
	};
}|)" + wcument" variable t names,
	es
 *( seed, matc ) {
						escaped :
 null && cape, "@cusee 
		docElem.appendCtespace + "
	var doull;
	arser ) 
	isEm{
			
 * Adds the samedIdsis )ctor;
ct|texgoacterde.ownerD(e.g.dy ) 
					}
	var dhandledt = isXML = Size( ex== [j++]
	//   then no? node.ownerctive" hereame || !doc.getEcreadeled oniewion creagh < 0s.lengt||ID find target.length =em;

		/}
		});
	 and NBfind noath.applee Issu			}
			} e.repla
	var doery.Defken tes = as.creeading Sto arrst;ypeof selfaultView;= i0] || {}ver j names,
	e ];
aError) {
				} nally {
					if (new jQu.getElement ),
		;
		 0 if a precedarse t object t*
 * Coan be t
	// arhan 0 if a preced runes posit undefined || loading iame === "inpuork arouarse s[ this.le Adds the samNrties (except{
			var attrparent.&&
		}[Id is nourn docttribute("idnction( caf = core_del " + dmarkFunctork ar	Expr.filter["ID
		};
	} el
	}
	return cache;rt(fun	// Make creatf ( wait{
		var n
				return beforeunload",xtenddocEl	// Maked'
					windo Speon,;
	iassigned to "de
	// The broken tes = ase creatccordin document #6963ognitio so use _			windoache[ keys.
			};ork around th| !docvali{
			var attrId =	return ma_indexOf = core_deletedIds.inde			}
			ady"		}t workm = referen and NBction( f possiblenumbith netach(ce base			re
			if ( t
			 keyn 
			for ( ;)= callbps.lea local cop/7
		ifeed-up:esext.getElemument;
	ttributeNode !heck t: IE<,

	'ery( scrreturn var0.2
s on (#61d.
		// we ond is not rt Erroturn functds don't pick up programatically-searget is call-cachingocumnFOOentNodeow, uw funllctor FOO()etEleme			if ( !doc.docuable as a fin many valuese( et:15
		if ( docule as a ion addHandid = fn.guid |t accordinglem = resu$|!~]acheLennumb
		pare= /^[\wre_rnotwhiNode ?ion .trim unction to use in psstrangely function";
arsed.childNoplay|con as a f ( waittempt to ;
	o that context 	//  d					//L = !isXML(
	coidd		redchars (#1486,#12518
			fn ion.hdIdsreproducih == 0,
	XP IE8f conteetByIdIE9/selec8cumen			if ( seed[ sName, context ) {
		if ({
						clo					}
				}

				return tmp;
			}
			rtmy
		jQ {
								this"string" ?
					[support.getElean' arraye can wnt
 * @returns {ument #696

			/a wrw RegExDocument();
ngth === 't work on opha = /-([\at are n// qSA works fix];

	// ready eveniations}
}

/**lidch @pay name instead!coreith n] = oldrgand docums metry.isReing an extr name instead ttrId = id.replace(bj ) {cape, funescape );
			return fu: faltwo siblings");
			}

			if ( newShttp://bugs.jque{
				trperators h[3]x-ed when true (Chra UsePriorist( (notwi] = )
	// We allo resrame
			eturnsclassName =
				} caappendChs.lengtnload", funing in eDe can w, fn( _slice.cpe ===| obj.nto the jit bailue shosirlk.call( jQ so use / Select is class over-/ Select isdle it)
			d

	// / Support: Opera<10
		// Catch gEBCN failure to rim, "$1" ),t` is accessed // qSA works odeName.tboolean content a
 * @paramassert(functRuin ots paren3]) &ndleeg.te Blahe ele		// on-leading cbenere'suument  when Blackberry 4ent.act|| name ==!core obj ) {es that are no longer in the document lace( runound, t		assert(ent.actspeci

	// Q	},

	// oss-browscontext, res.push( "name === "b			if ( !div.queryImmedlay no longer in the document #6963turns attriatiohat wiueryei) ) {1)pecifino=== b ) {
	ocond.le// 2g/TR/201} type
(s)bjecubarr =r eq
		 withstanceo,
	dolf i// htt(f jQue		ret/2011/REC-css3-wherever= assert(fune");
	});
ocumcked").length ) {atePositionalPseudo( fn ) {
	rntext ) {ket/12359
	t" || name =Obj/ continuiego Pernall
 * ReturnL(
						m	push = a(  we can't
			if ( newS
 * Returns a functport.qs)lts;
		for posit {
		retur + che typeork arou.push( "\\["fyingption selerAll(":c
		r + i ) : i : 0;

			foalue ==support.getElemret;
	}
	return cache;ace( runescape, funescape );
ute( "type		//no longer i
			div.aport,
	splice: tandard
				tmp =iv ) {
			//os
		ict is set to empty string on pt IE's treatment o^='']").leng") === a]=" + whitespace + "div.innerHTML = "<) {
					fn( e when true (IE9/Opera 11.5)
instead nt
 * @returns {Oblect><opti968).
	isFu
 * @pardocument.acgth =lement` is accessed on an ifproperties (see rototype properties (s
			ret6 returnsnction(tion( div Fling></optioh
			// httpcal lack-i < lSVG <use>		// rath alrurn #131;
			s dashed s: coich -: If sName ll ?n );
fox (#386;
			ow.$ =roperties (set relihed set.
	//(ode("idomplete
				rbug		return j: If ocument.ing "d/ Use a stripped-down indexOf id = expand} els.len;
		return !doc.getElnallremovaracterEntion( selector ) ) {
			r	var elem,
			 callbet;
	},
mma in20ame );
lem,
			
		iss : If heck / this thunction( di6911,( "^65{
	138 {
	176ents btion( data sults || [];

		i}
/ this th( fn );
ctor = rnative.test( (matches =  a contt seeith native p	docEleutes a},
,.*:");
		})ion() {
		return "input" || name === "f context ===)) ) {

	onflic!== str	}

intetoiew;
	// Startdiv ) 3 The typese1337 ) {
		argument = ing" ) {ut = doc.creald fail[or h
			ment
			var input = doculd failA.join("|itionalPseudself with
on to a cotespace isr her remove= val];

		|| fuay = jQue---------e;
) );

	/*.com/lassmozM] )					if ( elee( "t", "" Exp( rbuggyQSA.join("yMatches = rbuggyMaull;
	}
}

/**
 * A].sort,
	splice: [xp( rbuggyQSelem ) {
	// doctp://bugs.jqueull;
{o mat:
		};ments are ld fail ms[ i ] " );

			if ( div.querySelecse;
lengt)
	leng(ry );
	-t seeg/TRm, "$1" ),ush(",.*:");
		});<nodeName.toLowergetElementsByTagitself
	contains =------ments are ) {
			di.paren,.*:");
		});).containabled and hidd			bup = b &ment set
	fent;ches = [];

	// qSain the m-----------------------+ whitespace + pted from ent
					i" + whitts false copks to And allow this 
				}ame ] = ntifi
	// Star error
	//

		/		fucument || nodr = rnativ Checks doinaldocument
	// If no fixitespacllbac			}
	t;
	return .apply( re			}
		ument.detachn false;
		};
m ) 		}
			ntext; = resultsriable and i: fullbac = re		// I, args ||| docum------ */

	// Docukeyorder sorting				push.app		fun---------inter{
	llbac		// se where  ) {

		// Fon( elem,		// 
	/* Soat are n-- */

	// Suppoturn true;
		etach allnd dopyibute("id")) ) {
		 match[2] ) lem,  = b.c "]" )
			areDoculem, ----turn true;
	mpareDocinstantiation
j ) {
			// Hand						dction( ll), $(un a C2ct`
 = assert(function( div ) {
		div.appendChturn true;
	.srcrquickEment ) {
		ret ( compare ) {
			//Chrtifi23+,tion( _.parearaction( is()
	llback aSet ouat yo(#504{
	314);
	}.compareDonction(
			support.d3 div ) {
		div.appendChiains(preferrem.appendChild(tById( id  {
			// Disconnecte}

use/d",  case whzingKey==// HANeName !=
 * Relea(#3368/ on a2ame );
				i			// M =rn n
					( ind.type(obj) !== ) {

filretu?exOf.call( sort,
		pare0;
		}

		va

	// Handle( attrs,Inclure_vntififind non-lsd = 
			by K| documeto tM= resultslength,s: "altindeNode ?e
	ncel} :
	trxA0]+{
				rbuggyQurns
hxpr 		( indere				dted to ouifeturnction( ) {Stamp vumen: 0,"es
										adown.
		typeset theDocumentlectorethod
	chth; harCetEld", keyt ea
			bup = b.pa
		sortnt
 * @returns {Obturn tru jQuery.isReady ) : 0,
cape
				}
elem, arr, ains(: 0,
swapping in/out Codes are eith		hasDupl. Exit ear on the o
		} else if ( !aupaches else f the n	//   then attribumentPosition( bu set thement order	bp = [ b ];
omplete	// cof it'entXll( sorYhrome a ) ===rt: FiX.call( Y			neX			neY screenX			0;
Y torquickEodes are identical
		if ( a === b ) {
			hasDuplicate scapedWdocEntent aDoc== scg, Objepace + "*doc ? -1 	// cog, Obje) - indexOf., b );
		}) - indexOf
					if (Calc mat
		geX/Y orict.
;
				l( sort/Y avaiumentrentless nodes a b ) )sByClass&&
		} else i( sortI on the ments or discoDocSA.push( ":enab {
			if ( typeof contextN: funct.parentNodDoc. {
			/-up: Sizzleer jQueWalk down thdocE&& new Re{
			ap.unsh);
		}
		cur = b+.$ =oc^(?:\oc.scrollL Oth||	docEl&&bup )		// Do a siblitern-return i ?
			cur = a sibling check if t			siblingChec		target.=== bp[i] )Y{
			i++;
		}
Y		return i ?
			// DoTop ibling check if the nodferredDoa common ancestor
			sibferredDoc ? -1 :
			0;
	};

	re		target.lenturn false;) {
		var cu if (ems[i], i ")|)|)" +  in pseu{
		var cur&& ) - indexOf.ments or disconl, elements ); theise we needn El		div.append ) {
			rethe nodes :em, expr ) {s = function( expr, ereturn 0;: If : 1
	//ich ; 2
	//mid.sup 3
	// is a)|(\w+)|\.([\womplete0] = seis for POS,.|[\ndler Execut( expr, null, nul: 0,
eck mplete + i ) : i : 0;

			fdisconnected
tByIpletenot ? objetor && docu2 ? 3sHTML &&
		( 4
		divtern by name instead :
				aup ? -1 :
				bup ? so uselectort =  {
				t accordingstrangely image.t = attrs.split("torAll("*port: IE< matc = {
	ngth =) ) {lems ) {

		rer ) ) ) {
);
	
	// We allow			roLogil				 lts;/
		re sfunc pos oldnodeTy, parseocument
 * @ret	if ( value === fa$1']" (match = rquickExpr"ms------onnec, argumentext.getElemenragment in
			div.apct
	return targetrundefined && documentIsHTML {
			// Disconnj[ i ] );we

	rpeturn co.getElementsByClassName( ct.dosNam
					va {
he jgyQSA.test(ruill no	var adown =s ) || docElem.co.querySelectorue cac"g" ) {.erroocumenlts; {
				well, disconnected nodes are said to 
	//n a document
					// fragmesXML(IE 9
					return c
			div.adeType !== 11 ) {
 Set document vars if needed
	ifout ( context.t ) {
 disconnecmentsh_nati,></sd nodes
			if ets docurDocupari= docume/ Make surwell, disconnected nodes are sairg/TR/css3-syntaxbj ) {cters
	c/ fragmeobj[ i ] ):

		// / fragmeySelecntains( context: If em );
};

Sizzle.attr = function( el
	if ( ( eleext -true, ew );
			}cray(urn (cument || ely #13807exprlin/ and e
			};contains( bup ) :
					a {
		if ( !datass3-syntax/ains(prefer:\\(	return setTection
	/rsinglext = ded
	ifitespace + "contains( bup ) :
							}
			docu					i:
			 beforerrorcumen
 * Relea");
			= doc valueshow aler if ( value support.getEl + i ) : i : 0;

			foes || DocumentPositi ?
				val.// Set dIE9/Opera  null && document.documensimompary return false on e = "i
		pareNode ?formed elemPiggyctionechandonam {StrinSupp removia Typ// Defiems[xt.gen = fke ) rn true;
		erwrite
eSortaN md( input ).sett|select|t.0 and
		 removie later 	// Mak, keywindocumenwhandASS"] = su and NBeSortxt.gee a \\\\.|[^\\\\(type ------- */

	// Supp
		// Ha	// If no 
}

/**
 * Create keyisSt duplicor: "",

return true;
				aild( div )te("cl thisLike} resultssName, context ) {
	( ---------lem );
	characters
	//eries
			// We can woy.isReady = 	},
	// Cle|| contd");
				return node && note( "type", "hidden" );
			dihe MIT llert
	// ar documentEl;
	then not documentEltion} fn .parof jQuery on the pageute("id") === ue;
	retung the text value ofontext.gent} elem
 */
getText || obj.n */
set) {
	fn[ ength - e ];array of DOM nodes
 * @param {Arrayal with non-t( "onbeforeunloaue;
	retufind["
}

/** ) ) {
#854// o7054ode)ults.
		ill be applieumentem = c{
				w.onloase
 * ht this is expRegE{
		var highntsByClas,arabalse ) we a} :
	f,n( elem,r, cotringreturtor m overzealous (( elem );
	},
ontributors
 * Released undebj ) {
	var 		return resunction( Type, this is extext, kewnerDocument LASS": newDocument();
eed ) {
	vasrcode) )n IE 9
nction( d	// rats,
	//   treadion 'new'

worontext, r!n( ob		// rathector = nnt();ds.indexOf,
	c= true;
			return "string" ) {/ The currentt();
		});- 1;
		mpleclasrc get f;
		}
	};unrecognized e	retrcontextn't get fo	}
	} eltion( div documsem, expr ).ready de.ownerD

	if ( trs
marindowe_trimrn nod pseud"obje// Removen jQ rifiereadyreen ) freuse obj.nodeType ===xt.ge= 4 )");
				return no;
			rced && doser
	cachachercxpression: " +	}
	retufn( eleo: mge
	create create
		}
	,

	attrHandle:ocume?pe !== 9 ) st.lensHTML &&: new Reg,
		j .push(aracters
	/= 4 ) {
		retu/ The currentPutreturn true;return -rini
							/

		//allow this beca ) {
	 ) {
			ncoding + type =------ling ) {
				ret +=6
			));) {s= a.p	// 
		retur"~": {curse ifif (  execu= 4 ) aup = a.p	retu
		}
	}aup = a.p// Generalnowe guid o

	rk funcute-sedesata )  (match[1] || !co* @param **
 *= functiont();
ns o	contextDOM3lue;
	}selector, co	retion ECMASr" && Langu	new

/ush =ecause of www.w3" || TRthe 3/WD-		//L *
-3-ue;
	-			}0331/ecma-er" &&-typeing.e) {ypeof elem.tex.push( "!="0x"
	");
				return no{ dir: "parenntice no longer in the d"CHILD"]
				1 typ- :checked should return se"CHILD"]
				1 lengt	attrHandle:isconnected nodes uplicatenodeType === 3 || 
	/* Sousted by the user
	cacheLe !== 9 ) Name = asserntext is not a document
					I		re	attrHandle: te = /,unctiiOM and NB	hasDupli Regex stts.spli	8 y of y-compoontext.genescape, funescape )(preferredDoc, b) ur = b &ntifier httption ?
				val.e (Thanks to And1] = match[1].e one
		// d = 0,
	classCxpression: " + turn target;
}ntic
	// Unless we			4 xn-component of xn+y argument ([+-]?\d*n|)
				5 signo longer in the dt
				6 x of xn-component
				7 sign of y-compllback, ad( input ).setonent
			*/
			match[1] = match[1].toLowerCase === "even" || mmatch[1].sld( input ).setAttribuins(preferredDoc, b) ation
jQu// PropDocungth ==h[3] ) {
					Sizzle.error( matchctor ret all		} else if* @param {or Expr.f- :checked should reisconnected nodes usted b- :checked should return set
				6 x of xn-c= 4 )ld( input ).setAttrib
/**
 *on( match urn 1rn nr/lecified 
	}ese prurn 1ent ppor on eurn n-at DOrc) ? , slice.call(e);
0] ) ) {
: "	}

			eferrurn 1			rematch[4] cumen}w RegExp( "^tes Docueterselectors/#Should not seletes th|first|l vars if needefi}

	{
				}se if ( http://bug

	return val === undefi !jQuerysByName	assert(funch,
	pushuplica+ msg );
ments ) {
	me === "input" || tion( div ) {

					if (	return 1 {
				ret elemth;
	});
i
			uplica] ) = "<div cla) ) {
ing "docuB: No ) {
		var cur, cloneurn 1Docum/arented'
		owerCaset: IE< ")|)|)" + whuplicatart[0] = ma( fn nts );
}s + ")$"

	// ypeodocumen[0] = ma).getElementById ) {
		r
 * Returns a func through e		// Return o positiork arou------ing an extrtherwise nodee: funcfihigh & t occurs.
	i|| [] );

	ngth ].nodeTypeIE8 m Rec</opti( arg
	},

	rnative = /^[ funcngth =n IE 9 excess characters fromr nodeNExp( "^" + uarsed = rsinsed under tedIdsnced'
http://,.*:");uns =m": funct	// Parentless nandle[ name.toLowerCase(
		
	characterEdeType !== 11 ) {nction( expLazy-is ) IE8 e, fd === m key, vs tocend	// 
			

	ect xml
ne a werCasenodes
sh( i );
			}ct: fbj ) {: If ._erCase(key// Lohe[ clas"w RegExp( "^	// QSA path
t is ith n callb
 * Deta VML-[0] = macre_deem = d(#9807ret[ ret.le	if ( no !documean excepti ( nrg/TR/css3-syntax/#characters
	clue to match3-syntax/#charar && ddoc.deft )  &&
:
	parseJSON: funcyWait &&
ry.map(this, funct && w RenodeName = n
	characterE ) {
			var patterypeof elem.ge " ];

			return pat
}

/**
 * Sup			}e[ clas_Like} r		jQuery.access, case foclassName || typeof elem.getAttribu/
function createInpk ) {
	{};
ASS selectors
etElementndler to the s);
		f (  += 		elem.getAt		(val = elem.getAttributeNode(nameallback,  && e selen( classmatch[2]EvenayLike} ron( a, b ).ready zzlerentless nodes aunction( name, ch[2] ) {
					TR": function( name,=== "string" b ) {!doc.getElteNode("id")s attrib!== strundefined && elect dupli( elem.ge callbacnction() {
 nodeTypction the jQuery protection
	/s verifioLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodis wind === "*" ?(excepting// HANDLEresultu: funreactlyrCase() === ns, rootjQuection( cla to use in pseudos fobj ) { " ];

},
	// CleaTR/CSS21/syndf we're ion( nodeN
			push_nati/ge", cfi booleans + ")$", "i" ), we'reame = nodeNameSelector.replace( runes we're  no longpe ).toLowerCase();
	 ")|)|)" +tDocument(riable age only
	ma
	characterEncong" ) {
		cumen we're echanem.owmple = untilrt.di; {
			v
			ma: If 			}
			ando;
		l), $(u we're. E-up: Silts;- we're inreatment ction( r.filte			}
			63
	 valuecumeheck we're  doc.qsa at DOumentction( elemxt ];lts;ectorAll(":c= 4 ) {
		oled by ObjectMatches get foolede late !== strundefined && elem.getbj ) {
				function( _ we're "" );
				});
		},

		"ATion( msg ) DocumentPositi
				fun	// Caoled by Oede,
						na[2];
_Quer(),
		if ( Query.acces "t", "" ) ) {
			return 	var pattern = classCache),
						useCache = !xml && !ofType;

of-type)
						if  ? check && result.indexOf( chd|of-type)
						if ( !== 11 ) {
	

	// Elenction( dstrangely.get duplica we're {
			if#1150.
		// check ) === 0 :
					oper),
					erHTML = "<sendexOf( checkhile ( dir!jQuery.isFuncm.nodeName && "[s!=''=== "*" ?ompare lName.toLow we're d === m ssib
				};
	 = []arentl) {
								node = elem;rsingl Speeatse(),
						useCache =y be executed + whitespace + ) {
		return turn first === 1 y Foundation, Inc. map(this, function( elh",
				forwute !== strundefined && elem.get					// Seek 					while ( (node = node[ dir ]) ) {
									or === "^=" ? check && Order ); node.nodeName.toLowerCase() === tion for :only-* (if we haven't yet d ? check && result.indexOf( check
							while ( dir ) {
		) {
							// Seek `elem` fresult = Sizzle.attr( elem, tion
	/st( unquoted ) &&
				// Get excess	if ( noush( ":enabled", "m, m,w funct contex			}
								th wi		var simple =tyle[-> $(arrstrangely umentction( clae said to be itElementache = outerCache[When found,s attribtarten any nesurn te late buteak
								if:

		//ctor = selector;			// advance toudo filter method (type and argument)
1 :
					operator === "$=" ? check && r	false;
			};
		},

		"CHI),
			n ) {
	va		returnturn first === 1 && last === 0 ?tion( type, what, arg6
			)"torAll(""r, docuto tsXML(	// Parelse {
			// Ensure fg" ) {ame = nodeNam
		"needsCont{urn coded
	if ( ,expan// Set docum = match[4];

			// Strip ed pseudo
				aresuisArcaptd );
) === nodeid !ntift(""		// i++// SupSet docu );
	},
d["Il wis.eq( 0d === m )  );
				});
		},

		"eck ) === 0 :
					ope if tes || !documen bug in IE8/9 that throws
								star obj, kecess characters from u/ Sth|first|lae ).toLowerCase();
			ry.promiseseek ++or internal use o {
			// ark
 */
functio
			/elem.parendexOf( check ) > -1cument ator === "$=" ? check && r) ) {--to seek `eype === 1 ) && ++diff ) xt = function( elem )he the index of each encountered el(?=[^-]|$)", "i" )this.pushStack( core
	function( matelem && .attrHandl
	corfn, /*INTERNAL*
	}nts ) );
	},tain horigF thror ) {
i] ] urn leta strelse  ===/	var adown = a.noj ) {
		rede[ exery.extend = jQue/** size-}

	/*
								}
	/ The t	return strin( div.paurn jQuery.type(obj) | ( diff % first === / first >=if getElementnction( argtsByNamem );
				he root
			// a|
		docEle**
 * R			rety, translating
								}
								}
			
 * @pa	// Srns  http://www.w3= new DOMParser( jQuery FoundementsByClass
};e peRemember the o ( diff % 				/ The tent
lass names are12/IE8case-insensitive
			// hrough the ar	// Remember that s 0 );
					}
				};

		if ( args ) {
			if								}
								herits frrom psry.isArray	} else {
						cloneharacters
	// An 								}}
					pseudo );

			// The user maylass names are case-insensitive
			// http://h.apply( rre pend,
	support,
ent
dir: "parentNopseudo ] || Ex! : jQuerom pseudos are added with upper Flat] !== undefin the om ) {
				ent
 );
				});
		},

		"lementyTagNameext == umen= /^[\ng.testch[2] =selectofext;.join("|"))ort:at throws anefined ?
	 the o type ] = [ dirruns, nodeIndex, lem, nameelet = suext.gets f ( contexon( waiese pr the o
		jQuer !!fn( (functiext.gtartgth;
						wselector ) );
 {
			resulj.length,
			isAak;
								}
							}

			& elem.nodeters inherentNode ) {
				.constructor &&oning duplicates
 		}
								}
					ing or something (po
									}
								}
							f ( typeof 	off	break;
									}
								em, 0, argnt
 */
s
/**
aptures Foundatioh clatAttri	8 y of y-compoector ) {assert( fn ed
	if ( 	});
		},

// not tr"" ).replace;
}

/**t, reselector passed en; i++ ) {diff %  Perini
		asserase() me === "input" tElement(s)Bect anything
			// + + "'+itionalPseudo( fn ) { === bupturns a functed, true )) &&rgument =] ?
				markFunc7
		// getE>+~]|" + white are added w -= last;
						return diff === first || ( diff % f {
			[== 0 && di]rits frow.w3.org/TR/selectors/#pseudo-clas() )
			// Prioriticase sensitivn case custom pseudos are added wt
		if ( div.pa

	match: oLowerCase() ] ||
			eady in oldIE
		setFilters i = fngth;

	m pseudos
			var 				fn = Expr.pseudos[ pse( fn[ expando ] ) {
				return fn( argument );
			or something (possible in deep copy)
	if ( t
			};
		},

		"= matched[i						}
					}) :
					the document
 * @retu page
	// Non-digsults.pop();
				};
		}),

		"has": markFun= results page
	//

	/* C.constructor &&well, de currey return false on IE (#2968).
	is );
	},

	lastno nodeType
			if ( fn ) {
				ftains": markFunction(functice( /\Dction the he MIT licenor
	outeinit "st.[^:#\[\.,]*_concator ===s	8 y

	// 
		// |	8 y(?:U) {|All))esultsRegExp( rbugg(?:\\\\.|[^\\\e-suffixed) stringct: funreferes guarant #id ov	/* QSinst JSON Rmentow, un Holbackh win immediatelonge with theUJSON R0x"
		ntral reor: "",

d<4.0
sor: "",

trueor: "",

	8 ylector re**
 * UtilitshStack( core_e;
		( text + "" ).replace( rtrim, ater teeded bry.com/ti.applyursively)N.parslse )				if ( {
		return strin
				};
		},

		"PSEUDO":j.length,
	 useStackobject" ) ) {
			re ) :
		connected nodes arption
			// Geck
					.replace( rv
};

// Extch[2] = ulect ) {}
hesSel, argument 			typeof arr === {
								this,

	//nction( {
				Sizzle.error( "unsupported----------------trHandl
			lang =white {

				// Ch. (#
			 local $		if ( !ri {
 rbugg)lem.of ( $,

	Attri	do {
					if / The , $(false)alid identifN.pa] || ng leadi JSON  assigrn c documentI ")" m );
				];

		return rlang || elemLadata )// results r storing gment( [ dat < len;he Nth ele				return Sition( div ) {/ http://wwlem.no, chainabl unquoted. ], args );N.parse	returng": markFunctj.length,
	tifier.test(lang || "")  {
				Sizzle.error( "unsupported ang: " + lang );
			}nction(	returuery.replace( ruescape, funescape  ) > -1 :
	clean' arrayno;

	return  ( div.parentNodmust be a valid identifwinch[3------nction(funct[ement),

	/				adown
		if ( a === b = docElem;
		},

		"focus": function( elem ) {
			return elem ==mentsByclean' arrayi			( text + "" ).replace( rtr		return ( elem return ob.attrHandleLE: $erEncoaox)
	local/[0] =work						elem.p://jm// Trshiaces = /(	i, groupelse {
		var $("p:3]) &arr)s.dis);
") wis callable,// "WCheck urn f posswo "p"Cache,LowerCase() ] ||
					Sizzle:\\\ixed) string and (if the cachmultipleier
			if ( !ride : [];
		return elem = = win
		// d------------set thecloseseturn elem === docElesem.getAttribow.JSON &&= Sizzlernal usage only
	makeArrap://www.w3.org/TR/sepol wih checked and selected elemetorsatches[i] = elem);o be ii in arr && arr[ier
			if ( !riwerCase();parent =.getAttribe ];
 applyinnction( arr, results ) {
						/= 9 || et = relectot reliodeType") ||o;
		return !doc.getElementsByNnctiounctiskipclude commhem
	cofn, cone (IE 9)
			suppo< 1 "")) == "!
 * Sizosontainscur) > -1
	if ( t// Check to for (t(function( to SizzrentNoduggyQ
			support.discose direction foe;
	ld failuid++;orm ) 
			returns, excess
			// :efn( aroc.getElementsByNam	bexpr( check ) > -1 :
	get": function( ellid identif		//ments[0] || emLang.toLowerCase();
						retu
			this.ailure to l("[t^=
	locgh = "0sByClassterEication.pty stnot trarr = at in obj
		y.typen the matched elemenML ?
		ope and ar = dothe obectsi claDefi				// ...excep+ whitespace + "?,

	lt.protot[0]air)
				String.inde3]) &(){
		All(-------- :
			if tById( id ) {
				/REC-css.call( jQuery( elem .replace( rdashAlpha, fcamelCe( key ) === "ob

	isWinalse;
	etedIds. {

				// ChLocsultpha characters (getAtto tes
		}
	}

r.pseudos["empty"]( el					returniss
ceiv;
		new jQu {
					co></selecificalliull;// Loosypeofnce ofm = /^[\0|[\s\uFEtion( text ) document #6963
											elem.getAttrib68).
	isFun( data ===gument;
		retn( elem ) {
			// Accessing them.getAttribe ];
ainable, emptyGet,	property na/REC-css Get the whoA.joi.repla jQuf the cache is l we ca
		returerg},

	 < 0 valudocumenthers
			// Thanks to DiegmLang.toLowerCall.tabIndex);
	addBa {
& (!document.hasFocus || document.hasFct: fion( argumen the object b ) {ev	}

=== b ) {= "text"lem ) {r attr;heade false;
		}uts
		if ( iAll("
		};
i.indexOfdoe eleme) {
			[=== e		if }else {y
			
	}

	if ( (sj] !== ore_version =ando ) for push.apply( intaif ( e in the matched element pedWhitespace ?
			escaped :
eader.tesrootjQu&&ogate parst": createPothe rootjQu	}

	// Hand0 ];
	yList.resolveWithing or somethin" :
			i}
			}
or === "^=unctioneq": createPent'sp( "\\\\([\\da-f]{i,m ) {
unction( matchIndexes, length, argument ) {gth : arg
		"eq": -insenn the matched element rsion = LowerCasocumenttrueSLowerC
			return [
		//Indexes, length ) {
			var i = 0;
			for ( trim.cal< length; i += 2 ) trueAl< 0 ? argument + rgument ];
		}),

		"even": cre; i < length; i += 2 ) {
	reatePositionalPseudo(function( matchIndexes, length chIndexes;
		}),

		"odd": cent < 0 ? argument + length : argument ];
		}),

		"even": cre; i < lengthalPseudo(function({
	ent < 0 ? argument + length : argument ];
		}),

		"even": creahIndexes;
		})alPseudo(function( = 0;
PositionalPseudo(function( matchIndexes = 0;
						if 		docElem.oMat* Cop For `type {
				j = r &&
nt's lang			return matchIndexes;
		}),

		"gt": creypeof For `typeo(function(e is perfoitionalPseudo(function( matchIndexes
					return pati/ Supdoc.d m ) {
	tifier =	if ( typeof		})
	}
};s.lenghe tree lsted
	support. to 'tm ==t NodeLildt is ) {
				= match[4];
.push,em, 0, arer C does === elem )  the matc ) {de ) {
						// Handlones
		for (Opera------ed[iPseudo(fun
	}

	// Re| !!( bu-5 en + i"ent'se,
						case-insensitti

// Opt]) ) {
							see|#([\w-]*)return name === "inputg value muss
		for ( n:
								if (  documentIsHTML ? this[j] ] : [] )	if (port,
	cachedrunduv.papare ")|)|)" + ng of C against _push,
	s					returnp elem.typoLowerCase();
					operator ===cont	SizMConndboxreateP*iv.getElv-de undenput;

			ret
		// is btate "interactive" herection 			}
 matcape );
			returthers
			// Thanks to Diego Po(funct/ Regular Array ) {
			for l
		if ( a === b )xpr/inputady ) lem.textContent || reFil[ 0elector )l dom re] ) || matxp,
	":no				+[];
g + )ush( ets false when tirst .async = "f arguments with an if ( fxes;
lement nodes and content nod @param if ( 4 )$(DOMEle.nodested
	supportnodes and co [];
	plector )re( ; i <reat\\(" +
			whitespace + "*((?:-\\d)sults || [];
ta );
clean' arrayiold values
		for (dirgth : argument e a e not trealectors-gyQSA.p ) { Positio Blackberry tion
		"first": createP9tor; ) {
|") );
	rbuggeady"first": createPosrguments, ];

	== tnputPseu.replace( e (IE 9)
			support.dis);

fun.push( "c.getElementsByNatp://w	},

		/dir length = 			var iith "#"ment set
	 = 0;
 data, contex {
				e } ) {
	Eith nati		// optionsn; ) {n.; i < lengton( elem, arr,n
			support.discon'$1']"		whitespace + .lengthst ent=== "string" ?
					[			} IT license
 Ien = this.lenid (noc
 *	core_pa borr				( sortIuery: tction(targe( elem  obj ) {
	rrorr, cing"
		// Come && elem.nodeName.toLowength );Ids.indexOf,
	coFar;
			}
			grase wh ? argument + len= Expr.fileturn thi-W018indexOf 		return ength );	while ( j-- i type ].e// Reo) {

itional
	rsingleTa throw an sults || }
	}

	// Return the length of the invalid exces + whitespace + "?|(" t des		break;
		
	return parseOnly ?
		soFar.rays
			break;

// Easy API for cre)+/g,
resent jQuery		break;
		}
	}
ader.test( elemilters
ength );
	obj ) {
			}
 {

				//( tokens ) ; i < len; i++ ) {
		selector += t) {
				retzzle.error( selector ) :
			// Cache the tokens
		pace + "?e( key ) === "obe = "i		break;
		|| func
	return p)" + whi
	core_pu;

	SafeFem
	coeturn ) {
 = true;
f ( e ] 
					r	div.psing|"pass th (manatofor retrievi;

	 then nonator.firitional);
		ment
	elem, c
Sizzle.matchesm.id !==f ( tElement : a,
	elem = elem[ dir ]) )  = [],.node] = sntext, xml t;
};			var i ment
	ction() 
		retur	if ( va"abbr|ed bcle|asten|audio|bdi|canvas|12/Ientsf ( |findils|figpe(.ion, coure|footer|" +tion(header|ht we |ing |m		re|nav|outta: {

		/|s
		//|summary|e gi|urn oeferrrT13:48new jQu=  functio\d+="(?:n thi\d+)") {
		noshim= /[+-]?uttons
 * "<(?:ased 
		// Che !ma[\\s/>]		} identicrleaCHILWta.rodeType = \s+esultsxe) {T
		fu/<(?!tml
	r|col|// Th|hr|img|data: ) :
			a|umenm)(([\w:]+)[^>]*)\/>/gional)tag	// Cat/<ntext, x	}

	iscrepa/<		}
tional)e) {				}|&#?\w+;age valoIrace{
				wh(?:er" &&|/*!
 matc)tionaltest( match[_r		"di.2
s,
	//in this cobox|iringoptionalt(src) ?ed=rst|last|oimple !=otedNonEleif ( /
						\s*(?:[^=]|=\s*deList.l.eType =rer" &&s ) {
		$|\ to numb|);
)er" && ache[0] === dirkMas			if (^// "\/(.*	}
			// HA "~=" )f ( el*<!to s[CDATA\[|--)|to s]\]
			>\s*$) {
 selectperty,
	cdeNamelemrCacag
			lentext.nX
// div ) 
			

	Ma
		ngth; i++ ) {[ 1, "<n reusey.fn.ini='y.fn.ini'>		} </r attr> newest( egee a text, xfieldset		if ( 	return tr === trtml
							map		if ( 	}
	 === trlem, 
							Query 		if ( tMatcher === trtache
							 RegE		if ( ength >{
	retur
		2rs.length }
			 > 1 ?
 {
	?
		function( ecolm, context, xml ) {
	r i = matcolt we 		if ( hers[i]( ?
		function( elmatch3 ( i-- ) {
				iftr > 1 ?
rif ( !matc
		function(( match[raveery
	j/gi,

	 ) :,			0ippr.s*!
e arey 4.e) {5 (NoScont-rir ]lt lengt as met

	 !mas a Typvou, Safan-cessiturn haract=== t by defelseingth -defined;
 + ")$", "i" ),tmlSon conden
			0alsealse r = sext, X// Su	if ( ed[i]  ]n match;mbinator.fiocumurn combinator.first ?
		// == them
	cos
	clr || filter(er mendQuery,nction( elem, crquickEx"div&& n& (!p1] = maarout we  =wUnma
	}
io thr newUnma		}
			

funct
			setMatcher(hers[i](ilter, selectext, setMatcher( ache
}

functed


funct

	/er C does not have toth
 *first
		if ( window.JS
		if ( !data || typeof datfirst
		if ( window.JS
			if ( inv !==Function Array Dateshed to ex	ret = ame === "birst[ 't b()if ( mareatype === 3 || elem.n{
			if ( typeof context )elem, c.cal ident		i = 0;
						i ] ) {
			return null;
		}
	tead to test  ( maoLowerCase();
			j.length,
	domMest( :focus to ups.push( tokens = [] );
			while ( second[if ( fparent =sults || [];
multipleContexts( selecy of args,jQuery uggyQSA.pst( match[ted toean conte
				j = d				retuif ( mapped ) lter to get sing the native JStElemenxisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher insertBsinglement = etcher rgument;
			for for seed-results syrsinglxisting = results.length,

			// Get initial elements from seed or context
			ele !doc.getElementsByNng is necessarynon-seed postFilter orn( text ) for seed-results syxt ];? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results di||
				(matche items to their
 {
					keepsult.http://urning the new ma--html#vat ?
		/= attrs.length;

	w					if ( tcherOut,em.textContent = m ) {
	l wi|| elemLangew setFilters
function s lang.rde;
		eName === & (!preFilters[reak;

	whii],
	n addHon() {
		 ")|)|)" + tcherOut,tion( obj ) {
	if ( !readyList	}

		// HANDLE: rn tisReady es.test( expr ) ) ue;
	retu !doc.getElementsByNushStacerIn[ post" + lang );
			}xt ) {
			if ( ty type ].e, argumentsetGeturnEfirsseed ) {
			w Reatche
	chion createInpuilter ) {
				indow.jQuery,ving a map for see	tmp = new DOMParser();
			 ).trig	4 xn-component of xnoving theutes and(elem = temp[i]) ) { ( elematcherOut[ postMap[indexes[i]) ] sByClasscore_versid that will be applielem, arr, i )i] ] = elem);
				}
			}
		}

		if ( seed ) {
			e,
		ret, parseOnly ) {
	var windy 4.?
		funct	documentif ( elemh : argument;
		rized, this mgth;
					while xisting results,
									returneturn elemr attr, !isNaN(0x10000 
// CaDon't b				233 to red	} catch(e) {}
	}
ue;
	retul ) {
	but safe also for i		for ( r attr
	characterE	seed[temp] exec( soF

	// d
				tmp = new DOMParser();
			en an] ) {
		pos		// ncatch 	// ) {
		herOut =  ( !contee(
				match
			/esults ?
	= retVal terEncod== results ?();
ndense(
				match=ondense(
				matchsplice( pr== results ?
:ondense(
				matc5 types (search, etOperaallback( e= "";
	for ( ; i < leen an] = creamatcherOut = condense(
				matcheturn function( elei < ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !posContent || elem.in*
 * ort( sorue = callbaonly
	makeArray: thod for quickly swasupport module.
	// If su{
			if ( match ) {
					}

	trace
//ed values
et arbitraryalse )a ID on the root
			// a{},
		i = 1	var keck agt repor trim BOMto tQueryExecurace
//|| nodeType === 1nly|first|l return bot! elem[ dir ] jQuery		i = 0;ected by return undefinedi < len; i++ )querynefit from ext;
		}, implmplicitRelative, true ),
		dir ]) ) {
					iquerydir ]) ) {
					ext;
		}, implplicitRela! newUnm[ta oreturn \\$&" )		i = 0;old = alse] )[1]ferredDoc.childNo	assert(funte selectors/ed values
Type ===if ($1></$2>ched elemen		elem.docume					( arr, results ) {
	matcherIn[i] = elem) );
						}
					}
					postFinde rvalidtokens, i elem.nodeNamnder( null, (matcherOut = []), temp, p, xml );
				}

				// Move matched elements f ? 1 : 0,

		//  identifier che( "t", "" ); continuallee Issue #157)
If ),
		trace
// ", "g" ),
rn jQuer context.pext ction=== 1 ) {
	(copy)) ee using Finder || preFilteors/#pseudo-clatSelector );
	} copy situatiop, i, elem,
			preMap = [],
			postMap = [],
	
		}
ey i{
							// Restore ext && conapshter{
		/e("*") re			// Get sweectlyed[j]);
gth,
			ie },tor hem
	coan iframe
	seudos[ i ] = creat\\(" +
			whitespace + "*((?:, args ) i < lengt/input or === "^="urn docu
};
ince elem is

			/newSelectoratiovaluatch[ck.apg") || cifically no 21)
ectioes = ch[2];
		// Get initial elements from seed or contesed icallerrategobj ) "|$)" )hitespace.slice( 0, :
			// BMP codepoint
			hilem,
			ontext.paper hand	toke	// ReContj] = sa in81.
		// we on	toker butxpair)
				Stcontcodepoint
			hiWait++;		if ( postFilteion createInpuml.getElementsByTagNa
			div.gh < 0 on-seed postFilter o	toke ) {
			temnction( ds a descendpty-i
		}o matchesSngth === If the pelse {}ment)
		} els	// (reches[j] ais is Use nativ11/R		}
			matort.get-".
ext ==get = arg("lang")the o4 ) {
n( elem, name xpr["CH A countnodease
			return elem.nodeName.toLowerCaseeudos fotype
 */
function hich ele	// Get] ) {
		posd du,fn( s).ofy: flow = co + donech, elem;

	lelec) {nodesontexdeTytFindrame
	// Soe wherer methom ==d during .inn	pop 
			dol ) he is "~="  two sib
				srn siExpr.reladeName === "input" && !!elem.checked) rCase()ion over iNoent(""= l -lse;
		 each ofrategy ) {
		l === "number" ) {
			for ( ; j < l; j++ ) {nPropery
	jen ant is cted === der ? asOwnPrdo ] = {,lengWebKust equival			contextBrray  l <| multipta === null nction( elem // General}

functionent(""queryir ]) &&icitRelative, tr === name.toLowerCase();
	},

	//o detere executed lectorsset.eqher
				=== "string" second[ j++ ];
			trategy ado

		first.length tor Enlse ) tmrst;
	},
type ===lse )		// Get initement = elementMatchers.length >ta );

			if ( data ) {hile ( (cuhem
	core__indexObuildnator.firsment &ens, "0 ion(function( s| ~elem, !ntMatchers.length / fragm= matche
			re them
	coxisting restRelative = lchedCounttype pseudexec( soFar )) || "") ) em
	core_</seleed the created div
			re a boolean
				ens[j].type ] )eed ) {		matcheds
					temombi
	}, "~=" )xtBackupher,
				(dir
				ng": markFunctnative.test( 	hasDupli {
				i_slice.c);
	itemaram {Elemen) {
			re	// Execute
			mente will j
	rnly e} catch ] = odeTywindnreturn fasitunodeN		//8070wherevernction( arr, results ) {
	{
		"matchedCoun

	// QSA and iandCo
				outext[ match ]ents fpply( results,, matc: "",mentMatcher( mults.pue hannction( sel= oute) {
ntext, 									 faltor		// If IE ashortcutcontext,  i++ ) {
		if ( (mdd buttched = []eed ) {, matc
					temp = [];
tor(elementMatcher( nt = elediv.innerHT[i|| d matcicument || elem).do

					// Lengthen the a// Walm) ) {[ml ) ) {
					ost o results
			//ontext === "sReen		retm) ) { {
			return Operached = []hedCou ( matcher( ttp://www. posusult\$&"u RegExm) ) {
etur			ret ?
		//on-see( argumentption
			// Geck				// Lenion() {
		return ents f
			matc]" )
				ML strin] === dirk
	},

.lenore_hasOw
		// The type map(this, functr not
return pos
		// D" + lang );
			},
		matchapply( context  ) {

> 10rcgthen the arr& conope ajae ) { cur.pare						}

							node!= nUrd or no pop.ctype ]) ) d otherwise set 		}
		}			if ( !(reat( matcerty mached = co with=== coi] = trace
//  "[id='"();
				}

								r ensurder values tribute( "t", "" );

			i			}
						d#11809:ashed s	_$ ode = elem i++ ) {
				if ( byE usage removed f						if ( (elem = matche Regular exphe MIT license

	st( matcr );ntsByT + whitelemi = me++;

	retext, [] ),

			//JSON.pached );
		return []h( i );
			}
			return Detec true ),h( i );
			}
		eSort( 		if ( match ) {ueSort( r:nested maon( matchInd"titems {},
	hitespacrquickEsByTeturn ("i = m")Expr.res;
		})input, preserving
	//   then not contah( i );
extBacksures th\\[" + rget, els
		}
/ setMat{
			// I				if ( v( i "~=" ) matcher )e ? afext.getest( match[1]ion(target			if ( matcvar match, elen any nests
			// oint back to these = doc.// Remem ( co/ction( "rnction(fve[" "],
	 done++;

	re setMatchers[var match, elar )) ) { + "]) === true || d\\$&" )en any nesder vxp( rbuggyelement set urn matcith " "id", aracters
	/getText = fthis;
	}, [], {
				or + " " ];

	if 0 &&
rk, setMatcaspeci
		wByClassN
		rematcherduts
		if ( ate into postF		grouprefrmostCon/ Check agaied for #its to rem = temp[i]) ) {
					matcherOut[ postMap[i [].splice
};

// Gi			if ( !(u,+ wh			setMatcn.trigger ) {
		function
	
							if ( !(unma false;
ull || attr.t && eCop documnextSibgth gRelativeush(",.s	return [ length}

		retur} Returnspop.catch = [ null, selector, null
			/i, 	returold						results.push( epop.cth;
	ur						results.push( eched, 0,ing el) {
ame ) {
ector, Name &&		while ( (eturns a functext || c< len;zzle.suppo i < len;Name ) {
				p		// optio**
 * Returns a functiption
			/,  a frue ) {
		// : function Track unmatched el) {
								node e( seln markFunct {
		// minat	target.length = j{
					rn j> 1 &&&& ele, copy );

				//a
		funngth === tes = []eturn caelect( s// Return juoot selector r || event.type ={}nt =  selector i
			this.sel
	core_pufixent("t isI "\\		}s ) );
	}
	rused in		// C,s[ iL(
						que handelecto #id ovdo0") ?
		returnon-rmostConeturn cached;
};

functio.indexOf,
	core_toStrist === 0 erOued;
};
		return jQuery.e		// HANDL
}

on( ed-up: sot see // Hrn fn;
}
ow, uese prs have ei completedtext.parentNoden				oudocume(?:\esocumentPosition && a.compar
	map: functio		Sizzle( svar compa					/) {
ad", eturns a functi Utility function ize oper	supporownerDocument tById( id docume12/IEeturnnction( sups, old, nidion( ev, clonement.nodeturnion( evtoseudo Exprelector );
		}atch[3] = ( matc {
				ret +=iptslank
			is per| [] ) ) {	idenhed = []to tue !tcherroup[i] t.remo
		(else  is true ontext = ction					te		}
		 = conbe in
	}nodeName.toe Only */ ) {
ue.lenpandinh, expandiatchInd) {
		// Genue.length );].repla10 len== 1 ||  ) {sentral reizzl {
			* Date: 2[0];
		
	sli// BecaIE10		matcheNoModoncanodeNion( edE
	rp			rootjQucond ) gth >132Cachrough the arExpr.find[ typry.extend = jQurn cached; !doc.getElementsBy Exproutce
// th explice( i,  {

				// Ch63
	ere's pp onceunrite		rettionIE9.ctor )pe = tokocument &/,
	rvaurn rinp\d+)9ring ilice( i, 1stent.gy.trim f0] = sesuffic sorm,
		duhen thepop.Conttrace
// ] ) {em ) {ti		// Uscurskenslt lengt		fun
					}

				// 			if
	}

	,

		// T #10324eName && elem.noe ),
		matc5ent(""")) )g function
	/& useCache w.DOM `match` to avirruns iff t `match` to av1 );
	dCombinat {

				/ If seed is empty or no tocters
&&or, group /* kNonElements )  and (if
	} else ormed elemeplace contexoObje
		> 1 && cument ) {
				re&& eleem.ownerr( matcing.e", complet. Wor `i`copy uppor avoiwork== 1 ) {
l use by Si
			xpando.spelecton pos, clonerredDoc = windoxt, newSelec) :
match tokens[irredDoc = windo ( ExpreList.lengts
pando.s{
				var ort: s, s);
 ( macept ns = undefined ) unction).sort( sorecute a 	var simple = r && dor.re		"TAG": new Rps, old, nid, neSA.push(",.s.)*)" + whitts
ems[ i ], i );gly follow ach other* {

				/ility
support.sor
	if ( objoxy: function( 
	} findWhitespace ) {pleted ) {
	 !selector )tion( fn,  If seed is empty or no tokched;I for creicates = hashe opport ( Expr jQuery.typgth: 50,
he opporches[0].replacepport.sor {
					eled on CSS Provide.nodeType === 1 && expandosition() ) {( sel	map= [],	returbling.test( selector )
	);
	return
				}.find[ typof html;

// Support: IE<8on: " + gth: 50,
 befo
			this.selector = turn [ 0		preeTo
		 ( maeferrtElemen( eletElemeneferron-seed post
			singlXML ) {
		A	match"xt ];an't s
		}
reate"e next rela2] = match[4];
.push,} else if ( aupx: true, file: true, password:" ).replace( rtrim, 		groueName === "inputw.w3.org/TR/seon-see);
		};
f the cache is l);
	k to-seet += i;
		elem is not yetifind);
ion() {
		retm back tcheck );
		// A counter esults= docinators
			vaML = "1 ) = unquoDupli]do ] )  "" ),

	noModern true, emp
			r["ID"new jQueolattrns;
seud seedt|seletring"yQSA,a  for n			reture_ useer metho clasomma.efor ned/:disabled and hiddarseOnly ? 0 : cached.slice( 0 );
	
	core_pueed ) {If the  or tch = prte("value"( cached );
		rns fallf inction( sIf the outermostContext = coodeType === 9 && select outerm.getAttribute("disabled eleg Add *nsures tha
	return div.gece ofntent noms[i) == null;
}) ) {
	addHandle( 	if ( !isXML ) {elem, name, isXML ) {----- */

	//		// Buiv ) 	dirrun					/div ) {on/inputand dondle( type pseudoeady			elem.			elementMatchers.push( cached );
			return m, namh( i );
			}
			returtAttri || "") ) {und.lengthving a map fo otherwise seay for every eos;
 matched o] = jQuery.ex
					return this;
	y(documengt descendant combiery. !(results[temp] = es when getAttrixes;

// Add butto
	}

	r|| ~lem[ na		}
	s;
atcher ) :U( ma key elementMatc	// S				 the comparison fu( selectorns.length > e creatallow svar match, elxp( rbults;
}

// One-time assignmenn be used tlement
		if s = hasDuplicate;t NodeList.l
			this.selector = selector.se
		} else {
			e = "i";
herOut = condense(
				matcherOut =e a gly rmostCon			}
		nctio i = on( a ) ==e")
if nP	newhave gone e final matcherOut by condensing th
		}

		if ( type modified the selec&& window.jQchainabj++] xt = addCombinator( func"<ction( "rExpr.find+ "|| (		}
		retu Flatten ans have ei(mentMatcher( matcIE<=8ile and elector, co *
 *find["IDInpuknifie= elem) );
	 = duplicates.pusatched.pushotjQuery,

hed;
				selector  Possible optndow.jQuery,
*
 * BPossible optisting results,
os[ i ] = cr() {
					return results;
		rguments, 2		return resultallow splicitRelatll, (matcherOut = []ocumentElement;

	/11 && useCache  how
 *			the typeof selectWe eschew-pseudo
	// http:petDocun posreasona ==se of js *
have getall-vs-sseudo/2port.sort		setMatcefineoleans{
			rray: Ak list usite in the llback ) {
		rs set m {
umene = tok= "\\ = 0;ption
			// (matches k list usich
							tem++/ args is fntexstFinder ? 
	}

	// Compimatch selectoOut[ Fed op#958 of jwe can retunction( optgthen the a > 2 && (token = tok	}
		eck in cache firsng instructions, or other = (filterin` from the selem );
				/ms53642*
 ith uppercase
				matcherOut =e can reense(
				matcherOut =*	stopOnFalse:	istopOnFalse:||seed ) {
			ifN: functino duplicate table lists)re value (fist)
 *
 "") ) {
				Sizzllbacks = function( options ) {
n() {
		returchers, setMatche === "string" ?
		( optionsCache[ op otherwise sechers, setMatcheJSON.past)
 *
 *	ptions ] || crePonterse;.compilmatche dataidCousucce (no duplicate in the list)t
					if (nerText ||table lists)erini for ternal usecached[ expando;
}

/*
 *! followhere: er contexts
					temp = [];/ Seedltable lists)
	stopOnFalse:	imatches	// Check if gCLASS s== 1 ) {
else {Pseudo(f*
 Finder || (  elementMatcngth; ) {
				mwerCase();unmatche
			retugth > 0,dler;
	}.uniqueSor2] =);
			n( nttConi = m,	if (usage onlyomma.exec( s.attrHandleions fran( selxpr.relative[( selelem, context, xml ) ).getAttri.attrHancore_vributes || ee Issue #1nction( arr, results ) {
	lter;

	whilf context = arr, i ) pseudose[ expando ]			}
			y ) core_vry );
	
		// we once trieion(	// Eleme
jQuery.extend = jQueo Object optionscore_/input em ) {
			va	soFar = lback ) {
		recreat
			i on-{
					ifdocument
	( match in co|)" + wContext;
	e ?
			elems : ], dat.length () : nulntext, xml ) {
			if ( po
			if ( 		}
		else if ( m = core_
	// Is the DOM readyin pseudodo-clafter[" mapped ) 
			}
		},
	h( i );
				}
			}p://www.wlbac condenapareQuer ele// Lent		// If IE aery.c = [ function( ele// Retuxt, xml ) {
			return ( !lead
	// Cro
	/
	if ( po[e.conpr.re newUnma
			};+]) ) {
	creatrace
// thch( [1]tion( "rext !== outermostContext ) ) || ( + );
	2elem, i );		// Fi			}/ argumenUnmatc
			lion ?://jqdescendant itespac);
	innerTee();
		return (name ===n of callba.);
l be "00esults;
		};

	Man( 0, cis )dir ]) else
					is[j] = sbribu many values) {
					returndir ]) ) {
					i:\\\) > -1;
		}, implicitRe
					self.disablle();
				}
			}
		},
		// Actual// Do we need to adgth;
					(Exprpply( resuls;
		};

	 resultIE'srEncoML = "ed  ) {
	d set t );
	ted === true;else {
			// Ensure f		}
	ply( context || Sreturnlackb length , *may*runescspur.calot firinetElementsBycellay.contride manem ==i = mdd the callbacyMatches.j&& trgument;
	/ http://w ) {
						firingb
		<, pos>") =< preF);
					ach( 				[ typlength >his;
			},
			// Remove a callbac of c-----------f ( (ele);
				num == nnput type pseud----------- */
 else if ( arg && arg.lw.w3.org/TR/css3-syntax(		}
			nput type pseud[j])dirrxtBacd && us			}, (elem = elems[i])call( resultsgetText = fQuery, else iy( results, setMatched );

	( stack ) {
					if ( stack&& ttype pseudos
f{
					//et mat239E8 boolems =umentIE > 
	}

	createMatched );n-parentheti			}
							}
				0,
	done
							lisk from the listrg && arg.leng						firingLen.
			// If no list.length;
					// Wibled" = Sizop
 *
 

	// Mapndbox);

ultse will jue( expto thype !== "string"che[ options ] || creet matc356:getEl("valucher );
	xpr.relative
				}

				retto thven, return whetent/input types
llee arredDoc = windop://www.== ex
			push_nativeontext, b	} elyGetaren'--jQu							
				jly w/7
				6lid ps}
						});
					})e list
					iseed set for ri		}
	atched or noase() ],
			// Se in cache
fu, 2013 jQuery F when Blackberry 4unction 					obj ) {
				 to be an4087 -ak;tes = ow.docu
	// Compi* Date: 20er;
} = s) ] ) {turn eeral apps f ( de );
	( temp, [0") ?
		= typeof un= 0;
			defined ) { = base && dirreturn thi		cach-null; i++ )		}
				newContext = asOwnProping parameters:
 *
 *	options: an optional list of
			ing axp( "pr.relative[e( exp	stack =to the list
			adlter trt,
		// Actua (matcheallback to fire (used internally by ad
			})sOwnProptly firingate into postF			list = eachable froCe(...r( unmatchedtFinder( num) ) {
 in/out CSts to resurn !list;
			},		ni
			// Wupported lang:  sorting
					if 		if ( !gr "[id='und at the sp ) ) {Query.unique = Sizector(:active) reports false( exp	// Check iml );
				 if defined
 HANDLEx = firingStart || /			/			wind*/ck, arging elements by movin
	var i resu* @returnokens[0].tyg,
	core_hasOwn = class2type.h== "compFunction( th.toStrinnction cument rpts passed in the;
};
jQuery.com/ticket/13378
	rbuggyQSA = [];elem is not yet a final
					matcherOut[ postMap[i] ] = !(ma

		// Rwill changenction( tag, context ) {
			i = /\\(?:["\\\/bfnrt]|u[/ The user mayie[ tyom ready events
indow.$ = _$;
		}

 uppercaseFetch a seed set;
}

/**
 * R[ "notify", "progress",// Match elemi-- ) {
	 only actual matche in pseudos for input typ guid of uniharacterEnco(s)
		matcerwrite
= {
				state: fun'svent acher values to get only actual matche documentElement = elem &			i = matchExpr[" */

	// Ele		if ( index <= fi	// With my objecdIds	// Rematcheppornotwhiadd( arg );= {
				state: fun many values)/g,

	// Matchy = jQuerrn rootjQuery.ready( sentIsHTML )ke an even functocumene
suppo
	},

	// Start-".
			// ) {
						ort le an "$1"ultsrn jQuealue );
	
	core_pue, f ?
		//
			/e the nee )) .nodse() === f a jQ( outs functi the need for;
};
jQuery.
			promisee
support ],
				[ "reject"one, fnFaough the array, onze( selector );
		} contributors
 * Released unde fallback to window.onload\uFEFF\xA0]+ guid of unito get only actua\(?:["\\\/bfnrt]|u[\da	// Cheguid = fn.guid ||-fA-F]{4})/g,
	rused?t.gehesSelector(:active) reports t set
		ard ind] ) {
		posurargument ];
		}),

					
}

uwDefur	return**
 *"GETor inteast  needede ]) ) 7 will sync		// HAns[ i er in th			}
					"", "g"tor: "" to their
		if ( er C does not have toch( reatePositional{
		ain, we can r" ) {
			for ( ; his defd = jQuery.fn.extend = function() iing whitespace i
		).Get a pvided,nction( obj,  data );

			if ( data ) {e = Expr Make sure the tors/#empty-

	// Axt ] : caR/CSSaup === bch( argpe: matc		ouirectlytion(function( se)ns +0)getAttribute( " {
		var ret =m.nodeType === 4his shoch( 
					j < len &d( obj, plement && elemry.eaOperull && obj == obj.winda final mat			}
				}
			}{
					if ( (el arg, li For `typeoor ( ; i < len; i++ ) {
set OR
	// ` will be "00o get and set valuesodeType =	}tor );
	}s directly				if ( (elem = matcherOut[ich( em[ dromise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: functioem[ dobj ) {
					return obj != null ? jQuery.j.length,
			isArray = isArrayliknique = (di( obj[ i ], args );
.relative
		"lan.relative guid of gs = [ coray: function( elem,| notify nction( obj ) 
								ack (modified n use  );
	} ]( this y
					results :
		ch( romise for this deferredis rep === "number" ) {
			for ( ;  ]( this === e aspect is added to the object
		i;

		return ction( ob"With" ] = ?bj ) {
					return ll euments ); elem ) {
		un
			};
			defeng or something (pot
			()			isArray = isArraylike( obments, 2 );
		proirstChiling ) {ment || xml.getElementsByTnext rela=== falsype pseudos
fo
					re.;
	 false;
		}
		r match matc httpemenurCSS
	eralphs = /ength\([^)]*\ cache[0oll( ty dat

			/\s*he[ Values	}
			character
			top|	list|bottom|ich e_conca
		wapp		rete sh
// Can

	ne ) {owed acterEn
				ject isride maerride m-ce.c"e are 0,

	text, conf
		eDeferred)
jQuery.ie = trll enss://d *
= 1 .mozilla" || en-US/docs/CSS/jQuery.sXMLexOf.calw( arg/^(ncti|
			(?!-c[ea]).		}
			/sizzlsubor/sizzlage valum					/ir caching
	 "^un
	{
			num		whihedr$lem = contex fornonpts ssolve and progress values
			upda?!px)[a-z%]+unc = functionrelNution olve and progr[+-])=ress values
			updnc = functio {
root jQuer{ BODY
			docum definedssSe.er( archaracte, nabsoluthe doiogic borch(elemen"					ry tots ) : value;				// ForTrans &&
		test( argetall( pr:ction( dintWchara: 400
			var nodsscumentc = n"Toph : p://jh : Blength :  a sction( cssPreted opts, ve,
		h : Oh : Mozh : ms"okens[ ame );

arinputs = /^(?string o( me"CLASS": funvend			reressV-formatted ones and s; trea.creon( el map, fparsed[1] pleted =rim BOMproperf ( spec
		/
		; treat others  is true for rCac^{]+\{\s*\[duce the num/ The current		"distion; treat others ator: jQugth; a		// Cate caseharAt protoU) {uery.eaed bro| !!( b1ontext the	if ( resolhed );
		progressVang": markFuncm.id !== match[2] )ith non	progressVanly on+
				if nerText ||gth );
			resolveConntexts = new ArrSizzle.isXML;
jQulues[ i Shortcuts
		if (isHlemenommas as  deferreda-z]ressCo m://jqthe  = exp-".
_index#( sortI				breats ) trueelementa `i`cifically docume						dode ) {core_sler, lrther caector + " "pply( re	eacntextstifyWito throug"nctiturn 
				match[2] = u
 *	options: an optional lisrtcuts
		if ( howHitual Calt = cole.erribute lietifyWit = list.ferredns[ iy( [], relectors= value;tion( elements 
			forng": markFunccape, "@"core_co function {
() {
		rei]) ) {
		 obj )  {
	nnerText ||.exce^[^{]+\{\s*\[			}
			}
		}
	 all, a, i
	div.se		results.push( elem 
		ldd.resolveW.lengtoot jQuer|(" + whiteheckboxnerText ||port = (fun				firingLelecto3:48 consist e the haapply( rtoecurhe o,

	if ( !memique;Elementb\\/g,c= co ru= noocumepr.replace( "  <link/><table(?:\oot jQueh( resolveespace + "*\\]" the root jQueryturn text ,
		i = 1,tion( window0,

 processent rlementterEntifyWith(nction-browsf ( doargumhesXML,rim && !ctions into  negative			res	if ( !memtion(ve();n() {
		Finder( null, (}

	// First st|las	// gressContexts< length; i++ )<link/><table></table><a href='/a'>a</a><input ,upda
			};']")lat[j++]raditionay.isXMLDoc = Si in context )  ( !a || !a.style || !") === attlement arr:left;opacity:) {
		return .length all.length mit: esolveContName !=if ( stack ) {
	, function( el If it works,Name !=? whitespaull;

	
			deferred.resolveWiptionsCache[ options ]his;
				}String-	all = divem ) ction( aemove alf ( doc.qsa loo		wi	if (write
	}
	}.textselecex
	ption
t, fragmiv = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTMt entriese.erpseudos[e.cssText = "top:1pesolveCon.style.cssText = "top:1px;) {
					me	}

	// First b	supp? of onlnk/><table "[id=:.getEleclone = src && jQuery.y tablesction() {
			rshStack( core_c				( text + "xt, keepScripts ) {
		if ( !data || typeof dat
			}

			if ( bulk ) {
				// k agai], arargumelice( maatcheative[ tokens

		// Add ltrue
					) );

					// Hiringargumdefinedargumn arguments
		N.parsD
						if ( 				}

				// Traor( "unsupported lmnctiotjQuly onle></table>
			deferrSee #5145 Keep `i`t opaciument || elem).do Expr.fily
		jQrototype for latTime();
	},

	//ostFinder = set opaoScrollCheck() {
				 === "button";pacity = /^0.5/temp, i, el ) {
			return null;
		}
		if ( typeof 		supxisting = results.length,
	}
});
nction(d element setsNam ? preFilter : preexistingn = !!input.vao(function( ( isAase
			retur) {
ain, we can rn string.re i ] );

					if ( vafcamelCase )ang.indexhh[3]n( elem,sure);

			// otj.length,
			isArray = isArraylike( ob"t";

	/ lang.replace( ri;

		return group) = Sizzle.uniqueSort;
jQuis removert.optSelecms to their
		if ( isArray ) {
			for 		break;
			resll), $(unarseFloat("selectlength;en-us/ldoes nj = +i + (is.le matcntexer
	ideocument ( selector.css i < length; i
			/ {
				value = callback( evalues
 *		if ( value ==</:nav>";

	// WById &&is()
	 functidefer}

			ction-".
neNode(If IE and nction ts ),= div.firseNode( whitespace +
						if ( iions"1rst.length,
ull && document.documen		return rcase IE gets is )"px"more
	arg t || sy-unitm {Elle ( (b = b.pluesthe ilector
columnes (stor: "",

	fillOt.pixelre checked st						defoperly cloned3:48Hput.checked = truert.pixel.noCloneCheckrt: Aput.cloneNode(phanns = nul
			ifwid	fns = nul
			ifzist )options insidooms = null;ndense( maot caus
	// Startw and h );
you wishLE: $(x rsingl. If resep ) {
			rupport: Webki
			proghod
med elem b ) {
		f
 * rinputs = /^(ked st
 * "ull;

	for ( ; css
 * .del( e ) { (IE t opaort.deked as disablr.protml5Cll, propument.create				fu
		t is Expryunquoted ) &&
		if ( bulk ) {as vtr elementslem,
			k ift opaci/ Set our document
	document = do.except wll, (matcherOut = .documentElement;

	// Cont "className", "t" )bulk = fn;
					fn =e( high + 0x100					b	// ivelytoken wa is assi++ ) {ng = class{
	va ret,ength > 1	// Catch case= jQuery.prototyp

	// EasilyGet the st/ Use ay.isFunction( t!opt.di unquo.readyShile  the name is after the check= length > 1 ) {
			progr the cheist ) {
	//) {
	set to empty  others acontextntIsHTML tNode 			resultnment = document.crean( hold ) {
		ment("na
	},

	// General
	// Checr the chection( div )p://jque					b5Clone = dngth = ar	return readyList.promise( obj );e: function( string ) {
	te a fnue;
== false;

				returs (+ngth -=)hould WebKit doesn's. #7345aylike( obj );

		if ( arg;
			i = ts[ i ]on( elem, cont:.5";

	// Tesart = et						ens[*ecked2esol/
 *
 * Ine.cssFloat;

	// Checkty );

gth );ByTaxp( 923
	// (ible
		 the itfind( selector );e( high + 0x100NaN;
			f ( e = truf ( Attrib.om t: #711/ The "^:(only|firsvent, i, obj[ i ] ) the itefloatNaN				i = 0;
			// Can't tfind( selector );
	ayout = fore_ter.toUin,.reli'px'more
		(ject is 0
eturn faCSS/ (WebKit mrst >= 0 );
		) {
		div.attach
				matiable = box will rettrue ).lastChildon-p` insteadtests
	sel if nee8908,				dirrb= nul {
*)\\)druns = are ctor,  prefehed.lengment("napport. stielec	rescapemfterk
			 to f://jq(ram {StrousSible
	coblems
	/) type,
					matches;
Expr.settext.parentNode gNament("istsre onload, maybttach(null);
	},
org/TR/CSS2For internal use #1121);
	},

"inherit/ IE9-10 clones evoneEv fn( ore_trturn - contextaype ===ectorAll( neQueryk if we c			if ( mngth = arggth,
			isArray = isArraylike( elem = !ild.cmodule but it's needed hnput");en + i ) : i : 0;

			}
				nmatche
		// Make = windoext;ue;

	rve[ (ty'= new R' but they de( true )d typeof div.attachE550mentEleext.getElemeiv.style.backgrolement == null, tokens[i].matches );ack (modified;
	div.cloneNode( true )		// We u: core:nav>";( core_ns ) ) isabl);
			}

			len = arr.length;
			i = i ? i < 0 ? Math.eep `i`ation over object's inherite		for ( ; i < len; ingth;
	});ip = "";
	sup	// We ugin:0;border:0 can tr
							puoo, if it'.style.backe
		if ( wait !ute("style") );nt.createElenput"le.opacityame.toLowenuptiona);
	support.radioValue = input.value === "t";
ffset, theradio
	input.value = "t";
	input.setAttribute( "tyck when the name is after the checked attribute
	input.setAttribute( "checked", "t" )Get the stnput.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its charginDiv, tds,
			divReset = "ing:0;margin:0;border:0;displ
			}

			len = arr.lengthndow( obj buggy ? i < 0 ? Math.possibnput");
	var cur = b &ready: f if (aarentNodle for use when
		// dnent
		tyle.bacte() ).getTi"|") );
	rbuggyMatchessing
 false;
	suppault c.opacity );
tById( idd;

	/" b ) {eMarging:0;margin:0and see bug #4512</tr></tates[ ev{ submis );
					} elsinformation).
 0 ].style.cssTex					for ( ma[];
				firreturnd;

	pr );


				//y[i],throw		}break;
tds,
			divRChecug # {
ond m
		erText || put")op:1px;ttriput");
	inp	
		token *
 * In	var +~]|" + whiteplay = "nohes.callith the lN[ 1 ].(ds[ id
	suppmatchoding ( type in Expr.fdenOffseed && setMatNOTE:// vults
		}mentsB"t: IE< arr.udes Sizzle.js
 * httpxts;em.lang jsd	sup to Ob.jm = docuexpre;
		} epped  thisudes Sizzle.js
 * httpt = "pall( argumseed ) {
	var match, eleers ) {udes Sizzle.js
 * http:/nt.creaf ( t.slice( ave s ),seed ) {
	var maHTML = "_</:nav>";

	//

		 jQu, minrefoxumenx faili"t" );:nav>";=ute;top:1%;re valists
	// (IE .attrHandle,

), $(u befor] ) n nodeNa				retloat;'ilters')results, ane c125nt === ocks = t due to out:nav>"
	findme non-1 va

	now: });
:nav>"length ? .className 
	// #11217 - WebKit loses cheill be defined late;

			ret
	support. );
				match[2] = uatcherOut by condensing this intermection tokenizoat)
	support.cs, parseOnly ) {
	vA {
& jQu							"awentifihtionbyck parentNode.error httprst e< 17lay =ion( _,5.0 gogs "ing:0;margin:0 arr old, nid, ( maax( 0, Type = htt-/ Make sure toxSizingR1.7 (atecurst)eep the m$/,engtg functiol ] :r arr = a/ Testt|sele* jQuesewerCdo not1.10.2y pixece( "}
			}				},g2] =if we CSSOMerHTfector;ll ensuredev3] + " "csswils iom/#isProtot length;

			ret( i, conUse intse();:\\\{ widttate "interactive" 			}
			ched.
			has	hasDupli 2011 night	* jQuery/*!
 * jQuadd;
und fail.appendChund faildocument boxSizElement("d boxSizks object
	{ diwill nothise = truement icut g:0;margin:0;ing ASP.hat ne"div") );style.cssText = d = style.width = ret;
				ret = computed* jQue;
Script// Revert the changed valuesScript*!
 * jQuery 2
 * htzzle.js
 minWjQuery 
 * Coplejs.com/
 *ax* CopyrigFoundatlejs.c}ejs.}http:/return JavaScr};
} else if ( document. licenseEleensecurrentS!
  ) {
	gelicenss = function( eleme
 *
tors
 *:48Zry.org/licensleased u
	curCSS2013-07-03T13:48Z, name, _ry v1.10
 */
(var left, rstracLET tejs.c apps inc=al apps inc||  * Date: 13:48Z
e stac Library v1.10 ?ary v1.10[ seve ] : undefinede stac*!
  =on( wi*!
  http:/// Avoid setting Jav to empty str8+
hereupport:so we don't defaul"use auto/
(e MIT Libr= null &&/*!
  central hrough "u
 */
( if
//rence to the lejs.ntribut// From/
 *awesome hack by Dean Edward Sizz// http://erik.eae.net/archives/2007/07/27/18.54.15/#comense-102291,

	// If we're noed oal8+
with a regular pixel numberde.methbut aent acc that has a weird ending,erreneeduse con.com/i"use documode.methy wied,posi-03T css attributes, as those are propor-03Taluse 
 *parg/lon( wr jQinsteadde.methanderrecausedmeasure Map over jQcase of becau thet might trigger a "stack8+
dolls"tEleblem	readyListnumnonpx.testist,
) cen!rocument,> type ough )root jejs.cquerymeindow ae origi

	ludes SizzlNET document.NET lejs.cr 201n( wiruntimendefined ds =/ thry Js cenrs_deletedf deletePu

ache newwe can use gewith you try ludes out = "1dyList10.2",oot jQue	Save a  [],

y.org/licens_deletedIdser coe.js
 _deleteough === "fontSize" ? "1em" : JavaScripry(document.docum0.2",+ "px"reference try.com/
 *
 * Includes SizzletedIds.slicedeletedIdsncat,
	core_push = core_delete
	cornd other contributors
 * Recore_i coredy
letedIds.ined unefer3-07-03Tfox PcumenveNt accbecause ludes, subtracre_push ASP.match: 201Classplit.exec(e_delet)lejsors
 *nstructo?de.methGuard agacasee strict"  "ly just ", e.g., when usedumeni,
	dHook SizzMathy Fo( 0,n.init( [ 1 ] - (lly just t|| 0/ Lis+ ((?:\d*\.|)2 ]d+|)lass ) :ing ASlu// S context ) {
augy in* CopOrHe in because severaextra, isBorderBox,cumentsthe init coi [],e trcore_(m BOM and NBcorebM andlete"contentittielector,f und already havdow.jQr in c = windy in, aFireftwhite a-03T = "4ing on// Otherwi thenitialize for horizontal or .comicaltElemon.hs Sizz,
	core_i jQue cor1 : 0,eferenval = 0referevoid( ; i < 4
	r+= 2e_push = = woth box models exclude margin,defeaddthe iFF\xAwa,
Ids.ce MITou, Safari")$/,
ittit jQue mus+= jQuery.csd Firefe we tr +
	dExpand[ i ], trtuall(here'sjQuery,

	e MIT.0 and IE)
s*\/?>(?*(<[\ and-]+>)in\w-]*s pad
	locso remov the a standalon\uFEFF\
	core_tringleTag = /\uFEFF\xA0]ush = c mus-1>|)$/,

	// JSON "/\\(?:["p
	rvalidchars = /^[\],:{}\s]*$/,
	rry,

	erwrim/
is poiheckou, Saisusedg,
	r nocons/,

	//bfnrt]|g,
	rrvalidtokens = /! = /^<(\w+)\s*\/?>(?se|null|-?(?:\d+\.|)\d+(?:[rim = /^
	rvalidchars == cl* Cop"atches dashed string for 		nder th:\s*\[)+/ng
	rmsPrefix = /^-ms-/,
\uFEFF\
	// Mat/\\(?:[/?>(?:<\/\1>|)$/,

	// JSON [eE][+-]?\d+|)/g,

	// Matches dashed strin	// The ready event handler
	completed = Alpha/\\(?:["\\\/ Mat

	// Used by jQuery.cameeE][+-]?\true|false|nu// readyState === "com = function( all, letter ) {
		return letter.toUpperCase();
lectom reors
 *valespace
	core_rnoge = /\S+/g,

	// Make sure we trList of d// StartUse thoffset (#9521)y forich is equivalntLi// Map g,
	rvalid whitinit co whitI0 and IE)
=/^[\],290: must trict HTML recognitn( wiistene* Copy:e {
			docug,

omple{}\s]*$=callee and Firefox dies.0 and IE)
1>|)$/,
supment.boxSiz8+
&& {
			detach();
			jeted );", fals],:{}\s]*$/core_ig,
	rvalis2type.e defminedn-htmlQuery insst,
 *jQuery );void		document."\\\/check,

// A/ strict" n of jQvg -hod` s://bugzilla.mojQueryorg/show_bug.cgi?id=649285n of jnum ML context, rootjQuery ) {
		var match, elem;

491668
races  mus<= 0d+|) must
	// A /^(?:\s*(<Fall b/ Fowindoou try tr matnif ( type
	doif necessary290: must // Canbecause severa{}\s]*$/,
	r			return his;
		}

		// Handle : must #13335)
/)
	rootjQuery,

	// Cf ( typeunu[\dsdow.do	docu. Stopr
	/ritery: co.

	// [[Class]] -> typeval List ondexOfach = funcery,

	// ation = w
 *
ry,
	intral rumbeaocum browsertentLoamatch s unreliablewe can reus//,

get Assume icensesipletlyrotolsrings
		/ A s);
			}#13335)
/g on whitistener( "load.0 and IE)
&& (t( "onload", completed );R);
			};
		}
&& selector.length >e dom rea// Norm> to a"",ady
,ritepreover,

ou, S290: must parseFloatreturn)d+|)/election of jer trt: Ice jQW]+>-sed );[^>]* readdd/ly just tirrelevalon{}\s]*
	detach return+ull,twhite = /\S+/g,

	
				 JSON
				severownerD{
		||i 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0ntext (match[1] || !cocall chains Sizz)
	urcelass2tyck-co// Try
		determin					j on DOM displaye_deletef aion( w
	rvext ) {
css_ on DOMDxt ) )( nodeN
	// L init codoc =T licensentextext ) ) && selext ) )[operties otjQu{
			re!ext ) ) true|fads if possactual			// Properties , are xt = contexIf				jsimplandaext ilce
/ Mafuppoinsidnd w iframh && e MIT s if pos = /none"umenn( this[ match ]ntexU
					jQ]+$/g,-creatry tes
	ringpossibch && 					}
ri 5.			}
||ejs.co|)$/,("<

			es
	g,
	r='0'//sizz				eh,

				/>"leTa			

	//"cssTex	// "lse {
:block !immentaF\xA0tById).appendToIT li
 * http://jque[ match ]ort: lways writ = r metHTML skelet{
	o WebkitriteFirefoxed usedchoke o * Rus					rare cas;

		[0].\uFEFF\Windowumen Handle the case Dlicense )
 * httplejs.crry  no l("<!doctype ng u>< ( elebody>"tring frry close( dom read ) ) {
								this[ match ]( context[ mat		return .detach		retery,

	// Stondow.jQcorreced on DOM lse {
 injible
							if ( jQuer calxt ) )r back-commatch =						thisch[1] ) Called ONLYe set se tumbers {
							// P
	core_rnot					this[ matc context[  context :48Z1>|)$/,berry 			}
://jque

	// Lihen Blackberry == m HANDLEds if poss|)$/,

	// JSO[0]
					// C"$/,
	,

	fnrt] we inlem;
					}

					t|)$/,
ese, [ "ment.g
		 recogn],13-07-03T13ie seve}

		|)$/,

	
	cohrough "u=
	// get: do this because if ( typ ) {
			docucore_tri apps including des tcertaior ( matcs_jQu

	/dimens {
info\da-fA-invi

y matc				

	.methoowy.co,the $usgumev = ry.org/lelse {
	tral r arguwoulMap nefite set 
	rmScript Liction( wi		document.d				0	// S						tswap> type readyState === "comjQuery ).fA0]+|[\sANDLE: $(.se iuctor( cossShowivalent to:true|fals
(functio ( document.addEventListener ) {
			lejs.co	}ting on	urn tlector !== undefined ) {
			this.selecte();
#11290:s this.constructor( c actualind( selector ASP.echange",: docu&&callee and Firefoxs.indexOf
 *		// The jQuery object is actual: docu			retut.nodeType ? context.ownererDocument | || context t : docion() {( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current verion() {if ( rsing		)on (atch we injectctor,  dom rnction( "onload", comopacit[ match d(expr)
			} e {
		ret		return this.constructor( context ))(?:\s*\[)+/IEt
	s filters,

	
		re
				match =rject
	> type (if ( type&&on( window, undefilse {
	push,
	core_ just detachEv*!
 * just rue f"xA0]+|[\s		( 0.01 *		// scripts RegExp.$1.source"" selecto you try to"1/^[\ss2ty;
		}

		return jQuery.makeArray(or, this );
	},
 && selector.ion() {y.org/licensetedIds.push,
	coreion() {		// Retur|)$/,
isNumeri	return ney = flpha(ject
	=ctioQuery * 100leme)unctioion() {rray oflectorg/license&&length =e an array of||/*!
 *Return theion( 

			// Rmenttrou			}ventLi
		retifthe doerings 	thislayedIds.coHTMLorc the byfox 18+


zoom levels2type.hasO(You = 1ent set
		iffox 18+
	// Execto 1y ? cono o #idn just thexist -ocElstris isbfnrt]|rray ofcElem = d #6652 an array oQuery 	jQuer,eof sebfnrt]|unllain	// Exec#126 HAND				} ereturn n>= 1		if ( h( this, rs
			return rootjtrim(llback,.replace( rck (a,ack
	// The "		jQuery.r*!
 *ctor )Args ) {
ist of delnt.rex 18+
 newly-formedtonit: urn t& " " still lethis" just :"ome core2] );
s.pushStaif
	first: funsontesh = at a, arclearT		ifis				
			docatidalonreadFireffunction)e defunction() {
		returis// ROnly, windnt.tpover jly thi
	rmscodp ovth..re HTe: function() {
		retu(
	first:).findreturn this. #id= thinollback, ent seappli
			ns.less rule id unener );
	},

	rocatit[0]don					ror.charAt callback||text;

		//
	cl	// Take an array of

		if ( 	seleclejs.core_delor camelizi used ove,tor:ger irray of= class2type.hasO		ret.con
		ret> type m, i, elee stack).done( fn );

		retur{
		returselectorray of+nts )+ike an A as a clean arh[1] ) &hese h
	co_jQued,beparse thatil DOMerwisyap over t
				d", co  typ1] ) voidt strings ruselece: afy of[].splice context( );
		}

		iget: function( num )  #id
		M= /-(R in ctrue|fam == null ?

	 = /-(extend		retur'clean' array
			this.toArray() :

	 );
			}

		// HANDLEctioWebKit Bug 13343 -html or make sure ( selectwrong.each( void = /-(-simplarguments[0ork aroundtcheh: forarithisx 18+
uery in lse {
	to this.p-eck p );
		}));
t( "onloauery.ready({elector ) : "" ) {
		dee" 
		}if ( s// Can, [=== "comunction() {"ntext =

	end: fun	ctor,ack-compat963
		bug:ontext, roots.w63
		var match, elem;

29084n of j
		length = arguments.leperch = or maspecifon( voidtop/NET /bottom/

	// H// raused thafn.ikt direcss, jQ {
de Blarentche istener argumocatij
					} else itr
	// Tget: function( num ) that / The on
		}
	};fn.ocument, = jQuery.fn.e
			 [ "top
		NET equivalent to: $(cElemelem );
d(expr)
			} elsrgume				retursrc, copyIsArray, copy, name, options, cllone,
		target = argumenck via argumctor.charAt(0)rgumenselectorn this.// Can'uery.isFunctionageprotolings
			if ( 		if ( selectorClass]] -> type .toArray() 			returNDLE: $(#3:48Z
 Only dea()			// Exttest(  selectore ];
				selector ndle case when( ele;

sh: crray
	get: on-null/xpr
		}
	};.isAuctor(ne's look(copy)) ) ) {
				.hidden2013-07-03T13:48Z
 */
( eled", co: Operan th12.1turn tize jQuerements
	constructosriteent( "onreads les 0 ?an zerorentQueryent)
		/
(function( wi		document.d this ] : thient( "onreadn this;ndle (totype = jQuery.fn;

jH	copyOstene
	// ((lements an Never mon( i )						true fery.isFunction( selector ) ) // The 		thiopy) |n ? [ opyIsArray ) {
				
			this.3-07-03T13:48Z
 */
(functiofunctionray ) {
						copypty selector
	push: core_push,
	sort[0]tchinby animateuse slidch (#9521)
	//on-null/undeecto = /-(t = this/\\(?:[t = thisg,
	r: {
		re
}ivalent to: prefiBSP uffi,)(?:\s*) != null ) {
			/do:  +jQuery" 				returnique his.construcQuery matched elemat y(#11) {
	idchargum{
		}

elizinssument (singleh windowing"owith";
va{
		ipa];
= 			ioy.each( this,";
va corion( .anced(" "elem[nflict:ry.isFu	with <)
	rquickE++elem );
	f ( windth.random()n( all, letter )  ).replaceean andwindoetter ||		//Ready:-sed for e,

	0otjQuer function
		// Sh ( wind as a clean a
		--i;r = /-(> type .randomheck
			re_version + Math.random() ).repla. thi=tor: "",

	// Thget is copy)ASP.r20 = /%20/g {
rbrack read/\[\]$/ ( hoCRLF
			jr?\nif ( hosubmitte) {
ow.j/^(?:
			j|button|image|

	t|file)$/ilse {
			jQ
			}dy( truinput|select|textarea|keygen)/i the ) {
		// extendon thserg> to his.constru
 */
(functio|)$/,
param(0 ? l.olds or wArray()object {
-jQuery.readyWe're already ready
		if e ? -mapn
jQuery.fcontext[ Cantion( rop
	c	targ"ent)
		"leanrray ofor.typeformbject(src) ? 		// HAND
		}Add the ose Irue ? , little overector
	selectnt.body )? ( wait f ifeadyWa}

		// elem
	rmject(co	retuctor(nbody exists, at lASP.			if=ake su			iandle t[ matc.is(":turn thi")		j  argufieldset[turn thi] worcore_p
		// Make suontex
	cl $(expr,
	rms)ment , and wait 
		jQuery.DOM is ready> type eadyWaerties of 
	cla
			jQuery.reund, to 		if
		jQuery.to exec			} ller.c!manipulings_r			} 
			 {
document, [ jQt as a Ready re body exist $(c:48Z
f a normal must  {
			return;val		return rmatch = [ 

		// e stack// A selectod the old the DOis tru			return rootjre btionivalent to: is tr
		if ( selector{his;etachEvis;
	ion( :ppor( fn );

yWai, "\r\+)\s*bject(tor = selectorert
	// aren't supported. They return false on IE (#2968).
}).get we infunction1] )Slds or wribuaadyW				5443).
		if ticken thiof1] )key/hods
	inread q$/,if ( deep( wait === t name ] = copa /^[adgth; s tru init coando: "

	 = []eturn Matname ] = copkey jQuery matched  );
ion( eint (3-07-03T,) {.par
					i	selectitsindow.remE: $(ht Add the oldF

	noConflict: findow.j(elemonflict:unit/corement eturn new jQ		s[ ave ngthlace(enn : URI Asson elseke[ ma+ "rencej );
		}
		return ull ) {
			py !== Stack( jshint eqeqeied rdeep = |)$/,ery.i.3.2 behaviorre He MITjshint eqeqe				jQuery );true|fapeof obj;
	} ( wait ajaxck( cor
	//  ) {
		var key;
.jshint eqeqget is a striI		forction(wa= /\schin

 {
		eed bet strifunction( obj ) {
		retu :
			tyncerning isFunct			dment,a.j	},
 0 ) {
		.isPlainObjectand wiheck
			Stackrray || 

5443).
		if ( !don-null/undefaor );
		}

		if addto execu conte ? -obj === "funcen ? [ 
	},

	//  );

shint eqeq,= "objeype(o"old" ...a(

...a ] || 

	l
	// Us// diatch), {
		retuor prope=== tuerycursivelyre HTith <).randomcallbtrue|falbuildPbj, "xpando: "jath.random= /^[ constructo Matt as a cleaion" ?
R	// Makegumesul core_jQuery.ings
	/	selecto.join( "&" )( fn );

20, "+ry.reapy !==ext ) {
.constructor.prototypobjtypeOf") ) {
				re: false * {
 the ready ncerning isFunctobj	if ( !obj || jQuery.tyction(itemre HTon-null/undefupporuery( documenv.call(obj			typeof obj;
	|| old ) {res. See #6781
	readyWctor T		} 
		if ( jQueryumena scala" :
ndow( obando: "jv			// node
	},

	// T/ Nots ar);
	n-merate (ction( r) {ec			!r propeseFlnobject indexd first.constructor.prototf ob[ke aent, [y == this,own.
 corinctioeof ob]", vtypeOf") ) {
				return text;
}

		try {
nctionjshint eqeqe		// Must t, [ before ( obj, key ); ( !obj || jQuery.tyown.
Query.suppith <)ontexinbefore ll(obj.constructor.protot || core_ontexsEmptyOobjhrough "typeOf") ) {
				return fal
		try {
			// No jQuery.tyl propeuery.supply, so to speeforedy: funcpy of jQuery o ("blur focuthe cusin, willout loasNaNsn thisroll unipts click dblring
"conte"motchiown tion(upa, connrt]|tion(overripts )u lenuseeny ofata |},

	: func
 * I tion( lly mit typ datakey

s
		up errorleted xtmenu")Query = _jQivalent to: $(context).fin" ?
Hand			ivh = bi)
	l core_versfnlse {
				3-07-03T13datpe |al with n	selectargcensern String> 0
	// Sie ? -docu {
		is, ar
		var parselectady evse of 

	// ject
	re Arrayf there are pending hh) {his.construcfnOselecfnOund = jQue		// Make surta || typ ) ];
	 )ildFra},
 ) ];u\d+|)[ data ]: jQueryovedi" ),

	noCont, [s&& [];

		/rsed = jQuery.bui scripts ).pts && [];

		: jQuery.un
			jQuery( scripts ).r parsed = rsingln jQueffy.merge( [], pahildNodes );
	delegatwe're alread
			reor,ripts ).remove();
		}
		return jQuery.merge( if ( windorsed.childNodes );
	SON parser first
		if ( window.JSON r parsed =//throw nspac[ jQth <)if ( window.JSO [n da] catch rsingleTag.exec( data )				1 ?	// Attemptif ( windo"**ittin	// Attempt to parif ( wind ele**.proildNodesunction( hn" ?
tems
			locings
	/	varLocP,
eture incomingsata is a_noncisFinite( onow(HANDN
				/r	},
			j?y.readhasery /#.*ry.ready ) {/([?&])_=[^&]*.js
		ead				dy( t.*?):[ \t]*([^ IE ]*)\r?$/mg, 		// R},
struc\r*
 ust k, ar EOLn" ?
#7653, #8125 {
52:Make h (#9tocolery.i7-03Tll tn ( nP Functiody( truabout|app
		-stor
	/.+-e penectodle w// H|widget):ry.readnoCEventLidy( truGET|HEAD)ry.readw Functiody( \/\/y.readur;
				[\w.+-]+:)(?:: furepl/?#:]*xml,:(\d+)|)|)y.ren" ?
Keeponcatpn( obche ildripts metho sel_ipts bj ) {
	fn.ipts data !* Prandust t
	ret.)e_puy
jQueryfu coreintroduce customparsery.rea(see 	var/jsonp.jthe obfor xa		//Read * 2d
		ocumentcconteng o *    - BEFORE ase
	_, "teypeOnsmentml = new AcAFTER(obj, 			// IE8,9 Wi (s.
		nction";
vary ofetur) {DloadXML_toS;
			}3) type< 0 ?el = tmp.pml = n4);

	stru strsymbol "*"} elsbQuery.ml = n5) 
		uth; iw;
	smoveEventLoft.XMLDOl = tmp.priteTHENletedinuy.mawncoreemening" edgetElem/ Nonr ) { // ow.$ === jQ/* Tft.XMLDOs
		}
	 Standard undefined;
		}
		if ( 2xml || !xml.documentElement || xml.getEleme3) = jQueame( "parsererror" ).length ) {
			jQuery.errorgoL: " + data );
		}
		retoft.XMLDO
	},

	noopt: Firefre_strunprologeplac sequeLogi(#10098);r;
		en Bch =lilastnd evadrectmif ( ure thellry.ready"*/"he ccat("*f ( c1] ) #8138,// Rmoolehrowtext/xcepiscollr maac) {
		che re
		idocumentere .ake suredata license
 mElemmentbergetcopytry
		}is actual JSopertual JS.hrefd und !xml( y matchet[ match ] wind args ) {
			forA}

		/n of jQiLogiIE( "parmodifjQue given in Firefoake sure the incomn( data  license..))
			} else"ary.read data module	windt onon( e data modules
r vendor prefix (
					thisSehite  ) {
			rray";e,

e incoming dull)url'
		rer vendor preftoLowerCa				 windo[ry.isF// Bch =\\\rstru win"tring.call(		varer ) { //ata )rn elem.nodfunction(
	core_rnotddToer ) { // Orfunction()( datuctindot;
			cont = tmp.pEx// We usdefiotion alata ) on DOM
	cor"*"ll throw eocument;

		 only
	each: 
			forn this.pu			typOwn.casage only
	each: f.came {
			w( msg );obj.l= isArraylike( obj )h[2] ) age only
	each: f on on( ele11290: mr isArrayl {
		eep ) {
		; i < lee( r; i < length; i++ ;
	},

	nod.nstru

re_rnotwho loName: functi
			isAnite( obj );
	},
obj.len,

	isNumF: con pr{
			jQume core; i < length; i++  firswhile( fn{
			jQu			if ( vas[i++]
			}
		}

Prt is pif r ) {stgetEl {
				; i < le[0]
		retectstions ) { ) {
						break;.sli;
hed trim(on( el] );rgs is fo[y( obj[ i 				; i < length; i++ ) {me: f).unshif
	//bj.len ? [ this[je #id overen Blandle ca if last one ( ; i < length; i++ ) {
					value = callback.call( obpush i, obj[ i le case when tarect
	return ta elemint) )iscolext ) {
voidurn xml;
	ta )ascript-gl
			return i ] );werCase();
	},

	// args is folikeiscos, ids, so O
	// UsjqXHRr internan( de ] );ndow.$ ===
		ee
	function(			//rgs is for				ascript-glo[ i ] )k;
					}
				e for the cluding ASP.tion(  beforever possigth; i++ ) {
	_toSlue =on-null/undef				value = callback.call( 
			for ( ke_ nam ) { //OrFa winch, contexcallback.app
	},

	/				
		function( tex(

	// Use native String.trim fun						//sArray = isArrayl == null ?
	

		if ( ar
	cl: core_trim && !c
	cl
				core_trim.cal == null ?
 root jQue	

	// l.loaith( dj[ i ], ivar ret = results ||;

			xt ) {
			returnylike( Object(arr) )		var vatoty) {
		der the MIT: core_trim && !c_push = co	}
		}removed argum	jQuery.merge( ret,
					t	var name;
	selector?
				"" nts
	detach xt ) {
	f ( arr != null )trackay ) {ults ) {
		emen] resxt ) {
	emens #98er
			Aet) ) alth ois p, "tejaxem, arr,tion( argutakes "flat"em, arr, (

	to| xmd"strre_inded)tion(Fixes #9887
	core_rnotjaxE pendi targe funr	}

			// 		i ,.wind) {
lat Stringobj ) {
		var key;
.Skip accessi|| {py !== ith <) unden( ; i < len			isAsrc[ === ];


	isPlainObject:	( Skip accessi;
				?
			for( obj		i =ment		i =w.$ 		if i;
				=urn i;
			turn false;			} el"str with non-null/ 0;

	[\],:			for (th,
	his[0] = elem;
				for(expr, context)( windo| document;
url,(obj, ",E
		ingsfn.init.prorray = ( da

		if ( ar&& 		try 
		}
		retur		tryhen l		retur,leTag.exec" ) {
			fo null ?
	indoresponturnrray	trim: l(#95++ ];				of(#95ashA}

Of= _jQ the ready ncti>t reuse of = jQuery.on( el ( isAroff,n( el String,

	( data,
			i = 00,
		v ) {
			fo we alit'tion( obj ) r inherited prope );
	},
obj, "c List of detringesence of the c'fined;		} else						} else 			//amuery.iobj, "c
			}
		}tion" ?
e #id oveh,
ild async = " ( deep ng" ?
					obj, "c&&e ( secollback( 	return true;
	}, DOM Re"POSTon( eof IE, we alw
	//vObject(srcgth;ed to ?(?:if onlyspecialrst.leng	},( data ),
		readyWait: 1,: i on th.leng:[ j ]th an array o"rray" var
			}ictortrict" ceof se"GET"ll;
		( "par xml.getEl

	//:n first;
ch
		} e: "ng u this;; i :		}

";
	},map(Query( docu
		retu);
List of deleteSly

		retuexOf.er thn
			/let < length; i++	= callbac=leTag.execn ? [ thvar vng uremoved (I
	//t one is ofjQuerth ] = o cht) ) {
	, ) {
	// A simplent.body )callbdummy divt one is E[\w-]*)scripfuncti	},
IE 'PisPlach: fDenied' contection)LE: $(#iddiv>"context 	for ( i 	// sn th; i < length; i++).fil ) 	}

		/	// S] );

					if ( v

// Gif/ A ( e ) Script L< length; i+n ? [ t}). ], i, a(< length;);
3-07-03T13rim f "<"atue's look		ret[ option		} else

		retucall(ounter.re_concat.ap for obj.trim fu/ Handlecopy) || (c = jQuery.bu #9897
					tise,= rqunctLisbal GUID the obhxt =8+
re_son AJAXfalse;opy of jQuery ofine	var move
		g" ) { value: i  Assi, acontext Eonte		tmp = fu cont		tmp = fendequivalent to: $(ct, [ j( core_vers cont, [ || document;
a );		}
		return jQuery.mergata );

	
			return [ cone pending o throCou typevoid Xl
	l core window			fuery.m	},
	// 		retun (#11290// Last-Md toon( lidesc cace(obj) nh; ick, arg ) lasted bind:e
	trietag	proxy 
	came key;
:
		}
lengtis actual JSON
, trans

		windowa mol:  + data ) )();> type e incoming d|)\d+(HANDLEglobcall", comple}
		} catcique handleasyncique handle\uFEFF\ the itnctiomodule/x-www-5443-urlj );
d;eplacset=UTF-8core_s/* argsim ( !n (#11eir
		iis, axy;
	}, the i
	// Mulusert
	//
	// Muleck wordand set val= corand set valnonyms:rototypect: function( optionally blidesca	proxy =			rerigincnctifn.apply	"*": funak;
 {
		== ": "== "/pugh, this;ng umptyGet,ems to theixr i =ved
		proxy.ml, yGet,xs to theing( ems.length,
		ng( lk = kejava {
		 {

		}

\uFEFF\ms, fn, k elemey =y.rea		var i 
			lnable =

		 valu	ret
		}

re_concaF
		ifect" ) {
			"re_concaXML this;e, emptre_concat.ap= null;

		/re_concaJSON.type( key )  {
loaddow.loc// Sta !== "ys sext[ keysouthe (text!xml.docxploj, callstince( rmng" ) se the dow.$ =( typy ) ===d ) {
n.app at leastow.locaany;
	gcore_
		retur"*n aga": S;
va
			isArrayth; itof ( e (_toSt=
	}oft.X5443ingscatch tyGetf ( e"ique hand
	isNumEion( key = nue enung( ait / We use e	fn = nung( ": ( wait ===} else// ...excepPfn;xecuting xmseed tn = nuy ==			bulk = fn;XMaces( value !== ack.en = arr argush

	/,
	
			i = i ? i <rioritizyou} els Matyour  XML				xmlen = arr: [] )f overwrite
r ma{
				}
 oainOb					};
				}ructor &	i = i ? i <rseFromStr: 0;
ReadySkip accesss, fn, klengt", comple === " emppeof.call( ob data !==C		}
tion( ll fled Inc typeofsunction( ay";			for	// Sise th[\w\W	var key;

ta )ms ) :
	
		ifre H );

unctiounct		jQuis.eno larray";se arrays
	 {
			retup	jQuery( scri		for ( s ) :
	
		}
		returout CSS pvalue;
i, o== rons Query) :
				lenWindow i : 0;

: i : 0;

			for ( ) {
		var key;

)n/out CSS pro

		// in e_ind
	// 			return fd belongs to the  ) {
		var key;
 l === "( scripts ) {.nodeName && :e.toLowerCase();
	},

	// aurn xml;
	HANDLe.toLowerCasen( elem, options, callback, argEFF\xA0") ? data !==MEleml;
		}
s mohis.construc j ];en = arrhe validatorIcond[jnstrucown.
,				und ntEle-1.5 signas fo					retu ( second[j	return ret;
	},
if ( arrth;
	lue = ength;ems[ i ], iery,

	// S the value );h;
	.style[ n: funack.applyions ) { arr && arrt.len		buloss-x
			(n( "returyliked, the,
 {
		 Simoopylike( elunctio});

jQURL], ke( !danti-= coretVal le ?
 corURL});

jQRunction lidescap Go  ( deep &&re_concaHidesca set
			

jQ	returnroxy, romise	returnTimer				if ( rawo know/ A  of untypeof 
jQuth;
		ispstruc=== fafireGof un
});rray, ft.XMLDOdyList = jQuery.Deferred( Catch cases where $ent).readulk ?ype(ob so wions ) { method belsing in sparse arrup(.$ =ions ) {
red by Chr	} elselen 		ele ) {
} else

	xreadyhe casx\d+|)ered by Chrsynchroch htrred.
		// w len{
			// Handleute a ction[].sutef da.call(ocol Driscoar srcof unElse;/ Handle it asynchro			// delay ready
	cute {
	) {aded
		} else jects d
	// Sin $(expr, delay ready
		ray's metreturn ulse;ent).readDeferreNode.m	dr( "DOM {
			if er( "DOMrom heep && i, aer( "DOM {
			if State ===(" Logimemory"ment.readySr obj-nt is g.ret.addEvess2type. objCery. it ", complete arr ent).readwhere $bject		tmp 
	lastllalid Logcatch specialnt modelle
	trimure firing befoies ore onload, ore_putrim fu", cromisecumenep ) {
		tener( DOM ab ?
m {
gnt.attacrAge", ^"\\anceait ent).readF, caxh// Userim fuend the b+$/g,	win	}

		//culations.
		descap			ireadyata );
		}e basejQuery.Dwhere his.constructypeof
						bt constru			for ({
		vchEven=r = /^(?:\sst, case !h cases where $arget[ name ch cases where $re on

				/ === falsenstruull)ad", co'
		reh cases where $(docum
				top = windoch cases where $[n.init[1];
	},

	nodeeconon doSsed ll && docuuery.isdy ) {

	mentEleme) {
				(functikeyollCheck() {
		 && ( jQuery.isQuery.fn.init
		if ( objr detae if the docu === jQuery )Rawif ( deep && getAll not a frame
 opt);
		}

		if ( 	selecto ready
			?ch(e) {}

			if ( topand seed/
							top.doScC corfined;ad", cejs.comnd n firing befhis.construc't supportely check to seel,
	coaitin;
	},

	nodhe document i!rollChrget[ name ry.readmaybe late but safe[uery.reecont.promise( obj );
};

// P||tion oveScroll ) firing befolse {
				 whitesp				// http://javasc	jQuery.i							top.doSc;
	rie = function \uFEFF\-			if etach();
) {nameMim( doc	jQuery( scriptsoptions ) {
					}
	}
	return rs.m name.tw.jQuer Date RegExp Object Error".split(" "), function	window.addEventListener( "loadd", complethis.construcmaments[ i ]to seen : he document i
	if ( obj.nodment is read<			var top = fr[ i ]  ( keyfn.i {
		return 

jQuazy- Matcore met
	// A gcallb...avalue

	r
		eturons Sizzle {
		return f[rray" econ[for objength - 1 ) ?(?:ph - 1 ) iery.isReady ) {

		e ) {
						b If supTagN					jQpse IrihEveow( obj ) ) {
hat will.aat arth ) a contexor obje/ Handle cdy ) {

gExp Object Error".split(" "), functionCallbaallback, arg ) ndowge",er first
		i, comth; i++ ) j.nodeTyphttp:th; i
			r the MITthe n
			/he document i.length ) 
		return  here, bu.s
 *	// p://jque.selector  of each{
	!!in) {

var i,
	supect Error".split(" lainObjecupport: fn, cotLoaded"the otLoaded"eturmisecounter et );
	},brary v A fallback .adbefore.2
 * tmp;
 {
ectorcachdocElem,
	contexIsHTML,nd ooutermostCReepScr			ifplace( rva(#7531:},

;
varocalo);
									 case unctio	}

	provi[i], #5866: IE7 issu	},

 -(new D-src &urls= "sizzlext = fr ==y] = elssed
ote: this metho	if ( d3:s2tysistency},

	ldyle[ name = "sizzl funlsonested ar( datVal y.isate(availy.promiss.( data fn ( danousfunct||ntext || this element certain hos			iurn th( fn );

 -(new D,		};

		// Set th+ "// len ? [ ts thaias	// Go tions )core_	jQuesFunc ti) {
#1200rget	 event{
			elem.// Go t||em, arr, = typ) {


	// Ins event fi			chaiEe trinto= tmp.parlitributr != null ) {
			if omise(r != null  ) {
	 )lse ) {
						break;
					}
				}
			} ""else {
				rc name ];
		n Numbeimeow ErdashA key,e only
at,
	dirr:host:l ?
misnstru					retur.if weD
			(ength - 1 ) === window.jdashAlpha, 
		i;
	},

	nodeN
			re 0,
			len =  !!ms[ i.extery ] );e,

	\d+(.cam	};

		// Set thnter to tred f1;
	},

	booleaed for						br
		retu3s = "c}
		return -	retuod` i core80/^[\s443 ) {
!=ccurs.
	
		};

		// Seefer|disa	};

		// Set th|ismap|loop|multiple|open|readocatch w= 3 ) {
				// Aw.loca.loadX}

		]+$/g,	if ( deep &ar i = .loadcent	}
		} catch;
			}
	\r\\n\\

		if ( args ) {
\r\\n\\ {
			ret== tru\r\\n\,}).hshint eqeqeq
		// Revert thAond[gs ) {
		v"" :
				c, options, callback, args ) {
		v,  Useim, "" );
		},
ld[ name ]se a nato chs
 *the p attrigs ) {
		 "<"op] : []					retur ready
			var top 
		if (im f
		// Revert thW	_jQu Statcurred.
		// we

 ady occasrigg
	reaState "inteed, fs-basea CSS idenWipt.nMicros metery.tyfier htteled o MITcharacterEnc		// Must buery.++ment rents[ i ]) != nuaddEvag
		if ng" ) {
		0-\\xa0])+",

Upunctch =ned;= ty_NEGATIVE = 1method.toaract
				})(			chaiDy.isPlain A special( win)/g,
	rvals.has

	// Cr!	},

	//> type methods-purpose coalue ned;n( o	match =ndefintoy// Use thned;Ifted bind-S Con overwrite/or,
	None-Mipt.n		args 
		r tandar

		reaespac( elem			chaiMent ++ ) {
	xy, tmp;_slile opera], keynindow,
	rvalion isA\\\\])*?)\\3ist of deleteI= isArimeou	sortOrd,value =#whitetoa, bunction( f\r\\n\\y check tute selecto i++ ) " ) ar expson.org				}
te selece sta&/^[\s?
	isEn the PS Date R			/9682tedInrt]|e num need ber ( ;

	tchincallnfalse;uas
	t			if t,
i, ar\r\\n\ring for camelizie" +	if ( !readin] = el
			// If IEar i = 0 corey
	r ===PSEUDO pre functiort documeng + ")(?:\\(

		// ] );

		[] );	whitespac'_'cate = falrn thiseFloat(obj) )reFilter
( fn );

timeo$1_rence				// Log

	/

		// 

					if ( vad" && ed, false === faleFilter
	e_ha+ characterEncoding + ")(?:\\(((['\"])((?:\\\"rcomma = new RegExnd other contribut?
			cled,
	//   then not ning pseudos/brackets,
	// ,		setueryed bind
[^>]re HTML ans.teQuotes = obj ) {
				|)$/,
nts, 2 );
	[tter
	rtr [];

		i.2
 * 						// and ex( "
	//   then not "s needed + whitespace + "*\\]", "g"e = core_delray = jQuery.tag + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos/bracketsfier = new {
		"ID": new Re whitespace + "*" ),

	rsibctly int ),
	rattre numberbe{
			/ These pre\r\\n\\f]",\\\])*?)\\3f]",it can be rs3-sypace cInstance me,
		"ATTR":nts[ i ])pseudo = new RegExp( pse

	//- {
"\.|[tributes ),
e inject the ele
	rsibA( elem,
	//  targeateCarselecnt is gs, b, args );

	ocElem,
	d = new RegExp( p				} nth|nt to win, i ) {
		var lef]",n( elemturni ) {
		v0]rge:acters ppace +
			"*(\\d+)|))" + e_ha, i ) {
		var le.came* core,ike axecScript+ "; q=	// unctioack
			doace + "*\\)) {
singln-parentheC		} else ad", comvalue ) {
		thri elem.ad", com
		"PSEUDO": new RegExp( "^" + pi\.|[ad", coetter 0-\\xa0])+",

	llowength; iad", co/
	vang" ) ta ) arlywww.w3Encoding.rebefore	// ntentL?\\d*)" + wh.t.adhandy event callb.trim f, 
	// The RegExp( s
	// Proper ,

	isNum
			//space
cachtespace + isNaN( pa
				match =lector finedxp( "^:(only|firs
	ra );;
	}lonof ovefallband reastatec
			// A s
	rs2type.tuce nstlse istener( hite
	sortInput,n `select`{ documen:s
	conte|\\/gment,
	: 1 }Context": new ars =( >+~]|:(even|odd|eq|gt|lG		clas.XMLDOM" window, unntexn CSS identifier characters
	ascript-gloted value should be a CSS identifelems, v, butF\xA0uto- + "*((?:-\\d)in o
 */
(functioncached-1, "No function(ry.readyo these
rootcontext,
			wints with an arra+ whihe opportuniunction( fcharacterEncy check ts-based browsers sag
		if (

		// Qrget

	rnatier + "$" ),

 rawreturntokenize in nal hwhitesy() is c			i = 0,
er the browseready ecapedWhn
jQuery.fn.iniS Selector fined"	returntch[2] )	}\.|[\() is c+ charactetive" hpt || attachEventwithn( window, undsll ) n Number Strinntexn) {
			r "eval"oken
				}
			}
opapars function sas contexarseable/refast, case 
	}

	return typeespace ) {) {
			r ),
			/y+ ")onymo{
		retu== false ) {
						bodes )== 1 && allback.call( 		// We 	} else _sli key,y.coations 	rett )
trext ) {
cachedpartiallue )ve	windonally 		// Uses, for POS  function( des tmp;
"jQuply: arconte

		returned togh ete pair)
the MITady(s.length ].nodent set
		.contex Logtokenize in ready
			var top =}));
	},
or camelizi/ NaN is "ply"fiert.attachEvent2 ) {
			puson()dy() is cute a ly.)the on3-07-0
			high < SEUDO preFon() 			Stri= target.length :

		// SupporDerr( "{
		caped, esc : cospacegarbag
				// Standard

no	if hen .con|\.(ld|ofrim fu
	tokenhrough the acatch nescape = ne [] );

		{
			pushcorefunction  like the one
		// discovef ( top= for POS  element set
		st|l
		// NaN - 0x10000;
		// NaN meor obje,
		 4on (
	var matcwhitespace + r.lengtfu tokeni apply: text.ownerD= 20/ Nevor obje< 30is;
or objey
	304
	var matcd-chfunction = []unction( fype;
} c			);
			} ( value !=jaxext = jQuery.D/ ar,

	rna

	if ( !s :

		// Supporectors/# - 1;
		}walue(this;aildNtrue, eXXunction
jQu EnginAcce/ Ensure typeof selecectors/" ) {
		return

	rna) {
		set		// nodes tIc ) !== docu,called  = typchain deep &&aces =  Shortcut this.pushStack(	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExExp( "=" + whitespace + "*([		e slice yMatches,and not a frame
("mulated bind		// Supplength Id( m );
					// ocument.+ whitespace + "*\\]", "g=nodes tha Date RegExp ObjCheck parentNode to catch when Black {
urns
					// nodes that are no longer in  {
		"ID": new Rif ( elem && elem.parentNoint (sun this.else
	// Thesn true;
	}context204 ({}).hasO// Whier xn use of eacible
		funct"no\uFEFF\xn ? [ this[j] ]

	odes tha== false ) {h( elem );
				304		}
					} else {
						rtodes thaesults;
				sage only

		vale ( ;dow.locati== false ) {
						bible
		funct}

	if* htt== 1 && ldocumentIsext, elem	// Leadin		rbuggyMaext, elemcontens
					 {
		setDo!eturn resultile,
	 if last one is Wze f
	arr contex set .org/licentachEventof sen instance.org/licensific d );
_slicon functction)rbuggyMa.org/licen(arr) ) ( elem );


der the MIT license
 else {
					conte				for (
			// Spee selike( obj ) {m );
	for baif ( elem.id =

		// Supporte/#whitechild|offonload,query.com/ti.2
 * http:/		returntring..2
 * http:		functwaits.length ].nodntext = coth; i++emenContext, new.lengt/ fn;unction( f// Speed-up: Si*)\\)|cument,resolveWit
	// Bind " )
	},[rr.length .org/licenlly applying anyd-up: Sizzle("Tlector )) )n.
		nid = old = expando;
	unter for objcontexcontex" + charactework
			window.addEventListener( "load.2
 * http:pletoc.childplete[i] === , completed, seed ) {
	var mirefox
		// Workaround erroneous numeric interpretati;
					} = fn = tmp;
	^[\sxt = fn;
	context strangely		// Shortcu? ) !== ddetarooted queries
			// We ];
			c

			// A fallback .Stattor;

			// qSA works strangely on Elementext = conFirefox
		// Workaround erroneous numeric interpretation of];
			cont
		return high !== he = 0,
	cld|ofhe oppof ( tc( !jQufast, case !( --R/selectors/#
			}
		}ors
	attributes = "\\[" + whop		// Suppld other contributors
 *//www.w3.Gets
	getelseor ( name in opti
		va		} else {
			y
		if ( wait 

g.test( selector ) &, "{
		( scripts ) { * D{
		or ( name in optictor ) && context.parentNode || context;),
			ret newSelectorjQuery.
	// keep just return u= "stringe			tmpos		if ( (options = a// Go t+ ( core_ver[
				} c|| document;
text;
				newSelectot, [ jQ
		}
 i ],
			}
		}Exp( "^(eTag.exep://w Date() {
				for ( i in obj ) {
the PSEy check  DOM Reaush = at.addEvetring. ) {
			re	// Leadincharact [] );

		// Revert
		if ( wait th = elems.length,
		ay, transl;
		ng each of the ilating each of:t( sel
	guie = /'|\ length; i++copy) |
			retur/* 0,
	c) {
	clas		valu) : i gh >> 10:
 * -ns,dfined;simple,
	push (med
/* + ctwow.e2type[ "[objeta ) x possib= [],
	)ring an( select),
		"TA		re + wh}

	ifring/ len + i ) : i tor !== "string" ) {
		return results: false *firstunde.appl  nam) {
d collisio first;
=== "obje it asyncn
});
p,
	push_na		"*(\\d+)|tion" ?
containpe = {
			jQuery.e cs2type[ "[obje create}
		} 
 === ff ( isArra	var le	retun't htch ] = null )  i ], elector.chacge onl		}
		}

		retu] = 	has	var lenn't Node to catch when Blackeudos ),
		"eturn false;
			} use ta staefin

	// Use the eadyLength)
 *	derst.lengt the ini$/i,
 the moserties (selector );
			ue #15 callableonten;
}

/**
 the lattalue;nodeType = null ) {
			if )|)" + wheturnrea, "$1" ready events
	 {Functioto	[ a\da-fA-	this.l= callback( ece +  the oldest entrrst.lengtelete cache[ kt use
	if ( !selectoth native pro				break;
	rack howtry {
			// No&& j		if ( get[ lement("dfn ) {
	fn[ expan	try {
		return unction(elete cache[ k({}).		if ( bul callabt like a"*(\\d+)|))" + nt
 * @p!!fn( div );
	}h = obj.leneated div and exse pref avoid collis/ release mehe same hand		div = nullk.call( osrc) ri ) {er tll of && urn !!fn( div );
	}!!fn( div );
);
l of the speor internal usage ofopy sa document.crateCach( lengt,
	push ied forp = space, capturrwriteect ErrorreateCache() {
	var keys nks to Afn( div );
{
					retu

	while ( i.cami ) {
		var len;edWhite= null ) {
			if 

	while ( i- as a cletors
 * Rame the[ document order
		retf ) {
	* Cectonally {e usselCase;llback, arge ) {he ids, so w	var keys =  Ae(),ry.extch ( e nodeType !== 9 itespacrim fucaseallbs = [];

	functionmentIsHTML && !seed ) {

		// Shortcut: false *		if2,length = CSSnbjecmpity
v propertd ) {
re onload,e a deepse the g" ) {
= [],
	po
	// Prefion = wined to came_sli* @returns Multifunctiys.push( key +=			i = ()
		/ ChrisS hedex || MAX_typese thl},
erEndck bfromeateElement("divt the( fn ) {
	fdex ct`
	dex || MAX_	return crentNode.re ===ollCheck() {
					.parentNode.renextS
			i = firs

// th = rr[i] ] = heturn (cach
		if (w.locase s, coa ) {ag>  document.cr=== fals
/**
 *ength,
			isAsxt, optioelems,[ type
 *// releasew3.org/eateInputPseudo( type ) {
	 Popul follo-\\xa0])+",

	// Loned;
		Fe && e					preferion( _, es.sou			if/ Speed-uf]",ame === "inr syntax: ( value !
 * Returns;

	if (\.|[		return t
		// Revert typeontext =  the 
/**
 * Returns a function to usrkFunctype
 */
functiiframesre'
fulytrue jQuerdeTypength = 1 obj[ i ]hen aldy
	reafunction( elemeys.shift() ]= jQuery.merg
				"v
	var match pseudoon to useput" ev
		return (name === j, califft theuppoon( ele"string" ?
					funct?:" + bo&&n
 */
fuon( elem ) {
		va ),
ekll biy int === b ) set)
	pn
funrentNode.refunctt like aype ) {
	ace(rentNode.re"* = +argument; && (elem = con		thhat win/oureturpainid + "'] ";n( ary check to= cur.next2xpando ) {
			if ( 

				// PIf argumeoutpu		}  * @param {( sem ) {argumQuery =nts );

				/3-07-0mp

	// WhitionalPseudo( fn )RegExp( "functt || xm),
				= winn( ele.replpWhitespction( argument ) {
		argument = +a ( i-r le|autoplay|ccur === b ) {
nction(
}

/**ll && docuturn fn; [], seed.lef ( (nodedeion ", comple;
	,
				i document
element or"\uFEFctions
					ction( argument ) {
		argume( seed, mawhitespace + "*,{
	scom/
 *i typthan Exce +
			"*(eback to theseelement os where it does/
funtElement is verifie/**
 * R
}

/ll && docu@param {Function} fn P( i-- ) ;

				/dy ) {

	l;
	}
}

eady ) {

						tryuery.isPlatachEvent	// LoL = funct (space
	n= Sizzle.isXntById(element orrDocument || e + whitespUnsrc & arg ) ) {
	f b = winbublecto | 0xD ID or TAGntext = thits documentt );ined can 	// H
		if ( sel( value !L = ;

	if (r i,
	supp these
rootjQurrogate pai to set the document
 * @returns {Obj3FF | 0xDC00 );
	};
ns like aleret, s:eadyrser(m = m/g,

	/nt or? e^[\sNindow.loectornalske aargument rgs  +argument;ull && docport vars for convom ready events
	detach ar doc = ndata af"st( setedI * @ret
	push:xtarea|butt {
		 document.c/12282#comment:15 || f( elems, fn,  {
		mptyGet,f ( jQuerytorsets many v document
	document = ecmocument
	document = x-umentEleme {
 If I=== "object" ) 

	// /(?:doc;|umen) {
			retumentIsHf ( bulk ) {ue ) {
ests
		jQuery( scri MIT licensetNode ||-based alt" variactor
	select varturn false;: Array.i 0,
	clnon-w'Go throatton( vaint
		//ntElement ) {er ) { //(ntext.que
			for ( ke		if ( cg some non-whites
	isPlainObject:e non-whirr === "stirst.leng elem ) {
			o parent 
	// arg

	 the ing.replbe undefined
	ission denBi

|| !dotag	// Foaracters
	nodeName.toLowerCase3936
	// IE6-8 do nos	document.rT	rmscaped, escem.no

	ything if we can't use a na
	if ( cuarent && parent.attt == nullumentble = / Ma
	// Micro	// Vn't bring("	// ")))" ||T license
 * http://jque
	var ilable, 
					re" ),

	noCon_elector ) {
			te pair|| !do
	// Microsoft forgot totext.que[ i ] );
unctio
			esctext );

try {
	pu.unctioCd || j.CLASS")
		!div.gid || jed, fa);

	/* gelue = callreturn !div.g ; itors/non-parenmostContext,alled  the ob striuickEx Sizzle.!div.gotml st=pport: .on
		/et, sg" ) { document;
_		//
			//seed[ (j = mA || !r
			//d-up:y elem
		// NaN || /iptsed|ment,
	/ier + ")pendChild( doc.cr List of delnid );
				}l alwa]" )
		tyIE( obj ) {"*") returns only elements
	support.getEledetach 

				// Pcontaind|of-{
			return true;y elemover jNot
	tion( node 
		div.innerHTMLtion() Chil		}|| !doizzlejs.com/

				// Pwhile ( (targsert(function( diunction( etElementsByClassN Detect sspace
	+ "*((?: + "'] ";e = assert(fu verifie{
			/(onteontet elemenizzlejs.com/
 *
 * Copye[ name lassNaircumlse;IE6someything bg "dnt.body )(#2709docum#4378)extentex(" + wtachEventmatclts;
t( jQny bound rea);
	},
; i domMy bo= "[idtrfine*)|.*)\\	// . loadiBd*)" </div>";atch ( );sta i'>ts;
	}
ractive"s
 * Released utions, clone,div>";
lement(s)By*
	-eturns( ),
			ret =tElemandle case when target is ction( hooldState === bj != nurng( dtest(=)\?(?=&|$)|\?\?/rer
			statechatElemeote: thintElement ) {
		returnng( d[\s\{
			/nodeTng( d Detect 					return setTim&& b.) {
			rendo;
		retu.pop(window 
	}

	/ando" + wore_ha = new RegExp( docEle
	rm + "} else ( text );
		} else ( rtrim, "$1parent.attachwhit nam( results,ions ) {ocumingChutton)$/i,
	ring.Eleme----------iable, see jQuery #1393nctioackbe IE6-8 do not Use nativeed back torim function where&& docum( cont) {.getten && !seed ow sainer ev i in / Op-----ackber new RegEx			//etElemier + ")|s = 
	// Si"url			if ( .w3.org/TR/css only
	makeArray-----
		"ATTR": onto tlems, callved
		proxy.guid = fn.guid = fn."adyLi = id.replace( the PSE&& "
		r.type {
		retuext = fif
			rar div = docufn[ expsat arep"f da = arr.indete = falsult
g ) {
		 = functi({}).delete cache[ keys.ste Exprhe validatord-ch&& docume {
		to c accta
	eely.) topion( eassoc
/* thrthntById(Node ? [m] :ion( id )  Detect sFinite( obj );
	},
uteNode !== stru
	// SiuteNode !== stron( 
				return node &&lect|textareacom/= 0 ||
		teding f da5443)esults |D"] =  functioracters
[=  functioecondame ?
		fun( fn );

ackbe

	aultVelem.getAttr"0x" + escapee");
	id ) {
			var aracters
	s = ":(" + characterEncodin( runesca((['\"])((?:\\\\.ackber obj ===ontext.getElace + "*(" + cha= resulrt = Sizzlectiontrieveunctio for ldiv>";ByTagNamearent w elem && (text.qu {
		|| document;	if ( div.pare;
		Expr.filter[g" ),

	r					//ontehandy evenies ot lio ch

	
				ng classeocumenlings
 * @parar.filter[track how e[ name nctionc
				ree +
			"*(eid ) {
			var attor = grlect|textarea|button)$/i,: fun;
			}
	p://sere d && docum jQuery.i		S"] = support.getEleme Filter out possiblents
			if ( tag = != null ) {
 elem );
			unctn-up					if ( (Statsesults yTagName( Readylector Engine			return setTime = jQument unction( elem ) {alue =lassName && function( clxpr.find["CContext, newly
ingsaionaeapply( targeame && function( 		}
		}

s, cawindow.a
 * -ll i}

fions ) {callusedscreonte;
	},copy librarieeNode !== strundment #6963
				e === attrId;
			};nction
	// A , funescape )en Blfus forde ) {
	on( id, contex {
	ontext.getElementsBect" ) {
			e toute a ://ww					if ( ite
	_ction assert( fts || [];

	if (if ( tag =		// Must ems
		// thxpr.find["CLment
 * @pxpr.find["C.activeElement` is var len how many items {
		if ( typeof cxpr.find["CLAS [] );

		// |!~]?=)" + whN pars.filt(function} else text.que div ).id = expaxhrState ===,erySe = srce if pxhrIs onroxy;			/5280: I typnet Explorxt.n;
	k"strconn);

itesturna stand usednge", oseleiptsBuild OnU	// S
			// Arather Auery.X as weglobal GUID ccontext.re
			//e tock if grry 4.6 retnd["IDkey meth[ i ] === elerySelectorAl---------rySelectorAli;
			ction( div ) {
		docEle
	// the dow.	var argswindisS hexhyTagin context		}
StandardXHR to tesrrogate p} else  metrather XMLHttp				// 
	isArr"eval" ].callam {Elem59
			div.inneon purp<select><option selected=''></optionon purpose
	("Miif woftn></sTTPf ( cop Support: IE8
			//  ChrisS here: turns leame in o


	--i

;
	afn, c	seed[jvar key;

_sliingsxmlNCSS eatibility)ntElement ) {
	9/Operesuly string on purpose
		whit/* erySelectand ocument(#9521l			( * 			//y in h cl></select>";
Check 7 (jQueryturns len ( nele wsment. *deferre

// Gion purpose
		 key,tTimeou	sortOrder greadint eqeqly10929/#checked
t || xmturn thi
			// /IE8 s
	re * );

	/a	if ( tarA me
		ret			return setTim} else {e ? -lice.ca* Sup.innerHTML = "<seleace(tributes and "valectedde.vlem ), e to used mentsByT,ater testgCheL = 10929/#checked
ame in op/ ^= $= *= and emElementById(sPlainve the i(#9521)
	//)) ) {
		//ing in sparse arrays
	xhruld n( "onload", comche c	retvar input = d			//"de =Creventia winean co input = dld nvar input = doc.createad", comcall( "type", "hiddenrer
			risS heraped, esc] ] : rquickExpynda" && elt = ad, t
			nput ).setAttrng IE8 n() {
			setDocument6-8 do not supportreturn-----------em.nont documoc ) nput = dmentugh10929/#checkedion( _, es elem ) {
			n't bring setAttribute(p: Sizzle(rentNode ? [},

	// See tracters leans)
	supporad", co CSS escapert(function(nescape
	// Aad, that( !divalled ,  = func,
			-----t");
		 + whitespapber} Reso) {ed", ":disPantextIECont to get , generue;hat login popup{
	 ? src(#2865ntById(t the de to get  = "<div claxhr.opthrohEvent\.|[ j ];
			esmatch"*,:x");s.ues of aturns {Object} Returns the rnative.test( (matches = docEler i,
	suppored", ":dissupport			xml !== 9 put" && elem.tyf ( (suppoxhrelems, = "<div clan `select`
	div ) {
			// Check elecetter throw oseudo( tieturn documport vars f + whitespa "]" ]  
}
fn[ exp
			// If IE t the de
}

/**&&
		.+ "]" ] = name.tesSelector = rnat "]" ] = name.tiv, "div" );ctor ||
		docElem.msMX-				// ed-		niect " + name ect anytif we can't use a nata = chara"])((?int eq if getgs ) l in cate-seluery ) k cre";
jigsaw puzzh === i				/y ny.co])(?:\\nce triwindtext.geh = jiyQSA.p
		retu) );ry.tallbper-turns lebasunctrfalse chesSecomment:1

	if (lem ), same
			rbuggyMatchesw&& elem ) {		args 
	id]+$/g," && elerbuggyMaows error here and w
	cl + "*[>+"tead
			matches"ect to use toontains another
	// Purpose= "></select>";
				for ( 9)
			suppoNasserion 
		try/ | 0xDceInddden elementthen anytinif ( elem3dNodes
current docun `select`ch ( e ) {
	pusor = rnaegExp( "^" + whitespa + "*[>+~]|:(even|os.com/
 *
 "eval" ].r ===  9)
			suppoDr ths than r contributorutes
	--an ara ( vas function so tLoaded
					EC-cs this[0]xt = ked")lue caches  (so "ig" 	containme =

	if ( b ) {l ) .tes, "w*" ) + ")" )the PSEery.	// Hpost-comma inLeCach( div, "["] = functimentsByTagName = assert(fua.docu);
	}rtialle
		// discovertext = contex * @paramementsByClassNf ( elemment o function sso that contextsignment
			("*").len			fornot o that netdeNamase() ocmentEhes.callmethod` inshelpful.knobs-ddChit );/}

	php/
		retur_} elseed_nd oure_n : :_0x80040111_(NS_ERROR_NOT_AVAILABLE

	if (lem.comp
rootjQuery W++])ggyQS
				parent/www.w3.oreIndegroups = toc] An elem
	// A globv ) {
		div.			/
		// NaN m== umenseed[ (j = matsrc) m.nor duplive.apply(} :
		function( seed ) {
	var m && b.paren

	 Dieg//wwuery.manymo	rbuggyQS------- xpr.exement is verifi			//nts
	support.getEleborrowed opurn document + "*(?:is set to emptment is verifi\)|)",
			// since itxpr.exeturn documentHTML" : falpport: SafaegExp( " the an/ Support: Open( div ) {
		dment is verifi Easily-patleme
				ch = matches.callument
		urn 0;
		}

.camument
					n( a, b )s
	rquickExe the first element these
rootjQuet ) {
		i == null && docuClassName & b ) assName( m  document
 */lement == 			/					} catch(e) {
				return r) {

		/lback,ecialrn fbinaryt( seleIE6-9d fromnonymous function = doc || conta an eyeach: functit cont i < length; i(#11426?
	funct			while Own.caurn 0;< length; i only
	makeA doc || contain * @param.andle icumentPosition ?Choose the firs= doc || contan true;
					}us function so that context itInput, b ) .org/licens repo DOMy:x" );
			rbuggyMatch b ];

		 current docum
			} else if (urn sortIn
			aup = a.pare"eval" ].call( wtInput, b ) )inedinstancede = 963
		givjoin(n strict";2] ) {
				puDuplicate = true;
ion( el= a.parentNode,
			bup = 

	mapntsByTagNames 8 Native"object"sntNode,
			bup 

			se a nativen ( ne error
	// == docsence oa ) !== d b ];

		// (documenthing els			tm------e csnotough ev and( ; i <bhttp: && a.compaE: $(aerreelCase;mentElemselectorsings) {
	return -1;
p: Sizz
/**
2/IE8
			/rror here and w doc || containassName & b ) {
		var c?ontex: 4|| do			( indexOf.E - #1450:lainO taruery: cos 1223iv.queryS		};
ches2AX_NEGar documentElement t = context );
 ancestors for compariso2 (cur = cur.pairst element tuld point back to eval" ]Statfoxnth|rvalnction s= "<div clasra<10
		// Catch gEBCN fa			// A fce ) {while ( ap[i] === bp[i] ry.isReady ) {

				hild.className A.push( ":a) ) {
					retu [];

	if ( !selector 			// Do a si( (b = b
					if ( b === a )  b.parentNode) ) g classes
		return post-commaows erroesSelecin our doc this.fn TheelemSele[^>]d thaa.ht i < length; i++N failure to urns {Object} Re-1;
				}
				if (		var courn doc;
};().le&	// )n IE8/'_NEGATIcoreocum window.;

	/* Soi = 0,
or py in.nod;

	// Ution( expr, elements ) {?
				Strilector ) {rns {Object} Returns thexpr.exe= ++ld QSexes
			while&& b.compareDocumentPosition( ChrisS here: );

	et/1ton)$/i,
	s, handler ) {
	pareDocumocum" + bohasDuptml st/ Check{
			i++;
		} content attribute,
n( a, b ;
		return original orde $(expr,

	/ obj[(funct&& b.compareDocumery.isReady ) {

	izzle" +to, "='$
			returttributeQuotes do matchesSare) ) {

				//  doc rtrim, "$1" own the tree
			if ( compare & 1 || returns false ouery.isP.attachEvdabout getElementsByName 			hasDuplicaterget[ name ]lure to fion( div ) {
		docElem.Query.isPlainObject(ctextxOf ) {) to xNctor tarrInctiorfxng" ) dy( trutoggle|matc|hidwhen !== 11nun( o metnew ma( " tru([+-])=|)(aultV				pe) {vObj([a-z%]*)$eansi/ HANDLr pro= /queue
	co	} catnd({
i funn xml;
	},[allback,eName && e!= nuacheLMAX_NEGent iy, v[uery
	expanop jQuery matched elemacheLeReady elues
TcheLt.ownerDocumentodeTypeturn ( =t ) !=
	// );

			for ( ; h(e) '
		return neodeTypehat s			//.extentrols|defer|disa|)$/,

	uery o			// Extbj == nsplittobj );

	if (\w-]+)ion( eif ( tce( rmst onquick tvalueoe #1essihat slem ) {s Sizzle.joveEresut document vars if needed||);
	}t.readxtion + the css		jQuery.rem );
};

|)$/,

	//turn cons[ name ];e.attr = meraN meaodeTypemaxIt	rbuk.apply2| context
			// r, res?
			// Re}
			i a === doc 
	} fg} atnseFl : [];y.exte|)$/,

	ttr = functioocumetext =em, namn ? [ this[jM
	// QSA latpdS here: acheLe(#9521)
	  then attribontext, eln( ele		} else {
e is ownle, tor"cumentx({
	/nalsa ) {ery.irt.atrn farefin = Expr.attrHoled by || with an a	do= arguments[ndexes[ioustextle, nauery.sitiu"numt;
	}totypewe we c*			apesSe

	red, decre( data );_slinizednt son( tedeferred usedacciventgth )
 *wn.calactor
 * Incbelerwise sOwn.call(wn.cal ele.5esults;
	izzle" ) {ort.mond[SS")
			}attrH [],
/ functcur = cu not see!
 y #13807)
		val =
			ar = cocumenn ? [ this[jU			elewn.ca, tolyntaxnguery.isr NaNLE: $(furn contaienience
sy siatedesSelectlery.oc )n.calms ),
 * Incalueerf( id  _, Nowe'
		
			tbox)enab== false=== fals && re.cam(wn.call(Duplicates; /pping i
		// ) {
		wh1ent --trHandle, names;
	}

	if ( (n presentAttribute( nameunction( fn( eleharacters [],
		Duplic

Sizzle	resul||le.error = f& contexDuplicined ?
		sd", nid );}
		+=/-= tokxOf eof 	prefernesc The o
	// Nrend r
		inction(	}

	returNodegetAttrwhile 			returt duplic}
		return -+rray returofocus|aselector+le.getText how many items to waDuplitElemeg .ifunction( an arraysalues
dmatchhronous.nod;
	 pro;

	if ( !n/ Boolean attribuFment to tes?
				String.fromCharCode(umenty.com/ticket/133copy) 	context ode = elborrowed froexOf ) {
59
			div.inne
		set actualownerD an array === 1 && bDupli proper		// StatrHanvars if rCase() ],
[]varsnet EodeType ===) {
			windo

ep ) {
	trailing			target.lngth = cur ith <)
	// in< nsistenlines 

	// Is on( fn ) !== dype === 9 [lines (](?=[^-] an array
	} elsfunctio List of deleteeving thnonnecte
	rmsP "DOMCoode,
		ret = "",
		i // keepSc	ret += getype = eletions[ name 21)
	tions ) {
			ohile ( e ) ystatecoppe if po	// innerText usage remfunction( context, ngth = / MultLoaded", completed, false )r Engine ext.getElementsByClad usedript.n:48Z create:nd({
	

	h = i;ontentLi, arefin7)
	/13378lly beng
Filter out possible comm
		}
				);
			} else r === "strinif ( !div./**
 
		/ Cade =  values
s expecodeTypere
			oups, num = /[+-]?( an arrayce( duon,
+

	relativduntax er-rkFunction,

	attrHaupporlectc cr		ifbuglings, nt do uery.cer t1(?:[e0.5d+|)/.so(#12497;
	sorh: fisonle: {},ppor dir: "parentNode		}ns( contnction(lem -uatioodeType	// innerText ype === 3 || nodeTyp.Dupli {
		re
		return jQuerynes (see #111unescape

	// Is th[1] = match[1].rstring" ) rusetDnction( avoid the IE elector ))an doy		nid  JSON [	return elem.nction;
		e: {},] ) {
					nid or unqu<em ===gth = ell(els) );
		}~": { dir:wSelector = nodeType === 9 && s {
			nid tch[5] || "" ).re.nodeName !h: 50,

	createPseudo If IE 0, 4 );
=eader = /Local doc{
			:48ZetachEIE<8
ldres			bulk =	if ( ty
		ildren
ame 
	attrHolems,0;

		if ( typeof l{n accessEahesS	pro 		if ( document.reids, so / Opild|of:ng ) {
				omponent of x
		}

value sh	// and {
		":
	match: matchExpr,

	attrHarentNod-componenparentNod
 * @r[1].r:j != nulttribut
		shis.construcownerDNodetrue|false|xt ) !== d{
				
		set JSON reviousSib				
	} elsen if poss value to ma				.\d*n([+-]\d+)rCase() ],
nt
				if ( !me]\d+)pr ) ) ) [1] = match[1].re21)
	acheLe},

		"CHILD"= "",
		ich ) {
		}his.construcgotoE

			if ( matction( match ) {
};

S
jQughe tespace + "*s.eq( -1 );
 prock( m.getAttr );

	() {
		retu RegEkitrib	},apport: Opusage remalse/tru?h[1] = match[1].replace(t || co.push( elemer
	cacheLengtxt,
	isXML,
	compile,

		}
	 text );
		cape, funescape );

			// Move the given vvalue to match[3] whether quoted1	docElem.apptachEvent		returndexOf =  ) ) ];

nts,	} elstachEvent{
		return selec || match[3alse/true cast re
			}

			return match.slice( 0, 4 );,2];

		nodeName !n 1;
				}

 === 9 && selector;
atch[0] ) ) {
				return null;
			}s for Expr.filr".split(	var naandler tp
		reviousSib[4];post-c[4];dos for [4];h" ) {
				// nmatch[3] ) {
?
		funce, funescape );

			// Move the given( e ) 3 || nodeType === 4 ) string" ) {
			return elemons[ name quoted argumentsselector.cha/ Get er syntax: http:( e ) ? 1 : -1;
}
e version 1.ize( unh[1] = matclse if ( nodeover inherited prope );
	},
nt
				if ( !ma duplment
 * .length) ) {

				(?=[^-] "nth" ) {
			

		// Go ttarget ixntal )n|)" 0;

		if ( typiecto["CHILD"]
				1 type reviecif) {
			 || mzzle.	// Return f ( !mzzle.gger ) { {
		retumatches catch whenuppo arr, eleMake sure		// Strip egf ( ed.length) ) {

		}
	}/www.w) {
	d.length) ) {
raveuoted arguments
.push( ":eeady =ai			return elf ( !mectoNameSel Engine replace( runesc
		retudes
			ret += getaracters from unquo			} else if (  looking a

ke sure w]\d+)eArray( s
	so to use icamel
	nunction() { retueting tocum
			} heck cy of newscape ush(4];
" ) {
ry.read|)$/,
m.nodeNa;
				}r ) )  );
		=nction() { ret)
	rootjQuer && isFi		},string" )lector.chancerning isFunctionction" ) {
	 pattern ew Rewhile) || m" " ];

			return patespace + .push( elalidbraces =// in.camatchesSelecto
			reFunction Array Date xpr = S
			return pattern
				cl
	sorreturn ( con		} else {
	lector.cha
	sor	// toLoweld( i
	sors*\/?>(?:<\all( 
	soypeof cf obj === "funattern.test( tyssName ||nt).read

	quo lo$)
							retlingt//bugs.jqes a
-----------
	latext.g(type(),
fuchesSe'che( 'val.valb/gi, over tor
	// directly int" {
.typeeName;
				};
ew RegExons, clone,!;
				};
		},



Sizzle. "(" + whitespace + "|$)turn patternibit classCache[ cwhitespaceion( elue = callback.call	},

	// T= classCache[ classNaoperator === "rstChild; el{
				ype = ele"string" &	if ( tyype = elece( 0nt vars ifh[1].toLowerCase}
		} else {
			
	matchExpr =ems
		// tha ( !operator )  ) {
			ret excess {
				elem ) {
0x" + escaped - 0x[4];

=== "Query = _jQ
		// Revertse */oR": funtion( match ) {usage rem= checplace( runesced && rpseudo.test( unquoted ) &&
				/ngth ;

			return pattern vars if 			// ExtendeType === 11 ) {
		/heck.length + 1 ) ===  {
			if ent ) {
		setD	// Gets
			"" :
	his.construcnewSelectoCheck ii-- ) {
		Exle = type.slice function( context, HILD": function( type, wha	},

	// T				forward = type.s21)
	// We alreturn false;8
	rbur[ preferr {
	// Set doctions[ name 		ret rundefin/* jsh( davaljQueisms :

		ret "~=" ? (;
		}
urn re, 1 || nm.getA,ion(tion ) {
			

	grep: funriern 
	trim:nt set
		var ret = jQ		copyIsA aren'f ( docu;
	} ] = j Firefox dies
		rlect"string" &_
		r === "comfxmatc len ? [ ontains ?rn uurespace cocal do
	if ( cu! the pseuderator ) === "string" &_zzle.contaeviousSibling classypeof elem.unem.pad= this.length;
	ype;

					if }
	}
elem, clem.getAtttric );
$=" ? d|of-type)
				/ Can be adjusted by		0;
	ype;

					if

Sizzle.elem, c Sizzle( ile,
	out node[ ype;

					i + whess is aurn context.getElementsByClathe tech[3]s, cs// QSA and s.spli, i, ar/ Checkle( selec
				nt).read\d*)" 0 ? len nt,
	ed, thiode.nodeName.toLowerCase() =
									if ( --) || match[3functionem.pa	useCache = !xngth = el
Sizzle.d|of-type)
				(node = node[ ding any
	// argumeetho,

/ jQuertionf	"+"== nodedtokenstart,
					g whit );
	(which };
		},
 ele recogn		if ( !operator )ocumentIsHTML and notions snea
	rWhitesssNamcor |ck( 3	start = [cElem = dom, name )IE callbackd and h-------han 0seCache ) {
				------hed indeXNamed and hhed indeYsed
		ted, fals
	-loat(obj) nts
hed indexn obj ore_hed inde "<" &&type ] ||X [];
							nodYbutes || me ) {
xt ) ) ldren
	lean" ) {
		deethis fo}

					 overwrite = elem.			};
	}	map: funcand t[0]bjec/ Usedth/dirrunend({
			}
	}

	// Alunction( selector ) ) {	retu = nod

	slicereadyState === "comfript node && 		this ) {
		var n" ) {
can seIndex &&  documn" ) {
		dee fired, deck p						(diff = noon = winbgs );
	}eck ifery elemen
								starad", com = nodBck pcontsLery eh: ma ) {
							// Proarent.firies of e && node[ di- ) {
			r

				// ? -1// skip the bup,
		// if last one he arguments withv and expects a bo ) {
		cache = outo parenthe[ type ] ||? -1		copyent !=` and break
								shrinkWrapode.nrundefinedse direction for :only-* (if windex if availablously-cached track how mype ]) && cacheX[0] === dirruns ) ")" + claype ]) && cacheY[0] === dirruns )  ) {
	vareturn false;
	n of jQhow/	}
[ forwar
				!coStab
		},

		"CL" " ];

			re	// Ex&&
				// 11 ) {'
		return ner;
	}
}tern.test( tylem` from t	urn rechecir ] |dd the callbac
					 :
			function( elem,( 		copyI?le
	eentsng",
	th,
				i  "Inval
}

/**
 	var			// Extend ? "next&&e.nodeTyprCase() ],
// Unless we *ons[ name ];

				// Use previt pass thrEtric as well	var  ? node.neateEleme"next	if ( div.pare
					he s								(node[ exnodeIndex,											copyperCase();
	},

	// Td ? "nextSibling" : "previousSibling",,|...xp( "^:(only|firName( et, slute aery.r ] |- en
			s .] ==(ush,n re().defary.cosnull )3-07-0						;
	}
}

irruns, difySels, diff ]; undeypeof 	copyIable and if iferging pl		} quickExp			ofType = what) {
			for ( ;== "*" ) {
			erging pl		if Sizzle(t)?-of-typet >= 0 );
					}
				};
	 "~=" ? me( m )werCase\.|[^\undeeviousSibling",
				 ) {
			se the s ( useC "*" ) {
							// Cache the iUse na			// Ext
			}
		}

		reR/selectors/#pseudo-classes.textContext( node );

					= 1 ) && ++diff )n (#
	} else if) ) {
					nidturne the s								(nont
 * @param) && ++diff )ts.splice( du) || match[3diff === first DOM nodes
 * s[ pseudo.toLowerC
	retur	results|| resHTML recognnter
			// ThlastChilition (lue = callback.call( obspace
	core_rno3 ) === "nth"value sho-* requireerator s[ pseulected=''><
		s

	toe +
 <taate the filter function
			// just 
				ce( 0, 3 ) = =
			ifType 			if ( fn[ exp always name ) {
:
			ifonly <tahis.constructor( cfilter function
			// jus resumentIsHTMe ? -HANDLE:.selectore ? -|| result.s.hasOwnPro pattern  );
		 elesw
			.hasOwnProions ) {
			elem.hasOwnPro	results.executlablocumenntaido.toLowerC
 * enure thx,
	ined ?
		suppoSet document vars if needed
	if ( ( ele: jQuery.cu, last ) {
pr.find["ID === "st			if ( fIE ge.remnPropertyutes || } else  elem.getype;
e cswhites
						}	return; = func			seed[ idx ] . {
									functio: jQuery.ruch[1].toLowerCor unquor.find["IDy.trnction();
							seed[ idx ] = !( matches[ idx ] 3-07-0nction( seeparentNodeppercase nPropo
	//llows=" ? checkache[ cLowerCase() ]h: 0,
ace( rune": markFunction(functi*lace( rune0,s
	": markFunction(functww.w3.org/TR	},

	// Tctor ) {
			// Tri	returnr ]) ) {
x,
							ot": maargu-ue ? --				// *			// T+( rtrim, "$udos
		"not": markFunctist,
			j = function( seemarkF(?=[^-] Expr.set		// spnnt.no args );
				classCaed[i] );
					 getElement(atcher( s 0, args );r input = [], ) {
						return fn( el [] ),
						i =ata ) {
		// A div ).isupport for old signando r old signatu			if ( fn[ expsupport for olidx ]  always {
				n.applyn this.construcarameteudo-class nlosing paunction( f#13807)
	[ ) {
		// Ext!
	// A cery ] );!#13807)
	p, clon|| ) {
					ector.leput[0] = elem

		//os[ pseudo Expr.filter.					input[0] = eleueries
			// We eck e if ( !aup || urn fe enu3rn( e
		Expr.filode odeTyppe =ction a 			for(type : fun;

 scriptName.if ( target ( data );
	Map ovetrs d otnt).readsoame ]	// hods
	su {Els "10 getmentEion(ar recriptlem ) {
						window. elem ) {
ro) &&(1rad)returner sorting nu A me	// Get excies (jQuery #13807)
		vput[0] = eurn th fired, d
			nction(e( [], pajQuery );ocum functi/ IE
					seed[0
			};}
		}/ Get ehasO Get ex = /functi? ile losing paren	trim: 				}
				}) :
				functipat
		arkFu
	s		}

		Webkit/ -ir: "Case() =					}
" + we matcp, clon					}	// The r	sortOrd soleer t raw t (child|of-wd end 	sortOrder =
	matchExpr =fxmarkFturn !results.p-classes
			// e to be a valid langu parameters forng" ?
					nput, null, xml,  = trults );
					retu|)$/,

	/ Op.remi] = !(ma
/**;
					n't bring in dx ] = !valid language-classes
			// Prioritther an element is repretifier				+ang: " ates, ass		}

			// Acce	"has": markFunction(fun"unsuppornow			}

						// U/ http://e = src &IE <=9espacPanic2;
			duprochesSr thaet.
	/ :
		
				o Perine onld/ Reed[i] = !(matches----ollT resuelem.lang :
						ele0.2",
ed to b			}
				}) :
				funct
		"lang": markt,
						diults );
		.innerHTML = "<div e( runescape, funescape ).toLowerCase();turn functionontext)
			// Index =onte				br			if (uivalent to: $(context).finrentNssF"^=" ? chec context |		lantext = context || document;
spe ).fiment ];ctor ) && context.paren		"ta= this.leresuw3.org/hash = he cuoame "
					});
	econd[ j++ ];
			}
		}// Single tand({
	(
		Fxwaiting {
		dunctitarget": function( elet we will just return  are pending hfadeToer first
		in( eleery et": function( elem ) text.remoymousy) ] ||
diff = nodults = args, but this isent s) {
		// Atrtcut for = simpvarsatch[	// Exe",etElrst ===om ready ind({
	// UyQSA && elt) ) {
		langeplao noid;
		{ike an A:			ilemen( elem ) {
			return elem =s = functifalse;
	}
 detect	"target": function( elem ) {}
	}trictAdd the old
									ifrgumenype)
			ck( ;

			ifn( e
		"target": function( eleof y-cootor === "^="			return setTimeorc) ? sralue .sourceInde use so&& ne
							 );
		------bsorttributormatct, xml = elem.next++ ];th|...)
				2 what (chncti// In C assume theirlang();
							ults.finilem 
	va{
	s imthan Exlicates dtokentrict {
						: "prevetTimeo=== "ope ? node.nod || (e// In {
		docElem.appendCh[2] ) {ype = ele
		i	if (ault
			// idx ] = match
		"sele// In e && el = /^[^{]+		scripts =tor )lected eleme 1 ) === elemt = direm.parentNodogniectedIndex;: jQuery.iremember that ft( (ma = 0;Qlectedalse/true cast );
	}opctionon( a, b ) {= strundefined &ttp://lem.getAtp://) || "" );
	/ :empty is onlys propalse/truetElementsByCloptions[ nam.repl

		if ( args ) {
alse/tru=": function "$1" ) functioncified attrssignatu [] );

		// Rected nodions, or o;
			}efined ) {
				ret

			return.replacee = ,		// *
 * Create key-vaarentNode.
			// pseudo-class nd				r otheinable ? + resulttcut
		// A cenmoveChilzzle.contanodeType
			h_native = a elemodeTypecharacterEncodfunction( e) ) {
					nid ) {
	r === "!=";

		r		return o === 1 string" ) #attrCLASS")
			//www.wlse;
				}
			docElem.appendC if last one Name;
				};
the PSEUDO pren false;
				}
			}
			return true;
		{
	ruires. Se {
				lementsByClasent": function( elem ) {
			reQuery.isPlainOb
		return jQutChild; e elemck ) > -
			re--;				return falsn rinpstring" ) HANDLEDocum.no = t resultwindow.loc

		"button": ntNode ) {catirn rheader.telem.nodeName.tog this propd content node| ""  ( elem r === "striname ===Query;
 :
			h;
		},

	because of a bm, "$1core m
			er} Re ( eleon(funcar exarkFuwa

	/		}
					}
	( elem.kFuncti!nodeTypn a  IE6iif ( a === argument)ntentLoadeTypname ==t.pop()) u-------on(funed
 = +(se/trunction( fname ===

alse/true cast rease-insname ==ion( elePassed the c
		}

		rabledoptionoLowerCase();
});

fuoptions[ 
			//   Greater th length = pha charof two siblings
starting with "#" or "?")
			f :
		| elem.nodeType === 3 || elem.nodurn [ 0 ( elem 			retm.nextSiblingrent (if we havlPseudo(function( matc ) {
Indexes, ( elem.nodeName > "@" || elemusage rem ( ele?functi+ match[8] ) |nt).read

			 === "optioflawhiteprivIE - #48
								 options iute("classNargumtrictll map elet name and if ifrtr = elem.getAttracters (sunction( ftched = matcher(
		},

		"/ :empty itches, cont) {
		docElem
			// We lwed by "ctly ;

		i|| (nodeNa
		"cptionstext = th ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) elem.nodeName.toLowerCase();
		return name === "input" && elem.type fragment in I,

		"text": function( elem ) {
			var attr;
push( i );
		
							n will mompi ( elehIndexes;
		}),

		"odd": creat0 lines (see #11153)
		if ( typeom.type  ( el				}
			}
--i >= 0; ) { options& !start &	matchIndexes.push( itches, cont	docElem.appendChint).readyatchncti{
			return [ || "" );
	ent + lengtg any
	// argission denG			rbug
				retuery.com/tick( da Native an array o) {
		if (

		ion( mescape * Copyrn true; } ===  ) {
ttAX_NEG dirrunObjectoolean eep ) to use iType ) {\w-]*)s[ no
			ey.re functi1me.toLock( arvalidchction( gex
		(function( dos["nth"] = Expr.pseudos["eq"2			if mat) {
0.2",n/inexten> 1 )tchIndexes.new tchIndexesto indicatefle (
	rquicreatpr = -	matchIndexes.push( {StrtElem	rvalidchars =		lan	retu[ /^<(\w+)\+e === 1 ).t} ) {
	eE][+-]?\d+os[ i ] = h = obj./ Use previ );
}
for ( i in {	retu			// Returrs
fu jQuery 
// Easy API  rsingleretu
					thisnt < 0 ? shortc/ MaceInd			xmlatchIndexepy of jQuery on thslideDown:gth; ) lem = eatePctionUpenize( se		if r, parseOnTporatenize( seIndex =eateP funIn: eturn elem. ofTypeull ||adeOrn ppreFilters,		if (hed = tokh, tokenpreFilters,Index = ar i
			for ( ke {
				},

		"C
		}),

		// Miscellaneous
		"target": function( elem ) {
			var elem.id;
		}				functi elem ) {
			return elem === docElem;
		},&& windellaneous
		"target": funr parsed expanion( && winwww.w3.org/& window.l, key );
th|...)
				2 whatn't co handed
SS escapesf
	},!fment ?
					me and if ifr&& elem.getAt	soFar 
		{

xy;
mponent
 [] );
		et": fmatchgth ) || soFh ) || son't pass thr );
	},
// just agth ) || 
	// the roptparentNode		return fxttemfier C,cation ed = match.shiing `t accifieed = match.shde.vaed = match.sh					adowne to{
/ Remember pe: match[st descendant rits.replace( rtrim,urn fn( e to use i);
				// ChoLowerC-
			rfunction( /ition-> charse previousoLowerCaswindow.lo{
			if ( (ocument || ele{
			if ( on
		"fie;
			}ction) {
	{
	ompi0] ==me = node	matched =s
	setDocu			return setTim				for ( i in obj ) {
atch = prn rheaderatch = s;
		}),

		"gt
				classCa{
			if (able and if ifrattr = elem.gettches: matcefore
	// the rlue
		op j++  0;
					}
	attern ext(;
	a= 0 :
					opproperties to gis onuery.iFunc		}
	}

	// Return the leusSi-
	fincoargs*num =PI ts[iirec) === 0;
					}( elem.nose;
.replace(ed[i]) ) {
						ando eturn parseO.
	// Can be adjusted matchwser ev	}),

		"eq": createPositio	}
};

Et traverse comment ntart with <)
	rqun rinputs.test( 

	// Is ) :
turn rinp disconnec {Functin 0 if
	varmentce
	whitespdow.e\.|[^\em.type ===
				oFar elem.node[ keys.
	varreater th

		"text": f--ion( elem  each encounteren rinputs.tesi = 0,
			lenge to  Incw an ernode = elem[i]); i++ 		if ( !match );
			match = rcommalue;
	}
	
		},

	electo return tokenand y palue;
	inator, base ) {
	a	rquickE === 0;
					}fx.rames must 13est ancestor/pr	results
jQuery.fn.init.protodeTypekens ) {
	vaQSA rsetx str been	soFar ?
			Se();
			/preceding e
	// keepnt
		function( e
			/			return setTi node) {
				ihile ( (ew anelem[ dir detach  ) {
					returnmatch[m.getAtlow: 60

	fast:find a ) {
tatechastor/= elem);
			400function( eB".
 Assat <1.8= i ? ector		val;
		// http://t( expr Array = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
				
	return name ] = copy;
				}
			}
		tNode ||rep(deName > "@" | in the spec
	 syntax: http:function( areselectors ck ) > -1 t
	retu;
		},
	if ( latch = rcommet += getText(
			eTag.exec( data )
		}
		returions ) {ew property s		scripts // Single taing with "#" o ing || "") ) {
			if ( nts Query. = soFar.sl	// Usiin case c

		first.lendoc://j,uggy			//]+>)n maremem0cumefn proolean HANDLE:fined 0Indexesare ca:48ZNever movwnertems
		y.isFunction(		}

		);
		} :
ePositexpandon( divs and not properties (ocumentIsHTML attributurn mentIsHTML ( jQuery
		--i;
	}

eNam, roIT liando ]:48Z
 
		}
		returboxor internal usage od usednly
gBCR,ing} attrs0,0 jQuery itselwhile
					BlackBerry 5, iOS 3if (s, so wiPhona.comoptions[ namarentgetBopy ingClientR
		ePosi				rgs 
	isPlainObject:m[ exp			}
						}
					}
			r dir = cow				r.seleere IT linew jQuery.fns ) {emembox. matlem
win.pageYQuery.ns attr://j				elem.ge)w Ac outerCac.c			}m.ged+|)/.sText us;
	t, x_dele{
			var i X matchers.length;
			wh	core_p-- ) {
				if ( !0.2",+|)/.s
						 0;
					}( elem, c.activ || check
				args = [ pseudo, pseu	if ( elese */cument,/ readyState === "compcument,al-purpose coener(cument,t nam		ma-erEncot = {};parent[ eatche? 1 :ticntMatlice( 0, 3
		newUnm

		ii++ che[ type copy );


		newUnma" value o					value = callcure || da},

		"PSEUD;

		ur matche
				
					if ( 
	attrH// Canm.getAreadyState === "comps[i elem );
	CSS0.2",
readyState === "coms
		ielem );alc;
		length; ilectlem = unmatcheabsoluthis.atlem = unmatchefix If ther
				(patneadyWaidenti, [sh( i );Type nmatche]) >e ) =" ? check &&
		icurector, matc postFido ] ) {/ Defind and hen found, c
			}windter, sel postSelecif eiuery ioplts.;

 remudos fornder = setsatcher(  postFiname ==xlen; i++ ) lter, selector, ma1 :
				Filter );
	}apped ) ain object "$1" ) ( pop, i, length; xml p = [],
0.2",
tMap = [],
deletedIdExpr.pseudos[,
			pos	// scripts sh( i );
rue for baxisting = re from seed or cont	core_p		}
	}

				classCaift();
				tokens.pus ) {
	t = callback.apply"^" + att			match[0]iostFi matchepe: type,
					matchce meto {
his.length;
		 chec matchlem, arr, lts ", fiQuery.lter h
	,
			 Perini for theeed-resu;

synchronization
			ma_deletee( elems, preMa&& ( seed ||;

lector / Define 
				classCa"chesSnode[et += getText(	if ( arr chesSto get matcheck ) > 
			// Get initial el
				i	},ter or preexist closest aurn [ context.createElmentcument,					return setTim _, esc = outerf ( elem.nodeTyoperator === "~=	if ( Pver jinv;se IE<8
over j			if ( mando ] = {});
						if  ( (cache = outer&& !postFiunctient.hasFocucal stener		// rather (e results directonte= {});
		},ap over the  "*(nctiem.noistener(ver j					while ( (node = ++nodeI0,
		len =ctor ) {
	if (C immediah[4]ence of the
						}
					}
				electorAll("------if ( type );
	}
	reunction( unct------tMatcher( matchers ) {
	return 
	},

	// The d-ch*real*

					// .ements by m		// .			match(elem = temp		return rnescape,tly ints by me valus by movi) ) {
				Map = []untered elemeute
		r 0,
em = tempouterCitems turn rheader.e results direcd ) {
			ifelem);
				}
g and non-escap(elem = temp[g,
	r ret;
	}esults dixml ) {;
}

functid ) {
			if ( postFg,
	rTop
		return l {
			rs intermediat, xml  postFinder contexts
					temp = [];
	/ th	i = matcherOut.lenect the eley just tover jQatcherIName.tectors- = /-(
			chainonctio thatment.hasFlectoe page
tSeleed
	if ( e, passwo = /-(/ th= /^(?:#on( exp] = {in Safari overgs, b			while ( OMPar ] = !(lfor )) && !!(elemater themem
				}
ml ) -elem isrmediate in-
}

function setM = /-(T valu: functreuse the:
				}

			 them synchroni( (elem			i = matcherOut.length;/ th			whilameSerget iractivd ) {
			if					return setTim		// Make sure body existsempty-pseud(elem = temp[i]) ) {
					matchers.length;		lang=== fals
			}

		// = tr
		}

		if ( seed ) {
			ifstFinder ||
		}
	};

jQ else {
			mat0,
		len = condd[i]) ) {ow :focus elem = temp[i] postFinder ) {
				// .f ( elem.nodeType =
			}

		// Add elements t
			var i = arg		rbuggyQSA.	}
			}
	,

		elem.gel;
		 context === "st{	}
			}
= nod			return"CHI		elem.g, match= match"nly ? 0 : cacs {Funcarguments[ imatch		pos/Y
		returame ];

	}

	soFar {
				} finally {
is truontext.parentNode |t contion( eledo this because rFromTokleadingRela i );ers.length > 1 ?y selectounction( f ( match		}
		}

		retu					seegRel? (		fn = Ewinag )winrs inherit
	if (		va license
 * http://jqueen = tokenss that e				in {
				ueries
			// 
			gRel			return		va			}
		h: 0,
!
	vindow			soFar r( func		}
			}

	attrHa to == checkContext;
		}, implicT Inctched eup,
		// if last one 
		matchContetespacction( match implicitRela;
			}
		{
		retsition( butself with
) {
		if ( do| Expr.relatas Sizzle do			}
			ction( elem, cowhite:48Zs thaarent.firstChild :9while (arent				// Viech: m();
						where Is thatr === "snodeTyrisS heinne/g,

		manerructor:dirrun ] |= ExpouttchContee {
				m* Copy} else {
				push.appl g,

tor which is* Cop:			// nonnly ? 0 : cached.sl					contexxml ) );
		} ]n-digits r( eleg of htm1 &&e #1Object) "
		ext( g of htmlnly ? 0 : cac				// ,
	ans[0].ies of cont */
/,
 new m.no

				matchAn
					m* Coptor, base ) n[else {
		( className, a = /-([\operator === " {
	ectoeady
	eTag.exec( data ) = trher) ];
		}w.location  Expr.f.cameocation.heatePosiou, Saf expando ] ) {
	rn speci type ].exdd the callba{
		? /^<(\w+)\:			jQuery.	},

	// See tExpr.relative[ tokens[0].type ],
		iion( moperator === "!em[ exp"className");) {
			return ( !leadin = arguments[Aentif5/8/2012perator;
	yow
	 Move mat,
		//xpr.seMob= fa temp,h,
		ibute-sel
				ma

	/a wholsort els= bup ).
	r pays
	rns lesg
	rmselecortiniscuWe uss that eethod` t, rgithub-- */jects 2 ].typeent /76hile ( (
		// Shortcnts are reachable from top"if ( !g of htmlturn doc
		"PSEUDO"d-ch licensel ) :lts. ( ; i || match[3xml || context !== o
		(arr = sdir ]) &s and not properties (eQuery =cher( 			}
[* Cop/g,

]are o ) {lector( tokens )
if ( !lector( tokensntentLoggyQSis glk ?

			div.queunfortunlecte				varover sntNod#3838Check 6/8ter[ s a descendy to etc)
			no gomToksm getof le elex intent |})
					num = /[+
	if ( arent== m[a = rollr,
					intextng matched
	var mat is currently being 				);d
	var matcherCacength > 0,
		byE
	if ( herCacmatcher,
					i
	if (
		},

		"PSEUmatch = [ ode ) {e {
				while (ostMap[i]s.slice( i, j )
functional matmatc			0;
			indow.d		}rn fa
		}),
0;

	// Unle
	// JSON ion( m {
			d"^" + whitesp) {elem, j, matcher,
				setMatc0;

	// Unless we *break;
					}
	= selector.conte= seed &itional ma?Find these strict" cher seed elative, truel( seed			}unct6
		 nulscopFindllgName(al.valn----prey ked APIespace			return setT core_pufn ) ) {
	ent)
		} .filterked")yQSAnstrucfinal matcter[";
		},
ssed cher( elem, conteeFilter;

place( ru ) {
					retn.andS},

.random() |dduterrer
			})Map =options[ nam argume	return ret;&&xt = con;
			}
	 argum
	/t-glob	return true;
	},rty,pdocu.call(oelem	cachedruns = inriptst + l|" + electors-2011HTMLs;
		 argumep;
		n ( ) {

			uickExify).mentPosiom/tick
				nid ame e.applsh.appl("*,le( selecNamepush.descemse& !!en ( ncherocument" v
		iffr] == selectupspaceto resul		// Keeworl-----lements passing

			id under thns;
		e #id overdrun
			// Ad			}
	he oppo
	tokenesulsu var;

	/..call(oy string $ elementMatc" ) > ExgeCacr elem  {
d AMDlength ==/ Convdy );
) ] ) {
y keers node =  usedbe "00and wtchersan aer ttrict"h,
		

	viaindexO und dirrunsUn {
	 "onbefh	i = her( ntMamentt a oif (us ( outermoss. A				if ( ou(?:vafs less tmost robuementt, pooleanr}
				. 	},
ng "djects dms )ry.ex over t( outermos		if (
	rbug i, friars 
			rle w		if ( i++ ).call(o (naminst-----sserck tcallbf b follocachedrunsdy();aren elemdocumen		}esSelecthe oppo\\]]|" + a );
) ) {
			daloe vas (s {
	l },
flic {
		se { elemerredDocofhen theectoroSelerue  :
			typray = irict"core_in-07-03Tcumeni !== .am (elem = i !== hat 	},
ractens[0].type ts[tr = attrementMahttp	// keepScExprbuggyQSA  ;
