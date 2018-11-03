import {IColumns, PageListComponent} from './base'

export class FeedbackList extends PageListComponent {
  key = 'module'
  columns: IColumns = [
    {title: '问题',     dataIndex: 'content',     render: this.cellHtmlRender({simple: true, fromEditor: false})},
    this.ops
  ]
}
