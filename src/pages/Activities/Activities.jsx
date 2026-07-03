import React, { useMemo, useState } from 'react';
import {
  Activity,
  Bot,
  Clock3,
  Edit3,
  Gamepad2,
  Palette,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  X
} from 'lucide-react';
import './Activities.css';

const initialActivities = [
  {
    id: 1,
    title: 'لعبة الكنز',
    category: 'الألعاب',
    age: '6 - 10 سنوات',
    duration: '20 دقيقة',
    groupSize: '10 أطفال',
    skill: 'التعاون',
    tools: 'بطاقات صغيرة، صندوق',
    steps: 'نخبئ بطاقات القيم، ويبحث الأطفال عنها في فرق.',
    status: 'active'
  },
  {
    id: 2,
    title: 'سباق التعاون',
    category: 'الرياضة',
    age: '7 - 12 سنة',
    duration: '15 دقيقة',
    groupSize: '12 طفل',
    skill: 'العمل الجماعي',
    tools: 'أقماع، حبل',
    steps: 'يتحرك الأطفال في فرق مع مهمة مشتركة للوصول للنهاية.',
    status: 'active'
  },
  {
    id: 3,
    title: 'لوحة شجرة القيم',
    category: 'أنشطة يدوية',
    age: '5 - 9 سنوات',
    duration: '30 دقيقة',
    groupSize: '8 أطفال',
    skill: 'التعبير الفني',
    tools: 'ورق، ألوان، لاصق',
    steps: 'يرسم كل طفل ورقة عليها قيمة جميلة ويضيفها للشجرة.',
    status: 'active'
  }
];

const emptyActivity = {
  title: '',
  category: 'الألعاب',
  age: '',
  duration: '',
  groupSize: '',
  skill: '',
  tools: '',
  steps: '',
  status: 'active'
};

const categories = ['الكل', 'الألعاب', 'الرياضة', 'أنشطة يدوية', 'أنشطة إيمانية', 'مسرح', 'أناشيد'];

export default function Activities() {
  const [activities, setActivities] = useState(initialActivities);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('الكل');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyActivity);
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      const matchSearch = activity.title.includes(query) || activity.skill.includes(query) || activity.age.includes(query);
      const matchCategory = category === 'الكل' || activity.category === category;
      return matchSearch && matchCategory;
    });
  }, [activities, query, category]);

  function openAdd() {
    setEditing(null);
    setForm(emptyActivity);
    setModal(true);
  }

  function openEdit(activity) {
    setEditing(activity);
    setForm(activity);
    setModal(true);
  }

  function saveActivity() {
    if (!form.title.trim()) {
      alert('اكتبي اسم النشاط');
      return;
    }

    if (editing) {
      setActivities((prev) => prev.map((a) => a.id === editing.id ? { ...form, id: editing.id } : a));
    } else {
      setActivities((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }

    setModal(false);
  }

  function deleteActivity(id) {
    const ok = confirm('حذف النشاط؟');
    if (!ok) return;
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  function aiSuggest() {
    setActivities((prev) => [
      {
        id: Date.now(),
        title: 'لعبة بناء الجسر',
        category: 'الألعاب',
        age: '8 - 12 سنة',
        duration: '18 دقيقة',
        groupSize: '16 طفل',
        skill: 'التعاون وحل المشكلات',
        tools: 'أكواب ورقية، أعواد خشبية',
        steps: 'يقسم الأطفال فرق، وكل فريق يبني جسرًا بسيطًا ثم يشرح كيف تعاون.',
        status: 'active'
      },
      ...prev
    ]);
  }

  return (
    <div className="activities-page">
      <section className="activities-hero">
        <div>
          <span><Gamepad2 size={17} /> مركز الأنشطة</span>
          <h2>بنك ألعاب، أنشطة، ورياضة بشكل مودرن وسهل البحث.</h2>
          <p>كل نشاط له السن المناسب، الوقت، الأدوات، الهدف، والخطوات.</p>
        </div>

        <div className="hero-buttons">
          <button type="button" onClick={aiSuggest}><Sparkles size={19} /> اقتراح AI</button>
          <button type="button" onClick={openAdd}><Plus size={19} /> إضافة نشاط</button>
        </div>
      </section>

      <section className="activities-toolbar">
        <div className="activities-search">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث باسم النشاط، السن، أو المهارة..." />
        </div>

        <div className="activity-tabs">
          {categories.map((cat) => (
            <button type="button" key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="activity-cards">
        {filtered.map((activity) => (
          <article className="activity-card" key={activity.id}>
            <div className="activity-visual">
              {activity.category === 'الرياضة' ? <Activity size={40} /> : activity.category === 'أنشطة يدوية' ? <Palette size={40} /> : <Gamepad2 size={40} />}
            </div>

            <div className="activity-body">
              <span>{activity.category}</span>
              <h3>{activity.title}</h3>

              <div className="activity-meta">
                <p><Clock3 size={15} /> {activity.duration || 'بدون وقت'}</p>
                <p><Target size={15} /> {activity.skill || 'بدون هدف'}</p>
              </div>

              <p className="activity-desc">السن: {activity.age || 'غير محدد'} • العدد: {activity.groupSize || 'غير محدد'}</p>

              <div className="activity-actions">
                <button type="button" onClick={() => setPreview(activity)}>ابدأ النشاط</button>
                <button type="button" onClick={() => openEdit(activity)}><Edit3 size={16} /></button>
                <button type="button" className="danger" onClick={() => deleteActivity(activity.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {modal && (
        <div className="activity-modal-backdrop">
          <div className="activity-modal">
            <button type="button" className="modal-close" onClick={() => setModal(false)}><X size={19} /></button>
            <h3>{editing ? 'تعديل نشاط' : 'إضافة نشاط جديد'}</h3>
            <p>اكتبي تفاصيل النشاط عشان تقدري تضيفيه للخطة بعد كده.</p>

            <div className="activity-form-grid">
              <Input label="اسم النشاط" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <Select label="التصنيف" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories.filter(c => c !== 'الكل')} />
              <Input label="السن المناسب" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
              <Input label="المدة" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
              <Input label="عدد الأطفال" value={form.groupSize} onChange={(v) => setForm({ ...form, groupSize: v })} />
              <Input label="المهارة / الهدف" value={form.skill} onChange={(v) => setForm({ ...form, skill: v })} />
            </div>

            <label className="full-field">
              <span>الأدوات</span>
              <textarea value={form.tools} onChange={(e) => setForm({ ...form, tools: e.target.value })} />
            </label>

            <label className="full-field">
              <span>خطوات التنفيذ</span>
              <textarea value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} />
            </label>

            <button type="button" className="save-activity-btn" onClick={saveActivity}>حفظ النشاط</button>
          </div>
        </div>
      )}

      {preview && (
        <div className="activity-modal-backdrop">
          <div className="activity-modal preview">
            <button type="button" className="modal-close" onClick={() => setPreview(null)}><X size={19} /></button>
            <h3>{preview.title}</h3>
            <p>{preview.category} • {preview.age} • {preview.duration}</p>

            <div className="preview-block">
              <b>الهدف</b>
              <p>{preview.skill}</p>
            </div>

            <div className="preview-block">
              <b>الأدوات</b>
              <p>{preview.tools}</p>
            </div>

            <div className="preview-block">
              <b>الخطوات</b>
              <p>{preview.steps}</p>
            </div>

            <button type="button" className="save-activity-btn">إضافة للخطة الشهرية</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
