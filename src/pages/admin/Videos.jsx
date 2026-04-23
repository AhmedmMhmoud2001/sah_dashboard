import { useState, useEffect } from 'react'
import { Edit, Trash2, ExternalLink } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminCourses, getAdminLessons, createAdminLesson, updateAdminLesson, deleteAdminLesson } from '../../api'

export default function Videos() {
  const { t } = useI18n()
  const [lessons, setLessons] = useState([])
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [form, setForm] = useState({ title: '', enTitle: '', duration: '', videoUrl: '', sortOrder: 1, courseId: '' })

  useEffect(() => {
    loadData()
  }, [courseId])

  async function loadData() {
    setLoading(true)
    try {
      const [lessonsRes, coursesRes] = await Promise.all([
        getAdminLessons({ courseId }),
        getAdminCourses({ limit: 100 })
      ])
      setLessons(lessonsRes.lessons || [])
      setCourses(coursesRes.courses || [])
    } catch (err) {
      console.error('Load error:', err)
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editingLesson) {
        await updateAdminLesson(editingLesson.id, form)
      } else {
        await createAdminLesson(form)
      }
      setShowModal(false)
      setEditingLesson(null)
      setForm({ title: '', enTitle: '', duration: '', videoUrl: '', sortOrder: 1, courseId: '' })
      loadData()
    } catch (err) {
      alert(t('msg.error'))
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('msg.confirmDelete'))) return
    try {
      await deleteAdminLesson(id)
      loadData()
    } catch (err) {
      alert(t('msg.error'))
    }
  }

  function openEdit(lesson) {
    setEditingLesson(lesson)
    setForm({
      title: lesson.title || '',
      enTitle: lesson.enTitle || '',
      duration: lesson.duration || '',
      videoUrl: lesson.videoUrl || '',
      sortOrder: lesson.sortOrder || 1,
      courseId: lesson.courseId || ''
    })
    setShowModal(true)
  }

  function openAdd() {
    setEditingLesson(null)
    setForm({ title: '', enTitle: '', duration: '', videoUrl: '', sortOrder: 1, courseId: courseId || courses[0]?.id || '' })
    setShowModal(true)
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{t('nav.videos')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('actions.add')}</button>
      </div>

      <div className="search-bar" style={{ marginBottom: '24px' }}>
        <select 
          value={courseId} 
          onChange={(e) => setCourseId(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)', minWidth: '240px' }}
        >
          <option value="">{t('actions.allCourses') || 'All Courses'}</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading">{t('msg.loading')}</div>
      ) : lessons.length === 0 ? (
        <div className="no-data">{t('msg.noData')}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th width="60">#</th>
              <th>{t('courses.title')}</th>
              <th>{t('courses.duration')}</th>
              <th>Video</th>
              <th width="100">{t('actions.title') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, idx) => (
              <tr key={lesson.id}>
                <td>{idx + 1}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{lesson.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lesson.enTitle}</div>
                </td>
                <td>{lesson.duration}</td>
                <td>
                  {lesson.videoUrl ? (
                    <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="action-btn" title="Watch Video">
                      <ExternalLink size={18} />
                    </a>
                  ) : '-'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" onClick={() => openEdit(lesson)} title={t('actions.edit')}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(lesson.id)} title={t('actions.delete')}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingLesson ? t('courses.edit') : t('courses.add')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title (Arabic)</label>
                <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Title (English)</label>
                <input type="text" value={form.enTitle} onChange={(e) => setForm({...form, enTitle: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Course</label>
                <select value={form.courseId} onChange={(e) => setForm({...form, courseId: e.target.value})} required>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} placeholder="e.g. 10:00" />
              </div>
              <div className="form-group">
                <label>Video URL</label>
                <input type="url" value={form.videoUrl} onChange={(e) => setForm({...form, videoUrl: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({...form, sortOrder: e.target.value})} />
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