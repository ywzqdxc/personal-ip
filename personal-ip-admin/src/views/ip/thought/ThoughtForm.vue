<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="620px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="内容" prop="content">
        <el-input v-model="formData.content" type="textarea" :rows="5" placeholder="写下你的随想..." />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="心情">
            <el-input v-model="formData.mood" placeholder="如：开心、平静、感悟..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签">
            <el-input v-model="formData.tags" placeholder="tag1,tag2（逗号分隔）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="配图 URL">
        <el-input v-model="formData.imageUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status">
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { getThought, createThought, updateThought } from '@/api/ip/thought'

defineOptions({ name: 'IpThoughtForm' })
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const formData = reactive({ id: undefined, content: '', mood: '', tags: '', imageUrl: '', status: 0 })
const formRules = {
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增随想' : '编辑随想'
  Object.assign(formData, { id: undefined, content: '', mood: '', tags: '', imageUrl: '', status: 0 })
  if (id) { const data = await getThought(id); Object.assign(formData, data) }
}
defineExpose({ open })

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    formData.id ? await updateThought(formData) : await createThought(formData)
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    emit('success')
  } finally { submitting.value = false }
}
</script>
