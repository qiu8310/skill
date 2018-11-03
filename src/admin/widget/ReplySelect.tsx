import * as React from 'react'
import {Modal} from 'antd'
import {InjectedQuestionListComponent, InjectedReplyListComponent} from './common'


// import './styles/ReplySelect.scss'

export interface IReplySelectProps {
  careerId: number
  moduleId: number
  questionId?: number
  onChange?: (value) => void
  value?: any

  questionModalTitle?: string
  replyModalTitle?: string
}

export class ReplySelect extends React.PureComponent<IReplySelectProps, any> {
  static defaultProps = {}
  state = {
    showQuestionList: false,
    showReplyList: false,
    questionId: this.props.questionId,
    reply: this.props.value
  }

  onChange = () => {
    let {onChange} = this.props
    let {reply} = this.state
    if (onChange) onChange({id: reply.id, content: reply.content, userId: reply.userId})
  }

  render() {
    let {questionId, reply, showQuestionList, showReplyList} = this.state
    return (
      <div className='wReplySelect'>
        {reply ? `已选评论 ID: ${reply.id} ` : null}

        <a onClick={() => this.setState({showReplyList: !!questionId, showQuestionList: !questionId})}>{reply ? '切换评论' : '选择评论'}</a>

        <Modal
          title={this.props.questionModalTitle || '职业问题列表'}
          width='72%'
          footer={false}
          visible={showQuestionList}
          onCancel={() => this.setState({showQuestionList: false})}
          children={<InjectedQuestionListComponent careerId={this.props.careerId} onChose={q => this.setState({questionId: q.id, showReplyList: true})} />}
        />

        <Modal
          title={this.props.replyModalTitle || '卡片评论列表'}
          width='84%'
          footer={false}
          visible={showReplyList}
          onCancel={() => this.setState({showReplyList: false})}
          children={<InjectedReplyListComponent questionId={questionId} canAddReply onChose={r => this.setState({reply: r, showReplyList: false, showQuestionList: false}, this.onChange)} />}
        />
      </div>
    )
  }
}
