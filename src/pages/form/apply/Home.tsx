import {page, PageComponent, Page, Link, React} from 'mobx/FormApp'
import {Image} from 'mora-common'

@page
export class Home extends PageComponent {
  render() {
    let {rp, location} = this.props.app
    return (
      <Page name='Home'>
        <Image width={278} height={207} src='//n1image.hjfile.cn/res7/2017/12/12/e9612d1a0dd604c787323699794b0414.png?imageslim' ratio={3} />

        <div className='t1'>
          我们是一所大学<br/>
          不设地域限制
        </div>

        <div className='t2'>
          我们提供和广阔世界连接的媒介<br/>
          我们有门槛，不野鸡，但也不随便<br/>
          我们有导师，有同学，但不死抠作业<br/>
          我们有社交，有实践，但不限空间<br/><br/>
          参与我们的内测，和我们一起探索，一起共创<br/><br/>
          走出去，找回来，活成你想要的样子<br/><br/><br/>
        </div>

        <Link className='apply' to={rp.Question.link({search: location.search})}>申请</Link>
      </Page>
    )
  }
}
