import {React, IColumns, PageListComponent, PageItemComponent, IFormItems, Uploader} from './base'
import {Input, Switch} from 'antd'

export class ModuleList extends PageListComponent {
  key = 'module'
  columns: IColumns = [
    {title: '名称',     dataIndex: 'name',            width: 120   },
    {title: '排序',     dataIndex: 'sort',            width: 60   },
    {title: '问题',     dataIndex: 'description',     render: this.cellHtmlRender({simple: true, lineClamp: 2, fromEditor: false})},
    {title: '是否必答', dataIndex: 'required',         width: 100,   render: v => v ? '是' : '否'},
    {title: '图标',     dataIndex: 'iconNotSelect',   width: 80,    render: this.cellImgRender(50, 50)},
    this.ops
  ]
}

export abstract class Module extends PageItemComponent {
  key = 'module'
  formItems: IFormItems = [
    {key: 'name', required: true, whitespace: true, label: '名称', component: <Input />},
    {key: 'iconNotSelect', label: '图标', required: true, component: <Uploader width={100} height={100} />},
    {key: 'description', label: '问题', required: true, component: <Input.TextArea />},
    {key: 'required', isCheck: true, label: '问题是否必答', component: <Switch />},
    {key: 'sort',  label: '排序', component: <Input type='number'  style={{width: 100}} />   },
  ]
}

export class ModuleEdit extends Module {
  action = 'edit'
}

export class ModuleAdd extends Module {
  action = 'add'
}

export class ModuleShow extends Module {
  action = 'show'
}
