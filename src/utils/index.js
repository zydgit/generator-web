/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time) {
  if (time) {
    const date = new Date(time)
    const year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    const month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return (
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } else {
    return ''
  }
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@')
    let _s = ''
    if (str[0].length > 3) {
      for (let i = 0; i < str[0].length - 3; i++) {
        _s += '*'
      }
    }
    return str[0].substr(0, 3) + _s + '@' + str[1]
  }
  return email
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    const new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
    return new_mobile
  }
  return mobile
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function milliFormat(num) {
  if (num === '' || num === null || num === undefined) {
    return null
  }
  // 添加千位符
  num = (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')

  // 加零 (默认格式化的所有数字的格式: 1  1.1  1.11 不存在 1.111  1. )
  const numArr = num.split('')
  const zeroIndex = numArr.indexOf('.')
  if (zeroIndex === -1) {
    numArr.push('.00')
  } else if (numArr.length - zeroIndex === 2) {
    numArr.push('0')
  }
  return numArr.join('')
}

// 日期格式化
/** 时间戳转字符串 */
export function long2Str(time, format = 'yy-MM-dd HH:mm:ss') {
  if (!time || time <= 0) {
    return ''
  }
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份是从0开始 , 所以+1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  const preArr = Array.apply(null, Array(10)).map(function(elem, index) {
    return '0' + index
  }) // 新建长度为10的数组 格式为 00 01 02 03
  const dateStr = format
    .replace(/yy/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/dd/g, preArr[day] || day)
    .replace(/HH/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec)
  return dateStr
}

/** 日期转字符串 */
export function date2Str(date, format = 'yyyy-MM-dd HH:mm:ss') {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  const o = {
    'M+': date.getMonth() + 1, // 月
    'd+': date.getDate(), // 天
    'H+': date.getHours(), // 时(24小时制)
    'h+': date.getHours() % 12 === 0 ? date.getHours() : date.getHours() % 12, // 时(12小时制)
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  const week = {
    '0': '日',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六'
  }

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' : '周') : '') +
      week[date.getDay() + '']
    )
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return format
}

/** 日期字符串转时间戳(仅限yyyy-MM-dd hh:mm:ss 形式的字符串) */
export function str2Long(dateStr) {
  const date = new Date(Date.parse(date.replace(/-/g, '/')))
  return date.getTime()
}

/** 日期字符串转Date (仅年月日) */
export function str2Date(dateStr, separator = '-') {
  const dateArr = dateStr.split(separator)
  const year = parseInt(dateArr[0])
  const month =
    dateArr[1].indexOf('0') === 0
      ? parseInt(dateArr[1].substring(1))
      : parseInt(dateArr[1]) // 处理月份为04这样的情况
  const day = parseInt(dateArr[2])
  return new Date(year, month - 1, day)
}

/** sDateEnd - sDateStart 相差天数 */
export function dateDiff(sDateStart, sDateEnd) {
  // sDateStart和sDateEnd是yyyy-MM-dd格式
  return parseInt((str2Date(sDateEnd) - str2Date(sDateStart)) / 86400000) // 把相差的毫秒数转换为天数
}

/** 判断是否是闰年 */
export function isLeapYear(date) {
  const year = date.getYear()
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * @title 取得日期数据信息
 * @param  interval  表示数据类型 y:年 M:月 d:日 E:星期 h:时 m:分 s:秒
 */
export function getPart(date, interval) {
  let partStr = ''
  const Week = ['日', '一', '二', '三', '四', '五', '六']
  switch (interval) {
    case 'y':
      partStr = date.getFullYear()
      break
    case 'M':
      partStr = date.getMonth() + 1
      break
    case 'd':
      partStr = date.getDate()
      break
    case 'E':
      partStr = Week[date.getDay()]
      break
    case 'h':
      partStr = date.getHours()
      break
    case 'm':
      partStr = date.getMinutes()
      break
    case 's':
      partStr = date.getSeconds()
      break
  }
  return partStr
}

export function genID(length) {
  return Number(
    Math.random()
      .toString()
      .substr(3, length) + Date.now()
  ).toString(36)
}

// 获取期间数组的当前日期的期间名或最大值
export function findNowPeriodNameOrMax(periods) {
  if (periods.length) {
    // 先找当前月份
    const now = new Date()
    const nowPeriodName =
      now.getFullYear() +
      '-' +
      (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1))
    // 当前时间区间序号
    let nowIndex = periods.findIndex(item => item === nowPeriodName)
    // 没有当前时间的区间, 找区间最大值
    if (nowIndex === -1) {
      // 重新赋值
      nowIndex = 0
      if (periods.length > 1) {
        for (let i = 1; i < periods.length; i++) {
          const date = new Date(periods[i])
          const lastDate = new Date(periods[i - 1])
          nowIndex = date > lastDate ? i : nowIndex
        }
      }
    }
    return periods[nowIndex]
  }
  return ''
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = suffix ? parseTime(new Date()) + '-' + name + '.' + suffix : parseTime(new Date()) + '-' + name
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 上传文件
import request from '@/utils/request'

export function uploadFile(url, file, params = {}, method = 'post') {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file.raw)
    Object.keys(params).forEach(key => {
      fd.append(key, params[key])
    })
    request({
      method,
      url,
      data: fd
    }).then(res => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

export function lockPost($loading, fn) {
  const loading = $loading({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  fn(loading)
}

import XLSX from 'xlsx'

export function readExcel(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (ev) => {
      try {
        const data = ev.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })
        const wsName = workbook.SheetNames[0]
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsName])
        resolve(ws)
      } catch (e) {
        reject(e)
      }
    }
    fileReader.readAsBinaryString(file)
  })
}
