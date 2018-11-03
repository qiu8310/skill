import {MobxApp, r, BasePageComponent} from 'common/'
import {TryDesignLabConfig} from 'mobx/Config'
import {observable} from 'mobx'

// declare type ID = string | number

const PREFIX = TryDesignLabConfig.appName + ' | '

export class TryDesignLabApp extends MobxApp {
  storeKey = 'TryDesignLabApp'
  serializableKeys = ['progress']
  rp = {
    CourseProject:  r({path: '/ux-research-and-strategy/unit/:unitId/lesson/:lessonId/project', title: PREFIX + '项目'}),
    CourseLectures: r({path: '/ux-research-and-strategy/unit/:unitId/lesson/:lessonId/lectures', title: PREFIX + '讲义'}),
    CourseUnit:     r({path: '/ux-research-and-strategy/unit/:unitId', title: PREFIX + '单元'}),
    CourseHome:     r({path: '/ux-research-and-strategy', title: PREFIX + '课程'}),
    ApplySuccess:   r({path: '/apply/success'}),
    Apply:          r({path: '/apply'}),
    Home:           r({path: '*'})
  }

  course = {
    name: '用户体验的研究与策略',
    description: '四周的课程，我们将学习如何做用户研究，评估，以及从客户那儿获取洞见',
    icon: '//n1image.hjfile.cn/res7/2017/11/27/bc0d4dbad7482cffa95cc11e2a93c724.png?imageslim',
    weeks: [
      {
        week: '1',
        units: [
          {
            id: 1,
            title: '介绍',
            icon: '//n1image.hjfile.cn/res7/2017/11/27/fd5d9a095de82c93020f11544b4a10cc.png?imageslim',
            desc: `把人放在第一位，让我们先了解以人为中心的设计流程，以及为什么它很重要。`,
            hour: 2,
            lesson: 3,
            project: 1
          },
          {
            id: 2,
            title: '移情',
            icon: '//n1image.hjfile.cn/res7/2017/11/27/afa1a7cd84885375e2aa6475df92bbad.png?imageslim',
            desc: `设计思维的第一步：移情，为理解用户，你将开始做一些深入的研究。`,
            hour: 6,
            lesson: 5,
            project: 2
          }
        ]
      },
      {
        week: '2',
        units: [
          {
            id: 3,
            title: '定义',
            icon: '//n1image.hjfile.cn/res7/2017/11/27/4cb4e3f5e91c486dc78238934739e660.png?imageslim',
            desc: `完成了研究，我们需要把研究中的发现，转化成对使用者的深刻的洞见。`,
            hour: 12,
            lesson: 10,
            project: 3
          },
        ]
      },
      {
        week: '3',
        units: [
          {
            id: 4,
            title: '产生 idea',
            icon: '//n1image.hjfile.cn/res7/2017/11/27/36ee7a81be5be496d539cd7cc0f264e8.png?imageslim',
            desc: `有了对使用者以及他们遇到的问题的深刻理解，我们可以开始假象对应的解决办法了！`,
            hour: 3,
            lesson: 3,
            project: 2
          },
          {
            id: 5,
            title: '原型',
            icon: '//n1image.hjfile.cn/res7/2017/11/27/424402d85d815353c9e658d8f2a81252.png?imageslim',
            desc: `让我快速的测试和验证我们的构想和假设。`,
            hour: 2,
            lesson: 1,
            project: 1
          }
        ]
      },
      {
        week: '4',
        units: [
          {
            id: 6,
            title: '测试',
            icon: '//n1image.hjfile.cn/res7/2017/11/27/6abc8640b6ae39c8a3317511b9b267e6.png?imageslim',
            desc: `测试的目的，不是为了成功，而是为了学习。`,
            hour: 5,
            lesson: 2,
            project: 2
          }
        ]
      }
    ]
  }

  units: Unit[] = this.course.weeks.reduce((units, week) => [...units, ...week.units], [])
  @observable progress: {[unit: string]: {[lesson: string]: number}} = this.units.reduce((map, unit) => {
    map[`unit${unit.id}`] = {}
    return map
  }, {})

  getUnit(id: string | number): Unit {
    for (let unit of this.units) {
      if (unit.id - (id as any) === 0) return unit
    }
  }

  getUnitProgress(id: string | number): number {
    let unit = this.progress['unit' + id] || {}
    let lessons = Object.keys(unit)
    if (!lessons.length) return 0

    let total = lessons.length
    let current = 0
    lessons.forEach(key => current += unit[key] || 0)
    return Math.round(current / total)
  }

  setProgress(unitId: string | number, lessonId: string | number, value: number) {
    let u = `unit${unitId}`
    let l = `lesson${lessonId}`
    if (this.progress[u][l] < value) this.progress[u][l] = value
  }
}

export interface Unit {
  id: number
  title: string,
  icon: string,
  desc: string,
  hour: number,
  lesson: number,
  project: number
  // progress: number
}

export interface IAppComponentProps {
  app?: TryDesignLabApp
}

export class PageComponent<P, S> extends BasePageComponent<TryDesignLabApp, P, S> {
  rp = this.app.rp
}

export * from 'mobx'
export * from 'mobx-react'
export {Page, Link} from 'common/'
export {Markdown} from 'widget/Markdown'
