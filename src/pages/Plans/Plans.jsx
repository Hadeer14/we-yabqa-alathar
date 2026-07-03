import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  Layers3,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Trophy,
  UsersRound,
  X
} from 'lucide-react';
import './Plans.css';

const seasonsSeed = [
  { id: 1, name: 'الكامب الصيفي 2026', start: '2026-07-01', end: '2026-08-31', status: 'active' },
  { id: 2, name: 'حلقات الحفظ - الترم الأول', start: '2026-09-01', end: '2026-12-31', status: 'draft' },
];

const topicTypes = [
  { type: 'quran', axis: 'القرآن', icon: '📖', hints: ['حفظ سورة العصر', 'مراجعة سورة الضحى', 'تسميع فردي', 'تثبيت آخر 5 آيات'] },
  { type: 'seerah', axis: 'السيرة', icon: '🕌', hints: ['قصة الهجرة', 'مولد النبي ﷺ', 'خلق الصدق', 'رحلة الطائف'] },
  { type: 'hadith', axis: 'الحديث', icon: '🌿', hints: ['إنما الأعمال بالنيات', 'تبسمك في وجه أخيك صدقة', 'المؤمن للمؤمن كالبنيان'] },
  { type: 'basics', axis: 'ما لا يسع المسلم جهله', icon: '📚', hints: ['أركان الإسلام', 'آداب الطعام', 'الوضوء', 'الصلاة ببساطة'] },
  { type: 'companions', axis: 'الصحابة والقدوات', icon: '⭐', hints: ['أبو بكر الصديق', 'عمر بن الخطاب', 'خديجة رضي الله عنها', 'مصعب بن عمير'] },
  { type: 'crafts', axis: 'أنشطة فنية', icon: '🎨', hints: ['تلوين', 'قص ولصق', 'لوحة القيم', 'كروشيه بسيط'] },
  { type: 'crochet', axis: 'كروشيه', icon: '🧶', hints: ['غرزة البداية', 'سلسلة بسيطة', 'عمل إسوارة صغيرة', 'تطبيق فردي بالخيط'] },
  { type: 'colors', axis: 'ألوان', icon: '🖍️', hints: ['تلوين بطاقة قيمة اليوم', 'دمج الألوان', 'لوحة جماعية', 'رسم حر'] },
  { type: 'games', axis: 'ألعاب', icon: '🎮', hints: ['لعبة الكنز', 'سباق التعاون', 'لعبة البطاقات', 'بناء الجسر'] },
  { type: 'custom', axis: 'توبك مخصص', icon: '✨', hints: ['مسابقة ثقافية', 'ورشة زراعة', 'تجربة علمية'] },
];

const campTemplate = topicTypes.filter((item) => ['quran', 'seerah', 'hadith', 'basics', 'companions', 'crafts', 'crochet', 'colors', 'games'].includes(item.type));
const quranTemplate = topicTypes.filter((item) => ['quran'].includes(item.type));

const planTemplatesSeed = [
  { id: 'camp-full', name: 'قالب الكامب الكامل', programType: 'camp', desc: 'قرآن، سيرة، حديث، ما لا يسع المسلم جهله، صحابة، كروشيه، ألوان، ألعاب.', topicTypes: ['quran', 'seerah', 'hadith', 'basics', 'companions', 'crafts', 'crochet', 'colors', 'games'] },
  { id: 'quran-hour', name: 'قالب حلقة حفظ ساعة', programType: 'quran', desc: 'حفظ جديد، مراجعة، وتسميع فقط للطلبة اللي بييجوا ساعة ويمشوا.', topicTypes: ['quran'] },
  { id: 'camp-light', name: 'قالب كامب خفيف', programType: 'camp', desc: 'نسخة أقل زحمة لليوم القصير: قرآن + قيمة + نشاط + لعبة.', topicTypes: ['quran', 'hadith', 'crafts', 'games'] },
];

function makeTopic(typeItem, title = '') {
  return {
    id: Date.now() + Math.random(),
    type: typeItem.type,
    axis: typeItem.axis,
    icon: typeItem.icon,
    title: title || typeItem.hints[0] || typeItem.axis,
    status: 'pending',
    notes: '',
    items: title ? [title] : [],
  };
}

