<template>
  <div :class="['el-input', sizeClass]">
    <el-input
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :value="value"
      style="width:100%"
      @mouseenter.native="lovInputHover = true"
      @mouseleave.native="lovInputHover = false"
      @input="input"
      @clear="clear">
      <i
        v-if="lovInputHover && clearable"
        slot="suffix"
        class="el-icon-circle-close"
        style="cursor: pointer; padding-right: 4px"
        @click="handleSelectRow('')"/>
      <i slot="suffix" class="el-icon-search" style="cursor: pointer; padding-right: 4px" @click="toLov"/>
    </el-input>
    <lovForm ref="lovForm" @select="handleSelectRow"/>
  </div>
</template>

<script>
import lovForm from './model/form'

export default {
  components: {
    lovForm
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    opt: {
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      lovInputHover: false
    }
  },
  computed: {
    sizeClass() {
      return `el-input--${this.size}`
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val)
    },
    clear() {
      this.$emit('select', '')
    },
    toLov() {
      if (this.disabled) {
        return
      }
      const lovForm = this.$refs.lovForm
      Object.assign(lovForm.opt, this.opt)
      lovForm.dialog = true
      lovForm.loading = true
      lovForm.pageInit()
    },
    handleSelectRow(row) {
      this.$emit('select', row)
    }
  }
}
</script>

<style scoped>

  .h-cp {
    cursor: pointer;
  }
</style>
