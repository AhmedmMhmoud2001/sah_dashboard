import { useState, useEffect } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../../api'
import './AdminPages.css'

export default function Users() {
  const { t } = useI18n()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' })

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await getAdminUsers({ search })
      setUsers(data.users || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (isEdit) {
        await updateAdminUser(editingUserId, formData)
      } else {
        await createAdminUser(formData)
      }
      setShowModal(false)
      setFormData({ name: '', email: '', password: '', role: 'student' })
      loadUsers()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save user')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('msg.confirmDelete'))) return
    try {
      await deleteAdminUser(id)
      loadUsers()
    } catch (error) {
      alert('Failed to delete user')
    }
  }

  function openAdd() {
    setIsEdit(false)
    setEditingUserId(null)
    setFormData({ name: '', email: '', password: '', role: 'student' })
    setShowModal(true)
  }

  function openEdit(user) {
    setIsEdit(true)
    setEditingUserId(user.id)
    setFormData({ name: user.name, email: user.email, password: '', role: user.role })
    setShowModal(true)
  }

  function handleView(user) {
    // For now, we can just alert or log, or navigate to a profile if it exists
    alert(`Viewing user: ${user.name} (${user.email})`)
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{t('users.title')}</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ {t('users.add')}</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder={t('actions.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn" onClick={loadUsers}>{t('actions.search')}</button>
      </div>

      {loading ? <p>{t('msg.loading')}</p> : users.length === 0 ? <p>{t('msg.noData')}</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('users.name')}</th>
              <th>{t('users.email')}</th>
              <th>{t('users.role')}</th>
              <th>{t('users.created')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" onClick={() => handleView(user)} title={t('actions.view') || 'View'}>
                      <Eye size={18} />
                    </button>
                    <button className="action-btn" onClick={() => openEdit(user)} title={t('actions.edit')}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(user.id)} title={t('actions.delete')}>
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
            <h2>{isEdit ? t('actions.edit') : t('users.add')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('users.name')}</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{t('users.email')}</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{isEdit ? 'New Password (Optional)' : 'Password'}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!isEdit} />
              </div>
              <div className="form-group">
                <label>{t('users.role')}</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>{t('actions.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('actions.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}