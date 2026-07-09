import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import logo from "../../assets/logo.jpeg";
import "./Login.css";

export default function Login({ onParentLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 950);
    return () => clearTimeout(timer);
  }, []);const handleLogin = async () => {
    setError("");
    setLoading(true);

    const loginValue = email.trim();
    const passwordValue = password.trim();

    try {
      // لو المستخدم كتب إيميل => دخول الإدارة
      if (loginValue.includes("@")) {
        await signInWithEmailAndPassword(
          auth,
          loginValue,
          passwordValue
        );
        return;
      }

      // غير كده اعتبره ولي أمر
      const q = query(
        collection(db, "students"),
        where("parentUsername", "==", loginValue),
        where("parentPassword", "==", passwordValue),
        limit(1)
      );

      const result = await getDocs(q);

      if (!result.empty) {
        const student = {
          id: result.docs[0].id,
          ...result.docs[0].data(),
        };

        onParentLogin(student);
        return;
      }

      setError("بيانات الدخول غير صحيحة");
    } catch (err) {
      setError("بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };return (
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

          <h3>مرحبًا بكم</h3>
          <p>سجل الدخول للمتابعة </p>

          <label>بيانات الدخول </label>

          <div className="input-box">
            <Mail size={22} />

            <input
              type="text"
              placeholder="اكتب  بيانات الدخول"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          </div>{error && (
            <p
              style={{
                color: "#c0392b",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
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
            <span>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </span>

            <LogIn size={22} />
          </button>

          <div className="rights">
            جميع الحقوق محفوظة © ويبقى الأثر
          </div>

        </div>
      </section>
    </main>
  );
}