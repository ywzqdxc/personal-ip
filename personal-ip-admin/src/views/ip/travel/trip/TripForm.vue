<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="年份" prop="year">
            <el-input-number v-model="formData.year" :min="2000" :max="2099" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序">
            <el-input-number v-model="formData.sortOrder" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="主标题" prop="title">
        <el-input v-model="formData.title" placeholder="如 BALI" />
      </el-form-item>
      <el-form-item label="年份标题">
        <el-input v-model="formData.titleYear" placeholder="如 2026" />
      </el-form-item>
      <el-form-item label="副标题">
        <el-input v-model="formData.subtitle" placeholder="如 TRAVEL JOURNAL" />
      </el-form-item>
      <el-form-item label="中文标题">
        <el-input v-model="formData.chinese" placeholder="如 巴 厘 · 二 〇 二 六" />
      </el-form-item>
      <el-form-item label="标语">
        <el-input v-model="formData.tagline" type="textarea" :rows="2" placeholder="多行标语" />
      </el-form-item>
      <el-form-item label="胶片标签">
        <el-input v-model="formData.filmLabel" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="页眉">
        <el-input v-model="formData.filmHeader" />
      </el-form-item>
      <el-form-item label="显影信息">
        <el-input v-model="formData.devCredit" />
      </el-form-item>
      <el-form-item label="侧面文字">
        <el-input v-model="formData.sideText" />
      </el-form-item>
      <el-form-item label="封面图 URL">
        <el-input v-model="formData.coverImg" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="强调色">
        <el-input v-model="formData.accentColor" placeholder="#e04030" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status">
          <el-option label="草稿" :value="0" />
          <el-option label="发布" :value="1" />
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
import { getTrip, createTrip, updateTrip } from '@/api/ip/travel/trip'

defineOptions({ name: 'IpTravelTripForm' })
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const formData = reactive({
  id: undefined, year: new Date().getFullYear(), title: '', titleYear: '',
  subtitle: '', chinese: '', tagline: '', filmLabel: '', filmHeader: '',
  devCredit: '', sideText: '', coverImg: '', accentColor: '', sortOrder: 0, status: 0
})
const formRules = {
  year: [{ required: true, message: '年份不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '主标题不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增旅行行程' : '编辑旅行行程'
  Object.assign(formData, { id: undefined, year: new Date().getFullYear(), title: '', titleYear: '', subtitle: '', chinese: '', tagline: '', filmLabel: '', filmHeader: '', devCredit: '', sideText: '', coverImg: '', accentColor: '', sortOrder: 0, status: 0 })
  if (id) {
    const data = await getTrip(id)
    Object.assign(formData, data)
  }
}
defineExpose({ open })

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    formData.id ? await updateTrip(formData) : await createTrip(formData)
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>
