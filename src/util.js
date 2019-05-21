export function filterTag (item, tagValue) {
  if (item.top) {
    return '置顶'
  }
  if (item.good) {
    return '精华'
  }
  return tagValue[item.tab]
}

export const titleVal = {
  share: '分享',
  good: '精华',
  job: '招聘',
  ask: '问答',
  about: '关于',
  topic: '主题',
  message: '消息',
  dev: '测试'
}

export function calTime (time) {
  let now = Date.now()
  let last = new Date(time).getTime()
  let distance = ((now - last) / 1000) >> 0
  if (distance > 12 * 30 * 24 * 60 * 60) {
    return ((distance / 12 / 30 / 24 / 60 / 60) >>> 0) + '年前'
  } else if (distance > 30 * 24 * 60 * 60) {
    return ((distance / 30 / 24 / 60 / 60) >>> 0) + '月前'
  } else if (distance > 7 * 24 * 60 * 60) {
    return ((distance / 7 / 24 / 60 / 60) >>> 0) + '天前'
  } else if (distance > 24 * 60 * 60) {
    return ((distance / 24 / 60 / 60) >>> 0) + '天前'
  } else if (distance > 60 * 60) {
    return ((distance / 60 / 60) >>> 0) + '小时前'
  } else if (distance > 60) {
    return ((distance / 60) >>> 0) + '分钟前'
  } else if (distance < 0) {
    return '刚刚'
  } else {
    return distance + '秒前'
  }
}
