<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" title="编码规则明细" width="1000px">
    <div class="app-container">
      <el-button
        v-permission="['ADMIN','CODINGRULEDETAILS_ALL','CODINGRULEDETAILS_CREATE']"
        size="mini"
        type="xy-primary"
        style="margin-bottom: 8px;"
        icon="el-icon-plus"
        @click="add">新增
      </el-button>
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" :sup_this="sup_this" :dict-map="dictMap"/>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" border size="mini" style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="sequence" label="顺序"/>
        <el-table-column :show-overflow-tooltip="true" prop="segmentType" label="段值类型">
          <template slot-scope="scope">
            <div v-for="item in dictMap['FST.CODING_RULE_SEGMENT']" :key="item.id">
              <span v-if="scope.row.segmentType.toString() === item.value">{{ item.label }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="segmentValue" label="固定字符"/>
        <el-table-column :show-overflow-tooltip="true" prop="dateFormat" label="日期格式"/>
        <el-table-column :show-overflow-tooltip="true" prop="length" label="长度"/>
        <el-table-column :show-overflow-tooltip="true" prop="incremental" label="增量"/>
        <el-table-column :show-overflow-tooltip="true" prop="startValue" label="起始值"/>
        <el-table-column :show-overflow-tooltip="true" prop="note" label="说明"/>
        <el-table-column
          v-if="checkPermission(['ADMIN','CODINGRULEDETAILS_ALL','CODINGRULEDETAILS_EDIT','CODINGRULEDETAILS_DELETE'])"
          label="操作"
          width="150px"
          align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN','CODINGRULEDETAILS_ALL','CODINGRULEDETAILS_EDIT']"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"/>
            <el-popover
              v-permission="['ADMIN','CODINGRULEDETAILS_ALL','CODINGRULEDETAILS_DELETE']"
              :ref="scope.row.codingRuleLineId"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.codingRuleLineId].doClose()">取消</el-button>
                <el-button
                  :loading="delLoading"
                  type="xy-primary"
                  size="mini"
                  @click="subDelete(scope.row.codingRuleLineId)">确定
                </el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

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
  </el-dialog>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'

import { del } from '@/api/basic/codingRuleDetails'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      dialog: false,
      codingRuleId: '',
      sup_this: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.getDictMap('FST.CODING_RULE_SEGMENT,FST.CODING_RULE_DATE_FORMAT')
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/CodingRuleDetails'
      const sort = 'codingRuleLineId,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      this.params.codingRuleId = this.codingRuleId
      return true
    },
    subDelete(codingRuleLineId) {
      this.delLoading = true
      del(codingRuleLineId).then(res => {
        this.delLoading = false
        this.$refs[codingRuleLineId].doClose()
        this.delChangePage()
        this.init()
        this.delSuccessNotify()
      }).catch(err => {
        this.delLoading = false
        this.$refs[codingRuleLineId].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.form.codingRuleId = this.codingRuleId
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        codingRuleLineId: data.codingRuleLineId,
        codingRuleId: data.codingRuleId,
        sequence: data.sequence,
        segmentType: data.segmentType,
        segmentValue: data.segmentValue,
        note: data.note,
        dateFormat: data.dateFormat,
        length: data.length,
        incremental: data.incremental,
        startValue: data.startValue
      }
      _this.dialog = true
    },
    load(codingRuleId) {
      this.codingRuleId = codingRuleId
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
