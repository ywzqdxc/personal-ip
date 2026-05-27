<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="680px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="URL Slug" prop="slug">
        <el-input v-model="formData.slug" placeholder="如：my-project（用于 URL）" />
      </el-form-item>
      <el-form-item label="简短描述">
        <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="一句话描述" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="封面图 URL">
            <el-input v-model="formData.coverUrl" placeholder="https://..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预览图 URL">
            <el-input v-model="formData.previewUrl" placeholder="https://..." />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="GitHub 链接">
            <el-input v-model="formData.githubUrl" placeholder="https://github.com/..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="演示链接">
            <el-input v-model="formData.demoUrl" placeholder="https://..." />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="技术栈">
        <el-input v-model="formData.techStack" placeholder="Next.js,Java,Three.js（逗号分隔）" />
      </el-form-item>
      <el-form-item label="Markdown 正文">
        <el-input v-model="formData.content" type="textarea" :rows="5" placeholder="支持 Markdown 格式" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="排序">
            <el-input-number v-model="formData.sortOrder" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否置顶">
            <el-switch v-model="formData.featured" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status">
              <el-option label="草稿" :value="0" />
              <el-option label="发布" :value="1" />
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
import { getProject, createProject, updateProject } from '@/api/ip/project'

defineOptions({ name: 'IpProjectForm' })
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const formData = reactive({
  id: undefined, name: '', slug: '', description: '', coverUrl: '', previewUrl: '',
  githubUrl: '', demoUrl: '', techStack: '', content: '', sortOrder: 0, featured: false, status: 0
})
const formRules = { name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }], slug: [{ required: true, message: 'Slug 不能为空', trigger: 'blur' }], status: [{ required: true, message: '请选择状态', trigger: 'change' }] }

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增项目展示' : '编辑项目展示'
  Object.assign(formData, { id: undefined, name: '', slug: '', description: '', coverUrl: '', previewUrl: '', githubUrl: '', demoUrl: '', techStack: '', content: '', sortOrder: 0, featured: false, status: 0 })
  if (id) {
    const data = await getProject(id)
    Object.assign(formData, data)
  }
}
defineExpose({ open })

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    formData.id ? await updateProject(formData) : await createProject(formData)
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>
