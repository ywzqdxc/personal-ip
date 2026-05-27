<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
      <el-form-item label="所属行程 ID" prop="tripId">
        <el-input-number v-model="queryParams.tripId" :min="1" placeholder="行程 ID" />
      </el-form-item>
      <el-form-item label="章节名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" class="!w-160px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['ip:travel-chapter:create']">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" align="center" />
      <el-table-column label="行程 ID" prop="tripId" width="80" align="center" />
      <el-table-column label="序号" prop="num" width="60" align="center" />
      <el-table-column label="名称" prop="name" min-width="100" />
      <el-table-column label="中文" prop="chinese" min-width="120" />
      <el-table-column label="地区" prop="region" min-width="100" />
      <el-table-column label="日期" prop="dateLabel" width="80" align="center" />
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="创建时间" prop="createTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" width="140">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('update', row.id)" v-hasPermi="['ip:travel-chapter:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)" v-hasPermi="['ip:travel-chapter:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <ChapterForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { getChapterPage, deleteChapter } from '@/api/ip/travel/chapter'
import ChapterForm from './ChapterForm.vue'

defineOptions({ name: 'IpTravelChapter' })

const loading = ref(false)
const list = ref([])
const total = ref(0)
const queryParams = reactive({ pageNo: 1, pageSize: 10, tripId: undefined, name: undefined })
const queryFormRef = ref()
const formRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await getChapterPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }

const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除该章节？删除后将同时删除关联的照片。', '提示', { type: 'warning' })
  await deleteChapter(id)
  ElMessage.success('删除成功')
  getList()
}

onMounted(() => getList())
</script>
