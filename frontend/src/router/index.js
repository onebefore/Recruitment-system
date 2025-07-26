import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import CompanyHome from '../views/CompanyHome.vue';
import SeekerHome from '../views/SeekerHome.vue';
import JobDetail from '../views/JobDetail.vue';
import Register from '../views/Register.vue';
import PostJob from '../views/PostJob.vue';
import CompanyDetail from '../views/CompanyDetail.vue';
import PersonalCenter from '../views/PersonalCenter.vue';
import SeekerDetail from '../views/SeekerDetail.vue';
import AppliedResumes from '../views/AppliedResumes.vue';
import AdminLogin from '../views/AdminLogin.vue';
import UserManagement from '../views/UserManagement.vue';
import SeekerMain from '../views/SeekerMain.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: Register },
  { path: '/company', component: CompanyHome },
  {
    path: '/seeker',
    component: SeekerHome,
    children: [
      { path: '', name: 'SeekerMain', component: SeekerMain },
      { path: 'jobs', name: 'SeekerJobs', component: () => import('../views/JobList.vue') },
      { path: 'company', name: 'SeekerCompany', component: () => import('../views/CompanyList.vue') },
      { path: 'messages', name: 'SeekerMessages', component: () => import('../views/Messages.vue') },
      // 其他seeker子页面可继续添加
    ]
  },
  { path: '/job/:id', name: 'JobDetail', component: JobDetail },
  { path: '/post-job/:id?', name: 'PostJob', component: PostJob },
  { path: '/edit-job/:id', component: PostJob },
  { path: '/company-detail/:id', name: 'CompanyDetail', component: CompanyDetail },
  { path: '/personal-center', name: 'PersonalCenter', component: PersonalCenter },
  { path: '/seeker-detail/:id', name: 'SeekerDetail', component: SeekerDetail },
  { path: '/applied-resumes', name: 'AppliedResumes', component: AppliedResumes },
  { path: '/admin-login', component: AdminLogin },
  { path: '/admin/users', name: 'UserManagement', component: UserManagement },
  { path: '/admin/users/edit/:id', name: 'UserEdit', component: () => import('../views/UserEdit.vue') },
  { path: '/admin/messages', name: 'AdminMessages', component: () => import('../views/Messages.vue') },
  { path: '/company/messages', name: 'CompanyMessages', component: () => import('../views/Messages.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;