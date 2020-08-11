<!--搜索与重置-->
<template>
  <span>
    <el-button
      size="mini"
      type="xy-primary"
      icon="el-icon-search"
      @click="crud.toQuery">搜索</el-button>
    <el-button

      size="mini"
      type="xy-primary"
      icon="el-icon-refresh-left"
      @click="crud.resetQuery()">重置</el-button>
  </span>
</template>
<script>
export default {
  props: {
    crud: {
      type: Object,
      required: true
    },
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
