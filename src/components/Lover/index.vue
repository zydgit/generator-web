<template>
  <div :style="width ? 'width: ' + width : ''" :class="['el-input', sizeClass]">
    <template v-if="lovEditor.queryModel === 'LOV'">
      <el-input
        :placeholder="lovEditor.placeholder"
        :readonly="lovEditor.readonly === 'Y'"
        :value="textField"
        :disabled="disabled"
        @mouseenter.native="lovInputHover = true"
        @mouseleave.native="lovInputHover = false"
        @input="lovEditor.readonly !== 'Y' && input">
        <i
          v-if="lovInputHover && clearable"
          slot="suffix"
          class="el-icon-circle-close"
          style="cursor: pointer; padding-right: 4px"
          @click="handleSelectRow('')"/>
        <i slot="suffix" class="el-icon-search" style="cursor: pointer; padding-right: 4px" @click="toLov"/>
      </el-input>
    </template>
    <template v-else>
      <select-option
        ref="selectOption"
        v-model="value"
        :lov-editor="lovEditor"
        :clearable="clearable"
        :multiple="multiple"
        :filterable="filterable"
        :sql-params="sqlParams"
        :disabled="disabled"
        :dynamic-params="dynamicParams"
        @selectRow="handleSelectRow"
        @selectValue="handleSelectValue"/>
    </template>

    <pop
      ref="pop"
      :lov-editor="lovEditor"
      :sql-params="sqlParams"
      :dynamic-params="dynamicParams"
      @select="handleSelectRow"/>
  </div>
</template>

<script>
import pop from './model/pop'
import selectOption from './model/select'
import lover from './utils/lover'

export default {
  name: 'Lover',
  components: {
    pop,
    selectOption
  },
  mixins: [lover],
  props: {
    buttonStyle: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: null
    },
    value: {
      type: [Number, String, Array],
      default: ''
    },
    /**
       * 拼接在sql后的查询条件, 开头不用加and
       * sql: select * from fst_company
       *
       * sqlParams: 'company_id = 1234 and company_name = 'abcd''
       */
    sqlParams: {
      type: String,
      default: null
    },
    /**
       * 非sql查询方式的动态参数, 对象格式
       */
    dynamicParams: {
      type: Object,
      default: null
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      selectRow: {},
      lovInputHover: false
    }
  },
  computed: {
    textField: {
      get() {
        if (!this.value) {
          return ''
        }
        return this.selectRow[this.lovEditor.textField] || this.value
      },
      set() {
      }
    },
    sizeClass() {
      return `el-input--${this.size}`
    }
  },
  methods: {
    reloadData() {
      if (this.$refs.selectOption) {
        this.$refs.selectOption.initConfig()
      }
    },
    input(val) {
      this.$emit('input', val)
    },
    toLov() {
      if (this.disabled) {
        return
      }
      const pop = this.$refs.pop
      pop.dialog = true
      pop.pageInit()
    },
    // select lov 通用select事件 返回行数据
    handleSelectRow(row) {
      this.selectRow = { ...row }
      this.$emit('input', row[this.lovEditor.valueField])
      this.$emit('select', row)
    },
    // select选择事件, 返回选择的数据, 无行数据返回
    handleSelectValue(value) {
      this.$emit('input', value)
      this.$emit('select', value)
    }
  }
}
</script>

<style scoped>
  .h-cp {
    cursor: pointer;
  }
</style>
