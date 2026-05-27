<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" class="!w-180px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable class="!w-120px">
          <el-option label="禁用" :value="0" />
          <el-option label="启用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['ip:team:create']">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="60" align="center" />
      <el-table-column label="头像" prop="avatarUrl" width="70" align="center">
        <template #default="{ row }">
          <el-avatar :src="row.avatarUrl" :size="40" v-if="row.avatarUrl" />
          <el-avatar :size="40" v-else>{{ row.name?.charAt(0) }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" min-width="100" />
      <el-table-column label="角色" prop="role" min-width="120" />
      <el-table-column label="简介" prop="bio" min-width="180" show-overflow-tooltip />
      <el-table-column label="排序" prop="sortOrder" width="70" align="center" />
      <el-table-column label="状态" prop="status" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="170" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" width="140">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('update', row.id)" v-hasPermi="['ip:team:update']">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)" v-hasPermi="['ip:team:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <TeamMemberForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { getTeamMemberPage, deleteTeamMember } from '@/api/ip/team'
import TeamMemberForm from './TeamMemberForm.vue'

defineOptions({ name: 'IpTeamMember' })

const loading = ref(false)
const list = ref([])
const total = ref(0)
const queryParams = reactive({ pageNo: 1, pageSize: 10, name: undefined, status: undefined })
const queryFormRef = ref()
const formRef = ref()

const getList = async () => {
  loading.value = true
  try { const data = await getTeamMemberPage(queryParams); list.value = data.list; total.value = data.total }
  finally { loading.value = false }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const openForm = (type: string, id?: number) => formRef.value.open(type, id)
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除该团队成员？', '提示', { type: 'warning' })
  await deleteTeamMember(id); ElMessage.success('删除成功'); getList()
}
onMounted(() => getList())
</script>
