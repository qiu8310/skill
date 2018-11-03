import {Location} from 'history'

export function pageview(location: Location) {
  /* tslint:disable */
  var ga = (window as any).ga
  // 打点文档：         https://developers.google.com/analytics/devguides/collection/analyticsjs/events?hl=zh-cn
  // pageview 文档：   https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications?hl=zh-cn
  if (typeof ga !== 'undefined') {
    let page = location.pathname + location.search + location.hash
    ga('set', 'page', page)
    ga('send', 'pageview', page) // 第三个参数是可选的
  }
  /* tslint:enable */
}
