<template>
  <div class="app-container">
    <AdvancedSearch :query="query" :title="$route.name" @refresh="toQuery" @add="add" @query="toQuery">
      <el-row>
        <el-col :span="6">
          <el-form-item label="公共假期类型">
            <el-select
              v-model="query.holidayType"
              clearable
              placeholder="请选择"
              style="width: 224px"
              @change="toQuery">
              <el-option
                v-for="item in dictMap['FST.HOLIDAY_TYPE']"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公共假期名称">
            <el-input
              v-model="query.holidayName"
              clearable
              placeholder="输入公共假期名称"
              style="width: 224px"
              @keyup.enter.native="toQuery"/>
          </el-form-item>
        </el-col>
      </el-row>
    </AdvancedSearch>

    <eForm ref="form" :dict-map="dictMap" :is-add="isAdd" @refresh="toQuery"/>
    <div class="content-container">
      <el-table v-loading="loading" ref="table" :data="data" border size="mini" style="width: 100%;">
        <el-table-column :show-overflow-tooltip="true" prop="holidayType" label="公共假期类型">
          <template slot-scope="scope">
            {{ dictValueMapLabel(dictMap['FST.HOLIDAY_TYPE'], scope.row.holidayType) }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="holidayName" label="公共假期名称"/>
        <el-table-column :show-overflow-tooltip="true" prop="startDate" label="假期从">
          <template slot-scope="scope">
            {{ long2Str(scope.row.startDate,'yy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="endDate" label="假期至">
          <template slot-scope="scope">
            {{ long2Str(scope.row.endDate,'yy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="endDate" label="天数">
          <template slot-scope="scope">
            {{ ((scope.row.endDate-scope.row.startDate)/ (1000 * 60 * 60 * 24))+1 }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注"/>
        <el-table-column
          v-if="checkPermission(['ADMIN','FNDCALENDARHOLIDAY_ALL','FNDCALENDARHOLIDAY_EDIT','FNDCALENDARHOLIDAY_DELETE'])"
          label="操作"
          width="150px"
          align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['ADMIN','FNDCALENDARHOLIDAY_ALL','FNDCALENDARHOLIDAY_EDIT']"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"/>
            <el-popover
              v-permission="['ADMIN','FNDCALENDARHOLIDAY_ALL','FNDCALENDARHOLIDAY_DELETE']"
              :ref="scope.row.holidayId"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.holidayId].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="xy-primary" size="mini" @click="subDelete(scope.row.holidayId)">
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
import initDict from '@/mixins/initDict'
import { del } from '@/api/basic/fndCalendarHoliday'
import eForm from './eForm'
import { long2Str } from '@/utils/index'

export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      query: {
        holidayType: '',
        holidayName: ''
      },
      dictMap: {
        type: Object,
        required: true
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getDictMap('FST.HOLIDAY_TYPE')
    })
  },
  methods: {
    checkPermission,
    long2Str,
    beforeInit() {
      this.url = 'api/fndCalendarHoliday'
      const sort = 'holidayId,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      Object.keys(this.query).forEach(key => {
        if (this.query[key]) {
          this.params[key] = this.query[key]
        }
      })
      return true
    },
    subDelete(holidayId) {
      this.delLoading = true
      del([holidayId]).then(res => {
        this.delLoading = false
        this.$refs[holidayId].doClose()
        this.delChangePage()
        this.init()
        this.delSuccessNotify()
      }).catch(err => {
        this.delLoading = false
        this.$refs[holidayId].doClose()
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
        holidayId: data.holidayId,
        holidayType: data.holidayType,
        holidayName: data.holidayName,
        remark: data.remark,
        date: [data.startDate, data.endDate]
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
