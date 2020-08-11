<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="400px"
    @close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" size="small" label-width="130px">
      <el-form-item label="公司代码" prop="companyCode">
        <el-input v-model="form.companyCode" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="form.companyName" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="组织架构" prop="organizationName">
        <Lover v-model="form.organizationId" code="ORGANIZATION_SELECT"/>
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model="form.contactPerson" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" style="width: 224px"/>
      </el-form-item>
      <el-form-item label="母公司">
        <Treeselect
          v-model="form.pid"
          :options="companyTree"
          style="width: 224px"
          placeholder="选择母公司"
          size="small"/>
      </el-form-item>
      <el-form-item label="状态" prop="enabledFlag">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabledFlag" :label="item.value">{{ item.label }}
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
import { add, edit } from '@/api/fd/company'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getTree } from '@/api/fd/company'

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
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        companyId: '',
        address: '',
        companyCode: '',
        companyName: '',
        organizationId: '',
        organizationName: '',
        contactPerson: '',
        createTime: '',
        enabledFlag: 'Y',
        booksId: '',
        booksName: '',
        pid: 0
      },
      rules: {
        companyCode: [
          { required: true, message: '请输入公司代码', trigger: ['blur', 'change'] }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: ['blur', 'change'] }
        ],
        enabledFlag: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      companyTree: [{ id: 0, label: '顶级类目', children: [] }]
    }
  },
  methods: {
    getCompanyTree() {
      getTree().then(res => {
        const firstContent = { id: 0, label: '顶级类目', children: [] }
        firstContent.children = res
        this.companyTree = [firstContent]
      })
    },
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
        } else {
          this.$message({
            message: '必输字段不能为空',
            type: 'warning'
          })
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
        companyId: '',
        address: '',
        companyCode: '',
        companyName: '',
        organizationId: '',
        organizationName: '',
        contactPerson: '',
        createTime: '',
        enabledFlag: 'Y',
        booksId: '',
        booksName: '',
        pid: 0
      }
    }
  }
}
</script>

<style scoped>

</style>
