import LoverManager from './lover-manager'

export default {
  props: {
    dynamicValueField: {
      type: String,
      default: null
    },
    dynamicTextField: {
      type: String,
      default: null
    },
    dynamicPlaceholder: {
      type: String,
      default: null
    },
    code: {
      type: String,
      default: ''
    }
  },
  beforeMount() {
    LoverManager.register(this.code, this)
  },
  beforeDestroy() {
    LoverManager.destroyInstance(this.code, this)
  },
  data() {
    return {
      lovEditor: {
        placeholder: '',
        valueField: '',
        textField: '',
        code: '',
        title: '',
        width: null,
        height: null,
        pagesize: null,
        readonly: 'Y',
        queryParams: [],
        columns: [],
        queryModel: ''
      }
    }
  },
  methods: {
    initConfig(lovEditor) {
      if (this.isDef(this.dynamicTextField)) {
        lovEditor.textField = this.dynamicTextField
      }
      if (this.isDef(this.dynamicValueField)) {
        lovEditor.valueField = this.dynamicValueField
      }
      if (this.isDef(this.dynamicPlaceholder)) {
        lovEditor.placeholder = this.dynamicPlaceholder
      }

      this.lovEditor = lovEditor

      this.$nextTick(() => {
        const pop = this.$refs.pop
        const selectOption = this.$refs.selectOption
        if (pop && lovEditor.queryModel === 'LOV') {
          pop.initConfig()
        } else if (selectOption && lovEditor.queryModel === 'SELECT') {
          selectOption.initConfig()
        }
      })
    },
    isDef(val) {
      return val !== undefined && val !== null
    }
  }
}
export {
  LoverManager
}
