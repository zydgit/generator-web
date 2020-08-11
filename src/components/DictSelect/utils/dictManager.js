import { get } from '@/api/system/dictDetail'

/**
 * 词典下拉框
 */

// 缓存数据
const dictMap = {}

const DictManager = {
  register(dictCode, instance) {
    DictManager.getDict(dictCode, instance)
  },
  deregister(dictCode) {
    dictMap[dictCode] = null
    delete dictMap[dictCode]
  },
  async getDict(dictCode, instance) {
    if (!dictMap[dictCode]) {
      dictMap[dictCode] = await getDictSync(dictCode)
    }
    instance.dict = dictMap[dictCode]
    // 组件中添加 dictMap属性, 可使用字典
    if (instance.$parent.dictMap) {
      Object.assign(instance.$parent.dictMap, { [dictCode]: dictMap[dictCode] })
    }
  }
}

function getDictSync(dictCode) {
  return get(dictCode).then(res => {
    return res.content
  })
}

export default DictManager