const dailySeed = [
  {
    id: 1,
    day: 'السبت',
    date: '5 يوليو',
    programType: 'camp',
    group: 'الكامب الصيفي - براعم',
    teacher: 'أ. سارة',
    topics: [
      { id: 11, type: 'quran', axis: 'القرآن', icon: '📖', title: 'سورة العصر', status: 'pending', notes: 'حفظ ومراجعة جماعية', items: ['حفظ سورة العصر', 'مراجعة سورة الضحى'] },
      { id: 12, type: 'seerah', axis: 'السيرة', icon: '🕌', title: 'قصة الهجرة', status: 'done', notes: 'حكي مبسط مع أسئلة', items: ['من هو صاحب النبي ﷺ في الهجرة؟', 'معنى التوكل'] },
      { id: 13, type: 'hadith', axis: 'الحديث', icon: '🌿', title: 'تبسمك في وجه أخيك صدقة', status: 'pending', notes: 'تطبيق عملي بين الأطفال', items: ['شرح معنى الصدقة', 'موقف تمثيلي قصير'] },
      { id: 14, type: 'crafts', axis: 'أنشطة فنية', icon: '🎨', title: 'كروشيه وألوان', status: 'pending', notes: 'تجهيز ألوان وخيوط', items: ['تلوين بطاقة قيمة اليوم', 'كروشيه بسيط'] },
      { id: 15, type: 'games', axis: 'ألعاب', icon: '🎮', title: 'لعبة بناء الجسر', status: 'pending', notes: 'لعبة تعاون بدون ربط بساعة', items: ['تقسيم فرق', 'تقييم التعاون'] },
    ],
  },
  {
    id: 2,
    day: 'الأحد',
    date: '6 يوليو',
    programType: 'quran',
    group: 'حلقة حفظ - ساعة واحدة',
    teacher: 'أ. منى',
    topics: [
      { id: 21, type: 'quran', axis: 'القرآن', icon: '📖', title: 'حفظ ومراجعة فقط', status: 'pending', notes: 'الطالب يقرأ ويسمع ويمشي', items: ['حفظ جديد', 'مراجعة قديمة', 'تسميع فردي'] },
    ],
  },
];

const monthlySeed = [
  { id: 1, axis: 'القرآن الكريم', icon: '📖', items: ['سورة العصر', 'سورة الضحى', 'مراجعة قصيرة أسبوعية'] },
  { id: 2, axis: 'السيرة والحديث', icon: '🕌', items: ['قصة الهجرة', 'حديث تبسمك في وجه أخيك صدقة', 'خلق الصدق'] },
  { id: 3, axis: 'ما لا يسع المسلم جهله', icon: '📚', items: ['آداب الطعام', 'الوضوء', 'أركان الإسلام'] },
  { id: 4, axis: 'الأنشطة والفعاليات', icon: '🎨', items: ['كروشيه وألوان', 'أشغال يدوية', 'ألعاب تعاون'] },
];

const emptyTopic = { type: 'custom', axis: '', icon: '✨', title: '', status: 'pending', notes: '', itemsText: '' };
const emptyMonthly = { axis: '', icon: '🌱', itemsText: '' };
const emptySeason = { name: '', start: '', end: '', status: 'draft' };
const emptyDay = { day: '', date: '', group: '', teacher: '', programType: 'camp', templateId: 'camp-full' };
const emptyTemplate = { name: '', programType: 'camp', desc: '', topicTypes: ['quran', 'seerah', 'hadith', 'basics', 'companions'] };

