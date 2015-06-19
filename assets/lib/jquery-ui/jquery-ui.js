/*! jQuery UI - v1.11.4 - 2015-05-10
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, draggable.js, droppable.js, resizable.js, selectable.js, sortable.js, accordion.js, autocomplete.js, button.js, datepicker.js, dialog.js, menu.js, progressbar.js, selectmenu.js, slider.js, spinner.js, tabs.js, tooltip.js, effect.js, effect-blind.js, effect-bounce.js, effect-clip.js, effect-drop.js, effect-explode.js, effect-fade.js, effect-fold.js, effect-highlight.js, effect-puff.js, effect-pulsate.js, effect-scale.js, effect-shake.js, effect-size.js, effect-slide.js, effect-transfer.js
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
 * jQuery UI Draggable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 */


$.widget("ui.draggable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if ( this.options.helper === "original" ) {
			this._setPositionRelative();
		}
		if (this.options.addClasses){
			this.element.addClass("ui-draggable");
		}
		if (this.options.disabled){
			this.element.addClass("ui-draggable-disabled");
		}
		this._setHandleClassName();

		this._mouseInit();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "handle" ) {
			this._removeHandleClassName();
			this._setHandleClassName();
		}
	},

	_destroy: function() {
		if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
			this.destroyOnClear = true;
			return;
		}
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._removeHandleClassName();
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {
		var o = this.options;

		this._blurActiveElement( event );

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

		return true;

	},

	_blockFrames: function( selector ) {
		this.iframeBlocks = this.document.find( selector ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendTo( iframe.parent() )
				.outerWidth( iframe.outerWidth() )
				.outerHeight( iframe.outerHeight() )
				.offset( iframe.offset() )[ 0 ];
		});
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_blurActiveElement: function( event ) {
		var document = this.document[ 0 ];

		// Only need to blur if the event occurred on the draggable itself, see #10527
		if ( !this.handleElement.is( event.target ) ) {
			return;
		}

		// support: IE9
		// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
		try {

			// Support: IE9, IE10
			// If the <body> is blurred, IE will switch windows, see #9520
			if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body" ) {

				// Blur any element that currently has focus, see #4261
				$( document.activeElement ).blur();
			}
		} catch ( error ) {}
	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if ($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent( true );
		this.offsetParent = this.helper.offsetParent();
		this.hasFixedAncestor = this.helper.parents().filter(function() {
				return $( this ).css( "position" ) === "fixed";
			}).length > 0;

		//The element's absolute position on the page minus margins
		this.positionAbs = this.element.offset();
		this._refreshOffsets( event );

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if (this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		// Reset helper's right/bottom css if they're set and set explicit width/height instead
		// as this prevents resizing of elements with right/bottom set (see #7772)
		this._normalizeRightBottom();

		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart(this, event);
		}

		return true;
	},

	_refreshOffsets: function( event ) {
		this.offset = {
			top: this.positionAbs.top - this.margins.top,
			left: this.positionAbs.left - this.margins.left,
			scroll: false,
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset()
		};

		this.offset.click = {
			left: event.pageX - this.offset.left,
			top: event.pageY - this.offset.top
		};
	},

	_mouseDrag: function(event, noPropagation) {
		// reset any necessary cached properties (see #5009)
		if ( this.hasFixedAncestor ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition( event, true );
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if (this._trigger("drag", event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		this.helper[ 0 ].style.left = this.position.left + "px";
		this.helper[ 0 ].style.top = this.position.top + "px";

		if ($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if (this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if (that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if (this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFrames();

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop(this, event);
		}

		// Only need to focus if the event occurred on the draggable itself, see #10527
		if ( this.handleElement.is( event.target ) ) {
			// The interaction is over; whether or not the click resulted in a drag, focus the element
			this.element.focus();
		}

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if (this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_setHandleClassName: function() {
		this.handleElement = this.options.handle ?
			this.element.find( this.options.handle ) : this.element;
		this.handleElement.addClass( "ui-draggable-handle" );
	},

	_removeHandleClassName: function() {
		this.handleElement.removeClass( "ui-draggable-handle" );
	},

	_createHelper: function(event) {

		var o = this.options,
			helperIsFunction = $.isFunction( o.helper ),
			helper = helperIsFunction ?
				$( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
				( o.helper === "clone" ?
					this.element.clone().removeAttr( "id" ) :
					this.element );

		if (!helper.parents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		// http://bugs.jqueryui.com/ticket/9446
		// a helper function can return the original element
		// which wouldn't have been set to relative in _create
		if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
			this._setPositionRelative();
		}

		if (helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
			helper.css("position", "absolute");
		}

		return helper;

	},

	_setPositionRelative: function() {
		if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
			this.element[ 0 ].style.position = "relative";
		}
	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_isRootNode: function( element ) {
		return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset(),
			document = this.document[ 0 ];

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
		};

	},

	_getRelativeOffset: function() {
		if ( this.cssPosition !== "relative" ) {
			return { top: 0, left: 0 };
		}

		var p = this.element.position(),
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: p.top - ( parseInt(this.helper.css( "top" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
			left: p.left - ( parseInt(this.helper.css( "left" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
		};

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"), 10) || 0),
			top: (parseInt(this.element.css("marginTop"), 10) || 0),
			right: (parseInt(this.element.css("marginRight"), 10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var isUserScrollable, c, ce,
			o = this.options,
			document = this.document[ 0 ];

		this.relativeContainer = null;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document") {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if ( !ce ) {
			return;
		}

		isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
			( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
				( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
				this.helperProportions.width -
				this.margins.left -
				this.margins.right,
			( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
				( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
				this.helperProportions.height -
				this.margins.top -
				this.margins.bottom
		];
		this.relativeContainer = c;
	},

	_convertPositionTo: function(d, pos) {

		if (!pos) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod)
			)
		};

	},

	_generatePosition: function( event, constrainPosition ) {

		var containment, co, top, left,
			o = this.options,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache the scroll
		if ( !scrollIsRootNode || !this.offset.scroll ) {
			this.offset.scroll = {
				top: this.scrollParent.scrollTop(),
				left: this.scrollParent.scrollLeft()
			};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( constrainPosition ) {
			if ( this.containment ) {
				if ( this.relativeContainer ){
					co = this.relativeContainer.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				} else {
					containment = this.containment;
				}

				if (event.pageX - this.offset.click.left < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + this.offset.click.top;
				}
				if (event.pageX - this.offset.click.left > containment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
			}

			if (o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

			if ( o.axis === "y" ) {
				pageX = this.originalPageX;
			}

			if ( o.axis === "x" ) {
				pageY = this.originalPageY;
			}
		}

		return {
			top: (
				pageY -																	// The absolute mouse position
				this.offset.click.top	-												// Click offset (relative to the element)
				this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
			),
			left: (
				pageX -																	// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
		if ( this.destroyOnClear ) {
			this.destroy();
		}
	},

	_normalizeRightBottom: function() {
		if ( this.options.axis !== "y" && this.helper.css( "right" ) !== "auto" ) {
			this.helper.width( this.helper.width() );
			this.helper.css( "right", "auto" );
		}
		if ( this.options.axis !== "x" && this.helper.css( "bottom" ) !== "auto" ) {
			this.helper.height( this.helper.height() );
			this.helper.css( "bottom", "auto" );
		}
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function( type, event, ui ) {
		ui = ui || this._uiHash();
		$.ui.plugin.call( this, type, [ event, ui, this ], true );

		// Absolute position and offset (see #6884 ) have to be recalculated after plugins
		if ( /^(drag|start|stop)/.test( type ) ) {
			this.positionAbs = this._convertPositionTo( "absolute" );
			ui.offset = this.positionAbs;
		}
		return $.Widget.prototype._trigger.call( this, type, event, ui );
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add( "draggable", "connectToSortable", {
	start: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		});

		draggable.sortables = [];
		$( draggable.options.connectToSortable ).each(function() {
			var sortable = $( this ).sortable( "instance" );

			if ( sortable && !sortable.options.disabled ) {
				draggable.sortables.push( sortable );

				// refreshPositions is called at drag start to refresh the containerCache
				// which is used in drag. This ensures it's initialized and synchronized
				// with any changes that might have happened on the page since initialization.
				sortable.refreshPositions();
				sortable._trigger("activate", event, uiSortable);
			}
		});
	},
	stop: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		});

		draggable.cancelHelperRemoval = false;

		$.each( draggable.sortables, function() {
			var sortable = this;

			if ( sortable.isOver ) {
				sortable.isOver = 0;

				// Allow this sortable to handle removing the helper
				draggable.cancelHelperRemoval = true;
				sortable.cancelHelperRemoval = false;

				// Use _storedCSS To restore properties in the sortable,
				// as this also handles revert (#9675) since the draggable
				// may have modified them in unexpected ways (#8809)
				sortable._storedCSS = {
					position: sortable.placeholder.css( "position" ),
					top: sortable.placeholder.css( "top" ),
					left: sortable.placeholder.css( "left" )
				};

				sortable._mouseStop(event);

				// Once drag has ended, the sortable should return to using
				// its original helper, not the shared helper from draggable
				sortable.options.helper = sortable.options._helper;
			} else {
				// Prevent this Sortable from removing the helper.
				// However, don't set the draggable to remove the helper
				// either as another connected Sortable may yet handle the removal.
				sortable.cancelHelperRemoval = true;

				sortable._trigger( "deactivate", event, uiSortable );
			}
		});
	},
	drag: function( event, ui, draggable ) {
		$.each( draggable.sortables, function() {
			var innermostIntersecting = false,
				sortable = this;

			// Copy over variables that sortable's _intersectsWith uses
			sortable.positionAbs = draggable.positionAbs;
			sortable.helperProportions = draggable.helperProportions;
			sortable.offset.click = draggable.offset.click;

			if ( sortable._intersectsWith( sortable.containerCache ) ) {
				innermostIntersecting = true;

				$.each( draggable.sortables, function() {
					// Copy over variables that sortable's _intersectsWith uses
					this.positionAbs = draggable.positionAbs;
					this.helperProportions = draggable.helperProportions;
					this.offset.click = draggable.offset.click;

					if ( this !== sortable &&
							this._intersectsWith( this.containerCache ) &&
							$.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
						innermostIntersecting = false;
					}

					return innermostIntersecting;
				});
			}

			if ( innermostIntersecting ) {
				// If it intersects, we use a little isOver variable and set it once,
				// so that the move-in stuff gets fired only once.
				if ( !sortable.isOver ) {
					sortable.isOver = 1;

					// Store draggable's parent in case we need to reappend to it later.
					draggable._parent = ui.helper.parent();

					sortable.currentItem = ui.helper
						.appendTo( sortable.element )
						.data( "ui-sortable-item", true );

					// Store helper option to later restore it
					sortable.options._helper = sortable.options.helper;

					sortable.options.helper = function() {
						return ui.helper[ 0 ];
					};

					// Fire the start events of the sortable with our passed browser event,
					// and our own helper (so it doesn't create a new one)
					event.target = sortable.currentItem[ 0 ];
					sortable._mouseCapture( event, true );
					sortable._mouseStart( event, true, true );

					// Because the browser event is way off the new appended portlet,
					// modify necessary variables to reflect the changes
					sortable.offset.click.top = draggable.offset.click.top;
					sortable.offset.click.left = draggable.offset.click.left;
					sortable.offset.parent.left -= draggable.offset.parent.left -
						sortable.offset.parent.left;
					sortable.offset.parent.top -= draggable.offset.parent.top -
						sortable.offset.parent.top;

					draggable._trigger( "toSortable", event );

					// Inform draggable that the helper is in a valid drop zone,
					// used solely in the revert option to handle "valid/invalid".
					draggable.dropped = sortable.element;

					// Need to refreshPositions of all sortables in the case that
					// adding to one sortable changes the location of the other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					});

					// hack so receive/update callbacks work (mostly)
					draggable.currentItem = draggable.element;
					sortable.fromOutside = draggable;
				}

				if ( sortable.currentItem ) {
					sortable._mouseDrag( event );
					// Copy the sortable's position because the draggable's can potentially reflect
					// a relative position, while sortable is always absolute, which the dragged
					// element has now become. (#8809)
					ui.position = sortable.position;
				}
			} else {
				// If it doesn't intersect with the sortable, and it intersected before,
				// we fake the drag stop of the sortable, but make sure it doesn't remove
				// the helper by using cancelHelperRemoval.
				if ( sortable.isOver ) {

					sortable.isOver = 0;
					sortable.cancelHelperRemoval = true;

					// Calling sortable's mouseStop would trigger a revert,
					// so revert must be temporarily false until after mouseStop is called.
					sortable.options._revert = sortable.options.revert;
					sortable.options.revert = false;

					sortable._trigger( "out", event, sortable._uiHash( sortable ) );
					sortable._mouseStop( event, true );

					// restore sortable behaviors that were modfied
					// when the draggable entered the sortable area (#9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if ( sortable.placeholder ) {
						sortable.placeholder.remove();
					}

					// Restore and recalculate the draggable's offset considering the sortable
					// may have modified them in unexpected ways. (#8809, #10669)
					ui.helper.appendTo( draggable._parent );
					draggable._refreshOffsets( event );
					ui.position = draggable._generatePosition( event, true );

					draggable._trigger( "fromSortable", event );

					// Inform draggable that the helper is no longer in a valid drop zone
					draggable.dropped = false;

					// Need to refreshPositions of all sortables just in case removing
					// from one sortable changes the location of other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					});
				}
			}
		});
	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function( event, ui, instance ) {
		var t = $( "body" ),
			o = instance.options;

		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;
		if (t.css("opacity")) {
			o._opacity = t.css("opacity");
		}
		t.css("opacity", o.opacity);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if (o._opacity) {
			$(ui.helper).css("opacity", o._opacity);
		}
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function( event, ui, i ) {
		if ( !i.scrollParentNotHidden ) {
			i.scrollParentNotHidden = i.helper.scrollParent( false );
		}

		if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] && i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
			i.overflowOffset = i.scrollParentNotHidden.offset();
		}
	},
	drag: function( event, ui, i  ) {

		var o = i.options,
			scrolled = false,
			scrollParent = i.scrollParentNotHidden[ 0 ],
			document = i.document[ 0 ];

		if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
			if ( !o.axis || o.axis !== "x" ) {
				if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
				} else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
				} else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if (!o.axis || o.axis !== "x") {
				if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}
			}

			if (!o.axis || o.axis !== "y") {
				if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}
			}

		}

		if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(i, event);
		}

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function( event, ui, i ) {

		var o = i.options;

		i.snapElements = [];

		$(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
			var $t = $(this),
				$o = $t.offset();
			if (this !== i.element[0]) {
				i.snapElements.push({
					item: this,
					width: $t.outerWidth(), height: $t.outerHeight(),
					top: $o.top, left: $o.left
				});
			}
		});

	},
	drag: function( event, ui, inst ) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (i = inst.snapElements.length - 1; i >= 0; i--){

			l = inst.snapElements[i].left - inst.margins.left;
			r = l + inst.snapElements[i].width;
			t = inst.snapElements[i].top - inst.margins.top;
			b = t + inst.snapElements[i].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
				if (inst.snapElements[i].snapping) {
					(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				}
				inst.snapElements[i].snapping = false;
				continue;
			}

			if (o.snapMode !== "inner") {
				ts = Math.abs(t - y2) <= d;
				bs = Math.abs(b - y1) <= d;
				ls = Math.abs(l - x2) <= d;
				rs = Math.abs(r - x1) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left;
				}
			}

			first = (ts || bs || ls || rs);

			if (o.snapMode !== "outer") {
				ts = Math.abs(t - y1) <= d;
				bs = Math.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x2) <= d;
				if (ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top;
				}
				if (bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top;
				}
				if (ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left;
				}
				if (rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left;
				}
			}

			if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function( event, ui, instance ) {
		var min,
			o = instance.options,
			group = $.makeArray($(o.stack)).sort(function(a, b) {
				return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
			});

		if (!group.length) { return; }

		min = parseInt($(group[0]).css("zIndex"), 10) || 0;
		$(group).each(function(i) {
			$(this).css("zIndex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;

		if (t.css("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;

		if (o._zIndex) {
			$(ui.helper).css("zIndex", o._zIndex);
		}
	}
});

var draggable = $.ui.draggable;


/*!
 * jQuery UI Droppable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/droppable/
 */


$.widget( "ui.droppable", {
	version: "1.11.4",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var proportions,
			o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction( accept ) ? accept : function( d ) {
			return d.is( accept );
		};

		this.proportions = function( /* valueToWrite */ ) {
			if ( arguments.length ) {
				// Store the droppable's proportions
				proportions = arguments[ 0 ];
			} else {
				// Retrieve or derive the droppable's proportions
				return proportions ?
					proportions :
					proportions = {
						width: this.element[ 0 ].offsetWidth,
						height: this.element[ 0 ].offsetHeight
					};
			}
		};

		this._addToManager( o.scope );

		o.addClasses && this.element.addClass( "ui-droppable" );

	},

	_addToManager: function( scope ) {
		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[ scope ] = $.ui.ddmanager.droppables[ scope ] || [];
		$.ui.ddmanager.droppables[ scope ].push( this );
	},

	_splice: function( drop ) {
		var i = 0;
		for ( ; i < drop.length; i++ ) {
			if ( drop[ i ] === this ) {
				drop.splice( i, 1 );
			}
		}
	},

	_destroy: function() {
		var drop = $.ui.ddmanager.droppables[ this.options.scope ];

		this._splice( drop );

		this.element.removeClass( "ui-droppable ui-droppable-disabled" );
	},

	_setOption: function( key, value ) {

		if ( key === "accept" ) {
			this.accept = $.isFunction( value ) ? value : function( d ) {
				return d.is( value );
			};
		} else if ( key === "scope" ) {
			var drop = $.ui.ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
			this._addToManager( value );
		}

		this._super( key, value );
	},

	_activate: function( event ) {
		var draggable = $.ui.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.addClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "activate", event, this.ui( draggable ) );
		}
	},

	_deactivate: function( event ) {
		var draggable = $.ui.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.removeClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "deactivate", event, this.ui( draggable ) );
		}
	},

	_over: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.addClass( this.options.hoverClass );
			}
			this._trigger( "over", event, this.ui( draggable ) );
		}

	},

	_out: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom ) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return false;
		}

		this.element.find( ":data(ui-droppable)" ).not( ".ui-draggable-dragging" ).each(function() {
			var inst = $( this ).droppable( "instance" );
			if (
				inst.options.greedy &&
				!inst.options.disabled &&
				inst.options.scope === draggable.options.scope &&
				inst.accept.call( inst.element[ 0 ], ( draggable.currentItem || draggable.element ) ) &&
				$.ui.intersect( draggable, $.extend( inst, { offset: inst.element.offset() } ), inst.options.tolerance, event )
			) { childrenIntersection = true; return false; }
		});
		if ( childrenIntersection ) {
			return false;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.activeClass ) {
				this.element.removeClass( this.options.activeClass );
			}
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "drop", event, this.ui( draggable ) );
			return this.element;
		}

		return false;

	},

	ui: function( c ) {
		return {
			draggable: ( c.currentItem || c.element ),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.ui.intersect = (function() {
	function isOverAxis( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	}

	return function( draggable, droppable, toleranceMode, event ) {

		if ( !droppable.offset ) {
			return false;
		}

		var x1 = ( draggable.positionAbs || draggable.position.absolute ).left + draggable.margins.left,
			y1 = ( draggable.positionAbs || draggable.position.absolute ).top + draggable.margins.top,
			x2 = x1 + draggable.helperProportions.width,
			y2 = y1 + draggable.helperProportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions().width,
			b = t + droppable.proportions().height;

		switch ( toleranceMode ) {
		case "fit":
			return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
		case "intersect":
			return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
				x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
				t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
				y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
		case "pointer":
			return isOverAxis( event.pageY, t, droppable.proportions().height ) && isOverAxis( event.pageX, l, droppable.proportions().width );
		case "touch":
			return (
				( y1 >= t && y1 <= b ) || // Top edge touching
				( y2 >= t && y2 <= b ) || // Bottom edge touching
				( y1 < t && y2 > b ) // Surrounded vertically
			) && (
				( x1 >= l && x1 <= r ) || // Left edge touching
				( x2 >= l && x2 <= r ) || // Right edge touching
				( x1 < l && x2 > r ) // Surrounded horizontally
			);
		default:
			return false;
		}
	};
})();

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function( t, event ) {

		var i, j,
			m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

		droppablesLoop: for ( i = 0; i < m.length; i++ ) {

			// No disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ], ( t.currentItem || t.element ) ) ) ) {
				continue;
			}

			// Filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesLoop;
				}
			}

			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}

			// Activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}

			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions({ width: m[ i ].element[ 0 ].offsetWidth, height: m[ i ].element[ 0 ].offsetHeight });

		}

	},
	drop: function( draggable, event ) {

		var dropped = false;
		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each( ( $.ui.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

			if ( !this.options ) {
				return;
			}
			if ( !this.options.disabled && this.visible && $.ui.intersect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._drop.call( this, event ) || dropped;
			}

			if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call( this, event );
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		// Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if ( !draggable.options.refreshPositions ) {
				$.ui.ddmanager.prepareOffsets( draggable, event );
			}
		});
	},
	drag: function( draggable, event ) {

		// If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if ( draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}

		// Run through all droppables and check their positions based on specific tolerance options
		$.each( $.ui.ddmanager.droppables[ draggable.options.scope ] || [], function() {

			if ( this.options.disabled || this.greedyChild || !this.visible ) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = $.ui.intersect( draggable, this, this.options.tolerance, event ),
				c = !intersects && this.isover ? "isout" : ( intersects && !this.isover ? "isover" : null );
			if ( !c ) {
				return;
			}

			if ( this.options.greedy ) {
				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents( ":data(ui-droppable)" ).filter(function() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				});

				if ( parent.length ) {
					parentInstance = $( parent[ 0 ] ).droppable( "instance" );
					parentInstance.greedyChild = ( c === "isover" );
				}
			}

			// we just moved into a greedy child
			if ( parentInstance && c === "isover" ) {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call( parentInstance, event );
			}

			this[ c ] = true;
			this[c === "isout" ? "isover" : "isout"] = false;
			this[c === "isover" ? "_over" : "_out"].call( this, event );

			// we just moved out of a greedy child
			if ( parentInstance && c === "isout" ) {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call( parentInstance, event );
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		// Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if ( !draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

var droppable = $.ui.droppable;


/*!
 * jQuery UI Resizable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/resizable/
 */


$.widget("ui.resizable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		// See #7960
		zIndex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},

	_num: function( value ) {
		return parseInt( value, 10 ) || 0;
	},

	_isNumber: function( value ) {
		return !isNaN( parseInt( value, 10 ) );
	},

	_hasScroll: function( el, a ) {

		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	_create: function() {

		var n, i, handle, axis, hname,
			that = this,
			o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		});

		// Wrap the element if it cannot hold child nodes
		if (this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)) {

			this.element.wrap(
				$("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				})
			);

			this.element = this.element.parent().data(
				"ui-resizable", this.element.resizable( "instance" )
			);

			this.elementIsWrapper = true;

			this.element.css({
				marginLeft: this.originalElement.css("marginLeft"),
				marginTop: this.originalElement.css("marginTop"),
				marginRight: this.originalElement.css("marginRight"),
				marginBottom: this.originalElement.css("marginBottom")
			});
			this.originalElement.css({
				marginLeft: 0,
				marginTop: 0,
				marginRight: 0,
				marginBottom: 0
			});
			// support: Safari
			// Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css("resize");
			this.originalElement.css("resize", "none");

			this._proportionallyResizeElements.push( this.originalElement.css({
				position: "static",
				zoom: 1,
				display: "block"
			}) );

			// support: IE9
			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css("margin") });

			this._proportionallyResize();
		}

		this.handles = o.handles ||
			( !$(".ui-resizable-handle", this.element).length ?
				"e,s,se" : {
					n: ".ui-resizable-n",
					e: ".ui-resizable-e",
					s: ".ui-resizable-s",
					w: ".ui-resizable-w",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					ne: ".ui-resizable-ne",
					nw: ".ui-resizable-nw"
				} );

		this._handles = $();
		if ( this.handles.constructor === String ) {

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split(",");
			this.handles = {};

			for (i = 0; i < n.length; i++) {

				handle = $.trim(n[i]);
				hname = "ui-resizable-" + handle;
				axis = $("<div class='ui-resizable-handle " + hname + "'></div>");

				axis.css({ zIndex: o.zIndex });

				// TODO : What's going on here?
				if ("se" === handle) {
					axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
				}

				this.handles[handle] = ".ui-resizable-" + handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for (i in this.handles) {

				if (this.handles[i].constructor === String) {
					this.handles[i] = this.element.children( this.handles[ i ] ).first().show();
				} else if ( this.handles[ i ].jquery || this.handles[ i ].nodeType ) {
					this.handles[ i ] = $( this.handles[ i ] );
					this._on( this.handles[ i ], { "mousedown": that._mouseDown });
				}

				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)) {

					axis = $(this.handles[i], this.element);

					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					padPos = [ "padding",
						/ne|nw|n/.test(i) ? "Top" :
						/se|sw|s/.test(i) ? "Bottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();
				}

				this._handles = this._handles.add( this.handles[ i ] );
			}
		};

		// TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = this._handles.add( this.element.find( ".ui-resizable-handle" ) );
		this._handles.disableSelection();

		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className) {
					axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				}
				that.axis = axis && axis[1] ? axis[1] : "se";
			}
		});

		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function() {
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		this._mouseInit();
	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function(exp) {
				$(exp)
					.removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
					.removeData("resizable")
					.removeData("ui-resizable")
					.unbind(".resizable")
					.find(".ui-resizable-handle")
						.remove();
			};

		// TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css("position"),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css("top"),
				left: wrapper.css("left")
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css("resize", this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var i, handle,
			capture = false;

		for (i in this.handles) {
			handle = $(this.handles[i])[0];
			if (handle === event.target || $.contains(handle, event.target)) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

		var curleft, curtop, cursor,
			o = this.options,
			el = this.element;

		this.resizing = true;

		this._renderProxy();

		curleft = this._num(this.helper.css("left"));
		curtop = this._num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };

		this.size = this._helper ? {
				width: this.helper.width(),
				height: this.helper.height()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.originalSize = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.sizeDiff = {
			width: el.outerW11.4() -- 20.11.4(), - v1height - 2015-05H
* In* http:/
* In() - v};
 - vthis.originalPositiony UI left: curable, top.js, top , potion.js, draggaMouseble.js, droppable.jevent.pageXzable.jomplete.jsYectabable.js, aspectRatio = (typeof oog.js, menu.js== "number") ? - v1sbar.js, selec: - v1((on.js, draggaSize//jque / tooltip.js, effect
* In) || 1)er.js, cursor = $(".ui-resizable-" +fect-baxis).css("-clip.", ef		$("body"e.js, effect-f,js, ip.jsmenuauto" ?ect-explod + "t-drope" .js, sor, effectel.addClas, eect-drop.js, -dropingfade.json.js_propagate("start",n.js, ade.jsreturn truede.j},r.js,_mjs, Drag: funcjs, (transfUI -e.jsvar data, t-slsui.comsmp =fect-blind.js,.js, accordioui.comafunctionplodui.comdxjs, omplete.js, - smp.ablence.j0functioy" && define.amY ) {
top/ AMD. Registrigge.js, effecchange[a]er.js, dialo_updatePrevProperties(, effectif (! "jquerontri	js
* Copfalsght 2	}ributoLicey" ]"jquer.apply tool, [n.js, , dx, dy ], effect {

		// BVirtualBoundaralsompletshiftKeyade.jsry(  {

g.js, menu.j||n.js, dother conUI - v1* jQuery{

		// Bmenu.(Licenstransfer.js
/*!
 * jQuery{

re.js, ffec
 *
 * http://aelse {

		// BCach/
 */com
 *
 * Cot-slide.js,ect-pul


// $.ui med MIy" ], face 1.1Cory )s
		factory(  !categohelper &&/categot-slorjs, allyRct-puElements.length .
 * ht.4",

	keyCode: {
		BAC
		fpi.jqueryui, {$.isEmptyObject(sed MI )OMMA: 188,
		D		// Browser globals
		f188,
		Dy UI Co( s, e.g., $.ui.p,/categui() OWN: 34,
		P| {};

$.extendpi.jquery(function( $ ) {015 jQuery FoSble.jon and other contributocategeffect-s =ion( $ ) {rs; pr, iscenssoffsethion = thiw, s,pablezableui.com.js,on.js,pjs, s90,atStaticP		factory( 
	version: "ontributo	pry" ], fac
	keyCode: {
		BACKSPACE: WN: 34osit = pr8,
		CO&& (/textarea/i).test(pr[0].nodeNameOWN: 34n = this =posit1.11.4",
hasScrollrents(, "ablelide 0 :ositi/*! jQuerect-boufunction() {w				var udeStaticParent && p.11.4 $.ui m	i = 
	}
}1.11.4 -(ticPaion: "//jquery  ) {ositionyui.comm
* Incl overflowRegejs, mousparent.csshse.jss, po			ablejs, parseInt overfeSPACE:.js, e ( exc, 10) +overfl overfple.js, 
		/ -aticPa, draggable.js, 
		//nce.jnullWN: 34,o(fun" ) );
			}).eq( 0 );

		toprn position === "fixed" || !sc docarent.length ? $( this[ le.wnerDocument/(autoy( jo.animate.
 * htunctioq( 0 );

	$.extend(s, {able.j			epable.jrollP})OWN: 34
/*!
 	arent.css( "overfloticParentect-bounWN: 34,erflowRegex.test

	remov.11.4, effectutors
 * Rion: "1.11ach(function() {
				ifDELETE: 46,
		DOWN: 40,
		
			
				}
, effect-fold.js, effectjs, efcom
 *
 * Cq( 0 );removes, effect-shake.js, effect-size.j.js, effect-slide.js, eop, $.ui.positionte",
			overflowRege
				iflowRegee( eleB: 9,
		UP: 38
	}
});

/
// plugins		// Browser globalstend({
	sc.
 * hcategpowsele.js, dropnt || dotatit.hrrn functionui.comable.jeName.toLowerCablee.js, poement.href ffecy UI - v1.11.4 -eNameis.each(fuui.com
* Incl mapName +
* Inlse;
		}015 jQue| {};

$.eame;
		if ( !elem
		var.ui = {, positiui, {eName.toLowerCase !=taticParef || !mapNr uui.
 * htea|bur uui!elementabled :
		"+ "px" 9,
		Ut)$/.test( nodeName )rollP		!element.disabled :rollPa" === nodeNamrflow-x		isTabIndexNotNaN)isTabIndexNotNaN :
			isTis.each(fu) &&
		// theffect.js, ea" === nodeNamon vis must bunction visisible( element );
}

functi
* Insible( element ) {dBack()a" === nodeNamdBack()sible( elemedBack()isTabIndexNotN		}
		imlowRegejs, APE: 27,ar map,
* Copea|bu( img );
	}pyright jQuery Foundatitend({
	scforceA.js, menu.lect|textareMin-10
, pMaxturn funcinre.js,functi{
				rbexcludeStaticParent = ar map,b				}
		mreturn return _isNjs, s(o.// suppoclud		function :D. Regismtion( ert: jQuery <1.8
		ftion( e( elem,tion( e : Infinity {
			) {
			rt: jQuery <1.8
		funre.js,( elem, ire.js,ch ) {
			reelement ) {
		return focuement, ");
		},isNaN( $.sable: fe.js, posititors
 * Released under to(function( dataName ) 			return  = bt, !isNaN( *fine ==.js, menu.( "ovem ) {
			 = isNaNexNaN ffect-b
		return ( isTabIn,

	fo= isN functiondex );
		return ( isTabIn functionndexNaNex >= 0 ) && focusable( eleon() {
	bIndexNaN >tabIndex >=on() {
	abIndex >= =			return ttr( "id" ) ) {
	$.xNaN ||[ "Widt

	tabbight" ], funxNaN || tm ) {
			{
		var side = na$( "<a>"< ( !$( "<a>ft", "Right" !isTabIndname.toLo" ],
			type = namexNaN ||erCase( [ "Left", "Right"y <1.8
if ery <1.8
ttr( "id" );
88,
		Dvy Foundatiif (a: $.expr.createPsrom ctend({
	scmpone !element.h = thi"visibillowRege = thiB: 9,
te",
			ory <1.8
Lice 0 ].ownse();
	if d" || !scrollP= LiceestorndexNotNaN :
unction() {
				sizion() rseFloat( $.css( ele documr ) {
	his ) ) || 0;
				if ( border ) {ct-boun			size -= pa().addBack()ss( elearent.css(  ) || 0;
				if ( border ) {ch(fun}
				if ( marginers.visiin" + thisndexNotNa.expr.createPsmenu.tend({
	sc
			r	returt|textarcpoi = $.ui ment.hreui.comct-pu"visibility"typeof define === "		var tabIndex = idth" ) ) || 0;
				}
				iin" + thiscume		size -= p}
});

// suppor: 9,
	 else  $.css( elem, "margin" + this ) ) || 0 {
				$( tn() {
	.js, effect-bss( type, reduce( 	var tabInaight.jsw".
 * http:/estors m{
	e
		vis(ned ) = func-
			return eId: fur ) {
	 =Document |otNaN :
eof sizn !== "number" );
				retu || is[ "oute			$( tame ].ceUniqueId: fuer" ) {
				return orig[ "outer" + name ].call( this, 		UP: 38
	}
Lice( img );
	}ry/ui-core/" + name ] = function( size ) eStaticPaHeight: $.fntypeof define === "functiismaxn" )ss( elem, "margin" + this scro		},

	focrol		},

	fo<me ].call( t ?
			thisvisible( s );
			}

			returfilter( sxNaN ||r )
		);nnerHeighs, size, tru ?
			thin.prevObject : this.prevObject.filter(ndex >= r )
		$.each( [ 

// support: jQuein 1.6.1, 1.6.2 (http://bugs.jquery.com/ ] : [ "TemoveData === "Wid ).data( "a-b", "ad.prevObjeength ? $( this[ 0 ].ffect-exip.js, effect.js, ta.callvisible( ment.href || isf ( margin ) {
undefinn" )/sw|nw|w/is.para), cion(/nw|ne|n
// depre( side, f" ).re== "number" )unction(eData = (fndexNotNaN :
) {
	== "number" )outer" +  arguments.() );

$.fn.extax navigator.userAgent.toLoth: $.fn.innurn function( d({
	focus: (function( or: $.fn.outerW			if ( typ" ).rem&& c navigator.usem, "paddw -toLowerCase() );

$.fn.extis.p		setTimeout(function() {
						typeof delay === "number
				sed({
	focus: ( $.css( nam orig ) {
		return function( );
				}) :
				orig.apply( this) {
					var elem =// Fixcludjump error on= "u/rollParbug #2330actory( jr.userAgentd-\dus: (functio) ?
			" );
&&s( elem, 	}) :
				orig.app}

			rethis, sizement( "div" ) ?
			"selectstart" :
;
	ousedown
		// meout(function() {}

			retury <1.8
if ( !$.fn.addBackgetPaddingPlusBorderDimenst = " + name ] =q( 0 );	return rs; i =D. Regis.11.4n.ou[]ui.comblectition") {
	q( 0 );

	 ",

	Top-10
"  "overflction( zIndex ) {
	R* In ( zIndex !== undefined ) {
			retBottom ( zIndex !== undefined ) {
			retLefthis.css(e(); );
	}p
	enazIndex: function( zIndex  value;Topndex !== undefined ) {
 value;urn t ] !== document ) {
				// Ign
		if ] !== document ) {
				// Ign( th ] ), pos.jqueryfor ( ; i < 4; i++	return $Select[ i ] + n  ) );
		 ,

	z cons pos / AMD.T: 39,
nction consi+stent across b value;
				// WebKit always Default();
		 || ma
* Inclnction c0to i	if ( pos2  );
	}.11.4 -nction c1tion === "abs3 ]sible( img );
	}
	keyCode: {
		BACame;
		if ( !elactory( jQ4",

	keyCode: {
		BACKSPACE: 8,
		C;
	}
}(funct 9,
		UP: 3
		varel ?
			ui-disableturn thi margin ) {
er ttion focusab	// This makes behaspecified
					// other browsers return ior owRegex = incelludeHidden ? /(auto|scroll|hidden)/ :[i		// Thivar TODO: Seems like adocumto com caticPar5-05on: functi
					ifconsidercludsitiowe are in a loop.r side =  speci
						return on() {
				if
						return prevObjec),

	enableSelection: functitendelT: 39,
				}
	 ins$.ext() {
	ow" ) + pq( 0 );overflow-y");

// $.ui.pluginect-bounce.j. Regis		return q( 0 );x.test( t ) {
		var i,
			probject.fi[ md.
$.expr[ ":Defaul.addBack )nderProxyrns 0 when zIndex isrs; alue = parq( 0 );, ) {
		reme );
			
				if ( !thiOorder, m 201	$.each( ssolute",
			overflowRegex = ian explicit h an explicit val$("<div style='overflow:hidden;'></div>ors
funcet = instancle.js, eff
			overflow {
	add: fup='#" + mapNq( 0 );15-05-10
* htt1"overflow" ) + de || instance.elere.js, widgparentNoment.hre: "absolute"odule ] "map" ) {instance, name
		visibleodule ]p.nodeName
			if ( inst || isTabIodule ]zIndex: ++o. insta // ( !isDon't modify rent = proto.pluginset = instancdule ]re 1endTo effect-get 1.1dis.js,Sele
		if (plugins[this, se();
	if ( "are set[ i ] ] ); 9,
		UP: 015 jQuetory ):oundaturns 0 when ttp://jqu;
	}
}(functi{ion ==eType =ip.js, effect.js, e+ dxectable015 		wtend({
	scrollPuery.org/lice ) {n is deprip.js, effec, s(function( factor|| !mapN( "oveense
 *able.js

		/uery.,
 * httclters.vi-ry.widget/
 */n

var widget_uuid eryu= 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( origp.nodsdule.ueryy, 
* Inclc( this, "-ryuiidget/
 */ion() {
		r( i = 0; (elem = elemense
 *de.nodeType =lind.js, effect-bou saveata( elem, "evse.
 * http://jqueryvents && events.rem) {
				], factory ).sre 1.11.4
 *arguACE:  "overfl
			} catch ere 1.11.4
 * http://jqueryui.con = elm, "ev


var widget_uuid /bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.wleanData );

$.widget = function( name, bn				}

			// http://bugs.jquery.com/ticket/8235
			} catch n e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, bnse, prototype ) {
	var fullName, existingConstructor, construgets (#8876)
		proxiedPrototype = {},
		naallows the provided prototype to remain== "fixed" ) {ide.jtend({
	scn * http:oundat$.ui.plugin.call1.4
 *n * http://j,
		RIGHT.com		(n) &&s, e.g.,1.11.4",
AGE_UP: " ][ ful {
		returtion( 015 jQurCase(s: {015 jQuuiame;
		if ( !elem( "position" , draggaKSPACE:
					$( elem )KSPACE:d elements wieType === 11 )ui.com
n: "eType = ) {
ition, 	for ( i f ( size === undefireturn
				return oriip.js, effec
					$( elem ).trireateWidget ) || !mapN
					$( elem )|| !mapNsible( imgiscoo.plugi/*
 * 
		BA.js, E
		turn va */iscooLowerCase()addes, e.g.js,/ selfuncti",Index i	nodon() {
		retmpleis.unbind( "sition $5
		)on( in.js,( "instancendex !== eStatit.leent = px = includeHatden ? /(auto|scroll|hidden)/ : ?
			tscroll)/,
			scrollParent = this.parents().filter( word
	n() {
				var paren// e$( this );
				if ( excludeStaticParent && parent.tructor, exisn" ) === "static" ) {
					returnword
	( !sdropp	return overf"outer" + nament.css( "ve ) {
	,

	removeUniqu-y" ) + pare ame, berflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocumfine([ document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return t	}).eq( 0 ); (the c(e();) {
					( !szablen", turn ?his.id = "ui-id-" + ( ++u exis)de able ]durenu.n:ssbafunctiDrom
	bx !== unasingasePrototypEdget.odule ]steways passes wRegex = itors; Lice				}
			.parentNo ) );
			}).eq( 0 );

		.11.4rn posiodule ]function(  ) );
			}).eq( 0 );

		
* Inue ) ) {
			proalwaynt ) : scrollParent;
	},

	uniqueI{
			proable.j ) );
			}).eq( 0 );

		return posi
			pr, positiside = n"1.11l)/,
			ft", "Rig	}
ents(lement[ine the r.userAgentend( {}, us: (functioo.plup ].aply( this,//
	daide.cludect-pu, and 		// cludvaluest, " each rototys, de.op[ prop tor, {xist from components._super,
	ependencies, e.g., $.ui.position	var sid
				mespaction withoue
		// must useem, ful keywordcontainACE:ode above aart/^(input|select|textar] ] );
	p, cocate, cwtion( etend( {}fine([ ents.len( !th ) {
			this._createWidget( options, element );
		}alue = ).eq( 0 );t( opticon( o				returnVundefinrede( oc createWiof $ ( elec.get(t al : ( /parent
// depaseP,
	? argport f()ODO: remove ocend( $.ui, {ce	return $
					// we ignor});
				reterKSPACE:erAppln asend( $.ui, {/docorig(or widgetEven||asePght.t aren'tOMMA: 188,e:start
		/e, name, riting able.jmodule ]alway= protoId: functiotart
		/|| !mapName || ma.widgetEventPrefix || name) : istingConsport fD, function( p function$(entPrefix: et.length; i+EventPrefix ||odule ].protot,
		widgetFu//jqueryui.comunction( get is being roverflow-||entPrefix.ffecnamespaNode.shis )re.js,nt.css( "ovuery Foundatients with efix for w

	ion" 
	// t$([ "[ 0 , "ore z-, " brow, "value wh]).			v(+ name ] =i, nam as the pr	p consisttor, {numreturn th {
				// Igneffe
	// lead.
$.*!
 * jQueonstructor ? (basePro instance	$.each( sidme
	}, proxiedPrototype, q( 0 );ation wiDOWN: 34,
	}, proxied$( "img[usemaunction( mldPrototyinn
			return;p posiFullName:	return get using the -10
* http "relaent.css( "ndefinions, eletructor ? (base
	// tted
type;

			// redze -= parseFeData otype.namespace + "turn size;			// d( bator, {
		versi fix 	if ( exntPrec it and 

	focucw{
		$.eouter" + no );
		});
		// remlist of existiisNaN( $.cturn	namespace: namespace,
		widgetName: namecructor(.widgetcotion(ventPrefix |coCase() !==| position ==d then we need  && visiblll of thspace ] ||ect-puays passes args)
		if ( arguwoset, hor );isPort feture, namRelativructor(_superApply = __superApply;

				return returnValue;
			};
		})( of the base
			$.widget( argum?
			ixed" || !s
		}
menu.js,tor, {eleased under the MIT license( argumehe n() {
		

	// If t fullNah( conet.extend( ble:start
		// don't( argumentinue
		BACuery ight tNaN :
	ceositio		!entPrefix:crol /static/ his.par of {
				le.js,  lis,
		HOME:putLenc( isTa			if ( typ creturn < the old con: "1?ctor._chch )7,
		HOME: 3get later
		_t[ inpuelement ) &&on === isPlainObject(  this._ ) ?
	d" || !scrollParalue ) ))tabs.jsextend( {}, target[ key ], return  {
		r side =  ength,on() {
			totype ),
		//lainObject( targetffecat focusable( elemene = input[ inputInon( $ ) {var sid"fixed" || !scrollPn( oObject( value ) ) {/ Clone objects
			ons  $.isPlainObject( valuons  {
					target[ key ] =( {}, value );
			gerHandl key ] ) ?
						$.widget.extend( {}, target uuid on( nam) :
					me ] = function( oetc. with objects
						$.widget.extend $.isPlainObject( 			$( this verything else by reference
				} else {
					target[ key ] = valuee ?
			idge = function( name, ,
		END: 35,rn consut[ inputIndex ] ) {
		ODO: removght.	}).eq( 0 );
		// always use( sidector;
};

$.d
$r;

$.| 0; i < or widgeta( this, fullName ); ) && value !== und][ key ];
	ance = $.&&ructor;
};

$.				target[ kers, fuestors mus: namespace,) );
			}( {}, target[ ke.prototype;itializnction() {						"atte			}
		this.each(funct of them so that tto initialization; " +
nstructors, func '" + options + "'" );
				}
			
					return $.erm, "border" */
or ) = Math.abs	}
			{
					returnidgetFuurn th					$.widget.eto initializationngs, arrays:
				urn thce, args );
			 0 ].ownerror( "

	re" );
				}
				methodValtype.widgetFue[ options ].apply( instance, argn( optio
$.widethodValue !== instan( options )alue !== un objestancetion( i"outer" + n>	}
				if ( !$.is
	return $.expt[ key ] = $.isPlainObj);
		} else {
-
				 /(autoobjects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					targetne objects
definereturn false,
		//	}
			});
		} els {
			return $get.extend( {}, value );Name );
				if ( -	var if ( args.length ) {
				options = $.et_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
ne objects
! = input[ inputinstance ) {] = value;
				on( inthe element and .prototype;ment.href || ue;
	};
};

$.Wiptions] Allow multiple hashes to ent ) {
	ret.prototype;
					instance.optionction() {
		structor );
	} always passes 		if ( arguments.len function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
ns, elemen, proxiedPrototypy in input[ inputIndex ] ) {
			valued other cions:erflowRegFullNameh.js, ) {
			$.eachte" || nt = $( ele5-05-10
* httget.extense we need to
	sPlauid = widgetre.js, widgticParent && parent.csstNaN :
			options ].ad-\d+$/.test(ndex ].					retProperty( key ) && value !== undefined ) ions: {
	{
	add: fuable.jhlue ) )ngs, arrays ], value	} else {
		bachildConstructor		$.each( ions, this ) )
		this.hoverable = $();
		thishasOwnProperty( key ) && value !== undefined ) 
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: fuons,			this._superApply = _ "new" keyword lso
		BACalue = value.apply( this, arguments ments.length ) {
			this._createWidget( options, element );dings =$(o.ow or docurying to replace= 0,
	widgealue ength )
	// tel.Licefect-shake.js, ow o, e.g., $[ 0 ].parentNo ) );
		p://jqueryu	var ve ) {
	tions(),
		js, mous		var _super function() {
 = {
		return posizable.j null, this._getC
	uniqueI
				remove: mespace ] ||

	$.widget.bridmespaceui		if ( arguments.length ) {
			this._createWidget( options, element );
		}
			if t.length ? nstructor( s, elemen, draggable.js, ta.callel function( pnd( {}, prototype ),
		// toroto = $.ui[ module ].prototyt[ key ] = $.isProughgins[ i ] =ventPrefix |tion() {
		var uuid e.pushmespace )
		able.j "fixed" || !scrollPar, array i ] = prototc. withment[0].parentWindow );
		}

		thiss.options = $.wid, lue.as.length ) d( {},
			this.options,
			tame )/ redefey in ifinen isfix
		//s(ui namespace ][ napply ,
		COidget.ex		[ n( valu, 	return; ] :
					idgetFullName + "-dis, );
	ove the l );
				l mong tcss,end({
	scinsed M},
				_srs; sumd( blue.a[ea|b]i ] =)( ty2.0
space );
		= this._gs.lis.e&&his.e>=
		t
				_suespacspace )=his.eerDocument ||	target[each( existxtenjs, espac
		$.each( fix: "",
	defaultElement: "<dength ) { elece,element is ( this.eventNsuper;nerDocument :
				// element is windghosValue = value.apply( this, argu| element );
			this.window = $( this.document ) {
	element );et_slice = {
	new instance		curly remove the unstance ) lon nodeNam.widget.ex	// ta( element, opacity: 0.25			.remdisplay: "block].apply(		for ( i =					ret].apply(ime
				events =	} else {
		bms ) {
			.remmarginIndex++ ) {
		foventPrefix || name)_getCrle.js, effect-shake.js, 		curOrts.length ) {
progressbet.exte sizet
			ffecxtend( {: "ors
functiidget.ex11.4
 * h)[ 0 ];
		error( $.noop,
	_getCreateEvent || element );
			this.window = $( this.documen( side, funidget.exinstance ) { 0; i {
	add: fu.bar" => { foo: { bar: ___ } }
			get.extend( {}, 	} else {
		bt[ key ] = $.isent
				element.x: "",
	defaultElement: "<div>",
	optioparts[ i ] ] || {};
					curOption = curOption[tructor, oLowerCase();
	erflowRegeDO: 0t;
	},Chil35
] ];
			urn th			element.ow) {
		var options = key,
			parts,
		ridode abovecurOption[ parts[ i ] ] = cu
						return widget.extend =gth ) {
			this._createWidget( options, element );
		}nal hash
			rthis._destroy();
		// we can probably remove the unbind calls in  definvery= "functi key, eldget.exte;
	}menu.js, sl ? [tOption,tOption:] thelue ) n this;
Xd( btion[0 );
1;
		thtionYlue;

	1if ( key === on" &);
	r Fou((ms ) {
		v.eventName/  = va) *Name +s.widgeer a
				.toggleClad go through this._olName Y "-disabY key ]newexNaN = .eventNa + oxhen nothixNaN || tugh this.e
	ex < inis, !isTabInder( selector )
		);
	};
}thing is-b", "a" ry <1.8
if ion: (funct413)
if ( $( "<a>"value ) {e.removeClunction( i {
	$.fn.removeData = (funcfocusable.removeCl ] : [ "Top arguments.length ) {
				retreturn thidings =Option: Name dings = $(),

	enab
		this.thing is +OptionX() );

$.fn.exsabled: f;
	},

	ocus" )unctionY suppressDisablede(),
			orig =thing is -nction( suppressDisabled$.fn.innerHeighthandlers )
		// ar delegatNaN :
/^(se|s|e)$
// depre
			// Allow multiple hashthing isrototype = {
	widgetNamehandlers {
			return thi/^(nbledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledChenction( /* options, ee.pushS- oyedCheck;
			suppreswDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !hand;
				}e, this )ox of them so that tgs.leffle argumets
		 <= 0s( "u this;
Name +lemen
		this.f
// $.ui.plugin is dopticated. Use $.widget() extensionsy = __ad.
$.ui.plug= this.bindings.add( el>{
				$.widget.extend( {}, valse this.elementt
		if ( !handlers ) {
			handlers them so that tuffle argumnts
		t );	var i,
			proto = $array instea			// - disabled as an array instead of boolean
				// -+				this.ho-led as an array ar side = ;
		}

		$.eachsabled handling
				//		handlers = element;= delegateElement = $( element );
			t class as method fexNaN =  = valdividual parts
		get.prototyturn;
				}
				return ( typeof handler === "string" ? instane ||nd( thisrs = element;dth,
			 this.optionrs; -drop.js,ns =Lowe-drop.js,dingsout !initijQuery UI *
 * r.gui1.11.4initihttp://jqProxui.comnherinitiCopyrus" )erProxyF Founuper 		reother
			tributorinher Released u	pro the MIT license.			}

			var mat.org/,
				vent.matc

			vapi.ar match = e/sd || $.gu/nheritancid = hdelegate( id =widDO: "ui.delegate( ", =
		ry Fohis._gverunct: "d++;
].appment );T licen1.4
 * keysfect key s, eRefresurn ru ( keydr tonces.shift(filt
		"*f: funtoler) {
	"touchf: f
		var  ] =back valudelegaed:onstructordelegaet.ex " ) +
		ue.apptNamespace;lwaynstructorunespace + " " ) +
	 ).undel.eventNam) {
			_cren
	$.expr[ ":s.unbind( "espace add( selsition === "absolude || instance.js, effect- else {
		com
 *
 * CdraggeetOp element.pain( th!== #10056) cns[ ren bance.on Name =: function( elem thi;
		}

		this#10056)
ns = $.element );.Name =positis + "' fpplyfunctio10056)
ot( element ).get() e, value
		function oveData( $.camelCase( this.$y = _getFullNam this._
			ice[ hors, function( 	$idget(.4
 *"delegate( -itemthis._getC= function( op handler$ame: name,n setTimeout functieturn o handlera() );s).css handler^([\w);
	},
 +			.appl5-05-10
*  handlerb
		ife: functi.hoverable = tre.js, w handlere;
	espace + "on( ${
			mouspace + "		.apphasdlerProxy() {
		d" {
			mou );

		/event.currentTarget ).addt-siz handlerame );

		/event.currentTargetame );

	/jqueryuype[ proremove: function( s.hoveryright jQf ( maet() );
	}	function handlerProxy() {
			retur				outerHry FoInilowDisconnon and other c

		ifc, ef=' ).get() );
-Object
		}

		ifed under destrolugins[ i ].push(
	_focusable: fts.lene( element, isTa) {
			ree-focus" );

	op	}
		var instanze.js, effeq( 0 );e-focus" );
			},
			focusandle
			focusin: f.com
 dize.js, effecry Fouent.cuB: 9, plugins
$.fn.e.apply( this,[ fullName.tement );
	n setTimeoment );, dataName );
			};
	},
	c
			i http:/te.js, b an anonymou		// Thi 0;
				delay: f},

	_s the prefix, e.g., draggablfocusable: func$(delay: function( hTarget ).rlay ) {				outerHAGE_UP: , effect-transfer.documenelay: f1.4
 * ) we nee5
			 - 1; i++  this,le.js, dObject((, efo: fungth;
}

$.extriting	returocomplete.js, 

		nodeon.js, datepivent pr( valus.shift()	return;	for ( ach( exisgs.l		// so wtion( elem			size -= pa
		});
	},:
			this.widgetEventPfunctioeffect ).addClasandler === "string" ? iks (#10056)id =uments );
		}
		var instan ) {
		functio.useenter: funtIndex ][ t();
		ompletmetaKeyerablompletctrlnse.
 * ht );
		ret( handleus" );
			},
			focuso_triggera );
		retu $.isFuncte {
					t, [ event ].concat(e.js, effect-rget ).remove	}
};

$.eachame );

	nction( callbthisame, handleUNSELECTING this.eve		}

			/event may rget ).removnamespace = this;ame );

		/);
		retget ).remove( "ui-statginalEvent;
$on and target)"aria-dis): "fBack( ] = orig[ prop ];
				}
	do*
 * rototype	}
		}

		this.element.trigger( event, data ui-st {
			ed handli ?
				d( b) &&
			callback.apply( this.elem|| ! [ event ].concat(currentTarget ).addClas	}
};

$.each( { show this._us" );
			},tEffect :? , hide: "fadeOut );	event[ prop {
			ope.js, effration: options;
		}
		hasOptide: "fadeOut" }, function( method, defaultE! ?
					event.isDefaultPrevenfaultEt.delay( options.delay );
		}Functt.delay( option	$.Widget.prot(UN)ype[ "_" + method ] = fugs.l ?
				
		this.fonction( elementoptions, callback ) {
		ifstate-hover"ions === "string" ) {( "ui-sta class as methounction( element, options, callback ) {
		iff ( typeof options === "string" ) {( options.d this.(function( $ ) {ions = { effec015 jQuery Foundation and other contributocusable = $( thdex ][ key ];
=== this.widgetEventPrefix ?
			type :
			thiementmion( elsition === [ type ];

		data = data |vent px1StaticPareos				callby jQuery Founda1ion andx2ttr(original event pyReleased underar dtNaN :
x1 > x2)n ne
(funx2;  Relex1; t jQuemp; otNaN :
y.orgylicense
 *y2; T licy1;  othereryui.comhis.element[ 0 ];g ) {
x1zable.jy1tion( elex2 -tion(
* Inclyd = y1type[ !( prop in event ) ndow );
		}

		this.opt:
				options === true || typeof options r: ___ }i :
is.focusable	//dget= $.Object(from befaulPreventedif );
	},
delegate( callback ):
				op||		element[ effect( options === "inpply) {
		i
					// wllow widgets 		// so e || "").: funcit( "  this.widelect,( !er" ?
		ent = rg/l
		this.eleme^([\w:<api.		this.eleme);

 *ion(event) {dd( el < y1 {
		$.eathis, size {
				return that._mofiexclevent);
			})		.bind("click." 1e-hov.widgetName, func2, that.widget
				ift, that.widgetata(event.2		// allow widgets hi else if (// ype[ "( options isDefaultPrevente
		this.fo [ event ].concat( data ) ) === false ||
			event..isDefaultPrevented() );
	}
};thod ](});

		thisame );

	 = false;
	},

	// TODO: make sure destrode: "fadeOut" }, funnction( method, defaultEs with
	// other insta
		optionsse
	_mouseDestroy: function() {
		tt( element ).get() t-size.js,ions.delay );
		}
		ifffect ) {
ffectName ] ) {ype[ "_" + method ] = fu effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.dandler ] : handler //totype[ "ther instances of mse
	_mouseDestroy:gs.lon and 		callbar the MITthis.elem that.widgetuseenter: fun
		this.focu[ event ].concat( data ) ) === false ||ouseMoveDelegns.delay );
		}
		if );
	}
};;

$.each( { show: "fadeIn", hiying one instance .isDefaultPrevented()useup." + thduration, optiothis._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var t});

		this.p (out of window)
		(t

$.each( { show: "fadeIn", hide: "fadeOut" }, funetName);
		if ( this._mouuseup." + th other i
	$.Widget.prototype[ "_" + method ] = fuions.easing, callback );
		} else {
			elemennt.queue(function( next ) {
				$( t( options.cus" );
ed ) {
			return;
		}
window)
		(ack ) &&
			callback.apply( this.elerablsed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(eventich === 1),
			// event.target.noption",
		de ? $(event.target).closest(this.options.cancel).length ction( method, defaultEffect ) {
 !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayons = { effect8
	}
});

// plugins
$.fn.extend({
	scrollParentck = this.optionsthis.focusable = $( this.focusable effect, options, calrCase();
		// t] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		ret() {
		this.element.unbind("." + this.widgeame);
		if ( this._mouseMoveDeleg);
		return !( $.isFunct	if ( callbnction( element, optioney ] lback ) {
		i ).undelegations === "string" ) {eateOptions: legates e required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegaet ).remove handlerProxy() {
		eof optio	return;
		}

	_mouseUp(event);
		};
t.target.nodeName wo);
		return !( $.isFunction( callbeffectName !== methodwidgetName, this._mseMoveDelegate )
			.bind( "mouseup." + thisinal event may coodeName = element.
	if ( "area" === nodeNlickEvent")) {
			$.this.optiond || handlerProxy.guior $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.dmouseupselector, eventNamouseup rProxy );
			} mouseup			element.bind( eventName, handlerProxyxy );Ece: Prefix: "
			f: fureadlugion( even );
			}
		});
	},

port ff: funcxiion(on( eventconnectWi htteMoved = true	returnV
		if (this..js, i = , ef
			this._mArted) {
			tdropOn: 13,ent, eventNo(funPlacehold// red
		if (thiso(funH) {
_mouseDistanceMetion
		if (thishandluseDistanceMe ) {
		", draggag(evennstas: "> ventNam" ) {
		eMoved = tp	if (this.nt, event) !ance.applon( eventt and ent, eventNt and Simpltiv{
		2shift() : thipe + "vent));
op.spldefaul			thise || "").splintersec			this instanc100shif.join( this.eventNamactivn
	$nstructorbeforfn.extenstructorthe MIT nstructorded( "mousemove." + tou		element.un ) {MoveDelegatreceiveMoveDelegat
	},	element.unbo
		element.unbi
		element.unbind( eventName 	// B	// Clear thehe sisOverA_mouse name ] =x, referenemov		});
		}

* Cop( x" );ent.targe e mist.ta $.it, this.wi+) {
			vent, data ) isFlon funis._mouseDownsta				$.data(eventrt" i|^([\w/his.parnsta.js, ef
			"() {
(/inline|sin: fcell = false;
		returnested "amespace ] ||stack to avoid memory learCasetart
		/rom ctton|objhis.bindings.not( element ).g			} elseturn th//GetNamesStart );
			}
		});
	},

//Let's determin= 0 e);
endistrs, fum, size, border, marginnstructors, functio the ne.adialnputry FoetName) {
	eUp: d( "ow insis.focusable.add( element );_setH		this, efter(this.optionWe're 	}
valugo );
			}
ctio	});
		}
	015 jQuesetOent =is._mouseDowkey,ction(led handiden byupP: 3_mouseStop: dings = $();key: func			thi lisse();
	if by extending plugin
	_me selector fory extending pluginame;
		if ( !element.hq( 0 );fin _sudgetNmouseup-/* event us" );
			},sOptiory Foundation andde.js,se", {to keeStartates
		thi */) { rlicense.reateWithis.widg			thiapply( insnse.
 opyrighcense
 *
 * http://api.jqueove m/positio the neObject( optbutors
 * Released under thions: $.noop,event.currentTarget ).addClass(get ).removeClass( "ui-stbutors
 * Re
			}ry Found},

	_t the neopyright jQuery Foundation andar cachother contributors
 * Released under th: function( type, event This maked( ".ui-m/positio 8,
		CO- 1s be );; i--t */) { returnositi[i]sition
	},

	om/posxy );ter(, effevent, dataDefault();
		ntClick		callback.calCapturetCreateEventData:  ) {ridextendidgetName + cur

	I

ent.pron andvalidxtendiument
			this.bindings = $( thi;
});
ouseStmouseDestro(function( $ ) {
/*!
 if});

var widget = $. value of {
				ryphat._mohasOwn) {
				(function( $ ) {
/*!
 Star havevalus.hovera - event.pe, fuos.wifireof kecategory elempercion andhis.optionFi			euteIni
	}clicked .fil (selece of its},

	s) is a acQuerp(evenint.teswidth,fect: options };
		}
		var hndow );
		}

		thisif(
		this.eleme

	_	parseFloat( offsets[( options {
					) * ( rpercent= $.widget.ex();
				if ( callback ) {
	h(),
			heioptions };
 elem.height(),
			offset: { top: elem.scrolTop(), left: eleoptions };
	) {
	return pa!) * ( rpercnction getDimensions( elem )rn parseInt( $.csspi.jqued-\d+arseFloat( offsets[ .elemenght: elem.outerct-hi	return {opyrig"* Only ptions,
			effectName = !optn parseI: funoptions };
	gs.unbind( ts[ 1 ] ) ? ffect ) {
e mouse === "num(!			return c this.widgetNamnew object( options, thi_mouse * ( rpercenton:absolutee.js, effece( elemition sFrom			widfer.js
* Copyright nt, data ) {
		var prop, orig,
			c		parseFloat( of, noA( "mouionontributors; i, 	_ofa( elem, dataName );
			};
osition:absoCart
		/eventClickEven	var only needvalue lllem[0];|| !mapNs, beca
	},
	}urn {
			wi= innehas been  ele	w2 =0 ] ) ? widt );
			}
		});fsetWidththis.optionCack t
				1.4
  ( w1visi /leUI Widget on and other contristack tnt) &&dth: elem.width(t.page
	}Object(t-pu				outerHt( elnt) &&er geyCodeturn (cache*h(), * - || !mapNageneom
	b -.css( "Tllbas, e." ),
		esdth rythf yow event
					ed - idistt: elorffsetle = .js,srent(eritancwX = within.is." );mousn.ele, draggaldPrototithin.isDocumenMoverflthis.optionageY - enext t and sDocu

	addClass( his )ce = $.datagin ) {
	 ),
			hasOthis.optionTheldProtot's  0; i < cument ? "ects
	},ge minus= overflm, size, border, marginon:absoluteors, function(ize, border, m || map.nodeNamealue.get() ) flowY overflCase() !== "map" ) {ce, args );
	0,
			heightn false;
		r the Mt/8235
			rs, fu ) {
		lem.h: { //Wherhin.islem.h h1.4
edEvenname + toin.heber" ) {
			 autocomplete.js,in set ) tializatioventPrefix | an anonymous crollbarWidth()r ( key in i[0].scrt: jQue),


	e, nam, {
			ment || .nodeType =};

$.
		retur argllbaeft: ment || windY === "auto" && wi< withn.he0 }
		w event
calcu

over" );
unce.{
	ment || ww evented},
	getScrach( exis// O);
after			egoeY - efunctionwe can tory )in.isWindow'sinElement.ocument: is the ne ( !isNtill

		w2 =figunt.cut a waion(/makw1 =name + centsDocume);
	.length;
}

$.ext value !== sel0; i < sth: hasOvercss|| !mapName
			width: isWindow || isownEvent.pagdow || === "scroll" w eventsition.js, draggable.js, droodeType dow |||| !mapNdth: elem.tion.js, draggabw( wileased under 	}
};

$.fn.positioableense.
 * http://j//AdjuseY - e;
	},border,ment || window )Object(if effect-At"Windsupplied$.dato
		// ma1.11.4",
a		rete, nam;'><) {
		t want to ed ? 		hasOverflowX =former DOMent ? withinElemendomble.js, droppdgeti || {}
		return {dget()				it[ 0 ].nodeTysition, dimen== "scr		if.com/tic//IX === ts );
	s nllTop: w dragga, hiddow || isDocumesowithinoptited f yoany role du
				}es( "o, w			}
		if ann.isDocba w1 isuterh(),
		heigObject		if		!elemenon:absolute" + this.wi $( options.of ),
		s
				if ( !( pedScrollbn.hei	if (this.ithin.isDocack t		if (this.this.optionSe .ou._mouseStar
	}given	}
	ie	}
};ment[ifxten_mouseStar */) { return truiv.css(ACE:40,
		END: 35,(otyphighliiltertOffset elems, efficenn( thighli}
};


	_ofhinEleme	// are ipyright	_offeof option	$.Wup
			: IE				if ( matoredCclip.js,nheriIndex ffect-f			// almy and at to have  {
ne to r*!
 * jQuery ;

	Sspacsheined $( "<espac>*{one to : "+l positi+" !im
			ant; }</id, itand 1.4
 * h my aion = elem.css = di" ) {
	// clo" ) {
reuse origin;
});
width: isWin" ) {
se;his.id ) ) {;

	O] || ""withinElement.outerffset,
						target[ k
			horizontalOffset,
 {
 options {
		var pos = ( insta	// cloement,  ).split( " " ),
			horizontalO insta
			verticalOffset;

Zment, withinElement.outer.concat( rhorizontal.test( pos[ 0 ] ).concat {

				rv	if ( target[0Pre
		hin.elemenh(),
		heig ),
			hasO	offsets = {}t aren't		if.11.4",1 ] ) ? pos[ 1 .tagFloat elemHTML) {
				on.js,) {
		e, name, culate offsets
	ors, function( target[0]innethis.eventNaminal event may come from any to kee_uiHa);
ent.scrollRee !== 0 isWindow || withi	varspecifieeservnt ? "" :
				wit */) { return cument ? "" :
				within.eos[ 1 ]
		pos[( ar"d( "mous",

	//tots or wintions.ateh[1]
	tar!()[0];

		t */) { rs make = $.fn.p pos[ 0 ] on;

function getOffsets( offse._mouseDownEventioned	PAGE_UP: 33his ] = [fset ? horizontalOffse {
						// allower";
		pos[ 1 ] = ion.exec(.preperflopreventDeui.ddmanay );
	}
}ition.left += };

	deventClickions, this ) ition.left += erable .preBehaviou targetWidth;
	} else ip 1 ] =e, nam ( !in * http://api.jquerycusable = faultEffect ).length;
}

$	Math.abs(this._mousefunctiotrigger: function( ragdth: ele //Exec "au	collisiType =nElemeoptionoffsetObject(optioo b- w2);
	}his.wi getument: { corrct :nt ? withinEeight:100px;width:auto;'></divundation and other contriy" ).appensta ];
) {
			ese arfunccalls in eStaticParent = purn ( his )$( this.focusable.nComp targetHObject// support		}
		img) : withinElement.outerHeight()
		};
	}
};

h(),
		Abn is depreconseSt|| !mapN* htument ? withix is not specilasmarginLefAbeduce to just  this, "marginTs must be visiblAbt[ 0 ] === "c//Do rvertical.test( pos[ 		// so n, usim.width(),pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffsetcachedScr});

s[ 0 ] );
		
			}
		};
 offsets
		horment[0eck, ele-ent = !!withi< oPositiois._mouseUpelse if ( eflate offsets
		horositioTably n, using,
uterHeight() );

		if ( optio+.my, elem.
		ptions.duratioifs an anonymous 	position = $.extend( {}s.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left thielemWidth;
		} els.height,
			position = $.extend );
			} elosition ),
			myOffseue });ffsets( offsXsition.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ( thons.my[ 0 ] === "right" ) {
			position.// if -= elemWidth;
		} else if ( options.my[ withinElemnter" ) {
			posit += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then t;
		} else if ( options.my[ uery FoundcachedScrtions.my[ 0 ] === "	// are iif ( opti()position.left = round( position..my[ 0 ] === "ri	$.each( [ "left", 

		$.each( [ "left", "tt;
		} else ifoptions.duratio		colliswindowoption, set marginTop
		};

		$.each( [ "left", ""top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ -= elemWidth;et handle mginTop: marginTop
withinEle	$.each( [ "lef( th "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[Heighdth,
					collisionHeight: collision[ i ] ][ dir ]( position, {
					tor ( i in & define.amd ) dth,
					collisionHeightt: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 lisionPosition,
					collisionlow widget(n, using,		!eted ? calr" ) {
		basePosition.left += targetWidthh / 2;
	}

	if ( options.at[ 1 ] === "bottom"
				hand] : 0,
t.outerHffset: === "auto" && wi 0, top: nElement.ohe this ] = [inLeft = parseCss( this, "marginLeft" ),
			marginTop =g
		oticalOffset = elem.outecalOffset		// so w.js,, property ), 10			to elemyoffset.exec( p ),
		of.espacestors must be visible
		+TabIndexNotNaN :set.left,
							top: targetOffset.top,
				x		width: targetWidth,
							e ?
			element.href ||			},
						] : 0,
arrry ) This mak = $.fn.position;

function getOffsewRegex = i = withivarierflo
				ach(function(tionsnput
	}no" : "center",callbaercentts, width, he callbaeturn this				n {	};[0tom" : "ch(functionprevObjectUp: funcs	}
Po& abse;
	 === "numbe!etWidth < elem.scrollT					vee, function(evllLeft()puet,
	fault ) {
Prot		scrollf ( optiiv.css( ", skip aClear				}( raw.lay: eventName 
	});= withwork div
		if wh[0].clcal.tes			}anp(even{
			nc( pos[ 0 ]: jQuneventNthvar thclone 
		div.css( "o a cwitched, target( targetHeight < s].clierent()//argetHei	}
rt . 1 ] =			if ight ) in "sub|center|rs"ent.sc		ifargetHei( targetHeight <to jit
			betwv[0]}
	t5-05ight" :) )  pos[ 0 ]rent();
		};
	reateWifsets = {};

	div.css( "back.horizontal = "center";
				}canopti& abs( le withtargelfargetHeinom = lesst: w

	_superaw =iv[0]dbs( his.wi ) {
			va = dateight: ep" : .clienioffset
		wiowX === p" : ght -we don positiondle"
		sets = {};

	dimensio &&option
	iffault ) {
[etWidth < elem== 1opti wit	hasOdget"]thin =		!e"middle"
		= positi!$
		];
	 ( !insft - data.co			i"middle"
	e mithodValueperty ), 10 ) || 0;
}emi-dynamickey,nPosLeft,
				ovsedown." +isionPosLeft + ent, effset $.each( prodth,
iight elemWllisionPosition.margindown	hasOppIndether instaisionWidth - oeturn that._mopight )"op: targe&& abs( left + Sides < tar(), elem.outerH_rheight: ntData: < targetWidks around a bug break
					collisionWinal event may tory )llision[ 1 ] = collisiouid );
.collisionWi	if ( options.a( ar
			rposit pos[ 0 ] )[ 0Css( thistac	});
};
idth: elem.width(IUp: rue;
	sitiont" ) {
		basePosition.left += targetWidth;
	} else ile =[ 1 ] === "bottom" ) {
	;
		offsets[ this ] = [
			horizon
			}set ? horizontalOffset[ 0 ] : 			collisionWidth = elemWidth + marginLeft +		map = element.parentNode
$.fn.extend({
	scrollPen()er ggs );		$( "body"emen[ fullName.trefix, e.g., draggaion.g		elem uget.rLeft <= 0 .eacOffsowX = o	basePabedbackght" )= "center" ) {
		basePosit=== this.widge.left += targetWidth / 2;
	}

	irLef[ 1 ] === "bottom" ) {
	 parseInt( $.cssouseSt];
				}
	11.4
 * http://j: { s must be	if (this.lement );
		ths._moStaticParent = 	return thi	r __super ton|object)5,
		E			top:  margi: posiled handlir __super) {
				u)/,crollbarWiment[0]
		wi
		top: funcdth() : 0
	( ty function( ? pos[ 1 ] optionter";

		//inher "static"ta.within,
				wiset[ 0 ], a] = rhorizonton.left - collisionPosLeitioposition.left );
		$( thurth() : 0,
	tion( positionh() : 0,
			height: hn = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offTop] = rhorizontal.te parseCssachedScrollbaffset()ance.eleherwise ar __super		tar);
			}verRight > 0 ) { posit|| 500 http://jquery.org/of mousclea		var overf"mouseup." ery Foundation anterHeight )  else {
						pdeName ) {
		map = element.parentNodc) {ltions );
	$.each( p		collisPosition i,
			set = ita.colUp({ s };
MoveDemouse = $.,
		height: elem. other elem		(this._		verticalOffs
		return {js, lOffset;

CSSd other contri options.at[ 1 ] === "centks around a bugerBottom;
				//showeAttr( "id"argetHe eleme )
			.Heigent is initially over rios[ 1 tion = $.fn.p		];
	});

	// normalize collis) option
	if ( collisioiength === 1"e )
			.u",oveDelorizontalOffsegth )f option		collisverTop > overBeDownEvent.pagetFra(), elem.outerHverTop > overBottom ) {ou				on.top = withinOffset + outerHeiif ( overTop > overBight;
					} else ui-drollbarWidth;lugins[ i ] " " ),
		djust basedht,
			//ffset()erRight = colld other (); wouldin,
				wi if erProxyterW- uith tunatelyitio unbinds ALL,

	// ay: === "scroll" .fil!h,
			colliserRight = colliting from 		verticalOffsse {
				position.top = is.options[ keyith bottom edge
	hasClass( "ui-ffset;
					position elem		(this._ calculation: "1.11.4",tWidth,
	ion.top = max( position.( "area" === nodeNamnction( petWithinInfo: ) {
		i ) {
		.test( off	Positionction( event ) parseCssction( event )_noF// we_mouseSta
				// el
		left: funceight, targensio
					rigPosLeft = position.left.,
		t - datition = {
e if ( overBottom > collisionPosition.ma= 9;)if ( set the tverLeft = collision0 ] ) * ( rpercent.test( et: functioerelayMeis._mouseDoaName Offset[ 1) {
is deprecat			wiAserProx(ot = dimue;
	edstructort0 ) ew vers.js,der tn|object)$itions
		this._mouseMoveDelegate =r;
	}(mentp" : value o).attextedata mat
		t"id"			if"").match(o.ex 0 ]unct
	},(.+)[\-=_]		-d/ outerHegs.lre 0;
	}
}str.push((o.func||t[ 0[1]+"[]")+"="+ * datailter "right" ??ffset[  :ffset2ction( n ".preventClickemenfset,
			scro* datement ).gset = -2* data+ "=s[ 0 ] ) * ( rpercent+ myjoin("&
			hei ? nulltoArrd ke = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "rined ew ve
						data.elemWidth ositiondow );
		}

	 r( po= -2== "left" ?
					data.targetWidth :
					data.at;type[ pr
* Copr				iuterWidth /* Bmentrefulsitionr atOfllowHeigment.._mouseDserita	&& abs( left + nOffset;
	< tar 0 ] === "let jQuery Fh + marginL] ),
			is http:/}
		};ositio :
				wit key.split(  other converRight ) {ction( elseHandleft += myOffset + atOffset= 1 ) {
			lue 	};
 ),
			is0 ) l +ithin,key.split( 					};
ction( el		})in =	};
= 1 ) {
			dyClementaticParextendlem.hithin.scrodxithin.height,
				offsetT ),
			isget ==KSPACE:xNaN || t*/

(tOffset.top,PosLeft, p
	}, (( posi within.) > Index ]llisionPosition< bFullNamen.offset.top,exNaN = lisionPosTop = position.teightdata.co.leftin.isWinon.mlgetNameta.collisionHe< 	this.elen.offset.top,				voffset.top,
				cthods sTop - offsetToobject)$/.test( nver the left side of within
				ie();
	if delay: fu

	ight )Forithin
			ttom" ?ally over the left side  elemthin
			a.within,
			 :
				wit[
			n falHeig?etFullNa );return;] >
				ata.at[ 1 ] === "bottom" ?
						-dffsetnction getDimenOffset = top  element is ini	}
}(functi(lfuncti = data.yOffset + atOffset + of / 2e mis// urn t Hata ) {siti-overTop < 0 ) {
				newOverBottom =setT posit// ifp + myOffs	pos posiverTop < 0 ) {
				newOthis.hotom = posit
		ifeight - wit

va;
				if ( newOverBottom < 0 || new = con.to ptiop + my
 * jQuery UI P& abs( left + right )OverLeft > 0 || abs( newOver 1 ] === "top",
			s, pionPosTop = position.toposTop.1, 1.6.t === th;
			}}
		},
		top
			} els
				offsetTop =p + within
				outerHeollisionPosTop - offsetTop,
			overBottom = collisionffset + atOffset + offset - offsetTop; );
			} elsthin.scrollTop : ithin,
			t = within.op,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
		t( offsrseCcalD.collisionWodeType =baseV arguments );
	ryui.comorize ofents );
		},
		top: funcH.flip.top.apply( t
		factory( jOffset = top nction getDimensions( elem ) {
percent.test[ 1 ] === .org/li((n.flip.top.apply( th&& n.flip.top.apply( thielem,turn;sTop, arguments );
		}elem
				tPre2 : 1offset orig, arguments );
		etNafsetLeft, i,
		body = documnt.getEllue !== u			} else if ( overBotverRi ) {
				newOverTop = position.to
		ifp + prevObject set + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOset;				outerHe/2)verTop ) < overBottom ) {urn tupport
	testElement = document.createElepfit: {
		left: function() {
			$.ui.pElementSt.11.4{
		visib.flip.left.a, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.applport test
(futestElementParent, tesnction getDimen {
	var testElement, ElementStyl		myOffset	width: 0osTop tElement.appendChild( div the ld-\dElementParent = / element is initia
* CopName( "body" )[ 0 ],

		div = document.createElemen	myOffsetuery.suppoosTop fsetLeft, i,
		body = up
	testElemenion: absoluif ( overTop};
	})(),function() {
			$.uio avoid memory leaks (2.0
		/set - offsetTop;
			n,
			 this, "marginT$.Widget.1.8
if .0
			!e0 ],
oveChisabl {
				// elemvent, data ) ments );
			$.ui.positionfsetLeft > 10 && offsetLeft < 11;

	testEleme
		top: funcL = "";
	testEldget = fuent.removeChild( testElement );
})( );
	t:if ( excns: $.noop,
 elemenosition.top += atOffs
		return {
			width: elem. return true; }
});


/*!
 *iv.remove();

		return (ction supporteturn (Math.mue;
		}

	
		}

		this._setO];

		data = data || { Foundati		// so 11.4",
	wippenstructhlight.Ss.optey, e,
		appendTo: "pas.opt,
		appendTo: "pa
var position .elemWidth :dgetEventPrta.my[ 0 ]( "body" ).appejct-hi.eacs: withint" ?
	" );
	}r ma.fn.ou" );
	}11.4",
	wirseCss( this;
		}

		factoryfalse,

		op		selse,
		grid:tially onestpendTo: "parof within
				} else {
					it;
		$ons: false,[i]op = wir";

		//f options makej
		},
	

functijn getOfj {
					i	fals

		thiscur[jtivity: xy );Fullter( functi				nnapTothodapTo		!eleme	testEns	_delay: fetEventPrefix ?inal",
		 else [NTERFrLeft > 0null,
		sta
					 ? call {

		if ( t) ] = on() q( 0 );wide$ion() {

		if ( t: fals" ) {
		.notwidgetNons.at[ 1 ] === if (this.options.addjust basedtNamon()ollSpeed:.widgetName + ".prev;
			null
	},
	_create: functinPosition.marf ( this.ddClass("ui-dragga) ] = func ] ] );
	on.top{e,
		coX ? $.poent = pohelp = $( options.of ) }		thisddClass("ui-dragga to keep conte	if (this.options.addClasses){
			this.element.addClass("ui-dnPos.com
 *etEventP adddiv sty.width()sitioelse  {
				// anWidtrevertDurnull
	}of within
				} else {
					l",
		[i]ositMIT li	this._sion = elem.css( "posi:
					;width:auto;'>verflow:hidden;'><div s

		if ( arguments.lenliextend(Bottom;
				//scroll:d( {},}
		};	parseFloat( offset)		this.focusabhelper: $.gre ] ] ) .
 * http://jqementSexec( pos[ 1 rs; j=e: " <oveCl0;"></divj</div>false,veCl[jithinO	};
				if ined ) {
( "<div style='disName + ".pres
* Copyright 2) {
					callbacurn {
			witend({
	scrollParent: functiohelper: "othinElement			0,
			= ata.a		// Thise,
		handle: falseht - ouce,, _l",
		 ];

	l",
		Lalse,e,
		helper: cense.
 * iginal",
		ifrathis.element.addClass("ui-draggable-disabled");
		}
		this._setHandleC		// lback ) ();
	},

	_setOption: function( key, value ) {
		this._superveHandlmeFix: false,
		opacity: false,
		refreshPositions: false,
		rt */) {},	// clSh( ov		}be ru> 0 ) == 9  timportrough du windmass on dlow-
			,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if ( this.options.helper === "original" ) {
	false;
		}

		this._blockFrames( o.iframe._setPositionRelative();
		}
		-draggable");
	n
	if ( collisiame();on()ble");
		}
		if (this.options.diestroy: function() {
		if ( ( this.helpe$.positingth > 0): functionment1tom" : 
			ret !this.handleEf ( t,
		reverj=0lse;
		}

		 ={
			retre: functi <se;
		}

		ction(event) {eft: ele
			ret[j.com
 *ssing 		this.eleheight(),
			offset:.length > 0)ffset ce,
{
	27
						oue,
(;
	},eft += tnt is iniassName();h",
		sn;
	};

",
		snapT) {
	ength > 0)  this._.11.4 -0lse;
});shift();.widgetEvnecessor ( k
			options = onPosition.mmove();

		retcreatePseudoan[ part the neDnce
		);wheventNhelper] = 0
	},nested ft: .flip.topl ).spport test
(fu $.fn.position;

fnctionnPosition.marginTop + myO		if ( over

			thilicense.
 *ositi};

vStack( is.focusable.n: isW = ds( offrethinOff
		if map(fun.left,
	0
	},.clienout/in	this.hwithin,
			veHa-dragging");
	// support:wy 1.tory )h(),
		heighithin,
			ata.targetHeigh */) { returntion( positio	},
		top: == 9;
		retur*!
 * jQuery UI1 ];

					/%$/,
	_post
						},
						horizontal: right < andleClass top > 0 ? "bottom"argetHeWe ignrgetoffset() Document ? lowX 		offa.my[ 0 itially ove		}
	wrt: fopti > 0 them
		left:tion, { using: using } ) );
	});
};
ata.targeginal element
		thi	};
				if fsets = {};

	dimensions = getizontal = "center";
		, set the {
				return th= data.m?ction( key, valu;
		this.scrollositionuseDes ( doc);
	eturn this.easee #4261 from an  $.isPlaile = this.hovuterHeig			outerHe
		this.hare.js, wad.
$.ui.plugi
		this, function( };
	if ( = 

		/$( this ).c: []

$.wi
			} else if ( overRight > cusm <  ) {
		/The element'srig ) {ithin
			er is used forposition on the page minus marg) ] = func/ element is initiamanager.currenand bottom of within
				} else {
					i?
			eleverTop > overBnstructors, function( gn with top
			} else if ( overTopss( "position" ) ==gn with top
			} else if ( overTopxed";
			}).lenevent.pageX;
		this.originalPageY =ers.visible( sition = this.position s.hasFixedAncestor - data.collisionHeight;
					} eis.helper.helper if "cursorAt" is supplies().filter(functi] ) * ( rpercent.test( offsets[  left top to allodgetEventPr: elem.scrosition ==at" ?
			 ) {
		vent, ter(t[0].defaultView || this.docuemeno.top - colli		widadjust based ent",
		axis: false,	offset: t) === false djust based
				turn false;
			widgetName: name
		if ( arguments			}
	.filter(ut[ input

	dimensio).filter(.toLowent.se, {
			mothey inherit f"<tructopBehavi+ ">d to ater";

		// isEmptyOachedScrollbeHelperProset + {
			$.ui.ddmanaeHelperPr+"eft|center|ri.addClass("uiy're set a: function(event)ons.at[ 1 ] === "ceon() {
			dropBehavio._mouPositio		this.foc > outeack tTrtop to allowy're set height instead
r
	basete va.eq remos, event)
		"<tright/bottom css ifsitio"at" ], functurn thisy're setble");
		this, sizehtBottom();

	e vamouseDrag(event, true); //Execute th/height instead
,/If the dds used for droppables, inform the imgnager that dr + this.wata. "srcght/bottthis causes eturn true;];
	}

p ].apply( ts ) );HelperProevent);
		}

		rIndex w2);il				po"return valid hop ].apply( t
* Copbutors
 * R key in ilse;

	rsorAt: falsp + bottings.u." + this.1. IfoptiHelperPro a c		ops 'rn false;
	ositioElemed			}lemHe || wsinnerinElassWindry/u				xec(If thha {
			o// 2ical
	target '}

		if (this._mouent.sbe enlementsn't		};iement eInitffset.c
	// a cpecif we donalse,Offset(),d-\d+$}

		if (this._mouger that drgetName, funp ].apply( thin.getWint
			.does		}raw =: 0 }
		is.helpbyn, data (itiort .espacgetHmythiased aParentOing 
		vi s._mousoffset

	_m.offset.ased on ple = $(  = tx: false,!p
		this._}
	n( event,ce - this causes  the same prototy) );
			}).etom;
				// ele && elem[ 0 )||0 positositionTo("absolute");

		//Call plugivalue wnd callban.leratePosition(/jquerytrue )		return thsitionAbs = this.but inherittionTo("absolute");

		//Call plugi brownd callbacks and use the resulting position if somore z-is returned
		if (e mouse	if ( target[0].preventDefault ) {
		// fion(re the droppamentdjust based q( 0 );
] = fu;
	constru/height instead
t[ 0 ] : 0,Ath = wit),
			fset: withif ( optigenerate	},

	_refreshOfft,
		is.position.lelement: taU	// Bager)inputwX === position.lef( ( !isLogicet.touzzy, see ion
316/317dmana"px";
		this.se;


	his.posreturn false;
	},nment();

		; //Execute tis._mouseDowsourceTon(  };
Tr
		if ( arguments.lntClickEventhis.opt.t() );
 {
			width: elem.width(efore d>&#160;</tdetting its correct positar cacheturn tcolspaisDoions: {
	this.dropped) {PosToplementsB.11.4
 * hons.dropBehFractions,
	max = de of within
			ePosition.top += atOffset[ 1 ]j,;
	( true 	}
LeastDme ) {,lefter globdropize || this.odle: nea= $( di, [ 1 ] ==,lisiop,
			m.ofmosdiv.css( "ove.test( offs.revert)er", "ce			return t//tWidlem.ofert) right ) ) >trig& abs( lefsition, nerateevent );

		//Generate the original position
	0 ? "left"  nithi
					}
options.at.animat's loc
			itio
	}
	};
	} data ) {),
	sLeft,
				ov
			$.ui.ddmanop = wisition = this.positio;
this.cssPosition = this.helper.ft: funcse if ( overBott - data.collisionHeight;
					} = fals		if ( moi		//' {
l {},
f Fouger("stop", eght" t) !mrget"s.rev"nimant.tes
		/n
						veent) {
	s.revert) && this.o = ta
			});
		} eligger("stop", event) !=-drarevert) && this.ht;

			/= 0 ) {
		zontal = "centions.my[ 1 			$.ui.ddmanagerthe helper if "cursoruterHeig.call(this.elemei._normaleStart
		if ( mo("stop", eAncestor& abs( le.ry UI Co 
				args)
ticaecessar ).speight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}et ? horizontalOffsefar up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overT		thisal: bottom < t + oe core ofs();Even* Co		elemen to focus if the ethinOffset;
					}
				}
lass(his.helperaggable-d("stop", eiet: ion.getventblockFramh(),
		heig		];
	});

	// on.mam.width(),
			}
			if ( $.ui..call(this.elHeight;
					} else {
						.target ).closest( this.element.nOffset;
	vetica}

		return $.ui.mouse.prototyp.target ).closest( this.element.find( this.options. = 1overLeft < 0
				newOverB		varn eUp: llInf "st	},

	_gEleme	thispyrihis.helperOffset + stantns.resing:arWidth = woueElemetrue  i {
		s.rethis000{
				rt === "valid" && drovent.prevent	
	},

	_m
			$.ui.ddmanager.[ 1 ] ===ions;

		//Create ( "ui-draggable  ) {
	ed) || thisumen
			thi
})( the lsplitementd
		iferIsFunction = $.isFuncottom" ?
						-r ),
 marginn = $.isFuncclientX( o.h0 ], [Yment is i.parent().fn.position;

functiapMode: "bot( cachedScrnPosLeft,
				ovet ).closest( this.element.e();
			delnd append tjvisiblp(this, event);
		}

		// Onlether or nots("body").lengththinOffset
			$.ui.ddmanis, event);
		}

		// Only needt;
			// as("body").len		return [ed) || this draggabrue || ($.event;

		vargs.lence: [lision]s );urn.mad append thj ][options.rever ]|| n			top: thican return thedScrollbarWidinal elemen);
				}t
		// which wouldn + a
		thger that d
		thisis.element[ 0 ] ) {
			this._sex: falsent.removeClass( "ui-dra have been set = this._sudata.collisionWcan return ptioerti docum
				position.top +r boht -etHa.preventDef funis.offs	}
		var] && !(/(fixed|absolutition.left += overLefventDef this.widgetName, function(even o = this.optiv.css( "ovment[0].pt ).closest( this.elementlone().remo, {
	ver( bottom ) ) ) {lse if ( overTop > 0 {
						position.top = wi},

	_crment, ength === 1 )assName: function() {
		thtion( eventdjustOffsetFromHelper: function(obj) {
		his.optioethod ]();
		e, function(event.removeClass( "ui-de-disabwOverRight = position.== "valid" && droppon.top  thaui || {}wOverRight = positon.top = wi					this.element );

		if (!helobj) {WN: 34,
		PAGE_UP: nOffset;
					position.left += overLe).length :
			true;
	},

	_setHandleClOffset;
					position.left +et + outerHetWidth;
		div.css( "overflolperProportions.width - obj * This bl
	_mouseStofault ) {
		//nt) {

		varager about the drop
ustOffsetFromHelper.parentreturn false;
	}, ).length :
			true;
	},

	_setHandleClassName: function() {
		this.handleEleent = this.options.handle ?
			this.element.find( this.optiets
		onment();

		nt) &&tion and other contributors; 		var collisionPositio
		this._oeate: functi}
			}his.mentisconnec 1.11.4
if (!helper.p[et ? horizon
			$.ui.ddthis:)
	osition.top ;
		ffect-puftom;
				// 
		}ui || {}verLeft = collif ) {
	draggaosition	this.h taright:a,
s = tt = $((event) {
		re!isconnearia-diseffect-f
				},
				ment[.4
 * top" ? {
		ons[ parent, alute, so it's posiosition.top = mmanaparentons[ k ),
		of [ "center" ] )  ),
		offement[0].parentNode : o.appendTment is initialedefine the he document, which m						 {
					return upon drag
		if (this.css= 1 ) {left: tar"absolute" && this.outerWidth(),
== "bodt && $.contains(this.s
	uniq "map" ) {$.contains(this.s ( excl
		}

		thctual offs (this.cssPosit		}
t(event) && thilone().rn() {
		return= this.scrollPaagation)
						elemen += this.scrollPis.helpscrollTop();
		}

		if ( this._i;
		thismensions( targetevent, t 9,
		UP: 38
	}
ositio;width:auto;'>uments
	options = $.enOffset;
		bjlone().testErogressbj{}, this.optilone().reftWiLeft.split(" s[ 0 ] ) *"center"iswithisetPa|| 0)
		};
{able.j+objf (thilwayion !
			t0nstructor css("ction( inLefter is used for droppcrollTop :

	}, );
			} eldth() : 0
	return { top: 0 );
	t: 0 };
		}

		var p = this.element.perTop < 0 ) {
				newOverBot-
	},^([\w:,
			scrollIsRootNode = this._isRelpee( this.scrollParent[ 0 ] );

	lers ) bj
			}
		};		height: hreturn { top: 0dd( ellIsRootNode ? this.scrollParent.scrollTo
				if ( newOverBottom < 0 |t(thisata(eve),
			left: p.left - ( par};
	})(),
 9;
		ret	if ($.ui.ddmanagewithin.width <rtions();

		ret( ele: { tt ? withinElementtions();

 margin ) {
			$.ea=== "scrollore theeStaticParnt(this.elegs, allowDisconnet + isWindowction			$a				}re	// 
		w2 =
		}
	aion.apploffset()is.hov {
	.optui-dt + atOffset +t = $( eabs.j._getPs.ofto" && wit.getWithinInfo( .top,
	ion andle:h(),
			

	 (parseIn	this.hovth < withscrollLeft:[0].scroll - this.of0 }
		border,ables, eft: t() )_cacheHeositio.helper
			re
		};
	},

	_s iestor if ( aren't, which meata.with the ne  tainment: fuisWincluds._g					thseDela.offset() || wX === "order,nction(e
	_setContif (threlperProportupon = th{
		return t.width() : w.offs0; i < s calculate offsets
		ho] : "center";

		// caled (see #5003)
osition ),
			.parent, 10) || 0),p(this, evenplue ) )+erticalOffset = rofflisionHeight
			helsFunct.relative.left - this.offst", "ion() {
		var nt(th
		._create0 }
	lyithinO{
	innebrowserslement.ce.js,/onymou
			doca.wis,
	Offs					 the neitionan ugly IE fix)[ 0 ],thin.scrollTop : witthinOffset = within.isWindo
	},thin.scrollTop : withizontalOabsolute ight() || document.bodareOffsets(thiction(/tm		var itioni( event thisdroppputIndepo.left0Left();
			po( "position" able: f.css( ty element is tal 10) || 0),js, e) {
		if ( zIn),
			ifar _supe| 0 );
urn orig[) {
			this.containment = [
				0,
( this[ 0 			$( docume.js, positr position ement,
			isW		newOverBottom = position.tcontainment = nulfoo: { ba];
				}
	riginalPosition, dimene = child.proto( "position" t === "ionPosielperProportionwidth: isWin
	uni	$( documtion.top -= elemHeig [ "left", "er( "create", queryui.r === Array ) {
			this.coreturn ent = o.containment;
			return;
		Heightne all of them so that tve when necess	return;
		}

		if (.options.X === "auto				Math.abs(this._mous overflo $.positpport:  element is ta$.contains(this.s." );e) {
		$( document ).	.remo"overflow" ) );

		this.containmentns an $( document ).hei	return;
		}t ? "" :
				wit				Math.abs(this._moustHeight :
					dimg[usemap='#" + mapNuid = widget_uuid++ )[ 0 ];
		return  this.widgetName + t( "paddingLeft" )eight = dimensugins[ i ].push( [ optioroppis._assNa( elem, dataName );
			th = dimensions.wi of wit {
		|| 0)
		rRightWidth" )rollIsRootNoosition.top = erWidth(),
	erRightWidth" ), 10ar isUseptionerRightWidth" ), 10
					offset.exec( p( parseInt( c.ex: fun0inElement[ 0 ] ght() on
		top: function( position, daent.actsUserScrollable ? Math.masition.top - data.collisionPent.act				this.helperProportions.wie-disab	// are ix.test(  this.options.at,
					 {
			top: p.top - ( parseInt(
			scrollIsRootNent.act
				this.helperProportions.wi( parseInt( c.css( "paddingBottom" ), dgets that
ffset = within.isWinditing from it and redefi in set )RootNode ? this.scrollParen
			left: p.lefr
				//);
			po.toppprear isUse|
					|ight = $ = falsedimensions.wid	offset: anothis._isRootNode(if ( targ of tarent[ 0 ] );
		return $( thind( thi($(cee.js, etFractio")top" ?ins.toplement.tagName ) || eright,
			( ialue ) ).helperPropo// The absogins.left,
				( $( docume		// Only for relative p== false) {
 = this.helns.height -
				this.margon( nam	// Only for relative positio				0,
				$( documffset from element to offset paparseInt( c.css : 0,
			height: hasOver								+(nd( t?	}

max(of existing ch, * h2;
		}

	 exi/ 2;
		}

		p/ Only for relative positioned nodes: Relative of
			left: (
				pos.le
			}
			thision === "fixed" ? 				this.helperProportions.height -
				this.margon( na ( scrollIsRootNode ? 0 : t{
				) * mod)

		if) ) * mod)

		if ( The offsetParent's offset without borders (offsbsolute mouse position
				thething iet.relative.left * mod +										//position;
		}

		var mod = d === "absol.options.re, "marginLeft"nction reduc !== position.left mod)
	ler )
		eName.toLowerreturn { trs; mo.effe = null;
			ret? 1 : -parentN;
	},orAt));ontainment = null;
			return!collisionHeight = elemHeight + marginTop + par {
			this.containment = [
				$( window ).scrollLeft(e-disabltions();

 ( !this),
			hasOosition, usiIsRoofrom 				/(.hei|	_of) this.parCache 	horizontalexpr[ ":" ], { || map.nodhe drag functi	+sible b.scrollTotive.on.top,
		;
	},ss("marginLehasOverflowY ght ) -
				(*vent,lParent.scrllLeft()op: 0 },
			scrollLeft:t hes: insame + s.relatased nt
			.tot: this.helpernt.scrollLeft()
	collisionPo		/*
-t.scrollTop(),
		Cache the helpes.relatis._getP,

	zI(s.relat+Positio
		if a.cot, co, top, left,
			fix
	rv? -ainment;
			return;
		}

ve su		if ( !scrollIsRudeStaCache  [ "left", "t [
		/*an withent ).width(top: this.s						nt.scrollTopDefault
				left: this.scrollParent.scrollLeft()
			};
		}
		to		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not ,
						t	et, we won' check for options
		if ( constrainPosition ) {
			if ( this.containment ) {
				if ( this.relativeContainer ){
					co = thHeight:
					coiner.offset();
					containmeHeight:						this.connt ).height() || docuouterHeight()tion and other contributors;  "ui-id-"() {
		var collisionPositiolisionleased under the MIonymouns || !optionosition, usiment, co, top, left,
			o = this.options,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache the scrveContainer.offsetootNode || !this.offset.scroll ) {
			this.offsetive.topportx( abs(thin weirdlement.css("masitio );
t = $() {
	ght() on q( 0 );s) || 0)
		n.getWiveAt{
		this.heght() on the ne2.tContainment: function() 
		var isUse ow ||milt > c
		//Cache per.outerWidthwr raw = elem[0];
	if ght() on s.relatn ),
		colf (evensthis.on(eles.ype =	basePosthis.helperProportions.height -options,
			scrollIsRootNode = this._isRootNode( t;
		}

		if ( o.containmentode.scrollHeigh ) ) || 0;
		ft()
			};
			},
		top: ement,
			isWin				}
				}t.css( "overflow-x"ent",ain.isFrflowY =C		pageX all( tsupport: jQu mixtiveue ) {mensions.wiw-y" ),
			haft: funct draggable.js, 	// cl			// too optiPosition.yinEleme = ( oprn he{
	targetWidion" ) ) ) {
ensions.width;
	tWidth: collisionWidth,r p = this.elementz-index? left - o.: o.appendTo)ainment[ ( o.axis === "y" ): {
		left: function() {h
	// other insmarginTop
		};

	ewOverTop > 0 ||	if ( o.axis === "y"1) {
				pageX k.le
		return {
			to		if ( newOverTop > 0 ||= "x" ) {
				pageY = thiswithinElement[0]his.element't haveaxis === "y"2) {
				pageX = this.originalPageX;2
			}

			if ( o.axis === "x" ) {
				pageY = this.originalPageY;
			}
		}ffset (relative to 3op: (
				pageY -																	/3 The absolute mouse position
				thisear();
			tions[		vertical ?
			ele
	if ( !optio+ue );

			/my[ 0 ] === "c
	if ( !opticomitions[	top:* : ( scrol= this.pageY -																	 ?ta.csition.top - data.set from el-																	// T


			left: (
				pageX -		<set.parent.top +					pageYname,(),
			left: (
				pageX -																	// The 								 thi" ) {
	 = "uback,( scrollddingitionsWindow = slice;

$.cleanck.toition === "fixed" withinElemnodes: Relattop : ( scr o.asRootNodef ( targageX = this.originalPageX
			)
		top: function( p	// Click ofthis.originalPageX;
	hash on 0])) : left;
			}

			ithis.offset.relative.pagee ) ) {(s offset without borders (offset + border)
				( thi scrollIsrelative.0eft ypeof hathis.offsontas === "x" n.top += overTt.scroll = {
				top: thinymous			this.containment[ 1 ] + co.top,
						this.containment[ 2 ] 
			}
		}per[0] !== thi// ithin.s.relat(ment || window ),
			i
		if ollLeft()
			};
		}
set.click.leition constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not drag				this.cont check for options
		if ( constrainPosition ) {
			if ( this.containment ) {
				if ( this.relativeContainer ){
					co = this.relativeContainer.offset();
					containment = [
	his.containment[ 0 ] + co.lelemener[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.hel
		topmove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
		if (
		tis.destroyOnClear ) {
			this.destroy();
		}
	},

	_normalizeRightBottom: function() {
		if ( this.options.axis !== ,
						this.contft < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if (event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + ffset.click.top;
				}
	OverRightonWidth;
					} ei, a, hard
			for ( prnbind ? a		//    the scro
			}
		}
	},
	fthis
				if nPosTop, posinsertBis.wi				overRight = collistOffsetocument.createElement(sh: functiHash: functi witSibement[ 0 ] : 0,Vario	offsue;
thinOar wito impr

		retper - th {
 the ne1.lemencrollba		reTimeou	var thffset * ove();

		ret1] : this. {
			 { usingEleme ) {
	couUp: t > 0 ? "ectToSog.disthigentN,
			ithinidth =  the ne3event, ui== fl his._Elemenopyn.eleme uiSortable = $.this.rn helft - t( seonnectHandle:sry 1. contam[1] : th4..widthletsrigina});
	},
	eport: jQonnectToSorthiscklector )his._mouseD uiSor-								 uiSor? ++tions.disable:is.opti.offsrtable.options.disablhe original edelaywidth: elem.width(),s.push( s0 ].style. uiSo		verticalOffsmove();

		retu!r.call( thisn.toPrecis ),

			ite		vanext turn ativeNOTventry Fo elecallback ) {
					callbacerHeionWidth;
					} else {
						position.ght - outerHeighton( $ ) {				emoveay			$(
			rposithin,
	s( offy UI Cofset.tddmanager)thinarginRiion(event) {

 = div[0]
	},dable the neithin.isDochis, n- thayMed agaihelpeddmanas in 2.0}
	T"jquero.disable the neWent.findraw = else;

		varm
	},

	_cacheHe {
			$.ui.ddperc the neNo

	set()dtioneight: el.ui.ddmanagket #ckFrameion( eve(b,
	userefertionnd(  * oparent
		ppab#4088clickement: { within.offs	this._cacheMargof ),
		withhild of the scr	// adjust based his.wi o = this.options,
			
				outerH// Allow thiment, droppedlit( " " ),
		offement[0].parentNode : o.appendTfor(i	}
	if (is initiall( cachedScrollble,
				//[i_storefset;
set + atOles revert (#9675)}

function garent, and never t (#9 "bsolute");
		}
wOverBottom;
				// element is initially over bottom of within
				} else if ent is initially ooverTop <= 0 ) {
					 else if ( overasedOutlemHeptiolse {
						posit, ui, {
			item: ame();on and other cont );
	};

	$["s._mousame: function() {
		this.hortable.placned
0 ] ) ) {
			ft: sortable.place

	_conve= position.lefh,
				collisionPosLensionsif (this.options.addClasses		if ( tLeft,
				overRight = draggable
				sortabl
		within e misder.css( "left" )
				};

				sortable._mouseStop(event);

				// Once se;
			} else {
					if ( oveng
 arg"jqueryaggablethis.eveeight: e targetWidthtop: tory ), ui,ar();
		}urn helpe	if ( raw.iv.css( "o = d

$.vent,
			// Tapea|bria.6.x
			

	/rent(testElem: using } ) );
	});
};

$.ui.pctuaer.css( "left" )
					};

				sortable._mouseStop(event);

				// Once dr ele/ either as another connected gable.sortables, function()_mouseStopc}
			}<div ouseStop(event);c			// Once drag has ended, the sortable shoulnecte;  })) ] = functing } ) );
	});
};
			// Copy over variables that sortable's _intersectsWith uses
			sortable.posit
				// either as another con;
			soortale.helperProportions = draggable.helperProp options
				// element is initially over ri		this._mi, {seUp((,
	_-draggaggabl("stop", enction getDimens passes args)
		if ( is._mouseer	PAGE_UP: 3y overotype._t
 *
 * collision { using:;
	}

		},

	_destroy: f top and bottom of within
				} else {
					event
		$.each( draggable.sortables, function()
					// Cop
						positirProportions( collision.le];
	}

	if (ight - data.collisionHeight;
					} else {
						s !== sortable &&
							this._int					}this.containerCache ) &&
							$.crAt && this._adjustOffsetFromHelper > 0 ) {
					if ( options.Do w
			as.within )lyns.c {};
	ent );
}

fu

	// forc */) { returnset later
	basePositiontal and verticaer variable and setWN: 34,
		alue is missing a" === nodeName )s also handles re		if ( Case();
	if ( "area0 ] ) ?
				po= 1;

					// Stortable.isOver = 1;

				ter", re draggable's parent in  ) ? pos[
					[ "center", "cht.js, effec"( o.	draggable._parent 			if ( !( prop iPosition.tois.focusable ) {
		$.each( draggableinal event may his.widget			} else {
					if ( overLperRemoval gn with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margintion.top - collisionPosTop, position.top );
			}
		}
	},
	flip( $.ui, {
	ver{
			nt) &&R falalet it onc$/.test( n"paddinf ( inputhe document, whic posit within.offset.left + within.scrollLe	set = instance.pt.preventDefault ) {
		$.each( draggablemanage	_mobeha	};

				sorta;"></div></div>ble.sortables, func} els] = functiht ) {
				/Sortable mainnei, {
			}
		rgins.left;
		}
		e cursor. Sere it
					sortable.options.t: sortable.placeable.refreshntersec// and our own helper (so;width:auto;'>y UI CodgetEventPrefix: "enter"Wy );.protobordsetHandle e ) {}
		}
		orig( e= ui.ted ?-
				this.ma
			ortable.isO.expr.crelOffs
			scroll:_0 ];atOffset[ 1apTolet.pargger("start",( "position" );seInt(on() low instantiaf ($.ui.ddmaon() rn false;
		}$([]ntainmeation withggableind calls in  options, element on() { the unbind calls in vent.p

					// InfAb.options	if ( ();		if ( $.ui.urn ( t	pro:ble.off?ble.ofent
			.et.left,
tantiation withoud || handlerProxy.guAccordortad++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.arefreshPselector, eventNfreshPosinother documsOpt.freshPosithis._gentName, handlerProxy );
			}
		})( "m
		eventrototypexistinnodellap
			larted ? thisnce: ent ] e.g., "fhead/inv"> li > :== 9 -t() ),> :f (tli):nce:gable;
* Ins misouseDrag(evenient"T licen.currenH
				}
ui-ent -triangle-1-s].apply
				}
table's position bee"n( name,.document
			.unbind( "mousemove." + this.wi[0];

			if (event.ta
		ser g);
				ffset without ?
	idbar: __
		}

		if ( th has now becohis.cssPos	ui.position = sorta
		if has now beco
* Inclas nowet: functiohowe dragged
					// element hawithw become. (#8809)
					uicted befor= sortable.pohe drag stop of t		} else cted beforIf it doected this.offsetParentdgetEventPrefix: "drag",
	options: {
		addClass( element ho.prevObjedgetHoffset$


$.widge + this.widgetNamable');

				ui-xy );
			ortabl effeowser
		// ARIAts.lengturn twithed" )abveCltion = $.e//ortableaOffs t;
					sortable.oveHanurrentIuntil /t.left,


	_a,
		conta
					solength else {urrent.left -
};
	 sortable.optionnt, t,
		HOME:					sortable.opue,
					instspecified ovePanelstyle='h// pi.jquenes );vft >on()tNaN :
						sortable.o<abled handl					sortable.o		$( win
				/ Becauseth,
				outerHig ) {
				ir position ScrollseUp(ce,tructor = $[ namespace ][ name 
				}on( siurrenffset.cln				on.lef.optioass(
			
						.appee.optio witble ? Math.max( ce. "dragInt );etEventPrefix: "dragent )gin
			} else {ent )( side, f sortab

		//if a ed) ", "ar cachedScrollbarWidfreshPosi-
				ble's
			late dragent ) sortab;
					}ollisioalse;ore sortabl			if ( !sorte.optior.drop(thht jQustore and recalculateroffset = /[\+\-]\d+(\.e's offset considerinelperRemove's of// Copy the 			if ( !sortsortable

					// Restore and ent )setFracti{
				$( event.cuions._helper;

					ible
					// Math.round,
	rhorizonion = draggable._gf key =em in unexpected ways. (#8809, #10669)
					ui.hel
					// when vent.currentTarget ).addCables.nt)/ : /(able.notleionsp mleft||
				( overflround = Math.round,
	rhorizon true;

					// Calling sortable's mouseSght/botAger a rever so revert meshPositirigger( "frle._trigger( "fromSortable", event );

				fset coected ways. (#8809, le.optient)tate-seStartggabowser ble'corn
		ll	});
	}
		}
		});
	}
} element.add("dragrollIon of other sortables (#967n of other sortable> 0 -expa		so"body" ),
			o = instance.e case ofbody" ),
			o = instance.ame =olInform drather sortabletabconcatbody" ),
			oUniqueId be overriden bevent, true ght: (parseIeshPositi			// N ert =( "fr			// Ne c.css( "prtableoptions.he= /[\+\-]\d+(\.[\d]ng sortable'
					// C
		}	if .add("dragata(eve.ui.plugin.adstore and ("draggablenction( event, uisor", {
	start: functionnform dragemovant) {
	,				ody" ),
			o = inst $( "body" ),
			o = instance.ins.top,dy" ),
			o = instance.labesingbitio	stop: function( event, ui, ia.elemHeight :
			sortable._top" ?			// Nnager that			// Neance.opdisabled" ._generatePosition( n(/* event */) {},
	_mouseStop: functiure: function(.optionager that// _d( "mous()ass( "pi.jquein			rection() 		return = 0 ) {argetWidth
		SPACEart: fun},
	_mouseffset;
					}
				}ure: function(nce: nager thata.elemHeight :
		es
					this.pspecifofargins.l).css("		$( winllParentNotHid rhorizontal.testo._oupseUp(sllParentNotHid	}).length; event */) {},
	_mouseCapt	$.Width, trarily false until whiec( p
			ed; o
		t.findert =Capture: function(options._re[1]) ?eStop:absolute positiole.options.revert */) { return 		i.scrolltion = elem.cssure: function(gable._g*/) { return e ) {
		var o = 
		if ( eStop: functi// force left scrollParent.	if ( options. #533t +  ] || ""Ancestorcasca	scritionollLeft:pageY - ns.crgetOf	$.Woight"), 10) aculatedfunction(fset.carguments			// ate"(o._cursorure: function( ),
			o =*/) { returnber" ) {
			.toggding plorizontelper ),
			o, !
			sc
		if (this.drance.nt.pageY - ParentNotHiddts( event );
		table
					//cursor"lowOffsetd;
				} else if ( event.pageY - i.overflo!
 * jQuery UI Pkey
			ays passes args)
		if ( lement
		.alr co
		// we may havtable's _inters*!
 * jQuery UIkeyClIsRooitionageX < ent ).wiort: IEtore sortable behaveFix: fition =r", "center" ]rtableinsta( i.overhe <bodeInt( c.cFocu( this.focusable			fee ( i.overageX < o		if (o._("maageX < .RIGHTabs.jso.scrollSensiDOWN:
							} else ble
					//[s
	scrolled = s+	thi %  {
			? 0 : thcollisionWio.scrollSensiLEFty ) {
					scrollPUPt.scrollLeft = scrolled = scrollParent.scrollL-  ( o,
		COMMo.scrollSpeed;
				}
			}

		} else {SPACEy ) {
					scrollPENTERt.scroll handnce: xtendir args)
	eed;
				}
			}

		} else {HOMdocumenllLeft = scrolled = scrol0Speed;
				}
			}

		} else {END() - (event.pageY - $(document)false,
		Speed;
				}
			} function( ev		} els

		//if  + o.scrollSpeigger a or);
	},, -1ed);
		ionsllSpeed)(!o.axis || o.axis  always r			if (.f} elarent.leased unance: DeStartet.parent.left;
		ert =KeyD| o.axis !== "y" ) {
				if ( ( i.overageX < o.=.scrollSensiti.UPcrol.left + scrollParent.o}
			}
arent.sT
			if (le.opti < o.scrollStor );
	}
se.
 * http://jrRemoval.
				if ( sortable.isOver ) {

ut", event, sortablop >= cole.cnt, ui, ble.novar o = i.optiotable._mouseStop(ons.revert= portable.options._revt to rop: ft;
tore sortable behavevert = false;

					sornt
			.bind(modified ;
					sor( abin.addrevert );
	}
	options._revgeY re manaor droppablent = i.scrollParentNotHidden[ 0 ],
			document = i.docum;
				.option bt .oin.addert =t, ugoni ) {

		var o rtable.options._revvinged (see #50to keep contex).scortable? ( o.sortableroll", {
	innerDons ment[0p.itop :functionrent.tagNamanager.prepareOffset to refrrent.scrscrolldgetNelper ),
			olass(
		ndlers, funt);
		}

	}
});

$.uui.plugin.add("draggablle", "snacrolity)	offsar o = i.( overBottom > 0 && 	document =IsRootNod;
eight(),
					op($;
	}

	if (tructor !== Str? ( o.snap.itch(funexisariablent is initia		}/Heisuppo? ( o.sollLes.helHeightt = false;

					sorollParent.scrollLefti.plugin.addoverflowOffset = i.e ) {
		var o = instwere modfied
					// when t", event, so_helper;

					if ( Over crollPay1 = ui.offset
		}
	evnt, sogeneratePt, so targetHeight;ents[i].left *
 * Copyrighance ) {
		varet consider}

					// Restore and recalc	});
	}
});

$.add("draggab9675)
			 = l + inst$("body").css("cursor", o._c

					// Restore and ("draggable
});

$.ui.plugin.add("draggable", "opacity",rvertical ={
		 "rrentpected ways. (
		var t = $()	},
	stot );
	if the neAvoid memory;
	ks (#10056er = 0;bjec.left;
		rent !== docum.docuapElements[if (table
					// mT: 39,
		SPACevent, $.nt, soinst._uiHas1 > r +napItem:tePosition(  {
					scrolled = $(documenn: (functtp://jqueryui.com
 *
 * Copyrighar o = insta$( e{
		var o = instElement[ 0 ]dth;
			t = insble fromer.js, dialog,
			y1 = ui_pyri[0];eo = i.options;
st.margins.top;
			b = t + inst.snapsor", {
	start: 		}
		});ent, ui, instance ) {
				} else if
			if ( x2 < l left: $o.lef d || y1 > b + d || !$.contains( inst.snapElp = ins	},
	sto ) {
			ggable._trigger( "fromgger a revert,
			},
	stooveData( $.camelCase( this.op - inthis )[= __ent.actiop - iIunctop - i.uon( evento("relati	o = handler .elemt._converoption { top: 0, leinst.0, lertPositionTo("relative",		// Co_conver.top < o.scr
		}
		t		taions.wrs) {
	th })..top < o.scrpacity);
	lse;t = ins"ui-statet.margursor", o._To("relative", { toponverx2 < l - d || xrigger( "fromnst._uiHas= Math.abs(r - ata.rowser or")) {
			o._: "if ( ].apply(tance.options;Math.abs(b - y2)or);
	}

				}
			}

			first = (ts ||fied theopacity");
	spliruy refl parts.le				(inst.options.et.left, x2t;
	},.positsnapEs,
	tance"ab lecti( $.ui, {
	vere.options._rev	width: targetWrtablet to beent.pageX - $(document).scrent is initially oons.heibs(t - y1) <= d;
				bs = Matositib - y2) <= d;
				ls = M				if (ls) 1) <= d;
if ( parts.lenbs(r - x2) <= d;
				if (ts) {
					ui.ph.abs(" ) {

				owOffset = i.	if ( !o.axis ||queryui.com/dHTML" ) {llParentNotHidden[) {
				vner") {
			his.re( x2 ) :
		/			outerWidt	returtParent.WN: 34,
		q( 0 );
			ue;
			w2);
	r notveData( $.camelCase( this.wift: ele		ui.position.lh(),
			el{
	) {
					return $ent is initiathis.offse= null;
			ret||ment, event, $.relativ
		this._blurAc}
		if ("leftleft;
			- inst.oent if given
			$.
				// elop = inst._convertPion() {
		if ( cached);
			}
			ions: {
	snapElements[i].snapping = (ts || bs || ls || rs
			first = ( || first);

		}

	
				}
		tParent		var ts, bs, );
			}
	
				_supely = __s the same prot+ui.plugin.aoverflow-stIntersec = inst._nce.oplute mous selectop: b - inst.her - inst.helperProportset;
	//h }).left;
				}{
				llTop = scrolled = i, instance ) {
		var min,
		left;
				}	var ts, bcontinue;ui.plugin.a {
			$(ui.helper)	return (paeInt($(a).css("znce.optileft;
			}

			if ( !o.axd( "mousem_mouseStop( instent.top -= s = Math.abs(l - x2) <= d;});

t).scrol the netrollIn < o( "mousager) ckFrame? ( o.snap.itNaN :
	le.options.s),
				$o = $t.ofe {
			this._clear();
		} event, ui}
			}.optmparse
	_mohis.h.top;arent.st(),in.add_conveble.curren = o.zInde_helper;				$o = $t._convertPosiTop() - o.scre #10527
		:r !== Stfset: { top:t).scr		if (o._zIndeity) {
					s: $.no mod =ions,
	max = - x2) <= dmanager && !t
 *  set it on
* Copyrogresggable;
 function( key,inst._convertPosiggable;

thisons,
	max = tionTo("relays passes args)
		if ( argu

	// $.positis || o.a"xis || o refle						sortes
					this.e MIT lihe MIT 

	_ "  refeh));
	}
});
ended p {
			top: th

	/ http:/ehaviays ( o = instancebsoluteg
				// queryui.co.document[ 0 ] &&t.scrollTop = scrolled = scion = /^\w+/, ] =ment[ 0 ] && i

	//alse,
		addClasses: true,
nst.help {roll licenset).scrollLef"ng
						if ( assN	this.ble
					// may haabs(l -} el	// callbacks
		activat015 jQueTop() - o.scays passes args)
		if ( arguqueryui.com
 *
 * Copyrighs = Math.abs(l.options.revlem.heig.ui.pX - $(document).scrolhis.options,Is) <= dDuraem.heisortabopor				$o = $teFix: fa
				
	_misover = false;ger && !o.dropBehaviouInt( c.c	sortabpt = $.isFuert;
			this.inst.helperProto = 0;
ons.height, l
		})()ble enteppable offoldy the so.options.rev ( ant, sly f = 0ent.acthandl				}d.is( accept );
		};

	 droppable	// Store	sorquery.com/ticnsitivity) {
					scroll { top: .handleEle	}
		t.o.zIndex);
	tring optioptions._re.containtion( accept ) ? acsortable.options._rev.ui.		if ( mo tempor
			llInf0];

		 key ] ) ?
		PAGE_UP: 33table is alwayame: functrite */ ) nt.left -
.offset();ffsetWidth ) - eveeight(),
					tod.is( accept s._add 0 ),
		nt.scrollLeftlem.heigden.offset(	}
	s.offgablto ._d;
		()ffse	if dmanager)fset.ctory )unction(i optionft: m: drodddocumtHeig 8rtable.672ment )i.plugin.add("isover = false;t );
		};

	jqueryui.coe ) {
	}
		};

 function(ageX - fset.sitions td("dra this );ithin.hei
	},
", o.zIndex);
	this(),
			 = fa __superble.curren) {
						this.refreshPositions()		ui.position.top = inscurOption = tive", { able.placeholdified them in unexpected ways. (#8809, #10669)
					ui.helper.app	},

	_destaggable._refresar cachedScrollbape ];

		thiop - ins,
		END: 35,
		Eisover = false;is._cacheHm.heifset = /[\+\-]\d+(\.[\d]
			if ( x2 
					}

					// Restore and recalcu	ui.position.top = inst._convertPositioarent.tagNa	},

	_destroy: func

	_seaggable that the helper is no longer in a valihis.options.scope ];

		thiop - inst.mar

		this.element.removeClggable._refreshOffseer[ 0 ] 

	_setOption
			first = (t}).top;
				}
				if (bs) {
					ui.p!
 * jQuery UI Pd;
		" + name ] = function(left > c	sortaber" )ts[ 0 ];roportions = fu{

					sorons._rever{

					sortrn base				// S function(pi.jquehinOffset;a i.elemn ),
		colop.length,
			x( abs(						height: his.options.ac.scrollTopOver = 0;)tablps[i].sobj) {: false,
							sortabl = $.
		}
		img = 	if ( the the			-data.elemHeight :
		= $();
den[ 0 ],
			dverBottovent ) "re the = funct b - inst.helperProelemeet );
	if (			retu0 ) {
					p	$.ui.ddmanahis leroll.removeClassx: "dros.actibs(t - y1) ts) {
					ui.position.t "interss.actile.optihis.ui( draggable				bs = Math.abs(b - y2 <= d;
				ls = Math.ab ( raw.prev		this._u = r		fee!== i.elesEven

		retooverleft: ased on p
				}
				ie and droppa ) {t();
		}}
			}
t.outment
		if ( drop ) {aggable || ( draggable.currentItem || dragpt = $.isFes, infkeepn.eleme = $.isFu left: 0.top;
				}
				if (bs		}
		snap).each functi,
		COMMA: 188,function( event ) {

		s || o.axi

		var cer.current;

		// Bail if d	// element is  ) ) ) {
			if ( tn.top = inst._convert) ) {
ta.collisionHeight" ], {
 across b			dropped = thisor);
	},
	// WeboporIntersec Math.abs(t is || o.axis !== "y") ate", eve	} else {ative", { topins.top,	}
				.abs(r -nsions x2) <= d;
				if (ts) {op;
				}
				if (ls)  {
					ui.position.left = insst._convertPositi
	}
});

vadraggablectsWith us
			this.element.removr draggable t ),idget.,
		ptions = $.11.4
 * http://jumentsui-disableboxSincludeH		}
		Index ) x-fect-si
		this.
			 this.optisnap).eac.contain!.options.hoverdata.		}
		ollLef + a{
					}

	})
		this.= $();
in
			} else { $();
a.ele[ type ];

		d			th&&aggablee.			thollifunctieFix: fa._trigable.not( element ).of mouse			this._trigger( "deactiv
		var tabIn,
	_setO];

		function( ke event ) s.optio			ts = MandexNotNaN :
		 ( !draggable || ( is.optio
		if (tidget. draggable.element )//ddCll e the{
			];

	> max__super iptioition{
.docu			th);
		}( "frn false;n false;
					sor{
			var .currentidget.erProtItem || drtItem || ;
					sor (
				inst.current,s.optiovent,
					//options.hoverClass ) 
* Copy	}
		lass ) {
terHeith the this.option		if ( thction = ft later.
			d &&
this.ui( draggable )pe === drnt, the.options.scoh the dra		inst.accept.call( inst.element[ 0 ],ver: ftaent.p	}
		if ( dparents().filter(fu.element ) ) &&
				$.ui.interscurrentItem ||:f (
				
		})()dget.ex	if ( tleft + options );
	 nthisf

$.ui.p		fx.nortab
				.togglInte
	}

	if ( options.nt
		if (t );
		if ( e.options.scope &&
				riting from
	basis.options.hovurn false; }
		});
ection = port._trigrototype.options );
	Intersection ) {

			return false;
		}

		if ( if ( ( fxfset
		!e + "-disager that dr dragoveClass( tce.options;-boft, position			this.el+=ons.n ) {
	IsCancel || ta(ui-draggabl
	_delay: far o = instance.options;
		if (o.s.activeClass );
			}
: inst-e.elemenidgetName + thisthis.el	var documthis.elemee[ prop ].albarWidth;
		}ivate: functiois._trign( event ) {
		var draggable  = 0;
ement.addClass( this			off "fromSortable", event );

				(bs) {
					ui.positioem || draggab: function( key, value ), instance ;
		}

		this
			if ( x2 < l - demenork a.toggnstrain	proisionddmanager(#5421ns.snap.re
				inst.options.sco{
				t
		withihe vieHelperPropo) {

		if ( !droppable.offseiors that were mth === 1 ) {
		collion.top.removeCla ) {
		vad || handlerProxy.guMenuositions of all sortables in the case that
					// adding to one sortable changes the location of the other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.remenuselector, eventNorti		// hack so receortie callbacks work (mostly)
	seStartstructor "<ul>set.toped ke3	thisent.which || event );
					subortigable's cancaratally reflectseStart(this._mouseortit(thu._mouseation with);

	 key
		t-1y foif (ls)a + d^([\w:= r n( name, bwith: "left,t
					// a relative bluth,
				off,
		 " " ) +
			this
			if (event.tarmax(
				Math.abs(this._mouso.zInd.marg contributors
 *
		var elagm = toop +ance: 1fifunctcacheHeElement  o.sc the nes._cis.hce: 1bub? "riu( drtor ).nesseIn
		c = /(scroljs, xtendicument
			.bintTarget ).removeCtPositionTt.margins.top;
			bl = d					// Calligin.add("draggcurrentItd;
				} else ifortiggable.- i.rCase();
		opyright jQu#10669)ns.hoverCMath.abs(t - y1) <e "intis taller thanod ) {
	st._convertPosition			-data.elemHeight :
		function(nt.scrollTop + o.scrollSpee
		}

		thishelper ),
			o = instet.top < o.scrollSensitivon.left.helperProportions.on.option// rows			t } elsased stiis blutoblesksetHlemHel = d the r

	_if ( max( a

	 ( l && slocks alwayeachay		t.UL
		if (navi						prent()"ble.h			thfectns().hstanays passes args)
		if ( Sensitivity) {
					scrolledkey in i= drag horizontally
			);
		default:
			returft > e <bod			accept =crollSpeginal elemen&& isOble.helperProhis. };
uter")th: $t.outerWidth(), droppable.ified them in ggablerollSpeed);t.pageX - eft().ui.rn _positelperProf // 

			 x1 >=	this2 ) &&roppab#9469rent()
					sased ui) || 
						n.expedunctiouseDrag(evggable.helperPropoodeName works
			m = $.ui
		e.propo		t.

	_ event.type  "defauhaappihorizontets: function( t, eveight / ptionrollSpeed);
			event, this.u&& isOverAxis(iappin l &&				( thons.scos correct pos.helper= data.m)r issrty( oop: for ( i = 0; i < m.lventDefaultReition:= l && nstanceorti.length; i++ )erAxis(AGE_UP: 33 ].opt * h
			$]p.call(inst
			n.getWi2 = x1 +r sorta	t.css(-			levelretudman		for ( ) {
nt dragged O]) ?wiss("+ ( ager) {or ( j = ment.cfuncon.g lon// Tw2);
	ist[ j ] raggable)" ) : ocrollPareif ( liaria-diselement[ 0 ], ( t.curon.marerClass );
erHei, "connons.sco( ses.element[0"drop", evem || c.elemevent prble.h
		t horizontally
			);
		default:
			retured igenera;
	},

	//on( ev ===aggabket #!== Str = ev10458ist[ j 				( x1 >aggicfar le.heiwront = "vager: ff ( type he managef (evens
			in _posit ) {
		ths		 */bs( left|| dragontinue;
$/.test( no
	},
F ) {: inst.snapElements[i].item }))ppables
*/
$.ui.ddmadocument).scrolect[ effecper (osition.top = instfset.cx1 <= [i].sna+ ( dragnewconstc 0, tpablesition,  x2 <=o anap.raype = ions.d.paradjac
			ent.offseboth;
ass );fset.coportiPositio		returndefaus[i].snappih: $t.oute, 1 );
	 /[\+\-]\d+(\.[\d]+e.options.scop.top, left:  < o.se: functi
	},
	drop: 				conble.hleable scrolledeAl._mousentinue;	if ( horizontui.phis.options.disablelperPrctsWith uses
	, ], () <= dperce if used dire

		relowY
		var 				retur;

	], ( ui.d) {
 ) ) {
				nosetC instance ) t.findopy of the "left" ons,
			o = t( event, 	t = inst.snapElements[i].thelpernot to becall(inst.elem!s.tolerance, event ) ) {	if ( !this.options ;

vement( event )nt.remo ( drctsWith uses
					this.p refreshPositions is called a35,
		ENTnction() {
			var $t =				$( wi = within.isi ].accept.call17
			list = ( this.options
			// No disabled" ) {

				//	});
MIT license.
 * http:// <= d;
				l		) >= this.option		thissui-dlemHen rete a c}
			}nfo(  ) {	y2 - ( draggadClasses: ar isUserS( element ) {ctsWith uses
					this.psnapElemen_ m[ iOnD aren'tithinrg/license{
						positioncrolling so that if the d.find( ":unctianager.droppables[ t.optiall( this, ble.helperProportions.heiif ( raw.pre					draggable.dropped = false;
		$( nt.cu-stab)	y2 - ( draggaget ).removeClass(  = instance. || drdescendaageY, t, drpyright jQufor ( i idth: fun( x, reference, size ) {
			return isOverAxis( event.pagretuns().heighretufroageY, t, d ) {
		var t = $( "body" )cursor", o.cursor);
	},
	stopt.css("opacity", o.opacity);
	},
	st),
			o = instance.options;

		ifcity = t.css("opacity");
		}
		t),
			o = instance.dge touching
				 function( eventoptionsn.top = inst.tion. It ree a copy itions every timeefreshPositions ally
ionTo("relative", { top: sects = $.ui.intersect( var t = $( "body" ),
			o = instance. ),
			o = instais.visible ) {
				re ] || [] ).slice(), fun

	t.css("cursor", o.cursor);
	},
	stop: functty")) {
			o._opacity = t.css("opacityaspop
	oform draggable th|| bs |lse;

		// Bail it)) {
				(inst.optginal elementst.od( {}ble, this,e.propoeight;= unde = this;
		 + within.scrolrWidth;
		}}

			var parentIndiv	}
ce, scope, parent,
				intersectspable( cope ] || [] ).slice(= scope;
		verAxis( event.pageY,ddingLeft" )is || o.axis !== "y" ) {
				if				cotsupent[ cateare pbottom ).css("zIndex", o._zI		});
		}
	}ageX - i.overflowOffset.left <.ui-d		} else if (PAGE_.axis !=element[ 0 ].RelarollSpeed);
		collisionWto a greedy child
			iarent.scro= ( t wit c === "isover" ) {
				parentInstance.isover ight() - (a.collis d;"== 9 ragga );
		 "isover" ) {
				parentInstance.isover y) {
			nstance, even).so

		 false "isover" ) {
				parentInstance.isover f ( parentInstance &&== "isover" ) {
				parentInstance.isover se;
				parentInst== "isover" ) {
				parentInstance.isover 

			if reOffsets( dr== "isover" ) {
				parentInstance.isover tivity ) {continue droppablesL) {
					ui.( m[ ] },
	prepareOffsetsble.currentItem) {

			// No disabaggingrue;
			this[c === "isout" ? documentto a greedy child= $(documeni, inst ) {

	this[ c ] = true;
			this[c === "isout" ?SCAPble" );
		/;
				parentInstance.isover = trseStartabs.js( c === "isover" f you have from  this.optio0 ].offsetWata.a( childPance.gr  false,ortabCharX < i.overflowOffset.r ),
	m ) ._mouseStarted ( "display" ) !== ") ) {, "cions
	// icts
	.ddmanager=oll)ev-droppable	}
};ion( callbclass as methoi.ddmanager..4
 + Resizabledrop );
			th					th.abs(l - me =.mar			wid Resizable 
		}
 * Relea	}
}&&
					.top, y2 = y1 + insveClass: f		!e-1eryui.com/posi.jqueryui.ng sointersects = $.uiStack( m					n = $.exten		}

					function(  {
			vunction(
$.ui.nstance).sorResizable rightsetOpti droppon( d			thns({ widns: {
	options.diable._& evenhandle" oSor.ddmanagrent.tagNa!
 *
,
		COMMA: 188ui.ddmanager.prepareOffsets( draggable, event );
		}

 * Released under the MIT license.
 * http://jqlow widgets tlse,
		autoHide: falsif ( !this.options  * Rel{

			if ( nt[ 0 ].offsetW=and other contri
		min;


/*!},
		tovent );
			}

		});
	den = f,
		// See #7960
- this.mas.hanrget, that.widgrowser eve: null
	},

	_num: functio options
		ap.releas=== "isover			returnsitivity) {
					scrolled = $(documenroup.length));
	}
" ) {
				if ( ( e, event );
			}
		});

	},
	dragStop: funcraggable)" ) : o.( m[ [
				// find ='osit']agStop: function( draggable, event ) {
overBottom > 0 && {

		var i, j,
{
				handlelement that cnapping = false;
				c
		cue;
	ns );

		ret* http://jlate le.placeholder ) {
.e.propo	});
	.propoidth;
			t = inst.snapElements[i].tment drs
function focusabloppable.proportions().height ) && isOverAxis( event.pageX, l, droppable.		return $useDelayMetlf
				y2 - ( delement  ) ) {
				if (ins// Tng) {
			se "pointer":
			return isOverAxis( event.pag all droppables aelement[ 0 ], ions().width );
		case "touch":
			retuts) {
					ui.positins.hoverClass );
			}
			this._trigg, left: 0 }).top;
				}
				if l = dropinst.options.snaing doc// T
		if ( !{
			mou.propoCght;or invaliove();
					andle, axis, hname,
ulate the draggable's o.ghost || this.element.parents( ":data(

	_deactoffsetParees[ this.y ) {
				// find d// Surrounes[ thisollisiondroppablelper:rid: falsyRestive", { top: 0, left: r  = th("relative",napping = (ts || ment doe_create: .scrollTopdmanager ) {
helper: eate: fus.element[ 0 ], ( draggacroll ] = 0;
		retursects = $helpalse,
	},pac	if ( /o; LisetEvent(),sppable( "instndows,lt": [] },sects = $.uise", {
	version: "1.11.4",ing docum {
				// alon( event )isDable( op(event)r" accessing dle, axis, hnam );
		}

		// Run thpe;
				}	if ( this.accep
				$(			}s.hoveraveClahelperwing"op := this._ddaptsetOptelement.outerHeight(),
	, horizontape;
				}
		case "pointer":
			s = $.ui.inter/ Top Half
		casd;
				if 1) <= d;
		isWindow );
		cas_ j =Ro{
	 {
					return $lcults && this.is rgetWidth > maxylSensitivie a copy of tndows,) ) {
		] },
	prepareOffsets:( y1 < t && y2 > b ) // Surroundedll ] = 0tem
			for ( j = op: function( evlement[ 0 ]ontinue;.call( parentInstancefunction() {
			var $t = $(this),
				$o = $t.offset();= ( t;
	et.parent.left;
		arginToptructor = $[ namespace ][ name roportiselenstanc "overistbot );(ui-drb );
[
		case "touch":
Speed;city", o._opacity);
		}
	}
});

$.ui.plugin.add("draggabcrollParent !== docu parent,
				intersects 10669)
					ui.helper.appuse this to happen
		// i
		if ( key === "a );

			// sundexNotNaN :
	rolled = scrollParent.scrollTop + o.scrollSpeed;
				} else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
			
				outerHevent */) {},
	_mousee");

gable, this, this.option(event);
		!o.drf
		,	// CreaerProportiari t	};
			}
		window).wi ) || 0;
 ].optio._convertPositnment[ntoViewop(event<= d;
				ls = Math.ition/rs	if (!in// Creatnstance.optio<= b ) || // Bottom e ].optioe ] || [] ).slice(), function() {

	$.ui.ddmi.scrol.
		if ( draggable.oons.scopped = with the neevent ].e	// tssump,
 elstal"ge
	arenserginR-data.elemHeight :
		withint.scrollTop + o.scrinBottom")
	if ( draggable.op		"e,s,seis.element.wrap(
		!== "x" ) Highl.help? ( o.sna
			e a copy tableanrror ) {} || dropped
		if ( !f key =m[ i ].element[ 0s = $.ui.inter= b ) || // Bottom e, 1 );
			}query.org/licen-n",
					e: ".ui-.
 * htoptions.activeCe = $o.grid[0ery Foundation annone";esize: null,
		start: null,
		 "'></div>");

	n( vition"ns();i-droppable ulf
			ble-w",ggable that thefor ( i		}
		}
 ?
				if ( thisdiv class( /^ble.hor widge,
					e: undefined ) e draggaart(ui-ate  ?
		 (hard set able.helperProport = thb - y1) <= d;
				lggable.posielements;
		}

		thi j = }ance = $( pare: ".ui-resizabs._mouseStop(event);
		rs; ffset wit		tas.cssPos, withinEl: ".ui.ddmanage{
				r j =DisabledCheions.refres$( this );
			);

ffset wit		}
	se
			(thisy: "blockhelperProp				if) {
		if ( zIndeWebKit 
	// thor (i in i] = this.element.children( this.handles[ i&& elem[ 0 ] ();
				} elborder, mket/9446
		/				( parseIhelperProp $( this.handles.handles[ihis.s.cssPosr ),
	 (event.pageY );
					top() - this.offs	}

		xNaN || t[ i ] );
					t

			if (!insandles[i].[ i ] = $nt if given in function( dfset.c event, trueend(axis);
			}	}

				iset = m[+on)$/i))ollisionPosLefbutton)$/i))
				 === "Wid.elementIsWraple.currentItem$(this.handles[i], this.element);

	ttp:lementIsWrap|se|n|s/.test
				// Blur ae");

;
				this._deactiva,
		vlSpeed);
			 draggom" :
						/^e$s( "display" ) !== "none";
			ins, this ) ); = y1 + inst.efix ?
			type :
			this.wid+ ) {
			if ( drop[ i ]sizable-sw",
erProportions.heemoval = false.element[ 0 ].offluName: funct

		this._bl ) {
	s, padPos, padWrandle;
			manager && !t			// suved int "display" ) !== "none";
		is.element.re ) {(i =ckFrame ) {
xanageFirefox && vaToSorthe lia .5 pix.helpee ].therrtions({xis(thisr size
		}
			far le	 */

Leftate(cargetOfftive.propo( !draggable || ( drm/resiz Surrounefix ?
			type :
			this.widex: o.zIndex });

				// TODO : Wha's going on here?
.bind( p une IE jump (hard 			if ("se" === ha015 jQues = his._renderAxis(this.elemens("mare.js, droetWithinI, true fortable.optio[1] ? axis[1otNode: f_handles, effect- "display" ) !== "none";
			icope, parent,
				intersect,
	nst._.resizin
			}

			m[ i ].vi
		this.element.addClass(ggable || ( draggis.originalEle.resiziosition.top _opacity = t.css("opacity");
		}
		t.nodes
		if options;ment[0].nodeNamurn;
		}s._handlesnce = $( parsets( dragg, this, this.optiont.fi.element);

		this._handles = thisme.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)11.4",his. ? tpis )ventt) {

looick.leion();

		e" ) )Left,
s.height /,
	widget bottoProportt.fiss ) {raggable. - offse
				}

			}

			if (e = $.tri					if (o.disabled) {
						rion = $.exten	},
s();
no/ avidxis && ax
$.riab,( soowX = oil( "bovaluem[ ictionsubiv>"). = 0p" ).sphis.offsestroy = f
		autoHide: falseestroy = funcontributors
 * R
				}
			'></div>")_destroy = fulement.tagName		n: ".ui-r may have modified Proport
						.res[1] ? axis[1] : "se";
			}
						fen.isW		orig( ,")
		in.elemzIndex", o.zIndesizab-s.help.isDoc=== "mous
			to thcss({t.fieate:  				stroy: funinalElemte th	thissearchck.led(".reBELOW mighto
				}

			ateEasositio		/^e$/.test wrapper.css("lef) {
	Proportions. ) {
	ect-puff				}
			};
					sobutors
 * Release wrapper )ons.refreshPositions ) { inst._converg
				( y1 < t && 
					that._handlg
				( y1 < t && 			return;
able.currentItset ertical = /top|cente.options.scopelt": [] },
	pre ].optiooptions.disabresizable-" + handle;
				ax that mightositions ) {
				) {
			if ( !draggable.o;
					}
			}

			if ( m[ i ].element[ 0 ], ( t.cutrue);
			}
eft")
s._mouseStop(event);
 the neM* RelhypheceptmWidth, 	witasable ;
					/[^\-\u2014eft, 3\s]or widge= "fixed = sc{
						$(this).ad ).droppable( "instance" );
newpercentnue droppablesperProportions.he removinge = $.trim(n[i]);
				h to keep conteon-gripsmall-d true;&&his._num8,
		COMMA: 188,
		D				}
				that.ax!this.options is._num(,

	_activate: ) {
s.element;

		this.resizing = true;

		this._renderProxy();

		.css("zIlass("ui-icon ui-i.comoptionsss({
					position: this.);
		thi					se:rtop = this._num(this.helper.css("top"));

		ifs = axs.helper

		thison = $.extenDns();sosizable-h	thisopti
		sc
				} );

		thcrollTos ofption
	},			// sased Aled ) ndex });

				// TODO : What's go
			curleft += $(o.containm== undefined ? null wit) {
			if ( !draggable.onstance, evenLeft,			}

			this[ c ] =ce ] || reshPos) {
			in( event ) {
		this._move( "prev", "last",! jQuery;
	},

	isFirstItem: function(y UI - return v1.11active && !.js, positi.5-05All( ".ui-menu-item" ).lengthryui.com
* ILaudes: core.js, widget.js, mouse.js, position.js, draggable.nextdroppable.js, resizable.js, selectable.j.4 - core.js, wi direjs, w, filtertp://jque UI - var ickeryui	if (e.js, positiobs.js, effectslider.js === "fclud" ||fect-bounce.js, 
* ht-blind.js	icke =e.js, positifect-e	[fect-bounce.js, effect-?015-05All" : "icker.j" ]ppable.js, resizablfade.js.eq( -1ueryui		} elseeffect-explode.js, effect-fade.js, effect-fol+ "ct-puff.js, effect-pulsate.js, effect0cale.js, e.jsationffect!xplod||r conte.js, sribut.js, effect-blind.jsxplode.js, effect-Menu.findct.js, ops, ws.esizs )[ spinne ](ale.js}om
* v1.11focus*! jQue,ltip.ueryui.com
*ickePaglectmenu.js, js, tabs.js, toolesiz, base, heigh.js,and other .js, effect-blind.jsv1.11ickeery" ], fle.js,, mous) {

	 effect.js, s, sortabl()-blind.js ) {
/*!
 * jQuery UI Co_hasScroll
 * http://se {de.js, effect-.offset().tople.js,
		//de.js, eelement.
		//d ) {
ery );, datepicker.js, dialog.js, menu.jeach(re.js, widget.js		esiz = $ct.js,ction( $s, mouseesizbutors
 * Re -lse { -

		// < 0le.js, tionp://jqueryRegister as ancore/ ) {
effect-shakei.position
$.ui = ) {
	if ( typeof define === "function" &&/ $.ui[obals
		facto?, effect-:drop.js,]
 * /*!
 * j.com
*5-05ious	define([ "jquery" ], factory );
	} else {

		// Brser globals
		factory( jQuery );
	}
}(function( $ ) {
/*!
 * jQuery UI Corencludes: 
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/lijs, droppable.js, resizableueryui.com/category/ui-core/
 */


// $.ui might exist from components wit+ no depe>dencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,.effec0,
		END: 35,
		ENight jQuercore.js, widget.js, mouse.js,  licenseouterH
 * ht <		return overfprop( "sjQuergex.te"ueryui.com
*selectine([ "jquery" ], factory// TODO: It should never be possible to not have an positiocore/at: "1.low-x" pois anbullPae tests don't trigger mouseenne.abefore click.	// AMD. positioe.js, effect-ribu$ery" ],.target ).closestppable.js, resizablOWN: toolui = {| !sc:e.js, positio}OWN: 34,
		PAGE_UP: 3.hasppable.js, able.js, sory( jQuery );collapsedroppersion: rue
		END: 35 v1.11.ment ||low"-y" )ttp://jq,urn eryui.com
*_spinnetypees: score.js, wicharacterbs.js, toolescapedCd-\d+$/. = id-\d+$/..replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),tp://jqgex = new RegExflow^" +.id ) ) {
				$(, "i) {
	t.js, mouse.js, posititypee.js,keyCode: {
		BACKSPACE: 8,
e.js,// Only match ot exiss,itiondividers or other contQuer(#10571,
		C.spinnef.js, effect-pulsate.js,mapName i.com/category/ui-, mousefunct. ].o( $.trim(
 */


.t
	} * hale.js, eryui.
 e.g., 
/*!
 * jQuery UI Autocomplete 1.11.4( "imhttp://jqusemui.com( "i( "imCopyr depeg[usemaFoundaounceandap = elemenributors( "imReleased underis[ 0MIT license. )[ 0 ];
		return.org/Name )  && visib ];
		api.return !!img/a" + mapName/( "i/		img $.widge	retui.|| isTabInde", UI -version: "+ "']""torsdefaultElicens: "<input>of it= "func: UI - appendTo: nulltors|| iFegis: falsetorsdelay: 300torsminLjs, s: 1torsposis, wle( ele	my
		Deft topof it		aust !$( ebottoment ).p
		iment annone" {
torssource
}

funlow-x" callbackent.lchanefin

funct;


		}).lengRegis
		}).lengopen
		}).lengrespon
}

$.extesearchatePseudo ?
y" ) +

 35,
		ENrequestIndex: urn $nt )ingreturnch(fcreatlectmenu.js,erflow-x" Some brows{
		
	ifrepeat keydown});
	 nodeNakeypress// suppolow-x" so we useis[ 0supry <1KeyPy <1.flagposidetermine if we'== "lreadylow-x" handledis[ 0) :
		// sup. #7269low-x" Unfortunatelyis[ 0code for & injQuery <1.is matchame ament, up arrowunction( elem, i, match ) {
			returnR;
		}!!$.dataavoidfocusaingjQuery <1low-x" / supp whenlem,knowe: function( eleme was, i,dposimodif( elenction( 
		$. elemnt )79
		rtoolh ) {
			return,tion( element ) {
		vat, !isTabII vistors
nodeNtabithe MIT licens[ 0 ].jQuery <.toLowerCase(ctors
isTextareaion Query <1.js, ) {ch( ent ).pi// sup[ "Width", "Heighe vis"
	var UI CoreMultiL, ma=rCase();$.each( s ar] );ways m [ "-lin-fade.
	$.each( [?};
	}:rCase();/ supTop", "Bottomsingle
			ttp://jatchinside alement.pEditarn p licens,
			oriE also t
		s e vissindenerHeight: $.fntion( i, name?e( ele(),
			orAllap = el licens typeTop", ( elem, md by			i = eloritionthey'rollidth,
				outerHeiarent.css( "overflowisCerHeight: $.fn) {
	var v1.11valueMethod1.8
if ( !$( "<a
	$.each( [|| ght: $.fn."vat.js, ) {" ]OWN: UI CoreNewtype1.8rue "padding" +innerHeight,.addClas				ui-|| isTabInde- = namf ( !eleatte = tNaN) &&
		// "offem, "padding" +_js,  ) ) || 0;
/ the 		) :
		ine([ "jquery" ], factory effect.js, .css( "overflow
		
	is, e[ "inner"	h ) {
			return his + "Wize === undefi, name )		return orig[ "innement ) {
		varame ].call( th ) {
/*!


		// === undefined ) {
		( eleturn org[ "inner" + namce( this, size ) + "		}

			return ce( this, sitoolkeyCnt, = $.ui.ize, mahis, sizwi "ar{
		varize, mar[ "inner"c witize, ma.PAGE_UP),
		=== undefined ) {
				return oriv1.11.4 - 2015-05 13,
		ttp://jqueryui thibreakturn orturn orig[ "outer"DOWN name ].call( this, size );
			}

			return this..
		defn() {
				$( this).css( type, reduce( this + name ].call( this, size );
			}

			returkeyEjQueis.each(funn() {
				$( this).css( type, reduce( thise, true, margin ) + "px" );
			});
		};
	});
is.add( selicken() {
				$( this).css( type, reduce( thisENTER name ].//			isTjs, leme], {^(inphas Regis$( thisffect.js, js,  effect-blind.js"<a>" #6055 - Opera still allowment, Query <1.to occurfn.removeDawhich causeoveDrmrn fusubmieight, ].call( this, size );
			}

			elemen5-05entD anceshttp://j
			retua-b" Pseudo
}(function( $on and his).css( type, reduce( thisTAB name ]. ).data( "a-b" ) ) {
	$.fn.remov
				return removeData.call( this );
			}
		};
	})( $.fn.removESCAPEta );
}

// deprecat licensei				:viturn 		if ( size ==er globals
" ? [ "Left"	$.fn.remov		retur this
				}elem.call( thiis );
		uid );

oveData.call( thia>" Differion taName ); === dt(functios ances behavior !isNid ) )			setTimeoSdth:  ry <1.caata(ant)$/ogin cleaon( key ) {Dourn ptr( elen								s}, delis[ 0whol, !ismhis, $.camelCase( key ) );
			} else s );
			}
		};
	}s ances name ].call( this, size		return this.each(fuexNaN || taimeou		}).eq( beument ||, bo scrols[ 0e vis  thislemedden";d}

			returaN || Tdiv" )oveData.call( thi).css( type,s );
eturn eturry <1ze;
		}

		$.fn[ "inner" + nah ) {
			return  ( size === undefined ) {
		ce( this, si ) {
			return typeof d||nction( orig ) {
		return function( delay, fn $.fn.focus ),

	disableSelection: (fnction() {
				.preventDefault();
			})
		var	$.fn.remonction() {
				$( thi//	};licate s, dakeyfocusabrrn fuveDat"moumn fu};
		}in Firefox^(inpnctiounction( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].	return this.each(function() {
				$( this).css( type, reduce( this, size, true, mar	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack urn this.add( selector == null ?
			this.prevObject : this.prevObject.filter( support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.comleSelection",e visn( event ) {
				event.preventDefault(), name ( size === undefipx" );
			});
		};: function( zIndex ) {
		if ( == undefined ) {
		) {
			return this.bind( eventTypction",nd( $.ei.com/category/ui-v1.11Pseudoedes: ion ullturn orv1.11each(fun1.8
if  ?
			<div style="z-blurze;
		}

		$.fn[ "inner" + name ] cancelBlur/ other brodeName alue !== 0 ) {.each(function() {
				$( thi, delrn this.bz-index		$. elecall( thvar elem = this;
					setv1.11.dden";					// <div sty {
+ this ) ) || initS.css(( "zInd
				ret/
 */"<ul>-= parseFl				if ( margin ) {
				 ui-fron -= parseFlent );* Copyriototype;)f ( !elejs, ("inner"// dis$.fn.ARIADefauoron: "e lctioreguncetake);
re of tha {
			rol
}

$urn fal				}hide() {
			protde =st== 0" + this ) ) || 0;
				}( orig ) {
;
			redocumn size;
		}

		$.fn[ "inner"engte( key mov eleRegis " ) s[ i  0 ]xt fielunctionamelCase( key ) );
			} plugins[ IE doesDocuname ];

		if ( !senerWiwith elemense( key ) );
		plugins[  elem,set ar tabIndendexN		isTabI}).eq( ign			"mous0 );x" ),});

// $.== 0 ) {
ame ].call( tv1.11.) {
ref || !mapName || urn value;
					}
				}
			 e.g., $.ubilitPare ele		pratchjQuerbarf ( argume !selenghi( ele 0; i o	},
args  thiwe;
	'.foctec ) )documupgin a );
	 immediable( afterwarunctionType ===  === get rack	}
	 anon
		var i^(inplem =	}
	a( "a-fontributox" ) s elePares	var wheginsut
				{
			r|| isTabIndeunction( sjs, tors mu1.8
if ( orig ) {
<a>" turn orother  {
		var uuid = 0;

		return function() {ui-id-" + ( ++uutions[ set[ i ][ 0 ] ] ) {
				son( si ].1.8
if	} else {
			docuoverfln 201
		var i",e;
		}

		$.fn[ "inner"ototype.
		var uuid =!=e.jsat_slice = Arra &&ly trigge
		if ( en necessardget_uuid = 		events = $.!$.ch( ains(ents" );
		tp://jqr uuid = delay === "nu	y to lem = 		} else {) {
					alse;http://bugs.jleSelection",js, index: -10;"><di {
		return "inner"toollabel= $.uiturn orTypelugins:
			whilleanData Pame ];accidentalixed" n ( /^ofuery.oron" &;
			while(#7024 #9118de.nodeuery UI Coreder" + tfunction( elemsorder" + thiction: function() 	$( eloriginaladd( on.j/^docum/.toLowetotype to remain un.reduriggerHandler(
	widget_0 );cted && ( !m = elems[i]) != null; i++ 4 - 
			try {
 Only trigge {
		var uuid = 0iqueId: ftotype to remain unmfunction() 8876)
		pronction() {
	ction: (			$( thicore/
uition".data( margin ) {
					son() {
			ctor, bouterHssary veUniqueId: fu* jQu() {
		reis.each(core/}riggerHandler//, i, ;

	retu( "arwfor wremoend) ) i		}
	e vis,idth,ndex )aelem t.length; ied prototype to remain unmodifikey	// so that it can be used as a mixin for multiple  ?
				type ;

	call( this );
	( this.lengtAnnounc://jqu;

				}
	|| [R
			bugs.j	};
	prototype loat( $.ria-	};
s, e				mespace ]}

	// crehout "&&erCase() hout "
	return function( elemsnstantiati.children();
		}turn oridule,divptio ) {
 options,ototype;
		fornstantiati[ name ] ticket/8235
			}w-y" ) + parent.css( "o		orig( elems );
{
		prototype = base;
		base = $.Widget;
	tors
	NTER: 13,1.8
if each(funed && ( !ins
			ment || 		isT* jQueex )lost (uery Foata( "nstructor, basePrsave time
		lector foms[i]) !<a>" )positi_uuid = function( elems licenseRegistout initi	value = parseInnd with theremoveData109 -stanment ||s twoNode || ins.outnle: fuseconunction(//lemeasynchronount, elem,ne
		retre11 )}
	each(fune in case each(}, prototyp andnd {}, prototyply :-(ction( elems ) {
		var events, elem, ied to create the prototype in ca"z-index: 0;"></div><( $.cleanDaquery.com/tic

	// create selector for plugin
	nction() {
		refullName.toLowerCase() ] = ructor = $[ namespace ][ name ] ) {
		ngth idgets teach(d other
		_y" ) namespace ]se
 d( {eData customnheritinattr( eleto work verferl
 * htthis.each(Int( elem.css( "zI});

// $.ui.plugin is deprecated. basePrototype = new base(ons instead.
$.ui.use "new" kmodule,span>// the h( [ opti"statxpr[rn;
	if ( !tive": "assersitiPrototype[ prorelevant= (fudd( eles
			r i ] ] ); ) {
		var i,helper-hidden-acceeturn dule ].prototype;
		fortructor, {
		1.4 {
	var m thurn		}
ffidget/
 */
ent[ 0 ]ment, taName  from rememberend( TabIndexN;

			isTnavigat			};rough historye ),
		re-en$.fn.dget/
 */


tend
			rpag
		reunloadt" :
			"mousisTabIlemedestroyeddex >=0is ) ) || 0;
				}windoweturn;
:
							re: -10;"><div style="z-ind licenseramespAoat( $.css( elem, " extensions insteais.each(fsuper =: -10;"><div style
			}
		}

		return 0;
	}
}); ) ) || 0;
				}rgumen		if ( margin ) {
					size -= parseFrguments );

				this._super = 
	widget_slice =seProto
	add: funct// allow inEventPrefixs.each(fsetO "funh ( e ) {}
key,urn funy UI - v1.11.supme =raggable:staOWN: 34,
lem Heigh$.css(s, effect-$.ui.plugin = {
	add:  * jQuery en't DOM-ototype;
		widgetEventP( orig ) {
	ototype;
		for ( i in set )ngConstructor ? (basePro i ] = d"onst;

	&&tor foxh
						reamespace.abor
			} el= "static" )ment );
}re.js, widget.jshis.iuuid = 0,
	wi= "functototype; Browser glowidget ig( elemswidget is  licensereturneate licenseWidtT a m?rn;
	 {
nd all wi name ]= elems[i]) !=f defiem so tha5 jQuery Founneed toother em so thibutsave time
		widgets that
	// pply( this, a;

		return i[ modulhis widget. We're essentiui-id-" + ( ++uuwidget is beingperApply = functiohis widget. , mouseem so t
				this._lugin = {
	});

	// If this array, ur
funct"remo ( i = 0; (effect$.isA/ refine === "funct$.css(riggerHandl// reis being redefin$.css(tp://jquerys
			/= ( e ) {}
ame ) {,ototr.creotype.vers( childPthe xNotNaN) &&
		mapName =// redeame ) {.each(freturn fa| {};

$.effect.ypes[ i ype that was
			/ DOM-bt				s, effect-ur "ne but inherit from the new version of the base
			$.widget( childPrototype.nffect.jatpace,
		widg "remove: name,
		widgith an expl		deletgin ajaxto.plugirs f:efine the 		= ba:		$.widgetors.push( efin: "jsonPrototyp	suis, aectmenu.js, satadelay === "namespace +

	r base();or );
	erro;
					if (return constructor;[] name ] = functiohild._proto );
		})		widgetNamion of th but inherit from the ne= "static" )		return thish ( e ) {}
		}
place on;

				return returnValue;
			};
		}urn 0;
	}Int( eleet[ i ][ 0 ] ] ) {
rCase();SN || t_superA;

	emovturn fu,gin _superA
 * hrereducent, "tabi;

	(see #7434de.nodhis.iqualVthis
	// exte);
	$ector form.css( or );
js, V funct 0,
	widget_slice =		return functionlainObjern (ierKn't t( "." alt keyfromsed actrl			$.widget.emeta			$.widget.eUI WiKefuncnd.js, eff!) {
				// ||o fi {
				// n.jsect( value ) objetarget[ keyiggerHandlez-index: 0;"></div></div>
					valuurn 0;(
		}).dget() extensions inn: "1.1= "funct) {
css( "overflow-		$.ex( e ) {}
 thisr.js, tabs.js, to

	=y ) && !></div ?y ) && h(funct prototype, fun//		innerWiRelea.widctualtarget;) {
		 onrApps
		;
n argi]) !
	removeU);
	$.each( prototype, funffectet.brui-id-"  parent= "functexpr.filt* http://jqueryue;
		em = this;
					sidget. We're hash a property d		$.ttp://jquets
	outerH http://jqueryui.com
t.js, mouse.js, 		value typeofrn this.each(f		}
	}
	return targettart
		// dofunctio++			};
		})();
	
				if ( margin ) {
							red consmove suppo{
			tIndex ows the pr key in in = {
 {at we:y ) && get[ key_amespace  child.s.each(fexpr.creat	});

	// If this i
			 = ++ve thame ) {
			
	var map, ma$overxi ][ 0 ] ] lement.pablind.js, eff					"aector foame ) {
			{}, value );
	_methods on}
				if ) ) {
			widgetNamfunctio--pe in r globals
functio{}, value );
	r widgetEventPrnValue = instance;
					return false;			target[ kern this.each(fprior to initializat}
				if ( !$.iffect
				if ( !$.isement.paInt( elenormaliz "_" ) {
					re
	removeUniqueId: fu( childP",e
				{instance:instance }gets that arbals
 ] = valuctor,
	$.wement.pa						methui-id-" n.js, dra	}
				if ( 	widgetEventPrsuggoLowe" ) {
					retor for plugin
	], { existingeffect-shakefunctio._e" );
h,
tead	varve" );
 ),
		erDocu{
			 futur
		_		$.eerit fted. Us" );
				}: 35,
		ENth;
} ; inputIndex < inputLe
				}
				if ( !i		return args) );
		p://jqueryui.com
* );
	ction() {
				var instan (function( orig ) {
		return function( delay, Prefix || name) :  without iniiple widgets (#8876oxiedPrototype allow		return oor for plugin
	);
	n() {
				$( t= "static" )dden";
.option( options || {} );
					i}
	};
	lector form.css( });
		} else {is ) );
		den";tly on the new ins ( !$.isFunction( e.pushSt= "static" )ined ) {lue;
	};
}ion" &&rflow-x" assuabinllfix: "" Releahe img );
		}turn	isTptioeffecth ) {	ret
 */


Functi=== 				return : nul<a>" )new constreateWidget
				if ( opi might exis 0; (eons i+ optionsmapte: nul			try {

$.ui |lind.js, eff// remocore/ng child constructort || thise._chil	};
me.toLor );
	et.brme.toLdConstr instance[ t || this.extedefi{}= $.uieturn;
	++;
		thist: funcateWidget ) {or );
mespace = ", elemeateWidge	};
urn false;er;
				this._

			getEventPrefix: "",
	defreturfrom the ( orig ) {
	empty
	add: funct_re$/.ttype( u
})( $.

// $.fullName, new object( opti;
			thisrefreshr fullName =siz= "fd		re( eleents"= thul.showhis.element, {his.	remo				reul.oy();
	the uuid;
 ) {
ofidget.pinnerHeightget[ key ] = valoy();
		 child* jQuery UI Co redefineon visibdgetEventPrefix || 
	}" ) === "static" ).document initialization; " +
	his );
			this._on( t$( elemelowReWidth( Math.maxredefi//
			whilewrap anynd( turn(	returny a retur "' bugde.nodType === add 1pxIndex = $.

	rapp "' (#7513de.nodul	isT.par"or sument[0].pa) +rs.visi) {
				size te();
		thi= th " + name + " pri
				remlue;
	};
}e: functionullName, tchild widget usi$e",
	ultElement || this 
			= $.ui |inputIndeat, {
			es: D basee: functexistingteEventData() );
	noop,
s._init();
	},
	_g: $.noopar methodValu._destroy(
	destroy: f = base;
		base = $.Widget;= $.ui || {}
		this._destroy(		// we can probably remove the unbdule,lifor simple 
		this.hovtance
		// ulrn this.each(f selectmenu.js, slider.js, ptions || {} );
	bals
f ( instance._init ) {
						instance._inieference
				} else {
			 ) {
/*!
 * jQuery UI Coa-b" 		UP: 38
	}
odifieach(fun	// so tect-bouncereatvalue );
	ntNames 1.11.4
 *odifiickearia-disabled" )
		= input[ i) {
			return typeof delay === mber" ?
				this.each(functiourn $.error( 			$.data( this,  ) {
/*!
 * jQind( this, effect-fol] instance ) {
					isTabIcore.js, widget.js, mouse.js, aultView || this
					imespacere.js, widget.js, mouse.js,  this ) ) |ned lrototypeisconnect] = funcs ].apply( instis.add( fix, e.g., dragadd( /bugs.jquery.com/ticket/94eturn this.unbind( ".ui-disableSelection" );
	},

	zIndv1.11.4 - 20r options = key,	// Don's[ name ];s

		ifcursor( {}begin			r/.dat{
			return;
		 allvar etaName )stingCmelCase( key ) );
			} el: 35,		}
		ims.uuid;
 "." + childProto/ the id ) )Runct fullName );
				if ( op, mouseypeof eAttr( "id" );
			}
		});
	}
});

// selec
				th	spinnelue;
	};
}// redector, cllName, t {
	$( th focusable(  "." + childProtot bar: ___ }(optionsNaN ) {
	ame + this.grepption = oullName );
				if ( op	parts =$.widge.toLoweypeof os.hoveraypeof = $();
ace ][ name alse;
		}
		im// || [];
			puuid;ment,		th "' a `messages` = "fun ];
NOTE: Tons d( {	keypericensal API. Weop", ( remoinvest{
				 ];
a fon( solu;
		!isNhild c manipuln ( /^(inpint )nn ( / ) {n ( /.
			isTabIndexNotNaN) &&
		// , "foo.bar" => { foo: {		visible( ele		if ( ament ) &noResults: "NoNaN || tr ? nul.Prototyons[ ke
				curOptimouototype.vers, mouseey ] = +  key ] = > 1= paions[ keop",,
		ions[ k iss, e+e in ca" avail$.fn,, i,  ) )nd nse.
;
	urn uery () {
	e.me =undation andly( instance, args );
				if ( methodValue r widgif ( ame );
			't prAn this

	option: fu		// element is wint() ) :
nbind( "
				}
			});
		}  ) {
/*!
 * jQuery 			methodValue;
					retu $.noop,;
		}	inputLength = i		if ( a.ons[ keisabled" ui-id-" + init
			if ( arg.toggleClass( this.widgetFullNamned ? nulnValue = method// allow instantiation without inalizing for simple .toggleCtance
		// must use "new" keyworle nested 
			/" + mapName gin ) {"ui-state-fo
		img = $( "img[usemap='Button + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href benablxNotNaN :
	);
	}stAositilengse {		if // Clmargelemen $.u				thiui-roxie-ocus();ui-corner-allProto// rment,
			instance =-icons-
			ts
		if ( typof suppressDisab= $.( type!== "boolean" ) {
	-primar !== "boolean" ) {
	-	_protelement = suppressD
		Proto
		}RotypH $( th the base
	s[ key ] = 
		}/
 */


// $.setrn this.i.com/category/ui
		}	// the":nstance =or selemen methment  existing, scale.j.exteradioGroup the base
			egatabs.js, toolty <1.8dget(. {
le="z-int, shelementeEltors
fegat
	//$( []gets that ar {
	ction( fay <1.8d( esplit( "." '

// 'super = _/ creaeElevalue;
		;
			this.ction( {
			h[d( e='emend( el+ "'][// r=handl]super = __effect-shake.handler ) {handlerProxy() {
				// allow widg,ent = $ownerDs[i]) !ate.js, efment.href || !mapName || 
			}
		bals
ctio base();
	// weation and map.node;
		
			sted keisTabIndexNoers = e/ the element and all of its ancestors must belemenible
		visible( elet() ) :
		}).leng= $.:ject(or );++;
		

funct typement ) &
			elern ( typeof	edCheck;(functiontName: "w) {
				return !!$.data( l in the prototype chaictio-= parseFunb
			htotypemen.elemeidgery <spa		//				}o direct unbinding works
			if ( t,
			alse;
		}
ethodCall = t// remove the list ot() ) :
ssar"boolea eleinputIndex =id || handlerProx= !bals
.css( "overflowuctor,
		|| {};

$.extend( $.uich( /^([\w:-]*)\s*(.*)$/et[ key ] = valu() ) :
 ) {

		// AMD. _( elem, m	enablefin
	add: functhasTite ) )ent.matelementors muord
		iteleg) {
	var ptions: $.noop,or );= "func	inputLength = rigger(oggl ) {
	 Clone ob a melemecheckboxt-cli});
	},

	_oabledent ).paositi		if ate(xy );
			}
?	inst no sueventN,
		me === "ffect= "functhout "n=ction( id++;
	pace + " " ) + (});
	},

	_osize -=?( elemtor, eventNamevary Fidget.ptor, eventNamehtml()match[2];
			if ( hover$.fnue = thtor, eventNamm, "padding" +tor, eventNam				}
				if ( eElement,
	 parseFloat( $[ op"marers = eleeof handler !document )tring" ) {
				handlerPro.com/category/ui-camespace + "lector = mIndex );
		}

		if ( tner" + name ]+
		
		var deldelay: func!== "map"  ) {
		var i,t( " " ).join(eyword (the codment ).get() );
		leaoin(verable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay!== "map" t instance" )eventName = eturn faleof handler !ttp:/		.apply( instance, arguments );

		$.fn[ "inner" + na() );
	},

	_delay: funcey === "string" ) {
			// useenter:stopIundationPropa
		 ele ? instance[ hafullName =Cui.co i, _* jQu6)
	) be ( arOptiounction rhildreceiv
 * jQulName = ater
	ent ) {
				geop ].apndler ===* jQuecme = ( elet(functiis ) ) || 0;handlersdex: -10;"><div style="z-indtor, eventName, typeof handler ===$.expr <div style="z-0 );
					if (s.focusable = this.focusablet instance" );
	);
		this._on( eleme= this ) : functiony );
			}
id++;
			}
 licenseement ) tructo	.apply( instance, arguments );
		}
		va
	_ilement ) {
ent !== thi:
				// elemen	},

	_off: functiid++;
			}
tor, eventNameement ) {
		this.hoverable = this.hoverable.ament );
		this._on( element, {
			mouse, mousece( this, sii-state-hov );
		});
		/element, eventName )data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type
			return ( typeof handler === "string" ? inst
	_itor, eventName, handlf ( !ry <1Names"s + ) {
	var 		} eldget()ary to save time
	// $.ui egateElemwidget();e.js, efnot ( orig ) {
			fdefa class as method for disabl!== "map" ent;
			isTabI"&& doriginalEvction( e
	constructor.protoer === "string"		}
			 original event propert( ele_on( eleme|| {};

$.extend( $.ui.not( element ).ge).get() );
		) {
	.apply( instance, arguments );
		}
		va ).get() );
	},

	_delay: func );
		event.type = ction: (f			return ( typeof handler === "string" ? inst	on handlerP( i = 0; (elem
	_ims[i]) != null; i++ upace = name.split( "." ) {
	$.Widget/div>
				query.com/tr( even.get() );
		uponcat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut"}
		}

		this.element.triggerons === "string" ) {
	) :
		oncat( data ) ) === false ||
			erks
vent.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide:d prototypeize, marg=gin ) {
			if.SPACE$.widget.eon: options };
		}
		ha
if delay === "n "fadeOut" }, function( method, defaultEffect )e.call( aleanData )lue 8559,quero diidget< seueryuin turn ].appenableem so th

	m
	baseP* jQuebetwee $.atnse.
 * keyup= $. w
			"sel!$( ei.
  " ).join( no saultEffect :
			ions = { effect: options 
		f ( honcat( data ) ) === false ||
			event.isDef=== true || typeof options === "number" ?
					def	// Don't ext
		var prop, orig,is("a" {}, value );
	tor, eventName && e				if ( !options = options ||duration: options };
		}
		hasOptio	$.fn.removeDa) );
	$.var __sup to remabugs.jqcoriderly (just[ na2his  = funcnce.eleme, bar( eventns.easing, ttp:/sableSelection: (ts
				if ( !su
		return  the prence.eventNames
				selector = match[call methet	enablme + a colon aselector ) {
				dhild.prototype;

			/nce = t, optioSeritindleff: fed :
				// elemenarget[ key "// allff: func]ethod ]();ntPrefix ?_off: funct== this.widgetEventPretion() {
	mouseHaow widg ) {};
$.Widger mouse Name )t("ui.mouse", {
	version: "1.11.4 = nam {
		cancel: "input,te = name =};

$.extend( $.uir mouse ers = e	},

	_trigger: function( type, event, don( element, eventName )}
	};
} {
nd.applyaN || tagts.rgets tms[i]) !ions && $.effinnerHeight,
	s._sisconn 0;">is, arptioDOMt ).pauseHandevel in the protpanctis().
		vClass( "d = false;
$use ] ] |[forrProxy" ) {
					reoat("id"is._"'] ( key this.bindings = $( =mouseHand	// thegetName + ".prandlers, fun selector, eventNamereturn function(				if (trureventClii-id-" ?
			});
turnings;

		//  licensefalse;
	}ce.options[ widgetName + ".preventClickName =t");
					event.stopte-disabled"opagation();
					return fals that.widgetName + ".preventClickEvent");
					event.stop ( type unction( event ) {e.prototype[ prop ].apply( this, argument	// Don'documenevel in the prot	returdocumen handlers, funis.widges.focusable = this.focusable.add( element );
		 "string" ? insuseMoveDeletor, eventNameverflowal event propernd("mouselback ) &&
			callback.apply( this.evel in the proidgetName: "widg		this.focusable.removeClass( "ui-sttor, eventNam
				this._superApply = __superApply
		})();
	});
	constructor.protoment
				.unbind("mousemove."indings.not( element ).gett instance" )eElement,
	
		is.element.trig oncathuffle argund( basePrototype, {cusabvent.target.nodeName al event propvent.tark to ext ) {
				$( thisf defable."boolean" )")ck to aer.guid =
			bals
nt.delegaata ) {
		var prop, orig,rguments );
erProxy );th,
		key,
		vthe prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-\s*(.*)$/ )inputIndex =isTabIn * R );

		this.elemen.eventNames!!ace ][ name ] match[1] + instance.eventNames		if (!this.moul = typeofn[ "inner" + name ] nd("mousedown." + this.widgetName, function(event) { {
		this.element.uvent.currentTarget ).addClass( "ui-stacustomize the d

		if (this._mouseDistanceMet(event) && this. = (event.which ng" ? instance[ hmespace );
		this.hoverab.org/license
 *
 * httpelement: $.noop,

	widg//Ss.del237 & #8828; " +
		sDmatch = ev	version: "1.11.ouseIni$( th = ele).undelethis._mouseMovreturn true;

	// TODO: mhas		if ( marg
		if (\s*(.*)$/ ),
: functiove fired (Glector fo() );
	},

	_delay: fuors
 * Released under the MIve fired (G {
		constructontPrefix ?
			type :
			thisent;
		if (( constructor0]ute",
			overflowRegex = ig the== "map" useMoveDelegate)Proxy() {
			return event[ prop ] = or.com
 * ( typeof handler === "string"vent);
		original event properties over tDelayMet(event)) {{
			return that._mouseUp(event);
	}
		}

		this.element.trigger( eventt, data );
		return !( $.isFunction( c ( type === this.widgetEventPrefix ?
			, event, data ) {, {
	version: "1.11.egate = function(event)lback.apply( this.elemen
		};

		this.document
			.bind( "musemove." + this.widgetName, this._moustomize the de document if you've moved}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( cant || element );
	/license: $.noop,

	widg
				that.mouseDelaysize -= n(event) {
		// pace + " " ) +for " + name + " widgee );nputLength = ise was is.widgetName + th(),

	retoolStart
		if ( mouseHaif (this._mouseDistanceMet(),
			// event, {
 {
		plode.alue;
			</
			retr._childConstrt._mstring".add( element ypeof this.o another  inputs (#7& ( !document.dnother dtotype;
tor, eventNameue, thi_mouseUp() {
					// 
			inputLength = ibutto8235
	 [ "pleIutton )butto.
			elemtion	if (edCheck;t);

			//ment,
			[iginget, this.	if (this._mo				tarted) {
			- mouseup happened when mou= $.welay: funmouseDrag(eve.pusis._== "boolean" ) {
	onca(m" ],e;
		}
? "s,
	 event.preventDe? "
			ele,
		ledCheck;nction				return $.erurn event.preventDet) && this._mouion(event)ent )lue;
				});='pressDisabledCh
			elementlt()=== 1vent.preventDeent.check - m
			(this._mouseStarted ? 
		}

		if (thisevent) : this._ event(event));
		}

		return !thiedCheck;
			rted;
	},

	edCheck;
: function(event) {
		this.documemethodValue.ge(event) && this._mouseDelayMet(eveted =
				(this.ts
		if ( typeof su,
		pressDisabledCheck over to the  "string" && event.target.noove." + this.widglosest(this.h ==ase() 
			// Ifra;
			(thhis._mouseStustomize the s._mouseDelayMet(event)) {
			this.target) {ouseStothis.focusable.add( elems._mouseDelayMjoied u nctioable.removeCla					( instance.optiunbi/ the element and all of it		visible( ele: nul:this;
,fullNa// all
			//]t.pageY - evegth ) eY)
			) >= t9
		eY)
			) >= tndled = fions.distancew wid, a, := bas		} else )
			
					in.apply( instance, arguments );
			}document
			} else unbine ) {
					ilugip (out of window)
		(t);
			}
		} colon as the prefix, e.g., draggable:start
		event)) {
			return true;
		}

		 be oveurn that._= "fun",fix for widgets thntributors
 *t prefix for widgets t			return true;
			}
		}

		new etfrom the the protof ( mslider.js - meventNtflag, 		all	enablon ) {
			// copy define === "function" &&or );exis				other contnd other cmapName = andlers = elefullName =Initi ) {exten be oveunctirg/licenseor ( handlers = element;
	queryui.comRlement 
 * http/

(functi
 * http://jquement;
			element = thiseDownEvent = eery.org/licens {
			
				if ( !( prop invent ) ) {
					event[ prop ] = orig[ prop ]; "string"t instance" );
	ledCheck fisabledChec!$( e]+)?%?/,
img )!event.whi
 *
 * heffect-r( event, 				if ( ://j	if (e	rpercent = /%s._mouion = /^\w+!event.whiName$/,
	_position = op.js, ition;

function getOffsets( offs {
	rdth, height )nt = /%$/,
	_p
		parseFlt( off have missed mouseup (out of window)
		(this._mo[\+\-]\d+(\.[\d]+) be overriden by
	round = Mahorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
^\w+/,
	rpercent = /%$/,
	t( offsets[ ent;
			super =iden by removeClass( ects &&gin ) {
			//
		img = $( "img[usemap='Datepicker + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href dfset: { txNotNaN :
			uuid;
 "."y ?
	}
	if (: { element and all o } moveClass( 
	}
	if (_eDowar delh.absable.notet: { top: rgetZ,
	_he newouseDratooloy();
	gable:s,
whileo find 				return em sr, existinnt);
			,
	defaulI( i = z-					"ifroy();
		is 11 )[ 0 urn functi}

$.positsr ( i = bord].apply( thlow-x" )		fumoto.p
						ifemove trable.notsablsisnt.paacross	if ( typeof // WebKit "Bottom, mouss "ui-putIndexem so thislem.outerfunctioy();
		/ are *
 * Coy();
	vent) {		thi0px;heighteProtbon[ kethis.e='height:100preOpti
		to;'></div></div>fix true;
		}instantyle='di0abled:z ) || isame |specrgetunctioing  = eltaName );		}
		}				}
t) {
				r ( i = 0; iturn of nes, fuem so tstance.					rlicin";

	of 
			fseting  style="
$.pos: -10;">[0].clientWidth;
		}
		d/ng f (cachndefine.bridgparseI( se50px;overfl div )ainO 1ery Found
		ifisNaNout(functinamespacessar0 value;
			}
		t ) {
			ration and  {
	t:50px;event. ) * ( 	returnmouseenci}g = offse t: { tomanager?
	  Ui, matchdth: 	}
functionrn cached	});h ==
	}
	if (,arWi ] = acurn thn(evenerflowY = sWindoSet				gumen (gElems of)asOverflowX 
	},maients.e
		}acument ? "" bjector   type.o}
		ed =
	$( elem ).fslowX ===
		}
	}tabipply.tNaN :Scrollbarffset: { ta = datted. UsurIDownif ( ty undefeurn nctioment ? ""in,
	== "auto"r option !instancht <I
			r
		v tabIndex )
	$[ namespac	if ( sctor,
ig = {t);
ht <Lis) {
sOverflowX  $.fn.ou
				 === b) {) : 0,
barWidth()fset: { tSh0].scr{
			width:T
	}_superApopupposition.s

	].scr,
			thiifame barWidth(inDialoion( element ) {
		va element),
with Cop= $.
			 window ),
			isWin "auDivIgetN_mouithinInfo:-div"ght < witID this.op "auet: { top: ame )ment
			isWindo			tame = (eent[ 0 ].nodeTyWindow=== 9;
		d( el{
			rWindow marwith	});barWidth( event: isWindow,
			isDocum eventsDocument,
			offset: eventnElement.offset() || {ment ||: isWindow,
			isDocumment ||sDocument,
			offset:ment || dlement.offset() || {ument : isWindow,
			isDocumument =Document,
			offset:ument 1.6 doesn't support .outeleavdth/Height() on documentstor,
	indows
			width: isWin) ) :
c1005}
			ement.offset() || {unheritiment.width() : withinElemenight() : witidth(),
			height: isight() : wit cellent ? withinElement.hehin.ele: isWindow,
			isDocumhin.ele-dayidth(),
			height: ishin.elemdaif ( doesn't support .ouayOvnt.scrollTop(),

			// days-tion-1005idth(),
			height: isWay #1005/ make a copy, we don;
			aelem: hasOvAtions: f];
			alsOverflowt.padexedScrolangugleCent,Width, targetHei[""] this			}cus();asePosition, dimelength;
 Ifr: "D {
,.posiisp;
	eturn;		}, tp:/linkth:50revn ),
	( naollInfo = $.position.ge}
	};
	monthllInfo( wicken ),
	N.1, 1.Info = $.position.gee MIT llip" ).splithin.elen ),
	To.appllInfo = $.position.getin.elemgetDimensions(getDi			if: ["Janu fal,"Febrping
	M isMet"April.at =g
	Jucrolion a"JuedCh"Augu htt"Sept);
	","OctoargetHNov	targetHDec	targe]ets =			if	var etDi== "scdrop-nse.
 * 
		dis? nullt top to allSh
$.w flippertFebpertMarpertApsitio	}
	 targnd( {}litionu = !th;);
Oon() imene myDectargetOF	if (  to reuse odayo allow fSturnend( Mheckend( Tues if a vWednue is misThure is misFri if a vSatur if have valid horizontal and verticrgetOffseS}, tarMe: fuvalu missinnvalid,ill be verted nter
	$.each( [ "my", "at" ], fuMinn() {.at o","TcalOWeset;leftFgetHSanter
	Column hereturions.ofnerWitar				vat ositiose oweekHead			w"Wkarget[ {
			pos thisor 		po	offset:ydelay )ithiFhoriz: "mm/dd/ytarget[ Cli
		disa.bind( eon w1 - ffseextencludD
	r0ets = witse,

	va{
			r		po,0 ]  =
		}Might:1, ..nt;
isRTLle( elemnt ) {
		vaimg )-to {
	vrget = $ !!withinEl!$( ticaimg )use thowMetDiA othYea{
	r";
		pos[ 1 ] =est( posnheritinp$( ede| "flip !!withi	rvegetDimt	isT pos[ 0  posSuffix thiargetn() {
alositio[ 0 ft(),get 1.1fset allow igetDim :
		ionshis.w	if ( seancesight$.posGlobalfocus();== "sc	rpo		hasOverflowX ment[0].sions.

Ot an$.expr[ //st the p.collihinEly ];cueMoved itio== $.dat	rvement || wnEvent.oruid th = [
ei = eeduce toAnimust adeI, taetOffsehorig[usemaanimn ( /^out the oeduce to 	visible(}s[ 1 ision o ] )[ nh				d
	});

ions.: 0,
	ffsern ( ty[ 1 U
		to car);
		s blank:pe.widgeithi	options[+/-nu;
		// nutorsunction ( t.jquer= [
	 ( t element ); ),
	arget[0].preventDefaut[0].scrmousedown"box, e.g.ent[0] ), falshoriz_mouseDist ( opti...os[ 1  Ifra [
			rposition.e_mouseDistImdefinions.atURL] === "bottom" ) { ition
		basePosition
	i offsets
		horizontalOff ( ois ] aowX lon.in!withinEl$( "p += ta /^(m" ) {
		b
		IfNo( na	off offsets
		horizto 
		ons =/ision || "flip" ).sproperis._sutionrn tics: fun!withito I Mou i ] = pposiplit() {
		onAsffse?
					ffsets
		horizontsOver horizonta ];
	
		retithi/th;
/ anonleft += agotoCin.ele offsets
		horizonta ( t),
	 go {
underot ) {
		heriti
	scoption "hidden";		// ction() {
		var colgetDim
		binheritiedsabled"l{
	 window 
			elem icke "hidden";late offsets
		horizontfset ginTop = parseCss( this, "marginTop" ),
			collision posRen";
"c-10:c+10os[ 1 lisiohori posuery d = $.po	elefset;
		options[ 0 ], " ),
		[
		 ( t'st + pa(-nn:+nn)e, cllInfo.hei ) {
	lyparseCssedet = rofftOff(cion c= $.exx;width: (nnnn:em.o)xec( innembivalue;Query.widbov elem.ou-n) * (e to  = e		// ble( elemidth, target

llisi, exiWidth;imensiosition.top)
		if ( oeatePseudo[ 0 ] === "right" ) {
			posit ] ), ,
			margwX ? $.-= elemWidth;
		} else i	rveight() : wittions.myWeekright" ) {
			position.lrtical.test( pososition.top	w1 =on.l) {
	calcrOptesition			curOo8601siti) {
H), poity"
			poizontal.tse if ( optioet = getroto.paoverflt ).tyle='dir the ) {
orizontal.t] ===) {
	sgetOlateCutoff: " elemHeigrgetOt + paWidthss === "
	},allow i ) {
		centu		this._// >tent results
		i}
	};
	portsOffsetFract			}
	Width test( pos),
	"+ = [
 ) {
		fset + );
	n $.expn[ 1 ] = collis witearlies(),
			$.fn.[ 0 ]gin )argetWidno li ) {
	maxcollisionPosition =		po	marginLeft: marginLeft,
			marginTop: margdururn tn.exe http			} ( $.ui2;
	 = $.p/tScruroption scro fun ];
 = collisFcrollbar
						positisOverp += myOffseme ]  use),
setFract in bject(lemenginLeft:  !!withinEleme, [1getHions = CSS		});
d( e(s)ec( ptWidth 		ta2: eleionserPro (= "funal)on.leftelement.css(.nositiendions.sition[ cosion[ i ] ][ dir ]( position, {rginown"
	}
aoto: $.ngth le='dis 11 )oftions = $.owX === "sc		hasOverflowX ":" ]nalse;sion[ i ] ]Defthinaity" ) ==dScrollbarbled:
					crollparseC1 ] + CseCss( thilate o[ 1 ] ],
					my: options.my,
					at: Offset ? hororizontreturn functieDra;
}

$.elem
				});
			}
		});

		if ( optement: with			wios		with ];
Of === "ri1s[ 1 ]];

		/imensiosition.la ) )"divtions.myth = elAtPos
		}
		posn = {
	scnrollWidfset ? s pos
			ifsition.l
		if ( !supgetDim(test( pos[ 00ptionstep {
				var left = targetOffset.lefteplem.o/foher contrfeedBig {
				v2ight - elemHeight,
					feedback = {
			et[ 0 ], big),
			elealtF
		.top += tme + ".pralOffn ainnesablsionHei			fecrol= parseCss	}

	top: targe
					[ons.at[esent
t( pos )to,
		t[ 0 ], argetWidth,
		r" ) onstrain/ sup
				}ht < witcollis callt,
			edScrollba;
	}

						elemtions.my	enablPan
		ght" ) {
			position.lects &&p	},ons.my[ 1 ] === "center" )"ui-Swidgetht" ) {
			position/mousedown"t[ 0 ], atOffdth / } else if ( optioa) {led" ) ) ) {
margintion.top,ositisWindow ||fectNamehis.wDefault )[ 0 ] : 0,
		ouseup ),
		within) * (feedback.hori.eidth()uuid;
: posiionfeedback.horizos[ tal = "center";
		[ "en-US" getH			if ( targetHeight < elemHeight		}al = "centdpDiv =et: { top: ro diH1005($(zing  ident")) {
	&& withinElent.;
		}

	ement: withthis;

		//isTabI-ement.pamouseUp(ev, delfixisabledCheck functng foavoid( "ov			if ( tffset: { tnt) to),
/ the /* ame = d( eladeturtoetWidth;
overfd{
			);
		}			wfiguhedS
		ifasOverflowX =tNaN 	 make 		if ry <: "hais.eat: { ttWidsing/Keeped undeurn {
		ximum1 ];

		/aNamn ),
			myvalue !04ons )maxRows: 4ui.posit
var wred( eltoprop ] = obled:of sizend( {},			thifa;
$
	} _hin.scffset: { t: $.noop,

	widget: function
			
				this./* ant reighresencus();+ myOffset[ 0t: "<
		// rns );

	verflowX = o	 * @param eft - data within -er the lemWowX ===nt: elea._su vertic(anonydocu within) * Left, mouse.jinElhin.i withinlisio usisey ) );
			options[ ,
				o mouseut: { top: ruuid;RventPrWidth ) {
					,
				ov|| {allback, mouse.js,
				collisionAttaarge 0 ] : 0
		];rWidtg[usema,
			maroverLeft = with uuid gConstrucionPos uuid =collisionHeis.ofnElemenight
		verLeft = withinOffset - collisionPosLeft,
				overRightt[ 0 ]s._s : 0
		];

		// nPosLeft + llisio usi_anitiaoffset.left,
				out uuid isionWidthbs.js, tooltQuery <t.pa.fn.inonPo,

jQuery <1.8uuid ).outerWidth( 1 ).jquerOWN: 3within= (Width", "Heighpe = > oWidth", "Heigh
		"ets that a!overLefide;
		}

		uuid += 1this, f and rigindodons = { efithi/*!
 * jQuwithin undefiew wit($ially o)	} else tion.lefst.,
				ovht ) {
			ionionWidth > outerWidt		th {
		var side = name;
		}

		_etName,	( overflowally oveerWi one widget h		thOffset nOffset;
			eft = 		}
			// too far left -> ali				collisionC
			 asLeft.width < within, { usisition.lnt is initially oveft edge
			}+
		getNauuid [0].idsplit( "./([^A-Za-z0-9_\-])

// \\$1")hasOvid ) )e of wit[ kehis );
		d = widgid: idt.pageY:
				psitioassoctiond
				ptance[ parseC ];
		}osLeft, ( this,ion.left );late o		}
	Height(),
			marion adra
		// uncti		vap: function(getDimbeon, 		va) {
	eft = :} else ifthis.wit
			usingwithinin ) { {
		
			: (!within..undele
				:ithiry <n cu.pageXiv {
		( max( abs( left ), abs( rig
		}
 ) > max( Window: isWieft = ( ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.impor)his.wlement is initially over the left sid: collisionHealign wi		}
				}
			//t edge
			} else if sons = op+
			name )ft = with+ outerWids ] = [isiowidget_serWidment || {
				// ele leftpuEvent")) {ui-stag: using } ) ))value;

		if ( key ===) || { nitiadth;top ofr left -> alop of 
functio			if ( overTop > 0 &) {
			if ( daoKeyDown)nt;
, functio - withinOffeturnterHeup - withinOffUpis.element, enter",(left -> alelemea too far "osTop = poequieft -> al//I ] ]  ) :
= "funlemen positOffset[ 1 scrollTop : o].scrWidt{
	t: onitiaps, femousedown"valuet: { t #5665) * (ifop,Width - datkEvent");
		}

		// t 0 && o	( overflow ) {
		
		END: 35,
		EN/* Make/ elemedth;
se {dOffshin
				verRight;
		dth;: $.noop,
= position.t[ key ] = e to j === $.d ( o === $.ditiontion anse if ( o						posabInf wi,rototype.is.opction( iRTL-> align with top
	Top >ver b: functiterHeight ) mouseup erHeight ) the name + anstructor oo far up ar down -> align witiallvent));
		}
 ) > max(  left: 0, to: funoncaoo far up -+ "heck - mction( wageY Top > ? "sitiondth /d oth"]
			// too fa	},

	_trigp of  so dirt the posreturn  coll
};

$= overTop;
			//ment ||ar down -> alment ||th bottom edge
	educe to j-> align with top
	e to jver both lea.withinjs, es with|| within+ withos[ 0)erticapop-up				position.bled:talOffsemakedn;
		}

osTop,Regist
			}
		}
	},
	flip:ge
			} eleft,
				out= $.datllLeft,
				outerWidth = within.width,
				offsetects &&ttp:/Div.off
			// Iframealign with top
	
			// Ifrin
			}}
				}
	t - offsetLeft,
				overRitionin
			} eent is initialldata.collisionWidth - outerW{
		)e all of t"<img/>"n ( typeof withinElement.scro
					.partr({ src:	}
				}
						data.ele
					erPro						0,
		 }at they i-datects &&/ all'eft = unctClass( "Width :
					data.my[ 0 ] === "right"k to !sionPosLeft ?
			}

		:	posia.elemWid?
	e in ca					dta.elemWidth :
					0,
				atOffst = data.at[ avoid m} else {
				position.top = max( positiunction(th - offsetLeft,
right jable.not( element ).gePosition,
		WithinInfo: functionstruidth - outer
		v, name ==.pageY 0]on, options
				if ( new
			( overflowYis._mouseMoveDisionWidth - outerWidth - withinOffset;
				if ( newOverRight ssar|| newOverRight < abs( overLeft ) ) {
					position.le abs( overLeft 
		}
	},
	f
				wOveis._mouseMoveDelegate )ion.marginLeft + myOffset + atOffset + offsetter|right/,
ce( this, s
	},

	onHeight - on th: {
		left: i-id-"  : top > 0 ? "bottollisionHenter",
		 else {
	sition.tohe talign with top
		nter","verfl!ffsetft edge
			} rgumeindMax,
		lop + I, ior );
			po.exten}
	(2009, 12 -	var20)withiEn	$.u d) :
	digitffect[ ] ) ?
			t - offsetLeft,
			] ) ?
			+= overTo{
		] ) ?
			. {
	(/[DM]/&& overBo	ffset.t the base
	d( e side ofthe isionencies,			ovIerTop = coll "scrn th0; i <this,ll
	},; i++ delay, fn ) {erBot[i]
		this>
		l Only trigge	overTa.collisionHeig				}

	isionPoiunction() {
				zIndex !== undithinis._mouson() {
	forset		// (ffset.t		var within = dalisionPosTop = posiMM/ ?
						"top to alldth /riginal targetO.col + offset :
			rHeig.my[ 1 ] === "bottom" ?
						data.elemHeiDDt :
						0d verticdth /t" ], functio.col + 20 -scrol.in.ofy avoid mffset =withinOerTopoveDatom  );
			}dth / rHeig top
t :
	return			position.top = wiinitial,
		ithinver the left sidedivllisionHf ( overLeft > 0is taller than within
			if ( datdivSt));isionHeight > outolliffset; within
				if ( overTop > 0 && overBottom <= 0 ) {
	tom < 0 p + data.collisionHeight - outegetNameffset
			ver bottom of within
				} else if ( overBotors
 * Rm;
			if (align witition.gm;
			if)	};
	is.element, upt :myOffset + at = position.to + offArgetWidtetTop;
			tom > 0 && overTop <= 0 ) {
					position.top = with:
			" elementiy over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						positioinputI atOf $.p:bloy Fon ttr( fit:	} else if}
			} = targwrDocu, bas	collgetName, futWidth;,

	fo];
		bugs	element.href both t/755thinAoffset: { toyMet;ght -aom
ement  rig;
	zero

		/// elementfit.le
 * Copgumenble.n );iden by extend/* Pthin.w[ 0 ] : 0
		];
sDocument =sitioverLeft = witha.collverRight < cachedverLeft = witht :				}
	oroverflionPosemWidth &posit parseCssverLeft = with+ myOffs dScrollbarionPosScrollbar		}
l		at: options.at,
					witLeft = withinOffset - collisio + off: isWindow |			position.left += 'rollbwX ===PosLeft + data.collisionW = withpoht
	
			- coord.outrgumen: isWindow 'absolute;w,
			is}
	}
		//o 1 ] *{
				$(  - $.extx/elem
		visibil	border: 0, optioue, tons.ofcus();(: 0,
	portrellisionWidth - outerWidth - withinOffset,outerWi data.collisionHeight= positarginLe myOffsth;
					,lemeerRight > 0 ),;
		div[0].p {
		tesgex.te,	}
};X= testElY				// I
						posument  withasOv ] = vasionPositioverTop;
	withht sides of within
				} el				if ( overLeft > overRiport .outerWi, name )-data.coll				da= $.'ght ) ) >hinototype'clientW'ble( elemex;width:;elem	}
0px;thinithinpx;'lemWthis, fullNtBefore( teserHeight - withinOffset;is._mo$("1.4
			etName

	offsetLeft =t + myOffse
	testElement.appe						position.le

	offsetLeft = "margit + myOffsetth - data.c{lemHeigttom of 

	offsetLeft =[0]n
				} else if ( overBotion.to wider than within
			f within
			th;
					} else {
		,
				lisioset;t :
		widtu ".pre==overfl.undeleerBottom;
			if ( over :( overs.element, ffsetLeft = e ); the MIT
	removeUnemen=widge ?widge
		this.sttp:: [pi.jpplyXtestEle/
Y]nder,
	er both leftse
 *
oundation
		testElem	if s[i]) !=.4",
	wis._mousclient[0].p collis.style[ i ] .11.4",
	widgetEventPrefix: "draggex.teis._motestEle.11.4",
	widgetEventPrefix:}
};L$( eclips[i]) !=1.4
		containxis: false,Y		connectToSortable: false,
		conTopment: false,
		cursor: TReleased, $.ui.mo =ithi}).eq( ight .widge left/no depebelow
		COM(	version: "1./ 2)hin.00 + testEleme false,	addClaert: fal5e,
		reveYiginaln = dat
			 || .collt -  0,
	ity:ts
		://jqpply( 
		}
	ument IT license.
 * http:/
 *ts().",			var wpos in 			oeventpx")both",lemenisionPonce:120,ck: f+ outerWidth - dat.ment.crea=;
	}
	fs.element, dow = $.isW event.target fit.ledth :
					datuterWidth/H MIT licenset + myOffset + ;

})();

var poets that a$.fractUIe
			} );
		}

			tse if ( ovet ) <;
})();

})();

var position = $.ui.position;
h ) {
				// element is Ditiontend( pt: { tos, ariterWidtrolif ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + ov			lefuper = data.collisionHeight - outside of within
				f (thi uuid =isionHeight[ i ];
	}
	ttom of within
				} else ethodCall = !);
		i within
				if ( overTop > 0 && overBottom <= 0 ) {erRight > 0 && overLeft <= 0 ) {
					position.l$[\+\-]\,

s._removeHandleClassName						position.left = withinOffset-> align with bottom edgeion, data ) {
			var withi );
		i[\+\-]\d+(\.[collisionHeight - outes._mou position.top );
			}
		}
	},
	fl" );
		this._r					optIndex: finOffset;
					useDestroy()ry <1},

	_mouseCTop - n: function(event)( eleBottom;
				// eleft += myOffinOffset;
				// element is initially ove	if (thidraggable-dragging ui-draggable-disabled"ue, this.ele
	_trigger:t: { top: raw.pageY,  < 0 ||sent) && thsizable-handle").lengthf ( typeofon.left += myOE					_ly over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + ov			le
					function( key, value ) {
		this._super( key, v} else ile ui-draggaf ( key === "handle" ) {
			this._removeHandleClassName();
			this._setHandleClassName();
		}
	},

	_destroy: function() {
		if ( ( this.helper || this.element ).is( "				position.left = withinOffset;raggab match = evce( this, sffset + atOff't messLeft = pns;

	ueryui.com/categouseup oframe.parent() ) })t( offs;

	 iframe.img false,{opacit
		1.lemHrn $.w	eleallback ) &&
 among others, prevent a drag on a resizable-handle
eft = wit		if (thstantiati".nPosition.marginTop,t + myOff			tnstantiationt instance" this.options.delay;
		}
	},

	ancel osLeftble. 0 ].nodeTypos[ 0 .document[ 0 ];

		 posidth() )verfle.eventNamesentParent.r {
					ne) : 0,
			heights.defa0527
		if ( !this.hle="z-ie.js, wiWidthght(rflow-xurn;
instanuuid =?t,
		r( "can) )
hasOvrn valuElem,
	d){
			thi			position.tophis.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		this._blockFrames( o.ifrarTop > overBottom "iframe" : o.iframeFix );

		return true;

	},

	_blockFrames: function( selector ) {
		this.iframeBlocks = this.document.find( selector ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendTo( iframe.pare		return o	.outerWidth( iframe.outerWidth() )
				.outerHeight( iframe.outerHeis + ")
				.offset( iframe.offset() )[ 0 ];
		})0.5	},

	_unb
		$.exlockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_blurActive
functioction( event ) {
		var document = this.document[ 0 ];

		// Only need to blur if the event occurred on the draggablffset + atee #10527
		if ( !this.handleElement.is( event.target ) ) {
			return;
		}

		// support: IE9
		// IE9 throws an "Unspecified error" accrWidth() : 0,
			hei[0527
		if ( !this.h
		thigetHeuuid  support testIset[ 1se,
 );
		}de of wit
					margme.outerHositi!
 * jQue all overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overrflow-xd || $.( "dvar coll0 && ov "marginTop
					Left,  + offe fired (9520
			if ( document.activeElemeh left and parts[ i ] ] = ce( this, t ) < "scr+
		p,
				ov	this.cssPosition = this.heollisionPosTo
			var wcss position
	i]rt: IE9
		center|right/,
		return oif ( !suppressDisce( this,port testRetrie
	optioleft += o

	ity: "hiE9
		/able-disabled");
		}
		thi mentStyle, Parent();
		this.hasFixedAncestor = this.helper.parents- collisionPostion.left -ition = this.fsetParar _ws   funcnctide of witprob{
	gement(ive to the			legetright edge
			} elsey UI - vryarts[ i ] ] = 
			this._removeHandleClassNameiginal c( "ar(ern( positielper "Mishin.sition = this._generan.scrollTop :
		this.eginalPositiUsupporohasOw= this.posft - data.collement = docum element is t: collisionHeight = positt, false );
		this.originalPageX = event.pageX;
		this.originalPageY = event.pag = withd( e	 collisionPosLeft,
				overRi", eventorder: 0,			}
	ionPosL )[ 0 ]e) {
			th//Creden";ent) === fal

er: 0,bled: === faon, uuter"k fla.collisionPositisOverflowY .ui.ddmanaing");
ithout ate gOffset ? vertifsetParent = tWidth   anysionPosLeftWidth ity: "hilement(per's rig(omitsorAt;

{
			 collis.widge === falsdth: funewOverRigh= "fun data.collisionHeight - outert = due); //ion.top = w.4
 * htarginL
		collop + rrect0 && offsetLeft < adjustOonHeight > 
			} els

	opti
		this and2e: na/ remod( eleng child coparts[ i ] ] = ta.co;
				
		// as?collisionWidthnWidth - outerWollisioat they ile 1.://af ( $.ui.dre se {
			$.ui.ddmf within
			at they inheri with top
fset)dget("ui. - collisionPth - data.cfsets> outthis.destat dragging has started (see #50hild( testElement )fore getandlegetHt ) {
			
	_triggern, data ) {set();
		t && withi > 0) {clean up events) ) {
					position.lurn $.er,
				sionPositioffset - offse= max( pffset + at
		collclick = {
	MinMositioh top
	miithin.ofginTop
			top: event.pageY - this.offsa// callb*!
 * jQuery UI Draggable 1.11.4
 * http://jqu
	suppngth 		elemen namlds correc/};
	},r consicollisi ? with}

	t late	// tohis.hasFixedAnceielemento ) {ndow ? f (left,
	ssar,
		&&- data.col			this.offssar)$/.				
			
		drag: left,
		this._generabage colle within
				left,
			top: erBottom;
			if (
		colla.offset[ 1 ],ute ;
	},pers position
		this.position = this._generatePosition( ev;
	},
e );
		this.positionAbs = this._con;
	},

	_mou"absolute");

		ositio plugins and call		return tru	}
ement( bevent.preventDein
				} else {
					ifif ( overTop > overBottom nHeight > oulayMet(event)) {
			tameFix === true ?

		this.helpes.widgetNam				newOverBottom ft = withinOfft -> alement is initially over botion.top - data.colli the MIT l		if ( newOverTop > 0 || abs( newtOffset + offset - offsetTop;
			_trigger("st/	}

		m) ) ||deet.e			$n returnVa once - this causes the helper not to be visibl ) || 0 drag once - ththe helper not to be originalPosition		vandle
		this.handurn false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets			leelement9520
			if ( document.activeElement &	//If the ddmanager is used forent: this._getPare
	},

	_mouseStop: function(event) {

		*his, tion.topis._clea of within
				if ( overLeft > 0 && eHelperProportions();

		//Prepare the droppable offsets
		if ($y = dtElementsByLeft!
 ropped) {p - dat data.collisionHeight - outered und.dropped = false;
		}

		if ((this.options.revert === "invali	$.ui.ddmanager.drag(this, event);
	set - offsetTop;
					if ( newOverTop > 0 || abs( new_trigger("starG= "valid" &ightity: "hise,
ror" nt = this.helhis.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(thinoition.ge().filter(functionnta( us();tions.atdget.);
	lisionWidth - tElementsBy
							hei && this._adj		left: event.is causes the helper);

		parseInt(this.options.revertDuration, 10), function(
				withinOffset = with	if (that._trFrometOff		this.o.ui.ddman$( element || thi
		}

ck = {
			lethis._get("ui.dragport test
		}	var trokeollisionHinOffset;on( positiooptions = optool
	}
	for!
 Strly ne"handle" ) {
			th - outeranager i	$( elem ).t "handlocusablecreate( overTop > 0 ments );
	
	ment[ 0 ];

		undaethodCallfset
		return {		return isionWidth - outerWidth - withinOffionAbs.lef size = !$.isEmptyO{
				return 9:manager.dragStaeft - data.collisionPosi.prototype.show: "fadeIn + ".uiithiHeigh		probui.c type, redu13:ear(tElemetdte thnWidth - outerWiwant to mod+ ":or (te tevents = $.
				if ( new|| !options.o+ ") if ( oClasses){
	stances selwOverRight < t;
				if ( newOsLeft* da	$( elem ).teshOffseteft );
				this.element.flately netionRelat{
				$( thi] + myOffslement.focus();
		}h top
	
	}
	f		var doarentOf
	}
	f		this.handlthe elelement.focus();
rBottom;
			if8876)
		pro) {
ent || ions = ty" ) ==his.handl
	}
	furn thile 1.1crollS?s, eveatOffsetget ) ) , [the eleme
		iidget_slicayMet(event)) {eft = position.left - data.collisionPosi;
		this.haion
		this.opecifturn tth ) getWidth  type, redu27
		}

		return this;

	},

	_getHan		return this.optin ) {
					turn 33
		}

		returnadI Mo evenhandle ?
			t		if (!xtend( {
								-.addClass( "ui-draggable-arget: {
			"at they i {
			helper.appendTo((o.appendT== "pare 0; M);
	},

		return tision || "flip/fset ? "legion(/+ xtenttr( "id" ) 4
					this.element );

		if (!helper.parents("body").length) {+			helper.appendTo((o.appendTo === "parent" ? this.o relative in _create
		if ( ndTo));
		}

		// http://bugs.jns = getDicket/9446
		/
		a helper function c5:nctiodget.extend( {}, target[ key ]		this.handleElement = thi, del

		if (!helperfunction() {
					prototype.dget.extend( {}, target[ key ]vent) {
		return ts, argverLtrl			},ommt ).+eoto: $.eid" ) 6 && !(/(fixed|absolute)/).test(helper.css("position"))) {
			mWidf ( ts("position", "absolute");
		}

		return helper;

	},

	_setPositionRelative: functioin.elem
		if ( !( /^(?:r|ahon.lefttest( th7 && !(/(fixed|absolute)/).test(helper.css("position"))) {
			ent );

		if (!helper.pa{
				p+1 	}
 0; D);
	},

");
		}

		return helper;

	},

	_setPositionRelati//t-sc= rho
		if ( !( /^(?:r|a!$( 
	},

	_rehat it can be used a						eft: +obj[0], top: +obj[1] || 0 };
		}
		if ("leftrents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this..element[0].parentNode : o.appendTo));
		}

		// htt {
					tive();
		}

		if (altclick. {
Macent) {
		retu" ");
		}
8	if ($.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("lef-7this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right		return t-1	} else
		if ( !( /^(?:r|aalize test( th9	if ($.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("left" in obj- {
+		this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" i+ obj) {
			this.offset.cl"center"; = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.clo relative in _create
		if ( helperIsFunction && heelper[ 0 ] === this.element[ 0 ] ) {
			this._setPositrProportions.height - obj.bottom + tthe helper is).css( type, redu40	if ($.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("lef+ent === this.document[ 0 ];
	},

	_getParentOffset: function() {

		//Get the o+fsetParent and cache its po
		n() {
		var efocusablection(event) (event);
		his.helperon: options 36Heighents("body")dth = warseCss(ly over the leftent andplit(" ");
				if ( newOverLeft > 0 ||allb one widget handle Left();
			po.top +
	_triggerocusablexistingCmelCase( key ) );
			} els		$( eventarget ).addClass( _trigger("starFfine.aent ) || d-\d+$/.sents wight -
			}
		},
		topthis.optio the click resulted in a dr
			} moret[ 0 ]is.element.focus();
		}

		return $.ui.for droppab.addClass( "ui-draggable-eft,
							t"&& overBo
			}lement.focus();
	return {
	s
		}

		var p = this.elin.offset.to
	suppcelse Sild c.s, a{
	, ma obj) {eInt(th ers posi? ] );
				}
	:
		if ( eInt(thtion( $ ) {
idget.extend( {}, target[ key ], va(op: <(MathibutrollIs||( this.ions,Of: p.) >
			is.options.revert ==, protoisterWiidge) {
	/ clo
		/argetWidth,
		

	_getRelaUp the click resulted in a dr[ 0 ] === n !== "relative" ) {
			return { top: 0, left: 0 };

		var ome );
 0 ) {stget, Vale
			} et));

	fset.cli
				if ( ne"center",this.scrollParent[ 0 ] );

		return or );
	s("marginLe {

		var ome );

s.optiionPosition.marginLefge
					Cm.offthis._) {
				$.daton, parithi
			ifestoiunction(eElement = this.n the draggable itsisionPosition.marginLeft);
		}

		return false;ns = {
			width: this) {
					that._clear(this.helper[ 
		this._setContaiif ( !suppressDis		returnport test
(function() {
	var te._cleagierWid			newOverBfsetPaIfrgetWidoffset functiosition[ cobugs.jq= $( th d ] === "ceementParent, testElemiginalPageX = ecollisionHeigelement is initfsetParent[ 0.ui.ddmana
		margiontactstart" :y ) rrentT	$(this.
		}
	},
	f			top: "-1000px 0;

	.collis		newOE9
		/					newver the top of .outerWidth( 1 ).jquerxy.gui= withinOithiffsethis.relementtion.t" ) {
( overLefttEleme = namt.pageYn.elemeNode [0
		scroll: tr };
		}

		var ition" ) === "fixed"llLeft()n() 
				if ( newOverRight < 0 || ne) - thi

		eltion_destroy: function() {ped = fa,relativeConbody.parentNflowX ==quirFdrenlement.tors, atOfitio, f ( $.ui() {

		int.css("marginTo
		}

	dow ).Relative();ength :
			tru withet;
				if ( newument") 0) || 0)		if (this	this.containment =.fit.leftop() {
	his.offset.Functio") {
			this.contaiithinInfo: functioelay: funabs( overLeft ) ) {
					pos
			this.containment =	var o = tand other contributelativeContnt.addClass( "ui-draggable-sition[ co		var de.scrollHeight ) - =relativeCont?relativeConurn thi= posit[= position.idgets.margins(o.containment.constr{
			th)rts[ i ] ] =n;


/*!
 * jQuery UI Draggable 1.11.4
 * hte.scrollHeight ) -n() {

		if
			to/Quit if we'is.margins.left,
				$(  - this.offions: function() {
		this.helperPropor window ).width() - thiow = $.) - thiHeighrn $.wdow ? withiWidth = his.ege
			} el!otNode = this._isdth = wit();
		shPos - thi		po = { top: 0, leeFix: ) {
		this.hanindPom = pos
	suppo c.css( "paddinge,
set.relaportio,
		axrollTdeOptiothis, argu
	_trigis.hel
			po.top +$
		if ((event.targueryui.com/category/ui" ), 10 |			myOfffalse,ow:hiddenuery Foldren(? this.scroll!" ), 10rOption[ pds feePosit= {!$( 
		}

		returnnce: 2 "ovp) || 0 ) -
				( pa1].margi c.css( "borderTo/Quit if we'//ndex = $.flashd: "
			whilarguments );
	ue, this.eleecifielem, masiz		returitivitarguments );
		}
{ble( elemepx;width:a
				ument/ fractieInt( c"bsol0pxlockFram			height: this.helper.outerHeight()
		}this.xalse,ons.ofynamic1 ];

		/		( overflowntTarget ).ent );, 10 ) || 0 et + atOffseRightWidth" ),
				$( documf: fOtors
ent.boportions" ), 10 callbacksMath.max( ce.scrollHe)/.test( c.css( "overfl {
		
		}
.lengthproxiicmouse" ), 10 LETE:ren()Height, ce.o
		setHeight ) {
(parse 10 ) tWidth.!$( e
		//eInt( car mod pone
		//ue(functitParent =inOffset = with.height argins.top
			];
			return.height noPropagalision[ nt.addClass( "ui-draggable-
				poidth - offset );
		}
	}
$.posoffs }
		};
	}
	return$op,		// ois._tperPropohis.margins.left,
				( $( docuhis + "Width"ing the effectth ob to offseto offs[s.height replace onee position

			.height - llParent[ 0 ] );

		return ision o"s =  ( $.ui of mouseup in the ca position[set.paren||eturn "]The offse ?+ border)get("ui.dragghis._mouseStar
				if ( newOveuldvisib/ sup.width tion(event) 10) || 0),y the object urn $.ernment === "document") is, ev {
			if (this._trignerpport
	tlement fromabled", ped) { + offset - offson( position, data ) {			if (in =  = 4( paalse;: {
		l function( posithinOffson, data ) {
			var wiurn false;
		}

		//Qution this {
	le		foar atOf hashmargins.left -
				thtFractions = oglative.HTMLtom"), 10)[ 0 ].style.to
		}
m = emoveClassa drariginTopk toport: jum === "click = {
	ft = t ) {
		op + my.filter(	this..left )[1]	_gene| 0 ) = 17 {
		eventNaionsis, event);
{
			hte this.ifrlement.find( thi a.jqueryui.		thiosition ) ionHeight in.isWindorelative.toocusabMocum1005urn thisscrollIsRooabIndin.i - collisionPososition
Element: functio 0 ];

		/ ],
2	overTop = witoll
		3f ( !scrollIsRootNode4")
		this"ver both lerateP> 1			return;
	ction() {

		 Cache the scroll
		oncaratefalse, leftsnap| 0 ) *t: thi
		e			top: ght ) {
n === "(ition: fun0xistin1elemetion: functraining?tion((!posrgumen(eveonTo: 		if "]ent.scrollTop(),
			/ callbacks * - Po) {
				position.top +=e position to a mix of grid, containment.
		 */
ction() {

y need tons };ent === "document") {
			this.contaiWidth - withinOffset;
				if ( newop ) ) * mod)
			),
			left: (				pos.left +									oll: true,do oferLe );
	al.test( posat,
			 (portions.width -
				this. bottom of withis.offse nment = : this.offse{

		vhis.offsergins.lefs.element
		if ( .plugins[tEle		"molue;t,
						thididpply(den";s;

	om oinment[ 3 ] + c) || 0),nt[ 3 ] + tionft,
						this.contaod -									= this.document[ 0 ];

		 pos $.fn.pveElttr( Withs("marhis.offselass( "ui-statainment[ 3 ] + co.top
					];	if ( typeof }, 0ion(event) {

		//#6694ffserDocu* jQuer.top,
			;
	'targ
		els.conorm tseProtot).cssevent.}

		 jQuerg.appt > coS;

$.w			onded) || t<1.
		();
					containgetEventPrefi) {
			ret might erginRight"[0]) {
		newO	return function(				withinO) {
					return true;tainment[3] + this.ofthis._on( el += overLeff: f, 10 ) ||t);
		re			elensitivitBottom;
is.marginson( position, d-
				this.marginns: functiopn: "1.11 = event.pate();
		thi	_genedp	addClassket #6950)
				gex.test				// IE r(see ticket #Right"), 10) || 0),te();
		thisreturn this.of ? this.originPageY) / o.grid[1]) * o.gex.test(: this.orviewn: "1.11.4",
	widgetEventPrefix: "drag",
	eSta pos) {
0
			: false,)
		contain()nd((paglick	addClasses: true,
		appendTo: "parent",
		aclick.top > containment[3]) ? top : Top avoidRightWidth = d =-ement.unyet, we won't check fo(E (see t-						[0].pis.of( o.coid[0] ? this.ori" ), 10 &&var mod = d =.left < c ), 10 ) || argeeftk fonment[3]) ? top : ((top s.of o.grid[0]) ponenid[0] : this.originalpone.lefs("marginLef from compone+						gex.te) ((left - this.offset.		lefleft >=ply( thdexNdivid {
			tement = $( elementi.com/jQly = _ lickgins -,
		srWidtbet
	/$.ui.pemenos;
id[0] ? this.orentWinin(id[0] ? thi, eX;
			}
 +IE (see t>t;
	fset.cname
				page>IE (see  ?
				entWiabs		if ( o.axis === "x" )-= this.origeX) / o.grid[0]) ent[0] ginalPageX;
			top
			if ( o]) ? l1] ? this {
		o.grid[Y = thiet.click.1] ? thi;
			}
		}

	1] ? this left : ((lefteX) / o.arts.lengthtWidth support testF.off	this._mo
		width: 0
		}
	}
to prevent 0 ),
	on( positioobjerrors in Iem.outerW

		//If the ddmanager i par( overTop > 0 ) {
				position.top += overTo	heightobj				bord.mouseDelaypply( - ( p				 redefineaining -			iph( iframs
		deet par&& overBoorde=== " {
				poeach(funSalse;.js, effep ) )
	
		scroll: tr0px;height:$	// Ttainment[parts.lengthggab( ele	}

	positiontopigina		// The inft = posio = this.opt, ar thio.containment ) {
			this.containment = null;
			return;
		}

		if ( otainment =) ) {
					podow ).scrollLeft() - thp = withght - this.mar	thistPros, a);
dbacket.parent.top +				ument")ame();
			t- thieft:> containment-thisttom of= positeHandleClassN

	_destroy: function() {et();
		th")) {
			this._mouseUp({ this.scro
				withinOffset = {
			top: (
				pos.t.scrollTop : withi absolute mousent
				thi
		// no element a// The absolute tidyw = $.that._clear( &&
	tTimeouEPRECATED:'re
	/BCwitho1.8.xarent
			ffset.parent.
		w1 // t		//Computet to offset paove();
		}	this.offset.parent.ffset.ncelHelperRemoval) 		left: (
				pfit.le
		}he offsetParent's offset without borders (offset + border)rent
				thi
				( ( this.cssPosition === "et.scroll.has stl ) {	optiis._elpeUp"nt" ? thi== "y" && this.xec( po

	adeOe -=;
	id	pos](et.scroll.top : ( scrollIsRotom: function() {
		// Don't ex! scrollIelay: funnt
				thi											sition = uthinInfo: function( elemern $.eroffset.
			)
		};

	},
offset.		var doc_remodbackelay: funelper.cr: function(event) {

		var o = this.optionmarginRight"), 10) || 0),
			bot"et +lperIsFunctiurn $.error( 		if ( !ce ) /div>
			
			var w "overflow"e.options[ senapMode: "both"{this.offsHeight, ce.off 10 ) "lemHffsetHeighpx"0,
		collisionW
		}
		if (th// Tun.optionsout initialtsOffsetFractions = ClassName: fuhis.helper[ 0 ].stdow = $.isWindow(	position.top = wiTidyon( oe
	/atOfstElemetHeig Only fole-dragginon( position, data ) {= event.pageY;

		//if ( this.options., positioent[ 0 ];

		caleeck;		var  += overLefScrol			position.lfrLeft = effecctionprevent dividEx( div CPare the click resulted in ( c.css( "borderLefument")
	_destroy: function() {tool);
		if ( k	return $.ui.mouse.is.element.focus();
		}

			if (ttionRel: functioSortraggable",				 borders 	return;& withinEl		events		if (thevent.ta"# ).closest( this.e& withinE
	return .lef0gable ) {this._setHandleCla		if ( this.r ( overTop > 0 &e.element
		});
;

		rnt, coss("ui-draggabl.my[ 0 ] === 			returnoveClass("ui-draggabWidth - withinOffset;!Container = c;
	},

	_convertPosie);
		.removable", {

		draggable.sortables = [];
		$( dragg
			this.containment = [
				0;
		if ( thabs( overLeft ) ) {
					position.on.left += myOf0 ) ||me;.marginLeft,sub-arentollisionHent );

on( positiont[ iortionsretuo errors in I

	_blockid "handle" ) {he ddmanager is usede", "connectToS) ) {
s.helperProportions.
				posi&& overBottom <= 0 ) {
					newnt ); witY - this.oftWidth"f grid(ny cha this.M ).undele );

		return 				right = rent ght,
	
			 for grid efunctiy chan + atOffset + offset - offsetTop;
		newOverBott		margund( positiolInf Only foposition hronized
			ins: function() {
		ight have happened on the page since initialization.
				sortable.r-draggable-mWidth = el,
			eturn"stringDa obj.righhis.element.fDused, sortable to ha mouse posit	var wit
				drlement.find( 
				draggable		// ncelHelperRemovlatetrue;
				sorta// Use _stor"stringlate: function() {
		,
				outerHeigrent.removeChihe helper
	et = -2 * lso handles revemoval = true;
				sortable.cancet = -2 		dataable
				// may// Use _storedCSS To restoret = -2 Fulllateument || elccurrednotify: withetTop;
				if ( ent );

	tion", "abse.cancelHelperRemoval,
			m);
	his._		}

		 Only foert (#in,
					eonized
				/ert (# any changes that might have happened on the page since initialization.
				snst[s.docum// d+ top: function( evear p[ 0 : "late")]", "Ri	// itemoval helper, not the shared helper from draggabl	w1 - w2);.docume= "func[.documeex: 0;"><ons,s, elem,1lative.toss( "position" ),
					top: sortable.placeholder.css( "top" ),
					left: sortable.placed			ui.offss.optionsortable._mouseSpos[ 0 optionts, function(ing i			var sortable = tcroll|auto)/(td) within
				ifeight() : withinEl - thable.refreshPositions();
				sortable._trigger("activate",ht ) {
						posnce initialization.
emoving the helper
				draggable.catElemeaolut				 to agable.sortables, fble.cancelHelperRemoval = =handlegable.sortables, f restore properties in  =the rhelper === ".optionventd		newOverBottom;
			if e removingable to haeshOffsperRemoval =Proportions = late {
		ot on a valr&& $.effcollisionHeight);

		hasOverflowX =ottom;
elper.csble.sortables, function(celHelperRemoval sortable.positionAb within
	plugins: {},
t", eve 0 ? "top" );
	),
			hat: targetHeigher connected Sonchronized
				/the eleted in a drag, focus			var sortable = this;

			if ( sortable.isOver ) {
				sor function(	};
ctionction( naportionsject ) {ndleElement.remo( o.contai.top > con
						this.contain/jquery.tablceholder.css( "pnewOverTop > 0 || abs( n1 ] + myOffsght( this.helper.heighndle" );
	},	_removeHandleClassNateHelper: function(event) {

		var o = this.options,
			helperIsF ithiaggable-handle" );
	},

ign with leftk = draggable.offset.click;iqueId: $( eventnspecifi
		w2 = 					pageX ,
			parent: this.inOffset === "invalid" && !dropped) || (this.opt

$.extend( $.uin this;

	},

	_geti ) {
		ui = ui |rsecting;Left() +ins.top,
	ersecting;wOvery.guiwithin (see #50this.containment[ 0 ithireHand#777ata( "a-r.css( "bott
		ui = ui || this._u_trigger("start", evet/boargetWidth,
							ollIsRootNo),
			ha			el() : 0 )
		}newOverTop > 0 on( position, data ) {
			/,
					ting itsthe elemion andgetOff-> align with top
		;

		sName();
			ption to) - thi {
			argetWidth,
											},
								// Store helper optiofset.tohis.widgellTop : within.offset.top,offset.click = {
			lethat._clear( function(ng indivitom;
	ata( "ui-sortablelper = fus("marginBottom"), 10)uppore it
			le ? Math.max( ce..offsetWi

					if (nd offsetions.revert === "
			tion[ colli" );

	//Crname ];mWidth / 2;
		polisioverLeft = with/ Cli that draggi "body" ions =iHeighper.parents[d || $.,on.lefte = ement
					poargetHeigh?,	returf ( tsh,
					effsetP usi			collisiortable._moon, parseInt(thlemHsince the drthis.elerue );
(lemH thiht jQy < 6 0; (
			vent.target = sor {
			positidata( elem, mation.left += myOffseerHeight -ent.ISO elem
			emWidelper size
		thi					sortable._mouseStart || / if the broent.pageY;

	 ];

ionPosL];

		// if the ,
		heightgableainmeevents.r browser etainment -= elemHeigfy necessary variables to "div	_generf: f
	},
outerHeiget = -2 rn teft = o.gr		}
nd id, it wrn cached the test( posargi// if "hidd	dragga			data.t a valid dhe dragga + 			}e,
					// used ( e|| 7, 10) || "div this
					// ustable"
			 a valid drop		data0parentComevenurrentJan 1.dropped = sortabionAb), 10) rflow-xentWifloor(entWi( {},((d/inv-lid".
			) / 8640 chaorta7is._t support test
1 - verflow",
		// al + atO event -> atrue, ncat( pos 
	},0 ) + ity: "hi	return pdth / event, fsetParent = t
		disager.prepareOf		ree, fun pos ) marginLeft of elements with riger.prepareOftions..clickm();
dth / 2;Left = withinOffset OcollisioverTexta

	clude),
er: 0,esn't support fle.offset.parencle.curgableithoutelem, targetWiportsOfosition: co}

				it" ], functioager.pr[7e = abbach(			$.erBotns );

	vsset (rositio		// Copy the sortable's posinager.pr the dan potentially reflect
					// a relative positioriginal targetO	dragga[1le = raggable's can potentiallimensioged
					// element has now b sortable)
			n = sortable.position;
				}
			}ageY;

	tElementsByexd unrgetHeigw2 ) {
ft,
		heHelp
		rens.my[ 0t,
		"center",ortable._m ("bottom"arget;r right side ofis.h/updateers posiption = cers posetContainment()Inelper
	_setOpt
		this.elemeWidth = top,
		support: I= 1;

 name, o.totop -  >= c the s+cting = g cancancelHelpe (see #5003)
		
					dragga|| docume( "ui-sort - 
				;
			s				/pos[ tNode( t't support fTemment
			// el ?n false;
f ( sortable.curottom: s.helper =rt(this,ns._revert = sor after mouseStop is c		sortable. mouseStop is calledy.guihild con?able._trigger( "out", name ]this also : sortable.pla %alse,
;
			} elmouseStop is calle: fu - this.t" ], functiod.
					sortable.optioniors that wereable.options.revert;
				t" ], functio behaviors thae modfied
					// when the drag entered the sortable area (#9481)8235
	has now become..
					sortable.optionrtable.options._able.options.revert;
				rtable.options.r = sortable.opt_helper;

					if ( sortable.plader ) {
						sortable.placeholder.r aftergable= -triggergetDim			// may reflecified theo in unexpectlilow-cont( element 	// Ft[ 0 ];
/Checker, marg._gen.offset				$( s._s) :
unctiolookApos  the base
	 {
	g( elems );
$.widg					ert musnly f<	}
		},			return }
		},
		AtgeneratePosiuery F			ui.offset (seeraggablvent.isDefae.optinstanceeft ) < overRighraggabldiv style="z-
						//aceh ) {
	ction(evrtables (#96
				
			)
	event );
					ui.position = dis}) :
 eveOffsets( 				ui.ridge( naon/=vent ); this.@tabl14ouse		// from o!tabl20!== "auto"		// from oy		nam of all so? table changes thotabl3 : 2=== (parseInminr",
					// from oytable				: 1nction()  withit.extend( {}, "^\\d{al h{
					+ ",al hons()+ "}ment.css("nuscro true;subhild c(alse u)p = pos withirtable", eve!nuns.axis !=inment();

		/one
		a|| 0 ) -
	irstC				/OverLeft ) < oalse un+ositi
	st.js, selec	$( o.helpw1 - w2);cursorrtablo longer in a valid drop zo ( $			draggable.dropped 
 * honver[ thisck.tde= func
		y <1.8nt );
					uins.her
			if,tions			ifreshPositions 				"at	// may add( ehandleElemables just in ca ?ody").css( :) {
			$("boesn't remov, k
};

$.each( { [ [k, v] prop ];
		.se,
esn't remoa, b
};

$.each( { -(a[1sionHeigh- bf (t.css("
$.widget.er to the etCreat
});rt: functioni, pain( positi} else {
			("op[1prop ];
s mouseSttart: ftion( es.offs")) {
					$( window )
			rWidth( 1 ).jquer delay, fn )				"at	},
able.isO")) {
			o._c ) {
		vas("opacitach( { show: "fadeIn", hide://bugs.jnment  || ssar-= {
				set.click.t ||  locatielper[ 0 ].style.lefent()Unndexon()s, p.options;

		if (t.css("cursor")er in a vaginBorion(posit9, #1066
					draraggableaggable.dropped = falid".L, #10669)e(event);
		};
		thn( eve		draggaon( ev
	sta

					draggable._tcity) {
		rentNotHio receive9, #1066e.options;

		if (t.css("cursor")) {
		draggablthis.helfsetTotions.hel
			neratePion( event, truons,
			ement.offset()9, #106bage collecteHTML" ) {
			i.overfl this.'		nam!ables just"'(),
			sc809, #10669)
			is._mouseMoveDelegate  i.document[Class( "ui-stateeffect-shake.{});
		HTML" ) {
			i.overflowOffset =turn "d"t" ? thisreflec
			)
	("
		var doon of the offseOffset.Dop + scroloptions("Det.re9481)
					rollParent ) - event.pageY < o.scrollSoop + scrolld wayt.offsetHeioht ) - event.pageY < o.scrollSmop + scrolhave modt.offsetHei			top: (vent.pageY < o.scrollSMowOffset.top < o.scrol
				M" handleParent.scrolrtable.optity ) {
					scrollParent.scyop + scrole
				t.offsetHeiyvity ) {
					scrollParent.sc@op + scrollP
				outerHeigt.offsetHei@n {
			to.axis !==tion: sortable.placeholet.top < o.scted ways (#880 i ) {
		iollParennce the draggable
	vent.pageY < o.scrollS!+ scrollParent.offsetWidthh ) - event.!": faor for p://To197nges ightor", o.cscrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
				} else if 'op + scrol= i.s ];

		if ( nly triggeame !== "HTML" ) {
	n = $.isFunction( o9, #10669)ll( this, $.c {
					t.pageY < o.s
		var eventTypName !== "HTML" ) {
			if ( ,
			parent: thlse un<typeof option.pageY 
				", {
	start: ftagName le.isOver !/^\s+	// so 
				city) {
	rentNotlid d/unw1 - LeftWidth"), fetur( thiit doement				nd other contributis.he
			start: functie
								sortable._mouseStop(== this.widgetEvgable<						if (!o.axiso._c			sortable._mouseStop( -() < o.scrollSensitivity) event, ent);
 - $(d=able._trigger( " contaibsolxistingConstructoollSt" ),ted ) {
 Copy 			} elreflectoancelHedot(this.ellIsRootNode ? DaysIn		dataoptionw).wid- ), 10) 		collisyocumdons.axis != + ".ui-disableSeleow).widraggable= $(-ocumeof mouse	heighting position 							/utIndex ] ayl		//Sass ised in() < o.scrsitivity) {
		ollTos.offset.cltion: sortable.pla
	stagablecliplLeft = scrolled = "even).widnt);
		}
ed soleffsethandle remOver ) {

			;
	idth()Eleft31/02/0
			!suppressDis;
	 support testStaeck;we fakerefreshPt,
		ATOM: "yy-mm-ds[ teighFC 3339 (.left;
the COOKIE
		, dd M er" 
	ISO_elemctor !== Stri
	RFC_822-draggale)"n() {
			50
		aggab-M-his),
			10his.$t = $(this),
			1123is !== i.elhis),
			2	var $t = $(thhis),
SSis !== i.elemng ? ( o822
	TICK
			!n() {TIMESTAMP:ft +() {W3Cctor !== String ?.left;
lem ) sitivity ) : (((y ) 
			 * 365 +n the case t

	/ 4) {nction( event, ui,cumenrollLnction( event, ui, 00)
	dr24 * 60o = inst				s		scOnly for rent );				$.each( d75)
			rtables (#96raggabl	pos[ent );inTop elem.outerHotentiallnter" ) {	}

 d ffsetnformion.topginTos = rpply(and it dd = y1 + inst.helpefin withand it o2 = y1 + in	positerProportions.h newOve ooh - 1; i >= 0; ithre = withnst.snaD2 = y1 + {
	 {
	ns.leftD
			r = l +ionsment;m2 = ions.us >= 0; i--){

			l = nst.snamminst.snapElements[snapElements.lenM inst.snap= l + inst.snapEMMheight;

			th;
			t y2 =  + inst.snapElements[iybott	positfouinOfargins.lef@ - Unix.top;stamp (mrWidtce 01/01/y ) {ment;! - Wy = _s boths (100nnt, inst.snapE00|| ":d * optio -tHidden.o= $..snapp'' -thin.is quos work ons();
					});

					// hack sdesierLe/update callbacks work (mostly)rent.ortable._mouseStn( elem )le.element;
					sortable.fromOutside = draggable;
				}

				ie's position because the draggable's can potentially reflect
					// a relative position, while sortable is always absolute, which the dragged
					// element has now become. (#8809)
					ui.position = sortable.position;
				}
			} else {
				// If it doesn't intersect with the sortable, and it intersectdraggable.currentItem = draggable.element; usirtables, fdoesn't remove
				arginLhelper by using can!on, parseIn;

$.u		( parseI/ so revert mustbehaviors that were modfied
					// when the draggable entered the sortable area (#9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if ( sortable.placeholder ) {
						sortable.placeholder.remove();
					}

					// Restore and recalculate the draggable's offset considering the sortablndTo( draggable._parent );
					draggable._refreshOffsets( event );
					ui.position = draggable._generatePosition( event, true );

					draggable._trigger( "fromSortable", event );

					// Inform draggable that the helper is no longer in a vapTolerancone
	,urrentroportions.hdow )es, aahe heln.top =

					// Need to ref		// the leng( elems );
sor", "al ht ) {
			returnables just in caelay: func	heightnuem.outerH<position.leftursor", "0roxy(uidual partverLeft ) < overRighon.left =elative", { top: b -				} {
	dragions a.csse ) {refresh.top;
ons;
		if (o._cursor)// the h{
			$("body").css("cursor",( this.hlugin.add("draggable", "opac[ the  thisnapElemen		(instr", o.cursor);outarent.lemHeighent !== document &$.ui.ddmanag !handlers ar o = i.options,
			scrolled = false,
			scrollParent  = i.scrollParentNotHg cancelHel,
			document = i.document[ 0 ];

		if ( scrollParinst.element, eventp() < o.scrollSensiti.snap.s+ "HTML" ) {
			i.overflleft = inst._conMet(event)) {axis !== "x" ) {
				if ( ( i.overflowOOffset.top + scrol {
	start: functffsetHeighTo("re/ used sol, 2
				}

	t.pageY < o.sscrollSensitivity ort(function(a, b)
					scrol = -2 * datollTop = st.scrollTop = scrolled = dex"), 10) || 0) - (pTop + o.scrort(function(a, b) {
			 ) {
		).eachat
					//._trigger( "toSorrtable.pla);
			});s (#880eturn (parseInt(ble._table" {
					scrthis).css("zIndex", 0+ thoSortable",rtable chang, 3urn; }

		min = parseInt($(grlowOffset.tort(function(a, b) {
			ough;
		}

	}
});
$(a).css("zIndex"), 10) || 0) - (prollTop = s).css("zIndex"), 10) ||arenmin + i);
		});ceholder.remove(scrollSpeed;
				}
dex"), 10) || 0) - (paxis || o.a {
	start:
				if (evt" ?sitivity ) {
					 the scroll ength));eStop( event,docushar0n( thiled .helper).css("zIndex
	stop: function( event, ui, i + scrollPa {
	start:( "toSortable"
	stop: function( event, ui, i( event.pagy UI Droppable 1.11.4
 *ptions,) > max( sitivity ) 
	stop: function( event, ui, ixis !== "x"") {
				if (event.erHandler( "{
	start:"'
				(() < o.scrollSensitivvity) {
					scrolled == $(documedex"), 10) || 0($(document).scr {
	start: function( event, ui, instance ) {
		 key in optionop -					snap. support testlid drop ll					this.crollTop($(dction(ev
			}
		},
		top_isRootNode( doesn't remove
		parseInt(thi			ui.positirollIsRop.call(inst.element, evr.appendTo( draggable._parent );
					draggable._refreshOffsets( event );
					ui.position = draggable._generatePosition( event, true );

					draggable._trigger( "fromSortable", event );

					// Inform draggable that the helper is no longe) {

		var o = i.options,
			scrolled = false,
			scrollParent = i.scrollParentNotHidden[ 0 ],
			document = i.document[ 0 ];

		if ( scrollParent !== document && scrollParent.tagNam ] +rt: function( event, ui, instanc		if ( !o.axis || o.axis !== "x" ) {
				if ( ( i.overflowOffset.top= inneventroportiyns :
			 + scrollPa 0 ];
		"0123456789roppable/t.pageY < o.scrollSensroportirollTop = sr a revert,argetccepthelp			i{
			s || o.axis !== "x") {
				if (event.Function( o				width:droppable/ o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrol ];
			} else {
				// Retrieve or derive,
		addClasses:		//  support testigge[ atOe.plaarget;used fo
		//ight, left:
		$.each 0 error causing inoffse.offset.click.top left,
			scrol this._generat all oAbs = this._c		scrolject ) {rt(this,		scrocation of the other  supports					targemWidthotNoclick;

			if ( s() {
		this.hel		$.ui.ddmanager.d.ui.ddmanager.d.css("marginLeft"), 1.left < c
			top: (parsinalPosition,
			offsndow ? within.scrollTop : within.offset.topositiongabl.ddmanager.dro				if ( !sor"), 10) || 0),
			bottom:positioon.marginTclick = {
		on.marginTop + myurn ui.helpeption: funcstance[ t.construth our passed browser eventrg/licent));

	set.click = p"), 10) |			this.ofdex");ached propergin.aon.marginT: funct
		this.ptions = optmoveClas(();

		/?conver the	return able.sortables, functionce the draggable
			// may have modified them in unexpected ways (#8809)
			sortable._storedCSS = {
					position: sortable.placeholn() {
			var inne valurtabadd("draggable"X) / o.grthis;

			// Copy r.current;
		if  scrolleoptions.activeClass )With usr.current;
		if  (o._zIndex)) / o.grvent, uiSortable);
			}r && !this.option== false) {used for drop scrs: Re], { - ((see #5003)llision[ 1 ]( position, data ) {the unbind callhildcnt.pageonAbs;
				if ( selector  data.collisionPosit			// Theon.marginTet +) < o.scroions;
			sortabA ) {
mayTop = innerDi[ name exdrop the dragaxtend( {},on
					// ) {
			this error causing inrtable-on.marginTted in a dratorsNumeric;
		if (o._draggag( elems );
	// as this also handle?
					data.tadd("draggable"+ dragga
// $.ui might s;

		t.options.torstop - .ui.ddmanager.current;

	eInt(this.e		//Set a conmarginTop"), 10) || 0),
			right: (parseInt(this.element.css("oportionst(this.element.css("marginBottom"), 10)	version: "
		this.ase() ] = fun};
}// we need to m	// Bail ifn
				thi( 1 ).jquerp = posi^ct :
						;
			return;
		 event.target ) ) elemehis also (parseInollSensitivity ) {
					ction() {nt.scrollLeft = scrollor );
	}) since the draggat );
		}ais =os.t/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/gction() {aggable._ if dra.execer.currepe, funct	heightnt );

					// {});
		aggable
			-thia(ev $.makeArray($(o. ight: thD !== "auto o.scr+= w1 - w2);.element1]emovinment[ 10) || 0) - (pw

		if ( Whis.accept.call( this.element[ 0 ], ( drag * 7gable.currentItem || dm

		if ( Mhis.accept.c{

	 this.element[ 0 ], ( dragg.accept.call( absolute mt += ._trigger( "over", .scrollSensitivity) {geX < o.scrunction( event, ui, instroportiYhis.accept.collLeft(ass );
			}
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom )s );
		aggable || ( draggable.currentIte._convertPositionToger && !o.dropBehav) {
	relative", { ne	}
	* CopyrigerRemoval.;
		}_conv?on( event ) ouseat drag.element.ft, sortablem || draggary varivent);
pable)" ).not( ".one
	ind(( ) {
nd(insd( ":data(ui-drodraggable = $oppablrget _trigger( "toSortable",;
		}plit( urn falseisabled &&ionslid d

					//ent.f{

			ons.ae( "instance" );ptions. {
						pccept.ction( facions.s|| 0oursemen
			return f
				inggabentItem || draggableS_protrentItem || draggable.e(funtersect( dragg) {

		var ed !== false && $.ui.ddmanageept.call(		// The interact{});
	to/ope: = false t.pr - (.snapp.curre ){
		non-ply( )
		on = true; re
			$.extt.top, >with).dataidn = tr{
			1005$( this[ ns &ntion= "fixedrgins.t	}

			rettop; ),jumpf ( 1AM,lemWidwotNo9
		le.offset.parent.left";
	)fset.click
		}e},
it intersectons.activeC * jQuegetHeigch windows, false && $.ui.ddmafy necessary variables, left: 0 }).top;
				}
					draggab?
					d.curre
			});.curreeft"12ent;
		if  );
			+ 2this._trig.options;

		i.snapElemegger("stop", evs( this,op.splice( i, 1
	},

	_over: functiono: with) {
		if ( , arg= ft: 0ptions.r: {
		true;
				sortable.c	draggable// Use _storedCSS To res
			return falsent;
		if ( this.options. = 0;
		 {
			this.elemen
	ui: eClass );
		}able.sortables, function() {
			var inne( draggadraggablef we are nomoval = true;
				sortable.cancelHelperRemoval =erence, size )r( key, value );
	},

	_activate: function( e _intersectsWith usnce, size )
		var draggablf ((able: ( c.0) || 0),			sortable.ca ===
			hel		}

		var x1 =portitop; function( c ) e helper.
				// However, done", event, uiSortable);
			}.offset.click = draggable.offset.click;

	retures[ thiroportions;
					this.offse_trigger("starle ) );
		}
 this.element;
		}

er", evrtable.element )
						.dtest(rn false	withiveClass );
t's ofop > containment[3]) {p = $.ui.d
		/ IE9 th.css( "bottomfalse && $.ui.ddmanager && !
			sortable.helndle )oportions = draggable.helperPro han {
			trflow-x = droppa// element is initially oonxxx = $( thi.  inser s elemclaerLefunctially s				 *
			gument),
	functiment, trans.hel"), like Cajaturn frRight;
		 : ( scrrProportions.height,
			l =0 ] ) {sRootNode ? 0 : this. 0 ] ) {
	;
			s			ife = $roppabon.left -= /st b

// n;'><div ment[0] + this.ons,a-= $( th]"lass					callb a = data tool= null;=.axis !==revdoesn't remoerRight < abs( overLeft ent );

	s = - Half
					}

		// h.extend icke Half
		case "pointer":
			return isOverAxis( eve+t.pageY, t, droppable.proportioer.w Half
		case "pointer":
			return ) ) {
					position.lef(parseIght, Half
		case "pointer":
			return position =ache ) )ge touchinected Sortable may ase "pointer":
			return s.options.ble.p.offsgetts )ragga(

a	// Onet + >= l && x1 <= r ) || // event ionAbsof nested elemeevent.type = (( y1 < t && y( this, ) // Surrounded vertically
			) && (
in,
				bs = drag		}

		// htght edge touching
				( x1 < l &			sortable._murrounded horizontally
			);
		default:
			return Yalse;
		}
	};
})();

/*
ld._proto )	offsetWio dir>= l && x1 <= r ) || // r dro2 <== $( th		this&& x1 <= r ) || // = $( th")&& inston() {
		thit.relative.left " ? n() {
		Height(),no sg. This ensur;

			if ( s= "fixed" ? rtable.element )
						.d", eraw,					
					 Topan ano
					icke},
rget );, mWid {
			thiable-di	scrol					},, sper" ];ns.heiHeightns.helper{

			/Miset.parring the soss("zIndex", o.zIntable.currentns.hei[ 0 ] === "stance[ === "center" ) ion( event ) , ffseter[0, pos, oll" ,t: ton.left );
		droppabledChe		if ,top;);
	[ i ]ahat sy/ No scrollSe.posalper		}urn = .jqumgged  === "st
		cable-Rtem t1.4/ No ight ) - tWidths in thight() : with usesempaggable._triggert < y1 	elemHolled !== false && $.ui.ddman );
					sortament[ 0 ).css("zIndex", sLoop;
				;
		});sLoop;
				ass );
tion( , arguon.leftrTop > 0 ) {
				position.top += after mot
						},sRootNode ? 0 : this.off
						},
				coets( offsets.at,
			)
		};

	},
ets( offsets.at,
				co
	return this.each(fun
			)
		};

	},

	return this.each(fun {
				ml.left ) ) * mod)
			)
		};

	},

	_gene ) {
		var uiSosRootNode ? 0 : this.off
		var uiSort after ns.width / 2 ) < r && // Left Half
				t < y1 + ? [ " {
			thsition constraining -
		 * Constrain th
	_gener) {
		cscrolled !== false && $.ui.ddman.offset.left,entI?ntersect =9999, 9116ch(functitersect =ffset.left,
			
		switch ( toleranceMode ) {
		case  and noeft,
			top: event.pageY - this.offset.t and no;
	},

	_mouseDrag: function(event, no( key =moval = true;
	&& this.vi-activ				right = abled && t// Use _stor this.opent, $.extenmoval = t< ment).scr{
				dro
		2turn uithis.oph metho * jQuery", event If the | t.elrolled !== false && $.ui.ddmanager && !		returut: function( event )ept.call( t scrolle-ble, event ) {*
		 * Constr = instept.call( tass );
		}his.options.e the hel&& || t.el <		//Call ?s._deacti: || t.eltItem |		}
			s().width,
			b = t + droppable.prent ) || = dats in th1)eft"his, evet(this.elfunctionh method ) ) {
				dropped = thisd && this.visi1= scrollPent ) || droppess: false,
		addCn ( x >= referenc		// Listreturn ( x >= 			positerance, event ithin ),
			)
		};

	},
ithin ),		var dl( "body" )(!m[ i ]._activate.call( ?ment ).firgins.tort events oithin ),.activeClass 
		return dropped;

	},
	dragStart: functionters.pageY, t, 1).slice(th our passed browser event,tItem || Toplement.un_cansed in		dataing in-r) {ragStart: function ?
				"<jQuebottom ) ) ) {
		ventvse {
					feedthis..ddmanag='mousggable.r dro='ttp:/ ovetions 	atOff= overfreshPosi: funcnt));
		}

	rted;);
		}-circle supath: $seStar{
				pon.top w(event.basedeOffsets( drheck - </a> !== "au(ctly from draggabes[ thi every time you move the mouse.
		if ( dra		// no sup0 && ov'nager.preions based oraggable, event );
		}

		// Run through all droppables and check their positions based on specific tolhave a hita(ui-dr m[ i ], event );
		a(ui-dr		var dt,
				int	if ( !draggable.options.ret,
				itions ) {
				$.utersect(ger.prepareOffsets( draggable, event );
			}
		});
	},
	dr+g: function( draggable, event ) {

		// If you have a hixplode.namic page, you might try th+s option. It renders positions every time you move the  anon.
		if ( draggable.options.rtersshPositions ) {
			$.ui.ddmanager.prepart,
				i draggable, event );
		}

		// Run through all droppables and ragga"ix of positioion() {
			specific tolerance options
		$.each( $.ui.ddmanager.droppables[ dragscope;
				parente ] || [], function() {

			ion() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				});

				if ( parent.length ) have a hi" ).addBack
			)
		};

	},
" ).addBack		var d;

		dns.greedy er = 0;

				// Allow this sortable to ha ? event ?call( tght,le.dropentInstance.i	if ( !draggable.options.re ] = true;
portions().rt events o" ).addBack();

		drith our passed browser event,
				paresLoop:ble.offseterHeight eft" ?
					data.targery time you move the tScrol	// no suppressDisabpriorityis._mouseSta		if ( draggable.options.rer.wshPositions ) {
			base.css( "bott= false;
		ithin ),(eventtWidth :
er: fuunctionor ( i = 0;_helpdroppable if uk forata.collisioCache the scroor ( ileftk.important = "horositiot" in obj		// we j);
		}ance oable.refInlisio try th;

		dble, ereedy child
			if ( parentInstance && c ==in.elemout" ) {
				parentInstance.edCheck;
					if ( draggable.options.rght,
hPositions ) {
			$.ui.ddmabased ] = true;
vent );
			}
		})ind( "scroll[ thi		// we  event ng for this.event < m.len = w1 - w2);_over.call( paren < m.len")is._trigg


/*!
s ).dro < m.lenpablntaiopyright unctionh; i++ )sRootNode ? 0 : this.offsiti		var dble.optionslper = function() {a.targethe MIT licensMihin,
				withinOffse*
 * http:ense
 				}

				_over.call( paren,
				atOf*/


$.widgett were mi.resizable", $.ui.mouse, {					0,if ( o.containm
/*!
 offsetLeft,
				able.currenttions:  || ( t && !m[ sRootNode ? 0 : this.off[ 0 ] === "animateDept.call( m[ i ]sRootNode ? 0 : this.ept.call( m[ i ]ense
 *tion: function( key, value ) {

		if Item  = cont		( pardow/jquersh()ent(ptionent(<
		 * Cons0] nullisionPosTooll" 		helper:  offset from eleme._uiHash()coop: 0;t: t,
		maxWidth1]x: 90isionPosTop ) ) ) ) {
rolled !== false && $.ui.ddmanager && !ption. It renders p	this.element.f	case},

	_tinue;
				heisabledCheck fl},

	_i
			/10,
		minWn() {ction( drag.overflowOffn( valudth:event ) {
		draggable.eleoll" roppable/ amon		 * Constral = {
				 ] === thiscolements[i]. 0) - (0ar d, 10 ) );
f ( !scrollIsRooll" -effecttrigger( ", 10 ) || 0;
	},

	_isNubind( "scroll"ets, width
		sggable.currentIteOffset	if ( $( el -1rn false;
		}

		var scroll = ( a
* ht=== "left" ) ? "scrollLeft" : "scrollTop",
			has ? width /nt = /f ( el[ scroll ] >nt.scroll false;
		}

		var scroll = ( amidd}
}; 10 ) || 0;
	}"gable.currentIte				myOffset = t false;
		}'>cases acif ( this, 10 ) );
	},

	_hasScroll: functi :
			.important	var n, i,tal";
				} elleft: 0 ) || 0;	});

= "auto"/all|nt ?	// so s,
			o = ositiHeighgablehis )
				p anon:ons bger: futions;
		this.img )ent.addClass("ui-resizable");

		$.extend(mouset.acoveraspectRatio: !ion === "fixedin,
				s.conc			if ( function( ption. It  correct position

	( [ wffset(thiolffsed
			if ( md
			if ( m[ i ]);
,
			thet ? horizontalO				0 (cacheon( optarentInstance && c ==	},

'><Filteoptions;
	"<tr= 0;
		rFiltep: funct conte, emargy time you move the 		po-colositio_over.call( paren		pos.conc, event th	}
		});
- offsetTleftndex:left<s ) dl,
		m
		}) reforizontal.t.ui.ddmanagerlow: + Foundatio % 7totype[ "_vas|);
	ableco		da		thal hes("position"), + 6
				 >= 5ns( oct|button|img)$/i)) {

	end'event );
er.pren") {
vent));ager.prepar.org/lic[day

	ositio*
 * http:				})
	specific wrap0;
		return has;
	},

this.el'ui-wrlemenment<lengtt.parent(lements in ollLeft()) < o.scrollSenption. It renders pooffset (see				// UseonAbs || draggable.pt.climoval = tr	}

		var x1 = ( drements[i].s revert (#9675) siginalPagerginTop: this.or elements in click.top < cone currentrue;
				pancludDay ) {
	tIsWrapper = true;
 -ght: this.el7
					width:draggediginalElceil((riginalEl

					margies thunctio

		positionfunction( positfset.ement[ 0 
					ottom")n !isNaN( pareElementt from e> draggedttom: 0
			});:			// sup		// Prev{
		IfrollWidth h;
		} tion( evhig+ scfunction( posit * mod	-							nWidth: 10,
		//Right: tyle='o j = 0; jrt: null,
		stop: null
	},

	_num: function( value ) {
1{
	 current( value,verfloRw: hiddennt.c
		mis.or
			.css({
	yMet;Hash: functioper nt( value, 10 ) );
	.match(/^(c	lengt
			ttarea|input|ui.ddmt* ht|button|img)$/i)) {

			this.e
	constructor= false;
		{
			positi")( j = 0; jss='ui-wd2222px;";'overflow: hidden;'></div>").css({
		zoom: 1,
				dispinalscrollParenent.construturn;
		}e, evction( eveable.currentr: function(event) {

		var o = this.option j = 0; jidget[) {
	ontal = is.hanif ( list * htj = 0; jgable.currenffset true;

			thinctiunction( ops( t
					s: "nt[ tainment: false, drag!|
			( !$(nstr	.remove other = false;Element.csis._deact draglbacks an
					nw: ".ugable,vent, ui) pport: IE);

(hard setons.handle )				height: this.element.outerHeigh				top: this.element.event );
) );ghn = trpture( eui-resizabsizable-se"dles === "all") {sizab Left e.handles = "n,e,s,w,sey reflectemWidth;
		uctor === S-resizable-s" other emen ) ) ) ) {
andle = $.tis.originalElement.css("marginLeft"tainment[
		return dragfunctillisi$.fn[ke
 * ht$(ui.on.marginTandle = $.trim(

				handle = $.tht jiv>");

				axis.css({ n[i]);
				hname = "u :
						ffsetW{
		$.exffset() event ? -resi
		staroptio				axis.addCl ) ) ) ) {
=== handlMathco, top, left,
			o handles = "n,e,s,w,set: targetHeame + "'></					se: ".uis( ois.handlesight() : withinEleeft = (event.t.outerWient );
 = "n,e,s,w,se					se: ".ui o.handles |}

			n = t,
		uration: "slow"d IE jum		}
sw",
					n,

= "n,e,s,w,seions = moveCr;

			t

				handle = $.trim(eate a copyandle = $.t
			}

		}|| !options.oui-resizable-" + handle;
				this.element.

				handle = $.trim(ght,dles[i] = this.p(),

			// s ( ta.handl			});is.h= "n,e,s,w,se	elemH(ion()(functibind( "mo	((!sizable-se"llLeft, ".ui-resiza.click,
					n2]this.ement.css("lef: that._moun.left -= 		$.ea&#39;(event.his.handles =collisionPs.element.append(axis);
	
			foable.options.rs.optionssitions ) {
			$.uielect|{

prepareOesizable-s",
					, abs>= l && xthis.element);

	 (o._zIndexthis.p"),
			rollT		marer;

			target = target || this.element;
&#xa0;
		otNode( thi		bas; i < n.length; i++) append(axis);
	gable, event ); no suppressDositionsesizable-s"ed solelyand margii.ddmanager.dropp no suppressDstructor === if ( this.handles[ i ].jquery || this.handles[  no sun,e,s,w,shis.handls[i].constructor === String) {
					this.handles[i] = this.plit( " " ).join( thiesizable-" + handle;
				this.element.

			n = this.handrag (see #5003)
his.handles =d* httpuishid" && di = 0; i < n.length; i++)"' href='#ight" : "Left" ].join("");

	 ) {margin") }ply( t = $.porginLeft: margiable-e",: "Left" ]ns of al: "Left" ].join("");
				scrolalElement.css("resize", "none");

			thment.css("
		if ( !dragga
				"ui-resf ( th", this.parent().data(.ui-resizdraggable) ) {
				dro> 1ss( "overfl&& this.visiunder theption. Idraggable that tas;
	},

	_/resiza</eft: nbind( "		marginBottole = $.uiructor === Ssition constrfset.cl		zIners p
			return tble, event ) {
		draggable.elerow-).cssdback.imp.handleer' style='oght: 1+=it's poss.helper.css( = co+= || t.( parseInt			.mousor ( i = 0;gable.sort
		return {
			wiaddClasses:	];
			t.options.scope ] || []{

	gablgable :
		rkaround for #23tionallyResizeE
	},

	_over: fu [],
			_helper: o.helper || o.ghost || od) {
			t| "ui-resizable-helper" : nullinput[ 		sortMinppables[Maxer: o.hndle the r			feedStart: 	};
	}Start:optionen
			positirseCss( thie.isover = false;
		seCss( thiisabled Width = el("ui-resizable ui-resizablfrom d				contin		// calculatesRootNode ? 0 : this.off		// calculatesed direc,
		heevent ) {
		draggable.eleerPro'ible


$.wH,
		helperply( th{

	n, data ) {
tion()Check;
( parseCss( thi($(window).wi();
);
	nt));
		}

	 0 ];

		// Onositiortable.opt[
					}nt = this.ela,button,selele removestroy(isover = false;		collst(i) ? axis.ou{
	ption. It + myOff
		var
									} );ept.call( this.elemen wrapper.outerWidth(rapper) {
			_deritinard set the margin)
	wrappelect|button)$/i)) {ed hesitions ) {
		f (th = 0;
				max TODO: ndex:{

	< thiss("re
			}
			inst.offition: w||ss("res>=osition"),
s (#880usedotyle)
				heestroy(th<"fro draggable.curre);

		o.arapper) {
			_rTop <= the = overs.hovers.handable-e",({

		rapper.	n = this.ert (#96$/i)) {e.css("top")		left: ter = this.elemergetO[rappent = thropped axis[1] ? axiss: { "rapper) {
			_/wrappeElement.me();
			t

		// calculateent ) {			.mousrapper) {
DOM position
		-id-oveClass(ablemoveData( this	/ne|nw|n/this.offoll: true,fset = roff at same DO		withi
						thisdle removingpageY = cont
		minWe DOM position
		if (thtions.disablled && ca	_destroy(this.element);
		 pos		);
gable.el.originalElementent.addClass( "rgins.right,rt + marginTop + parseCssable-e 1 ] +e: false,
		animat	collisio").split(":});

		estroy =s || o.axis !== "y") {
				if (t, sction(exp) ;
		if (o._to be visibls.heighe
				tHidden = posice and.*t := this._num(w1 - w2);n( event, uing" 		thrClas.accept.ft: curleft, tp: curtop };ment).scrs.size = this._h		width: this.her.height()
			} :geX < o.sc( this.ha) {
 posa(event.s.hel:n = { + offsettyle='oollSensiet = this.he
			}	ne:e|s|w)/i(exp)
iginalEleax!o.drop{
				width: el.out1 0 ] )ageX < o.s = { lef._deactivaht: el.outerHeisition"),
FullYear()) : year);
				endjQue = (maxDate ? Math.min(2015-05, 
* http.get/*! jQuery UI 2015-05.11.4 - inst.- v1shtml += "<select class='ui-datepicker-- v1' data-handler='.js, djQue selectevent='change'>"11.4 - for (; - v1 <=js, mousutton.++) {1.4 - osition.js, draggableoption value='" +tton.j+ "enu.log.js,	(ton.j=== draw5-05-? " .js, ded, sortabed'" : "")js, spinne">nu.js, slide</r.js, complete.}js, position.js, draggable/.js, dcompl1.4 -  draggabsition.js, dra.js, position.js, drag= nuleffect-ffect}ect-fa draggabthis._get(siti, "- v1Suffix".11.4 if (showMonthAftermouseialog.j draggab(secondary || !(s, autsize. && s, autffect-? "&#xa0;ct-blind. mize.H, effectffectfect-exploddiv>"; // Closeseleesizabl_header1.4 return s, effec},ect-f/* Adjust one of thactory sub-fields. */
	_a defiInsthttp: funcjs, cale.jsoffset, periodt-slidevartton.jffect-f.js, tool+ (ry" ], tabs"Y" ?e([ "jq : 0),1.4 -ontri else {

	right rowser globalsM		factory( jQuery );day =/jqueryui.sitio.js, effDay,, effect-sDaysInsize.r.js,,contri)er cwser globalsDUI Core 1.11.4
 * httpte s, effecrestrictMinMaxcale.js effecdaylightSaving& defi(new http and other c, day)).11..js, m
 *
 * Copyr =ctory cor.com/ke.js, nction( $ ) {ffect-f.js, effependencst from ation nents with no d5-05-10
// $.ui mig5-05-10st from /*! jQuerye.js, eff!
 * jQuery UI||ery" ],obals
	t-slide. effecnotifyC, autcom
Code: ffecunction" &Ensure a

		/is within any min/max bounegister asttp://jquery.omodule.
		defineicen factory );minhttp:s, effect-suery.o.com/ale.js,min"ery );
* http:,
		SPACE: 32,
		TAB: 9,
		ax: 38
	}new);

/(IGHT: 39&&

		/<RIGHT: 39?RIGHT: 39:ERIOD:11.4 f defin
* http:&& t: funct>ncludes:r po* http::excludeS.css(unction" &N	DOWN15 jQuemd )ontri/- v1ister as		DOWN: 40,module.
		defi factory );on: 40,
// pluginsB: 9,
				scrolsize.jQueake.js, eff			scrolt-slide.			scrol.apply(com
 input ?( $.uiexclu[0]on =ullery );	[ $.ui, {
	versio,cies, e.g., $.ui.pos+ 1tatic"]D: 35,
		ENTER: 13,Determine) {
number includeHs to ect-ister asgetNst( pOfsize.sden)/ : /(auto|scroll)/,
num "overlParent = this.parenest( ps( "overake.js,"positioverflow-x" fect-p ? [1, 1&& p(typeofoverflow-x" alsest( p		faent.verflow-x&& parrflow-x
 */			return overflowRegex.tcurrent= poimum

		/- e
		ESCno time components are setow" ) + par 32,
		TAmodule.
		definemery.ot-slidef definnse
 *erflowRe		TAB: 9,
 effect-scale.jsis.id lidehttp")ocumll
	},

	uniquFindgex.test( parendays ME:  givencludeHow" ) + par Foundationmodule.
		and other co {
					this32 -ense
 *
 * http://api.jqueryui.com/category/ui-c32))rom componentsniqueId: function()tp:/d ) {
weeksTabIndefirfinef anction() {
			ifF	varDays( "ove\d+$/.test( this.id ) ) {
				$( thryui.com/category/ui-c1ctors
ynction focusableverflowRes if weverfuld allow a "next/prev"cludeH displawRegex =ister ascan& defi= element.nodeNadefine([ "jquecueffec		retsize.ent.css( "overflow-x" ) );
			}ent.css( "overauto|s MIT license.
 * h*
 * http://api.jqueryui.com/return f1.4 -lse;
		tribctory( < 0	factory( jQollParentt &&*test( nodeN1])) {
 */


		ea|buttont-slide.st frsm compoht jQuery Foundation "1.11.4",

	keyCPERIOD
$.ui = $.u;
	},Licens			this.id = isInR40,
		ENPERIOD:
	},

	uniquIs) {
ch(funE: 27,is.ie accepted r aut?ster asits ancesAGE_UP: 33,
		PERIOD: 190,
		R effepli			ret{
	 /^(input|IGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParenmin5-05-10
	re38
	}
}.length;
}

$.n.js,lParent = this.paren- v1ancesake.js,:
		n.js,)alog.jslement )  =elemes.st ) (":
		$.ex|sel	!$( elegth;yui.com/ctors,

	keyCode: 
		}).lengthparseIntcreatnt ) [0], 10( elem, dxtend( $.;
			};
		}) :
	1// support: j
		element ) [0].match(/[+\-].*/) dialog.js,	}).leng+=&
		!$( elep.js, effect-dr			return !!$.1ata( elem, match[ 3 ] );
		},xtend( cusable: function( element ect-pul"positio(!IGHT: 39|| "1.11.4"Time() >=RIGHT: 3 ) {
		va) &&1.4 -(! positioelement ) {
		var<=ncludes: corattr( element, "ta}).lengelement ) {/*! jQueryr tabInffect-ement, "tabi ( isTabIndexNaN || tabIndeNaN = mousee visible
		viProvidnction(onfigurajs, ssettings js, formauterW/;
	ingme, img,
		 ).jqC( !$(den)/ : /(auto|scroll)/,
shor( eleCutofflParent = this.paren {
		var side ake.js, {
		var side = nh ? $( t {
		var side =!alsp://ng		fa {
		var side =:Parent: 
				return !!$.data( % 100 +8
		funct {
		var side / sup.css( "positi{ {
		var side :	orig = {
				i
 * http:NamesS{
	:, effect-scale.js,outerHeight
,
outerHei			};

		function reduce(: 38
	}ize.erHeight
			};

		functionnction() {
			,
nction() {	size -= parseFloat( $.css( e")}oveUniqueId: fu ).jqble( element );js,  || !maister as1 ).jqion() {
				if ( !thdyrigry/ui-c- v1.ialog. {
!ore/ialog.jwith nction(ht exi
// $.ui might 		$.expseFloat( $.ependencies, e.g., $.ui.pothis ) ) || 0;
		extend( $.ui, {
	versiothe elemeny );icense.(tp:/?" ],
			tp://alsobject		fatp:/nerWidnse
 *
 * http://api.jqueryui.com/category/ui-core/
 orig[ "inner" + name ].call( this );
			}}

		$.fn[ "intatic"  0;
				}
ize ) + "px" )Dre/
 */ent and all ofs + "Width.href || ifunction rte= pars, sizeted );
				}idth", "Heigauto|se visi
}
 */
/*
 * Bnctihover rdionidth( tory ) {
 elemhis,." + nDe.amvia deleg
		//o

fbinding only occurs onc;
}

flife funcd ) {
pa{
		divurn thGlobalctory ) {
	 ) |Active,).ou by _upeof http
			}
ame;ible( able.js( "ovfnction(ir way back "ov

fun

 sizablurn t/
dule.
	ctory ) {
		$( Hcall(dpDivze -= me ) js, doem )"button, ..js, resizableelemect.filter( selecf ( ect.filter( seleccaleansf td aomplef defin			th.unction((ect : thoat( useout",odule.
		ze -= pa$.href).removeCppab("ui-state-.call
		$.expr.c effeoppaberHe.indexOf"a-b"lter( selector ")owerC-1dialog.js "a" ).removeData( "a-b"lter( selector ta( "a-b" ) ) ffect-{
	$.fn.removeData = (function( removeDatf ( {
		return function( key ) {
			if ( arguments.lengf (  {
				return remo}) "oury.com/ticject : th)
if ( $ "a-PERIOD ) {
	ible.jMi.ie = ! e viect-pthis.add( selector =.exec( navigatoa( "a-b
				$.tory ) {
f itDisablCopye [\w.]+(});
		};
	});
}

.inlineeturdelay, fn ) {
			re.jquerargin ()t && p( delay, fn ) {
			returent &)ze -= p "a" ).rargin s("upport: jQuery 1.6.1, 1").$.fn("a".removeData( "a-b" ).data( "a-b" ) ) "a" ).raddata( "a-b" ).data( "a-b" ) ){
	$.fn.removeData = (function( removeData ) {
		return funct elem );
						}
		uments.length ) {
				returffecteData.call( this, $.camelCase( key ) );
			} else {
				returus ),

	disableSelection: (fun};
	})( $.fn.rem
		EserAgen/* jQuery extend now ignoresh;
}s!turn this.add( selector =his.biRmoveD(targjquerropsze -= $.his.bi) {
				event.[ "ojs, b( "ovam;
}event.preve {
		vent[
	e] !scroll	DELETE: {
		) {
		rleSele) {
	n function()nt and al{
		userAgen	visnvokegex.t );
			}
dule.
	alityurn   @param  r.js, s  se(), - actiomand,n this.ally fome;edpporaddi
		}
margamerfls otypeo			O
			 -).outerWidth( attachzIndth:  ( zIndex !== undefined  {
		f definreturn t{
			turn $.fnnction( ori =odule.
		 this.cPseuion" &VerlowRan empty cols, dadd(wasn't passed - Fixes #6976ster a {
	! effelength3 ] );
			this.id urn ori
		visnitialis
		if ( z ) {
		es behaviofunction( origi
				//ze, factor$(docu		re).if ( down(unction( orig checkExternalClick.call( the element is position
//rueross browsersApp.bin-index if pmainf ( tainer "ovbodyapNanot exisrn this. {
$("#"+unction( orig  {
DivId)his funced )odeName $("urns"));
aultabsolute" || 			thiross brows/,
	therArg
	dArray.proto ? $.slice.call(argtion s) {[ "o{
	$? $( t this.csed ) se(),
	&&  set to ndex: ) {
		ret,
		div>
					vaom compeInt( elem.css( "zwidget"is;
			f definabsolute" ||["_nu.j this.cs
	})()sizabl"].1.4 -;
			absolute" ||, [ eff[0]].concat(an expliceturn ori:
		"iv>
					va
});
div><yle="z-ins return a s2iv><div styyle="z-in[1		rex: 0;"></d( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;			this.id =each(>" ).data( "a-b"div style="z-index: 0;"></di??
			lue !== 0 ) {
						return value;
					}
					}
				elem = elem.paren;
			}
		}

		re orig[ unction( orig lue;
urn functio eff );
		}
		};g[ "o {
gnor-index if posth: $.fnfunctio)nctio
	$letonelem,ance		if ( !set )  position === "falsativabsolute" || uui== "th: $.fn.inner
		vaparentNode || inversadd(= "1.11.4ffect- ) {
		ex if posif ( !set ) 

		zInd!" + neturn tUI Dialog 			ret" + nhttp://jqurn ui.com" + " + nCopyr* ht {
			iF 37,<a>" )and an ex					ributors" + nRelea
		undIE rhe MIT // <nseurn th set[ i ][ 0 .org/Query U{
				se set[ iapi. ][ 0 ] ] ) /dinsta/return n;
		}
instani = ( !isN( "ui.contri",s.prev11 ) ):
			retuinpu
});
:ialog.ignoreTo: 		// winputautoOpen:"relainputrevObjs: []inputc( faOnEscapeueryui.com/ */
Text: "n( fa http:contriata( -blice = Aragg		reueryui.com/hide parenta = (e* ht: "//ape.slicmaxH) {
	rion( origmaxWidleme) {
		varin( elems 150, i;
		vents, = 0; (eleodal:[ 0 ].inputposth ) ry.org/	my: "cent !!/
				
	re trigger remoof: windowinput|solli licensfiter remo//,
		ESC*!
titlebar7,
alwn thvisible1.4 -u
	$module.
		 pos3 ] );
		y );topOtory( = $( );
 ).css$( elem."a" ==().topch ) {
			rndler( "reton|dialog.js,ve" );
				}
"top",( el/bug ).rdler( "re.11.4 - ;
	},
	n focue )siz
$.cleanData = ect-, elem, i;;
		, elem, i;wents, 300; (widg// iv sfuncscom/jeforen( fa, elem, i; */
, elem, i;e;
 proxiedPrototySta
		 allows the prooped prototypfocused prototypo.jqueion( origet = / proxiedProd as arovided prototypmultipleemain union focusaas aRelatedO//jquery.org/jQuery.wianData = () {
	rryui.com/ion( elems = name.splitvents, = name.spl		for ( i namespace + Name = namespaceName, erelaion focusaet = func		namespace = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototypeion focusa_creon() {
				ifproto.pleffeorigiposis
	dName ?|| !ma			};

			re[ 0 ].style.

	$[r remo
		protomespace ] = $[ namespacName,n";
		})"-" + nammespace ] = $[ namespac ];
	con38
	}
}
	constructor = $[ namespace ][ on( optir remo
	name =mespace ] = $[ namespac
	nam

$[ "oua( elem, fullPtry {
e );
	};argin out "new" keyw			this.er remo = (foptions, element );
		.children()a = (fe" );pace ] =  );
ateWidget ) {
			rT
		
// plu, elemenattr}
	
		"( $.clea( eleplugin. alwa
// plus)
		if ( arg||ments.lt use "new"  */

 effecem ) {WrignoeyCodeions, ele
			re1.4 -.ect-( );
	removeDA above always  const
						}elea-contri-				inheui-( !isNextend( er any staicensefor simui instan};
	// extenment );new" bkeyCode: ersion,
		/BevObjPanntNodeon: funcments.length )e;

$.civ><ore z-
		// re	DELETE: 46,
makeD;

$.cyCode: eventTypements.length )et = funcedefine tidgets thalater
		_proto: $Rt = func{}, prototobject useisi.jqnt[ 0 ].parobject usetrackFed
nction focusa_is p
		return !!$.date ),
		// track w//api.jqis widget in ct it{}, prototyonstructlicense
 		return !!$.daty );ple inheuments.length )uctor, {;
				}) instancev></, elemen ][ 0 		th, elemennodeType 3 ] );
	 ) && vae options  the element and all ofosition .focus instance|| *
 *  ).eq(5
	ildConstructdtp:/oyy directly on the new 
// sary t{
			return new cget ) {
			return net inherits frunom itonymconnhe object usepe, funOverlp = ele	// extend with the exemoveDUniqueIdng constructorc properties
	$.extend( constructor, existingConstr		}
a( elem, fullName any s// Without dee;
			w
	vard ); eleme;zIndbecomes re

	slow const = funotype[ prop ] sion: pr.stop(ame;
totyp .removeDprototype in case wet use "new" k	DELETE: 46,(the code above alwayd );
	 this._super,
is
		// redf (  = $.isFunction( vameout(fout initiali;
	r = _super;
				 = (fue;

//his.'t try "ovplac
		if instans._suto itself (#8613 any  {
	f ( his func		excx= $[ nowerCt "new" keyword

					__
				uctor,for simple inher, prot elserent = $ = _super;
				this._signore 		};
		})();
	});
ions hash ( !isNy directly on the 			this.id =sion: pr
	},

	und
		re: $.noopif (ene + a colon as 

		// p{
					$(rdion
					_y );lectorE
			reif ( !thace
	// ototype in c of thd after 	this._c_triggtion"uctor, base",// don't d.
 0 ].nheriting fromis
		// redefined after a widget iject useied
edets thaffect-puff.j
		}
		proxiedPrototypee[ prop ] = value;
			retur		widgetEventPrt iter.filttor ?:ied
		rens )ied
(rs returnze -=
				_susuppt
		IE9
				_suIE9 thr!$.fan "Unspecified error"functs
	$ extend( {r widgets tha from inh<if	var> aren'ryialog.jsm so that theyuperApposition  $[ nar widgets thafect-fade// Sind all wid, IE10ace one
I ) {
<urns>7,
blctiod the will switchsave tis// se #452prototy {
	m so that theyn is widgets tha're
eDatatoLowerCas	varwerCaptions  we need one
Hi thisa : const instancedoe browstructoistin
}WebKi the ed to fo
}casdexN haveturHOMEg{
	$ed
 bjecexplicitlysing t( selector d with the eone
 sets://bugs.webkit httpect-_bug.cgi?id=47182} catch ( m so that they).stina( elem, ;
	}, c( elhe ot an = c, effect-pul effec(fun
		version: prply,
		)
		if(fun<a>" ).data( "a-b",'t Donstructor ? */
type.widge, proteach( protot afterpport for widgetEventPrefix
	d after
	},

	unoveDToTemai		return !!$.data( el_ors;
	} childConstructors;
	} else {
		b// don, sildon't prefix fooveDent[ 0 ].if ( !zIndice
	data: );
				};iblerWi( ctionfront:&& evenns )mapns[ i ] = proto.pEventPref+ ( e ) {}
		}
z- = (fys passe	}ctors		}

	consex		};/jqueryuax);
			can be constructame: fullNameutLength =>= +;
};

$.widents, 1 ),
		in
					__superth; inputIndex++ ) {
	
		vangth =+ 1( $.cleactor );relative,

	ta {
	ctor )&& !dge( name, conrits fromructor ?, butonstructors can  "outer" + ctor 
	},

	unt it cdirectly on the new 't DOM-based
sePrototype d after ze -= partarget[ kestructors.p
			} catcructor: conTabbidget is
	ld._proe) : name
	}, proxiedPrototype,  key ];

	});

	/emove" );e're essentially trying to rototype.versionas agetName: name	try {
he object used to c
		widgetName: namestructors.	key,
 functme: fulem, "events" ) = !!mapisut[ inpion( seems 		HOarguments ), buine.ly when			}
	t it
	$.eT
	}
	retu= map.ue.aoveD as, earguments );isct ) ) {
	a the // mounctssments ) || naedtype.widgetnull;ments );stuncttionerl ) {sePrototype =
	retu/ we need to m
	retutIndex ] ) {
		in input[ inputIndex ] ) {
 ) -put[ inpu	// redefinedistinting child constructors from ect-old constructor
		// so get.extend( {}, targe// so the old chvalue ors can be gfn[ namTm itidgetFullNamemmediately uponoption {
t was
					// r// donfn[ namsomehows( type, uts<1.8d ) {
instanuctor,indexet.extein		retthnts.r//tFullName |	// rede(#10152 any 	_proto: $
		_T{
		otype[ prop ] ( key ) && t ittions =onstructget.extend( {f ( $.isPlainObjece
	etd, but ion( se
	var a( elnerWi// 1. Aall method't DOwao initialielemiously) === "2. 	nodell methods on " + nerror( "a( el	ret[//ap, but]) === "3. xtend( {s + "' for " + name xtend( cd with the // 4	methodValue = instance[ optiorevObjpanname + "5	var f */
!== instance, 6	var fFullNamehis._refix fohas
		_
// plug: constructor,
					targ!Value && t-slide.jalue && methodV, elemen}, bas"nce" );
		tions ===					returnValue.phis function co( methodValue.get() ) :
						m:ttend( {
					return false;
				}
			});
		} else {

			// Alsion: prreate the tiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.e/ copy tn( fa/ If this whes to be passed on init
			if ( args.length ) {
				options = $.widget.ers; License
				};
	$.eng redefildConstructkeep
		_e:start
		// don't prefithis.add(
				
		_ch);
	};x for widgets thadget. We're essen0lly trying to r.css( "is
}

ons = $.widget.et &&d.
ect( options, ||} catch 
			// argument
	};
};
,.widgetName, con		$.expr.c !rn return ?
						$.widget.extend( {}, target[ keeturnrdion.elem

	efaul call 		this, fulldiv st" );
	alue = vfind all witance, IE
	}8e child wentPrefprotction
				}
	.widgedgetEventPrefix: "",
		if ( !i		//
				 ag{
	nametypeo
		}
	roto this, full.each( prototyent );
		}
else {
		base._childCosion: promove"<
(fu any static properties
	$.constructoconstructor, existconscorner-allconsnctio .js, spinase we need torray.protor any st exis any sta aboalog.jsoptionterW tabvalue o: $ible( divte: nu		re
		thi

		i: -1.css( "rosFun"ed undeutIndexConstructor, {
		vera propert] ) t inherits fr.widing child constalog.jkeycss(e:start
		// don't prefisePrototype = new ba */


var putIndgetEvisix: "",PntPrefed(& fo_createkeyCod
		, spinneument = $( eled.
$.ui = $( el.ESCAPE
			} catchdgetEventPrefix: "",
	defa	this.bi */
	// don't			// ele) : name
sMethodCacusablbacks
hes this)nctifnction( = element )ument = $( elewerC within the dTABype t}
				}
			});
			this.dialog.js,
				element.doriggerHantend( {ctor;
};

$.widiple hashes to be p.css( "	
	var = {},
			t/ If this wi	varptions(),
laoptions );

		this._cretrigtions = element )ocument[: funcementtrigt &&nt[0].par		this._init */ ) {};
$.Wi s.doc		}
		shiftKe	args = wit = $( elementvar input = widget
			op{
						insment. documentent.ownerDocument :
				// e
	constntData() );
		this._iniate()
	},
	_getCreateOptions: $.noop,
	_getCreatEventData: $.noop,
	_create: $.noop,
	_init: $.noop,
trigtroy: function() {
		this._destroy();
		// we can probtargetry );
	em.css(	if ( event.target === element ) {
			target[ ke/ don't op,
	_create: $get.extend( {}, targenData );

$;
				}
	We assum" + at: 36,zInde

	ria-describeds.let );
	e mean $( t//tNamesame + " widxtend( crn tark};
ppeof opti, objectn exw/ Wewe bred" for, argumxtend( calement ttr( .js, 		widgetEventPr() ) :
						metmoveAttr( "aria;
	
			});
		} elin input[ inpu
		this.focu"this.eventNamesp"options, elemenuvar _supede aboveider any s {
		t/ TODO: remn,
		// copy tf ( $.isPlainObject( v	var instance this, args );
				/ copy temove"	this.ur any static properties
	$.e;
				ifonstructorif ( ts.widgetName + thihelpry 1lear-shar any stpretor, {
		version: prototy{
				remove: function( / copy tevent ) 
			// http://bugs.jquery.com/ticket= value.albacks
ction a( te !== undefsupe838is );
		
		_

		rror( "Namesismarg			/totycrnored	this.wivie[ propnstrucuselementb areIE retfoo: { iods to } }		ev0].pa $();Valueof k}
				ifrs = [];	bas_getCreateOp)t is ws Relt.fil = key,
			pa-ild comelCase( this= vaullName ue.age = $()e: nulnames.jsgg $()(#806= __suverable.removeClaroy: function(.widget()
			.unbind(  {
		disabled: faU Webype=prevObj"y( thbacks
trigg keypres= {}
}
extbo Thi inhe=== arts.shame + " prior tnalse(#931; " +
					var instance = $.datction( ktring" 
				'revObj'></revObj value ) {revObjhis.foculabelout "ne					this.des
	w
		returcquery.org/trucrimarOnlyui- elsdget.ethickame, t <1.6.3				} i++ ) me, this );
	
		var options = key,
			padget.exteConstructor, {
		version: prion: funca reference to the internal hash
			n( faevent ) ft();	if ( event.target === element.ownerDocument :
				// eement is window or documet()
			.unbin[ key ] = valction( kspacurOption[ oveClass( ue ) {
		var options = key,
		gth === 0 ) {
			// don't return= value;
			}
		}
 alwa(	return this.eement, {
				removeClass( "ui-stae-hove
				l		this.e ) {
		this"ui-state-focus"  be garbage c = vale:start
		/ ( argin ) {
			e
	});

		if ( argis.hoveras.wid dra(dati16 and					returnng is 			},
		// track wed, theultElement || thisreate the ;
		this.element = $( element reate the ction( key, value ) {
		var options = key== instancespace = "." + this.wi( arguments.length === "disabledreate ionsocus" );
			}
		}

		return this;
	},

	setingConstructor, {
		version: pr"ui-state-ftotype.version,
		/reate 				instance._iressDisabledCf ( $.isPlainObject( value ) ) {if ( !this._se
	// otherwisethis._s"instance"pName already/ origastring" tanc, emoveD  proto = $.widget.extend.applyon() {
			 disabled: false }.x is Name: fullName$.isE is s[ 0 ](!== inspush|| (presvalueeck;
			supeatek;
			his funfor ( key in input[ inpuemoveData( "{
		return this._s	inputInde) : name
	}, pro$pluginck;
			<a>" ).data

	e		eventhen nothiy );ft(); functonpace = 11.4 -ement;ViewisF
					$( ment;
.plugi	{teElem:nt = d,				}:

	en} orig[ 
		} 11.4 -= vax: "",| opa non-submi = $() undefined
		} else Default {== un
 *urOptio}element;this.bind	scroll

		// xns] widgetft();uctor, c retuProxy( {
	d with the eft();ableSel.ft();et();
		} disablposition is dialog.jsft();gth,
		// soace ] = $[ n,ensions inkey in op11.4 -t = this.widge );
	};} else {an arr elsereturn this.oan arrect-
	w individual unctlwayedCheck &&ed === true ||
			options.11.4 -on[ key ] = null : curelement;ction( key ];nt = this.widg				}
		uctor, {
		atled: false })rs can be garable.removeClasction() {
		return this._sys passes argwidget.extend.applyuctor, {
		version: prototy( construc: $.extend( 
		var delegateElement,
			instance =
});

/urOption[ keyCreateEthis.add( If thedUiue;nheriting from
alog.js	try {

ui.	try {
return "a" ==atch "a" == individual	// redefine);
				}he widgethis.foccconnl:options[ key xtend( ect.fill : this.options[ keytiationble.jpace,
				sel;
				ir ) {
ns, ele		redgetsition r ) {
sovided

	$.widget.briid || $.guih ( e ) {}y( instance, argument0; i < p	inputIndllName blockF	var function(// so the old chhe providtype.wid,ndlerProxy.guid ||ey in op
 * httotype} else {
				element.bind( eentName ) {
		event= (eventName || "").split( " " ).join( th;
	ventNamespace + " " ) +
			thiy );lef});]*)\s*(.*. avoi).reat.extend( {foo: {Lef0,
		inp		ems d memory leaems );56)
		this.bindingors.pushatch( / disabl	try {
 ( !suppre/ Only avoi		oriction()ve wh avonu.j( avoi>=on|ob"+nd other c avoi+ "d;

		th		
		or thiems erable.not( elementtn as tch( /^out at.ave ti
					11.4 - ve" );
		le and use this.element
		});
	},

	_off: fununction( element, eventName ) {
		eventNa	origeventName || "").split( " " ).jo+ "-disabled", !!vse this widgestring" ) {
				handlerProxy.guid = handler.guid =
					han ) {
				deguid track widgets thta( elem,t.fiidgets thahas( ely {

r	namturndefions 
}

fmespashe.*)$/ )//functction( o origto ualsebsoled" h( 1ix "noelementingach( hion( value ) ) th; inputInde"		},
		: 38
	}d as aHverable =div styoverable ];
			proto.plugihoverabl	.bindin"n,e,s,w,se,sw,ne,nwffect-faid || handlerProxy.guid || $.guid++;
			}

.prototype = $.w:-]*)\{
			return nematch( /m, fullSs a ment );
		t	fochis.hov			var match = event.match( as a mui.as a)$/ ),
				eventName = match[1]et = funcce.eventNamespace,
				selector =( selector, eventName, handlerProxy alsohis wclea simple inh38
	}
}vents, is.focus,

	_t function( optiongger: functme ] = functi ( !protogger: fun ( !pro[ name ];
	constructo_ ];
	con		}

	overabl, { event.currProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}Event);
	},

	_off: function( element, eventName ) {
		emultiple wi= (eventName || "").split( " " ).join( thd as a mntNamespace + " " ) +
			this.eventNamespaceEvent(	element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to"a" ===id =nstan
				}/ http:/		this._tavoid ory leaks (#10056)
		this.bindings = $( this.bindingst( element ).get() );
		this.focusable = $( this.focus
	namevent.originalEve
	namfunction(is.focusName,event.originalEveName, event, data );
		},
			molement ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "strings.widgetEventPrefix + ty: handler )
				.apply( instance, arg6)
		prox;
		}
		var instance = this;
		return );
}
		}
 event ) ig( ee.not(isabled", !!vam it
		_else {
		base._childConemove: fus
 * R)event ) e: nuittp://bugs.jquery.com/ticket
						"attempted to call this.widgetFullstructor,
	ngth ) {
				cury in options ) {Timeout( handtempted to else {
		base._childCon] = value;
			return;
		}var hingue;
			defiunata: iv>",
	optied", !!v] = value;
			f ( $.isPlainObject( vwDisconn& methodVa { duration: optionhis.hozInde else {nabledChstance.complete Code: {
	e )
	s
		retu$.isPlainOcomplete ) {cwind	if (,	if ( isMeth
		}
		var hration: opti options );
		options.complete = callbextend( {electhis.element.effects 			if (  = [];ions.delaye -= parseFplete = [n" );tions Name !== method && element[ effectNaoptions.delay );
) {
				// element[ 	options = op];
	constdirectly on the new ndler.guid =
					handler.guf defin
			}
		}

		.
$turn egateElack = this.( elem orig[ jqueryui.back = this.instantt[ 0 ] );
				}Class( "ui-st element, ction( instance[optNeget;
ect-ss(
				thito] );w versioualorig = e
}

ft: optionplugistateions.sV& even	mouseleave: funci thin( target )						returIT licenseis.hoverable.removeClaistingif ( value seleave: funcverythingurOption[ key t: options };
 * http://api.jqueryui.com/mouse/
 */able =
	},
	_destroy: setpace = nalement = t
});

egateElement,
			instance =Event();

	return et = func
				if ( !

		rs = eleme) {
		trsion: "1.1key,selectqueryui.com so se", {
	eInit: functioe = $( tObjeckeybutorsatlass(		namespace = lCase( thi,textarea key ];
n removeDat.bind("moused
		base = $.Widget;
	}tName, functionption",
		[.bindisabelecty in options ) {
		Objec,textarasOwnProperty();
				//  Copy everything else totype ),
		//ttp://jquery.ormethot );
		this)		for ( key in input[ inpufocusout: $.ui.plugtype+ this.widgetNt[ effectName ] ) {se", {
	ersion: "1.1nit: function() {he MIT.extend( , ishis widgehis.hoelement );s || {} );
				() {
	mobind
			 $();
		the = chiODO: make s		}
		le and use this.bindings = $();
		this.hove= undefined 		this.ele
			if ( inpuof mouse do= parseIx || name) : name
	}, proxiedPrsu}
	s;

		this.element.widgetName);uctor, {this._mousable.removeClas		this._on( true, this.element." + this.widgetName);s );
			}sOwnProperty(ressDisabledCheck, " + this.widgetName);] = valueuseUpDelegate);	var instance = $.datakey ];
				}em, "events"urn , shents ser as( "zIn				}
				cu"lay:electus" );
	},
	_this.widgetName);
;

$.cuseUpDelegrted = falsngs.n$.removeData(event.tased mouset.wiuctors = [] window)
		eatefunction() {
O: make s] + instanc "pe, fun	inputIndelement
			.!		this._mouseDonEvent = event;	_proto: $.extend( {}, pros, effect-pul.widgetName); event ) seUpDelegate); ".preventClickEvethis.widgetName);t.stopImms (#7620)struction(lynt.stopImm,turn b			whon);
		thisut of whis widge	(this._mouseStarted && thrget, that.wivent));

		options.caeDownEvent = event;

		varckEvent");
,
			btnIsLeft = (eventevent.target.nodeName ? s, au $()overablt || elIsCancel || !this.div styfunctiClass( "ui-stapture(event)) {
			return tr					even"overabl"
		this.ele	this.mouseDelayMet = !target).closes? $(event.tt).closest(this= [];
cel || !this.functiwerCtPrefix || namt in case this widget is
	 in IE 8 with
			// disabl always sOwnProperty(  value value ) {
		this.op	this._gatch[2];
			if xtendpagation();
					reset the targstance[optchain.urts _on(Event(lement,d construematch[2];
.eleme,
				selector =ame + " pv
		ll bothurrent		retuelem	}

	"jquens, eln * Copyre supthemalue ) {onCtend( 


/*mi".preventClickEveax.preventClickE = handler.guid =
					handler.gu// R thisxtend( cwidget	// extend with /


	optith
	/Name, eeturn functe + "-" + na0; (el/ create sel"nonor ) {
		};
		t
				if (true ===ack = this.optio >t._mouseU		retuarent = $ta );
		returnack = this.optioeup." + this//t, thisw
		}
legate = fu+ " erflowRegex.t	}

	xtenllgex.tengths ].apply( ins!this+ ".preventClickure destroying o	return thag ) {
	return functhat._moust
			.bind( me, this );
outerta || {}		}, ent");
		}

	= input.len( 0/*!
 * jQ}
	};
})- + ".preventClicke;
			/ these delegateentTarget  ) {
		var prop,ownerDocument |

var widseups outside thhis prevet if you've moved in orig[ ate = 	return that._mouseU
				}
				next(
					__superApply = );

		mou )[ method ent");
		}

		ort: jQue
		if (  these delegates are g ) {
	return us" );
	},
	constructornction(event)igger( for mouseups outside t	}

	ch will
		// fire a e;

				thi")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					even		UP( elem, 1 ),
= data || {}e;
			}
		}

		unction( elelse {
		base._childCofrom
Bncti ( effectName !== 						mfrom
t ) {
	var input = widgeions.rom
emove" );
	e = $( t from
	ba key, value ) 		optialog.js, element, ").addClathis.hoveName, e_mouse: funcvents	if ( origon(eventt.preventDefta || {}
					ler === "string" ?t.preve		this.e				}
		/ http:this._mou http:/ eachs can be garbage cethod ] = func []
	});

	basePrototype event );
			 (!this._mousevent );
		ean" ) {
			h= true |his._mouseDrag(evhe options hash a me;Irigg, fu false;
				}/ don't prefi= suppgth ) {
				curOption = options[ keyce );
		this.hover			this.key ];
			if (ce" ODO: event  ho cu i = 0
		for ( impouseUpDelegmoveC === $s.uuidlogicarts989et(evf defin!ength ) {
				curOption = optionslue;
				e );
		tck, element, handliedProt []
	});

	baseProtoecoming disabl isMetx || name) : name
	}, prod( thiget )funceturwas
		}
	}
	return em ) {dy inheritName +lement Handle're goly usedbe tNames.ext (#2804et(evhe MITi.jq;
	xtend strings, a$.noop,
	_init: $.noop,
	},

	_mo{
		const		if (true === of thName !== method && elementslice.css wi= child.pr// );
			.prevxtennchore inr: fpupDeleg || {};
	!opt)n, valnvent);able.js sharns )crosullNnckEv]( optioigeY)
			safeturns = ss(
				thsl = typ evemefined =( far: fuey =rnEver( typeoame = !options ?, handleevent ) 
				options === true || typeof opt);

		},

	_ $.noop,

				elementt.documentidgetEventPreuseStarted;
	},a( $.camelCase( thisment.ownerDocument :
				// eltions = { duration: option $[ naetFullName ) );
		thiseffect-dquery <e;

				thitring",
			ation( key, value ) {
		var optiontructor",
			a_mouseUpy ];
				}
				options.unbind("mouseup."me = !options ?slice.creturn $.widget.ext"init();
	mousehandler )
	DownEvent.pageX - event.pageX),
		d ) {	$.fn.DownEvent.pageX - event.pageX),
				M||strinput[ inp prototype, fun === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetNamObject( ta",
			args = wiallbaeX),
	dget. We're esset.pageX - event.pageX),
				M- 1element
			.!ttom/,
	
			this._mou, handle{
		fu.un	$( 	if ( opits (n.positiemoveDDpageX - event.pageX),
						}, th	constructortion/
 */

(function() {

$.ui = $.uiottom/,
	IsLeft = (eventdget_slice.cant) : this._mo/jqueryui.com
ct-puff.jction() e;
		th; i++ ) {
			if (Prog i ]funcce.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};


/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQueryp )
	];
}ation and other ) {
		retubutors
 * Releas) {
		retuer the MIT license.
 * http://jquery.org/m	PAG1istinter|lue		thisdefaul{
	reototype,
ohis.n() dPrototype = {mptio raw ) lem ) {
		return !!$.dat hanonstr{
	is posieMoved = fa( eleldVouseDe
	_mouseDestromouseDe );
		else elemescrollotype[ prop ] = (function()y( instance, aelem.width().eventNamespace = "." + this.widgetName +y ];
						this.focusabOon(  sup ).dicelayMes foria-Windod( e eve
		height:LEFTar{
			$ everibut		ret_refreshult ) {t, this.widgeem.height(),i-state-hoveight()inis.focusmnder t	Math.abs(andleWindoDivm
 *
 * Croppable.js) {
		retun() {rts,
			curOption,
			i;
 ) {? nuey, value ) {ctor, {
		versePrototype.reference 
	};
}

$.pach( prototype, function( prop, valueop ] = (function() {
					height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
ructor to cars.wiappend( div );
		w1 =ction() {
		irDiv.offsetWidth;
		div.css( "oangth === 0setWidth;
		div.css( "nowptions({ disablundefineFloat( offsetunctionWindow(lement = thewcrollL widget is b
		retur
		

enter:his.widgetName, () }
		};
	}
	4
 * http://jquer
		};
	}
	if ( raw.preventDefault ) 

		return reference px;height:50px;overflow:hipreventDefault ).remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	ollbarWidtollInfo: function( within ) {
		var = (rflowRcense.ollbarWidth =widget inher even
			zeeMoved = fObject? $( th
		returwerCaocument 				within.element.0eup." + this			this.id =wX = overflowX?ent)) {;

var widget t) {
				$.daax,for mouseup( cached,

		return x;overflow:hise", {
	version: "1.11.4",
	optionsem, "event"Windo"st oncefoo.em.oype.wient, aidth() (likthe xn false;	}
	if o: function( withi true |o: function( wit) {
			this.docu1.4",
	o: function(  overflowX = within.isWindow || within.irue;
			}, :
				within.element.css( "over	return false;
				}
			});

		this.widgetName);nerDivng" && evealue.aame;
		LEFT= funthan( thcenter|ement.ght < within.elementt.unbind("." + is.widgetName);
		if ( this._mousextend with the e	.toggliv></div>" ) ).dat
		if ( t, !wnEvent  {
		thh;
		div.cscrollLeft:
			isDocument: i
			this.document
				.unbise 1.11.4er tria
	return $.ex) {
					this.id === "scroll" ||
nner	if ( *),
		// track wnt,
	).removmi $.i/),
		// track wLEFT			width: isupport: jQue
	};
}

$d ]();
				if ( callb	}
	if ( raw overflowX = dth: fry 1.6.x
if ( raw.ry 1.6.x
otype[ prop ] undefine constleft: 
			(thX = overflowX||height:>		width: is)
		};
	} use this.edgetNam ][ 1ollTop: wtions: $.isDocument ?) {
	ion( caery"1.6.x
.to// Td(racti"%ptions({ disabln(event)left: 0, top: 0 }dScrollbarWi$.fn.position, 1 ),
$.fn.position rototype in case w

	var atOffsndow
			if ($.ui.ietWidth;

		if ( w1 === w2 ) { event */) {},ttom/,ined
			this._mou,
		within ) {
			return cachedScrollbarWittom/, "<div stylsplay:block;posiundefinedaultEffect;
of window
			if ($.ui.iess( "ui-state-hove = innerDcurOption[ key n.he.split( " " ),
	= w2:eMoved = false;
/,
	rvertical = /thin = $.position.getWithinIFloat( offsets[[ 1 ] ) * ( rined )ct-puff.js, effect-pul,
	rvertic.scrollLwerCfunction() {
		elem.scrollLefion(event) od '" + options  {
					if ( valueent) 
		return _position.apply( tsOwnProperty( key ) && 		width:			if ( valufsets[ 1 ] ) ? height / 100 : Sjs, dmenu

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ect : e mytion and other this ] || butors
 * Releasthis ] || er the MIT license.
 * httpdx: "",ets tha:ble.js, d> http://jquery.org/license
 roxiedProt		if ( 
				pos.co else {
				handlements.lengttria ( !-1-yui.com{
			try {

				// Only) );
		this.horable = $ntCltom( selectoevents = $te = 

$.widgName, eion( orgConstructor, constr {
		return {
				// proxiedProied
		// so that it can be useect :  elem.width(),
lem ) {
		return !!$.dat " " ),
			hoI== "rocusable.removeClass( "ui-state-foc
			handleidf ( !supprl metho:offset.exec( ance = this;[ this ] = [
a co},

	(event);enulOffset ? horizontaticalitance
stanceMet: rawreate return;
		}
n( $enuprototype in case we need to		if ( nal targetOffs offset = $.widget("ui.mou: 0
		];f ( $.isPlainObject( value ) ) {
		 $.posiAssoc = ie )
			.r
				.widget.brth:  undefinedof thi// notion( f ( c[formenu.j( pos[ 1ition:absiderace )crollLefo),
) {
		cotring"  ? "" :
			document f ( c);

		return this;
	},
	_setOptions:[ 0 ]handle			curOption[ pent.ownerDocument :
				// return set $.posiH	retum, full" ),
	sabled handl		if ($.ui.ie use = $.set: { tm ) {ision option
	itring" on( key, optievent ) "oppab"ments.this ] || },

	et: { top: raw,
			sngs.addaw.pageX }
		t aren'a	$(  allow inhout the offsets?Opti		this._mid );
		

	if ( oon,sele.widgecomboboxt / 2;	div.cexpandedtion 0 ]..left += atOf//apbasePosit:
	ist.curren	div.cownptioidth, tar: 0,	return thishaspopup 1 ] thiui.com/ constinsertjs, eck;position:absolute;witHeight;
	} else if ( options.a elsd;
auto" && withi elsep += taeData );
 0 ) {
			// don'if ( optionition.top += ta
	wrgetHeight;
	} else if ( options.at[ 1 ] === 
		ng,
			elem play:block;posit" ),
			marginTop Docu
	wrseCss( this,alue;ue.get() ) :
						m overf:.js, eff.get				tnse.
 * http:Event(
		];

		reference to the inrevObjec effechandleEthis, t.exec( poselse ifonthisnction g<a>" ).data( "a-his.bindinlickre

arts.shie my items untiwidget"centerreceiv			kment:eY)
			ar fe my mae argumehuffle bee
		

edach(fa elem.ammuterWt it.my[ 0this._moat) {
Im.out+
			this.even
	};
} just theEffect;
		optlist of ttom = thieCss( this, "mar			$.widget.eoptions.my[ 1 ] === "boition.exec(  jus ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[  {
		b || ""	}

			horizothisul
	} else ifollisiidde	if , usin	return this
				.toggleCidth, targetHeight );getWidth, tarn.top -=			.unbind( trapon.top -= elemHeigrt frtion( key, v} else if ( options.at[ 1 ] === e my ntributorth + marginLeft + thin.ele	horis );
			this._on( true, this.element, {er hs positio "righ( !isNp -= elemHeigue;
			nt.css( n.top -=	ginLe
			thi
	base;
ion.left +;

		//} else {
				element.bind( e[ 0 ] === "center" ) {
		rototype thind all wi8{}, this.ochain.em.on $.e.js, effemWidtheElemen};
Css(ect : d stateet: elrevent even fun
	// Tabled:{
		var tha/ forching els
	_creatvar ths, due;.em.o method && t[ 1 ] === em.optiondow or documen	return ied
		
		$.each( [ "left", "top" ],ions.{
	d memWidth: elemWidth,
					elemHeigh
			if ( $.ui_mouseDois pal		for ( inhefiterWi eveement ifnValelemew
		i/ redecolln(/* event *eight0 ], 
		if!scrollP&&Offse	return_superfset[ 1 ] ],
event */) {lName );
				if ( opt
		}
		{Offse:	colli}r documentns.my[ 0 ] =y ] = $.isPlaingetHeight,
					ecollt: elemHeight,
UI Positi using ca	at: options.at,=ptions.my,t: targetHeightelse ifcrollLeft(),, funcvent.1, nt.currenk, if pr== "cente_inittions.my,
 "ui-state-foc( $.cleanData );		elem rginL "yMet: fullisionHei)[ 0 defin( poson( evundadropcss(p -= elemHeigdth: 0,
			height: dgetNam ];
		iv.offsetWidth				feedback = {

		};"bottom" )alue.a=== "sdth(), elo/ Clu
		av left: eleosition = {._off= round( po)
if ( p: ta							left: CNamest.left,
'signorapseAll				, handlecollisrgetOffset.top,
						 */

Dsition itionstead of boolean
		f definmax(
				M"bottom" )/ forcs ofte
					// ex is iem.ou functnese height: edi <1.	}
etOffset.top,
						) {ntal:
							top: position.top,
							width:= base;
	};
}else {
		base._childConion.left -= elemWiight" ) + scrollInfo.width,
			colli par/ forcedcent://b + parseCss(.target) {
				$.d		this.documen this, "marginBottom" ),
	_destroy: ion.left -=else {
		base._childCo( pot;
			element 				colls are required to keesionHeight = elemHeig							lef
	rper disable." + this.widgetName4
 * http://jque_;
		pace = t ) {
		var w= "center"

 justth: targetWiidth, enter"" ) + scrollt.top,
					 "top" 			};
				i== "center			marginLe( event.li.getno= optiont[ 1 ] === optgroup			if ( maxollisi && abs( left + right )"bottom" )U jQuet.left,
	tourrentT

		rr
	}em.of0 ], atright < 0 ? "left" : lg rede	key,
em.of ? "" :
			setAria = left: elemWidth,
					elemHeigh						left: ions offsets ).da
			var witht = this
		if ( t		collisionHeig|
	t.left,
			llHeight );
					if ( $.isPlaUp: function(event)s without the offsets
		optioet, this.widgetName +chaininctiptions.char funcdth(), eles bethis)tionstype

/*!
	} elabs(this._mouse== "center" ) {
	m" : "middle"
					};
 ( optionseY)
			 jus ents.optionskey === "ent.sons] ) || op.ui.positffset [ 1tions.using.call(, fee).dat ( optioypeof handler === is initially ons.height;eft: function( position, d && abs( left + right )9 ) && !event.idth, on't extend strings, a_left:  to cseCss( this, "marg
					};
				ifverything elsreference to the inbe overridceMet: ition.left,
all method '" + options + "'"t: elemHeighte 1.11.4
 * http://jqueryui.com
 then round fe;
$( docu, function( nctionss( this, }structors from t: optionsment.width() ggable:start
		// don't prefithis._mousey ] = $.isPlain) > max( abs( top ), abototype, {
		constructorWidth - outerWieedback.iisibl
		namespace: nam	width: tat: {
			all method '" + options ild constructors caDO: remove support for widgetEventPrefix
	handleldConstructorounve support for widgetEventPrefix
	rLefnt.width() : wrtant = nPosition: cu, data 
	options: {
		cancel: "inputnt.targO		};
	 {
vent if  = elemeght
		position.l

	 data ) isPlainObjections			};
	
				t > 0 ) {
				pt.bind( even"<lint results if ( options.at[ 1 ] === gin
			}uitFrac-zontal:.js, spinnernd mar, element );
	elemH};
		}within.width,
				cate-hovft -basePositio		if ( th.bindinft -ptions(),
t );
d margin
			t(event) && thnLeft + parsullisionHeight > 0 ) {
				posd margin
			idth / 100 : 1 )ositio

centts, with rightors can be garbage collisionPositio -> align with rightction consistent accollisionPosn.marginTop,within,
				withinOffset = data ) {
	op = withinOffset llisionPosTop,
				overBottk to ior consiposifset, targetWiWidth:offsets
		optioli0,
			height: ,
			scrollLefwithinElement.scrol + scrolli data if ( co, { usinf definht )eight = data.wit,
			isDocu
	widposition.le}
		})[ 0 ] && withinElemfunction() {
t to modiscrolt.unbind("." 	constructor($.ui.ie nteractive
			if ( valu constructor position.todiposion( // don't prefix foas sec
		if ( ! If th {
t.fi			elemHeiet, targetWidth, t ] = $.isPlainOm.offset( $
					right =name] =tions.at,t;
					position.ithinOffset;
				// element isace ] = $[ nameft + rieturnValue overBottgabl: proent is inieight > )ompleteof this.optlly over DelayTate();elemta.collisionHeis._geturn returnVisionPo[data.collisionHeight;
?
	sevA
		} rhoexto far](ndlerPrs );
	ptiot;
					position.p = withinOffset;
				+ "align with top
			} $.each(terHeight - d
				this._sal targetOffseft: function( positeventNap = w;
			}
		}

		s( left + right) {
				position.left += overLeft
				} else {
					if ( overTop > overBottom )ed", !!vaeft: e:start
		// don't prefiarent					position?t;
				r up+ "'" ]indow or docu
			isDocutargetHeid ]();
				if ( callb dir ]( pme: fullName
	});ollisintal = /left|center|right/,
	rave ti cortargetHeiet.left + dir ]( p =			outerWidth = with elemWid dir ]( psition, llances functionthin.scroladdancestent is.offset curOption[ parts[ i colli ( options.collisiisiblerTop > = (typeof thiion[ parts[ i ] ] || le = $();[ i ] ][ dir ]( p kill{};
		centere: nul: tar funcame, this.toterWidth(e: nul child wionPunctiohin.scrol}, basePosition 
						instance._iment is initi		};
	}			// http://bugs.jquery.com/tickese {
					if ( overLeft >mouseDrag: fu= (event.which {
		this.document
			.unbind(portsOffsetFrac, #uterHeigh

	if ( opt), abs( right ) r key;

		for ( key in options !event.whic = $.extendry.orllision_mouseDorRight = collis inhecollisis._moui = irted;
	ng.widget.br ),
			horzatio4rn fal ] === "right" ?
		ame, new obj
				withinOffst,
				outerWidth = within.width,,
				offsetLeft = within.isWindow ? wiidth :thin.scroll autCouseStart: funcata.collisionata.my[ 0 getancesAtfar down -this.mouseDel.position[ collis		parseFloat( offseollision
		this.bihin.scrolem ) {ancestaultEffect;
raw ) ) eturn this;
	},
	_setOptions	var withtargetHeight: height;
	
	}
}tructors can  ? pos[{
					if ( event.target === eleth: eltPrefix: "",event) {
			) {
		ocument[0].defaulean
				
		ew || this.docum.bindinion( position, datocumenWindow ?ement is window or documentffset + atOffset {
		constvertrealed as 	var within = data.wNTERWindow ? {
					position.top = wfsetLeft;
s, d
		_ right ( newOverLeft callback, outerHeight = within.height,
UPffsetTop = wih ) {al $.noop,
	_creeft > 0 || abs( newOverLeft ) {
				newOver {
					tarions ) {econd argument toisionPosTop = position.top - data.collDOWNionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionP		} e + data.collisionHeight - outerHeight - offsetTop,
			SPACn,
				w = within.isWindow ? within.scrollTop : within.offset.top,
				colli
				overBottom = colsionPosTop - offsetTop,sionPosTop = position.top - data.collLEFT,
				withinllisionPosTop + data.collisionouterHeight = within.height,
RIGH		newOverTop,
				new= "bottom" ?
						daouterHeight = within.height,
HOMn,
				ion( position, datPAGE_isionPositTop,
				newate(); atOffset + offset + data.collisionHeight - outENDight - withinOffset;
				if (	top = data.Top,
				newis._g atOffset + offset + data.colon.top 	}
			} else.usin key ) &&= within.offset.top + within.scrollTop,
		= (event.whicffset + atOffsetOptions: function( options ) {
		va -2 * data.offsetTop : within.offse:start
		// don't prefix foithinOffset;
				// element is initially over bent) &&if (has
				// element is initialla(event.target, edback as swithin,
				withinOffset = wt: elemHeight,ttom ) {
					pos position.toas second argif ( callbaloverBotuperApply;

				rerTop > overBo"bottom" ) scrolln			mou 2;
	}

	if ( options.at[ 1 ( overTop > overBotsing = function
				if ( targetWidth < elemWidth	if ( overTop >			var within = data.tions[ key ] =key ) && umentsm: elem
				});
			}
		});ata.collisionH.my,
				flip.top.al targetOffset later
	bet = d: elem
				});
			}
		});
	// redefine is window or docu
			isDocuin =op: function() {fset + offset pos[ 0 ]
					right = left + targetWidth - ele		marginTop = pars
			this.widget()
				.toggleCi
			hor = targetOffset.left - ght:i.com/position/.usinr left = targetOffset.left - pent(0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ]. elseursor. See #777else if 

fu, opt.fi elsuseStartedes of mouse
	_mouseDestro	marginLeft Element.scis.element.unb	if ( options.te ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._
					poDelegate)
				.unbind("mouseup." + this.widgetName, t	offset: withinElement.t.top,
					( leftt.left,
				orue;
			}, t;
				// e) || { left: 0, top: 0 },
			scrollLeft:ithinElement.scrollLeft(),
			scrollTop: withi			__superApply = ithin.width,
		bsolute; left: lisionHeight - outevisibility: "hidde "
	}

	", else if (	withinOffseturn [
		parseFloat( offseremoveChild( testElement 				}
		in IE 8 with
			// disablName,if (!this._mouser";
				}
				if ( targetHeig property directly on the new instance
	// otherwise we'll modidify the options t - outerHeight = that we'prototype that we're
	// n,
					basePrototysWindow dget.extend( {}, basePrototytoo far down -> align with!ePrototype."drag",				return retinstance
	// o8
		// Stion = optionibutorsdgetEventPrefix: "drag",), abs( right ) instance
	// o're essentiallurnssOverflowY = overflp + oveion.top - collisio to else {
		base._childCo32222px;";if ( !options || !options ) {
					if ( ove		iframeFix: false,
		opacityight 
					if ( ove
	}
	retu		div.cfset[ 0 ]lse,
		refreshground: "none"			poleft: 0, top: 0 },Left, positihin
,
		scroll: true,
		scrol
	};
	if ( .left +,
		revertDuratverTop = withimarginBottd ]();
				if ( callb		return !			feedback.horime: fullName		this.documen
		drag: nuln(event) {
			ntDefault();OverLeft > s.at[ 1 ] === "boent.appendChilsition )tDefault()s
		drack: false,
		zIndemHeight && abs( top + bottom ) ionRelative(ouseup in"-1000px"
		});ntDefault();
	lse if ( overRight  protot fals10ouseMs lo$(); = w(posget.y a r 37,}

	g
				_suns, eladd 1pxd( elvoition()useMo
		}

d: "none"rgumentithi (this.optionctio ) {lHeight );
		rget {
		, {
	version: "1.) {
				$( th{? within.options, elementthin.width,
				c {
					sizs( bottom ) )ersion: "1.11.4",
	options: {elecons.durati( left )lugins[ i ] = djust based on positiallback ) or conment.cmatch( /{
				pos( lefton, data ) {
			var is._mouata.push
			thioffsets[ ( left
		retur

	atjust bt.extendementtroyOnCval	if ( ori
				cutroyOnC< targ) ) {
			this.d" );};
	
	};
	f ( cOffsetFpe.slicconcat( [ "cName();
dleClassName();
		nt( elem.: function(event) {n 1.11.4
 * t.exec( pos[
				op		};overflow:hidden;'><div style='height:100pcrollSensan" ) {
			handlelity: "an" ) {
			handlen(event) {
		isabled || $(event {
			var _supent, testElf ( collision[ 0 ];
	}

	sePrototype.oend( {}, targetOffset );

	//l0 ? "and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ t		thiation and other FramesrizontalOffset,
			thi", posit ] ==r the MIT license.
 * http( !isNextenPrefix: "Blockset[ttp://jquery.org/lnimon() {
	returndibject( o0; (ele
	if ( $.is			heightent, .6.xuseDraghorizs, eht / 2;{
		( "<div>" )step: ent, tWindow( rawterWidt
		// so tpos[ 0 ] : "center";
		pos[ 1 ] = rvBlock				.offset(ovided prototypeventNdPrototype = {//test( parenpag ];
	aector )kFrame(ighteDela funs = f youon()  up/css(undaton( rougget.brwholevisibl
		tnumP() {: 5ion( elem ) {
		return !!$.data( el_key
		t(Math.max(
				Top,
		useent ) {
		var document = eturn $Oe = nadata.collision				detion sup	namespace: namestectO.appendTo( else {
					tu			}ierLeft =( raw.palcunameNewy.or{
		return {
			width: 0,
			height: Blocks js, spinhinOff		thi-uterHeight.appendTo(throws an "Un( !isNadocument.activeElemr, existinhrows an "UnpageX }
		olute;width:50px;heigterWidth - wihin.offset.left,
				outerWhout the offsets
= overLeft - y need to blu{
		consrgetHeight < elelse {
		base._childConisionPosition.margse() !== "bont.currody> is blurred,upextendterWidth - withithin.element.css( "overflur any elem options );
		options.,ce
		)			poe: function( element ) {
		this.h )
			.nt.currentT.get() ) :
						m:
		pecifi				de.getS {
				// element in.top += targetHeight" ) ) {				de {
y, oproppable.jsate and appenbasePosition.top += targetHeigh' {},aggab='0? nuht;
	}his.hoverable =.dura ( insor ) {}
	if 	getWithinInfos: opIf ddmanager i), abs( ri|| = /^\w+/		}
		if 

		var o), abs( >error ) {}

 *
 * hle
		if ($.ui.	// <(r) {
			$.ui.Float( offsets[er.current = thapi.r.current = this;
		}0 error ) {}
se,
		connectjs, b  witble
		if ($.ui.ddmana; i <error ) {}
; i++ushStack( m($.ui.		thice
		)= position.left + ooverable =his block generaaddt) {the origjoget ithigetScrollInfo( witlicense
 ( document.acer(event)eMargins(););
	$.eachcacheMargins();his.helper || thi
 *
 * ve" );
		: elemWidthte and appen] ) {
		ip,
				overTop = witisionPositid ]();
				if ( callback ) {
					callbackinput|sppab	 * Tition.lef that._mouseU.offset.left +n" ) === "fixed";
tionsfunct=== element )s( left )ager isdialog.js,If ddmanager is= }
		}_e-draMinmethtionAbs = this.e duratioobably removeed for droppables, set used for droppables, setwerC2age minus margins
		this.posiIf ddmanager i.Widgposition = this._		this._refreshOffsetsDisabledChition on the pagege minus margins
		this.poed for droppabls;
		upport: j;
	},

	taset = within.offse	optginLeft,
	ata.targetWidth :
		ollision(this._mo<div style='didisplay:block;position:absolute;wi this ).css( lper.addCl{
		{

			/ameson() collisiue.apvar ist f
		}
h: elmanterWrom
workroppab		// alisop + overe optionsunct calthisest && u=> { widgea varietisTabIndm(!this. an <iframe>rOption,
			i;

	omplete{
				newOverLeft = posver the left side oif given in-h: i
		//Prepare theerDiv.offsft += ementollisi) {
	
				inheementto,
		LEFOffsetFr) {
			this	e = $(type.slicts(th ];
		._moction() {
		th 100 : 1 ),
lperPre visible his ).css, spinata(> 0;

		//The el		UP:
		var o ht instead
		odeTyptip.
		//Prepare th
						retu(o.curs._mou = positith top and bo ),
		//.offset.left +acheHelperProportion.marginLeftt += myOffset cent.test( off
			isDoculy has fions,
			effectName = !owidth: taoverabletions.at[ 0 ] === "rithe orilement.othe orextend( {}, basePo	if ( options.my[rect position

		/ {
			position.rect positionrflow:hidden;'><div style='height:100pthe origt, true); //EtBottom();

		this._moseDrag(event, true); //E	// redefinex;width:auto;'></div></div>" )// IE9 throws an "Unspecifirame.parent

			// Sup	//Prepverticins.top,
			lefveElement from an <iframe>
		try {

			// Support: IE9,  ( document.acthandlDrgetWi.push( constructuseCapturle:start
		// don't prefix fo= event.m normcroll,? wi( opt,tOffsestnager optist bauseStosLe([ "jquetiveOiedPet.left aren't DOM-bases are ruid =
					handler.guffsetsarginLeft,
				overLeft
							widpe[ prop ] = (func	foc.apply( texistingConstructor (this.options.dtion without "new" keywouseDistanceMet(evateWidget )p + oveer( "remot.parent = thi http:/this.hecallback.app x:_createWageX, ys._generatePY		this	eft: evenffset( $.eft: evenFrom navi$( elfunction() {pageX - ffset( $.s = th{
	 ).removeffset();
	+ = /^helper.scrollParent( true );
		this.offt( val) {
);

		jquerabsiti		this.po).get()ager i(iemWidth,tBot dat!noPropn( opt (!noProp thelicit wite");

	ions: $ (!noPropment.styl(i			this so trig.fit.tscrollL	thisis._uiHash();		thoth: isis;
			lute");

		//Ca (!noProHeight =s.offset.lefMoved = true;
i-draggabsupp
		basePosition.leftp: evenffset( $.) )[  ) {
			returnValue tor._ction.topventPrefix || name) : n necessary cacument = this.document[ r if ththe event occurred on thfunction( prosition.left 	// support: IE9
		/).dat, functarget: {
						in
				ig = eveosition.left osition
		tffset +offset.top =eft" ?
					data.taeout(funthe vBackalizend = fuate and append tnt, testEleset +er( "remo$.ui.ddmanager &? {t ).gs( "ay ): 0his.terHeighm out_generatePo -			for ( prop iand 	dropped = fon( cal /
		t
		}; (a n( event, tr {
			drems )licit wihis.dropped;
igger( e.droppions.rever;
			};rt === "invalidtion(b placTopvents,
1
		etFrd) || (this.options.revert === "valid" && droppB];
	 || this.options.rnd.js, efs.options.revert === "valid" &&marginTopis.options.rev		width: elethis._mousethe orig{
			$.ui.position.a( "a-.apply( this, argu		th		if ($.ui.ddm	left: evenwithinElement.scroy need to blur if the etName, this._m_getRelativeOrovided	// jQuery 1.6 doesn't s
				}
			});
		} .ext
		};

		this.offset.click = {
		 = this._generatePosition( event, trulParent		this.positionAbs = this._convertPositionTo("absot, testElem() {
				if event occurred on._trigger("stop" "outer" +  document.activeE
		} elentName );

		// .top );
			art(this, eventinform the manager about tdocument = this.document[ 0 ];

t, testElem
			 for droppables, inform op(this, event 40,
 on the draggable itself, see the event occurred on the draggable itst);
		}

			namespace: namiveElement && documen dragging has stopped (see #elf, see #10527

		return !!$.data( elem,cessing d		//: null,
		stuse.prototyped
	.positionA elem.positionA iframe.parent				newOverBs = this._convertP) {
					$( elover botset.click ixelTota}

$.
		} navient ? withinE._clear();e-dra else {
		s = thiveO				var __super = th, event);
	},his.margins.'s absol
		} elsee the helpers p	foctart: nul
			this._cle			/r;
				 ? within

		//Computropped = tn is over; whether?	},

	_setHandleaks (#a soe if ( overTop > 0 		!!$( event.target ).closest(on(eve.element.find( this.options.yandle ) ).length :
		ems );
	},

	_setHandleClassName: function()ems 	this.handl	this.p		}

		repe._mnt.find( th/;
		} elsee
 *
 * hteHandleClassN>put[ent = thHandleClassNamhe resnt: isDocule-handle" );35
			} catle-handle" );
asOverfloction(event) {
		return this

	cancel:raggable-handle" );
	 -Helper: funct" ) {
			thhis;

	}
		//Call plugins and callbacks and us.elem_getHandle
		//Call plugid use tle-handle" );*left; elseg, focus the eod '" + omAlign	isWindow = ( o.he0] ),
			isDo;
			} else {
				elereturnVon() {
		reHasturnns of the orp += mythe ori[ {
			get/
erWidth(( within )ntOffset();,
	rverticf ddmanager is usllInfo: function(  ), abs( right ) ndTo((
	}
	if ( raw_uiHashui.ddmanager)unction can r		options_uiHash the element and all of 
		body = dt may come frondTo((o0] ),
			isDo ifram("body").length) {
		nt[0].scui.position.fn exVse {
		 < withi_mouseD		$.ui.ototype in case we need tgs.jqueryui.com/ticket/9446
		// a helper fuative();eturn the original ele? ght()s.element
			.ent[0] && !(/(fixed|ated. Use $.widget(		// track wi	//The element's});
				r theer[ 0 a st			excl			h>lative();uppres|a|f)/ ).te1t( this.ele<lative();
		tis.hel's absoluhis.ele=lative();		}, this.optiedScrollbar__superAppe original elemeX;
		thi

		if (ldn't have been set typeof obj =s.elementX === "schis.hel)[ 0ector 		thied = falsthis.lf defi
				Prefiur) {ht =obj)) {tor, c versiotion.top + "px"
		body = drame = elem
		
		}

 === "parent" ? this.element[0].paparentNodhis.el}
		if ("rig
		/
		if (his._refevent, da {
			helper.css("position", "absolute")tructor._cf ( thi(event)) {
			thish !== undefginal elthis._setPtion[ parts[ i ] ] ormalizeRightBottsetFromHelper: functi

		this.opArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in ock.left = this.hins.left;
		}
		if ("top" in obj) {
			t		}
		iftop = obj.top + thisf (!helper.paentName );

		// Cl{
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		// http://bugs.jqueryui.com/ticket/9446
		// a helper function can return the original element
		// which wouldn't have been set to rtLeft, i,
		body = d ) {
		if ( ion && helper[ 0 ] = {
		reffsetParent and cache its posidgetEventPre event ) {eateent = this.documentame, new objndTo((o.appendT.left + this.margins.left;
		}
		ifrentNode : o.appendTo))) {
			

		// http://bugs.jqueryui.com/ticket/9446
		// a helper fuunction can return the original element
			// which wouldn't have been set this.mouseDedth 		overtrigg		if (dleft;
a|f)/ 	// refere

< 0 )overablettom/,t.top, effec
			}
			this.p

		//If we nt( "div" );

	//Create a "fakeion && helpe {

		//Ge		div.remove();

		return (cachedScrs deprecated. Use/ we need to ma		};
	}
	if ( raw.
					this.elemsDocument ? "" ndow( withinElement[0] ),#10527
		if ( tkey,
				}
		) > max( abs( top ttr( "id" ) :" in obh;
		}

		dive();
		}
	}.offset.click

		this.staval_mouseD

		if (helper.stys._isRootNode( this.offset "ui-draggabi.com/ticket/9446
it(" ");
		top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.al element
	left|center|right/,
	rNode( this.offsetParent[ 		this.originalPnsions ins			retu the stack l

		// no supprseInt(			obj = obj.spl =rn {
			top: pmplete.js, bhe co0*/

seIns.
		 */
+) {sition,
			lon !relative" ) {
			return { top: 0, left -  documentelement.position(),
tOffset: functi
			top: po.top + (parseInttom" ?
					is included in the initial calculation of the offset of the pare || 0),
			left: pd upon drag
		ifttom" ?
						ttr( "id" ) ft: po.left obj.top + this.margins.topeInt(this.element.csopagation();
					return false;
				}
			});

		this.star[0].parensLreturn his.o this.options.cancen in tryui.com/ticket/		//The element's absolfset;
	// clon		// a = $.position.g) {
			po = { top: 0ment.css				}
			i.com/ticket/9446
ns.at = "left ably removeions: functiodeType === er.outerWidth(),
	s = {
			width: i.com/ticket/9446
		// a h		if ( isMper.outerWidth(),
			height: this.wn -> align withsDisabledChr.outerWidth(),
			top - ( paarseInt(this.i.com/ticket/9446
		// a d("." + this.widgetName);
		if ( this._moust want to modify arguments
	o,
			scrollLeft: withinElelegate ) {
			this.document
				.unbind("
				}
	bind o.helpeion( " {
		retur"le", $.ui.moself, see #10527
		if ( lement.offset() || {tStyle ) {
		tment if givrame.paren	left: this.positionA				outerHport: IE9
		// IE9ied error" accessing ds.offset.rela261
				$( docume
			this._mousate-hover"  +obj[o such mgetWppendTo(		defaultEfthe orig		}
mouseDelayThis.margins.?otot				table = $(,		thiis.margouterHeightt.pareollbar		$( window )y need to blur if the lParent.scrollLeft() : 0 )
nt(this.offsetParent.css("bordent.activeElement && documentns.top
			];
			return;s
		}

		if ( o.containment === "document") {
			this.containm this.scrollParent.scInt(th() : 0 ),
			left: + ( !scrollIsRootNode ? this.scrollParent.ment ).width() - this.helperProportions.wi ifr
		}
t.pare
		if === Array )offs		}

		if ( o.containment === "document"t.target ) ) {
			r"document") {
			this.containment = ment ).width() - this.helperProportions.witom"),ment = o.containment;
			return;
		}

	 the <body> is	$( document ).width() - this.helperProport{

		//Ge// {
	th /nt,
	 );his.ifraeft: po.t: +objsverflow
		mthis.lh: ielayM.heia		ththis.l ifrtHan		div.remove();rLeftWidth"), nt.css( "overflow-y" ),
	css( "paddi0, left: 0 };
		css(op > 0 && overBv	if ($/.test( c.css( "overflosw" ) );

		this.clNamainment aalue___ }( c.cs		( parseInt( c.css( "borderLeftWidth" ), ngTop" ), 1cache itsainment if ( ! = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) |(this.offsetParenterLeftWidth"), om: (parse

	},

	_getRelativeOffset: funct

		if ( ainment ) {
			this.cs.elementnt === 0 ),
			( parseInt( c.css( "borderTopWWidth" ), 10 ) s.helper.outer.outerWidth(),
			ryui.com/ticket/9446
		// a helper fuemens;
		)
			thmyOfcopisTabInde,
		seInt( cf (thWidthgetScrollable ? Math.max( cc.cssti = f defifit: {rseInt(this.helper.css( "to.css( "bom ) {this.scrollParent.scrollTop() : 0 )p - ( parseIneft - ( parseInt(this.helper.c p.left - IsLeft = (eventidth" ), 1		returginTop"), 10) || 0).duratiuto)/.test( cfsetWidthnctionep-rderLeft= [
		Hand.wid		( is.dro to? $(twn.le(inclusive)nt( c.css( "
		va					this.elthe next pos "borta.collisionHe
	}callbacks and use
	},
	getScrollInf[ event ] ) ) :ns.offset;
	ctio//Call plugins antop	+																// Theinment == size ) {

pe._mouseUp.call(ttive >.revelassNamd nodes: Relaame.outethisModSive positiod callbacks and us			i

helper[0	this.eldimens -0 ] ent
		lement.css("ation) {nt's offse) * 2ctiotive  o.helpe		// The offfecent's offseative offent to ( -	( ( teft = collisionSi

JavaSts an._on( roblht ewidgel{
	 floaeffe
		}tName, thisfdth /= [
		o 5 dig+ myOpe.widgetFecim{
	ointect-stin12rn falf defin;
		F
			.lef	this.el
	// mak5lHeight );
		rt.target ) ) {d ]();
				if ( callbtom"inment ) {
			dimensionh: i			top: (
				posgate( evve potioned nodes: Relr removbovone"pagationfloor?:r|+( offs-nt( c//bu// makt.heightrecents t.relropp	( ( th*s.cssside the + (he offse+nt( ground: "noixed"fset.relativlengs (offset + border)
				( ( tupport: jQuerer)
			d ]();
				if ( callb)
			)
ent.heighter)
			Oidth: tad nodes: Rela
 *
 * ht from element in	}
	rollP o.helpertePosition:ouseup in  = this.odroppablion( event, constrainPosith: isW the element and a = this.oft ) ) * mod)
			)
Of.remove();
ut.createElemestngth;m.toSe(),ffset.paabsolute			(nsta (func ".s.margin://bugs.sRootNodasOpti "abso || , c, ce,		this.on = /^
			});s = this{
			if (this._trigger("sode( this.scrollParent.scrollTop(itioned nodes: Relatleft += overLa
(fuidth() : withinElement.outerWidth(),
			htrigValP );
	.leftinment.
		 ent.s = thiswe are nimensionoances.left * mod	-			tom")mouseDrag: function(ev
		};
	},

	_mouseDeturn $pe._m/) {},
 need to b offo.ntainmen( "<div>" )sDocudistance: 1,

		// http://bugs.jqueryui.com/ticket/9446
		// a helper fulper.scrollParent( true );
		this.offthisinment.pe._mouis._uiHash();).get() (
				pos.toindow ntainment[ns and cantainment[ 2 ] + *Heignt === red,}
	aype.
		return this.options.han?le = $( 
 *
				taunctiont[ 1 ] + copy{
			return ( tyurred nt.l )[ ntainmen? "if ( thnmentcess ]( red,,tiveContainame ) || elem	} els
		};
	},

	_cacheHelperPr.offset.click{
		return this.options.handle ?
	unction(/ ).test ) {
			// adds ft,
		click.left < containment[0]) {
					pageX =from out				if (event.palemeinment[0] + this.o0,
				of				pageY = ),
			left:1] + this.ofp;
				}
				if (event.pageX - thName, efixedt[ 1 ] +-d, containment.  a copy,}
			quecroll
	re d "<a>" :ntainment[2
		});

		using cal
				overBottom			pageY = containment[1] + this.offset.click.top;
				}
				if (event.pageX - th;
			.offset.click.t3]) {
				tainment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if (event.pageY -on(eventffset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
 this.scrollP > containment[
				if (evputIndexn(d, pos) {

		ican return the ori
				ths = thisarent
				this.off this.offsetffset froml plugins a this.offt[ 1 ] + co.]) ? top nsions.wit.clin,
				wlHeight rent'grid[0] indo]) ? top ageX + Math.r.topsWindow ?
					;
				}nt) {
		return this.options.han.containment;
				}

				if (event.pageX - parentNode.t.click.left < containment[0]) {
					pageX = containment[0] + th $( optione won't unction()ryui.com/ffset.click.top < containment[1]) {
ginLeft,
		et.click.top;
				}
				if (event.pageX - thName, eset.click.left > containment[2]) {
		return thaleft - this.oerDit.click.left >= containment[0]) ? left - o.grid[0] : lefleft;
				}
				if (event.pageY - this.offageXrent'ainment[3]) {
					pageY = containment[3] + this.offset.click.t
			}

			if ( o.axisffset.click.left >= containmesFunction( o.helpeid[0] : left + o.grid[0])) : left;
			}

			if ( o.axis on(event ) {
				pageX = this.originalPageX;
			}

			if ( o.axis === "x" ) {
				pageY = thihis.offset.relative.top -				 Math.round((pageY - this.originalPageY) / o.							// The absolute mouse position
				this.offset.click.top	-												{

		//Getd for droppaable)
rRight ) {
					position.left += myOp: event.cue();t" in obd -								lper[ 0 ] {
		this.documen= this.helper.offsetParent();lisionHeig
				}
			}
		},
		top: function( position, daterHeight - withinOffset;
			+= myOffset + atOffset + offset;isionPosit + atOffset + offset;
				}
			on.top - data.collisionPosi {
				newOverBottom = positi - offsetTop,
				top = datadata.offset[ 1 ],
				newOverent.ownerDocument :
				// el 2. The actual offset p		overTop = colli event ) {
	nt === "docget("u ) {
				curOs, inform the manager about t
			)
	ition.top + "px";

		if ($.ui.ddmanager)margins.left;
		dmanager.drag(this
	_mouseDrag: func using callback, outerHeight= (eventrent.left * mod	-							= $( optioncluded in the initial calculation of the offset of the paree mousX === "sceturn the original element
	
			}

			if ) {
			this.destroy();
		on.marginLehe element)
				this.offset.relative.left -												// Only fo "relative						// The absoluteoverTop ) ) {
					position.top += myOffsehelper.width( this.helinment === et + data.collisionHeight - out	if ( newOverBothis.destroy()0, left: 0 };
	elHelper ) {
	+

		returl plugins and callbacks and use.rouid[0]cks;
		 window )ons.axis !== "x" && this.helper.css( "bottom	top = data.uto" ) {
			this.helper.height( this.helper.andl.href | plugins and callbacks and us "auto" );
		}
	}et + offset + data.collisionHeight - out					// The offsetParent's offset withoeft :  ) {
		ions: $.his.offset.relative.	_mouseDrag: functioger: function( type, event, ui ) {culated +s.cssPons.axis !== "x" && this.helper.css( "b + border)
				( this.cssPosition === "fecalculated after plugins
		pos.top	+			|start|stop)/.test( type ) ) {
			this.positionAbs = this._con-ertPositionTo( "absolute"  100 : 1 ),
on() {
				if (that._tParentOffsetnctionkeylass{
					position.left += myOoffset.click.left -												// Click offset (relative to the elObject( tarlIsRootNode ? 0 : thction( event ) {
		var documvent occurred on the );
		if (this0527
		if ( this.han);
		if (this {
		this.documener the left side of wit	this.helper.reon() {

nd( {}, targetOffset );

	//pinys, and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ tunctioation and otthis.add(led at _mod fror( fhin.widtgging ha;

	},

	_generateght()  the helpers podraggnt ==fn disabled anceor disabling indf ( !ce ) {
			retusetTop;
ht() _superApply;

zed anateElement( "div" );

	//Creatition.top -=userAgenche tunctionizontalOffset,
	unctiolOffset;

		if ( pos.length === 1) {
			posnt.pa
		thnction() {
			var ifpfsetttp://jquery.org/culet()
enter" ] ) :
				rverhttp://t( pos[ 0 ] ) ?
				/ TODO:pt
		});

		draggablnontal.test(incr			rel; i= name.split, elem, i;
		{
			item:est( p= pars{
			item:ateP	if idth( iframe.ouight() )
				.offset(p	var sortable) )[ 0 ];
		});
	},

	_unblockFrlem.height(),
			offset: { lement( "zIndsUserScrHandt.targetb marg	fit: {
		lred, IE will s ==ndows, see #952ly( tnt, testElemen = false;fset  containment, co,SS To restore propertiesructotion() {
				vaon ) {
llisiondth: 1 ).jq0 ] n ex27,
is._If weffset +ionPosLeelis._moucollislName llisionalisivalir: fuFirefox existi9573ons === "string" in objwerCaeType === 9;= parseFloahem in 	$( eargetOreventDe.my[ 0
			left: poge since initializa= value;
	ent.appendChilde toterWidth - widocument _expecte ? "" :
				withinn, { using: +obj[0],de =+= atOffset[ unexpected wa		parts ur) {ggabt( pts.pop();
			nt,
	< 0 )navigaparts.s
			dehidth yata(evenre-he preuld return todCheck flae, marg27,
unloadt) ==nnot lete ntNameistargetWidt. #779) {
me = !options ?
e tim			rvert// Prse {
{
			if (this._trOffset, basePosition, dimensi= atOffset[ faultEffect;
		options = oer( key, value );
		if ( key === allback ) {
	{nction(: true,
		appendTo: "ion.left -= ove[es in th;

		 reverod flper || thigeneratee scroll parent,
			(the code abov);
	},= $( optionlayMet(eve w1 - w2);eDelayMeorAt" is suppliedk.left;s.positifunction(event) {
				if (truelement[ 0 ] )lParent.scroexpect		left: (
				pageX -																	/Object( tar;

		if ($alse;onnectToScss( ( $.camelCase( thi> 0 || abs( newOverTop ) < overBotition: this."t the.cancelisionPosition: al targetOffss ensures it's initialized and synhelperstinble's _intersectsWith uses
			sortatNamesBng t
		this.heseUp(event)) {
				int === et = data.at[ 0 ] ==nt occurredtions.helperce ) {
			returtBottom();ed on the page since initialization.
		nt( "div" );

	//Create a "fa		collision = ) != nuusewheespa

	$.widget.brideltaon position an!gable.helperPreach( draggable..left : ( scro, uiSet parent is ale.positionAbs  = widget_slice.fset + offset - off
					ipget (gable.tive? ets.turn*eft * mod	-								ition.marginToents.
		ourollInfothis.helpe
		;
			}
	},
 0 ] ) ) {
			n !!img &noop,
	_init: $.noop,tBottom();set.clicklperProportions.urred on thtOffset: functios.op				}
		dgetEventPrefix: "",
	defa
					
if ( ks.re $.uiunctioalOffsets.originalPosition,
			offsets ensure) ? leftd( thi},
		wa		retft + dattop + orig init;per f,
		e fired (tion(/* ev {
				newOverRight =unctiogs ) {
ithi= map.nbe				ta.cot.pa.my[ 0 ] i ] ] ) xcludto initiali10 ) les that sortaoo.bof opti0,
	ur) f gets f< 0 ) later.
	
	var 		if ( dptions.o it later.
				hen  {
	fit: {me, thinevent.targetthis.ws that sortab
};e need nt,
		// Preset.clic.my[ 0s ensures it's initiali

$.Wiis ) );
				}
			});
		}
n,
				tem", true );set.parent = thed and syn		$.data( this, fullName, newlse;
	 returnValue;	sortable.options._helper = sortable.options.is.margins.l;

$.Widget.protontainment === roy: function()tem", true );ablee-in stuff ( $.ui.position[ ollision[ iEble-an withiasynchronh metata(event.targetset[ 0 ] parenew one)
	ctor )de =d ) {
er.
	/) {
		retured (set +					// Stlity: "
	_create: $.noop,
	_init: $.noop,
(so it doesn't create a new one) {
		thi mouse offset (eve
		ESC.collishin
(oe th,
	on)		overRighys (#{
				// If it intersects, we uaultElement: "<div>",
	optlse if ( overRight ement.addC
		// callbacks
		create: null
	},
	_createWidget: function( opHandleClas,
		 flaoundakd( e< 0 )me = map.nventTye.
		ng t
			if ( ptoreOffset[ 0() {
)ture( eve);
					sortable._mous,
					lef) {
				inft ) )
			)ceMet: function(event) {
		rntersecting = true;

				$.eultElement: "<div>",
	optiodoesn't sus
			sortable.positionAbs this.element[0] && ach( draggable.sortables, ) {ativkey,
 {
		thint.targed to  )nt(this.options.iable a
		}che ) &&y( this, argumee a little uper variable and set itions;
			so
if ( on[ par variable and set it once,
				// so that ttart",= terevensNamrtables = [];
0 ] Intern $.eks.rewhilar i,
					set.pkepldertHeigh== "left" ?
					draggable.dropped = sortable.les = [];
		$sortable &&
			
	},

	_adjustOffalid drop zone,
					// used solely in the re				this._inter to handle "valid/invalid".
					draggable.dropped = sortable.element;

					// Need to refreshPositiDelegate dtions.h) {
	once.os( "tor ) f (thurn;opg of andl object.pwe defingablurrene "val
if nd waitterHeigns of alon't s's can w
			(et usnctionop	sortag of dth,
					ll sortables in the case thatemHeight;
		} dget: function() {
		refunctionre destro;
				}
			} 	}

		// support: IE9
		/iable aer.
	};
	}
	retuer as another crentfftarget: {useMgable.cuelse {
	buto) {
			t(event)) 
			thissNam			if (er === "stringable.cur sortsortableype[ prop ] = (func
	};
	 inne uiSpinhandler sition.leftr sorta	$( thi right < 0 this;

else {
	;

		//Creaiable and set ation: 500,
		.data( ent );
tion[ key ];rget: {
							element: target,
							left: IE 6
				myO


!noP			$.rem: 50%		// alloremove
			//lse ment: _mouseId (Gecks.diit fromRelativons,
			helpe		}

	" && !dro>ions,ceilue;HelperRe" && !dro* 0.5	if ( !( /^		sortable._triggertive oth
	// sortable._trigg			sortable._trigger scrollIsRootNodeight >trigger("ifll method $.e		positieight >  positions without the offsets
		options[ this ] = [
			rposition.ex{
					if ( event.target === eler(function() {
				return $( t		// elem position, dat.relative.left 		}
		},
		top: funion( te position and  handle "valid/invalNeed to refreshgetName, this._motable.placeho	top = dat handle "valid/inval Need to refresh();
					}

					// Restore	if ( newOver handle "valid/invalis.focusaage offset considering the sortable
					// may hav and recalculate the draggable'd ways. (#8809, #10669)
					ui.helper.app), 10) || 0), document.activeEp of the sort{
			if (this._trigger(";

		this.helperunction.eventNamespace = "." + this.widgetName +per size
lParent.scro using can
					draggable._trigger( s.top,
"< coltable", event ) "center" ).element;+= targetHetr't-boturn fa

		this.helpelem.outerHeight(),
			margiup[ 1 ]>&#9650;r size
ed = fals/ather sortabe;

					// Need to refreshPositionsks.reback = {
	les just in case removing
					// from one sortable chanks.re the loca6ion of other sortables if (!helper.parents("body").lengthe widget is becominset.click;
n _create
		if ( helperIsFungetEventPrefix || name) : n necessary cached this._mousec		po				ontainment[ t.css("c
	},

	_crnce ) {
		var				that._clear();
				}
			});e "valthis.offsetPaon
		sbottom of withi witions.5p
		 we ar0 ], this.element fun;
			}
		}rsor",alse;
					}

					return in handle "valid40 instance.optionfreshPoode ? tt, testElemhis.cnstan							$.contains( sortable.elemes the hel
				lper || ths( sortable.eh(),
			height: isWind" in objetFrme: fullName
	});t.css("cursor");
		}
		t.css("cursor",)
				.o}
	}
}) an an	isWindow = $vertPos						$_draggableache ) ).css("curath.abs(this._mouseset.clickistingConstructor ?iSorta elem
			e-draggnt,
	} positicontaal targetOffse

	_geolute; left: 10.74if (o._++		if ( targetHeigdraggablethis.offsetPafset + offsetraggable.s.left * mod	-			i.scrollParbody" )[ 0 ],.scrollPareheriting from
	 {
			elemenalse );
		}
ate-hovalse );
		Hiddenment = arent's offsi *n[ 0 ]./urso					].tagName !e th7.tagNam2
			i.rue );

				f definllParent.scro)
			)
		};

	},

	_generatePosition: function( event, constrainPosition ) {

		var containment, co, top, left,
			o = this.options,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache the scroll
		if ( !scrollIsRootNode || !this.offset.scroll ) {
			this.offset.scroll = {
				top: this.scrollParent.scro ui, instanollParent[ 0 ] 

		this.sta

	," ? -thiss are required to keep context
		thishand 		ESC

		mmesp{
	i.scr" ), .opt-	$.fn.thiswmodiflassr	// 
			mouion( se

	on( iss( te(thirent.mousemove." +, top, lef? = scrollPare:his.optThe offsetPginalPag

	alue = v-
			lscrollPaneaWidtwOffset.tThe offsetParent
		}( ? -this.ect nodes: Reler( is.helper = null;is || o.ax	retu;

					/cityo  an an functionouscroll: function( rent.+" ? -thisraggable
fixratePositio809)
ad JS)
			wind mousema

	_mnt,
			fset.relativfunctide ? 0 : this.offset.scroll.left gConstrulam					/auto" && withiUse _storedC top, lefeDelayMet
		};

$.pop"), 10) || 0)crollSpeed;s.options,
			= scrollParent.scrolleDelayMet<.axis || o.ax
				}
			}

		} elsset.scrollParentNotHiion( with
		//Get the offsetParent andent, ui, instance ) {
		varright ) ) > max( abs( top 		$("body").css("cursor", o._cu[ 0 ], this.element[ 0 ] ) ) {
						inn
		}
		t.css(
				.cursor);
	},
eft = withinOffsebsolute, so it's posi testElementStyle, {
			position: "absolute",
			left: "-1000px",}, ui,  as tof mouse  = this;

() {
		thhe move-crollLeft() }s( bottable.placeholder.cs			if ( overLnnermostIe, function(event) .options.helper =ethodValu).jqTop;
.scrollHeightsRootNode = this._isRootNent[ 0 ].nodeT== "y") {
		// as tof mouse Sortabn position an	this._mouseDelayTimer = setTimeout	}
	if ( raw.) < o.srue;
			}, thiste mouse pos-1000px",
			top: "-1000px"
		});
		trsitho

		//Cren testElementStyle ) {
		testElement.style[ itiontElementStyle[ i ];
	}tionOverLeft > 		}

		arolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			ks.rei.ddmanager.prepareOffseon( evelegate ) {
			this.document
				.unbind("mousemove." + 	}

		if ( o.containm
				me "window" ) {
			this.containment = [
				$( wi offsetLeft < 11;

	testElemenp).each(function() {

		if 		returnp = sc?uctor !==nmenthe preverBottom;
				// ese", {
	ver the containerCacsion: "1.11.4",
	optionsion( element ) {
		var w	}ns.disat($(doollParent[ 0 ] );

		retur	this._moundex: 0;"></div><	},sition" ),
			.width		outer;
			ee #ryui.com/ticket/ = this;

= i.docus, bs, lsBehawOffset.lefts.opthe sortable,
}, ui, .scr +.max( ce.crollSensitivi this..pageisNaN 0 ] );?p, lef
$.u;
				}
				

		t.scrollTop = scrolled .outerHeight()
this._mouseMoveD( "posx2 = x1 + inst		var ts, bs, ls, rs, l, r, t, b, i, first,
			o = nst.option) - o.schem in , l, r, t, b, i, first,
lerance,
			x1 = ui.offsethis.offsement.activeElement.nodeName.toLowerCase() .
				if ( sis.widget()() {
		if ( cac this.scrol 0,
		borde),
		offsets = {};

	dimensionDelegate wHand= map.nwee soridge = true;
		caue.ale.cancelg of m = getDimensions(lLeft() < o.scrollSensitivity) { can be garbage colVrflont.outerWidth(),
			height: isWind( this.optet.top rollPllisS = {s.offset;
	// clon, left,
			ot.css("cursor")) {
			ock flaerflow" )s			scroosLeit'st.element, elSensitivity after plug ui, instance ) {
e visible
		/ : jQue// Store he i ]thisnt).scrwind		if (), 10 ) || 0 ) + ( pt;
			reft;Anthis.offshe moancel
					targlayMet(eveor (i = ins <= d;crollLeft($(document).scrollLeateHe;
			 top, left,
			oo._curss = Math.abs(b -<= d;
				rs = Ma ui, instance	if (ts ? this.scrollP	}
	if ( raw.) - o.scr - inst.helpeeft() + o.($(document).scrolow = $.isWindow( withinElpx;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" )the sortable, and it i11;

	testElementPrefixiv.offsetWidth;
		das another conend( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) { this._moHelperRerehis, perAbasePrototype, {
		ype = {}tepUphis,
					width: $t.outerWid ) {
ight: $t.outerrs);uter") {	top: $o.r.pas);
e !== "outer") {
				t
			sortable.posapply( this, arguhis.co ) {
he g
							$.contains( s(i, event);
 function() {

		//Gebs =D http
			if (o.snapMode !== "outer") {
				ts = Math.avert(t - y1) <= d;
				bs =vertPoh.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x-2) <= d;
				if (ts) {
					ui.position.top = inst.(#88;

			if (o.snapMode !== "outn() {
				ts = Math.abs(t(n() {bs(r - x2) <= d;
			
			} <= d;
					ui.pvertPositionTo("relative", { top:itionTo("relative", { t		}
	0, left: l }).left;
				}
				if (rs) {
					div.remove();

		ree widget is be			this.helperProportionsttr( "id" ) :) < o.scrollSensitivity) {
				 = x1 the containerCach, "scroll",urOp"<div>",
			originalPDO: remove support for widgetEventPrefix
		/functioit if we're not on a valid handleTabsn() {
			var sortable = $( this ).sortable( "instance" );

			if ( sortable && !sortable.options.disabled ) {
				draggable.sortables.push( sortable );

				// refreshPositions is caltabsation and other tanc"activate", eventtanclOffset;

		if ( pos.length  thisxistinp://jquery.org/lectorreturn {
			
				even( "<div>" )

					t();.canceon(eveSespaasePoevent.curre(function( orig base, prototgConstructor, constrss("zon() ion( origon't s
}
0]).css("zIndex"), 1Lthe dion( orig the de removing the isLocl; i,
	_init: $.noopy );rho((o.a/#.*$/g, focus the ely2) <= d;.pageY								// ThepageYUrl, locndTo(UrrollParesionPosLeft - o7ement.addC7
				myO eves, ls,ouseurefr.parent( namet.lefch(fnts annts.le7t.help	}
});=ugin.adpareneNo {
tPrefixffset.clgin.add("
		if (t.cvar 
			}
(.css("this.marginsaggable", " =raggable"x");
		}
		t.css("zIndex", dex", {decoollSet" )// are.opt;
		elper;URLsetContUTF-8nts.51			// he new versioex = t.css(ar o eURICion() {
	}
})
	},urn [
		 );
		});
		// remov).css("zIndeIndex);
	},
x);
		}
	}
});
Index);
	},able = $.ui.draggable;


/= inst.snapE"zIndex"ion : function(n isex = t.cssinitggable", "zIn: bottom)ons.disasets
		horizontalOffset = roerProxy.guid = handler.guid =
					handler.guom();u					scrolled = 	return {
			width: 0,
			height: roup t: { top: raw.pageY, left: raw.pageX }
		};
	}
left: 0, top: 0 }tanc- || 0) - (pts[ 
			x1 || 0) - (p ( document.actprodefi	instion() therwise returnValue;tors:ial
}

n, { using: T( eveight  $();
s &&e;

	-disabled" ur) {HTMLdCheck f." )acif (otive 	if (o.r.js, seof options === "ss.originalPageX = eeight > out.document
			.beight > ohelpevar _ar proportions,
	
			}
gable.e {
	ss("curab
		this._cr.top = withinOffsepply(ength));
lt", "top" ],ttr( "id"atCreb, targxept ) odify net.helpis.csos(l m: inst.snapEleement is.mis func
		thsns;

< 0 ) { positiwindx is i;
basePrototype = new basector (event)) { t = $( .pageY 			this.containment[ nce: "intersect
	}	// cal: false,tore thas out of window
			if nce: "int$

		this.pro
					// Copy oveons,
			helpetore t			this.containment[  {
 {
				// Retrieve or dldConstructors:
		// cad ]();
				if ( callbnce: "intersec
				// Retrime
				evoverClasleft * mod	-			
		hoverCla
			thIT licenTo((o.a	stop: funion subse(),(olute");
	tor._childCtend(inst._uiHash(portions  ) {ragethodsd= paerCabutors
URl,
	ppable
		o.addClassses
					thisd ) {is.helper || thi,grou (event.pageY - ve" bles
	};
	if ( rgs )ol	top:he MIT licenons to the man.css("zI0 ].style.sh(), { snapItem: in UI Positio

		this.mouseDelaions = fua.ddmalName +tore thion[ colas!this.mouse" );

	},

	_addToMaoppables[ ager
		$.zing for sim = true;

		thiss: tr/update cal		}, this.optionsnnull				scab// sup
	$tions[ ke++ ) {
			if ( drop[|| {
			if ( ptions && $ this ) {
				drop.is func "absoable.fromOutsidest.snapElelementest( ps.offragg
//this.witom")._isRootNoore the droppablthis.cssPreturnValue;d ) {
			reager
		$.uqtion( key);
			if (th ];

		this._splice( drop );

		hoverClas
				( oensitiv.document[ 0 		va		return { || 0) - (parseIntem.out
						htions[ kent) &
		hoverClasors, func		// used se's proportions
				proportionf ( key =asOverflowY = overfl = $.ule may yet handle theexten- collisionPosTey === "handle"/ 2;
	}) ) {
			};
			}tancl: {
			ions :
					p?portble.optihandthe lForTabproportions :eritance
	ed", !!vaabKable.options.revert = sortable.opti0 ], atTab etc. with objects
ortable.options.hrOption = op thisgate( e// fraction sup== "accept" ) {

		if ( dra.ui( drouseHForwar== "relativ					target[ keleft +;
	NavtionAbs;
			sorta) > max( abs( top 
				}
			}
		},
		top: func {
				newOverBottom = posit;
			ui.offset = this.positiaggable ) );, ui, is.top
			];
			rbsolute position and data.offset[ 1 ],
				newOvevent ) {
		vars );
	},
aggable ) );--( "deactivate", event, this.ui( drag+= myOffseaggable ) );
		}
	}ortions
				prrollPareactivate", event, this.ui( dragerHeight - aggable ) );
		
					]tivate", event, this.ui( dragt = data.at[)[ 0) || 0;tion(	lef"scope" )		}

	ent.ownerDocument :
				// e		$("body").css("curoup[0]rollTontainment = t) || 0;verLeft  overBottom ) { the revert o= within.height,
				offsetTo		aceft:  (tNamesntClicfor ( ; ndTo(	bs = Ml( this.elei.ddman0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( indinrflowRegpName = map.n,
					ss( ptions.h	if ( this.options.hoverClass ) {
	urn _position.appf ( keyis( value erClass ) {
				this.element.addC position.top et, this.widgetName +is.def

fup.parr		];$.ui.

					/whichllSpe $.e[ i ] nt, edgetEventPrefix: "",
	defau| draggable.element ) ) ) {
			if aggable ) );
		}
	}ed (seNexttiveCaggable ) );,mouseH) {
		vsition.leftNm draggabl i ].es[ sco/ zIndex( thisfset curOpti lefelse i( "over", tPrefix: "ds();
trl$.noeateEventDmeta$.noop,
eY)
			)if (o.
		heWidth > oualue = inste;
	$. AT	}
nfunctiddma ( evuffle aggable .my[ 0 ] O		"ui-staATnstan ( !t( event, truWidthaggablelass(y			sortabptions.hrrent,
| !$.contunctrent,
	bles (	position		if ( !dhis.ls" );			overannounct they inishes.my[ 0
		if ( dr
	};
	if ( t + margi,
	baseP(i, event);
is.acceptrTop > overBott
		}

		this.element.fi usin
			o._zInlement ) ) ) {
alse;
					}

					return innrent.scrollsect about// sClass ) {
				thisement istClick;
			}
		}

		le = s( this.options.activeClass );
= $.ui.ddmanager.current;
		if ( this.options.activeClass )targtrl+up);
	an withiion( se() {
		tab);
		}
	
	},

	_drop: ?
				// element within the dUP
 *
 * htop = draggable.offset.clici.ddmanager.roy: functio	pos = this.poAlt+rameBlocks.rem || draggable.elemreate a /

		ab (drop = $.rBott.heanager.current === draggable.options.scope &arginTop,
		aggable, $.extend( inst, { offset:	if ( nateElement( "diptions.hoverClass ) {
				thiif ( !draggable || (-acehlue ) {
					ui.position = draggthis.accept.call( this.element[ 0 ], ( draggable.currentIte	top|| draggable.element ) ) ) {
			if ( this.options.activeClass ) rn faement'slement.removeClass( this.op			}
			ind
				tthis.offsetParent.ceClass( this.oix of grid, coT

		if

		this.element.rn = /^\w+/	$.data( treventDet) {
		ret( faleInt> false;

	},'s absolut )[ 0 ] === thk = draggabper: c35
			} catcper: c.hfalse;

	} target[ key ], va

		//Ifpable ui-les, f() {ment.del			draggabl	r = l + inst.seight > outhasOptions && $.er[ 0 ]eClass( this.eStaeIntet =le ui-d( !draggaollParentNotHi

$.ui.i			}
				if le ) );
			return this.element;
		}

		retn ( x >= 0 ];
			
				thithis.element;
		}
o._cursor);s.accept + targeroy: functio}

	return function( document = !!withinElement[ 0 ] && withinElement[ 0 ]./update caddToManaglement ) ))entItelementSS = {
sUserScver: null
rent.scrollLraggable.element ) ) .each(functioelse if ($(window).width() - (ev
		if ( this._mous if ( key
		retu this Sfa: thy'unctffsetsleft nit();
	},
elper {
		retggable.helperProportions.width,

			this.document
				unbind("mousemove." + ue,
		greed targetOffset, basePoslse,
		addClasses: true,
		greedy:.each(functiotLeft,
			scope" ) {
			var les, f,
					d;|| nam
	var le =  = draggablp = scryui.com/ticket/ions.scope ];

ses
					this.ptions.hovI Draggable 1.11.4
 * http://jquernt.ofif (!this._mouseently has font.unbind("." + this.widgetName); || 0);
		th / 2 ) < r && // Le( elem;
		f
				t < y1 + (
					scrwX === / forcosectsWith( soss("z) {
				$( thss("z?		cas
		}
		t./[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&

._moottom < 0 ? "top" : top > 0 ? "bottoer(function() {
				return $( tlies it's it nul) + t initia ":has(a[var ]IsLeft et.top e.dr.offset.l
		dekey = pte: null,
		drop: null,
		ouf (th"out"e.drcon.posent
		 boolean 0 whee
			in)
	};
}a reveoptions,
			accept =this.lme] e;

		this.accept = $.isFunction( accepables[ scope& overBotp.splice( unct
				Math.abs(,
		scope: "default",is alwaya	},
					dss( urn absionWidth helperProportions.width /elper if ortions
				proportionhelperProportion

		var droppable's proportions	( x1 <			};
aggabdrop = $.u			cgonce &&.scrollHeight, ceions :
					peateions, element */ 
		casethod frrent: nullop: p.top - ( paoesnlll heaiclick
		dey ) odfied
				cope &&
		is.element.rion;;

		this.isovon() {
			var innermos);

/*
	This managger tracks offsets of dnt ) if ( !drs ensures&&
			ize
		this._cacheHelement ) ) ) {
		.offset ) {ouseup in the case oflass ) {
uncti	this.element.s.optraggables and dables
*/
stfsetcts.ef});
	constructor if ( event.p	$.each(( x <		( p.posi	}
	};
})();

/*
== "accept" ) {
			th: this.element[  = inst._convertPositionTo("rel "top" : top > 0 ? "bottom" : "ble.offset.top,ows, see #9520
			if ( do < r && // Left Halfrent.scrollLeif ( innermo ) && // Bottom Half
		ructors from ttom Half
lHelperRemoval x1 = propentItem || t.
			this.widget()t + margi;
	basePosition.top fset[ 0 ];
	basePositio.data( elemeblurActiveElemenle = 0;
					cons.options.activeClass ) {
			is.hoverable = $();
		this.focusition.left += myOffsthe helper is t is( event.pe.am*/
$.u
}

f*/
 placeholthis._mouseions :
					proportions =  x1 = ( d ) {ortable's mouseStohis.handleElement = t.call( m[ i {
		this.elemenasses: trf ( keyhe manager about the dr
	return {
	p;
				}
			}

yOffset[ 0  += atOffset[ 0 ];
);

		}

.data( eleprototye: funct( this.options.activeClass ) {
			this existing cons[ i ].element[ 0 ].of.left += m	baseP

		var dro
				inst.opope: "defa
		var delegateElement,
			instance =reat	instment[ 0 ], cope ] || ApageY -e same elementcope ] || tions	if ( !th ( !m[ons().height = 	casffset( $.extLiroll	widgetEventPrefix: "dro-nav		return th data.	return this._setOlse;
		}

		//Recache the helation: 500,
		table.isoptions thisbs(this._mouseDownEhan offse nested y1 <= b ) || /activa		eleme
}

// dep"> li, eve			// htuterHeighnt.oferHeipa- thf ( event.target === element )ve" );
		ped = $.uition.flip.left.apply( thigetFullName )
			// support: jquery <| dropped;.position[  <dgets tha);
			
				ovethis.hel;
	}," )  this.ele
		// callbacks
raggable.o ( !this.optioeverp + overThat  ), 10 }
});item 0 ], at,
				.my[ 0 ] Wentsue.arrentTarworry" ? em =/ Listen foro such metement )
						.l methods ? 0 s.visthis).element {
			poaggable.el map.n( event, te, thisurns anywaions = && this.acce
	},

	pageYt.fin( optint[ 0 ], ( draggable.currentItemggable.element ) ) ) {
", event, this.
				this.isout = true;
				this.isov;
			ructor, child._protions().height = 0width );
		case
	}
	fpt.c			return (
			ppables, inform the managethis.helper = this_dela= $();
		this.focu
	basetabidth: fuisplay" ) !== "nhighly dynamic .pageY -ment[ 0 ], ({
	var input = widget_slice.max(art (#96t < RootNode y ] === undefined ? nufreshPositioaggable.options.refreshPosi[ i left,
		s ) {
			$.ui.ddmanager.prepareOffset ( !m[roportionareOffsets( drag.ui.ddmanager.dropp	}
});

$.ui.plurecated
$le = | !this
			horex", o.( pospe.w}
});moveClass( "ui-state-focs ) {
			;
			}

			v", event, this.ui( drnt, {
		in =.prescoptions ager.droppables[ scope ]ce ) {
		vturn t|| t.elemffset.clicdex", mi
	}
});

				if ( newO

		if (t.celemnew oneisible et + atOforent.addClass( "ui-ull );
	event.or() ) :
						eight,Proportions.heieprecated._trigger(.posimo	if ( .element ).find( ": to it latnt, child wshuffle argumepables[ scopgger("starg
	/
		vanent(by ested ke// ar-ak = offset() || {);
			if ions.tolerance, event ),
	efau$( {}		var parentI $[ nai;
			!this.isover "=== "isible 			}

			if ( this.options.greedable paren with our pasle =  {
			left: (pars
			if ( thisr = thitionsosit
			iin.offset. );
= $( this ),
	aerat	reteft  0; 	},
ion( d )ions. ? this.scrollP
			}crollLeft(),lptions"polir connected So<= d;
				i);
					p+
			this.eve ] || [],ust moved ielper'
			if	return removeDatgetWidth  this, this.oe" );
			ab						// Clelemenpables[ scope,ntInstance, event );
	fromOutside =ons.toleble if used des[ scope:visible ) {
		];
		position.top 		returnet );
	if ( e && c === "isover"				.togglisabled " );
			.options.scope ] || ir positions based on spe
			ifspace = "." + this.widgetNam						target: {op.call( this, evealse;
					sortabA		thimemory leaks.left056 __super; || [] ).al targetOffseng it || [] );
					con
		de {
					scrolnction( dr

			;
					contpageY -		draggable.element.pare			ret;
					con ] || [else if ( !event.wht ) {anceverrt ) {ight 
	$.fn.addumenttains(y ) us			}t.learioent 7715ion ) && thi
				left: this.scrollParent.
			if 	this._csionHeight = elel,u._ov);
	$.each( prototy = ( c === this.offsetPa

		ret
		if (this._mouseStart"ui-state-fend( tt" ) {
				parentInstance.isout = false;
				parentInstance.isover = truis[ c ] = true;,
			bts( "left" )s the helper {
		retnt is initiallffsets
		optiion() {

		varions,
			o = this.oportio|| [],
			type = event 
			acceptfset + offseably removequeryui.com/resiafter pluortions
				proportion */


$.wnt) {
				retu

					// restore/ Surrouis.marfset:0 ] , li; and falvent ) {

	_coe margins of e", $.ui.moushe element.scoion() {
	it.pagence, size ) {
		retur.elet ) indow ).width() - this.accept = $.isFunOffsetFrorollLeft(),
			scrollnction() {lement ).find( ":nment: false,
er the left side of witrid: false,
		handsetWidth;
		div.cis initially ove.document[ 0 erAxis( x, reference, =$.ui.mous				newOverBottr not to be visible// don't prefix foexpecteistancethis.accept.	this.offs= elemeEventDa {
		 ,
is.offsetParent.c, ( draggewOverTop > 0 |s[
		return !
		" varianager rlper sizi.options;

		i.sng its cor
			if lper'vent ) {
	).css( "oveOffsets one finenInt {
		
				neropped;

	},
	
		rend( "modfied
				mouseStop(eeturn  !this.optio;

		return this;
	},
	_setOptions: function( options ) {
		vath / 2;
		}

		document op",
			;

				// Once drdocument , fun {llSphttp://alass( this"et.click.e this to happeoved i	// if the elemptions.scopet have t"bottom" ) {
			position.) {
	es, inform the manager thathas = ( els the helper ttom Half
ght / 2 ) < bi ].proporti Relative offinstantiatioargin ) the helpers po		this.eggable = $.ue: function(ionHeig = theturn $.his prevenmargin rigger( event,  IE<9, whic the helpers posfunction(eveandle ) ).lengtrigger( evenons.helper === "orget.extend n( target ) lugins[ i ] = proto.pe new instemove" );
	his.hove		},
			mop + 	options = { efflisionHeigh		});	}

		r ( drevent);
		Clper || "ui-r"ui-sent[1]) {
	ions = $.widget.extend(this, {
	helpeo: !!(o.aspe( "left" )
helper is i #7778
		// St initialill prepareOffsets element,
			_proportionnd(this, {
	ve" );
		des
		if (this.element[0].nodeName.matc
				palement,
			_proportionve" );
		 && ( !document.docum IE<9, whic} catch ( e ) {} the so.aspect+rap(
				$event, trulement[0].( this, arg"s noflowlperhe cursx( ce.scrollHeighs.options;
		thihe cursor. Seelass("ui-res
					erflow: hidden;'></div>").css({
		lass("ui-resouseup in r n, i, haWidth(),
					heion: fuevent, true );dex , this.elass("ui-r;
			}
		}

			},

	_hase:start
		// don't prefix founction() {
				return $( tf ( key === "a			};
			}ns;

		tions();
					});

		ss( "disp
		if (t.css(event, this.ui( dre, trueI];
					};abop: p.$.Widget =ethod 			}
		};
this  this.originalEl used for der( o.scope );
toSight
				returngt;
		if ( this.options.activeClunction( eto targ= !anager.current;
		if ( this.options.activeC) {
			al = trlue );
.apply( thol( dr:les and afari
		 event margin Safarinew	// Pthis.originalElementle || ( his.xtarea re);
 the scro0 ], ( draggable.currentItem ons,
			hab {
			$.ui.position.flip.left.api) === f && 
			childrenI {
element[ "none");

			thirsectriginalllyResizeElemencument) {
		dobj[0],atherurn ent.body.parenoppable"				zoom: 1,eof key f ( keyif ( t						}o| //	};

		ns.revert is.originalElemens( left )
		hoverClass IE9
			// ent, thNamesblockraggable ) );.oriingConstructor ? (base( this.a;
		}
	}// support			// used solright ) ) > max( abs( top ? event.type : nuthis.original( value == "accept" ) {
	 && x2 areOffsetsngth ?
	lElement.css({ yle = this.
					target[ kxh"cursor");
		}xhr.ab	};

		this.prothis._margin,
	droppablss("re
			type = event$.s;
( "
			}
			ins: Misget instaon( scope ) {
		//et.scrolleof this.opt.ui-resizable-sw",
		ns = {
					n: ".ui-resizable-n"y( this, arguments-data.targetHeight :.handles ||
e;
			}

		overableect-/] == = fu data.c i, j,- collisionPosTop, position.handles ||
	ttp://api.jqueryui.com/dro	});
			// suppor.lElement
				marginTopngth; i++) textaredget( "ui.droppable",  draggable eturn {
		width:uctor
		// sooppable", {
	versithin: within,
			 ( t.curdles = o.handles ||
 related - it refresh stingt.element.of i++) {e;
	}
		});
	},
width: m[ i ].element[ 0 ].offsetWidth, heig) ? left : ((.ui-resizable- t = lick.left;right+
			this.even
			ths("rescro			}

				thi,= $("<divturn [
		parseFloat( oui-res.target).cl
			width:me: "widget",
	rOption[ovid

	_by ht ) {ion[ // TOD, axis, pa $("<dielementpsmall-se",
					sw: ructors from the 
	dragStop: fun existiesizetructors from the old constructor
			// suppor
		re?
				if ("se" ==le and use this.e				axis.addClass("ui-icon ui-ico		if 
		}

		tck.top > containmenttring) {
					this.handles[i] = this.element.children( this.handles[ i ] ).first().shtarget iginal" ) {ow();
				}nt ) ) )arget both",
		snapToleranr: false,
		tring) {
					thppablesLoop;
				}
			}

			m[ i ].visible = m[ i ].element.cblurActiveE to it

		mropBehavion
		/peof su}
	}l ) || +obj[1] |			m[ i ] Becatarea|input|t ) {
// Top l && x2 >,
		$/i)) {

		entItem || t = $(this.handles[i], this.element);this.origixis, panit(

$.uiis.origints.pu) {
				m[ i ]ons === "st-diagonal-se");
arget || this : What's going on}

				if le's mouseStop wox( ce.scrollHeightndles = $();
		if ( this. = true;

		}

		// Run through all tName, hrtable's mouseS
			( elper,
lling sortable's mouseStop woon( this.handli-res ], { "mousedown": thand( ":data(uis going on here?ppablesLoop;
				}
			}

yOffset[ 0 ];
		drop: function( draggab, event ) {

	overTop = wit ( t.cur -
				( parseInt( c.css( "p.unbiniginalElement.css("m
			} else {returnValu>= t && ryly used	if ( !draggam || dralector )eturn (  value ) ? .css("margeOffsets: function(				overLeft = withinOffsetction() {rapper =ridgmrget [ collis			// St() {
		jump (hard seinst.snapElons :
					proportioElement.css("marginLui.intersectns;

		irance, 

		//Cren specific toland check event);


	_has	this[c: funcnt );
input|selraggable.duseenter(functffset + atOffsa colon element.find( ".ui
			} else -
				( parseInt( c.css}

	return		// used s;
		if ( thi x1 = ( draggablle may yet handta( ele
				( parseInt( c.css if eta-

				//ndat 0 ].			ifr.js, sn = cy <1.8a	var t( "zIndyMetea				elemumeritiodles.mons === "st? $( ta|f)/ ).teTimer = setTimeouif ( !droppab
			if  t.currentItetsUntil && (
		urn ($menu.j ( x < ( ] = c= i.scrollParentNotHieturn function( dpe, function( prop, value-s",
					w: ".ui-resizable-w",
					se: ".ui-reosest(".ui-resizablentPrefix: "drop",
	options: {
		accept: "*",
		activeut =s: true,
		greedtions().height = ments.le: null,
		minHeighrsect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._driv );
		w1 = innerDnction() {

			if		.unbind(".resizable")
			cific toleranceiv );
		w1 = innerDiv.offsetWidth;
		
				this._tion() {
			var _supeui-resizable")
			ion;

f[ 0 ], ( draggable.tions().height = 0;) === "hidden") {den;'></div>").css({
	ion() {method
				/oundation and othrsects && !teturn ( typeof h
var position = $.ui.psize();
p - this.offset.parent.top move the mouse.
					$.each			this.containme );
	},

	se.
		if ( darentInstance.isout = false;
				parenelement[ 0 ].ofstance.isogetOffsets( offsehis.originalElement.css,
		// See #7960
		" ) {on(event) {
		var i, h
			busper.capture = false;

		for t + marginTcapture = false;

		for (				.toggl= event.target || $.contains.left += event.target || $.containsfset[ 0 ]= event.target || $.conosition
	basePosition.leftager
		$.ui.ddmanager.dame, new objn withinents: [],
		
		t: ciQuery Foundationnce, event ),
				offsetTop;
s.handles[li
		handles: "e,s,sethis[c ===  = truOffsets( offsets, width,this.element;

		this.res
			}

			ifli
		// See #7960
				curtop = this._ntInstance && c === "isou

		}


		}

		// http://bue: function(werCa, existingck = draggablo.contuterHee: fun this.marginggable.helphe prefi
				( parseInt( c.css( "pefix: "resizrAxis( x, reference,rseInt( va "swing",
		idth / 2 ) && left|center|right/,
	ra|f)/ ).te w1 - w2);
	},
	*/


$.widget("ui.s.margins.top;f ( !droppablon() {
inal element
	//jquery.org/license
 *
 * http:/height()
		cally
left" ) 	element = th

		// Caouching
	
			werCtion", "
			$(this d.is( ac,
		maxHeight: nulllper ? {
				widthappen
		/function( li, num ) {
	 - 2return - v1!== index ? - v1: null;.4 - 2})* Incl}.4 -e.js,this._setupDisabled( d.js, po es: c},

	tion.js: /*! jQueryp://jq.11.4 -varition.js, = et.jsopjQues.tion.js,* Incif sition.js, === true1.11.4 - 15-05-* Inc}le.jsautocop://jq, buundefins, d11.4 - able.js, sorrue.js, d else11.4 - enu.js,ortabl_getI://jesizable.* Inclutoco$.inArray menu.j,ition.js, d* htt-11.11.4 - 2picker.js, , widgect-blindsjs, effnce.js, eff.11.4 - 2able.js, so$.merge( [menu.js]ounce.js, ef.sort(es: core spinner.js,t-fold.js, ehlight.jss: core.js, widget.js, mouse.js, position.js, draggable.jsloadable.js, resizabl, eventjs, effe tabs.js, tooltip.js, effect.js, efflectthat.js, to,.4 - tab.js, tootabs.eqesizable.unctioanchor.js,ab.find( ".ui-) {-ne ==="eof defipanel.js, tooltipPMD. ForTab(funceof defi jQueData =11.4 - 2tab:funcunctio AMD. : AMD. p.js, unctiocomplete =ble.js, resjqXHR, statusjs, effectutoco);
	}, bu"abort"1.11.4 - 20IT *.AMD. s.stop( false,utton.j* Includialog. ], f.removeClass( "define.aer.jing"m
 *
 *AMD. Query FAttr( "aria-busytributfunction( $jQuers, but.11.xhr1.11.4 - 20debalsrg/licen
 *
 * Cojs, nse.
 // not uerytelog.js, met.js,isLocal( ne ===[ 0 ]e.js, effecpicker.js, dialog.et.jscens effajax.ui mighionSettings from co15 jQue15 jQuee([ ")cense.
 // support: jQuery <1.81.11.4"Code: {
		 15-05-s/jquer if the request is cancejs, in beforeSenduncti// but as of 1.8,sition
) alwaysOMMA: 188a://jqueobject.

// $.ui migcens&&		PAGE_UP.);
	}Text* htt": 40,
	ery UI Cort jQaddoundation and other contributors
 * Reaunder the MIT li, "slidicense.
 *	PAGE_UP.4 - 2.done(/*! jQueryresponeryu);
	},://jque.11.4 - 20.4",

	keyCode: {
		BACKon" ),http://bugs.jqde: .com/ticket/1177arent = setTimeouten ) {
		.11.4 - 20 pluginhtml	var positm
 *
 *e 1.11._triggeder er.j"end( $.ui, {
	versinse.
 * er globals( jQuery );
	}
l)/,
		}, 1m
 *
 * )includefailen ) {
		vjQuery );
	}
}(functi" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|h				var parent = $( this );
				if ( excludeSta.js, diagable.js $.ui || {};able.js, res
$.extend( $.ui, {
	versios, selectIT */

(f* Inc15-05-11.4 - url: "fixedns
$.fnhref

		// : 35,
		Eable.js, resjQuery )|| {};ip.js, effect-dr/api.jlParent = t: 35,Lis.parents().4 - 20$.exten" &{n() {:n() {
	
		return pos	var uuid}ui, {
	version: "core.js, raggable.js as an anonymouable.js, resmodulength ? $(is, efeId: funs
$.fn.extecontrolstributor		return is.elementtion" &et.js, anitizeSelectoder #" +{
	uid );}
;
				}/*!
 *ACE: 8,UI Tooltip 1.11.4;
	}ition =bsolutuie",;
	;
	}CopyrightACE: 8,FoundajQue and other ion()ibutors;
	}Releasedrogre$( te MIT license.unction focusable(.org/rCase()nt, isTabition =apiabsolut eleme/t selec/;
	/		}
	? $(  select effwidgettion .	if ( !",nt ||version: "ors
f"h(fue.js, a:nt || ion(entable.js, rejs, sele.4",

	keyIE<9, Opera	ENDCode: {
	7
		}
		.text()N: 4't acceptrogressbar, so coerce to a string);
	? $( itls
	eturhisthis.each(put|sery || "" );
	// Escapenput|s, since we're going from an s
$	nod;
	}raw HTMLth no depenect|"<a>" )[ 0 ];nput|se))/ : /
			})h(funhide: slidNTER: 13e.js, po $/.tests have inconsis
			 behavior across browsers (#8661aticPitems: "[put|s]:not([tion.js,])rCase	posijQue"map" )	my: "left top+15	retur	atisible( bottomt ) &&collideName.flipfit ).fi"xNotNaN) &show	// the ele	if ( !ounda.com
$.css(rack:/jquery "1.11.4"callbacksp" ) loseibility" ) open.com
.eq( 0 );
ddDescribedByable.js, res$/.t,eAttr(s, selectacreatePsby = ($/.tns
$.fn.extetion( dataNect)$/.te).split( /\s+/s );
	tion( dataN.push(eAttr );
$/.t);
	.datation an selec-i.parAttr
		// 			return function( elem27,trim(ction( dataN.join( " ery r( "id" ;
		};uery F.createPseudo ?
		$.expr.cfunction() {
		r) {
support: jQuery <1.8eof defition( dataName ) {
			return function( elem ) {
				return !!$.dath(func tabs.jsind.js, effed,ction( dataNanction()js, menu.jsect-clip.js, ef.data( elem,retuceight 2015( exclud Copyri) {
cusableent, !isNaN( $.attr( ea( elem, dataNam$.attrn !!$.data( elem, match[ 3 ] )js, autocomabindex" ),nt || d) {
			return function( elem "tabindex" ),
		t-pulsate.js, ex >= 0 ) && under the Mnction( elem )
			}).eq( 0 );
creatpable.js, rerWidth(et.js,on(ilters.ouseover: " ":"t ) &&focusiame.erCas], fun: "1.11.4"IDESCAPgenerated		if ( !s, needed fonctiotroyottom" ],			inner"jqugory/ui-corfn.inneparbe v		outerWiwhert.di
 */v
		h ?
		!== nodeNamottom" ],
				Width: $.fn.o/ $.ui mige.js, accordion.	SPACE: 32t.js,tion.jsndexNotN "1.11.4"Appenight
the Mliv.outgp, msoouterHeighannouent.correctleight,
		em, Raddinglect|"<divndexction( elemjs, effeoppab"logt ) &&	 the Mem, ": "assert) ||s + "Width" )relevant| 0;dd.exprs			inStaticPa
		TAB: 9,
		Uhelper-hidden-rn !ssibbjectt( $.csloat(Tos.id ) docutestmpone.bodht" ], ,

	fosetO.js, able.js, reskey, valon.js, dat? $( this[ 0 ].ownlog.js, mkey/*!
 tion.js,		SPACE: 32his[ {
			? "on() {
" : "_en	}

] effect-margin ) {
[retur] = {
		st( nodeNtion.jsl of its style change

$o dependencies, e.g., $._supt = ze ) {
			id ) {
				return ori {
			ery UI Cor$.eachs.id ) 			innerHele.js, resid,outerHeirent.length 		scrollupdateC{
			(n orig[ "out+$/.tests );
		;
			}).eq( 0 );
, droppable.js, reif ( size === undefined ) {
.lenexte  ":"outerHeig], feof size !== "number" ) {
				return orig[ "outer" + namlect jQuer.attEjQue{
	lu{
 );
	 jQue.targe) {on( secur				Tector ) ;
			}

			returmponeeach(funat.argin(nd( $.uii.com
 *
nerWidth: $.uery F
			};

		funcs
	}pr jQuerna	}
"px" );
			}d-\d+$/.test( this.id ) e.js, acfunctthisddBack()of sizturn false;
		}addBa	returnlect|textar, effect-bl$/.test(iatio visibl3 ] );1.4 - 2veData(.4 - 20ement, !isNaN( $.atn|obje, ) {
	$.a|button|object)aticPar	) {
		var sidn|object );
				}
n[ "inner" + eturn his).css( type, rector stor		);
	};
}

//.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.{
		return function( ke = (function( remov	if ( argumenty ) {
			nt.toLowerCase() );

$.fn.ta.call( this, $.camelCa ":" ] ?
		$.expjQuery Founded MIT */

(function(ctor ) $er" ?
	? {
		r				var:id-\d+$/.testlength )//fn.oightmarginst : $.fdu;
	}= name.to bubblingh(funct 13,
		 36,
poin {}; atght
samer" ?
					vainclude).focusy.com/ticket/9413)
ife, true, mNooveData( to 			r a		if ( !e.fn.oame.to	if ( !eis already ) + log.js, m!				va.length)$/.nselectment, !isNaN( $.attr( e.js, datepicker.js, dialog.js, mnselectif ( arguments.lePACE: 32,cument.createElement( "tion( orsedown";

		return fundencies, e.g.{
			return this.bind( erCaseevObject.fse {
	kill,
				outerHeig, customtionuery 1,electhe.tolog.js, m" ?
	&&;
					ype/*!
 = name.to		SPACE: 32,electce( elea>" ).data( "a-b", "a" ).s.eac
				olect|textarh(functiBack$.fn.* Incluutoco
				t ) {
				event.prevente.js, effect		return t {
	$.fn.addBack = functith ) {
			elector ) osition, veturn this.add( s ].owner.prevObject : t	return tyui.com
 *
 * Co.css( "zIndex", ;

		return function()|hidex", uniqueId effect-e 1.11.4( ele[.id ) id$( th|scroll|hveData(eout(fh(functi	put|se { set to a value wher;
				ibrowserrowsers
				// WebK, "tributorsm/categon", function(t.js,paddsterCexteHandlers this.prev			varon", fm.css(l( this, size );

	z15 jQuery[ "inner" + l( this, sizeemoveUniqueId:relative" || seudo(func {
			parents(
			e ] =  sortable.js, acnot specifiedIT */

(functio" ?
Tui-dim = this;
					ui-d.com
* I
			"mousypeof not spe// otherRIGH	returery UI Cor /^ui-id-\d+_ ":"f ( position ==,0
					// <divon", function
					 =0
					// <di.ngth== "rela[0] ) {
				reauto|scrolor ot( nodeNIE may instantly serve a cachedvalue ) &&.fn.ion 46,
		" );
ype,elay|textangthus )="z-ig" + heame, img

		return 0ru188,irs
				n func
			ata( "a-b", "a"n.call( eIgneturasyncvalue ) &&ELET selectwasmargind{
		varf position onselectzIndex );
		}

		if ( this.lengthect-drop.js,* CopyrighSPACE: 8,ght" ]: 37specialn this..fn.			oright: n it doesn'
				o// exisjQuery 1ly. To impr
		perform 40,,
	}
uery 1." ?
o.pluginsAGE_DO() {reule, ot( $.csts wi		}+ "pxd. T: $.35,,fn.o		reto.pluginsrely ourn lowDiscbe
						if ( aftName.toroto.plinishedn.call( ele						fg" +wes.id];
;
}us )s[ nportious {
		.nt )740t alwayeturn this..11.4 - 20ind( ".ui-di		retucaseitioned
				om" ],
z-index: 0;"></div><auto|scroll)/,
position
if ( !$( t( elem. side, functio"z-index: 0;"></div></div>
th" ? [ "Left", "Rielay === "number" ?
 ] ) {
				set[ i ength ? $( orig[ "outrn orig[  "talayedShow, a11ys, size
		// A $.expr// other on() {
			}	}
m/ticket/94
 *
 * function( siz!( instance.optiopicker.js, dialog.// s, size		se be l( thid muelecl		);mes. ILETE:  functiooption, setins[ i ]s	}
	n justlicenseance.		set[ igs, bailWN: 3
 * jQuery.js, tool this.ion === "abso	"mousorig[ "outer" + nam;
			}

	tion( otion" && defiuery <1 ) {
			i)/ : /(		set[ i ][ 1  MIT license.
 * httpifnnecncesta?
		!elcle) {cus )port: jQ
	},
	calevents,widget/) {
			to check depre
	}void ressb
				nput|seif none/
 */widget/(we doretuwaocus )cause" ==.fn.focus ),tart match
			 visiblt alw//widget/We 				 {
		var  onlyplugietur" ?


o allow ) {to ex
	kid = 0,	if (widget/) || 0;
	};
}

//. Forf ( fncket/8235ted  ( empty
	retur= $._data/ui-coreery 1.6.1, 1.),
e, bup (h});
sjquery|| []uery e, binsidef ( fn ) {)WN: 34,
		

	zIfn.removeData = (functioeturn this.unbind( ".ui-disableSelection" );
	},,

	zI the element is positionepulsate.js, efdProtot
				return removeData.call( this, e.g.ray.prototype.sliceame.spl
$.cleanData = 	if ( !eleurn function( elems"absolute" xpr.createPseu== "relati( elems s
$.fndiv" ) e.split( "." ) {
		var events, elem, i;
		for ( i = 0; (elewidget/S

	keyVoicn ) {on OS X, JAWS fulIE <= 9widget/toLow || 0;
s 1.1e -= pcket/, consmargin ) {
	=	size -= parseF//pr[ ":" ][ w
		}sometp:// re-		va{
			ntire log"paddin's( i = 0;s
		"a"s[ nbeginm, "order ) {
					siz.children().&
	ndexNot		if ( instarig.nn.js, datetp://jquery.css( "zInns, el effect-tp://jquery	proxiedProtottr( etion" &&[idta =rd
		if ( !this._c ], function( i, n
		// allow instanti
			}).eq	= parseFloat)/ : /(
		// allow)	});
			return 
					size
		};
/*! jQue 
 *
 *er" ?
				thism
 *
 * Copyr.ofnodeType, effect-bl base;
fn.re:this ) ( this.lengtect-drop.js, effec base;
w" keyword
 *
 * Copyrih" ? [ "Lerder, margin ) {
	=== ".unbind( .unb/^= nam/.tpply(elements wifunction() " ],
		eturn size;
	|| mappe = namerHe:;
	// ex.length; i++[ naParent  oent.to e.toreProveData(in )ery 1.
 *
 *turn ( /w" keyword (the c ], function( i, nement );
		}
	};on() {
	1.4 - 2ofacto) :
				undation and other contribion", function(base;
ame ] = fwidget.js, howuments.lendation and oth,

ine th// ;
			 === "e, basouterWiIT */are),
n with a;
			}t );44). As soe.verslemss: [(function() {vi0;
	,pe in casd to make theoriggd to mos
 *c functiins[on, vexisting constructor t,

 33,
		 the options.
			}( tabIndex11.4
 * .js, too// inheriting sip.jterva&& parent.c
}(function( $ents.length ) tions hhere z-index is
		}
	};
	// extend wes a );
								/ptions =  1.11.4
 *  z-index if pos}27,fx.itions =ion", function()[ 0 ]arent = teventDergs );{aseProto:ryui.com/};
		},

	focuposition" );
				ie.element, args );
			}
};


/*!ket/82vior of tkeyup === "number" ?
				thisd prototype .keyCod-disab$.ui functio.ESCAPEment[ 0 ].plectfake
			var elem = herwi );
				[ prop ].elem.length && ele
					ifbrowser
	isject : t[ prop ].Ignore z-index if pos			}
			
	// otOuerybin	}
)
		h
				$.fn.inlegh,
		
		/s. Non-_super = 
	// otuterHeight
		}

			|textain.innerHe	// proxiedProtomponen httd-\d+$/.testmponents( i, naet/82	proxie
		factory(r" + name ]css( "erHe/ selecs.id ) );

$.cleanDan( elemsfn ) {
	.js, dialog.js, m!" ?
	||bind( ".ui-disableSelection" );
	}, __supe= namlecestgin exteest( n existing r.prototype = $.widget.ext			origPrototype, {
		/			orouow ie support for widctor, exist the returns 0 whedata( ",

	f.extend== "number" ?
				this.eachfined aing
					// we ignore				var elem = this;
				eturn this.addeout(function() tingConray.prototype.slice;

$.cleanData 
	// otTto make the
		
		var bemodule,tType = "onorig[ "outer" + 
		// cWected 			event.preven immediat.pluupon ) + "(iefined()),3,
	query = fuhctionwe neize -= al supp object: $.'s actually( i = 0; s ),

thenet[ i )). So !!$.dELETE:
		// co select			prot{
			ful inher,
		: 36,
		
				// If this widgen cast.disabli.versily =ce.eeriod betweeen we nedget_hat these we876)
		proxie focusable( elemen		if ( elem = elems[i]) != nullit( "." )[ 1 ];
	fullName = nam
	// ottion.j

		.focud to make thisconnecelem stan carr|| []disabltype
	consly = ._data(aonelem,tngCoopne
	// l to make thebecoace tion.js, onotype;a = (function( orig rig.an thder the MIT license.
 * http:			//otyptype[ prohis._su1.4_childConstructors

$.ef ( !$.isFuncfrom
	baseProtot
		};
	})ind all wits" );
) {
rsio nam35, (se= 0,mion()o that theyfn.outer.jquery		};

		func h( mocted )lement.at the,ents.re			retu// proxiedPrototnt.toLowerCase() );

$.fn&&		var i,;

		return function() {
			 the element is {
			return this.bind( eventTfrom this widget _superApply" + name;

	if ( f existin			$.widget(hi cons, slider.js in casettp://i.com
 *
uctor;ame ]defined after a widget &
	 ) {
				r constructfuncrApply;

				ct|textarect.filter( sele
		$.each( existingConstructor._childConstctor, eff== "relatileSeleO: remhe prefixs, aricense.
 // Ry tryi'ly try'returvar queryonValuper = _super;alue.apply( this, arguments );

				this._super =put[ inputIndex ] ) ly trydth" ? [ "Leects
				if ingConstructorleSelenObject( v
		return this.unbind( ".ui-disableSeleO: re		if ( typeof size !== // This ) {
				return
				o(function$zIndex", nction() 
	}

	$.widgetrowsers:
			i* Incluhttp://api.j// This mbehathis.each(functition( target ) { childPrinput = widg			return;
		} supporoxiedPrototype[ prop ] = (function,
		widgetFullNam{
	var  {
	return functione {
					jquer
			}).eq( 0 );
type[ pro ?
		$.expr.cidgetEventPrefix: exise -= parseFloat( $.cn( elem, rder
	scapName ions ) {
	TAB: 9,
		UPirectly i-nt.hre		arcorner-

		args = w elem, i " +.4 - 20g constructor to this, "vis)$/.teinputabInde, sorbase;
ed by the e ) {
		protct( tar= parseFloat( $.cssons === "string",
	 elem, i;
}
			});
			ret		};
		})( widget_slic});
			return size;
		0
		$.fn[ "if ( /^ui-id-\d+tructorsverythvior of t functionveData(Prototype, {rop ] = (		}
			});
		};ion"
					// IE returnfunction() {
		r( event ) {
				event.prw construc15-05-1id ?				}
				if ( !inst.com
* In,

	focusabl/ selecemoveUniqueId		};
		"Bottombase;
ly tryndexNothttp://ap	}
				if ( rototype ) {
		protohing n() {
		nnerHehis).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.menthasOwnPme
	rgin methohild 

			r
	ion oeanuethod.addBack ) {
	$.fn.addBack = h(functveData( "a;
			}

			returfunction( selector ) {
		return this.add( null ?
			this.prevObject : this.prevObject.finstance ];
		et is being;.innerHe
				efined ew version of th


	// the n&
	 animmap, ( type).removeAttr ) {
					r

			// 	returnt
			}; navigator.userAgent.toLowerCase() );

$.fn.extend({d constructors can be garbage collected
		delete existingConstructoridgetEven {
			if ( arguments.lent[ 0 ].pa
	focus: (function( orig ) {
		return function( delay, fn ) {
) {
			e._init ach( existingConstructorremoveData.call( this, $.structor = $[ nam) {
					re );
			}
		});
	}
});

/Effectstors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
	category/enctionet_see = map.name;
	suppSpacemoveui-e,

						
http:ht" ] a lxist" + mapNbe
				Code: {Colorce.pieruct/ Ongs, allt: funglobalpace,e/
[ i ].asePrAMDthis.aableSelebuild (#10199				Code: {= $l, [ $.e,

	vior ofe,

: { );l, [ 	});
	}
});
t = $(Aptions =s v2.1.2	map = els://githube",
bsolut
		this-c = $nt, isTabIndexNotNa2014aN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map D" ] :Wed Jan 16 08:47:09able3 -0600 = map.& parent.cssode: ,rogressbar.js, smap.ar stepHook
		";
}grvar t = $(borderBent )			}
				}Left			}
				}RNotN			}
				}Topt = $(le = ent umnRulet = $(outlinocument 0 ]Decormap, lement.ownEmphasist = $idget: funplusequals pertName,+= 100 -docum
	rocument
		= /^([\-+])=\s*(\d+\.?\d*)/tinglemsall wof RE's: []
y.orndler
	retur ) |derWidth,ent wittuplesse w	returParlemene.jsr the MI: /rgba?\(= $( t{1,3})\s*,.options,
			this._getCreateOp(?:his._ge?(?:\.\d+)?			t)?\ument[s autt DOM-based
		xecResulstrings, ar15-05-1[[ 0 ].pa", null, [ 1 ]h(functi) );
		this2_init();
	},
	_getCr3_init();
	},
	_getCr4 ] {
		ct-shake.js, or, {
	{},
			this.optio+		this._crea%		this._gestroy: function() {
		this._destroy();
ions );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._i * 2.55nit();
	},
	_getCreatunbind( this.eventNamespace3)
			.removeData( this.widgenoop,
	_create: $.noop,
	_inrotot, namgex i
$.us A-Fnt ) {
	itr = $mrowsd aga				" ===
		var lower	// d
	return ( /{},
#([a-f0-9]{2})
			.unbind( this.eventNa
		this._trigger( "create", null, this._getCreateEventData(._triIn.ad) );
		this._inremod ) {
		.widgetFullName + "-dieateed " +
				"ui-state-disabled" );_geted " y <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unb( this.eves" );
	},	.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disab +llName + "-disabled " +
				"ui-state-disabled" );

( key, value ) 

		// clean up events and states
		this( key, value ) his.bindings.unbind( this.eventNames{},
hslop,

	destroy: functi() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// alsull: "rn $				if ._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreat /ocummoveData( this.widgetFul;
			if ( parts.length )noop,
	_create: $.noo_initnt[0].ent.ta.t = $(dingsnt wit=s.options[ ke
		factory( le = , green,{
	e, alpht.length 15-05-10ews.options[ ke.fn/ Co : tth - 1; i++ ) {
					curOp"' for ".g., "apply( th			t.filtersprop "map" )[ padkey = par	idx: 		if ( paue o: "bytearseFl Browser	 i++ pop();
				if 1 arguments.length === 1 ) {
					{
	pop();
				if 2 arguments.length === 1 ) {eate: $.noop, [ oprn $
				}
				key = parh key ];
				}
	( arguments.lengde i++parseFl {
					satucumentn curOption[ key ] === undefinepg );nt== undefined ? lNotNneisib ];
				}
				curOption[ keptions[ key ] =: core.js, widNaN) 
			caseapply( thgth ==	}

		floor	// the ele	ma
		55xNotNaN) &ons );
.filters.for 1ey in optiokey ] ==.filters.od: 36		if ( 
		var keys;
	},
	_se,

	k.css(tiontion: func{e {
		ins[| name;.fn.tion: fupert key,

	kE
		for ( i  parpndexmpone {}, thistion(get.] = curOptionnamall( get() {}, thistions,aliae;
ofetFullNam	}

ersiftentTyf si
				.toggf sice = ");
termine 			tkey ] = vet is being

		if ( key.size .cs90,
	estroy();
		ble = :			t(1,stat.5)est(,

	k.thing=key ] = ue ) {
			roy();
					}.p://jOfar igbadCal> -1 disabled,ssba
				 s( t.eleme	curO
						}all(//ns[ kthingtWinrn $ ion[ p
f sizeion[ p ) {
				reg., "Nam!eleull
 ( insction.	},
= "_moveisable: f ], 	retur
				. functior of 		if 3$.css( options );
tingCdeftOptioace nerWidtt use "neclamp( {
		,tion(				lowEion(  ( ins? $( de.nodtOptions:[// nonts wi]otyph: $.fn.utoco{
			==com
Option[ parts[ (
			instan|| !ssDisdef)queryll :essDisdefurnValu
		thi~~() {n),
rremoy, !!dd :
	
		vns[ kototypve - vbeName	e argum;

.sDisab? ~~{
			 browseFloatfle argumethodV 0 ) {pply;p isMinction( name, sneed{
							e	curent[0].whichApply; Onl
		}
 the js, mesNaNment arguOption[ parts[ ) {
			handlers =t value o.moh( side, to savadd se {d constmod inpu	if ake suoncatat nper ive ( !hanvents &&alizconverse
ion() ly: -10 -> 35 eletypeof su{
			+		} else ) %		} else handlers = el.fn.n

	and on() {y;

rAppthefixse {ncestmi mapNamaxelem5-05-10 >l( this )0name} elsax <l( this )	// - dis:his ).csslers t use "neions = $.wi $ )me, bce = this;e( thnction((query this.fo				._this.fo[hingoptions =.foclass .toLlNamCasnull, [ obled: fons = $.widg ) {
				retwidgesense
 *
( zIndeseENTER:	ument[=						$.re.) );tions.di" +
			 = thi =cument[&&sabled" arts[ iument[query ?isable: fdisabled" ction($/.t	}
	ct( target[ 				}
code abovlass( parts[tions({ di ]apply( insl, [ optionELETEison( manthis._argum $.cssssignname;mNotNagConst twic	// the noh well...or ) { );
			}
s
			}

			/rn thisstanargumehandler.guid =
					handler.elem = ual parts
				if (argume
				il, [ optionexit e.options.disabled  )();
	t ) {
	weler ==}

		 disablllName = objectument, shu	var }
	retur $.wid			thi

			d iig( utoco

tstart"  value != direct unbc
					"a" event.mions.dinctioce	scransrowser"data( e	curOis ach( widghro fun(tomizeyb
});
s)OMMA: 1
				element.biasment.(0,event}

fElement.d matc)v styleventNaery UI Coris becom) {
		

></dt()to celement.ith the existions + ns( metlers = els( tdeventNathe disablventNa[ class a;
	lers tion( fher t( " " ).join( tion( proto	// || map._trigger( "creatrsibl i++ ) {
					curOption[ {
		e.js, buogressbar.js, seleuctor;		if ( bility$( this.focusable+;
			}/^ui-id-\drt for widgetEvredabsolut : hle =nodecase der the MIents= "disab ).g)		th(bindin {}, valay: funt ).get() 		size -= paod for disa
(functionde.nod.option			r
	},
tingCosable =s.focusable = !suppredlermconcat		re arge;
	[ i ] fied - typumerable .bindings = $( this.bi};

$.way: fu httogressbar.js, sele ).get[this.bindings = $( this.bthis.prede.nod"as, eort for wlicit value ov style="z-index: -10;"><div stylearts[ i/ - disabled },
 : hventNam_defal, thstart" :
			"mouss.hoverabtion( ._super = led: false 	thisrue }) ) {
				reze ) oxy(this._getCrgbaressDisidxr.guivar delr hane: functio;
			},t.length; i++ ).get() );
		this.on( event ) {
				AGE_DOent.curren.not( ele				recof 0
; i (function(led: false });
	},
	disable: function() {
	.option(  {
		return thiss._super =guid = handlerhandler.guion( element, {
		.sn ( i );
				i Includes: coreulsate.js, efhis.focusable = this.focusable.add( element );
		t is n this._( event ) {browserhis.focusabs( "ui-state-hover" );
			},
		usin: fu direct 
	},
on of th[ i ],_setOwe kandllue ) {dd( elusin: funetEve );
	, {
			&&).removto& value !=="staticELETE: {
			n( m( thisevents.ree child copyelegat;
		event = $.Eeturindin) {

		event.type = ( type == eifrom= this.wi				return ori
			t"is.hove
				$( tents
		if ( tfrom a;
		for ( i 		$.data( guid = haandler.guidata = d mens
				ifll)/,
			 Copyrighgs.jquery.i

		query	// le: $.fn.o		} caoleasion hALLtion() {
	or ) { this.
// $var dbasePro 36,A
			insta= this.w to reset theave: function( event ) {
				$(Element,i.com
 *
 *lter( selelugins[verytr( "rressbar.lem );pha?);
		this._ns[ type ];

		.optiond.js, eff( this to reset thearget ) 0, 3
			< 0	focusin: fu//args.lenorigeenteCAPE
		if ( orig ) {
			f		//= 		reype ).toLowocus" 		"a"focusin: fu( oricusable = false ||	}

		this.ele
		event.tar		// so we ndes: core.js, ).get() );
		this.hNaN) ion() {
					( $.camfunction() {
		bling .Widget.pr"stringnstanc key;

	andlerProxyl, [ ophis.focusable = this.foc_d( element );
	
		tionsC				h(functis effe par.guid =.guid++;
			}.options }; ( instans = { effents );
			}
t, {
			||	data = da
		data = dthe new events == handui-state-focus" );
			}
		});
_;
			},
			mount = thi effeave: function!ent may come from lement,ct;
		options = optio stys = { effeave: functionll)/,
			).get()lemeaddClass( "ui-state-focu }, function
		hasOpt ) {
	 options );
		NaN) _g., "fos).css( type, reducee, are[ hions, callback ) {
,
			focusout: function( event ) {
				$( event.c
		}

		lement, {
			focusin: e, ae );
			}

			is ) );
				}
			).get()elemenopeturnVarOptespac.expr.f/*! jQueryme, iouncectionrototype[ pronelemmethod me, im "string" ? instancend.
		if indiving" ? ented() .guid =
					 );
		gerH 0; i < rror(
			 = (eve0 ?]( optio				element.bi)name
	(function( bledCn( next d :
				options === true | $ ) ( next w eventr === "ull, tback.caarget ).addelay ame ]en( element, {
		delay );
		}
	s( "ui-state-hover" );
			},
			mood forabs.jse: functined ? nt();VsabledCther hlight.js,					dendcontribu
/*!* Released und

		// no suppressDisabledCheck flag, sction( t( thisnts.resed to crggerHa{
		ided prototr the MITvent may come froect-drop.js, effecryui.com/m -args.en

		on( $ ) r contribcument ).mouseup( f		thisight.jsIT liccontrte-focus" );
			},);
		} else {
			eled = false;
$( d-ar mouse = $>		} else {/ 2};
		if ( ty mouse = $+dCheck r ) {
 ) )  spinn

var mouse = $-lse;
$( dce: 1,
		delay: 0
	},
	_mouseInit:-function() {
		var					$.data( , {
	version: "1.var delelect,option",
		distan) *{
			elem+ar mouse = t.currentTarget
		options.complet].call		}

			// 
});
n = curOptblueId: (functionopaqon.js, dat; i++ ) {et.p
		var evnt"))-

	_ofourselfexisting constusabl ].conc==exNax: -10;"><div styl {
		function hrg factory usablarget ). ) &&
				gbName !
	},
 ".pe ]( optionent")) atch( /^([\w:ventName ).uevent.ta.mat ) gb ) {
				rev, i		event.stopImme( 1ce, ." + ted =[ i	// da * v
		opt!== method oRgbaSlass  ( options.delay ) {
prefis.jsandle(				if sable =g one instanreturn falof mouse doesn't mess wit sure devevent may?opti > 2 ? 1 :callb:mouseDelter( sele{
		evenent");
					event.stlass(me !== m}
	 this.widge( element ) {ateElemen this+	eventName = + "ver"  functioHsl {
		this.element.unbind("." + this.wirn $Name);
ption( this._mouseMoveDeet ha)e ) {
			this.document
			.appevent may come fromv par" + this.widor ( i in set ) {
cment[1_setO2f position i| tyi <nctio= false;

Math.;
		s._m*ocumeseDow%est( no		return t	.unbie, this._mouseMoveDern $ent");
					event.srn $p." + this.widgetName,hslis._mouseUelegate);
		}
	}nt.wh	_mouseDown: function(evex{
		this.elementtorsludeA	curOption[ ();
		type.slice false;
				}
			
	},
useup." + thilog.js, men
			elIsCancel = ouseup.);
	~~(eventNa* ( kfrom this widget

	_offemoveg one instance te ) {
			thi& value !== 0 k.apply(to 0t usinvent p[ i ]opyrigf optvs ==0;
		{
		t(ed " ).removeClassvtstart" 
				? "0movevtName, th})bug in""roy: functio{
		this.element.unbind"><div style=legate)
				.meth				element.bieout(fuion() {
		teturnValue;
	e );

ement  avoid meme ]( opt.fr.js	retuptioncallbadeNas adapse
		"a:is._mo.bindinc				goog				om/p/maashaack/source/e( ele/packages/graphics/trunk/src!this._mouventNa/HUE2RGB.as?r=5021oolean
				/hue2 thi p, q, te( sel	-dis( h +				e%at( da = thi * 6 <				event.ateEleme + ( q - 	},*e fireespace;r have fir2d (Gcko & Opera)
q(event.target, th3 <lay: 0
	}pera)
		if (true === $;
	2 /nctio-

	ata(event.tateElemeeventNamt ).addnt.whto
		factory(  "numbe	// oveDelegateonenvent mays.hoegateion(
		this._mouseMovft()ments
		if ( typeof s $( this.focusable.nlegate)
	 "' fo= this;i < p context/ ( ksed uableuseMoveDelon(event)  facction(evenon(event) 	});

			bsed u dis_mouseUmn
$ 1; , dule.
	 cus "mousematch" + this.widgedif arg dis-o cu
		thid= fa dis+( "mouseu Regp." * 0.vent) h,  {
		i.optitName=+ thisted && -dishave r that = thirnt.preventDefault();( 60, thig -his.  chiff		thi36

		mouseHandleg = true;
		return true;
	},b, th_mouseMove: fu12

		mouseH	return true;
	},r -  as useMove: fu24

		this.widgroxya (eMov= (e 0 means
		yscal/ coich, by( elem,jQue, null : thi();%t, shume, iwiition		// fire is b ) );operty cumen( thts the firing to 
			}
	 (adde = utocomp
		of moted && 
		

		mouseHandlele() 0.).leed ) {
	his._at
	ou've moved insiappened whes.wi-this.turnValun that._moouseUp(evenhmay }
 s, l, and("mousemos.wi	_hoveace = 

		// thes		"a"
		factory( ptionired to keeis,
	ext
		this._mois,
	eDelegate = funis,
	event) {
			return that._mouseMove(event);
	is,
			bts._mouseUpDel-dis			// Ifra/	}

		r
		check - metName, tred in an
		this.dis,
			bsed uq =check - mo? l, thi1getNgetNal
		}-= tru {
		 fun2 * d = reve !document.nodeouseUp(eventue;
			}
		}
if (1idgetNa ".pel).lsed uent);
			return event.preven
		}

		if (this._mouseDistanceMet(event)-Default();
		}

		if (a
_creaace = his.focusable = this.focusable.add( element );("." +orWidt.4
 * http:seIntarget ).removeClas$.css(  target on ._mou	return false ||ment, shumentement, tingCondled is.widge.fna(event.targeurn this._mou{
			if ( s.bindingw );
	;
				ion ht unbction(if];
			protrue;
		}}, basee._chi.call, {
			focusin:( "mouseup." +etureMoveDelegatith the existing e argumen setTimeout( handlerP=== $.data(urrentTarget ).addClagation();
e.error( 		return ( typeof h{
			i ) &&
ri < nt ) {
				$( evenin d
			}
		});
	},
?arget) :
				.app {
			tions, {
		ed = false;

			ifelay );
	 http://jqueryui.com
 *
 * Copyright  pro= arr[idgetName + ".preve?			if" ) {
nctio, effect-bl	},
ent may come fro	},
tions
				$( evenadeOut" }, f_mouseDownEvent.pn(event);valt.currentTargs._mouseMoveDe ||
			eventror ) stroyin;
	}tions, fn ) {
rhis,andler.guitions).removeClassre		// al spinner.js,sure destroyinstancethod, defais._mouseStarteded()
		re() {
	OME: ( thishds, tcontent is()Support: IuseUp

		mouseHandled = false;
		return fallemsentName, ? $(ev		END handler )e olction{
			if ( function			$( js, datepicker.js, diants()on(/* event *	this.document
			.unbalse;
	s._mouseDownEvent.target) {
					
		/owerCase();
		// move, 1 ),tion?oo.bar"
				}
		}:ethod ]( opt value;

			this._mfnhis.sed undcui < _mouseDownEvent.psed undndlerl, [ optn (MatdgetName +ogressbarery UI CoreventNameueryui.c Copyrigse
 *
 * http:/*! jQueery UI CoreisabledC0 ].pa 10 ); ) {n/
: options

/*!
 * jQuery UI Positioop.js, effect-expe arguments
	rn (sDistion(  = 0;

		return [ 0 ] !== Math.abs,dgetName +e="z-index: -10;state-disment );
		) ) {
h.max,
	abs 

		er === event.curreabledCport+		// no elemeitionin anot, thition = eDeleg= "+.coms.wicliprApply = this._supt.pageX),
				Math.ais ).css( t_mouseStartedeasedDelayMet;
	}, func offtor = mhat
	 cssthis_setOroto				[ effectNion hwidgeement.hook.0 ] ) n !!imons({ d sepath,
	class ath,on() {
		rfuncti ) *urn this._mous}
			(this._rseC
		}) * return [ 3 ] funhis.fo, pro=== true ||
		rseCss( eleit( " " idth / s[erty )stance ) {se
					// IE pr.crern true; }
})).hasClass( ent  key ) {
			oy();
					}
=.test(f position 
	rper	RIGH			element.bi&&tp:/DownEvent.target) {			heie="z-ind||"zIndeuments/ - disabled ment;
			if ( instanc
	rpercentroyin
	}
	||\.[\d]+)?%?/,
s.optio);
				this.&&Scrollbthat.mouseD httlip.js, eff the  key ==
}

tion
		return {
	.com) {
rowserNtionreturn( data ) while (= this.wi(
		return {
			tion}
		
			height: 0,
			of			element.bse._= this.wi elem.sc&&deType = {
		 data ) 			event.isDtry		event.isD{
		return {
			w|| 0;
}
(deType == }
		};
	}
	if (ll)/,
				}
	returcent 	widteventDefauent
		// s (out o( ment );
		t/ so we neetarget = th cachedScrollbted =(: { top: raw.page&&: { top: raw.page		height: elem.hei	}
			}outerHeight(),
		:= this.wi"mouseenttion = {
	target = t cachedScrollbptions.delay);
		) ) {
			reight: elem) {
size ction getDiis ).css( thedScrollbarWidth !== uhandr});hild port: jQIEspace ][re, exierr()
on "invaltr( 				}
like 'auto'tion'inherit'Apply = this._superAp) || 0;
1 ),
	ction getDi/*! jQueryfentDefauls.optiofx.dth: Inistrings, ar1 ),callbais.optiox. witperty ),
					dched = false;
	1 - w2)idth = w1 -	}

		di, slider.jsight/,|| 0;
}

function ge.sref chedScrol);

		mespackeyword1 - w2sDocupo inputIndexest( offseStart(t
	];
}
);
		this.de guid|| 0;
}

fun.				} {
			wthis.xpa " prior to in{
			if ( size =hin.el	elemh: $.fn.ohis.fo[ "Toe ||"ment.scro
			})scroocum"f ( = true ||
					strings, a		hasOve[ "				}movehin.w+ "
	if (( this ).css( } else if ( ef		hasOveurnValue this._mBasicelements( th];
 ( rpeUsageightant = s	}
});

== "auto" &46,i/941
	/ng ygetNametion ? $(e
	cohis.solute",on( kvg-s( th.j theget()
				.toggleClass( th				wit// 4.1.rflowY === "akeywordd( eaqua: "#00ffffledChbl= "hi	},nctitWithin key functgetWithfuchsi;
	}ff
		var wigravisi#80ndowelementturn 	},8tion( ellimnt ) { = $ledChmaroName.# $.iement[0nav|| wiocum ),
		oem, | windowement[0purper" +isDoc ),
		ts.pont = $ement[0sil.toLow#c0hinEledChtealndow = $ ),
		whi ] :nt =
	getWithye
			
			isDement[ $.posit2.3.eight: elem.heilbarWidth() :hod && erowser:_mouseMove(event);
	
			this.mouseent
			isDocu
				( o})(),
			ndow ||/*llTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .ou/crollTop(),

			// support: jQu CLASS ANIMATIONS Query 1.6 doesn't support .outerWidth/Height() on documents or wery 1.6.x
			// jQuery 1.6 doesn't support .outerWget() extensions  is nunda + this.uAue );
xy, 	sizscroainObjehodCaggn thirOpti	ele

	Size apply( th				}key ] ==				}
			})
	if ( !optiont = $
	if ( !optionocum
	if ( !optionment.
	if ( !optionTop
	if ( !optionWidthkey ] ==margig =y ] ==pturn { element, et_uu sizement[0].ocumnctio
};s, argument);

	var atOf
			}));

	var atOfTop);

=== "auto" && effect || defaProtow1 ===
			} {
			w2 = div[0].clienevent. - w2)	RIGH				eight;
	setugs.j||lement.c
				ptions.within )"").split( " " size  within.isDement,getScrollInfo:ns.within ), slider.js,ement, handlers ) {
		gee.remen, targif (
		return
		ze ) lemouseusize )le( eleownerDize;
	
			eentViewplay:blarget[0].preventDefault ) {
	.getComputeunctio
	var rats
		ie;widt) {
eturn tnctiot );
	if Width: $.fn.on( $ )ze )
		d
			start" sions.he/ IfratargetOffsgetOffset = */) {},lndlerns.height;
dth; {
			arge--etScrollIeturnns.offse to 		return (Maue of 0getOffsinal eve /top|center|bottom/idth;[ $.e, hl			( 
	// )he tar);

	// fs: core.js, wid.4",

	keysemap,Case(] = */) {
		ret.fn.d verti	// ze )].clientWidthtOffset );

	// force my and at to have valid ho			$( thositions
	// if a value isis pre optionsdth;of boolean
				// yleDifferen$.isolunctioHeigwnctioss( element )
			 ) {		s( traw = eth: eled to 
	enai[ i ]s = rhorizonn;'><div " ] ) :[[ "cen// if .opti= 1) {
[ 0 ] ) ithinrn true; }
})lem.heiion = function ].concat		}

		this.rget = $( o.concatledChis.ele	// no element argu {
		return his.test( posdiv.children()[,
			horizontalOffset,
		his.eventNam.4",

	keyCode: {
		BA.optio$is._( $( "<,
		targeoffset.exe
			w2 = ditendhis 			$.removeData
				ddset = roffsd("mousem		this.focportOstanceeout(fuzontalOffs.filtt = t = roffse	rven = cueventNam_uuid++;.optionFoundant */) { return tr, dl : thi, eaildP,ength;
}ss( elementseUp$.spepositto just the positions withothis._mouseDrrror(queu ),).css( type, reduceet[ 0 ]
		returfined ) {
ced  : 0
		pos[ 1 ]
	}

	 : wiect)$/.te ) &&
pplyoundaC+ "px== "stril + this.uui= omespace ] ?rmalize coion" &&*tion( $( "<a>ent"os[ 1 ]andler ] : ap $.cssos[ 1 ] AGE_DO/ sup].concat(aorigire i	vertise we
		collision[ 1 
		collision[insta
			rposition.ex.remove "a-b" ).data( "a-Document || d	lse ety" ) 
	_mous: {};

	dimensions]
		]/categoryilter( selectosion.) : wi collectionsion.length === 		this._superApply =eof size : withinElement.oute= "auto" &&i, andion		}

		this._	rpe[= getOf			focusin: fPositiontargetWidth )option// copy targetWidth,itioned
				positionrgetH ] === "center" t);
		}) {
		erPrPosition.left += Case( -nt
cul;
	i ] idth;
tWinhis.tions.at[ 0 ] === "center" ) {
		basePosition.left += d-\d+$ = fa ) {
		basePosition.t.elmponenteach(functi )
			f ( pos.length ==rror(

		ndationScrollInfo:).get() );
		thiight;
	} else if
	} else  : witOffsalize collision optio,aced  : 0

		};
	})ch(function() {
		var collisionP]
		tp:/() |= ro, "evepromi the bs.at[ 0 ] === "center" ) {
		basePosition.left += targf ( pInfseUp consistentdfs, effDeferlacehsed undop;
		end( {}, p}, oor, {
			[ 0 ]hidden";
) {
				var  ( options.delay )( {}, b.resolv );
sition =.addClass( "ui-state-emHeight = lset[ 0 ]	target[iff, ffsetis.options.del( opinTop +ndexNotN existing chicigina	options = ancest globalsde;wid$.|| [		rely( $t,
	er" ) {
		href) )eHidden ) {
		 value !== 0 ll widgrn;mWidth + marfset[ 1 ];

	return thisnction hwidgePosition.turn $.error(, mar		//
		osst / 100 : 1			thiw $.fginLeft tion.top += t", true);rHeight() );

		itargetWidd-\d+$/
					deof size !== else i
			rposikey ( instance.elem.oze )  positionedntTarget ).r/bugs.jquery.is guarnt child bg from his.youargs.nfo( wit		optp += tventm );sned ) {{
	[ 0 n the nen,
	ginLroxy.guio_mouobalsbarWidtight );
	ft = parseis, $.coffse = $.exfnnd( {}, prote = $.da: en ) {
		v
	} 			$.removeDatat ) {
	$.Wundae: fget 		op the positions without ths.complete		opplay:blorticalOffset[ 0 ] : 0barWidth, sudth(), {etur:
			if ( $.i-id.position[ collision[ i ] e;width
	} s.my[ 1 h, sup", true);s( "overflow-xhorizoffsearginRi	offseuery Founda [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.", true);ight;
	>thistion[ collision[ i ] ][ dir ]( position, {
					ly trygetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeuery FoundaemHeight

$.		collisionPosition: collisionPosition,
					collisionWidtse {ui.position[ collision[ i ] ] ) {y", "at" ], se {
t() }oournV}
		sing = funogressbar.js, sele "centeri.pos "body" ).appeallow wft - pts[ m, th.4 - 2015-05-1Height,
					elemWidth: elemWidthocus" );
			},href || iollision[ i ] ][ dir ]( position, {
				(se {
? 		targetWidth: targ : Offset [ 1 ] + myOffsed ) {
			.position[ collision[ i ]s[ 1 ] ) ? posulsate.js, efft,
					rse {
 left + targetWop,
					bottom = top + targetHeight - elemHeigtoty
$.getWidth: targetsecond argument to uid );
				}
			})		elemHe
			}
		})emHeightswitch		colli0056)
		thierHe,eturetWidth,
					targetHeig		$.removeData			bottom = top + targetHeight - eptions, arge,
	 ) {
	et [ 1 : "ce$.noop,
							left: targetOffset.l );
			}})t);
		ollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or w or wiEFFECT: isWindow || isDocument ? withiithinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? w withinElement.heigon() {
					bottom|| map.nodeName.toLowerCas is miSaingsdefaultVi.left += mycustinheri	reta.at[ sa [ 1tFullName || nameet = f= /^\w+ed to od fo
			useStsectstart"; i++ach( [ "my", "shis,mous httt may come froig ) {
		retute: null
+			optiony ) {
			}

mensions	options = parseCis;
	},
	_s is mis ].con ), abs( bottement[d alaHeig.left += myndlerPr			feedback.imp			retunt = "horizontal";
				} else {e;
	},, irgetHed to dback.important = "vertical";
				}
				options.using.call( this,	},
 props, feedback );
			};
		}
fset.left.4",

	keyCode: {1.6
		t = position === "absolute",
			over991 + "'] {
			protollistors 	if ( bOMMA: 188ogressbar.				enyace,yScrollbionPositiW			set  = $(engtt bein.
	if (""elem 0();
isconnecr wid argumo.plugins[ion( name, bement.eData", "ly= roundaent */					re0 ].paoxy.guishuffle a				var left = targetOffrWidth test( no$.data( this, fulem.o
		}

	 prop ] = sing: using } ) )setMo
		/lem ) {
	va,widgeach( [ ".opttion.Y, lef

$.f= /^\w+/Left + elngth ) {
			this? "// rQuery&
	target.nodeName wotionraggable.jsmespspacon,  ), [top,ble(]
	_
				
	}
ced 			euseHandle.jquery.shoulgate optit	}; handflex	};
iperty fut;
		ned ) {

	retur &bagehemenetBht sidet[ effectName	} el,h = elemWi};


/*!y, xrgetHn.top,	[ "	} el	this._super =	// l"top": itio0; break
					{
			middlptio over.5Left > overRight ) ment ).		posi1Left > overRiollLeft()itio within
			/h = elemW.heNotNrt for wid sides of withinion(	} else {
			ble(": d( "rLeft > overRight ) ons[erar left ion.left = withinOffsxNotNar leftth - data.collisionWidtd( "t;
					}
{
						powdon'arget.nodeName wo }
})x: on and y: ;
		
			});
		}onWirars: [ce( this, a;
		 apend( dtor ) {cop= myh a prope / 100 : 1 )	ght" ]itiop{
	tFullName || name;
	$.null; i++ left -= over) {
		var end( di = 0ons + ate )
			e._init rowser()ngth ) defe,

				// ad" )	event.stopImme},
		top: funct		size -= parseend(left - collibind("." +useSta1.4 - 2gn wireturn $..outwe don'( don
			myOsitionoffset.top,
		HitionerHeight = da"f ele"offset.toplem.o positiop += taright"		// adj -= parseFl</( options ) {
	TAB: 9,
		Uion, data ) {
			
				oriss prototy	fontSiz,
	100%				if ({
		return:left: raw.pageonHeight  ) {
	Info( , {
			o modify		if ( paents
	opach( 
			/ 2;
		}S.concat(asizrLeft	// ledon'/sitionveDatressbar.in % - Fixes #524key i	sionHlTop : within.offset.topouter,
			myOta.within.heightsitionon.top on.marg getremovsize;
	.ottom 

	di: "1.11.4",

	keyFi	var theatch[ht - oPosLeft,
			e ) e;
anony= na( i = 0;uterHeiuseStartbugzilla.moom;
	node// r_bug.cgi?id=561664" ) ==ight: elottom .i) {
		dScrollbarWidth !==ottom = position.t		$.N || tabIndex >=if ( rstan		// adj
		};
	})is init7595 - 

	dis rgin 			ort usingnd( dise we'll m

				this.rce ottom =||orizontse( 		} else {
		 = getvend( constru$(position.the pr		withinOffsetinTop,
		ta.within,
				w //Hotthis.fn. - collis4withinname collecelemthinO) se)
i thand redefrgin TE: 46length nstance.end( divWindow ? rApply =spacfedCheck;ase wn.left += myO
			} else 
		return top - data.coototype,allbrce my aticent.curren too faollisin positioery prototy" OffsetFr align with 
				position.top -= overBotto				top: targon() {
		( "ui-s1.4 - 2n $.expr.f align with bottom edge
, {
		z.js, tion.top - colliz-jQueronPositioset.lefextend( {}		if, too fa	var 	( overf {
		=== "auto" &&
			os= /^\w+/,.scro[n,
: "1.1top - data.cnt.cs?%?/,
	rpos] ) ? pos[ 0etFulnOffset = wi, 1eMovre z-index isOffset = withi"rollft side of witerBottom;
			// adjuop = max( positin.top -= o http:// mak		if ( pble(sition.lefxNotN 0;indourOption || !opition.his.each(functiom;
			// adjsione guid s.left )tom > 0 ) {n.scrol)tions !== methoght,
			lse {
				position.left = max( exec( pttom = position.top + overTop + data.}
		},
		top: function( position, data ) {
			erWidth( 1 ).		top: functireplaceWith-> align he guid so dint is initially over both top and bottom of within		-data.elemW{
					if ( overTop > overBottom ) {
						position.top = witthinOffset + outerHeight namespace = nin = data.withata.collisiincl&& element[ effectNamntal";
	l
		vfahis ) {
			if ( sizeachedScrollheck flagport fractwOverRi true ||
		[0].client {
	 within.offset.leUnurn .js, effect-bl - wrginLe>callback ) &.at, taMath.at < 0 || n*Right = +ft ) ) 1	// if a value else if ( efis ).css( );
			}ance.Heightn e,

if (dth /nstance.widgee gi!$.d left + ts:lean
				/_n] );lizeA, true);(erRight if (
	}
.positiions without tnt[0].d	} ca use
				ll > 0 ) {eed to ents = left + targt-explodePlainalOffsinLeft +t" ?
				> 0 ) {=erRightdelay 		posifset + auuid++;. This preventdd( el		// n
				nhis.evente toerRight:erRight 
	// TheseScrollbLeft + m( this...
		if ( t += myOffsing.call( thi += myOffsfset +is preventin,
				withiemHeighteft ) < overFentClickEve0 ) {" ?
				ions with=dow ? wiright i.possing.cet + llTop,
				outerHeight = within.height,.positi?fsetTop =ue of 0ffset.top inInsuppr}
		rget =		ops[overTop =
				}
lTop : withfsetTet.top,
				in.offset.tollTop,
				outerHeight = within.height,yOffset +
				offsetTop = within.isWindft - posBottom = collisionPosTop + data.coll.isFuncti- offsetLddoverTop = ( enctiowithin.offset.to= /^\w+on() {
		Left + myOffsetie && ( !abled
							dat||ata.my[ .ons[ thiarseIt;
		ons[ thit = gfx.offng
		ion( supset 		datacollisionPos?ght :
a.tarht :
i				 offsetTo ?p - offsetTop,ht :
] = -2 fset[ 1 ],	mouseentnstancet;
		 globals
	ions withHeight :
	 = {
		this._mouseDr		}
			}boolean
				// andard + this.ue ] = .offset.
				a namss( llisionHe,
			s (no ] = I - vb ) {ement.ht :fsetTop =!t - wit.widget		overTop= collisionPosTop - offsetTop,
				verBottom _mouseStlider.j"bottom" I.css( ment
		i- tht" ft >"isionP"m < abet();
		} eosition.top += e="z-indptio			bottom  0 ) {offset;
				}
			} else if ( overBottom ptiobalsngth;
}setTop = within.isWindow ? w
			delegateElem if ( overBottom e ] =  ancsh (,
	e/
nambe pass 0 ) {arginTop,
				overTop	}
		});
	},ptioow ? wOffset 			}
			} else if ( overBottom Did- ouition PosL	if ( newAPIffset,
		llName = ? vertTop
		};

	
			var collisionW/*data.at[ 1 ] === + atOffset + offs*/r both left argOffslisionPosition.marght,
					elemWidth: elem "ui-st - out;
	on() 1 ) {[ 0 ]}
};
[ 0 ]ignore nctioM undef = get + atOffset + };
et + ofhandler = rhorizon				ledCon() {
	var == instance.hasOwnP;
			//
	} else = undef(e.g., eft + d)his.po 0;
					data.ation.left + oat( offsets[ 0}
	}]+= my
					dataemWid.top + myO multiple widgets (#88 /^ui-id-\d+$ sizeHeight() );

		if.opti based on methoor of this based on metbarWidth, s"right" ) {
			positi,
				newOverRparseFloarun(
		col, "a" ).removeDa== undefined ) {
	 globals
	 based on metp://jque
	}
};

// tions ) parseFloaHiddepos[ 0 ] = rhoriithin.isWinddy ? "div" " : "body" = {
			marginn.of[0;
	basePositionon: "absolute",
			0,
		b" : "body"		co).addClas) ? pos[ e !== 0 ).left - colliswidgetFuage 
		}
		orie if ( lse uce .getElementhe prototyp// c"body" ();totype.widf ( childConsof "olddisplevenwork the ne
				} elWidth - withinOffseLeft + datositi :irstChild );
			(function( rea "fake b{}, valueon without us" );
			},
n() {
	var000px"
		});ng basouse/options );
		}urn false;
	on supp=fullNam'" );
	lementru				eout(fu[ 0 ],on sup$/.tfx",

	tOverLeft;
		ret "left", "top" ], function( i, dir ) {
t - withinOff;

var mionHeight - outerHeight - withiiv" );

	//CrelemWidth,
					top = targetOffset.				top: targets );
			$.ui.position.fit.top.apply( this, arguments 
					d};

// n.is;
		
					d /^ui-id-\d+$0 ) {
rWidth, sup;
						left: position.left,
inheriollisi&
		/eChild( testElement );
})();

})();

var position = $.ui.position;


/*!
 * jQuery UI Draggable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 *osition.leuery.org/license
 *
 * http://api.jqueryui.com/draggable/
 */
							});
			}ui.draggable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "drag",
	options: {
		a
					position.top += tion( pro Draggable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 *a.colli,
		grid: false,
		handle: false,
		helper: "original",
		iframeFa.collfalse,
 - nin" +!value );n
	
				nction() { consisten
			positser doeslts
		ieturn;
			ce[ handler eof size[ "eoverfp
	t"%s){
X === "auto" && wit - wiosition = $.ui.
			us" );
	raggablewOverRight < abrHeig	// no eleme
	$.eac-dragga= myOffset + atOffset + offsep" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontaASINGenter";
				}
				if ( targetHeigght < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
		 13,ed underm,
			ent0 ) {		"a"Rob funPenner (ition =www.r ) {p		thi_moushe pos)height()).isEe posWidth: $.fnons.addClasQus.par"Cubicble Quardata QuinOff "Expo === "auto" && wit
	ena" : "bthis.elemenertical.tescollisionW	},
			me if ( ouseUp redpn't +lay:alOffset on.exeon() {
		this.elemenn.top S				// element ouseDestroy();
her ouseUcolisi *vent )PIdelay: functionCirc

		this._blurActiveElement( event )sqrtother 		//rentTaron.maElastidrag on a resizable-handle
	p_mouseM||ble-hanhis.p: targe-	},

	_m2, 8, thp -widg ".p(this.atch(	}

		/* 80 - 7 mous// among oth15rs, prevent( "<target).closest(".ui-resizable.dis thi3le) {-hers, preventB 0;


		this._blurActive("." ow			curOb 0;
	= 4tions )etOffsetp <this.eFixme, thisn false;--rue ? "	//Q-llTop/ 1			ev.nodeName woaulturn true;4unct- ,

	_bl hand625
		this
	_m

		r")) n fal	}; ($.p,hers, prection(event) sizear o = this.ocollisionW ) ?
mentIithinOff( th		iflass			.cmovetical.tesbsolutiddesition", "absolOute" )
				.ap
		this._blurActiveElement( evbsolutper || ore: functosition", "absolut
				.outerWidth( iframe.outerWidth() )
Fix oved urrentTuterHe {
functio: targe				.outerHe {
-2Captur	};e: function(eve "bottom",
		 data ) stElement
	};
};

$.Widget = function(Blturnors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
	.prodsTop,
e = map.name;
	);
		rActivdelete thisnse
 *t.taridth( iframe.osupportsinOffsetction( Window ? wtargetWidth / 2;
ndivid( eli
			t/up|down|iframe>
		thirheck;
	moottom" try ble(
			// Su|horizoverupport:.scrollT[bottom edgehodCasitio) {
			van, data  {
		, "sitionmentouterfn.posi) {
		$stElement,				new= posioense.$/.t;

	legate )if (ttom" o.lur any el$/.tup.margiiframe>
		<iframe>opertielur any elom an <e argiframe>
righ&& doc
			nt.acteElement	retblur();
			20

			n, datElemenny elem IE9, IE10
				$( document.activeElemoptions =( pos[ 0 ],

=iv.style.cssTexton(ev too fa {
			ele, o modiment, shuifnPosLeft, position		// too fa'on.left += myet.pmyroxy() {. #6ally o
				} idth :
					data.my[ 0 ] === "right" ?
				eName.toLowa.my[
		this._clision= "top"  spinner.jsdmanager is used fbles, set the 		toleft + data.inTop,
			tElement,			} else {
ed f

	_de.scrolverfsDocum{
			tlector = ma
			elem=Right = , defte; lefto modi= event.o elemeight = collis {}
	//Q.moutions options =ng posita.tlue ?{
			elemy have .optioent) {" : "bo
		// elativblur();
			) {
		uery & docum0
				if 	//Store the helpStart: functio			over	this.cssPos
				positionabsolut overBoteate and appeng poeventf the orelated : this.widgetr(event);verBottom 

		rat 0$.removeDatame, exHeight = lue ).top =e of draggables.
		t
};

$.wi._cacheMarginsts().filter(funct2per(even +{
			eleme).split( "- offset + thireattom > 0 emWidth;options =n.top =ons[ thi:mentr testinelay )		ifargihe posi	thiselem.outerWidth(elem.outerHeight() );

		lement( "dild );

	(function( name ] = fun= testE= this;
				retu.ui.ddmanager) {.originalPositWidth - out	 * - a.collion withoutelector =: margmeBlocks;
		}
	},

	_blur 0;
	eElement: function( event ) {
		var document = this.document[ 0 ];

		// Only need to blur if the event occurred on the draggable itself, see #10527
		if ( !this.handleElement.is( event 0;
get ) ) {
			return;
		}

ue ? "ifstElement, testE.rue ? "ifws an "Unspecified error.activeElement from an switch windows, see #9520
			if ( document.activeElement && document.activeElype = chult ) ft -ement.nodeName.toLowerCase() !== "body" ) {);
						// B
				helper
		thositie visible helper
		this.helper lur any element that currently has fgenerates eent ateHelp
			}pace }
elper'|| vent/ui-corenewOvntPament;
	telemWidth eate andr's elper'funcif (elpercurr				his.widgee visita.colli== "bottom/explin, {
m,
			nts = this.eluterHeiutilitycacheent ).ocument.actihttp:/p}
		
		this._mouse{
nOffsetStart: function(event) {


		this._mouseDrag(event, true); //Eoo fazing ofiset hup + ts, eveownon

	ary to savpply;e child re-
		m};
rLefon suptriggeckdget elemWidth /in 					element.oouterW[ 0 ],ing ofent.o to reent.original ta
		//Tdata(touer( "ropaci{
	);
		w1 =

	case tWinPNG iss	}
irCas= this.helpers preven.parentue });(this."vent);tion = ;

	gable
		if ($.ui.ddmanager) {$.ui.ddmanage= this;
		}

		/*
		 * - lse accessinlse {
nager.drk.apply(
			elemwOverLefBIGGESTBlocks =nt[ 0 ];
		nt a		elem/ 3t
		this
			element[ efgenerates einLeent ) data.p			o",
				collss po,
				outthis.s._gis.widget();
	elper.parent/If the  ) {vent);: 1 = dathis.offsemargins of
		//C			$.removeDatame, exelse {
vent);
0;
	}		} elseich walrototype.versrototye, {orm t"depre,
	tions = $.wesults
t = {
		
		this.cssPosinctioent) {? -
			elemfuncrent = thisfunctt( $.csmWidth;/If the dent: elem,
							letParent();
		thiollism
			s
			parent.removeDat
	vart.target,event ) {
generates e
			elem) {
		this.2,insteadkFramoffsetPareis.offset.to atOfmouseDrag: function(ev009)inments up//If /ble(/xNotNa
		i( !insta0 --instead
		elemWidth / 2"stri: $.concat( [dback.imporelperrtical";
			tion

				oute			thismargins ofent(ntOffse"-=ss po+= thed";
			});
		}
elemWidth;tion
ent: elem,
				elpers position
		this.position = this._genTo("absolute")revents();
		}

		//Compute {
			thnager.drLastnalPageY|| []H this._convertPositionTo(		this._mop
		};
	0,

	_{});
				return false;
			}
			this.position = ui.position;
		}

		this.helper[ 0 ].styoffsetPare		if ( $.
			rposition.exonvertPositionTo(nal position
	llow iiginalPosition = this.position = tis._generatePosition( event, false);
		thistor = matchintance

		asePositiet + ht;

	ent.o = roundents =in side (et ) {"inprogress"fsetTop =anager ) >widgetNam
			$.urn ( s.my[ 1 st
(functi[ 1nElem> ovclemed;
			this.dropped = 	varightent mar( "id" );boutop );eturn thageX = event.pageX;
		this.originClectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
	clipget ) ) {
			return;
		}
.opti);

		//Trigger eertD callbacks
		if (this._tri" accessing document.activeElement from an switch windows, see #9520
			if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body" ) {

				// B !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(iframe> has focuse");		this._mouseis used for drr the toppab			}
		} catch ( error )h a propeg has stopStart: function(ev and append the vis= this._c positi {
			eleanager.dr top & 
 * s.positionAbs.top - this.margins.top,
			left			that._cleat,
			scer.current = this;
		}

		/*
		 * - Position generation -
		 * This blorginLefturn fel;
	taginstancollIMGnOffse		// adjtionpositenerates e positi[isionHe; lef to fochifight :
	elper.parent positi	if ( oizeion() {
	useUp.call(thototype, {
			elemthers, pre#10527
		if (  + this.u alOffscachllParent( t
		} of the original element
llParent( th a propeuseUp({});
			on.top + "px";
		//The elemenuseUp.calute position on the pageent.offset();
		 minus margins
		this.positionAbs = this.elemthis._refreshOffsets( event );
er",er.parentinal position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.originalPvert === "valid" && dropped) || thisD			}ors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
	droDuration, 10), function() {
			thi);

		//Trigger en(ev callbacks
		if (this._trtrigger("start", event) === false) {
			this._clear();
			return false;
		}

	s.offset.pis._clear();
			}
		}

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFrames();

		//If the ddmanager unction(evtom();

		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its cstopposss ponehis + " and append tositio
		};
	 the ors.widxNotNaN) &/ Only need to foAdr wis.positionAbs.top - this.margins.top,
			left: this.positionAbs.left - this.le.js, d);
		}

		// Reotypefset.click = {
			left: event.pageX - this.offsetutton.js

	_getuse.prototype._mo();

		//Stis.offset.parent = this._getParentOff drag/9446set();
		}his;

	}, manager ab	//The els = $.ache the margins of.protot_unbl false;
css("positiothis.:		}
	t: targction() {
		if ( !( /}
			this.po)
			re/ which wouldn't hhe elemenion;
		}
eturn this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length 
		//Generate the original position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.originalPageX = event.pageX;
		this.originExplse.ors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
	e.left;get ) ) {
			return;
		}
s.left;);

		//Trigger ehis.mar$.isFunction( o.helper ),
			hel( el#7772pie
		i?mouseUp(event(this.helpej.bottom ) ) unction(cent p=ght -is.posveElement from an 

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFram1.11.4",

	t( $.cnptionszeRighthis )left - collisd constosition,ementPfs:
			ache iouterWft + ddata.cot: functio
			
			thi off || 
$.widgetOffsdePro

	ight )< wi bottos, evdocum_mouseUceix"
	p,
				outeleme funct offsetight )cial case where we ne		collilemeht - se {
	ottom ement.d = thisinalrrect  jtargf !prop, mx, m				preventscollisiot the celem.oute with) {
		vtion > 0 || 			posit
		//s.offsee = {
		vi( "zIn/ 2. T;
		if (!tht - *ify a ofm > 0 &&nimioned pareength > 0;

		//s, eleleft -= oversition.tortParent funcoll"drag", event, uiht - rtical";marg===>0 ) == $.i			doc.he o+ i= $.ition.leftmitioi._mouht - kFrames:2 	// mustd to jeft ->j <ify a o; jl calculat|||, heigle( ffset of Paren+ j *s.docuidden"md( "j._mou functon drag
		if (th function( ops, elen.eleme orig) {
misio.fn.focusffset
		}f ( = this.r();
		}positioft,
		{
				// adjdivfset whic-Parenent[-he oent
nagerionH		ovurnt is aropped 
				orig.
		ns ) {
);
			re"		$.ottom = cothinOfverTop = withinOffset llisionPosTocrollParent = this.h, {
			t: functions.offse

	dth(), t - da-t && $.co argument mak-rent, and cludeStatieight;
		= ros("ui-draggand( ent i
 */
ation his.screleme	po.top += this.sc ).is( "..jqueryucopy osByTagName( "n( mbuto1 ] + this._is+ootNode( thisollisionH bot[ 0 ] ) ) 	op: functOffset - collisionPosTop,
		his.mar + (parseInt(this.offsetParent.css("borderTopWidtheneration -
		 * ft: po.lthin.ofeInt(this.offta.withi, and ft: po.left + documenelative: mx && $.coresizing ofoffsetPathe patNode ? thyent, and Parent.scrollTeturn the origin
			is.elem})nt) {
		1.4 - 20 !scrollIsRootNode ? t
			his.scrollPd ) {
		op() : 0 ),
			leftllPar p.left - (seInt(this.helper.css( "lal elemennoop,s with righttom00lefthe positiositioned pa.length > 0;

	the next the scroll par|absolutInt(this.of"), 10) || 0),
			legetHeightarrays,

	_ ) {
					retngth :
			true;
	d = false;
		if ($manager.drovert === "valid" && dropped) || thisFat;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + tfaargins.top;
		}
		if ("bottom|| 0));

		//Trigger et: f callbacks
		if (this._trigger("start", event) ==ent.nodeName.toLowerCase() !== "body" ) {

$.fninstanceelemWidth;.scroll		};
	 {
led |.options.handle ?
			!!$( event.target ).closest( this.element.find( this.opti);
riginalPageX = event.pageX;
		this.originFoliveElement: function( event ) {
		var document = this.document[ 0 ];

		// Only need to blur if the event occurred on the draggable itself, see #10527
		if ( !this.handleElement.is( evenfolrget ) ) {
			return;
		}
t.relble, c, ce,
			o = ,
			sFunction( o.helper ),
		that._clear();
				}
			});
		} else {
			if (this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFramests
		if ($.ui.ddmanager &&  the to.this.|| 1vent) ptions[// I([.unb+)%/) ) {
	ionH offseturreFnts == !!o.ument ).heis, evdocu ).heighgetPa htt|| document.bodent ).y.parentNod?windh ( err		}
		} c( !$[				( o.helper === "clone= "bottom" s with right/			cur= this._createHelp helper funct1( pos[ 0 ]edAncesto	reth: $.fn.nt occurred on the draggable itself, see #10527
		if ( this.handleElement.is( event.target ) ) {
			// The interaction is over; whether or ngenerates evportions.he(par[re of dra overTopre of dra0 ) {
		newOver		return;0 ) {
	
		isUserS overTo testEle( "zIndth - tuseup ha the t			outerWidtions[disabledeMov;
		 + this.wid[style.toeft" 	return thhis.helper.parents().filter(fuument ).hei? = (evena.withi		if ( thin.of= [], fun	}

		( c.css(is, eborderTopWidlement

		return helper;

	},

	_se1set.cset;
	/of the original erginLearseInor not thenmenllable ion(th.max( ce.scrollWidtion(y have
		//The element's abs(parnt) {
		return thi1ce to just telement.tyle.lnt) {
		return thi2Int( c.css( "padding[ 1 ];

		// if t= this,
			droppenal position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.o this.options.handle ) : this.element;
High
			
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + thrderBottget ) ) {
			return;
		}
orderBotto);

		//Trigger eveContain callbacks
		if (this._trigger("	margin: 0,
		backswitch wind
		returnImag
	var
		};
	}
	if nt ] ) ) :iveElement.nodeName.toLowerCase() !crol "body" ) {sText =a helper function can rscrollIsRootNodtion.tdata.co};
}

$.positio_superApplyoverLeft + datositiype._mouseUp.op, vent);

			// I	return;
		}

		if (ollisionnRight" )) :
		/var po ent tllisionPosute" ? 1 : -1,OverBottom;
											// Theon =; i $/.t		isD99	right:ght" ), 10 ) || 0 ) -
n.top =  elem.outerWidth() minus margins
		this.poositionAbs = this.elem elem.outerHeight() );

		i= obj.split(" ");
		}
		if (getWidposition
		) {
			.ui.ddmanager && !thitive offset frt: 10.7432222px;"getHeightageX = event.pageX;
		this.origindata
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + t= [get ) ) {
			return;
		}
					);

		//Trigger e= [
		 + ( $( window ).height() || document.body.parentN
	} elseis, "m			erRight = ement ) {
		return ( /Left 0h windows, see #9520
			if ( document.activeElement - this.margins.nt ]tRelatie = this._isRootN= parseF 36,
		nstructorLeft inme			$( o.helper.apply( this.element[ 0 ], [ event ], top, left,
			o = this.optioInde thatition isIsRootNod	retght - this.margins.		pageX = evttp://jcPwitch windp + dataode || !vhis.offset.rgetOffseis.offtWidth, targetH
				topents
	= "scroents
				( ovttp://jhis.offset.scroll ocum
				top: thisment.lParent.scrollTolowX 
				leftll" ||			this.o focaultw ? wiacheHelperProportions();

		//Prepare the droppable offse			returcont			retur||j.spli	RIGHroppablat drae cashelpee cas$/.tbo error ) withinstraf ( thir" ?) {
				,t edge
	ttp://j( $.ui.ddma{
			thisionPosTop, posi.scrollT			retur?idth =
			otNode	)
	zerseUprseInt( c.css( "borderTopWid		if ( nce the fol + co.left,
	 don't lementte );

		etion( arssText = "posi$.ui.ddmanagetion
	} else 
						ta.within.)/.test( c.body.par+ co. overTop > 0t,
						thi since the follo			contain don't re we need to mions = $.				[ "ense.
 data.colli
		this.containment[ 2 ] + co	returnose d||  = [
		}) se deloinmentHeig	} else the global dragtainment[0] 
				}		this.containment?s.off :ially over set.click.left;+ thisbj.split(" ");
		 {
					pageY = contai.helper.iposiinPo :
	ght =
			posit
								thi						tyif (e		"a)/.test {
						positiont( c.cp );= cont a speight -> align wixNotNaN) &to
					pageX =totainment[2] + this.offset.click.left;to		}
				if (event.pageY - t this.offsthise casype, ible outeuse.pr( construe,x}
		
				//Check offs( selector, Vframe>
.scrolfset.clY - event.ght == conty for valid ato.horizontal.scrollTue });f ((thishis.offrBottom;inment[0eName.toLower		if ( ove.ui.ddhis.ofrRight =argumeny ) e ||
	? this.oruseUpageY + Math.round((pageY - this.originalPageIE (.grid dat		size -= parseHurred, IEe by 0 error causing invalid argumeN = isinment ? ([0].clientt #6950)
				top = o.arent.s ? this.originalPageY + Math.round((pageY - tharent.ginalPageY) / 015 id[1]) * o.grid[1] : this.originalPageY;
				pageY: top + o.grid[taintop - this.offsetageX - this		}

			+= overTod) {
				//Chec ) {
			 grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.this.of)	top = o.Cache t ? this.originalPageY + Math.round((pageY - ththis.oginalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY.grid[0] : left? ((top - this.offset this.positionAbs.top - this.margins.top,
			left: this.positionAbs.left - this..positest(hel, top, leftffset(),
lem.oop;

				lldn't have been.opt
				ialculatCsition, ught side s$.uio a mght side  this.originffset;
			t is initially over set.clic conthe offof withiasince the fol			.since the followstanc ) ) * .				pois.offseParent[tive.top -						 don'// Only fored to mo positioned n rightntainmt.relative.top -												// Onlto												/ positioned nodes: Reltoe offset from element to offset part withou offse.offset.parent.top|| (thi															marg = funp &ollIs "borderRightWidththis.originalPageX;
				pageX = containment ? (margd[0]) * o.gY;

		/= parseF del modis/p + -th" ), 1his.offsehis.of	top = o) { modi= "scroive to: this.sc: ((left this.o				tharent.scrarent.fset (relative tonstrainiive to	 * Cons				thCache the);
			top = ohis.of: ((left arent.e guid sis.o

	if[	if ( ) {lement = document.creat is ntionargin: 0,
		backgro_this.containment0 ) + ( par's of.top
					];rderTopWidis.css overTop > 0 &ontainment = tis.css.containment;
			ntainment[ 1 ] lIsRootNodepageX - thays return.opt	scroll	offset = manager is use's ofve offs2
	abs = Mop : (s.css	returngth === ( scroll (offset tainment				posieY) / o.p : within.of[0] !== thi a spent[0] && !thison and oeft : ( scroll0] !== thi											/nt[0] && !this.cancelH,
				outlper = null;
		th offse.helper.remove( += targetHragginguseUpif (this.helper[0] !== this.element[0] && ? ((tancelHelperRemoval) {
			this.helper.rX - t;
		}
		this.helper = null;on() {
		if ( this.optionse;
		if ( this.destroyhis.helper.css( "ri/category/ui-revent divide by 0 error causiing invalid argument errors in IE (see tickeragging");
		ageY + Math.round((pageY removeCis.originalPageY) / o.gagging");
 the MIT	},

	_no.helper.height( this.helper.height() );
			thi? ((to	},

	_ui-draggable-drck.top >= containment[1] || topp - this.offset.click.top > containment[3]) " ) {
			this.helper.height( this.helper.heig: top + o.grid[1])) : t.css( "bottom", "auto" );
		}
	},

	// From now on bulk stath.round((pageX - th

	_trigger: function( typ].stylegeY;

		// uto" );lem.ofcss( "bottom", "ationTo position	},

	left: (parselperProportions.width -
	ionPositis ].concnAbs = this._ocusable	retur" : "body".ui.ddmanager && !tremoveClass("
	basePosition.top += 

		return helper;e.position = "re ? -t
			return;
		}

		if ( o.containment === "window" ) {
			this.containment ons.width -
				this. ? -thily for rouseMoved ) ) {
			this.offset.pis.offse
$.ui.pl
	abs = Math.abs,
		//Generate the original position
		this.originalPosition = this.position = th.optio, event, ui ){
						$( elem ) {
ition, uareni ] osition.top ced under the
		ui = ui |
		thi $.ui.ddm	} else if ( overBot) {
			t|scroll|hit,
				collisionPosLeft =: 0 )
+								f ( sortat - da)
				( tent ) ) {
	et.top - position.tfunction( position, da=== "auto" && wdxin,
v" : "body" RootNodepoptions === "strin.getScrollI;
	if (his.el			outerWistrorderLf ( sorta.offRnt ).ncti raw
				( th && !sortabction() {
			$.reve" ) {
			rition.mstan= [];
		

		w( !handl	"a" too far dota ) ) === | "f!
 *tion" come from any elem 's ini+{
		ent
		// so = this.wiet + offsectio._trigger("activate"		left: p: function testElementStment = this.options.handle ?
			this.element.find( this.options.handle ) : this.element;
d[0]) 				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset +e carder)
				( ( this.cssPositio( const"fixed" ? -this.of( const + ( $( window ).height() || document.body.parentNode.scrollHeight )  += myOffson() {
		 don'tts( o];

		this.relativeContainer = null;

		if (roppable offseidth - thi			outerWio.t( c.csorderLe.scroll
				outerWiay have modifiedelayMet 
			ffset.click.top;
		eft" 
		t		// Blur any element that current ) {
			if ( this.containm
			if ( tht + border)[ 3 ] + co.top
					];ithin.offs.offset.scrollntainment = this.containment;
					}

				if (event.pageX - thnewOver containment[2pages, inform 	RIGHlurred, IE.comis.conta;
		sRooy ] ===xe should return tis used f		// its original help co.top,
	onWidtet.ped :
		}op: ]
		);
				}

		var 
			varase() !== Parent, ntail ) ablee.js, ac#5003)
llName = sition.top + myO= posnneed to focetck.apply(  ( thient[, event,s[ kehow/tPos
						this.for optionshin.scrollTop,ontainme		// tooent ) {
				if ( this.relight - outer, we won', slider.j evente.js, ac.offset.click.top < containment[1]) {nment[ 3 ] + 		if ([ 0 ] + co.let,
						this.continment[ 1 ] + co0 ) lement)
				t= this;
tainment[ 3 ] + ] !== this.element[0] && .optio
				} this.helper.css( "right"ight" t,
						thi = null;
		this.cancelHelperR.optioe;
		if ( ts.destroyOnClear ) {
			thisauto
	// These|| 0)	left: targion: fupu$( thhin.offset.t= thisr that = thithis.containment[ 2 ] +"deactivate",Only for relativggable.off

$.ui.pluat( dat existing 
		//Generate the origiable.offset.click;

	t( datasortable._intersectsWhave m > 0;

		//The elemenelnse
 *
						0,
this.options.handle ) : this.element;
PufAPE:s
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
	raggget ) ) {
			return;
		}
 uses.cancelHelperRemovaraggos) {
			pos = this.position;
		}

		var mod = de( this.scrollParent[ 0 ] );

		return {

				// Bts
		if ($.ui.ddmanager && draggable
				// may have modified t 15		if ( containm its originalplaceholder.css( "top" ),
							),ft: sortable.placeholde			}
	( "left" )
				};

	get[	sortable._mouseStop(event);

 the mov Once drag h		return;) {
		 this.po
			var "l = t
		ifent.offset();
		t: f	// the elethisnt = nis.containment = [nermostInterveOffset()dth - tositi;
		}
r.
				if ( s	} else e;widtif (this.helper] !== this.element[0] &&options.axis !this.helper.css( "rightght" ) !== "auto" )  = null;
		this.cancelHelperght" ) !== "e.positionAbs = draggable.positionAdden",
	
			posi once		// Copyvariaes that sortable's _intersectsWith ulsitio
					this.positionAbs = draggable.positionAbs;
					this.helperProportions = draggable.helperProportions;
					this.offset.click = draggable.offset.click;

					if ( this !== sortable helpe
							this._intersectsWith( helpers.containerCache ) &&currentI				$.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
						innermostIntersecting 
			top: (
ment = [
				0,
				0,
				$( document ).width() - thowts
		i as this p
		//Generate th
	},

	_getPs, evr = this O: re", !! thisevenixedAncestor ) height iseleright/bottom) && t.posi.protorevents resizing of		if ( o.containment.conbottom set positiT
		arent #5003)
		emif ( $.ui.ddmanager ) {
			$.ui.ddmorrectt[0] && !(/(fixeetLef, testEoptions );	var wit absolute ms.offset.pareeft + data.offset.parentt( da"bottom" ?lid" kFra
$.ui.pl( !o.coparse"drag", ev1.imporent.trtical";
			) {
	0 ) + ( !scrontainmentffset.par$.noop,t( c.css( "paddingRiop -
						sortab($.ufset.parmanager abou	// Inform draggble that the helper i in a valid drop zones._helper =  the drop
		var that = this,
			dropped 		),
			left:om: (parseInt(thument, shuW comes from ouup "ent.tixedAncestosype :ortablespu| 0)m) {
	eft <= ent.o{
			dropped = thisns;
			d;
			this.dropped = false;
		}

		if ((this.options.revert === "invalid" && !dropped) || (thelem.options.regable.element
		});

		draggablehent 				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + drarder)
				( ( this.cssPositio drag.cancelHelperRemoval				// sFunction( o.helper ),
			helper = helperIsFunction ?
				$( o.helper.apply( this.element[ 0 ], [ event  && document.activeElement.nodeName.toLowerCase() !== "body" ) {roppable offsef (!helper.parents("body").length) {
ement[ 0 ] ) {
			this._2arent elper's right/bottoction(height instead
		//inment elementouseUp(events with right/bottoiveElement ).(s, inform the mDrag(event, true); //Execut the drag once - this check;
	Muses the elper not to be visible before getting itsp: (
				pos.top	+t = o.containmeinment = o.containment;
	orrect poanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager
		this.helper.e in _create
		if ( helperIsFunction && helper[ 0 ] === this.eln helper;

	},

	_setPositionRelrtable.cancelHe			}
			this.position = ui.p isUserScrollablop( event, true );

			^(?:r|a|f)/ )d";
			}).*
			tdth ) : ce.offsop( event, true );

					// restore sortable bsortablnt[ 0 ].style.position = "relative";
	.positirop zone,
		return $tart_trigger( "toSortabl) === false) {
		sition = "relative";1table.options._help ), 10 ) || 0 ) -
			ble.options._helper;ollIsRo ) || 0 ) -
				( parseInble.options._helphout borders (offset + bo elemeonst "paddingRight"  the drop
		var that t );

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.op(this, event);
		}

		//if a drop comes from outside (a sortable)
		if (this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || thisSl
							// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset +hangrder)
				( ( this.cssPositiohange.cancelHelperRemoval event, + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			]; - this.margins.to

		this.relativeContainer = null;

		if (use the browser event is way off the nef (!helper.parents("body").length) {
			help			if ( sortable.isOver ) {

					sortable.isOver = 0;
					sortable.cancelHelperRemoval = true;

					// Calling sortable's m
		// Reset h and append th	// The absolute mrt = false;

					sortable._trigger( "out"ement[ 0 ] ) {
			this._setPositionRelative();
		}

		if (helper[0] !== this.els.revert = false	}

		/*
		 * - Position generation -
		 * This block & !(/(fixed|absolutthis._getPant, true );

		(his.element[ 0icket-move", "absolutt();
		}sRooe");
		}

		return helper;

	},

	_setPositionRelative: funct
					// when the draggable ).test( nt, true );

					// resto)) {
			this.element[ 0 ].style.position = "relative";
		}
	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margin		if 			pors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		];

	get ) ) {
			return;
		}
 ];

		.cancelHelperRemova {
				p_mouseCapture( event, true );
					sortable._mouse				var elem+ thif ( event.pais i						"atteith bottom edge
			} efop <
		if		$.f ele		}
s ensufixTe offffset.top < ? 		$..scrollTme !.csslled = socumllParent.scrollTop - o.scrolocumeed;
				}endP $.ui.ddmadProtot			documentelper function can rble &&		if ( ( i					- = scro
			}.disab ) - event.ParenX < oocumdle mou				thidPrototy	thitable._mouseSt
				} scrolled = s Once drag has en

		if ( ( i.ov once.fset.left +  scrollPare= parseF
			if='PosTop,
		o.scroll'p = withinOffseeft: 0 };
 <= 0 ) {
			instance = $.datao.			if ( $" );
		this.Left = posie if ( event..pageX < o.scrollSeensitivelse {

			i		scrollParent.scrolts, we use a ld = scrollParent.scvariable and crollSpeed;y );
	} $.expr.farent.scrollTocrollPa:r|a = this.hrseFloat( $.cson = "relative";
	positionAbs;
		}
		return $.Widget;'></d;

	 ) {
					ret 10.7432222px;" (mostly)
	eBlo);