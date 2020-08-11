import { login, loginRole, getInfo } from '@/api/system/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { decrypt } from '@/utils/rsaEncrypt'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // LoginRole
    LoginRole({ commit }, userInfo) {
      const allocationId = userInfo.allocationId
      return new Promise((resolve, reject) => {
        loginRole(allocationId).then(res => {
          setToken(res.token, false)
          commit('SET_TOKEN', res.token)
          setUserInfo(res.user, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username
      const password = decrypt(userInfo.password)
      const code = userInfo.code
      const uuid = userInfo.uuid
      const rememberMe = userInfo.rememberMe
      const allocationId = userInfo.allocationId
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid, allocationId).then(res => {
          setToken(res.token, rememberMe)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const setUserInfo = (res, commit) => {
  const user = res
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (user.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', user.roles)
  }
  commit('SET_USER', user)
}

export default user
