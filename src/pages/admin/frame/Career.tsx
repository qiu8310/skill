import {React, IColumns, PageListComponent, PageItemComponent, Uploader, IFormItems, Select} from './base'
import {Input, Modal, Checkbox, Row, Col} from 'antd'
import {Link} from 'react-router-dom'
import {CareerTypes, CareerType} from 'global'

export class CareerList extends PageListComponent {
  key = 'career'
  am: AssociateModal
  // canAddItem = false

  associate = (it) => {
    this.setState({associate: it})
  }

  modulesRender = (list, it) => {
    return <div className='gFlexContainer gVCenterChildren'>
      <div className='gFlex'>
        {(list || []).map(m => <div key={m.id}><Link to={`/career/${it.id}/module/${m.id}/question/${m.questionId}/card`}>{m.name}</Link></div>)}
      </div>
      {/* <div style={{width: 50, textAlign: 'center', display: 'inline-block'}}><a onClick={() => this.associate(it)}>关联</a></div> */}
    </div>
  }

  columns: IColumns = [
    {title: 'ID',    dataIndex: 'id',      width: 60},
    {title: '状态',   dataIndex: 'type',   width: 80, render: v => CareerTypes.find(c => c.id === v).name},
    {title: '图标',   dataIndex: 'icon',  width: 80, render: this.cellImgRender(50, 50)},
    {title: '名称',   dataIndex: 'name'},
    {title: '排序',  dataIndex: 'sort',    width: 60},
    {title: '关注数', dataIndex: 'focusCount', width: 80},
    {title: '回答数', dataIndex: 'questionNum', width: 80},
    {title: '参与数', dataIndex: 'participantNum', width: 80},
    {title: '模块',   dataIndex: 'menuList', width: 200,  render: this.modulesRender},
    this.ops
  ]

  modalClose = () => {
    this.setState({associate: null})
  }
  modalOk = () => {
    this.api.assModulesToCareer({params: {careerId: (this.state as any).associate.id}, data: {menuIds: this.am.value}})
      .then(() => this.fetch())
    this.modalClose()
  }

  render() {
    let state: any = this.state
    let {associate} = state
    if (!associate) return super.render()

    return <div>
      {super.render()}
      <Modal visible title={'关联模块到' + associate.name} onCancel={this.modalClose} onOk={this.modalOk}>
        <AssociateModal ref={e => this.am = e} api={this.api} value={(associate.menuList || []).map(i => i.id + '')} />
      </Modal>
    </div>
  }
}

export abstract class Career extends PageItemComponent {
  key = 'career'
  get formItems(): IFormItems {
    let type = this.props.form.getFieldValue('type')
    return [
      {key: 'name', required: true, whitespace: true, label: '名称', component: <Input />},
      {key: 'type', label: '状态', required: true, component: <Select items={CareerTypes} style={{width: 200}} />},
      {key: 'icon', label: '图标', required: type === 3, component: <Uploader width={120} height={120} />},
      {key: 'sort', label: '排序', component: <Input type='number' style={{width: 100}} />},
    ]
  }

  beforeSubmitData(data) {
    data.crowdFunding = data.type === 1
    return data
  }

  async afterSubmitData(data, rtnData, done) {
    if (data.type === CareerType.EXPECT) return done()
    let careerId = this.action === 'add' ? rtnData : this.params.careerId
    let {items} = await this.api.getCareerModuleList({careerId})
    if (items.length === 0) {
      let {items: modules} = await this.api.getModuleList()
      await this.api.assModulesToCareer({careerId, menuIds: modules.map(m => m.id)})
    }
    done()
  }
}

export class CareerEdit extends Career {
  action = 'edit'
}

export class CareerAdd extends Career {
  action = 'add'
}

export class CareerShow extends Career {
  action = 'show'
}

class AssociateModal extends React.PureComponent<{value: any, api: any}, any> {
  state = {
    modules: [],
    value: this.props.value
  }

  get value() {
    return this.state.value.map(v => parseInt(v, 10))
  }

  componentWillMount() {
    this.props.api.getModuleList()
      .then(({items: modules}) => this.setState({modules}))
  }

  onChange = (value) => {
    this.setState({value})
  }

  render() {
    return <div>
      <Checkbox.Group value={this.state.value} onChange={this.onChange}>
        <Row>
          {this.state.modules.map(m => (
            <Col key={m.id} span={8}><Checkbox value={m.id + ''}>{m.name}</Checkbox></Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  }
}
