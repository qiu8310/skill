import createApi from 'helper/createApi'

export default function(inject, login) {
  return createApi({
    // getCareerList:          {path: '/api/v1/career', query: pageQuery({crowdFunding: {value: 'false'}})},
    // getCareer:              {path: '/api/v1/career/:careerId'},
    // addCareer:              {path: '/api/v1/career', method: 'post'},
    // searchCareers:          {path: '/api/v1/career/search', query: pageQuery({keyword: {alias: 'key', value: ''}})},
    // focusCareer:            {path: '/api/v1/career/:careerId/focus', method: 'post'},
    // unfocusCareer:          {path: '/api/v1/career/:careerId/focus', method: 'delete'},
    // upgradeExpectCareer:    {path: '/api/v1/career/:careerId/menu', method: 'put'},

    // getModuleList:          {path: '/api/v1/career/menu', query: pageQuery({pageSize: {value: 100}})},
    // getCareerModuleList:    {path: '/api/v1/career/:careerId/menu', query: pageQuery()},

    // addCareerQuestion:      {path: '/api/v1/question', method: 'post'},
    // getCareerQuestionList:  {path: '/api/v1/question/career/:careerId', query: pageQuery({official: {value: 'false'}})},
    // getQuestion:            {path: '/api/v1/question/:questionId'},
    // addQuestion:            {path: '/api/v1/question', method: 'post'},
    // reply:                  {path: '/api/v1/question/:questionId/answer', method: 'post'},

    // getReplyList:           {path: '/api/v1/question/:questionId/answer', query: pageQuery()},
    // kudoReply:              {path: '/api/v1/answer/:replyId/agree', method: 'post'},
    // unkudoReply:            {path: '/api/v1/answer/:replyId/disagree', method: 'put'},

    // comment:                {path: '/api/v1/answer/:replyId/comment', method: 'post'},
    // getCommentList:         {path: '/api/v1/answer/:replyId/comment', query: pageQuery()},
    // getComment:             {path: '/api/v1/answer/comment/:commentId'},

    // getExpectList:          {path: '/api/v1/career', query: pageQuery({crowdFunding: {value: 'true'}})},

    // getCardList:            {path: '/api/v1/career/:careerId/menu/:moduleId/card'},

    // feedback:               {path: '/api/v1/feedback', method: 'post'},
    // myExpectList:           {path: '/api/v1/user/my-expect-careers', query: pageQuery()},
    // myCareerList:           {path: '/api/v1/user/my-focus-careers', query: pageQuery()},
    // myReplyList:            {path: '/api/v1/user/my-answers', query: pageQuery()},
    // myQuestionList:         {path: '/api/v1/user/my-questions', query: pageQuery()},
    // myMessageList:          {path: '/api/v1/user/my-msg', query: pageQuery()},

    // getUserProfile:         {path: '/api/v1/user/profile'},
    // getUserTagList:         {path: '/api/v1/industry'},
    // setUserTag:             {path: '/api/v1/industry/user', method: 'post'},
    // sendSMS:                {path: '/api/v1/verify/captcha/sms/:mobile'},
    // getCaptcha:             {path: '/api/v1/verify/captcha/image'},
    // validateMobile:         {path: '/api/v1/user/add-mobile/:mobile'},
    // bindMobile:             {path: '/api/v1/user/add-mobile/:mobile', method: 'post'},
    // unbindMobile:           {path: '/api/v1/user/add-mobile/:mobile', method: 'delete'},

    getCareerList:          {path: '/api/v1/evaluate/careers', query: pageQuery()},
    getCareerListByFilter:  {path: '/api/v1/evaluate/careers/filter', query: pageQuery('moreBoy&degreeOfOvertime&careerJoinThreshold')},
    getCareer:              {path: '/api/v1/evaluate/career/:careerId'},
    searchCareers:          {path: '/api/v1/evaluate/careers/search', query: pageQuery({keyword: {alias: 'key'}})},

    getTestCharacters:      {path: '/api/v1/evaluate/category/list'},
    getTestQuestions:       {path: '/api/v1/evaluate/question'},
    hasTestResult:          {path: '/api/v1/evaluate/history', method: 'post'},
    getTestResult:          {path: '/api/v1/evaluate/report'},
    setTestQuestionAnswers: {path: '/api/v1/evaluate/question', method: 'post'},
    setTestCharacter:       {path: '/api/v1/evaluate/category/:characterId', method: 'post'},

    // v3
    getLearnItems:          {path: '/api/v2/evaluate/learning/list', query: 'careerIds='},
    getLearnItem:           {path: '/api/v2/evaluate/learning/list/:learnId'},

    getFavLearnItems:       {path: '/api/v2/evaluate/learning/list/favor'},
    favLearnItem:           {path: '/api/v2/evaluate/learning/list/:learnId/favor', method: 'post'},
    unfavLearnItem:         {path: '/api/v2/evaluate/learning/list/:learnId/favor', method: 'delete'},

  }, {base: '', inject, login})
}

function pageQuery(data: any = {}) {
  if (typeof data === 'string') {
    data = data.split('&').reduce((a, k) => {
      a[k] = {value: ''}
      return a
    }, {})
  }

  return {
    page: {alias: 'pageNum', value: 1},
    pageSize: {value: 10},
    needTotal: {value: 'true'},
    ...data
  }
}
