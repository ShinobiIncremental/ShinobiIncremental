window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var choco = (function () {

	var __subscribers 	= {};
	var __templates   	= {};
	var __private 		= {};

	var __cssPrefix 	= 	navigator.userAgent.match('Firefox')
							? 	'-moz'
							: 	navigator.userAgent.match('Chrome')
								? '-webkit'
								: '';

	var __isMobile		= false; // TODO: actually check

	window.addEventListener('load', function (e) {
		choco = 'Shinobi Incremental by /r/9thHokageHimawari'

        this.define = define;
        this.defineo = defineo;
        this.fun = fun;
        this.klass = klass;
		this.publish = publish;
		this.subscribe = subscribe;
		this.ele = ele;
		this.template = template;
		this.cssPrefix = __cssPrefix;
		this.isMobile = __isMobile;

		publish.call(this, 'loadListener', 'ready', {e: e});
	}.bind(__private));
	window.addEventListener('click', function (e) {
		var topic = undefined,
			data = undefined,
			ele = e.target;
		while ( topic === undefined ) {
			if (ele.attributes['choco-pubtopic'] !== undefined) {
				topic = ele.attributes['choco-pubtopic'].value;
				data = ele.attributes['choco-pubdata'] !== undefined ? ele.attributes['choco-pubdata'].value : '';
			} else {
				ele = ele.parentElement;
				if (ele === null) {
					return -1;
				}
			}
		}
		publish.call(__private, 'clickListener', topic, {data: data, e: e});
	}.bind(__private))

	function templateParse (str, data, as) {
		data !== undefined
	    ? as !== undefined
			? eval('var ' + as + ' = ' + (typeof data === 'object' ? JSON.stringify(data).toString() : data))
			: eval('var data = ' + (typeof data === 'object' ? JSON.stringify(data).toString() : data))
	    : void 0;
	    return str
		.replace(/\t*/g, '')
		.replace(/\{\{(if) ([\s\S]+?)\}\}([\s\S]+?)\{\{end if\}\}|\{\{(foreach) ([\s\S]+?) as ([\s\S]+?)\}\}([\s\S]+?)\{\{end foreach\}\}/g, function() {
			if (arguments[1] === 'if') {
				if (eval(arguments[2])) {
					return data !== undefined
					? templateParse(arguments[3], data, as)
					: templateParse(arguments[3]);
				}
			} else if (arguments[4] === 'foreach') {
				var obj  = eval(arguments[5])
				var keys = Object.keys(obj);
				var len  = keys.length;
				var s  = '';
				for (var i = 0 ; i < len ; i++) {
					s += templateParse(arguments[7], obj[keys[i]], arguments[6])
				}
				return s;
			}
		}.bind(__private))
		.replace(/\{\{([\s\S]+?(\}?)+)\}\}/g, function () {
	        if (arguments[0].indexOf('foreach') === -1 && eval(arguments[1]) !== undefined) {
	            return eval(arguments[1]);
	        } else {
	            return '';
	        }
	    }.bind(__private))
	}

	function subscribe (subscriber, topic, callback) {
		__subscribers[subscriber] === undefined
		? __subscribers[subscriber] = {}
		: void 0;
		__subscribers[subscriber][topic] = {
			callback : callback
		};

		return __subscribers;
	}
    var o = subscribe;
    subscribe = o.bind(__private);

	function publish (subscribers, topic, data) {
		if (typeof subscribers === 'string') {
			__subscribers[subscribers] !== undefined && __subscribers[subscribers][topic] !== undefined
			? __subscribers[subscribers][topic].callback.call(this, data !== undefined ? data : {} )
			: void 0;
		} else if(subscribers instanceof Array) {
			var len = subscribers.length;
			for ( var i = 0 ; i < len ; i++ ) {
				var subscriber = subscribers[i];
				__subscribers[subscriber] !== undefined && __subscribers[topic][topic] !== undefined
				? __subscribers[subscriber][topic].callback.call(this, data !== undefined ? data : {} )
				: void 0
			}
		}
		return 1;
	}
    var o = publish;
    publish = o.bind(__private);

	function ele (query) {
		var list = [].slice.apply(document.querySelectorAll(query));
		return list.length === 1 ? list[0] : list;
	}

    function define (name, value) {
		this[name] === undefined
		? this[name] = value instanceof Function ? value.call(this) : value
		: void 0;
		return this[name];
	}
    var o = define;
    define = o.bind(__private)

    function fun (name, value) {
		this[name] === undefined
		? this[name] = value
		: void 0;
		return this[name];
	}
    var o = fun;
    fun = o.bind(__private)

    function klass (name, value) {
	    var klass_name = arguments[0],
	        klass_props = arguments.length === 3
	            ? arguments[2]
	            : arguments[1],
	        klass_inherit = arguments.length === 3 && this[arguments[1]] !== undefined
	            ? this[arguments[1]]
	            : undefined,
	        klass_construct = klass_props['constructor'] !== undefined
	            ? klass_props['constructor']
	            : undefined;
	    this[klass_name] = function () {
	        klass_inherit !== undefined
	            ? klass_inherit.apply(this, arguments)
	            : void 0;
	        klass_construct !== undefined
	            ? klass_construct.apply(this, arguments)
	            : void 0;
	        return this;
	    }
	    klass_inherit !== undefined
	        ? this[klass_name].prototype = new klass_inherit()
	        : void 0;
	    this[klass_name].prototype.constructor = this[klass_name];
	    for (var key in klass_props) {
	        if (key !== 'constructor') {
	            this[klass_name].prototype[key] = this[klass_name].prototype[key] !== undefined
	                ? (function () {
	                        var o_prop = this[klass_name].prototype[key];
	                        return function(){
	                            o_prop.apply(this,arguments);
	                            klass_props[key].apply(this,arguments);
	                        }
	                    })()
	                : klass_props[key];
	        }
	    }
	    if (klass_props.override !== undefined) {
	        for (var key in klass_props.override) {
	            this[klass_name].prototype[key] = klass_props.override[key];
	        }
	    }
	}
    var o = klass;
    klass = o.bind(__private)
    /*function define (name, value) {
        return this[name] === undefined
		? observe(this, name, value)
		: this[name];
    }*/


	function addTemplate (name, template) {
		__templates[name] = template
	}

	function template (name, data, as) {
		return templateParse.call(__private, __templates[name], data, as);
	}
    var o = template;
    template = o.bind(__private);

    function defineo () {
        var value = null;
        var name = arguments[0] !== undefined ? arguments[0] : '';
        var dValue = arguments[1] !== undefined ? arguments[1] : null;
        var callback = arguments[2] !== undefined ? arguments[2] : undefined;
        Object.defineProperty(this, arguments[0], {
            get     : function () { return value; }
            , set   : function (newValue) {
                callback !== undefined
                ? callback.call(this, name, value, newValue)
                : void 0;
                value = newValue;
            }
        })
        obj[name] = dValue
        return obj[name];
    }
    var o = defineo;
    defineo = o.bind(__private);

	return {
		subscribe 	: subscribe
		, publish 	: publish
		, ele 		: ele
		, define	: define
		, class	    : klass
		, fun	    : fun
		, addTemplate : addTemplate
		, template : template

		, cssPrefix : __cssPrefix
		, isMobile 	: __isMobile
	}

})();
