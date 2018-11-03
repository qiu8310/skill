/**
 * Create by Mora at 2017-11-13 15:21
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, loadingIfNoStates, Markdown, Image} from 'pages/index/base/'
import {Fixed} from 'mora-common'
import './styles/CareerLearnItemV3.scss'
//#endregion

@inject('app')
@loadingIfNoStates({required: 'data'})
export class CareerLearnItemV3 extends PageComponent<{learnId: string}, any> {
  state = {
    data: null
  }

  async componentWillMount() {
    let data = await this.api.getLearnItem({params: this.params})
    this.setState({data})
  }

  toggleFav = async () => {
    let {data} = this.state
    this.setState({data: {...data, favor: !data.favor}})
    if (data.favor) {
      await this.api.unfavLearnItem({learnId: data.id})
    } else {
      await this.api.favLearnItem({learnId: data.id})
    }
  }

  renderFavIcon() {
    let {data} = this.state
    let imgProps = {
      onClick: this.toggleFav,
      className: 'fav',
      square: p2r(36),
      src: data.favor ? require('./styles/images/faved@3x.png') : require('./styles/images/fav@3x.png')
    }
    return <Image {...imgProps} />
  }

  render() {
    let {data} = this.state

    return (
      <Page name='CareerLearnItemV3' title={data.title}>
        <h1>{data.title}</h1>
        {data.author ? <p className='author'>作者： {data.author}</p> : null}
        <Markdown source={data.contentMd} />
        <Fixed height={p2r(60)}>
          {this.renderFavIcon()}
        </Fixed>
      </Page>
    )
  }
}
