<template>
  <div class="company-list-container">
    <div class="company-search-bar">
      <el-select v-model="industry" class="search-type-select" placeholder="公司行业">
        <el-option label="全部" value="" />
        <el-option label="互联网" value="互联网" />
        <el-option label="制造" value="制造" />
        <el-option label="金融" value="金融" />
        <el-option label="教育" value="教育" />
        <el-option label="医疗" value="医疗" />
        <el-option label="其他" value="其他" />
      </el-select>
      <el-input v-model="searchKeyword" placeholder="搜索职位、公司" class="search-input" />
      <el-button type="primary" class="search-btn" @click="fetchCompanies">搜索</el-button>
      <!-- <div class="app-tip">
        <el-icon><i-phone /></el-icon>
        <span>去APP<br>与BOSS随时沟通</span>
      </div> -->
    </div>
    <div class="company-card-list">
      <div v-for="company in filteredCompanies" :key="company.company_id" class="company-card" @click="goToCompanyDetail(company.company_id)">
        <div class="company-card-header">
          <img :src="getFullLogoUrl(company.logo_url)" class="company-logo" />
          <div class="company-info">
            <div class="company-name">{{ company.company_name }}</div>
            <div class="company-tags">
              <span class="company-tag">{{ company.industry }}</span>
            </div>
          </div>
        </div>
        <div class="company-main-business">
          <span class="main-business-tag">{{ company.address }}</span>
        </div>
        <div class="company-hot-job">
          热招 | <span class="hot-job-title">{{ company.introduction ? company.introduction.slice(0, 16) : '暂无简介' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const industry = ref('');
const searchKeyword = ref('');
const companies = ref([]);

const backendBaseUrl = 'http://localhost:5000';
function getFullLogoUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads') || url.startsWith('/avatars')) {
    return backendBaseUrl + url;
  }
  return url;
}

const fetchCompanies = async () => {
  try {
    const params = { keyword: searchKeyword.value };
    if (industry.value) params.industry = industry.value;
    const res = await api.getCompanyList(params);
    if (res.data && Array.isArray(res.data)) {
      companies.value = res.data;
    } else if (res.data && Array.isArray(res.data.companies)) {
      companies.value = res.data.companies;
    } else {
      companies.value = [];
    }
  } catch (e) {
    companies.value = [];
  }
};

const filteredCompanies = computed(() => {
  let list = companies.value;
  if (industry.value) {
    list = list.filter(c => c.industry === industry.value);
  }
  if (searchKeyword.value) {
    list = list.filter(c =>
      c.company_name.includes(searchKeyword.value) ||
      (c.introduction && c.introduction.includes(searchKeyword.value))
    );
  }
  return list;
});

function goToCompanyDetail(companyId) {
  router.push({ name: 'CompanyDetail', params: { id: companyId } });
}

onMounted(() => {
  fetchCompanies();
});
</script>

<style scoped>
.company-list-container {
  background: #f7fbfc;
  min-height: 100vh;
  padding: 32px 0 0 0;
}
.company-search-bar {
  display: flex;
  align-items: center;
  padding: 0 40px 24px 40px;
  background: #f7fbfc;
}
.search-type-select {
  width: 140px;
  margin-right: 12px;
}
.search-input {
  flex: 1;
  margin-right: 12px;
}
.search-btn {
  width: 120px;
  font-size: 20px;
  margin-right: 24px;
  background: #00c2b3;
  border: none;
}
.app-tip {
  display: flex;
  align-items: center;
  color: #00c2b3;
  font-size: 16px;
  margin-left: auto;
  gap: 8px;
}
.company-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 24px;
  padding: 0 40px;
}
.company-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  width: 340px;
  padding: 24px 24px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.company-card:hover {
  box-shadow: 0 6px 24px rgba(0,194,179,0.12);
  transform: translateY(-2px) scale(1.02);
}
.company-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.company-logo {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: contain;
  background: #f7fbfc;
  border: 1px solid #eee;
}
.company-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.company-name {
  font-size: 20px;
  font-weight: 600;
  color: #222;
}
.company-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.company-tag {
  background: #f2f8f6;
  color: #00c2b3;
  font-size: 13px;
  border-radius: 6px;
  padding: 2px 8px;
}
.company-main-business {
  display: flex;
  gap: 8px;
  margin: 4px 0 0 0;
}
.main-business-tag {
  background: #f7fbfc;
  color: #888;
  font-size: 13px;
  border-radius: 6px;
  padding: 2px 8px;
}
.company-hot-job {
  margin-top: 8px;
  color: #00c2b3;
  font-size: 15px;
  font-weight: 500;
}
.hot-job-title {
  color: #00c2b3;
  text-decoration: underline;
  cursor: pointer;
}
</style> 