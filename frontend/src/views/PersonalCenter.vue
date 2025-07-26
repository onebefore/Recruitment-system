<template>
  <div class="personal-center-container">
    <h2>个人中心</h2>

    <el-tabs type="border-card">
      <el-tab-pane label="个人信息">
        <el-form :model="personalInfoForm" label-width="120px" class="info-form">
          <el-form-item label="用户名">
            <el-input v-model="personalInfoForm.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" v-if="isSeeker">
            <el-input v-model="personalInfoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="personalInfoForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="性别" v-if="isSeeker">
            <el-select v-model="personalInfoForm.gender" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" v-if="isSeeker">
            <el-date-picker v-model="personalInfoForm.birth_date" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="最高学历" v-if="isSeeker">
            <el-select v-model="personalInfoForm.highest_degree" placeholder="请选择最高学历">
              <el-option label="高中" value="高中"></el-option>
              <el-option label="专科" value="专科"></el-option>
              <el-option label="本科" value="本科"></el-option>
              <el-option label="硕士" value="硕士"></el-option>
              <el-option label="博士" value="博士"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="头像" v-if="isSeeker">
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl" 
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="personalInfoForm.avatar_url" :src="fullAvatarUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="籍贯" v-if="isSeeker">
            <el-input v-model="personalInfoForm.hometown"></el-input>
          </el-form-item>
          <el-form-item label="专业" v-if="isSeeker">
            <el-input v-model="personalInfoForm.major"></el-input>
          </el-form-item>
          <el-form-item label="学校" v-if="isSeeker">
            <el-input v-model="personalInfoForm.school"></el-input>
          </el-form-item>
          <el-form-item label="技能" v-if="isSeeker">
            <el-input type="textarea" :rows="3" v-model="personalInfoForm.skills"></el-input>
          </el-form-item>
          
          <!-- 公司特有信息 -->
          <el-form-item label="公司名称" v-if="isCompany">
            <el-input v-model="personalInfoForm.company_name"></el-input>
          </el-form-item>
          <el-form-item label="公司行业" v-if="isCompany">
            <el-select v-model="personalInfoForm.industry" placeholder="请选择公司行业">
              <el-option label="互联网" value="互联网"></el-option>
              <el-option label="制造" value="制造"></el-option>
              <el-option label="金融" value="金融"></el-option>
              <el-option label="教育" value="教育"></el-option>
              <el-option label="医疗" value="医疗"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司地址" v-if="isCompany">
            <el-input v-model="personalInfoForm.address"></el-input>
          </el-form-item>
          <el-form-item label="公司简介" v-if="isCompany">
            <el-input type="textarea" v-model="personalInfoForm.introduction"></el-input>
          </el-form-item>
          <el-form-item label="公司Logo" v-if="isCompany">
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleCompanyLogoSuccess"
              :before-upload="beforeCompanyLogoUpload"
              :data="{ relatedId: relatedId }"
            >
              <img v-if="personalInfoForm.logo_url" :src="fullAvatarUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updatePersonalInfo">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="修改密码">
        <el-form :model="passwordForm" label-width="120px" class="password-form">
          <el-form-item label="旧密码">
            <el-input type="password" v-model="passwordForm.oldPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="passwordForm.newPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" v-model="passwordForm.confirmPassword" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElIcon } from 'element-plus';
import { Plus, ArrowLeft } from '@element-plus/icons-vue';
import api from '../services/api';

const router = useRouter();
const userRole = ref(null);
const userId = ref(null);
const relatedId = ref(null);

const personalInfoForm = ref({
  username: '',
  name: '',
  phone: '',
  gender: '',
  birth_date: '',
  highest_degree: '',
  avatar_url: '',
  hometown: '',
  major: '',
  school: '',
  skills: '',
  company_name: '',
  industry: '',
  address: '',
  introduction: '',
  logo_url: '',
});

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isSeeker = computed(() => userRole.value === 'seeker');
const isCompany = computed(() => userRole.value === 'company');

const backendBaseUrl = 'http://localhost:5000'; // Ensure this matches your backend server URL

const fullAvatarUrl = computed(() => {
  if (userRole.value === 'seeker') {
    return personalInfoForm.value.avatar_url ? `${backendBaseUrl}${personalInfoForm.value.avatar_url}` : '';
  } else if (userRole.value === 'company') {
    return personalInfoForm.value.logo_url ? `${backendBaseUrl}${personalInfoForm.value.logo_url}` : '';
  }
  return '';
});

const uploadActionUrl = computed(() => {
  if (userRole.value === 'seeker') {
    return `${backendBaseUrl}/api/upload/avatar`;
  } else if (userRole.value === 'company') {
    return `${backendBaseUrl}/api/upload/company-logo`; // Assuming a different endpoint for company logo
  }
  return '';
});

