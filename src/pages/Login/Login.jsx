import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, LogIn, Phone } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import './Login.css';

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 950);
    return () => clearTimeout(timer);
  }, []);

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

          <h3>مرحبًا بكم</h3>
          <p>سجلي الدخول للمتابعة</p>

          <label>رقم الهاتف</label>
          <div className="input-box">
            <Phone size={22} />
            <input type="tel" placeholder="010xxxxxxxx" defaultValue="01000000000" />
          </div>

          <label>كلمة المرور</label>
          <div className="input-box">
            <LockKeyhole size={22} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              defaultValue="12345678"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>

          <div className="login-options">
            <label className="remember-row">
              <input type="checkbox" />
              <span>تذكرني</span>
            </label>

            <button type="button" className="forgot-btn">
              نسيت كلمة المرور؟
            </button>
          </div>

          <button className="login-btn" onClick={onLogin}>
            <span>تسجيل الدخول</span>
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
