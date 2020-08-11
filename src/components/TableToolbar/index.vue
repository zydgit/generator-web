<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left"/>
      <!--右侧-->
      <slot name="right"/>
    </span>
    <el-button-group class="crud-opts-right">
      <el-button
        size="mini"
        plain
        type="info"
        icon="el-icon-search"
        @click="handleToggleSearch"
      />
      <el-button
        size="mini"
        icon="el-icon-refresh"
        @click="handleRefresh"
      />
      <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <el-button
          slot="reference"
          size="mini"
          icon="el-icon-s-grid"
        >
          <i
            class="fa fa-caret-down"
            aria-hidden="true"
          />
        </el-button>
        <el-checkbox
          v-model="allColumnsSelected"
          :indeterminate="allColumnsSelectedIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox
          v-for="item in columns"
          :key="item.label"
          v-model="item.visible"
          @change="handleCheckedTableColumnsChange(item)"
        >
          {{ item.label }}
        </el-checkbox>
      </el-popover>
    </el-button-group>
  </div>
</template>
<script>
export default {
  props: {
    columns: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false
    }
  },
  created() {

  },
  methods: {
    handleToggleSearch() {
      this.$parent.showSearch = !this.$parent.showSearch
      // this.crud.props.searchToggle = !this.crud.props.searchToggle
    },
    handleRefresh() {
      this.$parent.toQuery()
    },
    toDelete(datas) {
      // this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.crud.delAllLoading = true
      //   this.crud.doDelete(datas)
      // }).catch(() => {
      // })
    },
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true
        return
      }
      for (const key in this.columns) {
        this.columns[key].visible = val
      }
      this.allColumnsSelected = val
      this.allColumnsSelectedIndeterminate = false
    },
    handleCheckedTableColumnsChange(item) {
      let selectedCount = 0
      let totalCount = 0
      for (const key in this.columns) {
        totalCount++
        selectedCount += this.columns[key].visible ? 1 : 0
      }

      if (selectedCount === 0) {
        this.$nextTick(function() {
          item.visible = true
        })
      }
      this.allColumnsSelected = totalCount === selectedCount
      this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0
    }
  }
}
</script>

<style>
  .crud-opts {
    padding: 6px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }

  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
</style>
