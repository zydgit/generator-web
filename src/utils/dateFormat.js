export function getTimeSlot() {
  const hour = new Date().getHours()
  let timeSlot = ''
  if (hour < 6) {
    timeSlot = '凌晨'
  } else if (hour < 9) {
    timeSlot = '早上'
  } else if (hour < 12) {
    timeSlot = '上午'
  } else if (hour < 14) {
    timeSlot = '中午'
  } else if (hour < 17) {
    timeSlot = '下午'
  } else if (hour < 24) {
    timeSlot = '晚上'
  }
  return timeSlot
}

// 获取最近六个月数组
export function getRecentSixMonth() {
  // 创建现在的时间
  const data = new Date()
  // 获取年
  let year = data.getFullYear()
  // 获取月
  let mon = data.getMonth() + 1
  const arry = []
  for (let i = 0; i < 6; i++) {
    if (mon <= 0) {
      year = year - 1
      mon = mon + 12
    }
    if (mon < 10) {
      mon = '0' + mon
    }
    arry.push(year + '-' + mon)
    mon -= 1
  }
  return arry.reverse()
}

// 获取与当前日期差
export function getDateDiff(dateTimeStamp) {
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const year = month * 12
  const now = new Date().getTime()
  // 尽量让差值大于零
  const diffValue = now - dateTimeStamp + 500
  if (diffValue < 0) {
    return
  }
  const yearC = diffValue / year
  const monthC = diffValue / month
  const weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute
  let secondC = diffValue / second
  // 小于一秒会.
  secondC = Math.max(secondC, 1)
  let result
  if (yearC >= 1) {
    result = '' + parseInt(yearC) + '年前'
  } else if (monthC >= 1) {
    result = '' + parseInt(monthC) + '月前'
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + '分钟前'
  } else if (secondC >= 1) {
    result = '' + parseInt(secondC) + '秒前'
  }
  return result
}
