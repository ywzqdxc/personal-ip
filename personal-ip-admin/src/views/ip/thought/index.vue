<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="心情" prop="mood">
        <el-input v-model="queryParams.mood" placeholder="请输入心情标签" clearable @keyup.enter="handleQuery" class="!w-160px" />
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
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['ip:thought:create']">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" align="center" />
      <el-table-column label="内容" prop="content" min-width="220" show-overflow-tooltip />
      <el-table-column label="心情" prop="mood" width="100" />
      <el-table-column label="标签" prop="tags" min-width="120" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '已发布' : '草稿' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" width="140">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('update', row.id)" v-hasPermi="['ip:thought:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)" v-hasPermi="['ip:thought:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <ThoughtForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { getThoughtPage, deleteThought } from '@/api/ip/thought'
import ThoughtForm from './ThoughtForm.vue'

defineOptions({ name: 'IpThought' })

const loading = ref(false)
const list = ref([])
const total = ref(0)
const queryParams = reactive({ pageNo: 1, pageSize: 10, mood: undefined, status: undefined })
const queryFormRef = ref()
const formRef = ref()

const getList = async () => {
  loading.value = true
  try { const data = await getThoughtPage(queryParams); list.value = data.list; total.value = data.total }
  finally { loading.value = false }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const openForm = (type: string, id?: number) => formRef.value.open(type, id)
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除该随想？', '提示', { type: 'warning' })
  await deleteThought(id); ElMessage.success('删除成功'); getList()
}
onMounted(() => getList())
</script>
