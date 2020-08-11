<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="400px"
    @close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" size="small" label-width="130px">
      <el-form-item label="顺序" prop="sequence">
        <el-input v-model="form.sequence" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="段值类型" prop="segmentType">
        <el-select v-model="form.segmentType" placeholder="请选择段值类型" style="width: 224px">
          <el-option
            v-for="item in dictMap['FST.CODING_RULE_SEGMENT']"
            :key="item.id"
            :label="item.label"
            :value="item.value"/>
        </el-select>

      </el-form-item>
      <el-form-item label="固定字符">
        <el-input :disabled="form.segmentType !== 'SYS_01'" v-model="form.segmentValue" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="日期格式">
        <el-select
          :disabled="form.segmentType !== 'SYS_02'"
          v-model="form.dateFormat"
          placeholder="请选择段值类型"
          style="width: 224px">
          <el-option
            v-for="item in dictMap['FST.CODING_RULE_DATE_FORMAT']"
            :key="item.id"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="长度">
        <el-input :disabled="form.segmentType !== 'SYS_03'" v-model="form.length" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="增量">
        <el-input :disabled="form.segmentType !== 'SYS_03'" v-model="form.incremental" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="起始值">
        <el-input :disabled="form.segmentType !== 'SYS_03'" v-model="form.startValue" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="form.note" style="width: 224px"/>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="xy-primary" size="small" @click="doSubmit">确认</el-button>
      <el-button type="xy-cancel" size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/basic/codingRuleDetails'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dictMap: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        codingRuleLineId: '',
        codingRuleId: '',
        sequence: '',
        segmentType: '',
        segmentValue: '',
        note: '',
        dateFormat: '',
        length: '',
        incremental: '',
        startValue: ''
      },
      rules: {
        codingRuleId: [
          { required: true, message: 'please enter', trigger: ['blur', 'change'] }
        ],
        sequence: [
          { required: true, message: 'please enter', trigger: ['blur', 'change'] }
        ],
        segmentType: [
          { required: true, message: 'please enter', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else {
        this.doEdit()
      }
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.addSuccessNotify()
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.editSuccessNotify()
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        codingRuleLineId: '',
        codingRuleId: '',
        sequence: '',
        segmentType: '',
        segmentValue: '',
        note: '',
        dateFormat: '',
        length: '',
        incremental: '',
        startValue: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
