<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增部门' : '编辑部门'"
    width="400px"
    @close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" size="small" label-width="130px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="代码" prop="deptCode">
        <el-input v-model="form.deptCode" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="NC部门档案代码" prop="ncDeptCode">
        <el-input v-model="form.ncDeptCode" style="width: 224px"/>
      </el-form-item>
      <!-- <el-form-item v-if="form.pid !== 0" label="状态" prop="enabledFlag"> -->
      <el-form-item label="状态" prop="enabledFlag">

        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabledFlag" :label="item.value">{{ item.label }}
        </el-radio>
      </el-form-item>
      <!-- <el-form-item v-if="form.pid !== 0" style="margin-bottom: 0px;" label="上级部门"> -->
      <el-form-item style="margin-bottom: 0px;" label="上级部门">
        <treeselect v-model="form.pid" :options="depts" style="width: 224px" placeholder="选择上级类目" size="small"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="xy-primary" size="small" @click="doSubmit">确认</el-button>
      <el-button type="xy-cancel" size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    },
    companyId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, depts: [],
      form: {
        id: '',
        name: '',
        pid: null,
        enabledFlag: 'Y',
        companyId: '',
        deptCode: '',
        ncDeptCode: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
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
          // if (this.form.pid !== undefined) {
          this.loading = true

          if (!this.form.pid) {
            this.form.pid = 0
          }
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doEdit()
          }
          // }
          // else {
          //   this.$message({
          //     message: '上级部门不能为空',
          //     type: 'warning'
          //   })
          // }
        }
      })
    },
    doAdd() {
      this.form.companyId = this.companyId
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
        id: '',
        name: '',
        pid: null,
        enabledFlag: 'Y',
        companyId: '',
        deptCode: '',
        ncDeptCode: ''
      }
    },
    getDepts() {
      getDepts({ enabledFlag: 'Y', companyId: this.companyId }).then(res => {
        const firstContent = { id: 0, label: '顶级类目', children: [] }
        firstContent.children = res.content
        this.depts = [firstContent]
      })
    }
  }
}
</script>

<style scoped>

</style>
