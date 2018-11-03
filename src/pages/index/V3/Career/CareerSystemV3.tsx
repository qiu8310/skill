/* tslint:disable prefer-for-of */

/**
 * Create by Mora at 2017-11-10 10:28
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, Markdown, Loading, inject, classSet} from 'pages/index/base/'
import {Slider} from 'widget/Slider'
// import {Fixed} from 'mora-common'
import './styles/CareerSystemV3.scss'
//#endregion

@inject('app')
export class CareerSystemV3 extends PageComponent<{careerId: string}, any> {
  state = {
    content: null,
    items: null,
    actives: [],
    original: []
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    let el: Element = e.target as any
    let li = el.closest('li')
    let lis = li.parentElement.children
    for (let i = 0; i < lis.length; i++) {
      if (lis[i] === li) {
        li.classList.add('active')
      } else if (lis[i].classList.contains('active')) {
        lis[i].classList.remove('active')
      }
    }
  }

  async componentWillMount() {
    let res = await fetch(`/p/v3/${this.params.careerId}/system.md`)
    let content = await res.text()
    this.setState({content}, () => {
      let items = normalize(document.querySelector('.gMarkdown > ul'))

      let actives = []
      let lastId = null
      for (let i = 0; i < 3; i++) {
        let levels = findCollection(items, lastId)
        if (levels.length) {
          actives[i] = levels[0]
          lastId = levels[0].id
        } else {
          break
        }
      }

      this.setState({items, content: null, actives, original: actives})
    })
  }

  renderLevel(items: Item[], index: number, activeItem: Item) {
    return (
      <Slider itemGap={30} itemWidth={120} itemHeight={120}>
        {items.map(it => (
          <div
            key={it.parent + '|' + it.id}
            className={classSet('item', {active: activeItem === it})}
            onClick={() => {
              let {actives} = this.state
              actives = actives.slice(0, index + 1)
              actives[index] = it
              this.setState({actives})
            }}
          >
            {it.name}
          </div>
        ))}
      </Slider>
    )
  }

  renderData(items: Item[]) {
    // let career = this.app.careers.find(c => c.id === parseInt(this.params.careerId, 10))
    let {actives/*, original */} = this.state
    let level1Items = findCollection(items, null)
    let level2Items = actives[0] ? findCollection(items, actives[0].id) : []
    let level3Items = actives[1] ? findCollection(items, actives[1].id) : []

    return (
      <div>
        {level1Items.length ? <div className='level level1'>
          <h2>一级分类</h2>
          {this.renderLevel(level1Items, 0, actives[0])}
        </div> : null}

        {level2Items.length ? <div className='level level2'>
          <h2>二级职业</h2>
          {this.renderLevel(level2Items, 1, actives[1])}
        </div> : null}

        {level3Items.length ? <div className='level level3'>
          <h2>三级细分</h2>
          {this.renderLevel(level3Items, 2, actives[2])}
        </div> : null}


        {/* <Fixed height={p2r(49)} holder>
          <div className='bottom gEllipsis'>
            {career.name}从属于
              <span>{career.system}</span>-
              <span>{original[0].name}</span>-
              <span>{original[1].name}</span>
          </div>
        </Fixed> */}

      </div>
    )

  }

  render() {
    let {rp, state: {content, items}} = this
    return (
      <Page name='CareerSystemV3' title={rp.CareerSystemV3.title}>
        {items ? this.renderData(items) : <Loading />}
        <div style={{visibility: 'hidden'}}>
          {content && <Markdown source={content} />}
        </div>
      </Page>
    )
  }
}

interface Item {
  id?: number
  name?: string
  parent?: number | null
}
let id = 1
function normalize(ul: Element, parent: number = null) {
  let result: Item[] = []

  if (ul.nodeName.toLowerCase() === 'ul') {
    for (let li of ul.childNodes) {
      let item: Item = {id: id++, parent}
      for (let node of li.childNodes) {
        if (node.nodeName.toLowerCase() === 'ul') {
          result.push(...normalize(node as Element, item.id))
        } else if (node.nodeType === 3) { // 文本节点
          item.name = node.nodeValue
        } else if (node.nodeType === 1) { // p 节点或其它 element 节点
          item.name = node.textContent
        } else {
          console.log(node)
          throw new Error('解析 markdown 失败，不支持的节点类型')
        }
      }

      if (!item.name) {
        console.log(li)
        throw new Error('解析 markdown 失败，没有文本节点')
      }

      result.push(item)
    }
  }

  return result
}
function findCollection(data: Item[], parent: number | null) {
  return data.filter(it => it.parent === parent)
}
