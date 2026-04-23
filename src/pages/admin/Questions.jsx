import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminCourses } from '../../api'
import { getAdminQuestions, createAdminQuestion, deleteAdminQuestion } from '../../api'

export default function Questions() {
  const { t, lang } = useI18n()
  const [questions, setQuestions] = useState([])
  const [courses, setCourses] = useState([])
  const [quizId, setQuizId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ 
    quizId: '', text: '', textEn: '', 
    options: ['', '', '', ''], optionsEn: ['', '', '', ''], correctIndex: 0 
  })

  useEffect(() => {
    loadData()
  }, [quizId])

  async function loadData() {
    setLoading(true)
    try {
      const [questionsRes, coursesRes] = await Promise.all([
        getAdminQuestions({ quizId }),
        getAdminCourses({ limit: 100 })
      ])
      setQuestions(questionsRes.questions || [])
      setCourses(coursesRes.courses || [])
    } catch (err) {
      console.error('Load error:', err)
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await createAdminQuestion({
        quizId: form.quizId,
        text: form.text,
        textEn: form.textEn,
        options: form.options,
        optionsEn: form.optionsEn,
        correctIndex: form.correctIndex
      })
      setShowModal(false)
      setForm({ quizId: '', text: '', textEn: '', options: ['', '', '', ''], optionsEn: ['', '', '', ''], correctIndex: 0 })
      loadData()
    } catch (err) {
      alert(t('msg.error'))
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('msg.confirmDelete'))) return
    try {
      await deleteAdminQuestion(id)
      loadData()
    } catch (err) {
      alert(t('msg.error'))
    }
  }

  function openAdd() {
    setForm({ quizId: quizId || courses[0]?.id || '', text: '', textEn: '', options: ['', '', '', ''], optionsEn: ['', '', '', ''], correctIndex: 0 })
    setShowModal(true)
  }

  function updateOption(index, value, isEn = false) {
    const newOptions = [...(isEn ? form.optionsEn : form.options)]
    newOptions[index] = value
    setForm({ ...form, [isEn ? 'optionsEn' : 'options']: newOptions })
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{t('nav.questions')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('actions.add')}</button>
      </div>

      <div className="search-bar" style={{ marginBottom: '24px' }}>
        <select 
          value={quizId} 
          onChange={(e) => setQuizId(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)', minWidth: '240px' }}
        >
          <option value="">{t('actions.allCourses') || 'All Courses'}</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading">{t('msg.loading')}</div>
      ) : questions.length === 0 ? (
        <div className="no-data">{t('msg.noData')}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th width="60">#</th>
              <th>Question</th>
              <th>Course</th>
              <th width="100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.id}>
                <td>{idx + 1}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{lang === 'ar' ? q.text : q.textEn}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Options: {(typeof q.options === 'string' ? JSON.parse(q.options) : q.options)?.join(' | ')}
                  </div>
                </td>
                <td>{q.quiz?.course?.title || '-'}</td>
                <td>
                  <button className="action-btn delete" onClick={() => handleDelete(q.id)} title={t('actions.delete')}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('actions.add')} Question</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course</label>
                <select value={form.quizId} onChange={(e) => setForm({...form, quizId: e.target.value})} required>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Question (Arabic)</label>
                <input type="text" value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Question (English)</label>
                <input type="text" value={form.textEn} onChange={(e) => setForm({...form, textEn: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Options</label>
                {form.options.map((opt, i) => (
                  <input key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} 
                    onChange={(e) => updateOption(i, e.target.value, false)} required />
                ))}
              </div>
              <div className="form-group">
                <label>Options (English)</label>
                {form.optionsEn.map((opt, i) => (
                  <input key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} 
                    onChange={(e) => updateOption(i, e.target.value, true)} required />
                ))}
              </div>
              <div className="form-group">
                <label>Correct Answer Index (0-3)</label>
                <input type="number" min="0" max="3" value={form.correctIndex} 
                  onChange={(e) => setForm({...form, correctIndex: parseInt(e.target.value)})} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>{t('actions.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}