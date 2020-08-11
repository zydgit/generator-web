<template>
  <el-row :gutter="20" style="margin: 10px 0;" class="card-title">
    <h3 v-if="titleName" :style="titleStyle">{{ titleName }}</h3>
    <div :class="{ 'right-align': titleName}">
      <slot/>
    </div>
  </el-row>
</template>
<script>
export default {
  props: {
    titleStyle: {
      type: Object,
      required: false,
      default() {
        return {
          fontSize: '16px',
          color: '#333',
          textIndent: '20px'
        }
      }
    },
    titleName: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .card-title {
    display: flex;
    align-items: stretch;

    h3 {
      line-height: 30px;
      color: #333333;
      letter-spacing: 0;
      font-size: 16px;
      margin: 0;
      padding: 0;
      float: left;
      flex-shrink: 0;
    }

    .right-align {
      flex: 1;
      float: right;
      position: relative;
    }
  }
</style>
