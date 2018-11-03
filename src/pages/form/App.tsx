import * as React from 'react'
import {App} from 'common/'
import {Loading} from 'mora-common'

export default class extends App {
  components = {
    loading: <Loading />,
    sync: {},
    async: [
      {
        keys: ['Home', 'Question', 'User', 'Finish'],
        load: require('bundle-loader?lazy&name=form-apply!./apply/')
      },
      {
        keys: ['Academy', 'AcademyHome', 'AcademyUser', 'AcademyMy', 'AcademyLibrary', 'AcademyBBS', 'AcademyActivity'],
        load: require('bundle-loader?lazy&name=form-academy!./academy/')
      },
      {
        keys: ['ArtHome', 'ArtClass'],
        load: require('bundle-loader?lazy&name=form-art!./art/')
      },
    ]
  }

  get routes() {
    let {rp} = this.props.app
    return [
      rp.Question,
      rp.User,
      rp.Finish,
      rp.Home,
      rp.Academy,
      rp.AcademyHome,
      rp.AcademyUser,
      rp.AcademyMy,
      rp.AcademyLibrary,
      rp.AcademyBBS,
      rp.AcademyActivity,

      rp.ArtHome,
      rp.ArtClass,
    ]
  }
}

