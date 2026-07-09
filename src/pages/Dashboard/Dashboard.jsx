import React, { useEffect, useState } from 'react';
import {
  Bell, Bot, CalendarDays, Camera, ChevronLeft, ClipboardList, CreditCard,
  FileText, GraduationCap, LayoutDashboard, MessageCircle, Plus, Search,
  Settings, Sparkles, UserRound, Users, BookOpen, Archive, AlertTriangle,
  WalletCards, X, Gamepad2, CheckCircle2, Clock3, Receipt, Send, Upload, Image as ImageIcon, ShieldCheck, UserPlus, Edit3, Save, Copy, Megaphone, Phone, Mail, Lock, Palette, LogOut
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import './Dashboard.css';
import Students from '../Students/Students.jsx';
import Plans from '../Plans/Plans.jsx';
import Programs from '../Programs/Programs.jsx';
import Activities from '../Activities/Activities.jsx';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";

const navItems = [
  { id: 'home', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'children', label: 'الأطفال', icon: Users },
  { id: 'programs', label: 'البرامج والمسارات', icon: BookOpen },
  { id: 'attendance', label: 'الحضور والدفع', icon: CalendarDays },
  { id: 'plans', label: 'المحتوى والخطط', icon: ClipboardList },
  { id: 'activities', label: 'الأنشطة والألعاب', icon: Gamepad2 },
  { id: 'reports', label: 'التقارير', icon: FileText },
  { id: 'photos', label: 'الصور', icon: Camera },
  { id: 'teachers', label: 'المعلمات', icon: GraduationCap },
  { id: 'ai', label: 'مساعد AI', icon: Bot },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];



const alerts = [
  {
    title: 'محمد أحمد غائب اليوم',
    desc: 'يمكن إرسال رسالة اطمئنان لولي الأمر.',
    action: 'إرسال رسالة',
    icon: MessageCircle,
    message: 'السلام عليكم، نحب نطمئن على محمد أحمد لأنه لم يحضر اليوم. إن شاء الله يكون بخير وننتظر حضوره قريبًا 🌱'
  },
  {
    title: 'فاطمة وصلت إلى 8 حصص',
    desc: 'مطلوب تذكير ولي الأمر بتجديد الاشتراك.',
    action: 'تذكير بالدفع',
    icon: CreditCard,
    message: 'السلام عليكم، نذكركم أن اشتراك فاطمة وصل إلى 8 حصص، برجاء تجديد الاشتراك. أكاديمية ويبقى الأثر 🌱'
  },
  {
    title: '3 تقارير ناقصة',
    desc: 'تقارير اليوم لم تُرسل بعد لبعض الأطفال.',
    action: 'كتابة التقارير',
    icon: FileText,
    page: 'reports'
  },
];

const weeklyPlan = [
  { title: 'الحفظ', value: 'مراجعة سورة الضحى' },
  { title: 'التفسير', value: 'معاني الرحمة' },
  { title: 'السيرة', value: 'خلق الصدق' },
  { title: 'النشاط', value: 'لوحة شجرة القيم' },
];

const attendanceRows = [
  { name: 'محمد أحمد', program: 'حلقة القرآن', status: 'حاضر', payment: 'ساري', sessions: '6 / 8' },
  { name: 'فاطمة علي', program: 'كامب الصيف', status: 'حاضر', payment: 'يحتاج تجديد', sessions: '8 / 8' },
  { name: 'يوسف خالد', program: 'حلقة القراءة', status: 'غائب', payment: 'ساري', sessions: '3 / 8' },
  { name: 'ليان محمود', program: 'كامب الصيف', status: 'متأخر', payment: 'متأخر', sessions: '9 / 8' },
];

const reportRows = [
  { child: 'محمد أحمد', title: 'تقرير الحفظ اليومي', status: 'جاهز', summary: 'راجع سورة الضحى واحتاج دعم بسيط في آخر آيتين.' },
  { child: 'فاطمة علي', title: 'تقرير الكامب', status: 'مسودة', summary: 'مشاركة ممتازة في السيرة والنشاط الفني.' },
  { child: 'يوسف خالد', title: 'تقرير الغياب', status: 'ينتظر إرسال', summary: 'غائب اليوم، رسالة اطمئنان جاهزة.' },
];

const photoAlbums = [
  { title: 'نشاط الألوان', count: 18, date: 'اليوم', cover: '🎨' },
  { title: 'حلقة القرآن', count: 9, date: 'أمس', cover: '📖' },
  { title: 'ألعاب الكامب', count: 24, date: 'هذا الأسبوع', cover: '🎮' },
  { title: 'الكروشيه', count: 12, date: 'هذا الأسبوع', cover: '🧶' },
];

const teachers = [
  { name: 'أ. سارة محمد', role: 'معلمة قرآن', classes: 'حلقة 1، حلقة 2', tasks: 12, done: 10 },
  { name: 'أ. مريم خالد', role: 'مشرفة الكامب', classes: 'كامب الصيف', tasks: 18, done: 15 },
  { name: 'أ. نور أحمد', role: 'أنشطة وفنون', classes: 'ألوان، كروشيه', tasks: 9, done: 8 },
];


export default function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('home');
  const [message, setMessage] = useState('');
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const activeStudents = students.filter((s) => s.status === "active").length;

  const paymentNeeded = students.reduce((total, student) => {
    return total + (student.subscriptions || []).filter((sub) => {
      return Number(sub.usedUnits || 0) >= Number(sub.unitLimit || 0);
    }).length;
  }, 0);

  const stats = [
    { label: "الأطفال النشطين", value: activeStudents, icon: Users, tone: "green" },
    { label: "البرامج النشطة", value: "—", icon: BookOpen, tone: "gold" },
    { label: "غياب اليوم", value: "—", icon: AlertTriangle, tone: "red" },
    { label: "تجديدات مطلوبة", value: paymentNeeded, icon: WalletCards, tone: "blue" },
  ];

  function handleAlert(alert) {
    if (alert.message) {
      setMessage(alert.message);
      return;
    }

    if (alert.page) {
      setActivePage(alert.page);
    }
  }

  return (
    <main className="dashboard-shell" dir="rtl">
      <aside className="floating-sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="ويبقى الأثر" />
          <div><b>ويبقى الأثر</b><span>لوحة الإدارة</span></div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button type="button" key={item.id} className={activePage === item.id ? 'active' : ''} onClick={() => setActivePage(item.id)}>
                <span className="nav-icon"><Icon size={20} /></span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}

        >
          <span className="nav-icon">
            <LogOut size={20} />

          </span>
          <span>
            تسجيل الخروج
          </span>



        </button>



        <div className="ai-mini-card">
          <Sparkles size={22} />
          <b>مساعد AI</b>
          <p>اكتبي خطة، تقرير، نشاط أو رسالة.</p>
          <button type="button" onClick={() => setActivePage('ai')}>افتحي المساعد</button>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <span className="page-kicker">أكاديمية ويبقى الأثر 🌱</span>
            <h1>{activePage === 'home' ? 'صباح الخير' : getPageTitle(activePage)}</h1>
            <p>{activePage === 'home' ? 'كل ما تحتاجينه اليوم في مكان واحد.' : activePage === 'plans' ? 'إدارة الخطة اليومية، قوالب الكامب، مكتبة التوبكس، ومعاينة ولي الأمر.' : 'هذه الصفحة سيتم بناؤها في Sprint مستقل.'}</p>
          </div>

          <div className="top-actions">
            <div className="search-pill"><Search size={18} /><input placeholder="بحث سريع..." /></div>
            <button type="button" className="icon-btn" onClick={() => setShowAllAlerts(true)}><Bell size={20} /></button>
            <button type="button" className="profile-btn" onClick={() => setActivePage('settings')}><UserRound size={20} />الإدارة</button>
          </div>
        </header>

        {activePage === 'home' ? (
          <HomeDashboard
            setActivePage={setActivePage}
            setMessage={setMessage}
            setShowAllAlerts={setShowAllAlerts}
            handleAlert={handleAlert}
          />
        ) : activePage === 'children' ? (
          <Students />
        ) : activePage === 'plans' ? (
          <Plans />
        ) : activePage === 'programs' ? (
          <Programs />
        ) : activePage === 'activities' ? (
          <Activities />
        ) : activePage === 'attendance' ? (
          <AttendancePayments />
        ) : activePage === 'reports' ? (
          <ReportsCenter />
        ) : activePage === 'photos' ? (
          <PhotosGallery />
        ) : activePage === 'teachers' ? (
          <TeachersManagement />
        ) : activePage === 'ai' ? (
          <AIAssistant setMessage={setMessage} />
        ) : activePage === 'settings' ? (
          <SettingsPage />
        ) : (
          <ComingSoon activePage={activePage} />
        )}
      </section>

      {message && (
        <div className="dashboard-message">
          <button type="button" onClick={() => setMessage('')}><X size={18} /></button>
          <h3>رسالة جاهزة</h3>
          <p>{message}</p>
          <div className="message-actions">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(message);
                alert('تم نسخ الرسالة');
              }}
            >
              نسخ الرسالة
            </button>

            <button
              type="button"
              onClick={() => {
                const phone = prompt('اكتبي رقم الواتساب بصيغة دولية مثال: +201012345678');

                if (!phone) {
                  alert('لم يتم إدخال رقم');
                  return;
                }

                const cleanPhone = phone.replace(/[^\d]/g, '');
                const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

                window.open(url, '_blank');
              }}
            >
              فتح واتساب
            </button>

          </div>
        </div>
      )}

      {showAllAlerts && (
        <div className="dashboard-modal-backdrop">
          <div className="dashboard-alerts-modal">
            <button type="button" className="modal-x" onClick={() => setShowAllAlerts(false)}><X size={20} /></button>
            <h3>كل التنبيهات</h3>
            <p>هنا تظهر الغيابات، الدفع، والتقارير الناقصة.</p>

            <div className="alerts-list">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <article className="alert-row" key={alert.title}>
                    <div className="alert-icon"><Icon size={20} /></div>
                    <div><b>{alert.title}</b><p>{alert.desc}</p></div>
                    <button type="button" onClick={() => handleAlert(alert)}>
                      {alert.action}<ChevronLeft size={17} />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function HomeDashboard({ setActivePage, handleAlert, setShowAllAlerts }) {
  return (
    <div className="home-grid">
      <section className="hero-dashboard-card">
        <div>
          <span className="hero-badge"><Sparkles size={16} /> منصة ويبقى الأثر</span>
          <h2>إدارة الأطفال، البرامج، الحضور، الدفع، التقارير والخطط بسهولة.</h2>
          <p>النظام معمول عشان كل حاجة مهمة تظهر قدامك من غير تدوير.</p>
        </div>
        <button type="button" className="hero-btn" onClick={() => setActivePage('children')}><Plus size={19} />إضافة طفل</button>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="attention-card">
        <div className="section-head">
          <div><h3>يحتاج انتباهك اليوم</h3><p>غياب، دفع، وتقارير ناقصة.</p></div>
          <button type="button" className="soft-btn" onClick={() => setShowAllAlerts(true)}>عرض الكل</button>
        </div>

        <div className="alerts-list">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <article className="alert-row" key={alert.title}>
                <div className="alert-icon"><Icon size={20} /></div>
                <div><b>{alert.title}</b><p>{alert.desc}</p></div>
                <button type="button" onClick={() => handleAlert(alert)}>
                  {alert.action}<ChevronLeft size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="week-card">
        <div className="section-head">
          <div><h3>خطة الأسبوع</h3><p>ما سيظهر لولي الأمر هذا الأسبوع.</p></div>
          <button type="button" className="soft-btn" onClick={() => setActivePage('plans')}>تعديل الخطة</button>
        </div>

        <div className="plan-list">
          {weeklyPlan.map((item) => (
            <div className="plan-item" key={item.title}><span>{item.title}</span><b>{item.value}</b></div>
          ))}
        </div>
      </section>

      <section className="quick-actions-card">
        <div className="section-head"><div><h3>اختصارات سريعة</h3><p>أهم العمليات اليومية.</p></div></div>
        <div className="quick-actions-grid">
          <QuickAction icon={Plus} title="إضافة طفل" onClick={() => setActivePage('children')} />
          <QuickAction icon={BookOpen} title="إضافة برنامج" onClick={() => setActivePage('programs')} />
          <QuickAction icon={Gamepad2} title="إضافة نشاط" onClick={() => setActivePage('activities')} />
          <QuickAction icon={CalendarDays} title="تسجيل حضور" onClick={() => setActivePage('attendance')} />
          <QuickAction icon={FileText} title="تقرير يومي" onClick={() => setActivePage('reports')} />
          <QuickAction icon={Camera} title="رفع صور" onClick={() => setActivePage('photos')} />
          <QuickAction icon={Archive} title="الأرشيف" onClick={() => setActivePage('children')} />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-icon"><Icon size={24} /></div>
      <b>{value}</b>
      <span>{label}</span>
    </article>
  );
}

function QuickAction({ icon: Icon, title, onClick }) {
  return (
    <button type="button" className="quick-action" onClick={onClick}>
      <span><Icon size={21} /></span>
      <b>{title}</b>
    </button>
  );
}


function ModuleHero({ icon: Icon, kicker, title, desc, action, onAction }) {
  return (
    <section className="module-hero-card">
      <div className="module-hero-icon"><Icon size={30} /></div>
      <div>
        <span>{kicker}</span>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
      {action && <button type="button" onClick={onAction}><Plus size={18} />{action}</button>}
    </section>
  );
}

function AttendancePayments() {
  const [selectedDate, setSelectedDate] = useState('2026-07-03');
  return (
    <div className="module-grid">
      <ModuleHero icon={CalendarDays} kicker="الحضور والدفع" title="تسجيل يومي سريع مع متابعة الاشتراكات" desc="حددي الحضور، المتأخر، الغياب، وشوفي حالة الدفع وعدد الحصص من نفس الشاشة." action="تسجيل يوم جديد" />
      <section className="module-card span-2">
        <div className="module-toolbar">
          <label>تاريخ اليوم<input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /></label>
          <div className="module-actions"><button><CheckCircle2 size={18} />تحديد الكل حاضر</button><button className="ghost"><Send size={18} />رسائل الغياب</button></div>
        </div>
        <div className="smart-table">
          <div className="smart-row table-head"><b>الطفل</b><b>البرنامج</b><b>الحضور</b><b>الدفع</b><b>الحصص</b><b>إجراء</b></div>
          {attendanceRows.map((row) => <div className="smart-row" key={row.name}><span>{row.name}</span><span>{row.program}</span><span className={`status-pill ${row.status === 'حاضر' ? 'ok' : row.status === 'غائب' ? 'danger' : 'warn'}`}>{row.status}</span><span className={`status-pill ${row.payment === 'ساري' ? 'ok' : 'warn'}`}>{row.payment}</span><span>{row.sessions}</span><button className="mini-btn"><Edit3 size={15} />تعديل</button></div>)}
        </div>
      </section>
      <section className="module-card"><h3>ملخص اليوم</h3><div className="mini-stats"><b>3</b><span>حاضر</span><b>1</b><span>غياب/تأخير</span><b>2</b><span>تنبيهات دفع</span></div></section>
      <section className="module-card"><h3>رسائل جاهزة</h3><p className="muted-copy">رسالة غياب، تذكير دفع، أو تأكيد حضور يمكن نسخها وإرسالها لولي الأمر.</p><button className="wide-btn"><Copy size={18} />نسخ قالب الرسالة</button></section>
    </div>
  );
}

function ReportsCenter() {
  return (
    <div className="module-grid">
      <ModuleHero icon={FileText} kicker="التقارير" title="تقارير يومية وشهرية جاهزة لولي الأمر" desc="اكتبي تقرير الطفل أو استخدمي ملخص AI من الخطة والحضور والملاحظات." action="إنشاء تقرير" />
      <section className="module-card span-2"><div className="section-head"><div><h3>تقارير قيد المتابعة</h3><p>مسودات، تقارير جاهزة، وتقارير لم تُرسل بعد.</p></div><button className="soft-btn"><Sparkles size={16} /> توليد تقرير AI</button></div><div className="report-list">{reportRows.map((r) => <article className="report-card" key={r.child}><div><b>{r.child}</b><h4>{r.title}</h4><p>{r.summary}</p></div><span className={`status-pill ${r.status === 'جاهز' ? 'ok' : 'warn'}`}>{r.status}</span><button className="mini-btn"><Send size={15} />إرسال</button></article>)}</div></section>
      <section className="module-card"><h3>قوالب التقارير</h3><div className="template-chips"><span>حفظ قرآن</span><span>كامب</span><span>سلوك</span><span>غياب</span><span>شهري</span></div></section>
      <section className="module-card"><h3>معاينة ولي الأمر</h3><p className="parent-preview">اليوم راجعنا سورة الضحى وتعلمنا خلق الصدق، وشارك الطفل في نشاط لوحة شجرة القيم 🌱</p></section>
    </div>
  );
}

function PhotosGallery() {
  return (
    <div className="module-grid">
      <ModuleHero icon={Camera} kicker="الصور" title="ألبومات منظمة حسب اليوم والبرنامج" desc="ارفعي الصور، اربطيها بالخطة أو النشاط، واختاري ما يظهر لولي الأمر." action="رفع صور" />
      <section className="upload-zone span-2"><Upload size={34} /><h3>اسحبي الصور هنا أو اضغطي للرفع</h3><p>بعد الرفع يمكن اختيار البرنامج، اليوم، والأطفال الظاهرين في الألبوم.</p></section>
      {photoAlbums.map((album) => <article className="album-card" key={album.title}><div className="album-cover">{album.cover}</div><div><h3>{album.title}</h3><p>{album.count} صورة • {album.date}</p></div><button className="mini-btn"><ImageIcon size={15} />فتح</button></article>)}
    </div>
  );
}

function TeachersManagement() {
  return (
    <div className="module-grid">
      <ModuleHero icon={GraduationCap} kicker="المعلمات" title="إدارة الفريق والمهام والصلاحيات" desc="تابعي مهام كل معلمة، الحلقات المسؤولة عنها، ونسبة إنجاز الخطة اليومية." action="إضافة معلمة" />
      <section className="module-card span-2"><div className="teacher-grid">{teachers.map((t) => <article className="teacher-card" key={t.name}><div className="teacher-avatar">{t.name.split(' ')[1]?.[0] || 'م'}</div><div><h3>{t.name}</h3><p>{t.role}</p><span>{t.classes}</span><div className="progress-line"><i style={{ width: `${Math.round((t.done / t.tasks) * 100)}%` }} /></div><small>{t.done} من {t.tasks} مهمة مكتملة</small></div><button className="mini-btn"><ShieldCheck size={15} />الصلاحيات</button></article>)}</div></section>
      <section className="module-card"><h3>صلاحيات جاهزة</h3><div className="template-chips"><span>مدير</span><span>مشرفة</span><span>معلمة</span><span>ولي أمر</span></div></section>
      <section className="module-card"><h3>دعوة مستخدم</h3><p className="muted-copy">ارسلي رابط دخول مؤقت للمعلمة أو المدير بعد اعتماد النسخة.</p><button className="wide-btn"><UserPlus size={18} />إنشاء رابط دعوة</button></section>
    </div>
  );
}

function AIAssistant({ setMessage }) {
  const [prompt, setPrompt] = useState('اقترح خطة كامب ليوم فيه قرآن وسيرة وحديث وما لا يسع المسلم جهله وصحابة ونشاط ألوان ولعبة جماعية');
  const suggested = 'خطة مقترحة: القرآن: سورة العصر ومراجعة قصيرة. السيرة: الهجرة. الحديث: تبسمك في وجه أخيك صدقة. ما لا يسع المسلم جهله: آداب الطعام. الصحابي: أبو بكر الصديق. النشاط: تلوين خريطة الهجرة. اللعبة: البحث عن بطاقات القيم.';
  return (
    <div className="module-grid">
      <ModuleHero icon={Bot} kicker="مساعد AI" title="مساعد تربوي داخل النظام" desc="يكتب خطة يوم، تقرير ولي أمر، رسالة غياب، أو أفكار أنشطة مناسبة للعمر والبرنامج." action="حفظ الاقتراح" onAction={() => setMessage(suggested)} />
      <section className="ai-workspace span-2"><div className="ai-input"><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} /><button onClick={() => setMessage(suggested)}><Sparkles size={18} />توليد</button></div><div className="ai-output"><span>اقتراح جاهز</span><p>{suggested}</p><div className="module-actions"><button><Copy size={18} />نسخ</button><button className="ghost"><ClipboardList size={18} />إضافة للخطة</button></div></div></section>
      <section className="module-card"><h3>استخدامات سريعة</h3><div className="template-chips"><span>خطة كامب</span><span>حلقة حفظ</span><span>تقرير طفل</span><span>رسالة ولي أمر</span><span>لعبة تعليمية</span></div></section>
      <section className="module-card"><h3>قواعد الاقتراح</h3><p className="muted-copy">لا يكرر نفس النشاط داخل اليوم، ويقترح بناءً على العمر ونوع البرنامج والتوبكس المطلوبة.</p></section>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="module-grid">
      <ModuleHero icon={Settings} kicker="الإعدادات" title="إعدادات الأكاديمية والنظام" desc="بيانات الأكاديمية، الصلاحيات، القوالب، وطريقة ظهور المحتوى لولي الأمر." action="حفظ التغييرات" />
      <section className="module-card span-2 settings-form"><label>اسم الأكاديمية<input defaultValue="ويبقى الأثر" /></label><label>رقم التواصل<input defaultValue="01000000000" /></label><label>البريد الإلكتروني<input defaultValue="info@we-yabqa.com" /></label><label>المدينة<input defaultValue="القاهرة" /></label></section>
      <section className="module-card"><h3><Lock size={18} />الصلاحيات</h3><div className="settings-list"><span>المدير يرى كل الصفحات</span><span>المعلمة تعدل خططها فقط</span><span>ولي الأمر يرى الخطة الشهرية والتقارير</span></div></section>
      <section className="module-card"><h3><Palette size={18} />الهوية البصرية</h3><p className="muted-copy">ألوان هادئة، تصميم مودرن، واتجاه RTL مناسب للموبايل واللاب.</p><button className="wide-btn"><Save size={18} />حفظ الهوية</button></section>
    </div>
  );
}

function ComingSoon({ activePage }) {
  return (
    <section className="coming-soon">
      <div className="coming-icon"><Sparkles size={38} /></div>
      <h2>{getPageTitle(activePage)}</h2>
      <p>هنبني الصفحة دي بعد اعتماد الـ Dashboard، عشان نمشي صفحة صفحة بدون لخبطة.</p>
    </section>
  );
}

function getPageTitle(page) {
  const titles = {
    children: 'الأطفال',
    programs: 'البرامج والمسارات',
    attendance: 'الحضور والدفع',
    plans: 'المحتوى والخطط',
    activities: 'الأنشطة والألعاب',
    reports: 'التقارير',
    photos: 'الصور',
    teachers: 'المعلمات',
    ai: 'مساعد AI',
    settings: 'الإعدادات',
  };
  return titles[page] || 'الرئيسية';
}
