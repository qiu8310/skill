import * as React from 'react'
import {App} from 'common/'
import {Loading} from 'mora-common'

export default class extends App {
  components = {
    loading: <Loading />,
    sync: {},
    async: [
      {
        keys: ['CourseHome', 'CourseUnit', 'CourseLectures', 'CourseProject'],
        load: require('bundle-loader?lazy&name=trydesignlab-course!./course/')
      },
      {
        keys: ['Home', 'Apply', 'ApplySuccess'],
        load: require('bundle-loader?lazy&name=trydesignlab-apply!./apply/')
      }
    ]
  }

  get routes() {
    let {rp} = this.props.app
    return [
      rp.CourseProject,
      rp.CourseLectures,
      rp.CourseUnit,
      rp.CourseHome,

      rp.Apply,
      rp.ApplySuccess,
      rp.Home
    ]
  }
}

