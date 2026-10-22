var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/jose/dist/webapi/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var strictDecoder = new TextDecoder("utf-8", { fatal: true });
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0), buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers)
    buf.set(buffer, i), i += buffer.length;
  return buf;
}
__name(concat, "concat");
var NON_ASCII = /[^\x00-\x7f]/;
function encode(string) {
  if (typeof string == "string" && string.length >= 128) {
    if (NON_ASCII.test(string))
      throw new TypeError("non-ASCII string encountered in encode()");
    return encoder.encode(string);
  }
  const bytes = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    if (code > 127)
      throw new TypeError("non-ASCII string encountered in encode()");
    bytes[i] = code;
  }
  return bytes;
}
__name(encode, "encode");
function decodeBase64(encoded, url = false) {
  if (Uint8Array.fromBase64)
    return Uint8Array.fromBase64(encoded, { alphabet: url ? "base64url" : "base64" });
  if (url) {
    if (encoded.includes("+") || encoded.includes("/"))
      throw new TypeError("Invalid base64url");
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  }
  const binary = atob(encoded), bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++)
    bytes[i] = binary.charCodeAt(i);
  return bytes;
}
__name(decodeBase64, "decodeBase64");

// node_modules/jose/dist/webapi/util/errors.js
var JOSEError = class extends Error {
  static {
    __name(this, "JOSEError");
  }
  static code = "ERR_JOSE_GENERIC";
  code = "ERR_JOSE_GENERIC";
  constructor(message2, options) {
    super(message2, options), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
  }
};
var JWTClaimValidationFailed = class extends JOSEError {
  static {
    __name(this, "JWTClaimValidationFailed");
  }
  static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  claim;
  reason;
  payload;
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } }), this.claim = claim, this.reason = reason, this.payload = payload;
  }
};
var JWTExpired = class extends JOSEError {
  static {
    __name(this, "JWTExpired");
  }
  static code = "ERR_JWT_EXPIRED";
  code = "ERR_JWT_EXPIRED";
  claim;
  reason;
  payload;
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } }), this.claim = claim, this.reason = reason, this.payload = payload;
  }
};
var JOSEAlgNotAllowed = class extends JOSEError {
  static {
    __name(this, "JOSEAlgNotAllowed");
  }
  static code = "ERR_JOSE_ALG_NOT_ALLOWED";
  code = "ERR_JOSE_ALG_NOT_ALLOWED";
};
var JOSENotSupported = class extends JOSEError {
  static {
    __name(this, "JOSENotSupported");
  }
  static code = "ERR_JOSE_NOT_SUPPORTED";
  code = "ERR_JOSE_NOT_SUPPORTED";
};
var JWSInvalid = class extends JOSEError {
  static {
    __name(this, "JWSInvalid");
  }
  static code = "ERR_JWS_INVALID";
  code = "ERR_JWS_INVALID";
};
var JWTInvalid = class extends JOSEError {
  static {
    __name(this, "JWTInvalid");
  }
  static code = "ERR_JWT_INVALID";
  code = "ERR_JWT_INVALID";
};
var JWKSInvalid = class extends JOSEError {
  static {
    __name(this, "JWKSInvalid");
  }
  static code = "ERR_JWKS_INVALID";
  code = "ERR_JWKS_INVALID";
};
var JWKSNoMatchingKey = class extends JOSEError {
  static {
    __name(this, "JWKSNoMatchingKey");
  }
  static code = "ERR_JWKS_NO_MATCHING_KEY";
  code = "ERR_JWKS_NO_MATCHING_KEY";
  constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
    super(message2, options);
  }
};
var JWKSMultipleMatchingKeys = class extends JOSEError {
  static {
    __name(this, "JWKSMultipleMatchingKeys");
  }
  [Symbol.asyncIterator] = async function* () {
  };
  static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
    super(message2, options);
  }
};
var JWKSTimeout = class extends JOSEError {
  static {
    __name(this, "JWKSTimeout");
  }
  static code = "ERR_JWKS_TIMEOUT";
  code = "ERR_JWKS_TIMEOUT";
  constructor(message2 = "request timed out", options) {
    super(message2, options);
  }
};
var JWSSignatureVerificationFailed = class extends JOSEError {
  static {
    __name(this, "JWSSignatureVerificationFailed");
  }
  static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  constructor(message2 = "signature verification failed", options) {
    super(message2, options);
  }
};

// node_modules/jose/dist/webapi/util/base64url.js
var invalid = "The input to be decoded is not correctly encoded.";
function decode(input) {
  try {
    return decodeBase64(typeof input == "string" ? input : decoder.decode(input), true);
  } catch (cause) {
    throw new TypeError(invalid, { cause });
  }
}
__name(decode, "decode");

// node_modules/jose/dist/webapi/lib/validate.js
function isObject(input) {
  if (typeof input != "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]")
    return false;
  const prototype = Object.getPrototypeOf(input);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}
__name(isObject, "isObject");
function isJwkSet(input) {
  return isObject(input) && Array.isArray(input.keys) && Array.from(input.keys).every(isObject);
}
__name(isJwkSet, "isJwkSet");
function isDisjoint(...headers) {
  const parameters = /* @__PURE__ */ new Set();
  for (const header of headers)
    if (header)
      for (const parameter of Object.keys(header)) {
        if (parameters.has(parameter))
          return false;
        parameters.add(parameter);
      }
  return true;
}
__name(isDisjoint, "isDisjoint");
function decodeBase64url(value, label, ErrorClass) {
  try {
    return decode(value);
  } catch {
    throw new ErrorClass(`Failed to base64url decode the ${label}`);
  }
}
__name(decodeBase64url, "decodeBase64url");
function encodeBase64url(value, label, ErrorClass) {
  try {
    return encode(value);
  } catch {
    throw new ErrorClass(`The ${label} is not a valid base64url string`);
  }
}
__name(encodeBase64url, "encodeBase64url");
function parseJoseHeader(b64, ErrorClass, message2) {
  let parsed;
  try {
    parsed = JSON.parse(strictDecoder.decode(decode(b64)));
  } catch {
    throw new ErrorClass(message2);
  }
  if (!isObject(parsed))
    throw new ErrorClass(message2);
  return parsed;
}
__name(parseJoseHeader, "parseJoseHeader");
var JWS_RECOGNIZED = { __proto__: null, b64: true };
function validateAlgorithms(option, algorithms) {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s != "string")))
    throw new TypeError(`"${option}" option must be an array of strings`);
  return algorithms === void 0 ? void 0 : new Set(algorithms);
}
__name(validateAlgorithms, "validateAlgorithms");
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0)
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  if (!protectedHeader || protectedHeader.crit === void 0)
    return [];
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input != "string" || input.length === 0))
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  const recognized = recognizedOption === void 0 ? recognizedDefault : { __proto__: null, ...recognizedOption, ...recognizedDefault };
  for (const parameter of protectedHeader.crit) {
    if (!(parameter in recognized))
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === void 0)
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    if (recognized[parameter] && (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === void 0))
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
  }
  return protectedHeader.crit;
}
__name(validateCrit, "validateCrit");
function validateB64(protectedHeader, extensions) {
  if (extensions.includes("b64")) {
    const b64 = protectedHeader.b64;
    if (typeof b64 != "boolean")
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    return b64;
  }
  return true;
}
__name(validateB64, "validateB64");

