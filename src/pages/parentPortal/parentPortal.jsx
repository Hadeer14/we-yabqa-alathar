import React from 'react';
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Bell,
  WalletCards,
  UserRound
} from 'lucide-react';
import './parentPortal.css';

export default function parentPortal({ user, onLogout }) {
  const student = user?.student || {};

  return (
    <main className="parent-portal" dir="rtl">
      <header className="parent-header">
        <div>
          <span>أكاديمية ويبقى الأثر 🌱</span>
          <h1>مرحبًا ولي الأمر</h1>
          <p>هنا تظهر بيانات ابنكم فقط.</p>
        </div>

        <button type="button" onClick={onLogout}>
          تسجيل الخروج
        </button>
      </header>

      <section className="parent-student-card">
        <div className="parent-avatar">
          <UserRound size={34} />
        </div>

        <div>
          <h2>{student.name || 'اسم الطالب'}</h2>
          <p>{student.level || 'المستوى غير محدد'}</p>
          <span>كود الطالب: {student.studentCode || '—'}</span>
        </div>
      </section>

      <section className="parent-grid">
        <ParentBox icon={CalendarDays} title="الحضور" value="لم يتم تسجيل حضور بعد" />
        <ParentBox icon={WalletCards} title="الاشتراك" value="بيانات الاشتراك ستظهر هنا" />
        <ParentBox icon={ClipboardList} title="الخطة" value="الخطة الأسبوعية ستظهر هنا" />
        <ParentBox icon={FileText} title="التقارير" value="لا توجد تقارير حاليًا" />
        <ParentBox icon={Bell} title="التنبيهات" value="لا توجد تنبيهات" />
      </section>
    </main>
  );
}

function ParentBox({ icon: Icon, title, value }) {
  return (
    <article className="parent-box">
      <span><Icon size={24} /></span>
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}