<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        v-model="query.currencyName"
        clearable
        placeholder="输入搜索内容"
        style="width: 224px"
        @keyup.enter.native="toQuery"/>
      <el-button size="mini" type="xy-primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <x-grid
      ref="xGrid"
      :has-page="true"
      :toolbar="tableToolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :config="geConfig"
      :auto-init="false"
      height="500"
      @addBefore="addGridBefore"
    >
      <template slot="buttons">
        <el-button type="xy-primary" size="mini" @click="handleExportClick">导出</el-button>
      </template>
    </x-grid>
  </div>
</template>

<script>
import { del as delCurrencies, post as postCurrencies } from '@/api/fd/currency'
import XGrid from '@/components/XGrid'

export default {
  components: { XGrid },
  data() {
    return {
      query: {
        currencyName: ''
      },
      // ------- xGrid配置 ----- //
      tableToolbar: {
        buttons: [
          { code: 'add', name: '新增', icon: 'el-icon-plus' },
          { code: 'delete', name: '删除', icon: 'el-icon-delete' },
          { code: 'save', name: '保存', icon: 'el-icon-check' }
        ]
      },
      tableProxy: {
        ajax: {
          query(options, params) {
            options.url = 'api/currency'
            params.sort = 'currencyCode,desc'
            if (this.query.currencyName) {
              params['currencyName'] = this.query.currencyName
            }
          },
          delete(data) {
            delCurrencies(data).then(() => {
              this.$notify({
                title: '删除成功',
                type: 'success',
                duration: 2500
              })
              this.toQuery()
            }).catch(() => {
              this.$notify({
                title: '删除失败',
                type: 'error',
                duration: 2500
              })
            })
          },
          save(data) {
            postCurrencies(data).then(res => {
              this.$notify({
                title: '保存成功',
                type: 'success',
                duration: 2500
              })
              this.toQuery()
            }).catch(() => {
              this.$notify({
                title: '保存失败',
                type: 'error',
                duration: 2500
              })
            })
          }
        }
      },
      geConfig: {
        // 该函数返回的值为true 表示行可以编辑 ， 否则不能编辑
        rowEditable(dataRow) {
          if (dataRow.currencyCode === 'CNY') {
            return false
          }
          return true
        },
        // 该函数返回的值为true 表示某行某列可以编辑 ， 否则不能编辑
        colEditable(columnName, dataRow) {
          if (dataRow.currencyCode === 'EUR' && columnName === 'currencyName') {
            return false
          }
          return true
        },
        model: {
          rules: {
            currencyCode: { required: true, trigger: ['blur', 'change'] },
            currencyName: { required: true, trigger: ['blur', 'change'] },
            financePrecision: { required: true, trigger: ['blur', 'change'] },
            enabledFlag: { required: true, trigger: ['blur', 'change'] }
            // date: { required: true, trigger: ['blur', 'change'] }
          }
        }
      },
      tableColumn: [
        {
          field: 'currencyCode', label: '币种代码', showOverflow: true, editRender: {
            name: 'lov',
            config: {
              query: { params: { description: '输入期间名称' }, url: 'api/period', sort: 'period_id,desc' },
              title: '期间选择',
              width: '500',
              height: '660',
              columns: [{ field: 'periodName', title: '期间名称' }, {
                field: 'periodYear',
                title: '期间年度'
              }, { field: 'periodMonth', title: '期间月度' }]
            },
            select: this.handleLovSelect
          }
        },
        { field: 'currencyName', label: '币种名称', formatter: this.formatStr, editRender: { name: 'input' }},
        { field: 'financePrecision', label: '财务精度', editRender: { name: 'input' }},
        { field: 'currencySymbol', label: '货币符号', editRender: { name: 'input' }},
        // valueFormat, format 全等于 elementui
        // { field: 'date', label: '创建日期', formatter: this.formatDate, editRender: { name: 'datepicker', valueFormat: 'yyyy-MM-dd', format: 'yyyy年MM月dd日' }},
        // autoTransferDesc: true 是否默认进行值转描述， 默认是开启的
        {
          field: 'enabledFlag',
          label: '启用',
          editRender: {
            change: this.handleChange,
            name: 'select',
            value: 'code',
            label: 'description',
            autoTransferDesc: true,
            options: []
          }
        }
      ]
    }
    // ------ end ----- //
  },
  created() {
    this.getEnabledFlag()
  },
  methods: {
    // 获取下拉框数据，模拟数据 (正确的做法是从远程获取)
    getEnabledFlag() {
      const enabledFlagData = [{
        id: 952,
        description: '正常',
        code: 'Y'
      },
      {
        id: 953,
        description: '停用',
        code: 'N'
      }]
      this.tableColumn[4].editRender.options = enabledFlagData
    },
    // 日期格式化函数
    formatDate(date) {
      return date
    },
    // 金额格式什么的
    formatStr(str) {
      return '可乐' + str
    },
    // LOV select
    handleLovSelect(dataItem, dataRow) {
      dataRow.currencyCode = dataItem.periodName
    },
    handleChange(val, dataRow) {
    },
    toQuery() {
      this.$refs.xGrid.init()
    },
    // 新增按钮执行前
    addGridBefore(dataRow) {

    },
    handleExportClick() {
      const xGrid = this.$refs['xGrid']
    }
  }
}
</script>
<style scoped>
</style>
