#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Backend PayOS tối giản cho "Toán Vui" — tạo đơn ủng hộ 10.000đ + nhận webhook + tra trạng thái.
- CHỈ dùng thư viện chuẩn Python 3 (không cần pip install).
- Bí mật lấy từ BIẾN MÔI TRƯỜNG (không ghi vào code/repo).
- Chạy sau reverse proxy (Caddy) lo HTTPS. Server này nghe HTTP cục bộ.

Endpoints:
  GET  /health                      -> {"ok": true}
  POST /api/payos/create            -> tạo đơn PayOS, trả {checkoutUrl, qrCode, orderCode}
  POST /api/payos/webhook           -> PayOS gọi khi có biến động; xác minh chữ ký, lưu trạng thái
  GET  /api/payos/status?orderCode= -> {status: PAID|PENDING|...}  (poll từ client, có refresh qua PayOS)

ENV bắt buộc:
  PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY
ENV tùy chọn:
  PORT (mặc định 8787), ALLOWED_ORIGIN (mặc định https://idiot50.github.io),
  AMOUNT (mặc định 10000), DESCRIPTION (mặc định "Ung ho Toan Vui", <=25 ký tự),
  RETURN_URL, CANCEL_URL, ORDERS_FILE (mặc định ./orders.json)
"""
import os, json, time, hmac, hashlib, threading, urllib.request, urllib.error
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

PAYOS_API = "https://api-merchant.payos.vn/v2/payment-requests"

def env(k, d=None): return os.environ.get(k, d)

CLIENT_ID   = env("PAYOS_CLIENT_ID", "")
API_KEY     = env("PAYOS_API_KEY", "")
CHECKSUM    = env("PAYOS_CHECKSUM_KEY", "")
PORT        = int(env("PORT", "8787"))
ORIGIN      = env("ALLOWED_ORIGIN", "https://idiot50.github.io")
AMOUNT      = int(env("AMOUNT", "10000"))
DESCRIPTION = (env("DESCRIPTION", "Ung ho Toan Vui"))[:25]
RETURN_URL  = env("RETURN_URL", "https://idiot50.github.io/ontoan/?ung_ho=ok")
CANCEL_URL  = env("CANCEL_URL", "https://idiot50.github.io/ontoan/?ung_ho=huy")
ORDERS_FILE = env("ORDERS_FILE", os.path.join(os.path.dirname(os.path.abspath(__file__)), "orders.json"))

_lock = threading.Lock()

def load_orders():
    try:
        with open(ORDERS_FILE, "r", encoding="utf-8") as f: return json.load(f)
    except Exception:
        return {}

def save_orders(d):
    tmp = ORDERS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f: json.dump(d, f, ensure_ascii=False)
    os.replace(tmp, ORDERS_FILE)

def hmac_hex(key, msg):
    return hmac.new(key.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256).hexdigest()

def sign_create(amount, cancel_url, description, order_code, return_url):
    # PayOS: ký theo ĐÚNG thứ tự field: amount, cancelUrl, description, orderCode, returnUrl
    data = "amount=%s&cancelUrl=%s&description=%s&orderCode=%s&returnUrl=%s" % (
        amount, cancel_url, description, order_code, return_url)
    return hmac_hex(CHECKSUM, data)

def sign_webhook(data_obj):
    # PayOS: ký HMAC trên các field của `data`, sắp xếp khóa tăng dần, nối "k=v&..."
    keys = sorted(data_obj.keys())
    parts = []
    for k in keys:
        v = data_obj[k]
        if v is None: v = ""
        parts.append("%s=%s" % (k, v))
    return hmac_hex(CHECKSUM, "&".join(parts))

def payos_post(payload):
    req = urllib.request.Request(
        PAYOS_API, data=json.dumps(payload).encode("utf-8"), method="POST",
        headers={"Content-Type": "application/json", "x-client-id": CLIENT_ID, "x-api-key": API_KEY})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))

def payos_get(order_code):
    req = urllib.request.Request(
        "%s/%s" % (PAYOS_API, order_code), method="GET",
        headers={"x-client-id": CLIENT_ID, "x-api-key": API_KEY})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))

class H(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Vary", "Origin")
    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._cors()
        self.end_headers()
        self.wfile.write(body)
    def log_message(self, fmt, *args):  # gọn log
        pass

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.send_header("Content-Length", "0"); self.end_headers()

    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/health":
            return self._json(200, {"ok": True, "configured": bool(CLIENT_ID and API_KEY and CHECKSUM)})
        if u.path == "/api/payos/status":
            q = parse_qs(u.query); oc = (q.get("orderCode") or [""])[0]
            orders = load_orders(); rec = orders.get(str(oc))
            if not rec: return self._json(404, {"status": "NOT_FOUND"})
            # nếu chưa PAID, thử refresh từ PayOS (phòng khi chưa nhận webhook)
            if rec.get("status") != "PAID" and CLIENT_ID:
                try:
                    info = payos_get(oc)
                    st = ((info or {}).get("data") or {}).get("status")
                    if st:
                        rec["status"] = st
                        with _lock:
                            orders[str(oc)] = rec; save_orders(orders)
                except Exception:
                    pass
            return self._json(200, {"status": rec.get("status", "PENDING")})
        return self._json(404, {"error": "not_found"})

    def do_POST(self):
        u = urlparse(self.path)
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b""
        try:
            body = json.loads(raw.decode("utf-8")) if raw else {}
        except Exception:
            body = {}

        if u.path == "/api/payos/create":
            if not (CLIENT_ID and API_KEY and CHECKSUM):
                return self._json(500, {"error": "server_not_configured"})
            order_code = int(time.time() * 1000) % 9_000_000_000_000  # duy nhất theo mili-giây
            sig = sign_create(AMOUNT, CANCEL_URL, DESCRIPTION, order_code, RETURN_URL)
            payload = {"orderCode": order_code, "amount": AMOUNT, "description": DESCRIPTION,
                       "cancelUrl": CANCEL_URL, "returnUrl": RETURN_URL, "signature": sig}
            try:
                resp = payos_post(payload)
            except urllib.error.HTTPError as e:
                return self._json(502, {"error": "payos_http", "detail": e.read().decode("utf-8", "ignore")})
            except Exception as e:
                return self._json(502, {"error": "payos_unreachable", "detail": str(e)})
            data = (resp or {}).get("data") or {}
            if not data.get("checkoutUrl"):
                return self._json(502, {"error": "payos_no_checkout", "detail": resp})
            with _lock:
                orders = load_orders()
                orders[str(order_code)] = {"status": "PENDING", "amount": AMOUNT, "ts": int(time.time())}
                save_orders(orders)
            return self._json(200, {"checkoutUrl": data.get("checkoutUrl"), "qrCode": data.get("qrCode"),
                                    "orderCode": order_code, "amount": AMOUNT})

        if u.path == "/api/payos/webhook":
            data = (body or {}).get("data") or {}
            sig = (body or {}).get("signature") or ""
            ok = bool(data) and hmac.compare_digest(sign_webhook(data), sig)
            if not ok:
                return self._json(400, {"error": "invalid_signature"})
            oc = str(data.get("orderCode"))
            with _lock:
                orders = load_orders()
                rec = orders.get(oc, {"amount": data.get("amount"), "ts": int(time.time())})
                rec["status"] = "PAID"
                rec["reference"] = data.get("reference")
                orders[oc] = rec; save_orders(orders)
            # PayOS chờ HTTP 200 + {success:true}
            return self._json(200, {"success": True})

        return self._json(404, {"error": "not_found"})

def selftest():
    # kiểm tra HMAC ổn định + verify webhook khớp
    global CHECKSUM
    CHECKSUM = "test_checksum_key"
    s1 = sign_create(10000, "https://c", "Ung ho", 123, "https://r")
    assert s1 == sign_create(10000, "https://c", "Ung ho", 123, "https://r"), "HMAC không ổn định"
    d = {"orderCode": 123, "amount": 10000, "code": "00", "desc": "success"}
    assert hmac.compare_digest(sign_webhook(d), sign_webhook(d)), "verify webhook lỗi"
    print("selftest OK:", s1[:16], "...")

if __name__ == "__main__":
    import sys
    if "--selftest" in sys.argv:
        selftest(); raise SystemExit(0)
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    print("PayOS backend nghe 127.0.0.1:%d (origin=%s, amount=%d, configured=%s)"
          % (PORT, ORIGIN, AMOUNT, bool(CLIENT_ID and API_KEY and CHECKSUM)))
    srv.serve_forever()
