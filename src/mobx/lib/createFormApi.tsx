import createApi from 'helper/createApi'

export default function(inject, login) {
  return createApi({
    setUser:    {path: '/api/v3/user', method: 'put'},
    setAnswer:  {path: '/api/v3/career/develop', method: 'post'}
  }, {base: '', inject, login})
}
