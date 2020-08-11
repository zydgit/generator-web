<template>
  <div class="app-container">
    <!--工具栏-->
    <AdvancedSearch :query="query" :title="$route.name" @refresh="toQuery" @add="add" @query="toQuery">
      <el-row>
        <el-col :span="6">
          <el-form-item label="岗位名称">
            <el-input
              v-model="query.name"
              clearable
              placeholder="输入岗位名称搜索"
              style="width: 224px"
              @keyup.enter.native="toQuery"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select
              v-model="query.enabledFlag"
              clearable
              placeholder="请选择"
              style="width: 224px"
              @change="toQuery">
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-slot:other>
        <el-button
          :loading="exportLoading"
          size="mini"
          type="xy-primary"
          icon="el-icon-download"
          @click="exportExcel">导出
        </el-button>
      </template>
    </AdvancedSearch>
    <!--表单组件-->
    <eForm ref="form" :dept-id="deptId" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <div class="content-container">
      <el-table v-loading="loading" :data="data" border size="mini" style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="name" label="岗位名称"/>
        <el-table-column :show-overflow-tooltip="true" prop="jobCode" label="岗位代码"/>
        <el-table-column :show-overflow-tooltip="true" prop="belongDeptName" label="所属部门"/>
        <el-table-column :show-overflow-tooltip="true" prop="sort" label="排序" width="80px">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="状态" align="center" width="120px">
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
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" width="150px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_EDIT','USERJOB_DELETE'])"
          label="操作"
          width="140px"
          align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN','USERJOB_ALL','USERJOB_EDIT']"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"/>
            <el-popover
              v-permission="['ADMIN','USERJOB_ALL','USERJOB_DELETE']"
              :ref="scope.row.id"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="xy-primary" size="mini" @click="subDelete(scope.row.id)">确定
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
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/system/job'
import { parseTime } from '@/utils/index'
import eForm from './form'
import { download } from '@/api/system/data'
import { downloadFile } from '@/utils/index'

export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      deptId: this.$route.query.deptId,
      delLoading: false,
      enabledTypeOptions: [
        { key: 'Y', display_name: '正常' },
        { key: 'N', display_name: '禁用' }
      ],
      query: {
        name: '',
        enabledFlag: ''
      },
      exportLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
      this.getDict('FST_STATUS')
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/job'
      const sort = 'sort,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.keys(this.query).forEach(key => {
        if (this.query[key]) {
          this.params[key] = this.query[key]
        }
      })
      this.params.deptId = this.deptId
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.delChangePage()
        this.init()
        this.delSuccessNotify()
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        name: data.name,
        jobCode: data.jobCode,
        sort: data.sort,
        enabledFlag: data.enabledFlag.toString(),
        createTime: data.createTime,
        dept: { id: data.dept.id }
      }
      _this.deptId = data.dept.id
      _this.dialog = true
    },
    exportExcel() {
      this.exportLoading = true
      download('api/job/excel', { deptId: this.deptId }).then(blob => {
        downloadFile(blob, this.$route.query.deptName + '-岗位表', 'xlsx')
      }).catch(() => {
      }).finally(() => {
        this.exportLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
