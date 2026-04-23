import { useState, useEffect } from 'react'
import { Edit, Trash2, Plus, Tag } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from '../../api'
import './AdminPages.css'

export default function Coupons() {
  const { t } = useI18n()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState({
    code: '', discountType: 'percentage', discountValue: 0, 
    minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, 
    startDate: '', expiryDate: '', isActive: true
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { loadCoupons() }, [])

  async function loadCoupons() {
    try {
      const data = await getAdminCoupons()
      setCoupons(data.coupons || [])
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
        await updateAdminCoupon(editingId, formData)
      } else {
        await createAdminCoupon(formData)
      }
      setShowModal(false)
      loadCoupons()
    } catch (error) {
      alert('Error saving coupon')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this coupon?')) return
    try {
      await deleteAdminCoupon(id)
      loadCoupons()
    } catch (error) {
      alert('Delete failed')
    }
  }

  function openAdd() {
    setIsEdit(false)
    setFormData({
      code: '', discountType: 'percentage', discountValue: 0, 
      minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, 
      startDate: '', expiryDate: '', isActive: true
    })
    setShowModal(true)
  }

  function openEdit(coupon) {
    setIsEdit(true)
    setEditingId(coupon.id)
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      isActive: coupon.isActive
    })
    setShowModal(true)
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Coupons & Discounts</h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Coupon</button>
      </div>

      {loading ? <p>{t('msg.loading')}</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Limits</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td><span className="badge badge-outline"><Tag size={12} style={{marginRight: '4px'}} /> {coupon.code}</span></td>
                <td>
                  {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' SAR'}
                </td>
                <td>
                  <div style={{fontSize: '12px'}}>
                    Min: {coupon.minOrderAmount || 0} SAR<br/>
                    Limit: {coupon.usageLimit || '∞'} ({coupon.usageCount} used)
                  </div>
                </td>
                <td>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}</td>
                <td>
                  <span className={`badge ${coupon.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" onClick={() => openEdit(coupon)} title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(coupon.id)} title="Delete">
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
            <h2>{isEdit ? 'Edit Coupon' : 'Add Coupon'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} required />
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Type</label>
                  <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (SAR)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Value</label>
                  <input type="number" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} required />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Min Order</label>
                  <input type="number" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input type="number" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  Active
                </label>
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
