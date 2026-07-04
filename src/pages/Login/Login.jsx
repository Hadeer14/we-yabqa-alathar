import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, Phone } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import logo from "../../assets/logo.jpeg";
import "./Login.css";

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [phone, setPhone] = useState("01000000000");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 950);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

  try {
  const email = `${phone.trim()}@we-yabqa.local`;
  await signInWithEmailAndPassword(auth, email, password.trim());
  onLogin();
} catch (err) {
  setError("رقم الهاتف أو كلمة المرور غير صحيحة");
} finally {
  setLoading(false);
}
  };

  return (
    <main className="login-page" dir="rtl">
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-logo-wrap">
            <img src={logo} alt="أكاديمية ويبقى الأثر" />
          </div>
        </div>
      )}

      <section className="brand-panel">
        <div className="soft-leaf leaf-one" />
        <div className="soft-leaf leaf-two" />

        <div className="main-logo-circle">
          <img src={logo} alt="أكاديمية ويبقى الأثر" />
        </div>

        <h1>أكاديمية</h1>
        <h2>ويبقى الأثر</h2>

        <div className="line-leaf">
          <span />
          <b>🌱</b>
          <span />
        </div>

        <p>نغرس القيم... ويبقى الأثر</p>

        <div className="bottom-plants">
          <span className="plant plant-a" />
          <span className="plant plant-b" />
          <span className="plant plant-c" />
        </div>

        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
      </section>

      <section className="form-panel">
        <div className="login-card">
          <div className="card-icon">🌱</div>

          <h3>مرحبا بكم</h3>
          <p>سجلي الدخول للمتابعة</p>

          <label>رقم الهاتف</label>
          <div className="input-box">
            <Phone size={22} />
            <input
              type="tel"
              placeholder="010xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <label>كلمة المرور</label>
          <div className="input-box">
            <LockKeyhole size={22} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <div className="login-options">
            <label className="remember-row">
              <input type="checkbox" />
              <span>تذكرني</span>
            </label>

            <button type="button" className="forgot-btn">
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            <span>{loading ? "جاري الدخول..." : "تسجيل الدخول"}</span>
            <LogIn size={22} />
          </button>

          <div className="rights">جميع الحقوق محفوظة © ويبقى الأثر</div>
        </div>
      </section>
    </main>
  );
}