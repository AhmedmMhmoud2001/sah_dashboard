import { useState, useEffect } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminCourses, createAdminCourse, updateAdminCourse, deleteAdminCourse } from '../../api'
import './AdminPages.css'

export default function Courses() {

  const { t } = useI18n()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState({
    title: '', enTitle: '', code: '', shortDesc: '', longDesc: '', duration: '', level: '', price: 0
  })

  useEffect(() => { loadCourses() }, [])

  async function loadCourses() {
    try {
      const data = await getAdminCourses()
      setCourses(data.courses || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (isEdit && formData.id) {
        await updateAdminCourse(formData.id, formData)
      } else {
        await createAdminCourse(formData)
      }
      setShowModal(false)
      setFormData({ title: '', enTitle: '', code: '', shortDesc: '', longDesc: '', duration: '', level: '', price: 0 })
      setIsEdit(false)
      loadCourses()
    } catch (error) {
      alert('Error saving course')
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('msg.confirmDelete'))) return
    try {
      await deleteAdminCourse(id)
      loadCourses()
    } catch (error) {
      alert('Error deleting course')
    }
  }

  function openAdd() {
    setIsEdit(false)
    setFormData({ title: '', enTitle: '', code: '', shortDesc: '', longDesc: '', duration: '', level: '', price: 0 })
    setShowModal(true)
  }

  function openEdit(course) {
    setIsEdit(true)
    setFormData(course)
    setShowModal(true)
  }

  if (loading) return <p>{t('msg.loading')}</p>

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">{t('courses.title')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('courses.add')}</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>{t('courses.title')}</th>
            <th>{t('courses.price')}</th>
            <th>{t('courses.duration')}</th>
            <th>طلاب</th>
            <th>{t('courses.level')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.price} SAR</td>
              <td>{course.duration}</td>
              <td>
                <span className="enrollment-badge">
                  <span className="enrollment-icon">👥</span>
                  {course.enrollmentsCount || 0}
                </span>
              </td>
              <td><span className="badge">{course.level}</span></td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="action-btn" onClick={() => openEdit(course)} title={t('actions.edit')}>
                    <Edit size={18} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(course.id)} title={t('actions.delete')}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEdit ? t('courses.edit') : t('courses.add')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title (Arabic)</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Title (English)</label>
                <input type="text" value={formData.enTitle} onChange={e => setFormData({...formData, enTitle: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Level</label>
                <input type="text" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('actions.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}