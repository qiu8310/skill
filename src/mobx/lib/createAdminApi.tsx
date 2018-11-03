import createApi from 'helper/createApi'

export default function(inject, login) {
  return createApi({
    signIn:         {path: '/api/v1/login', method: 'post'},

    getCareerList:  {path: '/admin/v1/career', query: pageQuery()},
    getCareer:      {path: '/api/v1/career/:careerId'},
    addCareer:      {path: '/api/v1/career', method: 'post'},
    setCareer:      {path: '/api/v1/career/:careerId', method: 'post'},
    delCareer:      {path: '/api/v1/career/:careerId', method: 'delete'},

    getModuleList:  {path: '/api/v1/career/menu', query: pageQuery({pageSize: {value: 100}})},
    getModule:      {path: '/api/v1/career/menu/:moduleId'},
    addModule:      {path: '/admin/v1/career/menu', method: 'post'},
    setModule:      {path: '/admin/v1/career/menu/:moduleId', method: 'post'},
    delModule:      {path: '/admin/v1/career/menu/:moduleId', method: 'delete'},

    getCareerModuleList:    {path: '/api/v1/career/:careerId/menu', query: pageQuery()},
    assModulesToCareer:     {path: '/admin/v1/career/:careerId/menu', method: 'post', data: 'menuIds='},
    getCareerQuestionList:  {path: '/api/v1/question/career/:careerId', query: pageQuery()},
    reply:                  {path: '/api/v1/question/:questionId/answer', method: 'post'},
    getReplyList:           {path: '/api/v1/question/:questionId/answer', query: pageQuery()},

    getCardList:    {path: '/api/v1/career/:careerId/menu/:moduleId/card'},
    addCard:        {path: '/admin/v1/career/:careerId/menu/:moduleId', method: 'post'},
    getCard:        {path: '/admin/v1/career/menu/card/:cardId'},
    setCard:        {path: '/admin/v1/career/menu/card/:cardId', method: 'put'},
    delCard:        {path: '/admin/v1/career/menu/card/:cardId', method: 'delete'},

    getArticleList: {path: '/api/v1/blog', query: pageQuery()},
    getArticle:     {path: '/api/v1/blog/:articleId'},
    addArticle:     {path: '/api/v1/blog', method: 'post'},
    setArticle:     {path: '/api/v1/blog/:articleId', method: 'post'},
    delArticle:     {path: '/api/v1/blog/:articleId', method: 'delete'},

    getQuestionList: {path: '/api/v1/question', query: pageQuery()},
    getQuestion:     {path: '/api/v1/question/:questionId'},
    addQuestion:     {path: '/api/v1/question', method: 'post'},
    setQuestion:     {path: '/api/v1/question/:questionId', method: 'post'},
    delQuestion:     {path: '/api/v1/question/:questionId', method: 'delete'},

    getUserTagList:  {path: '/api/v1/industry'},
    addUserTag:      {path: '/admin/v1/industry', method: 'post'},
    setUserTag:      {path: '/admin/v1/industry/:userTagId', method: 'put'},
    delUserTag:      {path: '/admin/v1/industry/:userTagId', method: 'delete'},

    getTagList:      {path: '/api/v1/tag', query: pageQuery({keyword: {alias: 'key', value: ''}})},
    addTag:          {path: '/api/v1/tag', method: 'post'}
  }, {base: '', inject, login})
}

function pageQuery(data: any = {}) {
  return {
    page: {alias: 'pageNum', value: 1},
    pageSize: {value: 10},
    needTotal: {value: 'true'},
    ...data
  }
}
