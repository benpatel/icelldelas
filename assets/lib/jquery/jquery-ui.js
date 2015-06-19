/*! jQuery UI - v1.11.4 - 2015-03-11
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, accordion.js, autocomplete.js, button.js, datepicker.js, dialog.js, draggable.js, droppable.js, effect.js, effect-blind.js, effect-bounce.js, effect-clip.js, effect-drop.js, effect-explode.js, effect-fade.js, effect-fold.js, effect-highlight.js, effect-puff.js, effect-pulsate.js, effect-scale.js, effect-shake.js, effect-size.js, effect-slide.js, effect-transfer.js, menu.js, progressbar.js, resizable.js, selectable.js, selectmenu.js, slider.js, sortable.js, spinner.js, tabs.js, tooltip.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};


/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

var widget = $.widget;


/*!
 * jQuery UI Mouse 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
	version: "1.11.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." + this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegate ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
				return this._mouseUp(event);

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		mouseHandled = false;
		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

var position = $.ui.position;


/*!
 * jQuery UI Accordion 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/accordion/
 */


var accordion = $.widget( "ui.accordion", {
	version: "1.11.4",
	options: {
		active: 0,
		animate: {},
		collapsible: false,
		event: "click",
		header: "> li > :first-child,> :not(li):even",
		heightStyle: "auto",
		icons: {
			activeHeader: "ui-icon-triangle-1-s",
			header: "ui-icon-triangle-1-e"
		},

		// callbacks
		activate: null,
		beforeActivate: null
	},

	hideProps: {
		borderTopWidth: "hide",
		borderBottomWidth: "hide",
		paddingTop: "hide",
		paddingBottom: "hide",
		height: "hide"
	},

	showProps: {
		borderTopWidth: "show",
		borderBottomWidth: "show",
		paddingTop: "show",
		paddingBottom: "show",
		height: "show"
	},

	_create: function() {
		var options = this.options;
		this.prevShow = this.prevHide = $();
		this.element.addClass( "ui-accordion ui-widget ui-helper-reset" )
			// ARIA
			.attr( "role", "tablist" );

		// don't allow collapsible: false and active: false / null
		if ( !options.collapsible && (options.active === false || options.active == null) ) {
			options.active = 0;
		}

		this._processPanels();
		// handle negative values
		if ( options.active < 0 ) {
			options.active += this.headers.length;
		}
		this._refresh();
	},

	_getCreateEventData: function() {
		return {
			header: this.active,
			panel: !this.active.length ? $() : this.active.next()
		};
	},

	_createIcons: function() {
		var icons = this.options.icons;
		if ( icons ) {
			$( "<span>" )
				.addClass( "ui-accordion-header-icon ui-icon " + icons.header )
				.prependTo( this.headers );
			this.active.children( ".ui-accordion-header-icon" )
				.removeClass( icons.header )
				.addClass( icons.activeHeader );
			this.headers.addClass( "ui-accordion-icons" );
		}
	},

	_destroyIcons: function() {
		this.headers
			.removeClass( "ui-accordion-icons" )
			.children( ".ui-accordion-header-icon" )
				.remove();
	},

	_destroy: function() {
		var contents;

		// clean up main element
		this.element
			.removeClass( "ui-accordion ui-widget ui-helper-reset" )
			.removeAttr( "role" );

		// clean up headers
		this.headers
			.removeClass( "ui-accordion-header ui-accordion-header-active ui-state-default " +
				"ui-corner-all ui-state-active ui-state-disabled ui-corner-top" )
			.removeAttr( "role" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "aria-selected" )
			.removeAttr( "aria-controls" )
			.removeAttr( "tabIndex" )
			.removeUniqueId();

		this._destroyIcons();

		// clean up content panels
		contents = this.headers.next()
			.removeClass( "ui-helper-reset ui-widget-content ui-corner-bottom " +
				"ui-accordion-content ui-accordion-content-active ui-state-disabled" )
			.css( "display", "" )
			.removeAttr( "role" )
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-labelledby" )
			.removeUniqueId();

		if ( this.options.heightStyle !== "content" ) {
			contents.css( "height", "" );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "event" ) {
			if ( this.options.event ) {
				this._off( this.headers, this.options.event );
			}
			this._setupEvents( value );
		}

		this._super( key, value );

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsible" && !value && this.options.active === false ) {
			this._activate( 0 );
		}

		if ( key === "icons" ) {
			this._destroyIcons();
			if ( value ) {
				this._createIcons();
			}
		}

		// #5332 - opacity doesn't cascade to positioned elements in IE
		// so we need to add the disabled class to the headers and panels
		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.headers.add( this.headers.next() )
				.toggleClass( "ui-state-disabled", !!value );
		}
	},

	_keydown: function( event ) {
		if ( event.altKey || event.ctrlKey ) {
			return;
		}

		var keyCode = $.ui.keyCode,
			length = this.headers.length,
			currentIndex = this.headers.index( event.target ),
			toFocus = false;

		switch ( event.keyCode ) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
				toFocus = this.headers[ ( currentIndex + 1 ) % length ];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.headers[ ( currentIndex - 1 + length ) % length ];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				this._eventHandler( event );
				break;
			case keyCode.HOME:
				toFocus = this.headers[ 0 ];
				break;
			case keyCode.END:
				toFocus = this.headers[ length - 1 ];
				break;
		}

		if ( toFocus ) {
			$( event.target ).attr( "tabIndex", -1 );
			$( toFocus ).attr( "tabIndex", 0 );
			toFocus.focus();
			event.preventDefault();
		}
	},

	_panelKeyDown: function( event ) {
		if ( event.keyCode === $.ui.keyCode.UP && event.ctrlKey ) {
			$( event.currentTarget ).prev().focus();
		}
	},

	refresh: function() {
		var options = this.options;
		this._processPanels();

		// was collapsed or no panel
		if ( ( options.active === false && options.collapsible === true ) || !this.headers.length ) {
			options.active = false;
			this.active = $();
		// active false only when collapsible is true
		} else if ( options.active === false ) {
			this._activate( 0 );
		// was active, but active panel is gone
		} else if ( this.active.length && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			// all remaining panel are disabled
			if ( this.headers.length === this.headers.find(".ui-state-disabled").length ) {
				options.active = false;
				this.active = $();
			// activate previous panel
			} else {
				this._activate( Math.max( 0, options.active - 1 ) );
			}
		// was active, active panel still exists
		} else {
			// make sure active index is correct
			options.active = this.headers.index( this.active );
		}

		this._destroyIcons();

		this._refresh();
	},

	_processPanels: function() {
		var prevHeaders = this.headers,
			prevPanels = this.panels;

		this.headers = this.element.find( this.options.header )
			.addClass( "ui-accordion-header ui-state-default ui-corner-all" );

		this.panels = this.headers.next()
			.addClass( "ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom" )
			.filter( ":not(.ui-accordion-content-active)" )
			.hide();

		// Avoid memory leaks (#10056)
		if ( prevPanels ) {
			this._off( prevHeaders.not( this.headers ) );
			this._off( prevPanels.not( this.panels ) );
		}
	},

	_refresh: function() {
		var maxHeight,
			options = this.options,
			heightStyle = options.heightStyle,
			parent = this.element.parent();

		this.active = this._findActive( options.active )
			.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" )
			.removeClass( "ui-corner-all" );
		this.active.next()
			.addClass( "ui-accordion-content-active" )
			.show();

		this.headers
			.attr( "role", "tab" )
			.each(function() {
				var header = $( this ),
					headerId = header.uniqueId().attr( "id" ),
					panel = header.next(),
					panelId = panel.uniqueId().attr( "id" );
				header.attr( "aria-controls", panelId );
				panel.attr( "aria-labelledby", headerId );
			})
			.next()
				.attr( "role", "tabpanel" );

		this.headers
			.not( this.active )
			.attr({
				"aria-selected": "false",
				"aria-expanded": "false",
				tabIndex: -1
			})
			.next()
				.attr({
					"aria-hidden": "true"
				})
				.hide();

		// make sure at least one header is in the tab order
		if ( !this.active.length ) {
			this.headers.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active.attr({
				"aria-selected": "true",
				"aria-expanded": "true",
				tabIndex: 0
			})
			.next()
				.attr({
					"aria-hidden": "false"
				});
		}

		this._createIcons();

		this._setupEvents( options.event );

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			});

			this.headers.each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.headers.next()
				.each(function() {
					$( this ).height( Math.max( 0, maxHeight -
						$( this ).innerHeight() + $( this ).height() ) );
				})
				.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.headers.next()
				.each(function() {
					maxHeight = Math.max( maxHeight, $( this ).css( "height", "" ).height() );
				})
				.height( maxHeight );
		}
	},

	_activate: function( index ) {
		var active = this._findActive( index )[ 0 ];

		// trying to activate the already active panel
		if ( active === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the currently active header
		active = active || this.active[ 0 ];

		this._eventHandler({
			target: active,
			currentTarget: active,
			preventDefault: $.noop
		});
	},

	_findActive: function( selector ) {
		return typeof selector === "number" ? this.headers.eq( selector ) : $();
	},

	_setupEvents: function( event ) {
		var events = {
			keydown: "_keydown"
		};
		if ( event ) {
			$.each( event.split( " " ), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			});
		}

		this._off( this.headers.add( this.headers.next() ) );
		this._on( this.headers, events );
		this._on( this.headers.next(), { keydown: "_panelKeyDown" });
		this._hoverable( this.headers );
		this._focusable( this.headers );
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			clicked = $( event.currentTarget ),
			clickedIsActive = clicked[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : clicked.next(),
			toHide = active.next(),
			eventData = {
				oldHeader: active,
				oldPanel: toHide,
				newHeader: collapsing ? $() : clicked,
				newPanel: toShow
			};

		event.preventDefault();

		if (
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.headers.index( clicked );

		// when the call to ._toggle() comes after the class changes
		// it causes a very odd bug in IE 8 (see #6720)
		this.active = clickedIsActive ? $() : clicked;
		this._toggle( eventData );

		// switch classes
		// corner classes on the previously active header stay after the animation
		active.removeClass( "ui-accordion-header-active ui-state-active" );
		if ( options.icons ) {
			active.children( ".ui-accordion-header-icon" )
				.removeClass( options.icons.activeHeader )
				.addClass( options.icons.header );
		}

		if ( !clickedIsActive ) {
			clicked
				.removeClass( "ui-corner-all" )
				.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" );
			if ( options.icons ) {
				clicked.children( ".ui-accordion-header-icon" )
					.removeClass( options.icons.header )
					.addClass( options.icons.activeHeader );
			}

			clicked
				.next()
				.addClass( "ui-accordion-content-active" );
		}
	},

	_toggle: function( data ) {
		var toShow = data.newPanel,
			toHide = this.prevShow.length ? this.prevShow : data.oldPanel;

		// handle activating a panel during the animation for another activation
		this.prevShow.add( this.prevHide ).stop( true, true );
		this.prevShow = toShow;
		this.prevHide = toHide;

		if ( this.options.animate ) {
			this._animate( toShow, toHide, data );
		} else {
			toHide.hide();
			toShow.show();
			this._toggleComplete( data );
		}

		toHide.attr({
			"aria-hidden": "true"
		});
		toHide.prev().attr({
			"aria-selected": "false",
			"aria-expanded": "false"
		});
		// if we're switching panels, remove the old header from the tab order
		// if we're opening from collapsed state, remove the previous header from the tab order
		// if we're collapsing, then keep the collapsing header in the tab order
		if ( toShow.length && toHide.length ) {
			toHide.prev().attr({
				"tabIndex": -1,
				"aria-expanded": "false"
			});
		} else if ( toShow.length ) {
			this.headers.filter(function() {
				return parseInt( $( this ).attr( "tabIndex" ), 10 ) === 0;
			})
			.attr( "tabIndex", -1 );
		}

		toShow
			.attr( "aria-hidden", "false" )
			.prev()
				.attr({
					"aria-selected": "true",
					"aria-expanded": "true",
					tabIndex: 0
				});
	},

	_animate: function( toShow, toHide, data ) {
		var total, easing, duration,
			that = this,
			adjust = 0,
			boxSizing = toShow.css( "box-sizing" ),
			down = toShow.length &&
				( !toHide.length || ( toShow.index() < toHide.index() ) ),
			animate = this.options.animate || {},
			options = down && animate.down || animate,
			complete = function() {
				that._toggleComplete( data );
			};

		if ( typeof options === "number" ) {
			duration = options;
		}
		if ( typeof options === "string" ) {
			easing = options;
		}
		// fall back from options to animation in case of partial down settings
		easing = easing || options.easing || animate.easing;
		duration = duration || options.duration || animate.duration;

		if ( !toHide.length ) {
			return toShow.animate( this.showProps, duration, easing, complete );
		}
		if ( !toShow.length ) {
			return toHide.animate( this.hideProps, duration, easing, complete );
		}

		total = toShow.show().outerHeight();
		toHide.animate( this.hideProps, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.round( now );
			}
		});
		toShow
			.hide()
			.animate( this.showProps, {
				duration: duration,
				easing: easing,
				complete: complete,
				step: function( now, fx ) {
					fx.now = Math.round( now );
					if ( fx.prop !== "height" ) {
						if ( boxSizing === "content-box" ) {
							adjust += fx.now;
						}
					} else if ( that.options.heightStyle !== "content" ) {
						fx.now = Math.round( total - toHide.outerHeight() - adjust );
						adjust = 0;
					}
				}
			});
	},

	_toggleComplete: function( data ) {
		var toHide = data.oldPanel;

		toHide
			.removeClass( "ui-accordion-content-active" )
			.prev()
				.removeClass( "ui-corner-top" )
				.addClass( "ui-corner-all" );

		// Work around for rendering bug in IE (#5421)
		if ( toHide.length ) {
			toHide.parent()[ 0 ].className = toHide.parent()[ 0 ].className;
		}
		this._trigger( "activate", null, data );
	}
});


/*!
 * jQuery UI Menu 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 */


var menu = $.widget( "ui.menu", {
	version: "1.11.4",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left-1 top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;

		// Flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mouseHandled = false;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			});

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item": function( event ) {
				var target = $( event.target );
				if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					this.select( event );

					// Only set the mouseHandled flag if the event will bubble, see #9469.
					if ( !event.isPropagationStopped() ) {
						this.mouseHandled = true;
					}

					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) && $( this.document[ 0 ].activeElement ).closest( ".ui-menu" ).length ) {

						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				// Ignore mouse events while typeahead is active, see #10458.
				// Prevents focusing the wrong item when typeahead causes a scroll while the mouse
				// is over an item in the menu
				if ( this.previousFilter ) {
					return;
				}
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.find( this.options.items ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( this._closeOnDocumentClick( event ) ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				this.mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).addBack()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-menu-icons ui-front" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.removeUniqueId()
			.removeClass( "ui-state-hover" )
			.removeAttr( "tabIndex" )
			.removeAttr( "role" )
			.removeAttr( "aria-haspopup" )
			.children().each( function() {
				var elem = $( this );
				if ( elem.data( "ui-menu-submenu-carat" ) ) {
					elem.remove();
				}
			});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		var match, prev, character, skip,
			preventDefault = true;

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			match = this._filterMenuItems( character );
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				match = this._filterMenuItems( character );
			}

			if ( match.length ) {
				this.focus( event, match );
				this.previousFilter = character;
				this.filterTimer = this._delay(function() {
					delete this.previousFilter;
				}, 1000 );
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.is( "[aria-haspopup='true']" ) ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus, items,
			that = this,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		this.element.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-front" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.parent(),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );
		items = menus.find( this.options.items );

		// Initialize menu-items containing spaces and/or dashes only as dividers
		items.not( ".ui-menu-item" ).each(function() {
			var item = $( this );
			if ( that._isDivider( item ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Don't refresh list items that are already adapted
		items.not( ".ui-menu-item, .ui-menu-divider" )
			.addClass( "ui-menu-item" )
			.uniqueId()
			.attr({
				tabIndex: -1,
				role: this._itemRole()
			});

		// Add aria-disabled attribute to any disabled menu item
		items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.element.find( ".ui-menu-icon" )
				.removeClass( this.options.icons.submenu )
				.addClass( value.submenu );
		}
		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
		}
		this._super( key, value );
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.addClass( "ui-state-focus" ).removeClass( "ui-state-active" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.outerHeight();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( ".ui-state-active" ).not( ".ui-state-focus" )
				.removeClass( "ui-state-active" );
	},

	_closeOnDocumentClick: function( event ) {
		return !$( event.target ).closest( ".ui-menu" ).length;
	},

	_isDivider: function( item ) {

		// Match hyphen, em dash, en dash
		return !/[^\-\u2014\u2013\s]/.test( item.text() );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.find( this.options.items )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.find( this.options.items )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	},

	_filterMenuItems: function(character) {
		var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
			regex = new RegExp( "^" + escapedCharacter, "i" );

		return this.activeMenu
			.find( this.options.items )

			// Only match on items, not dividers or other content (#10571)
			.filter( ".ui-menu-item" )
			.filter(function() {
				return regex.test( $.trim( $( this ).text() ) );
			});
	}
});


/*!
 * jQuery UI Autocomplete 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 */


$.widget( "ui.autocomplete", {
	version: "1.11.4",
	defaultElement: "<input>",
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	requestIndex: 0,
	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
			nodeName = this.element[ 0 ].nodeName.toLowerCase(),
			isTextarea = nodeName === "textarea",
			isInput = nodeName === "input";

		this.isMultiLine =
			// Textareas are always multi-line
			isTextarea ? true :
			// Inputs are always single-line, even if inside a contentEditable element
			// IE also treats inputs as contentEditable
			isInput ? false :
			// All other element types are determined by whether or not they're contentEditable
			this.element.prop( "isContentEditable" );

		this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						if ( !this.isMultiLine ) {
							this._value( this.term );
						}
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
						event.preventDefault();
					}
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete ui-front" )
			.appendTo( this._appendTo() )
			.menu({
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.hide()
			.menu( "instance" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				var label, item;
				// support: Firefox
				// Prevent accidental activation of menu items in Firefox (#7024 #9118)
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				}

				// Announce the value in the liveRegion
				label = ui.item.attr( "aria-label" ) || item.value;
				if ( label && $.trim( label ).length ) {
					this.liveRegion.children().hide();
					$( "<div>" ).text( label ).appendTo( this.liveRegion );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[ 0 ] !== this.document[ 0 ].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "assertive",
				"aria-relevant": "additions"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.appendTo( this.document[ 0 ].body );

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this._appendTo() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response([]);
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {

			// Search if the value has changed, or if the user retypes the same value (see #7434)
			var equalValues = this.term === this._value(),
				menuVisible = this.menu.element.is( ":visible" ),
				modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

			if ( !equalValues || ( equalValues && !menuVisible && !modifierKey ) ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var index = ++this.requestIndex;

		return $.proxy(function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
				this.element.removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[ 0 ].label && items[ 0 ].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend( {}, item, {
				label: item.label || item.value,
				value: item.value || item.label
			});
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ) );

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" ).text( item.label ).appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {

			if ( !this.isMultiLine ) {
				this._value( this.term );
			}

			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
	},
	filter: function( array, term ) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex( term ), "i" );
		return $.grep( array, function( value ) {
			return matcher.test( value.label || value.value || value );
		});
	}
});

// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.children().hide();
		$( "<div>" ).text( message ).appendTo( this.liveRegion );
	}
});

var autocomplete = $.ui.autocomplete;


/*!
 * jQuery UI Button 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 */


var lastActive,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ":ui-button" ).button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			name = name.replace( /'/g, "\\'" );
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "'][type=radio]" );
			} else {
				radios = $( "[name='" + name + "'][type=radio]", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	version: "1.11.4",
	defaultElement: "<button>",
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.prop( "disabled" );
		} else {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var that = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			activeClass = !toggleButton ? "ui-state-active" : "";

		if ( options.label === null ) {
			options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
		}

		this._hoverable( this.buttonElement );

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( activeClass );
			})
			.bind( "click" + this.eventNamespace, function( event ) {
				if ( options.disabled ) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

		// Can't use _focusable() because the element that receives focus
		// and the element that gets the ui-state-focus class are different
		this._on({
			focus: function() {
				this.buttonElement.addClass( "ui-state-focus" );
			},
			blur: function() {
				this.buttonElement.removeClass( "ui-state-focus" );
			}
		});

		if ( toggleButton ) {
			this.element.bind( "change" + t/*! jventNamespace, function() {
				that.refresh();
* Inc}, widge}

* Inif (15-03-type ===1.11eckbox" m
* Inc5-03-buttonEQuery UI - v1.1lick 2015-03-11
* http://jqueryui.com
* Inclsitioopui.cs.disabledcomplete.j		return false widgetuse.jget.js, mous else sition.js, accordionradioocomplete.js, button.js, datepicker.js, dialog.js, draggable.js, droppable.js, effect.js, effect-blind.js, effect-bounce.js, effect-clip.js, effec	$ion.js ).addClass( "ui-state-active" , widgetludes:tton.js, datepattr( "aria-pressed", "trubar.js, 
* Inclvar t-fad = udes:jQuery [ 0 ]js, resit-fadGroup( spinne)ct-bounc.notht 2015 jQuery Foumap(ueryui.com
* Inclnce.js, efect-transtton.j( "widget" ) tooltip.js	}jQuery Fouremove.js, menu.js, progressbar.Query Foue.js, selectmenu.js, slffectar.js, rest-drop.js, effeplete.js, button.js, date
* InclUI - v1.mousedown 2015-03-11
* http://jqueryui.com
* Incl.js, effect-blind.js, effect-bouncce.js, effect-clip.jsde.js, efffect-transfer.js, menu.js, progressbar.js, resi	lastAressber.jsisand otherudes:docuery UoneBrowser up" );
	}
}(function(r contributorsnullpeof define-clip.js,	// AMD.		// Browser upals
		factory( jQuery );
	}
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 *ction" && define.amd ) {

		ueryui.com/category/ui-cokeyglobals
		factory( jQuery );
	}
11
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.comsitio11
.keyCodcordio$.ui
		PAG.SPACE ||T: 37,
		PAGE_DOWN: 34,
		PAENTERery UI Core 1
 *
 * Copyright jQuery Foundation and othere.js, efom/catego// see #8559, we I -  to blur here in case the tton.j jQuery  losesxtend({
focus between BACKSPA and
			up, it would be lefteHidan "gressbars, prkeyCode: {
		BAC
 */


// $.ui migh + "on( ials
		factory( jQuery );
	}
}(function(

$.extend( $.ui, {
	version: "1.11.4",

	, sortablesition.js,tton.js, datepis("a")effect-boun	if ( excludeStaticinclubutors; Li 46,
		DOWN: 40,
: 37,
		PAGE_DOWN: 34,
		PAGE_UP:censed MIT *// TODO pass through original
			 correctly (just as 2nd argthe M doesn'nt =rk	// AMD. s.parents()s, dis, widgetins
$.fn.e widget., mouse.js, po5-03-_setOfect-( "ind.js, ",effect-blind.js, ef widgeength resetBfactor ) : s}, sortab_determine
	},Type:queryui.com
* Injs, ancestor, labelSelecuncti.js, ed, sortablsition.js,jQuery UPare[ acc=.js, aut]t && parent.n.js, accoron.js, autodrop.js, effect-explode
				if ( !this.t-fad
					this.id = "ui-id-" +t-fade );
				}
			});
		};
	})()input					this.id = "ui-id-" + ( /^une([ "jquery" ], factory i-id-" +tton.j{
				e.js, position.js, accordion.js, autoc||xplode.js, effect-fade.js, effec//ent:do ) )search against) {er the MeHidden ) {jQuery sTabIndexis disconnected from) {DOM effecurn funcors
 
		};
	parents(). cons, widgeton() {
			r-" +on() [for=' 2015-03-1lectable.js,"id")l|hi']{
			css( "position" ) = =turn func.f - v1
		mapName = xed" || sitio!	if ( excludeStaticlengthest( parent=== nodeNam== "map" ='#" + ?];
		retsiblings() :( !element.hrele( img );js, resizaame.toLowerCase() !== "map" ) lter
			return false;
		}}
		img = $( "img[usemap='#" + mapName + deName.toLowerCase() !== "map" ) {
			return false;
		}ns
$.f, effec !element.hrefer.js, menu.jhelper-hidden-accesle( r.js, sortableurn thiName ) {
		mapi men:urn thi11.4",
sitio
}
& parent.css( "position" ) ==fer.js, menu.js, progressbar.js, reslement and atton.js, datepprop, selectmenu.js, s.expr.filne([ "jquery" ], factory );
	} else Name ) {
		mas, mouse.j	uniqueId:) {
ar uuid = 0;

	e.js, etextarea|button|ob

	uniqueId: (fstroyar uuid = 0;

	 !element.hr effecxtend( $.ui, {
	st be visible
		visible( elemactory );
	} else {
xtend( $.ui, {bas" && desl|hidu.js, progressb  2015ypon( elem,	// AMDxtend( A.js, sroble( lem, match[ 3 ] );electmenu.js,

	fohtml			if ( excludeStatic) {".ui-tton.j-text")	retur)js, sortabl
		img = hasTitlecomplete.js, button.js, dateptch[ 3 ] );t	tab11.4",
 ":" ], {
	d ? $( thisar uuid = 0
			, valubbable: fuength ?updeNaexNaN = isNa widgesitiokeyordion ].ownerDcomplete.js, bu) {
().toggl" && define.amd )  ].ownerDoc!! ( isTabIndex and all of itreturn 
});

// support: jQuersitio = isNaN( tabI
	}
});

// selectors
function focusable( element, isTabInunction( element ) {
		va.js, menu.js, proositi11.4",

query" ], fac "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom match ) {
			11.4",

Back().filtere.js, attr( elemecrollParent;
	},

	uniqueId: core.jar uuid = 0;

	//Sscrol237 & #8828

		retisDnd.js, e
function visible(  ( /^,
		var && ?
function visible( ex >= 0 ) && 
	}
	return has.js, menu.j$.attr(x >= 0 ) &&ndex" ) ) );duce( elem,!=ame ) {ffect-blind.js, effect-bouength ? $( this[ 0 ].ownerDocduce( elem,.attr( elemeosition.js, accordiont-fade.js, effec
* Copyright !element.hr[0] ).eachbutors; Licensed MITsitiofect-transble( element ) {est( parent.(function( factory ) {
	ifsed MIT *
		!$( element ).parents().adfunction( s.js, selectmenu.js, slider.js, so			type = name.toLow
		$.fn[ "inner" + name ] = function( ction" && define.amd ) {

		// AMD.  Register as an anonymous module.
		deght: $.fn-drop.js, effect-explode.js, effec.js, autocomplete.j
			});
		};
	})(		return size;
		}
tory );
	} else {

( size ) {
			if ( size === undefined) {
				return orig[ "inner" + name ype = name.toLorn orig[ "outer" + name ].cction" && define.amd ) {

		// AMD. Register as an anonymous module.
		defttr( element, "tabinrent;
	},ar uuid = 0;

	sition.js, accordion ( /^un ) {
			if ( typeffect-blon() ilters.visible( ment.hrevaurn focul ?
			this.pdBack().filterHeight,
				outejs, length;
}

$.ex" ? [ "Left", "Right" ] : [n !!$.data( eniqu			tton.jTex
$( "<span></"a" )",( $.cser the M, "ma/categors ancestors mu$.attr( elem "a-b" ) )return focul ?
			this.pa-b" ) ) ppendTo(Query 1.6.1, 1.emptytabi/categor ele(( $( "<aicons, size, ffect-blemove $( "<amultipleImoveDatemove.primary &&	} elsesecondary $( "<a>" ).dn( elem,= [ltip.0;
				if else {
			||eturn removeDataadd( selector == null ?
		 eleilters.visithis );
			.pushfn.removeData = (-n.re 201( ( key ) );
	? "s" :$.fn.removeData )? "- {
		(fun"-emoveDataize;
		);
	}{
			if (n.removeData )/.exec( navigato {
			reeey )b", "a"  cjs, ='removeDatan.re	return  matn.rereturn.removeData )me |).removeD) {
			return typeof delay =
// deprecated
$			this.each(fu key )) {
					var elem = this;
	
// depreimeout(function() 
// depre		$( elem ).focus();
						if ( fn img = !/msie [\w.]+/.exec( navigator.userAgent.toxtend({
	focus:lem = this;
s-onl functlem = this;
	( "div$( this );) );
	},

	tabbable: funem );
						} tabIndex = , $.trim
			ifata(  ) {
			ght: $.fn.inneype = name.toLvigator.userAgent.toLowerCase() );start" :
tion", felement ) &&
		!$( elevigator.userAgjois[ 0 ize;

	u
 $( this $element, ) ?ttp://bset"," ], fvers,
	"1.11.4" $( "ffect-b:on( seletems:d" );
,  ( /^!this.tton.j]ned ) {
			submit this.css( "zIrent; this.css( "zIid ) {
zIndex );
			remo, a, :data(removeDat)"lement, "tabincreatvar uuid = 0;

	and all of its ancestors mu
	},
.unbind(niqueId: ini$.expr.createPseudo texta core.js, widgnt, "tabindex" ),
			isTabIndexNaN = isNaN( tabINaN || tabIndex >= 0 ) && focusable( e
	},( factory ffect-",return ( isTabIndexlParent.length ?
		return ( isTabInde
				outerHeight: $.fn.outerHeighjs, stl, size, border, c, mendiw-y"ebKi )gin ) {tlndex )		all
	},eData.calment.hre) {
a.call( this, ex ! ( $( "<aexisting| position" || positt( nodeNa": {
				t" :
			"m// Initialize newnction(his.csfied
				ndatir browsers ret( factorturn a stringRcore.j Index isignore the caIndex is not sp( factory  core.jt" :
			"mtextarea|bupecified
			lem, matributors; Licensed MIT/

(function( factory ) {
	if ( typeof deom/categorction" && define.corner-all( th	}
		on ==
				elemrigh(function( r	// other firs(function(  ) {
	$.fnif (ument.parent();
		" ) ?			elem = efunction( r					}
		}

		ret con
		// AMD. Re

// $.ui.plugin is dept() ex. Use $.widge);
			}
		}instead.
odule (function( dataName ) {
			return function( elem ) turn value;
				
				// Ignore z>
					valu elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
		 = elem.parent();
			}
		odule ].proto factory Name ) Ignore z- ".ui-disabl: jQuery 1 "a-: 34tton.j	};
	
/*!
 * jQuery UI Datepicker on( zI !insthttp://jqce.eui.com !ins !instCopy);
tance.elFounda| poudeStother contributorpush * Released under) {MIT license.e || instance.eleme.org/i++ ) {].parentNodnstanceapi..element[ 0 /dt[ 0 ].pa/for (nstadisableSext				 !al, { ].apply( i: { ex: function( zIn } urn;
		}
].apply( i_ap, tribut	};
	ueryui.cet 1.11.4
getZindex(e = eber" ?js, posi| poaN = is widgwhilee;lemturn !!i&&lease tool ) {me, img,terHeight Ignore z-t jQuect- other cNamesetctioa{
	$.wcludense
 *s ig/licd by) {
rowsera stringT-tramakeion"havior ofct-trai.com
 emenist}
acrossr widgetpush( // WebKit always e.js, s autoect-Name = elem/
 other ced
	}) * http:/=leasedabsolu other cfocus();sitioem, i;
	dionabsolutefunct null; i++ ) {relaessbar{

				// Onlfix ) && focusaby.orE
	return 0/jQun zIdget/
not specifints, elmeurn;nData = 
	retur a stringsTabIndexNot */
n( elden )of nesase(ment.hrs with"absexplicit{
	$.of 0
				if <div style="nse
 : -10;">com/ticket/8235
			catch/divg( elem$( "<a = isN= parseInteleasedabsoluata( e" ), 10se;
		}
		iisNaN {
	$.ea&&{
	$.) {0ber" ?
		e.js, etributorsf ( !$.fn.add	y Fou		for ( = elee;
		f
				outejs, e0 widroto/*ent[  0 ].parmanager
		  Un ) {single		ifap, urn = Array.p		var eve].apply( i,ctiointeract
				}apNam prototypein unmoSetx iss for (gyrigs of)
		proxieds are maintained== "abshat it canbjectniqu  ifieow sty( key )  diffe elepi.j= {},o	$.ee same page.nce.elemei.com
 nt[ 0 ].paom
* Iength curIp, m
 * htt  = 0,e curspacehat it cain uet[ i;
		bkeyE"over=effect-
	Ion( el con( "overwas a|| ta11
for pluginind.js, I( /^	}
		
	List//bu
		proxieded ) {ow" at have b,
ind.js, ( elem ) {t[ 0 ].paSh;
	fr[ ":" ][ fuTrufect-e;popup );
	};s sxisting,effectect-non( elem ) {inDialongConstructor = $[ nam	constru				= "alute] =  * hr = $[ namespace ][ n[ 0 DivIm, s) ?|| {};
	-div";
	}
ID= Arra )[ 0 et 1.11.4 divi funspace ][ namlint" ] :
		if ( !this._cment )teWidget )n
	
			rement ) marstru		varfor plugin key );
		}

		// allow key )ntiation without initi key )g for simple inheritanctrigger;
		}

		// allow.lengthntiation without initi.lengthg for simple inheritancllow i;
		}

		// allowllow intiation without initillow i};
	// extend with the d.js,ting constructor to carry.ownerD any static propertiesd.js, ecove) {g for simple inheritancuns
		tingConstructor, {
		versotype in castotype.version,
		//otype in cas cellg for simple inheritanc
	// ;
		}

		// allow
	// -daytotype.version,
		//
	// cday};
	// extend with theayOvth ) {
			this._createWdays-, pr-objetotype.version,
		// ay hobjeg for simple inheritanregiocss(.data( elAvaild( {}o make th + "-" +ned dex

language cod for plugio make t[""] = {
	Defaultroperty directly o
	})c = tata(: "Dond( eoptiisplay \w.]+
		t we' links, elerevre
	/Prevheriting from
	basePr = $ious monthpe.optionsnextre
	/Nelemeriting from
	baseProtot);
	$.each( pr
	// re
	/To in eriting from
	basePro
	// c;
	$.each( pr;
	* htt: ["Janulay,,"FebrPrototyM
	v","April ] = totyJuinhe$( "<a"JultotyAugust","September","Octourn baNoveturn baDeceturn ]eriti* httut i;
	,
		drop-excludeStforma "-" urn;
		}
		Shortproxied, slFeb, slMar, slApype[ 
			 var ly( thlpe[ puinst							}Ocion(ype[urn Dechis, arForpply = function(day
		proxS ) {ply( MveDaply( Tuespply = Wednis._superThurs._superFripply = Saturpply{
				var __super = this._super
					reShis, aMbKit  thiuperApp					realue;
				thuper = _super;
				this._superApMin _supe ] =o","T __sWeer;unctFn baSauper = Column head {},
		ucto
		rv styat 					_
	})weekHead}
"WkroxieduperApply;evar _ 
		ut initiyeat_uuid|| {Fly = : "mm/dd/yproxied
		ply = effect-b namleanDnt[ 
	})urn 0Day: 0eriti}
urn 0pe = 
			re
		,ue; =// aM
		1, ..
			isRTL:tantia alway $[ nam);
-tor i,tance
stantiationon =for );
ragga	conM
	AfterYeartart
		// don't pridget.ex ype in.optcede );
	stantiattoty;
	$t$._dt.extend(t.exSuffix: ""ions ddher cal
	baueryses artoePrototypeiame;;
	$tor.prpe th} widgith theons ha		}e optGlobal dgetFullNtoty		}76)
		proxiedcreate sepe tha	conOnctiottom"eritiwe needtype.oe ][ onpositiuper = o fiwsers retoty		}
	}undefineor "bothrom iteirn;defined tAnimn weadeIis,  argumeme +ance.elanim{
		widgets tdefined th{
		if }he ne trying so thnhurn dhis widgetpe thadgetFulnt[ : * hthe neU; i  $._dfield;
blank: actumeate are inher+/-nuturn. We'offi.jq);
				p, * htom it 			phe caskey ) e
	/roxiedPrototype[ prop ];
	fnitialput box, e.g.lement ) 		reply = ),

	endProtot...the neata( m it and redefine ),

	enImagetotype = URL	// originally used it fr, but inherit frOnl {nstructor ? (baseProt
			$,
	a( ".lon aren't DOM-rig otype.w
			ly used, buthideIfNo.extnctiype.namespace + "to 	});		if /options );
	$.eacpush( [deNa namectorlic.js,stantiatto  pare copy tget  ].p		navig{
	Asnt[ ePrototye.namespace + "." 
		pply = funcor
	enames = $/ {
/	if (om the oldgotoC
	// ype.namespace + "." +			p
		b godgetackld c = valueype intp://nsteats, el11.4 -refix
		delete existingCo;
	$cansitiype ined te" ||lystantiation( "drs;
otottor );
stingConstructor ? (baseotype
$.widget.extend = function( target ) {
	var input =t.exR.4 -: "c-10:c+10the neey,me +t.exsld cdg fromrn n
				_su are inherhat th y triggeamesp			p's, 1 ),(-nn:+nn),( key in inpu = valulynputLengedoxiedProto con(c] ) c{
		
			tr (nnnn:asOw)all oa combin{
		ways pasbov].hasOwn-ngth ) ed thrn;refixsve the list of exist	cononstrsth; urn;;
		o the old clemespa	$.e			// 
		ne objects
				if ( $.isPlain1 ];ge( name, cullNamealue ) ) {
					target[totyotype in cas			// CloWeek
				if ( $.isPlainObjecpe = $.widget.exo the old c "evebjecinput = alculate, arratextaiso8601, arhe neHow inpu/ Copy e+ a colon			$.widget.e
			if twidgeaed prodeSt	return 		rechildCoe + a colon			//
				s
			stinCutoff: "
	for (
			, 1 ), = iss <ct-tra." )espace, = valuecentuta.call( // >fullName = objectoptions )pe.widgetFullNamee ) {{
	$.n returnV				}"+rom it = valueotype+{
	vurn;in
	if ( existin}
earliesdge( namstructingCll o, child )no lim
				maxargs = widget_slicepy e arguments, 1 ),
			returnValue = this;
dur{
	om

	ritinlue,
, targ from/t weur$.widgeeforeexis
		/( existinF.com
 	$[ n
				}
		p
		}
	}an arraydCalltFullName, "m= ider, eleuments, 1stantiation wi, [1
		custom CSSimple witho(s)ll ofsuper = lse;2retur prodex = (ffect-al) the chmixin for mu.no, arendpe tha			if ( opns === "instance" ) {
					ret conedefor ) {an
				if 	return fpi.jqofurn $.er + "-" + m it 6)
		proxied can on{
		ns === "insDefzinga	} el
	$.wi.com
  $._dturnVal/api..exten
				C

	retstingC$.error( "no such method '" + options + "ace,
		wore: names 11.4 -" widget  = t
				}
				methodValue = instance[ options ].new construused os);
		childCOfjects
1he newturn targ;
			ainObjecat a timnd stringsConstruAtPos	// always u * http://nfullName,
		s				whichry ?
		ject.prototy;
	$(n returnValu0				// tepethodValue && methodValue.jquery ?tep
	$./forwar" widgssedBigethodValu2 multiple hashes to be passed on init
		rAt( 0 ) big
		base._caltFr ) totype = apName = 
	/n anodenstrucr ) { pass).tret.extend get[ ketocat(args)Prototypt wasundefin remove totor rAt( 0 ) function() {
tor );onstrainurn !:			}get_slice		if (e, a{} );



var
		// redestance ) 			// Clo
	},Panel
				if ( $.isPlainObjec basep			$extend( {}, value );
				funcSizvar 			if ( $.isPlainO	// 		// redefAt( 0 ) === "ply = 	target[ key ] = as iotype ccopy th
		}
stance._in
				/ copy the
			overfname, args );
		widgetFullata( "awe'll modify;
		
	widgetNam.eif ( !rgs );f ( inso re
	widgetName	con"widget",
	widgetE[ "en-US" 
		efix: "",
	defaultElement: "<diventwidget",
dpDiv =et 1.11.4
I - Hobje($("com/tid		if ( !elew" keywordme |			var elemnew construui-) {
lement || -
		}paceta( elem, clearfixlem.parent(all( elelem");
	rototypefix: "",nt[ 0 ].pa( !$ton !!
	zInd/* ;
		ithouaddructorve" );
iple dicnValulready
	figu
				}
		proxiedPnce.el	 for s.js, * ht: "hacolle0 ].pasuper" + t/Keep tr	$.w
			retuximumreturn targwidgIndex ][ ke(	scro7043gth )maxRows: 4niqueId:ss( "overeithoutoy ) {
	i $._dswitchwidgeo nt || tfa			r
			v_) {
nt[ 0 ].pa.expr.createPseudo ?
		$.exprcreat			position = /* ts frng c0 ) =ons hasions.charAt( 		} being rePrototype 		proxiedProt	 * @param ument = $(split(  -
	ree.ext "-" + 
				as
	});
(anonywsersplit( gth )the ?
		$.eng f remasplit( hin th
		thsetions ha
	eryui.cont :
	m
* Int 1.11.4
rgs );Rtion"get.prototype = {nt :
		|| {.fn[ "ou?
		$.exp					}
				}
Atta		re this widget isueryuance.ele( name, thin the documentargetProtopacewnerDons );			if ( !$.is			rtor( optrig"a" hin the document
				element.ownerDocument :
				// elAt( 0 ame.s widget is being rndow or doc
				el
		th_a
			tget === element ) {ns );;
		}
n" );
				node* htned nt )ned s$.expr[estroy: 
			s );.estroy: .toLowerCaseut|selecalizing= (s._destroyIndex vr remalls in 2.0
"a" "abIndexNaN !);
		idoat( $.css( eluuid += 1: jQueryh this._
	d */

elem 0;
				}= $.Wi
		elnew = $($op,
	)functionmove the st.nt :
		e,

		/o re
		}

		this.optsitialls in 2.0
 ( /^ui-t( $.css( eleLowerCa	prototype p,
	_ijque-drop.js, effect-e	// sup$.camelCase( tnctiongetFullName ) );
		this.widge				}
				}
C	whil aocume = name.split( ;
		thidgetFuleate: $.noop,
	_iunbind( this.en redm, sis );[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1")a( elescapes._getCrmeta arg= (func allows{id: idned ) {:
		//tanceassociatend
		//$( "<aname + "
		// aname + "
	returmoveClass( stingC/ alwaet.bridge( name, $( "<adraPrefix	},widg;
	},
	_;
	$be {widg

	nction:unction()deName.fined ) {lizingalue 
		thiscreat: (! ) {
( side,create:nctimenuent{
		divoptionsget: function( options, elem		var e) {
		elment );
		 i, mats.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = )name,extend( {},
			this.options,
			thi				if ( !$.iFullName his.widgetFullNamabled " +
				"ui-ss
		DOWNn red	if ("a-bme )
port: jquer
		na"a-b["widget jquer		}
	}ey = parts.shi		.unpu $.css( eletextais.focusable = )		size -= eight,
				outerWidth: $.no ); ) {
		this.widg) {
tion( modtion = options[ key ]== "globget.protoKeyDown)dragga	keymenu.ption[ partsPenu.					upption[ partsUp ) : scrollPa			});(		this.widgmixinae ) );
" arguments "Wi	this.widg//I this.js, effect-) { ( insconstructor( key, valueo sele namion"+ "'
			tructor		// redefe, tht ].pt #5665gth ) if(
				ry <1.6.3-= parseFloat( $.css( elets.leng	prototype reate();ria-disabled" )
			.reMake ? null );
ctiodild.y ] = valventData: $.no );( this.docu;
				for ns = {};
ed the
			$.dPro
			$.it frelative" childPro( this.wient,				, "tOptions( "return rele:soptions );

		re	_setould gs.length )  );
			 ) {
			y;

		turn vaut|selec				}
		tOptions( for ( key in optionsif ( {
					var e) {
		ele
		// mus		$(  201tOptions( o+ ".removeD ).jquery ) {	_setO? "			if 
		vaa exi"]key;

		fs, mouse.js, pos {
unI - vwe need tength ? opti
		if () || 0;
				ift();
			for ( key in o.length ) {
			this._setdefined theoptions );

		reed theould go throng disabecessttom" ||] = val value them)me: fupop-upCreateOptions $._despace,for d options ||this.wi ) {get.proass( this.widgetFuls._setOption	this.hoverabsers re				this.hoverable.removeClass( "ui-state-hover" ); bases, di;
				>" ).data( "aions );

		re;
			}this.opti	}

		t,
	disable: function() {it frthis.optiont();
			if ( s({ disabled: true });
	},otot") ?.js, effe"<img/>"nsfer.js, muments.length ) {] ] = cu		rn th{ src:		}

		thce.ouppressD	}
	dex =ck flag, shu }) : ) {
		va basethis.';
	}( el;
	}legateElement,
			instance = this;
retur!his._setOpti?e + ".ui-dis:

	r delegat.js,is;
 no supressDisabledChec flag, shuffle argments
		if = widgremoveClkey ] = value;

		if ( key ===bled", !

	_on: function(
		retu+ this ) ) || 0;
				" +
						" || {};
	existing&& " +
						"_ conurn ! valuons[ k0]
		}

lse {
			el	});	prototype =,
			type = ndelegateElement = this.widget();
		} else {
			element = de) {teElement = $( element );
			this.bindings = this.bindiment );
			thass( this.widg		}
ment+ name ].call( this );
 to customize the disabled handling
				// -xistingConstruffect-clip.j.js, mouse.jof key === "stppl
vardata( el='#" + };
};

$.Widgll : this.		});
		];
				}options[ kgth ions );

		ret		});"{
	!n: fuunbind( this.evjs, ) {Max,ppre
		I, i= value( arg.Widew		pro(2009, 12 -lue 20)unctiEnme ) dou, 1 )igithis.css( baseProto,
	disable: functi baseProtos ) {
		v					 baseProto.match(/[DM]/] = $.widg	return;gConeryui.coithonoop,
ase(
			 the !== "strIing" ) {
		
		niing"  i <getNasturn !!; i++censed MIT *t/941 =[i]turn !!i>pprecensed MIT *"stringrProxy.guid || n positio				handlint.match( eryui.comeryui.com allows		haeSelectioeSelecti argry <refix(return;		$( this ).hasClcopy the guid so diMM/ers ) {
	"
		}
		
		va args ) {
			if (
				// ntNamespndler
				selector = match[2];
			if ( selectoDD) {
				dels._super
		va_superApply =if ( + 20 -( key.targey(eventNameclass aisabled i <  || !etur.toggleClply = ndler
		r arg)turn !!g individual parts
				
			thnesteizingptions,
			thisdivll : thisespace )
			.r bar: ___ } }
			options = {};
divS
			ts = key.split( "./ co/ Clea
				curOption = options[ key ] = $.widget.extend( {}, thiemory le parts.length - 1; i++ ) {
		
					n: fucreat
				}
				key = parts.pop();
				if ( arength ? $ "").split(ions );ions ha "").spli),{
	 ) : scrollPaup arg disabled hanable = $( this.ion( hAunction(lay ) {
		guments.length === 1 ) {
					return curOption[ key			if lement ) ikey ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
				thisSed confrom:block;
 even
	focusable..ass(()
					rwaN ) ;
ild..toLowerCase(ve" );xy, delanstancebugs		set[ i ][ 1 
				/755trinAent[ 0 ].par		whilndefia denull : om/tndefzero he	widgetEvle: functioabsolute );
	},Ignore z-index if/* Pss( "uf this widget is b// allow infinethin the documen			par

		this */
hin the documen arg	s ) {ored prownerDodget._chi {
inputLenghin the documen			retur " + optionwnerDoi.com
 			} elns + "' for " + name + " widthe document
				element.ownion( herties
	$.reateOptions: $.noop'api.j= {},dow or document
				elemdocumenpota( tname- coord&& vearAt( 0 ) =low i'
		var eve {
		/e;
crned o{
	 *ch( / "over-his.hox/= $(n( event )s( "ui-state-y ] = ents.
				rons has(oveClaspe.wre
				element.document || element );
			thishe exis eventName ).undelega;
			),
				retur//bugs.jqu,ocustions[ key ]ble. widgetWid|| n widgetHcurre,moveollXEventPreYeturn reata( this.wi	$( ev = $a( ele widconshat it c {
		var kdisabon()
		this.element
			.unhis.eventNamespace )
			.with the exist = del		supp	if (abledC ele'ment ) {emen) {
	"'ticket/' other c:utIndex ]; top		} c0px; ) { funcpx;'elego we need to reset the t				curOption[ parts[ i ] widget$("bodyegat
					ed to reset the t = element;		this.widgetEventP( this.widgetFulled to reset the tstantia = element;y <1.6.3
{tance.ev}
				d to reset the t[0] parts.pop();
				if ( arot( eleew || this.document[0].jquery <1.6.3//bugs.jquery.com/ticke( typeocopy 		} : fun
				ume = m==ed pro( side,Name || "").split( " "  :( " " e = $( this.w event
		bjec
	}
};ent.length cuso= (cuso?, funturn !!imgcuso: [n( mif (Xeventt ) {Y] );* htuld go througfadeOut"( this.evpe = ( type eWidr the MIs, callbs, datepclienttype eturn th this.widgetions, callback ) {
		if ( typeofwidget widgetentPrefions, callback ) {
		if ( entPreLn ==||ns, callba ( o!options ?	}
		var haYOptions,
			effectName = !optionTop
				method :
				optTopo we need to ut" },ionsh= pos/ ele( exisent p/.curre below) {
	[(element, opti/ 2)ring00 +ventPrefixtypeof og" ) { === "nu5ber" ) {Yltip.js		});
	turn v._init )efinveClastoty
	// ionstingdptioehfunc	$( ev
};

$.each( { showabso"t() e,			$( thpos, "m
	_Name px")ons.deto
		
			eleme1t.deptionport: jquery <1.6.3.his.focus=		event =e = $( this.ame ] = funidere = $( thisunctioteElement,
		e existing 
};

$. the disabled h.element.trigger( evabIndexNaN $.	},UI( this.evnt[ effecent[ eable.not( elclass 
		this.element.trigger( event, data );
		return !( ions = $.widget.extend( {},Dnt ) overabl0 ].par);
it{
	trolns(),
			options );

		this._create();
		this._trigger( "create", null, toptionsame )  eventName ).undelegate( evoop,

	destroy: fme ]( oeate();ts = key.sp	type :
			t}
				key = parts.pop();) || 0;
				!.11.4
				curOption = options[ key ] = $.widget.extend( {}, t		this._destroy();
		// we can probably remove th$turn vaD
 * Copyright jQuery Foundatket/9413
			.removeData( $.camelC in options ) {
			this.);

			// If the widget 1.11.4turn value;ngth - 1; i++ ) {
		) {
	dget()
				.toggleClass( this.widgeon: "1.11.4",
BACKSPAC
		}parts[ i ] ] = curea,button,smenu.t,option",
	] || {}nce: 1,
		delay:
 * 			curOption = curOps, effect-ealls in 2.0
		// all event bindings shouName ]( o mouse = $.widget("ui.mouse", {
	versioents.les, mouse.js, positiot 1.11.4
 * http://elegates]+/.exec( nck." + this.widgetName, * http://aabled" )
			.reEneturn curOptins,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, toptionetName widget = $.widget;


/*!
 * jQuery UI Munction(

var mouse
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryuit/9413
			.removeData( $.camelCamouse ts.lengthr[ ":" ] element;
			elem( nodeNs;
	},function(gin" + this ) ) |ts,
	MoveDelegate ) { })odule unction(
				.imgons.del{opacityction
	focurso
	".fn[ "outer" + name			.bind("mousedown." + this.widgetName, function(e unbind event) {children(".don't return a refere = elementnt )han one wiextend( $.ui,  );
	}
});

		if ( mouseH, !isNname +aN(  ( !this._cix || n

		// we may havet.ex("mousemovretur<a>" ).outerrig[ prop ];		outerWidth
		return !!$.d$css( t));

		this._mo
		thisif ( type = isgetN allows,
		alse started?return:{
	v)elega( eldelete ) {lemen$( this )[ me	return curOptientClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmedif ( arguments.le);
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegalement[ me	this.document
				.unbind("mousemove." + this.widgetName, this._mouselemenlegate)
				.unbind("mouseup." + this.widget0.5e, this._mouype, evseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {tion( mod
		}

		this._mouseMoved = false;

		// we may have missed mouseup (out of window)
		(this._mouseStarted && 
	_delay:p(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName worksnt));

		this._mo[t));

		this._moturn !!
			s );typeof key === "sI}
	rse theor ) {) {ance.elcol name, cthis._mou) ] =nction( cas ) {
			options );

		this._create();
		this._trigger( "create", null, thi allowsbooleahis.fstingCons.lengtstantiationiatePrate-hovment.unuce( elemt.target).closest(this.options.cancthrough thi = $.widget.extd for disablclass 
		neventandler.guirn that._mouseMove(event);andler.guid ||					$( thnt) {
			retui]nt.which ==, existingConstrut = true;uctor, basePe.js, effect-clip},
			mousRetrien in
	_fot it ca
		heck &&startedk ) {
					callback.call( e moveClass(  "mousemove." + this.widgetName, this._mouseMoveDelegate lement.ownerDotate-hover"ouseup in thehin the " ) ws  err

ft) {
			prob Fouglass( Moved ) {optionget-disabled " +
				" to a valryandled = true; *
 * Copyright jQuery Foundatment
	c so  (er !!value )		//  "Mis
		/mouseup in the case oon( key, valu			}
		})s prevents thUt ) {o ( kfiring of mment = $( elemvent.currentT? null : cur
				if ( !$.isrigger( "crll
		// fire a mousemove event if content is placed under the cursor. See #7778
documenrPro	ement.ownerDocument :
				//up occur "ui-states ) {wnerDoc versiother documed( el1.4 -curred in an
		th-state $._ded in ahildClso "allrom itment.style ?e + "-" + narted) {
his._moull widgemenglName
	});hin the documen = isN  anyownerDocume = isNAt( 0 ) Class( ault();
(omitup chefinelNamnlement.od ) {red in anoyui.comeateEventDataffect- eventName ).undelegate( eveneDraaN = istions[ key ] lback.app),
				args
		functtype :
			this.wit of wi= key.split(setOption("overfl method, lse 2		} n !!ler(t bindings ) { function(IsLeft =oveDelegatt(event)) ?
			// http://gateElement = t(event) ( typeof 
			cctiooveDelegatouseDme, this._mousejquery <1.6.3 ( typeof ions );

		roveD)prototype			})
			.bindy <1.6.3
oveDe
		tnd("." + t_mouseMoveDelegate )
			.unbind	}
			}
		}
},

[oveD
		ctor, const		});
	}
true ||
		for mouseupase = $.W functi
				return orhis.bindings = this.bind		});
	 [ event element )( handler, dellass( "u
	_delay:
			args		return (MaMinMn(even

		remiteractive
		if t.pageX - event.pageX),
				MaOptions &unction( callback ) &&
			callback.apply( thisent;
	 instnce ) {he oldUp: func/s._mouse
	vargConstr		.applrn eveuseSdass(
*/) {
		returni" ) )provid;
				id mownEvent) {, chi&&ined ? nuleDelayMet;) {< seo sud plugin
	_mownEvent.unction(/* e) || 0;
	[ key ] = valownEvent.pageX -ame || "").split(			argslement, eventNamrrid._mousextending plugin
	_mouseStart: function(/* event */) {},._mouseDDrag: function(/* event */) {},
	_m._mouseDownEvenion(/* event */) {n(even_mouseCapture: funcdex >= 0 ) &ifined ? nu.each( [ "Width"y ] = value;
			} else {{
				if ( arguments.len key.split( "	type = name.toLowerCasdiatePropagation(ueryui.com/positiBack().filter(funcions[ key ] )Name )
			/this.widgption[ parts[ i ] ];
				( this.hoverable.not(
	}
};	function handlerProxy() {
			re: function( handler, delay ) {
		abled" )
			./urn evenmethod deEvenncti "foo.1.4 -vent));
		}

		return !this._mouseStarted;hod ] seUp(event));
	return !this._mouseS This prevents the widg: function( event!event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
			thisoption core.jt.target).closest(this.options.cancel).		this.document
			.unbind( "m

		mouseHandledight/,
	rvertical = /top|center|bottom/,
	rof*ay || curOptint
			._getCreateOptions(),
			options );
		}

		if ( event.which || event.button ) {
			this._mouseMo			}	},

	_f hancti ] ) * ( rpehoverab eventName ).undelegate( evened() )/ 100 : 1 )
	];
}

function parseCss( element, property ) {.abs,
	round = Math.round,
	rhorizandler, delay ) {
			function handlerProxy() {
			reabled" )
			.reG), 10 ) || all At( 0 ) se theame wvent) {
			ction getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
	noions has)
			.bind( "mounotype, evefor " + tione
		ate-hover allows	},

	_nit();
			mouse was out oth.max(
						}

		return !t
	retuft: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		ate-disabled" ) ) ) {
	
			width: eFrom) );t === thWidth: fuode < 9 ) &&IsLeft =useStareturn (Math.m		mouseototype[ "_"},
			mousHandle|| tme )keull : thisparts[ i sabled ===  46,
		DOWNjs, 	event = $nctiStred moqueryui.com
 *
{
			elnt
			: 37,ttp://jqueryuihht:50(event) 
	},
	_setOptle: functioPare	// we may have= "r) || 0;
	: fun
	$.expr[lement[ medelegateElement = this.widget();
lickEvent"tion( 
		$( 
		PAGm
* Inclden )9:eUpDelegate );) {
				// allow widgetnd( div );
 * http://jqu	breaka( eling cadd(ab ou {

den )13:	retarget tdget hgateElement = thits from it+ ":ndatget t.match( /an array instead widgets that+ ")
				on, options.e"mousedoselment = $( eleman array instead ame +on( 
		$( "body"d = falselass( "ui-sement.css( "ovestined mo) {
			eection",ow || wit $.effects.iv.children()[0];

		re	event =._mouseMo overri	event =indow || withdiv>" )( overflowX === "ame || "").spli :
			"moulue;
	}
	}rn $.ermethod '||
				(	event =g ) ly(
			can the ?offsetandlingn:absolu, [div>" )," ); overflowX ==pe = name.toLowon handlerProxy() {
				// allow widgetion(event) e 1.11.4
 * htargetaN ) {dex",get usingon( within )27div.remove();

		return (cachedScrollb
	getScrollInfo:d( thion( within )33div.remove();
ad parck;po			within.elemElementctrlKey{
				de		-verflowX === "auto" && wi args.length " ( typeof inElement[ 0 ] && withinElement[ .nodeTyp)pplyth < within.
	getScroptions );
	/otypeject(ge up/+ ocumow ),
			is4indow = $.isWindow( withinElement[0] ),
			isDocument = !!withinE+ement[ 0 ] && withinElement[ 0 ].nodeType === 9;
	.scrollLeft(),
			scrollTop:Element,
			isWindow: isWindow,	if ( !$.i: isDocument,glob			offset: withinEle5:d( el			isDocument  33,
		amesKeyindow || within.isDocument  = $(thinElement[0] ),overflowX === "crollbarWidth = 			width: isWindow || isDocumesWindow: isWindow, = $(ocumocum? thcomm
	+eunction(
			is6ows
			width: isWindow || isDocument ? withinElement.width() hild
			plement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinEleme
	// cterHeight()
		};hournValu

$.7ows
			width: isWindow || isDocument ? withinElement.width() ow( withinElement[0] ),
ey ] = v+1 		} 
	Dth < within.eryui.com isWindow || isDocument ? withinElement.height() : // -1e nameerHeight()
		};on =uid || handle: 37,rent.css	$.ex.altdth, targetHeight, targetOffset, basePosition, dimension			isDocument = !!withinEElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
			return {
			element: withinElement,
			isWindow: i
		withi't support .outerWidthalttScrolnfo MacWindow: isWindond( {}, optio8s );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensio-7$( options.of ),
		within = $.position.getWithinInfo( options.within ),

	getScr-1
					erHeight()
		};essenti

$.9s );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		t-rget+= $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		s+rollInfo = $.position.getS		widgetEv( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = ge.scrollLeft(),
			scrollTop: withinElement.scrollToop(),

			// support: jQuery 1.6.x
			// jQuery 1.ns.at = "left top";
	}
	targetWidset;

		ifh;
	targetHeight40s );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensio+rgetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and +t to have valid horizontal globntName, ons ha: arWidth = w1 - w2);
nction( eventthin ),

		PAGE_DOW36 the 		isDocumentemoveClputLengtis.options,
		ve vali.extend( {} array instead of boolean
	
y" ) === "hidden";
arWidth = w1 - w2);		});
	}
d( div function( 0 ] : = $en ).get()this.bind 0 ] :stopPropaarbage
			})
			idth:50px;heiF nodeentDe
ace actt( "-=== undefi
						( instance.opouseInit: le='height:100px;width:auto;ace )"vis = valueDiv = div.children()[0];

		$( "body" ( "mousemove.verflowX === "auto" && wi {} );
					"] = $.widgace )( overflowX === "povisiblCce )[ 0 ] === "center" ) {
	nts );
			ent;
	chhasOS ) {.);opti	PAG= {};
;
	}  tending ?
				}
				:[ 0 ] : ;
	} ent;
	 allows			width: isWindow || isDocumeindo(op +<n thi|| !getWid||ght" ).the nOf= ge) >t = .css( element, property ynchronisent |exisntDefaerAppr ) /function() {
[ 0 ];
	}
Uple='height:100px;width:auto;tingConstruosition.left += targetWidth;
	} else if ( options.at[Height );w: "f)andler stt.parVal( this.eve !document [ event array instea widgetEvns.at[ 1 ] === "bottom" ) {
		basePo	return mouseS0].scrollHeight ); elem.oreturn {w widgets to customizegelName )C();		mous :
			"mousedo, left:ltEf ) {ifn thi}
};hin.isDocument ? Width;
		}
		valow widgets to customizerhorizontal = /left|center|rrginTop + parseCss( thheight(),
			offset: 

var cache !event.button) {nt
		// at least lement[ m},
			mouseleave: function( event
			giv );d keys, e.hin theIftantiatet.extse();
			if ( op( "overd( divr d}, value )nt.currentTarget ).remove event if co		if ( !$.isF null : curOpti to just the arted) {
-focus" )asePlength

 ) {
			height: ess( this.widg		data = data ||ult();
		parts{
		 ) {
;
f ( ts.length ) {
// we can probably rem evenveData( $.ltEf) {
			pton.j/ildProns.my[ se this.elearget  ( /^uned ) {
		// pNsiti[0
		}
		hasOpti.at[ 0 ] === "centpDelegate );

		eight;|| else {
			element = delegateEle
		}dings = cludMIT license.
 * http://jq: 1 )
,	position.losition.leftpe = {},"WidFary 			colluctors,] = vt fr, alue,
, "scroll" );( overflowX === "aut
			 !supprDiv.offsetWidth;

	ase = $.	} else {
			elase = $.uterWidttName ]( op

		$.each( [ "functiontop( ( insthis._mouseDeof deined ) gateElement = this.widget();
	m
* Inclent );
			this.bindings = t	};

		$.each( [ "ht );
		xed" || !scrollParent.lposition.le overflowX === "auto" && wi			if ( op._mouseM;
			position.to =	position.le?	position.lhin.ele;
			[;
				for.prottarget, th(ght,
					collisio== w1 - ).unbind( "mourn !( $.isFunction( callback ) &&
			callback.app;
			position.to", "scroll" );(),
	$.data(event.else {
			element = del] === "centedth,
			collisionHeight = elemHeight + the browser doesn't supme ] = 
		}ing cthis._se this.elew: "( $.c"ame mouseup and oth/ 2;
	}

	emoveClasurrentT{};] === ithout the offsetsut" },verflowY = overindPo );
	ent;
		props ) {
				if (  ( optiouctors};
		tsOffddeduce.currentTar		});
	} round = w1 - w2);$marginLp = elementgin" + this ) ) || 0;ffset.to|suppressns.dela; (elem =tion ==sary ton.top += targ!ffset.t 0 ], ( optionsuctors,= {on =div.remove();
lementltippfset.left,
							1]arget, n.left,
					ri$.data(event.//ich void flash
	},n FiunctxntTarget ).addClt);
			})rget.unctionretu	});ffbject(ntTarget ).addClass({[ 0 ];
{
			try				r);
hover" )p: targ"gina0pxseUpDelegcrollInfo.height,
			position = $.extend}
x = opt
				rynamicreturn targname.split( ontal: r
	/w( wisent
			us] : handler 					left: tarnction( i, dir js, Octors.split(ion.top ffset.ttions && $.et,
							top: posi
		});

		if ( opti
		};[ effecrs ) {"s, pic(funcffset.to?essary tosition.top,,
							widn inheNode;tOffsuctors.on == hasOpp: targtop + btopm ) < t,
							
		// thled" ) ) ) {
	);
		}emWidth: elemWidth,
					e);
		}
			) >= t= $.data overflowX === "auto" && wibs( top 

	_on: fu.addClass( "nse
 
	
 * Copyright jQuer$ i ]
		e;+ 1getHeightgateElement = this.widget();
	= innerDivollision[ i$.effects
		};k );

		}[ );
		} ].each( [ "Wie: function( el);
		} max( abs( left ), abs( right trying"getHlue,
			$( this).css( type, osition, {[m.offset(|| right"]g: using  ?
	fit: rototype[ "_" ion(event) feedbacto customize thuldFsitiurn ! i ] ] e;
		}
 this, "marss( "u {
			return typnction( i, dir ) {
v.offseft: elem.scrollLeft() }ner) {
			h
			// d;
		tll : thision( handler, desabled === true ||
		tion = his._ = 4- elRent; !supprelement, this.wid.elemenetFullName, this );
		 {
				if (true === $.d {
	}
( typlegousenew ba
		]enter"	element: {
				g ) {
			forgPositioHTMLLeft + parshedScrollbarWight:50r );croll" ||
uto;'rigndex retuight &&numjects		return (Mamethod methodV
	},Positiool
				t > 0 &[1]verRigh < 0 ?= 17elative"ressbC pro.offsetWidth;) {
dget handle ndow || within.i a) ) || 0;
				ionWidth - uid || $.gme, existin else {
	d( divMser objehin.eleverRight;
ctionme, bled" ) {
			thit = "hori
			return;
	we may have  key-2to the interna = with3nOffset;
				// ele4")elemth("ould go throt = p> 1t ).mouseup( f]( options );	position.left = with 201t = ns.delah lef) { < 0 ?* ) {m ) e) > max( removeDataion, da(ition.left0ense.1 all tion.left +
					? "ad}
		ction"pNamack.hor.js, "]if ( overLeft > overRptions && $.eta.collions: function( options tion.left = withinOffset;
					}
				}
			// tflow", "scroll"ndefined_DOWN:rginTop: marginTop
		};

		$.eathis.widget();
		} else {
			el.scrollLeft : within.offset.left,
				outerWidth = within		hasOptionsdk ); 1 ]re set.$.widget.ex+ name + ( targetHeight
						},
		curOption[ ke
				if  ollisionhin
				if outerWid
				if 		}

	Timeout this.eleme
* Incl//as[ han	$[ n.left );
			}did ) )
	rpunction(ptio
		top: functiterWidthtop: funct	retleft );
			}
		},	if ( data.coalse;

		// we may havet.exturn 0;exte evenWithelemWi
				if disabled class as
		top: function( position, d
 * http://ap}, 0center|bottom/,
	roffs#6694off:aN ) ositioer" ) {
nstru'.widngs =  ) { elem.;


	g- outern even "overin IE	newOveSupp					IE
			ance.el<1.9 {
			rollLeft : wi
			isTabIndnction(event) allowsp = parseCsuterHeig{
		!== "nor( ible( ate-disabledof withinx >= 0 ) && overTop > 0 && overBoottom" ],
	" )
			.remjs, sent
					retureturn tyObject(.g., "foo.dle"
			sabled === true
				if ( targetW(function() p, optionverLeft <= out( type 	return rdpg" ) {
 element is initwidget	return re0 &&
				// elemarseCss( this, "mar initially o 	},se this.elem of within
 0 ) {
					position.tif ( ovethinOffset;view, options, callback ) {
		if ( typeof opti.fn.center";0
			ss, callb)!options ?()OverRighhing" ) {
			options = { effect: options };
	tom ) {
						position.top = withiTop elemen					left: bottom-=			$( this ).hasCla else if ((;
				-importtype ottomLeft,
			// too farffset.to&& top + bottomoffset.toeft + targetent.eftif (sition.top = withinOffsethin
				positi{
p += overTop;
			// {
offselemWidth = n with bo{
		
				// e) edge
			} else if (
				ottom > ontal: rnowvisibimouseDelname ];
	construoutsng cwindow hinithi -s = !$ueryubetngth	_hove eleounctio
			// too faMath_mou(
			// to, 			var withi +m;
				>			}erBott
	vnOffset =>m;
			ers ) {a ) {abs= data.within,
				wi-ithin.offs 0 ) {
				positi			posia ) {
			var wtopn = data.w{
		tom of withinOfe {
	 withinn.offset.tom of wwithin.scrollLeft,tom of wition and margi0 ) {
	lement is inuctorstion.top + overToF
	eStarted ent.currentTname;
Height - withiOffset.sabled === objewOverBottom other co) {
		this.document
			 - o
	},
	_setOptions: function( options ) {
		v
 * Reobj		coy[ 0, accordionoptionets( = "restr
		v
					} eefixpnt
			s.optionmy[ 0] = $.widg[ 0 =.elekey ] = vaoptions Se( img
		ototidth :
		}
		hasOptiem, i;
		$my[ 0 based onction( next )ffecher cwithin 
				offtopltip.jdth:50px;heig;
			thuterHeight();
thinse if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2 ] ) * ( rpeis.bindings = p -= elemHeight;
		} eey ] = v
		}

		co= -2 tPro		vi
		eif ( eft,
				myOffset ase = $ndation and ot ] ] et =ly over the tleft"}
			;
			ht jQuery Fouthe MIT license.
 * http://jqor mouseupsif ( w1 === w2 ) {
			w2
				if (ed, then nothing is i ) ) > max( abs( top ),  instance, argumen	feedback.import
				if ( n			if ( type i ] ][ dir ]( position,tidye ] = 
			offset: argetlayMet: fDEPRECATED: 	if ( BCent i1.8.x};
		}lem.offset( $em, "evnee to be overriback );
			}tion( posit

		elem.offset( $	0,
fset;
				}
			fset.left,
				unctio	});g: using } ) );
	});
};

$.ui.position = {
	fit: 
				if ( n{
		left: function( position, dahin = datandingsls.bilobalus: op,Up"e === 9; within.offset.
	// t;
	adeOis.a$();idtarg](hin = data.within,
				witffsetTop = within.isWi, props, feed!positionm
* Incl
				if ( n= within.widtse
 *
| {};
	existingConstruc					posiOverRigyOffset + atOffset +OverRig._mouseMovlemenif ( m
* Inclata.elehin.element[0].scrollHeight );
		return {elemWidth =ss( this, "marginTop" "= {: hasOverflow	overBottohod ] options.at,* http://ap					$( thf ( options	if (event.ta		if ( options.d{ -2 * datsition.top,
 abs( "
	foWidth,
	px"Query U
			delega[ effectName ]( 
			untions.dutom" ) + scif ( orig ) {
			fo
			overflowY 

var cachedScrolame ] = function(tion
	if ( collisionTidy upyOffset
	$( eve						ll : thisLeft ) < osabled === true ||
			erLeft <= 0 ) {
				
		} else if ( effidget()	// we may havecaleeDat._mouse" )
			.rem === reateOptions:fdisabled, effjQuert - withinOffsEx type C, dile='height:100px;width:ant to using callbacase = $		.unbind( "mouosition.left = roun.11.4
 * h
		$( "body" ).appenDiv = div.children()[0];
event) ) {
		s, positioion.Bottom ) {thist += myOf{
			el" keyword&&] ][ dirs._mous = eleme"#lowX = within.isWi" keyword ).join(ffset0}
			}ther contributorsalign with ri= options[ key ]osition.flip.left.a				rstidget h| abs( newOverLinstance = th under th] ][ dir ]( position,this.widget();
		} !right ) < targetWidth ) {
					feefn )  ||set[ 1top += myapply( this, arguments );
			$.ui.positi	};

		$.each( [ "left", "tfset = withinent );
			this.bindings = this.binabled" )
			.reA		verto
					// elemsub-ePosiull : this.w( withinsabled === td
				if (perionewOverBottomstarted = fidjqueryui.com
document
			.unbin) {
					position.top port fractions, then
		// cl] = $.widget.extend( {}, this.optiow( wi = $geX),
			uctors,set;
(.creatffset.Misioed, then nothing is ishStack( metype   instanundoata.collisioffsetLecreatedelay: function( handler, delay ) {
	setLeft, i,ame, cpeof optionse.opll : this.of ) {0 ],
		div h(function() {
		var iv" );

	//Create a "fake body" for testing based on method used inauto" && wihildConstrustate- 0 ||fy arguDaent ? withent.css( "oveDayithin
ementStyle.important = idget: fithin
ss( "overflowt.appendChild( refix );
	testElemestinent = body || doent.insertBefy argustinne([ "jquery" ], fac( typeof handlerprop ];
				}estElement.a: functionle.cssText = "polementParent = body || document.d: functiace,7432222px;";
ent.insertBefore( testEleme: functiFullstin option
	if?
			notify instalay ) {
		functiow( withinEouterWidth()dy ) {
		$.extend( tee( nameildC/ Thest .outerWll : thissitionnce" );
	],
		div = sitionnt.createElement( "div" );

	//Create a "fake body" for testing based on methonst[

	 ) &+ le = {
		visibilly;hem : "stin")] =n and otherlemeutors
 * Released under the MIT license.
 *	leanData 

		ffect-b[

		sition: ta( e]edback,1t,
				ovment.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

dt - withinO? "" :
/*!
 * jQueryix || nget.ext",
			left:on.to00px",
			top: "-1( options.at[ (td)
				curOption totype in case we d forsed in jQuery.support
	testElement = document.createElement(emoveData( this.wi" for testing based on
	}
	testElement.appendChild( divarget afset		ic, "ta
		beforeActivate: cument.documentElement; =r: "> 
		beforeActivate: stElement, testElementP =i > :e = $( this.ho"" :;posd (eventName || "").split ];
	}
ementStyled = falntElement;
		borderBottstinositiont, that.widgeren ) {		if ( !$.isFuning ) 76)
		proxiedPg., "foo. withinEn: "absolute",
			left:",
		heightStyleight: "hide"
	},	key = pa+ atOffset + offseteup occdingBottom: "sho (#8876)stance = $.dae,
		event: "cl[ 0 ],
		div = div>" );width:auto;'></div><00px",
			top: "-1000px"
		});
	}
	for ( i in testElementSt
			hasO, "ma		ha!.at[ 1 ] f ( !optthing eerflowY === "scroLeft,
			own -> aliadjust based on posi: "fadeI			.

	testElement.ion handlerProxy() {
			
					retur "top",
				myOffsetin.width < witelement[0].scrollWidtht < within.element[0].scrollHeight );
		return {
			width: hasOv ltEferflowY === "auto" && withinet()
			.uns.active == null) ) {
			o
		to(.11.4 - .targefi.trigger// element ent);
		}

		mouled" ) ) property ) {
	return parseInt( $.css( equery" ], factory 

		return (cachedScro
					data.targereturn {

		/ this.widge	return {ment eightplit(  function(ased on position andltEfr funcownE"bottomvar cachedScrol		data.targetHeight :seup check - mouseup occStarfunction() {
				veft += atOf (#8876)turn  atOffset[ 1 ]on handlerProxysabled === true ||
			retullName )	_mouseUdiv>" ),lative" s) );options );

		ret,

oundation and otion() {
		}_mouseSfunction() {
			his, ffullName )	_destroyIcons: function;
			unction fance, arguments );
			}
t) {
		return (Math.m
			offset: 
			hasOhod ]ame || "").i-accordion-icons
				.redth + marginLeft + pars
		irs
			. = top + targetHei,
					ptions.active.offset[ element, property ), defin	if ( optiousable.add( e]
		]extend( {}, ta
		ted thin the documenht,t(),
		offe: functrn $.eir for outerHeight[)
			,ns ) {unct
		getCreate		if ( !in?, withinsllbacror( "can

	
		thattempted /*!
 * jQ, left: 0 }
		r );lute; left: 
			})			"ui-c(r );elemcat( y < 6
	0 ] ===
		// clean up hea// Copy everyuncti: elem,
					target[ key ] === undefi* evISO  by lse dget.mouseUp( event );ion-header-active ui-stat{
et;
};
#7778
		// SupchildCownerDocturn target;
};arget ).remnique	$[ nk ) map,tive ui-stremoveAttr(lse by refe
			.removeAttr( "aria-expeturverRightjs, mouseDof handler: functi			v			}
				}inst
		returnV= Array.p
};n returnVdimerAppltor );state-ddlerProxyhidden" )eft: 10.7 + llisemoveAttr( "aria.len|| 7+ parseCss(etureturoveAttr( "ar( "disOffsethidden" )
	ace,0.prepeCom = e)
		Jan 1le !== "content" )
	},eight ); allowsa ) {floor(a ) {r) ) ((if ( -his.option) / 8640ve" = "a7 = "vmy, elem.outerWidteanDmove ) {ouseDow( th			} elswidgetFhin theDO: removemouseusing At( 0 ) 
	if ( 
$.Widg-header hin the documenremove 			this._mousexprCase()emove s				// eleed =
				(this._mou			this._mousfor " 

		his._m	}
				}the document
				eOment.owneven
t[ keclude type-state-et.bridge = fun
			.removeClc;
niquent is unctiowidget upe.widgo initializ._super( ke_superApply =
			thi[7unctabbptionctiorProxPrototype =sewOver					_n first panel
		if ( key ===
			thie" && is.options.active === false ) {
			this._activate args ) {
			s.heade[1funct!value && this.options.acdValue;is._destroyIcons();
			if ( v
		}
		thiss();
			}
		}

		// #5332 - 
		// Sup	},

	_exs ) e = $.da http://	return + scrlues
		$.eremoveAttr( widgetEv/*!
 * j ($.Widgetwidgetinit: $.noop,
		-doptionstending ||ouseDowtendingtton) {
				reInscrol( "overfls			}
		});
	dback ass.widget (event.whn ui-ico ?ers.ne.totargetitionels
+is.prevHii-stars.next() )			.unbind( "mousren( ".ui-accoft = roundccordion-	}led crderTopWVback asnOffset;et.bridge = funTemp thiClass( "u?
 * http:/y, value );
ototype" )
				

		iui.keyCode,
		ey ) {
			return;
 this.heade
			return;
		}eighte )
	eyCo
			return;
		} typeof iv.style.cetLeft < 11; %number"om/accordi
			return;
		}nctiet + oute_superApply =

		var keyCode = $.u.headers[ ( culength = this.headers.leng_superApply = = this.headersurrentIndex + 1 ) % length ];
reak;
			case keyCode.LEFT:
			melCase(			if ( value )

		var keyCode = $.u	break;
			caslength = this.headers.leng	break;
			ca;
				break;
se keyCode.SPACE:
			case keyCodER:
				this._eventHandler( event )		}
	nique= -1;
				brea.END:
				anded"= this.heaoers[ length -liwidgp,	}
destroy: f= value;p + dawhern;e caset;
	
		coName.ler ]ble.remlookAly;			if ( typed so  === "bottjs, d so case k
		if = "ve<			( ins under the		( instr( Atfocus();
	tion =tabIndment.disable		toFoc}(function( der-ic++ect-slide.js, efme = matctoFoc	overBottlayMet: fEed cla
vhildCon;
	if invalid valu-accorht <= 0 )us ).attr( "tabIndex", 0 );
	isD, -1 ) = 	$( toFoc"tabInd			colliseturn=( eventffset.@e;14funcocessPanels!e;20sTop = posiocessPanelsy"er th
		var o? 
		// was colloe;3 : 2, ev			collismin);._processPanelsye;
 !th: 1 === true : handisabledRegExp("^\\d{utor) || !th+ ",utor {
+ "}
			marginTnuif (ggleClsube )
(vent.c)id so d: handn: function( !nunPosTop + d
				return thint.currartical: botent.tent.cect-slide.js, efvent.ct+ositiOffs = event.match allowsleanData 	} elsoFocuvent.ctrlKey ) {
			$( evenstroentTarget ).prev().fo
			converctor,initde
					;
	stroy().attr( "tabInp );r
* htt, long* htt: function() {
 *s[ length -n be	case DownEvions = this.opti ?.headers.f :gth === this.
			this.v, kcensed MIT */

[ [k, v]typeof define.sor within =  (a, bcensed MIT */

-(a[1guid || $- be - 1 ) );rn position :
			"mou$ = top) {();
			// i, pai !!value )

	destroy({
[1ypeof defilue );
le is t
		}  this.
		// on.top -= elemHoffshis.h probably remr.guid || handisable inde				.addCl is gone
		is.headersthis._refr.11.4
 * http://jqueryui.cojqueryui.cfar ri
 *) {-within
	ent is init
 *	// _actsition/
 */

(f			reUnknxcluetName
		// was active, but active panel rlKey ) {margir
	i				rak;
		tr( "tabIn		toFocurget ).prev().focus();is.opLk;
		} this ) ) || 0;
							opt
		}
	
		} eers,lt();
		}
	},
his._destroythis.elemf ( this.ak;
		
		// was active, but active panel is gonekeyCode =
					posid = h.childrenler.cus();	event.preventDory leaksnly check for mak;
	) || 0;
				-helper-reset ui-widgeffset.'ption!ions = thi"'left += tarreak;
		}

om/position/
 */

 = this.headthis.bindin	$( this).css( type, 2 = div[-helper-reset ui-widget-content uden )"d" === 9;
anded"ht <= 0 )("s._mouseMocenter";
		postions.hDightStyle,
			if ("D		} e
			case k( optionselement.parent();

		this.aoightStyle,1 ];arent = thio.element.parent();

		this.amightStyle,toFocus arent = thi) > max( aparent();

		this.aM-corner-all" );
		thindActM"er: "> tions.active	break;
next()
			.addClass( "ui-accoyightStyle,Code.ENarent = thiy.next()
			.addClass( "ui-acco@ightStyle,
typeof handlerarent = thi@Position.tction() {offsetLeft < 11;

	t-all" );
	t().left;
	sunels;

	,
			pte; left: 10.7432222pparent();

		this.a! = header.uniqueId().attr(  "id" ),
	!"= "numents.icksTo197) {
		( this.el header.next(),
					panelId = panel.uniqueId().attr( "id" );
				header.attr( "aria-controls", panelId );
				panel.at'ightStyle,			thff( prevPanelstion.scroll: function() {
		var ? $.position.scrollak;
		}t = true;[ 0 ] = rhorient();

		ffset ? 	height: : function() {
		var maxHeigent);
		}

		ent.ct<lapsibl
		// os[ 1 ] ed collapsible is ton-conte		.addClass!/^\s+/.{
(eq( 0his._destrothis.el
			$/unleanD ) {
		collf) ) th; i ) {utoreq( 0ed" || !scrollParent.l		-dCode.Es,
			prevPaCode.EN ) {
			case keyCode.R		this.element
nique<r( "next()
				.
		) {
			case keyCode.RI-ateIcons();

		this._sGHT:
this._mo});
=

		switch ( 					pogina			})
			.bind("cltateetHei=== "bottoFocus 
			.unanded" ov );
	do = elem.ouon.left - dataDaysInace,get.ex;
	$- eight );		// copytStydonPosTop + d
		// make sclass as	breakeyCode ==.css- "pos		$( this
 * ReData(event.targ[0], [ event
					pl;
Saif (
		bo(teIcons()is ),
					pove )alse || optioffsetLeft < 11;ers,nique
			().attr( "id" );ers,;
	$		maxHeightia-labese.le[ i ];
ia-disabled", vaxHetotypeEe ch31/02/0gs.jqu = $( "<div saxHettr( "aria-controltaeDats to thurn;
	veAttr(ATOM: "yy-mm-drnVar ( FC 3339 (this._denelCOOKIE
	//, dd M 
		/-accISO_ by nnerHeight() -accRFC_822)
			.css		} else if50
	//
				-M-le === "aut10.fn.eightStyle === "aut1123		this.headle === "aut2f ( heightStylle === "SS		this.header+ $( thi822-accTICKmax(!		} elTIMESTAMP:rId 	} elW3CnnerHeight() + $(this._de, "tabint()
				.: (((			.		pos * 365 +function( kectiva/ 4_set index ) {
		var	}

		if  index ) {
		var 00) fun24 * 60activate( "ro"rolosLeft - offt ).at update this.es and uinvalid valuoptionsys ust ).att$.widgy ) && valuptions.acpe;

s._supe d off: ttr( 
			}e = y;
 even so we nddck on the currenttwinpugi
				eleoick on the Index ly active headereateEve oo
		this._eventHthre] : hanrget: acDick on t actith ==ve,
		DpreventDefauheadhin themick apply( ._eventHandler({
			trget: acmmive: function( selis.active[ 0 ];Mtive: funcDefault: $.noopMMrs.eq( selecto

	_findAyick === "number" ? this.heayart(Index fou		//active,
	@ - Unixent-astamp (ms
		ce 01/01/			.ahin the! - W);
s
		s (100nevent ) {
		00 ) ); *e that -)
			.f elehin the'' -
		//  quo{
				
		if ( key === "event" ) {
			idesi 1 ]options.event ) {
				this._offniqueader-active ui-sels
to;
			}
			this._setupEvents( value );
		}

		this._super( ke key === "collapsible" && !value && this.options.active === false ) {
			this._activate( 0 );
		}

		if ( key === "icons" ) {
			this._destroyIcons();
			if ( value ) {
				this._createIcons();
			}
		}

		// #5332 - opacity doesn't cascade to positioned elements in IE
		// so we need to ad.headers, this.options.event );
			}
		
		th	this._act{
			this.element),
	toggleClass( "ui-sta!, left: 0 }els: fun second arguvent ) {
		if (= this.headers[ ( currentIndex + 1 ) % length ];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.headers[ ( currentIndex - 1 + length ) % length ];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				this._eventHandler( event );
				break;
			case keyCode.HOME:
				toFocus = this.headers[ 0 ];
				break;
			case key
			$( event.target ).attr( "tabIndex", -1 );
			$( toFocus ).attr( "tabIndex", 0 );
			toFocus.focus();
			event.preventDefault();
		}
	},

	_panelKeyDown: function( event ) {
		if ( event.keyCode === $.ui.keyCode.UP && event.ctrlKey ) {
		if (nt.cur,)
		active headenstrue		via functi: click		}
	},

	refresht
				.lendex", 0 );
	n coll"utorctor, constr			tabIndex: -1tabIndition" );
 * Renued under <y after the anhen coll"0utornuion === ins
$.fn.his.active.len
			actiggle( eventData );
his._th ==dershead hearequ "remclasses on thif ( this.headers.leng
				.th === this.headers.find(".ui-sIsLeft =ons.active = false;
				th[els		re );
		}veClass this.element[ 0out
		pohods on ".panels ) );
		}		this.header			this.e
		// Avoid memory leaks (#10056)
		if ( prevPanels ) {

			this._off( prevHeai-state-disthis.headers ) );
			this._off( prevPanels.not( thisader-active ui-state
					"aria-hidden": "ui-ac+ui-helper-reset ui-widge			active.childrenpe = name.toLowns = this.options,
			heightStyle = opttions.heightStyle,
			clicked
			nt = this. = act "aria-lab, 2attr({
		
		// make su	this.active = thisvar toShow = data.ndActive( ofunction( eve )
			.active )
			.addClass( ength ? this.prevShow -active ui-svar toShow = data.newPaneoeight &&
		y, value ) {bled" )
			.cssft < 11;ivating a ;
	su
			toHide = t	case( "dissetupEvents(;
		this.prevHide 0tom .css( "disp "active" ) , 3 another activation
		this.previ-corner-allvar toShow = data.newPanem,
			toHi( "id" );his.prevShow.length ? this.prevShow rdion-contennel;

		// handle a.sho= toHide;

		r( event );
		.headers
			.attr( "ength ? this.prevShow .each(functi
			clickedabIndex: -1dlersext(),
					panelr" ].concat( his._animCode.RIGHT:
		} und0e MITpNamere opening from coll: "false"
		});
		// if we'red = header.u
			clicked
			.css( "dis "false"
		});
		// if we'retr( "aria-la, then keep the collapsinhe alrea {
		elt()
				. "false"
		});
		// if we'refalse",
					tabIndex: -1
		ition.scroll
			clicked"'t: {
	
					"aria-hidden":  "true"
				})
				.h0 ] = rhoriength ? this.prere at least one h
			clicked
				.next()
				.addClass( "ui-accoOffset = getOffsets( offs "ui-aingTop: "show",
			$( evll;
			ret "true",
	;
	if 
						( instance.op
	if ( optio{
			this.elemenft: 0 }
		}Panel: toHidegetWidthrdion-header-active ui-scus ) {
			$( event.target ).attr( "tabIndex", -1 );
			$( toFocus ).attr( "tabIndex", 0 );
			toFocus.focus();
			event.preventDefault();
		}
	},

	_panelKeyDown: function( event ) {
		if ( event.keyCode === $.ui.keyCode.UP && event.ctrde();

		// Avoid memory leaks (#10056)
		if ( prevPanels ) {
			this._off( prevHeaders.not( this.headers ) );
			this._off( prevPanels.not( this.panels ) );
		}
	},

	_refresh: = maked
				.next()
				.addClass maxHeight,
			options = this.options,
			heightStyle = options.heigerHandhow( back fyom optiond = header.u
			durat"0123456789h ) {
			ent();

		this.acti back frdion-conten_keydown: fuions ccept)

		
		margnded": "false",
				tabIndex: -1
		ition.scroll of partiath ) {
						"aria-hidden": "true"
				})
				.hide();

		// make sure at least one hea		duration = options;
		}
		if ( typeof o		div = $( "<div s( !tottr( "aria-contro
	ption;

				.ffset ? this	// corner le, {
		
					position.tophis._ element is initial
			this._mousfunction(/* evs ) {t */) {},
	s._mous& (optio

		is._mou _activate() will handl <div styrnValue =dget._catOft: "show"
	},
isionHeight = el;
		toHide.animaWidth: function(			elemWidth = elem.ooffset.to(),
			elemHei
			position.left = roun
					.apply( instance, arguments );
					if ( toFo
			} ],
					my:p = parseCss( this, "marginTop" ), toHide,.get() );		return (Mat.get() );
	},destroy: func === "conteey ) {	collisionlement
			.removeClass( ";

		i !document				}
				arginLeft eDelayMet;"aria-

	_mouseDight(.get() );{
		va !event.46,
		DOWN:now );(}
	retur?
		a;
	} = [
				beforeActivate: nullte; left: 10.7432222x;";

	offsetLeft = $( div ).offset().left;
	supportsffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	t
	},

	hidePrototalkeyC( true );
			 ) {
			BottomWidth: "hide",Class( "ui-corner( "id" );

		// Work aroun "hide"Class( "ui-corner tab order) {
			ody ? "div" : "body" );ts( offsets, width, firing of muterWidth(),posit = copee couterHeight()
							adsabled === true ||
		?
		$.expr
	$tricvent.pa
		borderTopnction( unctionerable.not( element  {
				.get() );= {teIcons();ddingTop: "show",A		toShmaywidgents" );p(eve
$( ee headersa( key in iondget ui-he jQuery Found					position.top-icons".get() );;width:auto;'ctorsNumeric( this.heade: "1.1dex", 0 );
	

	div.style.cssText , handlerProxy( true );
			+n: "1.1ng header( this ).height(.addClass( ctorstarget
	defaultElement: "<ul>",
ght = elem.ot.documentMod,
			marginLeft = parseCss( this, "marginLeft" ),
			marginTtion.top ionWidth = elemWidth + marginLeft + parsturn parseIn !event.

		if (y.org/lic,

	_crl>",
	delay: 300rollLeft :robably remid so di^c) {
				deionWidth = elemWick;position:absolu all v.style.c			collisader.next(),
					panel=== true )uniqueId().attr( "id" ptions.actbsolute; left: 10.7			collispa: { ), /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g=== true )	toFocus.i-widge.execement: ":
			"mou
 * Reevent ) {
		if (2 = div[-icons"name			vapNagle: function( dat ons.easiDosTop = posId()+.cleanData e: this.1]t( "utom;? this.prevShow w: 0
			}W;

		if ( this.options.disabled ) {
	 * 7		this.element
				.am: 0
			}M;

		if (
		ts.options.disabled ) {
		

		if ( thiin.isWindowon( ik handler
		// asem = $( this ),
					panel = he
		});
		// if we're sw back fY;

		if (is._crea from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			eryui.com-icons", !!this.element.find( ".uildren( ".ui-accordioHeight( true );
	;
header-icon" )ne( thient ].conbled", !!vat );

		a? "ui.menu", func_mouseM/ Only set= false;
		menus: "uveAttr((this._molag if the event nt.cur the( protoi-cornhe mouseHandled : "1.11.4",
					op" )led" )
			.css( "disp the MIh( protect( even		if ( t&&
		n" )ass( "ui-sty setbled", v * Re	this.mouseHandlei-menu"m/ticket/941			} elle,
		i-menu" getWours			ct.is( ":focus" ) Min}
 this.document[ 0 ].aSmoveD( this.document[ 0 ].actl;
enu" ).length Offsets( offse				maxHeight -= elem.outerHe	} else ifdth:50px;height:50p2 = divto/
		axHeight s-= eloptions&& $(p://jquenon-event ] = e item is on  col]
	late a c>"str $._dmidnitem ength obje;
		, procanuctoidth ) {turn typm since : "rnt-ac s chimpts )1AM, ) ) {watOfrent;);

		// clean up this.)height: "seturne withie need to adearTimeout(flow-y" = $.da
	};
});
xHeight -= elem.out
			.removeAttr( "ariaventData = {
				oldHearen( ".ui-accor, handler&& $( ating a && $( rget12 "ui-corner
				// + 2assName = t( this ).height( Math.max( 0,
		};
	}
	 = funct		.hide()
			.
var menu = $.widget( no insta0 ] === "righnt.ou= Data dClass( r.lengthent = body || documenturn;
			ent.insertBefore( testEl	this.select( evettp://jqueryui.com
 *
unction( Query Foundation a	if ( ted under the MI		beforeActivate: null
	},

	hideProi-menu" e );
		= data.oldPanel;

		toHide
			.removeCBottomWidth: "hide", a class wii-accordion-content-active" )
			.prev()
				ddingBottom: "hide" a class wilass( "ui-corner-f ((
				}
	uterWidthdy || documentta.erentTarg: "collapseAll",		pad {
this.previousFildion", {
	version: "1.11.4",ent( body ? "div" : "body" );lse || options.active == null) ) {
			optio) {


	(options.active === false || abled" )
			.reis._trigger( "mouse
				// is over a// as t		this.headers.addClass( "un retct( evendisable.length ) {
					ially over the top of w	easing: eemov 1),
	 outerHeight -Height -= elem.outerHeight( derTopWidth: "showOverfl		borderBottomWidth: "show",
yle[osition.t allows				}
	typeof key === "string" ) {onxxx elemWids. retundlehandecla 1 ]izontaally shis,  * visy	this.				}izonta	// ois )nsn;t( "like CajaoptionsntData: $.noy over tis.focus( event, item );
		ery 1.6..left - data.collisiouery 1.6.xrderTopWis.evpfit:event n up event /indihis.bin= elems[i]ht,
				collis
		a-elemWid]"venttatic" ) { rLeft > 0 js, elemWidt=osTop + darev{
			this.t = $( element );
			thow( withinE
-ntClick( e
			isWindow:rlKey ) rotot
	},

	_destroy: function() {
		// Destroy (s+b)menus
		this.element
			.reginT
	},

	_destroy: function() {
is.bindings = this.bindin			collit[ in
	},

	_destroy: function() {
.of ) {
s.options
				.rement: "click",
		h
	_destroy: function() {
? "" :
	-menu
				get ] )		}( {ae miss= {.removeAttr( "aria-hiddenow)
the nes inside me.js, effect-clip.js,ttr( "aria-lab
	returny" )
				.removeAttr( "aria-expanded" nce" );

	sh
			isWindow: iqueId()
				.show();

		// D

/*!
 * jms
		this.element.find( ".ui-menu-item" )
			.remoYeClass( "ui-menu-item" )
			.rmate = this
		i
					I - vremoveAttr( "aria-hidden;
	 )elemWidurn theAttr( "aria-hiddenelemWid")
				..fn[ "oata.collisionPosition.mar
	 value );et.bridge, pr document.gethow"
	},
idth ) {
			this.headers.addClass( "uon araw,		.re	}
	});		//otype,	// De, thilue ) ) , hild
					} elsk ) {);
	
					$,w.prev",
ings, arve )
			ve )
			MiLeft,
ak;
			cafalse",
			"ariaders
		thislass( ne objects		} else ect( target[ ke( "ui.menu", , 	if (ght(,is.w, amesp, ) {oveClass( element.find(
	.js, ,
			posithe eaARIAyve )m = $( tay aaemen $.uuris._ i, mt );ryui.corill( cons"Re;t ( ove )ition.top urn;s.previotype in casist" );empte-disabled" )ent ) ) tor );
				maxHeight -= elem.outekeyCode ) {
		k;
		c		this.prevHide 	break;
		;

			break;
		under th
	_dnt.oueturnValu
	_setOptions: function( options ey ) {
	e {
					$.left - data.collisionPo {
					$
			this.	});
		// remoyOffset + atOffset +	});
		// remo
			this.be garbage collectedyOffset + atOffset +be garbage collectedeyCode.LEFft > 0 && overRight <= 0 ) {
					newOverRigh		width: 0,
		.left - data.collisionPodth: 0,
		he( ".ui-s
				if ( this._closeOnDocumentClick( event ) ) {sMl = d for renisionWidth;
					} else {
						posiOverRightpseAll( tent-box" )tains( this.element[0,
			blur: fhis.?	// to avo9999, ault				if ( !// to avo
			blur: functnt ) ) {
						this.collapseAll( evencontent"wnEvent.pageX - event.pageX),
				Math.content"._mouseDownEvent.pageY - event.pageY)
	= fx.nowementParent = bo );

	-ass( shStack( meterTimer );ent.insertBe true;dback.vertica );

	< 

		th );

	nt2e" ).eactrue;--econd argument ton and o		this.el
				}}
				maxHeight -= elem.outerHeight( p = fals.mouseHandled = false) !== -1 ?( "id" )-E:
			this._a*else {
				oHide.a) !== -1 ?under the MITmatch = skipiden by e&&
				} < {},
	 ?cter pres:
				}his.docuixed" ) 				maxHeight -= elem.outerHeight( his._filtion()s.previ1)rgetto move  = elem.ouer
			terMenuIacter = prev + character;
er );

			1
				headhis._filterMenuI
		}

		toShowx;";

	offset				charadion-content-active" )se {
				charac = $.widyOffset + atOffset + = $.wid._mouseM);
				th(!FT:
			this.collapse(?
			});| this.eame || ""). = $.wid
 * Copyright first item that starts with that character
			 ===)menus
		1characterlement
			.removeClass( "u ".ui-icon}); thiserRighan
		boace,on.top-);at character
			ers ) {"<ament || this.defaultEtmenvement );
		thn thep" )
	='e.isisabled;
	='s, dis; event fle aris;
ction() {		$( e
					var elemout(f( event-circleWidga	// ight 	if  ] = va

	wpName |ction']" ) ) {
.remove</a>osTop = p(
			this.next( e

	 ) {
		if ( !this.active.is( ".ui-state-d match ) {seup." +'spopup='t}
	},

				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: fun ) {
			e/ Destro( event );
			break Destro._mouseMngth );
lterTimer = this._delay(funngth );
					delete thi/ DestroysFilter;
				}, 1000 );
			} else {
				delete this.prev+ousFilter;
			}
		}

		if ( preventDefault ) {
			e	if (far up ->fault();
		}
	},+

	_activate: function( event ) {
		if ( !this.activ	if ( ".ui-state-disabled" ) ) { nesif ( this.active.is( "[aria-haspopup='truength );
				this.expand( event );
			} else {
				this.select( eveddCla"nOffs}
		}nu-icon ui-irefresh: function() {
		var menus, items,
			that = this,
			icom = menu.parent(),cons.submenu,
			submenus = nu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup ) {
			eividers
	yOffset + atOffset +ividers
	._mouseMhis.elemxpanded": 		testElement.style[ i ] = testElementStyle ?his );
			// t[ intyle !==ontaining spalterTimer = this._delay(funt._isDivider		if ( !$.coame || "").ividers
		this.elemeelement
			.removeClass( "uenu-items c( ".ui-		},
			
			partppressDisabledCheck !={
		if ( !this.activototypons.submenons hasui	retority					setTimeui-state-disabled" ) ) {ginTif ( this.active.is(ctio outerHeightd/or dashes  we'repName  "boolean"fset = data.my[nu-divider"se kease $.ui.keyCoif ( ) {
			// position.left nu-divt( othis )[ 0 ];
		t
		}ns,
		tat are al removeion() {sed in jIney,
	},his.elemtems.fems.not( ".ui-menu-item, .ui-menu-divider" 
	// c		.addClass( "ui-menu-item" )rig.apply( thui-state-disabled" ) ) {t[ inpf ( this.active.is( "[aria-hactiont._isDividerdd aria-disabled atue" );



	at are a Add aruuid the ade();
removeC$.cleanData emRole()
			});ption: f")t( "ui.atOption: func ) {
ption: f) {		poent.find( data.my[ings, ar.left - data.collisionPo, ar._mouseM.UP:
				
				.remove();
y );
enu )
				.adMisabled, then nothing f ( key ===	}
		ik;
			case emRole()
			});egateElement
				.toggleCl[ ( curr( "ui-state-disabled", !!va
	},lemHeight,
			: func
	disable: functioers
		thiss._super {
		var matc.left - data.collisionPone objectsvent, ite character, skip.left - data.collisio character, skip	}
		if=== "content-box" ) {
							adjust +is.docsTop, second dowcons" )
		n			rmemor			r<else {
		0]tate-ler.guid ||amesped = this.averRight = collisir-top" );cobled0; ) {focus" ).remo1] if tler.guid ||  ( event.key}
				maxHeight -= elem.outerHeight( 
	_activate: functiement.css( "ove( eve	targetHe
		case ed =menu.parent(),h ) {
	ui.keyCove" );
		/ durat.keyCode.SPStyle = optio;
		}rtiafilter( ".ui-state-disableamesph ) {
		
		}se {
					f within
	{
				rolcoeader-icon" revShow0n .utem, if anynOffset;
				amesp-urn 0; inside menactivedescendant", focused.rue" );

"recated. Ut() e			this.element
tions.( ".ui-menu--1

		if ( event && event.type === "= {n" ) {
			this._close();
		} else {
			this.ti {
		va);
	ay(function() {
	ffset ? h
		if ( event && event.type === "middwidgectivedescendant"		this.element
/ ),
				eventNa
		if ( even'> = item.c	_create: tem, if any
		this.active
			.partor.prohis )[ 0 ]w: functioelement = $( elght ) ivedescenditem
	op = posi/all|ttom
			thingTop, offsItem ( "uiui.po() )  ] = v	if (:
	}ffset =oll, elementHeig);
itemHeight;
		if ( this._hasScroll() ) {e.is(
			ptio = parseFloat( outerWidth ) {nce" );})();.split( er
			if
	_activatp: function(event) {
					relem.at,olthis

	_keyd

	_keydown: ptio elschar
		widgetName: 		del( elemsnd( {},m, .ui-menu-divider" Offset '><.PAGEcroll, eleme"<trcus", even.PAGEled menuoveClms.f


		if ( !this.activ
		-col
		}emRole()
			});
		})();/ Add arthabled attriby.guid = 
	ant i
	<d", dss( "uiingToive e + a colonuniqueId()
	lse i+menu-icon" % 7* Released ight anyenu coledC0 ) utorsctiveMenu.scrol + 6lTop( >= 5erHet();

			if ( offset < end'ox: "optio		men	height: {
			popup='trueu );
	[day ( ha
		}f ( key === this.timrefresh: l + s", event, { item: item } ); offsetcrollrtive ctiv<e.PAG) {
			r			this.pre{
				var elem = $( th
	_activate: functioer = String.from "hiden( event, keepActive" )ementParen "collapseAll",
			ader-icon" ) "position: absolua ) {
			clearTimeout( 
			this.predisabled class asousPage(.not( ".ui-meFremoveC method
		this._trigger( "b - );
			}7lTop( scroll vent );this.timceil(( Firefox ;
	n if alre{
	nEleme else {
			ement, this.wid
		co			if ( thtions.er the light active bility: ht = col>event );y(function() {:			this._his._opena-hidIffullName =
					t				th,igor (ement, this.widithinOffset,
		// Only update athis.ti inside 	case $.uus is managed elsewhere
		if ( this.options.role ) {
			1evenusPage(r( "aria-a	} elsRe if ( offindocus"d({ui-meHeight > 		whil			}
			} e// Ient menu item, if any);
			item	e.PAGr( ititem.outerHes,
	tdt();

			if ( offset < 0 ) {
	height: emRole()
			});/ Copy every")(	case $.u( scrollds over to 			} else if ( offset + itemHeight > s( ".ui-menu" ) )bmen				header.a		collisionth,
					 itemuring navigers
		thishin.element[0].scrollHeight );
		return {	case $.u.prot[ ( ins: "widgetblur: s.nextPag }, fcase $.u( ".ui-menu-se.igger( "blur", ev1,.extend( {}
		/vent
			is._	this._scrollIntoles u!( this.timeh;y( this,anelt to the l this.actiacter preles uction(/*  no valid submatch.nd other co", "true"r( "ar	.show()ent ? "" :
mHeight );
			}
		}
	},

function( event, fromFox: "optiousinggh item cordion-tMenu.lengtarget ).clo.element;
			}argetn" )
is._close( currentMenutive === f) ) {
				tMenu.length currentMenu th ) {Open ( event.keyoses the cu

	_startOpening: function( suber the ton
	$.exles uoveCs{
enu.js|| ttMenu.lengtem );

oses the currenments, closes the cucat(us BELOW
	_close: functtly active menu - if n {
				de		if ( type, eveholderhis );
 currme focuw",em );

	 + name + "etEventPrs.actireturn
					position.les._close( currentMenustance = $.earch for meevent && even

) {
		elotype in case we n i, match ) {ion: prot remove e( currentMenuevent && even	clearTimeoutblur( event )sest(m ) {
		var nbmenu

			.ui-menu" ) )f ( h( currentMenurn $.er$.datui-state-acments, closes the currenase $.ui.keoses the cu)
			.end() widgets that-hidden", "true" )
				.attr( "aria-expandments, closes the current[ in
	_isDivider:	this._createWi			pr
		/		itemutor( currentMenutor );(mouseamespacundefined 	((!arget ).clo				thiselement.find )
	menu" ) )2]ider:
			clearTim-menu-item" up events'his.b&#39;pName |entMenu;
		 " prior taria-expanded", "false" )entCliabled" ) ) {? "" :
function() {
		ret
		}
		='true']urrentMenu = all ?  elemdisabled"wItem = this.active tab order {
{
		if tsOffame, "ui-state-active" );
	},

	_closeOnDocum&#xa0;llap

		// renstru,

	// With no arged", "false" )		this.expand( eaddClass( "ui
		}
urrentMenu ia-labell) {
		t,
			that = thiaddClass( "uirentMenu.lengtturn !/[^\-\u2014\u2013\s]/.test( item.text() )s, prourrentMenentMenu;arget ).closest( ".ui-menu" ).length;
	},

	_isDivider:u.js, progressbar-hidden", "true" )
				.attr( "aria-expandur( event );
			) ) {
			this.bl

	previouddex isuish) || 0;
	},

	// With no ar"' href='#ot hide activedescendant changeze meosition( pidth()g fromguments, 1 ),	height: e activede	},
e activedescendant chaosition = f: this.active
		}, this.options.positi )
			.p $( event.target )
		}

		tnywaytive.re {
			return;.element keyCode ==ter = prev + c> 1m" )
			.a );

			
				"tab
	_activkeyCode === $.ui.km: item } );/( "ui-</ts, 1true" );this._delay(fe ];
	}ntMenu.lengthisionWidth;ted" )cendatendi._close();tems.filter( ".ui-state-disablerow-
	ghis.uuid 

	prffset );
		-activ+=) ) ) {ement, eventNasTop,+=

	typeahead isext || !nu-divider"
		// Worn
	$.expr[ ":" ] when typeahn, data )ata.collisionPosition.mar
		tw",niquetor.prmenu-submenu-caractiveMenu[0], "
var menu = $.widop" ) ) || 0;
			offset = item.offset().temoveData.offset().top - borderTop - pad== "ft = round(Min		prev =Max
			of "> li > := {
	charact focusedcharacget.exen Remove ui-s;

	retspaces and/or dashes 

	retlterTimer widget_slase = this.active.offset() licen( ".ui-statrefix: existin.left - data.collisionPorefix: existinde.DOWN:cused =filter( ".ui-state-disabledex ='>eight &&astItHcused = thissOptions =		ba $.noop,

within// depres( offs

	ret			this.elemen
			} any
					var elemwe may have miss
		}	break;
[
		var  ( !this.act{
				$( this ).rem
		}
		 reset to the la		args ".ui-menu " )e {
	_activ = element this.i._proce the mai) !== -1 ?
				this item, base, height; this.activeMenuandle ();

			if ( offs )
	
		}
	},

	expaer thfunction() {
	thisocus", eveClass.focus(ant ifocus(<	matp;
	dren( ".ui-accor,

	previo||p;
		>=ion( event );
	sust( "ht();	if ( !his.activ<lKeyxtAll( ".ui-menu

		if ( this.activeMen === 1 elsis;
ent focnction	height: (
		thtem, bavent );
sition: 
	expaeFocus ) {( !fromFoc			[ !this.acti
			[focus ( !thiffect-f ( this.active ) )
		 this.activeMen/is.isF ]() );dation and ot) {
				item = $gth ) {ext || ! this.activ
		} else {
	( ) {
			ba		} 			this.avider&& newItem and righ		hasOptionsotype.widge, item );
-disabl );
			} i ];
	}
ionPosTop, );
		/;
		} else {
			thisement.outerHeeight() <enu.find( this.options.itemst.exer );{ item:  : "last" ]() );		return toShow.ment: elem,r; inputIndex < inputLeng);
		t = ma;
	},

	focus
		key,").split(":position )
			ret.attr({
					"aria-hidden": "favent
		}
		( this.heademouseStarted;dled = Code.EN( "ui-ad so dicwidge.*) {ive || $( evleanData 			options.a469.= $(sableast one h_filterMenuItes: function(		this.co) {
		var esca= character.repl\\$&" ),
			regex		panel = h"<div styprotot.exch( siderigge:,

				// - inside ader.nex	this._triggeturn );ction, fis._hasSthis.timeax true )ems )

			// Onl1ptions			panel = 

	_ter presse dividers or oton( event ) {
		varm" )u
			.find(items, notis.active
			.filin(s._hasSc {
			this.next( evem" )s._hasSblur", evee item at this ( this.isFirstItem() ) {
			re this
		}
	},

	expastinroll() ) {
			base = this.acctive.;,
<=Query UIder thler.guid || hlete 1.11.4
 * htt().top - base + he === "s;
			});
		})
		ve || $( t, item );
		} else {
			this.focus( event,queryui.s.options.items ).first()uery.org/license
 *_hasScroll: f mouseenter befn( position, data ) {uery.org/license
				overBot: active,
		4
 * h( !this.active.has( ", {
eractive
			ifrn this.element.outerHeight() <t.prop( "scrollHeight" );
	},

	select: function( eve height 
			length || !this.actie ];
	conten
				}lly overor.pr this.options.items )[ filter ]()
		body = document.getElementsByTagName( "body": "body"					position.top += over.createElement( "dCode.ENlementParent.iors
 * ReleasYubble, seeight: this.element.sif ( character ors
 * Released un we use the suppreu after clickin;

		// Don't 
				var elem = $( this ),
			gth;le = {
		viDlready
		// handled thctive
		}s from siblings of the newlyxHeight -= elem.outerHeight( true );
	;

", "scroll" );on( data ) {
		var toHide = data.oldPanel;

		toHide
			.removeClass( "ui-accordion-content-active" )
			.prev()
				.removeClass( "ui-corner-frs
 * Released {
vents,
		//( this.eventNamalready an active item, keep t, that.widget[ han' for " + {
		//nytion
		r b) ) ull : thisjqueryui.com
var menu = $.widgetm.remove();= String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer		if ( targwe found no// soacter pressed
			// 
	}
};IsLeft =s.active ) 		if ( tclose allssed.active
					} else if},
			mousNnerHTurn evente curreion = $.ui.posnnerHTML = "		this.headers.addClass( "uet insta "top",
				myOffset instance" );ould go throement[ i
			optioent[ ihin.element[0].scrollHeight );
		return {
		if ( " ),
			hasOverflh: "hide",
		bordide.a: hasOverfloabled" )
			.reDtabIndex" )ass( "ui-he.jquery ?
	em ) {
			<= 0 ) {
					this.headers.addClass( "u
			if ( this.activ
			break= 0 ) {
			s._super( "mouseuft > 0 && .at[ 1 ] [1, 1: fus.widgetNsuppressInptionStopped()e;sKeyPress		retut > 0 &ddingTop: "show",
		this._on( = value;ata( el// so- edeNameno;
	
		/pon);
is.rgth e was out oent.pageX)					position.topm.eachu 1.11.4
 * http:// jQuery Foundation and other contribde;
yui. * Releassolute;width:50px;hei
			._on( this.elemelemeent) 

		focus}
});

menu.attr(/*!
 * jQ for & in ke 1.11.4
 * h3trinepeat flag to avoid handling keypress
		// even32ions.a: 10.743222true;
					this._moeAttr( "r				target[ kese theo che);
					break;sed a .5 pixelkeyCode.PAGE_DOWN:
					suppressKeytate-disabled" ).lengt1				bre
			})ppressKeyPress = fals.mousw null posdget.eaze nes cons"eight >isLastItdow ? wg., "foo.ault();
		}					position.top += overcuistinus
.focus( eventt.prop( "readOnly" ) ) {<= 0 ) {
					newOverRigh// so we use flag to avoid handling keypres
					
		caseo determiuctors,<Scrol we use tm" ) :
				match;

			
			dback.verticaressKeyPre				}
				}active &&s.active = null;


		this.prevHide = toHide;

nEvent.targe.4
 * http://een removed, blu
	}
};._mouseUpDelegate =

		s.options.eveation
			this?._mouseUpDn removare always multi-line
			isText"left ).l dividersRemove ui-sarea ? true :
			// Inputs are always single-line, even if inside a contentEditable element
		m	previous( boxSizingm	if ( !th( boxSizing
		if ( !this.active.has( ".ui-men	// point, // On		})
			if ( !thde",
su" ).length ) {
				mouseleave: "ceAll( event, true );
		}
sers have leanData 	if ( !thntains( this.eldefault beh					break;
				d1fault:
					sitiok;
				def[\-\[\]{}()*+?.,\\;
				retu	previo
	stElementParent. "<input>",ch timeout sho1ld be triggered before the inpu	if ( ! is changed
					this._searction() {IsLeft =(!area ? t		// Onoses the cue.prevAll( ".uactive ?{
			$(! are dets ) {
					suppr
				item = $false;
					if ( 
			thisfrom the tab ordere.prevtiveItem				if ( !t
						event.preventDefaul
						paddingTop: "show",Pods, t
				});
	{
		ions.charAt( ply = func/lean
	}
});
dth + marginis.focus( event, item );
	 this.headers.inded, then nothing is bridge = funvent, item his.headers.index( event.target ),
	Focus = false;

		switch ( racter.r ) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
	pedCha( this.option{et.bridge = functth,
			currentIndex  options.acti this.eld" ) {
			this.el
	},ve )
			keyEvent( "previous", event
			skipargs ) {
					isabled", value );
		}
		this. ) {
			thext", event );
					break;"( typeof key === "s
		if;
				case kent iseight - withinO clicked.next(),
	.split( "e ) {
if ( t{
				// Ignoe[ i ];
	}


	hidePro		clearTimeout( {
			this.mWidth: "hide",h: "hide",
		borcus: function() {ent.insertBefore( testEl
// support: jQ[ event ].tem event.isPrtabInde
				.to
				if ( !$.contains( this.element[0], this.ds
		// events wheBlur ) {
					delete this.cancelBlur;
		t[0].activeElement ) ) {
						this.collapseAll( event );?
		$.exprame || ""). fx ) {
					fx.now = Math.r	this.element
			.removeClass( "ui-acc	return;
		/rentNodB
	han within
				reollisionPve" );
			i/ in vievenwider tsurOptiI - removely octhisy ] ===

		lifis.acentHeigh = ele
		efor ( llName 1.11.4
 * http://ive.n
ithinOffset - colvent )l" );
		});ts );this._mir w//jq	$.widgde.ESCtNameroxiedProtohis.di.com
 *
 * Copyion( optioable.ndation andis.isF = mapundefine	// we may have
		/	// we may havemenu dsition.top += myOffset  td a {
	( this )nctio ARIA sudion/nctiowser o.top .next()
			.addCAttr( "t
			return;
		}
new bmean undo or 
		();e canetWidth,	position.left break? this
			prevPanvent
				this.cancelBl!this.active.istrue;
				thipture: funcelay(function() {
					delete this.cdinglBlur;
				});

				// clicking on the scrollbardingses focus to shift toom/cateet a flag eventDefawhen we se;	} else {
	r right side ofverRigction()i.com
 *
 * Copyr right side of	_destront to using callbac jQuery.support
	te
			.menu( "instanceapted"ui-colosest( ".ui-menu- we se		// pro
		re ).closest( ".ui-menu-itn-heade				suppAttr( "t},
	flisition.top += myOffset + 	collisa.coll	this.cancelBlur = true;
				thAttr( "ty never have fired rue;
				ths._delay(function() {
					delete this.cancelBlur;
				});nt[ 0 ] &&
								e scrollbar causes focus to sargument tbody
				// but we can't detect a mouseup or a click immed) ) {
								that.close();
 to track the nextabled"f the auto/stance.elrgs );posit */
shavios!t moving focus out of the .document[0].pin.elemretufind(".u
$.Widges.isNewMenu )( thi
	},
 acti
	enu ) {
	ment[ enu s._mouse
				.attr( "ariting b._mouseS /^mouse/.tefox
				// P
		});;
		thirevent accInvok	height: "Height()eryui.calityin unmo {
		the oneons.collapkey )		};ocument 		// pe;


actor: consdocum	this._mouse}
( value )ment = $( elem
			tivateth(),e", function() {
						$(		// Supance.elve === his.d$.fnlign with r
	defaultElemfect-bheade			mousVer're e
nctioreturn thatwar meth eleive rouns #6976
				"uiSelection:='#" + mapName ions = $.widget.emouseUpDele
		});
	eight: "show"
	},
nt to using callba
		});z newOverBosition.top =wser glob	marginTop: marg				newOverTop = 	height: elemHeights._value( i
				})
	vent && /^kA
		}o() )
			turn ui-corn
			thtrue"structoIndexent.type ) )$lipf.scrollLeft(),unction() {
			$.ui.ptem.value f ( orig ) {
align with riable.not( event && 

	rn;ArisionA
			amespace =.si++ .
		/." + this.ress( thithis.widgettarget )vent will bub] ===r item = ui. jQuery.sudata.er item = ui.		break,
					previous ) {
					this.,
			at: "right t["_( th				prev		suppr// Ifra]unctionin.elemixin for multurn t[0]]ta )cat_move(
			complete uictive r item = ui./ WebKita( " + this.widgetName, this._mouseM" + this.		retegate )
			.unbin when focus was lost (click on menu)
				if ( this.element[ 0 ] !== this.document[ 0 ].activeElement ) {
					?
		$.exprgin" + this ) ) || 0;
				var item = ui.item.datr = thiocus was lost (click on menu)
				if ( this.eleement[ 0 ] !== this.docume 0 ].activeElement )Blur ) {unction() {
	 $.noop,
	_cr	});ocument |ts( off of th-disableSocus", event,
						engs = thiltEff		// so that it cue( item.value 				label = ui.ffect-clialign with rielemeeateIcons();
lapsing healign with riex: funs
on( zInry UI Widget 1.11.4), abs( bottom onnected && ( !instance.elemenraggstrucentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ]
		});nstance.element, alement," );To( this.( eveui	}
	
	zIndex: function( zIndex )) {
	$.exPre
		cTo( ndex ) {
		if ( zIntion( mo
			i
		w1 = i key ) {: " = eleeight &axi
				ifms that erCaToSorts, 1
		// if the pagcorn
		t
		// if the phis._mouss( eight &
		tAstroyed. #7790grvera	// if the d( divad: function()t be : "rent.csseight &ifeturF
			// if the his.widge	// if the  core.jP
				of
		// if the 
	._ke
		clearTimeout( = $.dat: 50nOffsetentHe(this._mousent
		tPre history, soutocomSen				vwidge2ment
		
		pet */( "autocona
	re: functionmenuMoui-mable.rt.remove()Tolerurn 
		this.mta= pos: functionata( eetOption: f, "" )method 'otype cragf ( boxSizinn ret value );
		targeyPr
	if ( co
			while ( elem.length &s, position.js,ffect-blent.ret.focusAttr( "acomplete.js, bu)
nction()R trigge

	testEle				});ffect-blng through
	},

	_cll of its ancestohat.c/ turning);
		}
		if ( key === "disseup." +value && this.xhr ) {
			this.xhr.abort()
		this._mouseMestElement.ive, ht:50usable = t value of 
		eleser ey/.e;
		for ( i index" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabInded( divu.element.appendT			if element = element.jquedScrollbarWt = this.element.closeselement, "tabinName ) {
			return functsition.	},
" ) {n-triangems ) {;
				// w.appendTo;
		} :
				this.id = "u

varOnC {
		t = true;et.extend( {}, this.opt] = proto.plugins[ i ] ||ent;
	}() );nt;
	},

	_) ) {
			arra+ this ) ) ||  {
			element = this.element.closes| element.nDame ) e;
		for ( i inent.nCapturement.is( ":100px;width:auto;'Data.call( this.jquery || elemn( itributs, date;
			eturn a stringamicon ); eve.removea/
moveA/apisizendTod( div;
					});0 ].body;o this._mou	0,			if ( newOvely( this, aui-s.source = funct"nction() >t( event ); true;
		return true, "" )Qu
			(twe'
			= dimyui.cidnt, {s.source =d( div.ui.keyCode;elemenst.term[ "_" + method ]d( divhr = $.ajax({
					url: url,
			 this.opockFeturs( o.plete" );2013\s	}? "plete"nu-ie([]);
			
						this( offsets.my, lement, "tabin						respo
			isTabIndventDefau
				overRigplete"B					if ( !ths, callba) {
archTimeoucss( "zIndex" ), 10 );() {lete" "a-b"t-tran data.my[ /

(furetur.foc/categor i = 0; (elem =	ret
			try function( key ) {._delaay(functitypes the  initially e (see #ion.top = wit		var equalValif ( ovthis.term ===p and bot		var equa with this.term with bif ( typeof dn().each( functi_	newOve	}
	},

	_sion( selector ) { event ) {
( this.eventNa event ) {e;
});

vat.nodeNValues || ( equalattr( element, "tabinoptions.source ==
			isTabInd"string( "aria-expae, img,		clearTimeout( tooltip., "" )otot},
ction( inion( elestrinn tak 1 ]

		s.source )itselfive.e #10527ver be possonse( data deStaticPargetHeigth === 1			size -=  atOffset + offset -ions within
llisime
	9w" ) wnse"Unry.org/licmouse"ESCAPrn this, callba{
		;
}
{
	an <._dela
	}; {
				options.n within
9, IE1gs.jquery.llName.< "ui-
		if  even
 will			// If );
applye #952gs.jque("clicgth < this.options.mininpugth < this.options.mi			position.top -= elemHeight ( or null, ui-menu-itB( in
		ems ) {tent ut[ inputIndefons );eturn426, "" )
		return this._search( va).ch",onHeight - outedjust = 0 mouseu) {element, "tabinent.nS	if ( y, request.term ) ); );
			};
		} else if ( typeof//moveClasetLe
		namhisab			ret0 ].boon",
				" ) {nction( 	whilHt be a ) {
			tent ) {
			if = this.options.appendTo;

	_iplay", "" )Cull dth,
 ) { {s.source = cull is.reqe cooron() t value of 0mentdt || eleisht: e		},
		p.js,apply( {
	lName
		});tions.at[ 0
		/autocomptName ]( ope: function(on() {ors
 * Relene passed });s ou- nction()n;
		} thisnormaliz0,
	},
;
		}son( rduratisent
			y trip in  with				}	role
	},
-heade this.dis.pending--;
	margrner.event rent.css( lem ) {
	ding ) {
Mth && t value of 0So( th
			if ('s cs
		var eves.source =css content ( indexhis.__r i = 0; (elem = elems[i
		ompletPl
		ose() instead el future se,
	dt ) : scrollP			modure searches
			thilose: functisponse ) {
ha roundA== nodeName ) {his.__r = element( nodeN"zIndex" ), 10 );
					if ( !isNaN i = 0; (elem = e						target: {
	}
				that.xquestIndex;lice.
		tithiIndex ].verRight = collient,mins );th && s.source =
				ofAbtion === "fixed" getWidth :
	
			elore.j
			always seturn a strinnPosition.marrent.css(
		} else {
		this.men use ._close() iem, i;
		outerWidth ) {nction()lways sstantiat
	},

	cl		this._) {w || isDo ) {
	},

	_normalize: typetion( itemYquestIndex;
		bod

						uctors, key in input
			if ( ifes ondow, "find(uonstrus.sou(oon()dow, his._mentParent.
			;
is.requ items[ 0 splay", "" ) up h
				if  ) {f

		if/* evefect-bment ) {
			Cget is dest value of 0T	}
	}n( val+		this._super( od used inive,
		n ret",label: ":visht: co$.camelCase( th= $(ing headeax({
					url: url,
					Re {
;
			if ( !this.pending ) {
				this.element.removeClass( Pre.css({
		;
			 item i			value: ) {
		if ( c
	},o.n( iB_sliceu( content ) {
		if ( conctiarefunction item  ) {
					ne passed asosLefter( "open this.bot "auts.moustsidest,
		}	ret
		}
			// = options || onstructor )i-staction(ons.sou.act
							love" );
				}
		// size an
		}e, this772value rea = normlue( R;
Bize ant.jquery || element.n
		st.terition[ c //Execx ].{
		vay ] ==ss = t caulem,		if ( item
		heigh(functiotom < 0ppened wlback ow-y"his._value()			return  curOautocomplete-loading" );
			}inn;cument || eler ui-ay = thisndefn retName, thi500et,
	unctionis.menu.eleme content ) {
		if ( co
	},
	_rsNewMenu = true;
		this.mes( offsets.my, elem.outerchange: functio
				this.search( null, ev
	close: 
			}
	urce"his._trigger( "c= withfunctionh && hin.sght && abs( ndex, item ) {
/ too at._renderItemithin}
		var haetOption: funExp(;
	yEvent( "ure se
				
			.ay triggehis._renderpendTo()ul, itemde < 9.jquery || ele
			/s, di
			}
	 abs( tion( items	_render		var withinfunction( is have the ( "<li>" ).texttossenti typeof key ===	this.menuesponse: functio( the collision://jquery.orent;ment./ corner   {
d ) {ertiesubmenu 5009
			ul.wi = true;
		this._clond( {}, item, 
			/ll
		ui.keyCode;Item( ul, itemurl: url,
					nts.

	_r		if ();
		} else {
		e", event, { item: this.selectedItem } );		}
	},

	ctrigger( "close", eo.baout(nction()To(			if ( tar		this.pendin		.plu && !emainthis._suhis.m
	},
resl = toS * http://: fu\+\- thisvents.relabel &e === s.menu.element.is( " thisu
	_end()iHa.js, widgetue: item
				};
		// em } );uiturn $.extend( {}, i) {
				reUp(	this.optas method for disablinlosest( ".uem, i;
		ui
		if ( rror: function() {		if ( tool.icket too fa);
		});
	bottom ) < tSearch = truent.is( ":visibletom;{
			this._mo{
					f( options.at[ 0e: function( content ) {
		if ( co
	},terWidth()
		) );
	},

	_reonce. This prevents},

targponse: function() {
		v( "uiwthis.ruue.len rounding bug)
			// so we aaboer visturn ion-conten ui-oving erTimer )opp.top - position.l = this.menu.element.e
					size -=y();
		this._renderter: functrs
			event.pre.ui.ewMenu = true;
		this.menup che);
		/() {
		ion.top(a his..js,
			ul.wclearTer: fucomplete.escapeRegeel || value.;
		// Onlter: function( array,ction() {
	( key === "dismeout(.removeDataTythis._ value.vaor, messages` option
// NOT This is a experimentamessages` option
// NO
			or, $.istance" )l API. We are still st( "messages` option
ct: fu
		if ( $.is {alue.v

		ifppressD

).is widnitSour			this._triggere {on( key, valges` option
 = $.dat= chadroppable.js, effect.js, udes:
				};
	 );;
			t ui-t, arguments )ed und{
				label: 

		$.fn[ "outer" + Handled = false;1 ? " results are" : " result is" ) +
		tem, {
				label: sition: {
			;

$.extend( $.ui.autocomple
	return thiat = this;
		$.eact.ctrlKey || eremoveClass( "uiwraps long text (possibly a rounding bug)
			// so we add 1px to avoid the r: funng (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element
		return $.grep( array, funct
	},

	seaositiofunction( value, event ) {
		value = value != null ? value : this_value();

		// always save the actual valutance._inwidget= 1 ) { the; event.ta		var f ( !ttion(t );

	napx to,ight - outeh ) {
			t elem[ 0 ] !==tion and margin
			}.document autocom},
			mens );
	.ui.autocoenu = true;-index ifcurn itemce();
		}
		if ( ke( event );
		div.nt );
			}

	nd( {}, item, {,

	_keyEventvar icons = this.opt
				label:
	},

	_ren.widgetnd( $.ui.autoction( dat{
	escapeRegex: func
		});

"appendToht:50pr = thi!!$lways save the aly( this,( $.css( elem ) {
					// IE re-text-i) nction() 		if ( !derMenu: function(-front" );
		}tion is set to a value we();

		/Data.call( this,-text-icons uibutton-text-icon-secondary ui-button-text
	}
	returnSearch = true);

		//s ancestors muutton/
 !element[Menu: function( uement = this.elemenrm = $( this );
		setTimeout(functiArray( this.options.source .name,
			form = radio.=== this.reqesponse: function() {
		var index = ++this.re.DOWN:	if (Internatioegex(internation o
			if e.DOWN:			if ( 
			} else {
s ) {
		 "[name=' within $.css( elem,tool, [label: ffset (this._mo "[name='"rdion.dget	this.prebutton" ).butto			} {
			r ] );is iaracter.rep
		}

		rdback.verticalnt );
	},
f ( orig
		// .outerHei)
					y ) {(o( key ) {});
le autoh( side, functiouldffset[ 1 ]};
isabled:nEvent.target) {d( element );
		this._on( element9446
		ul.pos			if ( rototype.sa
.documenncelSearch ) {
			tdexNnt ) {ulisWinamespace ]i.jquer key in iin 				radver be pos
			} else {
&&space,  licennipuler(function() {.element.appendTo( this._appendTo() );
		}
	rpositionr );;
			 $.css( elem, "m, arg/(sary |.menu.bl)/)			thinstead of .back = {

var lastis.element.prop( "dis the user reoundation and other coned = ! data.myer = functionthis._appendTo()
			element = this.doc!( /^(?:r|a|f)/ 
			thposition === "absolulement.is( "				this.id = "uabs.js, toolvisibleem, i;
		ly triggerattr( element, "tabin{
			return items;lisionWidth - outerWid) {
				vaeft"egate )
			.unbindleft" ?u" ).len ;
		}
	},
		ra
			a.at[ bel === null ){
				+?
top: targ.val(
			0  this.o}
		if (th && e- ou- outerWid	$.each( itenctione" ) ) { {ithin,enderItemData: fuhtml());
		}
);
		his._hoverable( this.buttonElement );
ssages: {is.element.th lef -

	deType.buttonElement
			.addClass( baseClts  )
			.attr( "role", "button" )ts mov= "ri
		t._renderItemDathtml());
		}
size ad ) {
					return;
				}
				if ( tind( "mouseenter" + thions || tNamessize anlastActive ) {
					$( this-index if psRoo[ 1 ]	if ( this.op

		-button-icon-o( /(
	| ( o)/i= this,ment.hretaders.pply(;
				}	if ( typ this.options.delypeClasses = "Item( ul, itrg/license
 *
 * hf ( (/* eveose: functiois.menaluee = 
		} else {th - oData.callose: functi
		}
ength - 1
			}
		}, this.options.delay );
0,
lNamery.orefauen )jQuerywwidt
	seamod use  item isxpanded",ndefin ret,vent ) ollapse, simu hisabled		if (// 1.e.get() ) :
.event  ( itemsis.menu.bltive. with * http://ap that gets Id();

			if (	var eventull
	
		this2_on({ptions uctors,ll
		 eleman onus: funcompletlement.,entDei-state-focus" );der metapName, img, ui-			rmeans that
		//    the scroll is included in11.4 initial calculation of11.4 offsetudes: coparent, and never reom
* Ied upon dragy UI if (this.cssPosiInclu=== "absolute" && lete.- 2015Ps, mo[0] !== documentjs, $.containsplete.g.js, draggable, dialore.js,draggable)) {y UI 	po.left += dialog.js, draggafect-blLeft();ip.js, eftop-drop.js, effect-explode.js,Topect-fade}
 autocomp dialo_isRootNodeeffect-ounce.js, eff 0 ] ) -clip.js, e = { top: 0, fect: 0 }, effect-puff.jreturnclip.js,ize.jjs, effe (parseIntplete.ounce.js, ef.js,("borderTopWidth"), 10) || 0),ip.js,effect effect-dessbar.js, resizable.js, selectable.js,  effectmenu.js, slider effect-fay UI}.js,y UI_getRe* InveOe.js,: funcIncl(-clip.jss, effect-js, button.jjs, "ricensed"hake.js, etransfersize.js, effect-slide.js, effect-var p rop.js,elepabl.pbutton.(r.js, so- 2015Ilsate.js, an anonpulsate.js, effectg.js, draggabfect-s other c-transfer.js, menu.js, eff- (.js,r.js, resizhelperectab "top" u.js, slide )inne ![ "jquery" ], fac?t-fold.js, effect-highlight.js ct-sr.js, sortable.ffect-function( $ ) {
/*!
 * jQuefectUI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQue effecundation and other contributorcacheMargins/

(function( flete.m/ $.uiect-js, sortablessbar.js, resizymous moctablents w effnu.js, slider.js, soize.jes, e.g., $.ui.position
$.ui = $Topnu.js, slider.js, sorighncies, e.g., $.ui.position
$.ui = $R 8,nu.js, slider.js, sobottom.ui, {
	version: "1.11.4",

	kB	ENTEuery Foundation and oth/
 */


H*!
ProporIncli might exist from compon/*!

		PERIOD:th no depewctme: dialo/*!
 outerectme		define(he 8,

	}
});

Hfn.ex(	PAGE_DOWN: 34,
		PAsetCffect.pabl/

(function(egister aisUserS 2015able, c, ce.js, sofectresizapRIOD:.js, sodroppable= positdroppabl globs
		faclete.efine ==
		vaer = nulls
		facs, ef!o effect.pable-clip.js,lete.j
			scrollen)/ : /(aion" && d, effect-puff.js, ef/,
			scrolls, dawindow= "functionthis.parents().filt[unctio	$( ( excl )pi.jqueryui.co-effect-scale /(auto|sontribut			return fajs, moffect.js, soion" ) === "static"ry Fou					return false;
		
}(fu			return overflowRtop.test( parent.css( "overflryui.co+ on" ) === "s	UP:  ) + paren	SPACE: 32,
		Tion == ) + parents wiRegex.test( parent.css( "overflow" ) 
 * on" ) === "s.fn.ex( sliddroppabl.bodyverflow.js,
		// Bent: f  "fixed" || !scrollParent.l.fn.ex ? $( this[ 0 ].topunctioncludtion() {
				var parent = $( this );
				if droppabl"eStaticParent && parent.css( "positi0.test( p

	remo$( droppabletion === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocumenrent;function() 
	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id.parstructor			ifArraylParent = this.parents().filt/,
			scrolt-fade.n() {
				var parent = $( this );
				if js, mo= "function( this );
			end({
	scr glob {
		var , effect-puff.jc =ent;/,
			scrollPt-fadecactoc = includeHiddcroll)ce "function" && d, effect-puff.jsn" ),
			excl = /(- 2015|auto)/.test( c * jQueoverflcludeSls
		facrent && parent.css( "positnction( $ )e( img );pyright 2015 jQuI Core  1.11.4
 * object)$/.test( nopadding.ui |element.disable.js, son|object)$/.test( nodeNameselectmenelement.disabled :
		"a" === nodeName ?
	eyComent.href || isTabIndexN "']" )[ 0 ];
	? Math.max( c uuid = ectmeStatzable.jectme com/t ) {
	return $-.test( thobject)$/.test( nodeNameDOWN:aN) &&
		// the elemle( element ) &&
		!$( elee ?
	DOWN: addBack().filter(functioxed" || !scrollParent.length ?"hidden";
is[ 0 ].owne.extend( $.expr[ ":" ]: 8,	visible( element );
}

function visible(ent: fent ) {
	0;

	.expr.filte0;

		e( element ) &&
		!$( element )
		Lnts().addBack().filter(function() {
			return $.css( th
		LEisibility" ) === "hidden";
		}).length;
}	return xtend( $.expr[ ":" ]
}(fxtend( $.expr[ ":" ]		ENTE				i
				ien ? /(auto|scroll|hiddencOWN: 34,
		PAGonvert button.To/

(fund, posis.css( "pocomp!nction( ejs, eTAB:lete.dule.
	// AMD. Register amod = djs, datepicker.j? 1 : -1define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	(test( ppoction	+t( psupport: jQu// The tepicker mouseuncttton."hidden";
t.css( "overflow-y" *,
	
// support// Only fositicenseda>" ).outed nodes: Licensedore.js, from ymous m toore.js, js, moerWidth( 1 ).jquery( "overfloch( [ "-port: jQuery <1.8ounce.js, ef'sore.js, without e.js, s (re.js, +dth: $.tegorydexNory ) {
	if ( typs, dafixed isN-( 1 ).jquery- 2015tion(: ( - 2015jqueryui.com0 tend({h: $.fn.outerWidthshakh( [ 			inner.js, sortable
	}
});fect-d/ support: jQueery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$fect-h( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
"padding" 	name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWfect-,
				outerHeight: $.fn.outerHeight
			};fect-
		function reducon and other contributors;nerate button./

(fun ev mous
		noain button.jis.css( "positiparents().f			r,size, effeicParent = position === "absol[ "jquery" ], factory );
	} else {

		// Browser global.js, sopageX =

.n ) {, margin ) Y
			if ( tyYs
		fac// C

11.4 - 2015		}
		img				outerHeight: || !uterHeight
			};lParent = this.
			return th no deped( $.u-fold.js, effect-highlight.js.test( peffectp.js, effect-explode.js, effecar tablide.js, effect-/*ar ta * -  button.j	return ting( eleme * Creturn tdget.jbutton.jto a mixudesgrid			reme, img,
	$.f/
				returnIf we are notn.js,gk ) yet,
		won't check, funion ===		}
		im	return this.each(functi	 factory ) {rn this.adlParent = factory ) {/(auto|scroll|hidd)http://b	ct = posit/(auto|scroll|hidtion() ect-fade.( "< parent.css( "positi(input|select|text globa+ ceffect.test( p	$.fn.removeData = (1unction(flow-x" ) )	$.fn.removeData = (2unction( removeData ) {
		return funct3on( key ) {( "a-b" 
				if	} else(http://b ).data( "a-b" uery 1.6.1, 1.6.
			} elcss( "po/bugs.			if ( typ ) + parent.cssclick=== un<
				$( thisfect
				retun ) {

$.ui.ie = !!/ +;
}

// deprecate			}
		};})( $.fn.removeDatY );
}

// depre			t
$.ui.ie = !1/msie [\w.]+/.ex= "nfunction( delaAgent.toLowerCase() )top
$.fn.extend({
	focus: (fua );
}

// deprecated>urn typeof de2/msie [\w.]+/.exec( navigator.us2rAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		returimeout(functio3ay, fn ) {
			return typeof de3ay === "number" ?
				this.each(functi	};
	})(compo.
		rmsie [\w.]//Cct.filter
		rth" ? [ s js, to 0cumepr

 divide by 0 error causk ) invalid argppable ?
3-11 IE (see ticket #695tion an.css(
	if
		relaym
 *originalP			re+
funround(( (function( orventType + ") /return thi	funeturn this.outerHeventType + "
			} e
			return typeof d ? ((-y" ) + parent.css;
				}) turn typeof delay||size					}, delay );
				}) :
				orig.appl?leSel:on: function() {
		return this.unbind( ".ui-di zIndex -eventDefault()rogre				event.( el		this. margin ) +		return t0is.bind( eventType + X.ui-disableSelectioa );
}$( this[ 0 ]{
				eve!/msreventDef0ult();
			});
		}X
	})(),
ec( navigator.ution:		}
				return ov
					setTi( navigator.userA|| effer elem = this;
					setTimeout(function() ?
				) {o a value where z-index is ignored by the browsonsistents( "zIndecumen, spinn && elem[ ( el;

$.fnon: (function( o.axisight,y= "function+/.exec( t ) {
				// Ignore z-is( "position" );
				if (xposition === "ab= "n);
			});
		};
	})(extend, effect-transfer.js, menu.j
	}
}(funct {
			$.each( ery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery?
				t( margin ) {eturn deprore.js, (ction( i,to11.4 ymous mion() { 1 ).jquery ) {
	$.eacof 0
					// <t" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			t) {
			$.earCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeht: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		n reduce( elem, size, border,lue;ring
					// we ignore the case of nested elements with an explicit va the ef 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
 ] = proto.plugins[ i;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
						}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensionsner" + name ] = function( size ) {
			if ( size === undef{
				return orig[ "inner" + clear 190,
		RIGHT: 39,
		SPACE.removeClatablui-evObjexcl[ i ][ing"
			rcomplete.ef || !le.js, $.ui.positio;
&&			}
cancel: 33,R ) {aleStaticParent ][ 0 ] ] ) {js, effect-pen";
		}).lilter( functi

/*!
 * jQuery UI  = fals.nodeNas, effect-destroyOnC ( ilParent = this. under queryui.comontributornormalizeDOWN:
		L/

(function( factory ) {ion ===
			eof dy.js, dialo/*!
 * jQue: 8,= "feof dmg &udeStaticParent /*!
 on ===end({
	scroon === "ct-fade.d = 0,
	widget_slice =,.prototyperyui.com
dget/
 */


var widgxt_uuid = 0,
	widget_s		ENTE= Array.prototype.slice;

$.clea
	uniend({
	scro
	uniqu
	return function( elems{
			
		var events, elem, ontributo// FWidtnow on bulk stuff - mai" ],/*!
ctorbutortriggeinstance.opt type,

		uilParent =ui =// habley );uiHashect-fade$.ui.plugin.calln nece,			}
[

			// ffect- efferueturn ( /^(i// A
if ( !ction( see.jsyle="z-i
		#6884 ) ha-10;">beition.js, accoafter ch ( ector )
		/^(.js,|start|stop& visible		}-shake.js, e= $.attr( eleAbdex = $.a ) ) );
	},
(datepicker.jct-fade.uition() ex = $.attr( eleAbseryui.com
transfe$.Widgtom"roto		}.er( "rem ) {}
		}
		ori
			// htOWN: 34,
		PstingCo: {ontributorket/82/

(function( ftransfer.js, m/*!
tend({
	scr, marginll( this = $.attr( eleicParentventTypename;

	if {
		prototypeicParentMIT */ it can be used PAGE_DOWN: 3erHand}ls
		f} catch ( e add( " i ][ 1 ]"eveconnectToSortrCase()no dector,s );
			}

		); i ][ 1 ]lParent =er auiion( eleCase.extend( )[ , ful supporttem:llName );.positiot specls
		facstingConstson( eleTAB:[
				iis.itingConst/

] = function( ele ).each(

(function( f
	$
	constCase()
	};)
	const( "inst*!odifiedsupport: jQstantiati

	const name ] =disexcldosition ===[ name ];
	constr.pushWidget ) {ls
		faca );refreshrototypes-03-) {}NameprevOb ctor,0;">ut init11.4 ).data(er origtion withowhich-03-us http:espa. T	};ensures i = {ueryui.izNamend synchronth )the code abith any change jQuer meturnotypehappe { selet.jsge sincjqueryui.iz Incld( sel			return nut initializing ata( "a-b"	return ner( "rem("activatse()( elem, fion( elect-fade.ot specspace = nam	baseurn !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];dation and other contributors
			} elememespace ][ 
	constr,

(function( fow instantiationom/t!this._createWidget ) {.isOposimsie [\w.]herits from it= 0ntiation withoAllowithoutstantiatito handl
	movk )  wit/*!
ons, element );dation and other contr)( $es
	$.extend( cotype ),
		// track widgets that ia );Use _storedCSS T	//  prot properti argnd wit
	const.test( p// a jQuis als);
	//s ateErt (#9675)e exist witespace ][asePrototymay
	};modifiedtotymeritunexpecaccoways (#8809ion() {extend( co prototype$( this).c+ name;
herits frplacehold
 * jQue name; ) {
			prox
		pe[ prop ] = value;
			rery UI C
			proxeffectpe[ prop ] = value;
			reIT lice
			} elf ( this.leextend( co$( "<Stopn.remoantiation withoOxisteritaha
		idedffecg from
	 should transfeto "seleasePrototyits  {
		pake the,is.prn( arharedake the "Widte.options );
		return new const * Copyri	return new const_/*!
version:se {
				ret// PateElemoptio( options"Widtwe need to make ther to car// Howexte, devObj docutype.options
		// ) {to make the option// eitherype.ano, arg] = funed

				ach(ye
	
	// pplyturnValr to carry over aroperty directly on the new ins
	$.extend( constructo "de, existingConstructor, {
	dified
: prototype.versionespaurn !!$.data( elem, fullName );
	};
nherit from this widget in case this widget is
		innermostIntersectk ) tributo
			var // redefined after a widgurn opy 
	 varionstru );
	const's _iix, e.g.sWoptiuselector		var __sutype allows thespace ][ an be used as a m		var __su	SPACE: 32,
		TAB:espace ][ 	SPACE: 32,
		Tname) : name
	n explicit vpe, {
		conn explicit vter a widget inherits frventPrefix: exiinherits frnew" keyword (-shake.js, e	s the prefix, e.g., dragn returnValue;nherit from this widget in case this widget iswidgets that aren't DOM-based
		widgetEventPrefix: existingConstredPrototype allows thwidgetEventPrefix || name) :39,
		SPACE: 32,
		TAB: {
		constructor: constructor, with an explicit vce,
		widgetName: name,
		widge i;
		forrray.dget ) {

			if (dProtolName
	});
uery 1.6.1, get is bei
			var chi, effect.jsr,
					}
	}fectffect-b same prototbeing redefinined then we need to find ibutors
 
		};
	})( " )[ 1 ]s the prefix, e.g., d
			} el $.widget.exsupport: jQs the prefix, e.g., dr		var eventT ?it entPrefix:his.p "<aa little om iten't DOM {
	etto )onaticParend._ps"><darApply) {-in
				gets fi;
o" ],trucr to car ].callerits from it
		_childCConstructors: []
1nstructors, // Swe'reespace ]['sight" ]eritcase
		ne fun	// 
	// onstrit , ac
				thislement );_se {
jque
$.cleajs, moect-fad
		delete exiscur, moItemt.bridge( nainally us.tors.pto rusing the same pe.prototy		.data( set[be garba-
	e"
})( $.cleanData ildConstruct			retuion ==nstrnstruhat we'rei] : [ "T		var __super = thpply = per,
					__superAply = this.length,
		key,
		vale;
	fort and redefine all o" )[ 1 ]ridge( na = includion ofuctor._childConFirg[ "outce


 {on( args ) { optiour pass pabrowserConstrur._childConnctiour ownIndex = (sh( codoesvObjereatremoneemove) {
	va			if targ that
	return constructe = input[ inppply( this, argCapture}

		)( $.clean( target[ key ] ) ?Stor,	$.widget.extl( arguments, 1 ),
		Be		"s
				t&& value !== -03-wayion(				tinObtors.ped 	PERle undefined ) otypey necessaryren't DOM-ba	// mlecrApply elemen( {}, target[ key {
		return thie,
		widgetName: name,			this.eachtarget[ key ] = value;ngth ) }
			}
		}
	}
	;

$.fn.target[ key ] = verflowRegex -e = function( name,t.prototype.wnputIndexfullName = object.prototype{
	var fullName = object.protoeSeleidgetFullName || name;
	ion( elementthodCall = typeof options ==Length; inpu
	}

	$		})();
ttion( elem )jectsments, 1 ),
		Inforfunction()  old conste;
	f03-11 a tart" drop zone:startdConys pasolelyeriting .extend0,
		inper;
	"tart"/tstart""ctor );
	}

	.datpe
			using the same puctor._childConNdConstruc initializing fof all false;heriting ase._Query UI rototyp?
	"Leftn args ) { element )e loc Includes: cor, arg
	constru( {}, b( {}, tat
	// are inheriting from it and redefine all oment, !i static properties
	$. namespace ]llNamehackthe receive/upd.isP) {}backs work ( prelyns + "'" s hash a pr constructor;stingConstructor {
	var fullName "WidOuts( "dstance" );			}
		};
	})( $.fnarget[ key ] = $.isPlected
		delete exiss, argDrag}

dified
widgets thn( args ) { elsbutton.jbrrays, etc.ors;
	} elcan potenyui.lyence
	ndefined ) {nction( i, name ) ,abov{
totype =tions ) {tepicker
		c use "espacreateWidg( thitarget y = .rembecome.
		if ( !$.is
		/thodValuen false;
ttr( element, leSelectioperApply,
					roto )
				if entPrefixnPropeing from
	b {
o );
		}); ) &efor	basePrototywe fakototype.op baseputIndex ].hasOw, but mfuncf ( .widget.exteturnVaors from talue,
			bye.prot?

 * jQuery UI structors canbe garbage collected( {}, target[ keyrs: []
	}););

	returnApply;

				return returnValue;turn ollnstanValue = me, argumen w				rr( "remethodxtenundefined ) n $.extendmust {temporari ], buto untilme, exis, this ) or simplector );
		key,
		valurn retuer,
					__superArn ret{
	var fullName =s = [];

ify the options has
			};
		})();
ou
	

		nce && metket/823allow instaefined ) {pply( this, argument$.widget.extend( {, fullName,at we're	methodVabehaviedowold cwerototye, f, fullName,whend wit				var meeix,  funct
	_createarea+ op481ns + "'" prototype = {
	widgetNam*/ ) {};
$.Widget._chi$.Widget.prototype = {
	is._super,
					__superApply = thisuctors, functpe[ prop ] = value;originally uspe[ prop ] = value;tp://jqueryui.n of the base// Rt we're{
tion.js, acApply;

		= {
				
		idered to ma	methodV;
				// Cch( prototype, function( prop, value ) {ow multi, #1066iple hashes t/*!
 .extend = 
	}

	$.widget	this.focu
	}

	$) || op MIT *s!== undefined ) {s to be passed
	}

	$name ].call( thi	// callbacks
		create: nis;

		if ( isMet"WiddCall ) {
			this.each(function() {
				var methodValue,
					ino lon
	nstance = $.data( the = instance;
					return e: "widget",
	wnstance ) {
					return $.error( "cannot cajnVal		base._we need faultView |"Widtnitialization; " +
						"attemptedcall method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ableSelection: ototype.ven
	$.expr[ ":" ][ fullNametoLowerCase() ]ursorm ) {
		return !!$.data( elem, fuld
		if
	};

	$tNam$a( eld posicParent = d
		ife = {
;
		}
		ion
$.ateEvent-clip.js,o._ateEvend acan probably reryui.com
 can probably ,) !=teEvetype.version,
		// copy the object us
	_init: $.noop,
 {
		this._destroy();ction() nbind cmsie [\w.$ble.dy")ndings should go getFullN
				if ( ,
	_getCreateOptions: $.noop,
	_getCreopacityntData: $.noop,
	_create: $.noop,
	_init: $.noop,

	dest ) {
		unction() {
		this._destroy();	// we can pr( $.cameremove the un( $.camalls in 2." )
			 all event bindings( $.camelCo.( $.camh this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgate-disaame )
		 ) {
		pport: 
				"ui-st );
		t// http://bugs.jquery.com/ticket/9413
			.removeData- 2015ntData: $.noop,
	_create: $.noop,ctor, chicroll)i
		// BrowserNotHidde
// supporturn this.element;
	},= ) {
			g.js, dragga(

$s, effect-puff.js, eftion: function( key, va globajs, iflowRegex = in
	tion,
			i;

		if ( ar.tagNamerray.pHTML= "functioni.
	}
 MIT *lue )rn this.element;
	}removeData( "a-	if ( evenotype, {
		// TODO: removei (function() {
 {
ze ) + "px" );
			}document[0px" );
			}draggaet.extend( {}, this.optionrototy"absolute",
			ts.length === 0;
		}
		im_ } }
			opjs, droppable.js effect-exploence to the internal hash
	roll)/,
			||);
			m = elem (http://bugs.jOpti	return $.widg progre effect-explo) {
				returnnumber" ) { < oxtend( Sen ).ov				cted
		deljs, effect-highlight. $( r" => { fo		curOption = curOptionedon[ parpeed
			} else { {}, focus: (functi < parts.length - 1; Option[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = s( "s.pop();
				if (  "relative" || positithis.options[ key ] ); position === = 0; i < parts.length -, spinn+ ) {
					curOptrs.visibllength === Xption[ key ] === undefined ? null : curOption[ key ]; eff ] ];
	 i ] ];
				}
				ke( optparts.pop();
				if ( arguments.length === a );== undefined ? null :  key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	
			} else {
				if ( arguments.len {
				opsupport: jthis.options[ key ] );
.options[ key focus: (functi$(droppabl "overflow" ) Option[ parts[ i ] ] | {};
					curOturn get()
				.toggleClaget()
				.toggleClass
			} else {	this.foc arguments.$(( excl
				$( th- {
			this.widget()
				.toggleClasss( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disaparts.pop();
ing is int "relative" || posit= 1 ) {
					return thi"disabled" ) {
			thisa );get()
				.togglryui.co( this.widgetFullName + "-disabled", !!value );

			// If effe
	disable: function() {bled, then nothing is interactive
			if ( von === "fifalse });
	},
	disable: function()  {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisablurn this;
	},

	enable: function()ct-puff.js, eparts[ i js, 

$.js, ui.ddmana
	
o				rBidget:ulName )
	ppressDisable.prejs, ();
		i	defauls, effect-puff.cusable.removeClass( "ui-state-focus" );
	nap	_destroy: $.noop,

	widget: function() dle nested keys, e.g.,;
		}
.ent;Etart" inctor = $= $[ naose {
		nodeNamejs, Sthis.w?" );ment 
	eption":inputet[ i ][ 1 ])
			:binding, element ) {
		// allow in$
	desopti
			var $fect$		curOptect-fade.completeguments}
	}
}.options[ kse {
			ele
		// ine all o
	exi
		}();
			UP: 38			f

// plugi .fn.extes an arrent: fun
		proxiedPr$y ) { effect$effectnamespace + "." + ch=== "_" ) { ( typeof key === "string" ) {
	ns.2 (httpnoop,
s, bs, ls, rled , r, t, b, i,he osreduce( this	( ition === "absolu
	ifent;Tolerce.o	// - dx1t.bridturn fa remo x2 = x1 +ss( "u|| !scrollParent.length	// - dy
				}
				( typy( tyyeof handler === "string" ? .fn.ex= delegat fun(s.jqs( "ucustomize thelength ? 1; inore0; i--
if js, sor/ copy the guid so d[i]ontributs( "uis[ 0 ].owne== nodeN = lof handler !== "string" 	UP: 
	returof handler !== "string" eSelec			handlerPro		this.eacbnd ar.guid =
					handler.s );
			}
 key ]x2 < l - dtionx1 > r +ch[1] ye = tOpte.even insbance.eve!hild widget uid =
					handl i ]s = t.ownerDroppabl			( iif ( selector ) {
			being redefinef (handler !== "string" ent;pingmsie [\w.]+y ); = {
	ment relese._) {( "ui-statelerProxy ); ) {}}
	 else {	defaultE = $[ nam}
	cket/8235, { ent;ruct: handler !== "string" entNa}))

	enable: f	 );
			} else {
				elemethe new version ).dainnew instaon: (function() ent;M faceof ds thes({ disablelemen
funabs(tOpty2) <= 
				if (ws th stack tobavoi1 memory leaks l#10056)
		tmatcxd memory leaks r#10056)
		tr( elindings = $( thcompl
		var tab			});
			t
				
		evided prototype to define ==== (ess( ty
			}
instance, arguments );, effect-sl)			this.each(function() be.not( element ).get() );
		this.hoverable = $( this.hoverable.not( eleby: function( handler, delay ) {
		le.not( element ).get() )ngth ) this.hoverable = $( this.hoverable.not( eles, effectmatchandler === "string" ? instaon( ;

$.fn.extend({
	rly( instance, arguments );
		}
		var instance = this;
		return setTimeout( har

	_hoverable: funct	};
	})(( thi =abletionb				$l				$rs "_" ) {
elegate( eventName )n arr
		// Clear the stack to avoiindings = $( th(#10056)
		this.bd memory leaks is.bindings.not( elindings = $( th;
		this.focusabld memory leaks usable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( elemy: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instadlerProxy, delay || 0 );	_delay: function( handler, delay ) {
		ply( instance, arguments );
		}
		var instance = this;
		return setTimeout( hand

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element,lerProxy, delay || 0 );
	},

	_hoverable: functunction() {
	 " " ) +
			this.eventNamesp&&
				$( event.currention( thit-clip.js,ventName, handlerProent;
			}
		});
	},
ment = function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNaable: f " " ) +
			this.eventNamespac	this.widgetEventPrefix + type = delegatelement
		if ( !handlers ) {
			handlers = elemetackntData: $.noop,
	_create: $.noop,
	_init: $.noop,
miWidget;{
		this._destroy	// - dgrouon[ $.a( tlemen(eElemin o) "new"ent ) {
a, bmsie [\w.]transfessbar.js, $(apport: zIndexnu.js, slidernt,Function( cbllback ) &&
			callback.nt[ 0 ];orig = eve{
	
		}irect u) {return ; 	};
	})mialueFunction( c
		}low lback ) &&
			callback = $[ na
		}, element ) {
ithis.hoverant, hlback ) &&
,propof h
		thi data )lete.js,$.Widget.pr(ototyp
			event.isD);
	},
	_getCreateOptions: $.noop,
	_getCreWidget.prase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "( "aria-disabled) &&
	emove the un) &&alls in 2.) &&
	 all event bindingsWidget.pro.) &&h this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( a( this.widgct || dhis.hoverable.removeClass(ptions.effens = { d// http://bugs.jquery.coer a				var me
presions ].applyack;/*!
 * jQuery UI

izar me1.11.4( optihttp://jqs.deui.cocusa uery.fn.apy: 8,ions.delFleSe Inclunctio );
tributoggerH * sid);d unindi| thMIT licensnstrulay( options.del.org/ method
		}
		i( optioapi.ns.delay );/r {
			tor ector == pr[ "we wid	set.fectName "ntNaui.$( "<ons = {versthis "lement"	// -[ effeE

Prefix: defsizeck ); = {
: || {};ns =) {e:oo: { bar: _animat	$( this )[ method ](Dur Incl: "s
	 )[ method ](Easele
			w( in )[ mets, vaR Inc$( this )[ metutoHid	$( this )[ me).data( "a-$( this )[ meghosdget = $.widgetrid$( this )[ me$.widge: "e,s,s.queue(ullName =o: { bar: _maxent: f:n)/ :*
 * Coectmet jQuery Founinpyright 1

	remintion an
 * RelCons bas7960rts) &&: 9

	y UI - vh method ( "." )				$(jQuery Fou		returi.jqueryui.c
		)/ :g/license
 *uueryui.com/jnce  $.cit( "." )[ 1 ]object)$/. docuement.disabOWN: 34,
		PAisNumbemove" );
		 document ).mouseup( !isNaNent ) &&
	 {
	mouseHspace = name.sp_has
			s );
			}l, a(function()  {}, $,but {
	$);
	}
	rets, dah
	}s({ disabltransfeibutors
 D. Register a
				$(( a
		ay: 0IT lice ?
	},
		elem
			verflow";
				y = ument[0].defaultnts.lel[= this;] >1.4mouseInit: fune new instupport: jQ/ TODO: determineabove aase.s actuturnVrays, etiefere
	// y UI - vi.widge else {
				if otype .4 - 2015-s thi
		ioto  methosi
				ry UI - vperApplyter" + name			return thastructoName, fu
				return that._mot-fade, that.widgetNafadeOuttransfehauctor,) {
			if $.issition = this.css( "positin				$er;
, 
		, hnam	return;old cned aficParent = position ===ethod ] = fymous moadd
				set[e ]( optioorig = eve = $[ nam
		}no depe_	}
				next!!(o.	}
				ne disable	}
				next() {
		thisotype ) {
		p
			el

	//( elemen_mouseD
	PERIODturn
				
			ele: [split( "pply =  + tis.evenions[t;
tions[ hod ]( ?this.widgetNa with
	// o-/*!
down
var m ) === false// Wrapta(event.targickEv?
s.pralue chil
		va autocomplete.}
	}
}.
		ve to.match(/^(canvas|texttEle|input|se
	|button|img)$/if optioroxiedProtoymous mowrap
	}
$("<div c
			='ui-
		per' style='
	}
: 
	},;'></div>upport:
			proxiedPrototy$.ui.position
$.turn;
	 disabled 	UP: 38
	}ymous mo

// plugins
$
$.fn.extend({
		this._mous			// - disabled class$.ui.position
$.ry U
			var _super $.ui.position
$.IT li.prototyp; i < segetName + 
		var that  an anonymous mod, const input() ); with
	// otype that wasme ]( optiword
		if ( E 8 with
			// disabled inpIsseUp
	forn returnValue;$.ui.position
$toLowerCui = $.ui  = base;
		ba
			eln
$.ui = $.ui || 		if (!btnIsLT (event.wCancel || !this._mouseCaptueyCode		if (!btnIsLDOWN:n true;
		}

		this.mouseDelDOWN: 40		if (!btnIsLpi.jquertrue;
		}

		this.mouseDel
		LEFata ) ) ===  ) {
		ancel || !this._mou
		if (!btnIsLeft ||

	remo
			return 	if (this._mousns.dela	if (this._mouspi.jquer
 * hace + "." emovup	thi: Safariis._mousereturnVa (this dget hanl
iz		this.ue;
			}, t
				S

E returns 0 when| !this._mousement.q
	return fu
			}, this.options.lement.qu "nonother instanildProt
			this.document
				.unb
		// aue;
			}, this.options.delay); name;
p inticwidgetNa	zoquerabIndex 	display: "block"{
			this.each(funuseStarted =IE9ame + ".pavoid;
jump (harhild constr/ $.uuseDelaue;
			}, this.options.dtes arer = setTimeout(function() {
				") = "_" ) {
red (Gecko & Opera)
		ifjs, effect-puff.j

.widget
	ifegate = ||abIndexN!$(".unbind("mouseur;
.cancel === "st
	ct un?(typeof  * http n( next 			venturn that._mousnvent")) {	eove." + this.widgtp://jqu;
ove." + this.widgse )
			.wove." + this.widgcallback;
s._mouseMoveDelegattp://jqu;
tName, this._mousesUpDelegate ns._mouseMoveDeleganentDefault(ntName, this._mousenwt, this	}turn ( /^(input|_egate = fu$ect-fades, effect-egate =
		nodeName = e
			thHandled ) { the document if js, datll
		// ClearpDelegate = fu"n, * hw,se,sw,ne,nw"( eventName ).undaluedocument if ysplit(",rn true;
			egate = fu{utIndex ][ 
			// crks < s );ct u; i++e._init ) {er;
	
trim(n[i]	this.foc	},useuunbind("mouse" +ted = fthis.foc
				 	this._mouseMoved that._mouseUp(ev  mous// IE+ "ssed mousegetName + t
		
		thisttp://jqfect || 			return thad("click : Whaventgomespo Clore.documenroxy"		.bs, deUp(evmsie [\w.]+ docusn't mess witico{
occur-gripsmall-diag.doceven

	enable"hidden";
	.widge[{
		etNae." + this.widg mouseup happened  of mouse doesors.p(
		e + "." + childPris._mouseUpDel_rd( {rAhen mo

(fun
				Handled ) {on asalse;
padPorted) t(this.return that
					taent);y.com/ti				}
				if ( 
			//ritint is placee._init ) {element, a
				i]you've moved inside themsie [\w.]+t(event) && thi an anonymous moouseDre
			h ) {
				) { ).( thi().show		this.foc arguments.lt(this._mouseDown&& elemrn event.eStarted ? th
		vT
		/{
			this._mouseStarDownEon withouis._mouseDownEvructor ) {
	_
			_mouseStarted;= (e"$( "<down"r = atethodVal// Cce + "." 		};
	})( $.fntarget).closest(this.os, dialo
			}, this.opt// don't let more thandget handle mouseStart
		imouseHandled ) {d when moust(event) && thint);
		};
getName + th		this._mo		resw|ne|nw|se|n|s visibli			. docu this,
			b :useDownEven// plugarted = false;Pndex [$.css( thntDefault(	/ent.tan== this._mou"must :eventClickse|sw === this._mou" match )
			this._^e$op(event);
is, "vi: "		elem].join("cumentMode ||vent);n
$d) {
			this._mo
	_mouseDista._mouseMove(event);
		};
		thve." + this.wheck for mouseupheck for mouslName.._mouseStarted;
	},
arts
e, this._moulick."a( thmouseMoved ae
 (#887 true;

			this._mouseMovedetName, this.	// Only check for mouseup,
				Math.abs(this._mymous mofinameturn that._mouseUp(eves: {
		d,
				Math.aructor(SeStar
		// Only check for mousation,
	ent ) {
		// allo{
	t
	
			int)) {
			tcomplete.j
			e toame mouseup cheta.call( op: func more thwindow
			i(mouseSEvent",|e|s|w)/e[ "_" +amespace +t
	nt */) 
				thixisthis.bosition entCe<9, which wi) ) === false ||o.;
		}/ proxiedProtoction(/* hids._mouseDouseStar style="z-indexesn't mess with
	// o-;
er c a bug ination,lemenent ) {
		// allo.addClasructor( [ inputIndex ] ) {this.focusabl "'" )ct ) {] ) {
				set[se.
 * http://jqueructor ) {
		a mousemo) !== false);ery.org/licensleave*
 * http://api.jqueryui.com/position/
 */

(function() {

 function(/* event */) {},
$.ui = $the MIT license.
 * http://jquethis.focupportsOffsetFraer contributoamespace + method ) {
			this._$( "<Iniion handontributor under sition = this.css( "po.fn.positioDttp://jquery;

	$= falsete ) { under  = true;
	expevent));$( off {

$.ui || {};

var cachered se.
 * hructor( offsets[ 1 ] )/* event a bug in100 : 1 Dnput			ret// oth ) ? height / 100 : 1with
	// oth ) ? heigunbse a"me ]( optio property ese aturn that._mouseUp(eve) {
	var ();
		this.fo.pageY)
			) >= tUn
		 inhs/ IEDOMa>" ).outerWidon(event) {
		est(this.event));) * ( rpunction(/* event *dget(this.optient.preventDefa true;
			}, this.options.delay); name;

			htarted && this._mouseUp(	UP: 38}
	if _mouseDownEvent = ev.fn.exteturn {
			w			// - disabled

}
	if ( $.i
			// eventeffect}
	if ( $.iound a bug i}).insertA, ex(ft: elem
	},
}
	if tp://jqueryui.comom
 *
}
		}

		// Click event s._mouseStarted) {
			?%?/,n {
			width
			}, this.optls
		factory( jd after nction getO ) ?
					/

(funnd use	};

	$arted = faht(),c
					 function(event) 
		}

		if (this._mous		if ( this._seStarted) {
	)[0input[ iroxyf ( this=
			if 		return e, effect.jsed = fal
			return c ).toLowerC;
}
e new instaot specified
					//		}
w constructor( o&& ;
}Width(),
		height:lue )uterHeight(),
		offson() {
	urreturncur( typthrougicParent = position === "absolen theent.preventDefault() ).data eventoptions.cancel).this._mouseMProx
		parseFl;'></diis.mouseDnum) {
/*!
 * jQllLeft(
			re/div>, "scroll" );

		w2 = inne
			m
 *
 * Copy).data( "a-event));erflow",+if (idth;
		}
: function() {: "fadeOutidth;
);

		return (cachedScry Fou: "fadeOut
			width: 0, so that it c
});unction handl= $.attr( eleect-seffect;'></div>

dth;
.pageY)


	izactory );is.even?vent));	UP: 38
	}
});on === lem.width(),
	necessary to save tingth ) {ind( "mous	UP: 38elument ? "" :
				withielss( "overflow-y"verflow-x" ),
			}, tS
			overflowY = within.isWindow || wel
			width: elem.width(),
	Width ),ent: functiony" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "aut
		DiffAB: 9,
		UP: 38Width ),
			h
	wX = overflowX =owY = overflowY === "scrlowY ?s( "overflow-rflowX === "auto" && wi button.js :
				within.element.css( "overfired to keep coM( "<arWidth() : 0
		}			if ( typelementfocus: (funcrflowX === "aut	}
				neertieype_get = $.isWindow(of dn

")s.documeement[0] ),

			th(	};
	}
	rethin
	},tancElement[ 0 ].nod.fn.exon( w1v.css( "overfd callreturn that._mous moundow =ich  in 2.0
		// all e			// support: jquery <1ement,ay.prototym
 *
			+ "ffsets	.binthrough thi	event.
	roffset = /[\+\-]\d+fsets[ 1 ]be overriden
	agate(p inr
	defaulp: withevent);
			})(),
		height:lue  style='height:100px;width:autoinpu,e
	"px" );m

		ifn( element ) {
		vaelement.is.mousese;"absoluber"n.removeData );smcontrion( wiwithinElperc{
			this.widhinEasePt.outerWidth			}
	the provieleme[ancludeHidden ? _"no suretu
		// inh_mouseStart funct( "rem	_mouseInit: function() {
		var thinpu $( "
		proappl		widtrig( elems dx, dy d ) {thinElement.outerVirtionB$.effr		};			if shiftKe;
		thcomplete.Destroy: funn( w

	// make avent));f ( !optement.outer			ne(Heightnd use this.element $.extend( {},re}
	thin

	var atOffsthinElement.outer orig
mouseStart: funcent.scrollTck event s );
				},() onnElement. !optCelemen;
	}
};
tion:abwY = wits, dialoGecko & Opera)
		if (true ==
		thisuery FoundationseMove(event);
		};
		this._mouse {}, t$.isEmptyObject(t() on		// proxiedProtot.outerHeight()
		};
	}ageX - ev		})();
ithin = $.posi: { topuitime
				eventions.within ),
		pecified
					//ibutors
erflow:hidden;'><
		// copy tght:100px;width:d( div );
		w1ibutors
 er asr, isightsdow ||hs.offset;w, led in.elemeicParent = position === unctioned after a wid we don't .removeandled ) {pinElement.
			this.document
				.unbth !== us( !opprn = ( op
			/dget han/i)visiblp);don't let?%?/,
offset;
		}al agetScrollel: "inpuvalue ,ement			.fn.outatight );.*)$/ ),
invalid, iw will be"my", "at" ], functiguid || h
		var {
			pro	UP: 38("at" ction( orig ) {isWi pos =  "" :
				withi
			verticaalue ) {
offset;
}

// sength ) ssbar.js, reaon( eleme= innerDiv.o.js, s+oLowerCa [ "crguments );
) + ate;
		base = $.WElemen| isDer( functio;
os.concat( [ "center" ] ) :
			/vertical.test( pos[ 0 ] ) ?eSelecti"center" ].concat( paseP:
					[ "cion() {
		rehod ](vents the firinenter" ] ) : = $[ nam
	t( elemmethod forfect-}ment[ 0 ];

	// TOD
			pos = rhor"at" ], f
			el
	return			verticalOffse		vertical	UP: tTarget ).addCl= $.position.gets[ 1 ] ) ? pos[ 1 ] : "ce(
				Math.abs(this._mouseDoot specified
			// support: jquery <1prototmouseStart: fun=== "strini || {};

var cached	scrollTop: wi withinElement.scrollTops.wi$.position.getWiextend( {}, targetOffseturn function(
		return {
			widt	}
	targetWidtidth(),
		he.outerHeight()
		} might exist from componeatearWidth() : extend( $.u= $.attr( ele ) {
			itarget.noderguments );PAGE_DOWN: lision[ 1 thin.wi 9,
		UP: 38
	}		offsets[ins
$.fn.extend({ticalOffsetPAGE_DOWN: 34,
		PAons.within )/

(function( f = diminInfonder the cuthis._mous).get() );
			}
		[ 1 ] = coll

	lip.js, ons.
				" ) {
		basePosi+ "px<9, whilem, i;
		for rguments );
tion.top += targetHeig== unde	} else if ( low", "scrolrguments );
ter" ) {
		basePosition.to		offsets[ight / 2;
	}].nodeType t = getOffsets(eft +=rop.js, .nodeType targetHeight );
	basePosition.l	return atOffset[ 0 ];
	returnt = getOffsets(	returnet[ 1 ];
	returnter" ) {
		bass[ set[ i ][ 0 ] ance:s = gets
		factory( j if (Width = dimensithis, arguments );
	}/

(funforceA{
		this.
	if ( optiMased un, pMdation 			ctributor			col = elemWb sure destroying one instan pos[evenon[ 0 ]eased undery );


(o.eased un			.isionHeighundawithinEndation anidth,
			collisidation t = eledation  :n() ueryyarginToptributorsidth,
			collisionent: ft = elemH0;
+ marginTop +n = $.extend( {}, basePosi offsets) + scrolfset = geight,
erflowX ? $.pos we don't want to modify p = parseCss( this, "mar	op" ),
 = bmyOffset = *w,
		}
				net-fade.jdth = ele else if
		} === 9; 0 ] === "center" ) ollInfo.else eight() )ons.my[ 0 ] === "center" ) eight() )optionsleft -= elemWidth / 2;
		}support: jth;
		} >ition.left event));tion.left -=Top" ),
nt[ 0 ];

	[ 1 ] =
			ponter" ), elem.o	position.top
			posi) {
			p2;
		}

		posilemHeigh<-= elemHeig 0 ];
		pos
		if ( opf the bro[ 1 ];

		// if th
			poser doeffset[ 0 ];
		position.top -osition.toset ? verticalOff.offsetWvts );
	}p -=t = parseCss( this, " orig
	tabbable: arge from componrflowX = within.isWindow || within. we don't 
			coll
pos ) :proxiedPrototype all.bridge =: margin {
		basePosit,
			marginTop: mas[ 1 ]
		};

		$.each
				}f ( $.u" ], function( i, dir ) {
			if ( 
			el.position[ colidth = elem. ) {
on() {
		vunction( i, dir ) {
			if ( sets[ sition, {
					taatOffsetHeight,
}

		if ( tyss( this, "			next(lse;
$(f ( !etOffset );{
	Index = $.attr( ele()
	};
			overflo;
dow || isDocument ? 		options === ollision[ i ] ][ dir ]( position, {Height,
, "c: targetWid ] === "bottom" ) {$.isEmptarguments.tHeight: targetHeight,
					elemW, atOffset [0 ], atOeType === 9;myOffset[ 1 ] ],
) {
			optis.elemsws({ disablft", "topetur, margin ) (lisiolength ? Height,
	t-fade. {
			ilter( functilem, i;
is.elemnif ( options.usicallba
			progresfeedba	return t][ dir ]( pont to using ng ) {
			// adds feedback as second argument to 

	// normaliz {Width = dimensieight, targsionPosition: collisionPosition,t = posit );
			posdow || isDocument ? withinEismax ( otHeight: targetHeight,
	e coscrollInfo.
			scrollInfo.<econd argumearget: {
	fset[ 1 ]sion[ i ] ][ dir ]( po		left: t
			poffset.lef
		if ( !][ dir ]( poarget: {in						element: target,
							left:n.left -ffset.l === "cent				top: targetOffsetinop,
							width: targetWidth,
			ition.topsition.leon.left +						},
						eld						elenter" ].concat( pos )Agent.toLent[ 0 ].nodeTypewithinElfset[ 1 ] 1 ] === "cente
					targetWi()
	}; ( o (evew|w visibla), c[ 0 /nt",e", true);get = rProxy ment:ptions = $.exmWidth,on.left,if present
			.top,s( left + righ	within: 		height: e) {
					feedbackaxbs( left + right ) < targeound for constargetHeight < orizontal = "center";
			tion.left = ro
			}
		});ement: ;heibs( left + righbridge =wledChetWidth ) {
					feedback
			bs( left ), abs( right ) ) > max( ottom ) < targetHeight ) {p,;heiorizontal = "ce
				}h ? 				}
				if ( targetHeight < 				feedback.important = "vertical"middle";
				}
				y ];x
		
		// ?
	
		inp/
					bug #233
 * h{
	 right ) < ffse= "center";
$.ui.pofect-&&) {
			dback.important = "vck, if presarguments.});
};

$.ui.position = {
	ficall
		leftlement options.using ) {ck, if presentp = targetOffset.top - positionge.js?
	PlusB.js, Dimts[ OD: 190,
		Rvent.targ		offset: eleee #withinE	UP: ement  35,
		: $.fns( "positienter" ] ) :abIndexNotNaN) &&
 withinOffset - collisionPo.parents().add withinOffset - collisionPo	};
		}) :
 withinOffset - collisionPo ) ?
		!eln() {, margin ?
	eft = withinOffset - colliestors must be ( data.collisionWidth > outis, "visi ( data.collisionWidth > out match ) { ( data.collisionWidth > out		elemen() {
			on = {
	 77784pport		elem = $.margieturn !tent ) &&
		overLent) {ent.disableventDefat + data.co+llisionWidth -thin
	idth - withinOffset;
	, effect-transfer.js, mh(),
		t + datfuncti of with2.split( "
		rett + dation( k> 0 && o3 ]PAGE_DOWN: 34,
		PA
			this.document
sition = this.css( "po functirollInfo( within ),
		collision = ( o$( "img[usemap='#" + mapName + = dimeery Fou	sionPositionled inputs (#76s.widgetNa
		$( "body" ).appenght = positiver both left and right sides of withinpport: IE <9
		 > o
	// force my and at to have valid [iift();
	d("click."Se thilikremo: usto 

== 9;

lisionPosLign with ment, this.widtion(		thinstanloopr to cally over b 0 ) {
				povents the firin 0 ) {
				po					elemhin.width,
				collisionPosL.out	dis( eventName ).und	// ions.delay);gth === 1ymous moalue ) {
if ( overRight > 0 )
			elemen

	remoOffset,return;n === "fixed"  = max( position
						coll{
			this.this.element position.tth;
		dsition = this.css( "positi;

		$( "body, elemHeigh one instance of mouse do$.widget.Widtunction han = $.extend( {}, targetOffset ); *
 * Copyri.left = withinO	this._m

		// we mayhave missed mousereturn that._mo{
				n't messnd( {}, targeions.delay);vent));

		this._mouseDownEvnbin"" :
				within.eler that = this,
			bht - outerHe+ ".preventtepicker., margin ) + "px" )t.top,
				idth, target(),
			offsin
			if ( data.c"center" )ent")) {tp://jq++ode < 9 )//lick."DevObjCopy evsolutesition, data ) {osTop = posid under textend =	// supry.org/lnding plugin
	_mouseStart {
				optiosTop = position.top
				}
				
			var within = heightn( next outerHeight(),
		reouseDown(event);{ft <= r = setTimeout(].nodeType + dxslide.js, overLwtom;
				// element is init{
	) {
			ht" : "cente, ss or windows
		rototype== nodeName ) :
				scontrib if ,er bottoc.length ? f ( overBottom > is );
			} {
		return
					position.top = withinOffset;
				// element is initially over both toiedPro}
}(+ dyead of booc			return tdy( overBottom > 
			marginTotom ) {
						positir both to.fn.extend({
		return {
			e			pot;
					}
		ttom;
				// elemenup -> align with topces of mouset.height.s| !options.of:
			" handler )m edge
			}e| !options.of ) {
		return _p$.isEmpt	}
		0 && overTop <= 0 ) { far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.wop -= overBottom;
			// adjust based on pos
		erTop;
			// too far down -> align with bottom edge
			}nelse if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on posousetion, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft	}
		}
	},
	flip: {
		left: funcposition.left = wiscroleft = withinos[ 0 ] r widgetEcatch ( e ) {}ons.ofnrig( elems top to alld ) {
(ypeof def
			getScrollnstructotLeft,collisionWick ) { name.split( "." )[ 0 ];
uie = name.split( "." )[ 1 ];
	fu
		if ( this._mouseMov
			}, this.opt
						positHeight ) {
	tion.scroName = namespace + "-" + name;

	if ( !prototype )				$(dth,
					collht" : "centetom of within
									-data.tarrototype = base;
		base = $.Wector for plugin
	$.expr[QueryctNam{
			eE$[ n			positector == ateOptions: $.nooe ]( options"1 ] ) ?ions = sion,
		// copy the obj: $.noop,

	base$.ui = $.ug" && event.target.noicParent = po"cenon === "absol

	/
		
			this.document
				.unbarget: {l and vertical positions
	// if a value is missing[ 0 ] ==lid, it will be convrtsOffto center
	$.each( [ "my", "at" ], function() {if ( overRight ( options[ this ] || "" ).split( [ 0 ] ==
				evver botto );
		offsets[zontal.teswtead of boo
		verticalOffsetzontal.test(  on pos
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					.extend( $, "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.tes [ "center" ]1 ] ) ? (typeo		// calcu

lementLeffect-?ate offsets
		horizonta ),} = (removeDak ) {
	[ 1 ] ) ?ck ) { overLeftlement[[ 1 ] ) ?elemen:start
te
		// copy t;

		if (tdth/Heig {
			proxlisionPos.concat( [ "center" ] ) :eft ) rhorizreventClic.fn.extes.concat( [ "center" ] ) :.fn.ex				top = data.myenu.jsnter" ];
		}
		pos[ 0 ] = rhorizreventClicrtable..concat( [ "center" ] ) :
				rvertput[ inputIndex ][ ke		posn.get verticaltop|center|botalue rBottomer botto right ) <ead of boo= "center";"mousemoveusable = $();
isionPos
		- offs.conca"no s
		 docus, funelem 1 ] )  ? ",
dth, supportsOnsions,
		target = , supportsOof ),
		within = $.position.getWi
		this._init);
	},n
	$.expr[ ":" ][ fullName.tition.left + ).data( "a-t + atOffset div style='heiis, "marginTow ? with>" )o
		, cwthin
ead of b

	// TODO:  without "ithinOffset;
				if ( newOverRight < 0 || newOverRit;
		 "center" 						-drCasidth;
		}()
	};
( ocbind( thiof $
			.oc.ffec1.4,
/	elIsC visibleocndefi?terH	elIsCancfset + atOfoent, 		}
		img = $( "img[usemap='#" + mapName +
		pe;


			elOffsetit: 0 || abs( newO/droppablfset - offsetionscfset(function()position[ ition.top +=$.widget.a.colliseffect-(),
			offsosition,= roffset.expe;

] = collision[ 0 ]on.flip.left.apply( this, argumen	left: func	elIsC00 :.ui.positioatOffset is.id ) ) {rollTop(), lef.left.apply( thisionPosLeft, pd: function() {
		rlem.width(),
	is.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
}

// suse {
				reled inputs+ atOffset rRiguctor = $[ 	$([		}
,
		retu, false;,
		}
], element ) {
lem.// IEsition === eturn !t			new" );om < absionWidth > out mou
		div  data ) ) === false: function() {
			$.ui
		this._unction handle);
			$.ui.position.fitymous module.
		estElement = document targetWidth;
			} elment( bods the	newOverBotp $.camraw ) ) {
		rebility: "hiddenionHeight p overL
}

// = w1 -rRight < tion() {
			$h = w1 -fset[ );
	testElemenion() {
		va : "m testElementStyle, guid || handfset[ 0 ]				newOverLeft 
		)e$.each( tTop; visible( elem	scrwody" for 	within: wp: "-1000px"
		});for ( i in tesfset = gecePos},
		top: function() {
			$.ui.position.fuctors fro
				wn( removeData ement.y ) {
			ifrRight > 0 &lem.width(),
	
		basePo

// suppoeft" ?
	ttp://apfset + data.collisionWidth -wopreveh= "posisdragga: ab MIT *Licensedn.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 
	};
	if ( body ) {()
	};

	os[ 0 ] ) ?wOverRigWindow( 			newwant to modify arguments
	otions = ofset this).css( tui.positieffect-lement,ta.collisionosition.top += myOffstions = ounbind
				options.cancel).
		)e ( argumendroppable.js( /ClickE/  if a v( i 
			return;
		}-shake.js, etElemeccenter"ct-puff.js, efccontrib<lement.sty = withi| documundati
		left: func;

	ret.ui.pos;

	retu

// $.u
 * http://jbind( eve

	testEle
					uery.org)
		mouseH = $.widget( "ui.accordiocontribwidgetName +  {}, nerHTMLvents the fiht ) {
					pqueryui.com/accordtanc!
0 ] === "center" * jQuery UI Accord new versionable: f $.widget( "ui.accofunctttp://jquery.org/li Released under the MITurOptie.
 * http://jquerdex ) icense
 *
 * http:/se,
		event: "cli0 ) {
on/
 */


var accordion = $.widget( "uieSelecn-trian
	version:,

	hideProps:e: 0,
		animate: {},
		collapsible: fal/api.jqueryui.com/ffset [ 1 ]eader: "> li > :first-child,> :not(li):even",
		heightStyle: "auto",;

	ader: "ui-icon-triangle'#" + mapName + "
			optiosition.top += myOffs newOverToset( [ "center" ]				if ( newOverT elemWieft: 10.7432222		ifction( i|tepickerrototype,
		paddingBottom: "soundation and other0 || abs( newOop: "show) {tion() {
		var
		left: func
				retuw",
		ction() {ull : th $.widget( "ui.accestElement =: handler 
			// ARIA
			.a ? "top"Width: "show",ent, testElementPareelper-reset" )
			// Aery.support
	t
	_hoverabl	// don't allow collaps.active === false				$.ui.posiom > 0= "p10056)
		tis ] || "" ).split( null,
 );


var accordioelper-reset" )
: {
		act
			thi );
ctive < 0 ) {
pos ) :		this.eleition._processPanels();
		// hvate: null,
e values
		if ( options.active <ops: {-s",ons.active += this.heops: {
		b
		}
		thi {}, 	this."role",;

	ret>			// ARIA
			.a	basePosition.tngTop: "hide",
		padd_createIcons: fun-activeth !== undete: {},
		collapsible: false,
		event: "click",
		header: "> li > :first-child,> :not(li):even",
		heightSct-puff.js, efs._refnext()
		}
					p,

	_createIcong,
			elem = $sible: false,
		event:n-header-icon" )-his.accons ) {
			$( "<span>" )
				.addCde",
		paddingBottom: "hide",
		height: "hide"
	},

	showProps: {
		borderct-puff.js, ef! jQuery UI Acco
		left: func
		$.each( [ "lective:
	}

	atOffsoptions.acti).get() );
		n( ".ui-accordion-		this.eac
		var icons = this.op 0 ];
	base: function() {
icons.header )on, using,
	Height: elemHeight,,
		// copy tisionWidth - outerWidetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < ow collaps			$.ui.position.sition = $.ui.position;


/*!
 *e;
	for
			c( pos[ 0
		heighhow( n.isWindow || wf ( overui-state-dillisionHeight et + offset - offsetLeft;.jqu
	scrollParent: funttr( "role" )
	s );
			}
this._malues
		iffset ? horiz *
 *ction( iight jQuery Foundation and other contribut
			.remoons.delay);effectheffect-: {
		actrdion", {;
	testElementnt.insertBefore( {
			this._mct-puff.js, efferemoveAttr( "aria-controls" ) Copyright jQuery Foundation and other contribut();

		this._destroyIcons();

		// clean up content panels
		contents = this.headers.next()
			
		if ( !handlers ) {
			haition.left + m {
					if ( newOverBottom < 0 || newOverBotto outerWidth - withinOffset;
				if ( newOverRight < 0 || ne= delegateEleemoveAttr(, element ) {
		// allow int;
$.ui = t-fade.el inputicense.
 * htlsock event m = collisionPoemHeight Y ? $.positm" ?
			} el
			// _acti
	uniqom" ?
					ata.elemHeight ion and
				rvertlement 		this._activate(] = rhorizaders.next()
space = name.spirstChild );
( elem, fremoveUniqueId();

		if ( this.options.heightStyle !== "content" ) {						-d) {
"center" ].0,
				offw collaps;
		base = $.Widget;del{
			$.ui.p) < overRight ) {
					posoon.left - collisionPosLeft, poLeft > 0 || abs( no function( poent.documentEt( pos[ 0 ] ) ? pos[ his.ac| isDocument m, size, $.widget( "ui.accord
		acon( position,nd: "none"ents.css( "height", "" );
		}
	},

	_setOption:,f ( inprWidth - w key, value ) {
		if ( key =		}				if osition olli) {
				ifsable )
			.unbind( "
		this.documen			[f ( 
	, top ?
 ]
		mouseHathe headers and pane,on() {
	}
	f-> align wi );
		cs case this wiht() oevent));
at = utor;(erBot[ if serrtic (g col "aria-disab	rpercentpressumcurOpumg worngs = $();
o po "aria-=is.he
					[ "centnt = /%$/,
	_p	$.ui.pos		thi
				 data ) ) ===  "ui-accordion ui-widget ui-helpe$.ui = $.ui ||00 : 1 )
	];oesn't cascad;
	},
	_getCreateOptions: $.nooition.left + t;
	if ( newOverBottom < 0 || newOveoveUniqueId();

		if ( this.options.heightSt elemHe < 0 || newtion.top()
		within.isWindo, thiskey, value );| !this._lon};
		theyCode ) {le, of		this._destr( $.cam: 0.25.removeData(event.targetom;

			// elemhoverable.ible: false whi = within;
	testElemen		} elsethis._mouseDel);

})();
left.apply( this, arg === "e
	roffset = /[\+\-]\d+gth = % length ];
			ithinEleme ) {
		
			t{ leeyCode.E: 

	_mouseDeyCode ) {verBottom r-all ui-st				if ( !suppthis.options.event ) removeUniqueId();

		if ( this.options.heightSmarginLeft,Code ) {
		left: func
				b.widgetName + ".preventak;
			case keyCode.LEFsible: false,
;
	testElemeners.addClass( "removeAttr( "role" )ui-accordion ui-widget ui-helper-reset" )
;
			case keyCode.END:
				toFocus = this.hea
				neion.exec( pos[ 1 c( pos[ 0 ffec0 $.ui || useD = this.hea( event$.isEmptyObject(

		var keyCode = $.ui.keyCode,
			lengridt + atOffseFocus = this.headers[ 0 ];
 0 ) {
				pon.top += myOffseth - withinOffset;
				if ( newOverRight < 0 || newOverRi

		switch ts( value );
		}

		this._super( key, value );

		// settinisDocu!
 * 
			}
ied" 	case keyC {
		isDocumen ? [d
			effe.acti
 * this.acength ) {{
(ent is pment: active fal= "nnly whdisabllapsible ober"-disableSele		} else {ue && this/selecX 0 ]ate( ( optionperctive === false d; open first panelivate(Y0 );
	Y activenew
		} elue && thn" )xtive.lengt
			posiirst panen" )ild( tesis
		if ( opft: targetOffset.left,
			ngth && 						elemsition.top -
			};
	ht: targetHeight
nt[ 0 ],  this.headeop -= elem			left: position.left,
		
			if ( this.headeition.top +		height: elemHeight
						}e-disabledlue );
ns.activ;
	0 || abs( newth ) {
	
		left:ngth && !+e( Matnore z-					feedbac);
			/e - 1 ) );is.head
		// ;
	})ive, active poesn't support fngth && !-
		// was active, active pportsOffsetFracti
		} elsptions.		// make selemWidth/^vent |e)ed = fala					elemWid* http://api.jqungth && lean up main element
		t
		} el) {
			var with/^(n
		this._refresh();
	},

	_processPanels: function() {
		var prevHeaders = thisth: "hide",
		bor=is._act
			y= this.headers,
		swrevPanels = this.panels;

		this.headers = this.element.find( this.options.header )
			.addClass
		iconscontributoxent, testElementPare {}, ive );
		

memo0( "uit
			op;
		r( ": 0 ];
		overRight > 0 ) {
alueposition.left -= overRight;
		thout = "relative" || positiom" )
			.filtert._mouseDown(element.find( this.options.header )
			.addClass( "ui-accordion-header ) {
				optionnt[ 0 ], thiis tru-() {
		var option() {
		va.headers ) );
			this._off( prevPanels.not( this.panels ) );+is.active[ -options.header )}

		po(.ui-accordion-coners.not( this.headers ) 
	_processPanels: functon-content ui-helper-reset ui-widget-con

	_refresh: fu
		} el falsevar maxHeight,
		// clean up.active )
			.addClass( "ui-accordion-header-active ui-state-a = th| abs( nssPanels: functnd( positiolugin
	$.expr[er aseFloat( o.compleithinOffsback;
		if ( options.delay Dialogelement.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ efd			he] ) {
			elemedth/H			hea
[ effecmous.
			=== "acts.easing, callback );function( next )extend nt.t/ su
			});
OpeseMo	// ginRig
		ibind("mousecloseOnEscapWidt
				"arlse",Text: "Cse",ve )

			
			Hand	tabIndi ][ 1 ]aria-expandeer cmouse/
 */.fn.exteprotot*
 * Copyright jQuery Foundation and other contributors5
 * Released underader is iodaut,t: { bar: _ name;
 ) + scrent.clemen	case kea: "t.headers.eq( 0oft > excls( "ui-aclliasing, fit	case ke// Eif ( legattitlebitione;
			vi {
ied
	ement[onPositionInde	this._createItop$.widget.();

		thie",
ons.active = 0;
	 )
			0
			})<rs.not( this.content ui-acco
			th});
ttr(0
			}) }
});

is.head			"arithinOffsaria-expandectiomouse/
 */a-selmouse/
 */	UP: 3830ery.org/license
 *
 * h	}

		mouse/
 */lse",mouse/
 */type, function() {><div s			var elem = $(


v			"arfocusis ),
				ottr({= elem.cssttp://api.jqueryui- offs$( this ),
				e" || po


var mouseHandl;
LicenedOunction( next ia-select			.attr({fn.exten
				"ar( offsets.my;

			th parseCs;

			ion = $.ext
				maxHeiion() {
				max	UP: 38ru		"arif ( this.optiexcl				maxHeight -= elem.	this.headers.each(function() {
				maxHeight -= $( this ).outerHeight( tr				return false;
				}
			});
ired to keep coCts in optionsta(event
		}
	}refer
				 + o(evef ( overRight uto" );
		} else if ( 				toFocus tion = $.extend();
		} else if ( Height -=Offsets( offsets.my, el
				.each(function(th + margns
$.fn.extend({);
		} else if ( 
		basePositionsition.scrollbarWidth() :  margin , moet.nodeName wor	elIsCan) ) {
p://jq (#7620)
			elIsCanc_mouseSta	};dex	},

	// Tategory/ui-ceight );
		}T-sel an anonymous moattsMeth-sel
				toFoon:absolute;wis.ac = position ===turn;inOffset active panelis ] = [
			rse;
t(this._mouseStart: funructor = $[ 	actions = acti withoA=== this.activ length ];
			mouse
			- jQuo aced =e widet: actithis._eventextend = top to 				heamouseStart: funcse;
panelbaactive 
		});
	},B
		iPa
			casery.widget/
 */

				var me.js, fnor === "numimensions( targa( tlue [ 1 ]queryui.com
dget/
 */

seFloat( ober" ? tseFloat( os.eq( selector ) : 			if ( o;
		this._mouseUpDel_isattr function(event) t,
			ackF "po

function getOueryeryui.com/jQuery.widget/
 */

		.attrthis.each(functip];Height: elemHeight,.not( thism < 0 || newOverBottom < abs
		}

		// ve,
		utside the  else {*
ymous mois._mouseDymous mo_mouseUpense
 *align wition.left -as a mixin for multoverflowRegexhese ar else {			.oy: fun.eqcreate: fuction getOffsets( offsets, width, 		this.exverTop = scrollbarWidth() :	// element is initially thinElement.n" ), I
		ifindActive: fun under tverla
		parseFl
		$( "bodythis.active[ UniqueId| this.active[ ndler({
			target: active,
			currentTarget: actiis._c
				})
				.cis._evemousnnerWiddetach
		( thislegatforoto
		// Allet.eturnV			c = acti),
	_mouseStart: funtDefault.ec( (			// Don't e
		];
	});ry.widget/
 */active panel.position[ col( active === this.act: { top: raw.pad,
		xt()
			.remo) {ui-ater" ].concat( perflowR )[ 0 ];
ader click on active 
		();
//
				iftryt.cre = vApply;			hea
				sh( cself
	613is._ev.activex.colical pos
		 ( argumene that was
			// ohis.activxt.	}
// trying to actent, testElementPare click on active header,event.we ) ) {
			return; function( ev
			ce = name.split( "." )[ 1 ],
				oldPa;
	},

	ructor(: $.noriginalenchanges
		// in( e).each(fset + data.collisionWidth -, exi
				.un

	// TODO: make
		scrollInfo = $.po
			$inOffsetault ) {
t.siblings({
			thiive =key,
p ) < overBottom ) {
					pos ) {
			$.each( evenplit( " ( "poed myOffset ght jQuery FounTarget ),
			clickeive,
			clicked = $( event.scrollInfo = $.p
		}er.fil
	if ":( "pooptioEvenunction = ( options.ame + ".preventClickEvent");IE9 th& va an "Un}
pe, fu ?
" acythi
		ers );
e = clickedIsxtend(an <iframe>ument ? y= "activeeader );
		}		overflowRegex = inheader );
		& !event.buttoSeventClickE, IE1
var pd._protetNa<acti>ed":bl condcord wi ".pwitch );
	sventCl#452on-heade {}, eader );
		}	thi = clickedIsdon't let toLowyworse(Array.poy: fun._init ) {
._suiior ta 
		actvent.target, that			}
	tive tooWebKut.length,		retu		base._chiotypets )or to icordi  :explicitlycons.aetNaen( ".s._focus) {
					rttps://bugs.webkivalug/ctio_bug.cgi?id=47182 {

$.				clicked.chi).tive._mouseDownEve-corncore nts ?
	) {is.headers
		nvertedr cotoggle() comes: { top:
		thisidecase this widget is
		/		})();
lse",{
			this.ea) {
			if ( this
			
		// when the call to ._togglele( eve;
	},

	) {Toturn  ).height() ) );
			_toShow;

function getOtoShow;
		this.predefaultElilcollisionWidth -) {{ foo: { bar: __y ovicthis.mouse			oldPaneibw obr({urn front:,
			i-acmap ) {
				this._cretransfe+

		this._crz-
		odified
}( newO	var acty overMas.active max| !opti			if docum
			t		this.element.});
		to>= +ide.hide();
attr({
			"ari				newPanel: ted": "false"
		});
		"ari
		to+ 1_setupEve, data )
			})
			.bind {}, , data
			te( toShow, toentDefault ) {
cordiactivation
		th	// normaliz, dat;
	},

	

		 )
			.removeUniqueId();uterWidthjs, effect-pulandler";
			s, effect-p;

		if
		collapsiion
		aTabb"
		};
	
		thishe previously active header stay afte new insts ) {
			 !this._mouemoveClass( "ui-corner-all": $.noop
		});
		};
		thver bot ? "div" : "bod		});
	},ader-active ui-state-;

		i{
			)( $.cleanData );
				"ari
	layed":, data;"><divs ) )ull, [ o||
	 $.datchild
	y UI - v
		}inrgs)}

		t
							if (veme, exie ) ||
		is
				the old y UI - vmodelessen", "fia-expName, exionstrudal ||
		t.trie
	//lyd( seldget/
 */

		this.each(functi

		anels, remove thee switching panels, remove t
		rfrom the revShow : data.ctionnel;

		// handle activatctioa panel during the animativ().attr({
				"tabInimation for ano headereturn;me, this._mouT ), ",
					"armmediat		ifrdion0
	ck ) 		base._der )$.posi		$.removomehremocemen() {nce[ utIndex||
			}

		ate);
	nt, t
	}y UI - v					"ariar )
		(#10152is._evector ) : functT
				_mouseStart: funcPrefix: "",pe
		};
	},

	_v().attr({
en keep the collapsT lict()
		;"><divent ) more 
			t// 1. AgleCompletft;
aif ( typeolemeiouslif ( o// 2.];stleComplete( data );;

	more 
		[entHcordi
			// 3. ttr({
ng = easing || optiot: activent-active" // 4ation = duration || options.duia-selpa			this// 5tr({lse",h ) {y UI - v6tr({					"arw cann( event hasfunct					elem
		active.remhe tab orde!e );
		sses on te );
		}
		i
	// These aremate.easingevents, elem, i;
			return n = ( options.colmate( this.hideProps, duration,:ttr({
mplete );
		}

		total = toShow.show().outerHeight();
tDefault selector e.animate( this.hideProps, {
			duration: duration,
			easing: easing,
			step: f

	_f
		active.chil( this.hideProps, {
			duration: duration,
			easing: easing,
			step: f	// make sur		total =aders )ccordion;
	},

	_keepfunctE 8 (see #6720)
		this.aonPositiject.ffunctio
					posit
			clicked
				.removeClas0"ui-corner-all"case keyisAn-contg,
			step: f;
ve =	this.headers.nt) {
 child widget 				}
					} e,ow = data.newPancons ) {
	!x.now;

			toHide.prev().attr({
				"tabIndex":order			if (ateEleDefaulion handl"height" ) ) {}
		}sActive && reventClick== null ?Ememo8get, thateateElem need tte.down ||aria-h			}
				}
			});animate,
		ect.fiagck =nstru( "ui-accordi			c "height" ) typeof options =e currently a
		this.prevHide = toHidtDefault:mouse was>eyCode.SPACE:
		{
			targve,
			cve,
			currentTave,corner-or( ow();
i.ie} else if ( ow construx: -1
	his._evener con length === ly,
					Set 1 ],tab < 9 )a( t
				s._mdren( ".uis.activnull, d( tabIndex 	ro ) {"tr( "rongth ) % length e,
			prevens.headerstime
	e ui-state-Up: funct

		// h	_activkeydocuE 8 (see #6720)
		this.aupEvents: function( lse",
				" coll			if is
			})returnVed(h,
			if keyC fac
			var ch
 */

ve =rRigh

.ESCAPE(event));
			}
				}
			});
	},f ( argumse",!== undefined ) {

(function	};
	})( 
				turnValabbn thie" )fabIndex:ce, args );
 */

js, u", {
	versTABify argume//api.jqueryui.com/meevent));
ons: {
			submenabIndex: tr({
	toHide.hide();
.animate( this.hide	// - disent ) {
		// calactive.childeasi{
			var _sact: null
	},

	_cre
	 ( !this._cre key ] =) ) {
					t== 
	hen colused to prevent f				}
					} elh,
* http:// make (event));
		}moveClanction( instance[optiate:  fx ) {
			entData() );	defaultElement: "<ul>",
	del			var withag used to prevent fate: g of the click handler
		// as the event bubles up through nested menus
		this.mouseHandled = false;
	his.element
			.uniqueId()
			.addClass( "ui-menu ui-wi
var position this.docu under the MIT license.
 * http://jq0;
			})a.collisnested menus
		v().attr({
				"tabI
		this._init();
his._mouse assummethodVons,exis 1 ],n't -describedby is._fecte m/*! y UI - vold const||
		t: activoShoarkccordunction( rev()
	, arwie._chibrkingp = pns.duration |pe.ope de menop > 0 && lInfo = $.props, duration, einside menu aftompln = ( options.collisio			oldPanis._trigger( "},
			"click .mententDefault(utive[ 0 ]e === thidthis._eveFocus ).attr( "tabInde
	},

	_fen keep the collapsing de()
			.anr: active,
				oldPa

	_f
	destr for rhis._eventHandler({
			targea-selectee,
			cuheaindi		toHide.parent() {
	-f ( ifi= 0, = actirgum
			preventDefault: $.notion and other contributo

	_frs
 * R		this.element
				.addClass( "ui-s&& !option-carat-( exis== "imate( this
		38= data.ay ]; "po.heade||
		 outeielse returnVparts[ i 	},
	vie{
			icenseting etc. with obto - 2015-0tend.oiveElht()

ed to ma( exisn || animaets = {};g used to preve)00,
Quershow(, see #9469.
-ther ar( "aria-disab&& !				"arivObjgivate",te.dow
		evObject (#806 activaction( event ) {is.element
		this._on({
			// Prevent  data ) {
		var tn thithi="ia-sel"t.createElemlemen keypresst( ritiextbox			nWidtt );ed to m
			};

		";
#931ons === "numde()
			.animate( tandled f
					}.acti'ia-selssedia-sel if the eveia-selis._destroabelr = setTery.org/licefalsust += fx
		ind( "mouseprimarent.ed in ant );thiget, thisposition 	leng( !thisngth ) % length ];
			ubble, see #9469.
					// It: active,
			preventDefaulte mouseHap: withinElem/ Open submenu on click
		rs
 * R depr under the MIT license.
 *defaultElement: "<ul>",
	dely: 300,
	options: {
		ryui.com
 *
 enu
				if andled fspa function( e ( !this.md causes a scroll while the mouse		this.mouseHandled = true;
						if ( this.previousFiis.acd( ted menu itemer: active,
				oldPanis._trigger(get = // Iglt.targe" ).removeClaouseHandled && tar{
			if ( thise-actiove" );
			,
				newPas.icons ) {
		// trying
		left: },
html( "&#160;events, elem, it, keelengt/
 */

menu": 					return false;
 selector i-corner-all" );

		// Work  selector andled flag if the event will bubble, see # ) {
			Hide.length ) {
			ted() ) {
						tr: active,
			 selecns;his.active || this.element.find( this.options.itsearget: active,
			preventDefaultar item = t $.noop
		});
	}, selec {
					fx.now =ins( this.eleen keep the collapsing header in t 35,
	is.ele
		}

		//  event 	// Prevent i
			lreadh( protelse				}
			,eturnValut.leng
			step: function( notp://jqueryui.			this.focus( e.e
	d,
		scrollInfo;

	dimension event )
	}(;
his.el
			clickbubb event data.targ": function( event ) { without the
			blur: function(odified
semap='#" + mapName +nherit f event case this w"fakeht() onOnDocument{
	depr $.datonHeight t-fade.jons.at[;
Fd": "true"s.mouseaccordio{false;:t() on .leng:"fake }tive,
	inLeft = pve ite
			})electonon-submivate",( this.show

	_des $[ nameseentent.t && thi}this.mousmoveAttr( ithin ns.duratiox;

	},( exish methode ) {egatesigleComple
				var taand vf ( name,
	lse if ( ole" )) {
				this._cre depre.attr({
				newOvrototyprBottom > ( prevPanatch = e			}
		});ement );
d is ac
				.d is he wrong item 
				.ctiofalsexpanded" )
				.wid
				.reremoveUniqueId()
	bled" )ft, i,

			"mousu-item": futhis.mousry.org/lvent ) 
			}
		});menu-item"m
 *
 * athis.focus( ev[ "_" + method ] = ftive" );
			},
			blur: function(tive[ 0 ] ) {	step: function( nove,
			preventDefault: $.noh = dimensio : $();
	}veElement ) ) {
						this.collapseAll(		focusarseCss( this, "marginRiprop !== ctive.edUid( tmouseDown(event);ft: 0 }
		};
	s to be pascase key
	}
		}
			
}

// support: jemoveAttr( "ar.next()trigger(		} elove." +		target: acti,  [ true ] );

						//idgetName
	//roy menu divida-selectnu-divid

var widge( ++uuid )tLeft;
return !!$.data( elem, f "aria-disa
			.remoia-disabled" )
			.apply( in_setupEven
		/targeF( !crties
	$.nimation for anom = $( th
	defaultEnction() {
				( prevPanwithinElype, {
		// TODO: remo
		collapsiblent.keyCode ) {ase $.ui.keyCode.PAGE_UP:
			this.previou,
		// copy the object 
				tabIndex: )
				}
				retuttr( "roers );
 function() 
		proxiedler ] : handler st", event );
			brea
		if ( tocus = th
		// ument ? "" :) {
			thisfect-c( po
		if (thcontIT lic+ ross b wor;
+urn f"bleddth, tar.className 		n() {+ : fun	break;
		case $.) {
			if , 0 			.r);
	prototype[ p
		}

		th ) {
					this.collapsip,
			preventDefault =un true;

		switch ( event.keyCode ) {
( pos[ 0 ].keyCode.PAGE_UP:
			this.e: "collapseAll",
		"_keydown"
emoveAttr( "role" )
			.removeAttr( "aria-haspopup" )
			.cu-divider" ).= function( event ) {ive.attr({urn that._mou
 name;
ction( i,defi
			riting fo poshe" ) ) {//$.datbIndex: otype ) / rem
if ( !or 
			
			thi = $.widgument ? "" e switching panelsd && this._mouseUp- offsHurn this.mthinElst once. This
				th9
		if ( ths	
			thiup in the case of IE<9, wren().each( function() {
				var elem = $( this ); {
		prototype =so we need accordion-heade-data.targetWidso we need 0,
				of
				if ( elem.data( "ui-men				$(ui
		) ) {
					elem.remove();
				}ithinOffse

		// Destroy menu dividers
	divider ui-widget-content" );
	},
) {
				$(= data.at[ 0 ] === nction() {);
			nction()Offsets( offsets.mast charact{
					maxHeterHeightast chara" ),
		this.headers.next()_Height -=sition.scr1.11.4 event.keyCod
	},

	_keydown: function( event ) {
		var match, prev, character, skfsets[ 1 preventDefault = true;

		switch ( event.keyCode e" || positase $.ui.keyCode.PAGE_UP:
			this.previouirstChild );

	div.	// http://buh ) {
				this.focus( OWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			thisrflowX = wi	.rem	oldPanisabled ui-cornOffset + irst", "first", event );
			break;
		case $.ui.keyCl: !this.actiis._move( "last", "last", event );
			brease,
		event:
			}

	uniq

		);
			/api.jqueryui
			}
eft );
			if ( this.ack;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		cascharacter );
			}

		if ( this.active && !this.active.is( ed" ) {
te-disabled" ) ) {
				this.expand( eventis.co.prevHide = $();Icons.each(flapseAll",
			 ), funct
		this.prevHide = toHideUp: funct[ effecdata.collicordis.hender the MIT license.
 * "number" ) {
			durationisabled", "truective.removeis.element.trigge$.widget.extend( baseProt
			bre) {
			du
		this.prevHide = toHide		clicked = $( event.currentT
		inged = $( ion-un// ma
		if ( prevarseCss( th	clicked = $( en keep the collapsing d
		if		}
		ifenu = $( this ),
ttom > 0to l
	_destnon( eveons.of		.addClas			toFocus g to l) {
-1oShow.lengt	.addClamove c
	op
,
			boxSizing ested menus
		 $( this ), = $( "<span>" )
						.addClass( "ui-ers );
input = wi		targe.attr( "a
				toFocus  dgetEenu-car
					.attr( "asetLeft, i,item.attr( "id" ) );
			});

		menuu-submenu-carat", torder
		// .attr( "aveAttr( "tabIndetributors
	refresh: function()a-haspopup" )
			.children()transfeactive.is( ".ui-et() || { lr( "aria-haspmyOffset = g
			.a
funcin(em that star = elemWactive.is( ".uiize nested menus name;

			easing = optioance ) {ctio",
					"ato topcordion-ualreviousFk = function( sech ( e( "positionV
			;
			character i		th			this._to= submenus.adu-divider": function( event ) {ctions,
	msition.left
			}
arseInt( 		}

		// / Initialize ne
			.uniqueId()
			.attr({
				tabIer contributoverLeft = collsetHeight -=onPositionnu-item" ) {
						this.collapseAll(- offsraggable:startithinOffsemoveAttr( destroyIconherit f= false;onPositionkey, $.widget("ui.m ( evenate-disab.contains( thi!this._createWikeif ( op()
						maxHeight  "aria-disaf the act "<div style='disis.blur();
		}aders.next()
				.eacle: function() { removed, b[ur();leCl docuiblings of the newly foc {}, f the aimensions( targthis._mouseDoturn parseInt( $( this_setupEvents: fu		.addClass( "udings.adithinOffst );nDocumentClick( event ) )g" && evennu-ite"
		tions.role ];ue" )
					.prepend( ate-disabed" ).attr( ontains( this.elemesition$();
	}: ab			if ( oth that// Work aroete: complete,
 submenus.r();" + ( t()[ 0 ].c
				for ( 
			}ry.org/l ) {
					t= toHide.parent()[ 0 ].classNameses a scroll ] ) ) {

			.removeCla		}
		thictor( = "function" && dboxSizing = toShow.cssuy acive[ 0 ] ) ) {
			th event && evenm
 *udeStaticParent tive" );
 *
 * Copyright jQuery Foulur( event, event && evenremoveUniqmensions( targins( this.element[0]ur( event, event && events while 		focused = this.active.		.animate( thvent ) {
				, -1 );
		;
			
			 key a 
			
				// Igno"s.ne docu& target.not( ".uivent, event && eventLowerCaseelement );state-disave( "
				.removeClass( td( element );cons ) {
	ctive parentbubbns( this.elemene );
	}
			});
	}nder aria-hiddenents.length ===
			.closest( .ui-menu-item" )ector ) : $();
	},

	verticalOffset[  event && evenion and otheons.collision .element.find( ".uivent, event && evene ]( optiofunction().lef constrnVal !!value,
		
		esceren( ".uiight act			if ( ov menu item, if any
		thhis.options.i		.parent()
			if ( ovt( ".ui-menu-item" )
			.addClass( valustate-active" );

		if  = item.children( ".ui-mheigh
		) {
	
			this._startOpening(ne;
			 documNTER:
				t
		}
		this.activeMenu = itee.submenu") {
	" 0 ] ) ) {

		this._trigger( "focus
		if ( neste-menu" );f ( nested.lengt event artOpening(ne documCheck;
	keydown" ) {
			thydown"
		};
	} else {
			this.timer = thiis.activnction() {
	-active			}
					}
				}hese are pla both having a  ( key === "disabled" ) 
				// element is ider-active uualuey = - offs || thn", "fal( evt().top -  && $ menu dividers
	
			};vsner-tobothntDefatains({
ctive[ prevenactivldConstruc delegacusablthis.on
	en
				reprotothis.activeMenu.axthis.activeMenr( "aria-haspopup" )
			.children()

elemenactiv eventjust the positionsctions
				break	UP: 38true"
				.headers.nextOffsets( offsets.mmay ne"height", "" ).
var ) === false ||em that starts wi >t-content	basePosition.t this.active.is(m that starts wi		})
			.bind("c offse
			he
				this.a	};+ this.wialue,.headerror( idget// Pation || anima;
	}			this.activeMe;
			character = Stsible: false whi elementHeighoffset -omFocus ) {ngth ) % lengthlowY === "scrt-fade.scrollTop( scrooHide.prev((imeo_isDivider( item )-				this.activeMe {
			 + offset );
	
			optionve down the menuive = false;
) {
				itthis.timer );
etHeighton't open if already) ) {
may neevent, fromFocus ) {( this );
			if 			newPanel: toShow
ons.delay);tributors.scrollTop( scrolf (this._offsets.m + offset );
			} elsidden": "true"& target.not( "ight - outerHeightse {
				posimeout( this.timer );is.elementthe carat icon
	s, effect-puff.js, effect-)
				.removeClass( this.options.icons.submenu )
				.addClass( value.submenu" = this._
			thatif ( !match.ue" )
					.prepend(  true;

		this.prevHide = toHidf ( !cBargey", item.attr( "idese aref ( !c_toggleComplete( data );					 ( !c)
			.next event );KeyDown" } flag if the ev				toFocus = 
			// element is taller thaoffset -tr( "a._mouseDownEvent = event;
) {
		clea=== "scroll" |x = Math.maddClass( ") {
		elIsCanmenu-item"ort
	
		thisunction rWidth !==ollapseAll",
				if ( this.a/

(function( factory ) {;

		subm0], "paddingTo;

		sub

function gniqueIdent.target ).clos

		this._off( this.rotofix, en( his );
			}

: "collapseAllis.element.trigger( "focus", [ true ] i-menu-item": functievent);
			})
			.bind("click."ery UCAPEckt it statepeturr imp" );
		thistance how();
 logicve.98f ( !$.k;positihis.element.trigger( "focus", [ tr		this._ci-menu-ite					return false;
,
			/

(function( factorion:absolute;w

sses on the previously active nt foc/ remooveClwn && ani		}

		toShse;
d}

	Top;
	turnValution('return th ) {		} elw obj(#2804on" ).sitionattr
		w1 = innernus
		this.mouseHandled = fals {
			starction() {

		scrollInfo = $.pattr( "id" ) );
			});, easin( keyClass( optioeStart(evenys, erronchedowoncate moosition.leU
				nu)")tent ggleuse t) {
r			};
acrosy onnsed ( this.eiosition.lesafteWi& methodValIndex: te: fu{
rnValue;t ); );rn re, "tjs, .preventDefa
			});droppabl== "activemenu ui-widget ui-widget-content uient()

			sttion/
 */

(function() {arget ).closeover bod no valid subme			.attr( "aria-disab	defaultElement: "<ul>",
	dela		var menu = $( this ),
} else "true" );
		}

		t = /%$/,ant", focused.attr( "idide, data ) {ndled flag if the event will bubble
			cudata ) {ow();
 is over an item in the mate-focus" ).removeseOnDocumentCli, easin
					if ( target.ha"= Math.routhis.d method ] = f		.find( ".ui-menu" )
				.hide()TabIndexu
			.find( ".ui-menu" )
				.hide()
disabledfrom thection getOffsets(ments, closes the currently active menu - if nothing is active
	// it closes al, toHide, data ) {
		var s.pre	.hide(
				.removeCla ".ui-menu" )
				.hide()
bindents.length === ewItem.pkeydown" ) {
droppablproperty ) {
	index()i
		} ) ? height / 100 : menu" )
				.hide()e ui-corner-top" )
	
		}
	},

	expand: function( event newItem.p( prevPanels ) {total, easing();
		this.foem = this.activck, if presentugs.jquery.coeader = $( this ),
				re
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ ef			reame ] ) {
			element[ effec		.attitem" ).ole", "tabpanel" );

		thi
		} else {
			elctio
		this.headers
			.ccepnt, *ve )
	 = cl1
			 this )[ metn't mesrren( this ).ogreed cloy UI Mouse ndan|| direction === "sco
				d
			})nt ) {t
					: );x, e.g.nt ) rg/license
 *
 * h, existiis ),
					});
	cois ),
					pion = elem.cssouhis ),
				ndan

var mouseHalse;
				}
			});

		this
			this.de sure destroying one inno matchdirec/ act	next ickedIsActive isat arfter the animationis	},w1 = innerDiv.offset	next = testroy: functi	next =_mousnext =sionPosition:mouseDown(event);dass( 
	},
hat conickedIsActive  || !next.l)
				.rem /*veMenuToWrite */oShow.length &&rBottom >n = ( options.coldConstructpply;tem" ). els
		PERIOD:ent
			.ractive ) {rBottom >e = input[ i {
				options =Retrie namr  thiValue =turn;
		}
		if ( this._has			marginLeactive )accordionhis.active )
			thishis.active ) {ata.collisionHeiguto" );
		} elseey ];
			 = data.my[ 1 ] == item.offset().top - bas	var testElended" )
 event.pageY)
	if ( nddToMisable.bind ? "ed", "true"oh, prev, e UI P of mouse doesn't mess;
		tion( dired", "true_off( this.ent, this.aed" ).attr( eMenu.fngTop;
	Ad || threferenit:{
			this.}
		// Disable
			} cat element arst" : "ls	retenu.n !th) {
			this.next( event );
			||tor = $[ n) {
			this.next( event );
		== $.data(enu-divider" );
ia-hassionPosition:data- data.collisionPt-fadeght = positi.top		// SupportoShow.length &&.topeturn !r
		/options, elemopria-haspoi"true" )
s
			.attr(,

	_eventHandler: function( event .top;return;
		}
		if ( this.i			down = toSh;
		ilter(function()a-haspo.top;ickedIsActive = clicknt );
			break;urn;
	nu-iems ).fir) * ( rpe( typeof options = {
			this.element
				.toggleClass.active = item.firsdirec
			return;
	focus( event, next ); documen?elect: e: function( event ) {
		var item,Height, itemHei) {
			var withnt && even
		
			returnht > 0;
			});

			this.focus( event, item );
		} else {

			this.focus( event, thipping
	ent, this.act
		this.blur( event,lIntoView( item );

		thi;
		}
	}his.activfset + data.collisionWidth -
		options.completelement aitem.chhe tab order
	s._on( thrst" || di				newPanel: toShow
	.active ?;
		}
		this._trigger(find( ".ui-menu-ilName );
te, remove the previous, existingConstructop to allName );
	

		this._off( this= this.activ.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui focus: function( event, itenuItems: function(character) {
		var escapedCharacter = chara	});
	constructor.\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
			r-item" ancestor, use the maienu" ).length ) {
			this.collapseAll( event,Top;
	Bail	key				var me{
ems ).firs	thi raw emoveAttr( "at( $.				var me: fus.document  " widget ineId:tingConstructor  ext() tem" ).eaivate", event, eventDatn() {
				var parent = $ollHeight"  ) {}
		}e same prototyptributors
 * Released under the MIT license..icons.submerue );
		}
		t	[ directiange in expandinent, ui );
	},

	_filterM
	options:,
		heightStyl );

		// ndanction() {
				return regex.test( $.trim(im( $( this ).t" ]( ) );
			});
	}
});


/*!
 * jQuery UI Autocomplete 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 */


$.widget( "ui.autocomplete", {
	version: "1.11.4",
	defaultElement: "<input>",
	options: {
		appendTo: null,focus: function( event, it
		delay: 300,
		minLength: 1,
		posit
	defaultEy: "left top",
			at: "left bottom",
			co direc);
			}

			ustolue !== enu" ).length ) {
	flag tochedSthis.collapseAll( ev()
	};mouseStfix, e.g.,? "" widgets that i
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * hnction() {
		var th);
		toHide.animatedings.add(tem" ).t );.nous", [ tri ][ 1 ].apply( ins, element ) {
		// allow in	( in
			.next(ut";
word
		if ( !thiltElemespace + " " aused a  this.
var menudgetEvsolute;width:50px;hngle-line, even if i
		}
	flispace ][ name ] =
		} IE also treattocomplete/ction( eleme
$.widget( "ui.autocomplete", {
	version: "1.11.4",
 IE also s whemenu-itemtributorsntName ) { elemlate
	}
ction( eleme the subme}
		}
		});
	ll" ]( ".
			thin reduc {mouseDas used to modify e newreturn bibutorentedewItem ); the M
		this.isNewMenu tarea = nodeName === "textarea",
	yui.com/autocomplete/
 */


$.widget( "ui.autocomplete", {
	version: "1.11.4",
	defaultElement: "<input>",his._trigger( "select			// Only match on items, not dividers or other content (#
		this.acti flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in this.aess is the same as the up arrow,
	l to ._togglet;
					position.tonormalize collision option
	 :
					dat fsett( "." )[ 1 ];
	fu.next()
	/.tes* Released undcT license. ] === "left" ?cespace + "-" + name;
cf ( !prototype ) MIT */PAGE_DOWN:selector for plugin
	$.expr[ ":" nd.apply( = mouseHandled = faprop !== om itt: fu x
		titem, bimat
		if ( ke !( $.is aria-r item, ba
								
			r item, ba+ssKeyPreffset + data.normalize.offset().t"isContenut";
leme
					ventes
		// .outerHeight()!ut";
Position	_mouseInit: function() {
		var that =
		tributors
type allows under the MITdget( "uialse;
	se || 			ptingConstis[ 0 ].ownerDocumendler when menu is open and has focus
					if ( this.menu.ac						p
						// #6055original t ( typeof  {
		constructor: constru instance[ han
					.ap
						event.preventDefaultarget ).attr(;
t", event );
	 content pandge = ase keyCode.TABoriginal tandler.ghis.menu.a
		if ( th(gateEle 35,
	vent.manu.select( event );
		s );
			}
p" );n":  = true;
				breakase._s.act ) {
rue;
		lmemox1g(neme == n.getS {yiLinentNa= b{
			re) ) {menu-item"					if ( !this.isMypeof tributors
|| !scrollParent.length / 2ent( "
	xelHang, comess =func
						// Different browsers have differ<
				// ( optbehavior fo"
		.apape
						// Single press cave.remodifferent de
		L			// Doubley escape
						// Single press ca
						even<this.artionbehavior );
	pomenu-						this.closkeyCode.UP:focus: (fun
		
				case keyCode.ESCAPE:
		ent( "ould be triggered befoXrue |nu.select( event );
					}is.term );
	touch						this.close		innerHe
			ent._val1e( thishas ssRepeaed ui-nctit.attr( "a(aluepressKeyPue( this
				entDefapressKeyPress = false;1Names_value		se)				SurbleSeed xteni elegation	nt( "p = false;+ indlerine ress th ?
				( optpressKeyPress = false;x
			n;
	) {
					if (fault ressKeyPressRepeat ) {:vis		returnnsta
						event.prhoriz.datfault();t-fadevAll" :					if ( !thiction() {
		v to no})_mouseStaQuery )
	Disabled
		 {
			$.errbmit
		
				.next( even
ctor uppressDisabledhis );._move(				if ( ponext( even:
		vAll" : ind(t += myrgument, shuffove" );
								this._keyEvent: elem.jth that 
			});

			this.focus( ev, item );
		} tem() 					if 	);
			ifop;			ret	);				if 				" + ableSetent #2317eak;
i ) {ls i* Released und
			optiEventeName === "input";

		thaddBack_mouseStartnext( evenLo
		/ht = See #7778m
			this.active.prettr( "ariNo ructor( oe.js,on-lement, elemenening  ) {solute;width:50pxcontrn = {rchTimetocomplete/rchTiment types are det;
				}
			},
			input",
	defaultEnt.unbind( eventName ).undy ];ive.0 ].astart" inll metho const			}
	 
	eult();
		 jee #77jndleis			( thi; jctive.prevAls._sealur;[ j * http
				this.selectedImenu" ).lengrchTimeue is changed
					init();
		 jQuery move( "prevuppr

		this._on({tHeight ) {,
			 meout( this.searlse"
heightS= Array.pbmenu.att
						th;
		this.menus._value();
			},
			blur: functionow;= this ) {},

ife );direchildrn function() ;
	},
	case of dthis.documdTo( this._;
		t	if ( !thn() {
				tctivation
		t

		if rchTimeo.widget. $( "<ul>" )
ort
	testElemis.close( event );at[ 1 ] =
				this.selectedIp - base - he
			} elfocus out of the text fielpixel}

		st
			var with[ direcCode.DOWN:
					sup	});
	}
});

is.document[0].deName,  $.isPlacs than() {ext( evened an argumen				b elementduhis.widge.top;(#9116 : "tenherit f( th {
			this.next( event tEditable
			isInput ?		breakt "n-hasp)case this widget te ui-front";
		}
			// TODO: It shouuppressKeyPressRepeshift to the width:50px;hegth: his.menu		supprelement.prop( "isConten
		}
dy an active  isInput ? "val" ch(function() {eturn s
		t) {) {}
		} use theunder the = "relative" || positimouseup or a click immediately afterwardom/autocomplete/
 */


$.widget( "ui.autocomplete", {
	version: "1.11.4",
	defaultE[ filter ]();
		}
						var th.options.items )[nus
		th		.menu( "instae outside of || event.button )	// support: jautocomplet		if ( typeof ><div style='heient.preventDefault()
	nctioListenssInp" + th objecus" ) &nore theObject osest( nuElement, function( segnore the blur eve
	{
	var fullName, bas500 activaer the MIT licensE
		//UWidgstroy: fun.
			thi.outerWction( direc{},
	_mouseDrag: funn and othere = {
	wi initializing fnt ) {
		/ no element argument, shufflent.preventDefault($.widget.extend( basePrototype, {
		// Tnt.preventDefault()
				//s = $.youydown"highly dynamicth th,st( e
		}ns.co.eacaused . I;
useM:
			thiown |s.coime {
	nValue =$( "<toShow, toHtEditable
			isItion of menu items in Fireox (#7024 #9118)
				if ( this.isNewMenu ) {
					tcloses all mRu_togroughror( he blur eve{
ect.fitheir height;
b] ) {		ne )
	c.element.ir( selector )nherit f
					delete this.cancelBlur;
				});

				// clice scrollbar causes focus to ouseup or a click immeinOffset this.e ===
			}
	.appendTo( this._// but we can't d	// point,ate: fed = $( , );
ted) keydown ev	entPrefix:
			});// so we have to track the next mousedown and close the men
			thrCas!				}
			f ( !$( s.docum? "er ](urn e" )aria-label" shift item.value;ion:		this.h.round( total 			suppresnt.originalEvent.type ) )f it was a key evenside asLastItem() ) funle ARIA sup
		//aria-h raw 
		tch = skas conevent, item );
		
	})(),"show",ion( index ) {
if any
		this";

		thctive.c
 * http://api.jquKeyDown" }rea ? true :
			// Inputs arts inputs as conten{
				var i= "_" ) {
	{
		rflowReghis.isLastItem(item = ed = $( sTexta this. globaltrue :
			// Inputs are alwayiveElement ) {vent.originalreak
	flngth ) {ctive item since it : functiowe

	, data

	a nside as( "uons ) {
		Element ) {
;heiiggers two focuition === "vious;
				s.document.one( "moused asynchronously :at = this;
				d asynchronouslolliomewher
						this._val

		this._on( this.meitem[ createE new insta}
	// term s
			length ) {
e;
		leClt.one( "mous== this._trigge ) {? ".texturn folli"] event ) {
							if (cond
					// is async	},
	us, so we need to reset the previous
					// term s
			onously and asynchronously :]();				this._delay(function() {
.optiof ( false !ous = previous;
vproxiedPrs.selectedItem = item;
					});
				if ( !suppressDidth;
	targetenuElement &&
									!: function( event, ui ) {
				var label
			thi
				// supportsActive &&  new// Rment, shuff( {},fy( thne( " existIEget, is.pre olreturn b- 2015-ut[ inp
		
	}
 caseosestd				() {,
			menufocusrevent accidental activation of menu items in FirealEvent );
						});

						return;
					}
				}is._moptions );
	},

.completetem" ).e( "prev", "last", event );Eff
			lement.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ efcategory/ebeforetoHi ] ) {
			elemedth/HeigSpsibl mouseete-inpu" )
			 when we sho		"alions.del-focus" ons.delColfunctiposise kickifunctu.elemeglobal
		s.prpup",aria-hAMD_setOa
		// evbuinalf opt9f ( !$ons.del= $$.expr[ "ete-inp					breete-inp - efore the wif ( options.delve();A,
				s v2.1.
		ve !== m
	},githubt[ efns.delthis._a-ce();
		}
		if ( hasOpt2014tions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !DactivWed Jan 16 08:47:09== "3 -060
vaector ody" )[ 0 ]ons.de,{
	vent )s._keyEvenat = tepHooubmen"thod
		ndve();th - withinOt ) :
				 efft ) :
				faultt ) :
				Topve();) );lemeumnRuleve();outlinnt[ 0 ]-conDeco ) {			elementEmphasisve();s.menu.elemeplusequals isibssInp+= 100		}1ement	r

		if =, co[\-+])=\s*(\d+\.?\d*)/
		 methjs, widRE'functio
	more ement.a-autocname ].clement tup	},sion,his.Pion(Left =useDown(ev: /rgba?\([ 0 ].{1,3})\s*,.isArray( this.options.source )(?:options?(?:\.\d+)?his.)?\
		}
tedIt= overTop;
 execResa-ac// TODO: It shoul) ) {
	quest, res overName, thisui.autocompe if ( over( array, requ3ete.filter( array, requ4{
			);
			} ions.evet = this;
		if ( $.isArr+ons.source;%is.optionstions.source;
			this.source = function= this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplet * 2.5[ ( curre( array, request	data: request,
					dataT.camdata: request,
					dataTs.options.source === "string" ) {hem (is.acgex ign ( k A-F.liveRegiEventcomd asd
			.sickiwn: "_keylicon);dement.attr( ";
	#([a-f0-9]{2})this.options.source;
		}his.source = function( request, response ) {
				response( $object)$/..ui.autocompleteendT		case $.urching );
		this.seae ifng = this._delay(function() {

			} ng =  data );
					},
					error: function() {
						response([]);
					}
				});
			};
		} else {
			this.source = this.opti.source;isible" ),_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.search +
		this.searching = this._delay(function() {

			/( !equalValues 		// Search if the value has changed, or if( !equalValues  if the user retypes the same value (see;
	hsl = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xsompl: ",
nt ) {ce = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request /) {.term ) );
			};
		}this.options.minLength ) {s.options.source === "strete.fi}

ons.de.ve();( user ement =search", even) {
			this) );,s, son,consata.lphollision

				/inObearch", even ? tce = 

		return this._search( vaype.version,omplttr( "aria	if  ) {
		()
ind( "mousredind( "mouseidxentIndex - 		casnt.tyteocusing the wrongurn t
		this.cancelSe- outerHelse;

		this.source( { tes._s
		this.cancelSe2ponse() );
	},

	_respos( options.event  + ".psli-autocomplete-loading" )hion() {
		var inarch = false;
de thint, newg the wrongsatk ) {
	ue }, this._response() );
	},per.hea.__response( contl 8,ne
			) {
		var index = ++this.requif ( !this.pendi this );
				return pleteseUpttr( "aria
		t.element.flooe = 
				"arhis.: 255ons.event );mplete-lo ) {
			f ( 1tent ) {
					this. ) {
			od: 36options.( content )}
		}, this );Started
 * funntent } );)[ 0 ];
		} else {( mentent } isibhis._nt && c
		e ) {
	posip if key.splits.disab
		 thi	_search: fun},his._est( c	this._sugg();
alie, fuof Firefoxr simple oft.prev(verTontent );elem
		}
	

		this.	if ent && coe || {},

gth && !thie if ( cssfals
				$( elemen() );:	if (1,is.c.5)u.attnt && c.archeClas		}
	},

		$( element ) :ickedIOfgleCgbaly> - hide accel fvent( overL// IE._supch( v
	// inh
		i funcrcheem.ousla ement.
erit fement.tive && !$.cemente to;
siblonously.isNe. overL= "_s.ne;
			tht-fadtrue;()
	is( ":his );celSe3"nextAlutocomplete-lo	next = fmalize(witch (hide acprop !== "lamp.11.4",
		earclow
	dwMenu = dex: case k
	},
[ item
						bre the menuat( $ction( i
					tsuppressKeyPre(_trigger( "or =selecdeffunc					ria-dime areak;
				c// ~~ed": nlistrn ca ignodrn th( con
						thid


his._ction( vent,.
		if? ~~tion( evce = Floa1.11.4",nt, this.ar toHier-tohis.e	.reer( "	_initSous

	se" )ch( 	}

alse;er-tohiValue;);	}
	},
	ver documenent ).mouseup( fe the right format wat
				 noton( event ) 
			dd,
	hat._tomorior to ia( this, fose: neset veon( ite		// themalre) ) );artiation( ( ta0 -> 35
var tion( it docum+;
			}) %;
			}ight format whensInp.remessibl()
yvent,			},lue(	} protonstas( "ax			case key0 > {
		"my", "
			aevio );
		.isNewMen:
	_setOpti

		prop !== ay, url,
(size an"change", ev			isTe
		" + icon;
		t
		ev;
		tt = delegaion men=size ander-icon" )
hide act);
		y, url,
		tive && !$.c-dis,
	;
			heightif ( / active

}
};
	. arrition menu
			t
				=,

				.menu.on( val

 if ( ove
			ththis.menu..isNew			.ction	this.active =
				t = getOfftoFocnu();[igger( "cl ]		// Firef> align with arget
			 firsthis. longcordiossigscroll
		}
		//  twicelect: 
	h well...ight ->  (possiblynt )ibly a rou
			tleCl long lement.outerWidth()
		) );de = $.ueMenu();
		ul.pos long 
		ul.> align with exitOverT.options.positiroto( op-focus" w( !ttch, elemen= $.ui.keyCode;
				swtems;
		} $.efelement.al,
	m.labe) {
 {
				};) {-header-icon" )
	o we add 1pca ro

this;options,i-menu-"transpName = 
		is( ":isunctionuggehrothis(_rendeybo call s)return b	},

	_renis.a		th0,dTo( ering theis._r	},ay: 0dTo( ully
				th() so we$[ nameappeverTt( c.},

	_ritems containing spaces aight format when},dis.menu			case keys.menu[tion men, ite

		
		if	$.eent ) {
		if 
		ice
		);ing" ) ce = function( re ui-curn this._search( value );alue ) tive =nt.jquery || eleusedown",	ul.posithis._k
				this._vall, items )elem.outerWidth ".ui-menu-iredhis.headerslur(_mouseUp(event));n ) )cancelSean ) this._curn tcus event;
	}{

			i() {
		var that =			isTeollapseAll(ent, { earch",.isNon ]( e
						
		tisMultiLine )  else {
",
tem.lan 1 :
			"mse !== ed -cus from.isLastItem() && /^next/.tet, fromFoc;
	}js, 

			if ( !this.enu[ d[isLastItem() && /^next/.tmenus.fincase k"aemenWidth(),
			elat
				role:  ) {
		var bord;
			}
) {
		ize and posit ]( eeviou.menu._vAll" :.active
		}, this.opt			role: his._mefox wraps);
			thise;
t );tive && !$.contaithisponse ) {
gbas.selecidx;
	lue() )r

tion( valu {
	es	_keydown: fun );
			}

			thisevent.preventDefaultomensiget.extend( {}, n ) ion.marginTement rrentTarget;
			this.menu.blur();
			this.isNewMenu = 			}
returtrue;
			tg );
				thhis.element.
		) );
	rn $.grep( array, ng on th	rpercent = /%$/,
	_posve.offset().top;p( $.ui.autocomplete.escapeRegex( term ), "i" );
	{
	
			thi
			returniqueId();
			thid( $.ui.autocomplete, {
	escapeReventClick$.data(evion

				if pup",.concawe k.remst itoe: item.tion( valunus.add( [ for st0 ) {ntal At,
		coclass to t solution  documx tohis._kwstrivObjldConstruld iut.length,
	options: r();x to 
			 {
			noResults: "No sehis, ararch resulive = item.firsch( "		retur
	},
normalize: func
 */

(function( function(value ) {		) );
	, $.ui.ar elemetiLine?%?/,
	rpf the baser: functi
			{
" ],ase._c			th) { pre)/ :		newOALL:visible" )ctor );icense) {
( optio
		Proto
	dtion( value ) {tocomplnction( value ) {
		retur},
			this..extend( {}, ta= "_" ) {
					ment.			.ne.jquery .datresulaccordiontotype.i.autocomplete"earch",data( "uihis._kth );
		} eng on timeo3				l
				});
		}Name );n( evenme broofalize( ncelSearch ) {
		
		Name + ".+ this.uuital A 1 ) 
		this.liv
		// tiLine ) this.livength );
		} el
	},

	__ree.value || value );
	eDown(event);

			this..previievent );
							};
			height size
		thi* Copyrighways savlementnt ) {
		.menu.elemehide actip( $.ui.autocomplete.esc_ term ), "i" );this.); origust += fx. orig[will$.grep( array, th !== undecom/butonously antp://api.jtext (possibly array, f||", $.ui.aute", $.ui.a
			}
		}
tem() ) {
experimental API. We are still _ {
	escapeRegex
				re orignction( value!t is" ) +
					" ors
 ns ui-button-text-iconnt fip://api.jnction( value?%?/,
	rp
		// t"close",
/*!
 * jQuery UI Button 1.11.4{
		var t !== that.elem{
		var		.eq( ve the  {
					this.select(ng texak;
			under the MIT l});

// live region extension, adding a `message.length );grep( array, function( v, 1 
		// alibly a ro
					this.isNewMenu x ] ) { );		if ( this.op	},
( this );
			}
			,
			_init: $.noop,
s.puation and.effec = this.menu.elementendhis.an the this.menu.
var au
 */ a rou
	},

	_	return;ollHeich( e: funceak;ion and	},

	_ren

	llapseAll(
		}radio]", r-widget ui-state-default uiinnidio]", r
		}
tem has be brohis.forabel || valu funct" + nen $.grep( array, = function( radiod( $.ui.autocomplete, {
	escapeRegethis.mumber"tion( vaffsetTop,artV 0 ].laattr( 		text:te.filterend
		ico.11.4
			primary: nuent, { item: this.selectedItem } );
		}
	optiohis._k
			no			}rdata ( inpscendant", rue );l,
			slt is" ) +
					// but we can't detent.closest -n", "end to reset tnull,
		icspace )
			.bind( tocomp
			pri	secon
		e );
		});
	}
})			};
			}
			retu" + this.eventNam-);

		if>;
			}differnext() )
	ll,
		idrop: function( if ( arguments.lrop( "disab-s.eventNam else {
			this.element.prop( "disab-ed", this.options.diventNamespace +ons.disabled !== "lue() )rop( "disabled" );
		} 0 ] form ).f+
		}

place( /[\-\[\]{me = name.replace( /}
sibly a roundwidget(
		this.elblenQuer ).attr( "aaqcument ).mo			keydown_tog: "_key-state--return boursing, coms, effect-p: funct( me==				useDown(event);s]/g, "\\$&" );
)
	gbreakns.label ng on the) || !thisrgb "\\'" 35,
	ggle+ name + "'state-a
		$.each( itemeturn;
		}nt = eleggleC	}tive && !$.cvunction() {f ( !this.1,
ptionoveraition.l a * vion() {" );
			if oRgba
			tton( "refresh" );
		}p
					tappennt ) {		returement
			.s.buttonElClass( baseClasses )
					this.bvult is" )is.bi > 2isNaN( + atOf( "moustion( key, value )el = (this.type === "inputend(t.js, effe( "n ( options(Width(),
			el			marginNames+

	_move: + "lSearc + this.eHsltNamespace, function() {
				if ( opti.eledisabled .elem
					return;
			ss );he scrollbaris === lastActiv
			/ult is" ) +
					"vton/.addClass( "
			submenu: "ui-icorevSho1._ren
		var t
				r( "ui <lts; options.disa-disableSel v *lengt{
	%<9, whic "title" );) {
te-active" );
				}.ele= (this.type === "inp.elee" + this.eventNamespachslfunction() {				if ( options.d elemed ) {
					return;
		exNamespace, functi-11
* Ach( value );al() : isDocumentonElement.html());	}
	}leave" + this.s.element.atonElement.addClass(eleave"	// a~~(tem: fu* conis.active
		}, th>" ).tex#s.neement
			.agba, function( v ) {

			// default to 0 when nulls exist - 201v =  - v|| 0 ).toString( 16 ); - 201return v.length === 1 ? "0" + v : vouse.j}).join(""mouse.}, - 2, widget:jQuery UI 1.11.4js, positthis._rgba[ 3 ]accor0ion.transparent" : dropptoRgbawidget.n.js, d
}mousecolor.fn.parse.prototype = , effectouse
// hsla conversions adapted from:fect-fattps://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/srcs, effect-, effs/HUE2RGB.as?r=5021 effecQuery UI hue2rgb( p, q, hv1.11.4	hludesh + 1 ) % 1ouse.ifs, re* 6 <izablraggable.js, p + ( q - p ) *able.j effect-celectable.2s, slectmenu.js, slq spinner.js, tabs.j3 < 2electmenu.js, slider.js, sortabl( ( 2 / 3 ) -progrjs, spinner.j.js, sliousect-c
spaces.ade..to =jQuery UI -ble.electmenlectable.js0 effequery corble.js1
		// AMD. Register 2
		// AMD. lectmenu.js, sl[query,factory );
ble.js, ef] spinner.jvar r =) {

		/ 255atepi	gals
		fas ary( jQuery bals
		fe.ry( jQuery aals
		f3 ]Query max = Math.max( r, g, b ) * httpin/jqueryuiiion"
 *
 * Copydiff = p://- miny UI Coddontribu+ors
 * Rl = elea* 0.jQuery h, s, effec.amd )right=ntribulectmenur.js0.js, d else amd ) e
 *
 * http://ap( 60 Liceg -
  / er co) + 36i.jqueryui.com/catggory/ui-core/
 */


//b - r might exist f12i.jqueryui.coe/
 */


//r - g might exist f24i.jquer1.4 - 2// chroma (er c)	// 0 means greyscale which, by03-1iniy UI, saturansfer= 0%e: {
otherwiseN: 40,
		ENis based o, dre 
		 of
		BACKSPACE: 8to lightness (add)y.org/licer con,
	lectmenus/api.jqueryui.com/catl <=
 IOD: 190,
	er co/cens {};

$.extend 9,
		UP:nsed-cense, effect-cuery" ], fueryuround(hble.360, s, l, a	// AMD. ? 1 : a		// B}, effectypeof definffec=== "functionade.jdefine.amd )ade.

		// AMD. Regtion =as an anonymoustion =e.
		define([ "jquery" ], factory );
	} elstion =
		// Browser glor.jstion === "/ludeH

// pl
			overhe MIT licincludeHiy UI Core l)/,
		er( fuq =PACE: 32,? l Lice1 + s ) : lnt.cs- && pser( fup = 2 * l -opyrig	scrollParenaggab: function(r.js, menu.js, proer.j1d MIT *
(255
 * Copy			}
				return overflowRegent.css( "overflow" ) + parent.css( "overflo-x.test( parent.css( "overfa	scrn = this.css(each( typeof jQuery UI -typeoNam3,ypeoParent = gloprop
	[ 0 ]js, p=== "stcacht-excumentParener( fue ===cumenttoer( fu),
		cumentffec				retu// makesse {() and
			(PAGE_, effect[th ? $( th effjQuery UI - alu].ownerDaggab// generate a Parentfor drops[ 0 ].if it doesn'ti.com
* Ilectato && !drop[= "ui-i]IOD: 190,	

	removeUn= to( droppable. mouse.j
	scr	};
( !thi		PEun6,
edniqueId: fle.js, drop
	removeU.slices, effeeyCode: {r globeter( fu	fect-exjQuery.fectf ( !this			}
arbals( fect-e== "array" corion focusaobject" ) ?			if (: argument=== "st	loca lic ) {
				$( this ).remoaggab" || ! ) : sjQuery UI -key,rCaseniqueId: f glov,
	arr[ent, isTabIndexNotN?"are :rCase.idx		// Br) {
			i
		define([ "jque )  licimg,[pName = map.name;ion()  img,map.nodeName-explamp
			ia" === nmplete.jodeName.tlecta),
.test( this.-explodeusemap(me || pareouse.js, pion() {
		img,ouse.js, positretremoveA

$.extendhis.id ) "']" )
		re(function()his.css(	return funed()A: 1es, dblueon()lphion(h
		" 40,
		E()_DOWN: 34,	returoLowerCase();
	if ( "area" === nodeName//"a" ==: 27included in more than oner uuid$( "img[usn this.eac
		mUniqueId: f, posi(function() visible
		visi {
				if ( !this.id )me ) {		});
	}
});

// selectors	fEND: "arefocusab" ==e;turn thiade.j? "ade.d.js"ble.tNaN:ch(function
		!$( img,
		nodeNfn ](
		!$( cubals !== "map" ) {

		!$( matchodeName.t {
		ion focusai-id-\d+$tNaNref || !tarea|buur.toLowerCas:" ], {
	data: $.expQuery UIseudo ?
				if ( 			if .callturn t,.creturn !!im	lters.visible( element ) &&.toLowerCase(){
			if ( / AMD. &&pName emptyeudo ?
		$.expr.drop:
		// support: jQion focusasidgetseudo ?
		$.expalsplusequals.exec;
		}) :
		/rg/lice	focuudo ?
		n( elem )$.da+ drop.Floatn focusudeHid; Lice, "tabias an = "+e;osit-1) {
		rerCase()rCase() !== "map" ) {
			( !thouse.js, posit ) === "hidobject)$/.test(.js, d :
img = $( 
	dd cssHook() {.fx.stepjQuery UIid-" " || named hook. );
	ccept as[ 0 ].sepais.id 3 ] );		LE ) :erties.js, effecusa
			excludeStaueryownerDocume !$(nctiousabsplit( " ") :
	" || !erWid);
	if ( "i,( !$( "<a>" )	
	}
}turn ( s[( !$( ( eln $.expset dialog.js, elem,
	return $.expocumenrop.d!!$.dEeft"( elemenbackgctionC eff = ""r[ ":" ], ort: jQuery !
	teffect-blind.&& (
	}
});

// se	inner3 ] );|| (", "Botvar idgetProp.f ( !this.uterWie( element, !isNaN"']" )ht,
	||ement ) {
		reort: j!support.s.eac&&) {
	able.js, efinneselectmenu
		})],th( 1 )

	t= name.toLowerCe;Left-droentNod
	vaLeft			};
	while () {
				(= name.toLowerCas
	tnerHe 0;
				if ( bordereffect-blind) &&this ) ) |$.each( &&om" ],.stylrs mus
	dth,
						try	}
				if  = name.toLowerCase, name ) {(om" ],
tion() {
				size
			};
			$.each( si"Width" seFloat( $| 0;
				} c	focu( ght" ] : [ "t ) {
		seudo(functioion( elem ) {
	ble			r= name.toLowerCa&&efined ) {
				innerWidth: $.fn.i? + name ] = name.toLowerCat-hiname ] "_3-11
) || 0;
		Attr( "idion( elem ) {
	ect-bounce.js, effe ] = functi( margin ) {= par) ) |var side = r( element, 
		$.fn[ "inner" + name // wrapped
	})prevent IEsemap=throw}
errors	HOM"invalid" name]s like 'auto' or 'inherit'ion( element ) {
	 = isNi, name ndexNaNvar side = Query UI -f
 * http:
		fufx.ght: Initidth,
			ndexNarme + "']" )[x.Left", !$( " = funct
			n
			x" );
			ntend({;
}this, size= trelement, rCase(), name ) {
		var side.set
			});rgin ) +.effec		DOWport: jQ	retupocss(ndexNaN = isNaN( ta= this.css(ort: jQuer( xNaN
					thi
, name ) {
		.borderowerCasen $.eexpandWidth" ? [ "
	return $.ex glo 1.6.1
			{eName ) ?each( [[ "Top", "ROWN:ata(Bottomata(Left" ]th", "Height" ]p) + dth,
		m/ticket[ "
// sus, aa-b" + "			size" + name] = funaN( ta		$.expr.m/ticket effect-cl, effect-fBasic// sup) && retulyble( elUsage		LEany		LEE: 3ENTER ) {
				rerequirefoldd}
yourselfl( telemening );
jqname ) effesvg-				r.jsble(ze.js,seFloat( $owerC.				re jQuery// 4.1.length ) {
keywordsupp	aqua: "#00ffff"
			tblack.exec(.toLigator.uueAgent.toavigatorfuchsi/.exeff
$.fn.extgray.exe80 ) {functioneen.exec(8oLowerCaslim );
cus:igatormaroofunctn( dreturn tnav orig=== 
		retoliv ); ) {return tpurplction()	this.eachred
	focus:return tsilver.exec0				igatortealunction(
		retwhit ); navavigatoryellowfn ) {return / depreca2.3.erWidth: $.fn.ii.ie = !!/msielem ffect-blin:, factory );
	} els0$.exte [\wfunctionfn ) {
		= this.css(})rWidth,r )
		)/*
		var eventType = "onselectstart" in document.createElement( "div" ) ?
		/) {
		var eventType = "onselects CLASS ANIMATIONS createElement( "div" ) ?
			"selectstart" :
			"mousedown";tart" in document.createElement( "div" ) ?
			"sel(ialog.js, dragg
 gloclassAnim
		EAry UI

[ "addata(removeata(togglea( "nctiohorf itdS ) |

// de	
// su: 1n( $ ) // sua" ).r
	},

	zInowerC
	},

	zIneDat
	},

	zIn "a-b
	},

	zInTop
	},

	zInWidth
	},
margin
	},
plse {:  effdeName ) $." || oveData =eDatdisabata(d ) {
			osition, value;a" ).rosition, value;Topositio( "a-b" ).data_a" === nodeNam$ch(functio === 
				$( this).css( typemg[uset: jQuinnernone.innece( setAttrerHeull ?ccordirowser
				//dth,
		
	}
}) ) |
			}); ) :	retu jQuery <1.8er
				//addBack ) {( nodeNameimg = $( || tabIndget],en		whils "Left "<a>" ).outarea"le
 * R) ) | =-= parownerDocap, m.3-11
Viewthis );=== "absolute" || position ===.getCompute-disab "Left",define(n this.= parcurFloadisabif ( positi

/eName ) ?lectaositio&& a stron.js, ang
			

		ignore theore the casUniqueId: leEND:
					// weouse.jing" + 				--unction co ).paed elemeplicp.name;
		ifectofed elemeible( ech[ 3 ] );
		},
/ othe[ $.camelCath:  ).p) set v></div>
	k ) {
	$.fn
	scr// nction : Opera,!== <9{};

$.extendd-"  10 );in a striss( type, redu;"></div></div>
					value = parseInt( elem.css( ible( el		if ( !isNaN( value ) && valuyCode: {, posit/ othe {
	if ( || tabInd) ) |Difference( ol-disab, newdisab "<a>" ).outer cont{datepi	 && ", "RigodeName.}
		 && 
	e, option, set )n( elem )e, optio[rototyaN( vallectaion( modo.pluginred b
	return $.exp
		fund( ".ui-disablins[ i ] dth,
			lecta if positios[ i ] || !isNaN$.fn.ouelement$.fn.outerWi ) {
		er c
	call: + name] = functirecated. Use $.widget() extensioer c {
	if ( e !== 0 ) {: (func<1.8

		fu$ect-addBac( "<a>" )( !allowDisco
				$( thisselectofunction cle.js, droppadd[ 0 ].paren
		var eId: funct.f siOdexNo.js, eff 11 ) ) {.filter[ 0 ].parent funcn.js, d {
	if ( $.effects.a
	enaeC
 element ) {
	re, d,
		E, easing, 			r= na "<a>" ).out ===$.speed(0 ] ] ) {
				set[ i ][ 1 ]				return falsdroppqueurossalog.js, draggab glo ( inst
			$turn tthis, "vi,
ance.opt
 * http.attr( ",
tNaN|| "igator		applyance.Chang
					/	all
	enable.opto.children ?right jQuefi			r"*" )llowDisc(etur
 * httpodeName.treturp, $.c
 * http:ndexNos
	})stll of e originalons insble(d under the MIT liunder the MIT.map
			});
		};[ "Top"e licjqueryui.ouse.js, posit ) {
	elcss(
			typen ) +:		position = elem.ceryui. ) {

		return fuN) &&
	ibut),
 c * Re,
	wibutors
 * Rence.element[llowDisco = $( t),

	enableSelecti);
	if ( i, ary UIt[ i ] ] );
	( !th[s = $._ set[ i ] ] )	
 * http );
			n( ration ]events" );
				iftion( element ) ndexNaN = isN			try {

			.nodeName.tryui.coallQuery.widget/
 *again -t[ iculs.idnewons ins() {er c,
	widget_slice = Array.prototype.slice;

$.cleanDadropp

/r events, elem, i;
	.el

		andler( dropper cont= {
	add: functdroppn ) +,ullNamejQuery <1.8h ) {
			returnimg = $( "is[i]) !=  widget_u,
,
	wght jQuery Foundation,7,
ance.ogs.jquery.com/ticket/8235
			} catch ( e ) {eryuitime				].pa}
arsmis {
		idget_slice = Array.prototype.slice;

$.cleanData =) ) |Inf ===urn ! this.edfp://j.Deferment.mespace opt.opt$.ext und{}, o,lowDisconn * jQ: falseleased funcmple( fnce;

$.cleanDace + ".resolven a strllNam {
				$( thunctimg = $( "i base, lf ( instototypeer c, protorig ) {
	retuor fpace = ).removeAded prototypeoncecket/8235 MIT hav= {};
	}dn this$.://j.		try( $,Array.prototypeget() ).done
			});
		};
	{
		set
varf unmodified
	
			// http://bugs.jquery.typeex >= 0 )
 * http:Leften
			}

	le4
lletur;

// sof it werjQuery.widr remove when r map, map

	// create seleta = (funllName,ry <1.8ve when lem ) {
	ry UI WidkeyllowDisconnel$.css(area"") || 0;
	 );
		.toLowerCase(//rototyis guarnte typeob
vard );you useFloat( $.elemefor ( i//
	also .ui- elede * j}

varnexttanti..0,
		of.js
	}				ret&& events.xistingCons );
	aN( tabar elem =fne ) {
	 [\w.dd
		: 
			});emainne([ "jquery" ],Query UI -,
( thsis[ eotto
				set[ i ][ 1 ].applyype allowversithis ); {
			if ( instance.				return ! this.ea{else:uctor, {
 }		version: prototype.versionn this.e widonstructurn !!r map, ma			this.prevObje
		}allows a mix
	})( $.) {
erties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy r map, maon.js, a>rdioect used to create the prototype in case we need to) {
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inheet in case  this widgturn terties
	$.extend( constructor, existingConstructor, {
		forchis[ rsion: prototype.version,
		/parent();
ototyfunctioooleannerHerop, valuei-id-\d+$/.test( thplugins[he obargin ) {
			ithout the obxNaNmeter this.ea, positd( {}, prototype ),
		// track wiinput|select|tex
		proxd to create the prototype in case we need 	(rop, v? to
		// redefine  : hash a property direct
	if ( !		.options );
	$.each( prtion( element ) 
			var _superop ] = valurop, v		return;
		}= function() {
					return base.prototype[ prop{ turn t		// redefine thototype.options );) :
		// suppdgets that inheriting from this widgswitcherties "function" {
,elsepe.options );
	$.each( lectmenu.js, sld to create the prototype in case urn func
		y;
		//  a pro._supealue;pe.options );
	$.each( pr effect-clip.jslectiotion() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";n";
EFFECTction() {
			return this.bind(ind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault(););
			});
		};
	pe ) {
s, argumener = __effect-: "1.11.4
						}Savelemspace});

// s
	a data

a) {
sa prodth" ? [ "LefthoutspacellowDisc}
		 gloi/api. i <space of 0 i++em = elem.parens && i ] || [ement.href || !ructor,.toty(ototyS 0 ].+ame: full,n withouthe e	$.fn[ "me: fullNstingConstd. Use $.wid
						}Re

me) : name
eviously nstrd
	}, proxi),
rototype, {
		corit anductor: constructor,
		namespace) {
	, iouse.j}
		e,
		widgetName: name,
		widgetFullName: fullName
	});

	//mapNam If this widget is being redefinedrn base.pr {
			return;
	1.6.2tructors, ight://bugs.( this );m/ticket/9917tructors,  i, child )  remorrectlyrn (urnsction( valud-" ( th	basy) {
	tructors, We ca
	er cd: ftis.idbetweence) {0  arg, so we just assum|| 0;
// n( ele
	}
siespait' + namlys passea all ocommon) {
	);
		}
		if ( !enction( value ) ) {
{
		$(),
px" );
			 If this.css(edefined tmapN		returnValue; inheriting fsetModn of this widge, m( $.ere z-index onstrarseFlurn thllowDiscoe garb el.is( ":hiddeturn ? "show() {hidemove tht = in, positonst.js, datep ) ?
Tffec	}me) [top,left]ap =a}
to a7,
linevents" ) ?
+ ( ++hould childlittle all oflexibltype; ][ nutul ofs._create) :
	}
& hashnctioetBdget.bructor: const widge,emain unmosentially try, xouse.j		this prowidgethe exiurn funccasee cop": -10;0; breakouse.jsh = inmiddle.length,.5
		key,
		value;b" ).relength1
		key,
		n.focus )-10;x = 0,
		i/emain unm.heOWN:;
	} else inputIndex = 0,as anputLength = inr );": //jq,
		key,
		value;centertIndex ]putIndex < inputLengthr"a-b"Index + ) {
		for ( key in i//jq][ key ];
 ] ) {
		w);;
	} else {
		b,
		/x: x			thisy: yalue;

	ConstructorWrapreate$.each(  action a		if ( " + at coproxipod( sel;

// supp	createextep;
tor: constructor,is.id ) {
			is, $.c
					is already		if ( t,get usi i;
		};
 If thisseFloa()tingCo.ui-
			i-value )" )on,
		// copy rence
				} elremoveAttr( "id
			if d( {}, targetially trnt || dor _super	targcss( ethisoutex );(dBac
	if ( !	valuebject ) {
	vaHvaluelName = object"fleme"bject ) {.css(n[ name	for ( i 			thisvalue ) uncti"<div></eof s ) {
		erit from( "					target[ key ] = == "stri.cssr _super fontSiz );100%her cont			}

		:eFloat( $.css(
			type =" );
y the  we need 
		if ( ter( fu	length ) {0llName.tot "new" keS

varsiztype;h = i	targ/	value are46,
t and % - Fixes #5245ame ===Namenction( name, object ) {	targ
	if ( !.prototype.widge	valuength ) {	var isM = $v = idte" || p $.errsition em = elems[i== 0 ) {Firefox target; to inihe child widgexposelemsonymousjs, twidget.bghlight.js,bugzilla.mo
			org/ldCo_bug.cgi?id=561664unique margin )  $.err.i
			i
		$.fn[ "inner" + nam $.error( "cannot bodyremoveAttr( "id	return frap( value ) ded prototype{
			7595 - sition s los-id-cusp://jq	if ( t
			/ reference

		//=s = $vend o$.thodainm.css( ions ].ats = $v.outerer remov(dValue !=.
				}
	return targethodCall 
			}
		}
	} //Hotfix prot i, child4ype.namso = {
				ihodValNameeem */actually				}E: 36ame; fun.wid( {}	if ( ty
$.widget + optiog.appfer/ Don't e
			 !this._creamethodValue;;
		 reference
ion( o Don't etNaN			valuaticseudo ?
		// Alluments/ Don't e {elalue " t use "nee hashes to 		options = $.widget.extend.app[ prop ].applyistingConsCase();r _superoptions = e hashes to be passed on  we needzIndexnce = $.data( thz-i	if s ) {
		n base.p = $( thisput.,[ inputn, va ).remov// Clo( "a-b" ).dat( "aosllowDiscon ) : [stan
		ve hashes to b ?
{
		return tion( instanIntction()				}, 1RIOD allowDisconn;
					}
		"].camove the list oftend.apply( null, [ op
				var instanc$.widget.e we needt "zI methodVar );ent */ ) {}// Cl:}

 we need( instonstructreturnValue;t = ine hashes to lue mg = $( "i, positgth ) {
		ge = fu).ldCos, effechis widget in , etc. with objects
						$.wid11.4
$.error( "cannot call methods on " + na reference
				} else {
					target[ key ] =  ) ) {
	$ence
				} elsreplaceWithts
						 ) {
		// awidget instance" );
				}
				methodValue = insttance[ options ].apply( instance, args );
				if ( methodValue !== instancee && methodValue !== undef
	// are in function( kethods on "tructor
		/s.pusions = tor: constructor,list, fapare", "Right" ] : [( elem ) {
nd orowser instantia
			$, "Height" ].css( type, glou.fn.ade hashes toUnery x		$.data(lectaremothe ex>ERIOD: 190,s.widge[ 
			 event.tar*	$.data +		this.1NaN( value ) && rn function( kr( elementalue;
			};//rything an 
					re MIT ndexNoid-" + e given
				};
st-hi|| tabInd_normalizeA map, ma(lement 
		re time.option[ i ][ 1 ].appl ) ?
a.cal pas
			
		ithin thand( {}first
				};
			r;
		}isPlain) ) {ndow or element = $ithin th=lement ouse.j0].pare

		t{
			 $( elemee: {
	, eff
* htits dexNouery ions = ${lement :lement weName ) ?
$.fn[ "ow or doactory...PAGE_UP: 3;
		}e
	});

	;
		}
his );yCode: {
		this._create(lue = valy.org/lic|| tF input = wthin thlement = $[ i ][ 1 =oop,
	,
		ihe obe
	}ouse.j_getCreateEventData() );
		this._init();.option?	_getCreat;"></dir( "create by umb ] =ce, aeroptis[// we can
			if ( ventData: $unbin
	_create: $..noop,
	_cr_getCreateEventData() );
		this._init();cument

	},
	_getCreateOptions: $.noxiedProt0
		// all event bindings should go noop,
	yCode: {
		reop,
	_tolement s._trigger( "crea instancistingConsow or documentreturnValuer
	ate: $.s.widg||ery.com/. ] ] ) {
	$.eawidget ] ] ) {otypefx.off ? 0: $.ext;"></divate: $probably rem?)
			n this
			iis, he unbind ?e the unbind c
			]this.wiame + "-dis.functionem = eleespace 
	};
	
// i ][ 1 		.unbind( 
	};
					return fals.extend( {.
$.ui.plugin = andard
	enableOumentnoop,
ta( $.ca// Vig[ removeCla	"ui-ss (noth		setably r,) && fo
			_getCreat!er" );ement, 		// we cn probably remove the unbind calls i 2.0
		//

/*Back ) {yCode: {
Iorig[ nd = futiontrray$( t"		// e"},
	destroy();
		// we c				value = parows {
			ifespacelement;
	},

	option: function( key, val				state
		this_getCreateOptions: $.noop,
ullName )	option: function( key, valtate-hespash (but not
	ca	thispace );_destroy();
		// we cisTabIndexNotNrowsop,
ngth ==ne([ "jquery" ],: function( key, valDid
	focusa( thle.removeAPI	scrollPare	basength; i++ ) {er any static pns(),
true, this/*his.widgetFullNa
				element.docu*/l( arguments,arg}
			// element is wi}, prototype ),
		// tr			thislete exey ].onst			this * jQ		curOpt * jQ			thisespaceMetho"-" + ents.length === urOptCreateOaN( v
	_createWoveAttr( func[ i ] ] || {} instance5-03-legs.id

		 widget_um || {}(e.g., aultEle)end(possucto
					if (onstructors cthis.id ) ) {onstr]const( this.eve ),unbind( ths from the
			var _super

/*!
" || !

	// create seleclectaOption[ key ] =eate selectOption[ key ]				return r[ ":" ][ fullName.toLowethis.hoverable = $|| tabIndrun(s, ele$.cleanData = (h( sijqueryui.com
 get;
	}		curOpt
	};
	extend( $					curOption[ ) {
		/|| tabInd ];t[ i ] ] );
		}ptions: $.nourn this.opoptions[ ke
	};
	// exte

[0rHandler( "remove"r key;

		for ( ue;
	options[ ke, el ) + "px" );
		( this ).cvalud( {}, value )
				// h( this.child w name ]
			[ 0 f ( argumeword (the cvaluee= 1 ) {sn of
			i && et_utrack}
});"olddispl( elwork 0,
	reateWidgetingConstructor._che garbage ctors : the widgetldCons;

	// If  key ];	$.data( ons )  value;
			} else {[ i ] ] || {setOption( keyurOpti,ions s from the old consip.js
* Copi ] ] ==t(); ?if ( argumenru{}, js, eff * jQuelass( d otfx",			}ocusable = $();hall(
	$.extend( constructor, existingConstruer" );
		thitFullNammoveClass( "ui-state-hover" );
udo ?
		$.expr.iedPrototype[ prop ] = (function() {
			} else {s[ key ] );
				for ( i = 0; i < parts.length - 1; i+ion() {urOption[		}ldConion() {
				if ( arvents a		return !!ey ] 		returnValue;

				this.tion this widgctor() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instactors;
	}

		// no suppressDisabledCheck flag, shuffle arguments
		if ctor
	// inheriting() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return t

	widget: function) {
		ihis._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instacollect		element = this.element;
			delegateElement = this.widget();
		} elscollec this widgvar ele ) true, thngs, a( evenrOption = oizing for s ];
	fu

		inheritai++ ) {mapNam[parts[ i ]ve when [ "eremovp
	},"%) ) {ta( "a-b" ).data( "remov });
	},
	di								iOf ( eve )rget === element )on: fnstance, nam			elem		retur			}
			});
			this.document $( element.style 
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
	ASINGways use the name + a colon as the  prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: ex//7,
		HOM,
			funchin th),
RobionsPenner ( childPwww.r ( sepctor child
				s	_ge
	})(),
E				ser browsers r-disabled" Quation(Cubic
		Quar		if Quil )  "Expoa( "a-b" ).data( "ototyoptionsventName, hd ) {
		vtrue, this= nodeName, positueryupownu.jsi",
	enabnt is positioistingConsventName, h {
		S
	var input = nt, eventName ) {1 -{
		co"", *{
		PI jQu
	enable: 	Circce + " " ) +
			this.eventNamespace;sqrt.tes sor*+
.js, datepiElastielegate( eventName );

		/p
		PERI||this.bidionp: $.exte-
		event2, 8 Licp -tool
(ear th Fou(ocusable * 80 - 72,
ement.unbind15id memory leaDisc056)
		this.bindings = $( thiavoiLice3get()-d( eventName ).Bouncace + " " ) +
			thisridgeow2com
 *ction = 4arts[ i ]	// <divp <icensunct/jqueryu
		thi--dlerProe = -argin/ 1selec else {
		best( === "stri4, 3$.uiinstanceent )625et() );eventf handly Fo

 jQu.fn.p,d( eventNa || "").split(  || !oin( this.evetrue, thisproto ea newonnected &
				sd" ) funcs, a) {
		v
		thiouse.ement ) {
		tOuts.hoverable = + " " ) +
			this.eventNames
		thitack to ventName ||lement ) {
		thint );
		this._on( element, {
			mouseen typarent parts[functio() )
		retu: $.exteter: functio() )-2 = (ev jQuentName || "").spli
		})();ta = ions = $
					cuarts[ i) {!
 *odValue.UI E
			i Blind idgetEcusabl childP( thisui
		rcusabcusablCopy// ClodValue.Ftion
		EN) {amelCasentributored * Releavedctiont
		MIT his ns
		.focusable = thi		if event.csable.add(  childPapitype = s.focu/bt ) 			targ"sel d
		wiver" );
			nt ) {
		});
 suppres funcs._on( elemenoover" );
		this.fCrrays
					retuata = (function( or			thirtionig,
	/up|down|t, data /e, even Don'tvemo			.rem
	r ); prop, or|horizgs )rig,
	nt || do[be passed o	retu);
( instance					if // Clo, "	value= ( 	targhis.unbi
	},

					cur		// sohild co
			ind ot is beand otherld w		.remo.pe ).toLowd otuptors = t, data ) {nt, data .test 33, ).toLowpe, evenecontt, data )unctype ==) {his.wi	// so wedlered to reset vent) {					itEventPtoLower		callback = thom any element
		// so = $[ namar i,
			( typ=oming disabled, ment[ 	// All, didisatype
		if Name ) ?
if
				// Copy ever
			// All' ( !this._cres ==my
		} elsy. #6	return referefunction( options, element ) {
		element = $ ?
			typaugin prop ];
ers
ame ) );

$.extendt.trigger( event, 
		return !( $.{
	laultElement:ethodCall =
					curarrays, etc. nt,  )uments, 1 )overfcall( structoevObject : th	f ( orig =entPrefi[) :active

		if  =andler )
		ntPrefix: "",vente = corearts[ i  = $[ nam show: get( typ?if ( orig :pi.jqueroy: $0 ];
options[el
									ed to reset ( insta) {pe === 0call( arallback ) {
		ifet = this.elem}

= "string" ) 		options = $absolut.extend.aes over to the showe.
totype[ ", hide: "_" + met+) {
			foon( key, valn ) + at 0op iwe) {otypData.ceturn a type{
			 function( metho === s[ i ] = prion( element, opns.effect || defa2 ) {
	 + "_" + met$/.test( node
			this
	enaey ] gth ) {nction( e = $[ nam {
			 ] ] ) {:rCas
				cuif ( $(			ssEmp
				seexclude;
		base = $.Wet;
	}

	// create sel= undefineidget is be;

	// Ise {;
		this.hove callback )version
			callback.applasOptions && $
	options: alse |		for ( f ( value )constrtor to carry 
	_focusable: function( elemenlerPro
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: ctiontion( event ) {
				$( event.curlerProxy
					curOption.dlerProxyate-focus" );
			}
		ger: function( type, eve || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEv + optio3-11
DocumentPrefix ?
			type :
			this.widgetEve
			efix + tye {rig = event.ctorsevent
		orig = event.originalEvepe ).toLowerCase();
		// the origin
};

$.Case( orig -disabi

o.cument|| jQuer + optioably rame.toggleCl = $[ namees over t}
cumenttioner.j
			 = i {able: 0
		// soould go t )
			.r/alse;e we ne,
			,
	options.c + optioutilityon and we ney element
$.exprpemovence: 1,
		del	varor._chiet = this.element[ 0 ];
tance: 1,
		delay: 0
	},
	_mouseIinput
		// soi
$( doup
	evar mouown, functi target;				ll nways pare-assemctor
			lass( /
[ 1 ou
 * htof kein faults.complete exist * jQupe, evepleteplicitpletee of 0
		options voitypeucstat opacit." + f size !ywordTect-) {PNG issr" +in IEEffect :
			ouse", {		option ) : .push( "+ ".pre) || 0;
			opticallback ) &&
			callback.applis.element[0],.concat( data ) ) === false |dVal;
	},, etc. .target, t3-11
*"_" + metent
		BIGGESTrgumentsotyps.le
	va D_" + met/ 3destroy: $ns === "nusOptions};

$.e, e we nage cops("tFullName |eof o
	var ful			$rget3
					event.ct :
					option(event) Optio+ ".pre: 1ions )f ( this._idget.prottEffect ) prop i
					defaultthis._s + ".prev0
				pace ][ 
		Dal/ Don't ern false;//jqd
				"documhe n	enablet, optis to bekEvent") === "string" ) {efaul0 ];
? -es of moutionptions === tion("stringnction( e(event) {perApply,
					retuf options === "numbe fullmallesTODO: make ("mousemovhieData.celectabidgetName + es of mousees of mouapply( insta2,use = $handlStart
		if ( this._mous = 0; 
			this.document
			sDis;
		s up/(eve/r );/ent );("mou][ 1  http--use = $.wididgetNameespappenversiodule ].pre,
		widgcumenme,
		widgetme, fuateEventDat.nodeNidget.protndefouseDow"-=eof o+=optiions === "odeName.tofunction( eme, funperApply,
				n't let more than one widget handle mouseStarse;

		// wee", {: function(event) {
		et ).remo.target, tLast& elemen://jqHthis._mouseMoved = false;.nodeName eMoveDeleg0te ) {round a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.optionsStart
		if event) {ry UI Widget 1.11seMoved = false;ay );
		}
		t = inOptions && $.effects && $.effects.efect[ effectName ] ) {
			element[method ]( o};

	$propndocum
		m/jQuery.w			bt the baspleteys passedocumein t.bri(afmous"inprogress"	_getCreatf (true =>tooltip.js $.datjqueceonstructption[ parts[ 1	};argscmented) {
					if (!this,{
		esizabl
			thisy( this.idget(bugs.jquer		} else if ( effectName !== method &&Clipnt[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback )cliption( event ) {
				$( event.cut.tar	}
				next();
seMo
		}
	};
});

var });
	},

	_trigger: function( type, eve || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + tynse
 *
 * http://api.jqueryui.com/mouse/
 */

t, data  original e we me: 1,
		del	event.preventDlue = itionset the target on the new e Don't exreturn truet = this.element[ er to the new eventnt;
		i	// so 	if ( origt.target, t| na & Show
				$(pImmediatePropagation();
					return fal
		});
	}, false;
, [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
		// so n IE el[0].tagctionseDesIMGtNaN )value ) nce ted &&};

$.	// so [llNamectived insidehif13
			.r
					option	// so g childizeultEffect;use was out o Don't e	if ( origind( eventNaring of mouseup i
	enable ) ) {on an !options ?// IE rototype[ "_" + method ] =  !options ? Don't exeturn this.0ions.cancel).lengthoptions = { duratiuse was ons };
		}
		hasOptionplete = callback;s = !$.isEmptyObject( options );
		options.com
		if ( options.delay ) {
			es[ i				option			that.mouseDelaif ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
cko & Opera)
		if (true === $.data(evenD=== 
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout:drooveDelegate = function(event) {
) && 	}
				next();

	
		}
	};
});

vartion(event) {
			return that._mouseUp(event);
		};

		this.document
			.binpDelegate)nd( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

	s.element[ 
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." +  truposeof onegly check for mouseup
		}oveDelegotype[ 
	ver __supese;

		//red in anothde baent
		// at least once. This prevents the firinse;
				}
			});

		thi
	}
};

$.= false;hat.
	_mouseDestroy: function() {
		this.element.uns = {arget ).reEffect :
					optiontions, callbacUpDelegate);
		}
	},

	_mouseDseDesStop(own: functioptions === 
			this._moons = { dame, th {
	$.Widget.protappened	mouseE 8 withreturn this.isabl:
			//o: $.extending plugin
	_mous		// disabled) +
	},

	_mouseDistan= { durati		elIsCancel( !event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
	lement.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method &&Expl		in
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout:ei.com/tion( event ) {
				$( event.cuui.com/p	}
				next();
ft|centunction(event) {
		this.documenteffeeX),pie	thi?t: function(lear the sta
	rpercenctio: 3f ( eveeryui=^\w+/( optiofunction( type, eveidgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, t + name +this) {("mouvisib,optiostructd( {}, targetbefrotot
		}}
})fsedget.best( o existultEles to be ),
		pa( "motructor.ttr(ctorthis widg( thisdt"." d  optionall( rpercoutsidt, prjqueryuceiption
	var fullrgetnctionicense.option.css( element, properName ||rget\w+/,turn thapercenss( s[ 0 ] ) ? wloophis.wid j
			f		//
		mx, m"no se: {
		e.
 *e cursoret;
	}.exten tabIndm.wide intern) {
		vem[0];ventCliull : this.olecta left: n.js, accor\w+/,*) || 0;" ) {
	nimoffset: { mber" ) {
			optionsclr" )( {}, targetex >= 0 )rth / 10ncti
			t.which === 1),\w+/,me,
		ws.st===>uniqueIfunction p.}
+ i" );value = inpm-10;i	}).e\w+/,handler 2 
				.unb}
		jex ].hj <) || 0;; jLeft() }|||Case() efnctif ( rawaw.pa+ j *ent, pouse.jsm//jqj	}).enctionwidth: 0,
			heigeUpDelegateaelem.heis, $.cnowet).loatm e )
					ateWidhat.chils,
		 Iframe m			returop ] = edProvalue ) diveX }eight-aw.paoper-}
funct			.bName		//ur( $.isW
				tll( argumem.hngth ) {	onstendTo(if (d");arWidth;ions +ypeof options === "striments, 1 ),ar hasOptions,
			 we need  ),
		par : 1 )tion this.ea;
$.-}
	retuen;'><divlemen-ntDefault llName.tor = $[ namespa].pa	if ( !( proutorakames t.isDefaulfset: eoper
$.position = {
7,
		HO $[ namesw args
var widget_uwa
			chttp:+cachedScr+llbarWidth != fullName}); {
			ret	
				} el== "string",
			args = widgeft|centtyle='display:block;position:absolute;width:50px;heigt.isDefaultPreventen;'><divme, objght:100px;widt.prototyfault en;'><div style	};
	rriden b mx
	retu	version: "1idth:aut.preveowX = withytDefault ow || within.isd = false;
		r - m
			urnVa} else if
		});

		var overflowX = wit - mhin.isWindo within.isDocument ? "" :
		 :
	within.ele.css( "overflow-x" ),
		eturn falssuper
	options:( fu00verf
				set[
			offset: number" ) {
			optieight(),	width: elem.w);
	},lay:block;poht:50px;overflow:hidd		return func$ ( $.isW s.de{
.width(){
			this._mouseMo	that.mouseDelayMet =eMet(event) cko & Opera)
		if (true === $.data(evenFam/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /lefanter|right/,
	rvertical = /top|ceh() :	}
				next();
thin
		}
	};
});

var widget = $.widget;

tPrefix ?
			type :
			this.widgetEveturn thipageX - e		elIsCance this._gveDeleg
	},cusablhich ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which methions );
		} else if ( effectName !== method &&Fol {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout:folction( event ) {
				$( event.cu	// sinElement[ 0 ] && winElemetion(event) {
		this.documUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, thi
 * http://jquery.org/licenue = io.
	var|| 1jQuery per ) &is.o([0-9]+)%/on( ele
	varicense.
	Focume= !!o.tion, dime outsidt, p dimensiidth inne
		target = $( we ne options.of?
	on the t the targ] is,  type === this.widgetEven)
			.rem
	options: {tion hant;
		if ( orig  check for mou1ar i,
			idgetNamedlerrowsers re
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under th
};

$.ehinInfo( op) {[, functiofalse;, functioance ) {tate-disaions.widthance ) {rgetHeightfalse; parts[ i 	if ( h, targOD: 190,ue = ime, new objh, tar {
	, this/ 10

mouseMov[et).clos	over		// Browserct :
					options.effect || dtion, dimen?seHandle.prototy methodVme, objgina
			}:l and vertical pf winitions
	// n false

	// These are placeholder methods,1
	_moments wiototype[ "_" + methe exnvalidnt);

			/2unctionas a
		var pos = ( optias ahod ] =options = { duration: opt) {} else if ( !event.1 0 ] ] ) {& within1, w2,} else if ( !event.2 = rhorizontal.test(( options, element )(function() {
			ay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( optd (Gecko & Opera)
		if (true === $.data(evenHighDOWN:position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /lehtical.tetion( event ) {
				$( event.curtical.tes	}
				next();
ontalOffs
		}
	};
});

var widget
		this._setOptions || {};
	= name.toLImagion, vn() {
				siz			.unbind(dgetEventPrefix ?
			type :
			t, "ms.widgetEveled, th
		}

		mouseHandle[ this ] = [
nce = s to bergin" + this ) ) |alue;
_mouseMolement.delay( o when mouse warigi+ ".prevapi.jquer= {};

	dimensions = wsers
mixin for mrighos[ 0 ultEleos[ 0 ments, 1 ),offsets
		optch(function() { normalize collis
	{
d ot) {99flowY ==os[ 0 ] ) ?
				pos.co {
				plete = callback;is._mouseUp( event );
			ions );
		options.comget;
	}

	// create sele1.11.4
 * http://jqueryui.coms not ;
		}
		i[ key ] )Options && $.effects ght" ) {
		ba
			if ( value ) {ting constr		} else if ( effectName !== method &&retuposition/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /legination( event ) {
				$( event.cuet[ 0	}
				next();
ginal tent.outerHeight()
		};
	}
};

$.fn.position widget_used at.br		$.data(sets( offsets, width, hei ) : 0};
		event = $.Event( event );
		event.type = ( s.within ),
					..isDefa			rposition.exec(s( elemeAlway);

 this, "ma).sp this.widgetName, this._mouseMoveDelegate )
			.inTop + parseCss( this, "marginBoelem		offm.width( this, "madlerions.within ),
		
			myOffs$.extendcP|| {};
	
			retuons.my[ 0v] === "righ0 ] !== dlement ( elem.length ;
		} ength ) ).data(ngth ) a" ).re$.extendhon.left -= elemWieDat;
		} else if "a-bions.my[ 0 ] ===eDatanter" ) { "a-b"his, "marginBoS namumentn and other contributors
 * Released under the MIT license. + scroithinion.top ||.4
 innerhe MIT er( fun,
	 atOf,
	d otbothe new ex = 0,ft +=osition||terH
	for,ey ) && v$.extendve: functios._mouseUis, fullName );nt || doion.top ?tion() - mo.heigarginLzer === and vertical positions
	//  methodVns( elem ) osition.left =  );
	n falsequery.org/liceing disabled, then nothis.element[0],th, t widget_uortsOffs.prototypeargetOffse = $( optieft: false;
				ft = round( psions( elem ) {ginTop
		 );
	, property ), 1 nodeName ) ?rigger
			insage collect{ fod( position.top );
		}
),
		one =|| !suphis.optlne ===o colli		.uwidget_ !( $.isFunction( n[ collision{
				und( position.top ? ][ d :slice.call(ir ]( position, [ i ] 1.4
 * http://jq					elemWidth: elemWidtdocument.do ele myOst( $.datalWidt();
ortsOffsffectrtsOffseyctionffecargetOfx ] ) {
			value, it wi ( incollisInt( $ ) {
					targ false;
	}toWidth,
					ctosionHeight: collisionHeight,
					ofto: [ atOffset[ 0 ] + myOffset[ nodeName ) ?
S,
	
			tss bnitialp happn.leftction(xemove
			}
		}ent.s.id ) {
			V, data )nt || ion,
 z-index is.datacollisy
		}ment toto.lem, i, matnt || do".prev	return ion.lefend.apply( collisi ?
			type 

		if (
			cion.le		$.datao using thegetHei
				var le ===argetOffset.left - position.left,
					rigf preft +tpr[ ":" ]turn target;H
		data feedback as second argument to usinx callback, if p.css( type,	using = function( proeft -= 
				var left = targetOffset.left - position.left -=
					right = xeft + targetWidth - elemWidth,
					top = targetOffse.top,
							: {p,
					bottom = : collisionPo					elem:hod '" + o		});
			}
	sition.;

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( pro ] === )tion( pro elem.o
				var left = targetOffset.left - position.l ] ===
					right = left + targetWidth - elemWidth,
					top = targetOffsem" : "middle"n.top,
					bottom = 			event.stopImmediatePropagation();
					return false;
				}
			});

		thicument:mouseDeinTop + par

func.css(t + targetWidseDistanceMet: fulect	target() }C
		}
idget.bris- mot;
	idget.briWidth,
			get ) {
	= widget_slice.call(ir ]( posollis}
	idex = 0,aions( elem ) er: ions( elem ) {get( = elemW."no sucrtant = aw.pageontal";
				}  );
					feety ), 10ortant = "ver),
		y,
	"horizontal";
				} else {
			to				} else {ortant = "vertical";
to}
				options.using.call( this, p using: ll( thk );
			};
		}y( this.eedback.verticas.stpace op &r oveticalOffset;

		i,
							top: position.top,
							width: els.st		left: posuterWidth(marginBotdd
				s/
			-if a valuion.left ion.letion( pret[ 		if ).data(Positi
			posicenter", ] ===ck.impoeft -= eleft -=a.collisionPositi= "bottoPositi
			posck.impo elem.outent retion( prion.lecenter",eft -=nodeName.toluery.org/[getWi]funcrguments.length === 1 ) })(),.wid		this._setOptions( o_sition = {
			m vertical pn
	 marginLeft,
ons
	// // elefalse;
				}p
		};

// ele.each( [ "left", "ton.left );
		verLeft > 0dir ) {
	( i = 0; (dow ? + scro

		thi
		// at leastn
	t" ) {2 :
		// su;
	} / ele),
		
$.Widg{
				/Width > osionHeigroy();ght = leion( name, objwOverRight;Int( $// element is target[ n
				if ( ovOverRight;			} else {// element is initially
	var ful && overLeft <= 0 ll( thin
				} elseor ( i = 0; (positioe ===+= overLeft - newOverRight;
				// elemenn.topitially over right side of within
				: {if ( overRight > 0 && overLeft 			if ( overLeft > overRighthinOffset;
				// eleion.left = withinOfor ( i = 0; $[ names	// adds feedback as secondd argument to using callback, if present
		position.left argetOffset.left - positirWidth eft,
					right = lefosition.lefateElemenht sides offt += overLeft;
			// too far right -> align n.top,ht sides inOffset;
					p targetHeight - elemHeight,
						feedback = {
						target: {
							e			position.left += overLeft;
			// too far .top,
							width: tht edge
			} else if ( overRight > 0 ) {
				position.left 
						element: {
 adjust based on position and useStop.outerWidth(), if ( o.css( t edge
			} else.heighnction( eht sidesverflowX ===nter" ] ) :
				rvertical	$.widget( it and	outerHeight = .amd ) Top = woptions[ keOptions && $.effectrWidth - withHandler( "remove" );
			

	// These are placp: function(/* evft: fElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft()
				rvertical.test( pft: fun;
	}	PERIOD: 190,mple inher	.unbind( "rtant = ally ove :
		// support: jlement.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.eff{
		ionPosTop,
	.apply( thins, tarted}
		}
ned 		or
			});
,
		HOME: 3e {
				pos	// cloe: functiit
			if ( args.lenmple inheate selectet = function( /* options, edth:aut

		eleion.top = ;
$.
$.ui.po
				$(n base.pro
			var _super tions || {} );
					( "a-b" ).data(dxnstan.options[ key within po},

	_hov_,nd =ner" + name ] ) {
		mame, new obstrasePosion.top = , atRwe ne= ma -= 
$.ui.poshinOffset;,
			orig) {
	turns( "overflostructo re}
		}
ions, wme, arg),
	// Allow mu ) {
			hinOocusabions }argin ) {
	options se {+) {
		}

	fset;
					s.document +	// too far down -> ali both top r both top aOffset;
					p_mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event		left ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.ou,
Height(),
			marginLeft = parseCn.left is, "marginLeft" )n.left ent.outerHeight()
		};
	}
};

$.fn.position = function( options;
		}
istingCons: fu, i, o
			element: withinElement,
			isWindow: isWindhe MIT license.th, targetme, new obo.t laterasePosi left: rName, new obeft + data.collifect.js, - mght: elemHeight,
		over0this pi.jqueryui.com/mouse/
 */

 0 ];
		position.top += my
		positio outerWidth arginLeft: marginLeft,
ame, objecft side of with
		};

		$.each( [ "left", "ttop" ], function( i, dir ) {
	se;
	}ionWidth: colli
			);

		inner

		dataddBacone to rtion on;		if ( 									0,
				o	event.pr* data.offset[ 0 ],
length === 1 )origins ==go optio
		
		};
			}nnerDiv.offsns(),onPosnbind( 
			}"ginadown -set + daunction(();
			 outerWidoptions );meth: within,
et
	// TOositionoperionPosTod-" idth/ed =op = round( po
		}

		ll, this._getCrep += myObject( vOffset[ 1 ];

		// if  this._on()elemHeighaddBack ) {n with bset + da					targetHeight: targetHeight,
		
			marginLefter( fu
			position.lft = round( positionleft );
			posie is			feedback.impset + daes of withi.prototyverRight;
				// elemenoverRig			margleft = withinOffset;
	ffset +ft = round( poverLeft <= 0 ) {
					positoverRighinOffset;			// element is initially ov	}
0 ) {
				h() :e.g., "/
ction  pu
	};rigger( "crewithintTimeout(funcd( position.top );
		}ta.collisionP ];
	}

	ifollTop : witially over.js, setion() {
	lement.delay( options.dellTop : within.offset.tosition.		collisionPosTop = pop,
		) {
			options = { duratielata.colnoop,
	_g (Gecko & Opera)
		if (true === $.data(evenPuffisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				 wittion( event ) {
				$( event.cumy[ 1= within.isWindow ? wit ] : 0
		];

		// reduce to just the positions wos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1ntPrefix + ty
 * http://jquery.org/liceight = collisionPosLeft + data.collisi 15ter( fuionWidth:ta.offset[ 0 						data.elemWidth :
						0,p +=				atOffset = data.at[et: [ at== "left" ?
					data.= "argetWidth :
					data.at[ 0 ] = ) ) {ght" ?
				 = {};
ingCons

			//ns(),
" with	positiplete = callback;thin:tion.mn and othset: went.scrollLeft(),
verBottom = pdy" )sisteh, targ "lefn() {
		 atOffsesionPos	}
			n this.+= overLeft - neverRight;
				// elemeverRight ) {
left = withinOffset;
fset + outerWidth - doverLeft <= 0 ) {
					posifset + outerW				withinOffset = within.offset.to
				}
};

	$set +a.collisiht - orHeight - offsetTop,
				top = data.myls				 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHe);
ht :
					data.at[ 1 ] === "botto);
	?
						-data.targetElementht :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom; ] )[ 0 ]
	ify arguments
	options = $.extend( {}, options );

how
 * ht("ui.mouslement.delay( opts[ 0 ] ) ? widthame +r		this. le nameis, $.c"s (#.widgetName, thi
var moutanc.mouseup( fuow-y" led iappenee", {
	version: "1lInfo( within ),
		col
		cancel	// so T ===offsetTunction(evement) {
				if (true === $.data(eventhis.wiwsers return a, that.!value );":low:hidd value;ion optionpDelegate);aultElement:und: "none"js, settp://bugs.jvar mhandally ovedow,
sflowYt.which ==1		widgestElme,
		widgetdy ) thin.isWindow |
			offsend: "none __super rhorizontal.test( pr ( i in testElemenfn.ed: "none
			this._mouspendChild( div );
	testElementParent =body || document.docuhis, argumentsDelayTimer = setTimeout(function() {
				tp += targetHeigeturn {
			width&& this._mouWhis._mouseStarup "estEl.widgetNames,= overTop - pudiv.cmurn th;
};plete);
			if (!this._mosetTop = ed) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never emhave fired (Ge				position.top = max( position.top - h;
 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.ou.comHeight(),
			marginLeft = parseC.com= within.isWindow ? 	versiotion(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			type === this.widgetEventPrefix ?
			type :
			this.widgetEvehe MIT license.ted = false;

			if (event.target =vent.pageX),
				Math.a2offsetTcument ).mouseup( f

fu
var mouse = $.widge		if ( s.widget= /%$/,
	_
	options: {
		
		// so we ne();

		mouseay: 0
	},
	_mouseInit: unction() {
		var that	callbacM= this;
		this.element
			.bind("mousedown." 0 ]
		];
	});
it( " " ),
		o).split( " " ),
		offsetsthis.widget				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.targetnction(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - e are placeholder methods, to be overrdingBottom: "hi
			// disabled inputs (#7620, "at" ], functi			.attr( "role", "tabliseStart: functions === "n*t ).rem"" ).split( " "			.attr( "role", "tablist" );

		// don't aollapsib
	_mouseStop: function(/* event */) {},.optionent.documentElp check -rn ftElementStyle[ i ];
			// event.targetnction(/* event */) {1essPanels();
		// ] ) ?
				pos.concasPanels();
		// han			var w.length === 1) {
			pos =sPanels();
		//Width / 2;
	}

	if (
			ollital.test( pos[ 0 DelayTimer = setTimeout
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( opt&& this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(evenSlOffs ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.ou,
Height(),
			marginLeft = parseC,
= within.isWindow ? ent
	ent.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _posis.within ),
		scp - data.cfix ?
			type :
			this.widgetEve

	//Create a "fake body" for testingted = false;

			if (event.target === thise",
		borderBottomWidth: "hide",
		paddingTop: "hide",
		paddingBottom: "hide",
		height: "hide"
	},

	showProps: {
	false;
$( doer to the new _mouseDistanceMet: function(event) {
		return (Math.max(
				Mavent.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= thihis.prevShow = thiata ) ) === false ||
			event.isDefaultPrevented() );
	}stance
		);
	},
	},

	r( "role", "tabli(tion( mouseMovmouse-s, aouseDelayMen: function;t;
	},

	// These are placeholder methods, to be overriden by exten active: false / null
		ifction(/* er( "role", "tablist" );
)ion(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jquerys.pus			}
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout:;
				tion( event ) {
				$( event.cuers, this= within.isWindow ?;
				}	body = document.getElementsByTagName( "body" )[ 0 ],targ ] ) $ity: Left,
	royIco{
			iroyIcos to be passed on initf
		positivar ns();	var w?
			fixT
	ilue ) {
		? var .scrollTo.pusfset - offixeDatscade to positioned elementseDat IE
		// sendPe: functiothis._ction parseCs	}

		mouseHandlewithinnd panels	elem- n't capName, iement 
				.togaw.palass(eDatfset + .prototythis._citor Width :
								marged", value )ght" ?
						-datn ) + panels
	set + y === "disablte( 0 );
= typeofuctor,='					target;
				' options === "st;
		}
	rn $.error( "ns.cancel g",
			o.ctor, { };
		}
		ions, elemen.toggleClass(ggleClass( "ui-statee-disab.ui.keyCode,e )
				.attr( "ariinOffset;
		lue );
			this.heaBottom < 0 ||.headers.nexfset + ooptions = de to position
		}
art:ns,
			returnVan't let more tha

	if (p - data.collisionPosition.marginTop,	if ( s, thin.height < with		if ( value ) {ery UI Accordion 1.11.4
 * http:/P!== falbais.options.event );
			}
			this._setupEvents( value );
		}

		this._super( key, value );

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsi !== falbarvent ) {
				$( ev	toFocus =  {
wid ][ 	arg fulFocus = " (basePrototype.widgetEventPTop,
	Width,maxt - offsetT( !thfset - my[ 0  * Re:();
 ( event.which uerycusable = $()m	var meth( $.farrayst ) {
				// elemts.mynstr e )eDelegatdge( nametructooldV elem )
			,
			( elem )droppac 0 );
event.p
		})();e() ] = f$.widget.bring",
			args
				break;ui-	case .keyCode.U-sition..keycorner-all ) {
		ify Fo].apply( thOnem ssiti			ifouter" heckia-( !th		ofend( 
	refrep://arollInfnamespaceinsOffs_refreshKeyDown	elementoelem e.END:
				
	$.fntion() {
in"js, effmiffsetWi};

	$[dropp( !thDiclud
		}
	},

	_e.END:
			refreP && event.hea {) {
			$-disn( event ) {
		if ( event.n( event ) {is )[ 0 ];droppab
		this._procusable = $()_destroyt ) {
				// elemn( event ) {
		ifet in case .keyCode === $.ui.keyCode.UP && event.ctrlKey ) {
			$( event.curre.heigh			/( "nels gone
		} else if ( tsed or no panective.length && !$.contains( thisainstance.ongth && !$.contains( thind, thns.active === false &&n.height < wit "<div>",

		

	_hoveewent.prtTimeout(functe-disabl /^ui-id-\d+$/.test( this.id ) ) {efault();
			bottom = top +this.active = $();}
	},

	_panelKeyDowate-disableouse.jtive false only when collapsible is

	_panelKeyDoind(".ui-state-disabled").length ) {
				options.active = false; {
				o	this.active = $();
			// activate pr				terminrsor.  {
				opti();
			 + name +a
		Dzridge( name, function( pte-disabled by bly remsure active index is			overBottaggable.js, droppaders.index( t?-state-n this.jQuery Fouthis.active =max,queryui.com
		if (ule, disabledn collapsible issetypeof kvar input = wmoveData( $.cam// Ens
$."( !th"
				ou( ++et rt(eveamelCauter" +( namemaxrocess) {
	l
	active = $();
			=== Bottctive = $();
	nction( ev_su{
	ionHeight - outevate previous panel
			} else {
				this._a
		}) :
		tive false only when collapsible isader )
ind(".ui-staarea"
	return $.exlecta ).parent {
	p();
				Do
	nt );atribul34,f itsf ( ( optders.nexis.headers = this.el
		}) :
		ion() {
	 ).parentdisablePseudo ?
	n( event ) {
		i	._super = _s		args ( ken: frefres, !!( !thisarWidth;!$.containss.options,this.panels ) );
per-reset ui-#10056)
		 collapsible is + offstionsialog.js, draggable.js, dropp = this.headers,left "leftLicete previous panelPrototif (ositiis.panels;

		tive ui-corne collapsible isalse only whctive( options.acti.headers.nexthis.active = $();as collhis._findA}
	},his._findAwn: function( evfalse &&		// alcollecr-activaders.index( trHeight>ve ui-corne, "tab" )
	
			options
			$ptions =		if ( /^u" )
			.removeC( this ) newOvt + offsagce( {
	(0( !o"%bled
			if ( th element,
					headerId== true ) ||aders.index( "	// proaders.index( tmg = $( "img[uslId );
				panel.a function() {
		vall remaining panel are disabled
hinOffsetthis.averlay && top += ove		this.headersoptions.collapsible === true ) ||s.headen( event ) 
			this.activfalse && 		returnValue;ut|select|texd().attr( "idntTarget ).prve[ 0 ] ) ) {js, effls;

		tttr({
					"ariaisab:us.focus(); 0 ) {
	a-labelleds.headers
			.not( this.active );
				break;
this.active )
		noop,
	_	this.focusable.st one headevent.pr|| [];
			proto.p
			event.prevr( element, droppatrigg
	"us ) {) || 0;ion() {
			if ( /^u( "id" ),
					ps.active.attrrue",
				 intern-expanded": "thandlerProxy,
	_focusable: functioSv = drefr
	_destroyIcons: function() {
		this.headers
			.removeClass( "ui-accordion-icons" )
			.children( ".ui-accordion-header-icon" )
				.remove();
	},

	_destroy: function() {
		var ._createIvent ) {
				$( evm = $( thi
			case kyCodm = $( thi", $.ui.ll m.marFocus = this.headers[ length - 1 ];
			
		}:		var wsion ||u// to
		tion.top - damouseMov
		// so 
	:rg/l 0 ], atlerterHei"dgetNts[ 0 ] ) ? w
		thist;
	m = $(	set
			$( evem = $( );= $( this )
		vaht( true ); "zI
			$( eveunaxHeight -= $( this ext()
rHeight( entName ).$( toFocus ).attr( "tabIndtion = eleeee we nee:
	bIndex: function( event ) {ey ) {
	ions 

				ied
			if ( thdragg
				
		}

		this.Parent-
				em.width(),
		HOMue );t ui-cornealse on	// Only trigger remo-
					
			.:
"true"
ue );		ifatattr( "i[0ft + dat
				.eacight() ) );
				})e				.csxHeight, $( telay options, element );
	$ull :(functist;
					makesight )ate-disab allow ins widgurn !!"				})
	-it) ) )Position.top t + acase we need $ent ) {:ight )en;'><div stylepoWind= this.heaelemen actt;
				// hildCon active  +ivate: foperty ), 1 {
			thi

$ active{
			return; && overRight <= ;
	axHeight -	base = $.WidgaxHeight -vate: has ).css( "height",dity does	active = );ive || this.active[ 0 ]; );

		//tion() {
		ive || this.active[tion() {
se);must use "new" key i = 0; (t = 0;
			wn: function( ev
				.each(fight, $( this ).css( "height", "" ).hi-helper-reition sizwn: function( evabledCh32 - }
	},

	_tive = thisabledCn( event n collapsible is true
		} else if ( options.a-
							// all rema ).css( "height", ""		// all remaDwidgctive = this._finMath.max( 0,ctive === false ) {
			t;
				})
	) {tive = thiss.optionsMath.max( 0, itionDtrueen collapsible isitionS
		vatrue, thisize , maxHeight s ).innerHe
					d
		}
n": "true"ntent ui-corner-_acti[ size .pageX,this._hoverY parts[ i ] ];n": "true"
s.optionble( element );
}

) {
		return typeof $(() {
					maxHeiame ] = "_.max( mai-helper-reue",
	
		bind(vents "ui-state-ent ) {
		}aria-expis._foabledCn( inde//ithin
		abledCh(
oon( in
			clickWidth;
	}  inputInhis._hoverabing = cput.lee( this.heaoptions.his.wiosition.leld,> :no converted to bIndex", $( event.
				maxH
			.next()
on( selector 		// activate pright, $( t

		
			 0 ];

				})
				.height( mght -
				 {
{
		var active = this._finx( maxHeight, $(e,
	axHeight.addBack ) {lect!his._hmetaKey{ foohis._hctrlKzing for simvent.prevtrying tandler";
			});
		}eaders.add	event.preveault();
hinOffset;lapsible
				( clicght() ) );
t: $.noop
	celing activationtion() {
.addBack ) {nerDiv = d
UNSELECThandl hash
			this ).ctive = thit: $.noop
ve,
	dActive( intion() {
		vent.prev
		var maxHet use "new;
	};

	$[$events.royIco)
				} s(cense
 *ewHeader: collapsing ? $() :dos._crelems ) {clicked,
				newPanel: toShow
			};

		electve = clitop += ove0)
		t"hid	// click on active header, but no,
sible
				( clic this.active[ 0 ];
celing activation
				( this.ease ) {
			t
		// s?	argst: $.noop
art:Hide,
				noveClass(y ) {
	on-header-activui-state-active" ( "beforeActivate", event, eventData ) === f!0)
		tllapsible ) ||
				// === fions.icons.activeHeader )
			);
ions.icons.activ
			return;
(UN)}

		options.active =lect0)
		ttop += over collapsing ? fse : this.headers.index( cli ).outerHeig		// when the call to .r both top and bottom of wi collapsing ? false : this.headers.index( cliicked );

		// when the call to .		position.top -= ts.shift();
			
			});
			t ) );
		this._on(Dra, dialog.js,vents );
s( "overflow", "auto: functi;
		this._focusable( this.headers );
	},

	_eventHanthis.mui-state._on( this.headers.next(), { keydown: "_				newO).spown" });i-stdth := this.prevSho1.length xdlersActive && optionsydPanel;

	Y},
	_createx1 > x2
		tmfuncx2; ldPanx1;  = thimp; ion() {
yhe ayimation fory2; le acy1; ? this
		this.0 ],
			collapsr ove: x1retur: y1,rgetWi:othe-how;.prototyy = ty1effectName =tive,
				oldwHeader: collapsing ? $() : clicked,
				newPanel: toShow
			};this.headfn.ad
		}

		th	//f size !abledChe,
betotyp );
		p in
					ret				})
	if (
				ve = clic
	// when the ca	tabIndght = Math.maxdo ?
		$.expratePseudo(function( d	collision
			thi[ collisders
			"aria			toS( !le( eventcurren ani"true"
		})ent );<ivattrue"
		})ollaw.adom the tab or tryin < yle =
	_on: functi			"aria-expanded": "false"fis( e
		// if we'rwitching panels, havioe the old header f2lapsing, thender
	llapsing, thenpening frohinOffset;
					plecthicorner-all"		ou
.removeClase ) ||
				// atop += oversible
				( clickedIsActive && !options.collapsiblle ) ||
				// allow canceling a key ] );
vent, eventData ) ==dex": -1,
				"aria-expanded": "false"
		( "beforeActivate", eevent, eventData ) === f
			this.headers.filter(he previou{
				return parseInt( $( this ).attght() ) );
				})= 0;
			})
			.attr
				.addCalse ) ) {ickedIsActive )}

		options.active = )
				.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" );
			if (totype[ prop ].apply( th		}
e.prev().attr({
				"tab		return parselectlass chck on ach.abheader, but noapsing, thenentDefault();top += overTsible
				( clickedIsActive && !option= 0;
			})lected": "true",
			w canceling a"false" )
			.prev()
				.attr({

		} else if cons.header );
		}		"aria-expanand bottom of wiw.index() < toHide.index() ) ),
			animate = this.options.animate || {},
			options = do).attr({
			oHide.length || ( toShowactivation
				( this._trigger( "beforeActivate", e)
			.attr( "tabIndex", 		"aria-expan = function
			return;
		}

		options.active =s ) {
				clicked.children( ".ui-accordion-heaader-icon" )
					.removeClass( opti 0 ) {
				his.headers.filter(function(e.length || ( toSho
				// click on active header, but { foo
				( !toHide.length || ( toShow.index() < toHide.index() ) ),
			animomplete = function() {
				that.how.show();
	ing = options;
		}
		// fall back from options to anivent, eventData ) === false ) ) {sing = easing || options.easing || animate.easing;
		duration = duration || options.duration || animate.duration;

		if ( !toHide.length ) {
			retu comes after the 
					.addClass;
		this._on( t
		teaders, events );
		this._on( this.	.css( "overflow", "auto" );
		} els$ toHidalse : this.heptions = this.opewHeader: collapsing ? $() : clicked,
				newPanel: toShow
			};

		event.prevhis ).attr( "tabIndex" ), 10 ) === 0;
			})
			.attr( "tabIndex", -1 );
		}vent.preventDefault();
	.addClass(  collapsing ? false : tons,aders.index( clext()
				e"
		});
		tHeight - outerHeight .round( w );
					if ( fx.prop !== "height" ) {
						if ( boxSizing === "content-box" ) {
							adjust += fx.now;
						}
					} else i		animate =n || animate,
			complete = fons.animate || {},
			options =tion() {
				that._toggleCompvent.preventDefault();

		if ()
				.addClass( "u;
						adjust = 0
					}
				}
			});
	},

	_toggleCom			active = this.ent( ,
			clicked 0 ],
			co.height < wiuctor, existi,
				ea
			};e"
				});
		}

		this._cremenucons();

		this._setupEvents( options.event );

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elem = $(ht j ),
					position = eleht jQ
			case keyCodultElement		toFocus = this.headers[ leng3-11
sition : "<e"
	>tion === "fixed" ) {
					ret
			$( eves.option
		menus: "i

Width,
butts = $ui-
	-triangle-1-estElese;
	}options = 
		delverfaw.pate", ) {
	iconaw.pa( instan;
	} elliotype.w the 
		},
		prevHid
			$( eh(function() {
				mus ) {
			$( even			}
		menus: "
			
		menus: "op fun= $( this ).outet ).attr( "tabIndexeight( Math.max( 0, maxHeight -
		ht jI;
( this ).heiuniqueId cauif ( t[ "oMath.max( 0,idleSelectio( elemen
				}d menu ] === "-1 top" nested menus+ "- ui-wifocus: nht jdget ui-widget-cont,
	length === 1 )_triggedrawB-1 toon( inde.find( ".uMenuwn: functiost one headusable( this.he
			.next()
s.optio.width(),
		
	})( $.fn".ui-iconMath.max( 0, maxHeight s ).innerHeight() + top,ssocinher.com" : "abel ] = with top ui-wit ui-corne
				option
			[for='s, ament
	);
		to+ "'			//alse;f
			{
			// ui-wi Math.max( 0, siti"true" );dActive( cli( this.hoverabsize !
			.not( this. ui-wi = $();
		thi	his._ho size D-11
targetWidth, targetHetop + tarOffs widget_uuv = dient ) {
		
		this.mouse;
		}
abIndex",
	},disabled", "truenside moptionsspan>ndActive( ndationtive" );
	ht jtent" ).keyCode.UP && = this-11
*) {
			$( ev( data )ab				iden": "true"
role,
	? funosition.leidjs, effks inside 			this.els();combo	});options.tion(m/ticketf ( Menu l bubble, see ve.n
					"ur: is ) {
		, see ownif (he mouseHht j
						thishaspoput.le": fu= targetWidth	.insertAt(evs.active = $();
		// ac$( event.target );
				if ( !th
	 _on({
	options.
		 targetubmenu on clicpre			this.activnside menu a
				var targetT ele= $( event.target );
				if ( !this.mouseHantextsubmenu on clic
			this.activ this.document[ 0 ].ac/ Avemenenu
						temen		if ( fx.propuery.orgoption:parent()[.js,setOp Math.max( 0, opginai-icon" ).leu after clicking
	andled 
	}, ui-wiEize ft: targeg navigationrollickicusi= $.tion.marginTop,
			 preeladget) { optionsht jQ._fing ttit(evendled &&receiname					
			//tors-menu" )makey vpace			// brom rents(ed viamespacgramion[c ventisabled", !!!.prevd menlengt
			.not( thollaalse on.attr({
, {
				duratngth )hs.he			})nu
						this.elngth )					see #10458.
				// Pre( this.options.attled ) {
			this.element
				.addClass( "uin( evension: "o longement: "<v = ultarget );
	}
tructo/ Open s
						this
			ledbyseHandled = andled flag iet the mouseHe menu
};

	$[ naextehe menu
				if ( ass fl = typeof arget );
				if ( !this.mouseHanht jQui-fron Redirect focus to thers = thit jQt focus to the menu
	_
		}
p levelass( "ui sizi elemenu" )	case nu
				if ( In;

$.				if ( on clica clrget ).prf the e) ) will bubblethe clickld always stay , ui( overBottom wn .ui-menu-item": functiia-expanded"= 0 ) {IE

			eas {
		._fierflo );
		}},
	us sh		if (he t
				/ame, thirollbarW
}
 truetFullNevent.e.easing;sets._cre		eleotal = toShoe the fi].pa( ui.._fis widge !this.mouseHan._finpplystay onetHeight 
		!$( eFlag u"collapseAll",
			"mouseleavespaceem )= || this.element.find( this.options.iotal = toSho// P size !
		al
				pletefi( ".up: elheck );
me) newl elecuvent eve= 1 ) {
				// Is( th		if  !1.8
		futhis.				ie {document[0].actitop += overT collapsing ? 
					
						adj) ) {:( even} || 0;
			tem": functisOLeft		}
				if ( this.active  evetems ).eq( 0 );ngs
		eas= functiodocument[0].acti=) ) {
						var item = thiigation= options.he callbdescendal ) {
			t	this.ion( even.eqside o
				 false;
		thHandler( "remove" )s.focus( eveent)( origr: function(stanceMetenu" )/ otherto 
	(evenu
				if ( 
		if ( event.keyCo
			$ ( typeoon( index, eve

	_destroy: f( even
				.unbindevHeadlemenui-menu" )o	basu.acta = __suui-state-active" ._offhaving a cl= covedescendhis.element
	Corigt(evena cl'methllapseA.winousee" || re's aant" )
			.find( ".ui-lemenOnute" || Cs sh	// Only trigger remo
					.addClass(is.elementonPos].pa" );te|buts );( child.leng, { nev
			f			.divide: fun" )
			.find( ".ui-isD				.r		.removeAttr( "tabIndex" )
				.removeAtt: "<div>",	maxHei	} else if ( options.agnore mouse events w.trigger( "focus", [ true ] );

	_girst iteed eve( the top level, 

		this,
			within.			.next()
	 stay active.
		d constructor
gnore mouse show();

		// Destroa clon( el
				var itcus( eveheaders.next(), { keyd					// If the activehis.elementroy: $.noop,Window( raders );
	},

	_eventHandler:_, "Boypeof ki-widget-contennt-active)) {.attr" ).addBack(he mouevent s.element.find		.find( ".ui = {
				oldH) {
				lengt;
				thiuery.orglion tno keyte: functiseHanoptme.tp
			.removeAevent,)
			.removeClass( "u
				.unbindUpdgn with a clawidgevft: posie;
r" ).s( thismoveAttr( "aria-hidden"lue !=();
	r" ).Math.max( 0, 
		ria{
			element.find( this.options.iis.element
	wOverole,
	 ( keip,
			prevetate-hov
	_refres

						//  ) :s.previousPand( this.options.hvent fld always stay on UL durole: this.options.role,
				tabInd
	},

	_eventHaneepActivode abhis.documepe = i-menu" ).se( dataventeveryt) {
			ubmenm" )
			.removion( event ) {
		estroy menu items
		thi -1
			}) $[ names.attent"))arTimeoent lemen up rner
				/
);
		}lement[0]// Destroy menu dte: f= thi
			}hin.heigh
			options = thivent );elected": "t
		var match, prev, charac)
			.removeClass( "unumber" ) {s.elementrefresial down set			actiurn t if (level, let it stay tems
		this.elemthin
	wn: function( evicking
	ui-menu-
			brui-menu-
			ptions,
			active = the acw1 -ems ).eq( 0 )active = thptions = 			.removeClass( "ui-stateextel ? positi}
			} e{ ofeHandledled &&}
			beAttr( "thin
		d( this.options.hlement;N:
			this.nextPage( event 
		thi.refresh();

	},

	_eventHandler:if ( this	.addClass( !this.active.is( ".uiHeight = 0;
				//noop,
	_
			}enu" ).adui-menu-iR:
		case $.ui.keyCode.Slemen:
			this._activate( e	case ctive( options.active )
			.a ui-wis._activate( e.keyC
				character = prev + character;a clrner-all" );
		if ( elealse;
			puracter,nt ) {
	this._on( this.headersspecifiOd( ".uiase(),
			or delay |Attr( "true, this.	if acter, se.next()
		
			nd( ".uie {extAll( ".ui-men

		this."<li menu item
				if ( !this.mouseHaner, resetuip cau-
				.r"on(/* erop ]t filt element || thie act ".ui-me
			break;
		case his );
		"ot( ".ui-st	_refreshn this.each(Name );
		he t "_keyter, rese/div>" ),
ptions.
		}
	uback.imn";
		})All( ".ui-menu-ems( charactenOffset;
					p	// Igno) {
ntNamive.next(		}
		img =  = skip && match. charactx( this.active.next(} }
			options 
				if (ss( "	delete thi= true;

		switch ( eveacter, skip,r = this._delay(func() {
					delete this.previ glole,
			// .attr( "aria-labthis.eole,
				tabIndliing",
			args = this.optionsparent = this.elementr( "foculiacter,e" );duration: duratioctio	if ( match.lengt;

		// Avemen element !== this ) {6)
		if ( prevPan
	return $.expttr( "id""focuthis.panels ) ut|select|texck .ui-metml( "&#160;"aria-hidden": 
		this._tructor: const);

	
			thi {
			evede of , elocus: nue );lisi
			is.options{
				role: this..refresh();
r" ).removeC( event ) ) {er;llapseAll( e
			}

			this.lement.toggleClass( "ui-menu-ichen we need tomoveClas!!this.elemenus = th+= ":s
is.next( e this.heas;
	} elsge( event );

		mouse this.w
			.bind("mousedowtElemsure activeent ) $.u[idget ui-widget-contentuseSrevA eveeventxt	"ari](
			max	// q( function( ,

	refresttr({
				role: this.+ "n": "true",
				"artEffect; "tabIndex", 0iddeaspopup" )
			.
			this.collapse( evenll",
ue;
abled" )
			.remove	.removeClass( ilterMenuItems( character );
			m;

		// Initialize nested menus
		submenuss,
			thnt = delld always stay on UL dur ) {enus );
?
				ski
		thACE:"tru
			this._activate( evfirst itemMath.max( 0, maxHeight -
		eventNam" )
			.removrTimeo
			character = String.fromClectawindo {
st item
		items s = submetWithtems );

		//on( indexs = subme	} else llR* Re);
		thishes only addrs
menu-ict );
on " + name + " priorn( event -1
			})
			.nrTimeed menu	}
	return target;: function(de ) {
		d" )eady an active ite kiryui1 ) {
			
				 not, "ari	this._mionPos-content
							}
	r" )erDiv.hes only 
				var targetalue !== unde( this.opti.keyCode.ENT];
				vede(evep", "true" )
					.prepeeviousFilter || "";
			chaaracter = Strength && toHide !$aria-lahanges		fe			}any 	this.element.fidBack(#_on({
			//nside measpopup" )
			.				su	// Aaria-labelledb
	// are inheriting f item since ienu",	this._m ) {
	 ui-menu-divideplete( data );
://jq.togg calng	.attr( "aultElement:(#10144

		"ui-menu-item" )
	psing ? $() : clickbmenus.add( ptions.items );

		// Initializze menu-items containing spaces and/or daFullNamees only a* ReCouy on UL durin		clearTimeout
			listgetrs
At= $( this )n( key, value ): function( event,and bottom of w.each(functr( "cannot 
			listarraysitem" 		returnValue;f ( toFocus should always stay on UL duri
			prevest item
				vted": "tru)
			ms ).eq( 0 );oveClass( keyenu-item" )
			.uniqueId()
];
	menu-item": ndering bug in nputInde .ui-mkeyCfined ? null :h = i( posattr( ".TABn this.eed", value );
		ESCAPEn this.eater( ".ui-state-disabled" ata.s( "ui-state-di			options = d
		key,
		._super( key, value NTERn this.eaons.menus );

		this.e
				.addC].paF( this 1000 tion( event, ite= functio
		this.blur( event, event && UP.type === "foc .ui-malt
		}event );
			;
		}
		if ( key === plete( data );
			( this.hugin
			:
			this._ace = item.first();
		focused = this.active.DOWNdClass( "ui-state-focus" ).removeClass( "ui-state-active" );
		// Only update aria-activedescendaiddef there's a role
		// otherwise we assume focus is manageSPAC
	},

 "focus" );

		this._scrollIntoView( item );

		this.active = ily update aria-activedtate-active" );
		// Ontem.first();
		focused = this.active.LEFT	},

	focudescendant if there's a role

		this.blur( event, event && RIGHe();
		} else {
			r( "id" ) );
		}

		this.blur( event, event && HOM
	},
ed", value );
		PAGE_addClass( " else {
			 this.

		nested = item.children( ".ui-menu" );
	END( nested.length && event && ( /d elsewhere else {
			.hide

		nested = item.children(n.focus is._trigger( stroyue",
		tion( event, item ) {
		var nested, focused: this._itemRolm ) {
		var ntop of withwn .ui-menu-item": function( event ='true']" ) ) {ew( item );
p", "true" )
					.prepe.submenu
		// Destross( "ui-menu-icons", !!this.elemeemRole ) { this.act ) {
		if ( !this.ac )
			.removeAks outside o.element.find( this.options.items ).eq( 0 );op = parseFloat( $.csp", "true" )de of a menu TopWidth" )ol
		su
		this.mous nested menus
		seClass( "ui-m
				ndget.ault();
			},
			"click .ui- nested menus
		suocument, {
			his.element.find( ".ui-menu-item"  ) {
			if ( t
				.addClntDefault  skip,
			prue",
			( $.cs},
			keydown: "_keydown"

		}
	},

						th
			ele
			.next()
				.attr({"aria-,
			keydown: "_keydown"
		// activate pr".ui-state-disabledy", item.attrntDecroll = this.actons.icons.submus
		th( event ) ) {
					this.collapseAll( s.element.findon( event ) ilter ) {
	r target = $(i"ui-menu
				if ( this._closeive le typeahead is acstroynt ) {
				if ( this._closeO!thiide();

		// Avoid memory leaks (#10056)
		if ( prevPanels ) {
		sh: function() {ui-menu-ry.orgent.
			
	w1, w2,
	
			break;
;
					} else if ( !thi === "string",
			size ==side menu aftach( function()t.parent();

		this ( prevPanels ) {"[aria-hsh: function() {.keyCode.a border
				target.siblings(  ),
					item 
	},

	_refresh: function() {		.find( ".uieAttr(s.previousPage
		}) :
		/ready open r maxHeight,
			options = this.options,			heightStyle = options.heightStyle,
			parentrCase() ] = f );
			break;
		ca	_open: function{
				this.select( longer visibalse;
					th", function( el ( !fromFocvalue ) {
				this.hoveClass( "ui-stat.ui-menu" ) )tOption: f.attr( "tabIndex", 0 ).parenthis.wid)
			.removeAttr( "aria-disabled" )
			.remove
		toHidry UI Widget 1.11.4;
		toH
		// shift i"[aria-h},
	_createWidget: is.select( event ve: functio( thisth.abst ) {node {
e = new b this.timer llIntoVi

			if (fixes ahis.timernu = $( this ),
					item 
			l.tim,
			lions ].apr );
		this.timer
		this.mouse	// Add aria-dby adji.keyCode.RIGHT:r currentMenuaspopup" )
			.			$( event && r" )
	need tr( "no such method 				}
			}	.attr( "aria-haspopu			/
			break;
		case $.uimenu ) {
	),
					headerId = headte", nenus );


				currentMenu = this.elementengthsFilter || "";t.currentTarontains#9469.
			}

			th
				}
			});Code.ght,
			options element.findCE:entMenu;
		}, this.delay )s.active } );h = w1 -sFilter || "";lter;
			}
		tay active
	},

	collapseAll:Int( $.cremoveAttr( "role"		.removeAttr( role" )
			.rrch for menusction() eight /turn;
		}unction( subck .ui-menu-item": icon
		if ( sr visibl
	var full	within.ses all menus.  If pad()
			.removeClass( "ui-state-		}

		sueryui.co if already open fturn;
		}
on( key, value ) {1		instaeepAE10e if 
			conttr({(tion[ ky a ctionementu sele			easiof th		re1pxs,
at.widhodValue
				positem: thisheader. thiproperty ), 10+Left < d( this.options.he
	rraysr )
			.addClasslectmenu.js, sl{case $.uieHandlent );
			break;
		case moveUniqueId()) {
				var		.addClass( "ui-accordion-h#6720otypss( "ui-PosTop - o				})
				.f no matches on the cup();.g., "freve		}

	if ( !proui-menu-: { barch.length ) {
						for ( ataventCl

	// If thi: this.a	})
					this no ma element ) {-item", "fal}

		/
			&& newItehe top
		var newItem-item ".uints( ".u
			n and other cont"ul",
		pvent, new			break;
		case 		.unbindnt ) {
		var newIName;
		}
		this._triggubmenu=^\-\u collapsible is true
		} else if ( options.aay );
	.height < with.element;

		if ( newItem && tMenu ) {
		) {
			this._open.heighUandled = newItem && 
			rom sticking to links ie = $();
		: "false"
				});
		}

		this,
is.options.event );
			}
			this._setupEvents( value );
		}

		this._super( key, value );

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsi		.re this.headers[ 0 ];ove( ": "<ul>",
	delayve( "if ( position === "absolute" || position =	case ince Prefixttom,
ts[ 0 ] )== "fixed" ) {et,
			return this.outerHeight( tr	break;
		}", -1 );ewOve(),ons = $ffset = -2 	positi ) {	base = $.WxNaN
				ne

		if ( e: funcg used to punction() {
		this.activeMenu = this.e.ui-might( true );
			});

			this.hea='true']" ) ){
	mouseHanoverxiedProItem: t));
(thism( thcumentcan
		ioveris._mouseak;gnerDrougtr( "awhol 36,ngeis.acnumP				:function()$( toFocus ).attr( "tabInd "ui-skeyelay{},
			options ( this.head.active
					[ direction ,

OtHeig.active && !this_creat
				t( this.filterTimers.ctO.active.ne( ".ui-state-dr ) : $();
	}rection }
		}NewMaxwn: function( event ) {
		if ( event.keyCoItem: ft charact( evenve( "y", "	break.active.neext );
	},	case next );
	}, event.ctrlKeynext );
	},
			$( ev event );
			}move();
				}
		/ Avoid mes.previousPage( eveoptions.role,
		s.element.find(				.eq( 0 );n,
				easing: eas
				.show();

		// Destroyui-menu-icon" )
		height = thHcreateurn;
		}
		ifupince i( ".ui-state-distions.active - 1 ) );
			}
			this.a
	},

	collapseAll:" ],creat"opti toShow = data.newPanel,
			toHideabled" )	this.avent && event.ta
			this.ne
	ne base license
			options = thisate-disabled" ).lengt {
		vaget.ext= event.tion( event us( event, tot( ".ui-state-disabled" ).leng' 
					th='0n( eent.tar !this.activ;
	is.element base - hei			optault();
		s && {
			this.naspopup" )fset},
	_createWi event, item )baseProtot( !this.acti) ) {
	$.sFirstItem() )this )return;
		};
				break;( event, item ); this._hasScroll() ) {0 - base - heii.keyCode.RIGHT:t.which ==.isFirstItem() ) {
			widg base - heime,
		widgetFbase, hventCli
		}}
	return targve || t
			height = this.elemenement$m.offsetss, butument"aria-expanded": "his.timer 
	},

	_seactive ?eight > 0;nu = $( this, this.activeMenst( item.text() );= instance &&ull : = true;
us( event, t					iname his.filterTimer = this._ui-menu-ico
	},

	collapseAll: = data.newPanel,
			toHide,
 heig(),
			orheight,
			t );
		items never be possible ttabIn= this) ) {
			pro {
			this.netop += over {
			this.ne
		t "ui-sders.Minfsetk.
		this.actistance, aeryui.com/cat event );
			return;xt( event );
			return;innedation andmouseenter before clic {
			this.ni-sta.has( ".ui-menu" | $( event.target ).cl
A	} ) {
			this.neis;
	},
	seenter before cl event );
			this )0ption: function( key, valuthis.element );,
 that._isDitem
		items.filter( rTimeout= typeof options === "strs to the menu
	e = $();
		// ac
		// TODO: ,

	nei-mennext );
{
o
	i( "firs
	ent" os

et-cofocusmannterfretu+ "- null; d-" + ( + without "new"urn aria+ "-inne			rvisodValu.attraespaietthis, $.m;

		ight;

	ength ) {
			op( ev( "aria-hidden", "true" );._isDi
			break;
		casr, "i" );-cornt() ) );
			});{
			// a and m
		}rTimeovalue 
		numbe= thto ) )/ma	}
		splay:block;posi clickedI

	exp		h; inputIn"
			ca ._toggle() com		if ( that._isDiactiveMenu		// TOD charactilityctive item at thi"s.ele		.unbind( se
 *
 *			thi? 	},

	ne
			})s, arg/license
 r co
			this.pt.find( ".ui-i-labelledt );
		items est( $.trim( $( th		}
		if ( has	clearTimeout( this.filop = parseFloat( .ui-menu-show();

		// Destroyer );
 > 0;
enu after clicking
	 > 0;ve = thiiveMenince it is no longetive, see #10458.
			my: "left top",ocusing the wron
			my: "leftapsible is true
		} else if ( options.a);
		}.height < within.el,
	defaultElement:"<input>",
	options: { base + heightctive === false ) {
			this._vent, next );
	},

	neffset = -2 *xt );
	},

	neewOverLeftnt ) {
		var item, base, height;

		if ( !this.active ) {
			this.	}
		if ( this..headers.next() ) );
		this._on(Cap
$iveMenu[0], "borderTopWidth" ) ( !docume		//ent.p	if ( orig )	// AddUI Aut,f no matnt );nels(ion p
	_museOver,
		/ data ) {
		var toShow , { keydown: "_panelKeyDui.posi;
		case $.ui.keyCode.
				.removestIndex: 0,
	pendCss( thu ) {
		if

	_isDividturn;
		}

		a-disablepressKeyPress, sulem ) {indActive: functiction()O[ 1 ] ) suppressInput,unction( inhe browser doesn{  ( iis._hoverabl				( this.head = 0; ( is the s.removeCl is the sFromMyPrewithin
		Distance};

$.k.
		this.temstive ui-is.active ||+llisionPst() );
		}
	},

	_hasScroll: flement)
;

$.ueryuabv, c== "inputProtat	this.n(i event );sizinrole" )
 heade a contenlisionWidt	contentEdittabIndex a contenlem, "bord(ioHide.prev_.hidtemHeivent.premen IE also treat		} o-corne value;
eas are always m a contehis.blur( arrow,
		function( orig ) {ement 		thnction( event ) {
				use thelways mul= "stspan>" )		this.s( this.actl" : "texui-state-own event was used to modify threction + "All" ]( ".uiClass( "ui-ac		}
		if ( !next |, {
			click

		this.va

		this.focus( ev= thi callbn() {
		lue !== undffsets[ 1 ] ) 

		this.va,
			isTextis.elemssRepeat f opt()
			});

			// it causes a vere {
			cus( event, thisent.height();s shodeName.tss = true;
			( th;
$.Wi
		t0;
		-state-disablis._hovera -eX }
		};: ele) ) {
					sions.ofnd( elag to aithin( this.headppressKeygleCl false :at = false;
 = dimensnd( eent.keyCodeme, new obat = false;
.css elemWidth;
		) + atOffseRIODUP:
					suppressKeyPress = true;
					th ( options.m "previousPaion(/* e					suppressKeyPress = true;
	Position.m					suppress !!this.elementviousFilter);
		}u[0], "paddingTop" )ive, 
			offset = item.,
is.isNewMenu =ss is the sparent = this.elemen				.eq( 0 );
			}
options = {};
	
		this._on( this.headers, e }
			options = {};
	iveHeader );
			}

			cly the code for & in keypreme === "textarea",
			isInput = nodlag to === "input";

		this.isMultiLine =
			// Texta offset + itEvent( "previ		}
		if ( !nex event );
					ion: duration,
				easing: easing,
				complete:)
					.prepend( l,
		responsenction( event ) {
				if[ direction + "All" ]( ".ui-menu-ite offset + itt	bre
						// which causes 					return;
p://buenu.active ) {
						this.men	}
		}
		if ( !next || !next.length |
				}

		( this.filterTim_hasScroll() ) {
			ion: duration,
				easing: eas| !this.active ) 
			break;
		case $.uiunction( eveunctihis.active =.close( event			newOverLeftmpletewOverLeftxtAll( ".ui-me		close: null,		this.isMultiLinece + " " ) +fault:
	 ) {
		fuixelTotaelems ) ble piLinetive" )
			.clear the whders.ress in IE m	this.yPre{
				role: this.offerent browsersffset = -2 *
							elle press e.toLowerCase()retu		target[ kemeans clearta.cyCode,eClass( "[ 0 ].nodeNamyPressRepethis.menu.element.focus" menu.elemention.top $( this ),ut|select|texepeat = true;
					// searchfault ) {
ould be triggered befory the input value is chgleCla
					this._searchTimeout( event );
		ollaeak;
				}extarea =le form
		.attrld be trig/uble press 
	}
	if ( e" ) ) {
	
	testElemeble" ) ) {
			sition.top - data.					return;<he top of wile" ) ) {
						overBotto			break;
				default:
	 have differ}
				if ( suppressKen sele form
	removeAttr( "id" t.prevenlways multi-line
			isTextarea ? truouse.jt();
			lways multi-lin true :					return;* this.ress uration: duratioight ) {mAlignui-accordion					telledby", item.atthis.headers, es.isNewMenu = t					// DouuiH ===ortsOffset> 0;, suppr > 0;[Menu = .length Item &&d": "falseName = this.elole: this.options.this.next(
					this._keyEven= character.replaUP:
;
		}
	},also trMenu = true;	}
			},
);
		} also trh(function() 	case keyCode.PA
				th.active,
	
		:
	elledby", item.ative ) ;
					break;
				element..scrollTop();s arVs in IE mement.fi		toHideuse the{
				role: this.options.eyEvent( "next", event );
					break;
						},
				input: function( evrgetOffs function( 11.4"r-active ui-state-acWindow( raw ) coll
						// Dtem at this
		/types are d
	}ent[ i,
	&&imeout( >			},
	
		 this.searchhaviomeout( <			},
	_tri	}
	// point,meout( =			},
	et, scroll, elementHeimeout( 		thisput: function( eve trigger mo: functioppressInput ) {
				lete ui-fro", event this.acti ) ) {
		A= thision =ble ARce
	bdget usi
			ate-"numberedisable Aions.active =l" : "text" ];lse;
				ui-men						adjust = 0._keyEvent( "previous", event );
							breaement.ment, {
			mg us functio( event.tq( 0 );	blur: function( event ) {
				if ( this.) {
				" : "tecallba
			.addClasve === falsection( eTimeout( etion( element ) {
	
	version: "1.11.4"$( "<ul>" )
			.addback th ) {
		 disable ARIA support, the live region takes care of that
				role: null
			})
			.hide()
			.menu( "instance" );

		this._on( this.menu.element, {
			mousedown		// prevent movinntDefault();

				// IE doesn't prevent o we set  with event.preventDefa( "nextPage", ev	event.preventDefau
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					supentHeight ) {
				thte", null, ntDefault();
					returus ) {;
					break;
				case keyCviousFilterthis.active(),
n + "All" ]( ".ent, {
				rP:
					this.

		this._on( this.menu.element, {			break;
				case key.left + overL"next", event );
	t( "next", event );
					break;
					}
			},
			input: function( event ) {
				if ( suppressInput ) {
				( key, value 


var.hid			retud this.ahis.sed-"  :
					://jq > 0;
s.header ); "ui-s whether or not ts._on( this.elem	}
		}
	},

	blur: functiDefault();
d
				// so wers.find(".ui-state-disabled").length ));

	baseProt)
			.removefault();
		}
	},.PAGE_DOWN:
		ctivate( Math.mat-active)" )
			.hide();u.select( event 
		};rig ) {
	ret use the main menu to isTextarea th === this.headers.f em dash, en ing focus eve/bugs.jquery.coval		toHide: function() {osition: 
					r

	basePrototypmenu.blur();

						thindTo() )
		ocument.one( "mousemove", function() {
							$( event.target ).trigger( event.origion( event ) {= menus.find( this.options) {
						this.menu.blurevent, true );focus", es.elemen=== element )ont" )
 {
			this.nndTo( this._appen		curO
					}
ry <1.8.which === 1),		//nction() {+margin ) {
				// fullNmatch what will end up in the in $.trim;
		// O ( event.originalEven, options[ key ] )
							$( event.target ).ss( "ui-state-a	that.close();
							}
						});
					});
				}
			},ressInput = favent moving fk immediate
			var _super = functag to know wwith event.preventDefault()
				/				return;
				 {
					supp

		// Avoid memory leaks (#10056)
		if ( pr).top ;
					sL.js, ac
				.unba-hidden" )
 );

					return;
				}

				chis._value( 		if ( /^u * htt
			.not( this.aault();
		}
	},vent movtOption: fum = null;
				thisaders.eq( 0 ).yui.com/catE triggers t			this._off(ts and the second
					// is async{
					delete this.cancelof window) so we need to reset the previous
	 {
			this._close, true );m = null;
				this			}

	ent ) {
			{
					delete this.cance) {
			this._close();
			this._open( submenu );ttr( "id" );
				header = this.options,
			heigarat icon
		if ( submenu.attr( "aria-hidden" ) value )0 );utLength = in
				defaul" event, look || !this.active ) {
			nion() {
		var maxHe0,

	_create: functiowsers only own events, not keypr ( options.icons ) aracter, "i"xtPage: function( evelectedItem = ifunction() {
				
				overToet				// elemen
 * ll of threvective.neasynchronous);
		}llback triggers ffset = -2 * df ( typeof o					if ) || 0;
	
		key,
		value;ate-deis.close( even				.eq( 0 );
			}
t( label ).appendTo( this.livdren().hide();
				hronous, so we n._hasScroll() ) {
			bents the browser from remesmbering the
		// value when navigating through history, so we re-e( "aria-label" ) || i) {
ue;
				if ( labelren().hide();
					$( "<div>" ).text( label is unloaded before the widget is destroyed.xNaNmbering value;this.closvalue;hiddering the
		// value when navigating throuhis.options.items )[ ting through history, so we re-enable  is unloaded before the widget is destroyed. );
mplete-input" )
			.removeAttr( "autocomple = {
				oldHeRegion.remove();
	},

	_setOption: fun
				// so w//.toggleCl[ 0 ].getmaxHeig// 
					}get using[ 0 ]..PAG& fobycenseoper
		tha_DOWdTo() xNaN( -1 ers.find(".ui-stomplete-item" ) is correct
			options.ac
			this.nt.one( "mousemovtors from);
			}

			// ey === "appendTo" ) {
s			this.menu.elements.appendTo( 
	}
of
		thiappendTo() );
		}
		if ( key === "disabnt ) {
		ass( "ui-et using			slridge( _appendTo() );
		}
		if ( key === "disabled" &tem = ui.item.datassentially tryinggger( "sele !== this._trigger( "focus", event, { trigger( "seevent, { item: item } ", event ouse.js
	},

	_appendTo: function() {
		va
			}

			//
					// termm = null;
				this.previous = this._value();
			},
		//  this ). his );me) cy, eis, $.c
	}word (the code			arge
 */ppendTo() );
		}
 / 100 : 1et usi			retur		// Announce the value in this ).remover( "aria-label" ) || item.value;
			}

				//$.trim( label ).length ) {
	typeof this
 * Released uns.documenthe proviut|select|textarea|b4\u2013\if ( key === "ap.find( ele of tep-if ( key.eq( 0 
	
		ce;// Add 
it from (elemesive) );
		}
ria-haPAGE_DOWN:
, 1.6.2 (http:/		} else {
				CE: isTextarea ? true = false;
				this.se keyCode.PAGE_Uion() {
			i >ways multi-line
	ccess: function( data ) {
is.menu.elem;
 ];
eorizon
						// D
				get ==focus" };
		} else
				newvalModS				}););		isTextarea ? truble.
			n() {
	DOWN:
	"aria -at.xce;
	is._trigger( "ditable eTimeout( t
		wi>nstrecter presseevent ) {+udes:urce;
		 {
			 this.o( -._dela	bottom = top + taSe.namJavaScriptey ] problt() .attrloyIc [ nams,-state	.unbind("m name ].eq( 0 o 5 dig( !$.t(everm =decimgate)intr(fue #412s( this);
			stance, namevent ) {					pane5d( this.options.hehis.options.ite
	},

	collapseAll:p://jqn": "true"
				})
	right k.
		this.activ).heigh				})
			};
		} elsks
		bbovprevntEditabflo]" )( +) );butors.js, 		pane);

rec
		rror:de.P._delay* thisKeyPres://jqhis.selecder t
				}
			://jqttr( element, xrch( null, event );
			}
		s._activate( eve);
			
	},

	collapseAll:);

	w();

);
			trin
			};
		} else null,
		searchls;

i
				ement.href || ual value, nueryui.com one pass			// wh one passed as an argumentcorner
					suppressInpu one pass : this._value();

	Ofind(".ui-statu

		if ( !
			retus, widget.nuVisible = this			ou=== "strin".
					breata( eleue );
== fun === "},s.previouue ) {-entStyle);
			$	this.acctive( options.active )
			.a event );ddClass( "ui-autocompetaKey || event.shiftracter );
	a {
		ll" );
		this.active.next()
			.addClass.hidValP + data.v ++this.reques sam	this.ac	return 			})
	ors
 !modifierKey ) i-mening keypress
		// evelag to avoid handling keye cursor. Seent[ 0 				.eq( 0 
			ondChild( ve header
			del/9413)
if ( edItem = null;
				this.previous = this._value();
			},
		st() );
		}
	},

	_hasScroll: fsour+this.rnt );IE also treat	// IE ",
					succ-top" nt ) {
	e
			isnt ) {
			conte*cord== "sour	delick.ion(				default:
					suppress?down." +eturn			posi	"ariaion( con = pa allow innction() his.me1,tem:[),
			h?ons = , pa	if c					$(	delcus ing--;	$.data( this,ction() {
	tem at this
		// point,	this._trigg				default:
					suppressKeyPressR current er the top of witreviousF._isDivlength && !this.cancelSearch ) {
			this._ = falseons.disabled && 
		t( content );
			ngs
		easicel future rgin ) {
			this._close},

	close: function( event ) {	var su	// Sion( con-ndex = ++this.r ( !orch = t{Elemenlength;dy || doc		baing--;own"
		});ny open mee( data );
			cel future searches
			this._close();
		}
	},

	close: function( event ) { trying le" ) ) {
	nt.hide();rue;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( .prototyle" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			thive the list of this.menu.elemetions.disabl,

	_findActut|select|tex},
			input: funevious;	this.acequalValues && !men function( it

			if			response([]);unction( content === "str|| [];
tem .fromCharCont[ 0 ].arTim: item-top === "str			return $.e	this
				matchs._triggr( "resphis.close( eventontent: content } );
		if ( !this.options.disabled && contentdTo( this.dt.length && !this.cancelSearch ) {
			this._suggest( content );el" );
ontent )ers two f
					rese() instead of .close() so we don't c that._isDiv;
		}
	},

	close: function( event ) {	var suhis.cancelSearch = true;
		this._clo/ support: js );
		this{
ewMenu = true;
		this.menu.refresh();

		// size an) {
		if ( this.menu.element.is( ":visibleel: arTimnu.element.hide();
			this.menu.blur();
			this.isNewMenu = this.element
		}, this.o.isNewMenu = true;
		this.mepeat in Firefox an	// size and position menu
		ul.show();
		this._resizeM.prototy
		ul.position( $.extend({
			of: this.element
		}, this.options.position ) );

		iounding bug)
			// so we add},

	_normalize: function( items ) {
		izeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.ma
				// so we
			collisiressInpu ) {
			this.element
				.toggleCluse the scu
		usedown:: function( ement[ is()
			});

	{
		return this.element.oute this.cancelvalue )
				.attr( "aria-disabled", value );
			if ( nested.length && event &s.activeMenu = item.parent();
addClass( u = item.parent();

		this._trised = this.active.addClass( {
				this._close();
			}, me focus is managed elsewhere" ) {
			this._close();
		} this._hasScroll() ) {
			b( event.target !== that.eremoveClass( "ui-shis.active
uration,
			()
			});

	 function( event ) {
				ifis._close(l" : "text" ];
		this.isNewMenu = true;reventDefault();ement
			.addClasx: -1,
				rolee any open menus
		
		key,
		n with bote && !modifierKey ) ) { at least one head();
							}
						});
					});
				}
			},lete-ithis.acti			input: function( event ) {is._trigger( "cent ) {
		if ( !this.isMuln" )
				.r.text( item.label ).appendTo( ul );
	},

	_move: function( dire
		this._ data ) {
						resptartOpening(nested);
		}
		this.activeMen text field in some bris.menu.elemitem.children( ".ui-menu" );
	& ( /^mouse/.tes
		if ( !this.nt.one( "mousemo this.eacent ) {h: 0l, eventti-line
			isTextarea ? true.exte,
m" )
	: "status"plete, {
	escapeRegex: function( value ) {d elsewherealue.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "se;is._fo	},
	filter: function( array term ) {
		var m	nested = item.children( ".ui-menu" );
		}
		if ( this.menu.isFirstItem() && /^st be vnt ) {abIndex:
					error: functi.menu.element;
	vent.typealue.replace( /[\-\[\]{}()*+?.NOTE: Th+ this.ors
			event.preventDefault();
		}
rection ) ||
				this.menu.isLastItem() &
// NOTE: This is an experim			success: fuare still investigating
// a full solution for string manipulat-on and internationalization.	this.previo._keyEvent( "previous", ev click immedis.menu.keys( e	this.element
				.toggleCl
	_renderItem: function( ul, item ) {
		return $( "<li>" ).text(11.4",
	 ( !this.isMultiLine )xt = this.active
					[ dire		if ( this.menu.acti-autocomplete-iselect( event );
		-autocomplete-i()
			});

	u.select( event );
					}
					breed. Use $.widgethttp://jqueryui.com
 *
 * CooreateIcons();

		this._setupEvents( options.event );

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elemssage =prev", "last", event ssage = ( "position" );ssage =function() {
		return this.active && !this.active.prevAll( ".obind	scrolad
		base = $.== "fixed" ) {
					retudCall ) {
	axi,
callback;
nnectEleme
 *
 * http" ) )[ 0 
 *
 * htursllisstructors =  lastAA*/


var
	OnE( elion.top - daototyPaultholderreturnOverTop = pototyHbledCl",
	typeClassegret t
 *
 * h_keyEvenn-icon-only bledC		th	}
		r item,ubmen: "> 		});

			offse
 *
 * hfaultner-aln-secondary u ) {is.hegth;
	},mentsion.top - dafunctiSe
		ifvDeleg

		/ar formopti );
		setTopis.hunction(});

			this.h.toggs
		positi			if ( 10 offseh(function() {
				m call
	i
			$( eve ] ) *
				
			$( evens ) {
			$( evedeunction( radio ) {ou			});

	s.hee = radio.na				cle name ) {
		at = t ( this.act ) {ht( true );
			});

			this.headers.net-conck handler
		// asisssReAenseuery UI -x up 
				,set, baectmenu.js, slt ) > for
					h &&t ) ypeoe + "'][ty+	radios e : this._value(iselemejs, dialog.js,ete this.previousFilt(eDown|ption/ thest().top;
	[ name)e( eve/int.br|= thisncti			}
		}
		retFullName)this.element.prop( "sc
			break;
		case $.uiutton/erCarent; works a$( this ).height() ) );
	queryui.ion() {
		GouseMovee.END:
tData = {
				ol	this._Lespacers.indevent )seFloa'" );t( offsetate: functie.toLowerCase(),
			isTextarea //te-active" )				tyCode Only enu
		ibled", "trueor ) : $();
	},

	_s	delUI Aut
		( thivider ui-widWe'r ) :	// vAll"Height = 0;	// utocomplete", 

		// Avoid memory leaks (#10056)
		if ( prf ( submenu.attr( "aria-hidden" ) !== "true" ) {ent, thisnu )
				.addClormResetHandler );
ocus: false,
		delormResetHandler
			break;
		case $.uielse {
			this.focssage =vent, this.u.select( event );attr( "title" );s );
			thisen( ".ui-m( options, element )abelledbythis.delay );ctiveMenue = new en( ".ui-
			th === "checkbox" || this.type 
		}
		}
== "string",
			argsthis,
			options = thiterTimer = this._ true
		} else if ( options.active === false ) {
			this._tton 1.11ions.label =&&
			this.actiuttonElement.attr( "title" );t caused a .5 pixeltions.label === null ) {
	
		// handled the keydospace: namespace,en( ".ui-mis.previous		wi>
		wyle="z-indexen( ".ui-m[i] this.x, eventNam: " r	case ;
	cont		};

		;

						return;eydown event. #7269
		// Unfortunate			thiss.herid		this.ase keyCode.
				th
he prevsest( ".uiid;
						base = $.Wis ).innerHeight() + 	this._foformRe		return par was used to modify the
	ifis._focusable( this.hethey'relSearch = m, match[ 3 		if ptions.disabled ) {
					return;if (},
Down
			teyCode.EN^\-\u2mespadocumm" ).each(function
clicked
				.unbinF"ui-valund( {},
				ed {

		s ancHandtscreate:s));
methodVent ) ;
}( ".ui-m the class changes
		// it ca				})
				.height( mif(
				newPanelsponsisabled ) {
					reoHide.preyEvent, event			}
			}
		}
		element = thi	.addClass( options.icon
		// and t
			});
lement that gets the ui-state-focus class are ifferent
		thiass changes
					return;
		!ifferent
	.addClass( "ui-autocomplete-inpu
				}
				$( _keyEv && !overrideHandle) {
			$(this.options.h- v1., currentItem).find("*").addBack().each(func
* (11.4 - 20	if5-03- === event.targetse.js, pos	valid - v1. = true;js, pos}4 - 20})atepickif(!e.js, buttose.js, posreturn falsdatepickr.js, r.js4 - 2-03-1eryui.com =ueryui.comatepic-03-1_removeCryui.csFromoms(alog.jsjs, effs, datep4 - },fect-fo_mouseStart: t.js, moucordi, Query UI - v1., noActiva
* 11.4 -4 - 2var i, bodyd.js			on.js03-11
* hffect-foffect-bounce.Container effect, effect-//We only need to call refreshPosi
* h, because thezable.jsde.js resizhas been js, .js, ect-hCapturefect-slideable.js, selecta, effenu.js, Create and appendelectvisible helperfect-slideibutor effect-_cry FoHbutorfect-pght 2015 jQueachselectd MIT *sizbs.js, tool_cypeoon( faProporCopyright 2015 jQ*ake.j * - , select gener, eff -ter as aTn.jsblocks moduleesccorrything pnonymousrelated - it'selectcore of draggables.ter as /{
	if ( typeof defmargins
		flectoriginal elementnction" && definM {
/ight 2015 jQuGet
 * next scroll} elsaui.cfect-slidet jQuePundat effect-ibutorther contribuight 2015 jQuTheI Core 1's absolutelse {
on
 * page minus ) {
/fect-slideoffseutors
 eryui.com/catego, effect.com/category/.4 - 20top:ffect-satego.top -ffect-) {
/epenhake.jsleftnts with no deondencies, e.g., $ont-blinht 2015 j$.extend5-03-11atego,rom compclick: { //Wherselect
		B hion aed,
		//ivejs, lect Core 1.11.4tion
$cordio
 * Xdencies, $.ui || {}hake.jsponent35,
		ENYER: 13,
		ESCtop, effechake.jsoundatnts wit_getntribuO

//hake.js	DELETE:P: 33,
		RDELETE:: 190, se.is is a		DELETE: 46,jquery.org/licensettp://lectactuallse {
calcuELET
	ogressused for		DELETE: se {
edributors; Liialog.nu.js,  Oressafter we go * Cop
	keyCwe can changof define =='slse {


// plugon" ),TODO: Stillsbar.js, figu
	ut a way spinakctmeELETE: s
 else  conts; Licensed MIT .css("se {
", "jquery.o"/ $.ui mightcssanonymousors
 * Relea function() {ui.com
 *
 facto
 * jQuery UIse {
$.ui might Query U);
				if ( ex_], facto, selectctory ) {				return false	ENTEaccordio		ENTst( parent.css( "overflYw" ) + parentYsition" ),Adjus * Copect-hnt = po		DELETE: 46,
	d MIT *if "cursorAt"38suppliedt( pa(oore/ || !/*! 
				a;
	: 190,xploon( fac ? $( this)) {
	if ( typeof defformer DOMtic" ) {
					retdom);
				if{ prevnts witre/
 */
retu()[0],Foundatrn function() {
		er the [0] 
	version//I
 * on === "s nicParentQuery U, hidon" ) === "statsowser gid-"playrentany role durrentlectacto, won't js, sean
	} elband oisto|st( paition.j * Relethis!=y/ui-core/
 */[0]11.4 - 20 function() {
	
	, effectnd.js, efQuery Fou *
laceholdors; License(functiP
});

ight 2015 jQuSe(autcect-trre 1 "figiven i
 *1
* hn() {
o.abIndexNotN) {
				$( t_seffect-trre 1( "id" );
			}if(  ? $( th/*! === nodeN-\d+"auto" )CKSPAueryodeN1
* ake.jsct-s	if ( exdocure 1* Incl "ct-s" osition" )),lParolighIE
				$( tstoredCtNode;=ect-staticixed" ||ref || ame = m {
			return,e ) {
		f || !mapNaoLowerCase(Styleshegory/$( "<s[ 0 >*{entNode: "+ ? $( th+" !immap.ant; }</ !!img" ).ion anTo(ect-s false;	if ( "area"o.opacitynt.parenodeNam;
		mapNameif 
			if ( /^utaticPnodeNam")se.js, post.nodeNCase(O		!elemif ( excludeStaticPme ?
		s, effect-blints().filter( funcme ?
	"imgnodeNameton|object)$/.test( zIndexnt.pareible( ment.disabled :
		"a" === nodeNaible( 			element.href || isTabZ);
}if ( excludeStaticP {
	re &&
		// the element and all  {
	r"imgible( e"id" );
			}
Pre		ifht jQuery n() {
			ifher contribui-id-\d+$/.te
		if this 0 ].own;
		}).length.tagName	map =HTML") {
				$( tQuerflow: 190, elementher contribu


// $.ui ;
			}
	esizresibackueryui.com/_trigger("sghli",E: 36,, ].owneuiHash(arent;
	},Redefinf define === "functio drarn !!$preservne.amd ) {

		 = element.nodedefine.amd ) {

		// AMDrn functiss( thisost "ae.js, e"E: 36,segex = this.TabIndexerame, img, !sate.js, effent.lse; ) {( iry/ui-corble( elem.length - 1; i >= 0; i--lement, "t		$( thble( elem[ i ]!$.data( en( element taName );
			};
		h(func) false;ct-blind.js, efhis, "visiurn focusdroppy( jQ	functio$.ui.ddmanager11.4 - 2010 ) && focusaction() sfer.js, meobject)$/.tes = 0 ) && focusa/*! jQ.NaN Behaviouable( element, !isTabIndep, "vis: 190,s5-03-taName 	return $.css( t

ctorrent.js, datepparents().filter(addClafuncui-llPay( j-ibutorarent = $( thfect-hDragctory )  //Execy.or: functi oncedencies
		reend({d MIT *id-" o bther contrbefs
getarentitsalsrecttic" ) {
			-fade.js, effect-fold.js, effect-hm" ]ght.js, effect-pement, "s, effeitemrHeighECore 1, interses, mohake.js, effect-size.jshake.jst jQueed =fect.js, e			}
	ompame.toLoibutor	overflowRt( parent.se {
}
				return overflowRegex.test( parent.se {
Abs*/

(fonvert, selectTo(				var parent // supporn( elelas parseFloAbrn !!$.data( el+ "Width" ) ) |elem, "p border ) {return function( Doibility" ) === "hidden"1
* htt jQueement, "t"hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?js, positi5-03-11.createPseudoepend+xpr[ ":" ], {
	data:
	keHeight) -E: 36,
		LE< o 0;
	SenselevName )ocompletpr[ ":" ], {
	data:t jQueTop =ht jQue{
				$( this ).css( type, reduce(+turn this.peedatepicker else iffect-p
		LEFT: 37, {
				return oreturn this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};
-		$.fn[ "outer" + name]size === undefined ) {
				retur| {};ig[ "inner" + name ].call( thWidth
			}

		X size !== "number" ) {
				return orig[ "outer" + name ].cL {}; this, size ) + "px" );
			});
		};.fn.a
		$.fn[ "outer" + name] = function( size, TER: 13,duce( this, size, t

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return thch(function() {
				$( this).cs] = fun size === undeon( size, margin ) 
		if (e, reduce()r( selector )
		);
	};
}
his, size ) + "p$.fn.removeData = ({
	$.fn.removeData = (fuch(function() {nt ).pare] = functifect-window.hs );eturnata( "a-b" ) ) {
	$.fn.removeData = (ffunction( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				retu
		$.fn[ "outerall( this,a( "a-b" ).data( "a-b" TER: 13,$.fn.removeData.fn.(function( removeData ) {
		return function( key ) {
			if ( afunctextend({
	focus: (functiorn removeData.call( this, $.camelCase( key ) )w);	} else {
				.fn.extend({
	focus: (functiion( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				thxec( navigator.userAgent.toLowerCa.toLowerCaif(his, size-\d+ect.j$.ext: jQuery <1.8
if ( !$( "<a>" ).outerWidtth( 1 ).jquery ) {
	$.each( [ "Width", "Height"tabIndex );
		reRe], factond({query.org/licenseidden ) {llParent: he				return !! border ) {
					size -= parseFloat( $.css( elem, "bordeent, i
				inneize -= parseFtion( ele1
* htaxis ||ffect-size.js	});map =yudo ?
		$.exp ( /^ui-i. !!imize, t ) {
					sizize, +"px"
});

entDefault();
			});
		};
	})(),

	enablxSelection: function() {
		retpendhis.unbind( ".uitopableSelection" 
			"selearr"absn" );abindx" ) ) );eigh
	tabbable: function( e ( size === ( typeofvariy( jQundat		function reTabIninuunct nolem.length &&
	})(s, eff) {
			v[i]log.js, 
			};
 =Heigh
			[0 position	function relem, "pa is ignorsWithPo is i(n isalog.js, d (! is ignored ion() {
lem[ 0 ]ment( "div"!mapName 
			epuent ) 
});

 ins
				}xNaN );fect-tran, skip all!mapName 
			v from othersable( elem.([ "jqworksortjs, sewhable.j" ) === ),an elemcss( "pnusable( eleegex npositith ( thi),.js, effect-transrollwitchedrWidth,ays returns auto sle.js,uery )	/
	}{
				// /(a "Widtlute"  elem.cin "sub"Left", "s"on ===s, sers returays returns autoto jitludebetwtabl map,ulude( elemsitiar tabIndher bro of value nstae(),-\d+$/.test( thifect-tran consistent across browsers
				// Wcanid-" is ignor withnnerelfers returno

less
	
* h that haverWien dive"Width,&& value !==
					 !==lect/ Igne.js, iend({		if (*!
 * / Ignon() t.lengte="z-inde set to -\d+$/.test( this.id )  &&nt ) {
		v
});

[ is ignored by== 1 ? "yrig" : "retu"] !this-\d+n is set to dget() ex!$var tabI [ "Wiions instead.n thn is set to) {
		var5-03-11
* httypein = "semi-dynamic" ?  i,
			proto =  Core 1e ].prototype;
	:js, e)ers re ( size === uextendiht: ed by 
$.ui.plugin = {
	down funcupSelecjs, posit
		"a ) {
		oler"></dto.plpThis m"
		};
rowser
				//Sidesakes bion() {
				$(_r
		if fect-pufkes behaviorremoveData( mpletbreakatepicker.jsement.href ||.data( el= "absataName );
			};
		}) :nected && ( !insabIndex );
		rettion {
		retable( element, 					sizetac		value = sctory ) {
	if ( I	funconnisNaN( vaNaN || tabIndex >= 0 ) && focusable( element, !isTabIndei, n[ "Width", "Height" ], funct( elem ) {
				return !!$.data( eleo dataName );
			};
		}) :
		//		}
				if ( margin ) {
					size -= parsjs, effect.js, et-fold.js, effect-hignentt.js, effect-pufno) {ag, effect-scale.j drarHeight: $.fnontribureturn function( Ifitiovisius	// NaN || tab
		ueIdn( $ )  <1.8abstringexNaN // support: jQuery <1.8
if-03-11
* ht !$( "<a>" ).outerWidth( 1 ).jquery )NaN [ "Width", "Height" ], funct" + this ) ) || r );e = elemens, eeturnore z- 27,
	cu */


});




// 27,
	});effect-size.js	});trigger rnimion( i= {
	version allo !});
		remove		if (lement ) {me
				turn thicur|| {};

$h no de		if (|| {};

$.extend( $.u +lowDiscoatego}).length;;


$.extend( .ea|bu? 0[ i 

			// http://brn typeof dnt ).parents().a( elem, "events" );
	hreff ( events && event	reture ) pendencies,elem ).triggerpendencies, e.g., $.ui			}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		oTopnt ).parents().addBa = 0; me ) {
		var 2015-03-1ibutor).me
	e( me
				this.seIndelay =	for ( i = 0; , 10)
		500,icense.
ement ) {
at._cleaactory ) {, dialog.js!allowDisconnelectorst( "." )[ tp://jquery.org/
});

// suntributors
 * Released undec"></llicense.
/license
 *ion( i, name  ( size === op", "BottoUp({ n.js, : null position" )m, i;
		for ( id MIT */o.pl ++uuid udo ?
				$( this ).remove funref || isTabCSS).p.js, eth" ? [ "Left", "Right" ] : [ "T = name.split( 		$( this ).removeshow, effect
		};
	})return;de elemen	// 
		}

		for ( i = 0is.lens, ef" ) ) );
	},

	tabbable: function( e)ent ) {
		var tabIndexi$.attr( ele";
	cons insin);
			};
		 catarentNode.e = $.Wihout "new" keyar tabIndtypeohis.pion() {
				$(hout "new" keyword
		ioudataeateWidget ) {
			return new cow instantiation withement );
		}
 ctiotepicker.js, dince.elem

// suppor		try {

			$.widget //15-03-1$.ui[ module ]me );
(); wouldn value;
ice jQueryto|sc- ut_uutunately	} unbinds ALLctor = $ss( "
 * jQuery UInode!r[ ":" ][ full$.ui[ module ].triggeNod droppable.uctor, existingConstructor, {e );
	hil.4",
tions, element elems );
	};[ fullName.toLowerCasmap = = functi$.expr[ "d MIT *dget later
	onstructor, {
		version: pr" === n;
		} $[ namespace ][: "1.11.4",yCode: {	ibutorugin 27,
	i, name :

 27,
	ied
		/after a widget _noFry USap.noin];

	namr[ ":" ][ fulluid = 0;
			rear eventTyprototype = new base();.xcludtructorryui.com
$[ namespace ] || {};need to make the optundat)) {11.4",
erty directly on thee + "-" + name;

r.js, menu.jld.js, efserializelicense.
oect-scale.js, eflem.c}
				recomsAsh the (oName ) tions[ed triggerstlway[ positi, efo
		nts = $._da$-indes, widget.js, mouse.js, pos, ere, ba($(o
			
		};).att ) :ue;iby.or|| "id"type "").match(o.ex, i,s= el|| (/(.+)[\-=_]ncti/arentNodeallorern !!$.datunct.push((o.key = (res[1]+"[]")+"="+eturn bame )pe[ prop ] ?e.proto :e.pro2]arentNodeype thaem, "border"(!
	
	tabbaame )ketion() {
					rturn b+ "=ent ).pa-" + name;


	join("& parent.csld.js, eftoArraye.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, furdo(fu( proprop, value ) {
		if ( !
			vawidget.js, mouse. r ).t			rtype[ prop ] = value;
			return;
		}
		proxi;
	$.expme;

ret
 * Released unde/* Bion refulaN( vauniquellow	// ls
t.js, mos;
	}	rowser
				//license.
kes bct-scale.js, ex1turn this.css( "Abd( $.uhake.jsx2 =nstrig[ "inibutor) {

		
				hake.jsytructor.prototype = $.ui.positiynd( yasePrototype, {
		// TODO;
		.positio a value.widget.extlwayl + value: remove supo a value.ui.positib bas		// dons the prefix,dyCCOMMAeffect-s	retur
		Bs that arendxPrefix: existingConstructo.widget.extisOver	};
is );roto	};
	})(),

	;
				if= (f (ways untPrefix) > s[ 0 r,
		namespace:< b  triggerame
	}, pro});ototype, {
		constructor: 
$.ructor,basePrototypee: nlmespacis being redefi< r name,
		widgetFullN
	me
	}, proxiedPro&& inheriting fr});m, "border" + when necessar ) {
		var i,
			set =?
		$.expr
* htforce This mForgth; i++ ) of this owDisconnected ) {
		vmap =
			setdget later
	) {

		[ catcflonstruc? "
				 func;
		"] >d( {}r ) {
		$.each( existingConstructoush( [ttp://api.jquer inheriting fr	name = name.splir childProtot(l < we nen be used as
		// TODO: rem / 2
		fpareRedProHa) && valtend- widget using the same prototype tha allt was.fn.a/ originaller( ays uwidget using the same pr;
		pe that wasBottom
			$.widgety used, but inherit from the + childProtome: ntype uce(/ origilection" )ld.js, effowser
				// This m
			};
		})();
	});
	coname
	}, proxiedPrototpe, {
		constructor: cos widinstancme
Axiroto = $dgetEventPrefisePrototingConstructor ? idgets thabased
		winame,
		widgetFullName: fullame
	});

	// If th existingConstructor._childConstructorsze, true, maEventPrefix || namg., draggab// don't pr widgets that
	// are inheriting from it and redefine all of thhake.jsd
	calD);
		}
 33,
		m" ]Vgth = input.lengy triggerhorizet.linput.length,
		key,
	Hex < inputLength; ight 2015 j of thme
	}, pro	var childPrototect.js, effat we're
	// inher
		$.eachce one ((dex < inputLength; i&& dex < inputLength; ino.plrtructs widngth = input.lengtho.pl inst) ? 2 : 1 ush( [ : (ne objects
				ifespae objects
				if ( $.isPlanObject(= isNaNld constructors from the oldme ];uctor
		// so the old child constridgetN/ orby the brostructor._childConstructors;
	} else {
		base._childConstrucdProased
		wi/2)tors.push( constructor );
			ings, arrays, etc. with objects
						$

$.widget.extend = function( target ) Copy eve
				g else by ar input = wingth = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputInde( input[ input& value !== undefined 	var childPrototasOwnProperty( key ) & {
				//and redefise {
		s widglice.call( arguments, 1 )on		retx ] ) {ue = this;
	name = name.split( js, eff
					target[ key ]  = $.isPlainObject( target[ kend redefind stringss widge objects
				if ( $.up	this.each(f== "instancace + "-" + namld.js, effey,
		value;
	for ( totype = base;
	proxideltart for widgetEventPrefidencies,+ "Width" ) ) |s th

				thill met-\d+0ey ] ll met> 0ion( instance, nly on 
				if ( !instan
		for ( key in iurn $.error( "cannot call methods on " + name + | {};

$initialization; on
						"attempted to call method '" + op,
			:{
			);
				}
		able.js
				outerHeight: $.fn ) {
	nu.js, sliegex.test( parent.eNam - v1.	};expr// $.ui mighttip.js
* Copyright 2e
	// inheritin				}
			ch( proe;
			};
		( "cannot cat. We'r effect-size.js, efalue,
	t. We'relue = methohodVstruct= "m== StqueId? [ck( methodValue.get				ck( methodValue.get;
				}
				ifpe.options );license.
ch( prototct-scale.js, effejquery
		same) : na {}, ba[]hake.jsqueridProtoptions =lue = metho
					size = methonput[ inputIns to be ll, [&&
	 be passed oame ] = tionodValue.get(nt ) {
		// allow instantiatio {
	$}

			th[i]);
		
$.extend( 
		if ( abindejmove ) {tabbable: junctionjnstantiatio	s.le ins.data(cur[j			instawidgetFullexpr
		// musif(	instnd rinst-\d+$/.tthis.enstnData = (fisy( jtion() {s = $.widgpply;[$.isF	};
		}ect( optionsisFunc ?s, futurnValue;
	.resirn ret Core 1s[ i$rn returnValue;
	rgs.le( /* opti.not(".[ "Left", "Right" ] dConstructors = [];
});

"elsenst( options er.js, d args)
		i][ key ];
			});
		}

		retur-03-11
* ht;
	};ions: {
		disabl= funci ] || [];ng for s{
				}	} catch, borded( {}rn function() {
 }ions, ions: {
		disabl);
		et._childConstructors = [];

$.Widget.prototype = {
	widgetName cat( opti( this.js, mo addde.js, 		}
						vaply;exNaN =election" );
				var 
			});nt ) {
		// allow instantiati $.widg[i]onstwidgeet_uuid++= "." + thisalue.pushSta$.isFunc						$.widget.extp.js, effect-explode.jstotype = base;
		bass, elinstan function() {
	 Inclu:._ini"seProtot
			expr.+ "-kes b parent.css) {
			vtancegreuments. $( eled = widge	})();
	}ame ] = funcj=init <ame, .uuid;; j++se.js, positime, [jbugs.jvalue where ion() {
	js, effect.js, effeventPrefix: ""ght,
				outery = functionlement !== tnu.js, sli
				outerHeight: $.t( parent.{
				opent = $( thiing to rep= r ) {			this._st
			if ( args.len for plData, _ $.widgrHeight $.widgL	if (ngth ) {
				vent.targetions = $.widget.e<div>",
	options: {
		disabled: false,

		// callbacks
		create ].p
	full{function( options, element ) {
		element = $( element || this.t );
xtend.apply( null, [ options ].concat(args) );
			}

			this.estance adme ) ?Sh}; {be rund witfir
			imnot rough du: 46,massscrollow- ins() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {});
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* opts );

		this._create();
		this._triggeelement */ ) {};
$.Widget._chilme: "widget",
	|| element );
tNames: "wdget",
	widgetEventPrefix: "",
	defaidgetName + this.uuid;

		this.bindinrom compoaultView ame + thisthis1 positio this.dos and statese z-in
						thisj=0[0].parentWindo =| this.do		}
				 <0].parentWindo			}
			});
s, eff$( this.do[j
		this.uuile.reme._iniement, {
				remove: f"defaultView he lisvents ) {n up e
	}	// (eq( 0  focusabme, args, aeventNames{
						nctioeight
						ins"></:efaultView |sconnect
				: 0, ;
		
	sconnecton
$0, IT li0ment wite prototype in
				}
				if (able.js, selectalicense.
fasdocument
	n() etermin= "abositi{
		visibe

is(), = tex < inpulon() {( input[ inputh ) {
			var elem Index ]pe, {
		constructor: conxistingConsF
		$.eahey inhndex i 0 ]e[ pro) :
							$.each( side, UP: 3, soth: $.re					}js, se $.noopturn 0;
		}e.js, out/in parts.
			// http:t ); options[ key 		overflowRewo|sc= "absargin" + this 			// http:
	if ( existindo ?
		$.exprlem ).triggeth,
		key,PERIOD: 190,dex ][ key ];.outerHeightt, +
	( this.length ) {
			var elem = $( this[ 0 ] ),
		this.evenore z-index if posiers retuWe igns
 function else {
/*!lem )ch(funct
		for (  "absowe'reerWide alwthemr[ ":" ][index: 0;"></div></div>
					value = 
	if ( eey ] = value;
			}value where d-\d+$/.test( this.id ) ) {
			nt across browsers
				/Option[ perit from
	// t
	// ar? {
		element =ns[ key ];
			 {
	v})();
		var
		}

	baseP (!			return s" );
	ototyp= t.style});that inhe);
	+ childis;
	},is );that inherit from teturn


// $.ui );
	urn thipo such meth);
		returp " +
			nts, elem, i;
		for ( icusetNa	_getCrern this;
	},ce && megth; i++ )do ?
		$.exprtion: function( key, value ) {allbacks
	name = name.split( s.length ) {ions, element ) {
		// allow instantiatioeturn thihout "new" key Core 1ey in options ) st use "new" keyword (the code abov		this._setOption( kst use "new" keyword (the code abovptions[ key ] );f ( value ) {
				this.hoverable.rurn this;", !!value );

			// If
	},
	_setOptionst use "new" keyword (the code abovction( optss( "ui-state-focus" );
			} {
		var key;
][ key ];
			if ( in
					returnVal
function foculicense.
me.stance[ opt]) != nat: { bar:at inhs, ecthodValuhake.js, effea

$.Wfunction( argoed to create: { 
		var dele() ) :
						methodVa		// clea suppressalueed to createat inhe
		var delegfrom comp	 Core 1totype = base;
		bas		proxiextessDisabck, est( this.id ) .ean" ) {.toLow;
sey trigger typeof su		returns.elean" ) {+ ">	widk, e
$.extend( $ush( [ // n "Width" ?uppressDisxisti	handlers = elemen suppress+" prototype = {
	widgetNa
		// no  );
	};

	$[ namespace ] = $[ n
					$.d (lean" ) {o.pltnt.href);
				}me.spliry FoTrnction focus
		// nofle and use this( !elemetrn f.eq( 0 name,
nce
 "<trheck = false;
		};select|textaredCheck;dlers = eldget",
	w = functElement = this.widrn f
		} else {
			element = delegateEffle and use this,lers, funct, handler ) {
			function handleimgroxy() {
			
			// Iue; "srceck = fament );
		 disabled c = isNaN( tnt.toLowerCas;
})(uppressDisf boolean
				// -{
		er coilts anc"hiddenn false;arts
				if js, eff Core 1 passes a		if ( aupdatpe.options =ment );, pledCheck !== "// 1. IfisTappressDisroll, iss '
		var delegns[ kesitiod) { esse= "fusdenci
		Cas 38respon contr		retha 40,
				r2			iap, mapN ' essen
});

Sizion ==be enhis )|hidd handin;
	
		( typeo n handlerpecifnt.lengt		$.datypeof han
if (the guid so direct uxy() {
			.jqueryui.coe ||
							$					thisedCheck;does { valua
	scro+ childbyalue )  (N( v /(a !!imrHeim
		ss( "a/ ),
;
else  receiv= {
	inld( {+ childc properti, na			}t key ];
 *p);
			}_suplector ) ( element );
		ndex: {
		v - widgets (#8 as method for  functaddingTop")||0rototyventName, handlerProxy );
			} else {idgetN			elementts )
			if ( sele
					s
			
					teElement.delegate( se
	_se.bind( eventName, handlerProxy );
			}.fn.			element.bind( eventName, handlerProxy );
			}
			;
	},

	_off: fr.js, di"id" );
			}
		});
	}
});

// seleate arguments
	typeement,
			
						(lbacksadget._chilass as method forarent;
	},Aon anditexcluded({
	scroxNaN );2];
			ss as method for dash a pd memory leaks
		if ( e	//Uabled= $(  "fu*!
 * 
		var deleg( ? /(aLogic|hidduzzy, see pace,316/317dlers 056)
		this.sableds.hovck = farable = $( this.hove) {
		return tnt = delegatelicense.
 sourceTrdefaultVTrbledChecklems[i]) != nul
			delandler ).cobjerens, widget.js, mouse.js, poadd( ed>&#160;</tdement );
		}

		$.;

 disablicolspa{
$space = verable: functiois wid( value )	lect|textar
				.appllement.owner			returnValue.length; i++ )
				outerHeight: $.fn.outerHj,}

			}		//LeastDikey,,		ev) {ert( haize"ui-state-( argnea				ret, 
		$.ea,nts" ame,
	dex:mosffect-transfeis
		// r {
				ible( elinsition" ),n th {
				" || positio
owser
		aN( valu key ];.widget()
				.toggleClass( this.widgetFullName position, va n );ion[f thrisTabIndex,

's loc// BrN( vvar map.remolue ) && val >= 0
			proto = st( this.id ) );
		!value );

			// lemehis.options[ key ] === undefined ? case we rs from the oldtructor( options, element );
		}usout: ;

 = eget/'ch =lateEv foudatient, {
		( elecusims
" {
"
 inher] = $nelem[ 0 ] new const {
				$( event.cdisabrentTarget ).adus" );
			},
			focme: 
				$( event.|| [];
		
		if ( !sett across browset.toLowerCasevent );
		eventbled", !!value );
tOptions:.removeClass( "ui
			dele!allowDisconnec);ect-trans			var m is ignor. .data(  alizi

 !== ecessaron() {constructor( options, element );
		}

		// allow instantiation without initializingName );
			};
		ance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.
	}, document ) {erApp= undefin func
		D, efn" );
	ype :
			this.wittp://api.jqueryui.com/jQuery.wi
		vent ) {
tion = ofrom any eif		};
	})osit	_trigger		base = $.Wi
	},

	tabban = {			}
			} + this  {};
		eve.removeClass(element );
		}

		// alloncat( data ) ) === false ||
		out initialve( "i to the new event
		orig = eventncat( data ) ) === false ||
			event.isDefaultPre = 1 false });
	moveData( "a-b" PACE:n e	fun

 newturn !( $.sitiooptio Incarts.lengtperApply lrget even"></dndation andous.opti
			 i 40,
even] = 000s passescurrentTarget ).addCl "ui-state-his.ng" ) {
event );
		event.tions === { bar: ___ } }
		tions hash on the protots( "ui-stat
		
		$.each( 
			t: "to name,protover" );
| defaultEffectexistingConstructat inheremove efaultEffectclientX		opturatioYname, args,dings sho) {
			var elem = $( nce._init ) e.js, positi i,
			proto =  data ) ) === false ||
		.widgetFullNoptions = {j
			p( type === this.widgetEventPrefix ?w event
		lay( options.delugs.jquery
					return this.options.widgetEventPrefix ?
			t {
			trylay( options.


//[s( "ui-statpe ).toLo
			mousel
			$.each(	if ( !sucordi[nts" )] -		},: naptions = {}j ][-hover" );
 ]pe tbledCheck &&me ] ) {
		s, datepicker.jsnt[ effectNaMath.absName ]( options.duratimove,
	xy() {
		,
			( this )[ method ]();
				if 
					$.!options ?
				method, options.easin
		// must use );
		}
me ] ) {
?= ins:$.isPla passes args)
		if ( a
};n() isFuNaN OnEmptyndle worksog.js, dra	next();
			});
		
$.cleanData = (func
 *
 droppable.js, efent ) {
				$( event.cu.js, effect-transf\d+$/.tesdata ) ) === false ||
	
		options.c eley.org/license
 *
d (the code above alw
		// allow instantiation wtrue || ty);
}$.attr( eleme hide: "fadeOut" }, functiodividual parmouseHandled = false;
$( document ).mous = functio	widgetEvlicense.
 * http://jqu!options ?
				meth: false
			return;
		}
entTarget ).addClaseateWid].pu		} catc
			return;
		}eateWidget ;
		if ( options.delay ) {
			= this;at inhet[ 0 ].parentNode || instance.element[ 0 ].parentNode;
	}
};

$.each( { show: "fadeIn",de || instance.element[ 0 ].p	return new cslide.js, effect-transfer.jssedown." + this.widgetName, ( argumentsle.not( ele
});

// se, e.g., "foo.bnction handlerProxy()org/license
 *
ment.derable = $( this.hover);
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, deaultEffect ) {
	$.Widget.prototype[ "_" + method ] = functifocusable: ) {
		return ton( fat is window or document
	ue.jqlem, size, border, mard MIT */

		returots.length}
this._molectly,
			options );[Name );
		erty directtype: veDelegathis.wiclonekey event.stopIm);
	 thi(;

		erty directly onw-x" ) );ng" ) s.widge parts.funcem.paa effnoop,: 188,ck ) &&
			cal!elegatell mods(ent.hr).uuid;11.4 - 2015olect|texttotype undatkey n one widgeunbind("mouseup." onstructor, {emenion an objec$.extend(st be visible
		v ( /^ui-idect[ effectName ] ) {
			elemea( elem, fullNa
		tion, mouseHandled ) {

		ret: remo		i;
ed && this._mouseUp(event)s the p		event.ps._mouseDownEvent taticParent && p.lengthhis,
			btnIsLeft = ions), on
$.ui =
			btnIsLeft = nstancs.id );
		}

	nction(eUp(event));
gateEl	if (on( fa	handler.guidelegateentName ks around a bug( elemenelection" );
	nputs (#7620)
+ childsCancel = (typeof this.options.cance	delegate( this ).removeAtor ) {dex ][ key ];
			if ibutor						$.widget.extrDocument || document e.options = bj
		optioallowypeof objoto.pluhodVaudo ?
		y;
ay;.split(" y( this, argsupport:is	var et = .mouseDelayMet){on
$+obji-statnent.mous1]s.op0 eventName .optiot;
		inay;th - 1; i++ ) {
			efix || naet) {ze, true, ma.extend( $.u	}, this.options.,
			;
		}

		if (this._mouseDistanceMeidget using the same prototyp-) {				/ && this._mouseDelayMet(event)) {
	ions._mouseStarted = (this._mouseStart	retur {;
	} else e.g., $.ui	}, this.options.b
		});return true;
			}
		}

		// Clicchild._proto );
		});
		//mouseS)
		 may never have fired (Gecko &
				if ( !inPERIOD: 190,totype = base;
		bm
 *
 * Copfor ( i = 0; ndatport: nerHic" ) {
					retuor ( i = 0; ors
 * Releas._mouseMoverOption[s, epment.unbin			// http:


// $.udeHidden P: 38
	 ) {.foca== "abreitiobar.js, modify a );
 functio			c	};adProsimethply = __superA: 188,s = ke		retu
			g/license		this.id = "ui-			"mous,
		};se {
		orieUp(eventbadden
 *yrighposition = oundation a}

			
	scrocategor		curOp8
	insta.widgetNt jQueventDef, requmouseHandled = tr ivar mice =
		if , which mea		returDelegate  
		return tr: 38nclud			}event )nite = fuunction( i!
 * jategor).get()  = true;
		thisred( "mouseupupon = ma
			callback.s );
				iap = 		var pa$.expr[ ":" ], {
	data;
}

$.extend( $.ex		data = data ||;
		}).lengthment.de
			// http://bfunction()povent) &function( dataName )cus: (functi		optionsvent m
		if ( this._mouseMoved  = (fs.element.trigger(mousebar. = parts
	scrly
					 ) {esizbrowsers;

	funct/
		LEmouseup	retor moueIdion( DelegateN( vaan ugly IE fixent, !isN catch ( e ) {}
		ugs.jquery.com/ticket/8235= (f catch ( e ) {}
		} $.expr.
	_setOpred in another documenelement = suppup in htm widgeent, i
			}
port:
		ength deName w0th
			// disabljs, effom componentE mouseu (widgets (#8876)seMove(event funcborderTop});"),totype 0 triggeron
$t: IE <9seMoved = true;
		}

		if (this._m.fn.eStarted) {
			i, {
	versio
				if ( !in2,
		TAB: 9,totype = base;
		base = $.Wing of mouseup in 
			scrudo ?
		eturnthis );
			this._oConstruc
			// It.button ) {
			thfullNameMoved = true;" === nodeNaet.nod) {
			true, margin ) + "pxoveData = (f		if ( aouseDra {
			his._mouseDrag(event) : thinstancuseUp(event));
		}

		return !tfunctiegate( eventNavar methodValue,
		}

		if ( event.which || eve		returnValttp://jquerdValue && methodValy never have
		if ( ton
$eMoved = true;
			btnIsLeft = ) {
amespad) {
			this._mayMetStarted) {
			this._mouseStarted = f
			if (this._mouseDistap." + this.widgee.amd ) {

		this._mouseUpDelegate ); using the same p
		if ( tseStarted && = funct
	},
	_se+ this.wi	this._mous
		mouseHa {
		vent.target, this.widgName.toLowerCaelement, this.widgetFullNaClascouff.jshake.js, effect-size.js, ef img,
		nodeNamevar i,le mou.mouseDela.pageX),
			roto: $.extend( {}, prototelection" );
t.pageX),
				MatmouseMovo: { t.pageX),
				Matkey ) udo ?
		$.expownEvent.pageY[nt[ eff0prototype ) {
			scr {
					$( elem ).triggerHand		if ( aet;
	},

	// These e, prototype ) {
	var full		if ( aistance
		);
	},

	_m_mouseM
		if (
					se= 1),this;
					setT !== false);
			if (!this._mo this._mouseDelay		if ( adistance
		);
	},

	_m* event */) {},
	_mouseStop: functio;
			} xistingC.com/ticket/8235n,
		// cot jQueis );
		dgetName + ".preventClickEvent")y never have fir
			
var // disabled i(/^(mouseMov|key ) |ll modi$/).test,
		nodeName 		// no suthodhan 
		nodeName re z-indexc
	
(function() {ey in options ) hod ] =($(ce)d all o.create")totypeisabled		return false;
				}his.mouseDelayMcg(event);
			retuupportsOffs();
		}

		if (this._ound,
	rhorizontal = /.eventNamespauseUp(eventnction(/* event */) { returcis._mouseMoved = tizontal = /left|couseStarted) {
			tical = /top|center|bottom/,

				$.data(evdencies, e.g., $.ui.positi= Math.r+(hod ]?lback.max(cFoundati
		ice;
			});
	: cent.test( offse

	_mouseUizontal = /left|center|right/,
	rvert/ 100 : 1 ),
		parseF	element.unbinffsets, width, hei{},
	_mouseCapture: function(/* event */) { returtion =rseFloat( offsets[ 0 ] ) * is );rcent.testis );
ts[ 0 ] ) ?is );
		\w+/,
	rpercent = /%$/,
	_position = $.fn.porcent.test( offsets[ 1 ] ) ? h
		}); 100 : 1 )
	];
}

function pleased under the MIT license.
 * http://jque		returnValue -= parseFloatlicense.
dvar t/license
 * ) ) {
tions.turn this.css( "	}, this.opts, emo
	dup in the case o? 1 : -1er, margin ) this );g of mouseup in the case of I!idden";
		}).length;
}

$.extend( $.ex if content is placed under the cursor. See #7778
		//: false,or ( i = 0; = 1),her contribuer, margin ) IsRoor, {h, s/(s._m|ct-s)/ii.jquert jQueata: $.exprthis.hovert.button ) {
			tElement po; " +	+ndings.ition = {of wi
			"mouseeq( 0 ize -= parseFi might exist plugin
	_mo*heigh
$.positio/ WebKit ) {
		var position = extes: 2,
		Tved insiss( "edCheck;toent.preventDef{
		if ( cachedSc
	var fullN!== un-sition = {
	scrowidget.extend( ed insis*(.*)$/his._ms (ed insi+'height

	_hotor,left: elem.scrollLeft(fixed { t-;
		}

		return !this._ + tseHandlwidth: elem
			}t jQueoveData = (fu
	!== uush( [ othis._mouseDr()
	};
};
osition = {
			}scrollbarWidth: function() {
		if ( cachedScrollbarWitance!== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absth;
		}	h:50px;heigt:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "bodfunctionerDiv.o );
		w1 = innerDiv.offsetWifunctio	div.css( "overmouseDistanceMet(event) &&turn overflowRtroy: function() {
		this.eleructo */) { retument.unbind("." + this.functi" ) + parent.th ),
			arent.css( "oveem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	r
				within.eleme.outerWidth(),
		height: elem.outerHeight(),
		of windois._== "fix); weirdlegate = funct;
	gress: 188,t[ p {
		var  Core 1sind( "mousem			thiscste )
			.bin
			scrDelegate );;
		return true;
	},
	_mouseMov o== "milwidth = $.widgetmouseUpDelegatewematch tozable.jselectme
		var w1, w2niqueId: fullTop()srn {backl : c jumpbIndex >=._mouseStarted =
				(this._m;
	}
	if ( raw.preventDefault ) {
		return {dden";
		}).length;
}
. See #7778
		// Supporf ( cachedScrollbarWth,
		key,2,
		TAB: 9,return function(ster as an anonymous) ) :ain{
		define(Cts or wi an exerflowRegex  mixide grid elem[th.abs,uery );
	}
}(case we nrn false;
			nt.pardget/
 *id-"i, name )ypositio() {
ueryuindo, mapName,p://jquery.org/		nodeName = elemense() );

$.fn.extenhis._mouseDistance<{
		return 
			focuon() {
	
			hasO
	if ( !options ||$.widget.extend = functio passes args)).data( "a-b" ) ) {
	ingConstructor ? {
	if ( !options 1| !options.of ) arenents
	options = $
	} else {
		base._chi
	}

	// make a copy, wTER: 13,
		ESCuseDistanceon, opt()
		};
		!options.of ) {
		return _positio2.apply( this, arguments );
	}

	// make a copy, we don't want to modify argget = $( options.of3$.extend( {}, options );

	var at3ffset, targetWidth, targetHeight, target
				$( eveo.nElevented() );return thilow-y" ) + par+lback.rfunc((
		LEFT: 37,ow-y" ) + pa) / get );= $.e*
		option passes , options );

	var a ?ctore, prototype ) { ),
		colons );

	var atOff
	width;
	targetHeight = di<" ).split( " " ),
	.pageop + ts.width;
	targetHeight = dimensions.height;
	tariginal ch(f	optioneX }

		$	optionsuseStgetHeiouseStartedet[0].preventDefaultX) {
		// force leTER: 13,ss( "overflong
		opti|| !at = "lefe z-indexof ) {
		return _positinsions{
					$( elem ).ns,
		targ
		return _position.a&& withion = function( options ) {position.getWithinInf.pag( " "targ( " " ),
			horizontalOffsetions[ this ] || "" ).s

		it );
0	// ;

it will be :s );
	}
		if ( arguments.offset: elem.offset()
	};
		LEFinnerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].modify arg( pos ) :
		// Prefixed insi(	DELETE: 46,
		DOWN: 

	_hof ( cachedScrollbarWidth= within.isW{
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolut innerDiv.offt:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		s( "overflow", "scroll" );
value  pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizonta( " " ( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pon 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.	w2 = innerDiv.offindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
	verflowX = overflowX === "scroll
			returlicense.
 * httpi, a, hardR		// e( element )a ? a
		}

		thit used to create the
ions.deln,
		// coinsertBidth,oto = $.ui[ module ].p= $.WidinObject( target[ key 
	baseP );
	basePoyrigSibery arent;
	},Variotend(ings
					E: 8,o imprevent, dper&& !e,
nd( "mousemtionry Founer =Timeou{
			 ) {t = le.js, selectaDelegate );
 *: 0;"></sitioatch = cou	fun
			whilmHeightgecusihigsitixclude );tion anement ) 3ginLeft =n: fl scopss( thcopy		returinLeft" ),
			requiueryuiindow op,elemHsFunctiosto|sct: isamhinElemen4.e < 9 letsow ),llisi { else lowRegexginRight" )
	ck
	_initent || elemeinLeftons );
inLeft? ++eight,
			p:= functi
			ollInfo.height,
				var side = na_delayet.js, mouse.js, po		}llInfo. http://apinLefvented() );
	tip.js
* Copyri!
	atOffset typePrecunctionss( thiachelegat+= atce[ hNOTinLeect-hjs, _superApply = function		returnValt( "license.
 * http://jquery.org/license
modified
		// sect.js, effturnetempayment. {
		rturn valuth: $..data( s
		able = $( 
		tion(evet() );
	},
, sortablp.js, dss( "bottom" );
	} el= funn& !eotypd agait.butts, effptions,
	edTdata( t.document"bottom" ) : $.no elemHeisabled
	_mom." + this.widgetNthis.focusableom"bottom"Noed" ler ] d
		}lem.parecusable.not(		varrigger:tion.top(brn tuser),= 9;iginTot = ion an) {andl#4088X = ovtion( elemldConstruct			} else {
		
				if ( !don't let more t		try {

				Width,aultEffect :
					opti	_off:tion.top = round( "ui-state-hover
			if ( /^ui-idect[ effectName ] ) {
			elemefor(i"margi elem, fullName.js, position.jlem, fullNa[i funct= elemexistingCoi.position[ collisstaticion( elem )indow)
		(thisn[ co "I Mouse 1.11.4
 * m ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ nam= name.split( "." )istingConstructor = $[ nnts, elem, i;
	ss( Outf the
	://jquery.org/licent[ 0 ];
		posititNames
				outerHeight:ion[ co.data( elance.eve: "fadeOut" }, function( msionWidth,

	.nodeName ? $(evcollisionWidth,
ui.com
  = new base();n is deprecated. Use 			retudConstructors = [];

$. thi,
					within: withe;
	
					elem: elem
			if ( !thihat w		collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffsetsabledataName );
			};
		}) y: o
		Uneed to if the) {
		lem.parefunction() {
		= "abs= elem	if ( !( proqueryui.cent ) {s positione
		C= targ 0 ] &need toapproprialudeHidden {
	uery )allowDisdiv></div>
					value = parseInt(ed i	collisionHeight: colllisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ js, t.left - position.left,
				ffset.left,
							top: taoffset: [ c_superA effefset: [ atOffset[c + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 
		;  })allbacks	.unbind("mous
			}
tHeight
						},
						element: {
							element: elem,
							left: posittOffset.left - position.left,on.top,
						width: elemWidth,
							height: elemype that we'r
			return;
		}

		for ( i = 0d = widge0 ];Eordi( ns.dme: "wseCss(from any ealue = input[ inpler ] : h the this.options[ kalse;attr( elemargetW/ 2;
	dth ) {	isTabInde: 0;"></d= isNaN( ta"." + this.widgetName( options, element ) {
		// allow instantiati ].co			left: targetOffset.left,
							top: ta+ right ) < tif ( !this._crth: elemWidtr tabIndex = $ = isNaN( tabIndeonstructor( options, element );
		}

		// allo( abs( top ), abs( bottom ) ) ) {lizingk.important = "horizontal";
				} eeturn this;
	},

	enable: fune always passesabIndex );
		reDo wightwas( ++uuid ly"marplu.jqueryuit they inhrCase() !== "ionPosition = 
		if ( !element.href
		img = $( "iposition, data ) {e sure destr "']" )[ 0 ];
idgets that inhon" );
ref || isTabIndexNoelection: function()d all of its ancdth = within.width,,
				outerWidth = withinsible(
				collisionPosLeft = function(r.filters.visible( ellision[ i? "		opLeft,
				overLefeight" ], function( i, name ) {.split( "." );							left: targetOffset. 0 ] + myOffsetWidth,MIT instance.element[ 0 ].parentNod	if ( !( prget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( con: prototype.version,
		// copy the object used to create the proo that the mouseH		proon( faRrgetal{
			vart they inhnputs (
		$-\d+$/.test( this.id 
		$.pe ),
		// track widgets that inherit the element anhod :
				o// disabled i	collisionHeight: coll
				vroy(i( casionHeight,
		}
			i}
			}); element is iniword 	width: el" )[ 0 ];
	right = leesiz elemendback =element.node.data( elem
			if ( data.collisionWidth > outerWidth ollisionWidth,
1 ] === "bott		eleme				position.left += over						$.widget.extt - eledValue && methodValpport:W
			.protons.d			positie ) {
			, arg		if surn th.spli) {
				$( th		prosupport .out" ) {
			};
	license.
_Classt: $.fn.outeinstanh rig
	_on: functt.button ) { widget n retibutorth ),
nstance[ hann ret
		var delegate$([]rflow", r that = t based selectin.elemern false;
			e {
	t = max( positioin.elemeseDelay{
				positAb event ) {
		Widghe disabled = optioposir:e if ( ?e if ( {
			 ors: []
	arget, inOffs= functio
/*nd(  *th the eUI Spndex: 1.11.4ndow ?http://j $.wyui.coroun ster	widtpytartedh the eFfuncion( indatposition" eturnoement *	}e" + tu) {op,MIT licenseueryoffset.top,
		.org/n.margirHeight = dset.topapi.,
				oute/sollTop
	};
	}

d = widgetom = c_	retuistomfelement, 		element: elem,ht edge
		retusitioertical
			// IvarLeft;
fne ) {ack );Left > 0  within.ptions ].applsupport 
varBottom;-\d+$/.te// element is{
			var withattr( elemede || i= "." + this. {
inOffses, etom = cName)
			( "ui.tom = c"yCode: verop ]: ": with"on, ddefault	};
: "<input> + dat
			t ) <Prefix: "tom  + dat	},
	_cn() {cul tabt is
		// i._on += over	 insnce,i-;
-triangle-1-s + datdisa is initially over botn"
			/Bottom;ncrore 1al i ].pon, damaxt is
		// mint is
		// numbly trmators: [on, da
			: 1
		if (step: lem.s overT "abselement is itom  within
			ghlighse {
					nents: []
) {
		return tdValue && methodVal// tp://j};{
valuode <att) {
		be docsrgetOff);
				O
* ( "masLeft,
ns[ key maxata.collisionH
						positi			pop = withinOffsin;
					}
				}
			//botho far up -> aligbothp='#" + map
			returm
	_top,randlea- data, ) {ion.top[ 1 eld2,
	h ) {ar
});
itior moe.js,"marFirefox handl#9573 {
					t + da data(ns,
	roxy() {
// 			// d othen -> abut re {
ts or wiher broon[ co
			/ element is initial= this
		this.focusabfsets( raor = $[ non[ coposion[ cogn withta.collisionHeight > outer ( overBelem{
off  eleposile.orgign with botdocumen2,
	over
	ueId: f ( overBargin "absonaviry.oeId: _init:hi isT( hao.outre- worksithin = data.( !( prop i *
 * his unloasitix is not sp
			 ? wdestroyed. #779 === 0}
	},
	flipkey ) yCode: {Width,ithin.dValue && methodValisionPo
			// IargetWAdisablthin = data.n false;Apply = funcMet(event) && ery Fo				pockEvent", true);
	ue.jquery ?
{-state-dedCheck;
				overL
	version: "erabl[// too ftion.tooverTo ]},
		name
	}// copyouseStart(thiwithin=Window(  disabl	data.myar _super =right" -\d+llisfin = &&right".uuid;ght side ons[ key[elemWidt			targin	_superApply = function(pushStack( metverRight = collgn wit += overkeyment i= "center";
				}
			erBottom;_		if r";
				 0 ].owne			0,r";
				ght side oon( sizign wiD.collid: false });
	on, dakeythinr ](pom of wfocuckEvent", true);
	ositionottom;

			// element is talle = posibluhandler ] : h= -2 * data.offset[ 0 ],= overBl	if (th left andta.werRight < abs( Heightlicense.
 * http://jqon[ collihen mouselisionHeight > outerHefset[ 0 ],) {
				// element is initially over tht is wider thann
				i				} efsetLeft,
				ion.topct-hwherototype = baeight &&ll met data.offset[ !newOverLeft > 0yOffset + atOffset

var mousetom =f option( elem
				newOverRigdroppable.js, effect.js, effect-belement.nodeNpin( method '" + oop: ele co> 0 ) {
				post + myOffset + aposit
			ele
	flipset - offs
			? within.scrollffset.top + withh,
		k offsets.my, elem.outerWtion( positi.left +=		if ( !set ) {
				 + myOffset + aelegate( roto0th :
		overLeft < 0 ) {
				newOvt + off"set - ins ructoollTop-button"
				offset = -2 * data.offOverBottom; ( arguments" ) 		thiswa = $			w		ove = pa valu + at; "abs	thisTop posi it ) { = e	fun
			ng			optionsTop,
] = $. + at s: $.nht;nLeft = ppu : with,
			this
			 ? w + ats
ack {
				newOveis ighterlyer ==ss( ers retur"absoeight :
: $.noance.even )cusnt[0] ),t :
			id-"		data.nts with an ? nut) {
			ele{
				newOve." + this.widwithinWidth,n.isWind		-datallisionWidth - outerWid	// Iframe mouseup check  elem];
				}	version: proottom;ft + da// element is tallebs( left +his, Fa.atespace = naild cote.js
			// jset = -2 * data.offset[ 1 ],
				newOverTopn new cons| ab+ myOffseion() {
				$(
						ta.atwidget is ata.collisionWidtop,
				ovfsetWidt|| map.nodeName.tta.eleEata.				dat asynchronousor tithin.bar.js, rueryui.cta.at{
					po
				cff		return  :
e.js, select - of
		B+ this.wid+ data		-dataOffsets( offsets.my, elem.outerWerBottom < abs( overTop ) ) {
				etHeight.11.4
 * http://j ens)/ :set + i ele ( 9;tay ele)arseCsrightom eionPosTop = position.top - data.co	verBottom  withipace = "." !mapName || map.nodeName.tset + 			var mft < 0 					// set + eof hN( vaoverLeft < 0 ) {
			!mapName |thin.r === flagmHeiknowned ? nu	myOffsength ==Top +s( ogn wi|| position this, "(ion.l)erBottom 				newOverTop = positiposition.topht < abs( oeue(function( = within.height,
				offsetT) {
					position.left += my	},
	flipfit: {
		left:
	});

	basePt[ 0 ],
				newOverRig{
				pffset;
				}
 + atOffset + offset; theat(	.bind($: withition( poTurn th).has	};
is inTop,
	inst.pagop: ele + myOffset + llisionPositiuparginTop,
				overToft + myOffsetPositi) {arginTop,
				overTop = collisionPosTop - off//marginT=== "sadd ( !htate-			new		//eq( 0  = {on.mawhildth: fuletch =nd kept re: functi withi
		div = document.createElement( "div"le = {
		indivverLeft ) < overRight ) { {
					plementStyle, offsetLeft, i,
		body = documentfect.js, effect-bligName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testinden ? /(adthin.wit: {onPosT

	n( ele < 9  = mop
				pos: $.noop,we 
		
	telectmeody", eventwao cartilibilitup	}
				}nElemet - elem[ 1 ]ocumgn wi
			Positih: 0,n method used in jQuery.supperRight = coll
	dValue && methodValue.juirollTop 		myOff22px;";

	off	DOWN: 40,
 "Width" ? "div" );
ositi"

	_h disablinPosLeft - of, "offns = offsewrapStyle, {22px;";Htmially= offsergument  may come emen+ data.this.hoverableStyle, {+ dataL = "";	var side = na				// - disablmove		-dapin			overition.top += o);
	try o usit( parent.+ data.c=222px;";( !elemerginTop,
				overs = offsetLeft >tabunction(-( value )/jquerytParent.ment;
			elis incor
	all jQuery UI AccoIE 6n.flip.lellisith )= th;
50%rgumentp + data.insertBeun) { : wirion  top +an explicitqueryui-= overBottom;+ data.p://jquery>lback.ceil(com
 *
;
			} * 0.5Righttate-distive: 0,
		anima'" +( body ) psible: false,
active: 0,
		animan mouse was out of , this m <= 0 ) if			div =  = {setFract, this )o that they inherit fro, this ){
			var withi this Left;
			// too far r			0,
				offset = -2 * data.ofue.jquery ?
						returnon, datkeyCelem.oent, 	},
 );
		}en zItName ](Props: {nt: "clicfunct	},
.UPs = keyName( "body" )[ 0 ], "fake body" forment
				elementottomWidth: "DOWNde",
		paddingTop: "hide"a "fake body" fortom: "hide",
		height: "hide"PAGE_hide",
		paddingTop: "hide"reventCliagmHeight idth: "show",
		borderBottomWidth: "show",
	},

	showProps: {
		bopaddingBottom: "show",
		height: "show"
	-" + name;

	if ( !pr/ too far rignnerHTML = dValue && methodVal		eleme"<ncti		.app='div" );
 ( !ithin.otr( "role- = "show * http://jqu'></ncti>I Mousld.js, eff

})(); ui-widget ui-helper-reset"" +estEle"<( typeoARIA
			.a				ove ( !h );


		// dontr'>tions.col	" )
			// ARIA;
 s.element {
		dindCh.umous"'>&#965rProw collions.colla/a	// handle npsible && (options.active === false ||on.ma * http://be == null) ) {
			options.active = 0;
		}

		this.on.maocessPaneerPro
		// handle negatstanceMet: functghlight.js, effverRight < 0 ||				position.left += mye top of withinem, dataName tLeft, i,
		body = dput[ inputIndex ][ key ];
var mouseH(), elent */) {
		retllInfo.h// other in
				$( .left +=eue(functionent
				elemenePosition.toody"
				offset i, both
				} e
			pane= trype = {eft: funcinOffset = within.oop,? within.ctive.childht = within.height,
				offsetName( "body" )40ons.header )
	y" for t i
var position n( posis.heavar within = data.within,
				wieMet: funct	} eldler ] : ha.within,
	ivate: nullight" ?tom;
			// 
		hinOffset;
					posthis.options.icons;
		if ( icons ) {
	cannot 
		this.hue;
	V max( header+_destvar with_&& overTodiv>" ),this.optiput[ inputIndeposition.left +=xistingCo : this.act				p

		thheade:ve();} ns,
				position.left + = max( headerwithin.scroll {
		++ft;
			// too far r&& overToi-icon " + ics: function()&& overTop ve when necessar&& overTop hinOffset;
			.removeCla

	_createIcon

		retureader-active ui
				n&& overTop this.hs = key	( thifloorthis*p" )
/ = {0et;
			.remov + 17
			.re2)
		> :not(li):even",		eleme functld.js, effprecitop + Offset,
				newOverBotlectedon-headeraria-contOseUp(even{
				position.tTop = withi -> align wi-\d+in
// Supportria-control offsets["aria-conteft,
	
			.removeAttr( "tabIndexn wit= "." + this.w		elemes();
moveAttr( "aria-selectedOf
	},

	_nupartvate: nullnctionnu optthodVa = false;decimClass
	ile( veAt".if ( over			"attemordion-==s
= inner ) {
			-d" )
		ble:
			return true;
		.rem
	},

	_reset" m " +
			." +,dgetveMieft, posiuery ?
						returnValutrigger( )/,) {null :aargu > 0 )destinsertBe-stringthision(eventoffs	DELETE: 46,
	." + (n wiors._mouse", ""=	paddingB
		this._de?	_setOption: :ys passer( "ariaWidth : -t", " "bottom"- // foturn {
			e|| doStyle !( key === "
		// for( key ===
	
				pose con	this._acti
			// _activat	// wbottom" ?er )o rDocum Width$( "uemoveAdion-header-i", ""+tr( "ariaiqueId();
fix"aria-contrge
	ad JSoptions = ns.my[mattom" )header-i
			 } }-hidden.toFdiv.Style, {s();
;
		iqueId();
clamument.heade		.removeUithinOffset;	this._deata.at[  >le: false wh

	_createIconithinOffset,
				outerWible: false 
		this._desed; open< this.options
		if ( key === "collaps		thiside = $();
		thith :
			turn {
			T license.
ctive,
			panel: !this.active.lenttp://api.jqueryui.com/jQuery.);
			this.active.children( ".inOffset = within.offset.top + within.scrons;
		if ( ics passe$( "<span>" )
ect.js, eff ? $() : this.acti
			if ( dion-icons" );
								po
	},

	_key,hidden" )
			e && rn btName,op - n i ] disabled"t;
				// roxy() {
OverBott	.remrols" )

			( position.top - col" )
			.remo
					datrn btWidth :
								if ( overTop <h ? $()p;
	t ) {
			tht() )
		.jqueryui.com/jQuery.tate-disabled"ion.e )
				.at tooe )
				.atata.el data.offset[ 0s.delaheader-		if (!this ( body ) {header-icon" )rs.add(reset" )
			ype that wevent.altKey || 	thisength = thision: "1.11.4: $.n(
* Inclpyrigh	thiation and MIT license.
		}

		this._pr

	_hove;
	suppe );			cisabled", !! "1.11.4 + m

		switch ( event.keyCode ) {
			case keyCode.RIGHT:
on.macase keyCode.DOWN:
				EFT:sTop, position.top );su fac	.toggleClasshinOffset;
	disabled", this )get ),
			toFo					ne).togg methodd: "none"

				bre, !aggaet" )
			.remo
						ight{
NTER:
				this._eventHandler( "1.11.4sed und		curreon(  this 		opt worksif ( overTop > " ) {
			this.els:llisionHeight - ou= "center"edby" )tance[ options( curreh - 1 ];tr( "rrflow"aria-
			ttr( "aria-hiddss( "ui-state-e = $.ui.kCode,
			lenata.at adjust based on  ); key ) )Glob		pos
	_setOption: ft;
				// i-state-aocus.focutElents( value )roto far up -> alig, !!val-dis +Offset;			.removeClass );
						reisNaNget ).at?is._deveClatr( "role" )
p;
	ttr( "aria-hidden" )
							0,
		yCode.U

	_createIconargetHei	.removeClass
			toFocus.focus();
			event.preventDefault();
	}
	},
,

	argin
			event.preventDefaulfunction( event ) {
		ifdex", 0 )accordion-header-ic				methodValue UpDelegate );
						data.n() {"			w-= tru too_createWidget:

on, datthis.active ax$();
		// activaxon, datden ? /(aitionmyOffseandle );
 data.colliscaoop,

				
				this.activenow$();
	ers.add( this.headers.next()
				overRight = colisV.js," )
			.removeAttr( "header-icon" 
			//iqueId();
in
or moe.js,headers.in

	refs._destroyIconput[ inputIndex ][ key ];
	},this._ = rorDocum
	, datl remaining "icons" ) {function( )
				.remove();on-icons" );


if the browithin. a strindata( {
	s[ key ]  = maxttr( "aria-hidden,verLowAny" )
			.rem
							.removeU,
				atresh: functi
				ers.length,
			currentIndex ight )tive p	this._destroyIcon;
})( max( 0, options., active panel sti
				.remov		// maabs( newOverTop s.headers.lengt,

	_this.active );= this.heade", !!value );
		this._eventHaisionHeight > outerH= "positiont.leftength ) {
			options.active =r the MIT license.
 * OffsetFractions = offse;
				break;
	i,
		r the MIT licollisionPosLeft - offs)
			.addClass( "u;
r )
			.addClass( "uiis.active = $orner-all" );

		this.panels ventrner-all" );

		this.panels, bu	left: functipsible: fare
			/ ).re	myOffset = dhis.active = $()invaUptoFocus = this.headers[ lengthis.he
				break;cordi.hide();( toFocus )
			ordion )
			.hide();

		testElementStyle,lly over the top ( posithis.heble 	var within = data.wiFocus = this.h
				}
						// too far 	if Dent i-content-active)" )
			.hide();

		// Avoid mfuncory leaks (#10056)
		if functievPanels ) {
			this._off( prevHeaders.not( this.headers ) );
			this._off(dren()tabIndex" )
			.reels ) );
		}
	},

	_refreottodion-content-active)" )
			.hotto);

		// Avoid memorce lethis._off( prevPanels.n
 * h ( toFocus ) {ottofunction() {
		var maxHeight,p" )
			.removeClass( ns,
corner-all" );
		this.active.next()
			.addCl				this._activatnewV ).attr( "tabInd!Left > 0 0 ] === "left" ?
			if ( inpers.add( this.headers.next() )
		_off:lisionHeight - outet ui-helpe			wit: {
	
	ader =tr( "role" )
			 ui-widget ui-helper-resetet-content ui-	withinOft = within.isWindow ? within.scTabs : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottabsollisionPosTop +.widt
		{
					newOver
	= position.top + overTop + data.lr __30
		if ion.top += over			new( overTop > collap contafter a widgegn wioptionckom of wueryui)[ 0 opti );
th ) {idf within
			how( overTop e );
 {
				retu element( overTop > Width,te.js, 
				"aria-selectedLsionPement is iisionPttom ) {
						pisLonWi: et.js, mouse.js, proxiehasthis/#.*$/ 0 ] === "right"= "center"anch) {
			vars, e		}
Url,in: fuionUrui-accordi		position.top 7	-data.eleE7n.flip.le

		posnt ) {ref
				ty
				eleviaisDoipt (#9 ) {
					}
=eateIco)
		, {(.header eft: functateIcons(is.element "ficorner-b(
					,was aHeight

		thit


				var elem = $( this ),
				ers returdeco	}
m|scrhrowget( rrn.len.isWiURL	},
UTF-8nt.h51;
				tryf ( events unction() absoleURIfunconfunct -= elem.oly on the cProttNam== "f) {	top: "-		maxHeightsition = elem.erHeight( true );
sition = ele
			this.headers.each(functionder.uniqueId({
				as $.data( > 1cus  -= elem.ou=m.css( "pothis._s				withi) = fal				position.top = withinOffselems[i]) != null; i++ edby" )
			.removeUniqueId();if ( ouss to the headers		prevPanels = this.panet;
	supports
		tr( "role", "tablist" );

		// don't "ui-accordACE:
			case ke
	- tab orderon()k( methodab order.activeHeader );pro on 
	support necessaryyOffset + atO_ the domyOffs[ 0 ] ) ) {
T)/,ers[ 0
		
		ght 	.appl		return;ss( "ePse= this.hetionac {

		
			// // copy
						 -= overBot= setTimeoxHeight, le-1-s",
.mouseDelay active panel
	hidniqax( ive === this.actt = catElement $.mestElemention.filsh apyrightCode.ENTER:
 )mWidth :
	lis.headers.uniqueId().aion.bdiondexe head passes aush( [ op). 1.1en mouse was out of ight() : w		if ( avoids.each(f"abso the doiz;
	
 *me, 		.removeUniqueId();
		.heig ),

	dison[ c -= eladerId = header.ununctio	.height( maxH Inc;
		}
			retypeof scollisionPosition: collisiypeof sel$support .outerWidunction( position, data testElemenypeof ector ) {
		return thin.r" ? this.headers.eq( sel;

		// cleaght );
		" )
			.removeAttr( "ypeof selector ? this.headertend.appl this ).cse when necessar= "_eventHathis._mo

		
	em.css( "posi) {subeight ( "aria-eheaders.inypeof sesabled
			if ( rget: act bottragNotNaNdentt - o"marginRURthis._ event._off( this.hght side of wit || twidget.js, mouicontab
				if ( tivatedd( bt ) {
		his.pop = olrget  Math.max( 0Down" });
		tone head	// the uid || handl	// element wi	widgetEve = $[ namespace ][ net: active,ae( thlse ifis._on( ght ndex )  {
					ps._on( this.headers, evennt ) {
	his._hoverhis.act collapse, simulate a cght =	};
	if ( this.active,
			c	elem =lemHab han.appe.splilickedIsActive = clicked[ 0vent._on( this
 ] === active[ 0 ],
			colle nested
			}ect.js, effect-blind.js, eft + outerHt;
	s: nery.ove,nt" )of 		if ( thiIsActive = c ),

	Data = {ypeof selector	collapsing = clickedIs = headers.th :
						0(),
			eventData = {
				oldH= "_eventHan?.header{
		if ide,
				newHeade} elseorrecickedIsActivoldPaneptions " ), fu.next(),( !supp "_eventHanhis ._on( thisActive: function( selector ) {
		retypeof sels passeanded" )
			.rnt, evtr( "role" )
isionPosLt ) <iew  ui-widget ui-helper-reset// clean bft + da eventName ] panroto mouse
			keydown:}
;

		te + "nelForTabnts = {
			 if ( thtr( "role" )
tabK
		// callbacks
		activate: null		data.Ta't D elemenset[ 1 ],
				newOverTop,))
squer "lirrenn, data lprotoible( element || this.act_toggle( evasses ongoingForwar pane
		var sidetestElementtp://jerflNavffset + offset;
	.jqueryui.com/jQuery.erTopWidth: "hide",
		borderBheighthideProps: {.RIGHTible ==".ui-accordion-hea
	},
n the previous "role" cted && ( !ins".ui-accordion-heahide",
".ui-accordion-heaLEFicon" )ion
		active.r// element wi the previous--r )
				.addClass( options.icons.heaENDtions.icons.activeHea ],
		on( selector ) eAttr( "
				.addClass( options.icons.heaHOMEdion-header-active ui-sts passes 		.addClass( options.icons.heaSPAClicked.ch// ": "trueow ),tp:/ickedIsAc" || pos overLeft < 0 ) {
				newOvede to positioned ele
	construcem.offset( $.e_ element(  the previousl[ 0 ];
cument.getEle	.addClass( "ui-accoTERptions.iconTCE: (= overeft > ove
	constnt pow canceling angParent.rs.icons.activeHeader );
			}

			clicked
				.next()
				.aget.extend( {,
active =eActiva ( +a.newPanack = thddClass( "ui-accordion-contentm.outerHe ? this.headers && !optioordion-content-active" );
		}
	}a.colliedIsActi
		this.element.trigger(ttom = $( teight,
	 $() :." + this functrn b = {[ proveHeadeoverLeft < 0 ) {
				newOv

			clicked
				.next()
				 the previously activ_ta.atNextn IE  the previous, on
		active 0 ] ) ) {
NlLeft,
	N( va
	},/comm
		hey=== "sft.apply ele!eveca.newPanel,( this ),		div =trlKply( t": "falmeta
		( element );
le.not(his.p the pre immed
			daparsat ATon, u
		thi( thOffsetFract the pre		-data.elO toowiseorde || confp - data.collbytop ,
			n and ssbar.js,  element	// if w} else if 
			// if weestElerigger: ($.uir actdrom ginRight= $( tnnounc	.filtfinishjQuery )t + atle( es.headers ); the pretLef_trig
					poif (
				// ordion-content-de.prev().attr({
				"temovref || !mapNaed
				.next()ht = within.height,
				offsetTfect-size.jement, " maxordion-content-active"}		instan
		eft;
			// too far r the edIsActive ? $() : clicked;
		tui-accordion-header-active ui-state-active" );
		if ( options. postrl+up				nffset + 
		retuNaN );tabheaders.in: "false"
		});h: "hide",
	thisons.icons.heade
		eventoverLeft < 0 ) {
				newOvess changes < 0 || newOv	$.each( eventconslt+
 * hup/on.maected": "true",
	rBottom;/yrigh( th(
				( thctorader on-header-acti
		}

		toShow
			.attrcordioalt					tabIndex: 0
				});
	},

how",ly over the top s( "ui-acc);
		}

		toHi
		});
	},

	_-",i,
		bs.prevShow = this.prevHide = ( !toHide.length || ( toShow.index() < toHide.index() ) ),
				animate = this.options.animate || {},
			options = down && an+",sionPo| animate,
			complete = funcent.currentind
		toi-icon " + ic
			"aria-hidden":m " +
			 + mTntributldHeader: active,
eAttr( && abs( left + {
				lem.outerWid-headcase>mation in casei ] ] ) {.ui-accordion-h;
	};
}) = dur<vent: "clickn = duratation in casrRight ) {
	dPrototy !toHide.l
		if ( a",
	ate tne alreaasing || op		if ( ( optionle-1-s",
-\d+entData = { = duraton
		active
}case( "a: fucase-top" );anded" )
			.rreturn toSent.currentT

		to
		}
		// fall back from options to  = duratector === 
		toHi/ fall back from optien( ".ui-acc
				// te( th)r total, easintion, easing, complete );		this.element
				.toggleClass( "ui-state-disabled"	};
	if s, events is.options)ing he outerHom > 0 ) data.cx )[ 0 ];fect-size.jsnimate = this.options.this._eventHanevent ) {
		if ( event.altKey || 
				break;
			c			// all, selectithin.ofa
			y's			active.showPss( optio	}
				upD this )		complete: complete,
				step: funders[ ( currentIndex -  + length ) % length ]; Math.max( mptions.icons;
						) {
					maxHeight = Math.max( maxthis._eventHan// S
				inceling activation",
	tion ford; o

: $.no the  {
					pothis._
	_setOption: fnt, eventData ) =ght side of witis.options.llisionPosype that we're) % length ];gn wi.heightStyle !==				ift ) <N:
			oFocus = this.hea) % length ];
			this.h( "ui-accordion-contenis );)[ 0 		complete: com	$.each( event.saplitzeSthe pible= "center"				"ui-helper-reset				"?ide.l elem = $(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&.hei:
		var
				}
				methodValue tivate: null,
		beforeActivate: null
lmove when t", 				instance  ":has(a[ "fi]) jQuery UI Accoin.ox.prop !=tion(ss( "ex ) {
		var active = this._fin(functo|scn thi;
	} if we' booleon =rgeteups outHeight > o
				})
		this.active[ ng tol[ 1 simulate a click on the currently active  );
		this.		elemetp:/apsing =the lement.ownerDocut", "" ).height() );
	insertBeftop just = 0 anono
 * Ccollapsible: falsent, eventData ) =||lass chan( selector ) {
		ret {
			submenu:icked
				.;
	},

	_setupEve	delay: eventN the nt, evef we'regonxt(),r ) {
			fss changes
		// i});		data = da = clicke	this};		if ( nt, evver righ	.hide()
	esizabm windowtion(offs		activeHeade	.attr( "ar: active,
this
			return;
		 ] === "left" ?
					d	menus: "ul",
		posiition: {
			my: "left-verBore collarBottom;a-expandespace ] || {};
	exis.options.animate( this.hideP// clean u0axHeight, n && animarentldown || animate	_off:1 top",
			atight top"nfo.wiexisht ) {Name, this._mo

		if ( {
		vie( th		oright: s: "> *",
		menus: "uefault();

		if (event ) {
			$.els: function() {
		var prevHeaderaders.length ) {
			options.a				if ( boxSiziing, complete );
		}
					}
				ent-active-03-11
* ht "show",
					.addClass( "ui-corner fullName.toLow "ui-corn
var position 
		Cons 8 (see #6720) false;
			this.ar({
			:"tabIndefalse only whexpaosituring navigation)ontribut: el
				overRiositiond bu
			// thery odd bug in IE 8 (see #6720)ui-accordAttr( = offsetLeftn() {
rs );isabledoptitoShestElementParent,// M
		if ( ive"f we'remarginRiab is._ments;

		// 
			keydown: "_keydown"

			eas0e"
			})ontributorsllisionPolector ) : $();
	},
ase keyCode.DOWN:xHeight =nt, eve"none"
	};
	if
	_hoverabln() {
	s stay on UL durin$( ev		if ( ar.
			"mousedown his.mouseHandl": functio === 0 ) {
			/ a very odd bug in IE 8 (see #6720)
				ructor ent.isPropagationStopped() ) target = abInde	active = this.			.attr( "tabIn.height() " )
			.removeAttr( ");
	},( event )rBot
		s.role,
	st( ".ui-meAn( sel-state-active ust( ".ui-medd buelem.width					nu after clickingme, this );ry oLicurr"auto" ) {
			maxHeight-nav69.ibutor- i, 

	top levposithis., "tablistheaisio * http://jquery= offsetLeft >;

", [ tractiveers returPt.applyposiCopyrig
		}
		}

 *
 * Co indexickr the M) {gi-acc"> li?
	sition.ms.elementgn wiexprspaCss(= "center";
				}
				ocusable(ment )ill b a click on the curre
				if ( s.icons.activeHeader );
			}r.js, diaft: function() {
			$ <9ble.
						if ueId: fun.collilem = eleif ( opon.ma.flip.left.apply	$.ui.positactive && this
			}
veDeleupport 	}
 = ro
			t,
					-data.el ) { else elemHeiwor "maet_sll while the mrBottom;	retu	data.targetHe			.filt

	.ui-m		varnif (on-ar taeightvent.curryOffsettom > 0 ) th an eea|buanywag to ac).length === & options.-= el		"tar taearTimeout( this.timer );
								}
				}
			},
					// corner cla	"mouseenter .ui-menu-item": function( OME:luusable(icker.js, dialog.fter clicking).length )  * jQ
		swi1 ) u 1.11.4
 * htt().left;
	supportsOCode.Events ftions.activ			rnction( event ) {
	move			}abmouseHand": function( even "1.11.4",
	defe"
		ns.role,
		ng tt.js, mouse.js, posle = $(); "ao far u )null,at inher		// If the active item is to avoiseAll",
			focus: function(, i, nhe t {t, keepActiveItem ) {
				// If there'sment.t
	_setupEIf there's alreadrable( this.headers		}

		this._cre the poturnd bu{
			Id save time}
Itive[
		}
 0 ] ) Id("
			})iurrent, keepAct
					if ( !$		// corner classes onft = max(Ariafect,
).leHide.prev().att
	},

osition === "espace,is.mouseHtestEle.spl)
			
		}

nction() {vent ) () {
				as		} elter the  {
// Clicks.headers.next() ) u collaps
			haerBottom 
		sw});
nd for renderingxpanded"resh() through nargethis._original event may come 			thiss.do			var mader in atch =}
				});[0], thiryui.start" on =er
& thisa posit-ao|sc	DOWN: 40,
	llapse anyt );
					}
				});
	on and {} !$.contains({};
	r" + name// Clicks o"#s.elllapse o centercument, {
			click: fun// Clicksrn new cons),"ariarevent firing of t "aria-activedeturn tharia)
apse a			}
			addBacdth;Aash a
			re					x = widgptions.ive ||me, tctive );
		}
addBac.headers );lthis )"poli offsetLeft,
	 {
					paddBack()
space = name.sp
					tnded" )
	 ) {	.removble,
			toSwn"
			this.collapseAll( evght side ofabe._ini bubble, se}
				});ion.r( "aria-disabled" )e if ( overRighHide.pre ) {
				var
	},
:this._delay(func
				.rabe sizby":
			blIet + of = this.aabIndex" )
				.ru-item" )
			blet-contentepActiveItem ) {
				// If the active item is "aria-, "tablist" );

		// don)
		iftive item since it is no l
			 jQuery UI AccoArren memorys = ks (#10056
			poht ) {
		.removeClass( ioffnction() {
			// thetion(t() )
				.to = $( this	// Red
			// themalreadydata( "ui-menu-submenu-ca						
			// the
				xt()
			.remration,
		ow canQuery Umentow|hidde
		reme, tindow
 */ * hscenPosihild7715ing" )

			a-controls", panelId );
				p" )
		xistingC
			click: fun"ol,uveAtgs = thition() {
		return ththe cl this.headeptions to 			// If no<divt|se= offsetLeft >i			" ( emoveClass( "ui-state-hover" )
			.removeAttr( "tabIndex" )
			.removeAtteUniqueId()
	s = thio faionPosTop, keyCode.END:if ( boxSi

		switchle-1-s",
			heativate the alreae panel
		if ( act || absed to prevent firing of tthis.activeect.js, effec ) {
			fcase $.ui.keyCodm.outerHee"
		},
		items: "> 			this._movs, datepickpsible ) ||
				/	height: {
		iabindefunction
		ii; "_ption( opt
	ntal";over 
		var keyCodthis.activs.jqionPn anhowProps, i( eve
		}
		if ( !toShow.meouheadar optio ) {
			maxHelick on the curreGHT:
			headers );	break;
	( toShow.len the new instance
de.RIGHT:
		ls;

		this.heve && !this.active.is( "." );

		this.pn the curres, effect-blind.js, effect-ive === this.active
			brea
			break;
		case t-acti/ callbacks
		activate: nullgn withvents = ( !toHide.le
				var ] === "cordio
			this._mWidth :
		
			t( this.t
			if ( overLs[haracter = 			taetWidt - v1.rI Mouse : options.my
		}
	}, $( case $.ui.key "ariif ( elem.dr );

	menu dividers

			tw += ft.apply/ Prevents focusincharac: acti		activeHeade}
	},
	0 ) ect focus to tCode: {
		BAC= "center";
				}
				overLeft < 0 ) {
				newOverRight 	}
		}
	},
	flipatch = th {
		left: functio,
	flip ) { {			"ment islickedIsAct"( "u}
		}
	},
	flip
				 ) :
				matcndex", -1 );	// If noaddClass( "emove ui-

			if ({
			// PrhetFr to move down the menureak;
		case s( "ui-corn bug in IE (#ks inside mem " +
			max proper,
		PAGE_U

			// elemergument ) ) );
		thith ) {
			Div = dch(fu.hide() String.ftupEve "hiCancel |Height		}

	-		myOffset = d
	},

	_m-]\d+(\.event, mtch.length )htStyle !== "conten con usiMenuer cont, skiidget.js, mouse.js, posdefaulemoveCl},
				if ( ar $.css( elethis	( insttion() {
			},
			( functf mouseup in the case o||viousFilter;
 div.chent.style ?
			tive );
		}

				this.fo;
	
	},

	_nt );
			bemoveUniqueId);
	},

instance = / Destroy menu divy(function() {
					del
				this.fo element )
	_activate: function( event ) {
		if (vent.pr(function() {
					del element )der: "> 
			.addClas
				this.ar optio		},
			"( selector, e+ria-haspoput-child,> ._activate
			thi{
		etFractio
		elemenOnly set the is._filterMenuItems( c element.);
			}

			s passesent );
			} else {
				this.sele		}

			// clean u String.fritems,
			that =was ast-child,> :not(l	}t );
					}

	eft;
			// too far r );
			ski/ callbacks
		activate: null,
		beforeActivate: null
ypeof selector eventName ] 
			this.
		div = document.creanu-item": is.element.si/ corner classes onisionPoI myOffset +abver ri	thilect: nullName ] = "_eveneadered": "false"
	ame 
			});
		}

		thistoSiderlickedIsAcValuecauses a very odd bug in IE 8the animatitoH
				!anges
		// it causes a very odd bug in IE e #6720)ffsetLefex( clic
		if ( tyole( e:,
			a
					.aue;
n ui-ihaspopupnewttr( Carat = $( "<span>" , then kepend"true" )submight ) {

		} else {
			toHide.hide(		.removeUnabbackground: "none"

				break;of this bling we're openinghin.ss( optionenus.add( this.elem is items )ems = menus.find_activerTopWid
			vaa(fun
				

		if ( o);
		ing spaces anos[ 0 apsing ? Otherwat: "rid-"eActivate",></div></$( this ),
					i!Height, $( this ).cssnu-item" ).eaow canc		pro as d
			"aria-expv></n element
		thlected": "truelement
	

				iLeft, i,
		be-active" );
		if ( options.he click handlerCarat = $( "<& !optioefault();

		i	versionIf there's m, .ui-med": "false"
	;
				men			.removeUniquexhoptions.icons;xhr.abentHandler({
			ta
var m ui-i {
					r!lledbyrevent firing of $.each(( ");
			})
	: MisdProteventN_on( this.headersui-state-d/ Add aria-disany disabled menu itemn"
		};addClass( "ui-menu-ite"fake body" for 	return !!$.CE:				if ( ist items ts.active = $();tp://j		myOw/
		indo// Clition() { = cliCE:nuItems( characte list items th $( this ).height() ) );
			submenu

				."aria-laenu-icon ui-icon: "option"", "truem" )
			.uni );
		} emoveClass( "asing = eas data.	.removeClasat" );
		} else if (se {
		ttr( element, "tabindex" ),ement[ 0 ], this "-disableddata.collctor imate: functition"
oHidder
				targetvent will bubble, see #9469.
					if ( !evntParent, testElny disabled m: fun, element,ructoata ) {
		vion( ctor "ui-stck = fa!value )
	
	 data.w $[ namespace ] || {};ny disuctor = $[ na	ey === "icl: toHide,
				newHeade		heant" )by;
unctiight isabur( event,._super" ) === "h
		//ed attribute to-03-11
* htt
		.removeClass( iAttr( )
			crollIntoView( ite},
		namespace = nae ];
	},
);
		}
		if ( keIT license.
 * d" ) {
			this.element
				.tos.icoctor = $[ nam,
			submenulass( value.submei-state-focus" ).removeClass( "ui-state-active" );
		// Only update aria-ac;

Attr( "id" )tivedescendan
							ad

ui-state-disisabled) {
				this.e	// otherwise we should always stay on UL during navigation).
			"mousedown .ui-me event ) {
is.colnull :erTopWtion() {
		D event, dol
 * 	selector arget.notuery )u-item" )

		eventName 300,
	okeyCo"ui-state-actus
		this.

		if ( event && event.type === Carat = $( event,keeument.Carat = $( ( thid && target.not -= overBottui-state-disabled

		this.dClass( value.subme active pare contributors
 
			submenus = tm.children( ".h ) {
					this.s/api.jq keep it active
				// If nement ) {
		ontributo that aion || opion and other contributors
 ctivedescendant",y dissed.attr( "id" ) );
abIndex": -1,alue.submenu );should always stay on UL durinhis.mouseHaned = true;
					}

					 Open submenu on	overRight = collttr({
		er || "";
			rn {
			menelem.rt" )
			.hide()
	 === "number"], "boron, data ) {r
 we're collapsinader in queId()				}
		eader, but 
			.each
		select: null
		.prev()
				.attr({
					"eMenu[0],  300,
;
mp(eve,
	(functi
					"arion() {
			v( this ),

			keydown: "_keydow			.hide()
			.attctivedescendant
			this.e
		var 
		switch his.active || e the first	flip: {

			skind( ".uifor plug" ) ) || 0;= document.crelse if ( offseft < 0 ) {
	: $.nocense.	overRight = coll=== "numbeactiveMenu[0], "borderTopWtion, easingeft, i,
	"<span>" )

			easing: ea	} else {

			/unctiotiveMenu[0], "borderTopW
		eta-nu )
		to) {( this.// copyreturov
		a= "fileight -funcea
		alapser = it( $.c -= overBotts.dela
			}

			length = thi	toHide.animae"
		}		tabIndex: 0n( sele/api.jque.4
$='s.eltoHide.a"']individual ops, duration, easing, complete );s = this.headers,
			pre
				role: this._itemRole()
			});

		// Add ari
				overLeft = c
			maxHeight = 0;
			this.headers.next()
				.each
			ght = Math.max( mmenu after clickingault: $.neak;
		case $.ui.m is on the top level, let it stay active.
						// Otherwise, blur the active itestate-default ui-cor.focus( event, item ) submenu.attr( "aria-hidden" ctive || this.elstate-default ui-corner-all" );

		tthis._trigg submenu.attrUcontains(e carat icon
		if (.arry om" )
	( this.timer menu after clickingcharacter === prev	} else {
				this.seltivate eUniqur( "idthis.nextPage( evsh();

		parent();dgets that inherand( event );
	,
		
			break;
		case $.ui.keyCodeve .ui-menyle = {
		vactive && !this.a = 0ar option
 * http://ocumabIndex" )
			
			.removeAttr( "tabIle, see #9469.hover" )
		case $.ui.keyCode.SPon = $.extend({ $.ui.keyCode.SPACE:remov
			.show()
		

		this.pbus		.hs.timer = this._delay(functr({
			his.timer = this._delay(functiu-item" )ent, look for the submenu thaisabled =s.timer = this._delay(funct	"mousedoent.target ).closest( thclose();
perApply = function(his._hoverable( this.hea
		this._crent );eviousFilter;
	hin,= li:
			this.next	}
				});
			},his.previin,Data = {live.is( ".ui-state-dishow();
u = ths.timer = this.iew queId()
				.show();
 key, value );
	},
li.ui.keyCode.SPACE:
			this.activeMenuion: "1.11.4",
	defvent.privedescend		.removeUniqueId();
th ) {
			// waers.eq( artOpening(nestvent.pr{
		nstruct ),
					p	$.each( event worksactiveMenu[0], "borderTopWidths.previous( ng, complete );
		reventDefauEFT:
			thi
	},

	_createIco", "true" );

		
			}
Offset = dset().top		this._move( "last", ue" );

			toHide.animat {
		iat( $.css( th( submenu. "first", event );
			break		.find( ".u
 * ht
			brea);
						}bottom " +
				// Ibott, opte( they )mwithin, 0 ];
n", "true" );

		s
			.end()
			enu-item" )ly active he		.bve" ).not( ".ui-state-focus" )
				.removeClass( "ui-state-actarginTop: marginT			if ( boxSiziattr( "aria-dis keyCode.
			breW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.actf ( typactive" );
		if ( options.sing || ani}

		startMenu
			.find( ".uis.prevHide				.hide()
				.attr( "aria-hidden", "true" )
				.att event );
			
			break;
		case $.ui.key < overRight ) {
					pattr( "aria-expanded", "false" )
			.end()erge "le )
	]ngth ) {
	eventHandler(ctive" );
	},

	_clos {
		va
		this._refresh();
	ivider: function( item ) {

		// MatisionPosition.m
			charactht();
		toHide.animatria-hidden", "true" )	menu: "menuitem",
		idden
	blur: function( ever({
				role: enus < 0 ) {
				this.activs after the ption[ parts[ .addClass( "ui-menu-ico

				item
				 ._togenu.attr(  the cl				}
			-state-d._super( = function( jqXHRons.atu" )
				.rus" )( "nextp in th1.11
				if ( neemoveAttr(Top : ter a e: function( et.toLowerCasenusx bug that caused a .tems contaiveAttr( "aria If we were passed an evename, args, allois._mo
		caat: this._itemRoction suppou-item passes args)
0 ] ) ) {
	oOffstCli		.removeUnique

		this.refrenull
	},

	t-box" ) {
							adjust thid()ajan u
		thjaxterHeigs
			});refresh list items ths( this.activ|| map.noh the e<1.8			clear			if ( dir] = oristive ? / is ovrequdle 		ori	props outwithinenelay(fuep the = {f 1.8,nction( ) akip = | directaAll( ".objso w-1,
				role: thi_scrollI
		( "nexTrigh
	// next = ses all menu offhe active item is stItem: function(abIndex" )
				.an evf ( toShow.length ) {
	xhetName 	.				ders[ lengtinstancthis "nex,All( ".,
		withictive ) {
			if ( directios.actiset.topbugs
				})
	ionPt/1177ptions.it,
			elefset + offset - offset {
	s._m| !this.ac-content ui.ui-menu-icon" )hin.emoveClass( this.options.ar optioney === "iis._move( "next"ions,
		,s._on( this.event, {	.failders[ lengts._move( "next", "first"activeMenu.find( this.options.items )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPaghis.next( event );
			return;
		}
		if ( thiment.is( ":focus" ) &on, filter, f ( !fromFocent ) {
		var next;
		i( instance, arguments ); 0 ) {
				posurlelse if : functi "fi from AT.active
f ( !fromFocs._move(ilter, ffset;
				}
	ui-menu-icon" )ia-expandelement
esh: func "1.11.4 {Menu.f:Menu.fin;
				returnd( this.o}ar next;
		if ( t;
			bre false : this.headunction() {f ( !fromFoc );
		thiss, ef{
			( this.headers );
	},

== undefined ) {
			click: functfind(event ) {
				int
	 ( event, fra-labelledby", headerId );
			})ooltip		.next()
				.attr( "role", "tabpanel" );

		this.headers
			.not( this.active )
			.attr({
				"aria-selected": "false",
				"aria-expanded": "false",
				tabIndex: -1
			})
	t = thnext()
				.attr({t = thi			"aria-hidden":t = th= position.top + overTop + dation.top += overT );
Offset + offset + da	position.top <9, Opera);			if ( dievent );. + a()and/or acceighOffset =  === coehand undeeight em = elems[itHandlparent();

		tctiounctionargetHeig// EscapnRigt
			

	null :on
ntName n{
		var a
			awe = this._eyCode ) {
gatii.jqxate:ction)nctiondy" for testintr( "t 0 ) {
	n() 			breakindow( w		}
inndChis;
b"<a>" nothross.document (#8661
			pement "[eente]:Cons[
			brea]).eq( 0 r that = ttions.meyt instahave+15.eq( 0 )get ngth ))
		iName ] = "_ected" "flipfit 	thierBottom > 0 0 ); 0 ) {
	tiveMen	};d": "true",traMenuIer a wide {
			this.active.ae",d": "true",
				tabIndex: 0
			}addDe= pabedBis.headers,$( ev_UP: "cannot call*+?.,\\b
		(;
	ui-state-disaew RegExp( It shoul).previo /\s+/stItem()er, "i" );tNamesp ( erderTopl key ];:
			this.t = th-AGE_UP:
			thisapedCharacter, "i" );firstrimotto		.find( t			re " 	.hideisabled ) {
			t			th)*+?.,\\\^$|#\s]/g, "\\$&" event );
			ret;
		// Only match on itefrom ATnew RegExp( "^" + escapedCharacter, "i" );

		return this.activeTarget ).case oem && newIted( new RegExp( match = this._f *
 
		if ( !toShow.	.filter( ".
			= $(em.leng},

	_scrollIn;
	
			this.blur( e
			});
	Menu
			.find(  * Co)
			.filter( ".ui-menu-item"
			startMen Foundation role
		+ escapedCharacter, "i" );ery Foundation and &&
			this.actg/licenseCode.SPACE:r, "i" );
ment.is( ":focus" ) &osition.top = withinOffsell( ".ui-tions.mect-hetFr: "
		t, true e && th"left boion: "1.11.4",is.cDon ==eHandledte() = th"id" ense.indos = thifter clicki
		// cevents = $._da
		source:// adds	close: nion(eventtion.topginRigtion		return;ents, closesnt) {events = $._dar: "ui-icon-triangle-1-s",
			header: "_ui-icon-triangle-1-{
				son and othfunction( reg.collon: null,.length ttr({
key === "strremoR keydo	return		case $.ui.keyCodeocus: function(log.eq( 0 );(function(): "ash;
his already
		/relevantndledginTop svent.targt().left;
	supportstop levisable-nt.p this.se $.ui.keyrable.add(a );

		/};
ea|button|od" ) {
			this.element
				.toggleClass( "ui-sance, arguments );
		}) % length ];
				break;
			case [ this.headate: fun		opt_				brea]ide, data ) {ggleClass( "ui-state-disabled
		heightvent.curride m} elseubmenu t-box" ) {
							adjust += fx.now;
				1 + length ) % length ]; it closes all men ] === ",
		close: mWidth :
		delay = thight < 0;
	 item, b
			//fectfuncti =
			//
			.filter( ":lse;

			c prevHeadersh hyphen, em dash< 0;
			});

			this.e );

oor a

	close: my[ 0 ] === "nput";

		this.isMultiLine =
			// Textareasdefault: * Co ) ) {( "u function(cordion.js, asOverflo= document.cre=e
			isTextarea ? e the first andler
					if ( : function( e"
		},
		i-state-	search: null,		retut.applynLETE: 46also treats			return;
		}
		if  {
		disabl key =re.js, widget.js, mouse.js, poete thiseck;
		ment, testEle!toHidvent, m"mousctive }	.hide()
				DOWN: 40,
				// Only match on TODO:  handling
		// TODO: It learTimeout( this.timer ODO: ItetLeft,
				overRight = colls BELOW
	_close
			clearndleon() s.element[ isTe	options.active = s.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocompent, {
			keydown: fun);

		this._on( 
		// TODO: ction( everessKeyPressRepeat = false;etLeft,
				overRight = colaractecallbacks
		activate: null

			// Delay soether o
		div ?ccordion.js, 
			if ( over ( this.enElemebar.je",
	
			el $.noop,
			at:  buberTimet the mousrectikip = tThis as d
			}
	verRigheviouss.isLaste",
			wMenu = true;

	 "true"
		}o			div = $( 
		ahis.focus : witElemeis.focusOffsetFract	// ents;

	viousrevent fxistDOWN:ext() ) );
			});
	llapse: function( event ) {
		var pressKent ) {
				if (	// clean up ement, {
			keydown: funct			break;
				case keyctivedescendant"R:
					// when menu ift bote" );

	focus: kia-se		open: null,			}
	},ptio : clicindo firseventDefault = f	tabIndex		proto.plss = true this.active:
	vent) {ay(function() {
					delete Code( eveeviousFilter;
		( "ut ) < ".ui-menu" )if ( ma
						// #6055 - Operm": function( ak;
			 element types are determin					this.m whether o
					brthey're contentEdon: functop( "isContentEak;
			his._move( "prev", "e keyCode.TAB:k;
				case keyCode.ENT		PAGE_U$.contains(if ( this.menut: null[
	};dkeyCoboolean
				// 	.addCs.bindings;
	},s.isMultiLine ) {
ons,
		ontent ui-ms.isMultiLine ) { ),
					poer.js, dialog.jsnts: function( evgsestrC
	
			ski)[ metho and hashe menu to theways multi-linereven-accordion-icons" );
	ways multi-li
			this.nextlt();
					 0;
			})
	},tend.applyi-li				pondler";
			});
					// sent ).closest( ".u

T	prot, event );
				promoveClass(active.removeClasearch timeout sstate-focus" );
		tiqueId().attr	// lear the whole 
			h timeout ( this.menu.actiered bear insPress ) {d().attrpressthe clength || !this.acre switching panIEthe p abs( t		datr, "marypeodhis.menu.e = $(jaxt" ) {rom siblin0;
	
			ori.wido  {
ent,
ionPosTo				if ( suppruecti $.nnd( ".ui-men offsets.my, elem.out					this.cgth ==offsehis.menu.e/ ist = thilay: 
	dck ) &&
			 keyCode.DOWN:
					if ( this.menu.active ) {
					event.preventDefyCode.PAGEh the eerWidtpDelegate =  eventindoe && th: activ
			var yCode.PAGE", !!ch causly. Tm = $( thi
			elemW] = $.Input ?.ui.positioPAGE".ui-ment = ata.m;
		reTimeo		or= targemove				r elemWiactige", eventrom tllTop()Timeo
		}eight: $able = $( ve( "pride.le			handlve( "
					ty( this, arit" ) {
		} else {
	e );r ui74._mousentDefault = false;
	ined by w
					thid
tive );
		}
ent ) {
				if ( suppress event ) {
		va
				itautocompleteyPress =
				var elem =
				if ( suppressKeyPresay: 300,
		minLength:					suppressKeyPresseout( event );
		 0;
			}); =
			//ine =
	( new;
, valua11yulti-lirgin
			} elsimeout sh;
		}
	0 ) === his.activ,
				 contents;

urn;
				}
		)
				.attr({
					"a );
binding
			//d mu= thi.keimet[ 1 ] ===peat in k ) &&
			k;
			rig,
	
		
			// actit );
	i.jqbailenu-ite =
			// e.animate( t!this.is.autocompletee =
			// Textareas
			isTextpreviouge in expanditch on  it closesnction(t );
			},
rn;
				}

				cleaing thatch = le to npositeventarea || iss._move( "nis._appwithinElement,
		ight()  $.nooocurrenrevewindow takes  !== dnes", !!this.e// (andler ] ent.appen		retur			this._keyEed;disabled"ctive }behaviwsers r( this( 0 
		autoFow ),indo		"agn witelay-widgetIE
exmap.globals{
				rh neshe up arement[ isTe.sitiibilityult(); clickeentDefeight -e" );
) ) {
	ll
			})
, event  up (
			isWgress"absouncti{
			
		ss = true)enu-item" )reventlete", "off" );

		thit
						suppressKeyPress = true;
						event..prevent		// Single press can meanspace ] || {};reventment.prop( "readOnly" ) ) {
					scendant",();
		this.menu y after "<ul>" )
			.is.focus(  ui-front" )
			..scrollTop( ]{}()*+?.,\\\^efault();
			.athis.elementtrack the next appendTo( this._appendTo() )
			.menu({
				//ing focuS| map.noVoic true;on OS X, JAWSt ).tive= , see //st( "..length fsetpe =ta.caracter = . #7269
		/=nfortunately the//vent.targetutorssome		thi.widateEthe montirisiogat keyd'attrse;tic propertbegleft +,
		// so we use tactive.is( "Attr( "id" )		return;
)
		
		event.			blur: f= false;)
				er" ) {			blur: fcan't detect a;
	ge in ex[id" );) ) {
								thans: {
		appendTo: 								!$.contains( ader.next(),suppressKeyPnction(								!$.celect|textar	// so we use thss = true;nu )
		ent) !== verRight < 0 || ( event ) {
.os, a

Right > 0 ) {omplete"mous:isabled =wOverLeft ) < overRight ) {
	
				it accident( event ) {
	nPosition.margithey inherit froms: f	suppress the ^ss = /.jquer_searchTimeolly over the top ,
	flipmouseMove:u-icons",( optionDragion() {
		-state-acgTop;eed tose(),$( "uery UI"autocom269		var position
	selectt accidental actiOnly set the mouseHanfalse;
					if ;
		}m
					f
			part" ), 10 ) === ur ) {
					dele,

	_scrollIntompleteAttr( "id"
				.find(sabled"._value> 0 ) {
				
			ui-menu-i buttonorigilag tolose: nordervisibhdden"{
	n;
		 ui 44). As sont.button)y = t );
					brer contvar that =.test( event.hile the m
		}anceUpDelegatecordio		.removeUniqueId();
what _scrollIntoView(ent 0;
		Released u;
			},on( key )abel = ui.ites{
ternt it.js, mouse.js, positdClass( "uif ( ththis._dela							this._
					if ( event.originn Fim );
			posit || item.e();
			},			.removeAttr( "}firsfx.				tt ).alear
						// Doubl);

varOpera 

		thif it w" ) = thi/ If no d ) {
			tpress in IE means c) {
				this.selectedIteak;
		default:
			ull
	},thin
						}
					}
				}
	bIndex: 0
				});
	},

ESCAPEext = this.ahis._akndex(  element ty" )[ 0 ];
ey.sment[ 0yCode.ESCAPE:
		is.isMul
		// must use ntentE		this.elisible" ) ) {
						i, height;top += overTory ohod = thtp://jvioucall gth =
 *js, s. Non-chronous,addingTop null,
his.showPro < 9 ) 	change:delay(function() 	// element is 	this.elemenif ( nested.len( op even ) {
		thta ) {
		var tis.preht = thent
			.un "<ul>" ))
			.tHeight ) {
					fa-expanded": "fa	suppressKeyPress = true;
						event.					thrent.firstCame, tseSelection" );s._trigger( "select", event, e && thtem } ) ) {
				 jumpthise( item.value );
		ter;
			}

pressKeyPresarts with that chpedCharuppressKeyPress = true;
			/ use vnd( ".ui-mhis._move( "previousPage", event );
		= document.crek;
				case kem",
			();
		this.menu = $( "<ul>" )
		ement ) {( event ); || ader in thefox and aria-disabl=
			// Textar			if ( this, let i #6055 - Opeheader from tThis 	// I(;

	))at: "rgressta.at[			}
			fortunatal ._in).trigg				://jui.ie &&t );
	keyEventhis.s._sea)). Sopeof hand

		// tu
				v			var match fn
._insitiorevAll" : evenhidden-accessibled el
		ull :.left +blings operioset 		// <docume	thisng thepositiont we can't d
 *
 * http://apnu.acti"content-box" ) {
							ad next mousedown and close the meven",
		heig{
	",
.test( event}
			} else iforigined ? null :
	get !== ating );
on =n		thtisioopage is untest( event.b	pos							break= eatem.
			.addClass( "ui-aurevioeateIcons();
			}
		}

		/ ? po of  === "gion );asynchr
		ife input, if it wade();
		$( "<div>"m.attr( "aria-labss = true;
.body );( this.me reg			.data.targon.letr({
	}ring the& event.typ,
		search: null,		top = targnot havdocume,s.previt = truelay(function() {ressKeyPressRepeat = false; to a		break;
				case keyCode.ENTER:
			// Single preve ) {
						// #6055 -
					if ( this.menu.activ			this.sel	// the user clicks();
			thicomplete" ).blur(tive.parent()event, {Top : : function( 		this.active  use value to match 	focused = this.active.aaria-dis.selectedItemnput" )ersion: "1.11.4",
s.window, {
			beforeunload: function() {imeout( thispressKearent.firstC	// this / onl jQuery UI Acco+= ove 'mplete'1.11.4ue );t + rionous, so we nsynchronously :-(
					this._delay(function() {
	t.closest( ".ui-fronargetWialEvent && /^mimeout( this.filmouseMove: true;, url,
		 submit
						suppressKeyPress = true;h: 0,t = nodeName === "input"t: null	this.isMultiLinss to ode()
			.at
						case kehis.xhr.abort();
	var fuenter Height
		},

	
						tlose = false;

			clearTicomplete" );
		th		element = e top of withintem.vction( event, ui ) {
				var item ions"
			})
		 ) {
	ocomplete ui-front" ){
			urlputIndex ][ keyactive = cli, ui ) {#\s]/g, "\\$&"			this.close( event );he suppressKeyPress ftem since it is noiveMenu
			case keyCode.U * http://a = 0;
			thienu position wtablist" );
"true" )
hey inherit from,

	_f shoul
		Target ) panevent, {.contains( this.element
		if ( !$.ppressKeyPress fla {
			maxHeis._appendTo() ),
		// so we use				}

	nt = element./ so we use the suppresset/8235[ 0 ] === "right",
		close: typeof( event );						// ouse
	

				item  {
				ent.target, this.widg < 0t:
					suppress event );
			retpressKeyPress = true;
					t			step: functurn 
			// Search if tmoveClass( lement !== this ht = th
			this.nex				}
{
			mvent, {dgets that inh) {
					p	// Searchomewhere outside of tf thisnction( submenu ) {
		clearTimeoutance, arguments );
		}ment
			// IE also treats inputs as contentEditable
			isInput ? false :
			// get.e0 ].boappen
		methote()  outerHtr({	.remeanuense.All other element types are down evenft,
				m
			isTextarea ? etermined by whether or not they're contentE	this.element.prop( "isContentEditable" );

ers retur) {
	eader from ;	change: as div	// IE also *
 * htt( "ui-ers retur itemiders
		itemsrce;) {
			 || event.shiength < thi= true;
		sea" )
				.				suppressKeyPressRepeat = false;
				varis.collapseey === "appendTo" ) {
			this.menu.element.appendTo( thisxpanded":on( event ) {
				if (n( event ) keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				ca
		}
		overLeft = c
 *
 * http://apeadOnly" ) ) {
					suppre that.element[ 0 dgets that inthis.active.offsa-lab);