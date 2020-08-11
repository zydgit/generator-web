<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="400px"
    @close="resetForm">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="left"
      label-width="130px">
      <el-form-item
        prop="organizationCode"
        label="组织架构代码">
        <el-input v-model="form.organizationCode" style="width: 224px;"/>
      </el-form-item>
      <el-form-item
        prop="organizationName"
        label="组织架构名称">
        <el-input v-model="form.organizationName" style="width: 224px;"/>
      </el-form-item>
      <el-form-item
        label="启用标志">
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
import { add, edit } from '@/api/basic/organization'

export default {
  props: {
    dictMap: {
      type: Object,
      required: true
    },
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        organizationId: '',
        organizationCode: '',
        organizationName: '',
        enabledFlag: 'Y'
      },
      rules: {
        organizationCode: { required: true, message: '请输入组织架构代码', trigger: ['blur', 'change'] },
        organizationName: { required: true, message: '请输入组织架构名称', trigger: ['blur', 'change'] }
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
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$emit('refresh')
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
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
        organizationId: '',
        organizationCode: '',
        organizationName: '',
        enabledFlag: 'Y'
      }
    }
  }
}
</script>

<style scoped>

</style>
