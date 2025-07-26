<template>
  <div class="personal-center-container">
    <el-button type="link" @click="goBack" class="back-button">
      <el-icon><ArrowLeft /></el-icon> 返回用户管理
    </el-button>
    <h2>编辑用户信息</h2>

    <el-form :model="editForm" label-width="120px" class="info-form">
      <el-form-item label="用户名">
        <el-input v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item label="姓名" v-if="isSeeker">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="editForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="性别" v-if="isSeeker">
        <el-select v-model="editForm.gender" placeholder="请选择性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" v-if="isSeeker">
        <el-date-picker v-model="editForm.birth_date" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="最高学历" v-if="isSeeker">
        <el-select v-model="editForm.highest_degree" placeholder="请选择最高学历">
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
          <img v-if="editForm.avatar_url" :src="fullAvatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="籍贯" v-if="isSeeker">
        <el-input v-model="editForm.hometown"></el-input>
      </el-form-item>
      <el-form-item label="专业" v-if="isSeeker">
        <el-input v-model="editForm.major"></el-input>
      </el-form-item>
      <el-form-item label="学校" v-if="isSeeker">
        <el-input v-model="editForm.school"></el-input>
      </el-form-item>
      <el-form-item label="技能" v-if="isSeeker">
        <el-input type="textarea" :rows="3" v-model="editForm.skills"></el-input>
      </el-form-item>
      
      <!-- 公司特有信息 -->
      <el-form-item label="公司名称" v-if="isCompany">
        <el-input v-model="editForm.company_name"></el-input>
      </el-form-item>
      <el-form-item label="公司行业" v-if="isCompany">
        <el-select v-model="editForm.industry" placeholder="请选择公司行业">
          <el-option label="互联网" value="互联网"></el-option>
          <el-option label="制造" value="制造"></el-option>
          <el-option label="金融" value="金融"></el-option>
          <el-option label="教育" value="教育"></el-option>
          <el-option label="医疗" value="医疗"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司地址" v-if="isCompany">
        <el-input v-model="editForm.address"></el-input>
      </el-form-item>
      <el-form-item label="公司简介" v-if="isCompany">
        <el-input type="textarea" v-model="editForm.introduction"></el-input>
      </el-form-item>
      <el-form-item label="公司Logo" v-if="isCompany">
        <el-upload
          class="avatar-uploader"
          :action="uploadActionUrl"
          :show-file-list="false"
          :on-success="handleCompanyLogoSuccess"
          :before-upload="beforeCompanyLogoUpload"
          :data="{ relatedId: relatedEntityId }"
        >
          <img v-if="editForm.logo_url" :src="fullAvatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateUserInfo">保存修改</el-button>
        <el-button type="danger" @click="handleDeleteUser">删除用户</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElIcon, ElMessageBox } from 'element-plus';
import { Plus, ArrowLeft } from '@element-plus/icons-vue';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const userAuthId = ref(null);
const relatedEntityId = ref(null);
const userRole = ref(null);

const editForm = ref({
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

const isSeeker = computed(() => userRole.value === 'seeker');
const isCompany = computed(() => userRole.value === 'company');

const backendBaseUrl = 'http://localhost:5000';

const fullAvatarUrl = computed(() => {
  if (isCompany.value) {
    return editForm.value.logo_url ? `${backendBaseUrl}${editForm.value.logo_url}` : '';
  } else {
    return editForm.value.avatar_url ? `${backendBaseUrl}${editForm.value.avatar_url}` : '';
  }
});

const uploadActionUrl = computed(() => {
  if (isCompany.value) {
    return `${backendBaseUrl}/api/upload/company-logo`;
  } else {
    return `${backendBaseUrl}/api/upload/avatar`;
  }
});

const fetchUserInfo = async () => {
  const currentUrlId = route.params.id;
  if (!currentUrlId) {
    ElMessage.error('缺少用户ID，无法编辑。');
    router.push('/admin/users');
    return;
  }

  try {
    const usersRes = await api.getAllUsers({ query: '', role: '' });
    const targetUser = usersRes.data.users.find(u => String(u.id) === String(currentUrlId));

    if (!targetUser) {
      ElMessage.error('未找到该用户。');
      router.push('/admin/users');
      return;
    }

    userAuthId.value = targetUser.id;
    relatedEntityId.value = targetUser.relatedId;
    userRole.value = targetUser.role;
    editForm.value.username = targetUser.username;

    let res;
    if (userRole.value === 'seeker') {
      res = await api.getSeekerProfile(relatedEntityId.value);
      if (res.data) {
        editForm.value.name = res.data.name;
        editForm.value.phone = res.data.phone;
        editForm.value.gender = res.data.gender;
        editForm.value.birth_date = res.data.birth_date ? new Date(res.data.birth_date) : '';
        editForm.value.highest_degree = res.data.highest_degree;
        editForm.value.avatar_url = res.data.avatar_url || '';
        editForm.value.hometown = res.data.hometown || '';
        editForm.value.major = res.data.major || '';
        editForm.value.school = res.data.school || '';
        editForm.value.skills = res.data.skills || '';
      }
    } else if (userRole.value === 'company') {
      res = await api.getCompanyProfile(relatedEntityId.value);
      if (res.data) {
        editForm.value.company_name = res.data.company_name;
        editForm.value.phone = res.data.phone;
        editForm.value.industry = res.data.industry;
        editForm.value.address = res.data.address;
        editForm.value.introduction = res.data.introduction;
        editForm.value.logo_url = res.data.logo_url || '';
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取个人信息失败，请重试');
    router.push('/admin/users');
  }
};

const updateUserInfo = async () => {
  try {
    const dataToSend = {
      ...editForm.value,
      userId: userAuthId.value,
      username: editForm.value.username
    };

    if (dataToSend.birth_date instanceof Date) {
      const year = dataToSend.birth_date.getFullYear();
      const month = String(dataToSend.birth_date.getMonth() + 1).padStart(2, '0');
      const day = String(dataToSend.birth_date.getDate()).padStart(2, '0');
      dataToSend.birth_date = `${year}-${month}-${day}`;
    } else if (typeof dataToSend.birth_date === 'string' && dataToSend.birth_date.includes('T')) {
      dataToSend.birth_date = dataToSend.birth_date.slice(0, 10);
    }

    if (userRole.value === 'seeker') {
      await api.updateSeekerProfile(relatedEntityId.value, dataToSend);
    } else if (userRole.value === 'company') {
      await api.updateCompanyProfile(relatedEntityId.value, dataToSend);
    }
    ElMessage.success('用户信息更新成功！');
  } catch (error) {
    console.error('更新用户信息失败:', error);
    ElMessage.error('更新用户信息失败，请稍后重试');
  }
};

const handleAvatarSuccess = (response) => {
  if (response.url) {
    editForm.value.avatar_url = response.url;
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
    editForm.value.logo_url = response.filePath;
    ElMessage.success('公司Logo上传成功！');
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

const handleDeleteUser = async () => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该用户及其所有相关信息，是否继续?',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 调用后端 API 删除用户
    await api.deleteUser(userAuthId.value, userRole.value);
    ElMessage.success('用户删除成功！');
    router.push('/admin/users'); // 删除成功后返回用户列表

  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除');
    } else {
      console.error('删除用户失败:', error);
      ElMessage.error('删除用户失败，请稍后重试');
    }
  }
};

const goBack = () => {
  router.push('/admin/users');
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

.info-form {
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
  object-fit: cover;
}
</style> 