import require$$0, { AsyncLocalStorage as AsyncLocalStorage$1 } from "node:async_hooks";
import assetsManifest from "./__vite_rsc_assets_manifest.js";
import { ThemeProvider } from "//lib/contexts/ThemeContext";
import { getDefaultBranding } from "//lib/config/tenantBranding";
function tinyassert(value, message) {
  if (value) return;
  if (message instanceof Error) throw message;
  throw new TinyAssertionError(message, tinyassert);
}
var TinyAssertionError = class extends Error {
  constructor(message, stackStartFunction) {
    super(message ?? "TinyAssertionError");
    if (stackStartFunction && "captureStackTrace" in Error) Error.captureStackTrace(this, stackStartFunction);
  }
};
function safeFunctionCast(f) {
  return f;
}
function memoize(f, options) {
  const keyFn = ((...args) => args[0]);
  const cache = /* @__PURE__ */ new Map();
  return safeFunctionCast(function(...args) {
    const key = keyFn(...args);
    const value = cache.get(key);
    if (typeof value !== "undefined") return value;
    const newValue = f.apply(this, args);
    cache.set(key, newValue);
    return newValue;
  });
}
const SERVER_REFERENCE_PREFIX = "$$server:";
const SERVER_DECODE_CLIENT_PREFIX = "$$decode-client:";
function removeReferenceCacheTag(id) {
  return id.split("$$cache=")[0];
}
function setInternalRequire() {
  globalThis.__vite_rsc_require__ = (id) => {
    if (id.startsWith(SERVER_REFERENCE_PREFIX)) {
      id = id.slice(9);
      return globalThis.__vite_rsc_server_require__(id);
    }
    return globalThis.__vite_rsc_client_require__(id);
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var server_edge = {};
var reactServerDomWebpackServer_edge_production = {};
var reactDom_reactServer = { exports: {} };
var reactDom_reactServer_production = {};
var react_reactServer = { exports: {} };
var react_reactServer_production = {};
var hasRequiredReact_reactServer_production;
function requireReact_reactServer_production() {
  if (hasRequiredReact_reactServer_production) return react_reactServer_production;
  hasRequiredReact_reactServer_production = 1;
  var ReactSharedInternals = { H: null, A: null };
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var isArrayImpl = Array.isArray;
  function noop() {
  }
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty, assign = Object.assign;
  function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== refProp ? refProp : null,
      props
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
  }
  function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return "$" + key.replace(/[=:]/g, function(match2) {
      return escaperLookup[match2];
    });
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error) {
            "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        )), thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type) children = null;
    var invokeCallback = false;
    if (null === children) invokeCallback = true;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;
            case REACT_LAZY_TYPE:
              return invokeCallback = children._init, mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
          }
      }
    if (invokeCallback)
      return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
      })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
        callback,
        escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
          userProvidedKeyEscapeRegex,
          "$&/"
        ) + "/") + invokeCallback
      )), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if (i = getIteratorFn(children), "function" === typeof i)
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if ("object" === type) {
      if ("function" === typeof children.then)
        return mapIntoArray(
          resolveThenable(children),
          array,
          escapedPrefix,
          nameSoFar,
          callback
        );
      array = String(children);
      throw Error(
        formatProdErrorMessage(
          31,
          "[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array
        )
      );
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (null == children) return children;
    var result = [], count = 0;
    mapIntoArray(children, result, "", "", function(child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  function lazyInitializer(payload) {
    if (-1 === payload._status) {
      var ctor = payload._result;
      ctor = ctor();
      ctor.then(
        function(moduleObject) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 1, payload._result = moduleObject;
        },
        function(error) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 2, payload._result = error;
        }
      );
      -1 === payload._status && (payload._status = 0, payload._result = ctor);
    }
    if (1 === payload._status) return payload._result.default;
    throw payload._result;
  }
  function createCacheRoot() {
    return /* @__PURE__ */ new WeakMap();
  }
  function createCacheNode() {
    return { s: 0, v: void 0, o: null, p: null };
  }
  react_reactServer_production.Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
      mapChildren(
        children,
        function() {
          forEachFunc.apply(this, arguments);
        },
        forEachContext
      );
    },
    count: function(children) {
      var n = 0;
      mapChildren(children, function() {
        n++;
      });
      return n;
    },
    toArray: function(children) {
      return mapChildren(children, function(child) {
        return child;
      }) || [];
    },
    only: function(children) {
      if (!isValidElement(children)) throw Error(formatProdErrorMessage(143));
      return children;
    }
  };
  react_reactServer_production.Fragment = REACT_FRAGMENT_TYPE;
  react_reactServer_production.Profiler = REACT_PROFILER_TYPE;
  react_reactServer_production.StrictMode = REACT_STRICT_MODE_TYPE;
  react_reactServer_production.Suspense = REACT_SUSPENSE_TYPE;
  react_reactServer_production.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
  react_reactServer_production.cache = function(fn) {
    return function() {
      var dispatcher = ReactSharedInternals.A;
      if (!dispatcher) return fn.apply(null, arguments);
      var fnMap = dispatcher.getCacheForType(createCacheRoot);
      dispatcher = fnMap.get(fn);
      void 0 === dispatcher && (dispatcher = createCacheNode(), fnMap.set(fn, dispatcher));
      fnMap = 0;
      for (var l = arguments.length; fnMap < l; fnMap++) {
        var arg = arguments[fnMap];
        if ("function" === typeof arg || "object" === typeof arg && null !== arg) {
          var objectCache = dispatcher.o;
          null === objectCache && (dispatcher.o = objectCache = /* @__PURE__ */ new WeakMap());
          dispatcher = objectCache.get(arg);
          void 0 === dispatcher && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
        } else
          objectCache = dispatcher.p, null === objectCache && (dispatcher.p = objectCache = /* @__PURE__ */ new Map()), dispatcher = objectCache.get(arg), void 0 === dispatcher && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
      }
      if (1 === dispatcher.s) return dispatcher.v;
      if (2 === dispatcher.s) throw dispatcher.v;
      try {
        var result = fn.apply(null, arguments);
        fnMap = dispatcher;
        fnMap.s = 1;
        return fnMap.v = result;
      } catch (error) {
        throw result = dispatcher, result.s = 2, result.v = error, error;
      }
    };
  };
  react_reactServer_production.cacheSignal = function() {
    var dispatcher = ReactSharedInternals.A;
    return dispatcher ? dispatcher.cacheSignal() : null;
  };
  react_reactServer_production.captureOwnerStack = function() {
    return null;
  };
  react_reactServer_production.cloneElement = function(element, config, children) {
    if (null === element || void 0 === element)
      throw Error(formatProdErrorMessage(267, element));
    var props = assign({}, element.props), key = element.key;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName) props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, props);
  };
  react_reactServer_production.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength) props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in childrenLength = type.defaultProps, childrenLength)
        void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
  };
  react_reactServer_production.createRef = function() {
    return { current: null };
  };
  react_reactServer_production.forwardRef = function(render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  };
  react_reactServer_production.isValidElement = isValidElement;
  react_reactServer_production.lazy = function(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer
    };
  };
  react_reactServer_production.memo = function(type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: void 0 === compare ? null : compare
    };
  };
  react_reactServer_production.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
  };
  react_reactServer_production.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  };
  react_reactServer_production.useDebugValue = function() {
  };
  react_reactServer_production.useId = function() {
    return ReactSharedInternals.H.useId();
  };
  react_reactServer_production.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  };
  react_reactServer_production.version = "19.2.4";
  return react_reactServer_production;
}
var hasRequiredReact_reactServer;
function requireReact_reactServer() {
  if (hasRequiredReact_reactServer) return react_reactServer.exports;
  hasRequiredReact_reactServer = 1;
  {
    react_reactServer.exports = requireReact_reactServer_production();
  }
  return react_reactServer.exports;
}
var hasRequiredReactDom_reactServer_production;
function requireReactDom_reactServer_production() {
  if (hasRequiredReactDom_reactServer_production) return reactDom_reactServer_production;
  hasRequiredReactDom_reactServer_production = 1;
  var React = requireReact_reactServer();
  function noop() {
  }
  var Internals = {
    d: {
      f: noop,
      r: function() {
        throw Error(
          "Invalid form element. requestFormReset must be passed a form that was rendered by React."
        );
      },
      D: noop,
      C: noop,
      L: noop,
      m: noop,
      X: noop,
      S: noop,
      M: noop
    },
    p: 0,
    findDOMNode: null
  };
  if (!React.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
    throw Error(
      'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
    );
  function getCrossOriginStringAs(as, input) {
    if ("font" === as) return "";
    if ("string" === typeof input)
      return "use-credentials" === input ? input : "";
  }
  reactDom_reactServer_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
  reactDom_reactServer_production.preconnect = function(href, options) {
    "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  };
  reactDom_reactServer_production.prefetchDNS = function(href) {
    "string" === typeof href && Internals.d.D(href);
  };
  reactDom_reactServer_production.preinit = function(href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
      "style" === as ? Internals.d.S(
        href,
        "string" === typeof options.precedence ? options.precedence : void 0,
        {
          crossOrigin,
          integrity,
          fetchPriority
        }
      ) : "script" === as && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0
      });
    }
  };
  reactDom_reactServer_production.preinitModule = function(href, options) {
    if ("string" === typeof href)
      if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
          var crossOrigin = getCrossOriginStringAs(
            options.as,
            options.crossOrigin
          );
          Internals.d.M(href, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
          });
        }
      } else null == options && Internals.d.M(href);
  };
  reactDom_reactServer_production.preload = function(href, options) {
    if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0,
        type: "string" === typeof options.type ? options.type : void 0,
        fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
        referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
        imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
        imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
        media: "string" === typeof options.media ? options.media : void 0
      });
    }
  };
  reactDom_reactServer_production.preloadModule = function(href, options) {
    if ("string" === typeof href)
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0
        });
      } else Internals.d.m(href);
  };
  reactDom_reactServer_production.version = "19.2.4";
  return reactDom_reactServer_production;
}
var hasRequiredReactDom_reactServer;
function requireReactDom_reactServer() {
  if (hasRequiredReactDom_reactServer) return reactDom_reactServer.exports;
  hasRequiredReactDom_reactServer = 1;
  {
    reactDom_reactServer.exports = requireReactDom_reactServer_production();
  }
  return reactDom_reactServer.exports;
}
var hasRequiredReactServerDomWebpackServer_edge_production;
function requireReactServerDomWebpackServer_edge_production() {
  if (hasRequiredReactServerDomWebpackServer_edge_production) return reactServerDomWebpackServer_edge_production;
  hasRequiredReactServerDomWebpackServer_edge_production = 1;
  const __viteRscAsyncHooks = require$$0;
  globalThis.AsyncLocalStorage = __viteRscAsyncHooks.AsyncLocalStorage;
  var ReactDOM = requireReactDom_reactServer(), React = requireReact_reactServer(), REACT_LEGACY_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element"), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
  var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ASYNC_ITERATOR = Symbol.asyncIterator;
  function handleErrorInNextTick(error) {
    setTimeout(function() {
      throw error;
    });
  }
  var LocalPromise = Promise, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : function(callback) {
    LocalPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
  }, currentView = null, writtenBytes = 0;
  function writeChunkAndReturn(destination, chunk) {
    if (0 !== chunk.byteLength)
      if (2048 < chunk.byteLength)
        0 < writtenBytes && (destination.enqueue(
          new Uint8Array(currentView.buffer, 0, writtenBytes)
        ), currentView = new Uint8Array(2048), writtenBytes = 0), destination.enqueue(chunk);
      else {
        var allowableBytes = currentView.length - writtenBytes;
        allowableBytes < chunk.byteLength && (0 === allowableBytes ? destination.enqueue(currentView) : (currentView.set(chunk.subarray(0, allowableBytes), writtenBytes), destination.enqueue(currentView), chunk = chunk.subarray(allowableBytes)), currentView = new Uint8Array(2048), writtenBytes = 0);
        currentView.set(chunk, writtenBytes);
        writtenBytes += chunk.byteLength;
      }
    return true;
  }
  var textEncoder = new TextEncoder();
  function stringToChunk(content) {
    return textEncoder.encode(content);
  }
  function byteLengthOfChunk(chunk) {
    return chunk.byteLength;
  }
  function closeWithError(destination, error) {
    "function" === typeof destination.error ? destination.error(error) : destination.close();
  }
  var CLIENT_REFERENCE_TAG$1 = /* @__PURE__ */ Symbol.for("react.client.reference"), SERVER_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.server.reference");
  function registerClientReferenceImpl(proxyImplementation, id, async) {
    return Object.defineProperties(proxyImplementation, {
      $$typeof: { value: CLIENT_REFERENCE_TAG$1 },
      $$id: { value: id },
      $$async: { value: async }
    });
  }
  var FunctionBind = Function.prototype.bind, ArraySlice = Array.prototype.slice;
  function bind() {
    var newFn = FunctionBind.apply(this, arguments);
    if (this.$$typeof === SERVER_REFERENCE_TAG) {
      var args = ArraySlice.call(arguments, 1), $$typeof = { value: SERVER_REFERENCE_TAG }, $$id = { value: this.$$id };
      args = { value: this.$$bound ? this.$$bound.concat(args) : args };
      return Object.defineProperties(newFn, {
        $$typeof,
        $$id,
        $$bound: args,
        bind: { value: bind, configurable: true }
      });
    }
    return newFn;
  }
  var serverReferenceToString = {
    value: function() {
      return "function () { [omitted code] }";
    },
    configurable: true,
    writable: true
  }, PROMISE_PROTOTYPE = Promise.prototype, deepProxyHandlers = {
    get: function(target, name) {
      switch (name) {
        case "$$typeof":
          return target.$$typeof;
        case "$$id":
          return target.$$id;
        case "$$async":
          return target.$$async;
        case "name":
          return target.name;
        case "displayName":
          return;
        case "defaultProps":
          return;
        case "_debugInfo":
          return;
        case "toJSON":
          return;
        case Symbol.toPrimitive:
          return Object.prototype[Symbol.toPrimitive];
        case Symbol.toStringTag:
          return Object.prototype[Symbol.toStringTag];
        case "Provider":
          throw Error(
            "Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider."
          );
        case "then":
          throw Error(
            "Cannot await or return from a thenable. You cannot await a client module from a server component."
          );
      }
      throw Error(
        "Cannot access " + (String(target.name) + "." + String(name)) + " on the server. You cannot dot into a client module from a server component. You can only pass the imported name through."
      );
    },
    set: function() {
      throw Error("Cannot assign to a client module from a server module.");
    }
  };
  function getReference(target, name) {
    switch (name) {
      case "$$typeof":
        return target.$$typeof;
      case "$$id":
        return target.$$id;
      case "$$async":
        return target.$$async;
      case "name":
        return target.name;
      case "defaultProps":
        return;
      case "_debugInfo":
        return;
      case "toJSON":
        return;
      case Symbol.toPrimitive:
        return Object.prototype[Symbol.toPrimitive];
      case Symbol.toStringTag:
        return Object.prototype[Symbol.toStringTag];
      case "__esModule":
        var moduleId = target.$$id;
        target.default = registerClientReferenceImpl(
          function() {
            throw Error(
              "Attempted to call the default export of " + moduleId + " from the server but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
            );
          },
          target.$$id + "#",
          target.$$async
        );
        return true;
      case "then":
        if (target.then) return target.then;
        if (target.$$async) return;
        var clientReference = registerClientReferenceImpl({}, target.$$id, true), proxy = new Proxy(clientReference, proxyHandlers$1);
        target.status = "fulfilled";
        target.value = proxy;
        return target.then = registerClientReferenceImpl(
          function(resolve) {
            return Promise.resolve(resolve(proxy));
          },
          target.$$id + "#then",
          false
        );
    }
    if ("symbol" === typeof name)
      throw Error(
        "Cannot read Symbol exports. Only named exports are supported on a client module imported on the server."
      );
    clientReference = target[name];
    clientReference || (clientReference = registerClientReferenceImpl(
      function() {
        throw Error(
          "Attempted to call " + String(name) + "() from the server but " + String(name) + " is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        );
      },
      target.$$id + "#" + name,
      target.$$async
    ), Object.defineProperty(clientReference, "name", { value: name }), clientReference = target[name] = new Proxy(clientReference, deepProxyHandlers));
    return clientReference;
  }
  var proxyHandlers$1 = {
    get: function(target, name) {
      return getReference(target, name);
    },
    getOwnPropertyDescriptor: function(target, name) {
      var descriptor = Object.getOwnPropertyDescriptor(target, name);
      descriptor || (descriptor = {
        value: getReference(target, name),
        writable: false,
        configurable: false,
        enumerable: false
      }, Object.defineProperty(target, name, descriptor));
      return descriptor;
    },
    getPrototypeOf: function() {
      return PROMISE_PROTOTYPE;
    },
    set: function() {
      throw Error("Cannot assign to a client module from a server module.");
    }
  }, ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: previousDispatcher.f,
    r: previousDispatcher.r,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule$1,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
  };
  function prefetchDNS(href) {
    if ("string" === typeof href && href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "D|" + href;
        hints.has(key) || (hints.add(key), emitHint(request, "D", href));
      } else previousDispatcher.D(href);
    }
  }
  function preconnect(href, crossOrigin) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "C|" + (null == crossOrigin ? "null" : crossOrigin) + "|" + href;
        hints.has(key) || (hints.add(key), "string" === typeof crossOrigin ? emitHint(request, "C", [href, crossOrigin]) : emitHint(request, "C", href));
      } else previousDispatcher.C(href, crossOrigin);
    }
  }
  function preload(href, as, options) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "L";
        if ("image" === as && options) {
          var imageSrcSet = options.imageSrcSet, imageSizes = options.imageSizes, uniquePart = "";
          "string" === typeof imageSrcSet && "" !== imageSrcSet ? (uniquePart += "[" + imageSrcSet + "]", "string" === typeof imageSizes && (uniquePart += "[" + imageSizes + "]")) : uniquePart += "[][]" + href;
          key += "[image]" + uniquePart;
        } else key += "[" + as + "]" + href;
        hints.has(key) || (hints.add(key), (options = trimOptions(options)) ? emitHint(request, "L", [href, as, options]) : emitHint(request, "L", [href, as]));
      } else previousDispatcher.L(href, as, options);
    }
  }
  function preloadModule$1(href, options) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "m|" + href;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "m", [href, options]) : emitHint(request, "m", href);
      }
      previousDispatcher.m(href, options);
    }
  }
  function preinitStyle(href, precedence, options) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "S|" + href;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "S", [
          href,
          "string" === typeof precedence ? precedence : 0,
          options
        ]) : "string" === typeof precedence ? emitHint(request, "S", [href, precedence]) : emitHint(request, "S", href);
      }
      previousDispatcher.S(href, precedence, options);
    }
  }
  function preinitScript(src, options) {
    if ("string" === typeof src) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "X|" + src;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "X", [src, options]) : emitHint(request, "X", src);
      }
      previousDispatcher.X(src, options);
    }
  }
  function preinitModuleScript(src, options) {
    if ("string" === typeof src) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "M|" + src;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "M", [src, options]) : emitHint(request, "M", src);
      }
      previousDispatcher.M(src, options);
    }
  }
  function trimOptions(options) {
    if (null == options) return null;
    var hasProperties = false, trimmed = {}, key;
    for (key in options)
      null != options[key] && (hasProperties = true, trimmed[key] = options[key]);
    return hasProperties ? trimmed : null;
  }
  function getChildFormatContext(parentContext, type, props) {
    switch (type) {
      case "img":
        type = props.src;
        var srcSet = props.srcSet;
        if (!("lazy" === props.loading || !type && !srcSet || "string" !== typeof type && null != type || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || parentContext & 3) && ("string" !== typeof type || ":" !== type[4] || "d" !== type[0] && "D" !== type[0] || "a" !== type[1] && "A" !== type[1] || "t" !== type[2] && "T" !== type[2] || "a" !== type[3] && "A" !== type[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
          var sizes = "string" === typeof props.sizes ? props.sizes : void 0;
          var input = props.crossOrigin;
          preload(type || "", "image", {
            imageSrcSet: srcSet,
            imageSizes: sizes,
            crossOrigin: "string" === typeof input ? "use-credentials" === input ? input : "" : void 0,
            integrity: props.integrity,
            type: props.type,
            fetchPriority: props.fetchPriority,
            referrerPolicy: props.referrerPolicy
          });
        }
        return parentContext;
      case "link":
        type = props.rel;
        srcSet = props.href;
        if (!(parentContext & 1 || null != props.itemProp || "string" !== typeof type || "string" !== typeof srcSet || "" === srcSet))
          switch (type) {
            case "preload":
              preload(srcSet, props.as, {
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy,
                imageSrcSet: props.imageSrcSet,
                imageSizes: props.imageSizes,
                media: props.media
              });
              break;
            case "modulepreload":
              preloadModule$1(srcSet, {
                as: props.as,
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                nonce: props.nonce
              });
              break;
            case "stylesheet":
              preload(srcSet, "stylesheet", {
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy,
                media: props.media
              });
          }
        return parentContext;
      case "picture":
        return parentContext | 2;
      case "noscript":
        return parentContext | 1;
      default:
        return parentContext;
    }
  }
  var supportsRequestStorage = "function" === typeof AsyncLocalStorage, requestStorage = supportsRequestStorage ? new AsyncLocalStorage() : null, TEMPORARY_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.temporary.reference"), proxyHandlers = {
    get: function(target, name) {
      switch (name) {
        case "$$typeof":
          return target.$$typeof;
        case "name":
          return;
        case "displayName":
          return;
        case "defaultProps":
          return;
        case "_debugInfo":
          return;
        case "toJSON":
          return;
        case Symbol.toPrimitive:
          return Object.prototype[Symbol.toPrimitive];
        case Symbol.toStringTag:
          return Object.prototype[Symbol.toStringTag];
        case "Provider":
          throw Error(
            "Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider."
          );
        case "then":
          return;
      }
      throw Error(
        "Cannot access " + String(name) + " on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client."
      );
    },
    set: function() {
      throw Error(
        "Cannot assign to a temporary client reference from a server module."
      );
    }
  };
  function createTemporaryReference(temporaryReferences, id) {
    var reference = Object.defineProperties(
      function() {
        throw Error(
          "Attempted to call a temporary Client Reference from the server but it is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        );
      },
      { $$typeof: { value: TEMPORARY_REFERENCE_TAG } }
    );
    reference = new Proxy(reference, proxyHandlers);
    temporaryReferences.set(reference, id);
    return reference;
  }
  function noop() {
  }
  var SuspenseException = Error(
    "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
  );
  function trackUsedThenable(thenableState2, thenable, index) {
    index = thenableState2[index];
    void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
          function(fulfilledValue) {
            if ("pending" === thenable.status) {
              var fulfilledThenable = thenable;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = fulfilledValue;
            }
          },
          function(error) {
            if ("pending" === thenable.status) {
              var rejectedThenable = thenable;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = error;
            }
          }
        ));
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable)
      throw Error(
        "Expected a suspended thenable. This is a bug in React. Please file an issue."
      );
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  var currentRequest$1 = null, thenableIndexCounter = 0, thenableState = null;
  function getThenableStateAfterSuspending() {
    var state = thenableState || [];
    thenableState = null;
    return state;
  }
  var HooksDispatcher = {
    readContext: unsupportedContext,
    use,
    useCallback: function(callback) {
      return callback;
    },
    useContext: unsupportedContext,
    useEffect: unsupportedHook,
    useImperativeHandle: unsupportedHook,
    useLayoutEffect: unsupportedHook,
    useInsertionEffect: unsupportedHook,
    useMemo: function(nextCreate) {
      return nextCreate();
    },
    useReducer: unsupportedHook,
    useRef: unsupportedHook,
    useState: unsupportedHook,
    useDebugValue: function() {
    },
    useDeferredValue: unsupportedHook,
    useTransition: unsupportedHook,
    useSyncExternalStore: unsupportedHook,
    useId,
    useHostTransitionStatus: unsupportedHook,
    useFormState: unsupportedHook,
    useActionState: unsupportedHook,
    useOptimistic: unsupportedHook,
    useMemoCache: function(size) {
      for (var data = Array(size), i = 0; i < size; i++)
        data[i] = REACT_MEMO_CACHE_SENTINEL;
      return data;
    },
    useCacheRefresh: function() {
      return unsupportedRefresh;
    }
  };
  HooksDispatcher.useEffectEvent = unsupportedHook;
  function unsupportedHook() {
    throw Error("This Hook is not supported in Server Components.");
  }
  function unsupportedRefresh() {
    throw Error("Refreshing the cache is not supported in Server Components.");
  }
  function unsupportedContext() {
    throw Error("Cannot read a Client Context from a Server Component.");
  }
  function useId() {
    if (null === currentRequest$1)
      throw Error("useId can only be used while React is rendering");
    var id = currentRequest$1.identifierCount++;
    return "_" + currentRequest$1.identifierPrefix + "S_" + id.toString(32) + "_";
  }
  function use(usable) {
    if (null !== usable && "object" === typeof usable || "function" === typeof usable) {
      if ("function" === typeof usable.then) {
        var index = thenableIndexCounter;
        thenableIndexCounter += 1;
        null === thenableState && (thenableState = []);
        return trackUsedThenable(thenableState, usable, index);
      }
      usable.$$typeof === REACT_CONTEXT_TYPE && unsupportedContext();
    }
    if (usable.$$typeof === CLIENT_REFERENCE_TAG$1) {
      if (null != usable.value && usable.value.$$typeof === REACT_CONTEXT_TYPE)
        throw Error("Cannot read a Client Context from a Server Component.");
      throw Error("Cannot use() an already resolved Client Reference.");
    }
    throw Error("An unsupported type was passed to use(): " + String(usable));
  }
  var DefaultAsyncDispatcher = {
    getCacheForType: function(resourceType) {
      var JSCompiler_inline_result = (JSCompiler_inline_result = resolveRequest()) ? JSCompiler_inline_result.cache : /* @__PURE__ */ new Map();
      var entry = JSCompiler_inline_result.get(resourceType);
      void 0 === entry && (entry = resourceType(), JSCompiler_inline_result.set(resourceType, entry));
      return entry;
    },
    cacheSignal: function() {
      var request = resolveRequest();
      return request ? request.cacheController.signal : null;
    }
  }, ReactSharedInternalsServer = React.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  if (!ReactSharedInternalsServer)
    throw Error(
      'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
    );
  var isArrayImpl = Array.isArray, getPrototypeOf = Object.getPrototypeOf;
  function objectName(object) {
    object = Object.prototype.toString.call(object);
    return object.slice(8, object.length - 1);
  }
  function describeValueForErrorMessage(value) {
    switch (typeof value) {
      case "string":
        return JSON.stringify(
          10 >= value.length ? value : value.slice(0, 10) + "..."
        );
      case "object":
        if (isArrayImpl(value)) return "[...]";
        if (null !== value && value.$$typeof === CLIENT_REFERENCE_TAG)
          return "client";
        value = objectName(value);
        return "Object" === value ? "{...}" : value;
      case "function":
        return value.$$typeof === CLIENT_REFERENCE_TAG ? "client" : (value = value.displayName || value.name) ? "function " + value : "function";
      default:
        return String(value);
    }
  }
  function describeElementType(type) {
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeElementType(type.render);
        case REACT_MEMO_TYPE:
          return describeElementType(type.type);
        case REACT_LAZY_TYPE:
          var payload = type._payload;
          type = type._init;
          try {
            return describeElementType(type(payload));
          } catch (x) {
          }
      }
    return "";
  }
  var CLIENT_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.client.reference");
  function describeObjectForErrorMessage(objectOrArray, expandedName) {
    var objKind = objectName(objectOrArray);
    if ("Object" !== objKind && "Array" !== objKind) return objKind;
    objKind = -1;
    var length = 0;
    if (isArrayImpl(objectOrArray)) {
      var str = "[";
      for (var i = 0; i < objectOrArray.length; i++) {
        0 < i && (str += ", ");
        var value = objectOrArray[i];
        value = "object" === typeof value && null !== value ? describeObjectForErrorMessage(value) : describeValueForErrorMessage(value);
        "" + i === expandedName ? (objKind = str.length, length = value.length, str += value) : str = 10 > value.length && 40 > str.length + value.length ? str + value : str + "...";
      }
      str += "]";
    } else if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE)
      str = "<" + describeElementType(objectOrArray.type) + "/>";
    else {
      if (objectOrArray.$$typeof === CLIENT_REFERENCE_TAG) return "client";
      str = "{";
      i = Object.keys(objectOrArray);
      for (value = 0; value < i.length; value++) {
        0 < value && (str += ", ");
        var name = i[value], encodedKey = JSON.stringify(name);
        str += ('"' + name + '"' === encodedKey ? name : encodedKey) + ": ";
        encodedKey = objectOrArray[name];
        encodedKey = "object" === typeof encodedKey && null !== encodedKey ? describeObjectForErrorMessage(encodedKey) : describeValueForErrorMessage(encodedKey);
        name === expandedName ? (objKind = str.length, length = encodedKey.length, str += encodedKey) : str = 10 > encodedKey.length && 40 > str.length + encodedKey.length ? str + encodedKey : str + "...";
      }
      str += "}";
    }
    return void 0 === expandedName ? str : -1 < objKind && 0 < length ? (objectOrArray = " ".repeat(objKind) + "^".repeat(length), "\n  " + str + "\n  " + objectOrArray) : "\n  " + str;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty, ObjectPrototype$1 = Object.prototype, stringify = JSON.stringify;
  function defaultErrorHandler(error) {
    console.error(error);
  }
  function RequestInstance(type, model, bundlerConfig, onError, onPostpone, onAllReady, onFatalError, identifierPrefix, temporaryReferences) {
    if (null !== ReactSharedInternalsServer.A && ReactSharedInternalsServer.A !== DefaultAsyncDispatcher)
      throw Error("Currently React only supports one RSC renderer at a time.");
    ReactSharedInternalsServer.A = DefaultAsyncDispatcher;
    var abortSet = /* @__PURE__ */ new Set(), pingedTasks = [], hints = /* @__PURE__ */ new Set();
    this.type = type;
    this.status = 10;
    this.flushScheduled = false;
    this.destination = this.fatalError = null;
    this.bundlerConfig = bundlerConfig;
    this.cache = /* @__PURE__ */ new Map();
    this.cacheController = new AbortController();
    this.pendingChunks = this.nextChunkId = 0;
    this.hints = hints;
    this.abortableTasks = abortSet;
    this.pingedTasks = pingedTasks;
    this.completedImportChunks = [];
    this.completedHintChunks = [];
    this.completedRegularChunks = [];
    this.completedErrorChunks = [];
    this.writtenSymbols = /* @__PURE__ */ new Map();
    this.writtenClientReferences = /* @__PURE__ */ new Map();
    this.writtenServerReferences = /* @__PURE__ */ new Map();
    this.writtenObjects = /* @__PURE__ */ new WeakMap();
    this.temporaryReferences = temporaryReferences;
    this.identifierPrefix = identifierPrefix || "";
    this.identifierCount = 1;
    this.taintCleanupQueue = [];
    this.onError = void 0 === onError ? defaultErrorHandler : onError;
    this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
    this.onAllReady = onAllReady;
    this.onFatalError = onFatalError;
    type = createTask(this, model, null, false, 0, abortSet);
    pingedTasks.push(type);
  }
  var currentRequest = null;
  function resolveRequest() {
    if (currentRequest) return currentRequest;
    if (supportsRequestStorage) {
      var store = requestStorage.getStore();
      if (store) return store;
    }
    return null;
  }
  function serializeThenable(request, task, thenable) {
    var newTask = createTask(
      request,
      thenable,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    switch (thenable.status) {
      case "fulfilled":
        return newTask.model = thenable.value, pingTask(request, newTask), newTask.id;
      case "rejected":
        return erroredTask(request, newTask, thenable.reason), newTask.id;
      default:
        if (12 === request.status)
          return request.abortableTasks.delete(newTask), 21 === request.type ? (haltTask(newTask), finishHaltedTask(newTask, request)) : (task = request.fatalError, abortTask(newTask), finishAbortedTask(newTask, request, task)), newTask.id;
        "string" !== typeof thenable.status && (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error) {
            "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        ));
    }
    thenable.then(
      function(value) {
        newTask.model = value;
        pingTask(request, newTask);
      },
      function(reason) {
        0 === newTask.status && (erroredTask(request, newTask, reason), enqueueFlush(request));
      }
    );
    return newTask.id;
  }
  function serializeReadableStream(request, task, stream) {
    function progress(entry) {
      if (0 === streamTask.status)
        if (entry.done)
          streamTask.status = 1, entry = streamTask.id.toString(16) + ":C\n", request.completedRegularChunks.push(stringToChunk(entry)), request.abortableTasks.delete(streamTask), request.cacheController.signal.removeEventListener(
            "abort",
            abortStream
          ), enqueueFlush(request), callOnAllReadyIfReady(request);
        else
          try {
            streamTask.model = entry.value, request.pendingChunks++, tryStreamTask(request, streamTask), enqueueFlush(request), reader.read().then(progress, error);
          } catch (x$11) {
            error(x$11);
          }
    }
    function error(reason) {
      0 === streamTask.status && (request.cacheController.signal.removeEventListener("abort", abortStream), erroredTask(request, streamTask, reason), enqueueFlush(request), reader.cancel(reason).then(error, error));
    }
    function abortStream() {
      if (0 === streamTask.status) {
        var signal = request.cacheController.signal;
        signal.removeEventListener("abort", abortStream);
        signal = signal.reason;
        21 === request.type ? (request.abortableTasks.delete(streamTask), haltTask(streamTask), finishHaltedTask(streamTask, request)) : (erroredTask(request, streamTask, signal), enqueueFlush(request));
        reader.cancel(signal).then(error, error);
      }
    }
    var supportsBYOB = stream.supportsBYOB;
    if (void 0 === supportsBYOB)
      try {
        stream.getReader({ mode: "byob" }).releaseLock(), supportsBYOB = true;
      } catch (x) {
        supportsBYOB = false;
      }
    var reader = stream.getReader(), streamTask = createTask(
      request,
      task.model,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    request.pendingChunks++;
    task = streamTask.id.toString(16) + ":" + (supportsBYOB ? "r" : "R") + "\n";
    request.completedRegularChunks.push(stringToChunk(task));
    request.cacheController.signal.addEventListener("abort", abortStream);
    reader.read().then(progress, error);
    return serializeByValueID(streamTask.id);
  }
  function serializeAsyncIterable(request, task, iterable, iterator) {
    function progress(entry) {
      if (0 === streamTask.status)
        if (entry.done) {
          streamTask.status = 1;
          if (void 0 === entry.value)
            var endStreamRow = streamTask.id.toString(16) + ":C\n";
          else
            try {
              var chunkId = outlineModelWithFormatContext(
                request,
                entry.value,
                0
              );
              endStreamRow = streamTask.id.toString(16) + ":C" + stringify(serializeByValueID(chunkId)) + "\n";
            } catch (x) {
              error(x);
              return;
            }
          request.completedRegularChunks.push(stringToChunk(endStreamRow));
          request.abortableTasks.delete(streamTask);
          request.cacheController.signal.removeEventListener(
            "abort",
            abortIterable
          );
          enqueueFlush(request);
          callOnAllReadyIfReady(request);
        } else
          try {
            streamTask.model = entry.value, request.pendingChunks++, tryStreamTask(request, streamTask), enqueueFlush(request), iterator.next().then(progress, error);
          } catch (x$12) {
            error(x$12);
          }
    }
    function error(reason) {
      0 === streamTask.status && (request.cacheController.signal.removeEventListener(
        "abort",
        abortIterable
      ), erroredTask(request, streamTask, reason), enqueueFlush(request), "function" === typeof iterator.throw && iterator.throw(reason).then(error, error));
    }
    function abortIterable() {
      if (0 === streamTask.status) {
        var signal = request.cacheController.signal;
        signal.removeEventListener("abort", abortIterable);
        var reason = signal.reason;
        21 === request.type ? (request.abortableTasks.delete(streamTask), haltTask(streamTask), finishHaltedTask(streamTask, request)) : (erroredTask(request, streamTask, signal.reason), enqueueFlush(request));
        "function" === typeof iterator.throw && iterator.throw(reason).then(error, error);
      }
    }
    iterable = iterable === iterator;
    var streamTask = createTask(
      request,
      task.model,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    request.pendingChunks++;
    task = streamTask.id.toString(16) + ":" + (iterable ? "x" : "X") + "\n";
    request.completedRegularChunks.push(stringToChunk(task));
    request.cacheController.signal.addEventListener("abort", abortIterable);
    iterator.next().then(progress, error);
    return serializeByValueID(streamTask.id);
  }
  function emitHint(request, code, model) {
    model = stringify(model);
    code = stringToChunk(":H" + code + model + "\n");
    request.completedHintChunks.push(code);
    enqueueFlush(request);
  }
  function readThenable(thenable) {
    if ("fulfilled" === thenable.status) return thenable.value;
    if ("rejected" === thenable.status) throw thenable.reason;
    throw thenable;
  }
  function createLazyWrapperAroundWakeable(request, task, wakeable) {
    switch (wakeable.status) {
      case "fulfilled":
        return wakeable.value;
      case "rejected":
        break;
      default:
        "string" !== typeof wakeable.status && (wakeable.status = "pending", wakeable.then(
          function(fulfilledValue) {
            "pending" === wakeable.status && (wakeable.status = "fulfilled", wakeable.value = fulfilledValue);
          },
          function(error) {
            "pending" === wakeable.status && (wakeable.status = "rejected", wakeable.reason = error);
          }
        ));
    }
    return { $$typeof: REACT_LAZY_TYPE, _payload: wakeable, _init: readThenable };
  }
  function voidHandler() {
  }
  function processServerComponentReturnValue(request, task, Component, result) {
    if ("object" !== typeof result || null === result || result.$$typeof === CLIENT_REFERENCE_TAG$1)
      return result;
    if ("function" === typeof result.then)
      return createLazyWrapperAroundWakeable(request, task, result);
    var iteratorFn = getIteratorFn(result);
    return iteratorFn ? (request = {}, request[Symbol.iterator] = function() {
      return iteratorFn.call(result);
    }, request) : "function" !== typeof result[ASYNC_ITERATOR] || "function" === typeof ReadableStream && result instanceof ReadableStream ? result : (request = {}, request[ASYNC_ITERATOR] = function() {
      return result[ASYNC_ITERATOR]();
    }, request);
  }
  function renderFunctionComponent(request, task, key, Component, props) {
    var prevThenableState = task.thenableState;
    task.thenableState = null;
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    props = Component(props, void 0);
    if (12 === request.status)
      throw "object" === typeof props && null !== props && "function" === typeof props.then && props.$$typeof !== CLIENT_REFERENCE_TAG$1 && props.then(voidHandler, voidHandler), null;
    props = processServerComponentReturnValue(request, task, Component, props);
    Component = task.keyPath;
    prevThenableState = task.implicitSlot;
    null !== key ? task.keyPath = null === Component ? key : Component + "," + key : null === Component && (task.implicitSlot = true);
    request = renderModelDestructive(request, task, emptyRoot, "", props);
    task.keyPath = Component;
    task.implicitSlot = prevThenableState;
    return request;
  }
  function renderFragment(request, task, children) {
    return null !== task.keyPath ? (request = [
      REACT_ELEMENT_TYPE,
      REACT_FRAGMENT_TYPE,
      task.keyPath,
      { children }
    ], task.implicitSlot ? [request] : request) : children;
  }
  var serializedSize = 0;
  function deferTask(request, task) {
    task = createTask(
      request,
      task.model,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    pingTask(request, task);
    return serializeLazyID(task.id);
  }
  function renderElement(request, task, type, key, ref, props) {
    if (null !== ref && void 0 !== ref)
      throw Error(
        "Refs cannot be used in Server Components, nor passed to Client Components."
      );
    if ("function" === typeof type && type.$$typeof !== CLIENT_REFERENCE_TAG$1 && type.$$typeof !== TEMPORARY_REFERENCE_TAG)
      return renderFunctionComponent(request, task, key, type, props);
    if (type === REACT_FRAGMENT_TYPE && null === key)
      return type = task.implicitSlot, null === task.keyPath && (task.implicitSlot = true), props = renderModelDestructive(
        request,
        task,
        emptyRoot,
        "",
        props.children
      ), task.implicitSlot = type, props;
    if (null != type && "object" === typeof type && type.$$typeof !== CLIENT_REFERENCE_TAG$1)
      switch (type.$$typeof) {
        case REACT_LAZY_TYPE:
          var init2 = type._init;
          type = init2(type._payload);
          if (12 === request.status) throw null;
          return renderElement(request, task, type, key, ref, props);
        case REACT_FORWARD_REF_TYPE:
          return renderFunctionComponent(request, task, key, type.render, props);
        case REACT_MEMO_TYPE:
          return renderElement(request, task, type.type, key, ref, props);
      }
    else
      "string" === typeof type && (ref = task.formatContext, init2 = getChildFormatContext(ref, type, props), ref !== init2 && null != props.children && outlineModelWithFormatContext(request, props.children, init2));
    request = key;
    key = task.keyPath;
    null === request ? request = key : null !== key && (request = key + "," + request);
    props = [REACT_ELEMENT_TYPE, type, request, props];
    task = task.implicitSlot && null !== request ? [props] : props;
    return task;
  }
  function pingTask(request, task) {
    var pingedTasks = request.pingedTasks;
    pingedTasks.push(task);
    1 === pingedTasks.length && (request.flushScheduled = null !== request.destination, 21 === request.type || 10 === request.status ? scheduleMicrotask(function() {
      return performWork(request);
    }) : setTimeout(function() {
      return performWork(request);
    }, 0));
  }
  function createTask(request, model, keyPath, implicitSlot, formatContext, abortSet) {
    request.pendingChunks++;
    var id = request.nextChunkId++;
    "object" !== typeof model || null === model || null !== keyPath || implicitSlot || request.writtenObjects.set(model, serializeByValueID(id));
    var task = {
      id,
      status: 0,
      model,
      keyPath,
      implicitSlot,
      formatContext,
      ping: function() {
        return pingTask(request, task);
      },
      toJSON: function(parentPropertyName, value) {
        serializedSize += parentPropertyName.length;
        var prevKeyPath = task.keyPath, prevImplicitSlot = task.implicitSlot;
        try {
          var JSCompiler_inline_result = renderModelDestructive(
            request,
            task,
            this,
            parentPropertyName,
            value
          );
        } catch (thrownValue) {
          if (parentPropertyName = task.model, parentPropertyName = "object" === typeof parentPropertyName && null !== parentPropertyName && (parentPropertyName.$$typeof === REACT_ELEMENT_TYPE || parentPropertyName.$$typeof === REACT_LAZY_TYPE), 12 === request.status)
            task.status = 3, 21 === request.type ? (prevKeyPath = request.nextChunkId++, prevKeyPath = parentPropertyName ? serializeLazyID(prevKeyPath) : serializeByValueID(prevKeyPath), JSCompiler_inline_result = prevKeyPath) : (prevKeyPath = request.fatalError, JSCompiler_inline_result = parentPropertyName ? serializeLazyID(prevKeyPath) : serializeByValueID(prevKeyPath));
          else if (value = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, "object" === typeof value && null !== value && "function" === typeof value.then) {
            JSCompiler_inline_result = createTask(
              request,
              task.model,
              task.keyPath,
              task.implicitSlot,
              task.formatContext,
              request.abortableTasks
            );
            var ping = JSCompiler_inline_result.ping;
            value.then(ping, ping);
            JSCompiler_inline_result.thenableState = getThenableStateAfterSuspending();
            task.keyPath = prevKeyPath;
            task.implicitSlot = prevImplicitSlot;
            JSCompiler_inline_result = parentPropertyName ? serializeLazyID(JSCompiler_inline_result.id) : serializeByValueID(JSCompiler_inline_result.id);
          } else
            task.keyPath = prevKeyPath, task.implicitSlot = prevImplicitSlot, request.pendingChunks++, prevKeyPath = request.nextChunkId++, prevImplicitSlot = logRecoverableError(request, value), emitErrorChunk(request, prevKeyPath, prevImplicitSlot), JSCompiler_inline_result = parentPropertyName ? serializeLazyID(prevKeyPath) : serializeByValueID(prevKeyPath);
        }
        return JSCompiler_inline_result;
      },
      thenableState: null
    };
    abortSet.add(task);
    return task;
  }
  function serializeByValueID(id) {
    return "$" + id.toString(16);
  }
  function serializeLazyID(id) {
    return "$L" + id.toString(16);
  }
  function encodeReferenceChunk(request, id, reference) {
    request = stringify(reference);
    id = id.toString(16) + ":" + request + "\n";
    return stringToChunk(id);
  }
  function serializeClientReference(request, parent, parentPropertyName, clientReference) {
    var clientReferenceKey = clientReference.$$async ? clientReference.$$id + "#async" : clientReference.$$id, writtenClientReferences = request.writtenClientReferences, existingId = writtenClientReferences.get(clientReferenceKey);
    if (void 0 !== existingId)
      return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(existingId) : serializeByValueID(existingId);
    try {
      var config = request.bundlerConfig, modulePath = clientReference.$$id;
      existingId = "";
      var resolvedModuleData = config[modulePath];
      if (resolvedModuleData) existingId = resolvedModuleData.name;
      else {
        var idx = modulePath.lastIndexOf("#");
        -1 !== idx && (existingId = modulePath.slice(idx + 1), resolvedModuleData = config[modulePath.slice(0, idx)]);
        if (!resolvedModuleData)
          throw Error(
            'Could not find the module "' + modulePath + '" in the React Client Manifest. This is probably a bug in the React Server Components bundler.'
          );
      }
      if (true === resolvedModuleData.async && true === clientReference.$$async)
        throw Error(
          'The module "' + modulePath + '" is marked as an async ESM module but was loaded as a CJS proxy. This is probably a bug in the React Server Components bundler.'
        );
      var JSCompiler_inline_result = true === resolvedModuleData.async || true === clientReference.$$async ? [resolvedModuleData.id, resolvedModuleData.chunks, existingId, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, existingId];
      request.pendingChunks++;
      var importId = request.nextChunkId++, json = stringify(JSCompiler_inline_result), row = importId.toString(16) + ":I" + json + "\n", processedChunk = stringToChunk(row);
      request.completedImportChunks.push(processedChunk);
      writtenClientReferences.set(clientReferenceKey, importId);
      return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(importId) : serializeByValueID(importId);
    } catch (x) {
      return request.pendingChunks++, parent = request.nextChunkId++, parentPropertyName = logRecoverableError(request, x), emitErrorChunk(request, parent, parentPropertyName), serializeByValueID(parent);
    }
  }
  function outlineModelWithFormatContext(request, value, formatContext) {
    value = createTask(
      request,
      value,
      null,
      false,
      formatContext,
      request.abortableTasks
    );
    retryTask(request, value);
    return value.id;
  }
  function serializeTypedArray(request, tag, typedArray) {
    request.pendingChunks++;
    var bufferId = request.nextChunkId++;
    emitTypedArrayChunk(request, bufferId, tag, typedArray, false);
    return serializeByValueID(bufferId);
  }
  function serializeBlob(request, blob) {
    function progress(entry) {
      if (0 === newTask.status)
        if (entry.done)
          request.cacheController.signal.removeEventListener("abort", abortBlob), pingTask(request, newTask);
        else
          return model.push(entry.value), reader.read().then(progress).catch(error);
    }
    function error(reason) {
      0 === newTask.status && (request.cacheController.signal.removeEventListener("abort", abortBlob), erroredTask(request, newTask, reason), enqueueFlush(request), reader.cancel(reason).then(error, error));
    }
    function abortBlob() {
      if (0 === newTask.status) {
        var signal = request.cacheController.signal;
        signal.removeEventListener("abort", abortBlob);
        signal = signal.reason;
        21 === request.type ? (request.abortableTasks.delete(newTask), haltTask(newTask), finishHaltedTask(newTask, request)) : (erroredTask(request, newTask, signal), enqueueFlush(request));
        reader.cancel(signal).then(error, error);
      }
    }
    var model = [blob.type], newTask = createTask(request, model, null, false, 0, request.abortableTasks), reader = blob.stream().getReader();
    request.cacheController.signal.addEventListener("abort", abortBlob);
    reader.read().then(progress).catch(error);
    return "$B" + newTask.id.toString(16);
  }
  var modelRoot = false;
  function renderModelDestructive(request, task, parent, parentPropertyName, value) {
    task.model = value;
    if (value === REACT_ELEMENT_TYPE) return "$";
    if (null === value) return null;
    if ("object" === typeof value) {
      switch (value.$$typeof) {
        case REACT_ELEMENT_TYPE:
          var elementReference = null, writtenObjects = request.writtenObjects;
          if (null === task.keyPath && !task.implicitSlot) {
            var existingReference = writtenObjects.get(value);
            if (void 0 !== existingReference)
              if (modelRoot === value) modelRoot = null;
              else return existingReference;
            else
              -1 === parentPropertyName.indexOf(":") && (parent = writtenObjects.get(parent), void 0 !== parent && (elementReference = parent + ":" + parentPropertyName, writtenObjects.set(value, elementReference)));
          }
          if (3200 < serializedSize) return deferTask(request, task);
          parentPropertyName = value.props;
          parent = parentPropertyName.ref;
          request = renderElement(
            request,
            task,
            value.type,
            value.key,
            void 0 !== parent ? parent : null,
            parentPropertyName
          );
          "object" === typeof request && null !== request && null !== elementReference && (writtenObjects.has(request) || writtenObjects.set(request, elementReference));
          return request;
        case REACT_LAZY_TYPE:
          if (3200 < serializedSize) return deferTask(request, task);
          task.thenableState = null;
          parentPropertyName = value._init;
          value = parentPropertyName(value._payload);
          if (12 === request.status) throw null;
          return renderModelDestructive(request, task, emptyRoot, "", value);
        case REACT_LEGACY_ELEMENT_TYPE:
          throw Error(
            'A React Element from an older version of React was rendered. This is not supported. It can happen if:\n- Multiple copies of the "react" package is used.\n- A library pre-bundled an old copy of "react" or "react/jsx-runtime".\n- A compiler tries to "inline" JSX instead of using the runtime.'
          );
      }
      if (value.$$typeof === CLIENT_REFERENCE_TAG$1)
        return serializeClientReference(
          request,
          parent,
          parentPropertyName,
          value
        );
      if (void 0 !== request.temporaryReferences && (elementReference = request.temporaryReferences.get(value), void 0 !== elementReference))
        return "$T" + elementReference;
      elementReference = request.writtenObjects;
      writtenObjects = elementReference.get(value);
      if ("function" === typeof value.then) {
        if (void 0 !== writtenObjects) {
          if (null !== task.keyPath || task.implicitSlot)
            return "$@" + serializeThenable(request, task, value).toString(16);
          if (modelRoot === value) modelRoot = null;
          else return writtenObjects;
        }
        request = "$@" + serializeThenable(request, task, value).toString(16);
        elementReference.set(value, request);
        return request;
      }
      if (void 0 !== writtenObjects)
        if (modelRoot === value) {
          if (writtenObjects !== serializeByValueID(task.id))
            return writtenObjects;
          modelRoot = null;
        } else return writtenObjects;
      else if (-1 === parentPropertyName.indexOf(":") && (writtenObjects = elementReference.get(parent), void 0 !== writtenObjects)) {
        existingReference = parentPropertyName;
        if (isArrayImpl(parent) && parent[0] === REACT_ELEMENT_TYPE)
          switch (parentPropertyName) {
            case "1":
              existingReference = "type";
              break;
            case "2":
              existingReference = "key";
              break;
            case "3":
              existingReference = "props";
              break;
            case "4":
              existingReference = "_owner";
          }
        elementReference.set(value, writtenObjects + ":" + existingReference);
      }
      if (isArrayImpl(value)) return renderFragment(request, task, value);
      if (value instanceof Map)
        return value = Array.from(value), "$Q" + outlineModelWithFormatContext(request, value, 0).toString(16);
      if (value instanceof Set)
        return value = Array.from(value), "$W" + outlineModelWithFormatContext(request, value, 0).toString(16);
      if ("function" === typeof FormData && value instanceof FormData)
        return value = Array.from(value.entries()), "$K" + outlineModelWithFormatContext(request, value, 0).toString(16);
      if (value instanceof Error) return "$Z";
      if (value instanceof ArrayBuffer)
        return serializeTypedArray(request, "A", new Uint8Array(value));
      if (value instanceof Int8Array)
        return serializeTypedArray(request, "O", value);
      if (value instanceof Uint8Array)
        return serializeTypedArray(request, "o", value);
      if (value instanceof Uint8ClampedArray)
        return serializeTypedArray(request, "U", value);
      if (value instanceof Int16Array)
        return serializeTypedArray(request, "S", value);
      if (value instanceof Uint16Array)
        return serializeTypedArray(request, "s", value);
      if (value instanceof Int32Array)
        return serializeTypedArray(request, "L", value);
      if (value instanceof Uint32Array)
        return serializeTypedArray(request, "l", value);
      if (value instanceof Float32Array)
        return serializeTypedArray(request, "G", value);
      if (value instanceof Float64Array)
        return serializeTypedArray(request, "g", value);
      if (value instanceof BigInt64Array)
        return serializeTypedArray(request, "M", value);
      if (value instanceof BigUint64Array)
        return serializeTypedArray(request, "m", value);
      if (value instanceof DataView)
        return serializeTypedArray(request, "V", value);
      if ("function" === typeof Blob && value instanceof Blob)
        return serializeBlob(request, value);
      if (elementReference = getIteratorFn(value))
        return parentPropertyName = elementReference.call(value), parentPropertyName === value ? (value = Array.from(parentPropertyName), "$i" + outlineModelWithFormatContext(request, value, 0).toString(16)) : renderFragment(request, task, Array.from(parentPropertyName));
      if ("function" === typeof ReadableStream && value instanceof ReadableStream)
        return serializeReadableStream(request, task, value);
      elementReference = value[ASYNC_ITERATOR];
      if ("function" === typeof elementReference)
        return null !== task.keyPath ? (request = [
          REACT_ELEMENT_TYPE,
          REACT_FRAGMENT_TYPE,
          task.keyPath,
          { children: value }
        ], request = task.implicitSlot ? [request] : request) : (parentPropertyName = elementReference.call(value), request = serializeAsyncIterable(
          request,
          task,
          value,
          parentPropertyName
        )), request;
      if (value instanceof Date) return "$D" + value.toJSON();
      request = getPrototypeOf(value);
      if (request !== ObjectPrototype$1 && (null === request || null !== getPrototypeOf(request)))
        throw Error(
          "Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported." + describeObjectForErrorMessage(parent, parentPropertyName)
        );
      return value;
    }
    if ("string" === typeof value) {
      serializedSize += value.length;
      if ("Z" === value[value.length - 1] && parent[parentPropertyName] instanceof Date)
        return "$D" + value;
      if (1024 <= value.length && null !== byteLengthOfChunk)
        return request.pendingChunks++, task = request.nextChunkId++, emitTextChunk(request, task, value, false), serializeByValueID(task);
      request = "$" === value[0] ? "$" + value : value;
      return request;
    }
    if ("boolean" === typeof value) return value;
    if ("number" === typeof value)
      return Number.isFinite(value) ? 0 === value && -Infinity === 1 / value ? "$-0" : value : Infinity === value ? "$Infinity" : -Infinity === value ? "$-Infinity" : "$NaN";
    if ("undefined" === typeof value) return "$undefined";
    if ("function" === typeof value) {
      if (value.$$typeof === CLIENT_REFERENCE_TAG$1)
        return serializeClientReference(
          request,
          parent,
          parentPropertyName,
          value
        );
      if (value.$$typeof === SERVER_REFERENCE_TAG)
        return task = request.writtenServerReferences, parentPropertyName = task.get(value), void 0 !== parentPropertyName ? request = "$h" + parentPropertyName.toString(16) : (parentPropertyName = value.$$bound, parentPropertyName = null === parentPropertyName ? null : Promise.resolve(parentPropertyName), request = outlineModelWithFormatContext(
          request,
          { id: value.$$id, bound: parentPropertyName },
          0
        ), task.set(value, request), request = "$h" + request.toString(16)), request;
      if (void 0 !== request.temporaryReferences && (request = request.temporaryReferences.get(value), void 0 !== request))
        return "$T" + request;
      if (value.$$typeof === TEMPORARY_REFERENCE_TAG)
        throw Error(
          "Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server."
        );
      if (/^on[A-Z]/.test(parentPropertyName))
        throw Error(
          "Event handlers cannot be passed to Client Component props." + describeObjectForErrorMessage(parent, parentPropertyName) + "\nIf you need interactivity, consider converting part of this to a Client Component."
        );
      throw Error(
        'Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.' + describeObjectForErrorMessage(parent, parentPropertyName)
      );
    }
    if ("symbol" === typeof value) {
      task = request.writtenSymbols;
      elementReference = task.get(value);
      if (void 0 !== elementReference)
        return serializeByValueID(elementReference);
      elementReference = value.description;
      if (Symbol.for(elementReference) !== value)
        throw Error(
          "Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(" + (value.description + ") cannot be found among global symbols.") + describeObjectForErrorMessage(parent, parentPropertyName)
        );
      request.pendingChunks++;
      parentPropertyName = request.nextChunkId++;
      parent = encodeReferenceChunk(
        request,
        parentPropertyName,
        "$S" + elementReference
      );
      request.completedImportChunks.push(parent);
      task.set(value, parentPropertyName);
      return serializeByValueID(parentPropertyName);
    }
    if ("bigint" === typeof value) return "$n" + value.toString(10);
    throw Error(
      "Type " + typeof value + " is not supported in Client Component props." + describeObjectForErrorMessage(parent, parentPropertyName)
    );
  }
  function logRecoverableError(request, error) {
    var prevRequest = currentRequest;
    currentRequest = null;
    try {
      var onError = request.onError;
      var errorDigest = supportsRequestStorage ? requestStorage.run(void 0, onError, error) : onError(error);
    } finally {
      currentRequest = prevRequest;
    }
    if (null != errorDigest && "string" !== typeof errorDigest)
      throw Error(
        'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead'
      );
    return errorDigest || "";
  }
  function fatalError(request, error) {
    var onFatalError = request.onFatalError;
    onFatalError(error);
    null !== request.destination ? (request.status = 14, closeWithError(request.destination, error)) : (request.status = 13, request.fatalError = error);
    request.cacheController.abort(
      Error("The render was aborted due to a fatal error.", { cause: error })
    );
  }
  function emitErrorChunk(request, id, digest) {
    digest = { digest };
    id = id.toString(16) + ":E" + stringify(digest) + "\n";
    id = stringToChunk(id);
    request.completedErrorChunks.push(id);
  }
  function emitModelChunk(request, id, json) {
    id = id.toString(16) + ":" + json + "\n";
    id = stringToChunk(id);
    request.completedRegularChunks.push(id);
  }
  function emitTypedArrayChunk(request, id, tag, typedArray, debug) {
    debug ? request.pendingDebugChunks++ : request.pendingChunks++;
    debug = new Uint8Array(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength
    );
    typedArray = 2048 < typedArray.byteLength ? debug.slice() : debug;
    debug = typedArray.byteLength;
    id = id.toString(16) + ":" + tag + debug.toString(16) + ",";
    id = stringToChunk(id);
    request.completedRegularChunks.push(id, typedArray);
  }
  function emitTextChunk(request, id, text, debug) {
    if (null === byteLengthOfChunk)
      throw Error(
        "Existence of byteLengthOfChunk should have already been checked. This is a bug in React."
      );
    debug ? request.pendingDebugChunks++ : request.pendingChunks++;
    text = stringToChunk(text);
    debug = text.byteLength;
    id = id.toString(16) + ":T" + debug.toString(16) + ",";
    id = stringToChunk(id);
    request.completedRegularChunks.push(id, text);
  }
  function emitChunk(request, task, value) {
    var id = task.id;
    "string" === typeof value && null !== byteLengthOfChunk ? emitTextChunk(request, id, value, false) : value instanceof ArrayBuffer ? emitTypedArrayChunk(request, id, "A", new Uint8Array(value), false) : value instanceof Int8Array ? emitTypedArrayChunk(request, id, "O", value, false) : value instanceof Uint8Array ? emitTypedArrayChunk(request, id, "o", value, false) : value instanceof Uint8ClampedArray ? emitTypedArrayChunk(request, id, "U", value, false) : value instanceof Int16Array ? emitTypedArrayChunk(request, id, "S", value, false) : value instanceof Uint16Array ? emitTypedArrayChunk(request, id, "s", value, false) : value instanceof Int32Array ? emitTypedArrayChunk(request, id, "L", value, false) : value instanceof Uint32Array ? emitTypedArrayChunk(request, id, "l", value, false) : value instanceof Float32Array ? emitTypedArrayChunk(request, id, "G", value, false) : value instanceof Float64Array ? emitTypedArrayChunk(request, id, "g", value, false) : value instanceof BigInt64Array ? emitTypedArrayChunk(request, id, "M", value, false) : value instanceof BigUint64Array ? emitTypedArrayChunk(request, id, "m", value, false) : value instanceof DataView ? emitTypedArrayChunk(request, id, "V", value, false) : (value = stringify(value, task.toJSON), emitModelChunk(request, task.id, value));
  }
  function erroredTask(request, task, error) {
    task.status = 4;
    error = logRecoverableError(request, error);
    emitErrorChunk(request, task.id, error);
    request.abortableTasks.delete(task);
    callOnAllReadyIfReady(request);
  }
  var emptyRoot = {};
  function retryTask(request, task) {
    if (0 === task.status) {
      task.status = 5;
      var parentSerializedSize = serializedSize;
      try {
        modelRoot = task.model;
        var resolvedModel = renderModelDestructive(
          request,
          task,
          emptyRoot,
          "",
          task.model
        );
        modelRoot = resolvedModel;
        task.keyPath = null;
        task.implicitSlot = false;
        if ("object" === typeof resolvedModel && null !== resolvedModel)
          request.writtenObjects.set(resolvedModel, serializeByValueID(task.id)), emitChunk(request, task, resolvedModel);
        else {
          var json = stringify(resolvedModel);
          emitModelChunk(request, task.id, json);
        }
        task.status = 1;
        request.abortableTasks.delete(task);
        callOnAllReadyIfReady(request);
      } catch (thrownValue) {
        if (12 === request.status)
          if (request.abortableTasks.delete(task), task.status = 0, 21 === request.type)
            haltTask(task), finishHaltedTask(task, request);
          else {
            var errorId = request.fatalError;
            abortTask(task);
            finishAbortedTask(task, request, errorId);
          }
        else {
          var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
          if ("object" === typeof x && null !== x && "function" === typeof x.then) {
            task.status = 0;
            task.thenableState = getThenableStateAfterSuspending();
            var ping = task.ping;
            x.then(ping, ping);
          } else erroredTask(request, task, x);
        }
      } finally {
        serializedSize = parentSerializedSize;
      }
    }
  }
  function tryStreamTask(request, task) {
    var parentSerializedSize = serializedSize;
    try {
      emitChunk(request, task, task.model);
    } finally {
      serializedSize = parentSerializedSize;
    }
  }
  function performWork(request) {
    var prevDispatcher = ReactSharedInternalsServer.H;
    ReactSharedInternalsServer.H = HooksDispatcher;
    var prevRequest = currentRequest;
    currentRequest$1 = currentRequest = request;
    try {
      var pingedTasks = request.pingedTasks;
      request.pingedTasks = [];
      for (var i = 0; i < pingedTasks.length; i++)
        retryTask(request, pingedTasks[i]);
      flushCompletedChunks(request);
    } catch (error) {
      logRecoverableError(request, error), fatalError(request, error);
    } finally {
      ReactSharedInternalsServer.H = prevDispatcher, currentRequest$1 = null, currentRequest = prevRequest;
    }
  }
  function abortTask(task) {
    0 === task.status && (task.status = 3);
  }
  function finishAbortedTask(task, request, errorId) {
    3 === task.status && (errorId = serializeByValueID(errorId), task = encodeReferenceChunk(request, task.id, errorId), request.completedErrorChunks.push(task));
  }
  function haltTask(task) {
    0 === task.status && (task.status = 3);
  }
  function finishHaltedTask(task, request) {
    3 === task.status && request.pendingChunks--;
  }
  function flushCompletedChunks(request) {
    var destination = request.destination;
    if (null !== destination) {
      currentView = new Uint8Array(2048);
      writtenBytes = 0;
      try {
        for (var importsChunks = request.completedImportChunks, i = 0; i < importsChunks.length; i++)
          request.pendingChunks--, writeChunkAndReturn(destination, importsChunks[i]);
        importsChunks.splice(0, i);
        var hintChunks = request.completedHintChunks;
        for (i = 0; i < hintChunks.length; i++)
          writeChunkAndReturn(destination, hintChunks[i]);
        hintChunks.splice(0, i);
        var regularChunks = request.completedRegularChunks;
        for (i = 0; i < regularChunks.length; i++)
          request.pendingChunks--, writeChunkAndReturn(destination, regularChunks[i]);
        regularChunks.splice(0, i);
        var errorChunks = request.completedErrorChunks;
        for (i = 0; i < errorChunks.length; i++)
          request.pendingChunks--, writeChunkAndReturn(destination, errorChunks[i]);
        errorChunks.splice(0, i);
      } finally {
        request.flushScheduled = false, currentView && 0 < writtenBytes && (destination.enqueue(
          new Uint8Array(currentView.buffer, 0, writtenBytes)
        ), currentView = null, writtenBytes = 0);
      }
    }
    0 === request.pendingChunks && (12 > request.status && request.cacheController.abort(
      Error(
        "This render completed successfully. All cacheSignals are now aborted to allow clean up of any unused resources."
      )
    ), null !== request.destination && (request.status = 14, request.destination.close(), request.destination = null));
  }
  function startWork(request) {
    request.flushScheduled = null !== request.destination;
    supportsRequestStorage ? scheduleMicrotask(function() {
      requestStorage.run(request, performWork, request);
    }) : scheduleMicrotask(function() {
      return performWork(request);
    });
    setTimeout(function() {
      10 === request.status && (request.status = 11);
    }, 0);
  }
  function enqueueFlush(request) {
    false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination && (request.flushScheduled = true, setTimeout(function() {
      request.flushScheduled = false;
      flushCompletedChunks(request);
    }, 0));
  }
  function callOnAllReadyIfReady(request) {
    0 === request.abortableTasks.size && (request = request.onAllReady, request());
  }
  function startFlowing(request, destination) {
    if (13 === request.status)
      request.status = 14, closeWithError(destination, request.fatalError);
    else if (14 !== request.status && null === request.destination) {
      request.destination = destination;
      try {
        flushCompletedChunks(request);
      } catch (error) {
        logRecoverableError(request, error), fatalError(request, error);
      }
    }
  }
  function finishHalt(request, abortedTasks) {
    try {
      abortedTasks.forEach(function(task) {
        return finishHaltedTask(task, request);
      });
      var onAllReady = request.onAllReady;
      onAllReady();
      flushCompletedChunks(request);
    } catch (error) {
      logRecoverableError(request, error), fatalError(request, error);
    }
  }
  function finishAbort(request, abortedTasks, errorId) {
    try {
      abortedTasks.forEach(function(task) {
        return finishAbortedTask(task, request, errorId);
      });
      var onAllReady = request.onAllReady;
      onAllReady();
      flushCompletedChunks(request);
    } catch (error) {
      logRecoverableError(request, error), fatalError(request, error);
    }
  }
  function abort(request, reason) {
    if (!(11 < request.status))
      try {
        request.status = 12;
        request.cacheController.abort(reason);
        var abortableTasks = request.abortableTasks;
        if (0 < abortableTasks.size)
          if (21 === request.type)
            abortableTasks.forEach(function(task) {
              return haltTask(task, request);
            }), setTimeout(function() {
              return finishHalt(request, abortableTasks);
            }, 0);
          else {
            var error = void 0 === reason ? Error(
              "The render was aborted by the server without a reason."
            ) : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error(
              "The render was aborted by the server with a promise."
            ) : reason, digest = logRecoverableError(request, error, null), errorId = request.nextChunkId++;
            request.fatalError = errorId;
            request.pendingChunks++;
            emitErrorChunk(request, errorId, digest, error, false, null);
            abortableTasks.forEach(function(task) {
              return abortTask(task, request, errorId);
            });
            setTimeout(function() {
              return finishAbort(request, abortableTasks, errorId);
            }, 0);
          }
        else {
          var onAllReady = request.onAllReady;
          onAllReady();
          flushCompletedChunks(request);
        }
      } catch (error$26) {
        logRecoverableError(request, error$26), fatalError(request, error$26);
      }
  }
  function resolveServerReference(bundlerConfig, id) {
    var name = "", resolvedModuleData = bundlerConfig[id];
    if (resolvedModuleData) name = resolvedModuleData.name;
    else {
      var idx = id.lastIndexOf("#");
      -1 !== idx && (name = id.slice(idx + 1), resolvedModuleData = bundlerConfig[id.slice(0, idx)]);
      if (!resolvedModuleData)
        throw Error(
          'Could not find the module "' + id + '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
        );
    }
    return resolvedModuleData.async ? [resolvedModuleData.id, resolvedModuleData.chunks, name, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, name];
  }
  var chunkCache = /* @__PURE__ */ new Map();
  function requireAsyncModule(id) {
    var promise = __vite_rsc_require__(id);
    if ("function" !== typeof promise.then || "fulfilled" === promise.status)
      return null;
    promise.then(
      function(value) {
        promise.status = "fulfilled";
        promise.value = value;
      },
      function(reason) {
        promise.status = "rejected";
        promise.reason = reason;
      }
    );
    return promise;
  }
  function ignoreReject() {
  }
  function preloadModule(metadata2) {
    for (var chunks = metadata2[1], promises = [], i = 0; i < chunks.length; ) {
      var chunkId = chunks[i++];
      chunks[i++];
      var entry = chunkCache.get(chunkId);
      if (void 0 === entry) {
        entry = __webpack_chunk_load__(chunkId);
        promises.push(entry);
        var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
        entry.then(resolve, ignoreReject);
        chunkCache.set(chunkId, entry);
      } else null !== entry && promises.push(entry);
    }
    return 4 === metadata2.length ? 0 === promises.length ? requireAsyncModule(metadata2[0]) : Promise.all(promises).then(function() {
      return requireAsyncModule(metadata2[0]);
    }) : 0 < promises.length ? Promise.all(promises) : null;
  }
  function requireModule2(metadata2) {
    var moduleExports = __vite_rsc_require__(metadata2[0]);
    if (4 === metadata2.length && "function" === typeof moduleExports.then)
      if ("fulfilled" === moduleExports.status)
        moduleExports = moduleExports.value;
      else throw moduleExports.reason;
    if ("*" === metadata2[2]) return moduleExports;
    if ("" === metadata2[2])
      return moduleExports.__esModule ? moduleExports.default : moduleExports;
    if (hasOwnProperty.call(moduleExports, metadata2[2]))
      return moduleExports[metadata2[2]];
  }
  var RESPONSE_SYMBOL = /* @__PURE__ */ Symbol();
  function ReactPromise(status, value, reason) {
    this.status = status;
    this.value = value;
    this.reason = reason;
  }
  ReactPromise.prototype = Object.create(Promise.prototype);
  ReactPromise.prototype.then = function(resolve, reject) {
    switch (this.status) {
      case "resolved_model":
        initializeModelChunk(this);
    }
    switch (this.status) {
      case "fulfilled":
        if ("function" === typeof resolve) {
          for (var inspectedValue = this.value, cycleProtection = 0, visited = /* @__PURE__ */ new Set(); inspectedValue instanceof ReactPromise; ) {
            cycleProtection++;
            if (inspectedValue === this || visited.has(inspectedValue) || 1e3 < cycleProtection) {
              "function" === typeof reject && reject(Error("Cannot have cyclic thenables."));
              return;
            }
            visited.add(inspectedValue);
            if ("fulfilled" === inspectedValue.status)
              inspectedValue = inspectedValue.value;
            else break;
          }
          resolve(this.value);
        }
        break;
      case "pending":
      case "blocked":
        "function" === typeof resolve && (null === this.value && (this.value = []), this.value.push(resolve));
        "function" === typeof reject && (null === this.reason && (this.reason = []), this.reason.push(reject));
        break;
      default:
        "function" === typeof reject && reject(this.reason);
    }
  };
  var ObjectPrototype = Object.prototype, ArrayPrototype = Array.prototype;
  function wakeChunk(response, listeners, value, chunk) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(value) : fulfillReference(response, listener, value, chunk.reason);
    }
  }
  function rejectChunk(response, listeners, error) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(error) : rejectReference(response, listener.handler, error);
    }
  }
  function triggerErrorOnChunk(response, chunk, error) {
    if ("pending" !== chunk.status && "blocked" !== chunk.status)
      chunk.reason.error(error);
    else {
      var listeners = chunk.reason;
      chunk.status = "rejected";
      chunk.reason = error;
      null !== listeners && rejectChunk(response, listeners, error);
    }
  }
  function createResolvedModelChunk(response, value, id) {
    var $jscomp$compprop2 = {};
    return new ReactPromise(
      "resolved_model",
      value,
      ($jscomp$compprop2.id = id, $jscomp$compprop2[RESPONSE_SYMBOL] = response, $jscomp$compprop2)
    );
  }
  function resolveModelChunk(response, chunk, value, id) {
    if ("pending" !== chunk.status)
      chunk = chunk.reason, "C" === value[0] ? chunk.close("C" === value ? '"$undefined"' : value.slice(1)) : chunk.enqueueModel(value);
    else {
      var resolveListeners = chunk.value, rejectListeners = chunk.reason;
      chunk.status = "resolved_model";
      chunk.value = value;
      value = {};
      chunk.reason = (value.id = id, value[RESPONSE_SYMBOL] = response, value);
      if (null !== resolveListeners)
        switch (initializeModelChunk(chunk), chunk.status) {
          case "fulfilled":
            wakeChunk(response, resolveListeners, chunk.value, chunk);
            break;
          case "blocked":
          case "pending":
            if (chunk.value)
              for (response = 0; response < resolveListeners.length; response++)
                chunk.value.push(resolveListeners[response]);
            else chunk.value = resolveListeners;
            if (chunk.reason) {
              if (rejectListeners)
                for (resolveListeners = 0; resolveListeners < rejectListeners.length; resolveListeners++)
                  chunk.reason.push(rejectListeners[resolveListeners]);
            } else chunk.reason = rejectListeners;
            break;
          case "rejected":
            rejectListeners && rejectChunk(response, rejectListeners, chunk.reason);
        }
    }
  }
  function createResolvedIteratorResultChunk(response, value, done) {
    var $jscomp$compprop4 = {};
    return new ReactPromise(
      "resolved_model",
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
      ($jscomp$compprop4.id = -1, $jscomp$compprop4[RESPONSE_SYMBOL] = response, $jscomp$compprop4)
    );
  }
  function resolveIteratorResultChunk(response, chunk, value, done) {
    resolveModelChunk(
      response,
      chunk,
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
      -1
    );
  }
  function loadServerReference$1(response, metaData, parentObject, key) {
    function reject(error) {
      var rejectListeners = blockedPromise.reason, erroredPromise = blockedPromise;
      erroredPromise.status = "rejected";
      erroredPromise.value = null;
      erroredPromise.reason = error;
      null !== rejectListeners && rejectChunk(response, rejectListeners, error);
      rejectReference(response, handler2, error);
    }
    var id = metaData.id;
    if ("string" !== typeof id || "then" === key) return null;
    var cachedPromise = metaData.$$promise;
    if (void 0 !== cachedPromise) {
      if ("fulfilled" === cachedPromise.status)
        return cachedPromise = cachedPromise.value, "__proto__" === key ? null : parentObject[key] = cachedPromise;
      initializingHandler ? (id = initializingHandler, id.deps++) : id = initializingHandler = { chunk: null, value: null, reason: null, deps: 1, errored: false };
      cachedPromise.then(
        resolveReference.bind(null, response, id, parentObject, key),
        rejectReference.bind(null, response, id)
      );
      return null;
    }
    var blockedPromise = new ReactPromise("blocked", null, null);
    metaData.$$promise = blockedPromise;
    var serverReference = resolveServerReference(response._bundlerConfig, id);
    cachedPromise = metaData.bound;
    if (id = preloadModule(serverReference))
      cachedPromise instanceof ReactPromise && (id = Promise.all([id, cachedPromise]));
    else if (cachedPromise instanceof ReactPromise)
      id = Promise.resolve(cachedPromise);
    else
      return cachedPromise = requireModule2(serverReference), id = blockedPromise, id.status = "fulfilled", id.value = cachedPromise;
    if (initializingHandler) {
      var handler2 = initializingHandler;
      handler2.deps++;
    } else
      handler2 = initializingHandler = {
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    id.then(function() {
      var resolvedValue = requireModule2(serverReference);
      if (metaData.bound) {
        var promiseValue = metaData.bound.value;
        promiseValue = isArrayImpl(promiseValue) ? promiseValue.slice(0) : [];
        if (1e3 < promiseValue.length) {
          reject(
            Error(
              "Server Function has too many bound arguments. Received " + promiseValue.length + " but the limit is 1000."
            )
          );
          return;
        }
        promiseValue.unshift(null);
        resolvedValue = resolvedValue.bind.apply(resolvedValue, promiseValue);
      }
      promiseValue = blockedPromise.value;
      var initializedPromise = blockedPromise;
      initializedPromise.status = "fulfilled";
      initializedPromise.value = resolvedValue;
      initializedPromise.reason = null;
      null !== promiseValue && wakeChunk(response, promiseValue, resolvedValue, initializedPromise);
      resolveReference(response, handler2, parentObject, key, resolvedValue);
    }, reject);
    return null;
  }
  function reviveModel(response, parentObj, parentKey, value, reference, arrayRoot) {
    if ("string" === typeof value)
      return parseModelString(
        response,
        parentObj,
        parentKey,
        value,
        reference,
        arrayRoot
      );
    if ("object" === typeof value && null !== value)
      if (void 0 !== reference && void 0 !== response._temporaryReferences && response._temporaryReferences.set(value, reference), isArrayImpl(value)) {
        if (null === arrayRoot) {
          var childContext = { count: 0, fork: false };
          response._rootArrayContexts.set(value, childContext);
        } else childContext = arrayRoot;
        1 < value.length && (childContext.fork = true);
        bumpArrayCount(childContext, value.length + 1, response);
        for (parentObj = 0; parentObj < value.length; parentObj++)
          value[parentObj] = reviveModel(
            response,
            value,
            "" + parentObj,
            value[parentObj],
            void 0 !== reference ? reference + ":" + parentObj : void 0,
            childContext
          );
      } else
        for (childContext in value)
          hasOwnProperty.call(value, childContext) && ("__proto__" === childContext ? delete value[childContext] : (parentObj = void 0 !== reference && -1 === childContext.indexOf(":") ? reference + ":" + childContext : void 0, parentObj = reviveModel(
            response,
            value,
            childContext,
            value[childContext],
            parentObj,
            null
          ), void 0 !== parentObj ? value[childContext] = parentObj : delete value[childContext]));
    return value;
  }
  function bumpArrayCount(arrayContext, slots, response) {
    if ((arrayContext.count += slots) > response._arraySizeLimit && arrayContext.fork)
      throw Error(
        "Maximum array nesting exceeded. Large nested arrays can be dangerous. Try adding intermediate objects."
      );
  }
  var initializingHandler = null;
  function initializeModelChunk(chunk) {
    var prevHandler = initializingHandler;
    initializingHandler = null;
    var _chunk$reason = chunk.reason, response = _chunk$reason[RESPONSE_SYMBOL];
    _chunk$reason = _chunk$reason.id;
    _chunk$reason = -1 === _chunk$reason ? void 0 : _chunk$reason.toString(16);
    var resolvedModel = chunk.value;
    chunk.status = "blocked";
    chunk.value = null;
    chunk.reason = null;
    try {
      var rawModel = JSON.parse(resolvedModel);
      resolvedModel = { count: 0, fork: false };
      var value = reviveModel(
        response,
        { "": rawModel },
        "",
        rawModel,
        _chunk$reason,
        resolvedModel
      ), resolveListeners = chunk.value;
      if (null !== resolveListeners)
        for (chunk.value = null, chunk.reason = null, rawModel = 0; rawModel < resolveListeners.length; rawModel++) {
          var listener = resolveListeners[rawModel];
          "function" === typeof listener ? listener(value) : fulfillReference(response, listener, value, resolvedModel);
        }
      if (null !== initializingHandler) {
        if (initializingHandler.errored) throw initializingHandler.reason;
        if (0 < initializingHandler.deps) {
          initializingHandler.value = value;
          initializingHandler.reason = resolvedModel;
          initializingHandler.chunk = chunk;
          return;
        }
      }
      chunk.status = "fulfilled";
      chunk.value = value;
      chunk.reason = resolvedModel;
    } catch (error) {
      chunk.status = "rejected", chunk.reason = error;
    } finally {
      initializingHandler = prevHandler;
    }
  }
  function reportGlobalError(response, error) {
    response._closed = true;
    response._closedReason = error;
    response._chunks.forEach(function(chunk) {
      "pending" === chunk.status ? triggerErrorOnChunk(response, chunk, error) : "fulfilled" === chunk.status && null !== chunk.reason && (chunk = chunk.reason, "function" === typeof chunk.error && chunk.error(error));
    });
  }
  function getChunk(response, id) {
    var chunks = response._chunks, chunk = chunks.get(id);
    chunk || (chunk = response._formData.get(response._prefix + id), chunk = "string" === typeof chunk ? createResolvedModelChunk(response, chunk, id) : response._closed ? new ReactPromise("rejected", null, response._closedReason) : new ReactPromise("pending", null, null), chunks.set(id, chunk));
    return chunk;
  }
  function fulfillReference(response, reference, value, arrayRoot) {
    var handler2 = reference.handler, parentObject = reference.parentObject, key = reference.key, map = reference.map, path = reference.path;
    try {
      for (var localLength = 0, rootArrayContexts = response._rootArrayContexts, i = 1; i < path.length; i++) {
        var name = path[i];
        if ("object" !== typeof value || null === value || getPrototypeOf(value) !== ObjectPrototype && getPrototypeOf(value) !== ArrayPrototype || !hasOwnProperty.call(value, name))
          throw Error("Invalid reference.");
        value = value[name];
        if (isArrayImpl(value))
          localLength = 0, arrayRoot = rootArrayContexts.get(value) || arrayRoot;
        else if (arrayRoot = null, "string" === typeof value)
          localLength = value.length;
        else if ("bigint" === typeof value) {
          var n = Math.abs(Number(value));
          localLength = 0 === n ? 1 : Math.floor(Math.log10(n)) + 1;
        } else localLength = ArrayBuffer.isView(value) ? value.byteLength : 0;
      }
      var resolvedValue = map(response, value, parentObject, key);
      var referenceArrayRoot = reference.arrayRoot;
      null !== referenceArrayRoot && (null !== arrayRoot ? (arrayRoot.fork && (referenceArrayRoot.fork = true), bumpArrayCount(referenceArrayRoot, arrayRoot.count, response)) : 0 < localLength && bumpArrayCount(referenceArrayRoot, localLength, response));
    } catch (error) {
      rejectReference(response, handler2, error);
      return;
    }
    resolveReference(response, handler2, parentObject, key, resolvedValue);
  }
  function resolveReference(response, handler2, parentObject, key, resolvedValue) {
    "__proto__" !== key && (parentObject[key] = resolvedValue);
    "" === key && null === handler2.value && (handler2.value = resolvedValue);
    handler2.deps--;
    0 === handler2.deps && (parentObject = handler2.chunk, null !== parentObject && "blocked" === parentObject.status && (key = parentObject.value, parentObject.status = "fulfilled", parentObject.value = handler2.value, parentObject.reason = handler2.reason, null !== key && wakeChunk(response, key, handler2.value, parentObject)));
  }
  function rejectReference(response, handler2, error) {
    handler2.errored || (handler2.errored = true, handler2.value = null, handler2.reason = error, handler2 = handler2.chunk, null !== handler2 && "blocked" === handler2.status && triggerErrorOnChunk(response, handler2, error));
  }
  function getOutlinedModel(response, reference, parentObject, key, referenceArrayRoot, map) {
    reference = reference.split(":");
    var id = parseInt(reference[0], 16), chunk = getChunk(response, id);
    switch (chunk.status) {
      case "resolved_model":
        initializeModelChunk(chunk);
    }
    switch (chunk.status) {
      case "fulfilled":
        id = chunk.value;
        chunk = chunk.reason;
        for (var localLength = 0, rootArrayContexts = response._rootArrayContexts, i = 1; i < reference.length; i++) {
          localLength = reference[i];
          if ("object" !== typeof id || null === id || getPrototypeOf(id) !== ObjectPrototype && getPrototypeOf(id) !== ArrayPrototype || !hasOwnProperty.call(id, localLength))
            throw Error("Invalid reference.");
          id = id[localLength];
          isArrayImpl(id) ? (localLength = 0, chunk = rootArrayContexts.get(id) || chunk) : (chunk = null, "string" === typeof id ? localLength = id.length : "bigint" === typeof id ? (localLength = Math.abs(Number(id)), localLength = 0 === localLength ? 1 : Math.floor(Math.log10(localLength)) + 1) : localLength = ArrayBuffer.isView(id) ? id.byteLength : 0);
        }
        parentObject = map(response, id, parentObject, key);
        null !== referenceArrayRoot && (null !== chunk ? (chunk.fork && (referenceArrayRoot.fork = true), bumpArrayCount(referenceArrayRoot, chunk.count, response)) : 0 < localLength && bumpArrayCount(referenceArrayRoot, localLength, response));
        return parentObject;
      case "blocked":
        return initializingHandler ? (response = initializingHandler, response.deps++) : response = initializingHandler = { chunk: null, value: null, reason: null, deps: 1, errored: false }, referenceArrayRoot = {
          handler: response,
          parentObject,
          key,
          map,
          path: reference,
          arrayRoot: referenceArrayRoot
        }, null === chunk.value ? chunk.value = [referenceArrayRoot] : chunk.value.push(referenceArrayRoot), null === chunk.reason ? chunk.reason = [referenceArrayRoot] : chunk.reason.push(referenceArrayRoot), null;
      case "pending":
        throw Error("Invalid forward reference.");
      default:
        return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = chunk.reason) : initializingHandler = {
          chunk: null,
          value: null,
          reason: chunk.reason,
          deps: 0,
          errored: true
        }, null;
    }
  }
  function createMap(response, model) {
    if (!isArrayImpl(model)) throw Error("Invalid Map initializer.");
    if (true === model.$$consumed) throw Error("Already initialized Map.");
    response = new Map(model);
    model.$$consumed = true;
    return response;
  }
  function createSet(response, model) {
    if (!isArrayImpl(model)) throw Error("Invalid Set initializer.");
    if (true === model.$$consumed) throw Error("Already initialized Set.");
    response = new Set(model);
    model.$$consumed = true;
    return response;
  }
  function extractIterator(response, model) {
    if (!isArrayImpl(model)) throw Error("Invalid Iterator initializer.");
    if (true === model.$$consumed) throw Error("Already initialized Iterator.");
    response = model[Symbol.iterator]();
    model.$$consumed = true;
    return response;
  }
  function createModel(response, model, parentObject, key) {
    return "then" === key && "function" === typeof model ? null : model;
  }
  function parseTypedArray(response, reference, constructor, bytesPerElement, parentObject, parentKey, referenceArrayRoot) {
    function reject(error) {
      if (!handler2.errored) {
        handler2.errored = true;
        handler2.value = null;
        handler2.reason = error;
        var chunk = handler2.chunk;
        null !== chunk && "blocked" === chunk.status && triggerErrorOnChunk(response, chunk, error);
      }
    }
    reference = parseInt(reference.slice(2), 16);
    var key = response._prefix + reference;
    bytesPerElement = response._chunks;
    if (bytesPerElement.has(reference))
      throw Error("Already initialized typed array.");
    bytesPerElement.set(
      reference,
      new ReactPromise(
        "rejected",
        null,
        Error("Already initialized typed array.")
      )
    );
    reference = response._formData.get(key).arrayBuffer();
    if (initializingHandler) {
      var handler2 = initializingHandler;
      handler2.deps++;
    } else
      handler2 = initializingHandler = {
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    reference.then(function(buffer) {
      try {
        null !== referenceArrayRoot && bumpArrayCount(referenceArrayRoot, buffer.byteLength, response);
        var resolvedValue = constructor === ArrayBuffer ? buffer : new constructor(buffer);
        "__proto__" !== key && (parentObject[parentKey] = resolvedValue);
        "" === parentKey && null === handler2.value && (handler2.value = resolvedValue);
      } catch (x) {
        reject(x);
        return;
      }
      handler2.deps--;
      0 === handler2.deps && (buffer = handler2.chunk, null !== buffer && "blocked" === buffer.status && (resolvedValue = buffer.value, buffer.status = "fulfilled", buffer.value = handler2.value, buffer.reason = null, null !== resolvedValue && wakeChunk(response, resolvedValue, handler2.value, buffer)));
    }, reject);
    return null;
  }
  function resolveStream(response, id, stream, controller) {
    var chunks = response._chunks;
    stream = new ReactPromise("fulfilled", stream, controller);
    chunks.set(id, stream);
    response = response._formData.getAll(response._prefix + id);
    for (id = 0; id < response.length; id++)
      chunks = response[id], "string" === typeof chunks && ("C" === chunks[0] ? controller.close("C" === chunks ? '"$undefined"' : chunks.slice(1)) : controller.enqueueModel(chunks));
  }
  function parseReadableStream(response, reference, type) {
    function enqueue(value) {
      "bytes" !== type || ArrayBuffer.isView(value) ? controller.enqueue(value) : flightController.error(Error("Invalid data for bytes stream."));
    }
    reference = parseInt(reference.slice(2), 16);
    if (response._chunks.has(reference))
      throw Error("Already initialized stream.");
    var controller = null, closed = false, stream = new ReadableStream({
      type,
      start: function(c) {
        controller = c;
      }
    }), previousBlockedChunk = null, flightController = {
      enqueueModel: function(json) {
        if (null === previousBlockedChunk) {
          var chunk = createResolvedModelChunk(response, json, -1);
          initializeModelChunk(chunk);
          "fulfilled" === chunk.status ? enqueue(chunk.value) : (chunk.then(enqueue, flightController.error), previousBlockedChunk = chunk);
        } else {
          chunk = previousBlockedChunk;
          var chunk$31 = new ReactPromise("pending", null, null);
          chunk$31.then(enqueue, flightController.error);
          previousBlockedChunk = chunk$31;
          chunk.then(function() {
            previousBlockedChunk === chunk$31 && (previousBlockedChunk = null);
            resolveModelChunk(response, chunk$31, json, -1);
          });
        }
      },
      close: function() {
        if (!closed)
          if (closed = true, null === previousBlockedChunk)
            controller.close();
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.close();
            });
          }
      },
      error: function(error) {
        if (!closed)
          if (closed = true, null === previousBlockedChunk)
            controller.error(error);
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.error(error);
            });
          }
      }
    };
    resolveStream(response, reference, stream, flightController);
    return stream;
  }
  function FlightIterator(next) {
    this.next = next;
  }
  FlightIterator.prototype = {};
  FlightIterator.prototype[ASYNC_ITERATOR] = function() {
    return this;
  };
  function parseAsyncIterable(response, reference, iterator) {
    reference = parseInt(reference.slice(2), 16);
    if (response._chunks.has(reference))
      throw Error("Already initialized stream.");
    var buffer = [], closed = false, nextWriteIndex = 0, $jscomp$compprop5 = {};
    $jscomp$compprop5 = ($jscomp$compprop5[ASYNC_ITERATOR] = function() {
      var nextReadIndex = 0;
      return new FlightIterator(function(arg) {
        if (void 0 !== arg)
          throw Error(
            "Values cannot be passed to next() of AsyncIterables passed to Client Components."
          );
        if (nextReadIndex === buffer.length) {
          if (closed)
            return new ReactPromise(
              "fulfilled",
              { done: true, value: void 0 },
              null
            );
          buffer[nextReadIndex] = new ReactPromise("pending", null, null);
        }
        return buffer[nextReadIndex++];
      });
    }, $jscomp$compprop5);
    iterator = iterator ? $jscomp$compprop5[ASYNC_ITERATOR]() : $jscomp$compprop5;
    resolveStream(response, reference, iterator, {
      enqueueModel: function(value) {
        nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
          response,
          value,
          false
        ) : resolveIteratorResultChunk(
          response,
          buffer[nextWriteIndex],
          value,
          false
        );
        nextWriteIndex++;
      },
      close: function(value) {
        if (!closed)
          for (closed = true, nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
            response,
            value,
            true
          ) : resolveIteratorResultChunk(
            response,
            buffer[nextWriteIndex],
            value,
            true
          ), nextWriteIndex++; nextWriteIndex < buffer.length; )
            resolveIteratorResultChunk(
              response,
              buffer[nextWriteIndex++],
              '"$undefined"',
              true
            );
      },
      error: function(error) {
        if (!closed)
          for (closed = true, nextWriteIndex === buffer.length && (buffer[nextWriteIndex] = new ReactPromise(
            "pending",
            null,
            null
          )); nextWriteIndex < buffer.length; )
            triggerErrorOnChunk(response, buffer[nextWriteIndex++], error);
      }
    });
    return iterator;
  }
  function parseModelString(response, obj, key, value, reference, arrayRoot) {
    if ("$" === value[0]) {
      switch (value[1]) {
        case "$":
          return null !== arrayRoot && bumpArrayCount(arrayRoot, value.length - 1, response), value.slice(1);
        case "@":
          return obj = parseInt(value.slice(2), 16), getChunk(response, obj);
        case "h":
          return arrayRoot = value.slice(2), getOutlinedModel(
            response,
            arrayRoot,
            obj,
            key,
            null,
            loadServerReference$1
          );
        case "T":
          if (void 0 === reference || void 0 === response._temporaryReferences)
            throw Error(
              "Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server."
            );
          return createTemporaryReference(
            response._temporaryReferences,
            reference
          );
        case "Q":
          return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, createMap);
        case "W":
          return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, createSet);
        case "K":
          obj = value.slice(2);
          obj = response._prefix + obj + "_";
          key = new FormData();
          response = response._formData;
          arrayRoot = Array.from(response.keys());
          for (value = 0; value < arrayRoot.length; value++)
            if (reference = arrayRoot[value], reference.startsWith(obj)) {
              for (var entries = response.getAll(reference), newKey = reference.slice(obj.length), j = 0; j < entries.length; j++)
                key.append(newKey, entries[j]);
              response.delete(reference);
            }
          return key;
        case "i":
          return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, extractIterator);
        case "I":
          return Infinity;
        case "-":
          return "$-0" === value ? -0 : -Infinity;
        case "N":
          return NaN;
        case "u":
          return;
        case "D":
          return new Date(Date.parse(value.slice(2)));
        case "n":
          obj = value.slice(2);
          if (300 < obj.length)
            throw Error(
              "BigInt is too large. Received " + obj.length + " digits but the limit is 300."
            );
          null !== arrayRoot && bumpArrayCount(arrayRoot, obj.length, response);
          return BigInt(obj);
        case "A":
          return parseTypedArray(
            response,
            value,
            ArrayBuffer,
            1,
            obj,
            key,
            arrayRoot
          );
        case "O":
          return parseTypedArray(
            response,
            value,
            Int8Array,
            1,
            obj,
            key,
            arrayRoot
          );
        case "o":
          return parseTypedArray(
            response,
            value,
            Uint8Array,
            1,
            obj,
            key,
            arrayRoot
          );
        case "U":
          return parseTypedArray(
            response,
            value,
            Uint8ClampedArray,
            1,
            obj,
            key,
            arrayRoot
          );
        case "S":
          return parseTypedArray(
            response,
            value,
            Int16Array,
            2,
            obj,
            key,
            arrayRoot
          );
        case "s":
          return parseTypedArray(
            response,
            value,
            Uint16Array,
            2,
            obj,
            key,
            arrayRoot
          );
        case "L":
          return parseTypedArray(
            response,
            value,
            Int32Array,
            4,
            obj,
            key,
            arrayRoot
          );
        case "l":
          return parseTypedArray(
            response,
            value,
            Uint32Array,
            4,
            obj,
            key,
            arrayRoot
          );
        case "G":
          return parseTypedArray(
            response,
            value,
            Float32Array,
            4,
            obj,
            key,
            arrayRoot
          );
        case "g":
          return parseTypedArray(
            response,
            value,
            Float64Array,
            8,
            obj,
            key,
            arrayRoot
          );
        case "M":
          return parseTypedArray(
            response,
            value,
            BigInt64Array,
            8,
            obj,
            key,
            arrayRoot
          );
        case "m":
          return parseTypedArray(
            response,
            value,
            BigUint64Array,
            8,
            obj,
            key,
            arrayRoot
          );
        case "V":
          return parseTypedArray(
            response,
            value,
            DataView,
            1,
            obj,
            key,
            arrayRoot
          );
        case "B":
          return obj = parseInt(value.slice(2), 16), response._formData.get(response._prefix + obj);
        case "R":
          return parseReadableStream(response, value, void 0);
        case "r":
          return parseReadableStream(response, value, "bytes");
        case "X":
          return parseAsyncIterable(response, value, false);
        case "x":
          return parseAsyncIterable(response, value, true);
      }
      value = value.slice(1);
      return getOutlinedModel(response, value, obj, key, arrayRoot, createModel);
    }
    null !== arrayRoot && bumpArrayCount(arrayRoot, value.length, response);
    return value;
  }
  function createResponse(bundlerConfig, formFieldPrefix, temporaryReferences) {
    var backingFormData = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : new FormData(), arraySizeLimit = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1e6, chunks = /* @__PURE__ */ new Map();
    return {
      _bundlerConfig: bundlerConfig,
      _prefix: formFieldPrefix,
      _formData: backingFormData,
      _chunks: chunks,
      _closed: false,
      _closedReason: null,
      _temporaryReferences: temporaryReferences,
      _rootArrayContexts: /* @__PURE__ */ new WeakMap(),
      _arraySizeLimit: arraySizeLimit
    };
  }
  function close(response) {
    reportGlobalError(response, Error("Connection closed."));
  }
  function loadServerReference(bundlerConfig, metaData) {
    var id = metaData.id;
    if ("string" !== typeof id) return null;
    var serverReference = resolveServerReference(bundlerConfig, id);
    bundlerConfig = preloadModule(serverReference);
    metaData = metaData.bound;
    return metaData instanceof Promise ? Promise.all([metaData, bundlerConfig]).then(function(_ref) {
      _ref = _ref[0];
      var fn = requireModule2(serverReference);
      if (1e3 < _ref.length)
        throw Error(
          "Server Function has too many bound arguments. Received " + _ref.length + " but the limit is 1000."
        );
      return fn.bind.apply(fn, [null].concat(_ref));
    }) : bundlerConfig ? Promise.resolve(bundlerConfig).then(function() {
      return requireModule2(serverReference);
    }) : Promise.resolve(requireModule2(serverReference));
  }
  function decodeBoundActionMetaData(body, serverManifest, formFieldPrefix, arraySizeLimit) {
    body = createResponse(
      serverManifest,
      formFieldPrefix,
      void 0,
      body,
      arraySizeLimit
    );
    close(body);
    body = getChunk(body, 0);
    body.then(function() {
    });
    if ("fulfilled" !== body.status) throw body.reason;
    return body.value;
  }
  reactServerDomWebpackServer_edge_production.createClientModuleProxy = function(moduleId) {
    moduleId = registerClientReferenceImpl({}, moduleId, false);
    return new Proxy(moduleId, proxyHandlers$1);
  };
  reactServerDomWebpackServer_edge_production.createTemporaryReferenceSet = function() {
    return /* @__PURE__ */ new WeakMap();
  };
  reactServerDomWebpackServer_edge_production.decodeAction = function(body, serverManifest) {
    var formData = new FormData(), action = null, seenActions = /* @__PURE__ */ new Set();
    body.forEach(function(value, key) {
      key.startsWith("$ACTION_") ? key.startsWith("$ACTION_REF_") ? seenActions.has(key) || (seenActions.add(key), value = "$ACTION_" + key.slice(12) + ":", value = decodeBoundActionMetaData(body, serverManifest, value), action = loadServerReference(serverManifest, value)) : key.startsWith("$ACTION_ID_") && !seenActions.has(key) && (seenActions.add(key), value = key.slice(11), action = loadServerReference(serverManifest, {
        id: value,
        bound: null
      })) : formData.append(key, value);
    });
    return null === action ? null : action.then(function(fn) {
      return fn.bind(null, formData);
    });
  };
  reactServerDomWebpackServer_edge_production.decodeFormState = function(actionResult, body, serverManifest) {
    var keyPath = body.get("$ACTION_KEY");
    if ("string" !== typeof keyPath) return Promise.resolve(null);
    var metaData = null;
    body.forEach(function(value, key) {
      key.startsWith("$ACTION_REF_") && (value = "$ACTION_" + key.slice(12) + ":", metaData = decodeBoundActionMetaData(body, serverManifest, value));
    });
    if (null === metaData) return Promise.resolve(null);
    var referenceId = metaData.id;
    return Promise.resolve(metaData.bound).then(function(bound) {
      return null === bound ? null : [actionResult, keyPath, referenceId, bound.length - 1];
    });
  };
  reactServerDomWebpackServer_edge_production.decodeReply = function(body, webpackMap, options) {
    if ("string" === typeof body) {
      var form = new FormData();
      form.append("0", body);
      body = form;
    }
    body = createResponse(
      webpackMap,
      "",
      options ? options.temporaryReferences : void 0,
      body,
      options ? options.arraySizeLimit : void 0
    );
    webpackMap = getChunk(body, 0);
    close(body);
    return webpackMap;
  };
  reactServerDomWebpackServer_edge_production.decodeReplyFromAsyncIterable = function(iterable, webpackMap, options) {
    function progress(entry) {
      if (entry.done) close(response);
      else {
        entry = entry.value;
        var name = entry[0];
        entry = entry[1];
        if ("string" === typeof entry) {
          response._formData.append(name, entry);
          var prefix = response._prefix;
          if (name.startsWith(prefix)) {
            var chunks = response._chunks;
            name = +name.slice(prefix.length);
            (chunks = chunks.get(name)) && resolveModelChunk(response, chunks, entry, name);
          }
        } else response._formData.append(name, entry);
        iterator.next().then(progress, error);
      }
    }
    function error(reason) {
      reportGlobalError(response, reason);
      "function" === typeof iterator.throw && iterator.throw(reason).then(error, error);
    }
    var iterator = iterable[ASYNC_ITERATOR](), response = createResponse(
      webpackMap,
      "",
      options ? options.temporaryReferences : void 0,
      void 0,
      options ? options.arraySizeLimit : void 0
    );
    iterator.next().then(progress, error);
    return getChunk(response, 0);
  };
  reactServerDomWebpackServer_edge_production.prerender = function(model, webpackMap, options) {
    return new Promise(function(resolve, reject) {
      var request = new RequestInstance(
        21,
        model,
        webpackMap,
        options ? options.onError : void 0,
        options ? options.onPostpone : void 0,
        function() {
          var stream = new ReadableStream(
            {
              type: "bytes",
              pull: function(controller) {
                startFlowing(request, controller);
              },
              cancel: function(reason) {
                request.destination = null;
                abort(request, reason);
              }
            },
            { highWaterMark: 0 }
          );
          resolve({ prelude: stream });
        },
        reject,
        options ? options.identifierPrefix : void 0,
        options ? options.temporaryReferences : void 0
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function() {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactServerDomWebpackServer_edge_production.registerClientReference = function(proxyImplementation, id, exportName) {
    return registerClientReferenceImpl(
      proxyImplementation,
      id + "#" + exportName,
      false
    );
  };
  reactServerDomWebpackServer_edge_production.registerServerReference = function(reference, id, exportName) {
    return Object.defineProperties(reference, {
      $$typeof: { value: SERVER_REFERENCE_TAG },
      $$id: {
        value: null === exportName ? id : id + "#" + exportName,
        configurable: true
      },
      $$bound: { value: null, configurable: true },
      bind: { value: bind, configurable: true },
      toString: serverReferenceToString
    });
  };
  reactServerDomWebpackServer_edge_production.renderToReadableStream = function(model, webpackMap, options) {
    var request = new RequestInstance(
      20,
      model,
      webpackMap,
      options ? options.onError : void 0,
      options ? options.onPostpone : void 0,
      noop,
      noop,
      options ? options.identifierPrefix : void 0,
      options ? options.temporaryReferences : void 0
    );
    if (options && options.signal) {
      var signal = options.signal;
      if (signal.aborted) abort(request, signal.reason);
      else {
        var listener = function() {
          abort(request, signal.reason);
          signal.removeEventListener("abort", listener);
        };
        signal.addEventListener("abort", listener);
      }
    }
    return new ReadableStream(
      {
        type: "bytes",
        start: function() {
          startWork(request);
        },
        pull: function(controller) {
          startFlowing(request, controller);
        },
        cancel: function(reason) {
          request.destination = null;
          abort(request, reason);
        }
      },
      { highWaterMark: 0 }
    );
  };
  return reactServerDomWebpackServer_edge_production;
}
var hasRequiredServer_edge;
function requireServer_edge() {
  if (hasRequiredServer_edge) return server_edge;
  hasRequiredServer_edge = 1;
  var s;
  {
    s = requireReactServerDomWebpackServer_edge_production();
  }
  server_edge.renderToReadableStream = s.renderToReadableStream;
  server_edge.decodeReply = s.decodeReply;
  server_edge.decodeReplyFromAsyncIterable = s.decodeReplyFromAsyncIterable;
  server_edge.decodeAction = s.decodeAction;
  server_edge.decodeFormState = s.decodeFormState;
  server_edge.registerServerReference = s.registerServerReference;
  server_edge.registerClientReference = s.registerClientReference;
  server_edge.createClientModuleProxy = s.createClientModuleProxy;
  server_edge.createTemporaryReferenceSet = s.createTemporaryReferenceSet;
  return server_edge;
}
var server_edgeExports = requireServer_edge();
let init = false;
let requireModule;
function setRequireModule(options) {
  if (init) return;
  init = true;
  requireModule = (id) => {
    return options.load(removeReferenceCacheTag(id));
  };
  globalThis.__vite_rsc_server_require__ = memoize(async (id) => {
    if (id.startsWith(SERVER_DECODE_CLIENT_PREFIX)) {
      id = id.slice(SERVER_DECODE_CLIENT_PREFIX.length);
      id = removeReferenceCacheTag(id);
      const target = {};
      const getOrCreateClientReference = (name) => {
        return target[name] ??= server_edgeExports.registerClientReference(() => {
          throw new Error(`Unexpectedly client reference export '${name}' is called on server`);
        }, id, name);
      };
      return new Proxy(target, { getOwnPropertyDescriptor(_target, name) {
        if (typeof name !== "string" || name === "then") return Reflect.getOwnPropertyDescriptor(target, name);
        getOrCreateClientReference(name);
        return Reflect.getOwnPropertyDescriptor(target, name);
      } });
    }
    return requireModule(id);
  });
  setInternalRequire();
}
async function loadServerAction(id) {
  const [file, name] = id.split("#");
  return (await requireModule(file))[name];
}
function createServerManifest() {
  const cacheTag = "";
  return new Proxy({}, { get(_target, $$id, _receiver) {
    tinyassert(typeof $$id === "string");
    let [id, name] = $$id.split("#");
    tinyassert(id);
    tinyassert(name);
    return {
      id: SERVER_REFERENCE_PREFIX + id + cacheTag,
      name,
      chunks: [],
      async: true
    };
  } });
}
function createClientManifest(options) {
  const cacheTag = "";
  return new Proxy({}, { get(_target, $$id, _receiver) {
    tinyassert(typeof $$id === "string");
    let [id, name] = $$id.split("#");
    tinyassert(id);
    tinyassert(name);
    options?.onClientReference?.({
      id,
      name
    });
    return {
      id: id + cacheTag,
      name,
      chunks: [],
      async: true
    };
  } });
}
var client_edge = { exports: {} };
var reactServerDomWebpackClient_edge_production = {};
var hasRequiredReactServerDomWebpackClient_edge_production;
function requireReactServerDomWebpackClient_edge_production() {
  if (hasRequiredReactServerDomWebpackClient_edge_production) return reactServerDomWebpackClient_edge_production;
  hasRequiredReactServerDomWebpackClient_edge_production = 1;
  var ReactDOM = requireReactDom_reactServer(), decoderOptions = { stream: true }, hasOwnProperty = Object.prototype.hasOwnProperty;
  function resolveClientReference(bundlerConfig, metadata2) {
    if (bundlerConfig) {
      var moduleExports = bundlerConfig[metadata2[0]];
      if (bundlerConfig = moduleExports && moduleExports[metadata2[2]])
        moduleExports = bundlerConfig.name;
      else {
        bundlerConfig = moduleExports && moduleExports["*"];
        if (!bundlerConfig)
          throw Error(
            'Could not find the module "' + metadata2[0] + '" in the React Server Consumer Manifest. This is probably a bug in the React Server Components bundler.'
          );
        moduleExports = metadata2[2];
      }
      return 4 === metadata2.length ? [bundlerConfig.id, bundlerConfig.chunks, moduleExports, 1] : [bundlerConfig.id, bundlerConfig.chunks, moduleExports];
    }
    return metadata2;
  }
  function resolveServerReference(bundlerConfig, id) {
    var name = "", resolvedModuleData = bundlerConfig[id];
    if (resolvedModuleData) name = resolvedModuleData.name;
    else {
      var idx = id.lastIndexOf("#");
      -1 !== idx && (name = id.slice(idx + 1), resolvedModuleData = bundlerConfig[id.slice(0, idx)]);
      if (!resolvedModuleData)
        throw Error(
          'Could not find the module "' + id + '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
        );
    }
    return resolvedModuleData.async ? [resolvedModuleData.id, resolvedModuleData.chunks, name, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, name];
  }
  var chunkCache = /* @__PURE__ */ new Map();
  function requireAsyncModule(id) {
    var promise = __vite_rsc_require__(id);
    if ("function" !== typeof promise.then || "fulfilled" === promise.status)
      return null;
    promise.then(
      function(value) {
        promise.status = "fulfilled";
        promise.value = value;
      },
      function(reason) {
        promise.status = "rejected";
        promise.reason = reason;
      }
    );
    return promise;
  }
  function ignoreReject() {
  }
  function preloadModule(metadata2) {
    for (var chunks = metadata2[1], promises = [], i = 0; i < chunks.length; ) {
      var chunkId = chunks[i++];
      chunks[i++];
      var entry = chunkCache.get(chunkId);
      if (void 0 === entry) {
        entry = __webpack_chunk_load__(chunkId);
        promises.push(entry);
        var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
        entry.then(resolve, ignoreReject);
        chunkCache.set(chunkId, entry);
      } else null !== entry && promises.push(entry);
    }
    return 4 === metadata2.length ? 0 === promises.length ? requireAsyncModule(metadata2[0]) : Promise.all(promises).then(function() {
      return requireAsyncModule(metadata2[0]);
    }) : 0 < promises.length ? Promise.all(promises) : null;
  }
  function requireModule2(metadata2) {
    var moduleExports = __vite_rsc_require__(metadata2[0]);
    if (4 === metadata2.length && "function" === typeof moduleExports.then)
      if ("fulfilled" === moduleExports.status)
        moduleExports = moduleExports.value;
      else throw moduleExports.reason;
    if ("*" === metadata2[2]) return moduleExports;
    if ("" === metadata2[2])
      return moduleExports.__esModule ? moduleExports.default : moduleExports;
    if (hasOwnProperty.call(moduleExports, metadata2[2]))
      return moduleExports[metadata2[2]];
  }
  function prepareDestinationWithChunks(moduleLoading, chunks, nonce$jscomp$0) {
    if (null !== moduleLoading)
      for (var i = 1; i < chunks.length; i += 2) {
        var nonce = nonce$jscomp$0, JSCompiler_temp_const = ReactDOMSharedInternals.d, JSCompiler_temp_const$jscomp$0 = JSCompiler_temp_const.X, JSCompiler_temp_const$jscomp$1 = moduleLoading.prefix + chunks[i];
        var JSCompiler_inline_result = moduleLoading.crossOrigin;
        JSCompiler_inline_result = "string" === typeof JSCompiler_inline_result ? "use-credentials" === JSCompiler_inline_result ? JSCompiler_inline_result : "" : void 0;
        JSCompiler_temp_const$jscomp$0.call(
          JSCompiler_temp_const,
          JSCompiler_temp_const$jscomp$1,
          { crossOrigin: JSCompiler_inline_result, nonce }
        );
      }
  }
  var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ASYNC_ITERATOR = Symbol.asyncIterator, isArrayImpl = Array.isArray, getPrototypeOf = Object.getPrototypeOf, ObjectPrototype = Object.prototype, knownServerReferences = /* @__PURE__ */ new WeakMap();
  function serializeNumber(number) {
    return Number.isFinite(number) ? 0 === number && -Infinity === 1 / number ? "$-0" : number : Infinity === number ? "$Infinity" : -Infinity === number ? "$-Infinity" : "$NaN";
  }
  function processReply(root, formFieldPrefix, temporaryReferences, resolve, reject) {
    function serializeTypedArray(tag, typedArray) {
      typedArray = new Blob([
        new Uint8Array(
          typedArray.buffer,
          typedArray.byteOffset,
          typedArray.byteLength
        )
      ]);
      var blobId = nextPartId++;
      null === formData && (formData = new FormData());
      formData.append(formFieldPrefix + blobId, typedArray);
      return "$" + tag + blobId.toString(16);
    }
    function serializeBinaryReader(reader) {
      function progress(entry) {
        entry.done ? (entry = nextPartId++, data.append(formFieldPrefix + entry, new Blob(buffer)), data.append(
          formFieldPrefix + streamId,
          '"$o' + entry.toString(16) + '"'
        ), data.append(formFieldPrefix + streamId, "C"), pendingParts--, 0 === pendingParts && resolve(data)) : (buffer.push(entry.value), reader.read(new Uint8Array(1024)).then(progress, reject));
      }
      null === formData && (formData = new FormData());
      var data = formData;
      pendingParts++;
      var streamId = nextPartId++, buffer = [];
      reader.read(new Uint8Array(1024)).then(progress, reject);
      return "$r" + streamId.toString(16);
    }
    function serializeReader(reader) {
      function progress(entry) {
        if (entry.done)
          data.append(formFieldPrefix + streamId, "C"), pendingParts--, 0 === pendingParts && resolve(data);
        else
          try {
            var partJSON = JSON.stringify(entry.value, resolveToJSON);
            data.append(formFieldPrefix + streamId, partJSON);
            reader.read().then(progress, reject);
          } catch (x) {
            reject(x);
          }
      }
      null === formData && (formData = new FormData());
      var data = formData;
      pendingParts++;
      var streamId = nextPartId++;
      reader.read().then(progress, reject);
      return "$R" + streamId.toString(16);
    }
    function serializeReadableStream(stream) {
      try {
        var binaryReader = stream.getReader({ mode: "byob" });
      } catch (x) {
        return serializeReader(stream.getReader());
      }
      return serializeBinaryReader(binaryReader);
    }
    function serializeAsyncIterable(iterable, iterator) {
      function progress(entry) {
        if (entry.done) {
          if (void 0 === entry.value)
            data.append(formFieldPrefix + streamId, "C");
          else
            try {
              var partJSON = JSON.stringify(entry.value, resolveToJSON);
              data.append(formFieldPrefix + streamId, "C" + partJSON);
            } catch (x) {
              reject(x);
              return;
            }
          pendingParts--;
          0 === pendingParts && resolve(data);
        } else
          try {
            var partJSON$21 = JSON.stringify(entry.value, resolveToJSON);
            data.append(formFieldPrefix + streamId, partJSON$21);
            iterator.next().then(progress, reject);
          } catch (x$22) {
            reject(x$22);
          }
      }
      null === formData && (formData = new FormData());
      var data = formData;
      pendingParts++;
      var streamId = nextPartId++;
      iterable = iterable === iterator;
      iterator.next().then(progress, reject);
      return "$" + (iterable ? "x" : "X") + streamId.toString(16);
    }
    function resolveToJSON(key, value) {
      if (null === value) return null;
      if ("object" === typeof value) {
        switch (value.$$typeof) {
          case REACT_ELEMENT_TYPE:
            if (void 0 !== temporaryReferences && -1 === key.indexOf(":")) {
              var parentReference = writtenObjects.get(this);
              if (void 0 !== parentReference)
                return temporaryReferences.set(parentReference + ":" + key, value), "$T";
            }
            throw Error(
              "React Element cannot be passed to Server Functions from the Client without a temporary reference set. Pass a TemporaryReferenceSet to the options."
            );
          case REACT_LAZY_TYPE:
            parentReference = value._payload;
            var init2 = value._init;
            null === formData && (formData = new FormData());
            pendingParts++;
            try {
              var resolvedModel = init2(parentReference), lazyId = nextPartId++, partJSON = serializeModel(resolvedModel, lazyId);
              formData.append(formFieldPrefix + lazyId, partJSON);
              return "$" + lazyId.toString(16);
            } catch (x) {
              if ("object" === typeof x && null !== x && "function" === typeof x.then) {
                pendingParts++;
                var lazyId$23 = nextPartId++;
                parentReference = function() {
                  try {
                    var partJSON$24 = serializeModel(value, lazyId$23), data$25 = formData;
                    data$25.append(formFieldPrefix + lazyId$23, partJSON$24);
                    pendingParts--;
                    0 === pendingParts && resolve(data$25);
                  } catch (reason) {
                    reject(reason);
                  }
                };
                x.then(parentReference, parentReference);
                return "$" + lazyId$23.toString(16);
              }
              reject(x);
              return null;
            } finally {
              pendingParts--;
            }
        }
        parentReference = writtenObjects.get(value);
        if ("function" === typeof value.then) {
          if (void 0 !== parentReference)
            if (modelRoot === value) modelRoot = null;
            else return parentReference;
          null === formData && (formData = new FormData());
          pendingParts++;
          var promiseId = nextPartId++;
          key = "$@" + promiseId.toString(16);
          writtenObjects.set(value, key);
          value.then(function(partValue) {
            try {
              var previousReference = writtenObjects.get(partValue);
              var partJSON$27 = void 0 !== previousReference ? JSON.stringify(previousReference) : serializeModel(partValue, promiseId);
              partValue = formData;
              partValue.append(formFieldPrefix + promiseId, partJSON$27);
              pendingParts--;
              0 === pendingParts && resolve(partValue);
            } catch (reason) {
              reject(reason);
            }
          }, reject);
          return key;
        }
        if (void 0 !== parentReference)
          if (modelRoot === value) modelRoot = null;
          else return parentReference;
        else
          -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference && (key = parentReference + ":" + key, writtenObjects.set(value, key), void 0 !== temporaryReferences && temporaryReferences.set(key, value)));
        if (isArrayImpl(value)) return value;
        if (value instanceof FormData) {
          null === formData && (formData = new FormData());
          var data$31 = formData;
          key = nextPartId++;
          var prefix = formFieldPrefix + key + "_";
          value.forEach(function(originalValue, originalKey) {
            data$31.append(prefix + originalKey, originalValue);
          });
          return "$K" + key.toString(16);
        }
        if (value instanceof Map)
          return key = nextPartId++, parentReference = serializeModel(Array.from(value), key), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$Q" + key.toString(16);
        if (value instanceof Set)
          return key = nextPartId++, parentReference = serializeModel(Array.from(value), key), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$W" + key.toString(16);
        if (value instanceof ArrayBuffer)
          return key = new Blob([value]), parentReference = nextPartId++, null === formData && (formData = new FormData()), formData.append(formFieldPrefix + parentReference, key), "$A" + parentReference.toString(16);
        if (value instanceof Int8Array) return serializeTypedArray("O", value);
        if (value instanceof Uint8Array) return serializeTypedArray("o", value);
        if (value instanceof Uint8ClampedArray)
          return serializeTypedArray("U", value);
        if (value instanceof Int16Array) return serializeTypedArray("S", value);
        if (value instanceof Uint16Array) return serializeTypedArray("s", value);
        if (value instanceof Int32Array) return serializeTypedArray("L", value);
        if (value instanceof Uint32Array) return serializeTypedArray("l", value);
        if (value instanceof Float32Array) return serializeTypedArray("G", value);
        if (value instanceof Float64Array) return serializeTypedArray("g", value);
        if (value instanceof BigInt64Array)
          return serializeTypedArray("M", value);
        if (value instanceof BigUint64Array)
          return serializeTypedArray("m", value);
        if (value instanceof DataView) return serializeTypedArray("V", value);
        if ("function" === typeof Blob && value instanceof Blob)
          return null === formData && (formData = new FormData()), key = nextPartId++, formData.append(formFieldPrefix + key, value), "$B" + key.toString(16);
        if (key = getIteratorFn(value))
          return parentReference = key.call(value), parentReference === value ? (key = nextPartId++, parentReference = serializeModel(
            Array.from(parentReference),
            key
          ), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$i" + key.toString(16)) : Array.from(parentReference);
        if ("function" === typeof ReadableStream && value instanceof ReadableStream)
          return serializeReadableStream(value);
        key = value[ASYNC_ITERATOR];
        if ("function" === typeof key)
          return serializeAsyncIterable(value, key.call(value));
        key = getPrototypeOf(value);
        if (key !== ObjectPrototype && (null === key || null !== getPrototypeOf(key))) {
          if (void 0 === temporaryReferences)
            throw Error(
              "Only plain objects, and a few built-ins, can be passed to Server Functions. Classes or null prototypes are not supported."
            );
          return "$T";
        }
        return value;
      }
      if ("string" === typeof value) {
        if ("Z" === value[value.length - 1] && this[key] instanceof Date)
          return "$D" + value;
        key = "$" === value[0] ? "$" + value : value;
        return key;
      }
      if ("boolean" === typeof value) return value;
      if ("number" === typeof value) return serializeNumber(value);
      if ("undefined" === typeof value) return "$undefined";
      if ("function" === typeof value) {
        parentReference = knownServerReferences.get(value);
        if (void 0 !== parentReference) {
          key = writtenObjects.get(value);
          if (void 0 !== key) return key;
          key = JSON.stringify(
            { id: parentReference.id, bound: parentReference.bound },
            resolveToJSON
          );
          null === formData && (formData = new FormData());
          parentReference = nextPartId++;
          formData.set(formFieldPrefix + parentReference, key);
          key = "$h" + parentReference.toString(16);
          writtenObjects.set(value, key);
          return key;
        }
        if (void 0 !== temporaryReferences && -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference))
          return temporaryReferences.set(parentReference + ":" + key, value), "$T";
        throw Error(
          "Client Functions cannot be passed directly to Server Functions. Only Functions passed from the Server can be passed back again."
        );
      }
      if ("symbol" === typeof value) {
        if (void 0 !== temporaryReferences && -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference))
          return temporaryReferences.set(parentReference + ":" + key, value), "$T";
        throw Error(
          "Symbols cannot be passed to a Server Function without a temporary reference set. Pass a TemporaryReferenceSet to the options."
        );
      }
      if ("bigint" === typeof value) return "$n" + value.toString(10);
      throw Error(
        "Type " + typeof value + " is not supported as an argument to a Server Function."
      );
    }
    function serializeModel(model, id) {
      "object" === typeof model && null !== model && (id = "$" + id.toString(16), writtenObjects.set(model, id), void 0 !== temporaryReferences && temporaryReferences.set(id, model));
      modelRoot = model;
      return JSON.stringify(model, resolveToJSON);
    }
    var nextPartId = 1, pendingParts = 0, formData = null, writtenObjects = /* @__PURE__ */ new WeakMap(), modelRoot = root, json = serializeModel(root, 0);
    null === formData ? resolve(json) : (formData.set(formFieldPrefix + "0", json), 0 === pendingParts && resolve(formData));
    return function() {
      0 < pendingParts && (pendingParts = 0, null === formData ? resolve(json) : resolve(formData));
    };
  }
  var boundCache = /* @__PURE__ */ new WeakMap();
  function encodeFormData(reference) {
    var resolve, reject, thenable = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
    processReply(
      reference,
      "",
      void 0,
      function(body) {
        if ("string" === typeof body) {
          var data = new FormData();
          data.append("0", body);
          body = data;
        }
        thenable.status = "fulfilled";
        thenable.value = body;
        resolve(body);
      },
      function(e) {
        thenable.status = "rejected";
        thenable.reason = e;
        reject(e);
      }
    );
    return thenable;
  }
  function defaultEncodeFormAction(identifierPrefix) {
    var referenceClosure = knownServerReferences.get(this);
    if (!referenceClosure)
      throw Error(
        "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
      );
    var data = null;
    if (null !== referenceClosure.bound) {
      data = boundCache.get(referenceClosure);
      data || (data = encodeFormData({
        id: referenceClosure.id,
        bound: referenceClosure.bound
      }), boundCache.set(referenceClosure, data));
      if ("rejected" === data.status) throw data.reason;
      if ("fulfilled" !== data.status) throw data;
      referenceClosure = data.value;
      var prefixedData = new FormData();
      referenceClosure.forEach(function(value, key) {
        prefixedData.append("$ACTION_" + identifierPrefix + ":" + key, value);
      });
      data = prefixedData;
      referenceClosure = "$ACTION_REF_" + identifierPrefix;
    } else referenceClosure = "$ACTION_ID_" + referenceClosure.id;
    return {
      name: referenceClosure,
      method: "POST",
      encType: "multipart/form-data",
      data
    };
  }
  function isSignatureEqual(referenceId, numberOfBoundArgs) {
    var referenceClosure = knownServerReferences.get(this);
    if (!referenceClosure)
      throw Error(
        "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
      );
    if (referenceClosure.id !== referenceId) return false;
    var boundPromise = referenceClosure.bound;
    if (null === boundPromise) return 0 === numberOfBoundArgs;
    switch (boundPromise.status) {
      case "fulfilled":
        return boundPromise.value.length === numberOfBoundArgs;
      case "pending":
        throw boundPromise;
      case "rejected":
        throw boundPromise.reason;
      default:
        throw "string" !== typeof boundPromise.status && (boundPromise.status = "pending", boundPromise.then(
          function(boundArgs) {
            boundPromise.status = "fulfilled";
            boundPromise.value = boundArgs;
          },
          function(error) {
            boundPromise.status = "rejected";
            boundPromise.reason = error;
          }
        )), boundPromise;
    }
  }
  function registerBoundServerReference(reference, id, bound, encodeFormAction) {
    knownServerReferences.has(reference) || (knownServerReferences.set(reference, {
      id,
      originalBind: reference.bind,
      bound
    }), Object.defineProperties(reference, {
      $$FORM_ACTION: {
        value: void 0 === encodeFormAction ? defaultEncodeFormAction : function() {
          var referenceClosure = knownServerReferences.get(this);
          if (!referenceClosure)
            throw Error(
              "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
            );
          var boundPromise = referenceClosure.bound;
          null === boundPromise && (boundPromise = Promise.resolve([]));
          return encodeFormAction(referenceClosure.id, boundPromise);
        }
      },
      $$IS_SIGNATURE_EQUAL: { value: isSignatureEqual },
      bind: { value: bind }
    }));
  }
  var FunctionBind = Function.prototype.bind, ArraySlice = Array.prototype.slice;
  function bind() {
    var referenceClosure = knownServerReferences.get(this);
    if (!referenceClosure) return FunctionBind.apply(this, arguments);
    var newFn = referenceClosure.originalBind.apply(this, arguments), args = ArraySlice.call(arguments, 1), boundPromise = null;
    boundPromise = null !== referenceClosure.bound ? Promise.resolve(referenceClosure.bound).then(function(boundArgs) {
      return boundArgs.concat(args);
    }) : Promise.resolve(args);
    knownServerReferences.set(newFn, {
      id: referenceClosure.id,
      originalBind: newFn.bind,
      bound: boundPromise
    });
    Object.defineProperties(newFn, {
      $$FORM_ACTION: { value: this.$$FORM_ACTION },
      $$IS_SIGNATURE_EQUAL: { value: isSignatureEqual },
      bind: { value: bind }
    });
    return newFn;
  }
  function createBoundServerReference(metaData, callServer, encodeFormAction) {
    function action() {
      var args = Array.prototype.slice.call(arguments);
      return bound ? "fulfilled" === bound.status ? callServer(id, bound.value.concat(args)) : Promise.resolve(bound).then(function(boundArgs) {
        return callServer(id, boundArgs.concat(args));
      }) : callServer(id, args);
    }
    var id = metaData.id, bound = metaData.bound;
    registerBoundServerReference(action, id, bound, encodeFormAction);
    return action;
  }
  function createServerReference$1(id, callServer, encodeFormAction) {
    function action() {
      var args = Array.prototype.slice.call(arguments);
      return callServer(id, args);
    }
    registerBoundServerReference(action, id, null, encodeFormAction);
    return action;
  }
  function ReactPromise(status, value, reason) {
    this.status = status;
    this.value = value;
    this.reason = reason;
  }
  ReactPromise.prototype = Object.create(Promise.prototype);
  ReactPromise.prototype.then = function(resolve, reject) {
    switch (this.status) {
      case "resolved_model":
        initializeModelChunk(this);
        break;
      case "resolved_module":
        initializeModuleChunk(this);
    }
    switch (this.status) {
      case "fulfilled":
        "function" === typeof resolve && resolve(this.value);
        break;
      case "pending":
      case "blocked":
        "function" === typeof resolve && (null === this.value && (this.value = []), this.value.push(resolve));
        "function" === typeof reject && (null === this.reason && (this.reason = []), this.reason.push(reject));
        break;
      case "halted":
        break;
      default:
        "function" === typeof reject && reject(this.reason);
    }
  };
  function readChunk(chunk) {
    switch (chunk.status) {
      case "resolved_model":
        initializeModelChunk(chunk);
        break;
      case "resolved_module":
        initializeModuleChunk(chunk);
    }
    switch (chunk.status) {
      case "fulfilled":
        return chunk.value;
      case "pending":
      case "blocked":
      case "halted":
        throw chunk;
      default:
        throw chunk.reason;
    }
  }
  function wakeChunk(listeners, value, chunk) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(value) : fulfillReference(listener, value);
    }
  }
  function rejectChunk(listeners, error) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(error) : rejectReference(listener, error);
    }
  }
  function resolveBlockedCycle(resolvedChunk, reference) {
    var referencedChunk = reference.handler.chunk;
    if (null === referencedChunk) return null;
    if (referencedChunk === resolvedChunk) return reference.handler;
    reference = referencedChunk.value;
    if (null !== reference)
      for (referencedChunk = 0; referencedChunk < reference.length; referencedChunk++) {
        var listener = reference[referencedChunk];
        if ("function" !== typeof listener && (listener = resolveBlockedCycle(resolvedChunk, listener), null !== listener))
          return listener;
      }
    return null;
  }
  function wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners) {
    switch (chunk.status) {
      case "fulfilled":
        wakeChunk(resolveListeners, chunk.value);
        break;
      case "blocked":
        for (var i = 0; i < resolveListeners.length; i++) {
          var listener = resolveListeners[i];
          if ("function" !== typeof listener) {
            var cyclicHandler = resolveBlockedCycle(chunk, listener);
            if (null !== cyclicHandler)
              switch (fulfillReference(listener, cyclicHandler.value), resolveListeners.splice(i, 1), i--, null !== rejectListeners && (listener = rejectListeners.indexOf(listener), -1 !== listener && rejectListeners.splice(listener, 1)), chunk.status) {
                case "fulfilled":
                  wakeChunk(resolveListeners, chunk.value);
                  return;
                case "rejected":
                  null !== rejectListeners && rejectChunk(rejectListeners, chunk.reason);
                  return;
              }
          }
        }
      case "pending":
        if (chunk.value)
          for (i = 0; i < resolveListeners.length; i++)
            chunk.value.push(resolveListeners[i]);
        else chunk.value = resolveListeners;
        if (chunk.reason) {
          if (rejectListeners)
            for (resolveListeners = 0; resolveListeners < rejectListeners.length; resolveListeners++)
              chunk.reason.push(rejectListeners[resolveListeners]);
        } else chunk.reason = rejectListeners;
        break;
      case "rejected":
        rejectListeners && rejectChunk(rejectListeners, chunk.reason);
    }
  }
  function triggerErrorOnChunk(response, chunk, error) {
    "pending" !== chunk.status && "blocked" !== chunk.status ? chunk.reason.error(error) : (response = chunk.reason, chunk.status = "rejected", chunk.reason = error, null !== response && rejectChunk(response, error));
  }
  function createResolvedIteratorResultChunk(response, value, done) {
    return new ReactPromise(
      "resolved_model",
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
      response
    );
  }
  function resolveIteratorResultChunk(response, chunk, value, done) {
    resolveModelChunk(
      response,
      chunk,
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}"
    );
  }
  function resolveModelChunk(response, chunk, value) {
    if ("pending" !== chunk.status) chunk.reason.enqueueModel(value);
    else {
      var resolveListeners = chunk.value, rejectListeners = chunk.reason;
      chunk.status = "resolved_model";
      chunk.value = value;
      chunk.reason = response;
      null !== resolveListeners && (initializeModelChunk(chunk), wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners));
    }
  }
  function resolveModuleChunk(response, chunk, value) {
    if ("pending" === chunk.status || "blocked" === chunk.status) {
      response = chunk.value;
      var rejectListeners = chunk.reason;
      chunk.status = "resolved_module";
      chunk.value = value;
      chunk.reason = null;
      null !== response && (initializeModuleChunk(chunk), wakeChunkIfInitialized(chunk, response, rejectListeners));
    }
  }
  var initializingHandler = null;
  function initializeModelChunk(chunk) {
    var prevHandler = initializingHandler;
    initializingHandler = null;
    var resolvedModel = chunk.value, response = chunk.reason;
    chunk.status = "blocked";
    chunk.value = null;
    chunk.reason = null;
    try {
      var value = JSON.parse(resolvedModel, response._fromJSON), resolveListeners = chunk.value;
      if (null !== resolveListeners)
        for (chunk.value = null, chunk.reason = null, resolvedModel = 0; resolvedModel < resolveListeners.length; resolvedModel++) {
          var listener = resolveListeners[resolvedModel];
          "function" === typeof listener ? listener(value) : fulfillReference(listener, value, chunk);
        }
      if (null !== initializingHandler) {
        if (initializingHandler.errored) throw initializingHandler.reason;
        if (0 < initializingHandler.deps) {
          initializingHandler.value = value;
          initializingHandler.chunk = chunk;
          return;
        }
      }
      chunk.status = "fulfilled";
      chunk.value = value;
    } catch (error) {
      chunk.status = "rejected", chunk.reason = error;
    } finally {
      initializingHandler = prevHandler;
    }
  }
  function initializeModuleChunk(chunk) {
    try {
      var value = requireModule2(chunk.value);
      chunk.status = "fulfilled";
      chunk.value = value;
    } catch (error) {
      chunk.status = "rejected", chunk.reason = error;
    }
  }
  function reportGlobalError(weakResponse, error) {
    weakResponse._closed = true;
    weakResponse._closedReason = error;
    weakResponse._chunks.forEach(function(chunk) {
      "pending" === chunk.status ? triggerErrorOnChunk(weakResponse, chunk, error) : "fulfilled" === chunk.status && null !== chunk.reason && chunk.reason.error(error);
    });
  }
  function createLazyChunkWrapper(chunk) {
    return { $$typeof: REACT_LAZY_TYPE, _payload: chunk, _init: readChunk };
  }
  function getChunk(response, id) {
    var chunks = response._chunks, chunk = chunks.get(id);
    chunk || (chunk = response._closed ? new ReactPromise("rejected", null, response._closedReason) : new ReactPromise("pending", null, null), chunks.set(id, chunk));
    return chunk;
  }
  function fulfillReference(reference, value) {
    var response = reference.response, handler2 = reference.handler, parentObject = reference.parentObject, key = reference.key, map = reference.map, path = reference.path;
    try {
      for (var i = 1; i < path.length; i++) {
        for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
          var referencedChunk = value._payload;
          if (referencedChunk === handler2.chunk) value = handler2.value;
          else {
            switch (referencedChunk.status) {
              case "resolved_model":
                initializeModelChunk(referencedChunk);
                break;
              case "resolved_module":
                initializeModuleChunk(referencedChunk);
            }
            switch (referencedChunk.status) {
              case "fulfilled":
                value = referencedChunk.value;
                continue;
              case "blocked":
                var cyclicHandler = resolveBlockedCycle(
                  referencedChunk,
                  reference
                );
                if (null !== cyclicHandler) {
                  value = cyclicHandler.value;
                  continue;
                }
              case "pending":
                path.splice(0, i - 1);
                null === referencedChunk.value ? referencedChunk.value = [reference] : referencedChunk.value.push(reference);
                null === referencedChunk.reason ? referencedChunk.reason = [reference] : referencedChunk.reason.push(reference);
                return;
              case "halted":
                return;
              default:
                rejectReference(reference, referencedChunk.reason);
                return;
            }
          }
        }
        var name = path[i];
        if ("object" === typeof value && null !== value && hasOwnProperty.call(value, name))
          value = value[name];
        else throw Error("Invalid reference.");
      }
      for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
        var referencedChunk$44 = value._payload;
        if (referencedChunk$44 === handler2.chunk) value = handler2.value;
        else {
          switch (referencedChunk$44.status) {
            case "resolved_model":
              initializeModelChunk(referencedChunk$44);
              break;
            case "resolved_module":
              initializeModuleChunk(referencedChunk$44);
          }
          switch (referencedChunk$44.status) {
            case "fulfilled":
              value = referencedChunk$44.value;
              continue;
          }
          break;
        }
      }
      var mappedValue = map(response, value, parentObject, key);
      "__proto__" !== key && (parentObject[key] = mappedValue);
      "" === key && null === handler2.value && (handler2.value = mappedValue);
      if (parentObject[0] === REACT_ELEMENT_TYPE && "object" === typeof handler2.value && null !== handler2.value && handler2.value.$$typeof === REACT_ELEMENT_TYPE) {
        var element = handler2.value;
        switch (key) {
          case "3":
            element.props = mappedValue;
        }
      }
    } catch (error) {
      rejectReference(reference, error);
      return;
    }
    handler2.deps--;
    0 === handler2.deps && (reference = handler2.chunk, null !== reference && "blocked" === reference.status && (value = reference.value, reference.status = "fulfilled", reference.value = handler2.value, reference.reason = handler2.reason, null !== value && wakeChunk(value, handler2.value)));
  }
  function rejectReference(reference, error) {
    var handler2 = reference.handler;
    reference = reference.response;
    handler2.errored || (handler2.errored = true, handler2.value = null, handler2.reason = error, handler2 = handler2.chunk, null !== handler2 && "blocked" === handler2.status && triggerErrorOnChunk(reference, handler2, error));
  }
  function waitForReference(referencedChunk, parentObject, key, response, map, path) {
    if (initializingHandler) {
      var handler2 = initializingHandler;
      handler2.deps++;
    } else
      handler2 = initializingHandler = {
        parent: null,
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    parentObject = {
      response,
      handler: handler2,
      parentObject,
      key,
      map,
      path
    };
    null === referencedChunk.value ? referencedChunk.value = [parentObject] : referencedChunk.value.push(parentObject);
    null === referencedChunk.reason ? referencedChunk.reason = [parentObject] : referencedChunk.reason.push(parentObject);
    return null;
  }
  function loadServerReference(response, metaData, parentObject, key) {
    if (!response._serverReferenceConfig)
      return createBoundServerReference(
        metaData,
        response._callServer,
        response._encodeFormAction
      );
    var serverReference = resolveServerReference(
      response._serverReferenceConfig,
      metaData.id
    ), promise = preloadModule(serverReference);
    if (promise)
      metaData.bound && (promise = Promise.all([promise, metaData.bound]));
    else if (metaData.bound) promise = Promise.resolve(metaData.bound);
    else
      return promise = requireModule2(serverReference), registerBoundServerReference(
        promise,
        metaData.id,
        metaData.bound,
        response._encodeFormAction
      ), promise;
    if (initializingHandler) {
      var handler2 = initializingHandler;
      handler2.deps++;
    } else
      handler2 = initializingHandler = {
        parent: null,
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    promise.then(
      function() {
        var resolvedValue = requireModule2(serverReference);
        if (metaData.bound) {
          var boundArgs = metaData.bound.value.slice(0);
          boundArgs.unshift(null);
          resolvedValue = resolvedValue.bind.apply(resolvedValue, boundArgs);
        }
        registerBoundServerReference(
          resolvedValue,
          metaData.id,
          metaData.bound,
          response._encodeFormAction
        );
        "__proto__" !== key && (parentObject[key] = resolvedValue);
        "" === key && null === handler2.value && (handler2.value = resolvedValue);
        if (parentObject[0] === REACT_ELEMENT_TYPE && "object" === typeof handler2.value && null !== handler2.value && handler2.value.$$typeof === REACT_ELEMENT_TYPE)
          switch (boundArgs = handler2.value, key) {
            case "3":
              boundArgs.props = resolvedValue;
          }
        handler2.deps--;
        0 === handler2.deps && (resolvedValue = handler2.chunk, null !== resolvedValue && "blocked" === resolvedValue.status && (boundArgs = resolvedValue.value, resolvedValue.status = "fulfilled", resolvedValue.value = handler2.value, resolvedValue.reason = null, null !== boundArgs && wakeChunk(boundArgs, handler2.value)));
      },
      function(error) {
        if (!handler2.errored) {
          handler2.errored = true;
          handler2.value = null;
          handler2.reason = error;
          var chunk = handler2.chunk;
          null !== chunk && "blocked" === chunk.status && triggerErrorOnChunk(response, chunk, error);
        }
      }
    );
    return null;
  }
  function getOutlinedModel(response, reference, parentObject, key, map) {
    reference = reference.split(":");
    var id = parseInt(reference[0], 16);
    id = getChunk(response, id);
    switch (id.status) {
      case "resolved_model":
        initializeModelChunk(id);
        break;
      case "resolved_module":
        initializeModuleChunk(id);
    }
    switch (id.status) {
      case "fulfilled":
        id = id.value;
        for (var i = 1; i < reference.length; i++) {
          for (; "object" === typeof id && null !== id && id.$$typeof === REACT_LAZY_TYPE; ) {
            id = id._payload;
            switch (id.status) {
              case "resolved_model":
                initializeModelChunk(id);
                break;
              case "resolved_module":
                initializeModuleChunk(id);
            }
            switch (id.status) {
              case "fulfilled":
                id = id.value;
                break;
              case "blocked":
              case "pending":
                return waitForReference(
                  id,
                  parentObject,
                  key,
                  response,
                  map,
                  reference.slice(i - 1)
                );
              case "halted":
                return initializingHandler ? (response = initializingHandler, response.deps++) : initializingHandler = {
                  parent: null,
                  chunk: null,
                  value: null,
                  reason: null,
                  deps: 1,
                  errored: false
                }, null;
              default:
                return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = id.reason) : initializingHandler = {
                  parent: null,
                  chunk: null,
                  value: null,
                  reason: id.reason,
                  deps: 0,
                  errored: true
                }, null;
            }
          }
          id = id[reference[i]];
        }
        for (; "object" === typeof id && null !== id && id.$$typeof === REACT_LAZY_TYPE; ) {
          reference = id._payload;
          switch (reference.status) {
            case "resolved_model":
              initializeModelChunk(reference);
              break;
            case "resolved_module":
              initializeModuleChunk(reference);
          }
          switch (reference.status) {
            case "fulfilled":
              id = reference.value;
              continue;
          }
          break;
        }
        return map(response, id, parentObject, key);
      case "pending":
      case "blocked":
        return waitForReference(id, parentObject, key, response, map, reference);
      case "halted":
        return initializingHandler ? (response = initializingHandler, response.deps++) : initializingHandler = {
          parent: null,
          chunk: null,
          value: null,
          reason: null,
          deps: 1,
          errored: false
        }, null;
      default:
        return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = id.reason) : initializingHandler = {
          parent: null,
          chunk: null,
          value: null,
          reason: id.reason,
          deps: 0,
          errored: true
        }, null;
    }
  }
  function createMap(response, model) {
    return new Map(model);
  }
  function createSet(response, model) {
    return new Set(model);
  }
  function createBlob(response, model) {
    return new Blob(model.slice(1), { type: model[0] });
  }
  function createFormData(response, model) {
    response = new FormData();
    for (var i = 0; i < model.length; i++)
      response.append(model[i][0], model[i][1]);
    return response;
  }
  function extractIterator(response, model) {
    return model[Symbol.iterator]();
  }
  function createModel(response, model) {
    return model;
  }
  function parseModelString(response, parentObject, key, value) {
    if ("$" === value[0]) {
      if ("$" === value)
        return null !== initializingHandler && "0" === key && (initializingHandler = {
          parent: initializingHandler,
          chunk: null,
          value: null,
          reason: null,
          deps: 0,
          errored: false
        }), REACT_ELEMENT_TYPE;
      switch (value[1]) {
        case "$":
          return value.slice(1);
        case "L":
          return parentObject = parseInt(value.slice(2), 16), response = getChunk(response, parentObject), createLazyChunkWrapper(response);
        case "@":
          return parentObject = parseInt(value.slice(2), 16), getChunk(response, parentObject);
        case "S":
          return Symbol.for(value.slice(2));
        case "h":
          return value = value.slice(2), getOutlinedModel(
            response,
            value,
            parentObject,
            key,
            loadServerReference
          );
        case "T":
          parentObject = "$" + value.slice(2);
          response = response._tempRefs;
          if (null == response)
            throw Error(
              "Missing a temporary reference set but the RSC response returned a temporary reference. Pass a temporaryReference option with the set that was used with the reply."
            );
          return response.get(parentObject);
        case "Q":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createMap);
        case "W":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createSet);
        case "B":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createBlob);
        case "K":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createFormData);
        case "Z":
          return resolveErrorProd();
        case "i":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, extractIterator);
        case "I":
          return Infinity;
        case "-":
          return "$-0" === value ? -0 : -Infinity;
        case "N":
          return NaN;
        case "u":
          return;
        case "D":
          return new Date(Date.parse(value.slice(2)));
        case "n":
          return BigInt(value.slice(2));
        default:
          return value = value.slice(1), getOutlinedModel(response, value, parentObject, key, createModel);
      }
    }
    return value;
  }
  function missingCall() {
    throw Error(
      'Trying to call a function from "use server" but the callServer option was not implemented in your router runtime.'
    );
  }
  function ResponseInstance(bundlerConfig, serverReferenceConfig, moduleLoading, callServer, encodeFormAction, nonce, temporaryReferences) {
    var chunks = /* @__PURE__ */ new Map();
    this._bundlerConfig = bundlerConfig;
    this._serverReferenceConfig = serverReferenceConfig;
    this._moduleLoading = moduleLoading;
    this._callServer = void 0 !== callServer ? callServer : missingCall;
    this._encodeFormAction = encodeFormAction;
    this._nonce = nonce;
    this._chunks = chunks;
    this._stringDecoder = new TextDecoder();
    this._fromJSON = null;
    this._closed = false;
    this._closedReason = null;
    this._tempRefs = temporaryReferences;
    this._fromJSON = createFromJSONCallback(this);
  }
  function resolveBuffer(response, id, buffer) {
    response = response._chunks;
    var chunk = response.get(id);
    chunk && "pending" !== chunk.status ? chunk.reason.enqueueValue(buffer) : (buffer = new ReactPromise("fulfilled", buffer, null), response.set(id, buffer));
  }
  function resolveModule(response, id, model) {
    var chunks = response._chunks, chunk = chunks.get(id);
    model = JSON.parse(model, response._fromJSON);
    var clientReference = resolveClientReference(response._bundlerConfig, model);
    prepareDestinationWithChunks(
      response._moduleLoading,
      model[1],
      response._nonce
    );
    if (model = preloadModule(clientReference)) {
      if (chunk) {
        var blockedChunk = chunk;
        blockedChunk.status = "blocked";
      } else
        blockedChunk = new ReactPromise("blocked", null, null), chunks.set(id, blockedChunk);
      model.then(
        function() {
          return resolveModuleChunk(response, blockedChunk, clientReference);
        },
        function(error) {
          return triggerErrorOnChunk(response, blockedChunk, error);
        }
      );
    } else
      chunk ? resolveModuleChunk(response, chunk, clientReference) : (chunk = new ReactPromise("resolved_module", clientReference, null), chunks.set(id, chunk));
  }
  function resolveStream(response, id, stream, controller) {
    response = response._chunks;
    var chunk = response.get(id);
    chunk ? "pending" === chunk.status && (id = chunk.value, chunk.status = "fulfilled", chunk.value = stream, chunk.reason = controller, null !== id && wakeChunk(id, chunk.value)) : (stream = new ReactPromise("fulfilled", stream, controller), response.set(id, stream));
  }
  function startReadableStream(response, id, type) {
    var controller = null, closed = false;
    type = new ReadableStream({
      type,
      start: function(c) {
        controller = c;
      }
    });
    var previousBlockedChunk = null;
    resolveStream(response, id, type, {
      enqueueValue: function(value) {
        null === previousBlockedChunk ? controller.enqueue(value) : previousBlockedChunk.then(function() {
          controller.enqueue(value);
        });
      },
      enqueueModel: function(json) {
        if (null === previousBlockedChunk) {
          var chunk = new ReactPromise("resolved_model", json, response);
          initializeModelChunk(chunk);
          "fulfilled" === chunk.status ? controller.enqueue(chunk.value) : (chunk.then(
            function(v) {
              return controller.enqueue(v);
            },
            function(e) {
              return controller.error(e);
            }
          ), previousBlockedChunk = chunk);
        } else {
          chunk = previousBlockedChunk;
          var chunk$55 = new ReactPromise("pending", null, null);
          chunk$55.then(
            function(v) {
              return controller.enqueue(v);
            },
            function(e) {
              return controller.error(e);
            }
          );
          previousBlockedChunk = chunk$55;
          chunk.then(function() {
            previousBlockedChunk === chunk$55 && (previousBlockedChunk = null);
            resolveModelChunk(response, chunk$55, json);
          });
        }
      },
      close: function() {
        if (!closed)
          if (closed = true, null === previousBlockedChunk) controller.close();
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.close();
            });
          }
      },
      error: function(error) {
        if (!closed)
          if (closed = true, null === previousBlockedChunk)
            controller.error(error);
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.error(error);
            });
          }
      }
    });
  }
  function asyncIterator() {
    return this;
  }
  function createIterator(next) {
    next = { next };
    next[ASYNC_ITERATOR] = asyncIterator;
    return next;
  }
  function startAsyncIterable(response, id, iterator) {
    var buffer = [], closed = false, nextWriteIndex = 0, iterable = {};
    iterable[ASYNC_ITERATOR] = function() {
      var nextReadIndex = 0;
      return createIterator(function(arg) {
        if (void 0 !== arg)
          throw Error(
            "Values cannot be passed to next() of AsyncIterables passed to Client Components."
          );
        if (nextReadIndex === buffer.length) {
          if (closed)
            return new ReactPromise(
              "fulfilled",
              { done: true, value: void 0 },
              null
            );
          buffer[nextReadIndex] = new ReactPromise("pending", null, null);
        }
        return buffer[nextReadIndex++];
      });
    };
    resolveStream(
      response,
      id,
      iterator ? iterable[ASYNC_ITERATOR]() : iterable,
      {
        enqueueValue: function(value) {
          if (nextWriteIndex === buffer.length)
            buffer[nextWriteIndex] = new ReactPromise(
              "fulfilled",
              { done: false, value },
              null
            );
          else {
            var chunk = buffer[nextWriteIndex], resolveListeners = chunk.value, rejectListeners = chunk.reason;
            chunk.status = "fulfilled";
            chunk.value = { done: false, value };
            chunk.reason = null;
            null !== resolveListeners && wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners);
          }
          nextWriteIndex++;
        },
        enqueueModel: function(value) {
          nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
            response,
            value,
            false
          ) : resolveIteratorResultChunk(
            response,
            buffer[nextWriteIndex],
            value,
            false
          );
          nextWriteIndex++;
        },
        close: function(value) {
          if (!closed)
            for (closed = true, nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
              response,
              value,
              true
            ) : resolveIteratorResultChunk(
              response,
              buffer[nextWriteIndex],
              value,
              true
            ), nextWriteIndex++; nextWriteIndex < buffer.length; )
              resolveIteratorResultChunk(
                response,
                buffer[nextWriteIndex++],
                '"$undefined"',
                true
              );
        },
        error: function(error) {
          if (!closed)
            for (closed = true, nextWriteIndex === buffer.length && (buffer[nextWriteIndex] = new ReactPromise(
              "pending",
              null,
              null
            )); nextWriteIndex < buffer.length; )
              triggerErrorOnChunk(response, buffer[nextWriteIndex++], error);
        }
      }
    );
  }
  function resolveErrorProd() {
    var error = Error(
      "An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error."
    );
    error.stack = "Error: " + error.message;
    return error;
  }
  function mergeBuffer(buffer, lastChunk) {
    for (var l = buffer.length, byteLength = lastChunk.length, i = 0; i < l; i++)
      byteLength += buffer[i].byteLength;
    byteLength = new Uint8Array(byteLength);
    for (var i$56 = i = 0; i$56 < l; i$56++) {
      var chunk = buffer[i$56];
      byteLength.set(chunk, i);
      i += chunk.byteLength;
    }
    byteLength.set(lastChunk, i);
    return byteLength;
  }
  function resolveTypedArray(response, id, buffer, lastChunk, constructor, bytesPerElement) {
    buffer = 0 === buffer.length && 0 === lastChunk.byteOffset % bytesPerElement ? lastChunk : mergeBuffer(buffer, lastChunk);
    constructor = new constructor(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength / bytesPerElement
    );
    resolveBuffer(response, id, constructor);
  }
  function processFullBinaryRow(response, streamState, id, tag, buffer, chunk) {
    switch (tag) {
      case 65:
        resolveBuffer(response, id, mergeBuffer(buffer, chunk).buffer);
        return;
      case 79:
        resolveTypedArray(response, id, buffer, chunk, Int8Array, 1);
        return;
      case 111:
        resolveBuffer(
          response,
          id,
          0 === buffer.length ? chunk : mergeBuffer(buffer, chunk)
        );
        return;
      case 85:
        resolveTypedArray(response, id, buffer, chunk, Uint8ClampedArray, 1);
        return;
      case 83:
        resolveTypedArray(response, id, buffer, chunk, Int16Array, 2);
        return;
      case 115:
        resolveTypedArray(response, id, buffer, chunk, Uint16Array, 2);
        return;
      case 76:
        resolveTypedArray(response, id, buffer, chunk, Int32Array, 4);
        return;
      case 108:
        resolveTypedArray(response, id, buffer, chunk, Uint32Array, 4);
        return;
      case 71:
        resolveTypedArray(response, id, buffer, chunk, Float32Array, 4);
        return;
      case 103:
        resolveTypedArray(response, id, buffer, chunk, Float64Array, 8);
        return;
      case 77:
        resolveTypedArray(response, id, buffer, chunk, BigInt64Array, 8);
        return;
      case 109:
        resolveTypedArray(response, id, buffer, chunk, BigUint64Array, 8);
        return;
      case 86:
        resolveTypedArray(response, id, buffer, chunk, DataView, 1);
        return;
    }
    streamState = response._stringDecoder;
    for (var row = "", i = 0; i < buffer.length; i++)
      row += streamState.decode(buffer[i], decoderOptions);
    buffer = row += streamState.decode(chunk);
    switch (tag) {
      case 73:
        resolveModule(response, id, buffer);
        break;
      case 72:
        id = buffer[0];
        buffer = buffer.slice(1);
        response = JSON.parse(buffer, response._fromJSON);
        buffer = ReactDOMSharedInternals.d;
        switch (id) {
          case "D":
            buffer.D(response);
            break;
          case "C":
            "string" === typeof response ? buffer.C(response) : buffer.C(response[0], response[1]);
            break;
          case "L":
            id = response[0];
            tag = response[1];
            3 === response.length ? buffer.L(id, tag, response[2]) : buffer.L(id, tag);
            break;
          case "m":
            "string" === typeof response ? buffer.m(response) : buffer.m(response[0], response[1]);
            break;
          case "X":
            "string" === typeof response ? buffer.X(response) : buffer.X(response[0], response[1]);
            break;
          case "S":
            "string" === typeof response ? buffer.S(response) : buffer.S(
              response[0],
              0 === response[1] ? void 0 : response[1],
              3 === response.length ? response[2] : void 0
            );
            break;
          case "M":
            "string" === typeof response ? buffer.M(response) : buffer.M(response[0], response[1]);
        }
        break;
      case 69:
        tag = response._chunks;
        chunk = tag.get(id);
        buffer = JSON.parse(buffer);
        streamState = resolveErrorProd();
        streamState.digest = buffer.digest;
        chunk ? triggerErrorOnChunk(response, chunk, streamState) : (response = new ReactPromise("rejected", null, streamState), tag.set(id, response));
        break;
      case 84:
        response = response._chunks;
        (tag = response.get(id)) && "pending" !== tag.status ? tag.reason.enqueueValue(buffer) : (buffer = new ReactPromise("fulfilled", buffer, null), response.set(id, buffer));
        break;
      case 78:
      case 68:
      case 74:
      case 87:
        throw Error(
          "Failed to read a RSC payload created by a development version of React on the server while using a production version on the client. Always use matching versions on the server and the client."
        );
      case 82:
        startReadableStream(response, id, void 0);
        break;
      case 114:
        startReadableStream(response, id, "bytes");
        break;
      case 88:
        startAsyncIterable(response, id, false);
        break;
      case 120:
        startAsyncIterable(response, id, true);
        break;
      case 67:
        (id = response._chunks.get(id)) && "fulfilled" === id.status && id.reason.close("" === buffer ? '"$undefined"' : buffer);
        break;
      default:
        tag = response._chunks, (chunk = tag.get(id)) ? resolveModelChunk(response, chunk, buffer) : (response = new ReactPromise("resolved_model", buffer, response), tag.set(id, response));
    }
  }
  function createFromJSONCallback(response) {
    return function(key, value) {
      if ("__proto__" !== key) {
        if ("string" === typeof value)
          return parseModelString(response, this, key, value);
        if ("object" === typeof value && null !== value) {
          if (value[0] === REACT_ELEMENT_TYPE) {
            if (key = {
              $$typeof: REACT_ELEMENT_TYPE,
              type: value[1],
              key: value[2],
              ref: null,
              props: value[3]
            }, null !== initializingHandler) {
              if (value = initializingHandler, initializingHandler = value.parent, value.errored)
                key = new ReactPromise("rejected", null, value.reason), key = createLazyChunkWrapper(key);
              else if (0 < value.deps) {
                var blockedChunk = new ReactPromise("blocked", null, null);
                value.value = key;
                value.chunk = blockedChunk;
                key = createLazyChunkWrapper(blockedChunk);
              }
            }
          } else key = value;
          return key;
        }
        return value;
      }
    };
  }
  function close(weakResponse) {
    reportGlobalError(weakResponse, Error("Connection closed."));
  }
  function noServerCall() {
    throw Error(
      "Server Functions cannot be called during initial render. This would create a fetch waterfall. Try to use a Server Component to pass data to Client Components instead."
    );
  }
  function createResponseFromOptions(options) {
    return new ResponseInstance(
      options.serverConsumerManifest.moduleMap,
      options.serverConsumerManifest.serverModuleMap,
      options.serverConsumerManifest.moduleLoading,
      noServerCall,
      options.encodeFormAction,
      "string" === typeof options.nonce ? options.nonce : void 0,
      options && options.temporaryReferences ? options.temporaryReferences : void 0
    );
  }
  function startReadingFromStream(response, stream, onDone) {
    function progress(_ref) {
      var value = _ref.value;
      if (_ref.done) return onDone();
      var i = 0, rowState = streamState._rowState;
      _ref = streamState._rowID;
      for (var rowTag = streamState._rowTag, rowLength = streamState._rowLength, buffer = streamState._buffer, chunkLength = value.length; i < chunkLength; ) {
        var lastIdx = -1;
        switch (rowState) {
          case 0:
            lastIdx = value[i++];
            58 === lastIdx ? rowState = 1 : _ref = _ref << 4 | (96 < lastIdx ? lastIdx - 87 : lastIdx - 48);
            continue;
          case 1:
            rowState = value[i];
            84 === rowState || 65 === rowState || 79 === rowState || 111 === rowState || 85 === rowState || 83 === rowState || 115 === rowState || 76 === rowState || 108 === rowState || 71 === rowState || 103 === rowState || 77 === rowState || 109 === rowState || 86 === rowState ? (rowTag = rowState, rowState = 2, i++) : 64 < rowState && 91 > rowState || 35 === rowState || 114 === rowState || 120 === rowState ? (rowTag = rowState, rowState = 3, i++) : (rowTag = 0, rowState = 3);
            continue;
          case 2:
            lastIdx = value[i++];
            44 === lastIdx ? rowState = 4 : rowLength = rowLength << 4 | (96 < lastIdx ? lastIdx - 87 : lastIdx - 48);
            continue;
          case 3:
            lastIdx = value.indexOf(10, i);
            break;
          case 4:
            lastIdx = i + rowLength, lastIdx > value.length && (lastIdx = -1);
        }
        var offset = value.byteOffset + i;
        if (-1 < lastIdx)
          rowLength = new Uint8Array(value.buffer, offset, lastIdx - i), processFullBinaryRow(
            response,
            streamState,
            _ref,
            rowTag,
            buffer,
            rowLength
          ), i = lastIdx, 3 === rowState && i++, rowLength = _ref = rowTag = rowState = 0, buffer.length = 0;
        else {
          value = new Uint8Array(value.buffer, offset, value.byteLength - i);
          buffer.push(value);
          rowLength -= value.byteLength;
          break;
        }
      }
      streamState._rowState = rowState;
      streamState._rowID = _ref;
      streamState._rowTag = rowTag;
      streamState._rowLength = rowLength;
      return reader.read().then(progress).catch(error);
    }
    function error(e) {
      reportGlobalError(response, e);
    }
    var streamState = {
      _rowState: 0,
      _rowID: 0,
      _rowTag: 0,
      _rowLength: 0,
      _buffer: []
    }, reader = stream.getReader();
    reader.read().then(progress).catch(error);
  }
  reactServerDomWebpackClient_edge_production.createFromFetch = function(promiseForResponse, options) {
    var response = createResponseFromOptions(options);
    promiseForResponse.then(
      function(r) {
        startReadingFromStream(response, r.body, close.bind(null, response));
      },
      function(e) {
        reportGlobalError(response, e);
      }
    );
    return getChunk(response, 0);
  };
  reactServerDomWebpackClient_edge_production.createFromReadableStream = function(stream, options) {
    options = createResponseFromOptions(options);
    startReadingFromStream(options, stream, close.bind(null, options));
    return getChunk(options, 0);
  };
  reactServerDomWebpackClient_edge_production.createServerReference = function(id) {
    return createServerReference$1(id, noServerCall);
  };
  reactServerDomWebpackClient_edge_production.createTemporaryReferenceSet = function() {
    return /* @__PURE__ */ new Map();
  };
  reactServerDomWebpackClient_edge_production.encodeReply = function(value, options) {
    return new Promise(function(resolve, reject) {
      var abort = processReply(
        value,
        "",
        options && options.temporaryReferences ? options.temporaryReferences : void 0,
        resolve,
        reject
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(signal.reason);
        else {
          var listener = function() {
            abort(signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
    });
  };
  reactServerDomWebpackClient_edge_production.registerServerReference = function(reference, id, encodeFormAction) {
    registerBoundServerReference(reference, id, null, encodeFormAction);
    return reference;
  };
  return reactServerDomWebpackClient_edge_production;
}
var hasRequiredClient_edge;
function requireClient_edge() {
  if (hasRequiredClient_edge) return client_edge.exports;
  hasRequiredClient_edge = 1;
  {
    client_edge.exports = requireReactServerDomWebpackClient_edge_production();
  }
  return client_edge.exports;
}
requireClient_edge();
function renderToReadableStream$2(data, options, extraOptions) {
  return server_edgeExports.renderToReadableStream(data, createClientManifest({ onClientReference: extraOptions?.onClientReference }), options);
}
function registerClientReference(proxy, id, name) {
  return server_edgeExports.registerClientReference(proxy, id, name);
}
function decodeReply(body, options) {
  return server_edgeExports.decodeReply(body, createServerManifest(), options);
}
const createTemporaryReferenceSet = server_edgeExports.createTemporaryReferenceSet;
const serverReferences = {};
initialize();
function initialize() {
  setRequireModule({ load: async (id) => {
    {
      const import_ = serverReferences[id];
      if (!import_) throw new Error(`server reference not found '${id}'`);
      return import_();
    }
  } });
}
function renderToReadableStream$1(data, options, extraOptions) {
  return renderToReadableStream$2(data, options, { onClientReference(metadata2) {
    assetsManifest.clientReferenceDeps[metadata2.id] ?? {};
  } });
}
var react_reactServerExports = requireReact_reactServer();
const __vite_rsc_react__ = /* @__PURE__ */ getDefaultExportFromCjs(react_reactServerExports);
function hasBasePath(pathname, basePath) {
  return false;
}
function stripBasePath(pathname, basePath) {
  if (!hasBasePath()) return pathname;
  return pathname.slice(basePath.length) || "/";
}
var ReadonlyURLSearchParamsError = class extends Error {
  constructor() {
    super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams");
  }
};
var ReadonlyURLSearchParams = class extends URLSearchParams {
  append(_name, _value) {
    throw new ReadonlyURLSearchParamsError();
  }
  delete(_name, _value) {
    throw new ReadonlyURLSearchParamsError();
  }
  set(_name, _value) {
    throw new ReadonlyURLSearchParamsError();
  }
  sort() {
    throw new ReadonlyURLSearchParamsError();
  }
};
const _SERVER_INSERTED_HTML_CTX_KEY = /* @__PURE__ */ Symbol.for("vinext.serverInsertedHTMLContext");
function getServerInsertedHTMLContext() {
  if (typeof react_reactServerExports.createContext !== "function") return null;
  const globalState = globalThis;
  if (!globalState[_SERVER_INSERTED_HTML_CTX_KEY]) globalState[_SERVER_INSERTED_HTML_CTX_KEY] = react_reactServerExports.createContext(null);
  return globalState[_SERVER_INSERTED_HTML_CTX_KEY] ?? null;
}
getServerInsertedHTMLContext();
let _serverContext = null;
let _getServerContext = () => _serverContext;
let _setServerContext = (ctx) => {
  _serverContext = ctx;
};
function _registerStateAccessors(accessors) {
  _getServerContext = accessors.getServerContext;
  _setServerContext = accessors.setServerContext;
}
function getNavigationContext() {
  return _getServerContext();
}
function setNavigationContext$1(ctx) {
  _setServerContext(ctx);
}
const isServer = typeof window === "undefined";
const __basePath$1 = "";
const _listeners = /* @__PURE__ */ new Set();
function notifyListeners() {
  for (const fn of _listeners) fn();
}
let _cachedSearch = !isServer ? window.location.search : "";
new ReadonlyURLSearchParams(_cachedSearch);
!isServer ? stripBasePath(window.location.pathname, __basePath$1) : "/";
!isServer ? window.history.replaceState.bind(window.history) : null;
function restoreScrollPosition(state) {
  if (state && typeof state === "object" && "__vinext_scrollY" in state) {
    const { __vinext_scrollX: x, __vinext_scrollY: y } = state;
    Promise.resolve().then(() => {
      const pending = window.__VINEXT_RSC_PENDING__ ?? null;
      if (pending) pending.then(() => {
        requestAnimationFrame(() => {
          window.scrollTo(x, y);
        });
      });
      else requestAnimationFrame(() => {
        window.scrollTo(x, y);
      });
    });
  }
}
if (!isServer) {
  window.addEventListener("popstate", (event) => {
    notifyListeners();
    restoreScrollPosition(event.state);
  });
  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  window.history.pushState = function patchedPushState(data, unused, url) {
    originalPushState(data, unused, url);
    notifyListeners();
  };
  window.history.replaceState = function patchedReplaceState(data, unused, url) {
    originalReplaceState(data, unused, url);
    notifyListeners();
  };
}
function parseCookieHeader(cookieHeader) {
  const cookies = /* @__PURE__ */ new Map();
  for (const pair of cookieHeader.split(/; */)) {
    if (!pair) continue;
    const splitAt = pair.indexOf("=");
    if (splitAt === -1) {
      cookies.set(pair, "true");
      continue;
    }
    const key = pair.slice(0, splitAt);
    const value = pair.slice(splitAt + 1);
    try {
      cookies.set(key, decodeURIComponent(value));
    } catch {
    }
  }
  return cookies;
}
const _ALS_KEY$5 = /* @__PURE__ */ Symbol.for("vinext.unifiedRequestContext.als");
const _REQUEST_CONTEXT_ALS_KEY = /* @__PURE__ */ Symbol.for("vinext.requestContext.als");
const _g$7 = globalThis;
const _als$4 = _g$7[_ALS_KEY$5] ??= new AsyncLocalStorage$1();
function _getInheritedExecutionContext() {
  const unifiedStore = _als$4.getStore();
  if (unifiedStore) return unifiedStore.executionContext;
  return _g$7[_REQUEST_CONTEXT_ALS_KEY]?.getStore() ?? null;
}
function createRequestContext(opts) {
  return {
    headersContext: null,
    dynamicUsageDetected: false,
    pendingSetCookies: [],
    draftModeCookieHeader: null,
    phase: "render",
    i18nContext: null,
    serverContext: null,
    serverInsertedHTMLCallbacks: [],
    requestScopedCacheLife: null,
    _privateCache: null,
    currentRequestTags: [],
    executionContext: _getInheritedExecutionContext(),
    ssrContext: null,
    ssrHeadChildren: [],
    ...opts
  };
}
function runWithRequestContext(ctx, fn) {
  return _als$4.run(ctx, fn);
}
function getRequestContext() {
  return _als$4.getStore() ?? createRequestContext();
}
function isInsideUnifiedScope() {
  return _als$4.getStore() != null;
}
const _ALS_KEY$4 = /* @__PURE__ */ Symbol.for("vinext.nextHeadersShim.als");
const _FALLBACK_KEY$3 = /* @__PURE__ */ Symbol.for("vinext.nextHeadersShim.fallback");
const _g$6 = globalThis;
const _als$3 = _g$6[_ALS_KEY$4] ??= new AsyncLocalStorage$1();
const _fallbackState$2 = _g$6[_FALLBACK_KEY$3] ??= {
  headersContext: null,
  dynamicUsageDetected: false,
  pendingSetCookies: [],
  draftModeCookieHeader: null,
  phase: "render"
};
(/* @__PURE__ */ new Date(0)).toUTCString();
function _getState$2() {
  if (isInsideUnifiedScope()) return getRequestContext();
  return _als$3.getStore() ?? _fallbackState$2;
}
function markDynamicUsage() {
  _getState$2().dynamicUsageDetected = true;
}
function consumeDynamicUsage() {
  const state = _getState$2();
  const used = state.dynamicUsageDetected;
  state.dynamicUsageDetected = false;
  return used;
}
function _setStatePhase(state, phase) {
  const previous = state.phase;
  state.phase = phase;
  return previous;
}
function setHeadersAccessPhase(phase) {
  return _setStatePhase(_getState$2(), phase);
}
function getHeadersContext() {
  return _getState$2().headersContext;
}
function setHeadersContext(ctx) {
  const state = _getState$2();
  if (ctx !== null) {
    state.headersContext = ctx;
    state.dynamicUsageDetected = false;
    state.pendingSetCookies = [];
    state.draftModeCookieHeader = null;
    state.phase = "render";
  } else {
    state.headersContext = null;
    state.phase = "render";
  }
}
const _HEADERS_MUTATING_METHODS = /* @__PURE__ */ new Set([
  "set",
  "delete",
  "append"
]);
function headersContextFromRequest(request) {
  let _mutable = null;
  const headersProxy = new Proxy(request.headers, { get(target, prop) {
    const src = _mutable ?? target;
    if (typeof prop === "string" && _HEADERS_MUTATING_METHODS.has(prop)) return (...args) => {
      if (!_mutable) _mutable = new Headers(target);
      return _mutable[prop](...args);
    };
    const value = Reflect.get(src, prop, src);
    return typeof value === "function" ? value.bind(src) : value;
  } });
  let _cookies = null;
  function getCookies() {
    if (_cookies) return _cookies;
    _cookies = parseCookieHeader(headersProxy.get("cookie") || "");
    return _cookies;
  }
  return {
    headers: headersProxy,
    get cookies() {
      return getCookies();
    }
  };
}
function getAndClearPendingCookies() {
  const state = _getState$2();
  const cookies2 = state.pendingSetCookies;
  state.pendingSetCookies = [];
  return cookies2;
}
function getDraftModeCookieHeader() {
  const state = _getState$2();
  const header = state.draftModeCookieHeader;
  state.draftModeCookieHeader = null;
  return header;
}
const _ALS_KEY$3 = /* @__PURE__ */ Symbol.for("vinext.requestContext.als");
const _g$5 = globalThis;
const _als$2 = _g$5[_ALS_KEY$3] ??= new AsyncLocalStorage$1();
function getRequestExecutionContext() {
  if (isInsideUnifiedScope()) return getRequestContext().executionContext;
  return _als$2.getStore() ?? null;
}
var NextRequest = class extends Request {
  _nextUrl;
  _cookies;
  constructor(input, init2) {
    const { nextConfig: _nextConfig, ...requestInit } = init2 ?? {};
    if (input instanceof Request) {
      const req = input;
      super(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        duplex: req.body ? "half" : void 0,
        ...requestInit
      });
    } else super(input, requestInit);
    this._nextUrl = new NextURL(typeof input === "string" ? new URL(input, "http://localhost") : input instanceof URL ? input : new URL(input.url, "http://localhost"), void 0, _nextConfig ? {
      basePath: _nextConfig.basePath,
      nextConfig: { i18n: _nextConfig.i18n }
    } : void 0);
    this._cookies = new RequestCookies(this.headers);
  }
  get nextUrl() {
    return this._nextUrl;
  }
  get cookies() {
    return this._cookies;
  }
  /**
  * Client IP address. Prefers Cloudflare's trusted CF-Connecting-IP header
  * over the spoofable X-Forwarded-For. Returns undefined if unavailable.
  */
  get ip() {
    return this.headers.get("cf-connecting-ip") ?? this.headers.get("x-real-ip") ?? this.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? void 0;
  }
  /**
  * Geolocation data. Platform-dependent (e.g., Cloudflare, Vercel).
  * Returns undefined if not available.
  */
  get geo() {
    const country = this.headers.get("cf-ipcountry") ?? this.headers.get("x-vercel-ip-country") ?? void 0;
    if (!country) return void 0;
    return {
      country,
      city: this.headers.get("cf-ipcity") ?? this.headers.get("x-vercel-ip-city") ?? void 0,
      region: this.headers.get("cf-region") ?? this.headers.get("x-vercel-ip-country-region") ?? void 0,
      latitude: this.headers.get("cf-iplatitude") ?? this.headers.get("x-vercel-ip-latitude") ?? void 0,
      longitude: this.headers.get("cf-iplongitude") ?? this.headers.get("x-vercel-ip-longitude") ?? void 0
    };
  }
  /**
  * The build ID of the Next.js application.
  * Delegates to `nextUrl.buildId` to match Next.js API surface.
  * Can be used in middleware to detect deployment skew between client and server.
  */
  get buildId() {
    return this._nextUrl.buildId;
  }
};
var NextURL = class NextURL2 {
  /** Internal URL stores the pathname WITHOUT basePath or locale prefix. */
  _url;
  _basePath;
  _locale;
  _defaultLocale;
  _locales;
  constructor(input, base, config) {
    this._url = new URL(input.toString(), base);
    this._basePath = config?.basePath ?? "";
    this._stripBasePath();
    const i18n = config?.nextConfig?.i18n;
    if (i18n) {
      this._locales = [...i18n.locales];
      this._defaultLocale = i18n.defaultLocale;
      this._analyzeLocale(this._locales);
    }
  }
  /** Strip basePath prefix from the internal pathname. */
  _stripBasePath() {
    if (!this._basePath) return;
    const { pathname } = this._url;
    if (pathname === this._basePath || pathname.startsWith(this._basePath + "/")) this._url.pathname = pathname.slice(this._basePath.length) || "/";
  }
  /** Extract locale from pathname, stripping it from the internal URL. */
  _analyzeLocale(locales) {
    const segments = this._url.pathname.split("/");
    const candidate = segments[1]?.toLowerCase();
    const match2 = locales.find((l) => l.toLowerCase() === candidate);
    if (match2) {
      this._locale = match2;
      this._url.pathname = "/" + segments.slice(2).join("/");
    } else this._locale = this._defaultLocale;
  }
  /**
  * Reconstruct the full pathname with basePath + locale prefix.
  * Mirrors Next.js's internal formatPathname().
  */
  _formatPathname() {
    let prefix = this._basePath;
    if (this._locale && this._locale !== this._defaultLocale) prefix += "/" + this._locale;
    if (!prefix) return this._url.pathname;
    const inner = this._url.pathname;
    return inner === "/" ? prefix : prefix + inner;
  }
  get href() {
    const formatted = this._formatPathname();
    if (formatted === this._url.pathname) return this._url.href;
    const { href, pathname, search, hash } = this._url;
    const baseEnd = href.length - pathname.length - search.length - hash.length;
    return href.slice(0, baseEnd) + formatted + search + hash;
  }
  set href(value) {
    this._url.href = value;
    this._stripBasePath();
    if (this._locales) this._analyzeLocale(this._locales);
  }
  get origin() {
    return this._url.origin;
  }
  get protocol() {
    return this._url.protocol;
  }
  set protocol(value) {
    this._url.protocol = value;
  }
  get username() {
    return this._url.username;
  }
  set username(value) {
    this._url.username = value;
  }
  get password() {
    return this._url.password;
  }
  set password(value) {
    this._url.password = value;
  }
  get host() {
    return this._url.host;
  }
  set host(value) {
    this._url.host = value;
  }
  get hostname() {
    return this._url.hostname;
  }
  set hostname(value) {
    this._url.hostname = value;
  }
  get port() {
    return this._url.port;
  }
  set port(value) {
    this._url.port = value;
  }
  /** Returns the pathname WITHOUT basePath or locale prefix. */
  get pathname() {
    return this._url.pathname;
  }
  set pathname(value) {
    this._url.pathname = value;
  }
  get search() {
    return this._url.search;
  }
  set search(value) {
    this._url.search = value;
  }
  get searchParams() {
    return this._url.searchParams;
  }
  get hash() {
    return this._url.hash;
  }
  set hash(value) {
    this._url.hash = value;
  }
  get basePath() {
    return this._basePath;
  }
  set basePath(value) {
    this._basePath = value === "" ? "" : value.startsWith("/") ? value : "/" + value;
  }
  get locale() {
    return this._locale ?? "";
  }
  set locale(value) {
    if (this._locales) {
      if (!value) {
        this._locale = this._defaultLocale;
        return;
      }
      if (!this._locales.includes(value)) throw new TypeError(`The locale "${value}" is not in the configured locales: ${this._locales.join(", ")}`);
    }
    this._locale = this._locales ? value : this._locale;
  }
  get defaultLocale() {
    return this._defaultLocale;
  }
  get locales() {
    return this._locales ? [...this._locales] : void 0;
  }
  clone() {
    const config = {
      basePath: this._basePath,
      nextConfig: this._locales ? { i18n: {
        locales: [...this._locales],
        defaultLocale: this._defaultLocale
      } } : void 0
    };
    return new NextURL2(this.href, void 0, config);
  }
  toString() {
    return this.href;
  }
  /**
  * The build ID of the Next.js application.
  * Set from `generateBuildId` in next.config.js, or a random UUID if not configured.
  * Can be used in middleware to detect deployment skew between client and server.
  * Matches the Next.js API: `request.nextUrl.buildId`.
  */
  get buildId() {
    return "f9d0c88c-53d7-477d-a6e0-9c5c1a4e39d9";
  }
};
var RequestCookies = class {
  _headers;
  _parsed;
  constructor(headers) {
    this._headers = headers;
    this._parsed = parseCookieHeader(headers.get("cookie") ?? "");
  }
  get(name) {
    const value = this._parsed.get(name);
    return value !== void 0 ? {
      name,
      value
    } : void 0;
  }
  getAll(nameOrOptions) {
    const name = typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions?.name;
    return [...this._parsed.entries()].filter(([cookieName]) => name === void 0 || cookieName === name).map(([cookieName, value]) => ({
      name: cookieName,
      value
    }));
  }
  has(name) {
    return this._parsed.has(name);
  }
  set(nameOrOptions, value) {
    let cookieName;
    let cookieValue;
    if (typeof nameOrOptions === "string") {
      cookieName = nameOrOptions;
      cookieValue = value ?? "";
    } else {
      cookieName = nameOrOptions.name;
      cookieValue = nameOrOptions.value;
    }
    this._parsed.set(cookieName, cookieValue);
    this._syncHeader();
    return this;
  }
  delete(names) {
    if (Array.isArray(names)) {
      const results = names.map((name) => this._parsed.delete(name));
      this._syncHeader();
      return results;
    }
    const result = this._parsed.delete(names);
    this._syncHeader();
    return result;
  }
  clear() {
    this._parsed.clear();
    this._syncHeader();
    return this;
  }
  get size() {
    return this._parsed.size;
  }
  toString() {
    return this._serialize();
  }
  _serialize() {
    return [...this._parsed.entries()].map(([n, v]) => `${n}=${encodeURIComponent(v)}`).join("; ");
  }
  _syncHeader() {
    if (this._parsed.size === 0) this._headers.delete("cookie");
    else this._headers.set("cookie", this._serialize());
  }
  [Symbol.iterator]() {
    return this.getAll().map((c) => [c.name, c])[Symbol.iterator]();
  }
};
const ErrorBoundary = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'ErrorBoundary' is called on server");
}, "f29e6e234fea", "ErrorBoundary");
const NotFoundBoundary = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'NotFoundBoundary' is called on server");
}, "f29e6e234fea", "NotFoundBoundary");
const LayoutSegmentProvider = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'LayoutSegmentProvider' is called on server");
}, "0deffcb8ffd7", "LayoutSegmentProvider");
var jsxRuntime_reactServer = { exports: {} };
var reactJsxRuntime_reactServer_production = {};
var hasRequiredReactJsxRuntime_reactServer_production;
function requireReactJsxRuntime_reactServer_production() {
  if (hasRequiredReactJsxRuntime_reactServer_production) return reactJsxRuntime_reactServer_production;
  hasRequiredReactJsxRuntime_reactServer_production = 1;
  var React = requireReact_reactServer(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
  if (!React.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
    throw Error(
      'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
    );
  function jsxProd(type, config, maybeKey) {
    var key = null;
    void 0 !== maybeKey && (key = "" + maybeKey);
    void 0 !== config.key && (key = "" + config.key);
    if ("key" in config) {
      maybeKey = {};
      for (var propName in config)
        "key" !== propName && (maybeKey[propName] = config[propName]);
    } else maybeKey = config;
    config = maybeKey.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== config ? config : null,
      props: maybeKey
    };
  }
  reactJsxRuntime_reactServer_production.Fragment = REACT_FRAGMENT_TYPE;
  reactJsxRuntime_reactServer_production.jsx = jsxProd;
  reactJsxRuntime_reactServer_production.jsxDEV = void 0;
  reactJsxRuntime_reactServer_production.jsxs = jsxProd;
  return reactJsxRuntime_reactServer_production;
}
var hasRequiredJsxRuntime_reactServer;
function requireJsxRuntime_reactServer() {
  if (hasRequiredJsxRuntime_reactServer) return jsxRuntime_reactServer.exports;
  hasRequiredJsxRuntime_reactServer = 1;
  {
    jsxRuntime_reactServer.exports = requireReactJsxRuntime_reactServer_production();
  }
  return jsxRuntime_reactServer.exports;
}
var jsxRuntime_reactServerExports = requireJsxRuntime_reactServer();
function makeThenableParams$1(obj) {
  const plain = { ...obj };
  return Object.assign(Promise.resolve(plain), plain);
}
async function resolveModuleViewport(mod, params) {
  if (typeof mod.generateViewport === "function") {
    const asyncParams = makeThenableParams$1(params);
    return await mod.generateViewport({ params: asyncParams });
  }
  if (mod.viewport && typeof mod.viewport === "object") return mod.viewport;
  return null;
}
const DEFAULT_VIEWPORT = {
  width: "device-width",
  initialScale: 1
};
function mergeViewport(viewportList) {
  const merged = { ...DEFAULT_VIEWPORT };
  for (const vp of viewportList) Object.assign(merged, vp);
  return merged;
}
function ViewportHead({ viewport }) {
  const elements = [];
  let key = 0;
  const parts = [];
  if (viewport.width !== void 0) parts.push(`width=${viewport.width}`);
  if (viewport.height !== void 0) parts.push(`height=${viewport.height}`);
  if (viewport.initialScale !== void 0) parts.push(`initial-scale=${viewport.initialScale}`);
  if (viewport.minimumScale !== void 0) parts.push(`minimum-scale=${viewport.minimumScale}`);
  if (viewport.maximumScale !== void 0) parts.push(`maximum-scale=${viewport.maximumScale}`);
  if (viewport.userScalable !== void 0) parts.push(`user-scalable=${viewport.userScalable ? "yes" : "no"}`);
  if (parts.length > 0) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "viewport",
    content: parts.join(", ")
  }, key++));
  if (viewport.themeColor) {
    if (typeof viewport.themeColor === "string") elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "theme-color",
      content: viewport.themeColor
    }, key++));
    else if (Array.isArray(viewport.themeColor)) for (const entry of viewport.themeColor) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "theme-color",
      content: entry.color,
      ...entry.media ? { media: entry.media } : {}
    }, key++));
  }
  if (viewport.colorScheme) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "color-scheme",
    content: viewport.colorScheme
  }, key++));
  return /* @__PURE__ */ jsxRuntime_reactServerExports.jsx(jsxRuntime_reactServerExports.Fragment, { children: elements });
}
function mergeMetadata(metadataList) {
  if (metadataList.length === 0) return {};
  const merged = {};
  let parentTemplate;
  for (let i = 0; i < metadataList.length; i++) {
    const meta = metadataList[i];
    if (!(i === metadataList.length - 1) && meta.title && typeof meta.title === "object" && meta.title.template) parentTemplate = meta.title.template;
    for (const key of Object.keys(meta)) {
      if (key === "title") continue;
      merged[key] = meta[key];
    }
    if (meta.title !== void 0) merged.title = meta.title;
  }
  const finalTitle = merged.title;
  if (finalTitle) {
    if (typeof finalTitle === "string") {
      if (parentTemplate) merged.title = parentTemplate.replace("%s", finalTitle);
    } else if (typeof finalTitle === "object") {
      if (finalTitle.absolute) merged.title = finalTitle.absolute;
      else if (finalTitle.default) merged.title = finalTitle.default;
      else if (finalTitle.template && !finalTitle.default && !finalTitle.absolute) merged.title = void 0;
    }
  }
  return merged;
}
async function resolveModuleMetadata(mod, params = {}, searchParams, parent = Promise.resolve({})) {
  if (typeof mod.generateMetadata === "function") {
    const asyncParams = makeThenableParams$1(params);
    const asyncSp = makeThenableParams$1(searchParams ?? {});
    return await mod.generateMetadata({
      params: asyncParams,
      searchParams: asyncSp
    }, parent);
  }
  if (mod.metadata && typeof mod.metadata === "object") return mod.metadata;
  return null;
}
function MetadataHead({ metadata: metadata2 }) {
  const elements = [];
  let key = 0;
  const base = metadata2.metadataBase;
  function resolveUrl(url) {
    if (!url) return void 0;
    const s = typeof url === "string" ? url : url instanceof URL ? url.toString() : String(url);
    if (!base) return s;
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("//")) return s;
    try {
      return new URL(s, base).toString();
    } catch {
      return s;
    }
  }
  const title = typeof metadata2.title === "string" ? metadata2.title : typeof metadata2.title === "object" ? metadata2.title.absolute || metadata2.title.default : void 0;
  if (title) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("title", { children: title }, key++));
  if (metadata2.description) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "description",
    content: metadata2.description
  }, key++));
  if (metadata2.generator) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "generator",
    content: metadata2.generator
  }, key++));
  if (metadata2.applicationName) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "application-name",
    content: metadata2.applicationName
  }, key++));
  if (metadata2.referrer) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "referrer",
    content: metadata2.referrer
  }, key++));
  if (metadata2.keywords) {
    const kw = Array.isArray(metadata2.keywords) ? metadata2.keywords.join(",") : metadata2.keywords;
    elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "keywords",
      content: kw
    }, key++));
  }
  if (metadata2.authors) {
    const authorList = Array.isArray(metadata2.authors) ? metadata2.authors : [metadata2.authors];
    for (const author of authorList) {
      if (author.name) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
        name: "author",
        content: author.name
      }, key++));
      if (author.url) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
        rel: "author",
        href: author.url
      }, key++));
    }
  }
  if (metadata2.creator) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "creator",
    content: metadata2.creator
  }, key++));
  if (metadata2.publisher) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "publisher",
    content: metadata2.publisher
  }, key++));
  if (metadata2.formatDetection) {
    const parts = [];
    if (metadata2.formatDetection.telephone === false) parts.push("telephone=no");
    if (metadata2.formatDetection.address === false) parts.push("address=no");
    if (metadata2.formatDetection.email === false) parts.push("email=no");
    if (parts.length > 0) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "format-detection",
      content: parts.join(", ")
    }, key++));
  }
  if (metadata2.category) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "category",
    content: metadata2.category
  }, key++));
  if (metadata2.robots) if (typeof metadata2.robots === "string") elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
    name: "robots",
    content: metadata2.robots
  }, key++));
  else {
    const { googleBot, ...robotsRest } = metadata2.robots;
    const robotParts = [];
    for (const [k, v] of Object.entries(robotsRest)) if (v === true) robotParts.push(k);
    else if (v === false) robotParts.push(`no${k}`);
    else if (typeof v === "string" || typeof v === "number") robotParts.push(`${k}:${v}`);
    if (robotParts.length > 0) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "robots",
      content: robotParts.join(", ")
    }, key++));
    if (googleBot) if (typeof googleBot === "string") elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "googlebot",
      content: googleBot
    }, key++));
    else {
      const gbParts = [];
      for (const [k, v] of Object.entries(googleBot)) if (v === true) gbParts.push(k);
      else if (v === false) gbParts.push(`no${k}`);
      else if (typeof v === "string" || typeof v === "number") gbParts.push(`${k}:${v}`);
      if (gbParts.length > 0) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
        name: "googlebot",
        content: gbParts.join(", ")
      }, key++));
    }
  }
  if (metadata2.openGraph) {
    const og = metadata2.openGraph;
    if (og.title) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "og:title",
      content: og.title
    }, key++));
    if (og.description) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "og:description",
      content: og.description
    }, key++));
    if (og.url) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "og:url",
      content: resolveUrl(og.url)
    }, key++));
    if (og.siteName) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "og:site_name",
      content: og.siteName
    }, key++));
    if (og.type) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "og:type",
      content: og.type
    }, key++));
    if (og.locale) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "og:locale",
      content: og.locale
    }, key++));
    if (og.publishedTime) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "article:published_time",
      content: og.publishedTime
    }, key++));
    if (og.modifiedTime) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "article:modified_time",
      content: og.modifiedTime
    }, key++));
    if (og.authors) for (const author of og.authors) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "article:author",
      content: author
    }, key++));
    if (og.images) {
      const imgList = typeof og.images === "string" || og.images instanceof URL ? [{ url: og.images }] : Array.isArray(og.images) ? og.images : [og.images];
      for (const img of imgList) {
        const imgUrl = typeof img === "string" || img instanceof URL ? img : img.url;
        elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          property: "og:image",
          content: resolveUrl(imgUrl)
        }, key++));
        if (typeof img !== "string" && !(img instanceof URL)) {
          if (img.width) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
            property: "og:image:width",
            content: String(img.width)
          }, key++));
          if (img.height) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
            property: "og:image:height",
            content: String(img.height)
          }, key++));
          if (img.alt) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
            property: "og:image:alt",
            content: img.alt
          }, key++));
        }
      }
    }
    if (og.videos) for (const video of og.videos) {
      elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
        property: "og:video",
        content: resolveUrl(video.url)
      }, key++));
      if (video.width) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
        property: "og:video:width",
        content: String(video.width)
      }, key++));
      if (video.height) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
        property: "og:video:height",
        content: String(video.height)
      }, key++));
    }
    if (og.audio) for (const audio of og.audio) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      property: "og:audio",
      content: resolveUrl(audio.url)
    }, key++));
  }
  if (metadata2.twitter) {
    const tw = metadata2.twitter;
    if (tw.card) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "twitter:card",
      content: tw.card
    }, key++));
    if (tw.site) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "twitter:site",
      content: tw.site
    }, key++));
    if (tw.siteId) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "twitter:site:id",
      content: tw.siteId
    }, key++));
    if (tw.title) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "twitter:title",
      content: tw.title
    }, key++));
    if (tw.description) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "twitter:description",
      content: tw.description
    }, key++));
    if (tw.creator) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "twitter:creator",
      content: tw.creator
    }, key++));
    if (tw.creatorId) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "twitter:creator:id",
      content: tw.creatorId
    }, key++));
    if (tw.images) {
      const imgList = typeof tw.images === "string" || tw.images instanceof URL ? [tw.images] : Array.isArray(tw.images) ? tw.images : [tw.images];
      for (const img of imgList) {
        const imgUrl = typeof img === "string" || img instanceof URL ? img : img.url;
        elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: "twitter:image",
          content: resolveUrl(imgUrl)
        }, key++));
        if (typeof img !== "string" && !(img instanceof URL) && img.alt) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: "twitter:image:alt",
          content: img.alt
        }, key++));
      }
    }
    if (tw.players) {
      const players = Array.isArray(tw.players) ? tw.players : [tw.players];
      for (const player of players) {
        const playerUrl = player.playerUrl.toString();
        const streamUrl = player.streamUrl.toString();
        elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: "twitter:player",
          content: resolveUrl(playerUrl)
        }, key++));
        elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: "twitter:player:stream",
          content: resolveUrl(streamUrl)
        }, key++));
        elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: "twitter:player:width",
          content: String(player.width)
        }, key++));
        elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: "twitter:player:height",
          content: String(player.height)
        }, key++));
      }
    }
    if (tw.app) {
      const { app } = tw;
      for (const platform of [
        "iphone",
        "ipad",
        "googleplay"
      ]) {
        if (app.name) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: `twitter:app:name:${platform}`,
          content: app.name
        }, key++));
        if (app.id[platform] !== void 0) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          name: `twitter:app:id:${platform}`,
          content: String(app.id[platform])
        }, key++));
        if (app.url?.[platform] !== void 0) {
          const appUrl = app.url[platform].toString();
          elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
            name: `twitter:app:url:${platform}`,
            content: resolveUrl(appUrl)
          }, key++));
        }
      }
    }
  }
  if (metadata2.icons) {
    const { icon, shortcut, apple, other } = metadata2.icons;
    if (shortcut) {
      const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
      for (const s of shortcuts) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
        rel: "shortcut icon",
        href: resolveUrl(s)
      }, key++));
    }
    if (icon) {
      const icons = typeof icon === "string" || icon instanceof URL ? [{ url: icon }] : icon;
      for (const i of icons) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
        rel: "icon",
        href: resolveUrl(i.url),
        ...i.sizes ? { sizes: i.sizes } : {},
        ...i.type ? { type: i.type } : {},
        ...i.media ? { media: i.media } : {}
      }, key++));
    }
    if (apple) {
      const apples = typeof apple === "string" || apple instanceof URL ? [{ url: apple }] : apple;
      for (const a of apples) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
        rel: "apple-touch-icon",
        href: resolveUrl(a.url),
        ...a.sizes ? { sizes: a.sizes } : {},
        ...a.type ? { type: a.type } : {}
      }, key++));
    }
    if (other) for (const o of other) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
      rel: o.rel,
      href: resolveUrl(o.url),
      ...o.sizes ? { sizes: o.sizes } : {}
    }, key++));
  }
  if (metadata2.manifest) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
    rel: "manifest",
    href: resolveUrl(metadata2.manifest)
  }, key++));
  if (metadata2.alternates) {
    const alt = metadata2.alternates;
    if (alt.canonical) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
      rel: "canonical",
      href: resolveUrl(alt.canonical)
    }, key++));
    if (alt.languages) for (const [lang, href] of Object.entries(alt.languages)) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
      rel: "alternate",
      hrefLang: lang,
      href: resolveUrl(href)
    }, key++));
    if (alt.media) for (const [media, href] of Object.entries(alt.media)) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
      rel: "alternate",
      media,
      href: resolveUrl(href)
    }, key++));
    if (alt.types) for (const [type, href] of Object.entries(alt.types)) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
      rel: "alternate",
      type,
      href: resolveUrl(href)
    }, key++));
  }
  if (metadata2.verification) {
    const v = metadata2.verification;
    if (v.google) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "google-site-verification",
      content: v.google
    }, key++));
    if (v.yahoo) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "y_key",
      content: v.yahoo
    }, key++));
    if (v.yandex) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "yandex-verification",
      content: v.yandex
    }, key++));
    if (v.other) for (const [name, content] of Object.entries(v.other)) {
      const values = Array.isArray(content) ? content : [content];
      for (const val of values) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
        name,
        content: val
      }, key++));
    }
  }
  if (metadata2.appleWebApp) {
    const awa = metadata2.appleWebApp;
    if (awa.capable !== false) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "mobile-web-app-capable",
      content: "yes"
    }, key++));
    if (awa.title) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "apple-mobile-web-app-title",
      content: awa.title
    }, key++));
    if (awa.statusBarStyle) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "apple-mobile-web-app-status-bar-style",
      content: awa.statusBarStyle
    }, key++));
    if (awa.startupImage) {
      const imgs = typeof awa.startupImage === "string" ? [{ url: awa.startupImage }] : awa.startupImage;
      for (const img of imgs) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("link", {
        rel: "apple-touch-startup-image",
        href: resolveUrl(img.url),
        ...img.media ? { media: img.media } : {}
      }, key++));
    }
  }
  if (metadata2.itunes) {
    const { appId, appArgument } = metadata2.itunes;
    let content = `app-id=${appId}`;
    if (appArgument) content += `, app-argument=${appArgument}`;
    elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name: "apple-itunes-app",
      content
    }, key++));
  }
  if (metadata2.appLinks) {
    const al = metadata2.appLinks;
    for (const platform of [
      "ios",
      "iphone",
      "ipad",
      "android",
      "windows_phone",
      "windows",
      "windows_universal",
      "web"
    ]) {
      const entries = al[platform];
      if (!entries) continue;
      const list = Array.isArray(entries) ? entries : [entries];
      for (const entry of list) for (const [k, v] of Object.entries(entry)) {
        if (v === void 0 || v === null) continue;
        const str = String(v);
        const content = k === "url" ? resolveUrl(str) : str;
        elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
          property: `al:${platform}:${k}`,
          content
        }, key++));
      }
    }
  }
  if (metadata2.other) for (const [name, content] of Object.entries(metadata2.other)) {
    const values = Array.isArray(content) ? content : [content];
    for (const val of values) elements.push(/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("meta", {
      name,
      content: val
    }, key++));
  }
  return /* @__PURE__ */ jsxRuntime_reactServerExports.jsx(jsxRuntime_reactServerExports.Fragment, { children: elements });
}
const _compiledPatternCache = /* @__PURE__ */ new Map();
const _compiledHeaderSourceCache = /* @__PURE__ */ new Map();
const _compiledConditionCache = /* @__PURE__ */ new Map();
const _compiledDestinationParamCache = /* @__PURE__ */ new Map();
const _LOCALE_STATIC_RE = /^\/:[\w-]+\(([^)]+)\)\?\/([a-zA-Z0-9_~.%@!$&'*+,;=:/-]+)$/;
const _redirectIndexCache = /* @__PURE__ */ new WeakMap();
function _getRedirectIndex(redirects) {
  let index = _redirectIndexCache.get(redirects);
  if (index !== void 0) return index;
  const localeStatic = /* @__PURE__ */ new Map();
  const linear = [];
  for (let i = 0; i < redirects.length; i++) {
    const redirect = redirects[i];
    const m = _LOCALE_STATIC_RE.exec(redirect.source);
    if (m) {
      const paramName = redirect.source.slice(2, redirect.source.indexOf("("));
      const alternation = m[1];
      const suffix = "/" + m[2];
      const altRe = safeRegExp("^(?:" + alternation + ")$");
      if (!altRe) {
        linear.push([i, redirect]);
        continue;
      }
      const entry = {
        paramName,
        altRe,
        redirect,
        originalIndex: i
      };
      const bucket = localeStatic.get(suffix);
      if (bucket) bucket.push(entry);
      else localeStatic.set(suffix, [entry]);
    } else linear.push([i, redirect]);
  }
  index = {
    localeStatic,
    linear
  };
  _redirectIndexCache.set(redirects, index);
  return index;
}
const HOP_BY_HOP_HEADERS = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade"
]);
const REQUEST_HOP_BY_HOP_HEADERS = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade"
]);
function stripHopByHopRequestHeaders(headers) {
  const connectionTokens = (headers.get("connection") || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  for (const header of REQUEST_HOP_BY_HOP_HEADERS) headers.delete(header);
  for (const token of connectionTokens) headers.delete(token);
}
function isSafeRegex(pattern) {
  const quantifierAtDepth = [];
  let depth = 0;
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === "[") {
      i++;
      while (i < pattern.length && pattern[i] !== "]") {
        if (pattern[i] === "\\") i++;
        i++;
      }
      i++;
      continue;
    }
    if (ch === "(") {
      depth++;
      if (quantifierAtDepth.length <= depth) quantifierAtDepth.push(false);
      else quantifierAtDepth[depth] = false;
      i++;
      continue;
    }
    if (ch === ")") {
      const hadQuantifier = depth > 0 && quantifierAtDepth[depth];
      if (depth > 0) depth--;
      const next = pattern[i + 1];
      if (next === "+" || next === "*" || next === "{") {
        if (hadQuantifier) return false;
        if (depth >= 0 && depth < quantifierAtDepth.length) quantifierAtDepth[depth] = true;
      }
      i++;
      continue;
    }
    if (ch === "+" || ch === "*") {
      if (depth > 0) quantifierAtDepth[depth] = true;
      i++;
      continue;
    }
    if (ch === "?") {
      const prev = i > 0 ? pattern[i - 1] : "";
      if (prev !== "+" && prev !== "*" && prev !== "?" && prev !== "}") {
        if (depth > 0) quantifierAtDepth[depth] = true;
      }
      i++;
      continue;
    }
    if (ch === "{") {
      let j = i + 1;
      while (j < pattern.length && /[\d,]/.test(pattern[j])) j++;
      if (j < pattern.length && pattern[j] === "}" && j > i + 1) {
        if (depth > 0) quantifierAtDepth[depth] = true;
        i = j + 1;
        continue;
      }
    }
    i++;
  }
  return true;
}
function safeRegExp(pattern, flags) {
  if (!isSafeRegex(pattern)) {
    console.warn(`[vinext] Ignoring potentially unsafe regex pattern (ReDoS risk): ${pattern}
  Patterns with nested quantifiers (e.g. (a+)+) can cause catastrophic backtracking.
  Simplify the pattern to avoid nested repetition.`);
    return null;
  }
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}
function escapeHeaderSource(source) {
  const S = "";
  const groups = [];
  const withPlaceholders = source.replace(/\(([^)]+)\)/g, (_m, inner) => {
    groups.push(inner);
    return `${S}G${groups.length - 1}${S}`;
  });
  let result = "";
  const re = new RegExp(`${S}G(\\d+)${S}|:[\\w-]+|[.+?*]|[^.+?*:\\uE000]+`, "g");
  let m;
  while ((m = re.exec(withPlaceholders)) !== null) if (m[1] !== void 0) result += `(${groups[Number(m[1])]})`;
  else if (m[0].startsWith(":")) {
    const constraintMatch = withPlaceholders.slice(re.lastIndex).match(new RegExp(`^${S}G(\\d+)${S}`));
    if (constraintMatch) {
      re.lastIndex += constraintMatch[0].length;
      result += `(${groups[Number(constraintMatch[1])]})`;
    } else result += "[^/]+";
  } else switch (m[0]) {
    case ".":
      result += "\\.";
      break;
    case "+":
      result += "\\+";
      break;
    case "?":
      result += "\\?";
      break;
    case "*":
      result += ".*";
      break;
    default:
      result += m[0];
      break;
  }
  return result;
}
function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  const cookies = {};
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) cookies[key] = value;
  }
  return cookies;
}
function requestContextFromRequest(request) {
  const url = new URL(request.url);
  return {
    headers: request.headers,
    cookies: parseCookies(request.headers.get("cookie")),
    query: url.searchParams,
    host: normalizeHost(request.headers.get("host"), url.hostname)
  };
}
function normalizeHost(hostHeader, fallbackHostname) {
  return (hostHeader ?? fallbackHostname).split(":", 1)[0].toLowerCase();
}
function _emptyParams() {
  return /* @__PURE__ */ Object.create(null);
}
function _matchConditionValue(actualValue, expectedValue) {
  if (expectedValue === void 0) return _emptyParams();
  const re = _cachedConditionRegex(expectedValue);
  if (re) {
    const match2 = re.exec(actualValue);
    if (!match2) return null;
    const params = _emptyParams();
    if (match2.groups) {
      for (const [key, value] of Object.entries(match2.groups)) if (value !== void 0) params[key] = value;
    }
    return params;
  }
  return actualValue === expectedValue ? _emptyParams() : null;
}
function matchSingleCondition(condition, ctx) {
  switch (condition.type) {
    case "header": {
      const headerValue = ctx.headers.get(condition.key);
      if (headerValue === null) return null;
      return _matchConditionValue(headerValue, condition.value);
    }
    case "cookie": {
      const cookieValue = ctx.cookies[condition.key];
      if (cookieValue === void 0) return null;
      return _matchConditionValue(cookieValue, condition.value);
    }
    case "query": {
      const queryValue = ctx.query.get(condition.key);
      if (queryValue === null) return null;
      return _matchConditionValue(queryValue, condition.value);
    }
    case "host":
      if (condition.value !== void 0) return _matchConditionValue(ctx.host, condition.value);
      return ctx.host === condition.key ? _emptyParams() : null;
    default:
      return null;
  }
}
function _cachedConditionRegex(value) {
  let re = _compiledConditionCache.get(value);
  if (re === void 0) {
    re = safeRegExp(value);
    _compiledConditionCache.set(value, re);
  }
  return re;
}
function collectConditionParams(has, missing, ctx) {
  const params = _emptyParams();
  if (has) for (const condition of has) {
    const conditionParams = matchSingleCondition(condition, ctx);
    if (!conditionParams) return null;
    Object.assign(params, conditionParams);
  }
  if (missing) {
    for (const condition of missing) if (matchSingleCondition(condition, ctx)) return null;
  }
  return params;
}
function checkHasConditions(has, missing, ctx) {
  return collectConditionParams(has, missing, ctx) !== null;
}
function extractConstraint(str, re) {
  if (str[re.lastIndex] !== "(") return null;
  const start = re.lastIndex + 1;
  let depth = 1;
  let i = start;
  while (i < str.length && depth > 0) {
    if (str[i] === "(") depth++;
    else if (str[i] === ")") depth--;
    i++;
  }
  if (depth !== 0) return null;
  re.lastIndex = i;
  return str.slice(start, i - 1);
}
function matchConfigPattern(pathname, pattern) {
  if (pattern.includes("(") || pattern.includes("\\") || /:[\w-]+[*+][^/]/.test(pattern) || /:[\w-]+\./.test(pattern)) try {
    let compiled = _compiledPatternCache.get(pattern);
    if (compiled === void 0) {
      const paramNames = [];
      let regexStr = "";
      const tokenRe = /:([\w-]+)|[.]|[^:.]+/g;
      let tok;
      while ((tok = tokenRe.exec(pattern)) !== null) if (tok[1] !== void 0) {
        const name = tok[1];
        const rest = pattern.slice(tokenRe.lastIndex);
        if (rest.startsWith("*") || rest.startsWith("+")) {
          const quantifier = rest[0];
          tokenRe.lastIndex += 1;
          const constraint = extractConstraint(pattern, tokenRe);
          paramNames.push(name);
          if (constraint !== null) regexStr += `(${constraint})`;
          else regexStr += quantifier === "*" ? "(.*)" : "(.+)";
        } else {
          const constraint = extractConstraint(pattern, tokenRe);
          paramNames.push(name);
          regexStr += constraint !== null ? `(${constraint})` : "([^/]+)";
        }
      } else if (tok[0] === ".") regexStr += "\\.";
      else regexStr += tok[0];
      const re = safeRegExp("^" + regexStr + "$");
      compiled = re ? {
        re,
        paramNames
      } : null;
      _compiledPatternCache.set(pattern, compiled);
    }
    if (!compiled) return null;
    const match2 = compiled.re.exec(pathname);
    if (!match2) return null;
    const params2 = /* @__PURE__ */ Object.create(null);
    for (let i = 0; i < compiled.paramNames.length; i++) params2[compiled.paramNames[i]] = match2[i + 1] ?? "";
    return params2;
  } catch {
  }
  const catchAllMatch = pattern.match(/:([\w-]+)(\*|\+)$/);
  if (catchAllMatch) {
    const prefix = pattern.slice(0, pattern.lastIndexOf(":"));
    const paramName = catchAllMatch[1];
    const isPlus = catchAllMatch[2] === "+";
    const prefixNoSlash = prefix.replace(/\/$/, "");
    if (!pathname.startsWith(prefixNoSlash)) return null;
    const charAfter = pathname[prefixNoSlash.length];
    if (charAfter !== void 0 && charAfter !== "/") return null;
    const rest = pathname.slice(prefixNoSlash.length);
    if (isPlus && (!rest || rest === "/")) return null;
    let restValue = rest.startsWith("/") ? rest.slice(1) : rest;
    return { [paramName]: restValue };
  }
  const parts = pattern.split("/");
  const pathParts = pathname.split("/");
  if (parts.length !== pathParts.length) return null;
  const params = /* @__PURE__ */ Object.create(null);
  for (let i = 0; i < parts.length; i++) if (parts[i].startsWith(":")) params[parts[i].slice(1)] = pathParts[i];
  else if (parts[i] !== pathParts[i]) return null;
  return params;
}
function matchRedirect(pathname, redirects, ctx) {
  if (redirects.length === 0) return null;
  const index = _getRedirectIndex(redirects);
  let localeMatch = null;
  let localeMatchIndex = Infinity;
  if (index.localeStatic.size > 0) {
    const noLocaleBucket = index.localeStatic.get(pathname);
    if (noLocaleBucket) for (const entry of noLocaleBucket) {
      if (entry.originalIndex >= localeMatchIndex) continue;
      const redirect = entry.redirect;
      const conditionParams = redirect.has || redirect.missing ? collectConditionParams(redirect.has, redirect.missing, ctx) : _emptyParams();
      if (!conditionParams) continue;
      let dest = substituteDestinationParams(redirect.destination, {
        [entry.paramName]: "",
        ...conditionParams
      });
      dest = sanitizeDestination(dest);
      localeMatch = {
        destination: dest,
        permanent: redirect.permanent
      };
      localeMatchIndex = entry.originalIndex;
      break;
    }
    const slashTwo = pathname.indexOf("/", 1);
    if (slashTwo !== -1) {
      const suffix = pathname.slice(slashTwo);
      const localePart = pathname.slice(1, slashTwo);
      const localeBucket = index.localeStatic.get(suffix);
      if (localeBucket) for (const entry of localeBucket) {
        if (entry.originalIndex >= localeMatchIndex) continue;
        if (!entry.altRe.test(localePart)) continue;
        const redirect = entry.redirect;
        const conditionParams = redirect.has || redirect.missing ? collectConditionParams(redirect.has, redirect.missing, ctx) : _emptyParams();
        if (!conditionParams) continue;
        let dest = substituteDestinationParams(redirect.destination, {
          [entry.paramName]: localePart,
          ...conditionParams
        });
        dest = sanitizeDestination(dest);
        localeMatch = {
          destination: dest,
          permanent: redirect.permanent
        };
        localeMatchIndex = entry.originalIndex;
        break;
      }
    }
  }
  for (const [origIdx, redirect] of index.linear) {
    if (origIdx >= localeMatchIndex) break;
    const params = matchConfigPattern(pathname, redirect.source);
    if (params) {
      const conditionParams = redirect.has || redirect.missing ? collectConditionParams(redirect.has, redirect.missing, ctx) : _emptyParams();
      if (!conditionParams) continue;
      let dest = substituteDestinationParams(redirect.destination, {
        ...params,
        ...conditionParams
      });
      dest = sanitizeDestination(dest);
      return {
        destination: dest,
        permanent: redirect.permanent
      };
    }
  }
  return localeMatch;
}
function matchRewrite(pathname, rewrites, ctx) {
  for (const rewrite of rewrites) {
    const params = matchConfigPattern(pathname, rewrite.source);
    if (params) {
      const conditionParams = rewrite.has || rewrite.missing ? collectConditionParams(rewrite.has, rewrite.missing, ctx) : _emptyParams();
      if (!conditionParams) continue;
      let dest = substituteDestinationParams(rewrite.destination, {
        ...params,
        ...conditionParams
      });
      dest = sanitizeDestination(dest);
      return dest;
    }
  }
  return null;
}
function substituteDestinationParams(destination, params) {
  const keys = Object.keys(params);
  if (keys.length === 0) return destination;
  const sortedKeys = [...keys].sort((a, b) => b.length - a.length);
  const cacheKey = sortedKeys.join("\0");
  let paramRe = _compiledDestinationParamCache.get(cacheKey);
  if (!paramRe) {
    const paramAlternation = sortedKeys.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    paramRe = new RegExp(`:(${paramAlternation})([+*])?(?![A-Za-z0-9_])`, "g");
    _compiledDestinationParamCache.set(cacheKey, paramRe);
  }
  return destination.replace(paramRe, (_token, key) => params[key]);
}
function sanitizeDestination(dest) {
  if (dest.startsWith("http://") || dest.startsWith("https://")) return dest;
  dest = dest.replace(/^[\\/]+/, "/");
  return dest;
}
function isExternalUrl(url) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//");
}
async function proxyExternalRequest(request, externalUrl) {
  const originalUrl = new URL(request.url);
  const targetUrl = new URL(externalUrl);
  const destinationKeys = new Set(targetUrl.searchParams.keys());
  for (const [key, value] of originalUrl.searchParams) if (!destinationKeys.has(key)) targetUrl.searchParams.append(key, value);
  const headers = new Headers(request.headers);
  headers.set("host", targetUrl.host);
  stripHopByHopRequestHeaders(headers);
  const keysToDelete = [];
  for (const key of headers.keys()) if (key.startsWith("x-middleware-")) keysToDelete.push(key);
  for (const key of keysToDelete) headers.delete(key);
  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const init2 = {
    method,
    headers,
    redirect: "manual"
  };
  if (hasBody && request.body) {
    init2.body = request.body;
    init2.duplex = "half";
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3e4);
  let upstreamResponse;
  try {
    upstreamResponse = await fetch(targetUrl.href, {
      ...init2,
      signal: controller.signal
    });
  } catch (e) {
    if (e?.name === "AbortError") {
      console.error("[vinext] External rewrite proxy timeout:", targetUrl.href);
      return new Response("Gateway Timeout", { status: 504 });
    }
    console.error("[vinext] External rewrite proxy error:", e);
    return new Response("Bad Gateway", { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
  const isNodeRuntime = typeof process !== "undefined" && !!process.versions?.node;
  const responseHeaders = new Headers();
  upstreamResponse.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lower)) return;
    if (isNodeRuntime && (lower === "content-encoding" || lower === "content-length")) return;
    responseHeaders.append(key, value);
  });
  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  });
}
function matchHeaders(pathname, headers, ctx) {
  const result = [];
  for (const rule of headers) {
    let sourceRegex = _compiledHeaderSourceCache.get(rule.source);
    if (sourceRegex === void 0) {
      sourceRegex = safeRegExp("^" + escapeHeaderSource(rule.source) + "$");
      _compiledHeaderSourceCache.set(rule.source, sourceRegex);
    }
    if (sourceRegex && sourceRegex.test(pathname)) {
      if (rule.has || rule.missing) {
        if (!checkHasConditions(rule.has, rule.missing, ctx)) continue;
      }
      result.push(...rule.headers);
    }
  }
  return result;
}
function guardProtocolRelativeUrl(rawPathname) {
  if (rawPathname.replaceAll("\\", "/").startsWith("//")) return new Response("404 Not Found", { status: 404 });
  return null;
}
function normalizeTrailingSlash(pathname, basePath, trailingSlash, search) {
  if (pathname === "/" || pathname === "/api" || pathname.startsWith("/api/")) return null;
  const hasTrailing = pathname.endsWith("/");
  if (hasTrailing) return new Response(null, {
    status: 308,
    headers: { Location: basePath + pathname.replace(/\/+$/, "") + search }
  });
  return null;
}
function validateCsrfOrigin(request, allowedOrigins = []) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return null;
  if (originHeader === "null") {
    if (allowedOrigins.includes("null")) return null;
    console.warn(`[vinext] CSRF origin "null" blocked for server action. To allow requests from sandboxed contexts, add "null" to experimental.serverActions.allowedOrigins.`);
    return new Response("Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain" }
    });
  }
  let originHost;
  try {
    originHost = new URL(originHeader).host.toLowerCase();
  } catch {
    return new Response("Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain" }
    });
  }
  const hostHeader = (request.headers.get("host") || "").split(",")[0].trim().toLowerCase() || new URL(request.url).host.toLowerCase();
  if (originHost === hostHeader) return null;
  if (allowedOrigins.length > 0 && isOriginAllowed(originHost, allowedOrigins)) return null;
  console.warn(`[vinext] CSRF origin mismatch: origin "${originHost}" does not match host "${hostHeader}". Blocking server action request.`);
  return new Response("Forbidden", {
    status: 403,
    headers: { "Content-Type": "text/plain" }
  });
}
function isOriginAllowed(origin, allowed) {
  for (const pattern of allowed) if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(1);
    if (origin === pattern.slice(2) || origin.endsWith(suffix)) return true;
  } else if (origin === pattern) return true;
  return false;
}
function validateImageUrl(rawUrl, requestUrl) {
  const imgUrl = rawUrl?.replaceAll("\\", "/") ?? null;
  if (!imgUrl || !imgUrl.startsWith("/") || imgUrl.startsWith("//")) return new Response(!rawUrl ? "Missing url parameter" : "Only relative URLs allowed", { status: 400 });
  const url = new URL(requestUrl);
  if (new URL(imgUrl, url.origin).origin !== url.origin) return new Response("Only relative URLs allowed", { status: 400 });
  return imgUrl;
}
const ROUTE_HANDLER_HTTP_METHODS = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS"
];
function collectRouteHandlerMethods(handler2) {
  const methods = ROUTE_HANDLER_HTTP_METHODS.filter((method) => typeof handler2[method] === "function");
  if (methods.includes("GET") && !methods.includes("HEAD")) methods.push("HEAD");
  return methods;
}
function buildRouteHandlerAllowHeader(exportedMethods) {
  const allow = new Set(exportedMethods);
  allow.add("OPTIONS");
  return Array.from(allow).sort().join(", ");
}
const _KNOWN_DYNAMIC_APP_ROUTE_HANDLERS_KEY = /* @__PURE__ */ Symbol.for("vinext.appRouteHandlerRuntime.knownDynamicHandlers");
const _g$4 = globalThis;
const knownDynamicAppRouteHandlers = _g$4[_KNOWN_DYNAMIC_APP_ROUTE_HANDLERS_KEY] ??= /* @__PURE__ */ new Set();
function isKnownDynamicAppRoute(pattern) {
  return knownDynamicAppRouteHandlers.has(pattern);
}
function markKnownDynamicAppRoute(pattern) {
  knownDynamicAppRouteHandlers.add(pattern);
}
function bindMethodIfNeeded(value, target) {
  return typeof value === "function" ? value.bind(target) : value;
}
function buildNextConfig(options) {
  if (!options.basePath && !options.i18n) return null;
  return {
    basePath: options.basePath,
    i18n: options.i18n ?? void 0
  };
}
function createTrackedAppRouteRequest(request, options = {}) {
  let didAccessDynamicRequest = false;
  const nextConfig = buildNextConfig(options);
  const markDynamicAccess = (access) => {
    didAccessDynamicRequest = true;
    options.onDynamicAccess?.(access);
  };
  const wrapNextUrl = (nextUrl) => {
    return new Proxy(nextUrl, { get(target, prop) {
      switch (prop) {
        case "search":
        case "searchParams":
        case "url":
        case "href":
        case "toJSON":
        case "toString":
        case "origin":
          markDynamicAccess(`nextUrl.${String(prop)}`);
          return bindMethodIfNeeded(Reflect.get(target, prop, target), target);
        case "clone":
          return () => wrapNextUrl(target.clone());
        default:
          return bindMethodIfNeeded(Reflect.get(target, prop, target), target);
      }
    } });
  };
  const wrapRequest = (input) => {
    const nextRequest = input instanceof NextRequest ? input : new NextRequest(input, { nextConfig: nextConfig ?? void 0 });
    let proxiedNextUrl = null;
    return new Proxy(nextRequest, { get(target, prop) {
      switch (prop) {
        case "nextUrl":
          proxiedNextUrl ??= wrapNextUrl(target.nextUrl);
          return proxiedNextUrl;
        case "headers":
        case "cookies":
        case "url":
        case "body":
        case "blob":
        case "json":
        case "text":
        case "arrayBuffer":
        case "formData":
          markDynamicAccess(`request.${String(prop)}`);
          return bindMethodIfNeeded(Reflect.get(target, prop, target), target);
        case "clone":
          return () => wrapRequest(target.clone());
        default:
          return bindMethodIfNeeded(Reflect.get(target, prop, target), target);
      }
    } });
  };
  return {
    request: wrapRequest(request),
    didAccessDynamicRequest() {
      return didAccessDynamicRequest;
    }
  };
}
function getAppRouteHandlerRevalidateSeconds(handler2) {
  return typeof handler2.revalidate === "number" && handler2.revalidate > 0 && handler2.revalidate !== Infinity ? handler2.revalidate : null;
}
function hasAppRouteHandlerDefaultExport(handler2) {
  return typeof handler2.default === "function";
}
function resolveAppRouteHandlerMethod(handler2, method) {
  const exportedMethods = collectRouteHandlerMethods(handler2);
  const allowHeaderForOptions = buildRouteHandlerAllowHeader(exportedMethods);
  const shouldAutoRespondToOptions = method === "OPTIONS" && typeof handler2.OPTIONS !== "function";
  let handlerFn = typeof handler2[method] === "function" ? handler2[method] : void 0;
  let isAutoHead = false;
  if (method === "HEAD" && typeof handler2.HEAD !== "function" && typeof handler2.GET === "function") {
    handlerFn = handler2.GET;
    isAutoHead = true;
  }
  return {
    allowHeaderForOptions,
    exportedMethods,
    handlerFn,
    isAutoHead,
    shouldAutoRespondToOptions
  };
}
function shouldReadAppRouteHandlerCache(options) {
  return options.revalidateSeconds !== null && options.dynamicConfig !== "force-dynamic" && !options.isKnownDynamic && (options.method === "GET" || options.isAutoHead) && typeof options.handlerFn === "function";
}
function shouldApplyAppRouteHandlerRevalidateHeader(options) {
  return options.revalidateSeconds !== null && !options.dynamicUsedInHandler && (options.method === "GET" || options.isAutoHead) && !options.handlerSetCacheControl;
}
function shouldWriteAppRouteHandlerCache(options) {
  return options.isProduction && options.revalidateSeconds !== null && options.dynamicConfig !== "force-dynamic" && shouldApplyAppRouteHandlerRevalidateHeader(options);
}
function resolveAppRouteHandlerSpecialError(error, requestUrl) {
  if (!(error && typeof error === "object" && "digest" in error)) return null;
  const digest = String(error.digest);
  if (digest.startsWith("NEXT_REDIRECT;")) {
    const parts = digest.split(";");
    const redirectUrl = decodeURIComponent(parts[2]);
    return {
      kind: "redirect",
      location: new URL(redirectUrl, requestUrl).toString(),
      statusCode: parts[3] ? parseInt(parts[3], 10) : 307
    };
  }
  if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;")) return {
    kind: "status",
    statusCode: digest === "NEXT_NOT_FOUND" ? 404 : parseInt(digest.split(";")[1], 10)
  };
  return null;
}
function buildRouteHandlerCacheControl(cacheState, revalidateSeconds) {
  if (cacheState === "STALE") return "s-maxage=0, stale-while-revalidate";
  return `s-maxage=${revalidateSeconds}, stale-while-revalidate`;
}
function applyRouteHandlerMiddlewareContext(response, middlewareContext) {
  if (!middlewareContext.headers && middlewareContext.status == null) return response;
  const responseHeaders = new Headers(response.headers);
  if (middlewareContext.headers) for (const [key, value] of middlewareContext.headers) responseHeaders.append(key, value);
  return new Response(response.body, {
    status: middlewareContext.status ?? response.status,
    statusText: response.statusText,
    headers: responseHeaders
  });
}
function buildRouteHandlerCachedResponse(cachedValue, options) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(cachedValue.headers)) if (Array.isArray(value)) for (const entry of value) headers.append(key, entry);
  else headers.set(key, value);
  headers.set("X-Vinext-Cache", options.cacheState);
  headers.set("Cache-Control", buildRouteHandlerCacheControl(options.cacheState, options.revalidateSeconds));
  return new Response(options.isHead ? null : cachedValue.body, {
    status: cachedValue.status,
    headers
  });
}
function applyRouteHandlerRevalidateHeader(response, revalidateSeconds) {
  response.headers.set("cache-control", buildRouteHandlerCacheControl("HIT", revalidateSeconds));
}
function markRouteHandlerCacheMiss(response) {
  response.headers.set("X-Vinext-Cache", "MISS");
}
async function buildAppRouteCacheValue(response) {
  const body = await response.arrayBuffer();
  const headers = {};
  response.headers.forEach((value, key) => {
    if (key !== "x-vinext-cache" && key !== "cache-control") headers[key] = value;
  });
  return {
    kind: "APP_ROUTE",
    body,
    status: response.status,
    headers
  };
}
function finalizeRouteHandlerResponse(response, options) {
  const { pendingCookies, draftCookie, isHead } = options;
  if (pendingCookies.length === 0 && !draftCookie && !isHead) return response;
  const headers = new Headers(response.headers);
  for (const cookie of pendingCookies) headers.append("Set-Cookie", cookie);
  if (draftCookie) headers.append("Set-Cookie", draftCookie);
  return new Response(isHead ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
async function runAppRouteHandler(options) {
  options.consumeDynamicUsage();
  const trackedRequest = createTrackedAppRouteRequest(options.request, {
    basePath: options.basePath,
    i18n: options.i18n,
    onDynamicAccess() {
      options.markDynamicUsage();
    }
  });
  const response = await options.handlerFn(trackedRequest.request, { params: options.params });
  return {
    dynamicUsedInHandler: options.consumeDynamicUsage(),
    response
  };
}
async function executeAppRouteHandler(options) {
  const previousHeadersPhase = options.setHeadersAccessPhase("route-handler");
  try {
    const { dynamicUsedInHandler, response } = await runAppRouteHandler(options);
    const handlerSetCacheControl = response.headers.has("cache-control");
    if (dynamicUsedInHandler) markKnownDynamicAppRoute(options.routePattern);
    if (shouldApplyAppRouteHandlerRevalidateHeader({
      dynamicUsedInHandler,
      handlerSetCacheControl,
      isAutoHead: options.isAutoHead,
      method: options.method,
      revalidateSeconds: options.revalidateSeconds
    })) {
      const revalidateSeconds = options.revalidateSeconds;
      if (revalidateSeconds == null) throw new Error("Expected route handler revalidate seconds");
      applyRouteHandlerRevalidateHeader(response, revalidateSeconds);
    }
    if (shouldWriteAppRouteHandlerCache({
      dynamicConfig: options.handler.dynamic,
      dynamicUsedInHandler,
      handlerSetCacheControl,
      isAutoHead: options.isAutoHead,
      isProduction: options.isProduction,
      method: options.method,
      revalidateSeconds: options.revalidateSeconds
    })) {
      markRouteHandlerCacheMiss(response);
      const routeClone = response.clone();
      const routeKey = options.isrRouteKey(options.cleanPathname);
      const revalidateSeconds = options.revalidateSeconds;
      if (revalidateSeconds == null) throw new Error("Expected route handler cache revalidate seconds");
      const routeTags = options.buildPageCacheTags(options.cleanPathname, options.getCollectedFetchTags());
      const routeWritePromise = (async () => {
        try {
          const routeCacheValue = await buildAppRouteCacheValue(routeClone);
          await options.isrSet(routeKey, routeCacheValue, revalidateSeconds, routeTags);
          options.isrDebug?.("route cache written", routeKey);
        } catch (cacheErr) {
          console.error("[vinext] ISR route cache write error:", cacheErr);
        }
      })();
      options.executionContext?.waitUntil(routeWritePromise);
    }
    const pendingCookies = options.getAndClearPendingCookies();
    const draftCookie = options.getDraftModeCookieHeader();
    options.clearRequestContext();
    return applyRouteHandlerMiddlewareContext(finalizeRouteHandlerResponse(response, {
      pendingCookies,
      draftCookie,
      isHead: options.isAutoHead
    }), options.middlewareContext);
  } catch (error) {
    options.getAndClearPendingCookies();
    const specialError = resolveAppRouteHandlerSpecialError(error, options.request.url);
    options.clearRequestContext();
    if (specialError) {
      if (specialError.kind === "redirect") return applyRouteHandlerMiddlewareContext(new Response(null, {
        status: specialError.statusCode,
        headers: { Location: specialError.location }
      }), options.middlewareContext);
      return applyRouteHandlerMiddlewareContext(new Response(null, { status: specialError.statusCode }), options.middlewareContext);
    }
    console.error("[vinext] Route handler error:", error);
    options.reportRequestError(error instanceof Error ? error : new Error(String(error)), {
      path: options.cleanPathname,
      method: options.request.method,
      headers: Object.fromEntries(options.request.headers.entries())
    }, {
      routerKind: "App Router",
      routePath: options.routePattern,
      routeType: "route"
    });
    return applyRouteHandlerMiddlewareContext(new Response(null, { status: 500 }), options.middlewareContext);
  } finally {
    options.setHeadersAccessPhase(previousHeadersPhase);
  }
}
function getCachedAppRouteValue(entry) {
  return entry?.value.value && entry.value.value.kind === "APP_ROUTE" ? entry.value.value : null;
}
async function readAppRouteHandlerCacheResponse(options) {
  const routeKey = options.isrRouteKey(options.cleanPathname);
  try {
    const cached = await options.isrGet(routeKey);
    const cachedValue = getCachedAppRouteValue(cached);
    if (cachedValue && !cached?.isStale) {
      options.isrDebug?.("HIT (route)", options.cleanPathname);
      options.clearRequestContext();
      return applyRouteHandlerMiddlewareContext(buildRouteHandlerCachedResponse(cachedValue, {
        cacheState: "HIT",
        isHead: options.isAutoHead,
        revalidateSeconds: options.revalidateSeconds
      }), options.middlewareContext);
    }
    if (cached?.isStale && cachedValue) {
      const staleValue = cachedValue;
      const revalidateSearchParams = new URLSearchParams(options.revalidateSearchParams);
      options.scheduleBackgroundRegeneration(routeKey, async () => {
        await options.runInRevalidationContext(async () => {
          options.setNavigationContext({
            pathname: options.cleanPathname,
            searchParams: revalidateSearchParams,
            params: options.params
          });
          const { dynamicUsedInHandler, response } = await runAppRouteHandler({
            basePath: options.basePath,
            consumeDynamicUsage: options.consumeDynamicUsage,
            handlerFn: options.handlerFn,
            i18n: options.i18n,
            markDynamicUsage: options.markDynamicUsage,
            params: options.params,
            request: new Request(options.requestUrl, { method: "GET" })
          });
          options.setNavigationContext(null);
          if (dynamicUsedInHandler) {
            markKnownDynamicAppRoute(options.routePattern);
            options.isrDebug?.("route regen skipped (dynamic usage)", options.cleanPathname);
            return;
          }
          const routeTags = options.buildPageCacheTags(options.cleanPathname, options.getCollectedFetchTags());
          const routeCacheValue = await buildAppRouteCacheValue(response);
          await options.isrSet(routeKey, routeCacheValue, options.revalidateSeconds, routeTags);
          options.isrDebug?.("route regen complete", routeKey);
        });
      });
      options.isrDebug?.("STALE (route)", options.cleanPathname);
      options.clearRequestContext();
      return applyRouteHandlerMiddlewareContext(buildRouteHandlerCachedResponse(staleValue, {
        cacheState: "STALE",
        isHead: options.isAutoHead,
        revalidateSeconds: options.revalidateSeconds
      }), options.middlewareContext);
    }
  } catch (routeCacheError) {
    console.error("[vinext] ISR route cache read error:", routeCacheError);
  }
  return null;
}
var MemoryCacheHandler = class {
  store = /* @__PURE__ */ new Map();
  tagRevalidatedAt = /* @__PURE__ */ new Map();
  async get(key, _ctx) {
    const entry = this.store.get(key);
    if (!entry) return null;
    for (const tag of entry.tags) {
      const revalidatedAt = this.tagRevalidatedAt.get(tag);
      if (revalidatedAt && revalidatedAt >= entry.lastModified) {
        this.store.delete(key);
        return null;
      }
    }
    if (entry.revalidateAt !== null && Date.now() > entry.revalidateAt) return {
      lastModified: entry.lastModified,
      value: entry.value,
      cacheState: "stale"
    };
    return {
      lastModified: entry.lastModified,
      value: entry.value
    };
  }
  async set(key, data, ctx) {
    const typedCtx = ctx;
    const tagSet = /* @__PURE__ */ new Set();
    if (data && "tags" in data && Array.isArray(data.tags)) for (const t of data.tags) tagSet.add(t);
    if (typedCtx && Array.isArray(typedCtx.tags)) for (const t of typedCtx.tags) tagSet.add(t);
    const tags = [...tagSet];
    let effectiveRevalidate;
    if (typedCtx) {
      const revalidate = typedCtx.cacheControl?.revalidate ?? typedCtx.revalidate;
      if (typeof revalidate === "number") effectiveRevalidate = revalidate;
    }
    if (data && "revalidate" in data && typeof data.revalidate === "number") effectiveRevalidate = data.revalidate;
    if (effectiveRevalidate === 0) return;
    const revalidateAt = typeof effectiveRevalidate === "number" && effectiveRevalidate > 0 ? Date.now() + effectiveRevalidate * 1e3 : null;
    this.store.set(key, {
      value: data,
      tags,
      lastModified: Date.now(),
      revalidateAt
    });
  }
  async revalidateTag(tags, _durations) {
    const tagList = Array.isArray(tags) ? tags : [tags];
    const now = Date.now();
    for (const tag of tagList) this.tagRevalidatedAt.set(tag, now);
  }
  resetRequestCache() {
  }
};
const _HANDLER_KEY = /* @__PURE__ */ Symbol.for("vinext.cacheHandler");
const _gHandler = globalThis;
function _getActiveHandler() {
  return _gHandler[_HANDLER_KEY] ?? (_gHandler[_HANDLER_KEY] = new MemoryCacheHandler());
}
function getCacheHandler() {
  return _getActiveHandler();
}
const _ALS_KEY$2 = /* @__PURE__ */ Symbol.for("vinext.cache.als");
const _FALLBACK_KEY$2 = /* @__PURE__ */ Symbol.for("vinext.cache.fallback");
const _g$3 = globalThis;
const _cacheAls = _g$3[_ALS_KEY$2] ??= new AsyncLocalStorage$1();
const _cacheFallbackState = _g$3[_FALLBACK_KEY$2] ??= { requestScopedCacheLife: null };
function _getCacheState() {
  if (isInsideUnifiedScope()) return getRequestContext();
  return _cacheAls.getStore() ?? _cacheFallbackState;
}
function _consumeRequestScopedCacheLife() {
  const state = _getCacheState();
  const config = state.requestScopedCacheLife;
  state.requestScopedCacheLife = null;
  return config;
}
const _UNSTABLE_CACHE_ALS_KEY = /* @__PURE__ */ Symbol.for("vinext.unstableCache.als");
_g$3[_UNSTABLE_CACHE_ALS_KEY] ??= new AsyncLocalStorage$1();
const _PENDING_REGEN_KEY = /* @__PURE__ */ Symbol.for("vinext.isrCache.pendingRegenerations");
const _g$2 = globalThis;
_g$2[_PENDING_REGEN_KEY] ??= /* @__PURE__ */ new Map();
function buildAppPageCacheValue(html, rscData, status) {
  return {
    kind: "APP_PAGE",
    html,
    rscData,
    headers: void 0,
    postponed: void 0,
    status
  };
}
const _REVALIDATE_KEY = /* @__PURE__ */ Symbol.for("vinext.isrCache.revalidateDurations");
_g$2[_REVALIDATE_KEY] ??= /* @__PURE__ */ new Map();
function buildAppPageCacheControl(cacheState, revalidateSeconds) {
  if (cacheState === "STALE") return "s-maxage=0, stale-while-revalidate";
  return `s-maxage=${revalidateSeconds}, stale-while-revalidate`;
}
function getCachedAppPageValue(entry) {
  return entry?.value.value && entry.value.value.kind === "APP_PAGE" ? entry.value.value : null;
}
function buildAppPageCachedResponse(cachedValue, options) {
  const status = cachedValue.status || 200;
  const headers = {
    "Cache-Control": buildAppPageCacheControl(options.cacheState, options.revalidateSeconds),
    Vary: "RSC, Accept",
    "X-Vinext-Cache": options.cacheState
  };
  if (options.isRscRequest) {
    if (!cachedValue.rscData) return null;
    return new Response(cachedValue.rscData, {
      status,
      headers: {
        "Content-Type": "text/x-component; charset=utf-8",
        ...headers
      }
    });
  }
  if (typeof cachedValue.html !== "string" || cachedValue.html.length === 0) return null;
  return new Response(cachedValue.html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...headers
    }
  });
}
async function readAppPageCacheResponse(options) {
  const isrKey = options.isRscRequest ? options.isrRscKey(options.cleanPathname) : options.isrHtmlKey(options.cleanPathname);
  try {
    const cached = await options.isrGet(isrKey);
    const cachedValue = getCachedAppPageValue(cached);
    if (cachedValue && !cached?.isStale) {
      const hitResponse = buildAppPageCachedResponse(cachedValue, {
        cacheState: "HIT",
        isRscRequest: options.isRscRequest,
        revalidateSeconds: options.revalidateSeconds
      });
      if (hitResponse) {
        options.isrDebug?.(options.isRscRequest ? "HIT (RSC)" : "HIT (HTML)", options.cleanPathname);
        options.clearRequestContext();
        return hitResponse;
      }
      options.isrDebug?.("MISS (empty cached entry)", options.cleanPathname);
    }
    if (cached?.isStale && cachedValue) {
      options.scheduleBackgroundRegeneration(options.cleanPathname, async () => {
        const revalidatedPage = await options.renderFreshPageForCache();
        await Promise.all([options.isrSet(options.isrHtmlKey(options.cleanPathname), buildAppPageCacheValue(revalidatedPage.html, void 0, 200), options.revalidateSeconds, revalidatedPage.tags), options.isrSet(options.isrRscKey(options.cleanPathname), buildAppPageCacheValue("", revalidatedPage.rscData, 200), options.revalidateSeconds, revalidatedPage.tags)]);
        options.isrDebug?.("regen complete", options.cleanPathname);
      });
      const staleResponse = buildAppPageCachedResponse(cachedValue, {
        cacheState: "STALE",
        isRscRequest: options.isRscRequest,
        revalidateSeconds: options.revalidateSeconds
      });
      if (staleResponse) {
        options.isrDebug?.(options.isRscRequest ? "STALE (RSC)" : "STALE (HTML)", options.cleanPathname);
        options.clearRequestContext();
        return staleResponse;
      }
      options.isrDebug?.("STALE MISS (empty stale entry)", options.cleanPathname);
    }
    if (!cached) options.isrDebug?.("MISS (no cache entry)", options.cleanPathname);
  } catch (isrReadError) {
    console.error("[vinext] ISR cache read error:", isrReadError);
  }
  return null;
}
function finalizeAppPageHtmlCacheResponse(response, options) {
  if (!response.body) return response;
  const [streamForClient, streamForCache] = response.body.tee();
  const htmlKey = options.isrHtmlKey(options.cleanPathname);
  const rscKey = options.isrRscKey(options.cleanPathname);
  const cachePromise = (async () => {
    try {
      const reader = streamForCache.getReader();
      const decoder = new TextDecoder();
      const chunks = [];
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(decoder.decode(value, { stream: true }));
      }
      chunks.push(decoder.decode());
      const pageTags = options.getPageTags();
      const writes = [options.isrSet(htmlKey, buildAppPageCacheValue(chunks.join(""), void 0, 200), options.revalidateSeconds, pageTags)];
      if (options.capturedRscDataPromise) writes.push(options.capturedRscDataPromise.then((rscData) => options.isrSet(rscKey, buildAppPageCacheValue("", rscData, 200), options.revalidateSeconds, pageTags)));
      await Promise.all(writes);
      options.isrDebug?.("HTML cache written", htmlKey);
    } catch (cacheError) {
      console.error("[vinext] ISR cache write error:", cacheError);
    }
  })();
  options.waitUntil?.(cachePromise);
  return new Response(streamForClient, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
function scheduleAppPageRscCacheWrite(options) {
  const capturedRscDataPromise = options.capturedRscDataPromise;
  if (!capturedRscDataPromise || options.dynamicUsedDuringBuild) return false;
  const rscKey = options.isrRscKey(options.cleanPathname);
  const cachePromise = (async () => {
    try {
      const rscData = await capturedRscDataPromise;
      if (options.consumeDynamicUsage()) {
        options.isrDebug?.("RSC cache write skipped (dynamic usage during render)", rscKey);
        return;
      }
      await options.isrSet(rscKey, buildAppPageCacheValue("", rscData, 200), options.revalidateSeconds, options.getPageTags());
      options.isrDebug?.("RSC cache written", rscKey);
    } catch (cacheError) {
      console.error("[vinext] ISR RSC cache write error:", cacheError);
    }
  })();
  options.waitUntil?.(cachePromise);
  return true;
}
function isPromiseLike(value) {
  return Boolean(value && (typeof value === "object" || typeof value === "function") && "then" in value && typeof value.then === "function");
}
function getAppPageStatusText(statusCode) {
  return statusCode === 403 ? "Forbidden" : statusCode === 401 ? "Unauthorized" : "Not Found";
}
function resolveAppPageSpecialError(error) {
  if (!(error && typeof error === "object" && "digest" in error)) return null;
  const digest = String(error.digest);
  if (digest.startsWith("NEXT_REDIRECT;")) {
    const parts = digest.split(";");
    return {
      kind: "redirect",
      location: decodeURIComponent(parts[2]),
      statusCode: parts[3] ? parseInt(parts[3], 10) : 307
    };
  }
  if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;")) return {
    kind: "http-access-fallback",
    statusCode: digest === "NEXT_NOT_FOUND" ? 404 : parseInt(digest.split(";")[1], 10)
  };
  return null;
}
async function buildAppPageSpecialErrorResponse(options) {
  if (options.specialError.kind === "redirect") {
    options.clearRequestContext();
    return Response.redirect(new URL(options.specialError.location, options.requestUrl), options.specialError.statusCode);
  }
  if (options.renderFallbackPage) {
    const fallbackResponse = await options.renderFallbackPage(options.specialError.statusCode);
    if (fallbackResponse) return fallbackResponse;
  }
  options.clearRequestContext();
  return new Response(getAppPageStatusText(options.specialError.statusCode), { status: options.specialError.statusCode });
}
async function probeAppPageLayouts(options) {
  return options.runWithSuppressedHookWarning(async () => {
    for (let layoutIndex = options.layoutCount - 1; layoutIndex >= 0; layoutIndex--) try {
      const layoutResult = options.probeLayoutAt(layoutIndex);
      if (isPromiseLike(layoutResult)) await layoutResult;
    } catch (error) {
      const response = await options.onLayoutError(error, layoutIndex);
      if (response) return response;
    }
    return null;
  });
}
async function probeAppPageComponent(options) {
  return options.runWithSuppressedHookWarning(async () => {
    try {
      const pageResult = options.probePage();
      if (isPromiseLike(pageResult)) if (options.awaitAsyncResult) await pageResult;
      else Promise.resolve(pageResult).catch(() => {
      });
    } catch (error) {
      return options.onError(error);
    }
    return null;
  });
}
async function readAppPageTextStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const chunks = [];
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(decoder.decode(value, { stream: true }));
  }
  chunks.push(decoder.decode());
  return chunks.join("");
}
async function readAppPageBinaryStream(stream) {
  const reader = stream.getReader();
  const chunks = [];
  let totalLength = 0;
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.byteLength;
  }
  const buffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer.buffer;
}
function teeAppPageRscStreamForCapture(stream, shouldCapture) {
  if (!shouldCapture) return {
    capturedRscDataPromise: null,
    responseStream: stream
  };
  const [responseStream, captureStream] = stream.tee();
  return {
    capturedRscDataPromise: readAppPageBinaryStream(captureStream),
    responseStream
  };
}
function buildAppPageFontLinkHeader(preloads) {
  if (!preloads || preloads.length === 0) return "";
  return preloads.map((preload) => `<${preload.href}>; rel=preload; as=font; type=${preload.type}; crossorigin`).join(", ");
}
function resolveAppPageHttpAccessBoundaryComponent(options) {
  let boundaryModule;
  if (options.statusCode === 403) boundaryModule = options.routeForbiddenModule ?? options.rootForbiddenModule;
  else if (options.statusCode === 401) boundaryModule = options.routeUnauthorizedModule ?? options.rootUnauthorizedModule;
  else boundaryModule = options.routeNotFoundModule ?? options.rootNotFoundModule;
  return options.getDefaultExport(boundaryModule) ?? null;
}
function resolveAppPageErrorBoundary(options) {
  const pageErrorComponent = options.getDefaultExport(options.pageErrorModule);
  if (pageErrorComponent) return {
    component: pageErrorComponent,
    isGlobalError: false
  };
  if (options.layoutErrorModules) for (let index = options.layoutErrorModules.length - 1; index >= 0; index--) {
    const layoutErrorComponent = options.getDefaultExport(options.layoutErrorModules[index]);
    if (layoutErrorComponent) return {
      component: layoutErrorComponent,
      isGlobalError: false
    };
  }
  const globalErrorComponent = options.getDefaultExport(options.globalErrorModule);
  return {
    component: globalErrorComponent ?? null,
    isGlobalError: Boolean(globalErrorComponent)
  };
}
function wrapAppPageBoundaryElement(options) {
  let element = options.element;
  if (!options.skipLayoutWrapping) {
    const asyncParams = options.makeThenableParams(options.matchedParams);
    for (let index = options.layoutModules.length - 1; index >= 0; index--) {
      const layoutComponent = options.getDefaultExport(options.layoutModules[index]);
      if (!layoutComponent) continue;
      element = options.renderLayout(layoutComponent, element, asyncParams);
      if (options.isRscRequest && options.renderLayoutSegmentProvider && options.resolveChildSegments) {
        const treePosition = options.layoutTreePositions ? options.layoutTreePositions[index] : 0;
        const childSegments = options.resolveChildSegments(options.routeSegments ?? [], treePosition, options.matchedParams);
        element = options.renderLayoutSegmentProvider(childSegments, element);
      }
    }
  }
  if (options.isRscRequest && options.includeGlobalErrorBoundary && options.globalErrorComponent) element = options.renderErrorBoundary(options.globalErrorComponent, element);
  return element;
}
async function renderAppPageBoundaryResponse(options) {
  const rscStream = options.renderToReadableStream(options.element, { onError: options.createRscOnErrorHandler() });
  if (options.isRscRequest) return new Response(rscStream, {
    status: options.status,
    headers: {
      "Content-Type": "text/x-component; charset=utf-8",
      Vary: "RSC, Accept"
    }
  });
  return options.createHtmlResponse(rscStream, options.status);
}
function createAppPageFontData(options) {
  return {
    links: options.getLinks(),
    preloads: options.getPreloads(),
    styles: options.getStyles()
  };
}
async function renderAppPageHtmlStream(options) {
  return options.ssrHandler.handleSsr(options.rscStream, options.navigationContext, options.fontData);
}
function deferUntilStreamConsumed(stream, onFlush) {
  let called = false;
  const once = () => {
    if (!called) {
      called = true;
      onFlush();
    }
  };
  const cleanup = new TransformStream({ flush() {
    once();
  } });
  const reader = stream.pipeThrough(cleanup).getReader();
  return new ReadableStream({
    pull(controller) {
      return reader.read().then(({ done, value }) => {
        if (done) controller.close();
        else controller.enqueue(value);
      });
    },
    cancel(reason) {
      once();
      return reader.cancel(reason);
    }
  });
}
async function renderAppPageHtmlResponse(options) {
  const safeStream = deferUntilStreamConsumed(await renderAppPageHtmlStream(options), () => {
    options.clearRequestContext();
  });
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    Vary: "RSC, Accept"
  };
  if (options.fontLinkHeader) headers.Link = options.fontLinkHeader;
  return new Response(safeStream, {
    status: options.status,
    headers
  });
}
async function renderAppPageHtmlStreamWithRecovery(options) {
  try {
    const htmlStream = await options.renderHtmlStream();
    options.onShellRendered?.();
    return {
      htmlStream,
      response: null
    };
  } catch (error) {
    const specialError = options.resolveSpecialError(error);
    if (specialError) return {
      htmlStream: null,
      response: await options.renderSpecialErrorResponse(specialError)
    };
    const boundaryResponse = await options.renderErrorBoundaryResponse(error);
    if (boundaryResponse) return {
      htmlStream: null,
      response: boundaryResponse
    };
    throw error;
  }
}
function createAppPageRscErrorTracker(baseOnError) {
  let capturedError = null;
  return {
    getCapturedError() {
      return capturedError;
    },
    onRenderError(error, requestInfo, errorContext) {
      if (!(error && typeof error === "object" && "digest" in error)) capturedError = error;
      return baseOnError(error, requestInfo, errorContext);
    }
  };
}
function shouldRerenderAppPageWithGlobalError(options) {
  return Boolean(options.capturedError) && !options.hasLocalBoundary;
}
function getDefaultExport(module) {
  return module?.default ?? null;
}
async function resolveAppPageLayoutHead(layoutModules, params) {
  const filteredLayouts = layoutModules.filter(Boolean);
  const layoutMetadataPromises = [];
  let accumulatedMetadata = Promise.resolve({});
  for (let index = 0; index < filteredLayouts.length; index++) {
    const parentForLayout = accumulatedMetadata;
    const metadataPromise = resolveModuleMetadata(filteredLayouts[index], params, void 0, parentForLayout).catch((error) => {
      console.error("[vinext] Layout generateMetadata() failed:", error);
      return null;
    });
    layoutMetadataPromises.push(metadataPromise);
    accumulatedMetadata = metadataPromise.then(async (metadataResult) => {
      if (metadataResult) return mergeMetadata([await parentForLayout, metadataResult]);
      return parentForLayout;
    });
  }
  const [metadataResults, viewportResults] = await Promise.all([Promise.all(layoutMetadataPromises), Promise.all(filteredLayouts.map((layoutModule) => resolveModuleViewport(layoutModule, params).catch((error) => {
    console.error("[vinext] Layout generateViewport() failed:", error);
    return null;
  })))]);
  const metadataList = metadataResults.filter(Boolean);
  const viewportList = viewportResults.filter(Boolean);
  return {
    metadata: metadataList.length > 0 ? mergeMetadata(metadataList) : null,
    viewport: mergeViewport(viewportList)
  };
}
function wrapRenderedBoundaryElement(options) {
  return wrapAppPageBoundaryElement({
    element: options.element,
    getDefaultExport,
    globalErrorComponent: getDefaultExport(options.globalErrorModule),
    includeGlobalErrorBoundary: options.includeGlobalErrorBoundary,
    isRscRequest: options.isRscRequest,
    layoutModules: options.layoutModules,
    layoutTreePositions: options.layoutTreePositions,
    makeThenableParams: options.makeThenableParams,
    matchedParams: options.matchedParams,
    renderErrorBoundary(GlobalErrorComponent, children) {
      return react_reactServerExports.createElement(ErrorBoundary, {
        fallback: GlobalErrorComponent,
        children
      });
    },
    renderLayout(LayoutComponent, children, asyncParams) {
      return react_reactServerExports.createElement(LayoutComponent, {
        children,
        params: asyncParams
      });
    },
    renderLayoutSegmentProvider(childSegments, children) {
      return react_reactServerExports.createElement(LayoutSegmentProvider, { childSegments }, children);
    },
    resolveChildSegments: options.resolveChildSegments,
    routeSegments: options.routeSegments ?? [],
    skipLayoutWrapping: options.skipLayoutWrapping
  });
}
async function renderAppPageBoundaryElementResponse(options) {
  const pathname = new URL(options.requestUrl).pathname;
  return renderAppPageBoundaryResponse({
    async createHtmlResponse(rscStream, responseStatus) {
      const fontData = createAppPageFontData({
        getLinks: options.getFontLinks,
        getPreloads: options.getFontPreloads,
        getStyles: options.getFontStyles
      });
      const ssrHandler = await options.loadSsrHandler();
      return renderAppPageHtmlResponse({
        clearRequestContext: options.clearRequestContext,
        fontData,
        fontLinkHeader: options.buildFontLinkHeader(fontData.preloads),
        navigationContext: options.getNavigationContext(),
        rscStream,
        ssrHandler,
        status: responseStatus
      });
    },
    createRscOnErrorHandler() {
      return options.createRscOnErrorHandler(pathname, options.routePattern ?? pathname);
    },
    element: options.element,
    isRscRequest: options.isRscRequest,
    renderToReadableStream: options.renderToReadableStream,
    status: options.status
  });
}
async function renderAppPageHttpAccessFallback(options) {
  const boundaryComponent = options.boundaryComponent ?? resolveAppPageHttpAccessBoundaryComponent({
    getDefaultExport,
    rootForbiddenModule: options.rootForbiddenModule,
    rootNotFoundModule: options.rootNotFoundModule,
    rootUnauthorizedModule: options.rootUnauthorizedModule,
    routeForbiddenModule: options.route?.forbidden,
    routeNotFoundModule: options.route?.notFound,
    routeUnauthorizedModule: options.route?.unauthorized,
    statusCode: options.statusCode
  });
  if (!boundaryComponent) return null;
  const layoutModules = options.layoutModules ?? options.route?.layouts ?? options.rootLayouts;
  const { metadata: metadata2, viewport } = await resolveAppPageLayoutHead(layoutModules, options.matchedParams);
  const headElements = [react_reactServerExports.createElement("meta", {
    charSet: "utf-8",
    key: "charset"
  }), react_reactServerExports.createElement("meta", {
    content: "noindex",
    key: "robots",
    name: "robots"
  })];
  if (metadata2) headElements.push(react_reactServerExports.createElement(MetadataHead, {
    key: "metadata",
    metadata: metadata2
  }));
  headElements.push(react_reactServerExports.createElement(ViewportHead, {
    key: "viewport",
    viewport
  }));
  const element = wrapRenderedBoundaryElement({
    element: react_reactServerExports.createElement(react_reactServerExports.Fragment, null, ...headElements, react_reactServerExports.createElement(boundaryComponent)),
    globalErrorModule: options.globalErrorModule,
    includeGlobalErrorBoundary: true,
    isRscRequest: options.isRscRequest,
    layoutModules,
    layoutTreePositions: options.route?.layoutTreePositions,
    makeThenableParams: options.makeThenableParams,
    matchedParams: options.matchedParams,
    resolveChildSegments: options.resolveChildSegments,
    routeSegments: options.route?.routeSegments
  });
  return renderAppPageBoundaryElementResponse({
    ...options,
    element,
    routePattern: options.route?.pattern,
    status: options.statusCode
  });
}
async function renderAppPageErrorBoundary(options) {
  const errorBoundary = resolveAppPageErrorBoundary({
    getDefaultExport,
    globalErrorModule: options.globalErrorModule,
    layoutErrorModules: options.route?.errors,
    pageErrorModule: options.route?.error
  });
  if (!errorBoundary.component) return null;
  const rawError = options.error instanceof Error ? options.error : new Error(String(options.error));
  const errorObject = options.sanitizeErrorForClient(rawError);
  const matchedParams = options.matchedParams ?? options.route?.params ?? {};
  const layoutModules = options.route?.layouts ?? options.rootLayouts;
  const element = wrapRenderedBoundaryElement({
    element: react_reactServerExports.createElement(errorBoundary.component, { error: errorObject }),
    globalErrorModule: options.globalErrorModule,
    includeGlobalErrorBoundary: !errorBoundary.isGlobalError,
    isRscRequest: options.isRscRequest,
    layoutModules,
    layoutTreePositions: options.route?.layoutTreePositions,
    makeThenableParams: options.makeThenableParams,
    matchedParams,
    resolveChildSegments: options.resolveChildSegments,
    routeSegments: options.route?.routeSegments,
    skipLayoutWrapping: errorBoundary.isGlobalError
  });
  return renderAppPageBoundaryElementResponse({
    ...options,
    element,
    routePattern: options.route?.pattern,
    status: 200
  });
}
async function probeAppPageBeforeRender(options) {
  if (options.layoutCount > 0) {
    const layoutProbeResponse = await probeAppPageLayouts({
      layoutCount: options.layoutCount,
      async onLayoutError(layoutError, layoutIndex) {
        const specialError = options.resolveSpecialError(layoutError);
        if (!specialError) return null;
        return options.renderLayoutSpecialError(specialError, layoutIndex);
      },
      probeLayoutAt: options.probeLayoutAt,
      runWithSuppressedHookWarning(probe) {
        return options.runWithSuppressedHookWarning(probe);
      }
    });
    if (layoutProbeResponse) return layoutProbeResponse;
  }
  return probeAppPageComponent({
    awaitAsyncResult: !options.hasLoadingBoundary,
    async onError(pageError) {
      const specialError = options.resolveSpecialError(pageError);
      if (specialError) return options.renderPageSpecialError(specialError);
      return null;
    },
    probePage: options.probePage,
    runWithSuppressedHookWarning(probe) {
      return options.runWithSuppressedHookWarning(probe);
    }
  });
}
const STATIC_CACHE_CONTROL = "s-maxage=31536000, stale-while-revalidate";
const NO_STORE_CACHE_CONTROL = "no-store, must-revalidate";
function buildRevalidateCacheControl(revalidateSeconds) {
  return `s-maxage=${revalidateSeconds}, stale-while-revalidate`;
}
function applyTimingHeader(headers, timing) {
  if (!timing) return;
  const handlerStart = Math.round(timing.handlerStart);
  const compileMs = timing.compileEnd !== void 0 ? Math.round(timing.compileEnd - timing.handlerStart) : -1;
  const renderMs = timing.responseKind === "html" && timing.renderEnd !== void 0 && timing.compileEnd !== void 0 ? Math.round(timing.renderEnd - timing.compileEnd) : -1;
  headers.set("x-vinext-timing", `${handlerStart},${compileMs},${renderMs}`);
}
function resolveAppPageRscResponsePolicy(options) {
  if (options.isForceDynamic || options.dynamicUsedDuringBuild) return { cacheControl: NO_STORE_CACHE_CONTROL };
  if ((options.isForceStatic || options.isDynamicError) && !options.revalidateSeconds || options.revalidateSeconds === Infinity) return {
    cacheControl: STATIC_CACHE_CONTROL,
    cacheState: "STATIC"
  };
  if (options.revalidateSeconds) return {
    cacheControl: buildRevalidateCacheControl(options.revalidateSeconds),
    cacheState: options.isProduction ? "MISS" : void 0
  };
  return {};
}
function resolveAppPageHtmlResponsePolicy(options) {
  if (options.isForceDynamic) return {
    cacheControl: NO_STORE_CACHE_CONTROL,
    shouldWriteToCache: false
  };
  if ((options.isForceStatic || options.isDynamicError) && (options.revalidateSeconds === null || options.revalidateSeconds === 0)) return {
    cacheControl: STATIC_CACHE_CONTROL,
    cacheState: "STATIC",
    shouldWriteToCache: false
  };
  if (options.dynamicUsedDuringRender) return {
    cacheControl: NO_STORE_CACHE_CONTROL,
    shouldWriteToCache: false
  };
  if (options.revalidateSeconds !== null && options.revalidateSeconds > 0 && options.revalidateSeconds !== Infinity) return {
    cacheControl: buildRevalidateCacheControl(options.revalidateSeconds),
    cacheState: options.isProduction ? "MISS" : void 0,
    shouldWriteToCache: options.isProduction
  };
  if (options.revalidateSeconds === Infinity) return {
    cacheControl: STATIC_CACHE_CONTROL,
    cacheState: "STATIC",
    shouldWriteToCache: false
  };
  return { shouldWriteToCache: false };
}
function buildAppPageRscResponse(body, options) {
  const headers = new Headers({
    "Content-Type": "text/x-component; charset=utf-8",
    Vary: "RSC, Accept"
  });
  if (options.params && Object.keys(options.params).length > 0) headers.set("X-Vinext-Params", encodeURIComponent(JSON.stringify(options.params)));
  if (options.policy.cacheControl) headers.set("Cache-Control", options.policy.cacheControl);
  if (options.policy.cacheState) headers.set("X-Vinext-Cache", options.policy.cacheState);
  if (options.middlewareContext.headers) for (const [key, value] of options.middlewareContext.headers) {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "set-cookie" || lowerKey === "vary") headers.append(key, value);
    else headers.set(key, value);
  }
  applyTimingHeader(headers, options.timing);
  return new Response(body, {
    status: options.middlewareContext.status ?? 200,
    headers
  });
}
function buildAppPageHtmlResponse(body, options) {
  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    Vary: "RSC, Accept"
  });
  if (options.policy.cacheControl) headers.set("Cache-Control", options.policy.cacheControl);
  if (options.policy.cacheState) headers.set("X-Vinext-Cache", options.policy.cacheState);
  if (options.draftCookie) headers.append("Set-Cookie", options.draftCookie);
  if (options.fontLinkHeader) headers.set("Link", options.fontLinkHeader);
  if (options.middlewareContext.headers) for (const [key, value] of options.middlewareContext.headers) headers.append(key, value);
  applyTimingHeader(headers, options.timing);
  return new Response(body, {
    status: options.middlewareContext.status ?? 200,
    headers
  });
}
function buildResponseTiming(options) {
  if (options.isProduction) return;
  return {
    compileEnd: options.compileEnd,
    handlerStart: options.handlerStart,
    renderEnd: options.renderEnd,
    responseKind: options.responseKind
  };
}
async function renderAppPageLifecycle(options) {
  const preRenderResponse = await probeAppPageBeforeRender({
    hasLoadingBoundary: options.hasLoadingBoundary,
    layoutCount: options.layoutCount,
    probeLayoutAt(layoutIndex) {
      return options.probeLayoutAt(layoutIndex);
    },
    probePage() {
      return options.probePage();
    },
    renderLayoutSpecialError(specialError, layoutIndex) {
      return options.renderLayoutSpecialError(specialError, layoutIndex);
    },
    renderPageSpecialError(specialError) {
      return options.renderPageSpecialError(specialError);
    },
    resolveSpecialError: resolveAppPageSpecialError,
    runWithSuppressedHookWarning(probe) {
      return options.runWithSuppressedHookWarning(probe);
    }
  });
  if (preRenderResponse) return preRenderResponse;
  const compileEnd = options.isProduction ? void 0 : performance.now();
  const rscErrorTracker = createAppPageRscErrorTracker(options.createRscOnErrorHandler(options.cleanPathname, options.routePattern));
  const rscStream = options.renderToReadableStream(options.element, { onError: rscErrorTracker.onRenderError });
  let revalidateSeconds = options.revalidateSeconds;
  const rscCapture = teeAppPageRscStreamForCapture(rscStream, options.isProduction && revalidateSeconds !== null && revalidateSeconds > 0 && revalidateSeconds !== Infinity && !options.isForceDynamic);
  const rscForResponse = rscCapture.responseStream;
  const isrRscDataPromise = rscCapture.capturedRscDataPromise;
  if (options.isRscRequest) {
    const dynamicUsedDuringBuild = options.consumeDynamicUsage();
    const rscResponsePolicy = resolveAppPageRscResponsePolicy({
      dynamicUsedDuringBuild,
      isDynamicError: options.isDynamicError,
      isForceDynamic: options.isForceDynamic,
      isForceStatic: options.isForceStatic,
      isProduction: options.isProduction,
      revalidateSeconds
    });
    const rscResponse = buildAppPageRscResponse(rscForResponse, {
      middlewareContext: options.middlewareContext,
      params: options.params,
      policy: rscResponsePolicy,
      timing: buildResponseTiming({
        compileEnd,
        handlerStart: options.handlerStart,
        isProduction: options.isProduction,
        responseKind: "rsc"
      })
    });
    scheduleAppPageRscCacheWrite({
      capturedRscDataPromise: options.isProduction ? isrRscDataPromise : null,
      cleanPathname: options.cleanPathname,
      consumeDynamicUsage: options.consumeDynamicUsage,
      dynamicUsedDuringBuild,
      getPageTags() {
        return options.getPageTags();
      },
      isrDebug: options.isrDebug,
      isrRscKey: options.isrRscKey,
      isrSet: options.isrSet,
      revalidateSeconds: revalidateSeconds ?? 0,
      waitUntil(promise) {
        options.waitUntil?.(promise);
      }
    });
    return rscResponse;
  }
  const fontData = createAppPageFontData({
    getLinks: options.getFontLinks,
    getPreloads: options.getFontPreloads,
    getStyles: options.getFontStyles
  });
  const fontLinkHeader = buildAppPageFontLinkHeader(fontData.preloads);
  let renderEnd;
  const htmlRender = await renderAppPageHtmlStreamWithRecovery({
    onShellRendered() {
      if (!options.isProduction) renderEnd = performance.now();
    },
    renderErrorBoundaryResponse(error) {
      return options.renderErrorBoundaryResponse(error);
    },
    async renderHtmlStream() {
      const ssrHandler = await options.loadSsrHandler();
      return renderAppPageHtmlStream({
        fontData,
        navigationContext: options.getNavigationContext(),
        rscStream: rscForResponse,
        ssrHandler
      });
    },
    renderSpecialErrorResponse(specialError) {
      return options.renderPageSpecialError(specialError);
    },
    resolveSpecialError: resolveAppPageSpecialError
  });
  if (htmlRender.response) return htmlRender.response;
  const htmlStream = htmlRender.htmlStream;
  if (!htmlStream) throw new Error("[vinext] Expected an HTML stream when no fallback response was returned");
  if (shouldRerenderAppPageWithGlobalError({
    capturedError: rscErrorTracker.getCapturedError(),
    hasLocalBoundary: options.routeHasLocalBoundary
  })) {
    const cleanResponse = await options.renderErrorBoundaryResponse(rscErrorTracker.getCapturedError());
    if (cleanResponse) return cleanResponse;
  }
  const draftCookie = options.getDraftModeCookieHeader();
  const dynamicUsedDuringRender = options.consumeDynamicUsage();
  const requestCacheLife = options.getRequestCacheLife();
  if (requestCacheLife?.revalidate !== void 0 && revalidateSeconds === null) revalidateSeconds = requestCacheLife.revalidate;
  const safeHtmlStream = deferUntilStreamConsumed(htmlStream, () => {
    options.clearRequestContext();
  });
  const htmlResponsePolicy = resolveAppPageHtmlResponsePolicy({
    dynamicUsedDuringRender,
    isDynamicError: options.isDynamicError,
    isForceDynamic: options.isForceDynamic,
    isForceStatic: options.isForceStatic,
    isProduction: options.isProduction,
    revalidateSeconds
  });
  const htmlResponseTiming = buildResponseTiming({
    compileEnd,
    handlerStart: options.handlerStart,
    isProduction: options.isProduction,
    renderEnd,
    responseKind: "html"
  });
  if (htmlResponsePolicy.shouldWriteToCache) return finalizeAppPageHtmlCacheResponse(buildAppPageHtmlResponse(safeHtmlStream, {
    draftCookie,
    fontLinkHeader,
    middlewareContext: options.middlewareContext,
    policy: htmlResponsePolicy,
    timing: htmlResponseTiming
  }), {
    capturedRscDataPromise: isrRscDataPromise,
    cleanPathname: options.cleanPathname,
    getPageTags() {
      return options.getPageTags();
    },
    isrDebug: options.isrDebug,
    isrHtmlKey: options.isrHtmlKey,
    isrRscKey: options.isrRscKey,
    isrSet: options.isrSet,
    revalidateSeconds: revalidateSeconds ?? 0,
    waitUntil(cachePromise) {
      options.waitUntil?.(cachePromise);
    }
  });
  return buildAppPageHtmlResponse(safeHtmlStream, {
    draftCookie,
    fontLinkHeader,
    middlewareContext: options.middlewareContext,
    policy: htmlResponsePolicy,
    timing: htmlResponseTiming
  });
}
function areStaticParamsAllowed(params, staticParams) {
  const paramKeys = Object.keys(params);
  return staticParams.some((staticParamSet) => paramKeys.every((key) => {
    const value = params[key];
    const staticValue = staticParamSet[key];
    if (staticValue === void 0) return true;
    if (Array.isArray(value)) return JSON.stringify(value) === JSON.stringify(staticValue);
    if (typeof staticValue === "string" || typeof staticValue === "number" || typeof staticValue === "boolean") return String(value) === String(staticValue);
    return JSON.stringify(value) === JSON.stringify(staticValue);
  }));
}
async function validateAppPageDynamicParams(options) {
  if (!options.enforceStaticParamsOnly || !options.isDynamicRoute || typeof options.generateStaticParams !== "function") return null;
  try {
    const staticParams = await options.generateStaticParams({ params: options.params });
    if (Array.isArray(staticParams) && !areStaticParamsAllowed(options.params, staticParams)) {
      options.clearRequestContext();
      return new Response("Not Found", { status: 404 });
    }
  } catch (error) {
    options.logGenerateStaticParamsError?.(error);
  }
  return null;
}
async function resolveAppPageIntercept(options) {
  if (!options.isRscRequest) return {
    interceptOpts: void 0,
    response: null
  };
  const intercept = options.findIntercept(options.cleanPathname);
  if (!intercept) return {
    interceptOpts: void 0,
    response: null
  };
  const sourceRoute = options.getSourceRoute(intercept.sourceRouteIndex);
  const interceptOpts = options.toInterceptOpts(intercept);
  if (sourceRoute && sourceRoute !== options.currentRoute) {
    const sourceParams = options.matchSourceRouteParams(options.getRoutePattern(sourceRoute)) ?? {};
    options.setNavigationContext({
      params: intercept.matchedParams,
      pathname: options.cleanPathname,
      searchParams: options.searchParams
    });
    const interceptElement = await options.buildPageElement(sourceRoute, sourceParams, interceptOpts, options.searchParams);
    return {
      interceptOpts: void 0,
      response: await options.renderInterceptResponse(sourceRoute, interceptElement)
    };
  }
  return {
    interceptOpts,
    response: null
  };
}
async function buildAppPageElement(options) {
  try {
    return {
      element: await options.buildPageElement(),
      response: null
    };
  } catch (error) {
    const specialError = options.resolveSpecialError(error);
    if (specialError) return {
      element: null,
      response: await options.renderSpecialError(specialError)
    };
    const errorBoundaryResponse = await options.renderErrorBoundaryPage(error);
    if (errorBoundaryResponse) return {
      element: null,
      response: errorBoundaryResponse
    };
    throw error;
  }
}
const HEADER_BLOCKLIST = ["traceparent", "tracestate"];
const CACHE_KEY_PREFIX = "v3";
const MAX_CACHE_KEY_BODY_BYTES = 1024 * 1024;
var BodyTooLargeForCacheKeyError = class extends Error {
  constructor() {
    super("Fetch body too large for cache key generation");
  }
};
var SkipCacheKeyGenerationError = class extends Error {
  constructor() {
    super("Fetch body could not be serialized for cache key generation");
  }
};
function collectHeaders(input, init2) {
  const merged = {};
  if (input instanceof Request && input.headers) input.headers.forEach((v, k) => {
    merged[k] = v;
  });
  if (init2?.headers) (init2.headers instanceof Headers ? init2.headers : new Headers(init2.headers)).forEach((v, k) => {
    merged[k] = v;
  });
  for (const blocked of HEADER_BLOCKLIST) delete merged[blocked];
  return merged;
}
const AUTH_HEADERS = [
  "authorization",
  "cookie",
  "x-api-key"
];
function hasAuthHeaders(input, init2) {
  const headers = collectHeaders(input, init2);
  return AUTH_HEADERS.some((name) => name in headers);
}
async function serializeFormData(formData, pushBodyChunk, getTotalBodyBytes) {
  for (const [key, val] of formData.entries()) {
    if (typeof val === "string") {
      pushBodyChunk(JSON.stringify([key, {
        kind: "string",
        value: val
      }]));
      continue;
    }
    if (val.size > MAX_CACHE_KEY_BODY_BYTES || getTotalBodyBytes() + val.size > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
    pushBodyChunk(JSON.stringify([key, {
      kind: "file",
      name: val.name,
      type: val.type,
      value: await val.text()
    }]));
  }
}
function getParsedFormContentType(contentType) {
  const mediaType = contentType?.split(";")[0]?.trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") return mediaType;
}
function stripMultipartBoundary(contentType) {
  const [type, ...params] = contentType.split(";");
  const keptParams = params.map((param) => param.trim()).filter(Boolean).filter((param) => !/^boundary\s*=/i.test(param));
  const normalizedType = type.trim().toLowerCase();
  return keptParams.length > 0 ? `${normalizedType}; ${keptParams.join("; ")}` : normalizedType;
}
async function readRequestBodyChunksWithinLimit(request) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
  }
  const requestClone = request.clone();
  const contentType = requestClone.headers.get("content-type") ?? void 0;
  const reader = requestClone.body?.getReader();
  if (!reader) return {
    chunks: [],
    contentType
  };
  const chunks = [];
  let totalBodyBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBodyBytes += value.byteLength;
      if (totalBodyBytes > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
      chunks.push(value);
    }
  } catch (err) {
    reader.cancel().catch(() => {
    });
    throw err;
  }
  return {
    chunks,
    contentType
  };
}
async function serializeBody(input, init2) {
  if (!init2?.body && !(input instanceof Request && input.body)) return { bodyChunks: [] };
  const bodyChunks = [];
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let totalBodyBytes = 0;
  let canonicalizedContentType;
  const pushBodyChunk = (chunk) => {
    totalBodyBytes += encoder.encode(chunk).byteLength;
    if (totalBodyBytes > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
    bodyChunks.push(chunk);
  };
  const getTotalBodyBytes = () => totalBodyBytes;
  if (init2?.body instanceof Uint8Array) {
    if (init2.body.byteLength > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
    pushBodyChunk(decoder.decode(init2.body));
    init2._ogBody = init2.body;
  } else if (init2?.body && typeof init2.body.getReader === "function") {
    const [bodyForHashing, bodyForFetch] = init2.body.tee();
    init2._ogBody = bodyForFetch;
    const reader = bodyForHashing.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (typeof value === "string") pushBodyChunk(value);
        else {
          totalBodyBytes += value.byteLength;
          if (totalBodyBytes > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
          bodyChunks.push(decoder.decode(value, { stream: true }));
        }
      }
      const finalChunk = decoder.decode();
      if (finalChunk) pushBodyChunk(finalChunk);
    } catch (err) {
      await reader.cancel();
      if (err instanceof BodyTooLargeForCacheKeyError) throw err;
      throw new SkipCacheKeyGenerationError();
    }
  } else if (init2?.body instanceof URLSearchParams) {
    init2._ogBody = init2.body;
    pushBodyChunk(init2.body.toString());
  } else if (init2?.body && typeof init2.body.keys === "function") {
    const formData = init2.body;
    init2._ogBody = init2.body;
    await serializeFormData(formData, pushBodyChunk, getTotalBodyBytes);
  } else if (init2?.body && typeof init2.body.arrayBuffer === "function") {
    const blob = init2.body;
    if (blob.size > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
    pushBodyChunk(await blob.text());
    const arrayBuffer = await blob.arrayBuffer();
    init2._ogBody = new Blob([arrayBuffer], { type: blob.type });
  } else if (typeof init2?.body === "string") {
    if (init2.body.length > MAX_CACHE_KEY_BODY_BYTES) throw new BodyTooLargeForCacheKeyError();
    pushBodyChunk(init2.body);
    init2._ogBody = init2.body;
  } else if (input instanceof Request && input.body) {
    let chunks;
    let contentType;
    try {
      ({ chunks, contentType } = await readRequestBodyChunksWithinLimit(input));
    } catch (err) {
      if (err instanceof BodyTooLargeForCacheKeyError) throw err;
      throw new SkipCacheKeyGenerationError();
    }
    const formContentType = getParsedFormContentType(contentType);
    if (formContentType) try {
      await serializeFormData(await new Request(input.url, {
        method: input.method,
        headers: contentType ? { "content-type": contentType } : void 0,
        body: new Blob(chunks)
      }).formData(), pushBodyChunk, getTotalBodyBytes);
      canonicalizedContentType = formContentType === "multipart/form-data" && contentType ? stripMultipartBoundary(contentType) : void 0;
      return {
        bodyChunks,
        canonicalizedContentType
      };
    } catch (err) {
      if (err instanceof BodyTooLargeForCacheKeyError) throw err;
      throw new SkipCacheKeyGenerationError();
    }
    for (const chunk of chunks) pushBodyChunk(decoder.decode(chunk, { stream: true }));
    const finalChunk = decoder.decode();
    if (finalChunk) pushBodyChunk(finalChunk);
  }
  return {
    bodyChunks,
    canonicalizedContentType
  };
}
async function buildFetchCacheKey(input, init2) {
  let url;
  let method = "GET";
  if (typeof input === "string") url = input;
  else if (input instanceof URL) url = input.toString();
  else {
    url = input.url;
    method = input.method || "GET";
  }
  if (init2?.method) method = init2.method;
  const headers = collectHeaders(input, init2);
  const { bodyChunks, canonicalizedContentType } = await serializeBody(input, init2);
  if (canonicalizedContentType) headers["content-type"] = canonicalizedContentType;
  const cacheString = JSON.stringify([
    CACHE_KEY_PREFIX,
    url,
    method,
    headers,
    init2?.mode,
    init2?.redirect,
    init2?.credentials,
    init2?.referrer,
    init2?.referrerPolicy,
    init2?.integrity,
    init2?.cache,
    bodyChunks
  ]);
  const buffer = new TextEncoder().encode(cacheString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.prototype.map.call(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, "0")).join("");
}
const _PENDING_KEY = /* @__PURE__ */ Symbol.for("vinext.fetchCache.pendingRefetches");
const _gPending = globalThis;
const pendingRefetches = _gPending[_PENDING_KEY] ??= /* @__PURE__ */ new Map();
const DEDUP_TIMEOUT_MS = 6e4;
const _ORIG_FETCH_KEY = /* @__PURE__ */ Symbol.for("vinext.fetchCache.originalFetch");
const _gFetch = globalThis;
const originalFetch = _gFetch[_ORIG_FETCH_KEY] ??= globalThis.fetch;
const _ALS_KEY$1 = /* @__PURE__ */ Symbol.for("vinext.fetchCache.als");
const _FALLBACK_KEY$1 = /* @__PURE__ */ Symbol.for("vinext.fetchCache.fallback");
const _g$1 = globalThis;
const _als$1 = _g$1[_ALS_KEY$1] ??= new AsyncLocalStorage$1();
const _fallbackState$1 = _g$1[_FALLBACK_KEY$1] ??= { currentRequestTags: [] };
function _getState$1() {
  if (isInsideUnifiedScope()) return getRequestContext();
  return _als$1.getStore() ?? _fallbackState$1;
}
function getCollectedFetchTags() {
  return [..._getState$1().currentRequestTags];
}
function createPatchedFetch() {
  return async function patchedFetch(input, init2) {
    const nextOpts = init2?.next;
    const cacheDirective = init2?.cache;
    if (!nextOpts && !cacheDirective) return originalFetch(input, init2);
    if (cacheDirective === "no-store" || cacheDirective === "no-cache" || nextOpts?.revalidate === false || nextOpts?.revalidate === 0) return originalFetch(input, stripNextFromInit(init2));
    if (!(cacheDirective === "force-cache" || typeof nextOpts?.revalidate === "number" && nextOpts.revalidate > 0) && hasAuthHeaders(input, init2)) return originalFetch(input, stripNextFromInit(init2));
    let revalidateSeconds;
    if (cacheDirective === "force-cache") revalidateSeconds = nextOpts?.revalidate && typeof nextOpts.revalidate === "number" ? nextOpts.revalidate : 31536e3;
    else if (typeof nextOpts?.revalidate === "number" && nextOpts.revalidate > 0) revalidateSeconds = nextOpts.revalidate;
    else if (nextOpts?.tags && nextOpts.tags.length > 0) revalidateSeconds = 31536e3;
    else return originalFetch(input, stripNextFromInit(init2));
    const tags = nextOpts?.tags ?? [];
    let cacheKey;
    try {
      cacheKey = await buildFetchCacheKey(input, init2);
    } catch (err) {
      if (err instanceof BodyTooLargeForCacheKeyError || err instanceof SkipCacheKeyGenerationError) return originalFetch(input, stripNextFromInit(init2));
      throw err;
    }
    const handler2 = getCacheHandler();
    const reqTags = _getState$1().currentRequestTags;
    if (tags.length > 0) {
      for (const tag of tags) if (!reqTags.includes(tag)) reqTags.push(tag);
    }
    try {
      const cached = await handler2.get(cacheKey, {
        kind: "FETCH",
        tags
      });
      if (cached?.value && cached.value.kind === "FETCH" && cached.cacheState !== "stale") {
        const cachedData = cached.value.data;
        return new Response(cachedData.body, {
          status: cachedData.status ?? 200,
          headers: cachedData.headers
        });
      }
      if (cached?.value && cached.value.kind === "FETCH" && cached.cacheState === "stale") {
        const staleData = cached.value.data;
        if (!pendingRefetches.has(cacheKey)) {
          const refetchPromise = originalFetch(input, stripNextFromInit(init2)).then(async (freshResp) => {
            if (freshResp.status !== 200) return;
            const freshBody = await freshResp.text();
            const freshHeaders = {};
            freshResp.headers.forEach((v, k) => {
              if (k.toLowerCase() === "set-cookie") return;
              freshHeaders[k] = v;
            });
            const freshValue = {
              kind: "FETCH",
              data: {
                headers: freshHeaders,
                body: freshBody,
                url: typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url,
                status: freshResp.status
              },
              tags,
              revalidate: revalidateSeconds
            };
            await handler2.set(cacheKey, freshValue, {
              fetchCache: true,
              tags,
              revalidate: revalidateSeconds
            });
          }).catch((err) => {
            const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
            console.error(`[vinext] fetch cache background revalidation failed for ${url} (key=${cacheKey.slice(0, 12)}...):`, err);
          }).finally(() => {
            if (pendingRefetches.get(cacheKey) === refetchPromise) pendingRefetches.delete(cacheKey);
            clearTimeout(timeoutId);
          });
          pendingRefetches.set(cacheKey, refetchPromise);
          const timeoutId = setTimeout(() => {
            if (pendingRefetches.get(cacheKey) === refetchPromise) pendingRefetches.delete(cacheKey);
          }, DEDUP_TIMEOUT_MS);
          getRequestExecutionContext()?.waitUntil(refetchPromise);
        }
        return new Response(staleData.body, {
          status: staleData.status ?? 200,
          headers: staleData.headers
        });
      }
    } catch (cacheErr) {
      console.error("[vinext] fetch cache read error:", cacheErr);
    }
    const response = await originalFetch(input, stripNextFromInit(init2));
    if (response.status === 200) {
      const cloned = response.clone();
      const body = await cloned.text();
      const headers = {};
      cloned.headers.forEach((v, k) => {
        if (k.toLowerCase() === "set-cookie") return;
        headers[k] = v;
      });
      const cacheValue = {
        kind: "FETCH",
        data: {
          headers,
          body,
          url: typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url,
          status: cloned.status
        },
        tags,
        revalidate: revalidateSeconds
      };
      handler2.set(cacheKey, cacheValue, {
        fetchCache: true,
        tags,
        revalidate: revalidateSeconds
      }).catch((err) => {
        console.error("[vinext] fetch cache write error:", err);
      });
    }
    return response;
  };
}
function stripNextFromInit(init2) {
  if (!init2) return init2;
  const { next: _next, _ogBody, ...rest } = init2;
  if (_ogBody !== void 0) rest.body = _ogBody;
  return Object.keys(rest).length > 0 ? rest : void 0;
}
const _PATCH_KEY = /* @__PURE__ */ Symbol.for("vinext.fetchCache.patchInstalled");
function _ensurePatchInstalled() {
  if (_g$1[_PATCH_KEY]) return;
  _g$1[_PATCH_KEY] = true;
  globalThis.fetch = createPatchedFetch();
}
function ensureFetchPatch() {
  _ensurePatchInstalled();
}
function createNode() {
  return {
    staticChildren: /* @__PURE__ */ new Map(),
    dynamicChild: null,
    catchAllChild: null,
    optionalCatchAllChild: null,
    route: null
  };
}
function buildRouteTrie(routes2) {
  const root = createNode();
  for (const route of routes2) {
    const parts = route.patternParts;
    if (parts.length === 0) {
      if (root.route === null) root.route = route;
      continue;
    }
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.endsWith("+") && part.startsWith(":")) {
        if (i !== parts.length - 1) break;
        const paramName = part.slice(1, -1);
        if (node.catchAllChild === null) node.catchAllChild = {
          paramName,
          route
        };
        break;
      }
      if (part.endsWith("*") && part.startsWith(":")) {
        if (i !== parts.length - 1) break;
        const paramName = part.slice(1, -1);
        if (node.optionalCatchAllChild === null) node.optionalCatchAllChild = {
          paramName,
          route
        };
        break;
      }
      if (part.startsWith(":")) {
        const paramName = part.slice(1);
        if (node.dynamicChild === null) node.dynamicChild = {
          paramName,
          node: createNode()
        };
        node = node.dynamicChild.node;
        if (i === parts.length - 1) {
          if (node.route === null) node.route = route;
        }
        continue;
      }
      let child = node.staticChildren.get(part);
      if (!child) {
        child = createNode();
        node.staticChildren.set(part, child);
      }
      node = child;
      if (i === parts.length - 1) {
        if (node.route === null) node.route = route;
      }
    }
  }
  return root;
}
function trieMatch(root, urlParts) {
  return match(root, urlParts, 0);
}
function match(node, urlParts, index) {
  if (index === urlParts.length) {
    if (node.route !== null) return {
      route: node.route,
      params: /* @__PURE__ */ Object.create(null)
    };
    if (node.optionalCatchAllChild !== null) {
      const params = /* @__PURE__ */ Object.create(null);
      params[node.optionalCatchAllChild.paramName] = [];
      return {
        route: node.optionalCatchAllChild.route,
        params
      };
    }
    return null;
  }
  const segment = urlParts[index];
  const staticChild = node.staticChildren.get(segment);
  if (staticChild) {
    const result = match(staticChild, urlParts, index + 1);
    if (result !== null) return result;
  }
  if (node.dynamicChild !== null) {
    const result = match(node.dynamicChild.node, urlParts, index + 1);
    if (result !== null) {
      result.params[node.dynamicChild.paramName] = segment;
      return result;
    }
  }
  if (node.catchAllChild !== null) {
    const remaining = urlParts.slice(index);
    const params = /* @__PURE__ */ Object.create(null);
    params[node.catchAllChild.paramName] = remaining;
    return {
      route: node.catchAllChild.route,
      params
    };
  }
  if (node.optionalCatchAllChild !== null) {
    const remaining = urlParts.slice(index);
    const params = /* @__PURE__ */ Object.create(null);
    params[node.optionalCatchAllChild.paramName] = remaining;
    return {
      route: node.optionalCatchAllChild.route,
      params
    };
  }
  return null;
}
const _ALS_KEY = /* @__PURE__ */ Symbol.for("vinext.navigation.als");
const _FALLBACK_KEY = /* @__PURE__ */ Symbol.for("vinext.navigation.fallback");
const _g = globalThis;
const _als = _g[_ALS_KEY] ??= new AsyncLocalStorage$1();
const _fallbackState = _g[_FALLBACK_KEY] ??= {
  serverContext: null,
  serverInsertedHTMLCallbacks: []
};
function _getState() {
  if (isInsideUnifiedScope()) return getRequestContext();
  return _als.getStore() ?? _fallbackState;
}
_registerStateAccessors({
  getServerContext() {
    return _getState().serverContext;
  },
  setServerContext(ctx) {
    _getState().serverContext = ctx;
  }
});
function getOnRequestErrorHandler() {
  return globalThis.__VINEXT_onRequestErrorHandler__ ?? null;
}
function reportRequestError(error, request, context) {
  const handler2 = getOnRequestErrorHandler();
  if (!handler2) return Promise.resolve();
  const promise = (async () => {
    try {
      await handler2(error, request, context);
    } catch (reportErr) {
      console.error("[vinext] onRequestError handler threw:", reportErr instanceof Error ? reportErr.message : String(reportErr));
    }
  })();
  getRequestExecutionContext()?.waitUntil(promise);
  return promise;
}
function escapeCSSString(value) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ");
}
function sanitizeCSSVarName(name) {
  if (/^--[a-zA-Z0-9_-]+$/.test(name)) return name;
}
function sanitizeFallback(name) {
  const generics = /* @__PURE__ */ new Set([
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-serif",
    "ui-sans-serif",
    "ui-monospace",
    "ui-rounded",
    "emoji",
    "math",
    "fangsong"
  ]);
  const trimmed = name.trim();
  if (generics.has(trimmed)) return trimmed;
  return `'${escapeCSSString(trimmed)}'`;
}
let classCounter = 0;
const injectedFonts = /* @__PURE__ */ new Set();
function toVarName(family) {
  return "--font-" + family.toLowerCase().replace(/\s+/g, "-");
}
function buildGoogleFontsUrl(family, options) {
  const params = new URLSearchParams();
  let spec = family;
  const weights = options.weight ? Array.isArray(options.weight) ? options.weight : [options.weight] : [];
  const styles = options.style ? Array.isArray(options.style) ? options.style : [options.style] : [];
  if (weights.length > 0 || styles.length > 0) {
    const hasItalic = styles.includes("italic");
    if (weights.length > 0) if (hasItalic) {
      const pairs = [];
      for (const w of weights) {
        pairs.push(`0,${w}`);
        pairs.push(`1,${w}`);
      }
      spec += `:ital,wght@${pairs.join(";")}`;
    } else spec += `:wght@${weights.join(";")}`;
  } else spec += `:wght@100..900`;
  params.set("family", spec);
  params.set("display", options.display ?? "swap");
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}
function injectFontStylesheet(url) {
  if (injectedFonts.has(url)) return;
  injectedFonts.add(url);
  if (typeof document !== "undefined") {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }
}
const injectedClassRules = /* @__PURE__ */ new Set();
function injectClassNameRule(className, fontFamily) {
  if (injectedClassRules.has(className)) return;
  injectedClassRules.add(className);
  const css = `.${className} { font-family: ${fontFamily}; }
`;
  if (typeof document === "undefined") {
    ssrFontStyles$1.push(css);
    return;
  }
  const style = document.createElement("style");
  style.textContent = css;
  style.setAttribute("data-vinext-font-class", className);
  document.head.appendChild(style);
}
const injectedVariableRules = /* @__PURE__ */ new Set();
const injectedRootVariables = /* @__PURE__ */ new Set();
function injectVariableClassRule(variableClassName, cssVarName, fontFamily) {
  if (injectedVariableRules.has(variableClassName)) return;
  injectedVariableRules.add(variableClassName);
  let css = `.${variableClassName} { ${cssVarName}: ${fontFamily}; }
`;
  if (!injectedRootVariables.has(cssVarName)) {
    injectedRootVariables.add(cssVarName);
    css += `:root { ${cssVarName}: ${fontFamily}; }
`;
  }
  if (typeof document === "undefined") {
    ssrFontStyles$1.push(css);
    return;
  }
  const style = document.createElement("style");
  style.textContent = css;
  style.setAttribute("data-vinext-font-variable", variableClassName);
  document.head.appendChild(style);
}
const ssrFontStyles$1 = [];
function getSSRFontStyles$1() {
  return [...ssrFontStyles$1];
}
const ssrFontUrls = [];
function getSSRFontLinks() {
  return [...ssrFontUrls];
}
const ssrFontPreloads$1 = [];
const ssrFontPreloadHrefs = /* @__PURE__ */ new Set();
function getSSRFontPreloads$1() {
  return [...ssrFontPreloads$1];
}
function getFontMimeType(pathOrUrl) {
  if (pathOrUrl.endsWith(".woff2")) return "font/woff2";
  if (pathOrUrl.endsWith(".woff")) return "font/woff";
  if (pathOrUrl.endsWith(".ttf")) return "font/ttf";
  if (pathOrUrl.endsWith(".otf")) return "font/opentype";
  return "font/woff2";
}
function extractFontUrlsFromCSS(css) {
  const urls = [];
  const urlRegex = /url\(['"]?([^'")]+)['"]?\)/g;
  let match2;
  while ((match2 = urlRegex.exec(css)) !== null) {
    const url = match2[1];
    if (url && url.startsWith("/")) urls.push(url);
  }
  return urls;
}
function collectFontPreloadsFromCSS(css) {
  if (typeof document !== "undefined") return;
  const urls = extractFontUrlsFromCSS(css);
  for (const href of urls) if (!ssrFontPreloadHrefs.has(href)) {
    ssrFontPreloadHrefs.add(href);
    ssrFontPreloads$1.push({
      href,
      type: getFontMimeType(href)
    });
  }
}
const injectedSelfHosted = /* @__PURE__ */ new Set();
function injectSelfHostedCSS(css) {
  if (injectedSelfHosted.has(css)) return;
  injectedSelfHosted.add(css);
  collectFontPreloadsFromCSS(css);
  if (typeof document === "undefined") {
    ssrFontStyles$1.push(css);
    return;
  }
  const style = document.createElement("style");
  style.textContent = css;
  style.setAttribute("data-vinext-font-selfhosted", "true");
  document.head.appendChild(style);
}
function createFontLoader(family) {
  return function fontLoader(options = {}) {
    const id = classCounter++;
    const className = `__font_${family.toLowerCase().replace(/\s+/g, "_")}_${id}`;
    const fallback = options.fallback ?? ["sans-serif"];
    const fontFamily = `'${escapeCSSString(family)}', ${fallback.map(sanitizeFallback).join(", ")}`;
    const defaultVarName = toVarName(family);
    const cssVarName = options.variable ? sanitizeCSSVarName(options.variable) ?? defaultVarName : defaultVarName;
    const variableClassName = `__variable_${family.toLowerCase().replace(/\s+/g, "_")}_${id}`;
    if (options._selfHostedCSS) injectSelfHostedCSS(options._selfHostedCSS);
    else {
      const url = buildGoogleFontsUrl(family, options);
      injectFontStylesheet(url);
      if (typeof document === "undefined") {
        if (!ssrFontUrls.includes(url)) ssrFontUrls.push(url);
      }
    }
    injectClassNameRule(className, fontFamily);
    injectVariableClassRule(variableClassName, cssVarName, fontFamily);
    return {
      className,
      style: { fontFamily },
      variable: variableClassName
    };
  };
}
const googleFonts = new Proxy({}, { get(_target, prop) {
  if (prop === "__esModule") return true;
  if (prop === "default") return googleFonts;
  return createFontLoader(prop.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"));
} });
const ssrFontStyles = [];
const ssrFontPreloads = [];
function getSSRFontStyles() {
  return [...ssrFontStyles];
}
function getSSRFontPreloads() {
  return [...ssrFontPreloads];
}
const page$e = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "6efdf509a785", "default");
const mod_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$e
}, Symbol.toStringTag, { value: "Module" }));
const RemoveDuplicateServerCss = void 0;
const Resources = /* @__PURE__ */ ((React, deps, RemoveDuplicateServerCss2, precedence) => {
  return function Resources2() {
    return React.createElement(React.Fragment, null, [...deps.css.map((href) => React.createElement("link", {
      key: "css:" + href,
      rel: "stylesheet",
      ...{ precedence },
      href,
      "data-rsc-css-href": href
    })), RemoveDuplicateServerCss2]);
  };
})(
  __vite_rsc_react__,
  assetsManifest.serverResources["app/layout.tsx"],
  RemoveDuplicateServerCss,
  "vite-rsc/importer-resources"
);
const branding = getDefaultBranding();
let metadata = {
  title: `${branding.appName} - Omnichannel`,
  description: `CRM Omnichannel da ${branding.companyName}`
};
function RootLayout({
  children
}) {
  return /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("html", { lang: "pt-BR", suppressHydrationWarning: true, children: /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("body", { className: "font-sans", children: /* @__PURE__ */ jsxRuntime_reactServerExports.jsx(ThemeProvider, { children }) }) });
}
const $$wrap_RootLayout = /* @__PURE__ */ __vite_rsc_wrap_css__(RootLayout, "default");
function __vite_rsc_wrap_css__(value, name) {
  if (typeof value !== "function") return value;
  function __wrapper(props) {
    return __vite_rsc_react__.createElement(
      __vite_rsc_react__.Fragment,
      null,
      __vite_rsc_react__.createElement(Resources),
      __vite_rsc_react__.createElement(value, props)
    );
  }
  Object.defineProperty(__wrapper, "name", { value: name });
  return __wrapper;
}
const mod_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$wrap_RootLayout,
  metadata
}, Symbol.toStringTag, { value: "Module" }));
const page$d = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "0434cb239a18", "default");
const mod_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$d
}, Symbol.toStringTag, { value: "Module" }));
const layout$1 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "6fa56e6c12ff", "default");
const mod_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout$1
}, Symbol.toStringTag, { value: "Module" }));
const page$c = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "f357939d3fc9", "default");
const mod_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$c
}, Symbol.toStringTag, { value: "Module" }));
const page$b = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "9d2502c6f76e", "default");
const mod_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$b
}, Symbol.toStringTag, { value: "Module" }));
const page$a = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "7ea9654251bb", "default");
const mod_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$a
}, Symbol.toStringTag, { value: "Module" }));
const page$9 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "e16c1c1133d5", "default");
const mod_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$9
}, Symbol.toStringTag, { value: "Module" }));
const layout = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "3c126157994c", "default");
const mod_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout
}, Symbol.toStringTag, { value: "Module" }));
const page$8 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "2e3edda954e5", "default");
const mod_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$8
}, Symbol.toStringTag, { value: "Module" }));
const page$7 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "b871a654c989", "default");
const mod_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$7
}, Symbol.toStringTag, { value: "Module" }));
const page$6 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "ba6dd567ebb3", "default");
const mod_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$6
}, Symbol.toStringTag, { value: "Module" }));
const page$5 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "3c6d80461297", "default");
const mod_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$5
}, Symbol.toStringTag, { value: "Module" }));
const page$4 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "88ea4c370910", "default");
const mod_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$4
}, Symbol.toStringTag, { value: "Module" }));
const page$3 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "74cbdc5f9701", "default");
const mod_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$3
}, Symbol.toStringTag, { value: "Module" }));
const page$2 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "ed1d88514cc8", "default");
const mod_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$2
}, Symbol.toStringTag, { value: "Module" }));
const page$1 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "28714cf45a56", "default");
const mod_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$1
}, Symbol.toStringTag, { value: "Module" }));
const page = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "6d64d4a1d4dc", "default");
const mod_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page
}, Symbol.toStringTag, { value: "Module" }));
function renderToReadableStream(model, options) {
  const _hlFixRe = /(\d*:HL\[.*?),"stylesheet"(\]|,)/g;
  const stream = renderToReadableStream$1(model, options);
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let carry = "";
  return stream.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      const text = carry + decoder.decode(chunk, { stream: true });
      const lastNl = text.lastIndexOf("\n");
      if (lastNl === -1) {
        carry = text;
        return;
      }
      carry = text.slice(lastNl + 1);
      controller.enqueue(encoder.encode(text.slice(0, lastNl + 1).replace(_hlFixRe, '$1,"style"$2')));
    },
    flush(controller) {
      const text = carry + decoder.decode();
      if (text) controller.enqueue(encoder.encode(text.replace(_hlFixRe, '$1,"style"$2')));
    }
  }));
}
function _getSSRFontStyles() {
  return [...getSSRFontStyles$1(), ...getSSRFontStyles()];
}
function _getSSRFontPreloads() {
  return [...getSSRFontPreloads$1(), ...getSSRFontPreloads()];
}
const _suppressHookWarningAls = new AsyncLocalStorage$1();
const _origConsoleError = console.error;
console.error = (...args) => {
  if (_suppressHookWarningAls.getStore() === true && typeof args[0] === "string" && args[0].includes("Invalid hook call")) return;
  _origConsoleError.apply(console, args);
};
function setNavigationContext(ctx) {
  setNavigationContext$1(ctx);
}
async function __isrGet(key) {
  const handler2 = getCacheHandler();
  const result = await handler2.get(key);
  if (!result || !result.value) return null;
  return { value: result, isStale: result.cacheState === "stale" };
}
async function __isrSet(key, data, revalidateSeconds, tags) {
  const handler2 = getCacheHandler();
  await handler2.set(key, data, { revalidate: revalidateSeconds, tags: Array.isArray(tags) ? tags : [] });
}
function __pageCacheTags(pathname, extraTags) {
  const tags = [pathname, "_N_T_" + pathname];
  tags.push("_N_T_/layout");
  const segments = pathname.split("/");
  let built = "";
  for (let i = 1; i < segments.length; i++) {
    if (segments[i]) {
      built += "/" + segments[i];
      tags.push("_N_T_" + built + "/layout");
    }
  }
  tags.push("_N_T_" + built + "/page");
  if (Array.isArray(extraTags)) {
    for (const tag of extraTags) {
      if (!tags.includes(tag)) tags.push(tag);
    }
  }
  return tags;
}
const __pendingRegenerations = /* @__PURE__ */ new Map();
function __triggerBackgroundRegeneration(key, renderFn) {
  if (__pendingRegenerations.has(key)) return;
  const promise = renderFn().catch((err) => console.error("[vinext] ISR regen failed for " + key + ":", err)).finally(() => __pendingRegenerations.delete(key));
  __pendingRegenerations.set(key, promise);
  const ctx = getRequestExecutionContext();
  if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(promise);
}
function __isrFnv1a64(s) {
  let h1 = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h1 ^= s.charCodeAt(i);
    h1 = h1 * 16777619 >>> 0;
  }
  let h2 = 84696351;
  for (let i = 0; i < s.length; i++) {
    h2 ^= s.charCodeAt(i);
    h2 = h2 * 16777619 >>> 0;
  }
  return h1.toString(36) + h2.toString(36);
}
function __isrCacheKey(pathname, suffix) {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const buildId = "f9d0c88c-53d7-477d-a6e0-9c5c1a4e39d9";
  const prefix = "app:" + buildId;
  const key = prefix + ":" + normalized + ":" + suffix;
  if (key.length <= 200) return key;
  return prefix + ":__hash:" + __isrFnv1a64(normalized) + ":" + suffix;
}
function __isrHtmlKey(pathname) {
  return __isrCacheKey(pathname, "html");
}
function __isrRscKey(pathname) {
  return __isrCacheKey(pathname, "rsc");
}
function __isrRouteKey(pathname) {
  return __isrCacheKey(pathname, "route");
}
const __isrDebug = process.env.NEXT_PRIVATE_DEBUG_CACHE ? console.debug.bind(console, "[vinext] ISR:") : void 0;
function makeThenableParams(obj) {
  const plain = { ...obj };
  return Object.assign(Promise.resolve(plain), plain);
}
function __resolveChildSegments(routeSegments, treePosition, params) {
  var raw = routeSegments.slice(treePosition);
  var result = [];
  for (var j = 0; j < raw.length; j++) {
    var seg = raw[j];
    if (seg.indexOf("[[...") === 0 && seg.charAt(seg.length - 1) === "]" && seg.charAt(seg.length - 2) === "]") {
      var pn = seg.slice(5, -2);
      var v = params[pn];
      if (Array.isArray(v) && v.length === 0) continue;
      if (v == null) continue;
      result.push(Array.isArray(v) ? v.join("/") : v);
    } else if (seg.indexOf("[...") === 0 && seg.charAt(seg.length - 1) === "]") {
      var pn2 = seg.slice(4, -1);
      var v2 = params[pn2];
      result.push(Array.isArray(v2) ? v2.join("/") : v2 || seg);
    } else if (seg.charAt(0) === "[" && seg.charAt(seg.length - 1) === "]" && seg.indexOf(".") === -1) {
      var pn3 = seg.slice(1, -1);
      result.push(params[pn3] || seg);
    } else {
      result.push(seg);
    }
  }
  return result;
}
function __errorDigest(str) {
  let hash = 5381;
  for (let i = str.length - 1; i >= 0; i--) {
    hash = hash * 33 ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString();
}
function __sanitizeErrorForClient(error) {
  if (resolveAppPageSpecialError(error)) {
    return error;
  }
  const msg = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack || "" : "";
  const sanitized = new Error(
    "An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error."
  );
  sanitized.digest = __errorDigest(msg + stack);
  return sanitized;
}
function rscOnError(error, requestInfo, errorContext) {
  if (error && typeof error === "object" && "digest" in error) {
    return String(error.digest);
  }
  if (requestInfo && errorContext && error) {
    reportRequestError(
      error instanceof Error ? error : new Error(String(error)),
      requestInfo,
      errorContext
    );
  }
  if (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack || "" : "";
    return __errorDigest(msg + stack);
  }
  return void 0;
}
function createRscOnErrorHandler(request, pathname, routePath) {
  const requestInfo = {
    path: pathname,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries())
  };
  const errorContext = {
    routerKind: "App Router",
    routePath: routePath || pathname,
    routeType: "render"
  };
  return function(error) {
    return rscOnError(error, requestInfo, errorContext);
  };
}
const routes = [
  {
    pattern: "/",
    patternParts: [],
    isDynamic: false,
    params: [],
    page: mod_0,
    routeHandler: null,
    layouts: [mod_1],
    routeSegments: [],
    layoutTreePositions: [0],
    templates: [],
    errors: [null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/admin/clients",
    patternParts: ["admin", "clients"],
    isDynamic: false,
    params: [],
    page: mod_2,
    routeHandler: null,
    layouts: [mod_1, mod_3],
    routeSegments: ["admin", "clients"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/admin/metrics",
    patternParts: ["admin", "metrics"],
    isDynamic: false,
    params: [],
    page: mod_4,
    routeHandler: null,
    layouts: [mod_1, mod_3],
    routeSegments: ["admin", "metrics"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/admin/settings",
    patternParts: ["admin", "settings"],
    isDynamic: false,
    params: [],
    page: mod_5,
    routeHandler: null,
    layouts: [mod_1, mod_3],
    routeSegments: ["admin", "settings"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/admin/users",
    patternParts: ["admin", "users"],
    isDynamic: false,
    params: [],
    page: mod_6,
    routeHandler: null,
    layouts: [mod_1, mod_3],
    routeSegments: ["admin", "users"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard",
    patternParts: ["dashboard"],
    isDynamic: false,
    params: [],
    page: mod_7,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/automations/flow",
    patternParts: ["dashboard", "automations", "flow"],
    isDynamic: false,
    params: [],
    page: mod_9,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "automations", "flow"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/clients",
    patternParts: ["dashboard", "clients"],
    isDynamic: false,
    params: [],
    page: mod_10,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "clients"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/connections",
    patternParts: ["dashboard", "connections"],
    isDynamic: false,
    params: [],
    page: mod_11,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "connections"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/inbox",
    patternParts: ["dashboard", "inbox"],
    isDynamic: false,
    params: [],
    page: mod_12,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "inbox"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/leads",
    patternParts: ["dashboard", "leads"],
    isDynamic: false,
    params: [],
    page: mod_13,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "leads"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/metrics",
    patternParts: ["dashboard", "metrics"],
    isDynamic: false,
    params: [],
    page: mod_14,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "metrics"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/pipeline",
    patternParts: ["dashboard", "pipeline"],
    isDynamic: false,
    params: [],
    page: mod_15,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "pipeline"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/settings",
    patternParts: ["dashboard", "settings"],
    isDynamic: false,
    params: [],
    page: mod_16,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "settings"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  },
  {
    pattern: "/dashboard/tags",
    patternParts: ["dashboard", "tags"],
    isDynamic: false,
    params: [],
    page: mod_17,
    routeHandler: null,
    layouts: [mod_1, mod_8],
    routeSegments: ["dashboard", "tags"],
    layoutTreePositions: [0, 1],
    templates: [],
    errors: [null, null],
    slots: {},
    loading: null,
    error: null,
    notFound: null,
    notFounds: [null, null],
    forbidden: null,
    unauthorized: null
  }
];
const _routeTrie = buildRouteTrie(routes);
const metadataRoutes = [];
const rootNotFoundModule = null;
const rootForbiddenModule = null;
const rootUnauthorizedModule = null;
const rootLayouts = [mod_1];
async function renderHTTPAccessFallbackPage(route, statusCode, isRscRequest, request, opts) {
  return renderAppPageHttpAccessFallback({
    boundaryComponent: opts?.boundaryComponent ?? null,
    buildFontLinkHeader: buildAppPageFontLinkHeader,
    clearRequestContext() {
      setHeadersContext(null);
      setNavigationContext(null);
    },
    createRscOnErrorHandler(pathname, routePath) {
      return createRscOnErrorHandler(request, pathname, routePath);
    },
    getFontLinks: getSSRFontLinks,
    getFontPreloads: _getSSRFontPreloads,
    getFontStyles: _getSSRFontStyles,
    getNavigationContext,
    globalErrorModule: null,
    isRscRequest,
    layoutModules: opts?.layouts ?? null,
    loadSsrHandler() {
      return import("./ssr/index.js");
    },
    makeThenableParams,
    matchedParams: opts?.matchedParams ?? route?.params ?? {},
    requestUrl: request.url,
    resolveChildSegments: __resolveChildSegments,
    rootForbiddenModule,
    rootLayouts,
    rootNotFoundModule,
    rootUnauthorizedModule,
    route,
    renderToReadableStream,
    statusCode
  });
}
async function renderNotFoundPage(route, isRscRequest, request, matchedParams) {
  return renderHTTPAccessFallbackPage(route, 404, isRscRequest, request, { matchedParams });
}
async function renderErrorBoundaryPage(route, error, isRscRequest, request, matchedParams) {
  return renderAppPageErrorBoundary({
    buildFontLinkHeader: buildAppPageFontLinkHeader,
    clearRequestContext() {
      setHeadersContext(null);
      setNavigationContext(null);
    },
    createRscOnErrorHandler(pathname, routePath) {
      return createRscOnErrorHandler(request, pathname, routePath);
    },
    error,
    getFontLinks: getSSRFontLinks,
    getFontPreloads: _getSSRFontPreloads,
    getFontStyles: _getSSRFontStyles,
    getNavigationContext,
    globalErrorModule: null,
    isRscRequest,
    loadSsrHandler() {
      return import("./ssr/index.js");
    },
    makeThenableParams,
    matchedParams: matchedParams ?? route?.params ?? {},
    requestUrl: request.url,
    resolveChildSegments: __resolveChildSegments,
    rootLayouts,
    route,
    renderToReadableStream,
    sanitizeErrorForClient: __sanitizeErrorForClient
  });
}
function matchRoute(url) {
  const pathname = url.split("?")[0];
  let normalizedUrl = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const urlParts = normalizedUrl.split("/").filter(Boolean);
  return trieMatch(_routeTrie, urlParts);
}
function matchPattern(urlParts, patternParts) {
  const params = /* @__PURE__ */ Object.create(null);
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    if (pp.endsWith("+")) {
      if (i !== patternParts.length - 1) return null;
      const paramName = pp.slice(1, -1);
      const remaining = urlParts.slice(i);
      if (remaining.length === 0) return null;
      params[paramName] = remaining;
      return params;
    }
    if (pp.endsWith("*")) {
      if (i !== patternParts.length - 1) return null;
      const paramName = pp.slice(1, -1);
      params[paramName] = urlParts.slice(i);
      return params;
    }
    if (pp.startsWith(":")) {
      if (i >= urlParts.length) return null;
      params[pp.slice(1)] = urlParts[i];
      continue;
    }
    if (i >= urlParts.length || urlParts[i] !== pp) return null;
  }
  if (urlParts.length !== patternParts.length) return null;
  return params;
}
const interceptLookup = [];
for (let ri = 0; ri < routes.length; ri++) {
  const r = routes[ri];
  if (!r.slots) continue;
  for (const [slotName, slotMod] of Object.entries(r.slots)) {
    if (!slotMod.intercepts) continue;
    for (const intercept of slotMod.intercepts) {
      interceptLookup.push({
        sourceRouteIndex: ri,
        slotName,
        targetPattern: intercept.targetPattern,
        targetPatternParts: intercept.targetPattern.split("/").filter(Boolean),
        page: intercept.page,
        params: intercept.params
      });
    }
  }
}
function findIntercept(pathname) {
  const urlParts = pathname.split("/").filter(Boolean);
  for (const entry of interceptLookup) {
    const params = matchPattern(urlParts, entry.targetPatternParts);
    if (params !== null) {
      return { ...entry, matchedParams: params };
    }
  }
  return null;
}
async function buildPageElement(route, params, opts, searchParams) {
  const PageComponent = route.page?.default;
  if (!PageComponent) {
    return react_reactServerExports.createElement("div", null, "Page has no default export");
  }
  const layoutMods = route.layouts.filter(Boolean);
  const layoutMetaPromises = [];
  let accumulatedMetaPromise = Promise.resolve({});
  for (let i = 0; i < layoutMods.length; i++) {
    const parentForThisLayout = accumulatedMetaPromise;
    const metaPromise = resolveModuleMetadata(layoutMods[i], params, void 0, parentForThisLayout).catch((err) => {
      console.error("[vinext] Layout generateMetadata() failed:", err);
      return null;
    });
    layoutMetaPromises.push(metaPromise);
    accumulatedMetaPromise = metaPromise.then(
      async (result) => result ? mergeMetadata([await parentForThisLayout, result]) : await parentForThisLayout
    );
  }
  const pageParentPromise = accumulatedMetaPromise;
  const spObj = {};
  let hasSearchParams = false;
  if (searchParams && searchParams.forEach) {
    searchParams.forEach(function(v, k) {
      hasSearchParams = true;
      if (k in spObj) {
        spObj[k] = Array.isArray(spObj[k]) ? spObj[k].concat(v) : [spObj[k], v];
      } else {
        spObj[k] = v;
      }
    });
  }
  const [layoutMetaResults, layoutVpResults, pageMeta, pageVp] = await Promise.all([
    Promise.all(layoutMetaPromises),
    Promise.all(layoutMods.map((mod) => resolveModuleViewport(mod, params).catch((err) => {
      console.error("[vinext] Layout generateViewport() failed:", err);
      return null;
    }))),
    route.page ? resolveModuleMetadata(route.page, params, spObj, pageParentPromise) : Promise.resolve(null),
    route.page ? resolveModuleViewport(route.page, params) : Promise.resolve(null)
  ]);
  const metadataList = [...layoutMetaResults.filter(Boolean), ...pageMeta ? [pageMeta] : []];
  const viewportList = [...layoutVpResults.filter(Boolean), ...pageVp ? [pageVp] : []];
  const resolvedMetadata = metadataList.length > 0 ? mergeMetadata(metadataList) : null;
  const resolvedViewport = mergeViewport(viewportList);
  const asyncParams = makeThenableParams(params);
  const pageProps = { params: asyncParams };
  if (searchParams) {
    pageProps.searchParams = makeThenableParams(spObj);
    if (hasSearchParams) markDynamicUsage();
  }
  let element = react_reactServerExports.createElement(PageComponent, pageProps);
  element = react_reactServerExports.createElement(LayoutSegmentProvider, { childSegments: [] }, element);
  {
    const headElements = [];
    headElements.push(react_reactServerExports.createElement("meta", { charSet: "utf-8" }));
    if (resolvedMetadata) headElements.push(react_reactServerExports.createElement(MetadataHead, { metadata: resolvedMetadata }));
    headElements.push(react_reactServerExports.createElement(ViewportHead, { viewport: resolvedViewport }));
    element = react_reactServerExports.createElement(react_reactServerExports.Fragment, null, ...headElements, element);
  }
  if (route.loading?.default) {
    element = react_reactServerExports.createElement(
      react_reactServerExports.Suspense,
      { fallback: react_reactServerExports.createElement(route.loading.default) },
      element
    );
  }
  {
    const lastLayoutError = route.errors ? route.errors[route.errors.length - 1] : null;
    if (route.error?.default && route.error !== lastLayoutError) {
      element = react_reactServerExports.createElement(ErrorBoundary, {
        fallback: route.error.default,
        children: element
      });
    }
  }
  {
    const NotFoundComponent = route.notFound?.default ?? null;
    if (NotFoundComponent) {
      element = react_reactServerExports.createElement(NotFoundBoundary, {
        fallback: react_reactServerExports.createElement(NotFoundComponent),
        children: element
      });
    }
  }
  if (route.templates) {
    for (let i = route.templates.length - 1; i >= 0; i--) {
      const TemplateComponent = route.templates[i]?.default;
      if (TemplateComponent) {
        element = react_reactServerExports.createElement(TemplateComponent, { children: element, params });
      }
    }
  }
  for (let i = route.layouts.length - 1; i >= 0; i--) {
    if (route.errors && route.errors[i]?.default) {
      element = react_reactServerExports.createElement(ErrorBoundary, {
        fallback: route.errors[i].default,
        children: element
      });
    }
    const LayoutComponent = route.layouts[i]?.default;
    if (LayoutComponent) {
      {
        const LayoutNotFound = route.notFounds?.[i]?.default;
        if (LayoutNotFound) {
          element = react_reactServerExports.createElement(NotFoundBoundary, {
            fallback: react_reactServerExports.createElement(LayoutNotFound),
            children: element
          });
        }
      }
      const layoutProps = { children: element, params: makeThenableParams(params) };
      if (route.slots) {
        for (const [slotName, slotMod] of Object.entries(route.slots)) {
          const targetIdx = slotMod.layoutIndex >= 0 ? slotMod.layoutIndex : route.layouts.length - 1;
          if (i !== targetIdx) continue;
          let SlotPage = null;
          let slotParams = params;
          if (opts && opts.interceptSlot === slotName && opts.interceptPage) {
            SlotPage = opts.interceptPage.default;
            slotParams = opts.interceptParams || params;
          } else {
            SlotPage = slotMod.page?.default || slotMod.default?.default;
          }
          if (SlotPage) {
            let slotElement = react_reactServerExports.createElement(SlotPage, { params: makeThenableParams(slotParams) });
            const SlotLayout = slotMod.layout?.default;
            if (SlotLayout) {
              slotElement = react_reactServerExports.createElement(SlotLayout, {
                children: slotElement,
                params: makeThenableParams(slotParams)
              });
            }
            if (slotMod.loading?.default) {
              slotElement = react_reactServerExports.createElement(
                react_reactServerExports.Suspense,
                { fallback: react_reactServerExports.createElement(slotMod.loading.default) },
                slotElement
              );
            }
            if (slotMod.error?.default) {
              slotElement = react_reactServerExports.createElement(ErrorBoundary, {
                fallback: slotMod.error.default,
                children: slotElement
              });
            }
            layoutProps[slotName] = slotElement;
          }
        }
      }
      element = react_reactServerExports.createElement(LayoutComponent, layoutProps);
      const treePos = route.layoutTreePositions ? route.layoutTreePositions[i] : 0;
      const childSegs = __resolveChildSegments(route.routeSegments || [], treePos, params);
      element = react_reactServerExports.createElement(LayoutSegmentProvider, { childSegments: childSegs }, element);
    }
  }
  return element;
}
const __basePath = "";
const __trailingSlash = false;
const __i18nConfig = null;
const __configRedirects = [];
const __configRewrites = { "beforeFiles": [], "afterFiles": [], "fallback": [] };
const __configHeaders = [];
const __allowedOrigins = [];
function __normalizePath(pathname) {
  if (pathname === "/" || pathname.length > 1 && pathname[0] === "/" && !pathname.includes("//") && !pathname.includes("/./") && !pathname.includes("/../") && !pathname.endsWith("/.") && !pathname.endsWith("/..")) {
    return pathname;
  }
  const segments = pathname.split("/");
  const resolved = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg === "" || seg === ".") continue;
    if (seg === "..") {
      resolved.pop();
    } else {
      resolved.push(seg);
    }
  }
  return "/" + resolved.join("/");
}
const __pathDelimiterRegex = /([/#?\\]|%(2f|23|3f|5c))/gi;
function __decodeRouteSegment(segment) {
  return decodeURIComponent(segment).replace(__pathDelimiterRegex, function(char) {
    return encodeURIComponent(char);
  });
}
function __decodeRouteSegmentSafe(segment) {
  try {
    return __decodeRouteSegment(segment);
  } catch (e) {
    return segment;
  }
}
function __normalizePathnameForRouteMatch(pathname) {
  const segments = pathname.split("/");
  const normalized = [];
  for (let i = 0; i < segments.length; i++) {
    normalized.push(__decodeRouteSegmentSafe(segments[i]));
  }
  return normalized.join("/");
}
function __normalizePathnameForRouteMatchStrict(pathname) {
  const segments = pathname.split("/");
  const normalized = [];
  for (let i = 0; i < segments.length; i++) {
    normalized.push(__decodeRouteSegment(segments[i]));
  }
  return normalized.join("/");
}
function __buildPostMwRequestContext(request) {
  const url = new URL(request.url);
  const ctx = getHeadersContext();
  if (!ctx) return requestContextFromRequest(request);
  const cookiesRecord = Object.fromEntries(ctx.cookies);
  return {
    headers: ctx.headers,
    cookies: cookiesRecord,
    query: url.searchParams,
    host: normalizeHost(ctx.headers.get("host"), url.hostname)
  };
}
var __MAX_ACTION_BODY_SIZE = 1048576;
async function __readBodyWithLimit(request, maxBytes) {
  if (!request.body) return "";
  var reader = request.body.getReader();
  var decoder = new TextDecoder();
  var chunks = [];
  var totalSize = 0;
  for (; ; ) {
    var result = await reader.read();
    if (result.done) break;
    totalSize += result.value.byteLength;
    if (totalSize > maxBytes) {
      reader.cancel();
      throw new Error("Request body too large");
    }
    chunks.push(decoder.decode(result.value, { stream: true }));
  }
  chunks.push(decoder.decode());
  return chunks.join("");
}
async function __readFormDataWithLimit(request, maxBytes) {
  if (!request.body) return new FormData();
  var reader = request.body.getReader();
  var chunks = [];
  var totalSize = 0;
  for (; ; ) {
    var result = await reader.read();
    if (result.done) break;
    totalSize += result.value.byteLength;
    if (totalSize > maxBytes) {
      reader.cancel();
      throw new Error("Request body too large");
    }
    chunks.push(result.value);
  }
  var combined = new Uint8Array(totalSize);
  var offset = 0;
  for (var chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  var contentType = request.headers.get("content-type") || "";
  return new Response(combined, { headers: { "Content-Type": contentType } }).formData();
}
const generateStaticParamsMap = {
  // TODO: layout-level generateStaticParams — this map only includes routes that
  // have a pagePath (leaf pages). Layout segments can also export generateStaticParams
  // to provide parent params for nested dynamic routes, but they don't have a pagePath
  // so they are excluded here. Supporting layout-level generateStaticParams requires
  // scanning layout.tsx files separately and including them in this map.
};
async function handler(request, ctx) {
  const headersCtx = headersContextFromRequest(request);
  const __uCtx = createRequestContext({
    headersContext: headersCtx,
    executionContext: ctx ?? getRequestExecutionContext() ?? null
  });
  return runWithRequestContext(__uCtx, async () => {
    ensureFetchPatch();
    const __reqCtx = requestContextFromRequest(request);
    const _mwCtx = { headers: null, status: null };
    const response = await _handleRequest(request, __reqCtx, _mwCtx);
    if (response && response.headers && !(response.status >= 300 && response.status < 400)) {
      if (__configHeaders.length) {
        const url = new URL(request.url);
        let pathname;
        try {
          pathname = __normalizePath(__normalizePathnameForRouteMatch(url.pathname));
        } catch {
          pathname = url.pathname;
        }
        const extraHeaders = matchHeaders(pathname, __configHeaders, __reqCtx);
        for (const h of extraHeaders) {
          const lk = h.key.toLowerCase();
          if (lk === "vary" || lk === "set-cookie") {
            response.headers.append(h.key, h.value);
          } else if (!response.headers.has(lk)) {
            response.headers.set(h.key, h.value);
          }
        }
      }
    }
    return response;
  });
}
async function _handleRequest(request, __reqCtx, _mwCtx) {
  const __reqStart = 0;
  const url = new URL(request.url);
  const __protoGuard = guardProtocolRelativeUrl(url.pathname);
  if (__protoGuard) return __protoGuard;
  let decodedUrlPathname;
  try {
    decodedUrlPathname = __normalizePathnameForRouteMatchStrict(url.pathname);
  } catch (e) {
    return new Response("Bad Request", { status: 400 });
  }
  let pathname = __normalizePath(decodedUrlPathname);
  if (pathname === "/__vinext/prerender/static-params") {
    if (process.env.VINEXT_PRERENDER !== "1") {
      return new Response("Not Found", { status: 404 });
    }
    const pattern = url.searchParams.get("pattern");
    if (!pattern) return new Response("missing pattern", { status: 400 });
    const fn = generateStaticParamsMap[pattern];
    if (typeof fn !== "function") return new Response("null", { status: 200, headers: { "content-type": "application/json" } });
    try {
      const parentParams = url.searchParams.get("parentParams");
      const raw = parentParams ? JSON.parse(parentParams) : {};
      const params2 = typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw : {};
      const result = await fn({ params: params2 });
      return new Response(JSON.stringify(result), { status: 200, headers: { "content-type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
    }
  }
  const __tsRedirect = normalizeTrailingSlash(pathname, __basePath, __trailingSlash, url.search);
  if (__tsRedirect) return __tsRedirect;
  if (__configRedirects.length) {
    const __redirPathname = pathname.endsWith(".rsc") ? pathname.slice(0, -4) : pathname;
    const __redir = matchRedirect(__redirPathname, __configRedirects, __reqCtx);
    if (__redir) {
      const __redirDest = sanitizeDestination(
        __redir.destination
      );
      return new Response(null, {
        status: __redir.permanent ? 308 : 307,
        headers: { Location: __redirDest }
      });
    }
  }
  const isRscRequest = pathname.endsWith(".rsc") || request.headers.get("accept")?.includes("text/x-component");
  let cleanPathname = pathname.replace(/\.rsc$/, "");
  const __postMwReqCtx = __buildPostMwRequestContext(request);
  if (__configRewrites.beforeFiles && __configRewrites.beforeFiles.length) {
    const __rewritten = matchRewrite(cleanPathname, __configRewrites.beforeFiles, __postMwReqCtx);
    if (__rewritten) {
      if (isExternalUrl(__rewritten)) {
        setHeadersContext(null);
        setNavigationContext(null);
        return proxyExternalRequest(request, __rewritten);
      }
      cleanPathname = __rewritten;
    }
  }
  if (cleanPathname === "/_vinext/image") {
    const __imgResult = validateImageUrl(url.searchParams.get("url"), request.url);
    if (__imgResult instanceof Response) return __imgResult;
    return Response.redirect(new URL(__imgResult, url.origin).href, 302);
  }
  for (const metaRoute of metadataRoutes) {
    if (metaRoute.type === "sitemap" && metaRoute.isDynamic && typeof metaRoute.module.generateSitemaps === "function") {
      const sitemapPrefix = metaRoute.servedUrl.slice(0, -4);
      if (cleanPathname.startsWith(sitemapPrefix + "/") && cleanPathname.endsWith(".xml")) {
        const rawId = cleanPathname.slice(sitemapPrefix.length + 1, -4);
        if (rawId.includes("/")) continue;
        const sitemaps = await metaRoute.module.generateSitemaps();
        const matched = sitemaps.find(function(s) {
          return String(s.id) === rawId;
        });
        if (!matched) return new Response("Not Found", { status: 404 });
        const result = await metaRoute.module.default({ id: matched.id });
        if (result instanceof Response) return result;
        return new Response(sitemapToXml(result), {
          headers: { "Content-Type": metaRoute.contentType }
        });
      }
      continue;
    }
    var _metaParams = null;
    if (metaRoute.patternParts) {
      var _metaUrlParts = cleanPathname.split("/").filter(Boolean);
      _metaParams = matchPattern(_metaUrlParts, metaRoute.patternParts);
      if (!_metaParams) continue;
    } else if (cleanPathname !== metaRoute.servedUrl) {
      continue;
    }
    if (metaRoute.isDynamic) {
      const metaFn = metaRoute.module.default;
      if (typeof metaFn === "function") {
        const result = await metaFn({ params: makeThenableParams(_metaParams || {}) });
        let body;
        if (result instanceof Response) return result;
        if (metaRoute.type === "sitemap") body = sitemapToXml(result);
        else if (metaRoute.type === "robots") body = robotsToText(result);
        else if (metaRoute.type === "manifest") body = manifestToJson(result);
        else body = JSON.stringify(result);
        return new Response(body, {
          headers: { "Content-Type": metaRoute.contentType }
        });
      }
    } else {
      try {
        const binary = atob(metaRoute.fileDataBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Response(bytes, {
          headers: {
            "Content-Type": metaRoute.contentType,
            "Cache-Control": "public, max-age=0, must-revalidate"
          }
        });
      } catch {
        return new Response("Not Found", { status: 404 });
      }
    }
  }
  setNavigationContext({
    pathname: cleanPathname,
    searchParams: url.searchParams,
    params: {}
  });
  const actionId = request.headers.get("x-rsc-action");
  if (request.method === "POST" && actionId) {
    const csrfResponse = validateCsrfOrigin(request, __allowedOrigins);
    if (csrfResponse) return csrfResponse;
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > __MAX_ACTION_BODY_SIZE) {
      setHeadersContext(null);
      setNavigationContext(null);
      return new Response("Payload Too Large", { status: 413 });
    }
    try {
      const contentType = request.headers.get("content-type") || "";
      let body;
      try {
        body = contentType.startsWith("multipart/form-data") ? await __readFormDataWithLimit(request, __MAX_ACTION_BODY_SIZE) : await __readBodyWithLimit(request, __MAX_ACTION_BODY_SIZE);
      } catch (sizeErr) {
        if (sizeErr && sizeErr.message === "Request body too large") {
          setHeadersContext(null);
          setNavigationContext(null);
          return new Response("Payload Too Large", { status: 413 });
        }
        throw sizeErr;
      }
      const temporaryReferences = createTemporaryReferenceSet();
      const args = await decodeReply(body, { temporaryReferences });
      const action = await loadServerAction(actionId);
      let returnValue;
      let actionRedirect = null;
      const previousHeadersPhase = setHeadersAccessPhase("action");
      try {
        try {
          const data = await action.apply(null, args);
          returnValue = { ok: true, data };
        } catch (e) {
          if (e && typeof e === "object" && "digest" in e) {
            const digest = String(e.digest);
            if (digest.startsWith("NEXT_REDIRECT;")) {
              const parts = digest.split(";");
              actionRedirect = {
                url: decodeURIComponent(parts[2]),
                type: parts[1] || "replace",
                // "push" or "replace"
                status: parts[3] ? parseInt(parts[3], 10) : 307
              };
              returnValue = { ok: true, data: void 0 };
            } else if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;")) {
              returnValue = { ok: false, data: e };
            } else {
              console.error("[vinext] Server action error:", e);
              returnValue = { ok: false, data: __sanitizeErrorForClient(e) };
            }
          } else {
            console.error("[vinext] Server action error:", e);
            returnValue = { ok: false, data: __sanitizeErrorForClient(e) };
          }
        }
      } finally {
        setHeadersAccessPhase(previousHeadersPhase);
      }
      if (actionRedirect) {
        const actionPendingCookies2 = getAndClearPendingCookies();
        const actionDraftCookie2 = getDraftModeCookieHeader();
        setHeadersContext(null);
        setNavigationContext(null);
        const redirectHeaders = new Headers({
          "Content-Type": "text/x-component; charset=utf-8",
          "Vary": "RSC, Accept",
          "x-action-redirect": actionRedirect.url,
          "x-action-redirect-type": actionRedirect.type,
          "x-action-redirect-status": String(actionRedirect.status)
        });
        for (const cookie of actionPendingCookies2) {
          redirectHeaders.append("Set-Cookie", cookie);
        }
        if (actionDraftCookie2) redirectHeaders.append("Set-Cookie", actionDraftCookie2);
        return new Response("", { status: 200, headers: redirectHeaders });
      }
      const match22 = matchRoute(cleanPathname);
      let element2;
      if (match22) {
        const { route: actionRoute, params: actionParams } = match22;
        setNavigationContext({
          pathname: cleanPathname,
          searchParams: url.searchParams,
          params: actionParams
        });
        element2 = buildPageElement(actionRoute, actionParams, void 0, url.searchParams);
      } else {
        element2 = react_reactServerExports.createElement("div", null, "Page not found");
      }
      const onRenderError = createRscOnErrorHandler(
        request,
        cleanPathname,
        match22 ? match22.route.pattern : cleanPathname
      );
      const rscStream = renderToReadableStream(
        { root: element2, returnValue },
        { temporaryReferences, onError: onRenderError }
      );
      const actionPendingCookies = getAndClearPendingCookies();
      const actionDraftCookie = getDraftModeCookieHeader();
      const actionHeaders = { "Content-Type": "text/x-component; charset=utf-8", "Vary": "RSC, Accept" };
      const actionResponse = new Response(rscStream, { headers: actionHeaders });
      if (actionPendingCookies.length > 0 || actionDraftCookie) {
        for (const cookie of actionPendingCookies) {
          actionResponse.headers.append("Set-Cookie", cookie);
        }
        if (actionDraftCookie) actionResponse.headers.append("Set-Cookie", actionDraftCookie);
      }
      return actionResponse;
    } catch (err) {
      getAndClearPendingCookies();
      console.error("[vinext] Server action error:", err);
      reportRequestError(
        err instanceof Error ? err : new Error(String(err)),
        { path: cleanPathname, method: request.method, headers: Object.fromEntries(request.headers.entries()) },
        { routerKind: "App Router", routePath: cleanPathname, routeType: "action" }
      );
      setHeadersContext(null);
      setNavigationContext(null);
      return new Response(
        "Internal Server Error",
        { status: 500 }
      );
    }
  }
  if (__configRewrites.afterFiles && __configRewrites.afterFiles.length) {
    const __afterRewritten = matchRewrite(cleanPathname, __configRewrites.afterFiles, __postMwReqCtx);
    if (__afterRewritten) {
      if (isExternalUrl(__afterRewritten)) {
        setHeadersContext(null);
        setNavigationContext(null);
        return proxyExternalRequest(request, __afterRewritten);
      }
      cleanPathname = __afterRewritten;
    }
  }
  let match2 = matchRoute(cleanPathname);
  if (!match2 && __configRewrites.fallback && __configRewrites.fallback.length) {
    const __fallbackRewritten = matchRewrite(cleanPathname, __configRewrites.fallback, __postMwReqCtx);
    if (__fallbackRewritten) {
      if (isExternalUrl(__fallbackRewritten)) {
        setHeadersContext(null);
        setNavigationContext(null);
        return proxyExternalRequest(request, __fallbackRewritten);
      }
      cleanPathname = __fallbackRewritten;
      match2 = matchRoute(cleanPathname);
    }
  }
  if (!match2) {
    const notFoundResponse = await renderNotFoundPage(null, isRscRequest, request);
    if (notFoundResponse) return notFoundResponse;
    setHeadersContext(null);
    setNavigationContext(null);
    return new Response("Not Found", { status: 404 });
  }
  const { route, params } = match2;
  setNavigationContext({
    pathname: cleanPathname,
    searchParams: url.searchParams,
    params
  });
  if (route.routeHandler) {
    const handler2 = route.routeHandler;
    const method = request.method.toUpperCase();
    const revalidateSeconds2 = getAppRouteHandlerRevalidateSeconds(handler2);
    if (hasAppRouteHandlerDefaultExport(handler2) && false) ;
    const {
      allowHeaderForOptions,
      handlerFn,
      isAutoHead,
      shouldAutoRespondToOptions
    } = resolveAppRouteHandlerMethod(handler2, method);
    if (shouldAutoRespondToOptions) {
      setHeadersContext(null);
      setNavigationContext(null);
      return applyRouteHandlerMiddlewareContext(
        new Response(null, {
          status: 204,
          headers: { "Allow": allowHeaderForOptions }
        }),
        _mwCtx
      );
    }
    if (shouldReadAppRouteHandlerCache({
      dynamicConfig: handler2.dynamic,
      handlerFn,
      isAutoHead,
      isKnownDynamic: isKnownDynamicAppRoute(route.pattern),
      method,
      revalidateSeconds: revalidateSeconds2
    })) {
      const __cachedRouteResponse = await readAppRouteHandlerCacheResponse({
        basePath: __basePath,
        buildPageCacheTags: __pageCacheTags,
        cleanPathname,
        clearRequestContext: function() {
          setHeadersContext(null);
          setNavigationContext(null);
        },
        consumeDynamicUsage,
        getCollectedFetchTags,
        handlerFn,
        i18n: __i18nConfig,
        isAutoHead,
        isrDebug: __isrDebug,
        isrGet: __isrGet,
        isrRouteKey: __isrRouteKey,
        isrSet: __isrSet,
        markDynamicUsage,
        middlewareContext: _mwCtx,
        params,
        requestUrl: request.url,
        revalidateSearchParams: url.searchParams,
        revalidateSeconds: revalidateSeconds2,
        routePattern: route.pattern,
        runInRevalidationContext: async function(renderFn) {
          const __revalHeadCtx = { headers: new Headers(), cookies: /* @__PURE__ */ new Map() };
          const __revalUCtx = createRequestContext({
            headersContext: __revalHeadCtx,
            executionContext: getRequestExecutionContext()
          });
          await runWithRequestContext(__revalUCtx, async () => {
            ensureFetchPatch();
            await renderFn();
          });
        },
        scheduleBackgroundRegeneration: __triggerBackgroundRegeneration,
        setNavigationContext
      });
      if (__cachedRouteResponse) {
        return __cachedRouteResponse;
      }
    }
    if (typeof handlerFn === "function") {
      return executeAppRouteHandler({
        basePath: __basePath,
        buildPageCacheTags: __pageCacheTags,
        cleanPathname,
        clearRequestContext: function() {
          setHeadersContext(null);
          setNavigationContext(null);
        },
        consumeDynamicUsage,
        executionContext: getRequestExecutionContext(),
        getAndClearPendingCookies,
        getCollectedFetchTags,
        getDraftModeCookieHeader,
        handler: handler2,
        handlerFn,
        i18n: __i18nConfig,
        isAutoHead,
        isProduction: true,
        isrDebug: __isrDebug,
        isrRouteKey: __isrRouteKey,
        isrSet: __isrSet,
        markDynamicUsage,
        method,
        middlewareContext: _mwCtx,
        params,
        reportRequestError,
        request,
        revalidateSeconds: revalidateSeconds2,
        routePattern: route.pattern,
        setHeadersAccessPhase
      });
    }
    setHeadersContext(null);
    setNavigationContext(null);
    return applyRouteHandlerMiddlewareContext(
      new Response(null, {
        status: 405
      }),
      _mwCtx
    );
  }
  const PageComponent = route.page?.default;
  if (!PageComponent) {
    setHeadersContext(null);
    setNavigationContext(null);
    return new Response("Page has no default export", { status: 500 });
  }
  let revalidateSeconds = typeof route.page?.revalidate === "number" ? route.page.revalidate : null;
  const dynamicConfig = route.page?.dynamic;
  const dynamicParamsConfig = route.page?.dynamicParams;
  const isForceStatic = dynamicConfig === "force-static";
  const isDynamicError = dynamicConfig === "error";
  if (isForceStatic) {
    setHeadersContext({ headers: new Headers(), cookies: /* @__PURE__ */ new Map() });
    setNavigationContext({
      pathname: cleanPathname,
      searchParams: new URLSearchParams(),
      params
    });
  }
  if (isDynamicError) {
    const errorMsg = 'Page with `dynamic = "error"` used a dynamic API. This page was expected to be fully static, but headers(), cookies(), or searchParams was accessed. Remove the dynamic API usage or change the dynamic config to "auto" or "force-dynamic".';
    setHeadersContext({
      headers: new Headers(),
      cookies: /* @__PURE__ */ new Map(),
      accessError: new Error(errorMsg)
    });
    setNavigationContext({
      pathname: cleanPathname,
      searchParams: new URLSearchParams(),
      params
    });
  }
  const isForceDynamic = dynamicConfig === "force-dynamic";
  if (!isForceDynamic && revalidateSeconds !== null && revalidateSeconds > 0 && revalidateSeconds !== Infinity) {
    const __cachedPageResponse = await readAppPageCacheResponse({
      cleanPathname,
      clearRequestContext: function() {
        setHeadersContext(null);
        setNavigationContext(null);
      },
      isRscRequest,
      isrDebug: __isrDebug,
      isrGet: __isrGet,
      isrHtmlKey: __isrHtmlKey,
      isrRscKey: __isrRscKey,
      isrSet: __isrSet,
      revalidateSeconds,
      renderFreshPageForCache: async function() {
        const __revalHeadCtx = { headers: new Headers(), cookies: /* @__PURE__ */ new Map() };
        const __revalUCtx = createRequestContext({
          headersContext: __revalHeadCtx,
          executionContext: getRequestExecutionContext()
        });
        return runWithRequestContext(__revalUCtx, async () => {
          ensureFetchPatch();
          setNavigationContext({ pathname: cleanPathname, searchParams: new URLSearchParams(), params });
          const __revalElement = await buildPageElement(route, params, void 0, new URLSearchParams());
          const __revalOnError = createRscOnErrorHandler(request, cleanPathname, route.pattern);
          const __revalRscStream = renderToReadableStream(__revalElement, { onError: __revalOnError });
          const __revalRscCapture = teeAppPageRscStreamForCapture(__revalRscStream, true);
          const __revalFontData = { links: getSSRFontLinks(), styles: _getSSRFontStyles(), preloads: _getSSRFontPreloads() };
          const __revalSsrEntry = await import("./ssr/index.js");
          const __revalHtmlStream = await __revalSsrEntry.handleSsr(
            __revalRscCapture.responseStream,
            getNavigationContext(),
            __revalFontData
          );
          setHeadersContext(null);
          setNavigationContext(null);
          const __freshHtml = await readAppPageTextStream(__revalHtmlStream);
          const __freshRscData = await __revalRscCapture.capturedRscDataPromise;
          const __pageTags = __pageCacheTags(cleanPathname, getCollectedFetchTags());
          return { html: __freshHtml, rscData: __freshRscData, tags: __pageTags };
        });
      },
      scheduleBackgroundRegeneration: __triggerBackgroundRegeneration
    });
    if (__cachedPageResponse) {
      return __cachedPageResponse;
    }
  }
  const __dynamicParamsResponse = await validateAppPageDynamicParams({
    clearRequestContext() {
      setHeadersContext(null);
      setNavigationContext(null);
    },
    enforceStaticParamsOnly: dynamicParamsConfig === false,
    generateStaticParams: route.page?.generateStaticParams,
    isDynamicRoute: route.isDynamic,
    logGenerateStaticParamsError(err) {
      console.error("[vinext] generateStaticParams error:", err);
    },
    params
  });
  if (__dynamicParamsResponse) {
    return __dynamicParamsResponse;
  }
  const __interceptResult = await resolveAppPageIntercept({
    buildPageElement,
    cleanPathname,
    currentRoute: route,
    findIntercept,
    getRoutePattern(sourceRoute) {
      return sourceRoute.pattern;
    },
    getSourceRoute(sourceRouteIndex) {
      return routes[sourceRouteIndex];
    },
    isRscRequest,
    matchSourceRouteParams(pattern) {
      return matchRoute(pattern)?.params ?? {};
    },
    renderInterceptResponse(sourceRoute, interceptElement) {
      const interceptOnError = createRscOnErrorHandler(
        request,
        cleanPathname,
        sourceRoute.pattern
      );
      const interceptStream = renderToReadableStream(interceptElement, {
        onError: interceptOnError
      });
      return new Response(interceptStream, {
        headers: { "Content-Type": "text/x-component; charset=utf-8", "Vary": "RSC, Accept" }
      });
    },
    searchParams: url.searchParams,
    setNavigationContext,
    toInterceptOpts(intercept) {
      return {
        interceptSlot: intercept.slotName,
        interceptPage: intercept.page,
        interceptParams: intercept.matchedParams
      };
    }
  });
  if (__interceptResult.response) {
    return __interceptResult.response;
  }
  const interceptOpts = __interceptResult.interceptOpts;
  const __pageBuildResult = await buildAppPageElement({
    buildPageElement() {
      return buildPageElement(route, params, interceptOpts, url.searchParams);
    },
    renderErrorBoundaryPage(buildErr) {
      return renderErrorBoundaryPage(route, buildErr, isRscRequest, request, params);
    },
    renderSpecialError(__buildSpecialError) {
      return buildAppPageSpecialErrorResponse({
        clearRequestContext() {
          setHeadersContext(null);
          setNavigationContext(null);
        },
        renderFallbackPage(statusCode) {
          return renderHTTPAccessFallbackPage(route, statusCode, isRscRequest, request, {
            matchedParams: params
          });
        },
        requestUrl: request.url,
        specialError: __buildSpecialError
      });
    },
    resolveSpecialError: resolveAppPageSpecialError
  });
  if (__pageBuildResult.response) {
    return __pageBuildResult.response;
  }
  const element = __pageBuildResult.element;
  const _hasLoadingBoundary = !!(route.loading && route.loading.default);
  const _asyncLayoutParams = makeThenableParams(params);
  return renderAppPageLifecycle({
    cleanPathname,
    clearRequestContext() {
      setHeadersContext(null);
      setNavigationContext(null);
    },
    consumeDynamicUsage,
    createRscOnErrorHandler(pathname2, routePath) {
      return createRscOnErrorHandler(request, pathname2, routePath);
    },
    element,
    getDraftModeCookieHeader,
    getFontLinks: getSSRFontLinks,
    getFontPreloads: _getSSRFontPreloads,
    getFontStyles: _getSSRFontStyles,
    getNavigationContext,
    getPageTags() {
      return __pageCacheTags(cleanPathname, getCollectedFetchTags());
    },
    getRequestCacheLife() {
      return _consumeRequestScopedCacheLife();
    },
    handlerStart: __reqStart,
    hasLoadingBoundary: _hasLoadingBoundary,
    isDynamicError,
    isForceDynamic,
    isForceStatic,
    isProduction: true,
    isRscRequest,
    isrDebug: __isrDebug,
    isrHtmlKey: __isrHtmlKey,
    isrRscKey: __isrRscKey,
    isrSet: __isrSet,
    layoutCount: route.layouts?.length ?? 0,
    loadSsrHandler() {
      return import("./ssr/index.js");
    },
    middlewareContext: _mwCtx,
    params,
    probeLayoutAt(li) {
      const LayoutComp = route.layouts[li]?.default;
      if (!LayoutComp) return null;
      return LayoutComp({ params: _asyncLayoutParams, children: null });
    },
    probePage() {
      return PageComponent({ params });
    },
    revalidateSeconds,
    renderErrorBoundaryResponse(renderErr) {
      return renderErrorBoundaryPage(route, renderErr, isRscRequest, request, params);
    },
    async renderLayoutSpecialError(__layoutSpecialError, li) {
      return buildAppPageSpecialErrorResponse({
        clearRequestContext() {
          setHeadersContext(null);
          setNavigationContext(null);
        },
        renderFallbackPage(statusCode) {
          let parentNotFound = null;
          if (route.notFounds) {
            for (let pi = li - 1; pi >= 0; pi--) {
              if (route.notFounds[pi]?.default) {
                parentNotFound = route.notFounds[pi].default;
                break;
              }
            }
          }
          if (!parentNotFound) parentNotFound = null;
          const parentLayouts = route.layouts.slice(0, li);
          return renderHTTPAccessFallbackPage(route, statusCode, isRscRequest, request, {
            boundaryComponent: parentNotFound,
            layouts: parentLayouts,
            matchedParams: params
          });
        },
        requestUrl: request.url,
        specialError: __layoutSpecialError
      });
    },
    async renderPageSpecialError(specialError) {
      return buildAppPageSpecialErrorResponse({
        clearRequestContext() {
          setHeadersContext(null);
          setNavigationContext(null);
        },
        renderFallbackPage(statusCode) {
          return renderHTTPAccessFallbackPage(route, statusCode, isRscRequest, request, {
            matchedParams: params
          });
        },
        requestUrl: request.url,
        specialError
      });
    },
    renderToReadableStream,
    routeHasLocalBoundary: !!route?.error?.default || !!(route?.errors && route.errors.some(function(e) {
      return e?.default;
    })),
    routePattern: route.pattern,
    runWithSuppressedHookWarning(probe) {
      return _suppressHookWarningAls.run(true, probe);
    },
    waitUntil(__cachePromise) {
      getRequestExecutionContext()?.waitUntil(__cachePromise);
    }
  });
}
export {
  handler as default,
  generateStaticParamsMap
};
