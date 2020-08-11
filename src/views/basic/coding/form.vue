<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="400px"
    @close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" size="small" label-width="130px">
      <el-form-item label="公司" prop="companyId">
        <el-select v-model="form.companyId" :disabled="!isAdd" style="width: 224px">
          <el-option
            v-for="item in companies"
            :key="item.companyId"
            :label="item.companyName"
            :value="item.companyId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="编码规则代码" prop="codingRuleCode">
        <el-input v-model="form.codingRuleCode" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="重置频率">
        <el-select v-model="form.resetFrequence" placeholder="请选择重置频率" style="width: 224px">
          <el-option
            v-for="item in dictMap['FST.CODING_RULE_RESET_FREQUENCY']"
            :key="item.id"
            :label="item.label"
            :value="item.value"/>
        </el-select>

      </el-form-item>

      <el-form-item label="单据类别">
        <el-select v-model="form.documentCategory" placeholder="请选择单据类别" style="width: 224px">
          <el-option
            label="凭证编号"
            value="JE_NUMBER"/>
        </el-select>
      </el-form-item>

      <el-form-item label="启用标志">
        <el-radio v-for="item in dictMap['FST_STATUS']" :key="item.id" v-model="form.enabledFlag" :label="item.value">{{
        item.label }}
        </el-radio>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="xy-primary" size="small" @click="doSubmit">确认</el-button>
      <el-button type="xy-cancel" size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/basic/codingRules'

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
    companies: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        codingRuleId: '',
        companyId: '',
        codingRuleCode: '',
        description: '',
        resetFrequence: '',
        enabledFlag: 'Y',
        documentCategory: 'JE_NUMBER'
      },
      rules: {
        codingRuleCode: [
          { required: true, message: '请输入编码规则代码', trigger: ['blur', 'change'] }
        ],
        companyId: { required: true, message: '请选择公司', trigger: ['blur', 'change'] }
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
      add(this.form).then(res => {
        this.resetForm()
        this.addSuccessNotify()
        this.loading = false
        this.$parent.init()
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
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        codingRuleId: '',
        companyId: '',
        codingRuleCode: '',
        description: '',
        resetFrequence: '',
        enabledFlag: 'Y',
        documentCategory: 'JE_NUMBER'
      }
    }
  }
}
</script>

<style scoped>

</style>
