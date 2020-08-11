const baseUrl = process.env.BASE_API
const api = {
  state: {
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // 图片上传
    imagesUploadApi: baseUrl + '/api/pictures',
    // 凭证模板上传
    jeExcelUploadApi: baseUrl + '/api/je/template/upload-exl',
    // 修改头像
    updateAvatarApi: baseUrl + '/api/users/updateAvatar',
    // 上传文件到七牛云
    qiNiuUploadApi: baseUrl + '/api/qiNiuContent',
    // 通用文件上传
    sysFileUploadApi: baseUrl + '/api/attachment/file/upload',
    // Sql 监控
    sqlApi: baseUrl + '/druid',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html',
    // 收入报表
    bsIncomeReport: 'http://111.229.238.12:8080/design?fid=rptb79a706091c811ea816167e997f272d8&fserid=3a2ec12095c511ea816167e997f272d8&fsharetype=3',
    // 财务收入报表
    financialIncomeReport: 'http://111.229.238.12:8080/design?fid=rpt941c00b094eb11ea816167e997f272d8&fserid=f7ff2c2095c611ea816167e997f272d8&fsharetype=3',
    // 一次性收入计提报表
    oneOffIncome: 'http://111.229.238.12:8080/design?fid=rpt841cc75090cf11ea816167e997f272d8&fserid=289fee70968811ea816167e997f272d8&fsharetype=3'
  }
}

export default api
