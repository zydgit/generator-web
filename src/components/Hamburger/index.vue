<template>
  <div>
    <span :class="['icon-wrapper', {'is-active':isActive}]">
      <!--      <i class="hamburger icon-kanbantiaozhenghou" @click="toggleClick"/>-->
      <svg-icon
        style="margin-top: 13.5px; cursor: pointer"
        icon-class="logo"
        class="svg-icon"
        @click.native="toggleClick"/>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>
  .hamburger {
    cursor: pointer;
    color: #fff;
    font-size: 20px;
  }

  .icon-wrapper {
    transition: .38s;
    display: inline-block;
    height: 100%;
  }

  .icon-wrapper.is-active {
  }
</style>
