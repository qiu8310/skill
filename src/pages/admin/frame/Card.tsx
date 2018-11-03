import {React, IColumns, PageListComponent, PageItemComponent, IFormItems, Uploader, Select} from './base'
import {Input} from 'antd'
import {CardTypes, CardType} from 'global'
import {ReplySelect} from 'admin/widget/ReplySelect'

export class CardList extends PageListComponent {
  noPager = true
  key = 'card'
  columns: IColumns = [
    {title: 'ID',          dataIndex: 'id', width: 60},
    {title: '类型',         dataIndex: 'careerToolCategoryId',  width: 80, render: i =>  CardTypes.find(it => it.id === i).name },
    {title: '封面',         dataIndex: 'icon', width: 100, render: (src, it) => {
      if (it.careerToolCategoryId === CardType.BOOK) {
        return this.cellImgRender(50, 72)(src)
      } else if (it.careerToolCategoryId === CardType.SOFT) {
        return this.cellImgRender(50, 50)(src)
      } else {
        return null
      }
    }},
    {title: '图书或软件名称', dataIndex: 'name', width: 160},
    {title: '内容或介绍',    dataIndex: 'answerContent'},
    this.ops
  ]

  getBreadcrumb() {
    let {params, PAGE} = this
    let {careerId, moduleId} = params
    Promise.all([
      this.api.getCareer({careerId}),
      this.api.getModule({moduleId})
    ])
    .then(([c, m]) => {
      this.props.app.breadcrumb = [
        {title: PAGE.CareerList.title, link: PAGE.CareerList.getLink({params})},
        {title: `<${c.name} - ${m.name}> ${PAGE.CardList.title}`}
      ]
    })
  }
}

export abstract class Card extends PageItemComponent {
  key = 'card'
  get formItems(): IFormItems {
    let data = this.state.data || {}
    let type = data.careerToolCategoryId || this.props.form.getFieldValue('careerToolCategoryId')
    let {careerId, moduleId, questionId} = this.params
    let base = [
      {key: 'careerToolCategoryId', required: true, label: '类型', component: <Select placeholder='请选择类型' items={CardTypes} style={{width: 200}} />},
      {key: 'ref', label: '选择引用源', component: <ReplySelect {...{careerId, moduleId, questionId}} replyModalTitle={this.state.module && this.state.module.name} />}
    ]
    switch (type) {
      case CardType.TEXT:
        return [
          ...base,
          {key: 'answerContent', label: '内容', required: true, component: <Input.TextArea />},
        ]
      case CardType.BOOK:
        return [
          ...base,
          {key: 'icon', label: '图书封面', required: true, component: <Uploader width={120} height={174} />},
          {key: 'name', label: '图书名称', required: true, component: <Input />},
          {key: 'answerContent', label: '图书介绍', required: true, component: <Input.TextArea />},
        ]
      case CardType.SOFT:
      return [
        ...base,
        {key: 'icon', label: '软件图标', required: true, component: <Uploader width={110} height={110} />},
        {key: 'name', label: '软件名称', required: true, component: <Input />},
        {key: 'answerContent', label: '软件介绍', required: true, component: <Input.TextArea />},
      ]
      default:
        return base
    }
  }

  getBreadcrumb() {
    let {params, PAGE} = this
    let {careerId, moduleId} = params
    Promise.all([
      this.api.getCareer({careerId}),
      this.api.getModule({moduleId})
    ])
    .then(([c, m]) => {
      this.setState({career: c, module: m})
      this.props.app.breadcrumb = [
        {title: PAGE.CareerList.title, link: PAGE.CareerList.getLink({params})},
        {title: `<${c.name} - ${m.name}> ${this.label}`}
      ]
    })
  }

  beforeSubmitData(data) {
    let {ref, ...rest} = data
    if (!ref) {
      rest.answerCreatorId = 0
      rest.answerId = 0
    } else {
      rest.answerCreatorId = ref.userId
      rest.answerId = ref.id
    }
    return rest
  }

  beforeRenderData(data) {
    let ref = this.props.form.getFieldValue('ref')
    if (!ref) return data
    if (!data) data = {}
    if (!data.answerContent) data.answerContent = ref.content
    return data
  }
}

export class CardEdit extends Card {
  action = 'edit'
}

export class CardAdd extends Card {
  action = 'add'
}

export class CardShow extends Card {
  action = 'show'
}
