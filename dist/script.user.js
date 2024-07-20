// ==UserScript==
// @name         GitHub Personal Events
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This plugin is used to display personal events on the GitHub homepage
// @author       ahaostudy
// @license      MIT
// @match        https://github.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_addStyle
// ==/UserScript==
var Zt = Object.defineProperty;
var He = (r) => {
  throw TypeError(r);
};
var Vt = (r, e, t) => e in r ? Zt(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var w = (r, e, t) => Vt(r, typeof e != "symbol" ? e + "" : e, t), Jt = (r, e, t) => e.has(r) || He("Cannot " + t);
var Ze = (r, e, t) => e.has(r) ? He("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t);
var Z = (r, e, t) => (Jt(r, e, "access private method"), t);
function Wt(r) {
  const e = document.createElement("div");
  return e.innerHTML = r, e.firstElementChild;
}
function we(r) {
  const e = r.querySelector("relative-time");
  return e ? new Date(e.getAttribute("datetime") || "") : null;
}
class Kt {
  constructor() {
    w(this, "lastDateTime", (/* @__PURE__ */ new Date()).toISOString());
    w(this, "listener", new Qt());
  }
  /**
   * Transforms or filters the list of fetched event elements
   */
  flatmap(e) {
    return e;
  }
  /**
   * Load the user's event list to the homepage
   */
  async load(e) {
    try {
      let t = await this.fetch(e, this.lastDateTime);
      t = this.flatmap(t), this.listener.listen(() => {
        const n = document.querySelector(
          "#conduit-feed-frame > form > button"
        );
        n ? (n.addEventListener("click", () => {
          this.load(e);
        }), this.render(t, !1)) : this.render(t, !0);
      });
    } catch (t) {
      console.error(t);
    }
  }
  /**
   * Render multiple PR nodes to the List on the homepage in chronological order
   */
  render(e, t) {
    const n = document.querySelectorAll("article") || [];
    let s = 0;
    for (let i of n) {
      if (!(i != null && i.parentNode)) continue;
      const o = we(i);
      if (o !== null)
        for (let a = s; a < e.length; a++) {
          const l = e[a], u = we(l);
          if (u && u.getTime() > o.getTime())
            i.parentNode.insertBefore(l, i), this.lastDateTime = u.toISOString(), s = a + 1;
          else break;
        }
    }
    if (t) {
      const i = n[n.length - 1].parentNode;
      if (!i) return;
      let o = /* @__PURE__ */ new Date();
      o.setMonth(o.getMonth() - 3);
      for (let a = s; a < e.length; a++) {
        const l = e[a], u = we(l);
        if (u && u.getTime() > o.getTime())
          i.appendChild(l), this.lastDateTime = u.toISOString(), s = a + 1;
        else break;
      }
    }
  }
}
class Qt {
  constructor() {
    w(this, "count", 0);
  }
  /**
   * Listen PR list loading, execute handler when page loads new PR list (only execute once)
   */
  listen(e) {
    const t = setInterval(() => {
      const n = document.querySelectorAll("turbo-frame").length;
      this.count !== n && (this.count = n, clearInterval(t), e());
    }, 50);
  }
}
function ut(r, e) {
  return function() {
    return r.apply(e, arguments);
  };
}
const { toString: Gt } = Object.prototype, { getPrototypeOf: Le } = Object, he = /* @__PURE__ */ ((r) => (e) => {
  const t = Gt.call(e);
  return r[t] || (r[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), C = (r) => (r = r.toLowerCase(), (e) => he(e) === r), pe = (r) => (e) => typeof e === r, { isArray: q } = Array, X = pe("undefined");
function Xt(r) {
  return r !== null && !X(r) && r.constructor !== null && !X(r.constructor) && _(r.constructor.isBuffer) && r.constructor.isBuffer(r);
}
const ht = C("ArrayBuffer");
function Yt(r) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(r) : e = r && r.buffer && ht(r.buffer), e;
}
const en = pe("string"), _ = pe("function"), pt = pe("number"), fe = (r) => r !== null && typeof r == "object", tn = (r) => r === !0 || r === !1, re = (r) => {
  if (he(r) !== "object")
    return !1;
  const e = Le(r);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in r) && !(Symbol.iterator in r);
}, nn = C("Date"), sn = C("File"), rn = C("Blob"), on = C("FileList"), an = (r) => fe(r) && _(r.pipe), ln = (r) => {
  let e;
  return r && (typeof FormData == "function" && r instanceof FormData || _(r.append) && ((e = he(r)) === "formdata" || // detect form-data instance
  e === "object" && _(r.toString) && r.toString() === "[object FormData]"));
}, cn = C("URLSearchParams"), [un, hn, pn, fn] = ["ReadableStream", "Request", "Response", "Headers"].map(C), dn = (r) => r.trim ? r.trim() : r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Y(r, e, { allOwnKeys: t = !1 } = {}) {
  if (r === null || typeof r > "u")
    return;
  let n, s;
  if (typeof r != "object" && (r = [r]), q(r))
    for (n = 0, s = r.length; n < s; n++)
      e.call(null, r[n], n, r);
  else {
    const i = t ? Object.getOwnPropertyNames(r) : Object.keys(r), o = i.length;
    let a;
    for (n = 0; n < o; n++)
      a = i[n], e.call(null, r[a], a, r);
  }
}
function ft(r, e) {
  e = e.toLowerCase();
  const t = Object.keys(r);
  let n = t.length, s;
  for (; n-- > 0; )
    if (s = t[n], e === s.toLowerCase())
      return s;
  return null;
}
const dt = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, mt = (r) => !X(r) && r !== dt;
function Re() {
  const { caseless: r } = mt(this) && this || {}, e = {}, t = (n, s) => {
    const i = r && ft(e, s) || s;
    re(e[i]) && re(n) ? e[i] = Re(e[i], n) : re(n) ? e[i] = Re({}, n) : q(n) ? e[i] = n.slice() : e[i] = n;
  };
  for (let n = 0, s = arguments.length; n < s; n++)
    arguments[n] && Y(arguments[n], t);
  return e;
}
const mn = (r, e, t, { allOwnKeys: n } = {}) => (Y(e, (s, i) => {
  t && _(s) ? r[i] = ut(s, t) : r[i] = s;
}, { allOwnKeys: n }), r), gn = (r) => (r.charCodeAt(0) === 65279 && (r = r.slice(1)), r), wn = (r, e, t, n) => {
  r.prototype = Object.create(e.prototype, n), r.prototype.constructor = r, Object.defineProperty(r, "super", {
    value: e.prototype
  }), t && Object.assign(r.prototype, t);
}, bn = (r, e, t, n) => {
  let s, i, o;
  const a = {};
  if (e = e || {}, r == null) return e;
  do {
    for (s = Object.getOwnPropertyNames(r), i = s.length; i-- > 0; )
      o = s[i], (!n || n(o, r, e)) && !a[o] && (e[o] = r[o], a[o] = !0);
    r = t !== !1 && Le(r);
  } while (r && (!t || t(r, e)) && r !== Object.prototype);
  return e;
}, yn = (r, e, t) => {
  r = String(r), (t === void 0 || t > r.length) && (t = r.length), t -= e.length;
  const n = r.indexOf(e, t);
  return n !== -1 && n === t;
}, xn = (r) => {
  if (!r) return null;
  if (q(r)) return r;
  let e = r.length;
  if (!pt(e)) return null;
  const t = new Array(e);
  for (; e-- > 0; )
    t[e] = r[e];
  return t;
}, kn = /* @__PURE__ */ ((r) => (e) => r && e instanceof r)(typeof Uint8Array < "u" && Le(Uint8Array)), Rn = (r, e) => {
  const n = (r && r[Symbol.iterator]).call(r);
  let s;
  for (; (s = n.next()) && !s.done; ) {
    const i = s.value;
    e.call(r, i[0], i[1]);
  }
}, Tn = (r, e) => {
  let t;
  const n = [];
  for (; (t = r.exec(e)) !== null; )
    n.push(t);
  return n;
}, En = C("HTMLFormElement"), Sn = (r) => r.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(t, n, s) {
    return n.toUpperCase() + s;
  }
), Ve = (({ hasOwnProperty: r }) => (e, t) => r.call(e, t))(Object.prototype), An = C("RegExp"), gt = (r, e) => {
  const t = Object.getOwnPropertyDescriptors(r), n = {};
  Y(t, (s, i) => {
    let o;
    (o = e(s, i, r)) !== !1 && (n[i] = o || s);
  }), Object.defineProperties(r, n);
}, On = (r) => {
  gt(r, (e, t) => {
    if (_(r) && ["arguments", "caller", "callee"].indexOf(t) !== -1)
      return !1;
    const n = r[t];
    if (_(n)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, _n = (r, e) => {
  const t = {}, n = (s) => {
    s.forEach((i) => {
      t[i] = !0;
    });
  };
  return q(r) ? n(r) : n(String(r).split(e)), t;
}, $n = () => {
}, Cn = (r, e) => r != null && Number.isFinite(r = +r) ? r : e, be = "abcdefghijklmnopqrstuvwxyz", Je = "0123456789", wt = {
  DIGIT: Je,
  ALPHA: be,
  ALPHA_DIGIT: be + be.toUpperCase() + Je
}, Ln = (r = 16, e = wt.ALPHA_DIGIT) => {
  let t = "";
  const { length: n } = e;
  for (; r--; )
    t += e[Math.random() * n | 0];
  return t;
};
function Pn(r) {
  return !!(r && _(r.append) && r[Symbol.toStringTag] === "FormData" && r[Symbol.iterator]);
}
const vn = (r) => {
  const e = new Array(10), t = (n, s) => {
    if (fe(n)) {
      if (e.indexOf(n) >= 0)
        return;
      if (!("toJSON" in n)) {
        e[s] = n;
        const i = q(n) ? [] : {};
        return Y(n, (o, a) => {
          const l = t(o, s + 1);
          !X(l) && (i[a] = l);
        }), e[s] = void 0, i;
      }
    }
    return n;
  };
  return t(r, 0);
}, Nn = C("AsyncFunction"), Bn = (r) => r && (fe(r) || _(r)) && _(r.then) && _(r.catch), h = {
  isArray: q,
  isArrayBuffer: ht,
  isBuffer: Xt,
  isFormData: ln,
  isArrayBufferView: Yt,
  isString: en,
  isNumber: pt,
  isBoolean: tn,
  isObject: fe,
  isPlainObject: re,
  isReadableStream: un,
  isRequest: hn,
  isResponse: pn,
  isHeaders: fn,
  isUndefined: X,
  isDate: nn,
  isFile: sn,
  isBlob: rn,
  isRegExp: An,
  isFunction: _,
  isStream: an,
  isURLSearchParams: cn,
  isTypedArray: kn,
  isFileList: on,
  forEach: Y,
  merge: Re,
  extend: mn,
  trim: dn,
  stripBOM: gn,
  inherits: wn,
  toFlatObject: bn,
  kindOf: he,
  kindOfTest: C,
  endsWith: yn,
  toArray: xn,
  forEachEntry: Rn,
  matchAll: Tn,
  isHTMLForm: En,
  hasOwnProperty: Ve,
  hasOwnProp: Ve,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: gt,
  freezeMethods: On,
  toObjectSet: _n,
  toCamelCase: Sn,
  noop: $n,
  toFiniteNumber: Cn,
  findKey: ft,
  global: dt,
  isContextDefined: mt,
  ALPHABET: wt,
  generateString: Ln,
  isSpecCompliantForm: Pn,
  toJSONObject: vn,
  isAsyncFn: Nn,
  isThenable: Bn
};
function b(r, e, t, n, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = r, this.name = "AxiosError", e && (this.code = e), t && (this.config = t), n && (this.request = n), s && (this.response = s);
}
h.inherits(b, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: h.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const bt = b.prototype, yt = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((r) => {
  yt[r] = { value: r };
});
Object.defineProperties(b, yt);
Object.defineProperty(bt, "isAxiosError", { value: !0 });
b.from = (r, e, t, n, s, i) => {
  const o = Object.create(bt);
  return h.toFlatObject(r, o, function(l) {
    return l !== Error.prototype;
  }, (a) => a !== "isAxiosError"), b.call(o, r.message, e, t, n, s), o.cause = r, o.name = r.name, i && Object.assign(o, i), o;
};
const zn = null;
function Te(r) {
  return h.isPlainObject(r) || h.isArray(r);
}
function xt(r) {
  return h.endsWith(r, "[]") ? r.slice(0, -2) : r;
}
function We(r, e, t) {
  return r ? r.concat(e).map(function(s, i) {
    return s = xt(s), !t && i ? "[" + s + "]" : s;
  }).join(t ? "." : "") : e;
}
function Dn(r) {
  return h.isArray(r) && !r.some(Te);
}
const In = h.toFlatObject(h, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function de(r, e, t) {
  if (!h.isObject(r))
    throw new TypeError("target must be an object");
  e = e || new FormData(), t = h.toFlatObject(t, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(g, k) {
    return !h.isUndefined(k[g]);
  });
  const n = t.metaTokens, s = t.visitor || c, i = t.dots, o = t.indexes, l = (t.Blob || typeof Blob < "u" && Blob) && h.isSpecCompliantForm(e);
  if (!h.isFunction(s))
    throw new TypeError("visitor must be a function");
  function u(f) {
    if (f === null) return "";
    if (h.isDate(f))
      return f.toISOString();
    if (!l && h.isBlob(f))
      throw new b("Blob is not supported. Use a Buffer instead.");
    return h.isArrayBuffer(f) || h.isTypedArray(f) ? l && typeof Blob == "function" ? new Blob([f]) : Buffer.from(f) : f;
  }
  function c(f, g, k) {
    let E = f;
    if (f && !k && typeof f == "object") {
      if (h.endsWith(g, "{}"))
        g = n ? g : g.slice(0, -2), f = JSON.stringify(f);
      else if (h.isArray(f) && Dn(f) || (h.isFileList(f) || h.endsWith(g, "[]")) && (E = h.toArray(f)))
        return g = xt(g), E.forEach(function(R, N) {
          !(h.isUndefined(R) || R === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? We([g], N, i) : o === null ? g : g + "[]",
            u(R)
          );
        }), !1;
    }
    return Te(f) ? !0 : (e.append(We(k, g, i), u(f)), !1);
  }
  const p = [], m = Object.assign(In, {
    defaultVisitor: c,
    convertValue: u,
    isVisitable: Te
  });
  function d(f, g) {
    if (!h.isUndefined(f)) {
      if (p.indexOf(f) !== -1)
        throw Error("Circular reference detected in " + g.join("."));
      p.push(f), h.forEach(f, function(E, O) {
        (!(h.isUndefined(E) || E === null) && s.call(
          e,
          E,
          h.isString(O) ? O.trim() : O,
          g,
          m
        )) === !0 && d(E, g ? g.concat(O) : [O]);
      }), p.pop();
    }
  }
  if (!h.isObject(r))
    throw new TypeError("data must be an object");
  return d(r), e;
}
function Ke(r) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(r).replace(/[!'()~]|%20|%00/g, function(n) {
    return e[n];
  });
}
function Pe(r, e) {
  this._pairs = [], r && de(r, this, e);
}
const kt = Pe.prototype;
kt.append = function(e, t) {
  this._pairs.push([e, t]);
};
kt.toString = function(e) {
  const t = e ? function(n) {
    return e.call(this, n, Ke);
  } : Ke;
  return this._pairs.map(function(s) {
    return t(s[0]) + "=" + t(s[1]);
  }, "").join("&");
};
function Fn(r) {
  return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Rt(r, e, t) {
  if (!e)
    return r;
  const n = t && t.encode || Fn, s = t && t.serialize;
  let i;
  if (s ? i = s(e, t) : i = h.isURLSearchParams(e) ? e.toString() : new Pe(e, t).toString(n), i) {
    const o = r.indexOf("#");
    o !== -1 && (r = r.slice(0, o)), r += (r.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return r;
}
class Qe {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(e, t, n) {
    return this.handlers.push({
      fulfilled: e,
      rejected: t,
      synchronous: n ? n.synchronous : !1,
      runWhen: n ? n.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(e) {
    this.handlers[e] && (this.handlers[e] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(e) {
    h.forEach(this.handlers, function(n) {
      n !== null && e(n);
    });
  }
}
const Tt = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, jn = typeof URLSearchParams < "u" ? URLSearchParams : Pe, Un = typeof FormData < "u" ? FormData : null, qn = typeof Blob < "u" ? Blob : null, Mn = {
  isBrowser: !0,
  classes: {
    URLSearchParams: jn,
    FormData: Un,
    Blob: qn
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, ve = typeof window < "u" && typeof document < "u", Hn = ((r) => ve && ["ReactNative", "NativeScript", "NS"].indexOf(r) < 0)(typeof navigator < "u" && navigator.product), Zn = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Vn = ve && window.location.href || "http://localhost", Jn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: ve,
  hasStandardBrowserEnv: Hn,
  hasStandardBrowserWebWorkerEnv: Zn,
  origin: Vn
}, Symbol.toStringTag, { value: "Module" })), $ = {
  ...Jn,
  ...Mn
};
function Wn(r, e) {
  return de(r, new $.classes.URLSearchParams(), Object.assign({
    visitor: function(t, n, s, i) {
      return $.isNode && h.isBuffer(t) ? (this.append(n, t.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function Kn(r) {
  return h.matchAll(/\w+|\[(\w*)]/g, r).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function Qn(r) {
  const e = {}, t = Object.keys(r);
  let n;
  const s = t.length;
  let i;
  for (n = 0; n < s; n++)
    i = t[n], e[i] = r[i];
  return e;
}
function Et(r) {
  function e(t, n, s, i) {
    let o = t[i++];
    if (o === "__proto__") return !0;
    const a = Number.isFinite(+o), l = i >= t.length;
    return o = !o && h.isArray(s) ? s.length : o, l ? (h.hasOwnProp(s, o) ? s[o] = [s[o], n] : s[o] = n, !a) : ((!s[o] || !h.isObject(s[o])) && (s[o] = []), e(t, n, s[o], i) && h.isArray(s[o]) && (s[o] = Qn(s[o])), !a);
  }
  if (h.isFormData(r) && h.isFunction(r.entries)) {
    const t = {};
    return h.forEachEntry(r, (n, s) => {
      e(Kn(n), s, t, 0);
    }), t;
  }
  return null;
}
function Gn(r, e, t) {
  if (h.isString(r))
    try {
      return (e || JSON.parse)(r), h.trim(r);
    } catch (n) {
      if (n.name !== "SyntaxError")
        throw n;
    }
  return (t || JSON.stringify)(r);
}
const ee = {
  transitional: Tt,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, t) {
    const n = t.getContentType() || "", s = n.indexOf("application/json") > -1, i = h.isObject(e);
    if (i && h.isHTMLForm(e) && (e = new FormData(e)), h.isFormData(e))
      return s ? JSON.stringify(Et(e)) : e;
    if (h.isArrayBuffer(e) || h.isBuffer(e) || h.isStream(e) || h.isFile(e) || h.isBlob(e) || h.isReadableStream(e))
      return e;
    if (h.isArrayBufferView(e))
      return e.buffer;
    if (h.isURLSearchParams(e))
      return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let a;
    if (i) {
      if (n.indexOf("application/x-www-form-urlencoded") > -1)
        return Wn(e, this.formSerializer).toString();
      if ((a = h.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
        const l = this.env && this.env.FormData;
        return de(
          a ? { "files[]": e } : e,
          l && new l(),
          this.formSerializer
        );
      }
    }
    return i || s ? (t.setContentType("application/json", !1), Gn(e)) : e;
  }],
  transformResponse: [function(e) {
    const t = this.transitional || ee.transitional, n = t && t.forcedJSONParsing, s = this.responseType === "json";
    if (h.isResponse(e) || h.isReadableStream(e))
      return e;
    if (e && h.isString(e) && (n && !this.responseType || s)) {
      const o = !(t && t.silentJSONParsing) && s;
      try {
        return JSON.parse(e);
      } catch (a) {
        if (o)
          throw a.name === "SyntaxError" ? b.from(a, b.ERR_BAD_RESPONSE, this, null, this.response) : a;
      }
    }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: $.classes.FormData,
    Blob: $.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
h.forEach(["delete", "get", "head", "post", "put", "patch"], (r) => {
  ee.headers[r] = {};
});
const Xn = h.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Yn = (r) => {
  const e = {};
  let t, n, s;
  return r && r.split(`
`).forEach(function(o) {
    s = o.indexOf(":"), t = o.substring(0, s).trim().toLowerCase(), n = o.substring(s + 1).trim(), !(!t || e[t] && Xn[t]) && (t === "set-cookie" ? e[t] ? e[t].push(n) : e[t] = [n] : e[t] = e[t] ? e[t] + ", " + n : n);
  }), e;
}, Ge = Symbol("internals");
function V(r) {
  return r && String(r).trim().toLowerCase();
}
function ie(r) {
  return r === !1 || r == null ? r : h.isArray(r) ? r.map(ie) : String(r);
}
function es(r) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let n;
  for (; n = t.exec(r); )
    e[n[1]] = n[2];
  return e;
}
const ts = (r) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(r.trim());
function ye(r, e, t, n, s) {
  if (h.isFunction(n))
    return n.call(this, e, t);
  if (s && (e = t), !!h.isString(e)) {
    if (h.isString(n))
      return e.indexOf(n) !== -1;
    if (h.isRegExp(n))
      return n.test(e);
  }
}
function ns(r) {
  return r.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
}
function ss(r, e) {
  const t = h.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((n) => {
    Object.defineProperty(r, n + t, {
      value: function(s, i, o) {
        return this[n].call(this, e, s, i, o);
      },
      configurable: !0
    });
  });
}
class S {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, n) {
    const s = this;
    function i(a, l, u) {
      const c = V(l);
      if (!c)
        throw new Error("header name must be a non-empty string");
      const p = h.findKey(s, c);
      (!p || s[p] === void 0 || u === !0 || u === void 0 && s[p] !== !1) && (s[p || l] = ie(a));
    }
    const o = (a, l) => h.forEach(a, (u, c) => i(u, c, l));
    if (h.isPlainObject(e) || e instanceof this.constructor)
      o(e, t);
    else if (h.isString(e) && (e = e.trim()) && !ts(e))
      o(Yn(e), t);
    else if (h.isHeaders(e))
      for (const [a, l] of e.entries())
        i(l, a, n);
    else
      e != null && i(t, e, n);
    return this;
  }
  get(e, t) {
    if (e = V(e), e) {
      const n = h.findKey(this, e);
      if (n) {
        const s = this[n];
        if (!t)
          return s;
        if (t === !0)
          return es(s);
        if (h.isFunction(t))
          return t.call(this, s, n);
        if (h.isRegExp(t))
          return t.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = V(e), e) {
      const n = h.findKey(this, e);
      return !!(n && this[n] !== void 0 && (!t || ye(this, this[n], n, t)));
    }
    return !1;
  }
  delete(e, t) {
    const n = this;
    let s = !1;
    function i(o) {
      if (o = V(o), o) {
        const a = h.findKey(n, o);
        a && (!t || ye(n, n[a], a, t)) && (delete n[a], s = !0);
      }
    }
    return h.isArray(e) ? e.forEach(i) : i(e), s;
  }
  clear(e) {
    const t = Object.keys(this);
    let n = t.length, s = !1;
    for (; n--; ) {
      const i = t[n];
      (!e || ye(this, this[i], i, e, !0)) && (delete this[i], s = !0);
    }
    return s;
  }
  normalize(e) {
    const t = this, n = {};
    return h.forEach(this, (s, i) => {
      const o = h.findKey(n, i);
      if (o) {
        t[o] = ie(s), delete t[i];
        return;
      }
      const a = e ? ns(i) : String(i).trim();
      a !== i && delete t[i], t[a] = ie(s), n[a] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const t = /* @__PURE__ */ Object.create(null);
    return h.forEach(this, (n, s) => {
      n != null && n !== !1 && (t[s] = e && h.isArray(n) ? n.join(", ") : n);
    }), t;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static concat(e, ...t) {
    const n = new this(e);
    return t.forEach((s) => n.set(s)), n;
  }
  static accessor(e) {
    const n = (this[Ge] = this[Ge] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function i(o) {
      const a = V(o);
      n[a] || (ss(s, o), n[a] = !0);
    }
    return h.isArray(e) ? e.forEach(i) : i(e), this;
  }
}
S.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
h.reduceDescriptors(S.prototype, ({ value: r }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => r,
    set(n) {
      this[t] = n;
    }
  };
});
h.freezeMethods(S);
function xe(r, e) {
  const t = this || ee, n = e || t, s = S.from(n.headers);
  let i = n.data;
  return h.forEach(r, function(a) {
    i = a.call(t, i, s.normalize(), e ? e.status : void 0);
  }), s.normalize(), i;
}
function St(r) {
  return !!(r && r.__CANCEL__);
}
function M(r, e, t) {
  b.call(this, r ?? "canceled", b.ERR_CANCELED, e, t), this.name = "CanceledError";
}
h.inherits(M, b, {
  __CANCEL__: !0
});
function At(r, e, t) {
  const n = t.config.validateStatus;
  !t.status || !n || n(t.status) ? r(t) : e(new b(
    "Request failed with status code " + t.status,
    [b.ERR_BAD_REQUEST, b.ERR_BAD_RESPONSE][Math.floor(t.status / 100) - 4],
    t.config,
    t.request,
    t
  ));
}
function rs(r) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(r);
  return e && e[1] || "";
}
function is(r, e) {
  r = r || 10;
  const t = new Array(r), n = new Array(r);
  let s = 0, i = 0, o;
  return e = e !== void 0 ? e : 1e3, function(l) {
    const u = Date.now(), c = n[i];
    o || (o = u), t[s] = l, n[s] = u;
    let p = i, m = 0;
    for (; p !== s; )
      m += t[p++], p = p % r;
    if (s = (s + 1) % r, s === i && (i = (i + 1) % r), u - o < e)
      return;
    const d = c && u - c;
    return d ? Math.round(m * 1e3 / d) : void 0;
  };
}
function os(r, e) {
  let t = 0;
  const n = 1e3 / e;
  let s = null;
  return function() {
    const o = this === !0, a = Date.now();
    if (o || a - t > n)
      return s && (clearTimeout(s), s = null), t = a, r.apply(null, arguments);
    s || (s = setTimeout(() => (s = null, t = Date.now(), r.apply(null, arguments)), n - (a - t)));
  };
}
const oe = (r, e, t = 3) => {
  let n = 0;
  const s = is(50, 250);
  return os((i) => {
    const o = i.loaded, a = i.lengthComputable ? i.total : void 0, l = o - n, u = s(l), c = o <= a;
    n = o;
    const p = {
      loaded: o,
      total: a,
      progress: a ? o / a : void 0,
      bytes: l,
      rate: u || void 0,
      estimated: u && a && c ? (a - o) / u : void 0,
      event: i,
      lengthComputable: a != null
    };
    p[e ? "download" : "upload"] = !0, r(p);
  }, t);
}, as = $.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const e = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
    let n;
    function s(i) {
      let o = i;
      return e && (t.setAttribute("href", o), o = t.href), t.setAttribute("href", o), {
        href: t.href,
        protocol: t.protocol ? t.protocol.replace(/:$/, "") : "",
        host: t.host,
        search: t.search ? t.search.replace(/^\?/, "") : "",
        hash: t.hash ? t.hash.replace(/^#/, "") : "",
        hostname: t.hostname,
        port: t.port,
        pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname
      };
    }
    return n = s(window.location.href), function(o) {
      const a = h.isString(o) ? s(o) : o;
      return a.protocol === n.protocol && a.host === n.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return function() {
      return !0;
    };
  }()
), ls = $.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(r, e, t, n, s, i) {
      const o = [r + "=" + encodeURIComponent(e)];
      h.isNumber(t) && o.push("expires=" + new Date(t).toGMTString()), h.isString(n) && o.push("path=" + n), h.isString(s) && o.push("domain=" + s), i === !0 && o.push("secure"), document.cookie = o.join("; ");
    },
    read(r) {
      const e = document.cookie.match(new RegExp("(^|;\\s*)(" + r + ")=([^;]*)"));
      return e ? decodeURIComponent(e[3]) : null;
    },
    remove(r) {
      this.write(r, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function cs(r) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(r);
}
function us(r, e) {
  return e ? r.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : r;
}
function Ot(r, e) {
  return r && !cs(e) ? us(r, e) : e;
}
const Xe = (r) => r instanceof S ? { ...r } : r;
function I(r, e) {
  e = e || {};
  const t = {};
  function n(u, c, p) {
    return h.isPlainObject(u) && h.isPlainObject(c) ? h.merge.call({ caseless: p }, u, c) : h.isPlainObject(c) ? h.merge({}, c) : h.isArray(c) ? c.slice() : c;
  }
  function s(u, c, p) {
    if (h.isUndefined(c)) {
      if (!h.isUndefined(u))
        return n(void 0, u, p);
    } else return n(u, c, p);
  }
  function i(u, c) {
    if (!h.isUndefined(c))
      return n(void 0, c);
  }
  function o(u, c) {
    if (h.isUndefined(c)) {
      if (!h.isUndefined(u))
        return n(void 0, u);
    } else return n(void 0, c);
  }
  function a(u, c, p) {
    if (p in e)
      return n(u, c);
    if (p in r)
      return n(void 0, u);
  }
  const l = {
    url: i,
    method: i,
    data: i,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: a,
    headers: (u, c) => s(Xe(u), Xe(c), !0)
  };
  return h.forEach(Object.keys(Object.assign({}, r, e)), function(c) {
    const p = l[c] || s, m = p(r[c], e[c], c);
    h.isUndefined(m) && p !== a || (t[c] = m);
  }), t;
}
const _t = (r) => {
  const e = I({}, r);
  let { data: t, withXSRFToken: n, xsrfHeaderName: s, xsrfCookieName: i, headers: o, auth: a } = e;
  e.headers = o = S.from(o), e.url = Rt(Ot(e.baseURL, e.url), r.params, r.paramsSerializer), a && o.set(
    "Authorization",
    "Basic " + btoa((a.username || "") + ":" + (a.password ? unescape(encodeURIComponent(a.password)) : ""))
  );
  let l;
  if (h.isFormData(t)) {
    if ($.hasStandardBrowserEnv || $.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if ((l = o.getContentType()) !== !1) {
      const [u, ...c] = l ? l.split(";").map((p) => p.trim()).filter(Boolean) : [];
      o.setContentType([u || "multipart/form-data", ...c].join("; "));
    }
  }
  if ($.hasStandardBrowserEnv && (n && h.isFunction(n) && (n = n(e)), n || n !== !1 && as(e.url))) {
    const u = s && i && ls.read(i);
    u && o.set(s, u);
  }
  return e;
}, hs = typeof XMLHttpRequest < "u", ps = hs && function(r) {
  return new Promise(function(t, n) {
    const s = _t(r);
    let i = s.data;
    const o = S.from(s.headers).normalize();
    let { responseType: a } = s, l;
    function u() {
      s.cancelToken && s.cancelToken.unsubscribe(l), s.signal && s.signal.removeEventListener("abort", l);
    }
    let c = new XMLHttpRequest();
    c.open(s.method.toUpperCase(), s.url, !0), c.timeout = s.timeout;
    function p() {
      if (!c)
        return;
      const d = S.from(
        "getAllResponseHeaders" in c && c.getAllResponseHeaders()
      ), g = {
        data: !a || a === "text" || a === "json" ? c.responseText : c.response,
        status: c.status,
        statusText: c.statusText,
        headers: d,
        config: r,
        request: c
      };
      At(function(E) {
        t(E), u();
      }, function(E) {
        n(E), u();
      }, g), c = null;
    }
    "onloadend" in c ? c.onloadend = p : c.onreadystatechange = function() {
      !c || c.readyState !== 4 || c.status === 0 && !(c.responseURL && c.responseURL.indexOf("file:") === 0) || setTimeout(p);
    }, c.onabort = function() {
      c && (n(new b("Request aborted", b.ECONNABORTED, s, c)), c = null);
    }, c.onerror = function() {
      n(new b("Network Error", b.ERR_NETWORK, s, c)), c = null;
    }, c.ontimeout = function() {
      let f = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
      const g = s.transitional || Tt;
      s.timeoutErrorMessage && (f = s.timeoutErrorMessage), n(new b(
        f,
        g.clarifyTimeoutError ? b.ETIMEDOUT : b.ECONNABORTED,
        s,
        c
      )), c = null;
    }, i === void 0 && o.setContentType(null), "setRequestHeader" in c && h.forEach(o.toJSON(), function(f, g) {
      c.setRequestHeader(g, f);
    }), h.isUndefined(s.withCredentials) || (c.withCredentials = !!s.withCredentials), a && a !== "json" && (c.responseType = s.responseType), typeof s.onDownloadProgress == "function" && c.addEventListener("progress", oe(s.onDownloadProgress, !0)), typeof s.onUploadProgress == "function" && c.upload && c.upload.addEventListener("progress", oe(s.onUploadProgress)), (s.cancelToken || s.signal) && (l = (d) => {
      c && (n(!d || d.type ? new M(null, r, c) : d), c.abort(), c = null);
    }, s.cancelToken && s.cancelToken.subscribe(l), s.signal && (s.signal.aborted ? l() : s.signal.addEventListener("abort", l)));
    const m = rs(s.url);
    if (m && $.protocols.indexOf(m) === -1) {
      n(new b("Unsupported protocol " + m + ":", b.ERR_BAD_REQUEST, r));
      return;
    }
    c.send(i || null);
  });
}, fs = (r, e) => {
  let t = new AbortController(), n;
  const s = function(l) {
    if (!n) {
      n = !0, o();
      const u = l instanceof Error ? l : this.reason;
      t.abort(u instanceof b ? u : new M(u instanceof Error ? u.message : u));
    }
  };
  let i = e && setTimeout(() => {
    s(new b(`timeout ${e} of ms exceeded`, b.ETIMEDOUT));
  }, e);
  const o = () => {
    r && (i && clearTimeout(i), i = null, r.forEach((l) => {
      l && (l.removeEventListener ? l.removeEventListener("abort", s) : l.unsubscribe(s));
    }), r = null);
  };
  r.forEach((l) => l && l.addEventListener && l.addEventListener("abort", s));
  const { signal: a } = t;
  return a.unsubscribe = o, [a, () => {
    i && clearTimeout(i), i = null;
  }];
}, ds = function* (r, e) {
  let t = r.byteLength;
  if (!e || t < e) {
    yield r;
    return;
  }
  let n = 0, s;
  for (; n < t; )
    s = n + e, yield r.slice(n, s), n = s;
}, ms = async function* (r, e, t) {
  for await (const n of r)
    yield* ds(ArrayBuffer.isView(n) ? n : await t(String(n)), e);
}, Ye = (r, e, t, n, s) => {
  const i = ms(r, e, s);
  let o = 0;
  return new ReadableStream({
    type: "bytes",
    async pull(a) {
      const { done: l, value: u } = await i.next();
      if (l) {
        a.close(), n();
        return;
      }
      let c = u.byteLength;
      t && t(o += c), a.enqueue(new Uint8Array(u));
    },
    cancel(a) {
      return n(a), i.return();
    }
  }, {
    highWaterMark: 2
  });
}, et = (r, e) => {
  const t = r != null;
  return (n) => setTimeout(() => e({
    lengthComputable: t,
    total: r,
    loaded: n
  }));
}, me = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", $t = me && typeof ReadableStream == "function", Ee = me && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((r) => (e) => r.encode(e))(new TextEncoder()) : async (r) => new Uint8Array(await new Response(r).arrayBuffer())), gs = $t && (() => {
  let r = !1;
  const e = new Request($.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return r = !0, "half";
    }
  }).headers.has("Content-Type");
  return r && !e;
})(), tt = 64 * 1024, Se = $t && !!(() => {
  try {
    return h.isReadableStream(new Response("").body);
  } catch {
  }
})(), ae = {
  stream: Se && ((r) => r.body)
};
me && ((r) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !ae[e] && (ae[e] = h.isFunction(r[e]) ? (t) => t[e]() : (t, n) => {
      throw new b(`Response type '${e}' is not supported`, b.ERR_NOT_SUPPORT, n);
    });
  });
})(new Response());
const ws = async (r) => {
  if (r == null)
    return 0;
  if (h.isBlob(r))
    return r.size;
  if (h.isSpecCompliantForm(r))
    return (await new Request(r).arrayBuffer()).byteLength;
  if (h.isArrayBufferView(r))
    return r.byteLength;
  if (h.isURLSearchParams(r) && (r = r + ""), h.isString(r))
    return (await Ee(r)).byteLength;
}, bs = async (r, e) => {
  const t = h.toFiniteNumber(r.getContentLength());
  return t ?? ws(e);
}, ys = me && (async (r) => {
  let {
    url: e,
    method: t,
    data: n,
    signal: s,
    cancelToken: i,
    timeout: o,
    onDownloadProgress: a,
    onUploadProgress: l,
    responseType: u,
    headers: c,
    withCredentials: p = "same-origin",
    fetchOptions: m
  } = _t(r);
  u = u ? (u + "").toLowerCase() : "text";
  let [d, f] = s || i || o ? fs([s, i], o) : [], g, k;
  const E = () => {
    !g && setTimeout(() => {
      d && d.unsubscribe();
    }), g = !0;
  };
  let O;
  try {
    if (l && gs && t !== "get" && t !== "head" && (O = await bs(c, n)) !== 0) {
      let B = new Request(e, {
        method: "POST",
        body: n,
        duplex: "half"
      }), U;
      h.isFormData(n) && (U = B.headers.get("content-type")) && c.setContentType(U), B.body && (n = Ye(B.body, tt, et(
        O,
        oe(l)
      ), null, Ee));
    }
    h.isString(p) || (p = p ? "cors" : "omit"), k = new Request(e, {
      ...m,
      signal: d,
      method: t.toUpperCase(),
      headers: c.normalize().toJSON(),
      body: n,
      duplex: "half",
      withCredentials: p
    });
    let R = await fetch(k);
    const N = Se && (u === "stream" || u === "response");
    if (Se && (a || N)) {
      const B = {};
      ["status", "statusText", "headers"].forEach((Me) => {
        B[Me] = R[Me];
      });
      const U = h.toFiniteNumber(R.headers.get("content-length"));
      R = new Response(
        Ye(R.body, tt, a && et(
          U,
          oe(a, !0)
        ), N && E, Ee),
        B
      );
    }
    u = u || "text";
    let H = await ae[h.findKey(ae, u) || "text"](R, r);
    return !N && E(), f && f(), await new Promise((B, U) => {
      At(B, U, {
        data: H,
        headers: S.from(R.headers),
        status: R.status,
        statusText: R.statusText,
        config: r,
        request: k
      });
    });
  } catch (R) {
    throw E(), R && R.name === "TypeError" && /fetch/i.test(R.message) ? Object.assign(
      new b("Network Error", b.ERR_NETWORK, r, k),
      {
        cause: R.cause || R
      }
    ) : b.from(R, R && R.code, r, k);
  }
}), Ae = {
  http: zn,
  xhr: ps,
  fetch: ys
};
h.forEach(Ae, (r, e) => {
  if (r) {
    try {
      Object.defineProperty(r, "name", { value: e });
    } catch {
    }
    Object.defineProperty(r, "adapterName", { value: e });
  }
});
const nt = (r) => `- ${r}`, xs = (r) => h.isFunction(r) || r === null || r === !1, Ct = {
  getAdapter: (r) => {
    r = h.isArray(r) ? r : [r];
    const { length: e } = r;
    let t, n;
    const s = {};
    for (let i = 0; i < e; i++) {
      t = r[i];
      let o;
      if (n = t, !xs(t) && (n = Ae[(o = String(t)).toLowerCase()], n === void 0))
        throw new b(`Unknown adapter '${o}'`);
      if (n)
        break;
      s[o || "#" + i] = n;
    }
    if (!n) {
      const i = Object.entries(s).map(
        ([a, l]) => `adapter ${a} ` + (l === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let o = e ? i.length > 1 ? `since :
` + i.map(nt).join(`
`) : " " + nt(i[0]) : "as no adapter specified";
      throw new b(
        "There is no suitable adapter to dispatch the request " + o,
        "ERR_NOT_SUPPORT"
      );
    }
    return n;
  },
  adapters: Ae
};
function ke(r) {
  if (r.cancelToken && r.cancelToken.throwIfRequested(), r.signal && r.signal.aborted)
    throw new M(null, r);
}
function st(r) {
  return ke(r), r.headers = S.from(r.headers), r.data = xe.call(
    r,
    r.transformRequest
  ), ["post", "put", "patch"].indexOf(r.method) !== -1 && r.headers.setContentType("application/x-www-form-urlencoded", !1), Ct.getAdapter(r.adapter || ee.adapter)(r).then(function(n) {
    return ke(r), n.data = xe.call(
      r,
      r.transformResponse,
      n
    ), n.headers = S.from(n.headers), n;
  }, function(n) {
    return St(n) || (ke(r), n && n.response && (n.response.data = xe.call(
      r,
      r.transformResponse,
      n.response
    ), n.response.headers = S.from(n.response.headers))), Promise.reject(n);
  });
}
const Lt = "1.7.2", Ne = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((r, e) => {
  Ne[r] = function(n) {
    return typeof n === r || "a" + (e < 1 ? "n " : " ") + r;
  };
});
const rt = {};
Ne.transitional = function(e, t, n) {
  function s(i, o) {
    return "[Axios v" + Lt + "] Transitional option '" + i + "'" + o + (n ? ". " + n : "");
  }
  return (i, o, a) => {
    if (e === !1)
      throw new b(
        s(o, " has been removed" + (t ? " in " + t : "")),
        b.ERR_DEPRECATED
      );
    return t && !rt[o] && (rt[o] = !0, console.warn(
      s(
        o,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(i, o, a) : !0;
  };
};
function ks(r, e, t) {
  if (typeof r != "object")
    throw new b("options must be an object", b.ERR_BAD_OPTION_VALUE);
  const n = Object.keys(r);
  let s = n.length;
  for (; s-- > 0; ) {
    const i = n[s], o = e[i];
    if (o) {
      const a = r[i], l = a === void 0 || o(a, i, r);
      if (l !== !0)
        throw new b("option " + i + " must be " + l, b.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (t !== !0)
      throw new b("Unknown option " + i, b.ERR_BAD_OPTION);
  }
}
const Oe = {
  assertOptions: ks,
  validators: Ne
}, z = Oe.validators;
class D {
  constructor(e) {
    this.defaults = e, this.interceptors = {
      request: new Qe(),
      response: new Qe()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(e, t) {
    try {
      return await this._request(e, t);
    } catch (n) {
      if (n instanceof Error) {
        let s;
        Error.captureStackTrace ? Error.captureStackTrace(s = {}) : s = new Error();
        const i = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        try {
          n.stack ? i && !String(n.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (n.stack += `
` + i) : n.stack = i;
        } catch {
        }
      }
      throw n;
    }
  }
  _request(e, t) {
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = I(this.defaults, t);
    const { transitional: n, paramsSerializer: s, headers: i } = t;
    n !== void 0 && Oe.assertOptions(n, {
      silentJSONParsing: z.transitional(z.boolean),
      forcedJSONParsing: z.transitional(z.boolean),
      clarifyTimeoutError: z.transitional(z.boolean)
    }, !1), s != null && (h.isFunction(s) ? t.paramsSerializer = {
      serialize: s
    } : Oe.assertOptions(s, {
      encode: z.function,
      serialize: z.function
    }, !0)), t.method = (t.method || this.defaults.method || "get").toLowerCase();
    let o = i && h.merge(
      i.common,
      i[t.method]
    );
    i && h.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (f) => {
        delete i[f];
      }
    ), t.headers = S.concat(o, i);
    const a = [];
    let l = !0;
    this.interceptors.request.forEach(function(g) {
      typeof g.runWhen == "function" && g.runWhen(t) === !1 || (l = l && g.synchronous, a.unshift(g.fulfilled, g.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function(g) {
      u.push(g.fulfilled, g.rejected);
    });
    let c, p = 0, m;
    if (!l) {
      const f = [st.bind(this), void 0];
      for (f.unshift.apply(f, a), f.push.apply(f, u), m = f.length, c = Promise.resolve(t); p < m; )
        c = c.then(f[p++], f[p++]);
      return c;
    }
    m = a.length;
    let d = t;
    for (p = 0; p < m; ) {
      const f = a[p++], g = a[p++];
      try {
        d = f(d);
      } catch (k) {
        g.call(this, k);
        break;
      }
    }
    try {
      c = st.call(this, d);
    } catch (f) {
      return Promise.reject(f);
    }
    for (p = 0, m = u.length; p < m; )
      c = c.then(u[p++], u[p++]);
    return c;
  }
  getUri(e) {
    e = I(this.defaults, e);
    const t = Ot(e.baseURL, e.url);
    return Rt(t, e.params, e.paramsSerializer);
  }
}
h.forEach(["delete", "get", "head", "options"], function(e) {
  D.prototype[e] = function(t, n) {
    return this.request(I(n || {}, {
      method: e,
      url: t,
      data: (n || {}).data
    }));
  };
});
h.forEach(["post", "put", "patch"], function(e) {
  function t(n) {
    return function(i, o, a) {
      return this.request(I(a || {}, {
        method: e,
        headers: n ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: o
      }));
    };
  }
  D.prototype[e] = t(), D.prototype[e + "Form"] = t(!0);
});
class Be {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(i) {
      t = i;
    });
    const n = this;
    this.promise.then((s) => {
      if (!n._listeners) return;
      let i = n._listeners.length;
      for (; i-- > 0; )
        n._listeners[i](s);
      n._listeners = null;
    }), this.promise.then = (s) => {
      let i;
      const o = new Promise((a) => {
        n.subscribe(a), i = a;
      }).then(s);
      return o.cancel = function() {
        n.unsubscribe(i);
      }, o;
    }, e(function(i, o, a) {
      n.reason || (n.reason = new M(i, o, a), t(n.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(e) {
    if (this.reason) {
      e(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(e) : this._listeners = [e];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(e) {
    if (!this._listeners)
      return;
    const t = this._listeners.indexOf(e);
    t !== -1 && this._listeners.splice(t, 1);
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new Be(function(s) {
        e = s;
      }),
      cancel: e
    };
  }
}
function Rs(r) {
  return function(t) {
    return r.apply(null, t);
  };
}
function Ts(r) {
  return h.isObject(r) && r.isAxiosError === !0;
}
const _e = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(_e).forEach(([r, e]) => {
  _e[e] = r;
});
function Pt(r) {
  const e = new D(r), t = ut(D.prototype.request, e);
  return h.extend(t, D.prototype, e, { allOwnKeys: !0 }), h.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(s) {
    return Pt(I(r, s));
  }, t;
}
const T = Pt(ee);
T.Axios = D;
T.CanceledError = M;
T.CancelToken = Be;
T.isCancel = St;
T.VERSION = Lt;
T.toFormData = de;
T.AxiosError = b;
T.Cancel = T.CanceledError;
T.all = function(e) {
  return Promise.all(e);
};
T.spread = Rs;
T.isAxiosError = Ts;
T.mergeConfig = I;
T.AxiosHeaders = S;
T.formToJSON = (r) => Et(h.isHTMLForm(r) ? new FormData(r) : r);
T.getAdapter = Ct.getAdapter;
T.HttpStatusCode = _e;
T.default = T;
function ze() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
let j = ze();
function vt(r) {
  j = r;
}
const Nt = /[&<>"']/, Es = new RegExp(Nt.source, "g"), Bt = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, Ss = new RegExp(Bt.source, "g"), As = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, it = (r) => As[r];
function A(r, e) {
  if (e) {
    if (Nt.test(r))
      return r.replace(Es, it);
  } else if (Bt.test(r))
    return r.replace(Ss, it);
  return r;
}
const Os = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function _s(r) {
  return r.replace(Os, (e, t) => (t = t.toLowerCase(), t === "colon" ? ":" : t.charAt(0) === "#" ? t.charAt(1) === "x" ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""));
}
const $s = /(^|[^\[])\^/g;
function x(r, e) {
  let t = typeof r == "string" ? r : r.source;
  e = e || "";
  const n = {
    replace: (s, i) => {
      let o = typeof i == "string" ? i : i.source;
      return o = o.replace($s, "$1"), t = t.replace(s, o), n;
    },
    getRegex: () => new RegExp(t, e)
  };
  return n;
}
function ot(r) {
  try {
    r = encodeURI(r).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return r;
}
const K = { exec: () => null };
function at(r, e) {
  const t = r.replace(/\|/g, (i, o, a) => {
    let l = !1, u = o;
    for (; --u >= 0 && a[u] === "\\"; )
      l = !l;
    return l ? "|" : " |";
  }), n = t.split(/ \|/);
  let s = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n[n.length - 1].trim() && n.pop(), e)
    if (n.length > e)
      n.splice(e);
    else
      for (; n.length < e; )
        n.push("");
  for (; s < n.length; s++)
    n[s] = n[s].trim().replace(/\\\|/g, "|");
  return n;
}
function J(r, e, t) {
  const n = r.length;
  if (n === 0)
    return "";
  let s = 0;
  for (; s < n; ) {
    const i = r.charAt(n - s - 1);
    if (i === e && !t)
      s++;
    else if (i !== e && t)
      s++;
    else
      break;
  }
  return r.slice(0, n - s);
}
function Cs(r, e) {
  if (r.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let n = 0; n < r.length; n++)
    if (r[n] === "\\")
      n++;
    else if (r[n] === e[0])
      t++;
    else if (r[n] === e[1] && (t--, t < 0))
      return n;
  return -1;
}
function lt(r, e, t, n) {
  const s = e.href, i = e.title ? A(e.title) : null, o = r[1].replace(/\\([\[\]])/g, "$1");
  if (r[0].charAt(0) !== "!") {
    n.state.inLink = !0;
    const a = {
      type: "link",
      raw: t,
      href: s,
      title: i,
      text: o,
      tokens: n.inlineTokens(o)
    };
    return n.state.inLink = !1, a;
  }
  return {
    type: "image",
    raw: t,
    href: s,
    title: i,
    text: A(o)
  };
}
function Ls(r, e) {
  const t = r.match(/^(\s+)(?:```)/);
  if (t === null)
    return e;
  const n = t[1];
  return e.split(`
`).map((s) => {
    const i = s.match(/^\s+/);
    if (i === null)
      return s;
    const [o] = i;
    return o.length >= n.length ? s.slice(n.length) : s;
  }).join(`
`);
}
class le {
  // set by the lexer
  constructor(e) {
    w(this, "options");
    w(this, "rules");
    // set by the lexer
    w(this, "lexer");
    this.options = e || j;
  }
  space(e) {
    const t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0)
      return {
        type: "space",
        raw: t[0]
      };
  }
  code(e) {
    const t = this.rules.block.code.exec(e);
    if (t) {
      const n = t[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: t[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? n : J(n, `
`)
      };
    }
  }
  fences(e) {
    const t = this.rules.block.fences.exec(e);
    if (t) {
      const n = t[0], s = Ls(n, t[3] || "");
      return {
        type: "code",
        raw: n,
        lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
        text: s
      };
    }
  }
  heading(e) {
    const t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (/#$/.test(n)) {
        const s = J(n, "#");
        (this.options.pedantic || !s || / $/.test(s)) && (n = s.trim());
      }
      return {
        type: "heading",
        raw: t[0],
        depth: t[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(e) {
    const t = this.rules.block.hr.exec(e);
    if (t)
      return {
        type: "hr",
        raw: J(t[0], `
`)
      };
  }
  blockquote(e) {
    const t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = J(t[0], `
`).split(`
`), s = "", i = "";
      const o = [];
      for (; n.length > 0; ) {
        let a = !1;
        const l = [];
        let u;
        for (u = 0; u < n.length; u++)
          if (/^ {0,3}>/.test(n[u]))
            l.push(n[u]), a = !0;
          else if (!a)
            l.push(n[u]);
          else
            break;
        n = n.slice(u);
        const c = l.join(`
`), p = c.replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, `
    $1`).replace(/^ {0,3}>[ \t]?/gm, "");
        s = s ? `${s}
${c}` : c, i = i ? `${i}
${p}` : p;
        const m = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(p, o, !0), this.lexer.state.top = m, n.length === 0)
          break;
        const d = o[o.length - 1];
        if ((d == null ? void 0 : d.type) === "code")
          break;
        if ((d == null ? void 0 : d.type) === "blockquote") {
          const f = d, g = f.raw + `
` + n.join(`
`), k = this.blockquote(g);
          o[o.length - 1] = k, s = s.substring(0, s.length - f.raw.length) + k.raw, i = i.substring(0, i.length - f.text.length) + k.text;
          break;
        } else if ((d == null ? void 0 : d.type) === "list") {
          const f = d, g = f.raw + `
` + n.join(`
`), k = this.list(g);
          o[o.length - 1] = k, s = s.substring(0, s.length - d.raw.length) + k.raw, i = i.substring(0, i.length - f.raw.length) + k.raw, n = g.substring(o[o.length - 1].raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: s,
        tokens: o,
        text: i
      };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim();
      const s = n.length > 1, i = {
        type: "list",
        raw: "",
        ordered: s,
        start: s ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      const o = new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let a = !1;
      for (; e; ) {
        let l = !1, u = "", c = "";
        if (!(t = o.exec(e)) || this.rules.block.hr.test(e))
          break;
        u = t[0], e = e.substring(u.length);
        let p = t[2].split(`
`, 1)[0].replace(/^\t+/, (E) => " ".repeat(3 * E.length)), m = e.split(`
`, 1)[0], d = !p.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, c = p.trimStart()) : d ? f = t[1].length + 1 : (f = t[2].search(/[^ ]/), f = f > 4 ? 1 : f, c = p.slice(f), f += t[1].length), d && /^ *$/.test(m) && (u += m + `
`, e = e.substring(m.length + 1), l = !0), !l) {
          const E = new RegExp(`^ {0,${Math.min(3, f - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), O = new RegExp(`^ {0,${Math.min(3, f - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), R = new RegExp(`^ {0,${Math.min(3, f - 1)}}(?:\`\`\`|~~~)`), N = new RegExp(`^ {0,${Math.min(3, f - 1)}}#`);
          for (; e; ) {
            const H = e.split(`
`, 1)[0];
            if (m = H, this.options.pedantic && (m = m.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), R.test(m) || N.test(m) || E.test(m) || O.test(e))
              break;
            if (m.search(/[^ ]/) >= f || !m.trim())
              c += `
` + m.slice(f);
            else {
              if (d || p.search(/[^ ]/) >= 4 || R.test(p) || N.test(p) || O.test(p))
                break;
              c += `
` + m;
            }
            !d && !m.trim() && (d = !0), u += H + `
`, e = e.substring(H.length + 1), p = m.slice(f);
          }
        }
        i.loose || (a ? i.loose = !0 : /\n *\n *$/.test(u) && (a = !0));
        let g = null, k;
        this.options.gfm && (g = /^\[[ xX]\] /.exec(c), g && (k = g[0] !== "[ ] ", c = c.replace(/^\[[ xX]\] +/, ""))), i.items.push({
          type: "list_item",
          raw: u,
          task: !!g,
          checked: k,
          loose: !1,
          text: c,
          tokens: []
        }), i.raw += u;
      }
      i.items[i.items.length - 1].raw = i.items[i.items.length - 1].raw.trimEnd(), i.items[i.items.length - 1].text = i.items[i.items.length - 1].text.trimEnd(), i.raw = i.raw.trimEnd();
      for (let l = 0; l < i.items.length; l++)
        if (this.lexer.state.top = !1, i.items[l].tokens = this.lexer.blockTokens(i.items[l].text, []), !i.loose) {
          const u = i.items[l].tokens.filter((p) => p.type === "space"), c = u.length > 0 && u.some((p) => /\n.*\n/.test(p.raw));
          i.loose = c;
        }
      if (i.loose)
        for (let l = 0; l < i.items.length; l++)
          i.items[l].loose = !0;
      return i;
    }
  }
  html(e) {
    const t = this.rules.block.html.exec(e);
    if (t)
      return {
        type: "html",
        block: !0,
        raw: t[0],
        pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
        text: t[0]
      };
  }
  def(e) {
    const t = this.rules.block.def.exec(e);
    if (t) {
      const n = t[1].toLowerCase().replace(/\s+/g, " "), s = t[2] ? t[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: n,
        raw: t[0],
        href: s,
        title: i
      };
    }
  }
  table(e) {
    const t = this.rules.block.table.exec(e);
    if (!t || !/[:|]/.test(t[2]))
      return;
    const n = at(t[1]), s = t[2].replace(/^\||\| *$/g, "").split("|"), i = t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split(`
`) : [], o = {
      type: "table",
      raw: t[0],
      header: [],
      align: [],
      rows: []
    };
    if (n.length === s.length) {
      for (const a of s)
        /^ *-+: *$/.test(a) ? o.align.push("right") : /^ *:-+: *$/.test(a) ? o.align.push("center") : /^ *:-+ *$/.test(a) ? o.align.push("left") : o.align.push(null);
      for (let a = 0; a < n.length; a++)
        o.header.push({
          text: n[a],
          tokens: this.lexer.inline(n[a]),
          header: !0,
          align: o.align[a]
        });
      for (const a of i)
        o.rows.push(at(a, o.header.length).map((l, u) => ({
          text: l,
          tokens: this.lexer.inline(l),
          header: !1,
          align: o.align[u]
        })));
      return o;
    }
  }
  lheading(e) {
    const t = this.rules.block.lheading.exec(e);
    if (t)
      return {
        type: "heading",
        raw: t[0],
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: t[1],
        tokens: this.lexer.inline(t[1])
      };
  }
  paragraph(e) {
    const t = this.rules.block.paragraph.exec(e);
    if (t) {
      const n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(e) {
    const t = this.rules.block.text.exec(e);
    if (t)
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        tokens: this.lexer.inline(t[0])
      };
  }
  escape(e) {
    const t = this.rules.inline.escape.exec(e);
    if (t)
      return {
        type: "escape",
        raw: t[0],
        text: A(t[1])
      };
  }
  tag(e) {
    const t = this.rules.inline.tag.exec(e);
    if (t)
      return !this.lexer.state.inLink && /^<a /i.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: t[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: t[0]
      };
  }
  link(e) {
    const t = this.rules.inline.link.exec(e);
    if (t) {
      const n = t[2].trim();
      if (!this.options.pedantic && /^</.test(n)) {
        if (!/>$/.test(n))
          return;
        const o = J(n.slice(0, -1), "\\");
        if ((n.length - o.length) % 2 === 0)
          return;
      } else {
        const o = Cs(t[2], "()");
        if (o > -1) {
          const l = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + o;
          t[2] = t[2].substring(0, o), t[0] = t[0].substring(0, l).trim(), t[3] = "";
        }
      }
      let s = t[2], i = "";
      if (this.options.pedantic) {
        const o = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(s);
        o && (s = o[1], i = o[3]);
      } else
        i = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), /^</.test(s) && (this.options.pedantic && !/>$/.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), lt(t, {
        href: s && s.replace(this.rules.inline.anyPunctuation, "$1"),
        title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      const s = (n[2] || n[1]).replace(/\s+/g, " "), i = t[s.toLowerCase()];
      if (!i) {
        const o = n[0].charAt(0);
        return {
          type: "text",
          raw: o,
          text: o
        };
      }
      return lt(n, i, n[0], this.lexer);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || s[3] && n.match(/[\p{L}\p{N}]/u))
      return;
    if (!(s[1] || s[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const o = [...s[0]].length - 1;
      let a, l, u = o, c = 0;
      const p = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + o); (s = p.exec(t)) != null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a)
          continue;
        if (l = [...a].length, s[3] || s[4]) {
          u += l;
          continue;
        } else if ((s[5] || s[6]) && o % 3 && !((o + l) % 3)) {
          c += l;
          continue;
        }
        if (u -= l, u > 0)
          continue;
        l = Math.min(l, l + u + c);
        const m = [...s[0]][0].length, d = e.slice(0, o + s.index + m + l);
        if (Math.min(o, l) % 2) {
          const g = d.slice(1, -1);
          return {
            type: "em",
            raw: d,
            text: g,
            tokens: this.lexer.inlineTokens(g)
          };
        }
        const f = d.slice(2, -2);
        return {
          type: "strong",
          raw: d,
          text: f,
          tokens: this.lexer.inlineTokens(f)
        };
      }
    }
  }
  codespan(e) {
    const t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(/\n/g, " ");
      const s = /[^ ]/.test(n), i = /^ /.test(n) && / $/.test(n);
      return s && i && (n = n.substring(1, n.length - 1)), n = A(n, !0), {
        type: "codespan",
        raw: t[0],
        text: n
      };
    }
  }
  br(e) {
    const t = this.rules.inline.br.exec(e);
    if (t)
      return {
        type: "br",
        raw: t[0]
      };
  }
  del(e) {
    const t = this.rules.inline.del.exec(e);
    if (t)
      return {
        type: "del",
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2])
      };
  }
  autolink(e) {
    const t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = A(t[1]), s = "mailto:" + n) : (n = A(t[1]), s = n), {
        type: "link",
        raw: t[0],
        text: n,
        href: s,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(e) {
    var n;
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let s, i;
      if (t[2] === "@")
        s = A(t[0]), i = "mailto:" + s;
      else {
        let o;
        do
          o = t[0], t[0] = ((n = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : n[0]) ?? "";
        while (o !== t[0]);
        s = A(t[0]), t[1] === "www." ? i = "http://" + t[0] : i = t[0];
      }
      return {
        type: "link",
        raw: t[0],
        text: s,
        href: i,
        tokens: [
          {
            type: "text",
            raw: s,
            text: s
          }
        ]
      };
    }
  }
  inlineText(e) {
    const t = this.rules.inline.text.exec(e);
    if (t) {
      let n;
      return this.lexer.state.inRawBlock ? n = t[0] : n = A(t[0]), {
        type: "text",
        raw: t[0],
        text: n
      };
    }
  }
}
const Ps = /^(?: *(?:\n|$))+/, vs = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, Ns = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, te = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Bs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, zt = /(?:[*+-]|\d{1,9}[.)])/, Dt = x(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, zt).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), De = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, zs = /^[^\n]+/, Ie = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Ds = x(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", Ie).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Is = x(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, zt).getRegex(), ge = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Fe = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Fs = x("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", Fe).replace("tag", ge).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), It = x(De).replace("hr", te).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ge).getRegex(), js = x(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", It).getRegex(), je = {
  blockquote: js,
  code: vs,
  def: Ds,
  fences: Ns,
  heading: Bs,
  hr: te,
  html: Fs,
  lheading: Dt,
  list: Is,
  newline: Ps,
  paragraph: It,
  table: K,
  text: zs
}, ct = x("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", te).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ge).getRegex(), Us = {
  ...je,
  table: ct,
  paragraph: x(De).replace("hr", te).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ct).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ge).getRegex()
}, qs = {
  ...je,
  html: x(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Fe).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: K,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: x(De).replace("hr", te).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Dt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Ft = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ms = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, jt = /^( {2,}|\\)\n(?!\s*$)/, Hs = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ne = "\\p{P}\\p{S}", Zs = x(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, ne).getRegex(), Vs = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g, Js = x(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, ne).getRegex(), Ws = x("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, ne).getRegex(), Ks = x("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, ne).getRegex(), Qs = x(/\\([punct])/, "gu").replace(/punct/g, ne).getRegex(), Gs = x(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Xs = x(Fe).replace("(?:-->|$)", "-->").getRegex(), Ys = x("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Xs).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ce = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, er = x(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", ce).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ut = x(/^!?\[(label)\]\[(ref)\]/).replace("label", ce).replace("ref", Ie).getRegex(), qt = x(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ie).getRegex(), tr = x("reflink|nolink(?!\\()", "g").replace("reflink", Ut).replace("nolink", qt).getRegex(), Ue = {
  _backpedal: K,
  // only used for GFM url
  anyPunctuation: Qs,
  autolink: Gs,
  blockSkip: Vs,
  br: jt,
  code: Ms,
  del: K,
  emStrongLDelim: Js,
  emStrongRDelimAst: Ws,
  emStrongRDelimUnd: Ks,
  escape: Ft,
  link: er,
  nolink: qt,
  punctuation: Zs,
  reflink: Ut,
  reflinkSearch: tr,
  tag: Ys,
  text: Hs,
  url: K
}, nr = {
  ...Ue,
  link: x(/^!?\[(label)\]\((.*?)\)/).replace("label", ce).getRegex(),
  reflink: x(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ce).getRegex()
}, $e = {
  ...Ue,
  escape: x(Ft).replace("])", "~|])").getRegex(),
  url: x(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, sr = {
  ...$e,
  br: x(jt).replace("{2,}", "*").getRegex(),
  text: x($e.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, se = {
  normal: je,
  gfm: Us,
  pedantic: qs
}, W = {
  normal: Ue,
  gfm: $e,
  breaks: sr,
  pedantic: nr
};
class L {
  constructor(e) {
    w(this, "tokens");
    w(this, "options");
    w(this, "state");
    w(this, "tokenizer");
    w(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || j, this.options.tokenizer = this.options.tokenizer || new le(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      block: se.normal,
      inline: W.normal
    };
    this.options.pedantic ? (t.block = se.pedantic, t.inline = W.pedantic) : this.options.gfm && (t.block = se.gfm, this.options.breaks ? t.inline = W.breaks : t.inline = W.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: se,
      inline: W
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new L(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new L(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(/\r\n|\r/g, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = !1) {
    this.options.pedantic ? e = e.replace(/\t/g, "    ").replace(/^ +$/gm, "") : e = e.replace(/^( *)(\t+)/gm, (a, l, u) => l + "    ".repeat(u.length));
    let s, i, o;
    for (; e; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((a) => (s = a.call({ lexer: this }, e, t)) ? (e = e.substring(s.raw.length), t.push(s), !0) : !1))) {
        if (s = this.tokenizer.space(e)) {
          e = e.substring(s.raw.length), s.raw.length === 1 && t.length > 0 ? t[t.length - 1].raw += `
` : t.push(s);
          continue;
        }
        if (s = this.tokenizer.code(e)) {
          e = e.substring(s.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + s.raw, i.text += `
` + s.text, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(s);
          continue;
        }
        if (s = this.tokenizer.fences(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.heading(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.hr(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.blockquote(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.list(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.html(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.def(e)) {
          e = e.substring(s.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + s.raw, i.text += `
` + s.raw, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = {
            href: s.href,
            title: s.title
          });
          continue;
        }
        if (s = this.tokenizer.table(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.lheading(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (o = e, this.options.extensions && this.options.extensions.startBlock) {
          let a = 1 / 0;
          const l = e.slice(1);
          let u;
          this.options.extensions.startBlock.forEach((c) => {
            u = c.call({ lexer: this }, l), typeof u == "number" && u >= 0 && (a = Math.min(a, u));
          }), a < 1 / 0 && a >= 0 && (o = e.substring(0, a + 1));
        }
        if (this.state.top && (s = this.tokenizer.paragraph(o))) {
          i = t[t.length - 1], n && (i == null ? void 0 : i.type) === "paragraph" ? (i.raw += `
` + s.raw, i.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(s), n = o.length !== e.length, e = e.substring(s.raw.length);
          continue;
        }
        if (s = this.tokenizer.text(e)) {
          e = e.substring(s.raw.length), i = t[t.length - 1], i && i.type === "text" ? (i.raw += `
` + s.raw, i.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(s);
          continue;
        }
        if (e) {
          const a = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(a);
            break;
          } else
            throw new Error(a);
        }
      }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    let n, s, i, o = e, a, l, u;
    if (this.tokens.links) {
      const c = Object.keys(this.tokens.links);
      if (c.length > 0)
        for (; (a = this.tokenizer.rules.inline.reflinkSearch.exec(o)) != null; )
          c.includes(a[0].slice(a[0].lastIndexOf("[") + 1, -1)) && (o = o.slice(0, a.index) + "[" + "a".repeat(a[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (a = this.tokenizer.rules.inline.blockSkip.exec(o)) != null; )
      o = o.slice(0, a.index) + "[" + "a".repeat(a[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (a = this.tokenizer.rules.inline.anyPunctuation.exec(o)) != null; )
      o = o.slice(0, a.index) + "++" + o.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; e; )
      if (l || (u = ""), l = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((c) => (n = c.call({ lexer: this }, e, t)) ? (e = e.substring(n.raw.length), t.push(n), !0) : !1))) {
        if (n = this.tokenizer.escape(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.tag(e)) {
          e = e.substring(n.raw.length), s = t[t.length - 1], s && n.type === "text" && s.type === "text" ? (s.raw += n.raw, s.text += n.text) : t.push(n);
          continue;
        }
        if (n = this.tokenizer.link(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(n.raw.length), s = t[t.length - 1], s && n.type === "text" && s.type === "text" ? (s.raw += n.raw, s.text += n.text) : t.push(n);
          continue;
        }
        if (n = this.tokenizer.emStrong(e, o, u)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.codespan(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.br(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.del(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.autolink(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (!this.state.inLink && (n = this.tokenizer.url(e))) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (i = e, this.options.extensions && this.options.extensions.startInline) {
          let c = 1 / 0;
          const p = e.slice(1);
          let m;
          this.options.extensions.startInline.forEach((d) => {
            m = d.call({ lexer: this }, p), typeof m == "number" && m >= 0 && (c = Math.min(c, m));
          }), c < 1 / 0 && c >= 0 && (i = e.substring(0, c + 1));
        }
        if (n = this.tokenizer.inlineText(i)) {
          e = e.substring(n.raw.length), n.raw.slice(-1) !== "_" && (u = n.raw.slice(-1)), l = !0, s = t[t.length - 1], s && s.type === "text" ? (s.raw += n.raw, s.text += n.text) : t.push(n);
          continue;
        }
        if (e) {
          const c = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(c);
            break;
          } else
            throw new Error(c);
        }
      }
    return t;
  }
}
class ue {
  // set by the parser
  constructor(e) {
    w(this, "options");
    w(this, "parser");
    this.options = e || j;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    var o;
    const s = (o = (t || "").match(/^\S*/)) == null ? void 0 : o[0], i = e.replace(/\n$/, "") + `
`;
    return s ? '<pre><code class="language-' + A(s) + '">' + (n ? i : A(i, !0)) + `</code></pre>
` : "<pre><code>" + (n ? i : A(i, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    const t = e.ordered, n = e.start;
    let s = "";
    for (let a = 0; a < e.items.length; a++) {
      const l = e.items[a];
      s += this.listitem(l);
    }
    const i = t ? "ol" : "ul", o = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + o + `>
` + s + "</" + i + `>
`;
  }
  listitem(e) {
    let t = "";
    if (e.task) {
      const n = this.checkbox({ checked: !!e.checked });
      e.loose ? e.tokens.length > 0 && e.tokens[0].type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + e.tokens[0].tokens[0].text)) : e.tokens.unshift({
        type: "text",
        raw: n + " ",
        text: n + " "
      }) : t += n + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0; i < e.header.length; i++)
      n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let i = 0; i < e.rows.length; i++) {
      const o = e.rows[i];
      n = "";
      for (let a = 0; a < o.length; a++)
        n += this.tablecell(o[a]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    const t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${e}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    const s = this.parser.parseInline(n), i = ot(e);
    if (i === null)
      return s;
    e = i;
    let o = '<a href="' + e + '"';
    return t && (o += ' title="' + t + '"'), o += ">" + s + "</a>", o;
  }
  image({ href: e, title: t, text: n }) {
    const s = ot(e);
    if (s === null)
      return n;
    e = s;
    let i = `<img src="${e}" alt="${n}"`;
    return t && (i += ` title="${t}"`), i += ">", i;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : e.text;
  }
}
class qe {
  // no need for block level renderers
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
}
class P {
  constructor(e) {
    w(this, "options");
    w(this, "renderer");
    w(this, "textRenderer");
    this.options = e || j, this.options.renderer = this.options.renderer || new ue(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new qe();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new P(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new P(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[i.type]) {
        const a = i, l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(a.type)) {
          n += l || "";
          continue;
        }
      }
      const o = i;
      switch (o.type) {
        case "space": {
          n += this.renderer.space(o);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(o);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(o);
          continue;
        }
        case "code": {
          n += this.renderer.code(o);
          continue;
        }
        case "table": {
          n += this.renderer.table(o);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(o);
          continue;
        }
        case "list": {
          n += this.renderer.list(o);
          continue;
        }
        case "html": {
          n += this.renderer.html(o);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(o);
          continue;
        }
        case "text": {
          let a = o, l = this.renderer.text(a);
          for (; s + 1 < e.length && e[s + 1].type === "text"; )
            a = e[++s], l += `
` + this.renderer.text(a);
          t ? n += this.renderer.paragraph({
            type: "paragraph",
            raw: l,
            text: l,
            tokens: [{ type: "text", raw: l, text: l }]
          }) : n += l;
          continue;
        }
        default: {
          const a = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return n;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t) {
    t = t || this.renderer;
    let n = "";
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[i.type]) {
        const a = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += a || "";
          continue;
        }
      }
      const o = i;
      switch (o.type) {
        case "escape": {
          n += t.text(o);
          break;
        }
        case "html": {
          n += t.html(o);
          break;
        }
        case "link": {
          n += t.link(o);
          break;
        }
        case "image": {
          n += t.image(o);
          break;
        }
        case "strong": {
          n += t.strong(o);
          break;
        }
        case "em": {
          n += t.em(o);
          break;
        }
        case "codespan": {
          n += t.codespan(o);
          break;
        }
        case "br": {
          n += t.br(o);
          break;
        }
        case "del": {
          n += t.del(o);
          break;
        }
        case "text": {
          n += t.text(o);
          break;
        }
        default: {
          const a = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return n;
  }
}
class Q {
  constructor(e) {
    w(this, "options");
    this.options = e || j;
  }
  /**
   * Process markdown before marked
   */
  preprocess(e) {
    return e;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(e) {
    return e;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(e) {
    return e;
  }
}
w(Q, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
]));
var v, Mt, Ce, Ht;
class rr {
  constructor(...e) {
    Ze(this, v);
    w(this, "defaults", ze());
    w(this, "options", this.setOptions);
    w(this, "parse", Z(this, v, Ce).call(this, L.lex, P.parse));
    w(this, "parseInline", Z(this, v, Ce).call(this, L.lexInline, P.parseInline));
    w(this, "Parser", P);
    w(this, "Renderer", ue);
    w(this, "TextRenderer", qe);
    w(this, "Lexer", L);
    w(this, "Tokenizer", le);
    w(this, "Hooks", Q);
    this.use(...e);
  }
  /**
   * Run callback for every token
   */
  walkTokens(e, t) {
    var s, i;
    let n = [];
    for (const o of e)
      switch (n = n.concat(t.call(this, o)), o.type) {
        case "table": {
          const a = o;
          for (const l of a.header)
            n = n.concat(this.walkTokens(l.tokens, t));
          for (const l of a.rows)
            for (const u of l)
              n = n.concat(this.walkTokens(u.tokens, t));
          break;
        }
        case "list": {
          const a = o;
          n = n.concat(this.walkTokens(a.items, t));
          break;
        }
        default: {
          const a = o;
          (i = (s = this.defaults.extensions) == null ? void 0 : s.childTokens) != null && i[a.type] ? this.defaults.extensions.childTokens[a.type].forEach((l) => {
            const u = a[l].flat(1 / 0);
            n = n.concat(this.walkTokens(u, t));
          }) : a.tokens && (n = n.concat(this.walkTokens(a.tokens, t)));
        }
      }
    return n;
  }
  use(...e) {
    const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      const s = { ...n };
      if (s.async = this.defaults.async || s.async || !1, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name)
          throw new Error("extension name required");
        if ("renderer" in i) {
          const o = t.renderers[i.name];
          o ? t.renderers[i.name] = function(...a) {
            let l = i.renderer.apply(this, a);
            return l === !1 && (l = o.apply(this, a)), l;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const o = t[i.level];
          o ? o.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), s.extensions = t), n.renderer) {
        const i = this.defaults.renderer || new ue(this.defaults);
        for (const o in n.renderer) {
          if (!(o in i))
            throw new Error(`renderer '${o}' does not exist`);
          if (["options", "parser"].includes(o))
            continue;
          const a = o;
          let l = n.renderer[a];
          const u = i[a];
          i[a] = (...c) => {
            n.useNewRenderer || (l = Z(this, v, Mt).call(this, l, a, i));
            let p = l.apply(i, c);
            return p === !1 && (p = u.apply(i, c)), p || "";
          };
        }
        s.renderer = i;
      }
      if (n.tokenizer) {
        const i = this.defaults.tokenizer || new le(this.defaults);
        for (const o in n.tokenizer) {
          if (!(o in i))
            throw new Error(`tokenizer '${o}' does not exist`);
          if (["options", "rules", "lexer"].includes(o))
            continue;
          const a = o, l = n.tokenizer[a], u = i[a];
          i[a] = (...c) => {
            let p = l.apply(i, c);
            return p === !1 && (p = u.apply(i, c)), p;
          };
        }
        s.tokenizer = i;
      }
      if (n.hooks) {
        const i = this.defaults.hooks || new Q();
        for (const o in n.hooks) {
          if (!(o in i))
            throw new Error(`hook '${o}' does not exist`);
          if (o === "options")
            continue;
          const a = o, l = n.hooks[a], u = i[a];
          Q.passThroughHooks.has(o) ? i[a] = (c) => {
            if (this.defaults.async)
              return Promise.resolve(l.call(i, c)).then((m) => u.call(i, m));
            const p = l.call(i, c);
            return u.call(i, p);
          } : i[a] = (...c) => {
            let p = l.apply(i, c);
            return p === !1 && (p = u.apply(i, c)), p;
          };
        }
        s.hooks = i;
      }
      if (n.walkTokens) {
        const i = this.defaults.walkTokens, o = n.walkTokens;
        s.walkTokens = function(a) {
          let l = [];
          return l.push(o.call(this, a)), i && (l = l.concat(i.call(this, a))), l;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return L.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return P.parse(e, t ?? this.defaults);
  }
}
v = new WeakSet(), // TODO: Remove this in next major release
Mt = function(e, t, n) {
  switch (t) {
    case "heading":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, n.parser.parseInline(s.tokens), s.depth, _s(n.parser.parseInline(s.tokens, n.parser.textRenderer)));
      };
    case "code":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, s.text, s.lang, !!s.escaped);
      };
    case "table":
      return function(s) {
        if (!s.type || s.type !== t)
          return e.apply(this, arguments);
        let i = "", o = "";
        for (let l = 0; l < s.header.length; l++)
          o += this.tablecell({
            text: s.header[l].text,
            tokens: s.header[l].tokens,
            header: !0,
            align: s.align[l]
          });
        i += this.tablerow({ text: o });
        let a = "";
        for (let l = 0; l < s.rows.length; l++) {
          const u = s.rows[l];
          o = "";
          for (let c = 0; c < u.length; c++)
            o += this.tablecell({
              text: u[c].text,
              tokens: u[c].tokens,
              header: !1,
              align: s.align[c]
            });
          a += this.tablerow({ text: o });
        }
        return e.call(this, i, a);
      };
    case "blockquote":
      return function(s) {
        if (!s.type || s.type !== t)
          return e.apply(this, arguments);
        const i = this.parser.parse(s.tokens);
        return e.call(this, i);
      };
    case "list":
      return function(s) {
        if (!s.type || s.type !== t)
          return e.apply(this, arguments);
        const i = s.ordered, o = s.start, a = s.loose;
        let l = "";
        for (let u = 0; u < s.items.length; u++) {
          const c = s.items[u], p = c.checked, m = c.task;
          let d = "";
          if (c.task) {
            const f = this.checkbox({ checked: !!p });
            a ? c.tokens.length > 0 && c.tokens[0].type === "paragraph" ? (c.tokens[0].text = f + " " + c.tokens[0].text, c.tokens[0].tokens && c.tokens[0].tokens.length > 0 && c.tokens[0].tokens[0].type === "text" && (c.tokens[0].tokens[0].text = f + " " + c.tokens[0].tokens[0].text)) : c.tokens.unshift({
              type: "text",
              text: f + " "
            }) : d += f + " ";
          }
          d += this.parser.parse(c.tokens, a), l += this.listitem({
            type: "list_item",
            raw: d,
            text: d,
            task: m,
            checked: !!p,
            loose: a,
            tokens: c.tokens
          });
        }
        return e.call(this, l, i, o);
      };
    case "html":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, s.text, s.block);
      };
    case "paragraph":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(s.tokens));
      };
    case "escape":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, s.text);
      };
    case "link":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, s.href, s.title, this.parser.parseInline(s.tokens));
      };
    case "image":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, s.href, s.title, s.text);
      };
    case "strong":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(s.tokens));
      };
    case "em":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(s.tokens));
      };
    case "codespan":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, s.text);
      };
    case "del":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(s.tokens));
      };
    case "text":
      return function(s) {
        return !s.type || s.type !== t ? e.apply(this, arguments) : e.call(this, s.text);
      };
  }
  return e;
}, Ce = function(e, t) {
  return (n, s) => {
    const i = { ...s }, o = { ...this.defaults, ...i };
    this.defaults.async === !0 && i.async === !1 && (o.silent || console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."), o.async = !0);
    const a = Z(this, v, Ht).call(this, !!o.silent, !!o.async);
    if (typeof n > "u" || n === null)
      return a(new Error("marked(): input parameter is undefined or null"));
    if (typeof n != "string")
      return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
    if (o.hooks && (o.hooks.options = o), o.async)
      return Promise.resolve(o.hooks ? o.hooks.preprocess(n) : n).then((l) => e(l, o)).then((l) => o.hooks ? o.hooks.processAllTokens(l) : l).then((l) => o.walkTokens ? Promise.all(this.walkTokens(l, o.walkTokens)).then(() => l) : l).then((l) => t(l, o)).then((l) => o.hooks ? o.hooks.postprocess(l) : l).catch(a);
    try {
      o.hooks && (n = o.hooks.preprocess(n));
      let l = e(n, o);
      o.hooks && (l = o.hooks.processAllTokens(l)), o.walkTokens && this.walkTokens(l, o.walkTokens);
      let u = t(l, o);
      return o.hooks && (u = o.hooks.postprocess(u)), u;
    } catch (l) {
      return a(l);
    }
  };
}, Ht = function(e, t) {
  return (n) => {
    if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
      const s = "<p>An error occurred:</p><pre>" + A(n.message + "", !0) + "</pre>";
      return t ? Promise.resolve(s) : s;
    }
    if (t)
      return Promise.reject(n);
    throw n;
  };
};
const F = new rr();
function y(r, e) {
  return F.parse(r, e);
}
y.options = y.setOptions = function(r) {
  return F.setOptions(r), y.defaults = F.defaults, vt(y.defaults), y;
};
y.getDefaults = ze;
y.defaults = j;
y.use = function(...r) {
  return F.use(...r), y.defaults = F.defaults, vt(y.defaults), y;
};
y.walkTokens = function(r, e) {
  return F.walkTokens(r, e);
};
y.parseInline = F.parseInline;
y.Parser = P;
y.parser = P.parse;
y.Renderer = ue;
y.TextRenderer = qe;
y.Lexer = L;
y.lexer = L.lex;
y.Tokenizer = le;
y.Hooks = Q;
y.parse = y;
y.options;
y.setOptions;
y.use;
y.walkTokens;
y.parseInline;
P.parse;
L.lex;
class G {
  constructor(e, t, n = void 0) {
    w(this, "text");
    w(this, "href");
    w(this, "patch");
    this.text = e, this.href = t, this.patch = n;
  }
}
class ir {
  constructor(e, t) {
    w(this, "src");
    w(this, "alt");
    this.src = e, this.alt = t;
  }
}
class or {
  constructor(e, t, n, s, i, o = new G("", "")) {
    w(this, "avatar");
    w(this, "icon");
    w(this, "time");
    w(this, "link1");
    w(this, "joinText");
    w(this, "link2");
    this.avatar = e, this.icon = t, this.time = n, this.link1 = s, this.joinText = i, this.link2 = o;
  }
  html() {
    return `
      <div class="px-3">
        <header class="mt-1 mb-2 width-full d-flex flex-justify-between">
          <!-- avatar -->
          <div class="mr-2">
            <div class="position-relative">
              <a class="Link d-block">
                <img
                  src="${this.avatar.src}"
                  alt="${this.avatar.alt} profile"
                  size="40"
                  height="40"
                  width="40"
                  class="feed-item-user-avatar avatar circle box-shadow-none"
                />
              </a>
              ${this.icon}
            </div>
          </div>

          <!-- title -->
          <div class="flex-1 ml-1 mb-1">
            <h5
              class="text-normal color-fg-muted d-flex flex-items-center flex-row flex-nowrap width-fit"
            >
              <span class="flex-1">
                <span class="flex-shrink-0">
                  <a
                    href="${this.link1.href}"
                    class="Link--primary Link text-bold"
                    >${this.link1.text}</a
                  >
                  ${this.joinText}
                </span>
                <span class="overflow-auto">
                  <span class="Truncate">
                    <span class="Truncate-text">
                      <a
                        href="${this.link2.href}"
                        class="Link--primary Link text-bold"
                        >${this.link2.text}</a
                      >
                    </span>
                  </span>
                </span>
              </span>
            </h5>
            <div class="d-flex">
              <h6
                style="margin-top: 0rem"
                class="text-small text-normal color-fg-muted"
              >
                <relative-time
                  tense="past"
                  datetime="${this.time}"
                  title="${this.time}"
                  >${this.time}</relative-time
                >
              </h6>
            </div>
          </div>
        </header>
      </div>
    `;
  }
}
class ar {
  constructor(e = new G("", ""), t = "", n) {
    w(this, "title");
    w(this, "markdown");
    w(this, "center");
    this.title = e, this.markdown = t, this.center = n;
  }
  html() {
    var s;
    const e = `
      <h3 class="lh-condensed mt-2 mb-2">
        <a
          href="${(s = this.title) == null ? void 0 : s.href}"
          class="Link--primary Link text-bold"
        >
          ${this.title.text}
          <span class="f3-light color-fg-muted"
            >${this.title.patch ? "#" + this.title.patch : ""}</span
          >
        </a>
      </h3>
    `, t = this.markdown ? `
        <section class="dashboard-break-word comment-body markdown-body m-0 p-3 color-bg-subtle mb-0 rounded-1">
          ${y.parse(this.markdown)}
        </section>` : "";
    return `
      <div class="mt-1 mb-1">
        <div class="px-3">
          <div>
            ${e}
            ${this.center ? this.center.html() : ""}
            ${t}
          </div>
        </div>
      </div>
    `;
  }
}
class lr {
  constructor(e, t) {
    w(this, "header");
    w(this, "body");
    this.header = e, this.body = t;
  }
  html() {
    return `
      <article class="js-feed-item-component js-feed-item-view js-feed-item-next-component d-flex flex-column width-full flex-items-baseline pt-2 pb-2">
        <div class="feed-item-content d-flex flex-column pt-2 pb-2 border color-border-default rounded-2 color-shadow-small width-full height-fit">
          <div class="rounded-2 py-1">
            ${this.header.html()}
            ${this.body.html()}
          </div>
        </div>
      </article>
    `;
  }
}
class cr {
  constructor(e) {
    w(this, "state");
    this.state = e;
  }
  html() {
    const e = this.state ? '<svg height="14" class="octicon octicon-git-merge" viewBox="0 0 16 16" version="1.1" width="14" aria-hidden="true"><path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z"></path></svg>' : '<svg height="16" class="octicon octicon-git-pull-request" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>';
    return `
      <section width="full" class="f6 color-fg-muted mt-2 mb-2">
        <span class="State State--${this.state ? "merged" : "open"} State--small mr-2">
          ${e}
          ${this.state ? "Merged" : "Open"}
        </span>
      </section>
    `;
  }
}
class ur extends Kt {
  async fetch(e, t) {
    const n = `https://api.github.com/search/issues?q=is:pr+author:${e}+created:<${t}&sort=created&order=desc`;
    console.log("Fetch", n);
    const s = await T.get(n, {
      headers: {
        Accept: "application/vnd.github.v3+json"
        // TODO: how to get user token dynamically
        // Authorization: "Bearer xxx",
      }
    });
    if (s.status === 200) {
      const i = s.data.items;
      console.log(i);
      let o = new Array();
      for (let a of i)
        o.push(this.createElement(a));
      return o;
    } else
      throw new Error(`Failed to fetch PullRequests: ${s.statusText}`);
  }
  /**
   * Build HTML node based on PR information
   */
  createElement(e) {
    const t = e.state == "closed", n = t ? '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-feed-merged circle feed-item-heading-icon feed-next color-fg-done position-absolute"> <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm.25-11.25A1.75 1.75 0 1 0 6 6.428v3.144a1.75 1.75 0 1 0 1 0V8.236A2.99 2.99 0 0 0 9 9h.571a1.75 1.75 0 1 0 0-1H9a2 2 0 0 1-1.957-1.586A1.75 1.75 0 0 0 8.25 4.75Z"></path> </svg>' : '<svg height="16" class="octicon octicon-feed-open circle feed-item-heading-icon feed-next color-fg-todo position-absolute" viewBox="-3 -3 22 22" version="1.1" width="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>';
    let s = e.body || "";
    s.length >= 1410 && (s = s.substring(0, 1410) + "...");
    const i = new ir(
      e.user.avatar_url,
      e.user.login
    ), o = new G(e.user.login, e.user.html_url), a = "contributed to", l = new G(
      e.repository_url.replace("https://api.github.com/repos/", ""),
      e.repository_url
    ), u = new or(
      i,
      n,
      e.created_at,
      o,
      a,
      l
    ), c = new G(
      e.title,
      e.html_url,
      e.number
    ), p = new cr(t), m = new ar(c, s, p), d = new lr(u, m);
    return Wt(d.html());
  }
}
class hr {
  constructor() {
    w(this, "events", []);
  }
  regsiter(e) {
    this.events.push(e);
  }
  load(e) {
    for (let t of this.events)
      t.load(e);
  }
}
(function() {
  window.onload = () => {
    pr();
  };
})();
async function pr() {
  var e;
  const r = (e = document.querySelector(
    "#switch_dashboard_context_left_column-button > span.Button-content > span > span:nth-child(2)"
  )) == null ? void 0 : e.innerHTML.trim();
  if (GM_addStyle(`
    .color-fg-todo {
      fill: white;
      background-color: var(--fgColor-open);
    }
    
    .color-fg-push {
      fill: white;
      background-color: var(--fgColor-accent);
    }
  `), r) {
    const t = new hr();
    t.regsiter(new ur()), t.load(r);
  }
}
