<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="680px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
      <el-form-item label="章节标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入章节标题" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="目的地" prop="destination">
            <el-input v-model="formData.destination" placeholder="如：Bali, Indonesia" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="旅行日期">
            <el-date-picker v-model="formData.tripDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="封面图 URL">
            <el-input v-model="formData.coverUrl" placeholder="https://..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主题色">
            <el-color-picker v-model="formData.accentColor" />
            <el-input v-model="formData.accentColor" placeholder="#3B82F6" style="margin-left:8px;width:120px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="摘要">
        <el-input v-model="formData.summary" type="textarea" :rows="2" placeholder="简短摘要" />
      </el-form-item>
      <el-form-item label="正文内容">
        <el-input v-model="formData.content" type="textarea" :rows="6" placeholder="支持 Markdown 格式" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="排序">
            <el-input-number v-model="formData.sortOrder" :min="0" />
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
import { getTravelDiary, createTravelDiary, updateTravelDiary } from '@/api/ip/travelDiary'

defineOptions({ name: 'IpTravelDiaryForm' })
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const formData = reactive({
  id: undefined, title: '', destination: '', tripDate: '', coverUrl: '',
  accentColor: '#3B82F6', summary: '', content: '', sortOrder: 0, status: 0
})
const formRules = {
  title: [{ required: true, message: '章节标题不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增旅行日记' : '编辑旅行日记'
  Object.assign(formData, { id: undefined, title: '', destination: '', tripDate: '', coverUrl: '', accentColor: '#3B82F6', summary: '', content: '', sortOrder: 0, status: 0 })
  if (id) {
    const data = await getTravelDiary(id)
    Object.assign(formData, data)
  }
}
defineExpose({ open })

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    formData.id ? await updateTravelDiary(formData) : await createTravelDiary(formData)
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>
