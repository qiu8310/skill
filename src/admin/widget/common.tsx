import * as React from 'react'
import {ListComponent} from 'admin/component/ListComponent'
import {inject} from 'mobx/AdminApp'
import {formatDate} from 'mora-common'
import {Button, Modal, Input} from 'antd'

export class QuestionListComponent extends ListComponent<{careerId: number, onChose?: (item) => void}> {
  static defaultProps = { onChose: () => {} }
  saveParametersToURL = false

  opRender = (id, item) => {
    return item.answerCount > 0 ? <a onClick={() => this.props.onChose(item)}>查看回复</a> : null
  }

  columns = [
    {dataIndex: 'title',          title: '问题'},
    {dataIndex: 'username',       title: '创建人',     width: 120},
    {dataIndex: 'answerCount',    title: '回答数', width: 60},
    {dataIndex: 'createTime',     title: '创建时间',   width: 120, render: t => formatDate(new Date(t), this.props.app.config.dateFormat)},
    {dataIndex: 'id',             title: '',       width: 100, render: this.opRender}
  ]

  fetch() {
    this.doLoading()
    this.props.app.api.getCareerQuestionList({careerId: this.props.careerId})
      .then(({items: dataSource, total}) => this.doneLoading({dataSource, total}))
  }
}

export const InjectedQuestionListComponent = inject('app')(QuestionListComponent)

export class ReplyListComponent extends ListComponent<{questionId: number, canAddReply?: boolean, onChose?: (item) => void}> {
  static defaultProps = { onChose: () => {} }
  saveParametersToURL = false

  opRender = (id, item) => {
    return <a onClick={() => this.props.onChose(item)}>选择</a>
  }

  columns = [
    {dataIndex: 'content',    title: '内容'},
    {dataIndex: 'commentCount', title: '评论数', width: 60},
    {dataIndex: 'likeCount', title: '点赞数', width: 60},
    {dataIndex: 'username',   title: '作者', width: 120},
    {dataIndex: 'createTime', title: '回复时间', width: 120, render: t => formatDate(new Date(t), this.props.app.config.dateFormat)},
    {dataIndex: 'id',         title: '',       width: 100, render: this.opRender}
  ]

  fetch() {
    this.doLoading()
    this.props.app.api.getReplyList({questionId: this.props.questionId})
      .then(({items: dataSource, total}) => this.doneLoading({dataSource, total}))
  }

  render() {
    if (!this.props.canAddReply) return super.render()
    let {replyAddModal, replyContent} = this.state as any

    return <div>
      {super.render()}
      <Button type='primary' children='添加评论' style={{marginTop: 5}} onClick={() => this.setState({replyAddModal: true})} />
      <Modal
        visible={replyAddModal}
        title='添加评论'
        onCancel={() => this.setState({replyAddModal: false})}
        onOk={() => {
          let {questionId} = this.props
          if (replyContent) {
            this.props.app.api.reply({params: {questionId}, data: {questionId, content: replyContent}})
              .then(() => {
                this.setState({replyAddModal: false, replyContent: ''})
                this.fetch()
              })
          }
        }}
      >
        <Input.TextArea value={replyContent} onChange={(e: any) => this.setState({replyContent: e.target.value})} />
      </Modal>
    </div>
  }

}

export const InjectedReplyListComponent = inject('app')(ReplyListComponent)
