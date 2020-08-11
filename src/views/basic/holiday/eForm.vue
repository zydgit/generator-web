<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="400px"
    @close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" size="small" label-width="130px">
      <el-form-item label="公共假期类型" prop="holidayType">
        <el-select v-model="form.holidayType" style="width: 224px" filterable placeholder="请选择">
          <el-option
            v-for="item in dictMap['FST.HOLIDAY_TYPE']"
            :key="item.id"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="公共假期名称" prop="holidayName">
        <el-input v-model="form.holidayName" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="假期范围" prop="date">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          style="width: 224px"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" style="width: 224px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="xy-primary" size="small" @click="doSubmit">确认</el-button>
      <el-button type="xy-cancel" size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/basic/fndCalendarHoliday'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dictMap: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        holidayId: '',
        holidayType: '',
        holidayName: '',
        startDate: '',
        endDate: '',
        remark: '',
        date: []
      },
      rules: {
        holidayType: [
          { required: true, message: '公共假期类型不能为空', trigger: ['blur', 'change'] }
        ],
        holidayName: [
          { required: true, message: '公共假期名称不能为空', trigger: ['blur', 'change'] }
        ],
        date: [
          { required: true, message: '假期范围', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doEdit()
          }
        }
      })
    },
    doAdd() {
      this.form.startDate = this.form.date[0]
      this.form.endDate = this.form.date[1]
      add(this.form).then(res => {
        this.resetForm()
        this.addSuccessNotify()
        this.loading = false
        this.$emit('refresh')
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      this.form.startDate = this.form.date[0]
      this.form.endDate = this.form.date[1]
      edit(this.form).then(res => {
        this.resetForm()
        this.editSuccessNotify()
        this.loading = false
        this.$emit('refresh')
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        holidayId: '',
        holidayType: '',
        holidayName: '',
        remark: '',
        date: []
      }
    }
  }
}
</script>

<style scoped>

</style>
