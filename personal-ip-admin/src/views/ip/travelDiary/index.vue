<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入章节标题" clearable @keyup.enter="handleQuery" class="!w-200px" />
      </el-form-item>
      <el-form-item label="目的地" prop="destination">
        <el-input v-model="queryParams.destination" placeholder="请输入目的地" clearable @keyup.enter="handleQuery" class="!w-160px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable class="!w-120px">
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['ip:travel-diary:create']">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" align="center" />
      <el-table-column label="章节标题" prop="title" min-width="150" />
      <el-table-column label="目的地" prop="destination" width="120" />
      <el-table-column label="旅行日期" prop="tripDate" width="120" />
      <el-table-column label="主题色" prop="accentColor" width="90" align="center">
        <template #default="{ row }">
          <div :style="{ width: '24px', height: '24px', borderRadius: '50%', background: row.accentColor || '#3B82F6', margin: 'auto' }"></div>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="状态" prop="status" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '已发布' : '草稿' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" width="140">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('update', row.id)" v-hasPermi="['ip:travel-diary:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)" v-hasPermi="['ip:travel-diary:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <TravelDiaryForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { getTravelDiaryPage, deleteTravelDiary } from '@/api/ip/travelDiary'
import TravelDiaryForm from './TravelDiaryForm.vue'

defineOptions({ name: 'IpTravelDiary' })

const loading = ref(false)
const list = ref([])
const total = ref(0)
const queryParams = reactive({ pageNo: 1, pageSize: 10, title: undefined, destination: undefined, status: undefined })
const queryFormRef = ref()
const formRef = ref()

const getList = async () => {
  loading.value = true
  try { const data = await getTravelDiaryPage(queryParams); list.value = data.list; total.value = data.total }
  finally { loading.value = false }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const openForm = (type: string, id?: number) => formRef.value.open(type, id)
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除该旅行日记？', '提示', { type: 'warning' })
  await deleteTravelDiary(id); ElMessage.success('删除成功'); getList()
}
onMounted(() => getList())
</script>
