/**
 * Create by Mora at 2017-11-27 11:24
 * All right reserved
 */

//#region import
import {React, PageComponent, Page, inject, Image, Link, Unit, classSet} from 'pages/trydesignlab/base/'
import {Circle} from 'widget/Circle'
import {ProgressBar} from 'widget/ProgressBar'

import './styles/CourseHome.scss'
//#endregion

@inject('app')
export class CourseHome extends PageComponent<any, any> {
  renderUnit = (unit: Unit) => {
    let progress = this.app.getUnitProgress(unit.id)
    let locked = unit.id >= 3
    return (
      <Link to={this.rp.CourseUnit.link({unitId: unit.id})} className={classSet('unit gFlexContainer', {disabled: locked})} key={unit.id}>
        <div className='left gVCenterChildren'>
          <Image src={unit.icon} square={p2r(94)} />
        </div>
        <div className='right gFlex'>
          <h4>第 {unit.id} 单元</h4>
          <h2>{unit.title}</h2>
          <p className='desc'>{unit.desc}</p>
          <div className='infos'>
            <div className='info'>{unit.hour} 小时</div>
            <div className='info'>{unit.lesson} 节课</div>
            <div className='info'>{unit.project} 项目</div>
          </div>
          <ProgressBar progress={progress} fgColor={'#78B842'} />
        </div>

        {progress >= 100
          ? <div className='mask completed'>
              <Image className='icon' square={p2r(78)} src={'//n1image.hjfile.cn/res7/2017/11/27/0ab2fcb619291e1a4ee6eb329756cc8a.png?imageslim'} />
              <p className='gTextCenter'>已完成 !</p>
            </div>
          : null}
        {
          locked
            ? <div className='mask locked'>
              <Image className='icon' square={p2r(70)} src='http://lcdn.static.lotlot.com/lock2-d5705076.svg' />
            </div>
            : null
        }
      </Link>
    )
  }

  render() {
    let {rp, app} = this
    let {course, units} = app
    let progress = Math.round(units.reduce((sum, unit) => sum + app.getUnitProgress(unit.id), 0) / units.length)
    return (
      <Page name='CourseHome' title={rp.CourseHome.title} scrollRestore>
        <div className='top'>
          <Image className='gCenter' square={p2r(100)} src={course.icon} />

          <h1>
            <p className='welcome'>欢迎来到</p>
            <p className='courseName gTextCenter'>{course.name}</p>
          </h1>

          <p className='courseDesc gTextCenter'>{course.description}</p>

          <div className='progress'>
            <h3>课程进度</h3>
            <Circle className='circle gCenter' fgColor='#78B842' progress={progress}>
              <p className='value'>{progress}%</p>
            </Circle>
          </div>
        </div>

        <div className='bar gTextCenter'>现在是第一周</div>

        <div className='bottom'>
          <div className='weeks'>
            <div className='spine' />
            {course.weeks.map(week => (
              <div className='week' key={week.week}>
                <label className='weekLabel'>第 {week.week} 周</label>
                <div className='units'>
                  {week.units.map(this.renderUnit)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>
    )
  }
}
