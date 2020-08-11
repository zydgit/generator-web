<!--from el-pop-confirm -->

<template>
  <el-popover
    v-bind="$attrs"
    v-model="visible"
    trigger="click"
    placement="top"
    width="180"
  >
    <div class="pop-confirm">
      <p class="pop-confirm__main">
        <i
          v-if="!hideIcon"
          :class="icon"
          :style="{color: iconColor}"
          class="pop-confirm__icon"
        />
        {{ title }}
      </p>
      <div class="pop-confirm__action">
        <el-button
          :type="cancelButtonType"
          size="mini"
          @click="cancel"
        >
          {{ cancelButtonText }}
        </el-button>
        <el-button
          :type="confirmButtonType"
          :loading="delLoading"
          size="mini"
          @click="confirm"
        >
          {{ confirmButtonText }}
        </el-button>
      </div>
    </div>
    <slot slot="reference" name="reference"/>
  </el-popover>
</template>

<script>
export default {
  name: 'PopConfirm',
  props: {
    title: {
      type: String,
      default: '确定删除本条数据吗?'
    },
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    confirmButtonType: {
      type: String,
      default: 'xy-primary'
    },
    cancelButtonType: {
      type: String,
      default: 'text'
    },
    icon: {
      type: String,
      default: 'el-icon-question'
    },
    iconColor: {
      type: String,
      default: '#f90'
    },
    hideIcon: {
      type: Boolean,
      default: false
    },
    delLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    delLoading(val, oldValue) {
      if (oldValue && !val) {
        this.visible = false
      }
    }
  },
  methods: {
    doClose() {
      this.visible = false
    },
    doShow() {
      this.visible = true
    },
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.doClose()
      this.$emit('cancel')
    }
  }
}
</script>
<style scoped>
  .pop-confirm__action{
    margin: 0;
    text-align: right;
  }
</style>
