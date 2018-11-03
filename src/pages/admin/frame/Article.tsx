import {React, IColumns, PageListComponent, PageItemComponent, IFormItems, Select} from './base'
import {Input} from 'antd'
import {Editor, Uploader} from 'admin/'

export class ArticleList extends PageListComponent {
  key = 'article'
  columns: IColumns = [
    {dataIndex: 'bannerUrl',      title: '头图',       width: 76,      render: this.cellImgRender(60, 32)},
    {dataIndex: 'title',          title: '标题',       width: 200},
    {dataIndex: 'authorName',     title: '作者',       width: 120},
    {dataIndex: 'careerList',     title: '所属职业',    width: 120,     render: this.cellArrayRender('name')},
    {dataIndex: 'tagList',        title: '标签',       width: 120,     render: this.cellArrayRender('name')},
    {dataIndex: 'digest',         title: '摘要',                 },
    {dataIndex: 'commentsCount',  title: '评论数',      width: 80},
    {dataIndex: 'favoritesCount', title: '收藏数',      width: 80},
    {dataIndex: 'likesCount',     title: '赞数',        width: 80},
    {dataIndex: 'createTime',     title: '创建时间',     width: 120,    render: this.cellDatetimeRender()},
    this.ops
  ]

  formItems: IFormItems = [
    {key: 'careerId', component: <Select allowClear api={this.props.app.api.getCareerList} placeholder='职业' style={{width: 120}} />}
  ]
}

abstract class Article extends PageItemComponent {
  key = 'article'
  get formItems(): IFormItems {
    return [
      this.careerIdsFormItem,
      {key: 'title', required: true, whitespace: true, label: '标题', component: <Input />},
      {key: 'authorName', whitespace: true, label: '作者', component: <Input />},
      {key: 'bannerUrl', label: '头图', component: <Uploader width={150} height={80} />},
      this.tagListFormItem,
      {key: 'digest', label: '摘要', component: <Input.TextArea />},
      {key: 'content', label: '内容', required: true, component: <Editor />}
    ]
  }

  mapItem(item) {
    item.careerIds = item.careerList.map(i => i.id)
    return item
  }
}

export class ArticleEdit extends Article {
  action = 'edit'
}

export class ArticleAdd extends Article {
  action = 'add'
}

export class ArticleShow extends Article {
  action = 'show'
}
