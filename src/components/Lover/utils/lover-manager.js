import { getLovConfig as getConfig } from '@/api/system/lov'

const instances = {}
const configs = {}

const LoverManager = {
  // 实例cache动态代码: code + instance._uid 避免同一实例引入相同lov
  // 配置cache: code(code相同不用考虑重复的情况)
  register(code, instance) {
    if (code && instance) {
      const dynamicCode = code + instance._uid
      // 动态代码 + uid 组成实例 key
      instances[dynamicCode] = instance

      // 初始化配置
      LoverManager.initConfig(code, dynamicCode)
    }
  },
  // 销毁实例和配置
  deregister(code) {
    if (code) {
      for (const key in instances) {
        if (key.includes(code)) {
          instances[key] = null
          delete instances[key]
        }
      }
      for (const key in configs) {
        if (key.includes(code)) {
          configs[key] = null
          delete configs[key]
        }
      }
    }
  },
  // 仅销毁实例, 缓存配置
  destroyInstance(code, instance) {
    if (code) {
      const dynamicCode = code + instance._uid
      instances[dynamicCode] = null
      delete instances[dynamicCode]
    }
  },
  async initConfig(configCode, instanceCode) {
    if (!configs[configCode]) {
      configs[configCode] = await getLovConfig(configCode)
    }

    // 等待加载config中关闭页面,销毁实例,导致nullPointer
    instances[instanceCode] && instances[instanceCode].initConfig && instances[instanceCode].initConfig(configs[configCode])
  },
  getLovData() {

  }
}

function getLovConfig(code) {
  return getConfig(code).then(res => {
    return res
  })
}

export default LoverManager
