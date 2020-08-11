<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增岗位' : '编辑岗位'"
    width="400px"
    @close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" size="small" label-width="130px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="代码" prop="jobCode">
        <el-input v-model="form.jobCode" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model.number="form.sort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 224px"/>
      </el-form-item>
      <el-form-item v-if="form.pid !== 0" label="状态" prop="enabledFlag">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabledFlag" :label="item.value">{{ item.label }}
        </el-radio>
      </el-form-item>
      <!-- <el-form-item label="所属部门">
        <treeselect v-model="deptId" :options="depts" style="width: 224px" placeholder="选择部门" />
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="xy-primary" size="small" @click="doSubmit">确认</el-button>
      <el-button type="xy-cancel" size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { getDepts } from '@/api/system/dept'
import { add, edit } from '@/api/system/job'
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    },
    deptId: {
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
        sort: 999,
        enabledFlag: 'Y',
        createTime: '',
        dept: { id: '' }
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: ['blur', 'change'], type: 'number' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.dept.id = this.deptId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.deptId === null || this.deptId === undefined) {
            this.$message({
              message: '所属部门不能为空',
              type: 'warning'
            })
          } else {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else {
              this.doEdit()
            }
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
      this.deptId = null
      this.form = {
        id: '',
        name: '',
        sort: 999,
        enabledFlag: 'Y',
        createTime: '',
        dept: { id: '' }
      }
    }
    // getDepts() {
    //   getDepts({ enabledFlag: 'Y' }).then(res => {
    //     this.depts = res.content
    //   })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
