import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import './pages.css'

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnrollments()
  }, [])

  async function loadEnrollments() {
    try {
      const res = await api.getEnrollments('ar')
      setEnrollments(res.enrollments || [])
    } catch (err) {
      console.error('Failed to load enrollments:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-content">
      <main className="dashboard-main">

        <div className="container">
          <section className="my-courses-section">
            <h2>My Courses</h2>
            
            {loading ? (
              <p>Loading...</p>
            ) : enrollments.length === 0 ? (
              <div className="empty-state">
                <p>You haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="btn">Browse Courses</Link>
              </div>
            ) : (
              <div className="course-grid">
                {enrollments.map(enrollment => (
                  <Link 
                    key={enrollment.enrollmentId}
                    to={`/course/${enrollment.courseId}/learn`}
                    className="course-card"
                  >
                    <div className="course-image" />
                    <div className="course-info">
                      <h4>{enrollment.course?.title}</h4>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <p>{enrollment.progress}% complete</p>
                      <button className="btn">Continue</button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}