import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  LogOut,
  UserRound,
} from "lucide-react";

import "./parentPortal.css";

export default function ParentPortal({ user, onLogout }) {
  const children = Array.isArray(user?.children)
    ? user.children
    : [];

  const [selectedChildId, setSelectedChildId] = useState("");

  useEffect(() => {
    if (children.length > 0) {
      setSelectedChildId((currentId) => {
        const childStillExists = children.some(
          (child) => child.id === currentId
        );

        return childStillExists
          ? currentId
          : children[0].id;
      });
    }
  }, [children]);

  const student =
    children.find(
      (child) => child.id === selectedChildId
    ) ||
    children[0] ||
    null;

  if (!student) {
    return (
      <main className="parent-portal" dir="rtl">
        <header className="parent-header">
          <div>
            <span>🌱 أكاديمية ويبقى الأثر</span>
            <h1>مرحبًا ولي الأمر</h1>
            <p>
              لا يوجد أطفال مرتبطون بهذا الحساب حاليًا.
            </p>
          </div>

          <button type="button" onClick={onLogout}>
            <LogOut size={19} />
            تسجيل الخروج
          </button>
        </header>
      </main>
    );
  }

  return (
    <main className="parent-portal" dir="rtl">
      <header className="parent-header">
        <div>
          <span>🌱 أكاديمية ويبقى الأثر</span>
          <h1>مرحبًا ولي الأمر</h1>
          <p>
            هنا تظهر فقط البيانات التي تنشرها الأكاديمية.
          </p>
        </div>

        <button type="button" onClick={onLogout}>
          <LogOut size={19} />
          تسجيل الخروج
        </button>
      </header>

      {children.length > 1 && (
        <section className="children-selector">
          <p>اختار الطفل لعرض بياناته:</p>

          <div className="children-buttons">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                className={
                  child.id === selectedChildId
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelectedChildId(child.id)
                }
              >
                {child.name || "اسم الطفل"}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="parent-student-card">
        <div className="parent-avatar">
          <UserRound size={34} />
        </div>

        <div>
          <h2>{student.name || "اسم الطالب"}</h2>

          <p>
            المستوى:{" "}
            {student.level || "غير محدد"}
          </p>

          <span>
            كود الطالب:{" "}
            {student.studentCode || "—"}
          </span>
        </div>
      </section>

      <section className="parent-grid">
        <ParentBox
          icon={CalendarDays}
          title="ملخص اليوم"
          value={
            student.todayUpdatePublished === true &&
              student.todayUpdate?.trim()
              ? student.todayUpdate
              : "لم تنشر الأكاديمية تحديث اليوم بعد"
          }
        />

      </section>
    </main>
  );
}

function ParentBox({ icon: Icon, title, value }) {
  return (
    <article className="parent-box">
      <span className="parent-box-icon">
        <Icon size={24} />
      </span>

      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}