import { initData } from '@/api/system/data'

export default {
  mounted() {
    // this.columns = {}
    // this.$refs.table.columns.forEach(e => {
    //   if (!e.property || e.type !== 'default') {
    //     return
    //   }
    //   this.columns[e.property] = {
    //     label: e.label,
    //     visible: true
    //   }
    // })
  },
  data() {
    return {
      columns: {},
      loading: true,
      data: [],
      page: 0,
      size: 10,
      total: 0,
      url: '',
      params: {},
      query: {},
      time: 170,
      isAdd: false
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          if (res.totalElements === undefined) {
            this.data = res
          } else {
            this.total = res.totalElements
            this.data = res.content
          }
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      }).then(res => {
        this.afterInit()
      })
    },
    afterInit() {
      return true
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    delChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    },
    columnVisible(columnName) {
      return this.columns.columnName || true
    }
  }
}
