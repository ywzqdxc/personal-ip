<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="620px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="角色/职位">
        <el-input v-model="formData.role" placeholder="如：全栈工程师、设计师..." />
      </el-form-item>
      <el-form-item label="头像 URL">
        <el-input v-model="formData.avatarUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="formData.bio" type="textarea" :rows="3" placeholder="一段简短的个人介绍" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="GitHub">
            <el-input v-model="formData.githubUrl" placeholder="https://github.com/..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="LinkedIn">
            <el-input v-model="formData.linkedinUrl" placeholder="https://linkedin.com/in/..." />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="排序">
            <el-input-number v-model="formData.sortOrder" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status">
              <el-option label="禁用" :value="0" />
              <el-option label="启用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { getTeamMember, createTeamMember, updateTeamMember } from '@/api/ip/team'

defineOptions({ name: 'IpTeamMemberForm' })
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const formData = reactive({
  id: undefined, name: '', role: '', avatarUrl: '', bio: '',
  githubUrl: '', linkedinUrl: '', sortOrder: 0, status: 1
})
const formRules = {
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增团队成员' : '编辑团队成员'
  Object.assign(formData, { id: undefined, name: '', role: '', avatarUrl: '', bio: '', githubUrl: '', linkedinUrl: '', sortOrder: 0, status: 1 })
  if (id) { const data = await getTeamMember(id); Object.assign(formData, data) }
}
defineExpose({ open })

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    formData.id ? await updateTeamMember(formData) : await createTeamMember(formData)
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    emit('success')
  } finally { submitting.value = false }
}
</script>
