const regexp = /^([\s\S]*?)\{([\s\S]*?)\}([\s\S]*?)$/
/**
 * 将字符串 {a: 12, b: 34, c: 中国} => 解析成 JSON
 *
 * 不支持数组或对象的嵌套，非常适合在 Markdown 组件中使用
 */
export function jsonfy<T = {}>(text: string, prefixKey?: string, suffixKey?: string): T {
  let obj: any = {}
  if (regexp.test(text)) {
    let prefix = RegExp.$1.trim()
    let raw = RegExp.$2
    let suffix = RegExp.$3.trim()

    if (prefixKey) obj[prefixKey] = prefix
    if (suffixKey) obj[suffixKey] = suffix

    raw.split(',').map(pair => {
      let parts = pair.split(':')
      let key = parts.shift().trim()
      obj[key] = parseValue(parts.join(':').trim())
    })
  }
  return obj
}

function parseValue(value: string): any {
  if (/^\d+$/.test(value)) return parseInt(value, 10)
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value)
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}
