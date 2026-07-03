import React, { useMemo, useState } from 'react';
import {
  Archive, BookOpen, CalendarDays, CheckCircle2, Clock3, CreditCard, Eye,
  FilePenLine, MessageCircle, Plus, Search, Trash2, UserRound, WalletCards, X
} from 'lucide-react';
import './Students.css';

const programOptions = [
  'حفظ القرآن',
  'التفسير',
  'السيرة',
  'ما لا يسع المسلم جهله',
  'الكامب الصيفي',
  'الألعاب',
  'الأنشطة',
  'الرياضة'
];

const emptySubscription = {
  program: 'حفظ القرآن',
  paymentType: 'hours',
  unitName: 'ساعة',
  unitLimit: 8,
  usedUnits: 0,
  amount: 400,
  customMessage: ''
};

const initialStudents = [
  {
    id: 1,
    name: 'محمد أحمد',
    gender: 'male',
    birthDate: '2018-05-10',
    level: 'المستوى الأول',
    parentName: 'أحمد محمد',
    parentPhone: '01012345678',
    subscriptions: [
      { id: 101, program: 'حفظ القرآن', paymentType: 'hours', unitName: 'ساعة', unitLimit: 8, usedUnits: 8, amount: 400, customMessage: '' },
      { id: 102, program: 'الألعاب', paymentType: 'monthly', unitName: 'شهر', unitLimit: 1, usedUnits: 0, amount: 200, customMessage: '' }
    ],
    status: 'active'
  },
  {
    id: 2,
    name: 'فاطمة علي',
    gender: 'female',
    birthDate: '2017-09-22',
    level: 'المستوى الثاني',
    parentName: 'مريم علي',
    parentPhone: '01123456789',
    subscriptions: [
      { id: 201, program: 'الكامب الصيفي', paymentType: 'monthly', unitName: 'شهر', unitLimit: 1, usedUnits: 0, amount: 900, customMessage: '' },
      { id: 202, program: 'الرياضة', paymentType: 'sessions', unitName: 'حصة', unitLimit: 4, usedUnits: 2, amount: 150, customMessage: 'برجاء تذكير ولي الأمر بدفع اشتراك الرياضة عند اكتمال الحصص.' }
    ],
    status: 'active'
  }
];

