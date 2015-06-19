/*!
 * jQuery JavaScript Library v1.5
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Jan 31 08:31:29 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// Has the ready events already been bound?
	readyBound = false,

	// The deferred used on DOM ready
	readyList,

	// Promise methods
	promiseMethods = "then done fail isResolved isRejected promise".split( " " ),

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
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
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.5",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
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
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

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
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
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
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	 var options, name, src, copy, copyIsArray, clone,
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
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
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
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
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

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval() ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
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
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( jQuery.isFunction( this.promise ) ? this.promise() : this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj , i /* internal */ ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[ i ] ] = deferred[ promiseMethods[ i ] ];
				}
				return obj;
			}
		} );
		// Make sure only one callback list will be used
		deferred.then( failDeferred.cancel, deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( object ) {
		var args = arguments,
			length = args.length,
			deferred = length <= 1 && object && jQuery.isFunction( object.promise ) ?
				object :
				jQuery.Deferred(),
			promise = deferred.promise(),
			resolveArray;

		if ( length > 1 ) {
			resolveArray = new Array( length );
			jQuery.each( args, function( index, element ) {
				jQuery.when( element ).then( function( value ) {
					resolveArray[ index ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
					if( ! --length ) {
						deferred.resolveWith( promise, resolveArray );
					}
				}, deferred.reject );
			} );
		} else if ( deferred !== object ) {
			deferred.resolve( object );
		}
		return promise;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySubclass( selector, context ) {
			return new jQuerySubclass.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySubclass, this );
		jQuerySubclass.superclass = this;
		jQuerySubclass.fn = jQuerySubclass.prototype = this();
		jQuerySubclass.fn.constructor = jQuerySubclass;
		jQuerySubclass.subclass = this.subclass;
		jQuerySubclass.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySubclass) ) {
				context = jQuerySubclass(context);
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySubclass );
		};
		jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
		var rootjQuerySubclass = jQuerySubclass(document);
		return jQuerySubclass;
	},

	browser: {}
});

// Create readyList deferred
readyList = jQuery._Deferred();

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return (window.jQuery = window.$ = jQuery);

})();


(function() {

	jQuery.support = {};

	var div = document.createElement("div");

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		_scriptEval: null,
		noCloneEvent: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	jQuery.support.scriptEval = function() {
		if ( jQuery.support._scriptEval === null ) {
			var root = document.documentElement,
				script = document.createElement("script"),
				id = "script" + jQuery.now();

			script.type = "text/javascript";
			try {
				script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
			} catch(e) {}

			root.insertBefore( script, root.firstChild );

			// Make sure that the execution of code works by injecting a script
			// tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if ( window[ id ] ) {
				jQuery.support._scriptEval = true;
				delete window[ id ];
			} else {
				jQuery.support._scriptEval = false;
			}

			root.removeChild( script );
			// release memory in IE
			root = script = id  = null;
		}

		return jQuery.support._scriptEval;
	};

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div"),
			body = document.getElementsByTagName("body")[0];

		// Frameset documents with no body should not run this code
		if ( !body ) {
			return;
		}

		div.style.width = div.style.paddingLeft = "1px";
		body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( !el.attachEvent ) {
			return true;
		}

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	div = all = a = null;
})();



var rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !jQuery.isEmptyObject(elem);
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !jQuery.isEmptyObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !jQuery.isEmptyObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
					var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = name.substr( 5 );
							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery._data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery._data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t\r]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			// 'in' checks fail in Blackberry 4.7 #6931
			if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					if ( value === null ) {
						if ( elem.nodeType === 1 ) {
							elem.removeAttribute( name );
						}

					} else {
						elem[ name ] = value;
					}
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			// Ensure that missing attributes return undefined
			// Blackberry 4.7 returns "" from getAttribute #6938
			if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
				return undefined;
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}
		// Handle everything which isn't a DOM element node
		if ( set ) {
			elem[ name ] = value;
		}
		return elem[ name ];
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	},
	eventKey = "events";

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
		  return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData[ eventKey ],
			eventHandle = elemData.handle;

		if ( typeof events === "function" ) {
			// On plain objects events is a fn that holds the the data
			// which prevents this data from being JSON serialized
			// the function does not need to be called, it just contains the data
			eventHandle = events.handle;
			events = events.events;

		} else if ( !events ) {
			if ( !elem.nodeType ) {
				// On plain objects, create a fn that acts as the holder
				// of the values to avoid JSON serialization of event data
				elemData[ eventKey ] = elemData = function(){};
			}

			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData[ eventKey ];

		if ( !elemData || !events ) {
			return;
		}

		if ( typeof events === "function" ) {
			elemData = events;
			events = events.events;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( typeof elemData === "function" ) {
				jQuery.removeData( elem, eventKey, true );

			} else if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					// XXX This code smells terrible. event.js should not be directly
					// inspecting the data cache
					jQuery.each( jQuery.cache, function() {
						// internalKey variable is just used to make it easier to find
						// and potentially change this stuff later; currently it just
						// points to jQuery.expando
						var internalKey = jQuery.expando,
							internalCache = this[ internalKey ];
						if ( internalCache && internalCache.events && internalCache.events[type] ) {
							jQuery.event.trigger( event, data, internalCache.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = elem.nodeType ?
			jQuery._data( elem, "handle" ) :
			(jQuery._data( elem, eventKey ) || {}).handle;

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) &&
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery._data(this, eventKey);

		if ( typeof events === "function" ) {
			events = events.events;
		}

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;

					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false || 
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName && this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			}, 
			teardown: function() { 
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) {
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, eventKey );

	if ( typeof events === "function" ) {
		events = events.events;
	}

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !/\W/.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace(/\\/g, "");
		},

		TAG: function( match, curLoop ) {
			return match[1].toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace(/\\/g, "");

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
	 * jmatch[3] = Sizzle(uery Jav, null.5
 * hcurLoop);

 * j} else*!
 * jQvar retaScript L.filteribrary v1.5jquery., inplace, true ^ notcom/
 *
	if ( !MIT or  /*!
 * jQ	result.push.apply( cense, Johncom/ * jQ}licenses.return false
 * htp://sizz * Copy
 * Expr.uery .POS.test( uery J0] ) ||oundation
 CHILDeleased under the /*!
 * jjs.com/L Ve
 * h}
 * h
 * hjs.com/uery 
 * },m/
 *POS: functioned undeDate: Monion
 unshift(PL Vercom/
 * */
(function( wi
windo0500* Duals:*!
 *enabledfined ) {
elemDate: Monjs.com/
var.diswindo ===/
 *  &&tion()type !== "hidden"on( window, u {

//w.document;
var jQuery = (function() {

// Defi08:31:29 indow, ucheckselector, context ) {
		// The jQuery it conss actually just th-0500selectselector, context ) {
		//// Accessing this property makes rootjQue-by-defaultp over jop) {s in Safari workof overly
 * hion()parentNode.rootjQueIndex
 * hery = (function()rootjQues actually just the in	_$ = w.document;
var jQuery = (funct!!ion()firstChildy just the inemptyy,

	// A simple way to check fr HTML strings or ID stringshasw.document;
var, i,
// Use the co check foript Lid underv1.5
var j.lengtion( window, uheaderw.document;
var jQuery = (funct(/h\d/i)eleasedion()nodeNamordingust the intexry,

	// A simple way to check "imRi" Defil copy ofctor, conteradioght = /\s+$/,

	// Check for diatch 
	rdigit = /\d/,

	//e init coboxght = /\s+$/,

	// Check for di// JSON +)\s*\/?>(?:<\/\1>)?$/,

	fileght = /\s+$/,

	// Check for dibfnr
	rdigit = /\d/,

	// Mpassworelector, context ) {
		// The jQ"se|null|+)\s*\/?>(?:<\/\1>)?$/,

	submiight = /\s+$/,

	// Check for di*\[)+/+)\s*\/?>(?:<\/\1>)?$/,

	imagrt]|u[0-9a-fA-F]{4})/g,
	rvalidtoopera+)\s*\/?>(?:<\/\1>)?$/,

	reseight = /\s+$/,

	// Check for di)/,
+)\s*\/?>(?:<\/\1>)?$/,

	button-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?nt str
	rdigit = /\d MITce
	trimLeft.toLowerCase() Defi
	userAg[\w.]+)/,
	ronpury,

	// A simple way to check (/f the|rootjQ|imRiarea|nt strg whitespace
	trimLeft = /^\s+ (sandbosetFvar document L str]+>)[^>]*$|#([\w\-]

	// Check if i Defi0 /^\s+/,
	trlan DOM ready
	readyLi+)$)/,, arrayst,

	// Promise metlved ace cha - 1or ID stringsvering for use withyList,

	// Promise% 2e methods
	promiseodelector, context ontentLoaded,

	// Save a r	// The ready lhods = "then done fail isRest,

	// Promise<has a non -thods
	promisegn = Object.prototype.hasOwnProperty,
	push =>Array.prototype.push,
	slnth]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if rray.prototy Defiior ID stringsqay.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type  (sandbo* Dualcument PSEUDOcore methods
	toS isResoisolved isRejecte11, neft = type p1]conte\/bfnter =oundat
var do[

		/]om/
 *
 * (null),ate: Mon Jan 31 * Dual  done fail isResolved isom/
 * The Dojo Fo
		//the contains"		return this;
	(l copyextContentr.userAgeinnerTex		thiesig
 get 1;([whites]e MIT"").i// AOfibrary v1) >ethods	if ( selector.nodeType ) {nots.context =c;
ohn Ruery Javom/
 *
for ( 11, j = 0, l = "boace char j < l; j++query.org/lor.nodot[j]
	rdigit query.org/lice.com/
 * Copyrig2011 -0tp://sizzlJan 31 08:31:2	if ( select!
 * jesig
 errornodeTyps
 * h011 -indow, uGPL LrootjQuery ) {
		var m, ret, doc;
y of / Handle $(""), $trim digit n this;swi// A(ng wit/*!
 * jcase "only":elector );
L str	// Veri	while ( (an ID?trim.previousSibling) )	ery.org/li[0] = dde	trimT with.toSc( s y.org/lielector = "bod

				/	this.ltp://sizzle
 * g withthe atch,  ) {

				/Jan 31 08:31

				p://sizzlean ID?
			match = or );
Meth and that no context was specinext #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( m;
			return this;or );
nth and that11, L strth HTML s2$(""), $seMethdy" && !context && dector ) t = rext) && lectormeth
			this.selector 08:31:29 2$(array)
rest
					donmLeft y" && !c0g.exec( se	_$ = D?
			
	_$ = wind /^\if ( ret ) {];
			&& (	_$ = .sizcachf jQueent.creat||)
	quitch[	// A Date: Mon 
					cou					hods
ector = [ ddocumenan ID?true );L strings o} elsery.bucument || context :query.org/li&& (match[1] || !context) ) {doc ] );[0] :ector = [  = ++( ret
 * htt$(array)
	} 		if ( re ];
		;

					 else {
	
 * http:/
						}
ocumeiff					jQulone(ret.f-Query			if ( ret ) {
						ifainObject( context )
				methods
 * http* Copyright 20= this[0]ById( %				elem = do&&ById( /{
				istsjs
 * http:/f ( typeof selecI=== "string" ) {
			// Are we de (function()] || !context) ocal copgetAttribute("id"ng theunction( window, uTAG in the document #6963
					if ( elem ibrary {
		*") {
				] || !context)e MITerAgent,

	// For matching theunction( windotor = CLASefined ) {
				// by name instead of ID" " +0] = seclass{
					
						// Handle ththe j")) + " ")his, sody eleme			// Are> -	// The ready ATTR		// Otherwise, we inject the elc;

		// Handle $(""), $cense, or $(uattrHandled)
		if ?his, se			}

			// HANDLE: $;
var jQand that
varANDLE: $(!=5
 *(expr, $(xt.jquery ) {and thatrite
		// Handle trings
(""), $valuetur this;+ ""(""), $g with HTML sag.exec( it coteElement4ntext && lector  this;
				return (co1] ) {
		!="Query).f1] ) {
		="(expr, $$(expr,== t to: or( context ).fin*d( selector );ody elemeit coexists	// HANDLE: $(func~d( selectoirectly$(expr
				tcut for document ready
		}!t to: selector );
&&		} elsejQuene a lor( context ).finructselector );
jQue

		// HANDLE: $(func^ion)
		// Shortcut for documenisPlaior( context ).fin$ion)
		// Shortsubstr( Short " ),

it cor, thisor.con

		// HANDLE: $(func|d( selector );
			}

		||n( selrray( se0,;
	},

	// +) {			}

		+ "-ctor( con
 * Copyrindow, undefined ) {
 {
		var match, elem, ret, doc;

		// Handleag.exec( (null), or $(u The deferd)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
	f ( typeo (sa
}[2] )11, origPOS, or $(uion
 * Ron( sescawith ned ) {
a * httm)eable-]?\d+)?\\ctly numrs
	 useuncturn slocument.boy of inoundation
c( seleundation
[lementvaScnew RegExpFoundation
unction(.sourclect(/(?![^\[]*\])urn a (]*\))/

			/)
		ifundatleftMt: function( num ) {
		ret/(^(?:.|\r|\n)*?	this.toA +turn num == null ?

			/.reT or (/\\(\d+)/g,  Get thrray()p://s11, te
Aved i Nth elemenplit( zzlensesc( selelved i= sh it.protoy of.slice.calltack
	//					/
match[ (returning thn this;s
 *
 * Includes SisoArray: functipr)
			} elssthe w.call(lector lved  eleon( e// Perform a simplet with to determinDojo the browser is capwind of		if convert] ],a windLists ) atructor u in cbuiltin methods.		if Also verifies that.appllectoredolved iholds DOM} elss		if (which ele"bodapplr );inret.cBlackberryly( ret,)
tryheabltched element set)
	pushStadocum}
 = this.Elehis.scngs windsuncti[0]!== match

		if (rovide aeleclback// Add ojo it doe

		r in 
} cery ( ec( seled push it onto the stack
	// (returning thor = iy ) {nd(expr)r, contexse cu[ntext &&atch[1oStringpushStlved ng the [objectatched]s.context tched element se *
 * IncludetMElement)
		if 					// Checkatch[1] )ofplit( " " ),
t
		iumbers.context =ocument.bo
			lit( " " ),;h = Al; ient;
			thisre
 *
tack
	[i]js
 * htht 2011, The Dosed internall;Query.eacack, args ) {
		return jQuery.each( this, caltion() {
	element set
 : re

ements ansortOrder, s#id
	Ct coon( e
 *  = this.selector + (this.som	_$ D= this.Posi) {c( sele
		readyL onto the stac, bc( selec
 * as is:
			thi\w\WDuplicatetur08:31:29 2lector hods
		return ret!aunction( i ) {
		return 				bunction( i ) {
		return i === on() {
	);
	},

	last: function? -1 :oString,eady();

		);
	},

	last: functio(b) & 4his.pushStack

							// Che-1 ?
			this.slice( i ) :
			thi11, al, blewly-fap = [$(""), b this.pushStau thia
	_$ = windpushStap(thib, function( elem,cu	thiaup[2] );// TheprevOb are identic) {w.conn exit eaf overws.slice( i, +i + 1 );
	},

	first: function() {
		retm, i, eIh.appl);
		}));t.done(s (or;
	},

)end: fundo a quickt with arguments s.slicp(th i, up
	},

	slice:t.done( fn ) i ) :


	// For inno{
				s were foundret. = thi);
		}));disconntjQuee a jQuery metho!d.

	},

	slice:

		ater instantiatioh: push,
	sort: []Stack( slice.// Otherwiseret.y'onlyomewh iniuery m = thitre
	 vend:ne later//s ) }
d up if 	retlrge(oh.appl	_$ = winds ocumnctionison,
 no contck.ccheable ap document s.lenunctiock.calcuruery.fn.attr.ca( slice.ck.calb( elem, iarguments.length,
	bdeep = false;

	// Handle a deep copy situation
	ifa
	eacpace characteb
			bhe boolean Array, Start walk] ],dowme, src, coloo Handocumaototyrepancoverwocument.bothe n( callal		} = Abback, args ) {s.slicpeachjQuebbjectate: Mon Jan 31 .sort,
	splicebjec,& !jQuerunction() {
	Array, We ended	 varp://jqupe, src, copy, metht.done(ot like a d promise".spleturn (c.sort,
	splice: [rget =-) ) // Verrget) ) {
		target = ,t) )l(argumentngth; i++ ) {this.slice( i ) :zzle.js			this.slice( i, +i + 1 );;

		// Add ( slice.ment(k.call|| context : target === "boolean" ) {

 * se ob i, +i + 1 );n.init.protots, callbackandle a det
			for ( nak( slice.apply( ll(argumetend // UtilityNth elemes a sretreivin case lectn( selef ar, elems ofret.prevObjereturn this;
 onto the sta
varrning th11, John R""-white		i = g (possible in def ( dunction( fn ) {
var digit IsArrend jQuerGe	ret.c
			fromcopyIs);
		}nd CDATAprevObje	src = .id !== match[2] )3
							retu !context4jQuery.fn.in +	// HANDLE:V(expelem, i, elraverse everythf (  Cop, except1,
his.ray = falsjQuery metho.id !== match[jQue8src : [];

			return this;
	w jQuerylector ? = false,
end j;

		// Add

		if defineto sepush.apply( ret, lectors		// ve thbyodeTypwhenget =query
		}y ge + (thisById (	copp} else if in ar fun)
(ned ) {
 matcuery {
	goin cao inack fif (k namputlues
		 withsedpecontododeTy&& copyQuery els this.screate+ (this("div"HANDLEid ( jscript set Oew Date()) thisime(HANDLErobody" = this.selector + (thissPlainObjength =HTML ( j<aodeTy='ctlyid: "1'/> and}

	Idifiedit intotack (y = ues
		of jQue its statury mnd removence od, n over.
	.insertBefore(
	noC,s.
			ret = jQu].splice, elem opy;
				 hass ) )o addeturnalt withs afll),aed ) {
					ta}

	/this;slow the	// Ble caocumo= fuly( ret,s (hencion() brancit )			t		return this;d ) {
					ta( to  Date: Mor $(undnd.ID onto the sta isReso
		ext, isXML {
				src = ay of ake suref ( wait === tr jQuerundefined elem!hat the DOM is copyConf loaded
		if ( !jQueribrary 1]com/
 *
s]] -> t(expr, $(m..$ =selector[1]n() ay of aselector );
windy.readyWait || (wait (ticket #5443).
the caelse {
		ets a little ourn (cont[mjQuery).finyWait || Query).fi
		rf ( typeo) ) {
r $(undefinWait--;
		}

) {
			// Are we dealindFragmeay of ad( selector );
).
			if ( !document.bont, and wait if need the ca.find(expr)
		&& elem.parentNode ) {dFrag/ If thmeout( jQuery.ready,never- ret = y items  to trings beforevent fires.rele );memorynameIEy items ontnoConf
 *, co)(t > 0 			}
		}
	}

	
				// Don't bring in undefined val
		isReady: fal//if (  drn thd ) {
			sByTagLeft("*				.fn.trition(d objectues
		&& copydivonflict: function( deep ) {
		wreaddiv * IendveWith(lict: function(C ? src(""rray()" ).unMjectsure jQc) ? src		}));t funnt forwarivf ( wait ==}
		}
	},

r, this > document.ery.readyWTAGt--;
		}

		// Make sures.selector =  (returnsReady) ) {
			// M}
		}
	},a little ot > 0 ) {// e defe out post.doeled after				src =  little o		if ( eue && !jQuerytm this.text && document.boe in de (returunction( fn ) {
		ems, name, s[i"") + sele(ret.cacheable ? jtmpturn jQdEventList				// nodes thalength = 1;usly to tm eleEventListenent set
		var retute
			read.trigger ) {
				jse i Handle fined valnormalized hrefw.onload, dy,  eve,

	// Is the k
	='#'></aed? Set owser evehe ready ev&& decreme
		// If IE eelector );
y.readyWait || (waiLoadeis used
		} else if ( docu("k
	") jQuer#lla, Opt.readySt

			// H.k
		
			// If a nor jQuery = (function()lector );

	oad,
, 2 = /^\s+);

			// Auery ] );

			// TrigdyBounready events
				return this;!== uSootjQorAllla, Ope			}
		}
	}
 copyoldript LaScript Lewly-fdyBound ) {
			return;
		}

		rewly-f.$ = ___sipt L__d? Set ventListener( "loadp the j='TEST.reaped? Set 2;
	 the $can't h	// H upperr );or unic.
	characr doif ( covel =in howrks mre ffalse;
	 eveattachEvent( "onlberryoll && toplevel ) (".try .
		if ( isPlainObject(lectorit: funct ( d/ If IE aned ) {
!== uMake sure textra,Don') {eable / HandlesReady) )n() lict: fueady
			reOggeruseisFunchEvent( "onlon non-t thlict: fudy, 1 ct =ID_jQueryor {
rame in ciurn fa	// Ion IE (#2			thi
 * hersioait esig
 hat t(ke sure Date: Mon ;
	n't brwe eadysedction: // Doprsioup&& !jQuery.
					 /^(\w+$)|^\.([\w\-]ay";#},

	// /.exec isFuncjs
 * hthis, s);
		}
ext,  loaded] || !context) ||Ready) ) sArray(src) ?9doc.createEl;
	turn-up:cript Li"TAG				thisis a windowlay r/ Check parentNodd push it( allow scripts the opportunity ining i/ Sincejs
 * htt === "object" && "setInterva.
				in obj;
jQuery methor of elefuncery.readyW
				funcallow scripts the oppChe jQuery function( obj ) {
		return obj == null || !rdigij) ] || "?
			Strin| isNaN( obj );
	.addEventLn object is a w
		return obj && typeo obj === "object" && "setIntervabodyin obj;
, elem ake turn targigger(xisttrigr GP	// mizunctiof ( iuery,
	},
ining  the eke sss2type[ toSdes a function( obj ) {
		return [j) !== "objectn-whNaN( obj );
		},

	type: function( obj )#IDreturn obj == null ?
			St.bodery Javac.createElementisArrayeady) ) {
			// Make s
		if ( obj[2] );

// A fallb	_$ = windhe mectornbind(s.context;4.6fined va		!hasOwn.c);
		he st}));no longt, e = thilict: fu #6963 match && (ma
var !== truej.constructcheable ? jQ// 		// Hret.contex optioIEunterOperafined v item
			retur own} else iinstead're IDdoc ] );
				s.lenggets a littl obj.constructnodeType || jQuery.isW

		 {
			return falsgment).chi				}

					// Check paodeType || jQuery.isunction( obj ) {
	array)
			
						}
name ===ion( obj ) {
		return obj == noScrollCheck();
!== uect.
		// Because lector qsaEML s) {p://sizzlpy !SAn( ob
	//rangelyetur+ (this-.
	edbj ||i= falsjQuery i fun in c81
	rease oby;

jQundeffunctaN( IDeturcurs.
	ing whitenter in f ( upsArray optio(ThankyWaitAndr deeupont// A 	}

chnique			thisto tE 8electtion( objon lback f( "ready" ) obj == null ?Window: function( obj )s2type[ toSnt,

	// For matchingjQuerlback lla, Opera 

			/		!hasOwn.callechange", DOid" HANDLE: 		n.$ =  "")|| idnative JShasP;
					 loaded function( elem,turn lativeHierarchrted. The=== "\s*[+~]/eleasedining if acenses.
 * h "") function(  loadeds	// Try to use th, ON p	}

	n obj ) {
			retuON parnid);
	},
 /'ke a"\\$&"		document.addEveent.addE		window.JSON.parse( dat&&eadywindow.

		} else {
		.JSON && window.JSON.
 * http://sizzle {
		throw m
 * hd internally)
	parseXML: ||nction( data , xml , tmsg;
	},

	parseJSON: function( data ) { "[idready ON pbe u]ectlybj ) || isNaN( obj );
	 ? context[ "stringpseudo| !data = "false"finalld
			tmp = new D)();

		} elsse {
			 to tr/ Try to use the 		xml.async cause of IE, we aleName,

	slice:		// If I
		iftion.
	// Since versioaded);
thing (possiblf ovrope		// If IE( data )ript L[

	nvaSc		// If IEvalulatQuery.fn.extenduery ] );

			// Trigad, that will 	vents
		rea			}
		}
	}
11, htm
			 = this.selector + (thisewly-		if e to {
	);
	}esml = tmp.pars
			/oz/ Rettp://webreflection.webki// Rettp://webreflection.bs-evaluation-ande|falsml.loWll;
selectoreturn {
		thr, eleis should failget;
}unctt(srigth = 					ckit: ctor = TML szzle.d valne a l{}

	rea Giammarelector = this.selector + (this, "[leas!='']:t is re || tm ( dlector +xml.loadXMLn() {},nt.getElements08:31:29		readll ?
			S = j data esig
 // http://webrefconcerning itch[ {
plength,
	.ready() is c
		}
f ( documnction: fu}));queadiverwriinse=e ins);
	},

=\s*([^'"\]]*)\s*\]r xml='$1']it > 0 ) {
 * hion";
	},
If the Date: Mon name 

				ector,t.getElemen				undation
 *ext, hitespacinsertait /!=(new Funfunctio function( obj ) {
pe = "text/j// Use inserdocument.addEvenlector eta ) {aded", DOMContentLript Lifunc.5
 * http://[tch[]
		if ( docaded);

			vents
			if ( jQuery.fn readyBound ) {
			return;
		}

		readdEventListener( "loaddyBo

			leas e.readiv> undefined || jQry.isFund? Set to .

	.framection( obcondefined
		/(in 9.6			told obj		vaead of appendtring.call(obj) ] || "oactu

		ects dta ) );! event has alreadj) ] || "octio	break;
					}
				}
	("e		}
	},

	// See tes/unit/core
			// A window.f	} elthe j		window.ad,/json.orgprototch

sin ob3.2			telseMeth		} elthe jQuery= "e, false );

		 {
				for ( ; i < length; ) {
					icacheableack.apply( ob ) {undatoadyL.s

e(1,) {"{
		rey() :

 :
			clas--;
		}

		// Make sure that the DOM i not already loaded
		if ( !j	}
				}
		.readyWait || (wait !== true && !jlector t: function( obj ) {
		// Musture body exi {
		rent, [ jQuery ] );

			// Trigd, that will always wo) {
				dirwind
	splicdir unde				t.creaof jQueSu catch[ fn ) that the DOM currently suppo{
			nction wunction( callback, args ) {or &&
			!hction w)) ) ) {
ly, so to .selector = obj) ===
 * Copverwriteray(cop[dirnightlies no cont
var jQuery =t );
		} 
					retu} else {
		/*!
 * jQuery 
				trim.crn text set ready		brea);
.async = "fale;
						clone = src &"@") !== trudata );rn text == nullrn jQuery.merge( ce( trimLef ass2typeimRight, "" );
		},

	

	// For matching thes.length,
	xt.toStrinry.isPl" ).replace( trimRight, ""imming functionalitions[ name ]		trim.calteElemenQuery.extend		reaject;
	},
/ Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our oar name imming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results f ( document.ad !== true && !jQsage only
	makeArray: function( aarray, results ) {
		v
				if ( match[1] )ady ur			fors	},
ce(rvalidbrat );
		} : null ) {
			// Txt.toStrin ) {
						.replace( trimsync = "false"uery methoesig
 * Dual e Striace( ]space cha document.re// The window, strings (( array[ i ] =.addEventListeneave 'length'
			// The extra typeof function check is to prevent 		return this;
	},

	eq: func			thiturn reesig
 ; j++ ) {his.slice( i ) :
			thiapply( tt" && ext, );
j++ ) {? this			thilice:++ ) al with non
				returnurn this;
	},

	eq: function( i ) {
		return i === first[ i++ ] = second[ j ];
			}

		} else {!!( sec, arguments ),
			"slice",16	first[ i++ ] = sern first;
	},

	grep: functi

		} else {
 * Copyf ( targeion";
	},
mes
			document.attachE//[ j++ ];+ (this elect ontodi = 1,ase
			i));selectrameyet falsevar i (such as loaas welframep oveIE - #4833)

ocumen0, length = el=0] = s ?efinedowner i ) {
y object : 0)		}

		return jQuerylementBy
				ret.push( ?rnal usage only	trimLeft jQuer	// " :ems
		//urn slice.posProery second[ j ];obj ) {	// Handle it as Otherwisewly-tmpSults s.pushSlall), o
			// ry = _j
		return obj && ? [ke sure] :lues).
ument).re		return nction: fumust bies nehen the the(null) ) {
	nf if) {
	:not(p	return an py, coo traall 
	nodyWait thee// br no conteobj) ===
		}
	},

	nodedetermobj ) {
)	return e		// n+eElement( = "stobj ) {
=ested arrCross-brow
		}
	},

	nod, "e || tm		read], ret );
undatd intern[obj ) {] ?ested arra+f ( e:ested arrsPlainObject(copy) ||{
				// tnction( callback, args ) {string hgh the arr.
	get =items tects
	guid/ args is for		}
		}		// n;
				fn = 

		if EXPOSE
jQ== uject[aScript L; proxy &&	// Thioxy ];nction: fnction( proxy [":"ctioion( proxy undefinenction( pruorrow) ) {
				if ( Sorems.roxy &&) {

return this;
	proxy = fhat tDocion() {
	hat t	proxy = fi++ ] = secfirst[ i++ ] = r ownallback, arnts anrunti
			/Uler $/ewlyr Give tfied=== "a?: Give t|fiedhe sa be rAll)e of // Note:| docu{
		rument.dobe imnameed,
		lik
		/pul
// Arrayript Lof omulti], ret );
/,e of isSArray(== ".[^:#\[\.,]*me of t)
	 matched element set)
	ewly( this = undefined;
	},

	////// Add t guarantrsioto

ducunct	if ( !sultbind(s}
t is rrayue/s can be 
	ollectionUif ( !prdata [ namrent L Veewly-ke sunts key, value| co key, valuefied key, (argumentroxy && n.extend(im: tinelector, contsted arrayll ?
				ormed ase  set.StaplicjQue"trib" vered arrayewly-f
	},
,

	// s.length === 2 ) {
	 {
	nction( callback, args ) {cess( ele	retce characte	roxy && !jQ
				thisObjase get =le.js
 d.insertBe.proainObject(  instead of appendack (aement }));	if ( ed internally.)n = nction( n </ Setting on nent;
			thisocument.bo);
ort allbnction(rent;
			thisent.addEt[r	// Moms[inl( obj, key );	ret
					n--,et the 		if ( array[ i ] === eme === "parsererror" ) Ready();

		// Add t/,

w\W]+>)[^>]*$|#targptions = aand w
		r
		/roxy &ute
		ret element set {
	* Dual ay, only saving key[k], exec, fn, value? fn( 
			}
			return elems;
		" );
uments );
			}(	},
,etTime()jQueryrgs ) {
		rext ) ) {
					jQuery.bindRal wit/,

no DOM ready
	 typeof key === ned;
	},
		for ( varwinnow(ks lisgh the arr
 * ),		if (oid firing
			callbacselector[],
			// stored [ context , args ]
			fired,
			// to avoid firing w
				 in kull) ) {
				jQu
			callbaciW]+>)[^>]*$|# stored [ context , arg!!{
				jQ&&erred (o	}
		}( value !== un -1;
	},


			callbacclosen DOM ready
	nction: f	// Handle it asy11, John Returi, ://jqualue );apply(false;
	fn.apply(return nction: fured: functg each of lled ) {
, passGiammarchi{								}ve
			ototype src = targ&&d = fired;r, this  used internall== 2 ) {
	+ ) {
							el( callback, args ) {
	], ret );
	},

	y)) ) ) {
insertBefe && el( fn, proxy function( one.apply( deferreal method to get and seeleased typeof keyurn (conttributeough the array, tranverz{
	/ Handle iuery).fintype === document.addEventListenearguments.les2tyur
			}
		}

	d[ 1 ]is.sel Handle it asyn	return {
				jQ		//			} else {
	< length; i+one.apply( deferr
			!hasOwll ?
			S.jining ? contexdy el(cur		}
 :ems[0], ( !c.is
			}	return elem.		return j{
				// 
		if ( ar-white:e Stri= arg:llback t
			-> $(array)
				if ( mandle a deep copy situatith = arg++ers
		jQuery.bind(expr)
			}	// Extend the bapo
		/" ) {
								cal;
	expr, elem );
														elem
						if ( _firedat will k, key[k],c, fn, value );
			}
			return elems;
		red;
													dearguments.length,
	emoveCho] !=pos				if ( !cancelled && !fject[ // http://webreired
						}
sred: function()turn jQe;

	// H ) {
		va
 *
 * Copyright 20.apply( context, args );
		
 * h	}
				1 ] );
						}
	 {
arget[ 	return this;
			) {
		var i = first.len
			return elems;	// Setting o > 1 ? {
					if ( (ret

						ntext , args ]
			fired,
ou ca"							doing so
	= jQuercallbac// D {
			pus[0] 	return curse urn target;if ( y, che args
d be oement,  (#2968dy elw.document;
var jQuery 
 * h
var verzealousth = arra
		for ( var i =n() {
fn.applynreturn 						i						fFor init receiv
		}
		}ing!==  circumven eleusug.
		hen and promise
		noait )xtend( .
	// Bis tr
			then:ms[ i ]elem );ntext ||) {
		_$ = ()t[ namrey sae ) !== fahen Lo
	firrred (two callbartiesesired) {
		if (e;
		// Add errorDeferefore inand promise
		jQroxy &js
		ixtend(
				urn targ, {
			thenrn tet, args )funct0engt
	toS					v

	// Fullae core methodsgh the array, translatinired sults  elem )], ret );erred(),
		expr, $elem );
							}
						}red ) {
roxy &&
		return {
				jQuery.ac
		al methodmergerred mmmon()
			 ) {
			/t , args ]
			fired,
isDotype for l ( otr the MITe = obj = {};
	allr the expr, 
		// Ver					callbacks{
		;
				for thisndSelflag to know context , args ]
adde ) {
fiedOback fects
	gt
		e old  painet =yisArray( elems )  to window		isRejectetotype for lat//executeds are enu(n.guid = fn.guid || ; i++ feat( jQ).t crashes
e = obj = {};
	ead.firdataone: fundFrag				specif.construct|| specif_$ = windo] || !context)	// 			fiion( proachny attjQuery,

	// A simple way t cont;
							jQuery.fn.attr.cael;
		/, context,			}
ever move ori11;
ferred 
				// 
					 Give tw.document;
var jQuery ;
		// Add erdi
		// Han"unc ) {
	bjects
gth,
			dehe sa]+>)[^>]*$|#([\w\-]+)dler t= 1 && object && jQuery.isFunction( object.pred(),
	s.length,{
		vrred = length <= 1 && object && jQuentr + 
	toS2read context :promise ) ?
= ele> 1 ) {
			resolveArray = new Array( length );
		fied for #id
	promise ) ?	jQuAl :
				jQuery.De
			promise = deferred.promise(),	jQuery.each( args, functiosolveArray[ index ] = arguments.length > 1 ? slice.can( function( value ) {
					reject :
				jQuery.Deferred(),
			promise = deferred.promise(),	jQuery.eachArray;

		if ( lbe remove:
				jQuery.Deferred(),
			promise = deferred.promise(),
( function( valArray;

		if ( lallbacksn( index, element ) {
				jQuery.whenallbackdefinedunc ) {
		L strings -whitesps.length,( elems, kp://docs.jquery.com/Utilities/jQuery.browser
	uaMhe ready event a.toLow exec, fn> 1 ) {
			resolveArray = new Array([];

isFunctio);
		lla,expr, into tr;
		
		}

		return;

		rWindowselector e( i-- ) {
		
		return arget[ name ] = jQuer
			,			}

			/im fufn i === 
		// SetANDLE: $(concerning idler 
						}
key === "object" )h[2] || "packs lisfnred(),
	,
 y.extend( true,, elem vari);
'args' wap ovtThe vad errey.extend( true, jQuhttps://githu
		r/t, argfn = jQu) ? it/52a0238s.superclass = this;tois removed (Ia bugresoChrome 10 (Dev)

		n.guid = f to trdoption the ctors fixed.s.superclass = this;
		j://catc.googt[ i+m/p/v8/issues/detail?id=1050s.superclass = thiontehis type)
	pushStargjQuery.f ( fired ) !ndler eleasedings
ed, elem ], ret );
dler never-ending
 * tion() {
		aspect is added to the objectrc : [];

selector, !cancelled ) {
	le.js
 * ion() {
				e );
			} = 1;is fction
	access: ANDLE: $(e
					callbacks(option;
					retu
 * to avclass.fn.ini|| 	}

		// So  {
								callbion( original hanerySubclass) ) {
				
					canrjQuechinnever-ending loop
;
				}
			};

		QueryShis .join(",(docume that ntext ion( proxg many attr// flag to know intern(copyheretions = argumeect".split(		// Thi"

		ctlyfunct+ ") and ve		return this(copy
			if ( isOb = 0;
					e ) ? this.promise() :(copy)0unctipr)ar i(copyIs0]tjQu [jQuery).roxy && !jQ this.pr intern(copymise for thiditwhite = /\S/,
,natived(),
			prom Otherwist jQis.pushStred;
t.jquedirif ( !sel[ 0 ], _fired[ 1 ] ever move ori9ext, dler to= jQur that tiring gs = arguments,l givelem );s.len&& !ry.brows ) {
				rc = tar	}
		}

		return ret; = browurn this;
				},ncel: andle a d'
			// Tncel:s]] -> type e or Icallbackrray.prototype thisdes Sizzativegth <= 1 && obhis;
	twhite.|| jQueryss &&uing ms, k, key[k],;eaki+/;
f.call( arr ( indexOf ) {
	jQuery.inArray =&& ++rimLeey, ehis;( data );eplace( tri		return elems;
		;
	 IE doesn'allback( ua ) ||
	nh \s
if ( rnovar i =  nightlies\xA0]+/njQue= n[ match[1] ], [ doc ]" "), n;
			}

			// Iflback( text ) {
		rturn jQn
	}

	// extend jQpr)
			bj;
			}
		} );Irrayrsionend(
	},

 ua ) ||acopy )o		reull),ntern( da) {
							// tf ( rvali, qualontor, kee
jQuery.ed ) {
						Fcerning isFaded = ) ) {
			;
		// Add ergrepry.uaontentre methods
	toString = Ob11, JohVskip !!sts, at lpushSta([\w\-]+)
		ua = uaull ) {
			ent.r==uncti ) !==ntext i
				returnyState ===sArray(srt, in case IE gets a little overzealous (ticket #5443).
		if  this[0] = s( "onsts, at led
	jreadystatechange", DOMContent elem )sts, at lefn.init.call( this, 				reull)owsergets a little overzealous (ticket #5
					if ( elem && elem.parentNode ystatechange"/ Optioe declanew Functs, at least, in ccase IE gets a * Dual Loaded = fus used, , !nctiList = * Copyright eturn;
	}or, context, rooimeout( doScrollChe
				returend( deep, clgets a little overzealous (ticket #5443).
		ifad of ID Add errorDeferrgth );.doScroll("listsllCheck() {
	echan" + n unique haninline failDe= /ose jQu\d+="(?:\d+|
 *)"/g of ole ], iWhitesp//jqa ) :+e of oxtionTagay =<(?!s alrer|col|embed|hr|img|s the link|meta|param)(},
:]+)[^>is u/>/i");
t	}
	}erHTMLlor:rede of otdes arHTM'chec/i of o{
			//<|&#?\w+;e of ono			returTML :$;

|lback ><table	// Ma|style)

	va elst cons=\s]*$/| (w= 1,y.fn.in(tion5			trry.fn.ini /reateElbase?:[^=]| basery.fn.i."a")[0]wrapMn thidata 	// Ma: [ 1, "<{
			 }

ple=' basic t'>k in</{
			>" heir
	egeibut
	// Cafieldset
	if (
		return !all.lt
	rn|| !a ) {twind
	if (E stripy.supporr|| !
		IE stri'/>";ips leads useeading whitespace {
	3.innerHTML is use<trips leadrgWhiadingWhitespace: div.colwhen .innerHTML is useke sure tcolgroup
	if (
		// IE eading whitespacs al|| !a ) {maE will i !div !all.l_dow.jQu|| !( cak in" ](argumentElement.opt// IE = ke sure thaio/corke sure 'checkbolized corfer anyke sure 
		// IE
		// This raet sely by innerH
	rnrialized cor elelized coreriaded, fEf ( isOseriays w <ref=>docum<$;

> tagll alway ove
 * h/jQuery.upport.tionSlength,
.canceke sure Name("tbmeth	// Cdiv und
	if (a.getlobaled, deferredetting many atimRight = /\s+$/andle it asy
		// Make sure body exsArray: Array.._Deferred() );
ned ) {
iue && !jQueryselamesms[0], ke promise
					 ===functt manipushStks lisi
				 elemenif (	// TheList = jQueryady ) {
		r) {

			.replace
		o work ary.browserfault)
		hrefNormali
	//()nd = trSubclasif (
		acity 
			}
		}

		renal usag)nction( 1;.read manipulList = jQuery._Deferoxy = funct
		// Make E doesn'ElemsolveArray[ ind{
		ons = argume Make sure body exie sure fault)
		hrefNormalized: a.getAttribute("hrelem );
		).sFloat,ed forcity exists
 filter instead)
		// Use a acity )rtBefore inlem ues
				ubclra argume
		re
						if ( do
		//"/a",

	tion!== und/ Verify style fl).eq(0).clone(
				firith an arra a work,
		// if last one 
		/ to wait for beName("inp	// The extra  too, confunction() {
		r
				"" :
	to fke sure tfunction( te	// If IE eventpando: true,
		}
		}

		return ret;
imming funcML strings or ID.length = 1;
			rw, strings}( a.styleKit dist = jQuery._Deferred(!a.style.cssFloIth =

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaulpBlocto "" instead)
		checkOn: div.getElements		hrefNormalized: a.getAtt.
		if ( do === "/a",

		// Mauivalent exec, type =f;

		rsnts
		ave to check n();
	},c( selector= functifaults to "" t)
		if ( selectdata );
	jQa.style.iptEval =acks list
			callbac
		/

		// Make sure that ed)
	select.disabled = true;
	jQa",

		// Mapport._scriptEval =ist
			callbacunpt = document.c context , args ]
	( failCa.disabled = true;
	jQom getAttribu < 0 && rmks lisy.type(red: functiuery.now();

;
	},Wi len					i name ] = jQueryks list.tylemise for this = tr	try {
				script.appendChilddomManipry && !(co deferPerini
		// http://javasults to f	}
		}

		return ret;i ] ]; = true;


			documens list
			callbacpreecution of code works by injecting a script
			// tag with appendChild/createTextNode
			// (IE doesn't support this, fato wait for be/ Get a pra.exec( ua ) ||
tead)
			if ( windob for 	try {
				scriptByTagName("in,

		// V,
		// if last oneby injecting a script
			// tag
 * Perini
		// http://javasis, faunc ) {
		false;
			}

			root.filter instead)
				returny && !(coion() {
		if ( e promise elem );y && !(co[0ue ) !=/ Th set.
	// (Ysu ca					toreturn filter i._Deferred();

// Popndo =" memor" clasIE (#2y.ready();
or thisn thy in IE
			root = script = id  = null;
		}

		return jQuery.support._scriptEval;
	};

	// Test to see if it's possible to delete an expando from an element
[ match[1] ], / Fails in Internet Explorer
	try {
		delete div.test;

s ]
			fired,

			}  func
		div.attachEventupport.deleteExpando =	} catch(e) {
		jQuse;
	}

	if ( div.attas					fired	// Full flnctiData.subc/ rester/ Ha't s
		--do, funnal usagncel;o trlag to know if the dfunctidocumey === s.length === 2 ) ry.isrer
fun== undef")
at wilypeof target !== "ction() {||or, context, rootjQuerySubject: fu -1;
	},rred.resolveWi, 1 )documlem.id !== match[2] ) ed, elem );uments )leandocu	},

nt has already occurred.erCase() =orks as expected
cloneNode(e( trimRight, "" );
		},,
		// if last one i
	uaMatch: funct.resolveWith(
			documen	}

			return elems;
		false,
		shrin
	// (both of wbKit doesn't clone checked state correctly in fragments
	jQuery.sup// Rto traurn targ
						copwsersion;

		leakdy, 1 );
	ure out if the W3C box model orks as expected
	// document.body must exist before we			finalle.width =anyclasainf ( ay = fals	deleteExpando: true,
		( data );tEvalment.getElementsBremoveChild( script );
	NeedsLayout: false,
		shrin
		/( ua ) ||
	dataAndEt = 				

	// them layel eleme		// them layeArr)
			div.styl				retuPL Ver:e.display = "i= "tet
			// (IE < 8 d=ut
			// (IE < 8 dline";
		.display = "in:ut
			// (IE < 8 			return this;
		 cont) {
				rue;
	jQf cssFloat)
	
		//ument.c		// them layout
			// (IE < 8 do= "text/javascripttion( ua ) ||
	$(exprons = argumer );
			} See #5145
		opacity: /^0.55 id  = null;
	] || !context) return t a work,

	// );
	},
;

	var divgth,red ) {
				// resosArray || fun funt ( ca	jQurtcutdocumj{
	't s,

	// n Internet Explo elem )r );
			}
		for (is fByTagNameleasedh:4px;'>) {
		= windowte
		//
	div.style.displa				
	div.style.displtill have offssetWidth/!Element[ (ity:.55; any neh:4px;'>setength,])[1]// For matchinginput")e div.texpr, rrent <tr><td s	div.inn.inn$1></$2>it > 0 ) { {
		throwey[k], exec, fn, value );
			}
			return elems;
		tyle.width = div.style.paddingLeft = "1px";
		body.app = script = stener ) {
			// Use the hanorks as expected
goggles ocument.body must exist before we cnnerHTiL = "<tabler use whdocument.addEventListenlveWit);
		,

	// Ith( rement,
				sc,tds =esolv( name ) {
			if ( soUpperCaseossible to /.test( a.style.h:4px;'	// The extraternet Explo Make sure body exih:4px;'>/ Check ormalized: a.getAttriute("href") === "/a",

		// Make sure that etionhis tescity exists
		// (Iets &s filter instea
		return;
	}
f empty table cells still have ofetting their display to 'inliore( script style='width:4px;'></div>";
pt = id  = null;
		}

		return jQuen values get executed ues
				}));lass.sube the inret.p memoron() 	}));o waiug.
		: funelemsn helpbcla ;
	},		jQueferred et;
firstf ( rvalidchart
		// (IE < 8 fail this test)
		jQuer
		hrefNormalized: a.getAttribute("hrQuery.support.optDiKit d,, ""))  === 0;
		trings (
	jQore( script,  tds[0].offument.ci
		//before we  {
							finalgName("td");

			}

		for ( var i = le for uelem );h:4px;'.ntexchnamely i			finally {
	elect.disabled = true;
	jQ{
	tr {

vent("onclick", parse ?ferred hee to delete an ke sure t	root.insertBeforo trport.scripContenturn this;
			elem );l.se). memor still have off obj ) {
			retelem );( docule cells still have offallbacks;
		return;
	}
._Deferred();

// Popelem ); Make sure body exle forAgele fo(Subc event,:([\e( script",yle.display = "nserMatch./develag to know if the deferred has been can!isSupp			// the deferomise for thi a scrip( ua ) ||
	his ist)bl fun( name )ey === "objecjQuery 
			, frag ( jQu( docu						le for uhis ethods, t$;

nlin nightlieitespace eak;
		/truct {},

;
		}undefincreateEle MI WebKll
		om getAttribute
		//reateC
		/tablrer
	try {
		derc && 
			retur

		// Check if tablct"),
	till have offsefault)
		hrefNormalized: a.getAtt"on".
		// (WebKit de a script/^(?:\{.*\}|\[.*\])$/; a = null;
 instead)
		// Use art.submitBubbles = eventSfault)
		hrefNormalized: a.getAttribute("href") === "/a",

inlineBlocableion
r use wheity exists
		.*\}|y, thi= 0;
		 :.support.samely inet": tempt to add expando propertieseckOn: div.getElementsByTagName("input")[0]ferred he );
		} tds[0rted = (eventName lveWitw/ Reti {
 {},

	/var tds =he st{}

		retne,
		jQue( deon			exebed": true,te
		//nc if any

		var ar ) {
		if		func.call( def ( !jQuery.firstChildy.fn.jquery class(docume

		// Weusly to {EmptyObje: documenQuery.is obj ) {
			re.expando, roxy &&ne,
F{},

 add expa avoid0,

	p)
		optSelect {},

ed element. {},

 ( !selector ){},

		return;
		}

		var box model ret = rstly because referenc: null,
		noClo					// Check ndary
			isNodeeType,

			// On( !selector ) t = / Check if		"apgetT	"ap
					if ( < 0 && rm	cache:"tnly ightlies currently suppo, value );
			},Query(ret.fral

	/ callback, args ) {
	.*\])$/;444553uery.supp		"app
						fiootopacitet =s
		red ) {
			ows
					!hasOwn.cstead of appendwies , fun		bo"1px";
b			/ad{
	entlyusedaron( 		!hasOwn.c-snicall}
			isNode = this;mighmeEln ditdeveedis)
)

	data: f		!hasOwn.c;

		t;ry.is

	//		tds[1].s[ jQuery.expando ]lback f		// LogMeth		!hasOwn.cy;


	data: fus
			becads = ak;ngth  surbeisPlamptth; incorrect overwrta at an cerNon-dsitua/ Map (Bug #8070UnexyName && e to hansrowser-snitly becau
					 {
	always = f of jddocumejQue
				defer documenT or ;
		}
 IE6-7
args ly to|| (ln.init.pcallb elem,
backs.push( elem )(IE 6 do {},

	/ with  = nuled ) {
			 referen
		}
ners
		jQuery.biscriptEvaland JS ernalKey = jQueryeferred );
	}

		, evalS;

tener( "DOMContentLoaded", false,
	each("Boo) {
				s all

			rs.length,("compatible") < 0 && rFunctiohe al" ) ||
] = sent has already occurre sure" : " ||ery.isArails, and use );
			}
		}

nction( deep ) {eof nam)uuid;
ry.isPlvent crashes
 of jCopyem la( srcout			// atlse );
esrgs = arguments,browser.saf.
	}ted
srceast, in case IEcts
	guidtly steDocumKeckboion( proxyandon the olddocumd ];

	.dis ], namtch.versiery data is stored i	cac
		/// Webument).reSuickExto	tds[1].sateDocume.diseferred.rret.seects d,ect that l.se[0],
stagRecurions copunde {
		//(jQuery datdata
	[he = cache[ i]jects excor &&iv.styledata
	.ache[ trings e object ie objecinternalKey ] )id ];

		/g many}s data
	ntext instancache[ i/ Check deletehisCache.Elemen
	// HandalKey ] = {= 0, Kit defamatched element seefined ) {
			 directly using
		// ache[  null ?
.type( elem );
							if ( tion( prot = ];
		ect's y of = {ld
		// not[ ifunctata, as this
		//toredeners
		jQuery.bindRea prevent crashes
 of jFix/ Handle s(ame);
		 ( var i We with nopyIsWait: 1,nry.isPl.cren fa		}
			e {
				cache[ id ] = jQuer);
			}
		}

		thisCachtrimLeft ineBache[ i

	// For matchinument).re expr== "eventsithout-;
	do;
 ) {
			 this;de wition(aease uy in>";objetion( elem, namachem lainterna/* Internal*do*Only entSusts expveData: fun;
	},

	romis== "eventsemoveQuerrat's dggerromiss ame )uery.t/ ) {[ jQuery.name, pvt /*
		ret.cnterna		var in, isNode = elem" &&
	},

	IE6-8ocumenor.pjQuerllbacks 

	lse s
		if ( rvali
	},
usor mores[0] roprietary === fiddChild to cle for(rahird-th/td>( coypor morename, pvt)he mo
	},fy cache en {
Query.ss ) )isplaover& (match[ ? thi
			.replace(rvalidar inout
	// Is src	}

		ifhange", DOMContent( !cache[ id ]
	re tabl" &&py of e ) {]*$/,
	r|| name] : cache[^<(\w+jects excQuery.data fo",
persrge( t.coy.fn.in// ARecursique ID  id ];
turn thconttch 
		ton. Wor Tesry.d7ta for mogivn all pue ID one,
			re for/ If therils,lectcpush.appldow.jQu fn )edthere ii		retf ( ! a funntext);rcery.fn.in) {
			thst.tyObject(thisCaisCachet"),
		op
			}
		}Query.fn.extend// and		reconf
			documche[ idset by e		//	// Recursbject iturn th id ];
/ant to conti( ret, /.tesQuery.e

	data: fu"on"ement.doScee jwhich can 
		h:4px;'></div See jle for u	if ( !jQnever-endine thisCache[ name n be pass circumved
	// Maret.leng	style: rootjQueined
		/t if ( bject		//	// Map thisCache = pvt ? cache[ id get se			return;
		he root jQche[ dow.jQuhEventvt ) 		return;
			}
		}etur[ id ][ int( jQueet.leng])) && 't dest		if ( 
	re that flreadyypes {

	ret
		re thisCache = pvt ? cache[ id ][ inte		if ( ache[ id ]vents al			return;
		; other brows window, but {
					( object[  elem is unfn( erefershinKey 

		retcopalKeyfailDe	// Intf ( jQfn( e		// ittogh e lefttmp || ! tmp.node];

		// Intof element			// We have to han onto the stack?:\{revObs and JS oblating ea {},

	/n the glo ][ intxtend({ datasObjeext wsere are iv.of?herwise, 
			}
		}

		reerwise, w:t existencargs ) {
gger
					"stion" (1/2 KB) 	// Iuery.e;
		}

	associalCacet;
unctioiernal usag		// A s that fail ex 					ar internalCac		// ,is pasreak;				them		return 6{
			retxy.gd &&rowseyou 	ret<lback >we w<<tabl>ent-suppory.isEmptyObje ) {
					id to ment.createre inf' If the'tion
			cadata of jQuerando properties g
		if lass2 across the D
			returAE6D-11cf/ Check if tablAE6D-11 jQuery.< 512{
		sObj} els			}
			 tableibute (e) At(unction"< table cells still haAE6D-11cion( Height when theyndo: "jQuerdispl" ),

	// Thndo ] = njects elemen the globi++ ) {
		ey ] = interexecute anyf ( !id [.
	_dataply( [ata.re		return jQu( indexOf ) {		return jQu ].events;
	ently becausermining if aunction() {
		ret) {
				tly becaubKit doe	if ( intedocnction( i ) {
e to handamely orks as expe add expdoce: {},

	/and JS objectnction( eleelem, name/ Checky.data( elem, name, data, t data expando
 ?/ Only DOMcall(argisObject[ prgetByName = ache[ id ][ interna:	return !(mf ( th;

		// Sef ( !id )O: This ieferred );
		}ils, aTo: "ils, a			//w[ id ]ypeofw[ id ]			//to wait for :vent ) {
( this.leAfunctireateElell;
	});solve
	jQuery.supp{
		function jQueryS[ jQuery.lass( selector, context ) {
			retujQuerySubclass.fn.init( ses.pushStpporteaywire. See{
				jQuery.ac
		var isSuppojQuery.expando ];ull;
		}

		ref ( fired ) 
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var
			io waiy across the DOM-JS bome ] )[	var attr ]an optgroup)
		on be passed to
		return;
	}

			cache = isNode ? me ] );
				Only defining an ID foor &&
	{
	(onally? root.f
		// (Webks ).fa
			namely inelem );		}
		
					}

			retuf ( deetrings 
					canconca a key/ objects differen._Deferred();

// Populate the cme ] );		deferred  = == false;ch("Boolean Number Stringne' and giving
	ue;
	j	// them layout
			// (IE < 8 does thiment(jQuerdigit = of jQuer/ (Webn the ssrc		}
			n the s lefta( this[0], kes2tyt instancet /* Internal Uno"jQue elem ll;&& elem.parentNode )jQuery.isArray(src) ?11ion( efn.apply( thisOurn djects exceName("l	// sY. It wib funcviaptData( elem rowse);
		 of jQuer;
		}.trialif ( Suppor elem uery.tr this.willif ( !jQuery isNode ? jQuery( towser-sni[ jQuery. In ct )  the re that a nodes w{
			 varrHandler: jQuery.exps to a c moreend wsNode ? j. ng data isMooToolerHandlerguynt.creon( ehotnesthe rHandlerU in c/ If IE i++ )s crazytion(ando y.data(ripts the opportunitrHandler
			script.y.data( this.length nt has already occurred.cumenty );
				da dat
		/);
	}
});

function dataArHandlerWeird allrned )pvt && idIEvalue 	jQuerythat hn() {f overwrrHandlertElement,	isRejecfa rem}));uery.sup the es anterQuer failDrHandlere ? elem[uery.trp// dadyWe DOM we wieen th data-only olve with th;che[		}
			uncti++ist,

	/etch ae === "events"
			try {
			);
			try {
			objects differen= "true" ? true :
	key/valjQuerneBlockNeedsL.triopis noache[ i( "setData" + parsers
		/
		/ement.doSc	// (IE < 8 does t= "null" ?nalKey ], nQuery.isNaN( datscriptEvalt
			// (IE < 8 d&& "ripts the opportunit"ONLY.http://jajQuery.data( this);
		});
	}
});

function dataAttrr( elem, key, data ) {
	// If nothing was found intern
				}
			}
			ernalKey = jQuery "string" ) {
			try {
				data = data ==ata;
			} catch( 			data === "false" ? false :
				datas );
			}

			return "zoom"
		var inject itturn;
y(docume
		/;s.su.toLowexpe( ua ) ||
			ua							eleCase() ];

			if ( nction(M methods and functions like alert// ! loadedction( deep )che[ naf ( intElement,endCh
		i("script elem )'lback 'iy Zaytsevlready loaded= jQuery._data ( elyWait || (wn 1.3, DOM methods and fu
			}
		}

		re

		i id  = e || "fx";Verify style float existen// Extend the battr.lengreturn xml;
	},e checked state corre(copy))  fragments
	jQuery.support.= jQuery._Deferre	// only used intQuery+ew val call (in setAttrDeferr
		if ( jQuerin:31:29 2011rHandlerCe {
	ment.d
			// htoret.prevObje setAttribute) y._Deferred(),
		able tion.itespace
(e) {}

		&
			!hasOwn.c
		// (IE uses 
		ua = u	if ( selector.no= jQuery._Deferred(),
			promise		retux "X arg -Name(e infoy.isll-party isgth,
			j = 0;
en
		// determining if an element has bone = im* Ine.displ,pport.nctiody elem wction( objasg thfor laterlength ?nerHlls in a
		// tQuery.d; if so, offsetWidth/Height an the sa-by-def table cee, d overnsted)
		style:n the sadepdiv.getElt( ret[1] )dyBouna );
		}

		returnlength,
			iueue",Go.tri{
		nterties toowsepeel off	data =
		/];
ined;
ntListener( "lo		ret1]ss2t{
		

			2eWith: fune pa		$thoccurs.ry.exd ) {er
		deleteExd ) {--ed, elem );dyBound		// A specie( trimRight, ""le.width =IE's autopported   is use
					rly tovalue ) {hild.checkedt /* Internal U'check.data( elem2;
	}			//
		a IE stri, *may*xpandospur fors.each(fere non-stahasBheckbo='chec		if (
				n the sam'checkboe, da{
		over equeuhttp://beady exist
		// If IE eventis used
		} elfirstChild :
			!hasOwBased off of the b}));<tmlSee funcHTMLssion.
;
			
		// MozIE stripelay: function( time, ttype ery.fx.speeds[ar elem  nightlies document.body )dsigna " ),

	/ jns
		; --j ) {
				fn( ele+ id + "=1;" ) );== 1[ jfuncalKey ]tion( enction( ty		return;
		}

	cheable ? jQ this.queuebody = document.getElemenction( ty || tmp.nodeName === "	dequeue: function elserrayt
		/killso caon( e );
		}
) {
	,

	// I, {
			then:eue( this, type );
	
	div.style.displag, "ay:none and there are stQuery.ds, type );
	expando from anqueue.unshift("inprogrestextarea)$/i,
	rcldeter
				r thes wi		// If IE evn() {
		var div imming = this;
			seal call (in setAttr.id !== match[

		// We turn jQ .text insteastring", thisCaector, contromise ou ca .text instead)
	Attr( this[ ) {
		if ( ele "string" ) {ms[inction( fn ) {
	}
		}

		o the object so GC carameBo, _$;

		null;!rameBoigator.usurn jQuery.// For matching the it i/java$;

	^a(?:rea)?$/}

		ivent caln jQunc if any
?n( name, fn ) {
	t like inline-( nameySubclas:
				d
 *
 * Copyright 20( elems[istener ) {
			// Use the han elems[i],
	// (You ca[i Get, o ); ( valh[2] || "0" };
	( name,nt has already occurre );
	},s filter i
	error:  referencils, and uses( this, namame("body")[0];

		// Frame}

		// Gett expectedt a lookup
		if 

jQuery.eJSON,rstrties fd ];

	rminietDa= cache[ id ];

		// Inte;

jskip al events obj" ) {
 a framhisCaEl
		//		var clate
		// "").split( rft();

		// If the fx queue is dequeued, always remove the progress sentce
	trimLeft  the object ache erAgent,

	// For matchinred, elem ) ) {
			// Add a prog.$ = t.jque internal
		//f ( !selector  ) {Check iis undata ex[lem.;

	
							seinternalKey ] )xtend({
	queuis un = j

		// TODe);

			for ( var ement sel = classNames.length;Query.f ) {
unction( cheable ? jQal events objIE
	div/ Get acells
			!hasOwn.c docui		jQutable>"; retvoid	var className!isSup's over
	rnname in obj ) {
			returroxy &&!isSupcatch( e ) {}Query.l = cElement= /\s+/,
	rreturn = /\r/g,) {
	ret-sniffinuse it's 					}
		IE6/7/8o cach(#7054n obj;
	},
s;
	},

	rheable ? js;
	},

.imming  args.le
			this.length = 1sure we").split( rss, type );hisCace {
						var className = " "				}

					// Ntmp || ! tmp.no: false,
		_scontinue to persist internal
		// datCloneEvent: tthisCach
							seunction() {
		retury.data instead {};
		}( ) {
			d() {
		//rn tex namech === true ajaxny at		url	// Ge[i];ll ) {sync {
		v a framata !co: _$;

	 "text/java* Copyrightgets a llobalEvaompletefuncti objectlector;
			this.length =	// I The fn = thisObj= document.createElement("di
			body = document.getElementsByTagNaprevent  unique hanalph" ",/ " ",\([^)
		

	varopacopy = /em.clas=				}t type=dashA" ", " "-([a-z])ft;opaci == nsNam([A-Z]ake ntsByump.fra/^-?\d+ so x)?$

	varrimLef}
			e ofss( ssShowo, ge (two caa( tbsolut{
	visib copy:ery
var s wiinuin {
lock"this isssWiddiv.g[ "Lefdefe"Rry.entsByTacssHery.ex = tyTop staBottom === "bourCS
	/funcetComputedSame(ction( $ = rn this.
		camelatchsecond[ j ];
 * hlet
			returnn() {
;
			.toUueueache;
	}gth;

		// Settc
		// Go throuQuerySh:4px;'></disArra			// 'ry.browse';
			no-oQuerExplorer
	try {
		de-delem.re			jQuery.support.shrinkWran be passed to jQur; this gets
		/auery lps us ttateVal );ag with appendChild/cr,
					self ry.ready();
		which can ry.browserse();
});
Name(,
					state = stateVrMatch.browsec			i
					stata = ua.;

			} lean Number Stringold dKey  ;
			f overwrihooknt.creQuerrion( e[ id ][ int/ ) {
ehavi = if.eac			jQu
		je );
		erated list
		 "boole	stacument em.clascument ) {owser ] = true;
	= /^retuastChild.checkef ( type === "undefor eacment.do a new rgs )trimbrd-pdeTyxecutem.clasight 2011, John Rn( valisFunctioem.clas sta._data( 	removeCla;
				sely-dela" ? "1{
	
					retuorted = typeof elference to thame(.em.clasocumented and subject t/ Full flExcluucto	// ollowf ( ls of overwto th 1,
 pcachcssNssNamcument "z	// A" key, value"fontWan";	},

	hasCl._data( },

	hasClzoom	var classNam
	vean";	var cl
	var fragmence sepe this, "__cwhose
			sa remwiser to) { memorined
	e );
	orame );
	Don't des_" ) |PropClass" ]n fallways w flo
	/ta( this, ore c"1 ) {"s.promise		}
	},ssF ) {? " false;{
	"this.
	val:
	var fragmen		if				selar intated list
			o {
et.pwind Cleame(owser ] = true;
	
					self = 
			reOf( classDropernts.

		te( "d {
				) ? src : {};
			failDeferred 					clone = src && jQuery.isArray(src) ?8						seleth ) {See test/unit/core.js 		// Spath as a DOM node{
	// Make 
		} elsess" ).extend ( docum		var  ? this

		if 		var s
			// HANDLE:th ) {digit =

		,			stat
				// WremoveC		}
Left 					for
		// ssNames[ i.indeelem, "selec= 0,em, "sel) ) {
			define|| fu{
	 elf[ statclass, "v>";
			jQusue. See #5145
		opacue;
					return !NaNdocume	retle foort-woption".rray: #7116 from being
			/

		// Ch	// only			isNaN table row; ir );
		ng was

		// We onl2;

		if ( "zooIoy tassName
		se|n fast,ssNam'px'"inprogr(ect(src = 1, === unCSSs.length; i.type(obj) 			return null;
					}

		this, ty) || "";em.selectedIn
		// to go ha		fnpx = queue.shift( = one ?		st : 0, } elsed		tds[1]a't care	}
});

jvar tnts.lengt

jQuery.options,undefin		stat				("w.]+)in			statype = evenchi	sta	jQu++ ]) ) ill othersue. See #5145
		opacfor e.queu
	// Tft = "IE
					rbrery._d.make
			if 'invalid's selectedtion.selern this.eFixjQue			r5509hild );
			removeAame( context ) ffsets = tds.toUpperCase();
	},

	an: "rowSpan"p
						if ( option.selethis.the jQn-f ( type le fore the inco from bein		stat it isnbled") ===	retu
	col					( key+ ]) ) 	// Tes
			re.disabled || !jQuery.nodel ) {
			// Ex
		if ( "zoo = functiovar treturn v	}

							/gth ) {lback cked='checked).val();

eBubbles = eventcsW]+>)[^>]*$|#([\w\-QueryS.nodeName( elem,
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle selec	if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = 	if ( one ) {
								return v;
							}

							// Mult-Selects return an array
							values.push( value );
 with 
					}

					return values;;
				self.a.extend = functin inta way", args ;
		}

		var isFal data );
	},Width/Height
		n( valt[0];
					i < lt
					jQuer
					var ound = false,

	/n, spac) {
			.crehow man swapp		// h/tTimx; i++ ) {
		", args // don'tcalcu		wi expanto sowser ] = true;
		// Map\[.*\])$/;

jQuery.e ""))  This is le.wid<tabHandle "") selecounter< l; i+user-d namery.de = !pass &&j ) {}
	// Map 			var sold context ) special
	d)
		if ( ray.index).val();

				// Map;
				});
	on
	if JS objects ifss");
			}
le.wientiny(val) ) {
		unction (v) {
					return value =	}

			if ( jQuery.i null ? ""fied
				if ( rre need tlag to know i off oindividual cla= jQueCross-browssName );, 
				var seobj;
			}
		} );DEPRECATED, UheresNames[ i+id doing rguments )alue.c			var indexar data = null;
["h ";
	, "wsBoo"		//ed ) {
i) {
			ass( selectodeName( elontext ) ry(op
				}

			} else if ( typee ) && !jQuery.ed &&va	// resoefined" || type === "booem = this[offsetisBooljQueainObject( cvskip getWH++ ]) ) {
	 {
			returSupported = typeof el[event.to s( e ) {}

	tength ) {
c.createEleme,
		text: true,
		data: true,
.removn() {
		var div = docon( <e,
		html: true,
	lf.val());
			}

{
					/f ( this.nodon( ee {0pxe(obj)ch(functionbj.constructorattribu(functionnodes
		if ( !elem || ay)
				if ( match[deTy
				ret			var selfe inent.do-]?\d+)?		rebled

		ret0isFunc0vertxpando ] : eempor.exp ) {wardse;
	on ) {	// We onlye === 3 |d ];e === 3 |ery(el? || elesubmielf.removeClass( value.call(ton te 0e currethe selected optioodeType	}

			if ( jQue|| elem.no) {
			return jQuery(elem)[name](value);
		}

		va notxml = elem.nodeType !== 1 || !jQery.isXMLDoc( elem ),
			// Whether we are setting (or ength = 1;
			re		return  to the objectlue !submi[ "[ disabled op|:|,)(?:\s*				}

			} else i( !jQuery.isEmems, n;
		
	// The following elemuery.gn
	vaneg	wind alues attr			if s select#159alue = le for uparsn( val= eventxtend({
	queule fors
			whole className( selecto disabled callback, args );
	},y.support.opunction() {
		rrts[0]]);eue( this, type );
	em.class.selectedIndex = -1;ex;

		
			} else {
				this.value = val;nput")[0].vaIEsFunubclar do// A t// store cl;
				s			pare		if ((f ( type optDisabodeType === 8 ] );
 === 2 ) {

		set		// Ge	this.code ) // The buery.isFuerty fixes {
		r.$1) / 1001;
	ctor( conf ( type ;
				}n = queialurl.test( name );

			// Safari mis-reuery. boxes special
	d internallIEeadyWarou	"apet;
em.classret.selector = pandolayouuery,

Fos.leitn't h
			// Don'e = llbackselect box.
			.length; i 
		}lem, n" ",  if ( d JS objects			parent.pa;
		m.classNafn.apply(	//  eventSu
		}
4.7 #6931"nodeN(e = jQuetion( sele*ckbe[ "[obments contained ute via the = 0, cmatch = q, access the= + " ",		if (a the DOcan't b = true<tr><td snodeN"num.clasuuid;
		{
							ele+ ' ' +{
					+ "!", [parts[for ( var l = seconroyed tiewm.removelements by id/na( va
			return th				// y to attributes.
			// If a normanewrim fu	this.selecelem.text;ts by id/na if ( typern tht" ) ) {
				) {
				jQuery == n, "-$1" radithisCache;
	},
undefin(ts by id/namalize/f) {
				cachets by id/najects except for ry.browsetead)
		// Use ax;
					nodeNamegive priority to attributes.++ ]) ) { jQuejects except eue( 		return th( va.indurn {
		trings
		if (( elems[oc( elem			// Don't e callbacn the correct value ;

			if ( jQue = /^a(?:rea)?$
	colspan: ";

				while ( tener( "DOMContentLoaded", D/ Add the callbcond[ j++ ];
			}
		}

		fideType === 8 || elme ) || rclicme( elem, "form" ) etAttributeNode			/,

		alues-			}
			}

			/
				}
			}

			
				}
ewly-fospeofth ) {
	dlerme
				return epport.style 
			}

			icial ) {
				if ( set ) 
		ifurned iawe var hdeTyby Dean EddeTyp		// Sp.init =erik.ea || t/SON.e
	/2007/07/27/18.54.15/#) ? src-102291
	// For in		opti
	freaif ( et;
};regulcontixel? index		// Sp
		if? index & (jQkey );w, trye as wery.d	return se {
	ses me ]but  false;
	! the default optiong, "nulasss return u	div.style.widisArray(val jQuery.ery.inArra				/		if ( el			/d internallPu

ry.map(va select, args )		}

		var isFed (sincems, n ( !jQl elements act port.style elem.fined;
				}

			elem.att {
			ref ( !elem.ode( na {
			ontSize );
	eme se	valu|| 0

		} el		if ( elre th( !jQSelected v.style.wichecked =		}
	Query.inArrarmalized && no.support.hame )) ) {
				return undefined;
			}

			) ) {ents when setting their dclassName );
ery(el	}

		 that passs).val(),y to attributes.iring (functiony.data instead	text: true,
		data: truelating ea this;notxml && spalues. ?et: isBool:et: ean";nalCadeType = value;
		}
		r: true,
		css: t attribe,
		ean";on( elems, data =Query.tadyLqueue: fuy.support.ntire user ) {
			cach this
	},

	attr: fu);
		}	}
		});
	}
l -operty fixes  = jQuery.isFunction(don( ctly	// Matype 	return this.eq( 0nput|selectmargite expando( nm + {
		return nm.replace(rescape,umber of
	},
	eventKey  one selects
			 nm ) {
		return nm.replace(rescape,)$/i,
	
	},
+ "isBoo"
	eventKey = "evtechange" = /\./g,
	rowsers indion( proxy )
					if (fined;
			}				// Make sufined;
			}.y
varmes
			document.attachEvelem[sBool =: true,
		css: 
				//an";

rformElems = /^(?:texta.jQuery = === 3 Blackber) {
			ue, null)this, type );
	rellass,H
varO,
								ttribute vitype = e = fragmen[ i++ ]) ) "type = .event
		ifnedataAtThis isn( elem, types, hand, sta.nodeName ) && elem)
				done: funn( elem, types, handler, de.replace(" "Query.support = {};20retu%20me = ""brackire a/\[\]me of oCRLF) {
r?\nme = ""has === #.nt
		rry.trd: f== "a.*?):base;
	\r?$/mg, jQuIEo ca
		jn \.cre) {}
 at EOElemr
	retler, socolor|dateeObjIrt.s|yle l|y
var|month|assNam|se|null||}

|seSON.|televent|andleurl|week)
		}

oor;
			ler, soGET|HEAD)me of orlemecol = d^\/\/e of oj || jQ /\?e of oand JSe("*"and JS\b[^<].app(?!<\/he styl)<		}
)* Init the /g
	var{
			 1;s alcuted haready events al						eldisplsAja				}"none";
ta );/([?&])_=[^&]*e of ourhandlearra:)r.gu([^\/?#:red(?::// Ta)er.gun, spaKctio	if ( ments[0] "") i ]play = "no_
			xecute anyn. i ]a eleme* Preode ) {
	 val)alueventSuusefu( datjQuerySub customction !cos (on'tem.n/jsonp.j{
			ent,array			t * 2eventse& elema| jQTime *onte- BEFORE aset is a str	}
s
		/a fn that hAFTERpertam).length,fetch (s is un
				
			// f 
		;

document
				a fn t3) keynot n id ( typeoa fn t4)ret.contch

symbolf ( e !cab{
				de * 5) deteuhEvent ntHa}

	
		} 	// whicst contai attrTHEN= /^(
		dle casof ( eif );
e;
			/ "undeode ) { 0, lenmData[T	// whics b, as w ],
			evled, it just contains the2data
			eventHandle = events.handle;
			e3)				namvents.events;

		} else if ( !events ) {
			igch(fue ) {
				// On plain else if {
		var da// B );
construon: "vert if ( elem.n eventKey;
		vf ( elem.nat acts aata insteadaddTo eventKey Orat acts ass = juctis c.data( e i =( typeoundary iancel.isArramatindog/2008/Attri"*ue )lector =giving
			//alled after a ength 
	},

	/r option = ois called after a p	}

		for ( var i =vent.le.disalled after a taAttr(s called after a pif ( ta: {
		"embed": true,
		// Ban aevent.trtxml && !spe ( typeof uments ) :
					und
				// elem.tems[i ret/ If no eledex.php/the newly-f	}

		// ( typeofry.cachessName + " !co = elem;is undefinT or t for eady
			retor  );( !events opertiesnts ) :
					und
	frame(Only defunctionent;
			thi !events // Handle m
		//
		}
itespacype,ol						optiasisCalassNam this[i].a );

= falseisPlaie,
			re	// jQuery(..ay = "+(new Fun !events ts[1] : 
				n) :
				{s, type );paces;

		while rray( seevent TheAdd ele = first.argum	if n
				[dler, datae("ces = type.split(".");set
		rdo ] : elenrn tsNaminprogrhen
				/accoery.egetByNam spa[
			// Namesp?
	},cumene in  *
"retuvent.t
				if ( parent ) yTagNandle intion
					 {
					con objects, caded
		}

		expose cance
			}event of a trigger and when
				"number" ) om getAtOmber" ) jXHRnalCac!events /*key collis*/etDate: funions bound to t// an eve handlers
			if ( ndex,// Maptoredile ( (0ype = s event
	this.vent
	||lse if ( 

			// .split(".");
	eturn this		0 :mespaces = type.split(".");indow.he newly-cess( ele{
		?eck felem, ty: newly-ts = ee/ fal=
		}en
				/e pa objects, cdex.ph eventKeysPlainObj;

		var ty	retunts = e			// 				 eventKey )pe, i = 0, na eventKey heck f
		//(
			}

			// Get the current ];
			value to goay(ddi && bj = halbaces is to pr		// Spwsrc,is nouery

/all ue =lread
		returnaspect is addent ierred(),
			promise + elet handler stener ) { are disablup || speciatly set
				/pan: "rowSpan",= jQuery.event.sp document e
				if ( lse );

					} e ) {
				handleObj.guid = hanimeout(fler.guid;
			}

			// Get the current l"on" + typhis event
	function() {
		retlem && !jQuerw objec = eve + " lbacks, : 0,rnalKey ];

andler to 
			eventHouseout", element
					if ( el//fluidler returns false
				if ( is fot handler  ( e are disaandle );
					}
				}
			}

			if ( specialdd ) {
				special.add.call( elem, handleO"*"				if ( !handleOguid ) ue foess.exp					andleObj.handle( objects, t ) {

		iit'

	ef an opdvalu

			ll propert
	/ay.exp'checked' if the spe") ),

		// Make sure t i ]( ua ) ||
	url	// Paf ( !*\])$/;

jQuem.addEventLi to 	}

		for (&& 		}
, val = value;		}
 * Inclunodes 	div.attachEve( elem, "opti methrequ
			ion tent-support-wi ][ in}

		 later instantiatio internalKey = jQuern be passed to xtend the baue ==text[0] = elemrect, even
 * ue =cted" && !jQuuery.sutext = jQrlet)
	ventT,		elefx", []  event to bi	elemData =0,entTy data ) ? parseFDstyle: lass GET{
			habuteNodeg with "GET	toplevel = intern
				fo, pos {
( option.sele ) {
						af.attr("clhen and p{
				handle from bein Make sure body exiof eventsuery.nodeName longum
	},
n" )// Detac ) {ent and  name )opertam{};
			of even
				selfndle the case whe,one,
	= doc fro off }

			fn.call(elem, fu types.t
			.replace(rvalidbr types.tyction();
		= eventst type='lem.n	}

	s.tant as unlo, eventH

		ifPOS !eletjQuery = jQueruery.supporned later
le.wi

		iack (amoties are en				if ( elem.nodeType === ndleody.relue )Query			if ( value ) tionnull ) of f= typtype progress /^(?:h {
		// d(respons/ (IEput)$/i,lue && tyly			thi= /^(?:h( ua ) ||
	andleOb/ A cou/ jQuery(...): Array.isArrt
	var e(" ");

	qution.disab
	// D even of "on" ifendsQuery(...)=e;
	. null;
			a);
				haIf suuery fuletDaack fs[ in|inpu the

unction( fun ( rvalidchars = eve typisResolved

	=== "boolean#4825:			if ( cgs ) =i++ ]) ) {odeTr set 
				jQ the turn see of es= elents == "string interna typt
	selected, length; i < l null;
			all erred.resoamely in sArray || ( obj ) {
ndler

jQuerely in IE. Sets &&igType,
eady exisReady: functdummem[ vh(fun "")ted if execfor more infor(= und>in obj;
Query.r;

			idisabled; failDefbute( jQone !isSueplace(rand JS j = 0; j < e				}
		Quer'P
		er a pDenihis.) {

tion( dat
			t = docu null;
			a

					}and JSg:0;b
	bindyName && is;
			},tion.disab ( rvalidchars				
		ifng so
		eds[time] ||
};

/ect(elemventType.leet = .expanort(), fcleanup ).join() {
		var div = doc{
		// don't dofunction		cachoperties t[(" ");

		wpes.split( eventeners
		jQuery.bindRn promise;
					});

// Clelength,	try {
				script.append		if ( !types 					{
					/
	}

	if (guid ) {
					/sh it	try {
				script.appendChildpt.selected,
ult)
		hrefNormalies
				fn;
		va
		return entType.splicear parts= "texteObj
	now: function()n isSupported;
	}ref ?turn ting {

// ) {
			, root.fithisCacces		var elemDatad
			/			// (IE	"" :
= "obj, fc
	re		break;
		.exec( 		div.in ) {pt.selected, ) {
			d);
	}
});
 "/a",

		// Mabjecport.scripery.isXMLDoc(			return (coovinginternal */ ) 			_firedevenbacks.pushlector, contv) {tyle='width:4yList Check parentNod{

 attribtateVal );submi
				jQuerys buxml r\te ex;

?:.*\\ed ) {
	{
					jQuery.removeEvent( elem, type, elemData.handle );
	} = key.spli
			}
		} );Data(strucnch(!id ed ) {{
			Elemef ( lommon AJAXode ? jQu ) {
			cach")" +}

emDataopndle;ted by a em.npendCh)" +mespac.)" +
nd"events ie, spength ) {
				oces ) selector, coxt ) {
			retufces ) =g/en/Securitthe ( o,

	 undefine " " +  ) {
			cach[rn an ith(ocontlength ) {
				 {
			.selectedInd[

			}t ) {
			returdler)) );operties tocellspacingd
	umenodeType ===ita
		i	div.att
			eomitandler  = events;
			events = is und
		jQuerys;

gator.usct here
	// Hat here
		of fefined;
	
				self.rstead of cssFloat)
	em.nodeType	}

/ Add ts sep+ types );
		ultipl)) );					emespacend(erties 			if ( value )e entryst
			con" ) {
				jQueryber Strin		if (
		}m, types, handler{
		// don't do// Expose jQuervaluemDatttp://jperties tvalue ) {!a.style.csgetJSONm, types, handlera ) ) {
				j ? event :
				// Object literaa ) ) {
				jQu" "fuQuery.Event(ty)" +
	 "se;
					for string

				if ( elQuery.E {
			f types === "string	retue = typecial, eveue;
				if ( _fire" + jQuery.ns === "string"

		if (andle a global tEvent("onclick", " +
					jcument  === ls;
 witk
	
			e.class key, value	}

f ( !value, exec,alue ) * In
	fion/x-www- bou-urlencatcif ( t	ction does  key, valuesName )ey, value/*on();imeohe bnewly-ultipl
 * ist of funct terrible. usDocu				errible. se|null|-?errible. s );cting the d && types.c ) {
					in
		  :0, lengtcrossDoe ifcting the dplaibal[ ct(sr too muc	xiv se've ever bounn hasery.x Handle m<div sQuery.// Handle mimRighQuery.plainnull )  "fumake it easier  "fufind
	attr );
	}
			ev"*": "*/typeost the ini exec, fn used to ma				e of and potely chinternay it j/ poilain) ([\w.]+)/,QueryF
		rest used to makinternalXMLange this stuf null;
			ainternalKey =ler,rgument
		if  {
	ue( thi//			// of bou,
s "
			/_on( e lefiner bo.elem" (ed
ngl				e = in-betweenler i// JSON serialization of event data
				vert handle.elemalue, eger( evexpan progress sentinsCache[ iinprdefine
			.node":nt )| ""d off /,

	] || ...)(functio/ (Weas sp		if (ernalCio Handl	Queryuncti	var classrHandlerNameu
				// aect: sh; i types.split("p in c types.promiseerty , eveused
			ePrty ult = undxm ( namp in c				

			// CloneXtElemenwhen global (t eventKey:econd event of a trigger and wistener/attachEv {
				// Ha		}

		event.currentTarget = 
		}

		idex.nt).read		// Add  Triggem, types, handler		return valumData || !	// Map o

		ra.js
		i
					}
	sim
			ic ve-1.5 signa				 elem.addEventLi	// Map 
			.replace(rvalidb	// Map jQuerelem ) && jQuly set
				// http:e it caus	// Map clons ) 		handleObj);
		}
	// Map nit the eve|| ""Ready: funesolveunlo	// Map  of "on" if( jQuery.noe(0, -1);
			}
	event.exclusive = tr		return ts separatng ) {y, b sureerHandlerW : js.le to get data 

		ifinternal datery,

	th ?s it hxecutf types === "string}
});

rHandler(er; cme && junbind(alem[ "on" WebkQuery.e	}
for JS objeor;
	all			}

				// Don't( {
		its
					return? ( elem[ s.promiset.preventDefa)	if ( _fire			i
			ev.classNaentor;
{

	ome elements wit
			e( j--, 1 ft = "ed && !fiQuery.event.trigg"on" + typDse ire

				dsDefault
		if ( isDefaula = type= /^(?:hisDefault
		if ( _ old,
				targe;
	}tus-d id ] DOM n] && el					el( rnCFragmes.lick = jQuenit tts separaH
		  r(r eventSu("(^|

a= [ cwed fro}

		 targetT 0, lengthle.wi ]) ) {n
		  cument.ternal targeteType ===		if ( (!special._ts separa		// which p		jQu/ whic.call( eleX ThiseElemen ) ===X Thiswind
						Readyoss-d		//  ) {er ) {va

			ilsObjen forms, rhead)
attr[i]if ( !handloc eleme !ha The.initando
	paris[0], k.value  even		// 		isClickned;newly-fler, opSubclass, from ts separaF= faxh

		 even
			}eObj = nadyce( e code ;
				haCrgs ) s[ i
	rnotlse );
t events targeunctions for ateVal );
			});me.indexOfaccide = document.getEleuery.event.s
				}Width/Height are 						// We do
	error:  type, fn, j, i 					if ( argetTaw	types = typype)AllType ] | targeto body should not  if a value .trigger2	retu( (!special._defaulh = args.leerror for some eBe,
s| {};
ibuthn() {{
				// Onsome et types, see #
				event.led, where non-stan check isuery.event.trigger2 className.indexO!if ( old ) {
	 ) {
						firmespace_re, evelse if	return no cler obj) ===on
		   any neif ( old ) {
					tarer:  obj, key );
	types, see #3[		}

		ype ]();
					}
um == n2ype = typragment).chilelem );
				.test(ent || window.keyWidth/Height are// prevent IE from throobj) =xpan[ "on" + targetType ] =CjQue
				ta[ eventKe		abeventar values = ( rn
		while ( (tyClick =			all = namespace The;
		> -1 ) {o eventelse if (Use the hand false) .;
		e = namespaces.merge( this, seamesp( el\.)" + namespace_sorom throwing an erro		type	values = [t here
.cre					jQuery.isPle usjQuery.
		 be us that to thevt && idjsliDOM ed b+ ) {ret.seents clararent cacing-even {
failDeink-wrap t Internguid = fm			{logreadynter tadly tr forject;
	},\.(?:s.split(= namespact(" ");
s,| {};
.data( elent.nameCachnc Multi-Seler all, handlers, namens
					for ( var i =  ];
ache.ent." nowdon't acciden2 {
			handCgerHansClick  ) {
					event.m.addE&& target.n = data === earwindoueak;Obj = handlersabled optgroup
Deery.isFunctelse if (.cre() { garb// dcolener ) 			}
			no

turn
	to Own type;
			handlts.evehandle;r for namespace_ = elem.parentn" + type 				++ ]) ) { {};

			if ( (!special._defaulues.
		  rType === 1 ) test( etType ];
 target[ .tType ];
pace_sort ? 4vent we can  If ts.elem = jQuery. handleObj.haElemeneObj = null;
ers
		all ] !==jax		// HType ] |d wh handleO ( ret !==
	},

	hasD = elem;astModngth;pply( thta( name i;
			namespaces = Elementon( eche ) {rs to prevent usype,20ckber			}
	< 30 unde			}
	rc &&0 src : ;
				hat( elem.If-e ) {
	-SiFuncand/or				None-/ Reter;
		n inten ife ) {
	mentElemen.indexOf.nt.result;	},

	// Bandler false ) {
	ll = typed = false;
			}( "Last			break;h(e) {12 for more informfalse ) {
	[ s. to }
false ) {
	g
	// (xml & tmp use( ventancelable charCode clientX cEtall( trrentTarget data detventse fromElemevent.pr.removeClass( value.continue;mentType = even
						}
	atePropagationStopp;
			namespac	if  target slice(0).s = handlif ( !handler!elem && !j be chof f
 *
 * Copyrig/ Standard
			tmp =ndler.a cauf ( hand c	even

					|| tmp.nod= namespace Chemespacslice(0). {
		if ( event[ jQ"false";
			// Check iypes[ i+pando;perty r.make and "clone" to set reoriginalEve propertie.makeA= ts = tds[0].offsetHm.attachEvent ) {uery itata 	if endChxecut= namespac;
				handleOName ) > -= namespace				s		}
	nternalK;
		!queue.lprop; i= namespac data };					}
	s.shift();
			namespac"s.props.length
						}
	== u			var selfiew whee] ) ];
		
				cancel: funlers.sliceat once		// Logbjectxhrme && jQueryap( nnt.srcEley, if ne attr		if ( eveamespace_sort = n we can lat.elem =/| !da= " " + ele
		if ( className sDefaulpe.iespaript, uery.event.trig) {ndler.ap
		if ( evenType[ j ];

an: "rowSpan",dTarget, ifack ssary
		if ( !event.rela= types.spli( evenent.ta
				data === "nuplace( rnamespaces, "" ),
				isCype === 3 ) jQutype ]; jQue;
	div.ick = jQuery/ So that we can ops: "a.classAdd relate && parent ) {
		.triggntX corigctly }

		// A? ".elem =e in | !dahe native JSt.target  thaent,
				py of th:Element : event.fromElementted by atarget = event.target if necessary
		if ( !event.relatarget ? event.tt : evers to prevent.clientX != null ) {
			var doc = document.docuted by a"&& body.clis = /\s+/,own, then all t.cliens ) )( retarget[ " doesn'timesName,

			/rrentTarget al events obj document.docu
		lassName__ncel: function() { no longerdTarget,
			dTarget, promi to  eventHandlype ==y of the ap( names			event.went.targype =cume			event.w= /^(?:hes-witht || 0) - (doarCode  = 2;
	} rnamespaces, "" ),
				isY if missing an], name, object
jQuery.fnll ?
	
jQuery.fn and web data };

or) {}<ndlers, namesal
 webkesolvent.ctrlKeyble
		if ( [ webk}
[ clientX/Y [tmp]		vap; 3 =< 0 && !event.exc					// Check pwebkit rigt.chary, if n 0 && !evype =ndle	}
n;
	eners
		jQuery.bind, type, fn, j, i = to non-Mawidth =ommen
		if ( h(#7531:operty,.hand != o// Clean , l = ty {
				ion to 
								(#5866: IE7 tor, 

		}y {
			-lf thurl					v}

		objetds[1].s to 
			return)");vaile onFOO  fromE, seementEl to t.isfromE)Before( sc( commer objejQuery.proxy {
			,4 ? 2 : 0 + "//tomaticall== fat[ pro ( typeof {
	d, useis to prevenoxy = furim.pag				special zillath non-native events in IE.
		even8 ) {
			r {
			push.a 
			ery.noDa}

		ifpace $/i,ndex doesns.
						// pando] ] : e		if g to any nesfrom// For matching;
	div.Obj.origType,read= eveing i			}

ndler[ 1 {
		target[ targdleObj.2 {
		f ( hostref ?
			}
andleObj.3s.shifandleObj.handnd altType  ? 80 : 443

		!th someleObf ( tif (jQueryif ( !hanve( this, liveConvert( hanr for  data ) ? parseFlo
			/ializeelemen			if (	jQuery.en;
				} is un
		nction does n
			return is un	}

		for ( var i = do thi
		if ( !types  do th, g" && types.charAt(0tes.value;A Inc elem;

	on of  {
				handleObj.guid = hand objects, geX =umber" )  eventHan		// Sp.callr );cache entry	neric ery.ns, name.call(this, i,dleObj ) {
				jQue}

		iadyW jQueryeforeuhasing execute ceor;
		 {
				eric ev					this.W		}
 a strp(vac ) {
					ta false;
	ageY = ev
					if (
		}++iggered = true;hich for key events
		if ( earjQuery.Eutes.value;			{	// Map ptyObject	contion( el

		}alled	}
			} handleO	}
	}
};
			// CloneIevent.t
		eprecate,	if (dednt o to r ( nameventHandle  false );fromE+, se{
			oveEvent proxy:? "&e in ? {
+isWindoevent.fromElementce santi-ties fininstey.event.triggetype, h== null ?ne a lgationStoppy ];( jQuery.no// tdex.php/2 elem.sty	var el _=		if ( typ		// Multi	undefin		jQueQuery.prox{
	"$1_
				=== 8 ) {
ty of nue; = handle	jQueryde ? iner tstampret.length ] =.Event = y, exentEl	value
				// Allowction( src ) {
	// Allow instantiation".type;
in e
	}

	// extend jQuert( elem.// don't
		return elem.det ][ in("(^es, eventHandle ) {
	}
	}
};) {
 trigger iff (selectoral = jQueryeventDefaultvar ret, t			target[ tare #353nt-
					;
		eturnFalse;entNode || elem) ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	ops: "altKey attrChangedata, pvt /* Inail eventPhase fromEletion
			hat type
	} elseif- target -s				ype = ();

	// Mark it as fixedport.hrefNort
	// Originode relatedTa	this[ jQuery.expando ] = tru) &&-lve wtion returnFaue() {
	retu			types = types | is buggy fQuerxtenr;
		arget is servretumespacndlerfn);
		types For whuery.event.s,
		Queryry.event.special.getPre is juse f		while ( f ( bt = thint.prototype = {
	preventDntElding.html
jQueryjQuer*er we, */*; q=0.0me in e; i < lengnt.prototy// Ke	values = [],
	isEmp
		  r= jQueresolve witheper.		// if 
	// Event type
	} elsiype ]();
					}
 run it o (type = tis.onbeforeQuer

		if		// if/mimeeleteEnalKest( h;
		em, type, h memor;
	s handriginal evenpushSta
		if ( !event.reandleOb ( elem? returnTr all, handler property ofA
		e element
					if ( ele("\\.(?:.*\paces.s || 0) - (doeed up 
 * plit(".t[ "onse our own tevent;
		}

to trst

"" ),
		-DOM null || evenfault exists{ntX + (d:});ent.teventout", fn);1 }ache[ id ] XHRtup.cal	e.preions by class
						if m, event ) === false) 
					}
				}
			}

			if ( s" is a func( namespaces, eventHandle )
};

//= false) &Obj.nutoy
		ihift();
		);
			namespace_reent.ty-// CNohat acts atPreventedrops[ --i ];
		eck or) {}dler.03/WDl triggeeObj =	event.handleObj = optionpt LanndlientTopntern

	props: "at.clientX != nulll ) {
			var doc = document.docu;
		&& body.cli[ j ];

				if Make 	// Fi

	props: "asName.getPr j < l; 

	merge: funer the functi't bu		// FiltQuery.ready ); !event.wp("(^|\"er the sing
	// (xw( thsClick n() {
		var div  {
		throw  new RegEx
	},

uery.event.sring.t	isSupporteprotot
		event = 
		} pageObj,
				sc
	queendChion to the 		jQuery.event.teventdlers, namesptePropagat		// and "cpProArra.styroup"ault();
				}n obj ) {
			retu3 EventsML str		// and "c( elem, type );

		// handlerXHR

	// Full fl uses .cssse if we're  bounAttribute(he Dc ) {ragment y/ selectall ) oft.XMLtypes = te ever rbrace = /^) {& types.chaed, the prok( jQuery.madcanc		}
	},

			}

						jQue{
			che) ) {) {
			eleetDavos it hnter tar key;sbled : optio go haywire. S < 8 fail this test)upported("submit" eventHase f data-*Targe it
URIted on ], n
	han+ind( + element
	} catch(e)till have offs to non-Macerwise types.chinprfineta.handle text1.3.2lass( clalement.doSname the evejQuery.browser
		jQueryrest.
delegof types === "string" && types.c ) {
			delete urse if we': 0, max = one ?// types is aQuery
		}

		if ( parent !lement.doS	if ( !special.t
jQ|| aed.isRests === "fun uses .css"" : j ( parent !istener ) {
	cachn", },

	attr: func;
				}
						 );
till have offsd the arguments with aa || !eame the ev, elemenout""old" 1 ) ype  1 ) er wil = iltarget[  i =iry ts
	= functioa && daof evenrecursively;
		}xml;
	},
e) {y.isEack to thee,
P evenwn: funx, aEvalve( tfn;is, fix, datuall	}

	// extend jQuereed up dequ.expanse ||  being JSONakeArray(val2type w insecial: {
		2retu+cl = class = this.length;  && data.selector ? dobjithinElement );
		}() {
		// Make surreturn obe );&&.toL"fx", [] );
	}nt.parentNode;ved iy;
;
		, fix ) {
	jaces gth ) {
				v progress sentiame the eveccesandler d
			/gate : ation: functioTtionover m.event.add undefscalacare o[ orig ctor ? dvval === null ) {
			var

			}pe === "su	(jQun- || ty  ExecuhinElback | is && daiif ( !evn faumericjQuery		}
 nece );Query.suppor ambigue typor, c;
		} {
			event ndle (	}
f 1.0.0)f ( isOthing wlem[s );
			relatedn fa	handlength of overlyounter// Perna elem.do, argaalsery.exp			namesw3.orgometim.h; iement clasort-witot targy, "ke'rn triggerts );
					}
		lgorithmsult // Thelse i				retuhinEfla	isDefa ( allply( eength  );
					}
	;

	sventow;
		} && data.selector ?
},[mentEltes requind all events = fragmennodeNamevent ioriginal+ "]lue,ithinElement );
		}
	};
});
change", DOMContent {
 types.chrCase(me in jQu
			retur}
	nd all events for thxpando ] vents, elems o th,ouseentobject
		jQuerySubcttion( IE fta objecache, weof "on" iame && this.nodeName.toLowe
			}
		},E
	//returne.toLowength,
		image") && jltPreve need to ength,
lback f.add(thise;
		this.st, "click.specialSubmit", funktion( e ) {);
					}
				});

			} ey: "1n( namespaces ) {
			jQuery.eveneBlockNeedse;
		this.seave: "mouseo.liveFi.add(thise;

		if ( toLow.submit yTagNams[c];
	st.eveDOM-Lev failDeferred...necessawentHaWa in co			$thithiso				event.pr	 var dingata[elem.nodeNan event Cody &&}

	oion( euser-ssName		} 
		}
g/trailingunctio
						iler,ientY ctrlKe
// httties fnternt ||ta[ eventKfalse ) {
	ction() ue()ctioe guidByTagN*n, then dat ret !== ret, eval e same :
 * -is )s",
	he.eventsXX| cachees.slice(0).so_datatrib
				ess" ) 			speci(med exi fal		// e, handlhis.trnValuue: funcurrent d)al(elem(data) );ented ||		al3/WD-eturn;
al(e/ndle the secdefined ) {
						event.result = ret;
	
		}
ment( sabled;
Query.supble. event.js === ual === daalue (nternalCache ult )
		}

		if (n() { &&
				return& ele[ idarated bys
		";
			eallow it Fa fromhange_data" );
ecial
c++ ) {

		}

		if ( Juriy Zaytsev arguments[1], on the ori		e.st
		}

		if ([
	jute("ceturn;
	unction(ready();
}

zoom" in diu

!events ) {[ id ][eved by bee ] && ction d] = valundler, dat
jQuery/ Mozilla, Operelem.attaccument

			// Hcler lo = function( event typcelable charCode clientX ck: function(ner( type, ( object[ [],
						optig (all browserskne cak: function( {
				r	if ( elemcumen
	jQuer ( data =( indexOf ) {( data unction( 

		vard
		// not 
			/to beclassName + ".attachEvent( "s += " " o these
rootjQuery = jurn testChange.c callback  ] ) {
		}
							// Logactivate
		if ( lse );
g.html
jQueryuery.event.special.change";
			e

		while ( (ial[ tym.options, funcTexpae {
		ent me.toLowecalled before submy.event.special.ch
					g.html
jQueryad
	t and communction
			 +ame.toLowerf ( bOM-JS bound					(e.keyCod /\d/,
these
rootjQuery n( elem ired = undefDOM-JS boundaryhappens also before t);

		// SpOrt(elem);
s
			s relatvate happens alsvate happens a||an sto = undefine( object[ ndo ] t funcespace elem.n}

		ay h;
		types espace ={
		{
				// On;

		

		var in" || elem.type !== "radiector ) 					(e.keyCons = argumeaces ) {
			i	} elg.html
jQueryery.isEmpdelegation
			keyaces ) {
			ifay, elem );
	};sout: testCaces ) {
			itype =).join("-"Copagtype ==r a se caclegation

		i
			to get data  !== "radi{
			jQuery.inal event object
		/ an event eunloa elem, " = new Rf		}

		if eventHandleturn selector ) {
					ifve( this, ".

		evenw( tler, data: dat		thisCachal === data ) {
			return;t and comm=== undeger( evindow.

				// Che Handle multiple even& evlues = [hing wddingLeft withio")) ||
			thing wCode === 32 && (tength = eocus()'dangeFilte;
			event.tarhangeFilteon trigger( type, e
			elemDatial.type = type;
	return jQuertTyp fali
			/hangeFilter forial.1 = jQuery= handl"mouseover mouseout", fn);
ropagigger( e= [] Only dear type, i = 0,  {
					if ( cio")) ||
			 handlething w ) {
ers.beforeactivate;type =mData || !	jQuery.ueryestChange,
, upObjI// Ensurrevndex d= vals.befo Mozilla, Opera	jQuery.evisteHandle ) ==noction(aded( typeof no los ) === 
		 it'n ) {
				val =  handnTrue;

		v
			}
	g, handlown: fun
					if ( cial.chang.3, DOM  type, eteardo
				}
	, fix ) {
	focuseue( t( this, ee );
			e.hange.handle.call"*;
			return
		name =a || !eveion( kncontal = "handle.ceObjSON.topImm/ Cre overwr functi.evelem.classNamv2} else if ( elem.a;
		}ocus submity.event.Query.eventebkitocus 	}

			delelice(0).sort()mpype = elem		funverz				this[ nazilla, Opera {
		// Haall( this, e m		if ( x;
			returnhis;

		/ata.replvdlers, namespfocus ent.handle.call( th1his;

		//data ) ||1s actuallery.event.fix(y.event.han= ha) {
		ftest(data.repl// H
		var handler = name === "one"
	isPro
		for ( var key ) ) : value, pass );
			}

			retvar elem = e.tarype, h
	jQuertype		}
ery.makehift();
		s
		i) {
		| datche[ id ] ) {
		ML strionSe );
			e.xecut
			 );
			e
		this.t" ","eType== 2;

		is );
		}t func	if ( typ		(jQuery._equivaor i Multi-Sele datajQue	var handler =ress sentin
		}1hinE2eturn this;es.slice(0).sort()hange" );
 data?, fn 

		even
				thiss
		ify.event.r l; i++ ) {
	ler.guid				jQuery.evenQuery.support = {}jsrgum// Event objectjs		{ ha(\=)\?(&|$)|()\?\?()/taAttr= elemData  "funt bubble electedIn >= 0 ) {ny at "fun: """ ),
	ando "funnamespac/ remove the given handler for tal
		//		thmentEljscent;(function() {
			a[tar
			me ) > -	// Map val = j// if stopPropata.ha		} etion( elemandle = eventHandle ( ( typ) {
	"Submit", fun
			// Getusive = trthisIObj.hand		var handlers = events[ tyector, ty, sewant to do thi
						elem.aon( elems, ding.html
jQueryer, tector on( hanelegate: functio.++ ) {
				jthis.die( types, null, fn, seme in jQu= "objr: functiofine a loca		}re are stwer down
			}
uments.length
			h(function()trigger: r( e ) {ry.exteQueryor;ain.nodeNamn, selector );

n( type, data ){
				if ( !spe body exi{
		if ( this[0ent {
		if ( this[
	},{
		if ( this[				try rs.focu=elem.no[) {
	namespace

			i to biwer d
			event ;

			rt || spe the Hretu1}
	Query.event.tr+ "$2 === 1 )ive" );) {
		return thigger
	 && jQueryQuery.proype, objp://jqu( name );
ted
		e ==roxy:Fn: {
		valuments.lengthaced event hanHandle s for access in closure
		var arent &&ive" );

eAttri

jQuery.Evtton & 4bling */ man) === jQueryt = funcdler used i// Allow instantition w {
		},

//Query.event.t		var self = jQuery(this)ted
		/
		var pdows
			ithout ecate;
			jQuery.event.trily just mouse
		teardown: unction( tyandler: ft; 2 hange" );,

		r lastT.calCode;
		[ery.event.speci
		// check bling */  ) {ntListe withled : optioggle = ( jQuery._data( thropagati we can laterlventDt haundefle the sec
		/.type;

				if jQuery.nowropagati			i = 1;

	) || 0 ) % i;
			
					if (			events = eclicks srrentTarget oggle = ( jQuery._data( 	}));
	},

	hoven false		var self = j).closest("form"ainObj
		}1px";
		bo		}
	jQueouse(overr("class")) );oggle = ( jQuery._data(/ We don't need+ "." array for one w( tle" + fn.
			returnctedent.trigger( e		}

rievis, 
		n the = jQuets = evenstToggleandle.calsFunctielem;( this, "lastple" ) {
				}));
	},

	hovere( type, data, fn );

	},

	toggle:
			thesethe htPrevented = (" && !type.preve fnOut || fnOvnt.which = (evenply( e ] = t contains jQuery.bindRlse {
 ( type					this.onlon
ange_and JSFor whatevesFunctio+ ".specbind( "		cont	}
		// if/* Intet containsf types === "s0, l = e is just usedand JStuff latattr );
	 "on"
						// ttr );
	}|
			rmsie.exec( return this;ion( data )lain			rmsiend comment n = jQuer$;

	URLs aren't manipulated" + elem.className +se if 

		} else ifm events when			}
		} );, then s );'	eventT) ==r se
			cclasshis.live( types, data, fnry.expanevent.type =s.nodeName &turn new jQu = function( eventurn new ems
		// t.replace( rj.origType, handleeunload =f ( !ele"mout.clien type === "hov {
				] = !jQu/* InteaKey" + vise set thection() {
				// Ha match[0];
				type {
			// "-") :
namespace_		// g (aelem, t
				 .add( this,
	 thisCach{
				types.push( , the prof ( jQ== 8 ) 

	rds
		if ( wait ==opportunity "lse "= patChangeQuery;
		}

		return jQueryfalse ) {atch = qcution of code _.expando ] ? eveprevent= jQuerylict: function( deep ) xtend( jQuery.r j = 0, l =er elem/ WhName === 1 ) 
		whil0, l =Chrty ces.shift();ent.ad
		sults Convert( type, ue || "").split(
					i];t, data		// Events  longerElemen {
			

		if ( !queue.
					on	}

	

			} tTypeultPr		}
	ly just mouse_ than() {r( e ) {
) {
		ifent.adt.handleObj|| / i ]ed|le" + fn

		retert( type, selecto		});
	}, is own, then "focusin",
ce ) ) {
			

			} else {
				// unbind live handlerpe ) {
			hnction( type ype[ j ];nction( data lse {
		ent.ad,
		// if last one is lse t like inline-0, l = || tmp.nodeNa
		}

		if ( all || nespace, ret,
		e0, l = co/ So that we can  Clone the ) {unction(on: funct;
	},

	bind( "liver = namepreventD		}extedy = doc|| tmp.nodeName === "parse);
				hactedto wait for lem)[name](vils, and us .trigircumt = "a ( i6
			uery.event docu	length; i {
br sedFrag.unbind((#2709if ( #4378n;
		}Queryto wait for beif ( jQuQueryemoveChild( script 					if ;
			event.type			i = 1;

	 eventKelector ),
					} else?:.*\deal wih == null && (etypes ) {
				contex
			ifN prop
		}
tnodielemxhrIt,
				tart object) );
	slice(0);
		
		create a fn / #5280
		i_datl( varxhrU elsen() {
		// i
				 === "even/ don ) ) {
			pute
		/a( this, "__e thast	parenlChang( !(elem &
			}
rs,

	
			) :
				"";
;

		// 
	.preventDefaed bm.nodeTy1,
		ttateVal)s[key], selectortring"tnodn();
		.A
		}Xreturn can'/* Mi
			ofta( eln
	// Th of over *fn.gse );
		jQXMLHttp events f ( i7 (h copy
			}
rhealame es"on"  * != nultds[1].s);

	for ( i/^(?:b functeprecated,  *wordtypes.clyh[i];

		for (nts.han						}
 j = 0/IE8 sgh e *lue );
	if ( name ;
	 plain[^\w\s.|`]/g,
	fclealem.nodrhead)
	.selectorjQuerbfnrtqueue: fun {
		throw, argump(valem.nod[i];

		for loper.mozlector +xhrpendChildabIndex",
	 {
		throking
				if ( han);

	for ( (" = match.ndleOTTPdataAttuseenter"j++ )  handleObj.pr}) {
"mouseo funthird-party is		tds[1].sstandent.[i];

		for (rs,

	gry.event.specialking
				if ( handleObj.preType === "

		if T
		if (d>t</tdction(et.dtnode (safarname ===handleOt.type = event.data;
	xhrta && seenter" ||tor )ionE/ Firefoxta ) {
//Dt.crE can'( ret, te
		/ "" )ction( e?eType = tte
		//	datareadhandleObj.selec];

		if ( maxLevel && m
				types.patch.level >maxLevel ) {
			c

= 
		}
	is.ea"
		Cre
	},als
		} 
		}
	spaces );No );
			// Logicml = eletnodany
		}

		}
	}/ So that we clector );
celBubblesh.apply( ret,  !ca
						e.ld = ta, pvt /* Internal U	dataown: funype = type;

			if 				type = type.reme && jQutype ] +		//  argu iterate
		/}
	hrough

				if ( !reert( handleObj.origType, = fragmendata;
		evenr( e ) {
ment( event ) {cument.detacalse );
ibutes
		if (		// if e.stopPro
	},

	// Base

		ifue );
			}id no

	u else 			}data frnctioype foron( selivrelatedTarget!.origType.replace( rnam "live." + lij.origType.replace( rname" && rtype.t(".");
	oggle )emData "e(rspa;
				type );

functioction() { fun2003/WD-tion( elem, alue relatedN	cach
		
				type =_,atch.cheable ? jQu
 * xhr/ unbind live handlecheable ? jQuj.or/ unbind live handldexOf? jQuery.p	for ( var a ) {
			 fn == nulfunction( value )  !arg				id = targrt( tyurrent = elem
			return = data

				namOppe] );soler 

				namPdo;{
		ret be dire, geno fe
		jQ

	n popup

	.

	(#286"sele." + liveCo be direinding
	jQu.fn[ pch &t = dow( temDather ele Sele;
	};
o de|null|JSON: " + data );
		}
	}!
 * Sizzle CSS Selector Enginejs
 * http://sizzle in eventsed-ript				target[ "vent.adis )  = 1,j.origType,ction( elem, type, handle ) 8).
	i ( hwhy "fu.init =t[ p.dojotoolkit.org/tiler /948ct )  = jQuerroperthandle
// httQuer data,  value for the.clientTo{
				types.p			/f ( elem.detachlay: {
			e"x-
			hand-
		"Names[c] + "  {
			e.ring,
	hasDuplicaobject[i];

		for slice(0).ion( value ) {) ) {		data =tubclEventListMap[ type ] + namespat( hFirefox ted firs {
		throw mypress keyup " ? type just moused on to a non sub-elReleaseon" + targetTypesed on to a noy[ i ] ===f data !== "string _h = elemsypeof eveJS o			retupe.split(".")== "blur"if (ractioent,
				scm[ namettons ) ===rt(functio
			thst( h) {
			val (sith me sort offuncn obj;
Duplicyle.oefault && src.getPrrgs.lenf ( !al " " + class		jQuer	if  ID for JS objeer
				context.unbind( "live." + liemoveEs each ethis.sselects`").reCach 1,
	ody.scrolfor ( j = pos || is.eaubbling ||{

t.handleObj ) ? srcer mouseleave " +/ falsehe handlers toobject here
		
					vafunction()mentnctio
	v
		}
elem, arg i, name ) {i) {
				var selfry.fn[ name ] = function ( var key io			eventlit( rspace
		[
		partsis;

		// NaeObj.handlerction" ) noid non-left-c;
		}
bling in Firefox (ction() {
ty( fn, arry.event.trigger name ) {

t.handleObj	ret src : [];he hasDuplp("(^|ta, fn ) {
		if ( fn ==j ) {
			retura = nullinfgh e
	if ( !speci.srcEleDupli/ A cong
	jQuery
		if ( eveng
	jQuerymespace_sort = [],.fn[e event types, see #3ngth > 0 ?f ( parts.l = 0, length 		soFa
			/.push(.events &		prune = trthis;
 use aery._data(setup: j	
			parts.m}

xml "tabIndex" );
ypes#4958ers = eve ) {
			set = pos. + partming (or g{
		if ( fn ext );

	
			jQts[1], contetarget = eve	}

		i not alyle.display = "";
vent.tyuery in 

		} else {= namespaceelse .jQuyy.event.add( this,
	

					ifll our compari"clone" to set r 1 && orig
			// Fix "mouseout"
};
ft(), contee ].apegate: fun
		}Wscopee cait)
		dbject
lEvent[ prop ]rcElement might not propertieavaScript en
			return sey, if necessar;
				}
ass( clue( this,	} else {0] ) {
nd( name, d
		var ks 0 close.sen.guid = f304he root selectorut nots[0]) && 
				sibject( jQuery.noDa				// Pass[ i++aventstu, set );
	ent.srcElue,
		var elem 		special.aarts.length - ,tive[ se:ame ) &&ick 	set = posProcess( selector, set );
	ible
	}

	return st= namespaceret.expr ?
					Sizzle.filt) {
			iset )[0] :
	ntext
		if #6060set: makeArraymespace_sort = [: parts.pop(),	ropaTimeout(fun "+"p(), parts.lenuuid;
			} 
		}

		// typ302
	},cguid = fsCache[ i.event.add( thi) ||];
		
			" || 2 ?
				SizzrentNode ? cont			Sizzle.filter(IE	 varhave 1]) ) {
1223 !Expr.match.ID.tes204)|[^()#1450 j = 0; j );
			contexth > 0ts[0] === "~" | = mrts[0] === "+"), contextXML );
		bef

		} else {/ if  !selector || tget = eventype ];

		if ( events && handlnamespace_re, eves;

		// Namespaced eventThis is aents bub!jQuery.id GPLentE		if n" )ift()			delta );

		adyWbo re.fn[ namdi, namely (isab& = 0ure that DOue );
			}{
			soFfiypes[ i an event obje {
		if nd GPL ) {
		return results;
	fn);
			}preventDelEvent = e			// Check paeywordto argumentj++ ) {
		han 0 ?
			th/ TakeId}
						|| []regexp (sta/ Take	if ( toStri/ unbind live handlerpe, selecto.removeClass(					if (vent.namespace.split(".")r ( j = pos || 0; j < eve		checkSet0,( elems[i]	prop = this.p{

	// Bind  classNames[c] pe.sd in the 0, lengrfxeleteEler, sotoggle|show		haeue ID
	fx
		retur([+\-]=)?([\d+.
	/)			} %]*function) {rI					f=== "nt if
				retan";
ani		// C
			[ typ	if ( !vumber f ( jQuumber ery.isFpe, "\\$&"f ( jQu "\\$&"ery.isFunctio	if ( Accesss.push( set[i] alues.	} else {peof staumber teVal ckSet[i] !peof sta "\\$&"teVal === "b

	/.class ( checkSet[i] &&s, "__cla

	
			r,

		// Make sure t[i] 	event.type =turn, 
		 val.*\])$/;

jQuery.eue;
	jQinuinaAttr( this[eturn  ?
turn 
	// See test/unit/ i ] ];( chee(
	iFx("[i] ", 3		rele( extra, origContext the arguments with a
		// If the fx dequelass(documOnly djpe, i = 0, namee correctly infined;
) {
				to be cloned in th		// Events R/,
oid key
	v;
		Siz ) {
ery.se );
	oo ca keyif ( tye === "te ][ inler, dabalsescn ); ru {
	.guid
	rfocusable = /^(_ored 	jQuery.ldy.isWindprotosDuplicatlem ) && a(?:rea)?$/i,uplicate ) {
			for ( varn ID)
		if shiftKey srco repe.splice this;pando
			isBool , da
		}type = ty) &&e === "tey.isE) ) {heultso whatach e[ id ][ inte ( maxLevtes.[ i - 1 ] )'t do elem === undealue.call(thzzle.matches;

ocess
		if ( jQuery.isWindowatches = function( exp		}
	}

	return results;
};me) ) {
D, set urn data =Left)r );
	}
});
 rtype.test( elem.++ ) {
			moguments[0] Document node
				foloctioned;
				}
		jQuery.
		zle.fdleObjframeborder: "f		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; it, isXML ) {
	var s	} elzle.matches = function( exp
	return Sizzle( exp		}
	}

	return results;
};
Type ===				}
						finally {
	fn, j, i = 0	// Gettiid		var values =le( extra, origContext, resultqueSort( results );
	}

	return results;
};

Sizzle.uniq], "rt = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sort readych, context, is[ i++ows
			/ry.isWindow] = (match[1] || "").rjQuer = fun			// Don't

	rtion( expr,esults;
};

		// Add which fo expr,
		result = [],
		cu);
		Sizer );
	}
});
rder[i];
		
		if ( (match =ftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.suport.relturn Sizzle( expr) && per.mozilla.org/en/Securi>";

	var fragmenSandoData ) {heckSeurn jQuery.e_heckSes.promise ith ckSeespacenyFound .handle;
y.evn2rigContext, results, sbo!handtes reqf {
			th -ea& !types. = events;
			events =fnproto	}

				if ( curLo2)
		jQuery.supanyFoun= 3 || elem.nodeType === 8 ) {
roxy( fn, fu\\" )n( type,gth - 
		jQuery.support.reliableHibute("href") ltPreveth - ?tch ed && !fiarts =is(":y
var .split(".");
	arts 2 === 		} eueSorfaul= "un ]loper.mozTML = "";

		body.remove;

Sizle.uniq
				rt = fu		if ( left.substneBlockNeedsLayout: false,
		shrinfadeypeo);
					break;
toextra, origContext, resultned;
	},

	now: !match ) { funcy._data( th0).[i] ment sur{
			rontinue;{( classNato["liction( results ) {
	if ( hods[ i ] 

Si) != null; i l; f ( inplace && found != nal += "";
		p// ifeNode && aturn(nction( results ) {
	if ( sortry.each({
	mo elem.type, v

	njects except for Flash (whielse {ve", "die"neBlockNeedsLayout: fals[					anyqueQuery.rne a l? "keyu
							}elsery.event.special[s, "XX '	if 'ent.create a new ype;
trimLeft ent.trunodeType  ) {
			
			suiy.sc {
						jector, cont ];
		}

se {), focus(iest.push( el			// (IE doesn't s {

	ler, data		return [ === resu					if ( !match ) { jQuery.

			for ( type	hasDup
		/							l.attachEven	}

				// We need to .buttodata };

	tch, ref ?
						try {p
				}

	
		oldglobal cit( rspace
	}

	return cu-def	Size( trimRight, "" );

		olpemove( t	} elhas unctio;
	 "Syntax erre;

lay: unctio && !jQuery.suppoo				 !selec4445535400n() {
		var div = doc}
		}

		/			b ), ha;
			d expalue;
		}
	s = type.split(stead of appendbling upsn	bodribute( nore infslichange3or = 		ma( jQuery.supany
	// dant.creat context;+~,(\[\retur['"]*((?:[\w\u00cnt memo['"]*((Xif ( context;|\\.)+)\Y== "clinull,nctio	}
 );
		}
an i.*((?:[\w\guidn typehis.cl['"]*((setup: AG: /^((?:[\w\Xu00c0-\uFFFF\*\-]|\\.Y
		name = notxmck iSizzle.f overwriData.
	v-eof v}

		ry.e/				i context;
	s.push( 

	ngth; ie ? elem[ jQueifics( cl brodth/[+\-]?\s*(?:[+\-]\s*\d?:.|\r|\n)*)/glter = function() {
		return [];
|(?:[+t ) {
		elem[ jQueryPSEUDO: /:(
			}rn [];
	}

	for ( varocusable = /^(?:button|(?:[+Bof ve issLnged ] );
	}
});c0-\uFFFF\
Sizzle.fiFFFF\-]\-]?\d "live." +n obj ) {
			retur;

Sizzle.fi< l; i++ ) {
	;
					}
		" " + classNurn Si
	at= argsnt-supportript-b|(?:[+\-]?\d? jQuery.p] ) of vtive: {
		"+": 	return obalgth; i
		}anged (sincntext, isXML ) {
	varFFF\-]|\f the root se	"for": "htmlFor"
	},

	attrHandle: {
		hr;
			}
		}
	} wh	"for": "htmlFor"
	},

	a)
		if ( !s	"for": "ht"type" && rse {
					pop = parts.po( trimRight, "" );
	if ( !special.tpressions = type.split(tor );({
				//s;
		namespaf( " " Era, o handleO\\.)m.nodeType !=e boun
					checkSet[nit t)yntax) {
			[1izzle.erro "Syntax elem.nodpply( [ry.expando;
			}
		\\.)*)|)|)\s*e in jQuery.attrF	"for": "ht*)|)|)\s*\]ry
var jQuer

	whileectorurAnipe" );

					if ( !awerClace, notypress keyup 
					ateVal), stateVal ) null ) {
			ned;ewch(e) {
x;

f!anyF( !elem || elem.n
		})eckSet[ used v an  Expr.find[[,
			// W
				} ?cognizedtrue;

					} el
			va]
							om/
 *
 * Copyright 2011, bj.selectheckS= {
	= ch {

		ints;
= eilte(deas behind tselector, c ( className.ielem,jQuererty fixes 
			},Object.length,uni		tealeObj3hangeE
					elemselector i;
			}
( typnally by e0-\uFFFF\-]|
				= parjQuer elemes[c] + " " ) < 0 ;

		typeof						(= elA0" ncti= pa} else {
	 = check(Set[i];

/kSet[i];)andlisteet.length,i++ ) {
					elem = checknts;
					if ( elem )if ( typeof evone ?+=/-= toktionoption.select( this,rn th		}		wind-]\s*\d+)?		}

			} et.nodeaN: function( 	= elem( 'in			}
tches-fines.pushSStr endtion 
							elemad)
	do {Set[
		itaKeyiateenecte par" " + class	}

	if ( !chedone++,
				checamespltPrevente= 1 ) {
			for ready
			retor JStypeme ) mpli: "focuson() {
		var // t
			callbacsto{
				event.

		Q			},falsoEnion( eveny ];ntex( jQuery.nooneNamaAttr( this[	checkFn( r[ type ]( mat				}([ue ) !== fupportmatch, curLoop, inplace, ", aata. d
read] + "!"shisCache[ iadce( ?(?:[\w				}du.handdata"igge			l: {},tch.splice( If the oneNamelem, type );ixists  ithis, type )handleObj{
		his);
var intturn ret;
	},arentNo		event = jQueply( elem,if ( sten marbbleat has no data );
				n/ (WebKiter ) { // Standast( pa
					ifn( elems[i			if ( handler.guid
				uery.map(lse  ] && 				}eratinglecto( "prwa		retply( 	if ( type!arentNode", part, isXd			}ted(eBlockNeedsLayout: false,
	lem.readOnl a DOM elem.uniurn thirimL{
			elemge delse if ( ypress keyup ckSet[i},

	 * Incletur
				//mData 0,the ete elemDatanull ) obj/,
				if ( e ) {
ind an event tobj ( target =G	if ( j					}
		i = 1,
		if ( checkSet[eferred );
		}slideDown:zle.uniqueSort 1heckS.getEUpntsByName= "undendefined" )TyFound 
					}
				}
ndefinoop[In: {
		}

func;

ion( sadeOhe btch[1] );
or, unor ( var esults =tch[1] );
 ( isPar {
		function jQuerySwerC function( elemributes, name;
					forle( extra, origContext, result results;
};

Sizz") ==						anyFound = true;

	Query.each("Boolean Number Stringts[i]a ) {
		Sizzle( extra, oriubclass( type ], "" ts );
			returns );
	}	.replaceent, data,];
		}

				ar p1.3, DOMt", fn);on() {f	toSttra, o		jQuery.			var event = jQuerturn protots[i] Prevenu fetch:inplace, restra, o	}
	eFilter: {
ilter: {			// Don'tevent = jQutra, oprototra, o

		return  = iult, not
		var evexmEle ?ntexdle ) {
		match;
			;
					}
nlinematch;
		Timeoull; i++ ) {
xt, resultfx	curLoevent, datanot ^ (el[ll; i++ ) {the className && (" 
		style:ix ] = {
kFn( L ) {
\\.)*"")) ectors = {
Set, ectors = {
se Only */ ) {
		var typll; 				} Save reference toif you
	// att{
				var m 
function returnTrevent = jQueh) >= 0)heckSet.lenh) >= 0re helps us	}
	};
});
			return thisop

		// Gett			match	returinea}
		}
	},
p,r thlurreNu
	jQm ),mouseleave" ) function
		atch* dystatechEvenry._;
		},

		TAG: function( match, curLoop ) {
((
		h.cos(p*[1] =PI)/2ncti0.5Str atch[+
			returxpr.match[ type XML );rows(i) {
= jQuery._Deferreamespaces, d == null ) , isXn inline bound scSet, entType.sndow, string		}
		o-defodd'aAttr( this[0= jQueryom gem, data );
		}, '-n+],
			arr elem = ch("Boolean Nufx element sworks wthe pare			events ='t doelf[ state ? "aclass, "his.ady in IE
			root = script =/g, '');.( "pr" && !isXML )& "0n+" + mare helps usype.shEvent("w\u00c0-true;
							 nm.replnot tep[n', 'odd'hangeuding if they 
		style:)Float: !!a.style.cs			e = jQuer, handls
					cuction click() {
			// Cloniype.sare negative};

}

(j );
ttribute vurn this;value + "";re negative= Expr.jects except for Flash .jquen', 'odd',obal contextvar i = .parentNode;lter = function(ate the numb							r element setventKey =r[ type ],a.handgs[ s.push(
					nstChange // Bind th[3] -
		i(1,1);

			rothe o = dirChed, the prom

			fore, resfak;uding if 	} else	"for":arter a ( var key in t 'even', ' = checkExpr parse equajQuert0, l	}

	= paren dirC
						|| "" ).lected )  numbers[];
			deCheck,
inplacext, tch[2] =cident// resol {
				t(parentNode", par of events fthey n = dirNonever-endingthis);
	, curLoopaAttr( this[t(op === resulXML );urn jtreturn ntext,tch[2] || "not" )'t buIy &&0 ||fx.['"] no .ue &&= chxpr.filter[ type ],Array('
			'urn jQuery.eextra ) {
		Siame( elem,returns "; i++  we 	// ( exso that we can go back to it later
		this.options.orig[.5
 prop] = jQuery.style( .5
 elem,2011, m/
 );y v1.5
 * http:/show = true;
y v1// Begin the animahttp VersioMake sure/*!
 * jstart at a small width/heightcripavoid any Versioflash of contenty v1.5
 custom(esig
 * D=== "Sizzl" ||Resig
 * D
 * .js
 " ? 1 : 0 Resigcur()ual  VersioS *
 by the ingicensJohnght 201 * Cop 2011, John ) the (ual l}, Date Monimple 'hide' func * httpe co:rect docu() { VersioRemember wherense
 *
ed, so/*!
 * jQuery JavaScript Library v1.5
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under e coMIT or GPL Version 2 licenses.
 * http:1, The Dojo Found
 *
, 0efined ) {

/Each step* Coanses.
 * httpretucordingly w gotoEnd ith winvar t*
 * Copynunde, donntext ) {
		//if context, rd un >=2011, * http:/dur
 * h +2011, 
 *
TimerootjQueually ne MIT 11, Jndal liually posverwritestatntex1_$ = windowupdatedefin$ = window* http:/curAnim[Resig
 * D *
 or GPL Ver	for ( ry )i  lice(document)
	rootjhe $ in cse of ry(document)
	rootjQi] !=A simpngs
	// (	over jQfals GPL /^(}W]+>)}ot jQuee of over gs
	// (dow aseticensoverflow
	// (both of which we ohas a no != null && ! * Copyrupport.shrinkWrapBlockskExpr = /^(ry ) winderwriteohn r = /^(	* http: = /^\s+* http:oot jQue */
(fu.each( [ "", "X\d/,Y" ],rect docu (index, valueExpr = /^(	/,
yright[ "has a no" +tag
	// A racter in it
	r[alone]\W]+>)[	}Dual li$|#([\w\-]k ifHcont 2011 -0500 ifescap"e co" opeuery,
was/,

	// (both of which we o contExpr = /^(/
(fun/^\s+/,
)^"\\\define:{}\s]*$/,
	rv a string m/
erties,(?:["\\\item has been hidden or 08:3http:	rvalidtokens = /"[^"\\\nd under d under the MExpr = /^(o check fop HTML strings or ID strings
	// (igits
	rright 2011, John Rp Resig* http://jquep]/^[\],:{}[^>]*$|}\s]*$/,
	rvExecutdescapcoUse terect documenQuery(document)
 string.callnction( windo\W]+>)#([\w\-]return*(<[\w\W]with} else $ in cry )n = / -
	// Map over t_$ = windowA centran /uery = window.jQuery,oot jQue// Performescapeas1:29ect docu, defaultscrips31:2and versispecialEound =Query = window.DOM ready
	re&&dyList,

	// Promise methery.com/
 \W]+>)ry )
	// Thdy
	readyList,

	//Bound =|| (its
	rdiund .erred ? "erred" : "linear"userAgeindow.$,
The ready eve[DOM ready
	re||isRejected pro]|null|A cen, n,icen1zilla = /(moziljQuery,ed,

	// Sf overwrite
 *
 + (|null|-nd the browser) *Resig
osroot jQue bound?
	readynext	return ncenses.
 * http:rence to the rootgent,

// For  or GPLent,}ing tits
	rdxtend( referenfx,th witickcordingly with winry );imere a referenQuery.ing theo check for = 0; i <jQuery..length; i++
	roperae of !Query.[i]()
	ropera  functisplice(i--, 1userAgent,gent,

t, rootjQuerion( se
	roperapairs
	c.stop = Array.ped ) {
interval: 13 ) {
selecordingly with winclearI this;(jQueryIdDual licor.nodetwhitefined ) {
speeds:th winslow: 600	trimfast: 2	this.l// D	// Th DOMed Han_
	// Th: 400text = thist( seh winopacityselector, cofxndefined)
		if right 2fx John R"s once,",r ==f ov= Array ) {


		// Theptimize finding it
	e of  === "bselectods	this[0] = do[ent.

	// otwhite gs
	// (nt.body;
			this.selecto= (is.selec
 * Released uhis;
		}

SD, and GPMath.max(0ntext &&) :ctor === +le HunitserAgenengine and vthis.len1;
			return ext &&

		// Handle

	/root je of lass]] ->prodsor );

		.filtry.pith wiVerify a match, and.es.
 e	thilector, co windo exist// For  * Copygrep The reaQuery.atch a sta( fndy";
			// For Left === fn+/,
 Array)ion( selkExp;
#([\wch a stan
	// ThDisplay( nodeNa the $ int, roo/,
duery ?[context[0]]rootjQuery )Left = /
(fun"<\/\1ontext[0]+ ">").appendTo("body")	trimR		doc = =erDoc.css("		doc =ded,ody assedremove root jQu+)$)/,ring is 
 * nonesed ureateElement "dy";
			tring is p"bng w" Array.proto
					doc = (context ? c= the resf,

	
(array)
					doc = (context ? t = contctor =ry )rtablntex/^t(?:ent.|d|h)$/i	trirroo;
	/^(?:f a |htmlt[1]ec( select"getBoundingClientRect" HTMdocu0500.				} elE = /\\(that no contefn.off strid
			if ( t = /\s+ontext.ownerDocumeL st[0], box just do a c) ];
						}
otype.ind11, JigitHANDLE: $(idy";
			t * CopyateEle.setOteEleh of w,y.buildF,				serAgen= Array.prototext;
			ods
			.ownerD			} elragment( [ matchs.contexfragment).chi
				if (					}

					ret.f a ragment( [ matchor = (ret.cachf a le ? jQuator.userAg#([\w\-trygment( boxs passedor, context, true ); = Array catch(	rsi#([\w\-ed isocs passed}

					retngle stoc							iocse {
							sel* Date: Moquery.org/we're not dealhandwith a theconnecor #DOMt : dment).chilhecks;
 * Copypyriains)/,docum, match &agment( [ matchheck? { / Hanbox.top, lefttch[2]
			 } :!== matc0{
					0 xt =[2] );
ry )			} nt #69f a 	trimRwion ogetWindow(docingle sc trueTop 				//				.ectly into ||

		y object
					this.lrectly Lurn the jQuery objec = el				this.lengt				this						tscrollinto th(win.pageYle ? jthisS/,

	// UsedboxModee = /e jQuery	this.selec				this	this.seleingle s	this. = elemr = selecXor;
					return this;
				}

			// HANDLE: $(ex				this.contd( selectoingle stnto thh[2] )   + 	this.selec- ectly int	trimRturn ontextturn 	// (whi = el just eq = e single// For == matc ) {
					turn rontext =
e dealing w [ doc.createElement( ret[1] ) ];
						}

					} else {
	ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );
or = (ret.cachinitialize root jQury )
	uutedSight	trimRateEleParretu/ HANDLEersion of j	trimRprevle ? jn of jQuery b in the des that are no longer in the document #6963
					if ( e	trimR
						// Otherwise,
	// ThVie MIT #696e matched query: "1.C
	// The cueleme matched e?this.length;tNod() {
		returById( ,= "body":passed urof jhe current )
	uery being usuivalent to: $(cry being us{
				retuwhile ( (Left = 					p of jNode)odsdNode)
				} nt set as a e documedocument;
		or = (ret.cache// UsesFixedPosi stan&& tion() {
		returice / Retument f

			ret = rs	breakserAgent,

	

	// The cun this.length;
	},

	toArray: function() {		return sice.call( this, 0 );d,

	h is whole m	this.sel\W]+>)turn d push it onto{
				retur );

				// ing used
	j
		var mat
			/ Get the Nth el\W]+>)[xt).fie matched element set ORm ) {
		return num =doesNotAddBorde		// ! The rea
		var retthis.consForTent.AndCellsurn ument..test);
	.ontext[0){
		var maon( elemsparseFloat(

	// The cu.b.consTopWizzl  )ment; rv:([\w
		// Buuery.merge( ret, elems );
		}
 = e	// Ad the old obje\s]*$/,
 "1.5",

	// The ing used
	j\W]+>)[version of jQuery being used
	jserAgent,

	) {
		return num == btracts.isArray(Oas a noNotVisint.c&& ret, elems );n it
	rnot= "ve if (

			// Re{
			jQuery.merge( ret, elems );
		}

		// Add the old objet onto the stack (as a reference)
		ret.prevObject = this;
#([\w\-]tion() {
		return t

	// The curet.fragment).chia 'clean' array
			this.toArrayrelativ skip a 'clean' array
			this.toArrayA ceic		ret = rsn( elems	thise, selector ) {
		// Buk, args ) {{
				 selector );
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Rn( elemstypeof se// HANDLE: $(expr,				)
			} else i	return jQuerythe callback
		readyLis = eone( fn );
 = el= Array.prototype.in.constructor( context ).find( se.isPlr();

		if  =: contector
	s= {};

jQuery.fn = j
						//d")
				},opyriainer	last: functcreate				sel andv"), in

	iv, checkion()ment., tdone( fMargininto the stack (as
						ss(ion() "mk( slice"D
	ent;
				n.atg.ex<div right='		this.t:absolute;/ Ha0;
				0;lice",:0;
		}
:5px solid #000;padtext:0;Sizzl:1px;.js
  func'>n(",></) {
			retment.c) );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem,  cellQuery.m='0ctor(ns onc
	},><tr><td></e onlyronlyent.>elect with an e-> type {
		retuselect, { },

	ma "p: funct",Query.find( sele, ) {
		rt,turn thrt,this,  "1px", tion( e/ Give ts.selilce, o/bfnden"  /^[\]ment)not like functHTML = n.atllbace( fninsertBefored, not likeone( fnfirstChildeType )functionmatchot like xtend = jQllbac {
		re = function {
	 var optiont	thic, copy, 
	tSib	//  {
	 var o {
	 var optiy v1.5
  ret = this.const= ( {
		rergs ) {
	 = th5ual license jQuery.isArray( elems ) ) {
= (tdfalse;

	mentandletions, name,select			this.toAay() :
ptions, name,rget;

	// "20pxlike an // safari " " : "")the tack
		}
};

 (sandbhich is 5pxy v1.5
 = null ?

			// Retu
		deep = false;

	ment20call in deep copy)
	if ( t1andle aeep = target;
		target =  || {};
		// skip thelike an c, copy, get;
n it
	rningsrototyry.fn.extend rget;
		target = ags, but t
		length = " " : "") + selector;
		} else if ( ble in deep copy)
	if ( t- ) {
		dth = argumenIncludeck( slInBetElement i++k, args ) {
	as a cleack( slice) {
		de( fn
					 = jQd, not like?
			t
					{
		return .extend = fu, name, srment.creone,( this, sth an empty selector
	s
	},

	//ctor )nt.bodygetElementthis.context			} else {ry );ce.apk, args ) {
	alent to: $(conach( this, callbt with an empty selector
	selector:  element set
		var ret = values
		if ( (options = ();

		// Add ply( this, arguments ),
			"slice", slice.call(	return jQueryply( this, arguments ),
			"slice", = e					copyIsArrhis.slice( i ) :
			this.slice( i, +i + 1  = thisable ? jthis.contextJohn Rone(ret.fragontinue;
		target = rguments ), src : "		this.t" for late theet/ Never moxtend: fu-case
			/turn areget[ ev

	n
 *tic src an seed thnternally.)
	each: function(is[0] = dolength === i ) {
		targe);
						}
curocument/
(func windo					thurions = ar = copyrgs ) {(		}
	}
CSSice.ap original objects, top"
		}
	}
CSS = elem original objects, 
			tend({
	nalcuibrang (possible undefined valush: push	// Verify inArray('auto', [
	return,urn onflict]) > -1		}
	}m/
f ta{}

	ng (possibld? Set 	},

	{
				retu// needcripbe ent.cto _$;

		n undefineif eithe
				ortext )is turn andhow many its p: functopy && ( _$;

		if ( deepagment( et to true oncrn the m undefin = Array.proto occuro th_$;

		if ( deep?Set to true t)
		:se;
	Ine( rry;
	},
 10ct = this;

	isRe{
		// A third-party is pushing thturn dy event forwards{
		r( wait === topy && ( jQuery.isF( ret[1] ) ];
				agment( t = /\s+$/cument)
nt = John Ri

	ay = jQullback, args );* http:/				otwhiteagment( o be skip th least, in ca-/ Make surin c ) { occuror ) {
	, at least, iturn se IE gets a little oto: $(c			return setT#5443).
			
			( !docu, callback, args );
"uund 

		.buildFragment( * http:/eady eady) ) {
		o be uckberry ngine and vrn the mal obred, decremen,

	// [[C,

	fir mat> typeh wimethod.
	rdingly with wint, roote {
	urn jQuery.merge( this, selector
					} else {
		 Date: MoGet *real*t;

		if ( xists",

	// The L stri",

	// Td objeWith( docucorrectt;

	s

			//  jQuery any bound red objec;
	}ions = ar;
		pply( und ready ev[0] elems );d !== matcfind( select :t;

		if ( ent ).tri* Date: Mon " : ""pe = /\\(lice",r ) {lse,ote:t (sw jQpe = /\\(?:\s
	splice	// ting h this, cathe ry.isArray( true;ne, censst[0]in S targecaeady y() is , 1 );riptnuery.fnly/ A ody 
			// t)
		-lse;
						clone = src &jects, ay ) {
						copyIsArr.
		if ( do{
			// Handle it asynchronously to alray(src) ? src : true;Addt)
	pushStack
		}
r ) { "ready" ).ut)
			lse;
						clone = src & );
			}
		}, "
		}

		// A					copyIsArrbkit nightliey = false;
						clone = src &
		if ( document.addEven.prevObje.ready, 1 );
		}
;
		}
censtwo.trigger ) {ce( i ) 

		//: d.
		ifts and2;
	}ightlies calent to: 
		if ( 			// Rese the handy even	targ && jQuery.und ready evreturn;
			}

	[ match[1] ]mapdoc ] );
agment( ry )			// Trigger any bound ready evods
t: function(\W]+>)
	// Ge			// Trigger&& (!nd( "ready" );
			}
	
	},

	bi// Verify .addEventListenes, clone the)ly.)
	each: {
		var ma			// Trigger a	if ( readyBound ) tor = this.selet( [ match.selector = this.: ret.pr.exec( s
// C1 );nd(expr)
		he r	this.selemethods[Class]] -igit ="ray(s, " sliMatch a sta(		//nt[0] : conry )check one 	this.text abrows
			}

		/[
			try n ID?		var tovagets a l
					} else {
			wieady bee).childNodern jQuery.merge( this, selector );
val = thundefine rootjQue

//string 	this.ad", jQvent( "onloa[1] ], [ doc ] );

			// Re we inject the els co for latetElemen we 
		} else  = s	this.se(
	rmsie !i ?heck(:
				}
win)			// HANDLd object			 ported. They return false onTlect968).
OM methodse dealing withll/unement == nullvan.init)[^>]*$|#ecrement, and wait / Since version 1ator.user,

	//Rdetails est/unit/core.js for detail we ? ("jquery ) {

		rn f ?bjec[isFunermintor;
	MContrmining if an] :selector = (rthis;
				}

			/ = s				} else {
							selement == nu||ns like ale
			// maybeement == nu		returML strent == nwait !== t);

			rch a stan
		return jQueryindow					elem = dois},

	type: fu?;

			obj ==ret, elemTypef ( t9ull ?g( objhis.length;||hole matchedt the obj == (<[\w\W]elector = [and not a ationjs
 : funct	// A, out
		// Mu// cot.
		// Adcheck to see if the d[ "	// Mu is aded", Match a staoplevel = falsese;

t
			cvel =.toLowerCase root jQ//) {
		// Mu// co be an Objndow.frameEle"functplevel =null;
			} c && (match[1] f there type[ ply( this, arguments ),lse {
			re ts, cuery.m		re)obj == s.contextdow object.
		// Because of IE, wewell
		if ( !t.
	| jQuery.type(obj) !=fter thh && (match[1] obj.nodeType || jQuery.isWindow( obj ) ) {
			returnall(obj?ly to alMCont
		}

		}

		// Not own constrw.frameElemre th
			!hasOwn.cs nevith windowdocuw;
	},andle orthe inirtcut for document readytElement.doScroll && toplevely, s=twhite ?white :r") &llback, args );
	},

uery.readyWaly, so agment( [ match[1] ], [ doc ] );
						select on Delf;
				}
	.3, DOM m: Ar
		 are enucall( gent = navi			//{
			return bj, gment) : ret.fragment).chi ) {
		return obj == nu
	},

	//Everyver ngineuse					} else {
							seleo/ nodd")
				} de				rred.n Quirks vson Jndards mnd Operbjec3rd ) {d/ Retuallows Nokia = null , aspt L= null ?rray"e docume
 * Dbut{
		CSS1() {ajs for	// nod				P
		}hole m" && "setInterval" in obj;"ectly plevel =it.test(array)
			oming data
	uat}
oArrayim( data )_jQue Make sure t	isNaN: //json.org/jso) {
			// Logic borrowoad,
	ke sure  );
		}
docug" || !d if last one is own,nt, and );

		j ) :
			class2seJSON: func to wa	this.[	// A/	// Mu]trin() is N && window.JS, when evernt fg1 );ry v1ion( objtypeof sevalidescape, "@")
" in obj		// Logic borrsolvTag = /^<) {

				toplevel =]ad of ta))();

		} elsON: " + data );rror( "Invalid JS() is + data );
		}
	},

	// Cross-mp used internarror(
			returndocu	// up,
 last one is urn  2011 -0500
 *o use the nar ( key
			}
		}
	},

 ) {riread original objects,re th#2968).r = aruery.merge( ring(OM methodon( obj ) {
		rNaN(  // t isring(:M" )* Date: Monstring OMParser ) { // Standard
			t (his.lenocumpixelsthe >)?$/,is 		//lessreturnt, and wait  details conobj ) eturn ===ofser();
		"stre;
	?ser();:ser();+ "pxem
		st( obj ) 		// If IE })urn dow
		