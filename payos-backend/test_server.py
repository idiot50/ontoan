#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test tích hợp CỤC BỘ cho server.py — KHÔNG cần khóa PayOS thật, KHÔNG gọi mạng ra ngoài.
Dựng server trong tiến trình (cổng cục bộ) rồi gọi HTTP thật để kiểm:
  - GET  /health                 -> 200, configured=true
  - OPTIONS (CORS preflight)     -> 204 + Access-Control-Allow-Origin đúng
  - POST /api/payos/webhook      -> chữ ký ĐÚNG: 200 {success:true}; chữ ký SAI: 400
  - GET  /api/payos/status       -> sau webhook hợp lệ trả PAID; orderCode lạ -> 404
Chạy:  py test_server.py
"""
import os, sys, json, time, threading, tempfile, urllib.request, urllib.error, hashlib, hmac

try:  # console Windows mặc định cp1252 -> ép UTF-8 để in được chữ Việt
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

# --- Cấu hình ENV TEST trước khi import server (server đọc env lúc import) ---
TMP = tempfile.mkdtemp(prefix="payos_test_")
TEST_CHECKSUM = "test_checksum_key"
os.environ["PAYOS_CLIENT_ID"]   = "test_client"
os.environ["PAYOS_API_KEY"]     = "test_api"
os.environ["PAYOS_CHECKSUM_KEY"] = TEST_CHECKSUM
os.environ["PORT"]              = "8799"
os.environ["ALLOWED_ORIGIN"]    = "https://idiot50.github.io"
os.environ["PAY_ERROR_URL"]     = "https://idiot50.github.io/ontoan/?ung_ho=loi"
os.environ["ORDERS_FILE"]       = os.path.join(TMP, "orders.json")

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import server  # noqa: E402
from http.server import ThreadingHTTPServer  # noqa: E402

BASE = "http://127.0.0.1:%d" % server.PORT
_passed = 0
_failed = 0

def check(name, cond, extra=""):
    global _passed, _failed
    if cond:
        _passed += 1; print("  PASS  -", name)
    else:
        _failed += 1; print("  FAIL  -", name, ("(%s)" % extra) if extra else "")

def req(method, path, body=None, headers=None):
    url = BASE + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    r = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(r, timeout=10) as resp:
            return resp.status, dict(resp.headers), resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode("utf-8")

# Opener KHÔNG đi theo 302 -> để soi mã + Location của /pay
class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
_no_redirect = urllib.request.build_opener(_NoRedirect)

def req_noredirect(method, path):
    r = urllib.request.Request(BASE + path, method=method)
    try:
        with _no_redirect.open(r, timeout=10) as resp:
            return resp.status, dict(resp.headers), resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode("utf-8")

def webhook_sig_independent(data_obj):
    # Tính chữ ký theo ĐÚNG thuật toán tài liệu PayOS, độc lập với server.sign_webhook
    keys = sorted(data_obj.keys())
    parts = ["%s=%s" % (k, ("" if data_obj[k] is None else data_obj[k])) for k in keys]
    msg = "&".join(parts)
    return hmac.new(TEST_CHECKSUM.encode(), msg.encode(), hashlib.sha256).hexdigest()

def main():
    srv = ThreadingHTTPServer(("127.0.0.1", server.PORT), server.H)
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    time.sleep(0.3)
    try:
        # 1) health
        st, _, body = req("GET", "/health")
        j = json.loads(body)
        check("GET /health -> 200", st == 200, "status=%s" % st)
        check("health.ok == true", j.get("ok") is True)
        check("health.configured == true", j.get("configured") is True, body)

        # 2) CORS preflight
        st, hd, _ = req("OPTIONS", "/api/payos/create",
                        headers={"Origin": "https://idiot50.github.io",
                                 "Access-Control-Request-Method": "POST"})
        check("OPTIONS preflight -> 204", st == 204, "status=%s" % st)
        check("CORS allow-origin đúng",
              hd.get("Access-Control-Allow-Origin") == "https://idiot50.github.io",
              hd.get("Access-Control-Allow-Origin"))

        # 3) status orderCode lạ -> 404
        st, _, body = req("GET", "/api/payos/status?orderCode=999999")
        check("status orderCode lạ -> 404", st == 404, "status=%s" % st)

        # 4) webhook chữ ký SAI -> 400
        data = {"orderCode": 12345, "amount": 10000, "code": "00", "desc": "success",
                "reference": "TESTREF"}
        st, _, body = req("POST", "/api/payos/webhook",
                          body={"data": data, "signature": "deadbeef_sai"})
        check("webhook chữ ký SAI -> 400", st == 400, "status=%s body=%s" % (st, body))

        # 5) round-trip: thuật toán độc lập == server.sign_webhook
        indep = webhook_sig_independent(data)
        check("sign_webhook khớp thuật toán tài liệu",
              indep == server.sign_webhook(data), "indep=%s srv=%s" % (indep[:12], server.sign_webhook(data)[:12]))

        # 6) webhook chữ ký ĐÚNG -> 200 success:true
        st, _, body = req("POST", "/api/payos/webhook",
                          body={"data": data, "signature": indep})
        j = json.loads(body)
        check("webhook chữ ký ĐÚNG -> 200", st == 200, "status=%s body=%s" % (st, body))
        check("webhook trả success:true", j.get("success") is True, body)

        # 7) sau webhook hợp lệ, status order = PAID (đọc từ file, không gọi mạng vì đã PAID)
        st, _, body = req("GET", "/api/payos/status?orderCode=12345")
        j = json.loads(body)
        check("status sau webhook -> 200", st == 200, "status=%s" % st)
        check("trạng thái order == PAID", j.get("status") == "PAID", body)

        # 8) đảm bảo đã ghi xuống ORDERS_FILE
        with open(os.environ["ORDERS_FILE"], "r", encoding="utf-8") as f:
            saved = json.load(f)
        check("order được lưu vào file", saved.get("12345", {}).get("status") == "PAID", json.dumps(saved))

        # --- /api/payos/pay (giả lập PayOS, KHÔNG gọi mạng thật) ---
        orig_post = server.payos_post

        # 9) PayOS lỗi -> /pay chuyển hướng tới PAY_ERROR_URL
        def boom(payload):
            raise RuntimeError("payos down (giả lập)")
        server.payos_post = boom
        st, hd, _ = req_noredirect("GET", "/api/payos/pay")
        check("/pay khi PayOS lỗi -> 302", st == 302, "status=%s" % st)
        check("/pay lỗi -> Location = PAY_ERROR_URL",
              hd.get("Location") == os.environ["PAY_ERROR_URL"], hd.get("Location"))

        # 10) PayOS OK -> /pay chuyển hướng tới checkoutUrl + lưu order PENDING
        FAKE_CHECKOUT = "https://pay.payos.vn/web/FAKE_CHECKOUT_123"
        def good(payload):
            return {"data": {"checkoutUrl": FAKE_CHECKOUT, "qrCode": "QRFAKE"}}
        server.payos_post = good
        st, hd, _ = req_noredirect("GET", "/api/payos/pay")
        check("/pay khi PayOS OK -> 302", st == 302, "status=%s" % st)
        check("/pay OK -> Location = checkoutUrl", hd.get("Location") == FAKE_CHECKOUT, hd.get("Location"))
        with open(os.environ["ORDERS_FILE"], "r", encoding="utf-8") as f:
            saved2 = json.load(f)
        pending = [v for v in saved2.values() if v.get("status") == "PENDING"]
        check("/pay tạo order PENDING trong file", len(pending) >= 1, json.dumps(saved2))

        # 11) số tiền ủng hộ NGẪU NHIÊN nằm trong [20000, 200000] & tròn nghìn
        amts = [v.get("amount") for v in pending]
        in_range = all(isinstance(a, int) and 20000 <= a <= 200000 and a % 1000 == 0 for a in amts)
        check("/pay: số tiền ngẫu nhiên 20k–200k, tròn nghìn", in_range, str(amts))

        # 12) random_amount() lặp nhiều lần luôn trong khoảng + tròn nghìn
        rs = [server.random_amount() for _ in range(200)]
        check("random_amount() luôn trong [20000,200000] & tròn nghìn",
              all(20000 <= r <= 200000 and r % 1000 == 0 for r in rs),
              "min=%s max=%s" % (min(rs), max(rs)))

        server.payos_post = orig_post
    finally:
        srv.shutdown()

    print("\n=== KẾT QUẢ: %d PASS, %d FAIL ===" % (_passed, _failed))
    sys.exit(1 if _failed else 0)

if __name__ == "__main__":
    main()
