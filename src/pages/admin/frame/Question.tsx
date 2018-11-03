import {React, IColumns, PageListComponent, PageItemComponent, IFormItems} from './base'
import {Input} from 'antd'
import {Editor} from 'admin/'

export class QuestionList extends PageListComponent {
  key = 'question'

  columns: IColumns = [
    {dataIndex: 'title',        title: '标题',        width: 200},
    {dataIndex: 'careerList',   title: '所属职业',     width: 120,    render: this.cellArrayRender('name')},
    {dataIndex: 'tagList',      title: '标签',       width: 120,     render: this.cellArrayRender('name')},
    {dataIndex: 'content',      title: '内容',                       render: this.cellHtmlRender()},
    {dataIndex: 'commentCount', title: '评论数',       width: 80},
    {dataIndex: 'againstCount', title: '赞同数',       width: 80},
    {dataIndex: 'agreeCount',   title: '反对数',       width: 80},
    {dataIndex: 'createTime',   title: '创建时间',      width: 120,   render: this.cellDatetimeRender()},
    this.ops
  ]
}

abstract class Question extends PageItemComponent {
  key = 'question'

  formItems: IFormItems = [
    this.careerIdsFormItem,
    {key: 'title', required: true, whitespace: true, label: '标题', component: <Input />},
    this.tagListFormItem,
    {key: 'content', label: '内容', required: true, component: <Editor />}
  ]

  mapItem(item) {
    item.careerIds = item.careerList.map(i => i.id)
    return item
  }
}

export class QuestionEdit extends Question {
  action = 'edit'
}

export class QuestionAdd extends Question {
  action = 'add'
}

export class QuestionShow extends Question {
  action = 'show'
}
