<template>
  <div class="app-container">
    <!--工具栏-->
    <AdvancedSearch :query="query" :title="$route.name" @refresh="toQuery" @add="add" @query="toQuery">
      <el-row>
        <el-col :span="6">
          <el-form-item label="公司代码">
            <el-input
              v-model="query.companyCode"
              clearable
              placeholder="输入公司代码搜索"
              style="width: 224px"
              @keyup.enter.native="toQuery"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公司名称">
            <el-input
              v-model="query.companyName"
              clearable
              placeholder="输入公司名称搜索"
              style="width: 224px"
              @keyup.enter.native="toQuery"/>
          </el-form-item>
        </el-col>
      </el-row>
    </AdvancedSearch>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <div class="content-container">
      <el-table v-loading="loading" :data="data" border size="mini" style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="companyCode" label="公司代码" width="100px"/>
        <el-table-column :show-overflow-tooltip="true" prop="companyName" label="公司名称"/>
        <el-table-column :show-overflow-tooltip="true" prop="organizationName" label="组织架构"/>
        <el-table-column :show-overflow-tooltip="true" prop="contactPerson" label="联系人" width="100px"/>
        <el-table-column :show-overflow-tooltip="true" prop="address" label="地址"/>
        <el-table-column :show-overflow-tooltip="true" prop="parentCompanyName" label="母公司"/>
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" width="150px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="enabledFlag" label="状态" align="center" width="100px">
          <template slot-scope="scope">
            <div v-for="item in dicts" :key="item.id">
              <el-tag
                v-if="scope.row.enabledFlag.toString() === item.value"
                :type="scope.row.enabledFlag === 'Y' ? '' : 'info'">
                {{ item.label }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['ADMIN','COMPANY_ALL','COMPANY_EDIT','COMPANY_DELETE'])"
          label="操作"
          width="150px"
          align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN','COMPANY_ALL','COMPANY_EDIT']"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"/>
            <el-popover
              v-permission="['ADMIN','COMPANY_ALL','COMPANY_DELETE']"
              :ref="scope.row.companyId"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.companyId].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="xy-primary" size="mini" @click="subDelete(scope.row.companyId)">
                  确定
                </el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页组件-->
    <div class="footer-container">
      <el-pagination
        :total="total"
        :current-page="page + 1"
        background
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/fd/company'
import { parseTime } from '@/utils/index'
import eForm from './form'
import initDict from '@/mixins/initDict'

export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      query: {
        companyCode: '',
        companyName: ''
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getDict('FST_STATUS')
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/company'
      const sort = 'companyId,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.keys(this.query).forEach(key => {
        if (this.query[key]) {
          this.params[key] = this.query[key]
        }
      })
      return true
    },
    subDelete(companyId) {
      this.delLoading = true
      del(companyId).then(res => {
        this.delLoading = false
        this.$refs[companyId].doClose()
        this.delChangePage()
        this.init()
        this.delSuccessNotify()
      }).catch(err => {
        this.delLoading = false
        this.$refs[companyId].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.getCompanyTree()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getCompanyTree()
      _this.form = {
        companyId: data.companyId,
        address: data.address,
        companyCode: data.companyCode,
        companyName: data.companyName,
        organizationName: data.organizationName,
        organizationId: data.organizationId,
        contactPerson: data.contactPerson,
        createTime: data.createTime,
        enabledFlag: data.enabledFlag,
        booksId: data.booksId,
        pid: data.pid
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
