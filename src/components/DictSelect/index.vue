<template>
  <el-select
    v-model="bindValue"
    :clearable="clearable"
    :filterable="filterable"
    :size="size"
    :placeholder="placeholder"
    :style="{width: width + 'px'}"
    @clear="clear">
    <el-option
      v-for="item in dict"
      :key="item.id"
      :label="item.label"
      :value="item.value"
      @click.native="handleChooseRow(item)"/>
  </el-select>
</template>
<script>
import dictSelect from './utils/dictSelect'
export default {
  name: 'DictSelect',
  mixins: [dictSelect],
  props: {
    filterable: {
      type: Boolean,
      default: true
    },
    width: {
      type: [Number, String],
      default: 224
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [Number, String, Array],
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {}
  },
  computed: {
    bindValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    handleChooseRow(row) {
      this.$emit('select', row)
    },
    clear() {
      this.$emit('select', '')
    }
  }
}
</script>
