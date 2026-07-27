// Shared HTTP client for the verified-content APIs (QuranEnc / HadeethEnc).
//
// Built on axios (already a project dependency). Adds, per spec:
//  - request timeout
//  - retry policy (network failures + 5xx only, limited; never retry 4xx)
//  - response validation hook (caller-provided)
//  - network / invalid-response error normalization
//  - cancellation for abandoned requests (AbortController)
//  - duplicate request prevention (in-flight de-duplication)
//
// No API secrets are used or stored (both APIs are public, key-free).

import axios from "axios";
import { NETWORK_CONFIG } from "../config/religiousContent";

export const ApiErrorCodes = {
  NETWORK: "NETWORK", // no connection / DNS / abort-less failure
  TIMEOUT: "TIMEOUT",
  CLIENT: "CLIENT", // 4xx — permanent, not retried
  SERVER: "SERVER", // 5xx — retried up to maxRetries
  INVALID: "INVALID", // response failed validation
  CANCELLED: "CANCELLED", // request aborted by caller
};

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message || code);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
  /** true when the failure is worth showing cached/offline content for */
  get isOffline() {
    return this.code === ApiErrorCodes.NETWORK || this.code === ApiErrorCodes.TIMEOUT;
  }
}

/**
 * Create an axios instance for a base URL.
 * @param {string} baseURL
 */
export const createClient = (baseURL) =>
  axios.create({
    baseURL,
    timeout: NETWORK_CONFIG.timeoutMs,
    headers: { Accept: "application/json" },
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Map an axios failure to a normalized ApiError. */
const toApiError = (err) => {
  if (axios.isCancel && axios.isCancel(err)) {
    return new ApiError(ApiErrorCodes.CANCELLED, "cancelled");
  }
  if (err?.code === "ERR_CANCELED") {
    return new ApiError(ApiErrorCodes.CANCELLED, "cancelled");
  }
  if (err?.code === "ECONNABORTED") {
    return new ApiError(ApiErrorCodes.TIMEOUT, "timeout");
  }
  const status = err?.response?.status;
  if (status) {
    if (status >= 500) return new ApiError(ApiErrorCodes.SERVER, `server ${status}`, status);
    return new ApiError(ApiErrorCodes.CLIENT, `client ${status}`, status);
  }
  // No response at all → treat as a network/offline failure.
  return new ApiError(ApiErrorCodes.NETWORK, err?.message || "network error");
};

const inFlight = new Map();

/**
 * Perform a GET with retry, validation, cancellation and de-duplication.
 *
 * @param {import('axios').AxiosInstance} client
 * @param {string} url
 * @param {Object} [opts]
 * @param {Object} [opts.params]
 * @param {(data:any)=>boolean} [opts.validate] return false to reject as INVALID
 * @param {AbortSignal} [opts.signal] caller cancellation
 * @param {number} [opts.retries] override retry count
 * @param {string} [opts.dedupeKey] set to de-duplicate identical concurrent GETs
 * @returns {Promise<any>} response data
 */
export const getJson = async (client, url, opts = {}) => {
  const {
    params,
    validate,
    signal,
    retries = NETWORK_CONFIG.maxRetries,
    dedupeKey,
  } = opts;

  // Duplicate request prevention: share the promise of an identical in-flight
  // GET (only when a dedupeKey is supplied and the caller isn't cancelling).
  if (dedupeKey && inFlight.has(dedupeKey)) {
    return inFlight.get(dedupeKey);
  }

  const run = (async () => {
    let attempt = 0;
    // total tries = 1 + retries
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const res = await client.get(url, { params, signal });
        if (validate && !validate(res.data)) {
          throw new ApiError(ApiErrorCodes.INVALID, "invalid response");
        }
        return res.data;
      } catch (raw) {
        const apiErr = raw instanceof ApiError ? raw : toApiError(raw);
        const retryable =
          apiErr.code === ApiErrorCodes.NETWORK ||
          apiErr.code === ApiErrorCodes.TIMEOUT ||
          apiErr.code === ApiErrorCodes.SERVER;
        // Never retry 4xx, INVALID, or CANCELLED.
        if (!retryable || attempt >= retries) throw apiErr;
        attempt += 1;
        await sleep(NETWORK_CONFIG.retryBaseDelayMs * attempt);
      }
    }
  })();

  if (dedupeKey) {
    inFlight.set(dedupeKey, run);
    try {
      return await run;
    } finally {
      inFlight.delete(dedupeKey);
    }
  }
  return run;
};
