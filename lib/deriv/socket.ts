/**
 * Thin client for Deriv's trading WebSocket API (v3).
 * Endpoint and shape verified against developers.deriv.com (Aug 2026):
 *   wss://ws.derivws.com/websockets/v3?app_id={DERIV_APP_ID}
 *
 * Design notes:
 * - One shared connection per browser tab (see session-context.tsx), not
 *   one per component — spec section 53 explicitly forbids unnecessary
 *   extra Deriv WebSocket connections.
 * - Every request gets a req_id so responses can be correlated even when
 *   several calls are in flight (subscriptions + one-off requests mixed).
 * - Reconnects with exponential backoff and re-authorizes + re-subscribes
 *   automatically so callers don't have to handle drops themselves.
 */

export type DerivMessage = Record<string, any>;
type Listener = (msg: DerivMessage) => void;

export type SocketState = "idle" | "connecting" | "open" | "reconnecting" | "closed";

export class DerivSocket {
  private ws: WebSocket | null = null;
  private appId: string;
  private endpoint: string;
  private reqId = 1;
  private pending = new Map<number, { resolve: (v: DerivMessage) => void; reject: (e: Error) => void }>();
  private subscribers = new Map<string, Set<Listener>>(); // keyed by msg_type
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;
  private authToken: string | null = null;
  private activeSubscriptions: DerivMessage[] = []; // requests to replay after reconnect
  private stateListeners = new Set<(s: SocketState) => void>();
  private _state: SocketState = "idle";

  constructor(appId: string, endpoint = "wss://ws.derivws.com/websockets/v3") {
    this.appId = appId;
    this.endpoint = endpoint;
  }

  get state() {
    return this._state;
  }

  onStateChange(cb: (s: SocketState) => void): () => void {
    this.stateListeners.add(cb);
    return () => this.stateListeners.delete(cb);
  }

  private setState(s: SocketState) {
    this._state = s;
    this.stateListeners.forEach((cb) => cb(s));
  }

  connect(): Promise<void> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve();
    }
    this.shouldReconnect = true;
    this.setState(this.reconnectAttempt > 0 ? "reconnecting" : "connecting");

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${this.endpoint}?app_id=${encodeURIComponent(this.appId)}`);
      this.ws = ws;

      ws.onopen = async () => {
        this.reconnectAttempt = 0;
        this.setState("open");
        this.startPing();
        if (this.authToken) {
          try {
            await this.authorize(this.authToken);
          } catch {
            // surfaced to caller via authorize() promise on next explicit call
          }
        }
        for (const req of this.activeSubscriptions) {
          this.send(req).catch(() => {});
        }
        resolve();
      };

      ws.onmessage = (event) => {
        let msg: DerivMessage;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        if (typeof msg.req_id === "number" && this.pending.has(msg.req_id)) {
          const { resolve: res, reject: rej } = this.pending.get(msg.req_id)!;
          this.pending.delete(msg.req_id);
          if (msg.error) rej(new Error(msg.error.message ?? "Deriv API error"));
          else res(msg);
        }
        if (msg.msg_type) {
          this.subscribers.get(msg.msg_type)?.forEach((cb) => cb(msg));
        }
      };

      ws.onerror = () => {
        reject(new Error("Deriv WebSocket connection error"));
      };

      ws.onclose = () => {
        this.stopPing();
        this.setState("closed");
        if (this.shouldReconnect) this.scheduleReconnect();
      };
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(30000, 1000 * 2 ** this.reconnectAttempt);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(() => {});
    }, delay);
  }

  private startPing() {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      this.send({ ping: 1 }).catch(() => {});
    }, 30000);
  }

  private stopPing() {
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.pingTimer = null;
  }

  send(payload: DerivMessage, opts: { trackSubscription?: boolean } = {}): Promise<DerivMessage> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("Deriv WebSocket is not connected"));
    }
    const req_id = this.reqId++;
    const body = { ...payload, req_id };
    if (opts.trackSubscription) this.activeSubscriptions.push(body);
    return new Promise((resolve, reject) => {
      this.pending.set(req_id, { resolve, reject });
      this.ws!.send(JSON.stringify(body));
      setTimeout(() => {
        if (this.pending.has(req_id)) {
          this.pending.delete(req_id);
          reject(new Error("Deriv API request timed out"));
        }
      }, 15000);
    });
  }

  async authorize(token: string): Promise<DerivMessage> {
    this.authToken = token;
    return this.send({ authorize: token });
  }

  /** Subscribe to a msg_type (e.g. "tick", "balance", "proposal_open_contract"). */
  on(msgType: string, cb: Listener): () => void {
    if (!this.subscribers.has(msgType)) this.subscribers.set(msgType, new Set());
    this.subscribers.get(msgType)!.add(cb);
    return () => this.subscribers.get(msgType)?.delete(cb);
  }

  async subscribeTicks(symbol: string): Promise<DerivMessage> {
    return this.send({ ticks: symbol, subscribe: 1 }, { trackSubscription: true });
  }

  async forget(id: string): Promise<DerivMessage> {
    return this.send({ forget: id });
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.stopPing();
    this.ws?.close();
    this.ws = null;
    this.authToken = null;
    this.activeSubscriptions = [];
    this.setState("idle");
  }
}
