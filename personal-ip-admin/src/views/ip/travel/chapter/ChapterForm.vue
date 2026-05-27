<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="750px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="所属行程 ID" prop="tripId">
            <el-input-number v-model="formData.tripId" :min="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序">
            <el-input-number v-model="formData.sortOrder" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="序号" prop="num">
            <el-input v-model="formData.num" placeholder="01" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="BROMO" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="中文名称">
            <el-input v-model="formData.chinese" placeholder="布 罗 莫" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="日期标签">
            <el-input v-model="formData.dateLabel" placeholder="04.26" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地区">
            <el-input v-model="formData.region" placeholder="EAST JAVA" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国家">
            <el-input v-model="formData.country" placeholder="INDONESIA" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="区域">
            <el-input v-model="formData.area" placeholder="JAVA" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="坐标">
            <el-input v-model="formData.coords" placeholder="-7.906, 112.950" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间">
            <el-input v-model="formData.time" placeholder="04:29" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标签">
        <el-input v-model="formData.tags" placeholder="crater · viewpoint" />
      </el-form-item>
      <el-form-item label="诗句/引用">
        <el-input v-model="formData.quote" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="照片说明">
        <el-input v-model="formData.caption" />
      </el-form-item>
      <el-form-item label="拍摄点">
        <el-input v-model="formData.spots" placeholder="JSON 数组格式" />
      </el-form-item>
      <el-form-item label="封面图">
        <el-input v-model="formData.coverImg" placeholder="https://..." />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="背景色">
            <el-input v-model="formData.bg" placeholder="#b52c20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字色">
            <el-input v-model="formData.textColor" placeholder="#1a0a06" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="页码">
            <el-input v-model="formData.pageNum" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总曝光">
            <el-input v-model="formData.totalExp" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系表">
            <el-input v-model="formData.contactSheet" />
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
import { getChapter, createChapter, updateChapter } from '@/api/ip/travel/chapter'

defineOptions({ name: 'IpTravelChapterForm' })
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()
const formData = reactive({
  id: undefined, tripId: undefined, num: '', name: '', chinese: '',
  dateLabel: '', region: '', country: '', area: '', coords: '',
  locationCn: '', time: '', tags: '', quote: '', caption: '', spots: '',
  coverImg: '', coverGrad: '', tintColor: '', bg: '', textColor: '',
  accent: '', pageNum: '', totalExp: '', contactSheet: '', sortOrder: 0
})
const formRules = {
  tripId: [{ required: true, message: '所属行程不能为空', trigger: 'blur' }],
  num: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
}

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增旅行章节' : '编辑旅行章节'
  Object.assign(formData, {
    id: undefined, tripId: undefined, num: '', name: '', chinese: '',
    dateLabel: '', region: '', country: '', area: '', coords: '',
    locationCn: '', time: '', tags: '', quote: '', caption: '', spots: '',
    coverImg: '', coverGrad: '', tintColor: '', bg: '', textColor: '',
    accent: '', pageNum: '', totalExp: '', contactSheet: '', sortOrder: 0
  })
  if (id) {
    const data = await getChapter(id)
    Object.assign(formData, data)
  }
}
defineExpose({ open })

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    formData.id ? await updateChapter(formData) : await createChapter(formData)
    ElMessage.success(formData.id ? '修改成功' : '新增成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>
