import { useState, useEffect } from 'react'
import { Eye, Edit, Trash2, ShoppingCart, CreditCard, RefreshCcw } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { getAdminOrders, updateAdminOrder, createAdminRefund } from '../../api'
import './AdminPages.css'

export default function Orders() {
  const { t } = useI18n()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundData, setRefundData] = useState({ amount: 0, reason: '' })

  useEffect(() => { loadOrders() }, [statusFilter])

  async function loadOrders() {
    setLoading(true)
    try {
      const data = await getAdminOrders({ status: statusFilter })
      setOrders(data.orders || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(id, newStatus) {
    try {
      await updateAdminOrder(id, { status: newStatus })
      loadOrders()
    } catch (error) {
      alert('Failed to update status')
    }
  }

  async function handleRefund(e) {
    e.preventDefault()
    try {
      await createAdminRefund({ 
        orderId: selectedOrder.id, 
        amount: refundData.amount, 
        reason: refundData.reason 
      })
      setShowRefundModal(false)
      setShowDetailModal(false)
      loadOrders()
    } catch (error) {
      alert('Refund failed')
    }
  }

  const getStatusBadge = (status) => {
    const classes = { 
      paid: 'badge-success', 
      pending: 'badge-warning', 
      cancelled: 'badge-danger', 
      refunded: 'badge-info' 
    }
    return classes[status] || 'badge'
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{t('orders.title') || 'Orders Management'}</h1>
      </div>

      <div className="search-bar" style={{ marginBottom: '24px' }}>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? <p>{t('msg.loading')}</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><span className="text-mono" style={{ fontSize: '12px' }}>{order.id.split('-')[0]}...</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{order.user?.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                </td>
                <td>{order.totalAmount} {order.currency}</td>
                <td><span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }} title="View Details">
                      <Eye size={18} />
                    </button>
                    {order.status === 'paid' && (
                      <button className="action-btn" onClick={() => { setSelectedOrder(order); setRefundData({ amount: order.totalAmount, reason: '' }); setShowRefundModal(true); }} title="Process Refund">
                        <RefreshCcw size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>Order Details</h2>
            <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div>
                <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                <p><strong>Status:</strong> <span className={`badge ${getStatusBadge(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
              </div>
              <div>
                <p><strong>Amount:</strong> {selectedOrder.totalAmount} {selectedOrder.currency}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            <h3 style={{ marginTop: '20px' }}>Items</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedOrder.enrollments?.map(e => (
                <li key={e.id} style={{ padding: '10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{e.course?.title}</span>
                  <span>{e.course?.price} SAR</span>
                </li>
              ))}
            </ul>

            <div className="form-actions" style={{ marginTop: '30px' }}>
              <button className="btn" onClick={() => setShowDetailModal(false)}>Close</button>
              {selectedOrder.status === 'pending' && (
                <button className="btn btn-primary" onClick={() => handleUpdateStatus(selectedOrder.id, 'paid')}>Mark as Paid</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="modal-overlay" onClick={() => setShowRefundModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Process Refund</h2>
            <form onSubmit={handleRefund}>
              <div className="form-group">
                <label>Refund Amount ({selectedOrder?.currency})</label>
                <input 
                  type="number" 
                  max={selectedOrder?.totalAmount} 
                  value={refundData.amount} 
                  onChange={e => setRefundData({...refundData, amount: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea 
                  value={refundData.reason} 
                  onChange={e => setRefundData({...refundData, reason: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowRefundModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Confirm Refund</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
