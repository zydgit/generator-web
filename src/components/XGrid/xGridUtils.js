import { initData } from '@/api/system/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 0, size: 10, total: 0, url: '', params: {}, time: 170
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
    /**
     * 生成UID
     * @param length
     * @returns {string}
     */
    genUID(length) {
      return Number(
        Math.random()
          .toString()
          .substr(3, length) + Date.now()
      ).toString(36)
    },
    /**
     * 对比两个对象的值是否完全相等 返回值 true/false
     * @param a
     * @param b
     * @returns {boolean}
     */
    isObjectValueEqual(a, b) {
      // 取对象a和b的属性名
      const aProps = Object.getOwnPropertyNames(a)
      const bProps = Object.getOwnPropertyNames(b)
      let props = null

      if (aProps.length >= bProps.length) {
        props = aProps
      } else {
        props = bProps
      }
      // 循环取出属性名，再判断属性值是否一致
      for (let i = 0; i < props.length; i++) {
        const propName = props[i]
        if (propName === 'dirty' || propName === 'selected' || propName === '__ob__' || propName === '_') {
          continue
        }
        if (a[propName] !== b[propName]) {
          return false
        }
      }
      return true
    },
    /**
     * 找到集合中键名=keyName & 键值=keyValue的那一项
     * @param keyName
     * @param keyValue
     * @param datas
     * @returns {*|number|bigint|{}}
     */
    findItemByKey(keyName, keyValue, datas) {
      const target = datas.find(it => it[keyName] === keyValue)
      return target || {}
    }
  }
}