// node_modules/jose/dist/webapi/lib/key.js
var tag = /* @__PURE__ */ __name((key) => key[Symbol.toStringTag], "tag");
var jwkMatchesOp = /* @__PURE__ */ __name((entry, key, usage) => {
  const { alg } = entry;
  if (key.use !== void 0) {
    const expected = usage === "sign" || usage === "verify" ? "sig" : "enc";
    if (key.use !== expected)
      throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
  }
  if (key.alg !== void 0 && key.alg !== alg)
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
  if (Array.isArray(key.key_ops)) {
    const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.ops?.[usage === "encrypt" ? 0 : 1] : usage;
    if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp))
      throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
  }
}, "jwkMatchesOp");
async function prepareKey(entry, key, usage) {
  const { alg, secret } = entry, privateKey = usage === "decrypt" || usage === "sign";
  if (secret && key instanceof Uint8Array)
    return key;
  let normalized, keyObject;
  if (isObject(key)) {
    if (normalized = normalizeJwk(key), typeof normalized.kty != "string")
      throw invalidKeyType(alg, key, secret);
    if (!(secret ? normalized.kty === "oct" && typeof normalized.k == "string" : normalized.kty !== "oct" && (privateKey ? normalized.kty === "AKP" && typeof normalized.priv == "string" || typeof normalized.d == "string" : normalized.d === void 0 && normalized.priv === void 0)))
      throw new TypeError(secret ? 'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present' : `JSON Web Key for this operation must be a ${privateKey ? "private" : "public"} JWK`);
    if (jwkMatchesOp(entry, normalized, usage), normalized.kty === "oct")
      return decode(normalized.k);
    if (!Object.isFrozen(key)) {
      const { key_ops } = key;
      Array.isArray(key_ops) && Object.freeze(key_ops), Object.freeze(key);
    }
  } else {
    if (!isKeyLike(key))
      throw invalidKeyType(alg, key, secret);
    const expectedType = secret ? "secret" : privateKey ? "private" : "public";
    if (key.type !== expectedType && (secret || ["secret", "public", "private"].includes(key.type)))
      throw new TypeError(`${tag(key)} instances must be of type "${expectedType}" for the ${alg} algorithm`);
    if (isCryptoKey(key))
      return key;
    if (keyObject = key, keyObject.type === "secret")
      return keyObject.export();
  }
  cache ||= /* @__PURE__ */ new WeakMap();
  const cacheKey = key;
  let cached = cache.get(cacheKey);
  if (cached?.[alg])
    return cached[alg];
  if (cached || cache.set(cacheKey, cached = {}), keyObject && typeof keyObject.toCryptoKey == "function") {
    const isPublic = keyObject.type === "public", crv = nist[keyObject.asymmetricKeyDetails?.namedCurve], params = entry.resolve?.({ crv, asymmetricKeyType: keyObject.asymmetricKeyType }) ?? entry.subtle;
    return cached[alg] = keyObject.toCryptoKey(params, isPublic, entry.usages[isPublic ? 0 : 1]);
  }
  return normalized ??= keyObject.export({ format: "jwk" }), normalized.alg = alg, cached[alg] = await jwkToKey(entry, normalized);
}
__name(prepareKey, "prepareKey");
var cache;
var nist = {
  __proto__: null,
  prime256v1: "P-256",
  secp384r1: "P-384",
  secp521r1: "P-521"
};
var isCryptoKey = /* @__PURE__ */ __name((key) => {
  if (key?.[Symbol.toStringTag] === "CryptoKey")
    return true;
  try {
    return key instanceof CryptoKey;
  } catch {
    return false;
  }
}, "isCryptoKey");
var isKeyObject = /* @__PURE__ */ __name((key) => key?.[Symbol.toStringTag] === "KeyObject", "isKeyObject");
var isKeyLike = /* @__PURE__ */ __name((key) => isCryptoKey(key) || isKeyObject(key), "isKeyLike");
function message(msg, actual, ...types) {
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(", ")}, or ${last}.`;
  } else types.length === 2 ? msg += `one of type ${types[0]} or ${types[1]}.` : msg += `of type ${types[0]}.`;
  return actual == null ? msg += ` Received ${actual}` : typeof actual == "function" && actual.name ? msg += ` Received function ${actual.name}` : typeof actual == "object" && actual != null && actual.constructor?.name && (msg += ` Received an instance of ${actual.constructor.name}`), msg;
}
__name(message, "message");
function invalidKeyType(alg, actual, secret) {
  const types = ["CryptoKey", "KeyObject", "JSON Web Key"];
  return secret && types.push("Uint8Array"), new TypeError(message(`Key for the ${alg} algorithm must be `, actual, ...types));
}
__name(invalidKeyType, "invalidKeyType");
var unusable = /* @__PURE__ */ __name((name, prop = "algorithm.name") => new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`), "unusable");
function checkUsage(key, usage) {
  if (usage && !key.usages.includes(usage))
    throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
}
__name(checkUsage, "checkUsage");
function checkModulusLength(alg, key) {
  const { modulusLength } = key.algorithm;
  if (typeof modulusLength != "number" || modulusLength < 2048)
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
}
__name(checkModulusLength, "checkModulusLength");
function checkCryptoKey(key, expected, usage) {
  const algorithm = key.algorithm;
  if (algorithm.name !== expected.name)
    throw unusable(expected.name);
  if (expected.hash && algorithm.hash?.name !== expected.hash)
    throw unusable(expected.hash, "algorithm.hash");
  if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve)
    throw unusable(expected.namedCurve, "algorithm.namedCurve");
  if (expected.length !== void 0 && algorithm.length !== expected.length)
    throw unusable(expected.length, "algorithm.length");
  checkUsage(key, usage);
}
__name(checkCryptoKey, "checkCryptoKey");
function snapshotJwk(jwk) {
  return { __proto__: null, ...jwk };
}
__name(snapshotJwk, "snapshotJwk");
function normalizeJwk(jwk) {
  const normalized = snapshotJwk(jwk);
  if (normalized.ext !== void 0 && typeof normalized.ext != "boolean")
    throw new TypeError('"ext" (Extractable) Parameter must be a boolean');
  if (normalized.key_ops !== void 0) {
    const value = normalized.key_ops, keyOps = Array.isArray(value) ? [...value] : void 0;
    if (!keyOps || keyOps.some((operation) => typeof operation != "string") || new Set(keyOps).size !== keyOps.length)
      throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings');
    normalized.key_ops = keyOps;
  }
  return normalized;
}
__name(normalizeJwk, "normalizeJwk");
async function jwkToKey(entry, jwk, extractable) {
  if (!entry.kty.includes(jwk.kty))
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
  const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle, isPrivate = !!(jwk.d || jwk.priv), keyData = { ...jwk, ext: extractable ?? jwk.ext };
  return keyData.kty !== "AKP" && delete keyData.alg, delete keyData.use, crypto.subtle.importKey("jwk", keyData, algorithm, keyData.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
}
__name(jwkToKey, "jwkToKey");
async function rawKey(key, expected, usage, extractable = false) {
  return key instanceof Uint8Array && (key = await crypto.subtle.importKey("raw", key, expected, extractable, [usage])), checkCryptoKey(key, expected, usage), key;
}
__name(rawKey, "rawKey");

// node_modules/jose/dist/webapi/lib/key_descriptor.js
function table(entries) {
  const out = { __proto__: null };
  for (const alg in entries)
    out[alg] = { ...entries[alg], alg };
  return out;
}
__name(table, "table");

// node_modules/jose/dist/webapi/lib/jws_algorithms.js
var sig = [["verify"], ["sign"]];
function hmac(bits) {
  const subtle = { name: "HMAC", hash: `SHA-${bits}` };
  return { kty: ["oct"], secret: true, subtle, signing: subtle, usages: sig };
}
__name(hmac, "hmac");
function rsa(bits, saltLength) {
  const subtle = { name: saltLength ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: `SHA-${bits}` };
  return {
    kty: ["RSA"],
    subtle,
    signing: saltLength ? { ...subtle, saltLength } : subtle,
    usages: sig,
    minRsaBits: 2048
  };
}
__name(rsa, "rsa");
function ecdsa(crv, bits) {
  return {
    kty: ["EC"],
    crv,
    subtle: { name: "ECDSA", namedCurve: crv },
    signing: { name: "ECDSA", hash: `SHA-${bits}` },
    usages: sig
  };
}
__name(ecdsa, "ecdsa");
function eddsa() {
  const subtle = { name: "Ed25519" };
  return {
    kty: ["OKP"],
    crv: "Ed25519",
    subtle,
    signing: subtle,
    usages: sig
  };
}
__name(eddsa, "eddsa");
function mldsa(bits) {
  const subtle = { name: `ML-DSA-${bits}` };
  return {
    kty: ["AKP"],
    subtle,
    signing: subtle,
    usages: sig
  };
}
__name(mldsa, "mldsa");
var JWS = table({
  HS256: hmac(256),
  HS384: hmac(384),
  HS512: hmac(512),
  RS256: rsa(256),
  RS384: rsa(384),
  RS512: rsa(512),
  PS256: rsa(256, 32),
  PS384: rsa(384, 48),
  PS512: rsa(512, 64),
  ES256: ecdsa("P-256", 256),
  ES384: ecdsa("P-384", 384),
  ES512: ecdsa("P-521", 512),
  EdDSA: eddsa(),
  Ed25519: eddsa(),
  "ML-DSA-44": mldsa(44),
  "ML-DSA-65": mldsa(65),
  "ML-DSA-87": mldsa(87)
});
function jwsAlgorithm(alg) {
  const entry = typeof alg == "string" ? JWS[alg] : void 0;
  if (!entry)
    throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  return entry;
}
__name(jwsAlgorithm, "jwsAlgorithm");

// node_modules/jose/dist/webapi/lib/jws_verify.js
function prepareVerify(options) {
  return [options && validateAlgorithms("algorithms", options.algorithms), options?.crit];
}
__name(prepareVerify, "prepareVerify");
function parseProtectedHeader(encodedProtected) {
  return encodedProtected === void 0 ? {} : parseJoseHeader(encodedProtected, JWSInvalid, "JWS Protected Header is invalid");
}
__name(parseProtectedHeader, "parseProtectedHeader");
function encodeCompactUnencodedPayload(payload) {
  try {
    return encode(payload);
  } catch {
    throw new JWSInvalid("JWS Compact Serialization payload must use only ASCII characters");
  }
}
__name(encodeCompactUnencodedPayload, "encodeCompactUnencodedPayload");
async function verifySignature(jws, shared, key, encodeUnencodedPayload, parsedProtected) {
  const { protected: encodedProtected, header, payload: inputPayload } = jws, parsedProt = parsedProtected ?? parseProtectedHeader(encodedProtected);
  if (!isDisjoint(parsedProt, header))
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  const joseHeader = { ...parsedProt, ...header }, b64 = validateB64(parsedProt, validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader)), { alg } = joseHeader;
  if (typeof alg != "string" || !alg)
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  if (shared[0] && !shared[0].has(alg))
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  if (b64) {
    if (typeof inputPayload != "string")
      throw new JWSInvalid("JWS Payload must be a string");
  } else if (typeof inputPayload != "string" && !(inputPayload instanceof Uint8Array))
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  const signingPayload = b64 || typeof inputPayload != "string" ? inputPayload : encodeUnencodedPayload(inputPayload);
  let resolvedKey = false;
  typeof key == "function" && (key = await key(parsedProt, jws), resolvedKey = true);
  const entry = jwsAlgorithm(alg), data = concat(encodedProtected !== void 0 ? encode(encodedProtected) : new Uint8Array(), encode("."), typeof signingPayload == "string" ? shared[2] ??= encodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload), signature = decodeBase64url(jws.signature, "signature", JWSInvalid), k = await prepareKey(entry, key, "verify"), cryptoKey = await rawKey(k, entry.subtle, "verify");
  entry.minRsaBits && checkModulusLength(entry.alg, cryptoKey);
  let verified = false;
  try {
    verified = await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
  } catch {
  }
  if (!verified)
    throw new JWSSignatureVerificationFailed();
  const result = { payload: typeof signingPayload == "string" ? decodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload };
  return encodedProtected !== void 0 && (result.protectedHeader = parsedProt), header !== void 0 && (result.unprotectedHeader = header), resolvedKey ? [{ ...result, key: k }, b64] : [result, b64];
}
__name(verifySignature, "verifySignature");
async function verifyCompact(jws, shared, key) {
  if (jws instanceof Uint8Array && (jws = decoder.decode(jws)), typeof jws != "string")
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3)
    throw new JWSInvalid("Invalid Compact JWS");
  return verifySignature({ payload, protected: protectedHeader, signature }, shared, key, encodeCompactUnencodedPayload);
}
__name(verifyCompact, "verifyCompact");

