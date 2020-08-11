import DictManager from './dictManager'

export default {
  props: {
    dictCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dict: []
    }
  },
  beforeMount() {
    DictManager.register(this.dictCode, this)
  }
}

export {
  DictManager
}
