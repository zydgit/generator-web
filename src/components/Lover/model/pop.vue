<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="lovEditor.title || 'Lov选择'"
    :width="lovEditor.width ? lovEditor.width + 'px' : '500px'">
    <div class="pop-container">
      <div v-if="lovEditor.queryParams.length" class="head-container">
        <el-form
          v-if="lovEditor.queryParams.length > 0"
          :inline="lovEditor.inlineForm === 'Y' ? true : false"
          label-position="left">
          <el-form-item
            v-for="(val, key) in lovEditor.queryParams"
            :key="key"
            :label="val.display"
            :label-width="val.conditionFieldLabelWidth ? val.conditionFieldLabelWidth + 'px' : ''">
            <el-input
              v-model="params[val.name]"
              :style="searchFormInputStyle(val)"
              clearable
              size="small"
              @keyup.enter.native="toQuery"/>
          </el-form-item>
          <el-row>
            <el-button
              style="float: right"
              size="mini"
              type="xy-primary"
              icon="el-icon-search"
              @click="toQuery">搜索
            </el-button>
            <el-button
              style="float: right; margin-right: 15px;"
              size="mini"
              icon="el-icon-delete"
              @click="initConfig">清空
            </el-button>
          </el-row>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="data"
        :height="tabHeight"
        size="small"
        border
        @row-click="handleSelctRow">
        <el-table-column
          v-for="(item, index) in lovEditor.columns"
          :key="index"
          :width="item.gridFieldWidth ? item.gridFieldWidth + 'px' : 'auto'"
          :prop="item.gridFieldName"
          :label="item.display"
          :align="item.gridFieldAlign"
          :show-overflow-tooltip="item.showOverTip === 'Y' ? true : false"/>
      </el-table>

      <el-pagination
        :total="total"
        :page-size="size"
        :layout="layout"
        small
        style="margin-top: 8px;"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </div>
  </el-dialog>
</template>

<script>
import initData from '@/mixins/initData'
import { getLovData } from '@/api/system/lov'

export default {
  mixins: [initData],
  props: {
    lovEditor: {
      type: Object,
      default: null
    },
    renderBefore: {
      type: Function,
      default: null
    },
    sqlParams: {
      type: String,
      default: null
    },
    dynamicParams: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    tabHeight() {
      return parseFloat(this.lovEditor.height || 500) - 225 || '200'
    },
    layout() {
      if (this.lovEditor.isPaging === 'Y') {
        return 'total, prev, pager, next, sizes'
      } else {
        return 'total'
      }
    }
  },

  methods: {
    initConfig() {
      this.params = {}
    },
    pageInit() {
      this.size = this.lovEditor.pagesize === -1 ? 10 : (this.lovEditor.pagesize || 10)
      this.init()
    },
    afterInit() {
      const renderBefore = this.renderBefore
      if (renderBefore) {
        this.data = renderBefore(this.data)
      }
    },
    beforeInit() {
      this.loading = true
      const params = { size: this.size, page: this.page }
      const query = this.lovEditor.queryParams
      if (query.length > 0) {
        query.forEach((item) => {
          if (this.params[item.name]) {
            params[item.name] = this.params[item.name]
          }
        })
      }
      this.params = params

      return this.getLovData()
    },

    toQuery() {
      this.page = 0
      this.init()
    },
    handleSelctRow(row, event, column) {
      if (this.dialog) {
        this.dialog = false
      }
      this.$emit('select', row)
    },
    getLovData() {
      if (this.dynamicParams) {
        Object.keys(this.dynamicParams).forEach(key => {
          this.params[key] = this.dynamicParams[key]
        })
      }

      if (this.lovEditor.sqlType === 'customUrl') {
        this.url = this.lovEditor.customUrl
        this.params.size = this.size
        this.params.page = this.page
        return true
      } else {
        if (this.lovEditor.sqlType === 'customSql' && this.sqlParams) {
          this.params.__sqlParams = this.sqlParams
        }

        getLovData(this.lovEditor.code, this.params).then(res => {
          if (res.totalElements === undefined) {
            this.data = res
          } else {
            this.total = res.totalElements
            this.data = res.content
          }
          this.loading = false
          this.afterInit()
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
        return false
      }
    },
    // 搜索框input样式s
    searchFormInputStyle(val) {
      const width = val.conditionFieldWidth ? val.conditionFieldWidth : 150
      return `margin-right: 6px; width: ${width}px`
    }
  }
}
</script>
<style>
  .pop-container
  .el-dialog__header {
    font-weight: bold;
  }

  .pop-container
  .el-form-item {
    margin: 0 10px 10px 0;
  }
</style>
<style scoped>
  .pop-container {
    padding: 0 20px;
    width: 100%;
  }
</style>