// node_modules/jose/dist/webapi/lib/jwt_claims_set.js
var epoch = /* @__PURE__ */ __name((date) => Math.floor(date.getTime() / 1e3), "epoch");
var multipliers = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800,
  y: 31557600
};
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var checkFailed = "check_failed";
function invalidDuration() {
  throw new TypeError("Invalid time period format");
}
__name(invalidDuration, "invalidDuration");
function secs(str) {
  typeof str != "string" && invalidDuration();
  const matched = REGEX.exec(str);
  (!matched || matched[4] && matched[1]) && invalidDuration();
  const value = parseFloat(matched[2]), numericDate2 = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
  return Number.isFinite(numericDate2) || invalidDuration(), matched[1] === "-" || matched[4] === "ago" ? -numericDate2 : numericDate2;
}
__name(secs, "secs");
function validateInput(label, input) {
  if (!Number.isFinite(input))
    throw new TypeError(`Invalid ${label} input`);
  return input;
}
__name(validateInput, "validateInput");
var normalizeTyp = /* @__PURE__ */ __name((value) => {
  const normalized = value.toLowerCase();
  return value.includes("/") ? normalized : `application/${normalized}`;
}, "normalizeTyp");
var checkAudiencePresence = /* @__PURE__ */ __name((audPayload, audOption) => typeof audPayload == "string" ? audOption.includes(audPayload) : Array.isArray(audPayload) ? audOption.some((aud) => audPayload.includes(aud)) : false, "checkAudiencePresence");
function validateNumericDate(payload, claim, required = false) {
  const value = payload[claim];
  if (!(value === void 0 && !required)) {
    if (typeof value != "number")
      throw new JWTClaimValidationFailed(`"${claim}" claim must be a number`, payload, claim, "invalid");
    return value;
  }
}
__name(validateNumericDate, "validateNumericDate");
function unexpectedClaim(payload, claim) {
  throw new JWTClaimValidationFailed(`unexpected "${claim}" claim value`, payload, claim, checkFailed);
}
__name(unexpectedClaim, "unexpectedClaim");
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
  let payload;
  try {
    payload = JSON.parse(strictDecoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject(payload))
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  const { typ } = options;
  if (typ !== void 0 && (typeof protectedHeader.typ != "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ)))
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", checkFailed);
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options, presenceCheck = [...requiredClaims];
  maxTokenAge !== void 0 && presenceCheck.push("iat"), audience !== void 0 && presenceCheck.push("aud"), subject !== void 0 && presenceCheck.push("sub"), issuer !== void 0 && presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse()))
    if (!Object.hasOwn(payload, claim))
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
  issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss) && unexpectedClaim(payload, "iss"), subject !== void 0 && payload.sub !== subject && unexpectedClaim(payload, "sub"), audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience == "string" ? [audience] : audience) && unexpectedClaim(payload, "aud");
  const { clockTolerance } = options;
  let tolerance = 0;
  if (typeof clockTolerance == "string")
    tolerance = secs(clockTolerance);
  else if (clockTolerance !== void 0) {
    if (typeof clockTolerance != "number")
      throw new TypeError("Invalid clockTolerance option type");
    tolerance = clockTolerance;
  }
  validateInput("clockTolerance option", tolerance);
  const { currentDate } = options, now = validateInput("currentDate option", epoch(currentDate === void 0 ? /* @__PURE__ */ new Date() : currentDate)), iat = validateNumericDate(payload, "iat", maxTokenAge !== void 0), nbf = validateNumericDate(payload, "nbf");
  if (nbf !== void 0 && nbf > now + tolerance)
    throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", checkFailed);
  const exp = validateNumericDate(payload, "exp");
  if (exp !== void 0 && exp <= now - tolerance)
    throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", checkFailed);
  if (maxTokenAge !== void 0) {
    const age = now - iat, max = validateInput("maxTokenAge option", typeof maxTokenAge == "number" ? maxTokenAge : secs(maxTokenAge));
    if (age - tolerance > max)
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", checkFailed);
    if (age < -tolerance)
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", checkFailed);
  }
  return payload;
}
__name(validateClaimsSet, "validateClaimsSet");

