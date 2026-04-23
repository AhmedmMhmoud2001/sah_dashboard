import { useState, useEffect } from 'react'
import { useI18n } from '../../context/I18nContext'
import api from '../../api'

export default function Reports() {
  const { t, lang } = useI18n()
  const [activeTab, setActiveTab] = useState('users')
  const [usersReport, setUsersReport] = useState(null)
  const [coursesReport, setCoursesReport] = useState(null)
  const [subsReport, setSubsReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)
    try {
      const [users, courses, subs] = await Promise.all([
        getAdminReportsUsers(),
        getAdminReportsCourses(),
        getAdminReportsSubscriptions()
      ])
      setUsersReport(users)
      setCoursesReport(courses)
      setSubsReport(subs)
    } catch (err) {
      console.error('Load error:', err)
    }
    setLoading(false)
  }

  if (loading) return <div className="admin-page loading">{t('msg.loading')}</div>

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>{t('nav.reports')}</h1>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          {t('nav.users')}
        </button>
        <button className={`tab ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
          {t('nav.courses')}
        </button>
        <button className={`tab ${activeTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setActiveTab('subscriptions')}>
          {t('nav.subscriptions')}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'users' && usersReport && (
          <div className="report-section">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">{t('stats.totalUsers')}</div>
                <div className="stat-value">{usersReport.total}</div>
              </div>
            </div>
            <h3>Users by Month</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(usersReport.byMonth || {}).map(([month, count]) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'courses' && coursesReport && (
          <div className="report-section">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">{t('stats.revenue')}</div>
                <div className="stat-value">${coursesReport.totalRevenue}</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('courses.title')}</th>
                  <th>Enrollments</th>
                  <th>{t('courses.price')}</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {coursesReport.courses?.map(c => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.enrollments}</td>
                    <td>${c.price}</td>
                    <td>${c.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'subscriptions' && subsReport && (
          <div className="report-section">
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">{t('nav.subscriptions')}</div>
                <div className="stat-value">{subsReport.total}</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('users.name')}</th>
                  <th>Email</th>
                  <th>{t('subs.course')}</th>
                  <th>{t('courses.price')}</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {subsReport.subscriptions?.map((s, i) => (
                  <tr key={i}>
                    <td>{s.user}</td>
                    <td>{s.email}</td>
                    <td>{s.course}</td>
                    <td>${s.price}</td>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}