export default function Plans() {
  const [activeTab, setActiveTab] = useState('daily');
  const [seasons, setSeasons] = useState(seasonsSeed);
  const [activeSeason, setActiveSeason] = useState(1);
  const [dailyPlan, setDailyPlan] = useState(dailySeed);
  const [monthlyPlan, setMonthlyPlan] = useState(monthlySeed);
  const [topicLibrary, setTopicLibrary] = useState(() => topicTypes.flatMap((typeItem) => typeItem.hints.map((hint, index) => ({ id: `${typeItem.type}-${index}`, type: typeItem.type, axis: typeItem.axis, icon: typeItem.icon, title: hint }))));
  const [topicModal, setTopicModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const [monthlyModal, setMonthlyModal] = useState(null);
  const [seasonModal, setSeasonModal] = useState(false);
  const [dayModal, setDayModal] = useState(false);
  const [topicForm, setTopicForm] = useState(emptyTopic);
  const [contentText, setContentText] = useState('');
  const [monthlyForm, setMonthlyForm] = useState(emptyMonthly);
  const [seasonForm, setSeasonForm] = useState(emptySeason);
  const [dayForm, setDayForm] = useState(emptyDay);
  const [planTemplates, setPlanTemplates] = useState(planTemplatesSeed);
  const [templateModal, setTemplateModal] = useState(null);
  const [templateForm, setTemplateForm] = useState(emptyTemplate);
  const [libraryQuery, setLibraryQuery] = useState('');

  const totalTopics = dailyPlan.reduce((sum, day) => sum + day.topics.length, 0);
  const doneTopics = dailyPlan.reduce((sum, day) => sum + day.topics.filter((topic) => topic.status === 'done').length, 0);
  const delayedTopics = dailyPlan.reduce((sum, day) => sum + day.topics.filter((topic) => topic.status === 'delayed').length, 0);

  const filteredLibrary = useMemo(() => topicLibrary.filter((topic) => `${topic.axis} ${topic.title}`.includes(libraryQuery)), [topicLibrary, libraryQuery]);

  function getTypeItem(type) {
    return topicTypes.find((item) => item.type === type) || topicTypes.at(-1);
  }

  function suggestionsFor(topic, day) {
    const source = getTypeItem(topic.type).hints;
    return source.filter((item) => !topic.items.includes(item) && item !== topic.title && !day.topics.some((t) => t.id !== topic.id && (t.title === item || t.items.includes(item)))).slice(0, 3);
  }

  function openAddTopic(dayId) {
    setTopicModal({ mode: 'add', dayId });
    setTopicForm(emptyTopic);
    setLibraryQuery('');
  }

  function openEditTopic(dayId, topic) {
    setTopicModal({ mode: 'edit', dayId, topicId: topic.id });
    setTopicForm({
      type: topic.type || 'custom',
      axis: topic.axis,
      icon: topic.icon || '✨',
      title: topic.title,
      status: topic.status,
      notes: topic.notes || '',
      itemsText: (topic.items || []).join('\n'),
    });
  }

  function updateTopicType(type) {
    const typeItem = getTypeItem(type);
    setTopicForm((prev) => ({ ...prev, type, axis: typeItem.axis, icon: typeItem.icon }));
  }

  function saveTopic() {
    if (!topicForm.axis.trim() || !topicForm.title.trim()) return alert('اكتبي نوع التوبك والعنوان');
    const items = topicForm.itemsText.split('\n').map((item) => item.trim()).filter(Boolean);
    const payload = { type: topicForm.type, axis: topicForm.axis, icon: topicForm.icon, title: topicForm.title, status: topicForm.status, notes: topicForm.notes, items };

    setDailyPlan((prev) => prev.map((day) => {
      if (day.id !== topicModal.dayId) return day;
      if (topicModal.mode === 'edit') return { ...day, topics: day.topics.map((topic) => topic.id === topicModal.topicId ? { ...topic, ...payload } : topic) };
      return { ...day, topics: [{ id: Date.now(), ...payload }, ...day.topics] };
    }));

    const exists = topicLibrary.some((topic) => topic.title === topicForm.title && topic.axis === topicForm.axis);
    if (!exists) setTopicLibrary((prev) => [{ id: Date.now(), type: topicForm.type, axis: topicForm.axis, icon: topicForm.icon, title: topicForm.title }, ...prev]);
    setTopicModal(null);
  }

  function addFromLibrary(topic) {
    setTopicForm({ type: topic.type, axis: topic.axis, icon: topic.icon, title: topic.title, status: 'pending', notes: '', itemsText: topic.title });
  }

  function deleteTopic(dayId, topicId) {
    if (!confirm('حذف هذا التوبك من الخطة اليومية؟')) return;
    setDailyPlan((prev) => prev.map((day) => day.id === dayId ? { ...day, topics: day.topics.filter((topic) => topic.id !== topicId) } : day));
  }

  function toggleStatus(dayId, topicId, status) {
    setDailyPlan((prev) => prev.map((day) => day.id === dayId ? { ...day, topics: day.topics.map((topic) => topic.id === topicId ? { ...topic, status } : topic) } : day));
  }

  function moveTopic(dayId, topicId, direction) {
    setDailyPlan((prev) => prev.map((day) => {
      if (day.id !== dayId) return day;
      const index = day.topics.findIndex((topic) => topic.id === topicId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= day.topics.length) return day;
      const topics = [...day.topics];
      [topics[index], topics[nextIndex]] = [topics[nextIndex], topics[index]];
      return { ...day, topics };
    }));
  }

  function addSuggestion(dayId, topicId, suggestion) {
    setDailyPlan((prev) => prev.map((day) => day.id === dayId ? {
      ...day,
      topics: day.topics.map((topic) => topic.id === topicId ? { ...topic, items: [...new Set([...(topic.items || []), suggestion])] } : topic),
    } : day));
  }

  function openContent(dayId, topic) {
    setContentModal({ dayId, topicId: topic.id, title: topic.title });
    setContentText('');
  }

  function saveContent() {
    if (!contentText.trim()) return;
    setDailyPlan((prev) => prev.map((day) => day.id === contentModal.dayId ? {
      ...day,
      topics: day.topics.map((topic) => topic.id === contentModal.topicId ? { ...topic, items: [...(topic.items || []), contentText.trim()] } : topic),
    } : day));
    setContentModal(null);
  }

  function removeContent(dayId, topicId, item) {
    setDailyPlan((prev) => prev.map((day) => day.id === dayId ? {
      ...day,
      topics: day.topics.map((topic) => topic.id === topicId ? { ...topic, items: topic.items.filter((x) => x !== item) } : topic),
    } : day));
  }

  function createDayFromTemplate() {
    if (!dayForm.day.trim() || !dayForm.date.trim()) return alert('اكتبي اليوم والتاريخ');
    const pickedTemplate = planTemplates.find((template) => template.id === dayForm.templateId);
    const topicKeys = pickedTemplate?.topicTypes?.length ? pickedTemplate.topicTypes : (dayForm.programType === 'camp' ? campTemplate.map((x) => x.type) : quranTemplate.map((x) => x.type));
    const templateTopics = topicKeys.map((type) => getTypeItem(type));
    const newDay = { id: Date.now(), ...dayForm, programType: pickedTemplate?.programType || dayForm.programType, topics: templateTopics.map((item) => makeTopic(item)) };
    setDailyPlan((prev) => [newDay, ...prev]);
    setDayModal(false);
    setDayForm(emptyDay);
  }

  function openAddTemplate() {
    setTemplateModal({ mode: 'add' });
    setTemplateForm(emptyTemplate);
  }

  function openEditTemplate(template) {
    setTemplateModal({ mode: 'edit', id: template.id });
    setTemplateForm({ name: template.name, programType: template.programType, desc: template.desc, topicTypes: template.topicTypes });
  }

  function toggleTemplateTopic(type) {
    setTemplateForm((prev) => ({
      ...prev,
      topicTypes: prev.topicTypes.includes(type) ? prev.topicTypes.filter((item) => item !== type) : [...prev.topicTypes, type],
    }));
  }

  function saveTemplate() {
    if (!templateForm.name.trim()) return alert('اكتبي اسم القالب');
    if (!templateForm.topicTypes.length) return alert('اختاري توبك واحد على الأقل');
    if (templateModal.mode === 'edit') {
      setPlanTemplates((prev) => prev.map((template) => template.id === templateModal.id ? { ...template, ...templateForm } : template));
    } else {
      setPlanTemplates((prev) => [{ id: Date.now(), ...templateForm }, ...prev]);
    }
    setTemplateModal(null);
  }

  function deleteTemplate(id) {
    if (!confirm('حذف قالب الخطة؟')) return;
    setPlanTemplates((prev) => prev.filter((template) => template.id !== id));
    if (dayForm.templateId === id) setDayForm((prev) => ({ ...prev, templateId: 'camp-full' }));
  }

  function openAddMonthly() { setMonthlyModal({ mode: 'add' }); setMonthlyForm(emptyMonthly); }
  function openEditMonthly(section) { setMonthlyModal({ mode: 'edit', id: section.id }); setMonthlyForm({ axis: section.axis, icon: section.icon, itemsText: section.items.join('\n') }); }
  function saveMonthly() {
    if (!monthlyForm.axis.trim()) return alert('اكتبي اسم المحور');
    const items = monthlyForm.itemsText.split('\n').map((item) => item.trim()).filter(Boolean);
    if (monthlyModal.mode === 'edit') setMonthlyPlan((prev) => prev.map((section) => section.id === monthlyModal.id ? { ...section, axis: monthlyForm.axis, icon: monthlyForm.icon, items } : section));
    else setMonthlyPlan((prev) => [{ id: Date.now(), axis: monthlyForm.axis, icon: monthlyForm.icon, items }, ...prev]);
    setMonthlyModal(null);
  }
  function deleteMonthly(id) { if (confirm('حذف هذا المحور من خطة ولي الأمر؟')) setMonthlyPlan((prev) => prev.filter((section) => section.id !== id)); }
  function saveSeason() {
    if (!seasonForm.name.trim()) return alert('اكتبي اسم الموسم');
    const newSeason = { id: Date.now(), ...seasonForm };
    setSeasons((prev) => [newSeason, ...prev]); setActiveSeason(newSeason.id); setSeasonModal(false); setSeasonForm(emptySeason);
  }

  const seasonName = seasons.find((season) => season.id === activeSeason)?.name || 'بدون موسم';

  return (
    <div className="plans-page">
      <section className="plans-hero">
        <div>
          <span><CalendarDays size={17} /> إدارة المحتوى والخطط</span>
          <h2>يوم مرن للكامب، وحلقات حفظ بسيطة بدون تعقيد.</h2>
          <p>أضيفي قرآن، سيرة، حديث، صحابة، أنشطة، ألعاب أو أي توبك مخصص بحرية كاملة.</p>
        </div>
        <div className="plans-hero-actions">
          <button type="button" onClick={() => setDayModal(true)}><Plus size={19} /> يوم جديد</button>
          <button type="button" onClick={openAddTemplate}><ClipboardList size={19} /> قالب جديد</button>
          <button type="button" onClick={() => setSeasonModal(true)}><Layers3 size={19} /> موسم جديد</button>
          <button type="button" onClick={() => setActiveTab('parent')}><Eye size={19} /> معاينة ولي الأمر</button>
        </div>
      </section>

      <section className="season-bar">
        <div>
          <label>الموسم الحالي</label>
          <select value={activeSeason} onChange={(e) => setActiveSeason(Number(e.target.value))}>
            {seasons.map((season) => <option key={season.id} value={season.id}>{season.name}</option>)}
          </select>
        </div>
        <div className="season-info"><Layers3 size={21} /><b>{seasonName}</b><span>الخطط اليومية والشهرية داخل نفس الموسم</span></div>
      </section>

      <section className="plans-tabs">
        <button type="button" className={activeTab === 'daily' ? 'active' : ''} onClick={() => setActiveTab('daily')}>الخطة اليومية للمعلمات</button>
        <button type="button" className={activeTab === 'parent' ? 'active' : ''} onClick={() => setActiveTab('parent')}>الخطة الشهرية لولي الأمر</button>
        <button type="button" className={activeTab === 'library' ? 'active' : ''} onClick={() => setActiveTab('library')}>مكتبة التوبكس</button>
        <button type="button" className={activeTab === 'templates' ? 'active' : ''} onClick={() => setActiveTab('templates')}>قوالب الخطط</button>
      </section>

      {activeTab === 'daily' && (
        <>
          <section className="plan-stats">
            <StatCard label="أيام مخططة" value={dailyPlan.length} />
            <StatCard label="إجمالي التوبكس" value={totalTopics} />
            <StatCard label="تم التنفيذ" value={doneTopics} />
            <StatCard label="مؤجل / لم يتم" value={delayedTopics} />
            <StatCard label="نسبة التنفيذ" value={`${totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0}%`} />
          </section>

          <section className="template-strip">
            {planTemplates.slice(0, 3).map((template) => (
              <article key={template.id}>
                <b>{template.programType === 'camp' ? '🏕️' : '📖'} {template.name}</b>
                <span>{template.desc}</span>
              </article>
            ))}
          </section>

          <section className="daily-board">
            {dailyPlan.map((day) => (
              <article className="daily-card" key={day.id}>
                <div className="daily-head">
                  <div>
                    <span>{day.programType === 'camp' ? '🏕️ كامب' : '📖 حلقة حفظ'} • {day.day}</span>
                    <h3>{day.date}</h3>
                    <p>{day.group} • {day.teacher}</p>
                  </div>
                  <button type="button" onClick={() => openAddTopic(day.id)}><Plus size={18} /></button>
                </div>

                <div className="daily-topic-list">
                  {day.topics.map((topic, index) => {
                    const suggestions = suggestionsFor(topic, day);
                    return (
                      <div className={`daily-topic ${topic.status}`} key={topic.id}>
                        <div className="topic-status"><span>{topic.icon}</span><button type="button" onClick={() => toggleStatus(day.id, topic.id, 'done')}><CheckCircle2 size={17} /></button></div>
                        <div className="topic-content">
                          <span>{topic.axis}</span>
                          <b>{topic.title}</b>
                          {topic.notes && <p>{topic.notes}</p>}

                          {!!topic.items?.length && <ul className="topic-items">{topic.items.map((item) => <li key={item}>{item}<button type="button" onClick={() => removeContent(day.id, topic.id, item)}>×</button></li>)}</ul>}

                          <div className="status-pills">
                            <button type="button" className={topic.status === 'done' ? 'active' : ''} onClick={() => toggleStatus(day.id, topic.id, 'done')}>تم</button>
                            <button type="button" className={topic.status === 'pending' ? 'active' : ''} onClick={() => toggleStatus(day.id, topic.id, 'pending')}>قيد التنفيذ</button>
                            <button type="button" className={topic.status === 'delayed' ? 'active' : ''} onClick={() => toggleStatus(day.id, topic.id, 'delayed')}>لم يتم</button>
                          </div>

                          <div className="suggestions-row">
                            <small><Sparkles size={13} /> اقتراحات</small>
                            {suggestions.length ? suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => addSuggestion(day.id, topic.id, suggestion)}>+ {suggestion}</button>) : <em>لا توجد اقتراحات مكررة</em>}
                          </div>
                        </div>
                        <div className="topic-actions">
                          <button type="button" onClick={() => moveTopic(day.id, topic.id, -1)} disabled={index === 0}><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveTopic(day.id, topic.id, 1)} disabled={index === day.topics.length - 1}><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => openContent(day.id, topic)}><Plus size={15} /></button>
                          <button type="button" onClick={() => openEditTopic(day.id, topic)}><Edit3 size={15} /></button>
                          <button type="button" onClick={() => deleteTopic(day.id, topic.id)}><Trash2 size={15} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button type="button" className="add-topic-line" onClick={() => openAddTopic(day.id)}><Plus size={16} /> إضافة توبك لليوم</button>
              </article>
            ))}
          </section>
        </>
      )}

      {activeTab === 'parent' && (
        <section className="parent-preview">
          <div className="parent-preview-head">
            <div><span>معاينة ولي الأمر</span><h3>خطة شهر يوليو</h3><p>نسخة مبسطة بدون تفاصيل داخلية، تشبه الإنفوجرافيك.</p></div>
            <button type="button" onClick={openAddMonthly}><Plus size={18} /> إضافة محور</button>
          </div>
          <div className="parent-grid">
            {monthlyPlan.map((section) => <article className="parent-card" key={section.id}><div className="parent-icon">{section.icon}</div><h4>{section.axis}</h4><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul><div className="parent-actions"><button type="button" onClick={() => openEditMonthly(section)}><Edit3 size={15} /> تعديل</button><button type="button" className="danger" onClick={() => deleteMonthly(section.id)}><Trash2 size={15} /> حذف</button></div></article>)}
          </div>
          <div className="parent-events"><h4>المناسبات والفعاليات</h4><div><article><Trophy size={22} /><b>مسابقة الحفظ</b><span>10 يوليو</span></article><article><Sparkles size={22} /><b>يوم فني</b><span>20 يوليو</span></article><article><UsersRound size={22} /><b>حفل ختام البرنامج</b><span>31 يوليو</span></article></div></div>
        </section>
      )}

      {activeTab === 'templates' && (
        <section className="library-panel templates-panel">
          <div className="library-head">
            <div><h3>قوالب الخطط داخل السيستم</h3><p>اعملي قالب للكامب، قالب للحفظ، أو أي قالب خاص. عند إنشاء يوم جديد تختاري القالب ويتبني اليوم تلقائيًا.</p></div>
            <button type="button" className="library-add-btn" onClick={openAddTemplate}><Plus size={18} /> إضافة قالب</button>
          </div>
          <div className="templates-grid">
            {planTemplates.map((template) => (
              <article key={template.id} className="template-card">
                <div className="template-card-head"><span>{template.programType === 'camp' ? '🏕️ كامب' : '📖 حلقة'}</span><b>{template.name}</b></div>
                <p>{template.desc}</p>
                <div className="template-topic-chips">
                  {template.topicTypes.map((type) => { const item = getTypeItem(type); return <span key={type}>{item.icon} {item.axis}</span>; })}
                </div>
                <div className="parent-actions">
                  <button type="button" onClick={() => openEditTemplate(template)}><Edit3 size={15} /> تعديل</button>
                  <button type="button" className="danger" onClick={() => deleteTemplate(template.id)}><Trash2 size={15} /> حذف</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'library' && <section className="library-panel"><div className="library-head"><div><h3>مكتبة التوبكس</h3><p>كل توبك جديد يتضاف في الخطة اليومية يتحفظ هنا تلقائيًا.</p></div><div className="library-search"><Search size={17} /><input value={libraryQuery} onChange={(e) => setLibraryQuery(e.target.value)} placeholder="بحث في المكتبة..." /></div></div><div className="library-list">{filteredLibrary.map((topic) => <article key={topic.id}><span>{topic.icon} {topic.axis}</span><b>{topic.title}</b></article>)}</div></section>}

      {topicModal && <TopicModal topicModal={topicModal} topicForm={topicForm} setTopicForm={setTopicForm} saveTopic={saveTopic} close={() => setTopicModal(null)} updateTopicType={updateTopicType} filteredLibrary={filteredLibrary} addFromLibrary={addFromLibrary} libraryQuery={libraryQuery} setLibraryQuery={setLibraryQuery} />}

      {contentModal && <div className="plans-modal-backdrop"><div className="plans-modal"><button type="button" className="modal-close" onClick={() => setContentModal(null)}><X size={19} /></button><h3>إضافة محتوى داخل التوبك</h3><p>{contentModal.title}</p><label><span>المحتوى</span><input value={contentText} onChange={(e) => setContentText(e.target.value)} placeholder="مثال: نشاط تلوين / سؤال / حفظ جديد" /></label><button type="button" className="save-topic-btn" onClick={saveContent}>إضافة</button></div></div>}

      {monthlyModal && <div className="plans-modal-backdrop"><div className="plans-modal"><button type="button" className="modal-close" onClick={() => setMonthlyModal(null)}><X size={19} /></button><h3>{monthlyModal.mode === 'edit' ? 'تعديل محور ولي الأمر' : 'إضافة محور جديد'}</h3><p>هذه البيانات تظهر لولي الأمر في الخطة الشهرية بشكل مبسط.</p><label><span>الأيقونة</span><input value={monthlyForm.icon} onChange={(e) => setMonthlyForm({ ...monthlyForm, icon: e.target.value })} placeholder="📖" /></label><label><span>اسم المحور</span><input value={monthlyForm.axis} onChange={(e) => setMonthlyForm({ ...monthlyForm, axis: e.target.value })} placeholder="القرآن الكريم" /></label><label><span>العناصر</span><textarea value={monthlyForm.itemsText} onChange={(e) => setMonthlyForm({ ...monthlyForm, itemsText: e.target.value })} placeholder={'سورة العصر\nقصة الهجرة\nكروشيه وألوان'} /></label><button type="button" className="save-topic-btn" onClick={saveMonthly}>حفظ المحور</button></div></div>}

      {seasonModal && <div className="plans-modal-backdrop"><div className="plans-modal"><button type="button" className="modal-close" onClick={() => setSeasonModal(false)}><X size={19} /></button><h3>إضافة موسم جديد</h3><p>الموسم يساعدك تفصلي الكامب الصيفي عن حلقات الحفظ أو أي برنامج آخر.</p><label><span>اسم الموسم</span><input value={seasonForm.name} onChange={(e) => setSeasonForm({ ...seasonForm, name: e.target.value })} placeholder="مثال: برنامج رمضان" /></label><label><span>تاريخ البداية</span><input type="date" value={seasonForm.start} onChange={(e) => setSeasonForm({ ...seasonForm, start: e.target.value })} /></label><label><span>تاريخ النهاية</span><input type="date" value={seasonForm.end} onChange={(e) => setSeasonForm({ ...seasonForm, end: e.target.value })} /></label><button type="button" className="save-topic-btn" onClick={saveSeason}>حفظ الموسم</button></div></div>}

      {templateModal && <div className="plans-modal-backdrop"><div className="plans-modal wide"><button type="button" className="modal-close" onClick={() => setTemplateModal(null)}><X size={19} /></button><h3>{templateModal.mode === 'edit' ? 'تعديل قالب خطة' : 'إضافة قالب خطة'}</h3><p>القالب هو شكل اليوم الجاهز داخل السيستم. تقدري تضيفي أو تشيلي أي توبك حسب البرنامج.</p><label><span>اسم القالب</span><input value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} placeholder="قالب الكامب الكامل" /></label><label><span>نوع البرنامج</span><select value={templateForm.programType} onChange={(e) => setTemplateForm({ ...templateForm, programType: e.target.value })}><option value="camp">كامب صيفي كامل</option><option value="quran">حلقة حفظ / قراءة ساعة</option></select></label><label><span>وصف مختصر</span><textarea value={templateForm.desc} onChange={(e) => setTemplateForm({ ...templateForm, desc: e.target.value })} placeholder="يظهر للمدير والمعلمات لتوضيح استخدام القالب" /></label><div className="template-builder"><h4>اختاري التوبكس الموجودة في القالب</h4><div>{topicTypes.filter((topic) => topic.type !== 'custom').map((topic) => <button type="button" key={topic.type} className={templateForm.topicTypes.includes(topic.type) ? 'active' : ''} onClick={() => toggleTemplateTopic(topic.type)}>{topic.icon} {topic.axis}</button>)}</div></div><button type="button" className="save-topic-btn" onClick={saveTemplate}>حفظ القالب</button></div></div>}

      {dayModal && <div className="plans-modal-backdrop"><div className="plans-modal"><button type="button" className="modal-close" onClick={() => setDayModal(false)}><X size={19} /></button><h3>إنشاء يوم جديد</h3><p>اختاري القالب، والنظام يجهز التوبكس المناسبة تلقائيًا داخل الخطة اليومية.</p><label><span>قالب اليوم</span><select value={dayForm.templateId} onChange={(e) => { const template = planTemplates.find((x) => String(x.id) === e.target.value); setDayForm({ ...dayForm, templateId: e.target.value, programType: template?.programType || dayForm.programType }); }}>{planTemplates.map((template) => <option key={template.id} value={template.id}>{template.programType === 'camp' ? '🏕️' : '📖'} {template.name}</option>)}</select></label><label><span>نوع البرنامج</span><select value={dayForm.programType} onChange={(e) => setDayForm({ ...dayForm, programType: e.target.value })}><option value="camp">كامب صيفي كامل</option><option value="quran">حلقة حفظ / قراءة ساعة</option></select></label><label><span>اليوم</span><input value={dayForm.day} onChange={(e) => setDayForm({ ...dayForm, day: e.target.value })} placeholder="الاثنين" /></label><label><span>التاريخ</span><input value={dayForm.date} onChange={(e) => setDayForm({ ...dayForm, date: e.target.value })} placeholder="7 يوليو" /></label><label><span>المجموعة</span><input value={dayForm.group} onChange={(e) => setDayForm({ ...dayForm, group: e.target.value })} placeholder="براعم - المستوى الأول" /></label><label><span>المعلمة</span><input value={dayForm.teacher} onChange={(e) => setDayForm({ ...dayForm, teacher: e.target.value })} placeholder="أ. سارة" /></label><button type="button" className="save-topic-btn" onClick={createDayFromTemplate}>إنشاء اليوم</button></div></div>}
    </div>
  );
}

function TopicModal({ topicModal, topicForm, setTopicForm, saveTopic, close, updateTopicType, filteredLibrary, addFromLibrary, libraryQuery, setLibraryQuery }) {
  return (
    <div className="plans-modal-backdrop">
      <div className="plans-modal wide">
        <button type="button" className="modal-close" onClick={close}><X size={19} /></button>
        <h3>{topicModal.mode === 'edit' ? 'تعديل توبك يومي' : 'إضافة توبك لليوم'}</h3>
        <p>اختاري نوع التوبك أو اكتبي توبك مخصص، من غير ربطه بساعة محددة.</p>
        <div className="topic-modal-grid">
          <div className="topic-form">
            <label><span>نوع التوبك</span><select value={topicForm.type} onChange={(e) => updateTopicType(e.target.value)}>{topicTypes.map((type) => <option key={type.type} value={type.type}>{type.icon} {type.axis}</option>)}</select></label>
            <label><span>اسم المحور</span><input value={topicForm.axis} onChange={(e) => setTopicForm({ ...topicForm, axis: e.target.value })} placeholder="قرآن / سيرة / حديث..." /></label>
            <label><span>عنوان التوبك</span><input value={topicForm.title} onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })} placeholder="قصة الهجرة" /></label>
            <label><span>حالة التنفيذ</span><select value={topicForm.status} onChange={(e) => setTopicForm({ ...topicForm, status: e.target.value })}><option value="pending">قيد التنفيذ</option><option value="done">تم التنفيذ</option><option value="delayed">لم يتم / مؤجل</option></select></label>
            <label><span>المحتوى الداخلي / الأنشطة</span><textarea value={topicForm.itemsText} onChange={(e) => setTopicForm({ ...topicForm, itemsText: e.target.value })} placeholder={'حفظ سورة العصر\nلعبة ترتيب الآيات\nتلوين بطاقة'} /></label>
            <label><span>ملاحظات المعلمة</span><textarea value={topicForm.notes} onChange={(e) => setTopicForm({ ...topicForm, notes: e.target.value })} placeholder="أدوات مطلوبة، طريقة الشرح، ملاحظات..." /></label>
          </div>
          <div className="library-picker"><h4>اختيار من مكتبة التوبكس</h4><div className="library-search small"><Search size={17} /><input value={libraryQuery} onChange={(e) => setLibraryQuery(e.target.value)} placeholder="بحث..." /></div><div className="picker-list">{filteredLibrary.slice(0, 10).map((topic) => <button type="button" key={topic.id} onClick={() => addFromLibrary(topic)}><span>{topic.icon} {topic.axis}</span><b>{topic.title}</b></button>)}</div></div>
        </div>
        <button type="button" className="save-topic-btn" onClick={saveTopic}>حفظ التوبك</button>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return <article className="plan-stat-card"><b>{value}</b><span>{label}</span></article>;
}
