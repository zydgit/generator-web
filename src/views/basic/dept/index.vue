<template>
  <div class="app-container">
    <!--工具栏-->
    <AdvancedSearch :query="query" :title="$route.name" @refresh="toQuery" @add="add" @query="toQuery">
      <el-row>
        <el-col :span="6">
          <el-form-item label="部门名称">
            <el-input
              v-model="query.name"
              clearable
              placeholder="输入部门名称搜索"
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
          size="mini"
          type="xy-primary"
          icon="el-icon-more"
          @click="changeExpand">{{ expand ? '折叠' : '展开' }}
        </el-button>
        <el-button
          :loading="exportLoading"
          size="mini"
          type="xy-primary"
          icon="el-icon-download"
          @click="exportExcel">导出
        </el-button>
        <el-button
          :loading="exportDeptLoading"
          size="mini"
          type="xy-primary"
          icon="el-icon-download"
          @click="exportAllDeptExcel">导出所有岗位
        </el-button>
      </template>
    </AdvancedSearch>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :company-id="10152" :dicts="dicts"/>
    <!--表格渲染-->
    <div class="content-container">
      <el-table
        v-loading="loading"
        ref="table"
        :data="data"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        row-key="id"
        size="mini"
        default-expand-all
        @row-click="expandChange">
        <el-table-column :show-overflow-tooltip="true" label="名称" prop="name"/>
        <el-table-column :show-overflow-tooltip="true" label="代码" prop="deptCode"/>
        <el-table-column :show-overflow-tooltip="true" label="NC部门档案代码" prop="ncDeptCode"/>
        <el-table-column :show-overflow-tooltip="true" label="状态" align="center">
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
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="岗位管理" align="center">
          <template slot-scope="scope">
            <router-link :style="{color:'blue'}" :to="{name: '岗位管理', query:{deptId: scope.row.id, deptName: scope.row.name}}">
              岗位管理
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          v-if="checkPermission(['ADMIN','DEPT_ALL','DEPT_EDIT','DEPT_DELETE'])"
          label="操作"
          width="140px"
          align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN','DEPT_ALL','DEPT_EDIT']"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"/>
            <el-popover
              v-permission="['ADMIN','DEPT_ALL','DEPT_DELETE']"
              :ref="scope.row.id"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="xy-primary" size="mini" @click="subDelete(scope.row.id)">确定
                </el-button>
              </div>
              <el-button
                slot="reference"
                :disabled="scope.row.id === 1"
                type="danger"
                icon="el-icon-delete"
                size="mini"/>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/system/dept'
import { parseTime } from '@/utils/index'
import eForm from './form'
import { download } from '@/api/system/data'
import { downloadFile } from '@/utils/index'

export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      organizationId: this.$route.query.organizationId,
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
      enabledTypeOptions: [
        { key: 'Y', display_name: '正常' },
        { key: 'N', display_name: '禁用' }
      ],
      delLoading: false, expand: false,
      query: {
        name: '',
        enabledFlag: ''
      },
      exportLoading: false,
      exportDeptLoading: false
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
      this.url = 'api/dept'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.keys(this.query).forEach(key => {
        if (this.query[key]) {
          this.params[key] = this.query[key]
        }
      })
      this.params.organizationId = this.organizationId
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
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
      const _this = this.$refs.form
      _this.getDepts()
      _this.dialog = true
    },
    changeExpand() {
      this.expand = !this.expand
      this.data.forEach(item => {
        this.$refs.table.toggleRowExpansion({ id: item.id }, this.expand)
      })
    },
    expandChange(row) {
      this.$refs.table.toggleRowExpansion(row)
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getDepts()
      _this.form = {
        id: data.id,
        name: data.name,
        deptCode: data.deptCode,
        pid: data.pid || null,
        createTime: data.createTime,
        enabledFlag: data.enabledFlag.toString(),
        organizationId: data.organizationId,
        ncDeptCode: data.ncDeptCode
      }
      _this.dialog = true
    },
    exportExcel() {
      this.exportLoading = true
      download('api/dept/excel', { organizationId: this.organizationId }).then(blob => {
        downloadFile(blob, this.$route.query.organizationName + '-部门表', 'xlsx')
      }).catch(() => {
      }).finally(() => {
        this.exportLoading = false
      })
    },
    exportAllDeptExcel() {
      this.exportDeptLoading = true
      download('api/job/excel').then(blob => {
        downloadFile(blob, this.$route.query.organizationName + '-岗位表', 'xlsx')
      }).catch(() => {
      }).finally(() => {
        this.exportDeptLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
