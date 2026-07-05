import React, { useMemo, useState } from 'react';
import {
  Activity,
  Archive,
  BookOpen,
  CalendarDays,
  Edit3,
  Gamepad2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Clock3,
  WalletCards,
  Bell
} from 'lucide-react';
import './Programs.css';

const initialPrograms = [
  {
    id: 1,
    name: 'حلقة القرآن',
    type: 'قرآن',
    duration: 'ساعة',
    paymentType: 'بالساعات',
    reminderHours: 2,
    status: 'active',
    description: '30 دقيقة قرآن + 15 دقيقة مراجعة + 15 دقيقة درس دين.',
    linkedActivities: ['قرآن', 'مراجعة', 'درس دين']
  },
  {
    id: 2,
    name: 'الكامب الصيفي',
    type: 'كامب',
    duration: 'موسمي',
    paymentType: 'بالساعات',
    reminderHours: 4,
    status: 'active',
    description: 'قرآن، سيرة، حديث، ما لا يسع المسلم جهله، صحابة وقدوات، عربي، أنشطة وألعاب.',
    linkedActivities: ['قرآن', 'سيرة', 'حديث', 'أنشطة', 'ألعاب']
  },
  {
    id: 3,
    name: 'الكامب الشتوي',
    type: 'كامب',
    duration: 'موسمي',
    paymentType: 'بالساعات',
    reminderHours: 4,
    status: 'active',
    description: 'برنامج شتوي تربوي وتعليمي للأطفال مع أنشطة مناسبة.',
    linkedActivities: ['قرآن', 'أنشطة', 'ألعاب']
  },
  {
    id: 4,
    name: 'حلقة الفقه',
    type: 'فقه',
    duration: 'حسب الخطة',
    paymentType: 'بالساعات',
    reminderHours: 2,
    status: 'active',
    description: 'تعليم أساسيات الفقه وما يحتاجه الطفل في يومه.',
    linkedActivities: ['درس فقه', 'مراجعة']
  },
  {
    id: 5,
    name: 'حلقة العقيدة',
    type: 'عقيدة',
    duration: 'حسب الخطة',
    paymentType: 'بالساعات',
    reminderHours: 2,
    status: 'active',
    description: 'تعليم مبسط للعقيدة بما يناسب عمر الطفل.',
    linkedActivities: ['درس عقيدة', 'أسئلة']
  },
  {
    id: 6,
    name: 'حلقة السيرة',
    type: 'سيرة',
    duration: 'حسب الخطة',
    paymentType: 'بالساعات',
    reminderHours: 2,
    status: 'active',
    description: 'قصص ومواقف من السيرة النبوية بأسلوب مناسب للأطفال.',
    linkedActivities: ['قصة', 'نشاط تفاعلي']
  },
  {
    id: 7,
    name: 'تأسيس اللغة العربية',
    type: 'عربي',
    duration: 'حسب المستوى',
    paymentType: 'بالساعات',
    reminderHours: 2,
    status: 'active',
    description: 'تأسيس الحروف، الكلمات، القراءة والكتابة للأطفال.',
    linkedActivities: ['حروف', 'كلمات', 'قراءة']
  }
];

const emptyProgram = {
  name: '',
  type: 'قرآن',
  duration: '',
  paymentType: 'بالساعات',
  reminderHours: 2,
  status: 'active',
  description: '',
  linkedActivities: []
};

