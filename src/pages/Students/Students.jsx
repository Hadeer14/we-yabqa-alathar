import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  MessageCircle,
  FilePenLine,
  Plus,
  Search,
  Trash2,
  UserRound,
  WalletCards,
  X
} from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import './Students.css';

const programOptions = [
  'حلقة القرآن',
  'الكامب الصيفي',
  'الكامب الشتوي',
  'حلقة الفقه',
  'حلقة العقيدة',
  'حلقة السيرة',
  'تأسيس اللغة العربية'
];

const emptySubscription = {
  id: Date.now(),
  program: 'حلقة القرآن',
  paymentType: 'hours',
  unitName: 'ساعة',
  unitLimit: 8,
  usedUnits: 0,
  reminderAt: 2,
  amount: 400,
  customMessage: ''
};

const emptyForm = {
  name: '',
  gender: 'male',
  birthDate: '',
  level: '',
  address: '',
  notes: '',
  fatherName: '',
  fatherWhatsapp: '',
  motherName: '',
  motherWhatsapp: '',
  preferredContact: 'both',
  subscriptions: [{ ...emptySubscription, id: Date.now() }]
};

function generateStudentCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'WB-';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
function generateParentPassword() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryText, setQueryText] = useState('');
  const [filter, setFilter] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(1);
  const [messageModal, setMessageModal] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = queryText.trim();

    return students.filter((student) => {
      const matchSearch =
        !term ||
        student.name?.includes(term) ||
        student.studentCode?.includes(term) ||
        student.fatherName?.includes(term) ||
        student.motherName?.includes(term) ||
        student.fatherWhatsapp?.includes(term) ||
        student.motherWhatsapp?.includes(term);

      const matchFilter =
        filter === 'all' ||
        student.status === filter ||
        (filter === 'payment' && (student.subscriptions || []).some(needsPayment));

      return matchSearch && matchFilter;
    });
  }, [students, queryText, filter]);

  function resetForm() {
    setForm({
      ...emptyForm,
      subscriptions: [{ ...emptySubscription, id: Date.now() }]
    });
  }

  function openAddModal() {
    setEditingStudent(null);
    resetForm();
    setStep(1);
    setShowModal(true);
  }

  function openEditModal(student) {
    setEditingStudent(student);
    setForm({
      name: student.name || '',
      gender: student.gender || 'male',
      birthDate: student.birthDate || '',
      level: student.level || '',
      address: student.address || '',
      notes: student.notes || '',
      fatherName: student.fatherName || '',
      fatherWhatsapp: student.fatherWhatsapp || '',
      motherName: student.motherName || '',
      motherWhatsapp: student.motherWhatsapp || '',
      preferredContact: student.preferredContact || 'both',
      subscriptions: student.subscriptions?.length
        ? student.subscriptions
        : [{ ...emptySubscription, id: Date.now() }]
    });
    setStep(1);
    setShowModal(true);
  }

  async function saveStudent() {
    if (!form.name.trim()) {
      alert('اكتبي اسم الطالب');
      return;
    }

    if (!form.fatherWhatsapp.trim() && !form.motherWhatsapp.trim()) {
      alert('اكتبي رقم واتساب الأب أو الأم على الأقل، ويفضل بصيغة دولية مثل +2010...');
      return;
    }
    const studentCode = generateStudentCode();
    const parentPassword = generateParentPassword();

    const payload = {
      ...form,
      studentCode,
      parentUsername: studentCode,
      parentPassword,
      name: form.name.trim(),
      fatherWhatsapp: cleanPhone(form.fatherWhatsapp),
      motherWhatsapp: cleanPhone(form.motherWhatsapp),
      subscriptions: form.subscriptions.map((sub) => ({
        ...sub,
        unitLimit: Number(sub.unitLimit) || 0,
        usedUnits: Number(sub.usedUnits) || 0,
        reminderAt: Number(sub.reminderAt) || 0,
        amount: Number(sub.amount) || 0
      })),
      updatedAt: serverTimestamp()
    };

    if (editingStudent) {
      await updateDoc(doc(db, 'students', editingStudent.id), payload);
    } else {
      const studentCode = generateStudentCode();
      const parentPassword = generateParentPassword();

      await addDoc(collection(db, 'students'), {
        ...payload,

        status: 'active',
        createdAt: serverTimestamp()
      });

    }

    setShowModal(false);
  }

  async function archiveStudent(id) {
    await updateDoc(doc(db, 'students', id), {
      status: 'archived',
      updatedAt: serverTimestamp()
    });
  }

  async function restoreStudent(id) {
    await updateDoc(doc(db, 'students', id), {
      status: 'active',
      updatedAt: serverTimestamp()
    });
  }

  async function deleteStudent(id) {
    if (!confirm('حذف الطالب نهائيًا؟')) return;
    await deleteDoc(doc(db, 'students', id));
  }

  function addSubscription() {
    setForm((prev) => ({
      ...prev,
      subscriptions: [{ ...emptySubscription, id: Date.now() }, ...prev.subscriptions]
    }));
  }

  function removeSubscription(index) {
    setForm((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((_, i) => i !== index)
    }));
  }

  function updateSubscription(index, key, value) {
    setForm((prev) => {
      const subscriptions = [...prev.subscriptions];
      subscriptions[index] = { ...subscriptions[index], [key]: value };
      return { ...prev, subscriptions };
    });
  }

  function getStudentPhones(student) {
    const phones = [];

    if ((student.preferredContact === 'father' || student.preferredContact === 'both') && student.fatherWhatsapp) {
      phones.push(student.fatherWhatsapp);
    }

    if ((student.preferredContact === 'mother' || student.preferredContact === 'both') && student.motherWhatsapp) {
      phones.push(student.motherWhatsapp);
    }

    if (!phones.length) {
      if (student.fatherWhatsapp) phones.push(student.fatherWhatsapp);
      if (student.motherWhatsapp) phones.push(student.motherWhatsapp);
    }

    return phones;
  }

  function openMessage(student, message) {
    setMessageModal({
      student,
      phones: getStudentPhones(student),
      text: message
    });
  }

  function absenceMessage(student) {
    return `السلام عليكم ورحمة الله وبركاته 🌱

نحب نطمئن على ${student.name} لأنه/لأنها لم يحضر الفترة الأخيرة.

وحابين نبلغ حضرتكم إننا أطلقنا الموقع الخاص بأكاديمية ويبقى الأثر، ومن خلاله بإذن الله تقدروا تتابعوا:
- الحضور
- الاشتراك والساعات المتبقية
- الخطة والمحتوى
- التقارير والتنبيهات

نتمنى نشوفكم قريبًا بإذن الله، ونسعد بعودة ${student.name} للأكاديمية.`;
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

    const remaining = Math.max(Number(sub.unitLimit || 0) - Number(sub.usedUnits || 0), 0);

    return `السلام عليكم 🌱

نذكركم أن اشتراك ${student.name} في ${sub.program} أوشك على الانتهاء.
المتبقي: ${remaining} ${sub.unitName}.
برجاء تجديد الاشتراك بقيمة ${sub.amount} جنيه لاستمرار الحضور.

أكاديمية ويبقى الأثر`;
  }

  function openWhatsApp(phone, text) {
    const cleaned = cleanPhone(phone).replace('+', '');
    if (!cleaned) return;
    window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  function sendWhatsApp() {
    if (!messageModal?.phones?.length) {
      alert('لا يوجد رقم واتساب صالح');
      return;
    }

    messageModal.phones.forEach((phone) => openWhatsApp(phone, messageModal.text));
  }

  return (
    <div className="students-page">
      <section className="students-hero">
        <div>
          <span>إدارة الأطفال</span>
          <h2>تسجيل الطلاب الحقيقيين والاشتراكات والساعات ورسائل الواتساب.</h2>
          <p>كل طالب له كود تلقائي، عنوان، بيانات الأب والأم، واشتراكات بالساعات.</p>
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
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="بحث باسم الطالب، الكود، الأب، الأم، أو رقم الهاتف..."
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
        <SummaryCard icon={CheckCircle2} label="نشطين" value={students.filter((s) => s.status === 'active').length} />
        <SummaryCard icon={Archive} label="مؤرشفين" value={students.filter((s) => s.status === 'archived').length} />
        <SummaryCard icon={WalletCards} label="دفع مطلوب" value={students.reduce((total, student) => total + (student.subscriptions || []).filter(needsPayment).length, 0)} />
      </section>

      <section className="students-list">
        {loading && <p>جاري تحميل الطلاب...</p>}

        {!loading && filteredStudents.length === 0 && <p>لا يوجد طلاب بعد.</p>}

        {filteredStudents.map((student) => (
          <article className="student-card" key={student.id}>
            <div className="student-avatar">{student.gender === 'female' ? 'ب' : 'و'}</div>

            <div className="student-main">
              <div className="student-title-row">
                <div>
                  <h3>{student.name}</h3>
                  <p>
                    كود: {student.studentCode || '—'} • {student.gender === 'female' ? 'أنثى' : 'ذكر'} • {student.level || 'بدون مستوى'}
                  </p>
                </div>

                <span className={student.status === 'active' ? 'status active' : 'status archived'}>
                  {student.status === 'active' ? 'نشط' : 'مؤرشف'}
                </span>
              </div>

              <div className="student-tags">
                {(student.subscriptions || []).map((sub) => (
                  <span key={sub.id}>{sub.program} — {paymentTypeLabel(sub.paymentType)}</span>
                ))}
              </div>

              <div className="student-meta">
                <span><UserRound size={16} /> الأب: {student.fatherName || '—'} {student.fatherWhatsapp || ''}</span>
                <span><UserRound size={16} /> الأم: {student.motherName || '—'} {student.motherWhatsapp || ''}</span>
                <span><CreditCard size={16} /> {(student.subscriptions || []).length} اشتراك</span>
              </div>

              {student.address && <p className="student-address">العنوان: {student.address}</p>}

              {(student.subscriptions || []).filter(needsPayment).map((sub) => (
                <div className="payment-alert" key={sub.id}>
                  <Clock3 size={17} />
                  {sub.program}: المتبقي {Math.max(Number(sub.unitLimit || 0) - Number(sub.usedUnits || 0), 0)} {sub.unitName}
                  <button type="button" onClick={() => openMessage(student, paymentMessage(student, sub))}>
                    رسالة الدفع
                  </button>
                </div>
              ))}
            </div>

            <div className="student-actions">
              <button type="button" onClick={() => openMessage(student, absenceMessage(student))}>
                <MessageCircle size={17} /> رسالة غياب
              </button>
              <button
                type="button"
                onClick={() => openMessage(student, loginMessage(student))}
              >
                <MessageCircle size={17} /> بيانات الدخول
              </button>
              <button type="button" onClick={() => openEditModal(student)}>
                <FilePenLine size={17} /> تعديل
              </button>

              {student.status === 'active' ? (
                <button type="button" onClick={() => archiveStudent(student.id)}><Archive size={17} /> أرشفة</button>
              ) : (
                <button type="button" onClick={() => restoreStudent(student.id)}><CheckCircle2 size={17} /> استعادة</button>
              )}

              <button type="button" className="danger" onClick={() => deleteStudent(student.id)}>
                <Trash2 size={17} /> حذف
              </button>
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
              <p>املئي البيانات الأساسية ثم بيانات التواصل ثم الاشتراكات.</p>
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
                <Input label="العنوان" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                <Input label="ملاحظات" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
              </div>
            )}

            {step === 2 && (
              <div className="modal-grid">
                <Input label="اسم الأب" value={form.fatherName} onChange={(v) => setForm({ ...form, fatherName: v })} />
                <Input label="واتساب الأب بصيغة دولية مثال +201012345678" value={form.fatherWhatsapp} onChange={(v) => setForm({ ...form, fatherWhatsapp: v })} />
                <Input label="اسم الأم" value={form.motherName} onChange={(v) => setForm({ ...form, motherName: v })} />
                <Input label="واتساب الأم بصيغة دولية مثال +966512345678" value={form.motherWhatsapp} onChange={(v) => setForm({ ...form, motherWhatsapp: v })} />
                <Select
                  label="التواصل المفضل"
                  value={form.preferredContact}
                  onChange={(v) => setForm({ ...form, preferredContact: v })}
                  options={[['father', 'الأب'], ['mother', 'الأم'], ['both', 'الاثنين']]}
                />
              </div>
            )}

            {step === 3 && (
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
                          <button type="button" onClick={() => removeSubscription(index)}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="modal-grid">
                        <Select label="البرنامج" value={sub.program} onChange={(v) => updateSubscription(index, 'program', v)} options={programOptions.map((p) => [p, p])} />
                        <Select label="نظام الدفع" value={sub.paymentType} onChange={(v) => updateSubscription(index, 'paymentType', v)} options={[['hours', 'بالساعات'], ['sessions', 'بالحصص'], ['monthly', 'شهري'], ['once', 'مرة واحدة'], ['free', 'مجاني'], ['custom', 'مخصص']]} />
                        <Input label="اسم الوحدة" value={sub.unitName} onChange={(v) => updateSubscription(index, 'unitName', v)} />
                        <Input label="عدد الساعات / الوحدات المدفوعة" type="number" value={sub.unitLimit} onChange={(v) => updateSubscription(index, 'unitLimit', Number(v))} />
                        <Input label="المستخدم حاليًا" type="number" value={sub.usedUnits} onChange={(v) => updateSubscription(index, 'usedUnits', Number(v))} />
                        <Input label="تنبيه عند كام وحدة متبقية؟" type="number" value={sub.reminderAt} onChange={(v) => updateSubscription(index, 'reminderAt', Number(v))} />
                        <Input label="القيمة" type="number" value={sub.amount} onChange={(v) => updateSubscription(index, 'amount', Number(v))} />
                      </div>

                      <label className="modal-field full">
                        <span>رسالة الدفع المخصصة</span>
                        <textarea
                          value={sub.customMessage}
                          onChange={(e) => updateSubscription(index, 'customMessage', e.target.value)}
                          placeholder="اتركيها فاضية للرسالة الافتراضية. متغيرات متاحة: {child} {program} {used} {limit} {unit} {amount}"
                        />
                      </label>
                    </div>
                  ))}
                </div>
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
      {messageModal && (
        <div className="message-preview">
          <button type="button" onClick={() => setMessageModal(null)}>
            <X size={18} />
          </button>

          <h3>تعديل رسالة الواتساب</h3>

          <textarea
            value={messageModal.text}
            onChange={(e) =>
              setMessageModal({ ...messageModal, text: e.target.value })
            }
            style={{
              width: '100%',
              minHeight: '160px',
              borderRadius: '16px',
              border: '1px solid #eadcc4',
              padding: '14px',
              fontFamily: 'inherit',
              fontWeight: 700,
              lineHeight: 1.8,
              resize: 'vertical',
              marginBottom: '12px'
            }}
          />

          <div>
            <button
              type="button"
              className="primary-modal-btn"
              onClick={() => {
                navigator.clipboard.writeText(messageModal.text);
                alert('تم نسخ الرسالة');
              }}
            >
              نسخ الرسالة
            </button>

            <button
              type="button"
              className="soft-modal-btn"
              onClick={() => {
                const phone = messageModal.phones?.[0]?.replace(/[^\d]/g, '');

                if (!phone) {
                  alert('لا يوجد رقم واتساب');
                  return;
                }

                const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageModal.text)}`;
                window.open(url, '_blank');
              }}
            >
              فتح واتساب
            </button>
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

function cleanPhone(value = '') {
  return value.replace(/[^\d+]/g, '').trim();
}

function needsPayment(sub) {
  const limit = Number(sub.unitLimit || 0);
  const used = Number(sub.usedUnits || 0);
  const reminderAt = Number(sub.reminderAt || 0);
  const remaining = limit - used;

  return ['hours', 'sessions', 'custom'].includes(sub.paymentType) && remaining <= reminderAt;
}

function paymentTypeLabel(type) {
  const labels = {
    monthly: 'شهري',
    weekly: 'أسبوعي',
    hours: 'بالساعات',
    sessions: 'بالحصص',
    once: 'مرة واحدة',
    free: 'مجاني',
    custom: 'مخصص'
  };

  return labels[type] || 'مخصص';
}
