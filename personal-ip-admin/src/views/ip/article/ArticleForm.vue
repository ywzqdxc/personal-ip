<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="720px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="URL Slug" prop="slug">
        <el-input v-model="formData.slug" placeholder="如：my-article（用于 URL）" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="分类">
            <el-input v-model="formData.category" placeholder="如：技术、生活、思考" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签">
            <el-input v-model="formData.tags" placeholder="tag1,tag2（逗号分隔）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="封面图 URL">
        <el-input v-model="formData.coverUrl" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="formData.summary" type="textarea" :rows="2" placeholder="文章简短摘要" />
      </el-form-item>
      <el-form-item label="正文内容">
        <el-input v-model="formData.content" type="textarea" :rows="8" placeholder="支持 Markdown 格式" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="置顶">
            <el-switch v-model="formData.pinned" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status">
              <el-option label="草稿" :value="0" />
              <el-option label="已发布" :value="1" />
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
import { getArticle, createArticle, updateArticle } from '@/api/ip/article'

defineOptions({ name: 'IpArticleForm' })
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const formData = reactive({
  id: undefined, title: '', slug: '', coverUrl: '', summary: '', content: '',
  tags: '', category: '', pinned: false, status: 0
})
const formRules = {
  title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
  slug: [{ required: true, message: 'Slug 不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增文章' : '编辑文章'
  Object.assign(formData, { id: undefined, title: '', slug: '', coverUrl: '', summary: '', content: '', tags: '', category: '', pinned: false, status: 0 })
  if (id) { const data = await getArticle(id); Object.assign(formData, data) }
}
defineExpose({ open })

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    formData.id ? await updateArticle(formData) : await createArticle(formData)
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    emit('success')
  } finally { submitting.value = false }
}
</script>
