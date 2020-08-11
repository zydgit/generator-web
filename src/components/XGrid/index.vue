<template>
  <div class="app-container">

    <div class="x-grid-toolbar">
      <el-button
        v-for="btn in toolbar.buttons"
        :key="btn.code"
        :type="colorMap[btn.code]"
        :icon="btn.icon"
        size="mini"
        @click="handleBtnClick(btn.code)">{{ btn.name }}
      </el-button>
      <slot name="buttons"/>
    </div>

    <el-form ref="form" :model="fromData" label-position="left" size="small">
      <el-table
        v-loading="loading"
        ref="table"
        :height="height"
        :data="data"
        :show-summary="showSummary"
        :summary-method="showSummary ? summaryMethod : null"
        primary-key="currencyCode"
        class="x-grid"
        highlight-current-row
        size="mini"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange">
        <af-table-column type="selection" header-align="center" align="center" width="55"/>

        <template v-for="col in columns">
          <af-table-column
            :key="col.field"
            :prop="col.field"
            :show-overflow-tooltip="col.showOverflow"
            :label="col.label">
            <template slot-scope="scope">
              <el-form-item
                :prop="'domains.' + scope.$index + '.' + col.field"
                :rules="config.model.rules[col.field]"
                size="small">
                <template
                  v-if="col.editRender && (!config || config && editableListener(config.rowEditable, [scope.row]) && editableListener(config.colEditable, [col.field, scope.row]))">
                  <template v-if="col.editRender.name === 'input'">
                    <el-input v-model="scope.row[col.field]" :placeholder="'请输入' + col.label" clearable size="small"/>
                  </template>

                  <template v-else-if="col.editRender.name === 'select'">
                    <el-select
                      v-model="scope.row[col.field]"
                      :placeholder="'请选择' + col.label"
                      clearable
                      size="small"
                      @change="(val)=>handleChange(val, scope.row, col.editRender.change)">
                      <el-option
                        v-for="it in col.editRender.options"
                        :key="it[col.editRender.value]"
                        :label="it[col.editRender.label]"
                        :value="it[col.editRender.value]"/>
                    </el-select>
                  </template>

                  <template v-else-if="col.editRender.name === 'multiselelct'">
                    <el-select
                      v-model="scope.row[col.field + 'Arr']"
                      :placeholder="'请选择' + col.label"
                      multiple
                      clearable
                      size="small"
                      @change="(val)=>handleMultipleSelectChange(val, scope.row, col.field, col.editRender.change)">
                      <el-option
                        v-for="it in col.editRender.options"
                        :key="it[col.editRender.value]"
                        :label="it[col.editRender.label]"
                        :value="it[col.editRender.value]"/>
                    </el-select>
                  </template>

                  <template v-else-if="col.editRender.name === 'datepicker'">
                    <el-date-picker
                      v-model="scope.row[col.field]"
                      :placeholder="'请选择' + col.label"
                      :format="col.editRender.format"
                      :value-format="col.editRender.valueFormat"
                      type="date"
                      clearable
                      size="small"
                    />
                  </template>
                  <template v-else-if="col.editRender.name === 'lov'">
                    <Lov
                      v-model="scope.row[col.field]"
                      :opt="col.editRender.config"
                      :placeholder="'请选择' + col.label"
                      clearable
                      size="small"
                      @select="(dataItem)=>handleSelect(dataItem, scope.row, col.editRender.select)"/>
                  </template>
                </template>
                <template>
                  <span v-if="col.editRender && col.editRender.autoTransferDesc === true">{{ findItemByKey(col.editRender.value, scope.row[col.field], col.editRender.options)[col.editRender.label] || '' }}</span>
                  <span v-else>{{ col.formatter ? col.formatter(scope.row[col.field]) : scope.row[col.field] }}</span>
                </template>
              </el-form-item>
            </template>
          </af-table-column>
        </template>
      </el-table>
    </el-form>

    <template v-if="hasPage">
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </template>
  </div>
</template>

<script>
import xGridUtils from './xGridUtils'
import Lov from '@/components/Lov'
import { milliFormat } from '@/utils'