// node_modules/jose/dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const [verified, b64] = await verifyCompact(jwt, prepareVerify(options), key);
  if (!b64)
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  const payload = validateClaimsSet(verified.protectedHeader, verified.payload, options);
  return { ...verified, payload };
}
__name(jwtVerify, "jwtVerify");

// node_modules/jose/dist/webapi/jwks/local.js
function isUsableJWK(jwk, entry, alg, kid) {
  const { kty, key_ops: keyOps, ext, kid: jwkKid, alg: jwkAlg, use, crv } = jwk;
  return (ext === void 0 || typeof ext == "boolean") && (keyOps === void 0 || Array.isArray(keyOps) && keyOps.every((operation, index) => typeof operation == "string" && keyOps.indexOf(operation) === index) && keyOps.includes("verify")) && entry.kty.includes(kty) && (kid === void 0 || typeof kid == "string" && kid === jwkKid) && (jwkAlg === void 0 ? kty !== "AKP" : alg === jwkAlg) && (use === void 0 || use === "sig") && (!entry.crv || crv === entry.crv);
}
__name(isUsableJWK, "isUsableJWK");
async function importWithAlgCache(cache2, jwk, entry) {
  const cached = cache2.get(jwk) || cache2.set(jwk, {}).get(jwk), { alg } = entry;
  if (cached[alg] === void 0) {
    const pending = jwkToKey(entry, jwk, true).then((key) => {
      if (key.type !== "public")
        throw new JWKSInvalid("JSON Web Key Set members must be public keys");
      return cached[alg] = key, key;
    }).catch((error) => {
      throw cached[alg] === pending && delete cached[alg], error;
    });
    cached[alg] = pending;
  }
  return cached[alg];
}
__name(importWithAlgCache, "importWithAlgCache");
function createLocalJWKSet(jwks) {
  let snapshot;
  try {
    snapshot = structuredClone(jwks);
  } catch {
  }
  if (!isJwkSet(snapshot))
    throw new JWKSInvalid("JSON Web Key Set malformed");
  const metadata = snapshot.keys.map((jwk) => {
    const normalized = snapshotJwk(jwk);
    return Array.isArray(normalized.key_ops) && (normalized.key_ops = [...normalized.key_ops]), normalized;
  }), cached = /* @__PURE__ */ new WeakMap();
  return Object.defineProperty(async (protectedHeader, token) => {
    const { alg, kid } = { ...protectedHeader, ...token?.header }, entry = typeof alg == "string" ? JWS[alg] : void 0;
    if (!entry || entry.secret)
      throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
    const candidates = snapshot.keys.filter((_, index) => isUsableJWK(metadata[index], entry, alg, kid)), { 0: jwk, length } = candidates;
    if (!length)
      throw new JWKSNoMatchingKey();
    if (length !== 1) {
      const error = new JWKSMultipleMatchingKeys();
      throw error[Symbol.asyncIterator] = async function* () {
        for (const jwk2 of candidates)
          try {
            yield await importWithAlgCache(cached, jwk2, entry);
          } catch {
          }
      }, error;
    }
    return importWithAlgCache(cached, jwk, entry);
  }, "jwks", {
    value: /* @__PURE__ */ __name(() => structuredClone(snapshot), "value")
  });
}
__name(createLocalJWKSet, "createLocalJWKSet");