export default function Programs() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('active');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProgram);

  const filtered = useMemo(() => {
    return programs.filter((program) => {
      const matchSearch =
        program.name.includes(query) ||
        program.type.includes(query) ||
        program.description.includes(query);

      const matchFilter = filter === 'all' || program.status === filter;
      return matchSearch && matchFilter;
    });
  }, [programs, query, filter]);

  function openAdd() {
    setEditing(null);
    setForm(emptyProgram);
    setModal(true);
  }

  function openEdit(program) {
    setEditing(program);
    setForm(program);
    setModal(true);
  }

  function saveProgram() {
    if (!form.name.trim()) {
      alert('اكتبي اسم البرنامج');
      return;
    }

    const safeProgram = {
      ...form,
      reminderHours: Number(form.reminderHours) || 0,
      linkedActivities: form.linkedActivities || []
    };

    if (editing) {
      setPrograms((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...safeProgram, id: editing.id } : p))
      );
    } else {
      setPrograms((prev) => [{ ...safeProgram, id: Date.now() }, ...prev]);
    }

    setModal(false);
  }

  function archiveProgram(id) {
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'archived' } : p))
    );
  }

  function restoreProgram(id) {setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'active' } : p))
    );
  }

  function deleteProgram(id) {
    const ok = confirm('حذف البرنامج نهائيًا؟');
    if (!ok) return;
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  }

  function getProgramIcon(type) {
    if (type === 'كامب') return <CalendarDays size={24} />;
    if (type === 'عربي') return <BookOpen size={24} />;
    if (type === 'قرآن') return <BookOpen size={24} />;
    if (type === 'أنشطة') return <Gamepad2 size={24} />;
    return <Activity size={24} />;
  }

  return (
    <div className="programs-page">
      <section className="programs-hero">
        <div>
          <span>
            <BookOpen size={17} /> البرامج والاشتراكات
          </span>
          <h2>برامج الأكاديمية بنظام الدفع بالساعات.</h2>
          <p>
            كل برنامج له رصيد ساعات، وساعات متبقية، وتنبيه قبل انتهاء الاشتراك.
          </p>
        </div>

        <button type="button" onClick={openAdd}>
          <Plus size={20} />
          إضافة برنامج
        </button>
      </section>

      <section className="programs-toolbar">
        <div className="programs-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث باسم البرنامج أو النوع..."
          />
        </div>

        <div className="program-filter">
          <button
            type="button"
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            نشط
          </button>
          <button
            type="button"
            className={filter === 'archived' ? 'active' : ''}
            onClick={() => setFilter('archived')}
          >
            مؤرشف
          </button>
          <button
            type="button"
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            الكل
          </button>
        </div>
      </section>

      <section className="program-cards">
        {filtered.map((program) => (
          <article className="program-card" key={program.id}>
            <div className="program-icon">{getProgramIcon(program.type)}</div>

            <div className="program-card-head">
              <div>
                <h3>{program.name}</h3>
                <p>
                  {program.type} • {program.duration || 'بدون مدة'}
                </p>
              </div>

              <span
                className={
                  program.status === 'active'
                    ? 'program-status active'
                    : 'program-status archived'
                }
              >
                {program.status === 'active' ? 'نشط' : 'مؤرشف'}
              </span>
            </div>

            <p className="program-desc">
              {program.description || 'لا يوجد وصف بعد.'}
            </p>

            <div className="linked-list">
              <b>نظام الاشتراك</b>
              <div>
                <span>
                  <WalletCards size={14} /> {program.paymentType}
                </span>
                <span>
                  <Bell size={14} /> تنبيه عند {program.reminderHours} ساعة
                </span>
              </div>
            </div>

            <div className="linked-list">
              <b>مكونات البرنامج</b>
              <div>
                {program.linkedActivities.length ? (
                  program.linkedActivities.map((a) => <span key={a}>{a}</span>)
                ) : (
                  <span>لا يوجد</span>
                )}
              </div>
            </div>

            <div className="program-actions">
              <button type="button" onClick={() => openEdit(program)}>
                <Edit3 size={16} /> تعديل
              </button>

              {program.status === 'active' ? (
                <button type="button" onClick={() => archiveProgram(program.id)}>
                  <Archive size={16} /> أرشفة
                </button>) : (
                <button type="button" onClick={() => restoreProgram(program.id)}>
                  <Sparkles size={16} /> استعادة
                </button>
              )}

              <button
                type="button"
                className="danger"
                onClick={() => deleteProgram(program.id)}
              >
                <Trash2 size={16} /> حذف
              </button>
            </div>
          </article>
        ))}
      </section>

      {modal && (
        <div className="program-modal-backdrop">
          <div className="program-modal">
            <button
              type="button"
              className="modal-close"
              onClick={() => setModal(false)}
            >
              <X size={19} />
            </button>

            <h3>{editing ? 'تعديل برنامج' : 'إضافة برنامج جديد'}</h3>
            <p>البرنامج ده هيتربط بالأطفال، الحضور، الاشتراكات، والدفع.</p>

            <div className="program-form-grid">
              <label>
                <span>اسم البرنامج</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: حلقة القرآن"
                />
              </label>

              <label>
                <span>النوع</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>قرآن</option>
                  <option>كامب</option>
                  <option>فقه</option>
                  <option>عقيدة</option>
                  <option>سيرة</option>
                  <option>عربي</option>
                  <option>أنشطة</option>
                  <option>مخصص</option>
                </select>
              </label>

              <label>
                <span>المدة</span>
                <input
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="مثال: ساعة / موسمي / حسب المستوى"
                />
              </label>

              <label>
                <span>نظام الدفع</span>
                <select
                  value={form.paymentType}
                  onChange={(e) =>
                    setForm({ ...form, paymentType: e.target.value })
                  }
                >
                  <option>بالساعات</option>
                  <option>شهري</option>
                  <option>موسمي</option>
                </select>
              </label>

              <label>
                <span>تنبيه عند كام ساعة متبقية؟</span>
                <input
                  type="number"
                  value={form.reminderHours}
                  onChange={(e) =>
                    setForm({ ...form, reminderHours: e.target.value })
                  }
                  placeholder="مثال: 2"
                />
              </label>

              <label>
                <span>الحالة</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">نشط</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </label>
            </div>

            <label className="full-field">
              <span>الوصف</span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="اكتبي وصف بسيط للبرنامج..."
              />
            </label>

            <button
              type="button"
              className="save-program-btn"
              onClick={saveProgram}
            >
              حفظ البرنامج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}