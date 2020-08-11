import { cascadeUpdate as updateKanban } from '@/api/ms/msKanban'

export default {
  computed: {},
  data() {
    return {
      updateLoading: false
    }
  },
  methods: {
    submitKanbanSetting(userId) {
      this.updateLoading = true
      const kanban = this.kanban

      if (userId) {
        kanban.userId = userId
      }
      if (kanban === null) return
      kanban.cards.forEach((card, index) => {
        card.sort = ++index
      })
      updateKanban(kanban).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        kanban.kanbanId = res.kanbanId
        this.updateLoading = false
        this.$store.commit('UPDATE_SETTING_KANBAN', false)
      }).catch(err => {
        this.updateLoading = false
        console.log(err.response.data.message)
      })
    },
    openCardSetting() {
      const cardDrawerRef = this.$refs.cardDrawer
      cardDrawerRef.kanbanId = this.kanban.kanbanId
      cardDrawerRef.drawer = true
      cardDrawerRef.init()
    }
  }
}