export default {
  components: { Lov },
  mixins: [xGridUtils],
  props: {
    height: {
      type: Number,
      required: false,
      default: 400
    },
    hasPage: {
      type: Boolean,
      required: false,
      default: false
    },
    toolbar: {
      type: Object,
      required: true
    },
    proxyConfig: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: false,
      default: null
    },
    columns: {
      type: Array,
      required: true
    },
    showSummary: {
      type: Boolean,
      required: false,
      default: false
    },
    autoInit: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      fromData: {
        domains: []
      },
      // 按钮颜色
      colorMap: {
        add: 'primary',
        delete: 'danger',
        save: 'success'
      },
      multipleSelection: []
    }
  },
  watch: {
    data() {
      this.$set(this.fromData, 'domains', this.data)
    }
  },
  created() {
    this.$nextTick(() => {
      this.autoInit && this.init()
    })
  },
  methods: {
    // TODO
    summaryMethod(param) {
      const { data } = param
      const tableColumns = this.columns
      const sums = []
      if (data.length === 0) {
        return
      }
      sums[0] = ''
      tableColumns.forEach((column, index) => {
        if (index === 0) {
          sums.push('总计')
          return
        }
        if (column.summary) {
          const values = data.map(item => Number(item[column.field]))
          const sumNum = values.reduce((prev, curr) => {
            if (!isNaN(curr)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (!isNaN(sumNum)) {
            sums.push(milliFormat(sumNum))
          } else {
            sums.push('N/A')
          }
        } else {
          sums.push('')
        }
      })
      return sums
    },
    editableListener(fn, args) {
      return fn && fn.call(this.$parent, ...args)
    },
    handleMultipleSelectChange(val, dataRow, field, fn) {
      fn && fn.call(this, val, dataRow, field)
    },
    handleChange(val, dataRow, fn) {
      fn && fn(val, dataRow)
    },
    handleSelect(dataItem, dataRow, fn) {
      fn && fn(dataItem, dataRow)
    },
    handleBtnClick(fnName) {
      this[fnName]()
    },
    add() {
      const dataItem = {
        _uid: this.genUID(),
        _dirty: true,
        _status: 'add'
      }
      for (const column of this.columns) {
        if (column.field) {
          dataItem[column.field] = ''
        }
      }
      this.$emit('addBefore', dataItem)
      this.data.unshift(dataItem)
      this.$refs.table.setCurrentRow(this.data[0])
    },
    save() {
      // TODO
      const selectedItem = this.data.find(it => it._selected)
      // TODO
      if (selectedItem && !this.isObjectValueEqual(selectedItem, this.tempRowData)) {
        selectedItem._dirty = true
      }
      const vData = this.data.filter((it) => {
        if (it._dirty) {
          if (it._status !== 'add') {
            it._status = 'update'
          }
          return true
        }
        return false
      })
      if (vData.length === 0) {
        return
      }
      this.$refs['form'].validate((valid, model) => {
        const indexes = Array.from(new Set(Object.keys(model).map(t => t.substr(8, 1))))

        const notPass = indexes.some(index => this.data[index]._dirty)
        if (valid || !notPass) {
          this.proxyConfig.ajax.save.call(this.$parent, vData)
        } else {
          this.$message({
            message: '必输字段不能为空',
            type: 'warning'
          })
        }
      })
    },
    delete() {
      const vData = this.multipleSelection
      if (!vData.length) {
        return
      }
      this.$confirm('确定删除所选行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const pdata = []
        // 删除具有UID的数据，那是未保存的数据
        vData.forEach(it => {
          if (it._uid) {
            const index = this.data.findIndex(obj => obj._uid === it._uid)
            this.data.splice(index, 1)
          } else {
            pdata.push(it)
          }
        })
        if (pdata.length) {
          // 删除远程服务数据
          this.delChangePage()
          this.proxyConfig.ajax.delete.call(this.$parent, pdata)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      // try {
      this.columns.forEach(col => {
        if (col.editRender.name === 'multiselelct') {
          currentRow[col.field + 'Arr'] = currentRow[col.field] ? currentRow[col.field].split(',') : []
        }
      })
      // } catch (e) {}
      oldCurrentRow && (oldCurrentRow._selected = false)
      if (this.tempRowData && oldCurrentRow) {
        if (!this.isObjectValueEqual(this.tempRowData, oldCurrentRow)) {
          oldCurrentRow._dirty = true
        }
      }
      if (currentRow) {
        currentRow._selected = true
        this.tempRowData = Object.assign({}, currentRow)
      }

      return false
    },
    beforeInit() {
      this.$refs['form'].resetFields()
      this.params = {}
      this.proxyConfig.ajax.query.call(this.$parent, this, this.params)
      if (this.hasPage) {
        this.params.page = this.page
        this.params.size = this.size
      }
      return true
    },
    afterInit() {
      this.config.model.data = this.data
    }
  }
}
</script>

<style>
  .x-grid .el-input {
    display: none
  }

  .x-grid .el-select {
    display: none
  }

  .x-grid .current-row .el-input {
    display: block
  }

  .x-grid .current-row .el-select {
    display: block
  }

  .x-grid .current-row .el-select + span {
    display: none
  }

  .x-grid .current-row .el-select + div {
    display: none
  }

  .x-grid .current-row .el-input + span {
    display: none
  }

  .x-grid .el-form-item {
    margin-bottom: 0 !important;
  }

  .x-grid .el-form-item--small .el-form-item__content {
    font-size: 12px !important;
    color: #606266 !important;
    line-height: 23px !important;
  }

</style>
