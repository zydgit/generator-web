export default {
  name: 'notify',
  methods: {
    /**
     * 通用的提示
     */
    saveSuccessNotify() {
      this.$notify({
        title: '保存成功',
        type: 'success',
        duration: 2500
      })
    },
    submitSuccessNotify() {
      this.$notify({
        title: '提交成功',
        type: 'success',
        duration: 2500
      })
    },
    addSuccessNotify() {
      this.$notify({
        title: '新增成功',
        type: 'success',
        duration: 2500
      })
    },
    editSuccessNotify() {
      this.$notify({
        title: '修改成功',
        type: 'success',
        duration: 2500
      })
    },
    delSuccessNotify() {
      this.$notify({
        title: '删除成功',
        type: 'success',
        duration: 2500
      })
    },
    Notify(title, type) {
      this.$notify({
        title: title,
        type: type,
        duration: 2500
      })
    },
    NotifySuccess(title) {
      this.$notify({
        title: title,
        type: 'success',
        duration: 2500
      })
    },
    NotifyError(title) {
      this.$notify({
        title: title,
        type: 'error',
        duration: 2500
      })
    },
    NotifyWarning(title) {
      this.$notify({
        title: title,
        type: 'warning',
        duration: 2500
      })
    },
    Message(message, type) {
      this.$message({
        message,
        type
      })
    }
  }
}