// node_modules/jose/dist/webapi/jwks/remote.js
function isCloudflareWorkers() {
  return typeof WebSocketPair < "u" || typeof navigator < "u" && true || typeof EdgeRuntime < "u" && EdgeRuntime === "vercel";
}
__name(isCloudflareWorkers, "isCloudflareWorkers");
var USER_AGENT;
(typeof navigator > "u" || !"Cloudflare-Workers"?.startsWith?.("Mozilla/5.0 ")) && (USER_AGENT = "jose/v6.2.12");
var customFetch = /* @__PURE__ */ Symbol();
async function fetchJwks(url, headers, signal, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    method: "GET",
    signal,
    redirect: "manual",
    headers
  }).catch((err) => {
    throw err.name === "TimeoutError" ? new JWKSTimeout() : err;
  });
  if (response.status !== 200)
    throw new JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
  try {
    return await response.json();
  } catch {
    throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
  }
}
__name(fetchJwks, "fetchJwks");
var jwksCache = /* @__PURE__ */ Symbol();
function isFreshFor(timestamp, duration) {
  return Number.isFinite(timestamp) && Date.now() < timestamp + duration;
}
__name(isFreshFor, "isFreshFor");
function validateDuration(value, fallback, option) {
  if (Number.isNaN(value))
    throw new TypeError(`"${option}" option must not be NaN`);
  return typeof value == "number" ? value : fallback;
}
__name(validateDuration, "validateDuration");
function createRemoteJWKSet(url, options) {
  if (!(url instanceof URL))
    throw new TypeError("url must be an instance of URL");
  const href = new URL(url.href).href, opts = options ?? {}, timeoutOption = opts.timeoutDuration;
  if (typeof timeoutOption == "number" && (!Number.isInteger(timeoutOption) || timeoutOption < 0))
    throw new TypeError('"timeoutDuration" option must be a non-negative integer');
  const timeoutDuration = typeof timeoutOption == "number" ? timeoutOption : 5e3, cooldownDuration = validateDuration(opts.cooldownDuration, 3e4, "cooldownDuration"), cacheMaxAge = validateDuration(opts.cacheMaxAge, 6e5, "cacheMaxAge"), headers = new Headers(opts.headers);
  USER_AGENT && !headers.has("User-Agent") && headers.set("User-Agent", USER_AGENT), headers.has("accept") || headers.set("accept", "application/json, application/jwk-set+json");
  const fetchImpl = opts[customFetch], cache2 = opts[jwksCache];
  let jwksTimestamp, pendingFetch, reloadSequence = 0, appliedSequence = 0, local;
  if (cache2 && typeof cache2 == "object") {
    const { uat, jwks } = cache2;
    isFreshFor(uat, cacheMaxAge) && isJwkSet(jwks) && (jwksTimestamp = uat, local = createLocalJWKSet(jwks));
  }
  const reload = /* @__PURE__ */ __name(async () => {
    if (pendingFetch && isCloudflareWorkers() && (pendingFetch = void 0), !pendingFetch) {
      const sequence = ++reloadSequence, current = pendingFetch = fetchJwks(href, headers, AbortSignal.timeout(timeoutDuration), fetchImpl).then((json2) => {
        const next = createLocalJWKSet(json2);
        if (sequence <= appliedSequence)
          return;
        local = next;
        const updatedAt = Date.now();
        cache2 && (cache2.uat = updatedAt, cache2.jwks = json2), jwksTimestamp = updatedAt, appliedSequence = sequence;
      }).finally(() => {
        pendingFetch === current && (pendingFetch = void 0);
      });
    }
    await pendingFetch;
  }, "reload");
  return Object.defineProperties(async (protectedHeader, token) => {
    (!local || !isFreshFor(jwksTimestamp, cacheMaxAge)) && await reload();
    try {
      return await local(protectedHeader, token);
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey && !isFreshFor(jwksTimestamp, cooldownDuration))
        return await reload(), local(protectedHeader, token);
      throw err;
    }
  }, {
    coolingDown: {
      get: /* @__PURE__ */ __name(() => isFreshFor(jwksTimestamp, cooldownDuration), "get"),
      enumerable: true
    },
    fresh: {
      get: /* @__PURE__ */ __name(() => isFreshFor(jwksTimestamp, cacheMaxAge), "get"),
      enumerable: true
    },
    reload: {
      value: reload,
      enumerable: true
    },
    reloading: {
      get: /* @__PURE__ */ __name(() => !!pendingFetch, "get"),
      enumerable: true
    },
    jwks: {
      value: /* @__PURE__ */ __name(() => local?.jwks(), "value"),
      enumerable: true
    }
  });
}
__name(createRemoteJWKSet, "createRemoteJWKSet");

