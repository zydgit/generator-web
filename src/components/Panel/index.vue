<template>
  <div class="panel">
    <card-title :title-name="titleName">
      <slot name="panelTitle"/>
    </card-title>
    <el-row class="card-content">
      <!--      <el-col :xs="0" :sm="8" :lg="8">-->
      <slot name="card"/>
      <!--      </el-col>-->
      <!--      <el-col :xs="0" :sm="8" :lg="8">-->
      <!--        <slot name="card2"/>-->
      <!--      </el-col>-->
      <!--      <el-col :xs="0" :sm="8" :lg="8">-->
      <!--        <slot name="card3"/>-->
      <!--      </el-col>-->
    </el-row>
  </div>
</template>
<script>
import CardTitle from './CardTitle.vue'

export default {
  components: {
    CardTitle
  },
  props: {
    titleName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .panel {
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    position: relative;
  }
</style>
