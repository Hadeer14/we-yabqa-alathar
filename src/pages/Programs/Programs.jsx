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
  X
} from 'lucide-react';
import './Programs.css';

const initialPrograms = [
  {
    id: 1,
    name: 'حفظ القرآن',
    type: 'تعليمي',
    duration: 'مستمر',
    status: 'active',
    description: 'حلقات حفظ ومراجعة حسب المستوى.',
    linkedActivities: ['مسابقة الحفظ', 'بطاقة المتابعة']
  },
  {
    id: 2,
    name: 'الكامب الصيفي',
    type: 'كامب',
    duration: 'شهرين',
    status: 'active',
    description: 'برنامج صيفي شامل حفظ وأنشطة وألعاب ورياضة.',
    linkedActivities: ['لعبة الكنز', 'سباق التعاون']
  },
  {
    id: 3,
    name: 'السيرة',
    type: 'تربوي',
    duration: 'شهري',
    status: 'active',
    description: 'قصص ومواقف تربوية من السيرة.',
    linkedActivities: ['تمثيل موقف الصدق']
  }
];

const emptyProgram = {
  name: '',
  type: 'تعليمي',
  duration: '',
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
      const matchSearch = program.name.includes(query) || program.type.includes(query);
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

    if (editing) {
      setPrograms((prev) => prev.map((p) => p.id === editing.id ? { ...form, id: editing.id } : p));
    } else {
      setPrograms((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }

    setModal(false);
  }

  function archiveProgram(id) {
    setPrograms((prev) => prev.map((p) => p.id === id ? { ...p, status: 'archived' } : p));
  }

  function restoreProgram(id) {
    setPrograms((prev) => prev.map((p) => p.id === id ? { ...p, status: 'active' } : p));
  }

  function deleteProgram(id) {
    const ok = confirm('حذف البرنامج نهائيًا؟');
    if (!ok) return;
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="programs-page">
      <section className="programs-hero">
        <div>
          <span><BookOpen size={17} /> البرامج والمسارات</span>
          <h2>أضيفي أي برنامج تقدموه بدون تعديل في الكود.</h2>
          <p>كامب، حفظ، تفسير، سيرة، رياضة، ألعاب، أنشطة… كله من هنا.</p>
        </div>

        <button type="button" onClick={openAdd}>
          <Plus size={20} />
          إضافة برنامج
        </button>
      </section>

      <section className="programs-toolbar">
        <div className="programs-search">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث باسم البرنامج أو النوع..." />
        </div>

        <div className="program-filter">
          <button type="button" className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>نشط</button>
          <button type="button" className={filter === 'archived' ? 'active' : ''} onClick={() => setFilter('archived')}>مؤرشف</button>
          <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>الكل</button>
        </div>
      </section>

      <section className="program-cards">
        {filtered.map((program) => (
          <article className="program-card" key={program.id}>
            <div className="program-icon">
              {program.type === 'كامب' ? <CalendarDays size={24} /> : program.type === 'رياضة' ? <Activity size={24} /> : <BookOpen size={24} />}
            </div>

            <div className="program-card-head">
              <div>
                <h3>{program.name}</h3>
                <p>{program.type} • {program.duration || 'بدون مدة'}</p>
              </div>

              <span className={program.status === 'active' ? 'program-status active' : 'program-status archived'}>
                {program.status === 'active' ? 'نشط' : 'مؤرشف'}
              </span>
            </div>

            <p className="program-desc">{program.description || 'لا يوجد وصف بعد.'}</p>

            <div className="linked-list">
              <b>أنشطة مرتبطة</b>
              <div>
                {program.linkedActivities.length ? (
                  program.linkedActivities.map((a) => <span key={a}>{a}</span>)
                ) : (
                  <span>لا يوجد</span>
                )}
              </div>
            </div>

            <div className="program-actions">
              <button type="button" onClick={() => openEdit(program)}><Edit3 size={16} /> تعديل</button>
              {program.status === 'active' ? (
                <button type="button" onClick={() => archiveProgram(program.id)}><Archive size={16} /> أرشفة</button>
              ) : (
                <button type="button" onClick={() => restoreProgram(program.id)}><Sparkles size={16} /> استعادة</button>
              )}
              <button type="button" className="danger" onClick={() => deleteProgram(program.id)}><Trash2 size={16} /> حذف</button>
            </div>
          </article>
        ))}
      </section>

      {modal && (
        <div className="program-modal-backdrop">
          <div className="program-modal">
            <button type="button" className="modal-close" onClick={() => setModal(false)}><X size={19} /></button>
            <h3>{editing ? 'تعديل برنامج' : 'إضافة برنامج جديد'}</h3>
            <p>البرنامج ده بعد كده هيتربط بالأطفال، الدفع، الخطة، والأنشطة.</p>

            <div className="program-form-grid">
              <label>
                <span>اسم البرنامج</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: التفسير" />
              </label>

              <label>
                <span>النوع</span>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>تعليمي</option>
                  <option>تربوي</option>
                  <option>كامب</option>
                  <option>رياضة</option>
                  <option>ألعاب</option>
                  <option>أنشطة</option>
                  <option>مخصص</option>
                </select>
              </label>

              <label>
                <span>المدة</span>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="مثال: شهرين / مستمر" />
              </label>

              <label>
                <span>الحالة</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">نشط</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </label>
            </div>

            <label className="full-field">
              <span>الوصف</span>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="اكتبي وصف بسيط للبرنامج..." />
            </label>

            <button type="button" className="save-program-btn" onClick={saveProgram}>حفظ البرنامج</button>
          </div>
        </div>
      )}
    </div>
  );
}
