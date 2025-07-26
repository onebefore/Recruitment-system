import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

// 请求拦截器：在发送请求前添加认证信息
apiClient.interceptors.request.use(
  config => {
    const user = localStorage.getItem('user');
    if (user) {
      // 将用户对象转换为Base64编码的字符串，并作为x-user头发送
      // 使用TextEncoder处理Unicode字符，然后btoa进行Base64编码
      const encodedUser = btoa(new TextEncoder().encode(user).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      config.headers['x-user'] = encodedUser;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default {
  // 用户认证
  login(data) {
    return apiClient.post('/auth/login', data);
  },
  registerCompany(data) {
    return apiClient.post('/auth/register/company', data);
  },
  registerSeeker(data) {
    return apiClient.post('/auth/register/seeker', data);
  },

  // 岗位相关
  getAllJobs() {
    return apiClient.get('/jobs');
  },
  getJobById(id) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = {};
    if (user && user.userId && user.role) {
      headers['x-user-id'] = user.userId;
      headers['x-role'] = user.role;
    }
    return apiClient.get(`/jobs/${id}`, { headers });
  },
  searchJobs(params) {
    return apiClient.get('/jobs/search', { params });
  },
  createJob(data) {
    return apiClient.post('/jobs/job/create', data);
  },
  deleteJob(id) {
    return apiClient.delete(`/jobs/${id}`);
  },
  updateJob(id, data) {
    return apiClient.put(`/jobs/job/${id}/update`, data);
  },

  // 简历上传
  uploadResume(file, jobId) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_id', jobId);
    return apiClient.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getResumesByJob(jobId) {
    return apiClient.get(`/resume/list?job_id=${jobId}`);
  },
  getMyResume(jobId) {
    return apiClient.get(`/resume/my?job_id=${jobId}`);
  },

  // 聊天消息
  sendMessage(data) {
    return apiClient.post('/messages', data);
  },
  getMessages(sender_id, receiver_id) {
    return apiClient.get('/messages', { params: { sender_id, receiver_id } });
  },
  // 获取会话列表
  getMessagesSessions(user_id) {
    return apiClient.get('/messages/sessions', { params: { user_id } });
  },
  // 标记消息为已读
  markMessagesRead(sender_id, receiver_id) {
    return apiClient.post('/messages/read', { sender_id, receiver_id });
  },

  // 获取企业用户认证信息
  getCompanyUserByCompanyId(companyId) {
    return apiClient.get(`/auth/company-user/${companyId}`);
  },

  // 获取求职者用户认证信息
  getSeekerUserBySeekerId(seekerId) {
    return apiClient.get(`/auth/seeker-user/${seekerId}`);
  },

  // 获取某个企业发布的所有岗位
  getJobsByCompany(params) {
    const { companyId, query } = params;
    return apiClient.get(`/jobs/company/${companyId}/jobs`, { params: { query } });
  },

  // 获取求职者投递的简历列表
  getAppliedResumesBySeeker(seekerId) {
    return apiClient.get(`/resume/applied-by-seeker/${seekerId}`);
  },

  // New API call for fetching company details
  getCompanyDetail: (companyId) => apiClient.get(`/company/${companyId}`),

  // Personal Center APIs
  getSeekerProfile: (seekerId) => apiClient.get(`/profile/seeker/${seekerId}`),
  updateSeekerProfile: (seekerId, data) => apiClient.put(`/profile/seeker/${seekerId}`, data),
  getCompanyProfile: (companyId) => apiClient.get(`/profile/company/${companyId}`),
  updateCompanyProfile: (companyId, data) => apiClient.put(`/profile/company/${companyId}`, data),
  changePassword: (userId, oldPassword, newPassword) => apiClient.put(`/profile/password/${userId}`, { oldPassword, newPassword }),

  // Applied Resumes APIs
  getAppliedResumes: (seekerId, params) => apiClient.get(`/resume/applied/${seekerId}`, { params }),

  // Admin APIs
  adminLogin: (data) => apiClient.post('/admin/login', data),
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  deleteUser: (userId, role) => apiClient.delete(`/admin/users/${userId}`, { params: { role } }),

  // 职位审核相关
  getPendingJobs: (params = {}) => apiClient.get('/admin/jobs/pending', { params }),
  approveJob: (jobId) => apiClient.post(`/admin/jobs/${jobId}/approve`),
  rejectJob: (jobId, reason) => apiClient.post(`/admin/jobs/${jobId}/reject`, { reason }),

  // 获取公司列表
  getCompanyList(params) {
    return apiClient.get('/company', { params });
  },
};