const emptyForm = {
  name: '',
  gender: 'male',
  birthDate: '',
  level: '',
  parentName: '',
  parentPhone: '',
  subscriptions: [{ id: Date.now(), ...emptySubscription }]
};

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(1);
  const [previewMessage, setPreviewMessage] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchSearch =
        student.name.includes(query) ||
        student.parentName.includes(query) ||
        student.parentPhone.includes(query);

      const matchFilter =
        filter === 'all' ||
        student.status === filter ||
        (filter === 'payment' && student.subscriptions.some(needsPayment));

      return matchSearch && matchFilter;
    });
  }, [students, query, filter]);

  function openAddModal() {
    setEditingStudent(null);
    setForm({ ...emptyForm, subscriptions: [{ id: Date.now(), ...emptySubscription }] });
    setStep(1);
    setShowModal(true);
  }

  function openEditModal(student) {
    setEditingStudent(student);
    setForm({
      name: student.name,
      gender: student.gender,
      birthDate: student.birthDate,
      level: student.level,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      subscriptions: student.subscriptions
    });
    setStep(1);
    setShowModal(true);
  }

  function saveStudent() {
    if (!form.name.trim() || !form.parentPhone.trim()) {
      alert('من فضلك اكتبي اسم الطفل ورقم ولي الأمر');
      return;
    }

    if (editingStudent) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingStudent.id
            ? { ...student, ...form }
            : student
        )
      );
    } else {
      setStudents((prev) => [
        { id: Date.now(), ...form, status: 'active' },
        ...prev
      ]);
    }

    setShowModal(false);
  }

  function archiveStudent(id) {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status: 'archived' } : s));
  }

  function restoreStudent(id) {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status: 'active' } : s));
  }

  function deleteStudent(id) {
    const ok = confirm('هل أنتِ متأكدة من حذف الطفل نهائيًا؟');
    if (!ok) return;
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }

  function updateSub(index, key, value) {
    setForm((prev) => {
      const subscriptions = [...prev.subscriptions];
      subscriptions[index] = { ...subscriptions[index], [key]: value };
      return { ...prev, subscriptions };
    });
  }

  function addSubscription() {
    setForm((prev) => ({
      ...prev,
      subscriptions: [{ id: Date.now(), ...emptySubscription }, ...prev.subscriptions]
    }));
  }

  function removeSubscription(index) {
    setForm((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((_, i) => i !== index)
    }));
  }

  function absenceMessage(student) {
    if (student.gender === 'female') {
      return `السلام عليكم، نحب نطمئن على ${student.name} لأنها لم تحضر اليوم. إن شاء الله تكون بخير وننتظر حضورها قريبًا 🌱`;
    }
    return `السلام عليكم، نحب نطمئن على ${student.name} لأنه لم يحضر اليوم. إن شاء الله يكون بخير وننتظر حضوره قريبًا 🌱`;
  }

  function paymentMessage(student, sub) {
    if (sub.customMessage?.trim()) {
      return sub.customMessage
        .replaceAll('{child}', student.name)
        .replaceAll('{program}', sub.program)
        .replaceAll('{used}', sub.usedUnits)
        .replaceAll('{limit}', sub.unitLimit)
        .replaceAll('{unit}', sub.unitName)
        .replaceAll('{amount}', sub.amount);
    }

    return `السلام عليكم، نذكركم أن اشتراك ${student.name} في ${sub.program} وصل إلى ${sub.usedUnits} ${sub.unitName} من أصل ${sub.unitLimit} ${sub.unitName}، برجاء تجديد الاشتراك بقيمة ${sub.amount} جنيه. أكاديمية ويبقى الأثر 🌱`;
  }

  return (
    <div className="students-page">
      <section className="students-hero">
        <div>
          <span>إدارة الأطفال</span>
          <h2>إضافة، تعديل، أرشفة، حذف، وتنبيهات دفع مرنة حسب الطفل والبرنامج.</h2>
          <p>كل طفل ممكن يكون له أكتر من اشتراك، وكل اشتراك له نظام دفع ورسالة خاصة.</p>
        </div>

        <button type="button" className="add-student-btn" onClick={openAddModal}>
          <Plus size={20} />
          إضافة طفل
        </button>
      </section>

      <section className="students-toolbar">
        <div className="students-search">
          <Search size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث باسم الطفل، ولي الأمر، أو رقم الهاتف..."
          />
        </div>

        <div className="filter-pills">
          <button type="button" className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>نشط</button>
          <button type="button" className={filter === 'archived' ? 'active' : ''} onClick={() => setFilter('archived')}>مؤرشف</button>
          <button type="button" className={filter === 'payment' ? 'active' : ''} onClick={() => setFilter('payment')}>دفع مطلوب</button>
          <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>الكل</button>
        </div>
      </section>

      <section className="students-summary">
        <SummaryCard icon={UserRound} label="إجمالي الأطفال" value={students.length} />
        <SummaryCard icon={CheckCircle2} label="نشطين" value={students.filter(s => s.status === 'active').length} />
        <SummaryCard icon={Archive} label="مؤرشفين" value={students.filter(s => s.status === 'archived').length} />
        <SummaryCard icon={WalletCards} label="دفع مطلوب" value={students.reduce((count, student) => count + student.subscriptions.filter(needsPayment).length, 0)} />
      </section>

      <section className="students-list">
        {filteredStudents.map((student) => (
          <article className="student-card" key={student.id}>
            <div className="student-avatar">{student.gender === 'female' ? 'ب' : 'و'}</div>

            <div className="student-main">
              <div className="student-title-row">
                <div>
                  <h3>{student.name}</h3>
                  <p>{student.gender === 'female' ? 'أنثى' : 'ذكر'} • {student.level || 'بدون مستوى'} • ولي الأمر: {student.parentName}</p>
                </div>

                <span className={student.status === 'active' ? 'status active' : 'status archived'}>
                  {student.status === 'active' ? 'نشط' : 'مؤرشف'}
                </span>
              </div>

              <div className="student-tags">
                {student.subscriptions.map((sub) => (
                  <span key={sub.id}>{sub.program} — {paymentTypeLabel(sub.paymentType)}</span>
                ))}
              </div>

              <div className="student-meta">
                <span><UserRound size={16} /> {student.parentPhone}</span>
                <span><CreditCard size={16} /> {student.subscriptions.length} اشتراك</span>
              </div>

              {student.subscriptions.filter(needsPayment).map((sub) => (
                <div className="payment-alert" key={sub.id}>
                  <Clock3 size={17} />
                  {sub.program}: وصل إلى {sub.usedUnits}/{sub.unitLimit} {sub.unitName}
                  <button type="button" onClick={() => setPreviewMessage(paymentMessage(student, sub))}>رسالة الدفع</button>
                </div>
              ))}
            </div>

            <div className="student-actions">
              <button type="button" className="view"><Eye size={17} /> عرض</button>
              <button type="button" onClick={() => setPreviewMessage(absenceMessage(student))}><MessageCircle size={17} /> رسالة غياب</button>
              <button type="button" onClick={() => openEditModal(student)}><FilePenLine size={17} /> تعديل</button>
              {student.status === 'active' ? (
                <button type="button" onClick={() => archiveStudent(student.id)}><Archive size={17} /> أرشفة</button>
              ) : (
                <button type="button" onClick={() => restoreStudent(student.id)}><CheckCircle2 size={17} /> استعادة</button>
              )}
              <button type="button" className="danger" onClick={() => deleteStudent(student.id)}><Trash2 size={17} /> حذف</button>
            </div>
          </article>
        ))}
      </section>

      {showModal && (
        <div className="modal-backdrop">
          <div className="student-modal">
            <button type="button" className="close-modal" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>

            <div className="modal-head">
              <h3>{editingStudent ? 'تعديل بيانات الطفل' : 'إضافة طفل جديد'}</h3>
              <p>تقدري تضيفي اشتراك مختلف لكل برنامج، وتعدلي الساعة/الحصة والرسالة.</p>
            </div>

            <div className="steps">
              {[1, 2, 3].map((n) => (
                <button type="button" key={n} className={step === n ? 'active' : ''} onClick={() => setStep(n)}>
                  {n}
                </button>
              ))}
            </div>

            {step === 1 && (
              <div className="modal-grid">
                <Input label="اسم الطفل" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Select label="النوع" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} options={[['male', 'ذكر'], ['female', 'أنثى']]} />
                <Input label="تاريخ الميلاد" type="date" value={form.birthDate} onChange={(v) => setForm({ ...form, birthDate: v })} />
                <Input label="المستوى" value={form.level} onChange={(v) => setForm({ ...form, level: v })} />
                <Input label="اسم ولي الأمر" value={form.parentName} onChange={(v) => setForm({ ...form, parentName: v })} />
                <Input label="رقم ولي الأمر" value={form.parentPhone} onChange={(v) => setForm({ ...form, parentPhone: v })} />
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="subscriptions-head">
                  <h4 className="modal-subtitle">اشتراكات الطفل</h4>
                  <button type="button" onClick={addSubscription}><Plus size={17} /> إضافة اشتراك</button>
                </div>

                <div className="subscriptions-list">
                  {form.subscriptions.map((sub, index) => (
                    <div className="subscription-box" key={sub.id}>
                      <div className="subscription-title">
                        <b>اشتراك {index + 1}</b>
                        {form.subscriptions.length > 1 && (
                          <button type="button" onClick={() => removeSubscription(index)}><Trash2 size={16} /></button>
                        )}
                      </div>

                      <div className="modal-grid">
                        <Select label="البرنامج / المادة" value={sub.program} onChange={(v) => updateSub(index, 'program', v)} options={programOptions.map((p) => [p, p])} />
                        <Select label="نظام الدفع" value={sub.paymentType} onChange={(v) => updateSub(index, 'paymentType', v)} options={[['monthly','شهري'],['weekly','أسبوعي'],['hours','بعد عدد ساعات'],['sessions','بعد عدد حصص'],['once','مرة واحدة'],['free','مجاني'],['custom','مخصص']]} />
                        <Input label="اسم الوحدة" value={sub.unitName} onChange={(v) => updateSub(index, 'unitName', v)} />
                        <Input label="الدفع بعد كام وحدة؟" type="number" value={sub.unitLimit} onChange={(v) => updateSub(index, 'unitLimit', Number(v))} />
                        <Input label="المستخدم حاليًا" type="number" value={sub.usedUnits} onChange={(v) => updateSub(index, 'usedUnits', Number(v))} />
                        <Input label="القيمة" type="number" value={sub.amount} onChange={(v) => updateSub(index, 'amount', Number(v))} />
                      </div>

                      <label className="modal-field full">
                        <span>رسالة الدفع المخصصة</span>
                        <textarea
                          value={sub.customMessage}
                          onChange={(e) => updateSub(index, 'customMessage', e.target.value)}
                          placeholder="اتركيها فاضية لو عايزة السيستم يكتب الرسالة تلقائيًا. ممكن تستخدمي {child} {program} {used} {limit} {unit} {amount}"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="review-box">
                <h4>مراجعة سريعة</h4>
                <p>الطفل: <b>{form.name || '—'}</b></p>
                <p>ولي الأمر: <b>{form.parentName || '—'}</b></p>
                <p>عدد الاشتراكات: <b>{form.subscriptions.length}</b></p>
                <p>الدفع مرن لكل برنامج، والرسائل قابلة للتعديل.</p>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="soft-modal-btn" onClick={() => setStep(Math.max(1, step - 1))}>السابق</button>
              {step < 3 ? (
                <button type="button" className="primary-modal-btn" onClick={() => setStep(step + 1)}>التالي</button>
              ) : (
                <button type="button" className="primary-modal-btn" onClick={saveStudent}>حفظ الطفل</button>
              )}
            </div>
          </div>
        </div>
      )}

      {previewMessage && (
        <div className="message-preview">
          <button type="button" onClick={() => setPreviewMessage('')}><X size={18} /></button>
          <h3>نص الرسالة الجاهزة</h3>
          <p>{previewMessage}</p>
          <div>
            <button type="button" className="primary-modal-btn">نسخ الرسالة</button>
            <button type="button" className="soft-modal-btn">فتح واتساب</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <article className="summary-card">
      <span><Icon size={22} /></span>
      <b>{value}</b>
      <p>{label}</p>
    </article>
  );
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label className="modal-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="modal-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function needsPayment(sub) {
  return ['hours', 'sessions', 'custom'].includes(sub.paymentType) && Number(sub.usedUnits) >= Number(sub.unitLimit || 0);
}

function paymentTypeLabel(type) {
  const labels = {
    monthly: 'شهري',
    weekly: 'أسبوعي',
    hours: 'بعد ساعات',
    sessions: 'بعد حصص',
    once: 'مرة واحدة',
    free: 'مجاني',
    custom: 'مخصص'
  };
  return labels[type] || 'مخصص';
}
