<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="opt.title" :width="opt.width + 'px'">
    <div class="app-container">
      <div v-if="Object.keys(opt.query.params).length" class="head-container">
        <el-input
          v-for="(val, key) in opt.query.params"
          :key="key"
          v-model="params[key]"
          :placeholder="val"
          clearable
          size="small"
          style="width: 200px; margin-right:6px"
          @keyup.enter.native="toQuery"/>
        <el-button size="mini" type="xy-primary" icon="el-icon-search" @click="toQuery">搜索
        </el-button>
      </div>

      <el-table v-loading="loading" :data="data" :height="tabHeight" size="mini" border @row-click="handleSelctRow">
        <el-table-column
          v-for="item in opt.columns"
          :width="item.width || 'auto'"
          :key="item.field"
          :prop="item.field"
          :label="item.title"
          :show-overflow-tooltip="item.showOverflow || false"/>
      </el-table>

      <el-pagination
        :total="total"
        style="margin-top: 8px;"
        small
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </div>
  </el-dialog>
</template>

<script>
import initData from '@/mixins/initData'

export default {
  mixins: [initData],
  data() {
    return {
      dialog: false,
      loading: false,
      opt: {
        query: {
          params: {},
          url: '',
          sort: ''
        },
        title: 'LOV标题',
        width: '300',
        height: '400',
        columns: []
      }
    }
  },
  computed: {
    tabHeight() {
      return this.opt.height && parseFloat(this.opt.height) - 225 || '200'
    }
  },

  methods: {
    pageInit: function() {
      if (this.opt.local) {
        this.loading = true
        this.data = this.opt.data
        this.loading = false
      } else {
        this.setModelVm(this.opt.query.params)
        this.init()
      }
    },
    afterInit() {
      const renderBefore = this.opt.renderBefore
      if (renderBefore) {
        this.data = renderBefore(this.data)
      }
    },
    beforeInit() {
      const _this = this
      let keys = []
      const query = this.opt.query
      const params = { page: this.page, size: this.size }

      this.url = this.opt.query.url

      if (query.sort) {
        params.sort = query.sort
      }

      if (query.params) {
        keys = Object.keys(query.params)
        keys.forEach((key) => {
          if (_this.params[key]) {
            params[key] = _this.params[key]
          }
        })
      }

      this.params = params
      return true
    },

    setModelVm(params) {
      const vm = this
      let keys = []
      if (params) {
        keys = Object.keys(params)
        keys.forEach(key => {
          vm.$set(vm.params, key, undefined)
        })
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    },
    handleSelctRow(row, event, column) {
      this.dialog = false
      this.$emit('select', row)
    }
  }
}
</script>

<style scoped>
  .el-dialog__header {
    background-color: rgb(48, 65, 86);
    padding: 10px;
  }

  .app-container {
    width: 100%;
  }
</style>