const fetchUserInfo = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user from localStorage:', user);
  if (user) {
    userId.value = user.userId || user.user_id;
    userRole.value = user.role;
    // 兜底获取 seeker/company id
    if (user.role === 'seeker') {
      relatedId.value =
        (user.seeker && (user.seeker.seeker_id || user.seeker.id)) ||
        user.relatedId ||
        user.related_id ||
        user.seekerId ||
        user.seeker_id ||
        user.userId ||
        user.user_id ||
        user.id;
    } else if (user.role === 'company') {
      relatedId.value =
        (user.company && (user.company.company_id || user.company.id)) ||
        user.relatedId ||
        user.related_id ||
        user.companyId ||
        user.company_id ||
        user.userId ||
        user.user_id;
    } else {
      relatedId.value = user.relatedId || user.related_id || user.userId || user.user_id;
    }
    console.log('fetch profile with relatedId:', relatedId.value);
    try {
      let res;
      if (user.role === 'seeker') {
        console.log('fetch seeker profile with id:', relatedId.value);
        res = await api.getSeekerProfile(relatedId.value);
        if (res.data) {
          personalInfoForm.value.username = user.username;
          personalInfoForm.value.name = res.data.name;
          personalInfoForm.value.phone = res.data.phone;
          personalInfoForm.value.gender = res.data.gender;
          if (res.data.birth_date) {
            const dateString = res.data.birth_date.slice(0, 10).replace(/-/g, '/');
            personalInfoForm.value.birth_date = new Date(dateString);
          } else {
            personalInfoForm.value.birth_date = '';
          }
          personalInfoForm.value.highest_degree = res.data.highest_degree;
          personalInfoForm.value.avatar_url = res.data.avatar_url || '';
          personalInfoForm.value.hometown = res.data.hometown || '';
          personalInfoForm.value.major = res.data.major || '';
          personalInfoForm.value.school = res.data.school || '';
          personalInfoForm.value.skills = res.data.skills || '';

          console.log('fetchUserInfo: Original avatar_url from backend:', res.data.avatar_url);
          console.log('fetchUserInfo: personalInfoForm.value.avatar_url after assignment:', personalInfoForm.value.avatar_url);
        }
      } else if (user.role === 'company') {
        res = await api.getCompanyProfile(relatedId.value);
        if (res.data) {
          personalInfoForm.value.username = user.username;
          personalInfoForm.value.company_name = res.data.company_name;
          personalInfoForm.value.phone = res.data.phone;
          personalInfoForm.value.industry = res.data.industry;
          personalInfoForm.value.address = res.data.address;
          personalInfoForm.value.introduction = res.data.introduction;
          personalInfoForm.value.logo_url = res.data.logo_url || '';
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      ElMessage.error('获取个人信息失败，请重试');
    }
  } else {
    ElMessage.warning('请先登录');
    router.push('/login');
  }
};

const updatePersonalInfo = async () => {
  try {
    const dataToSend = { ...personalInfoForm.value, userId: userId.value };

    if (dataToSend.birth_date instanceof Date) {
      const year = dataToSend.birth_date.getFullYear();
      const month = String(dataToSend.birth_date.getMonth() + 1).padStart(2, '0');
      const day = String(dataToSend.birth_date.getDate()).padStart(2, '0');
      dataToSend.birth_date = `${year}-${month}-${day}`;
    } else if (typeof dataToSend.birth_date === 'string' && dataToSend.birth_date.includes('T')) {
      dataToSend.birth_date = dataToSend.birth_date.slice(0, 10);
    }

    if (userRole.value === 'seeker') {
      await api.updateSeekerProfile(relatedId.value, dataToSend);
    } else if (userRole.value === 'company') {
      if (personalInfoForm.value.logo_url) {
        dataToSend.logo_url = personalInfoForm.value.logo_url;
      }
      await api.updateCompanyProfile(relatedId.value, dataToSend);
    }
    ElMessage.success('个人信息更新成功！');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      user.username = personalInfoForm.value.username;
      if (user.role === 'seeker' && user.seeker) {
        user.seeker.name = personalInfoForm.value.name;
        user.seeker.birth_date = dataToSend.birth_date; 
        user.seeker.avatar_url = personalInfoForm.value.avatar_url; 
      } else if (user.role === 'company' && user.company) {
        user.company.name = personalInfoForm.value.company_name;
        user.company.phone = personalInfoForm.value.phone;
        user.company.address = personalInfoForm.value.address;
        user.company.industry = personalInfoForm.value.industry;
        user.company.introduction = personalInfoForm.value.introduction;
        user.company.logoUrl = personalInfoForm.value.logo_url;
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('更新个人信息失败:', error);
    ElMessage.error('更新个人信息失败，请稍后重试');
  }
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致！');
    return;
  }
  try {
    await api.changePassword(userId.value, passwordForm.value.oldPassword, passwordForm.value.newPassword);
    ElMessage.success('密码修改成功！请重新登录');
    router.push('/login');
  } catch (error) {
    console.error('修改密码失败:', error);
    ElMessage.error('修改密码失败，请检查旧密码或稍后重试');
  }
};

const handleAvatarSuccess = (response) => {
  if (response.url) {
    personalInfoForm.value.avatar_url = response.url;
    ElMessage.success('头像上传成功！');
  } else {
    ElMessage.error('头像上传失败！');
  }
};

const beforeAvatarUpload = (rawFile) => {
  const isJPGPNG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJPGPNG) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!');
  }
  return isJPGPNG && isLt2M;
};

const handleCompanyLogoSuccess = (response) => {
  if (response.filePath) {
    personalInfoForm.value.logo_url = response.filePath;
    ElMessage.success('公司Logo上传成功！');
    // Immediately update localStorage with the new logo_url
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'company' && user.company) {
      user.company.logoUrl = response.filePath;
      localStorage.setItem('user', JSON.stringify(user));
    }
  } else {
    ElMessage.error('公司Logo上传失败！');
  }
};

const beforeCompanyLogoUpload = (rawFile) => {
  const isJPGPNG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJPGPNG) {
    ElMessage.error('公司Logo图片只能是 JPG/PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('公司Logo图片大小不能超过 2MB!');
  }
  return isJPGPNG && isLt2M;
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.personal-center-container {
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.info-form,
.password-form {
  margin-top: 20px;
  padding-right: 30px;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  margin-bottom: 0;
  z-index: 10;
}

h2 {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 20px;
}

/* Avatar uploader styles */
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover; /* Ensures the image covers the area without distorting aspect ratio */
}
</style> 