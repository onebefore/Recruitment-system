<template>
  <div class="register-bg">
    <div class="register-container">
      <h2 class="register-title">注册</h2>
      <el-tabs v-model="activeTab" class="register-tabs">
        <el-tab-pane label="企业注册" name="company">
          <el-form :model="companyForm" :rules="companyRules" ref="companyFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="companyForm.username" size="large" clearable prefix-icon="el-icon-user" />
            </el-form-item>
            <el-form-item label="企业名称" prop="company_name">
              <el-input v-model="companyForm.company_name" size="large" clearable />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="companyForm.phone" size="large" clearable prefix-icon="el-icon-phone" />
            </el-form-item>
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="companyForm.address" size="large" clearable />
            </el-form-item>
            <el-form-item label="行业" prop="industry">
              <el-select v-model="companyForm.industry" placeholder="请选择行业" size="large">
                <el-option label="互联网" value="互联网" />
                <el-option label="制造" value="制造" />
                <el-option label="金融" value="金融" />
                <el-option label="教育" value="教育" />
                <el-option label="医疗" value="医疗" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="companyForm.password" type="password" show-password size="large" clearable prefix-icon="el-icon-lock" />
            </el-form-item>
            <el-button type="primary" :disabled="companyBtnDisabled" @click="registerCompany" size="large" style="width: 100%; margin-bottom: 10px;">注册企业</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="求职者注册" name="seeker">
          <el-form :model="seekerForm" :rules="seekerRules" ref="seekerFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="seekerForm.username" size="large" clearable prefix-icon="el-icon-user" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="seekerForm.name" size="large" clearable />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="seekerForm.phone" size="large" clearable prefix-icon="el-icon-phone" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="seekerForm.gender" placeholder="请选择性别" size="large">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期" prop="birth_date">
              <el-date-picker v-model="seekerForm.birth_date" type="date" placeholder="选择日期" style="width: 100%;" size="large" />
            </el-form-item>
            <el-form-item label="最高学历" prop="highest_degree">
              <el-select v-model="seekerForm.highest_degree" placeholder="请选择学历" size="large">
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="seekerForm.password" type="password" show-password size="large" clearable prefix-icon="el-icon-lock" />
            </el-form-item>
            <el-button type="primary" :disabled="seekerBtnDisabled" @click="registerSeeker" size="large" style="width: 100%; margin-bottom: 10px;">注册求职者</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-button @click="goBack" type="text" class="back-login-btn">返回登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { ElMessage } from 'element-plus';

const router = useRouter();
const activeTab = ref('company');

const companyFormRef = ref();
const seekerFormRef = ref();

const companyForm = ref({
  username: '',
  company_name: '',
  phone: '',
  address: '',
  industry: '',
  password: ''
});

const seekerForm = ref({
  username: '',
  name: '',
  phone: '',
  gender: '',
  birth_date: '',
  highest_degree: '',
  password: ''
});

const phoneValidator = (rule, value, callback) => {
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!value) {
    callback(new Error('请输入联系电话'));
  } else if (!phoneReg.test(value)) {
    callback(new Error('请输入有效的手机号'));
  } else {
    callback();
  }
};

const companyRules = {
  username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
  company_name: [ { required: true, message: '请输入企业名称', trigger: 'blur' } ],
  phone: [ { validator: phoneValidator, trigger: 'blur' } ],
  address: [ { required: true, message: '请输入公司地址', trigger: 'blur' } ],
  industry: [ { required: true, message: '请选择行业', trigger: 'change' } ],
  password: [ { required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' } ]
};

const seekerRules = {
  username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
  name: [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
  phone: [ { validator: phoneValidator, trigger: 'blur' } ],
  gender: [ { required: true, message: '请选择性别', trigger: 'change' } ],
  birth_date: [ { required: true, message: '请选择出生日期', trigger: 'change' } ],
  highest_degree: [ { required: true, message: '请选择最高学历', trigger: 'change' } ],
  password: [ { required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' } ]
};

const companyBtnDisabled = computed(() => {
  const f = companyForm.value;
  return !(f.username && f.company_name && f.phone && f.address && f.industry && f.password && f.password.length >= 6);
});

const seekerBtnDisabled = computed(() => {
  const f = seekerForm.value;
  return !(f.username && f.name && f.phone && f.gender && f.birth_date && f.highest_degree && f.password && f.password.length >= 6);
});

const registerCompany = async () => {
  companyFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await api.registerCompany(companyForm.value);
      ElMessage.success('企业注册成功，请登录');
      router.push('/login');
    } catch (err) {
      ElMessage.error('注册失败，请重试');
    }
  });
};

const registerSeeker = async () => {
  seekerFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const form = { ...seekerForm.value };
      if (form.birth_date instanceof Date) {
        form.birth_date = form.birth_date.toISOString().slice(0, 10);
      }
      await api.registerSeeker(form);
      ElMessage.success('求职者注册成功，请登录');
      router.push('/login');
    } catch (err) {
      ElMessage.error('注册失败，请重试');
    }
  });
};

const goBack = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0f7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
  width: 440px;
  margin: 80px auto 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: unset;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(33,134,255,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.04);
  padding: 36px 32px 28px 32px;
  border: none;
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #2186ff;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 2px;
}

.register-tabs {
  width: 100%;
  margin-bottom: 10px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-input__wrapper {
  border-radius: 10px !important;
  box-shadow: 0 2px 8px rgba(33,134,255,0.06);
}

.el-button--primary {
  background: linear-gradient(90deg, #2186ff 0%, #6ec1ff 100%);
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: background 0.2s;
}

.el-button--primary:hover {
  background: linear-gradient(90deg, #1867c0 0%, #4fa3e3 100%);
}

.back-login-btn {
  font-size: 15px;
  color: #2186ff;
  text-align: center;
  width: 100%;
  margin-top: 8px;
}
</style>