/**
 * Create by Mora at 2017-11-09 15:49
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Link, Markdown, Image} from 'pages/index/base/'
import {Box} from 'pages/index/widget/Box'
import {LearnItem} from 'pages/index/widget/LearnItem'
import {CompanyItem} from 'pages/index/widget/CompanyItem'

import './styles/CareerV3.scss'
//#endregion

@inject('app')
export class CareerV3 extends PageComponent<{careerId: string}, any> {
  state = {
    companySource: null,
    companies: [],
    learnItems: []
  }
  get career() {
    return this.app.careers[parseInt(this.params.careerId, 10) - 1]
  }

  get links() {
    let {params} = this
    let {CareerDetailV3, CareerDataV3, CareerSkillV3, CareerSystemV3} = this.rp
    return [
      {id: 1, name: CareerDetailV3.title, to: CareerDetailV3.link(params)},
      {id: 2, name: CareerDataV3.title, to: CareerDataV3.link(params)},
      {id: 3, name: CareerSkillV3.title, to: CareerSkillV3.link(params)},
      {id: 4, name: CareerSystemV3.title, to: CareerSystemV3.link(params)}
    ]
  }

  async fetchLearnItems() {
    return await this.api.getLearnItems({query: {careerIds: this.career.bid}})
  }
  async fetchCompanies() {
    let res = await fetch(`/p/v3/${this.params.careerId}/company.md`)
    return await res.text()
  }

  async componentWillMount() {
    // let res = await fetch(`/p/v3/${this.params.careerId}.company.md`)
    // let companySource = await res.text()

    let [learnItems, companySource] = await Promise.all([this.fetchLearnItems(), this.fetchCompanies()])

    this.setState({companySource, learnItems}, () => {
      let companies = []
      document.querySelectorAll('.gMarkdown h2').forEach((el: Element) => {
          let html = [el.outerHTML]
          let ref = el.nextSibling
          while (ref && ref.nodeName.toUpperCase() !== 'H2') {
            html.push((ref as Element).outerHTML)
            ref = ref.nextSibling
          }
          companies.push({
            name: el.textContent,
            img: (el.nextSibling.firstChild as any).src,
            desc: el.nextSibling.nextSibling.firstChild.textContent,
            html: html.join('')
          })
      })
      this.setState({companies, companySource: null})
      this.setState({companies})
    })
  }

  render() {
    let {rp, career, state: {companySource, companies, learnItems}} = this

    return (
      <Page name='CareerV3' title={rp.CareerV3.title}>
        <div className={'top top' + career.id}>
          <h1>{career.name}</h1>
          <h2>{career.english}</h2>

          <div className='links gSpaceBetweenChildren'>
            {this.links.map(l => (
              <Link key={l.id} className='link' to={l.to}>
                <div className='logo'>
                  <div className='gOverlay bg' />
                  <div className={'gOverlay icon icon' + l.id} />
                </div>
                <div className='label'>{l.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <Image className='video' bg fade={false} src={career.video.cover} onClick={() => this.app.gotoLink(career.video.src)}>
          <div className='mask'>
            <i className='play' />
            <div className='nt gFlexContainer gSpaceBetweenChildren'>
              <div className='name'>{career.video.name}</div>
              <div className='time'>时长 {career.video.time}</div>
            </div>
          </div>
        </Image>

        <Box title='学习清单'>
          {learnItems.map(item => <LearnItem data={item} key={item.id} />)}
        </Box>
        <Box title='公司推荐'>
          {companies.map((c, i) => <CompanyItem key={i} data={c} />)}
        </Box>

        {companySource && <div style={{visibility: 'hidden'}}><Markdown source={companySource} /></div>}
      </Page>
    )
  }
}