// worker.js
var MAX_BODY_BYTES = 100 * 1024;
var FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);
var ALLOWED_ORIGINS = /* @__PURE__ */ new Set([
  "https://taskflow-pro-x-11703.web.app",
  "http://localhost:3000",
  "http://localhost:5000"
]);
var HttpError = class extends Error {
  static {
    __name(this, "HttpError");
  }
  constructor(status, message2) {
    super(message2);
    this.status = status;
  }
};
function isAllowedOrigin(origin, env) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
    return true;
  }
  return (env.ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean).includes(origin);
}
__name(isAllowedOrigin, "isAllowedOrigin");
function json(request, env, body, status = 200) {
  const origin = request.headers.get("Origin");
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Cache-Control": "no-store",
    Vary: "Origin"
  });
  if (origin && isAllowedOrigin(origin, env)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return new Response(JSON.stringify(body), { status, headers });
}
__name(json, "json");
function reply(request, env, status, message2, extra = {}) {
  return json(request, env, { success: status < 400, message: message2, ...extra }, status);
}
__name(reply, "reply");
async function readJson(request) {
  const declaredLength = Number(request.headers.get("Content-Length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "Request body is too large");
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "Request body is too large");
  }
  if (!text) return {};
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Invalid request body");
  }
  return body;
}
__name(readJson, "readJson");
function database(env) {
  if (!env.DB) throw new Error("D1 binding DB is not configured");
  return env.DB;
}
__name(database, "database");
function otpKey(env) {
  if (typeof env.JWT_SECRET !== "string" || env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  return new TextEncoder().encode(env.JWT_SECRET);
}
__name(otpKey, "otpKey");
async function verifyFirebaseToken(request, env, requireVerifiedEmail = true) {
  const header = request.headers.get("Authorization") ?? "";
  if (!header.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentication required");
  }
  if (!env.FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID is not configured");
  }
  let payload;
  try {
    ({ payload } = await jwtVerify(header.slice(7), FIREBASE_JWKS, {
      algorithms: ["RS256"],
      audience: env.FIREBASE_PROJECT_ID,
      issuer: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`
    }));
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
  if (typeof payload.sub !== "string" || !payload.sub || typeof payload.email !== "string") {
    throw new HttpError(401, "Invalid Firebase account");
  }
  if (requireVerifiedEmail && payload.email_verified !== true) {
    throw new HttpError(403, "Verify your Firebase email before continuing");
  }
  return {
    firebaseUid: payload.sub,
    email: payload.email.trim().toLowerCase(),
    name: typeof payload.name === "string" ? payload.name.trim() : ""
  };
}
__name(verifyFirebaseToken, "verifyFirebaseToken");
async function authenticate(request, env) {
  const identity = await verifyFirebaseToken(request, env, false);
  const user = await database(env).prepare("SELECT id, email FROM users WHERE firebase_uid = ?").bind(identity.firebaseUid).first();
  if (!user) {
    throw new HttpError(401, "Complete account setup before continuing");
  }
  return { ...identity, id: user.id };
}
__name(authenticate, "authenticate");
function userResponse(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    plan: user.plan,
    subscription_status: user.subscription_status,
    subscription_start: user.subscription_start,
    subscription_end: user.subscription_end
  };
}
__name(userResponse, "userResponse");
async function syncFirebaseSession(request, env) {
  const identity = await verifyFirebaseToken(request, env);
  const body = await readJson(request);
  let name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : identity.name;
  if (name.length > 255) throw new HttpError(400, "Name is too long");
  const db = database(env);
  let user = await db.prepare("SELECT * FROM users WHERE firebase_uid = ?").bind(identity.firebaseUid).first();
  if (!user) {
    const existing = await db.prepare("SELECT * FROM users WHERE email = ?").bind(identity.email).first();
    if (existing?.firebase_uid && existing.firebase_uid !== identity.firebaseUid) {
      throw new HttpError(409, "This account is linked to another Firebase user");
    }
    if (existing) {
      await db.prepare("UPDATE users SET firebase_uid = ? WHERE id = ? AND firebase_uid IS NULL").bind(identity.firebaseUid, existing.id).run();
      user = await db.prepare("SELECT * FROM users WHERE firebase_uid = ?").bind(identity.firebaseUid).first();
    } else {
      if (!name) name = identity.email.split("@")[0];
      const result = await db.prepare(
        "INSERT INTO users (full_name, email, password, firebase_uid) VALUES (?, ?, '', ?)"
      ).bind(name, identity.email, identity.firebaseUid).run();
      user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(result.meta.last_row_id).first();
    }
  }
  if (!user) throw new Error("Firebase account could not be linked to a user");
  return json(request, env, {
    success: true,
    message: "Authentication successful",
    userId: user.id,
    full_name: user.full_name,
    email: user.email,
    plan: user.plan,
    subscription_status: user.subscription_status,
    subscription_start: user.subscription_start,
    subscription_end: user.subscription_end
  });
}
__name(syncFirebaseSession, "syncFirebaseSession");
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
__name(isValidEmail, "isValidEmail");
function normalizeDate(value) {
  if (value === void 0 || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new HttpError(400, "Invalid due date");
  }
  const date = value.split("T")[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new HttpError(400, "Invalid due date");
  }
  const parsed = /* @__PURE__ */ new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new HttpError(400, "Invalid due date");
  }
  return date;
}
__name(normalizeDate, "normalizeDate");
async function otpHash(otp, env) {
  const key = await crypto.subtle.importKey(
    "raw",
    otpKey(env),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(otp))
  );
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(otpHash, "otpHash");
function createOtp() {
  let otp = "";
  while (otp.length < 6) {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    for (const byte of bytes) {
      if (byte < 250 && otp.length < 6) otp += String(byte % 10);
    }
  }
  return otp;
}
__name(createOtp, "createOtp");
function sameSecret(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
__name(sameSecret, "sameSecret");
async function rateLimitAuth(request, env) {
  if (!env.AUTH_LIMITER) return;
  const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const { success } = await env.AUTH_LIMITER.limit({ key: `auth:${clientIp}` });
  if (!success) {
    throw new HttpError(
      429,
      "Too many authentication attempts. Please try again later."
    );
  }
}
__name(rateLimitAuth, "rateLimitAuth");
async function sendOtpEmail(email, otp, env) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: [email],
      subject: "TaskFlow Pro X - Email Verification Code",
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px"><h2>TaskFlow Pro X</h2><p>You requested to change the email address associated with your TaskFlow Pro X account.</p><p>Your verification code is:</p><div style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:24px 0">${otp}</div><p>This code will expire in <strong>10 minutes</strong>.</p><p>If you did not request this change, you can safely ignore this email.</p><p>\u2014 TaskFlow Pro X</p></div>`
    })
  });
  if (!response.ok) throw new Error(`Resend request failed (${response.status})`);
}
__name(sendOtpEmail, "sendOtpEmail");
async function getProfile(request, env, user) {
  const profile = await database(env).prepare(
    `SELECT id, full_name, email, plan, subscription_status,
              subscription_start, subscription_end, created_at
       FROM users WHERE id = ?`
  ).bind(user.id).first();
  if (!profile) throw new HttpError(404, "User not found");
  return json(request, env, { success: true, user: profile });
}
__name(getProfile, "getProfile");
async function updateProfile(request, env, user) {
  const { name } = await readJson(request);
  if (typeof name !== "string") throw new HttpError(400, "Name is required");
  const cleanName = name.trim();
  if (!cleanName) throw new HttpError(400, "Name cannot be empty");
  if (cleanName.length > 100) throw new HttpError(400, "Name is too long");
  const db = database(env);
  await db.prepare("UPDATE users SET full_name = ? WHERE id = ?").bind(cleanName, user.id).run();
  const profile = await db.prepare(
    `SELECT id, full_name, email, plan, subscription_status,
              subscription_start, subscription_end, created_at
       FROM users WHERE id = ?`
  ).bind(user.id).first();
  if (!profile) throw new HttpError(404, "User not found");
  return json(request, env, {
    success: true,
    message: "Profile updated successfully",
    user: profile
  });
}
__name(updateProfile, "updateProfile");
async function getSubscription(request, env, user) {
  const record = await database(env).prepare(
    `SELECT plan, subscription_status, subscription_start, subscription_end
       FROM users WHERE id = ?`
  ).bind(user.id).first();
  if (!record) throw new HttpError(404, "User not found");
  return json(request, env, { success: true, subscription: record });
}
__name(getSubscription, "getSubscription");
async function getTasks(request, env, user, url) {
  const search = (url.searchParams.get("search") ?? "").trim();
  const status = (url.searchParams.get("status") ?? "").trim();
  const priority = (url.searchParams.get("priority") ?? "").trim();
  if (search.length > 100) throw new HttpError(400, "Search text is too long");
  if (status.length > 50 || priority.length > 50) {
    throw new HttpError(400, "Invalid filter value");
  }
  const conditions = ["user_id = ?"];
  const values = [user.id];
  if (search) {
    conditions.push("title LIKE ?");
    values.push(`%${search}%`);
  }
  if (status) {
    conditions.push("status = ?");
    values.push(status);
  }
  if (priority) {
    conditions.push("priority = ?");
    values.push(priority);
  }
  const result = await database(env).prepare(`SELECT * FROM tasks WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC`).bind(...values).all();
  return json(request, env, { success: true, tasks: result.results });
}
__name(getTasks, "getTasks");
async function createTask(request, env, user) {
  const body = await readJson(request);
  const { title, description, status, priority, due_date } = body;
  if (typeof title !== "string") {
    throw new HttpError(400, "Task title is required");
  }
  if (description != null && typeof description !== "string") {
    throw new HttpError(400, "Invalid task description");
  }
  if (status != null && typeof status !== "string") {
    throw new HttpError(400, "Invalid task status");
  }
  if (priority != null && typeof priority !== "string") {
    throw new HttpError(400, "Invalid task priority");
  }
  const cleanTitle = title.trim();
  const cleanDescription = typeof description === "string" ? description.trim() : null;
  const cleanStatus = typeof status === "string" && status.trim() ? status.trim() : "Pending";
  const cleanPriority = typeof priority === "string" && priority.trim() ? priority.trim() : "Medium";
  if (!cleanTitle) throw new HttpError(400, "Task title is required");
  if (cleanTitle.length > 255) throw new HttpError(400, "Task title is too long");
  if (cleanDescription !== null && cleanDescription.length > 1e4) {
    throw new HttpError(400, "Task description is too long");
  }
  if (cleanStatus.length > 50) throw new HttpError(400, "Task status is too long");
  if (cleanPriority.length > 50) throw new HttpError(400, "Task priority is too long");
  const result = await database(env).prepare(
    `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(user.id, cleanTitle, cleanDescription, cleanStatus, cleanPriority, normalizeDate(due_date)).run();
  return json(request, env, {
    success: true,
    message: "Task created successfully",
    id: result.meta.last_row_id
  }, 201);
}
__name(createTask, "createTask");
async function updateTask(request, env, user, taskId) {
  const body = await readJson(request);
  const { title, description, status, priority, due_date } = body;
  if (typeof title !== "string") {
    throw new HttpError(400, "Task title is required");
  }
  if (description != null && typeof description !== "string") {
    throw new HttpError(400, "Invalid task description");
  }
  if (status != null && typeof status !== "string") {
    throw new HttpError(400, "Invalid task status");
  }
  if (priority != null && typeof priority !== "string") {
    throw new HttpError(400, "Invalid task priority");
  }
  const cleanTitle = title.trim();
  const cleanDescription = typeof description === "string" ? description.trim() : null;
  const cleanStatus = typeof status === "string" && status.trim() ? status.trim() : "Pending";
  const cleanPriority = typeof priority === "string" && priority.trim() ? priority.trim() : "Medium";
  if (!cleanTitle) throw new HttpError(400, "Task title is required");
  if (cleanTitle.length > 255) throw new HttpError(400, "Task title is too long");
  if (cleanDescription !== null && cleanDescription.length > 1e4) {
    throw new HttpError(400, "Task description is too long");
  }
  if (cleanStatus.length > 50) throw new HttpError(400, "Task status is too long");
  if (cleanPriority.length > 50) throw new HttpError(400, "Task priority is too long");
  const result = await database(env).prepare(
    `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?,
           due_date = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`
  ).bind(
    cleanTitle,
    cleanDescription,
    cleanStatus,
    cleanPriority,
    normalizeDate(due_date),
    taskId,
    user.id
  ).run();
  if (result.meta.changes === 0) throw new HttpError(404, "Task not found");
  return reply(request, env, 200, "Task updated successfully");
}
__name(updateTask, "updateTask");
async function deleteTask(request, env, user, taskId) {
  const result = await database(env).prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").bind(taskId, user.id).run();
  if (result.meta.changes === 0) throw new HttpError(404, "Task not found");
  return reply(request, env, 200, "Task deleted successfully");
}
__name(deleteTask, "deleteTask");
async function submitFeedback(request, env, user) {
  const { rating, type, message: message2 } = await readJson(request);
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new HttpError(400, "Rating must be between 1 and 5.");
  }
  if (typeof type !== "string" || !type.trim()) {
    throw new HttpError(400, "Feedback type is required.");
  }
  if (type.trim().length > 100) {
    throw new HttpError(400, "Feedback type is too long.");
  }
  const cleanMessage = typeof message2 === "string" ? message2.trim() : "";
  if (cleanMessage.length < 5) {
    throw new HttpError(400, "Feedback must contain at least 5 characters.");
  }
  if (cleanMessage.length > 2e3) {
    throw new HttpError(400, "Feedback cannot exceed 2000 characters.");
  }
  await database(env).prepare("INSERT INTO feedback (user_id, rating, type, message) VALUES (?, ?, ?, ?)").bind(user.id, numericRating, type.trim(), cleanMessage).run();
  return json(request, env, {
    success: true,
    message: "Feedback submitted successfully."
  }, 201);
}
__name(submitFeedback, "submitFeedback");
async function requestEmailOtp(request, env, user) {
  const { newEmail: rawEmail } = await readJson(request);
  if (typeof rawEmail !== "string") {
    throw new HttpError(400, "New email is required");
  }
  const newEmail = rawEmail.trim().toLowerCase();
  if (!newEmail) throw new HttpError(400, "New email is required");
  if (newEmail.length > 100) throw new HttpError(400, "Email is too long");
  if (!isValidEmail(newEmail)) {
    throw new HttpError(400, "Please enter a valid email address");
  }
  const db = database(env);
  const currentUser = await db.prepare("SELECT id, email FROM users WHERE id = ?").bind(user.id).first();
  if (!currentUser) throw new HttpError(404, "User not found");
  if (currentUser.email === newEmail) {
    throw new HttpError(400, "This is already your current email");
  }
  const existing = await db.prepare("SELECT id FROM users WHERE email = ? AND id <> ?").bind(newEmail, user.id).first();
  if (existing) throw new HttpError(409, "This email is already registered");
  const otp = createOtp();
  const hashedOtp = await otpHash(otp, env);
  await db.prepare("DELETE FROM profile_email_otps WHERE user_id = ?").bind(user.id).run();
  const otpRecord = await db.prepare(
    `INSERT INTO profile_email_otps (user_id, new_email, otp_hash, expires_at)
       VALUES (?, ?, ?, ?)`
  ).bind(user.id, newEmail, hashedOtp, Math.floor(Date.now() / 1e3) + 600).run();
  try {
    await sendOtpEmail(newEmail, otp, env);
  } catch (error) {
    await db.prepare("DELETE FROM profile_email_otps WHERE id = ?").bind(otpRecord.meta.last_row_id).run();
    throw error;
  }
  return reply(
    request,
    env,
    200,
    "Verification code sent to your new email address"
  );
}
__name(requestEmailOtp, "requestEmailOtp");
async function updateFirebaseEmail(request, env, email) {
  if (!env.FIREBASE_API_KEY) {
    throw new Error("FIREBASE_API_KEY is not configured");
  }
  const authorization = request.headers.get("Authorization") ?? "";
  const idToken = authorization.slice("Bearer ".length);
  const updateUrl = new URL("https://identitytoolkit.googleapis.com/v1/accounts:update");
  updateUrl.searchParams.set("key", env.FIREBASE_API_KEY);
  const updateResponse = await fetch(updateUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken,
      email,
      returnSecureToken: true
    })
  });
  if (!updateResponse.ok) {
    throw new Error(`Firebase email update failed (${updateResponse.status})`);
  }
  const session = await updateResponse.json();
  if (typeof session.idToken !== "string" || typeof session.refreshToken !== "string") {
    throw new Error("Firebase returned an invalid email-update session");
  }
  const verifyUrl = new URL(
    "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode"
  );
  verifyUrl.searchParams.set("key", env.FIREBASE_API_KEY);
  const verifyResponse = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestType: "VERIFY_EMAIL",
      idToken: session.idToken
    })
  });
  if (!verifyResponse.ok) {
    throw new Error(`Firebase verification email failed (${verifyResponse.status})`);
  }
  return session;
}
__name(updateFirebaseEmail, "updateFirebaseEmail");
async function verifyEmailOtp(request, env, user) {
  const body = await readJson(request);
  let { newEmail, otp, name } = body;
  if (typeof newEmail !== "string" || typeof otp !== "string") {
    throw new HttpError(400, "Email and verification code are required");
  }
  newEmail = newEmail.trim().toLowerCase();
  otp = otp.trim();
  if (!isValidEmail(newEmail)) throw new HttpError(400, "Invalid email address");
  if (!/^\d{6}$/.test(otp)) {
    throw new HttpError(400, "Verification code must be 6 digits");
  }
  const db = database(env);
  const record = await db.prepare(
    `SELECT id, otp_hash, expires_at, attempts FROM profile_email_otps
       WHERE user_id = ? AND new_email = ? ORDER BY id DESC LIMIT 1`
  ).bind(user.id, newEmail).first();
  if (!record) {
    throw new HttpError(
      400,
      "Verification code not found. Please request a new code."
    );
  }
  if (record.expires_at < Math.floor(Date.now() / 1e3)) {
    await db.prepare("DELETE FROM profile_email_otps WHERE id = ?").bind(record.id).run();
    throw new HttpError(400, "Verification code has expired");
  }
  if (record.attempts >= 5) {
    throw new HttpError(
      429,
      "Too many incorrect attempts. Please request a new code."
    );
  }
  const suppliedHash = await otpHash(otp, env);
  if (!sameSecret(suppliedHash, record.otp_hash)) {
    await db.prepare(
      "UPDATE profile_email_otps SET attempts = attempts + 1 WHERE id = ? AND attempts < 5"
    ).bind(record.id).run();
    throw new HttpError(400, "Incorrect verification code");
  }
  const existing = await db.prepare("SELECT id FROM users WHERE email = ? AND id <> ?").bind(newEmail, user.id).first();
  if (existing) {
    await db.prepare("DELETE FROM profile_email_otps WHERE id = ?").bind(record.id).run();
    throw new HttpError(409, "This email is already registered");
  }
  const firebaseSession = await updateFirebaseEmail(request, env, newEmail);
  if (typeof name === "string") name = name.trim();
  if (!name) {
    const currentUser = await db.prepare("SELECT full_name FROM users WHERE id = ?").bind(user.id).first();
    if (!currentUser) throw new HttpError(404, "User not found");
    name = currentUser.full_name;
  }
  if (typeof name !== "string" || !name) {
    throw new HttpError(400, "Name is required");
  }
  if (name.length > 100) throw new HttpError(400, "Name is too long");
  const changes = await db.batch([
    db.prepare(
      `UPDATE users SET full_name = ?, email = ?
       WHERE id = ? AND EXISTS (
         SELECT id FROM profile_email_otps
         WHERE id = ? AND otp_hash = ? AND attempts < 5 AND expires_at >= ?
       )`
    ).bind(
      name,
      newEmail,
      user.id,
      record.id,
      suppliedHash,
      Math.floor(Date.now() / 1e3)
    ),
    db.prepare("DELETE FROM profile_email_otps WHERE user_id = ?").bind(user.id)
  ]);
  if (changes[0].meta.changes === 0) {
    throw new HttpError(400, "Verification code is no longer valid");
  }
  const updatedUser = await db.prepare(
    `SELECT id, full_name, email, plan, subscription_status,
              subscription_start, subscription_end
       FROM users WHERE id = ?`
  ).bind(user.id).first();
  if (!updatedUser) throw new HttpError(404, "User not found");
  return json(request, env, {
    success: true,
    message: "Email updated. Verify the new address using the email from Firebase.",
    token: firebaseSession.idToken,
    refreshToken: firebaseSession.refreshToken,
    user: userResponse(updatedUser)
  });
}
__name(verifyEmailOtp, "verifyEmailOtp");
async function route(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method.toUpperCase();
  if (method === "GET" && pathname === "/api/health") {
    return json(request, env, { status: "Server is running" });
  }
  if (method === "POST" && pathname === "/api/auth/session") {
    await rateLimitAuth(request, env);
    return syncFirebaseSession(request, env);
  }
  if (method === "POST" && pathname === "/api/auth/profile/request-email-otp") {
    await rateLimitAuth(request, env);
    return requestEmailOtp(request, env, await authenticate(request, env));
  }
  if (method === "POST" && pathname === "/api/auth/profile/verify-email-otp") {
    await rateLimitAuth(request, env);
    return verifyEmailOtp(request, env, await authenticate(request, env));
  }
  if (pathname === "/api/profile" && method === "GET") {
    return getProfile(request, env, await authenticate(request, env));
  }
  if (pathname === "/api/profile" && method === "PUT") {
    return updateProfile(request, env, await authenticate(request, env));
  }
  if (pathname === "/api/subscription" && method === "GET") {
    return getSubscription(request, env, await authenticate(request, env));
  }
  if (pathname === "/api/feedback" && method === "POST") {
    return submitFeedback(request, env, await authenticate(request, env));
  }
  if (pathname === "/api/tasks" && ["GET", "POST"].includes(method)) {
    const user = await authenticate(request, env);
    return method === "GET" ? getTasks(request, env, user, url) : createTask(request, env, user);
  }
  const taskMatch = pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (taskMatch && ["PUT", "DELETE"].includes(method)) {
    const taskId = Number(taskMatch[1]);
    if (!Number.isSafeInteger(taskId) || taskId < 1) {
      throw new HttpError(400, "Invalid task ID");
    }
    const user = await authenticate(request, env);
    return method === "PUT" ? updateTask(request, env, user, taskId) : deleteTask(request, env, user, taskId);
  }
  throw new HttpError(404, "Not found");
}
__name(route, "route");
var worker_default = {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (!isAllowedOrigin(origin, env)) {
      return json(request, env, { success: false, message: "Origin not allowed" }, 403);
    }
    if (request.method.toUpperCase() === "OPTIONS") {
      const headers = new Headers({
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin"
      });
      if (origin) headers.set("Access-Control-Allow-Origin", origin);
      return new Response(null, { status: 204, headers });
    }
    try {
      return await route(request, env);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply(request, env, error.status, error.message);
      }
      console.error("Worker request failed", error);
      return reply(request, env, 500, "Internal server error");
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
