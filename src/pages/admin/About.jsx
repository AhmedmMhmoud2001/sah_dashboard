import { useState, useEffect } from 'react'
import { Save, Languages, Video, Image as ImageIcon, Type } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminAbout, updateAdminAbout } from '../../api'
import './AdminPages.css'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
}

export default function AboutEditor() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    contentAr: '',
    contentEn: '',
    videoUrl: '',
    imageUrl: ''
  })

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminAbout()
        setFormData(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAdminAbout(formData)
      alert('Updated successfully!')
    } catch (err) {
      alert('Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-page about-editor">
      <div className="page-header">
        <div className="header-text">
          <h1>{t('about.editor_title') || 'About Page Content Management'}</h1>
          <p className="subtitle">Manage how your academy appears to the world in both Arabic and English</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={saving}>
          <Save size={20} /> {saving ? 'Saving Changes...' : 'Publish Updates'}
        </button>
      </div>

      <div className="editor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        {/* Localization Section */}
        <div className="card editor-card">
          <div className="card-header">
            <Languages className="header-icon" />
            <div>
              <h3>Localized Content</h3>
              <p>Main titles and descriptions for your about page</p>
            </div>
          </div>
          <div className="card-body">
            <div className="language-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div className="lang-column ar">
                <div className="lang-indicator">العربية</div>
                <div className="form-group">
                  <label>العنوان</label>
                  <input 
                    type="text" 
                    className="form-control-lg"
                    value={formData.titleAr} 
                    onChange={e => setFormData({...formData, titleAr: e.target.value})} 
                    placeholder="مثال: عن أكاديمية SAH"
                  />
                </div>
                <div className="form-group">
                  <label>المحتوى (محرر احترافي)</label>
                  <div className="quill-wrapper">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.contentAr} 
                      onChange={val => setFormData({...formData, contentAr: val})}
                      modules={quillModules}
                      placeholder="اكتب قصة نجاح الأكاديمية هنا..."
                    />
                  </div>
                </div>
              </div>

              <div className="lang-column en">
                <div className="lang-indicator">English</div>
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    className="form-control-lg"
                    value={formData.titleEn} 
                    onChange={e => setFormData({...formData, titleEn: e.target.value})} 
                    placeholder="e.g. About SAH Academy"
                  />
                </div>
                <div className="form-group">
                  <label>Content (Rich Text)</label>
                  <div className="quill-wrapper">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.contentEn} 
                      onChange={val => setFormData({...formData, contentEn: val})}
                      modules={quillModules}
                      placeholder="Describe your academy's mission and history..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Media Section */}
        <div className="card editor-card">
          <div className="card-header">
            <Video className="header-icon" />
            <div>
              <h3>Media & Visuals</h3>
              <p>Introduction video and hero background images</p>
            </div>
          </div>
          <div className="card-body">
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="form-group">
                <label><Video size={16} /> YouTube Video Link</label>
                <input 
                  type="text" 
                  value={formData.videoUrl} 
                  onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <small className="help-text">This video will appear alongside your about text</small>
              </div>
              <div className="form-group">
                <label><ImageIcon size={16} /> Hero Banner Image URL</label>
                <input 
                  type="text" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                  placeholder="https://example.com/banner.jpg"
                />
                <small className="help-text">High-quality image for the top of the about page</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}