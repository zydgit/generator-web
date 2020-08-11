<template>
  <el-drawer
    :modal="true"
    :visible="visible"
    :with-header="true"
    :append-to-body="true"
    :destroy-on-close="destroyOnClose"
    :wrapper-closable="overCloseable"
    :before-close="close"
    :size="drawerSize"
    :custom-class="customClass"
    :close-on-press-escape="escClosable"
    @opened="drawerOpened"
    @closed="drawerClosed"
  >
    <div class="drawer-wrapper">
      <div v-if="changeSizeByMouse" class="resizable" @mousedown="handleMousedown">
        <div class="resizable-left-line"/>
      </div>
      <div class="head-wrapper">
        <slot name="header">
          <div class="head-container">
            <div
              class="close-arrow-wrapper"
              @click="close"
            >
              <i
                class="el-icon-arrow-left"
                style="font-weight: bold"
              />
            </div>
            <div class="title-wrapper">
              <span class="title-h3">{{ title }}</span>
            </div>
            <div class="head-slot">

              <!--  标题栏辅助内容插槽  -->
              <slot name="head-right"/>

            </div>
          </div>
        </slot>
      </div>
      <div class="content-wrapper">
        <div class="margin-wrapper">
          <div v-if="footerPosition==='top'" class="drawer-footer-top drawer-footer">
            <slot name="footer"/>
          </div>

          <div :style="{margin: appContainerMargin, padding: padding}" class="app-container">
            <slot/>
          </div>

          <div v-if="footerPosition==='bottom'" class="drawer-footer-bottom drawer-footer">
            <slot name="footer"/>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
export default {
  name: 'Drawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    size: {
      type: [Number, String],
      default: null
    },
    title: {
      type: String,
      required: true
    },
    // 关闭是否销毁
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    // 是否点击drawer以外的地方关闭drawer
    wrapperClosable: {
      type: Boolean,
      default: true
    },
    // 是否 esc 关闭
    escClosable: {
      type: Boolean,
      default: true
    },
    // 按钮栏位置 top/bottom
    footerPosition: {
      type: String,
      default: 'bottom'
    },
    padding: {
      type: String,
      default: '20px 50px'
    },
    // 是否启用拖拽调整大小
    changeSizeByMouse: {
      type: Boolean,
      default: true
    },
    // 关闭前确认回调
    closeConfirm: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      customClass: new Date().getTime().toString(),
      isMousemove: false,
      count: 0,
      minWidth: 0
    }
  },
  computed: {
    // 防止点击事件触发 wrapperClosable
    'overCloseable': function() {
      return this.wrapperClosable && !this.isMousemove
    },
    appContainerMargin() {
      if (this.footerPosition === 'top') {
        return '35px 0 0'
      } else {
        return '0 0 35px'
      }
    },
    targetDiv() {
      return document.getElementsByClassName(this.customClass).item(0)
    },
    drawerSize() {
      if (typeof this.size === 'string') {
        return this.size
      }
      return this.size + '%'
    }
  },

  methods: {
    addEscEvent() {
      if (!this.escClosable) return
      this.targetDiv.addEventListener('keydown', this.handleEscEvent, true)
    },
    removeEscEvent() {
      this.targetDiv.removeEventListener('keydown', this.handleEscEvent, true)
    },
    handleEscEvent(e) {
      e.preventDefault()
      if (e.keyCode === 27) {
        this.close()
      }
    },
    handleMousedown(e) {
      const _this = this
      // 防止点击事件触发 wrapperClosable
      _this.isMousemove = true
      const targetDiv = this.targetDiv
      const appMain = document.getElementsByClassName('app-main').item(0)

      // 得到点击时该地图容器的宽度
      const targetDivWidth = targetDiv.offsetWidth

      // 最大宽度
      const maxWidth = appMain.offsetWidth

      // 最小
      if (this.count === 0) {
        this.minWidth = targetDivWidth - 300
      }
      const minWidth = Math.max(this.minWidth, 0)

      const startX = e.clientX

      _this.count++
      window.addEventListener('mousemove', mousemove)

      function mousemove(e) {
        e.preventDefault()

        const diffX = startX - e.clientX
        let finalX = targetDivWidth + diffX

        finalX = Math.min(finalX, maxWidth)
        finalX = Math.max(finalX, minWidth)

        targetDiv.style.width = finalX + 'px'
      }

      window.addEventListener('mouseup', function() {
        window.removeEventListener('mousemove', mousemove)
        setTimeout(() => {
          _this.isMousemove = false
        })
      })
    },

    async close() {
      let isClose = true
      if (typeof this.closeConfirm === 'function') {
        isClose = await this.closeConfirm()
      }
      if (isClose) {
        if (this.visible) {
          this.$emit('update:visible', false)
        }
      }
    },
    // 如果数据加载造成延迟卡顿, initData 函数可写在 opened 事件中
    // TODO 如何主动让所有函数执行在opened之后
    drawerOpened() {
      // this.addEscEvent()
      this.$emit('opened')
    },
    drawerClosed() {
      // this.removeEscEvent()
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>
  .drawer-wrapper {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .content-wrapper {
    width: calc(100% + 17px);
    padding: 0;
    margin: 0 0 -15px 0;
    height: 0;
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .app-container {
    position: relative;
  }

  .head-wrapper {
    border-bottom: 1px solid rgba(151, 151, 151, 0.3);
    position: relative;
    height: 45px;
    background: #285FD1;
  }

  .head-container {
    width: 95%;
    display: flex;
    align-items: center;
    height: 100%;
    color: #fff;
  }

  .head-wrapper .close-arrow-wrapper {
    order: 1;
    padding-right: 15px;
    cursor: pointer;
  }

  .head-wrapper .title-wrapper {
    order: 2;
    flex-grow: 1;
    font-weight: 500;
  }

  .head-slot {
    order: 3;
    position: relative;
    max-width: 40%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .title-h3 {
    width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .resizable {
    width: 10px;
    height: 100%;
    position: absolute;
    left: -5px;
    top: 0;
    cursor: col-resize;
    content: ' ';
    z-index: 9999;
  }

  .resizable:hover .resizable-left-line {
    opacity: 1;
  }

  .resizable-left-line {
    height: 100%;
    width: 2px;
    background: #4d90fe;
    opacity: 0;
    right: 3px;
    position: absolute;
    transition: all 0.1s ease-out;
  }

  .drawer-footer {
    position: absolute;
    left: 0;
    height: auto;
    text-align: left;
    padding-left: 20px;
    width: 100%;
    background: #fff;
    z-index: 999;
  }

  .drawer-footer-bottom {
    bottom: 0;
    border-top: 1px solid #e9e9e9;
    max-height: 50px;
    line-height: 50px;
    box-shadow: 0 -6px 6px -5px #e9e9e9;
  }

  .drawer-footer-top {
    top: 45px;
    max-height: 45px;
    line-height: 45px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
  }

  .margin-wrapper {
    margin-bottom: 45px;
  }
</style>

<style>
  .drawer-wrapper .el-scrollbar {
    height: 100%;
    overflow-x: hidden !important;
  }

  .drawer-wrapper .el-scrollbar__wrap {
    height: 100%
  }

  .scrollbar-wrapper {
    height: 100%;
  }

</style>
