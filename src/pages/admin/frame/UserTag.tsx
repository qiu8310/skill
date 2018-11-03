import {React, IColumns, PageListComponent, PageItemComponent, IFormItems} from './base'
import {Input} from 'antd'

export class UserTagList extends PageListComponent {
  key = 'userTag'
  hasDetailPage = false
  columns: IColumns = [
    {dataIndex: 'name', title: '标题'},
    this.ops
  ]
}

abstract class UserTag extends PageItemComponent {
  key = 'userTag'
  formItems: IFormItems = [
    {key: 'name', required: true, whitespace: true, label: '标题', component: <Input />}
  ]
  getItem() {}
  afterSubmitData() {
    this.goBack()
  }
}

export class UserTagAdd extends UserTag {
  action = 'add'
}


export class UserTagEdit extends UserTag {
  action = 'edit'
}

export class UserTagShow extends UserTag {
  action = 'show'
  render() {
    return <div>暂无详情</div>
  }
}
