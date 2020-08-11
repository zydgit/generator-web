<template>
  <div class="app-container">
    <!--工具栏-->
    <AdvancedSearch :query="query" :title="$route.name" @refresh="toQuery" @add="add" @query="toQuery">
      <el-row>
        <el-col :span="6">
          <el-form-item label="编码规则代码">
            <el-input
              v-model="query.codingRuleCode"
              clearable
              placeholder="输入编码规则代码搜索"
              style="width: 224px"
              @keyup.enter.native="toQuery"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="描述">
            <el-input
              v-model="query.description"
              clearable
              placeholder="输入描述搜索"
              style="width: 224px"
              @keyup.enter.native="toQuery"/>
          </el-form-item>
        </el-col>
      </el-row>
    </AdvancedSearch>

    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dict-map="dictMap" :companies="companies"/>
    <!--表格渲染-->
    <div class="content-container">
      <el-table v-loading="loading" :data="data" border size="mini" style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="companyName" label="公司名称">
          <template slot-scope="scope">
            <div v-for="item in companies" :key="item.companyId">
              <span v-if="item.companyId === scope.row.companyId">{{ item.companyName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="companyCode" label="公司代码" width="100px">
          <template slot-scope="scope">
            <div v-for="item in companies" :key="item.companyId">
              <span v-if="item.companyId === scope.row.companyId">{{ item.companyCode }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="codingRuleCode" label="编码规则代码" width="140px"/>
        <el-table-column :show-overflow-tooltip="true" prop="description" label="描述"/>
        <el-table-column :show-overflow-tooltip="true" prop="resetFrequence" label="重置频率">
          <template slot-scope="scope">
            <div v-for="item in dictMap['FST.CODING_RULE_RESET_FREQUENCY']" :key="item.id">
              <span v-if="scope.row.resetFrequence.toString() === item.value">{{ item.label }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="documentCategory" label="单据类别">
          <template slot-scope="scope">
            <span v-if="scope.row.documentCategory === 'JE_NUMBER'">凭证编号</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="启用标志" align="center" width="100px">
          <template slot-scope="scope">
            <div v-for="item in dictMap['FST_STATUS']" :key="item.id">
              <el-tag
                v-if="scope.row.enabledFlag.toString() === item.value"
                :type="scope.row.enabledFlag === 'Y' ? '' : 'info'">
                {{ item.label }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="规则明细" align="center" width="100px">
          <template slot-scope="scope">
            <a href="javascript: void 0;" @click="handleDetailClick(scope.row.codingRuleId)">规则明细</a>
          </template>
        </el-table-column>

        <el-table-column
          v-if="checkPermission(['ADMIN','CODINGRULES_ALL','CODINGRULES_EDIT','CODINGRULES_DELETE'])"
          label="操作"
          width="150px"
          align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN','CODINGRULES_ALL','CODINGRULES_EDIT']"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"/>
            <el-popover
              v-permission="['ADMIN','CODINGRULES_ALL','CODINGRULES_DELETE']"
              :ref="scope.row.codingRuleId"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.codingRuleId].doClose()">取消</el-button>
                <el-button
                  :loading="delLoading"
                  type="xy-primary"
                  size="mini"
                  @click="subDelete(scope.row.codingRuleId)">
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

    <eDetail ref="detail"/>

  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'

import { del } from '@/api/basic/codingRules'
import { get as requestCompanies } from '@/api/fd/company'

import eForm from './form'

import eDetail from './detail'

export default {
  components: { eForm, eDetail },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      companies: [],
      query: {
        codingRuleCode: '',
        description: ''
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getCompanies()
      // 加载数据字典
      this.getDictMap('FST_STATUS,FST.CODING_RULE_RESET_FREQUENCY')
    })
  },
  methods: {
    getCompanies() {
      requestCompanies().then(res => {
        this.companies = res.content
      })
    },
    checkPermission,
    beforeInit() {
      this.url = 'api/CodingRules'
      const sort = 'codingRuleId,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.keys(this.query).forEach(key => {
        if (this.query[key]) {
          this.params[key] = this.query[key]
        }
      })
      return true
    },
    subDelete(codingRuleId) {
      this.delLoading = true
      del(codingRuleId).then(res => {
        this.delLoading = false
        this.$refs[codingRuleId].doClose()
        this.delChangePage()
        this.init()
        this.delSuccessNotify()
      }).catch(err => {
        this.delLoading = false
        this.$refs[codingRuleId].doClose()
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
        codingRuleId: data.codingRuleId,
        companyId: data.companyId,
        codingRuleCode: data.codingRuleCode,
        description: data.description,
        resetFrequence: data.resetFrequence,
        enabledFlag: data.enabledFlag,
        documentCategory: data.documentCategory
      }
      _this.dialog = true
    },
    handleDetailClick(codingRuleId) {
      this.$refs.detail.dialog = true
      this.$refs.detail.load(codingRuleId)
    }
  }
}
</script>

<style scoped>

</style>
