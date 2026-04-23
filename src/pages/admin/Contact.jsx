import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Trash2, CheckCircle, ExternalLink, Save, Globe, Briefcase, MessageCircle, Camera } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminContactMessages, markContactMessageRead, deleteContactMessage, getAdminContactInfo, updateAdminContactInfo } from '../../api'
import './AdminPages.css'

export default function Contact() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('messages')
  const [messages, setMessages] = useState([])
  const [info, setInfo] = useState({
    email: '', phone: '', address: '', whatsapp: '',
    facebook: '', twitter: '', instagram: '', linkedin: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [msgRes, infoRes] = await Promise.all([
        getAdminContactMessages(),
        getAdminContactInfo()
      ])
      setMessages(msgRes.messages || [])
      setInfo(infoRes || {})
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkRead(id) {
    try {
      await markContactMessageRead(id)
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m))
    } catch (error) {
      alert('Failed to mark as read')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this message?')) return
    try {
      await deleteContactMessage(id)
      setMessages(messages.filter(m => m.id !== id))
    } catch (error) {
      alert('Delete failed')
    }
  }

  async function handleUpdateInfo(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAdminContactInfo(info)
      alert('Contact info updated successfully!')
    } catch (error) {
      alert('Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{t('contact.title') || 'Contact & Messages'}</h1>
        <div className="tab-switcher" style={{ display: 'flex', gap: '10px', background: 'var(--bg-secondary)', padding: '5px', borderRadius: '8px' }}>
          <button 
            className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={18} /> Messages
          </button>
          <button 
            className={`btn ${activeTab === 'info' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('info')}
          >
            <Globe size={18} /> Contact Info
          </button>
        </div>
      </div>

      {loading ? <p>{t('msg.loading')}</p> : (
        <div className="contact-container" style={{ marginTop: '30px' }}>
          {activeTab === 'messages' ? (
            <div className="messages-section">
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <p className="stat-card-title">New Messages</p>
                  <p className="stat-card-value">{messages.filter(m => !m.isRead).length}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-card-title">Total Messages</p>
                  <p className="stat-card-value">{messages.length}</p>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className={!msg.isRead ? 'unread-row' : ''} style={{ background: !msg.isRead ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent' }}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{msg.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: !msg.isRead ? 600 : 400 }}>{msg.subject || 'No Subject'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {msg.message}
                        </div>
                      </td>
                      <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${msg.isRead ? 'badge-success' : 'badge-warning'}`}>
                          {msg.isRead ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!msg.isRead && (
                            <button className="action-btn" onClick={() => handleMarkRead(msg.id)} title="Mark as Read">
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button className="action-btn delete" onClick={() => handleDelete(msg.id)} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <form onSubmit={handleUpdateInfo} className="editor-form" style={{ maxWidth: '800px' }}>
              <div className="editor-section">
                <div className="section-header">
                  <Phone size={20} />
                  <h2>Basic Information</h2>
                </div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Public Email</label>
                    <input type="email" value={info.email || ''} onChange={e => setInfo({...info, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" value={info.phone || ''} onChange={e => setInfo({...info, phone: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Office Address</label>
                  <textarea value={info.address || ''} onChange={e => setInfo({...info, address: e.target.value})} />
                </div>
              </div>

              <div className="editor-section">
                <div className="section-header">
                  <Globe size={20} />
                  <h2>Social Media & Messaging</h2>
                </div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input type="text" value={info.whatsapp || ''} onChange={e => setInfo({...info, whatsapp: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Facebook Page URL</label>
                    <input type="text" value={info.facebook || ''} onChange={e => setInfo({...info, facebook: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Twitter/X URL</label>
                    <input type="text" value={info.twitter || ''} onChange={e => setInfo({...info, twitter: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Instagram URL</label>
                    <input type="text" value={info.instagram || ''} onChange={e => setInfo({...info, instagram: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input type="text" value={info.linkedin || ''} onChange={e => setInfo({...info, linkedin: e.target.value})} />
                  </div>
                </div>

              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={18} /> {saving ? 'Updating...' : 'Save Contact Info'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}