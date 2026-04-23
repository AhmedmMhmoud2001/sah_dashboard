import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function register(data) {
  const res = await api.post('/auth/register', data)
  if (res.data.token) {
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }
  return res.data
}

export async function login(data) {
  const res = await api.post('/auth/login', data)
  if (res.data.token) {
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }
  return res.data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function getToken() {
  return localStorage.getItem('token')
}

export function isAuthenticated() {
  return !!getToken()
}

export async function getCourses(lang = 'ar', page = 1) {
  const res = await api.get(`/courses?lang=${lang}&page=${page}`)
  return res.data
}

export async function getCourse(id, lang = 'ar') {
  const res = await api.get(`/courses/${id}?lang=${lang}`)
  return res.data
}

export async function getLessons(courseId, lang = 'ar') {
  const res = await api.get(`/courses/${courseId}/lessons?lang=${lang}`)
  return res.data
}

export async function enroll(courseId) {
  const res = await api.post('/enrollments', { courseId })
  return res.data
}

export async function getEnrollments(lang = 'ar') {
  const res = await api.get(`/enrollments?lang=${lang}`)
  return res.data
}

export async function getProgress(courseId) {
  const res = await api.get(`/progress/${courseId}`)
  return res.data
}

export async function markLessonComplete(courseId, lessonId, completed) {
  const res = await api.post(`/progress/${courseId}`, { lessonId, completed })
  return res.data
}

export async function getQuiz(quizId, lang = 'ar') {
  const res = await api.get(`/quizzes/${quizId}?lang=${lang}`)
  return res.data
}

export async function submitQuiz(quizId, answers) {
  const res = await api.post(`/quizzes/${quizId}/submit`, { answers })
  return res.data
}

// Admin API functions
export async function getAdminStats() {
  const res = await api.get('/admin/stats')
  return res.data
}

export async function getAdminAnalytics() {
  const res = await api.get('/admin/analytics')
  return res.data
}


export async function getAdminUsers(params = {}) {
  const res = await api.get('/admin/users', { params })
  return res.data
}

export async function getUserProgress(userId) {
  const res = await api.get(`/admin/users/${userId}/progress`)
  return res.data
}

export async function manualEnroll(userId, courseId) {
  const res = await api.post('/admin/enroll', { userId, courseId })
  return res.data
}


export async function createAdminUser(data) {
  const res = await api.post('/admin/users', data)
  return res.data
}

export function deleteAdminUser(id) {
  return api.delete(`/admin/users/${id}`)
}

export async function updateAdminUser(id, data) {
  const res = await api.put(`/admin/users/${id}`, data)
  return res.data
}


export async function getAdminCourses(params = {}) {
  const res = await api.get('/admin/courses', { params })
  return res.data
}

export async function createAdminCourse(data) {
  const res = await api.post('/admin/courses', data)
  return res.data
}

export async function deleteAdminCourse(id) {
  const res = await api.delete(`/admin/courses/${id}`)
  return res.data
}

export async function updateAdminCourse(id, data) {
  const res = await api.put(`/admin/courses/${id}`, data)
  return res.data
}

export async function getAdminSubscriptions(params = {}) {
  const res = await api.get('/admin/subscriptions', { params })
  return res.data
}

export async function getAdminLessons(params = {}) {
  const res = await api.get('/admin/lessons', { params })
  return res.data
}

export async function createAdminLesson(data) {
  const res = await api.post('/admin/lessons', data)
  return res.data
}

export async function updateAdminLesson(id, data) {
  const res = await api.put(`/admin/lessons/${id}`, data)
  return res.data
}

export async function deleteAdminLesson(id) {
  const res = await api.delete(`/admin/lessons/${id}`)
  return res.data
}

export async function getAdminQuestions(params = {}) {
  const res = await api.get('/admin/questions', { params })
  return res.data
}

export async function createAdminQuestion(data) {
  const res = await api.post('/admin/questions', data)
  return res.data
}

export async function deleteAdminQuestion(id) {
  const res = await api.delete(`/admin/questions/${id}`)
  return res.data
}

export async function getAdminReportsUsers(params = {}) {
  const res = await api.get('/admin/reports/users', { params })
  return res.data
}

export async function getAdminReportsCourses(params = {}) {
  const res = await api.get('/admin/reports/courses', { params })
  return res.data
}

export async function getAdminReportsSubscriptions(params = {}) {
  const res = await api.get('/admin/reports/subscriptions', { params })
  return res.data
}

// Finance APIs
export async function getAdminOrders(params = {}) {
  const res = await api.get('/admin/orders', { params })
  return res.data
}

export async function getAdminOrder(id) {
  const res = await api.get(`/admin/orders/${id}`)
  return res.data
}

export async function updateAdminOrder(id, data) {
  const res = await api.put(`/admin/orders/${id}`, data)
  return res.data
}

export async function getAdminTransactions(params = {}) {
  const res = await api.get('/admin/transactions', { params })
  return res.data
}

export async function getAdminCoupons() {
  const res = await api.get('/admin/coupons')
  return res.data
}

export async function createAdminCoupon(data) {
  const res = await api.post('/admin/coupons', data)
  return res.data
}

export async function updateAdminCoupon(id, data) {
  const res = await api.put(`/admin/coupons/${id}`, data)
  return res.data
}

export async function deleteAdminCoupon(id) {
  const res = await api.delete(`/admin/coupons/${id}`)
  return res.data
}

export async function getAdminRefunds() {
  const res = await api.get('/admin/refunds')
  return res.data
}

export async function createAdminRefund(data) {
  const res = await api.post('/admin/refunds', data)
  return res.data
}

// RBAC APIs
export async function getAdminRoles() {
  const res = await api.get('/admin/rbac/roles')
  return res.data
}

export async function createAdminRole(data) {
  const res = await api.post('/admin/rbac/roles', data)
  return res.data
}

export async function updateAdminRole(id, data) {
  const res = await api.put(`/admin/rbac/roles/${id}`, data)
  return res.data
}

export async function deleteAdminRole(id) {
  const res = await api.delete(`/admin/rbac/roles/${id}`)
  return res.data
}

export async function getAdminPermissions() {
  const res = await api.get('/admin/rbac/permissions')
  return res.data
}

// About APIs
export async function getAbout() {
  const res = await api.get('/about')
  return res.data
}

export async function getAdminAbout() {
  const res = await api.get('/admin/about')
  return res.data
}

export async function updateAdminAbout(data) {
  const res = await api.put('/admin/about', data)
  return res.data
}

// Contact APIs
export async function getAdminContactMessages() {
  const res = await api.get('/admin/contact/messages')
  return res.data
}

export async function markContactMessageRead(id) {
  const res = await api.put(`/admin/contact/messages/${id}/read`)
  return res.data
}

export async function deleteContactMessage(id) {
  const res = await api.delete(`/admin/contact/messages/${id}`)
  return res.data
}

export async function getAdminContactInfo() {
  const res = await api.get('/admin/contact/info')
  return res.data
}

export async function updateAdminContactInfo(data) {
  const res = await api.put('/admin/contact/info', data)
  return res.data
}

export async function getPublicContactInfo() {
  const res = await api.get('/contact/info')
  return res.data
}

export async function submitContactMessage(data) {
  const res = await api.post('/contact/messages', data)
  return res.data
}

export default api