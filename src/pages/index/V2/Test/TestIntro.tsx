/**
 * Create by Mora at 2017-10-12 11:15
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Image, Button, classSet} from 'pages/index/base'
import {Fixed} from 'mora-common'

import './styles/TestIntro.scss'
//#endregion

@inject('app')
export class TestIntro extends PageComponent<any, any> {
  state = {
    characters: [],
    activeId: null
  }

  next = () => {
    this.api.setTestCharacter({characterId: this.state.activeId})
    this.app.gotoLink(this.rp.TestQuestion.link())
  }

  async componentWillMount() {
    const characters = await this.api.getTestCharacters()
    this.setState({characters})
  }

  render() {
    const {activeId, characters} = this.state

    return (
      <Page name='TestIntro' title='六型人格测试'>
        <div className='topText gTextCenter gTitle16 gBlack'>
          <p>开始测试前</p>
          <p>你认为你是以下哪种类型</p>
        </div>

        <div className='characters gClearfix'>
          {characters.map(c => (
            <div key={c.id} onClick={() => this.setState({activeId: c.id})} className={classSet('character gTextCenter', {active: c.id === activeId})}>
              <div className='avatar gRounded gCenter'>
                <Image src={c.icon} ratio={3} square={p2r(98)} />
              </div>
              <p className='type'>{c.name}</p>
              <p className='desc'>{c.desc}</p>
            </div>
          ))}
        </div>

        <Fixed holder height={p2r(70)}>
          <Button onClick={this.next} className='btn' disabled={activeId == null} center width={335} height={48}>下一步</Button>
        </Fixed>
      </Page>
    )
  }
}
