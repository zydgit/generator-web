<template>
  <div class="app-container">
    <AdvancedSearch :query="query" :title="$route.name" @refresh="toQuery" @add="add" @query="toQuery"/>

    <div class="content-container">
      <el-table v-loading="loading" :data="data" size="mini" border style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="organizationCode" label="组织架构代码"/>
        <el-table-column :show-overflow-tooltip="true" prop="organizationName" label="组织架构名称"/>
        <el-table-column :show-overflow-tooltip="true" label="部门管理" align="center">
          <template slot-scope="scope">
            <router-link
              :style="{color:'blue'}"
              :to="{name: '部门管理', query:{organizationId: scope.row.organizationId, organizationName: scope.row.organizationName }}">
              部门管理
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="enabledFlag" label="启用标志">
          <template slot-scope="scope">
            <div v-for="item in dictMap['FST_STATUS']" :key="item.id">
              <el-tag
                v-if="scope.row.enabledFlag.toString() === item.value"
                :type="scope.row.enabledFlag === 'Y' ? '' : 'info'">{{ item.label }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(['ADMIN','ORGANIZATION_ALL','ORGANIZATION_EDIT','ORGANIZATION_DELETE'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['ADMIN','ORGANIZATION_ALL','ORGANIZATION_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
            <pop-confirm
              v-permission="['ADMIN','ORGANIZATION_ALL','ORGANIZATION_DELETE']"
              :del-loading="delLoading"
              title="此操作会删除此组织架构下的所有部门和岗位, 确定删除吗?"
              @confirm="subDelete(scope.row.organizationId)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
            </pop-confirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="footer-container">
      <el-pagination
        :total="total"
        :current-page="page + 1"
        background
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </div>

    <eForm ref="form" :is-add="isAdd" :dict-map="dictMap" @refresh="toQuery"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/basic/organization'
import eForm from './eForm'

export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getDictMap('FST_STATUS')
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/organization'
      const sort = 'organizationId,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.keys(this.query).forEach(key => {
        if (this.query[key]) {
          this.params[key] = this.query[key]
        }
      })
      return true
    },
    subDelete(organizationId) {
      this.delLoading = true
      del([organizationId]).then(res => {
        this.delLoading = false
        this.delChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
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
      _this.form = { ...data }
      _this.dialog = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
