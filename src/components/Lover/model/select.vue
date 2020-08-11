<template>
  <el-select
    v-model="bindValue"
    :placeholder="lovEditor.placeholder"
    :clearable="clearable"
    :readonly="lovEditor.readonly === 'Y'"
    :multiple="multiple"
    :disabled="disabled"
    :filterable="filterable"
    style="width: 224px"
    @change="handleChoose">
    <el-option
      v-for="(item, index) in data"
      :key="index"
      :label="item[lovEditor.textField]"
      :value="item[lovEditor.valueField]"
      @click.native="handleChooseRow(item)"/>
  </el-select>
</template>
<script>
import initData from '@/mixins/initData'
import { getLovData as getData } from '@/api/system/lov'

export default {
  mixins: [initData],
  props: {
    lovEditor: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: [Number, String, Array],
      default: ''
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
    },
    filterable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bindValue: {
      get() {
        if (this.multiple && this.value) {
          return this.value.split(',')
        }
        return this.value
      },
      set() {
      }
    }
  },
  methods: {
    initConfig() {
      this.init()
    },
    afterInit() {
      // this.data = this.renderIndex(this.data)
      const renderBefore = this.renderBefore
      if (renderBefore) {
        this.data = renderBefore(this.data)
      }
    },
    beforeInit() {
      return this.getLovData()
    },
    getLovData() {
      if (this.dynamicParams) {
        Object.keys(this.dynamicParams).forEach(key => {
          this.params[key] = this.dynamicParams[key]
        })
      }

      if (this.lovEditor.sqlType === 'customUrl') {
        this.url = this.lovEditor.customUrl
        this.params.size = 999999999
        this.params.page = 0
        return true
      } else {
        if (this.lovEditor.sqlType === 'customSql' && this.sqlParams) {
          this.params.__sqlParams = this.sqlParams
        }

        getData(this.lovEditor.code, this.params).then(res => {
          if (res.totalElements === undefined) {
            this.data = res
          } else {
            this.total = res.totalElements
            this.data = res.content
          }
          this.afterInit()
        }).catch((err) => {
          console.log(err)
        })
        return false
      }
    },
    handleChoose(value) {
      // 点击clearable的情况
      if (value === '') {
        this.$emit('selectValue', '')
      }
      // 复选框时, 返回选择内容
      if (!this.multiple) return
      value = value.join(',')
      this.$emit('selectValue', value)
    },
    handleChooseRow(row) {
      // 非复选框时, 返回整条数据
      if (this.multiple) return
      this.$emit('selectRow', row)
    },
    renderIndex(data) {
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
          item.__id = index
        })
      }
      return data
    }
  }
}
</script>
<style>

</style>
