'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {

  // 登录
  async index() {
    const { ctx } = this;
    const { code, data, userInfo, p_openid } = ctx.request.body;
    console.log('ctx =>', ctx);
    console.log('query =>', ctx.query);
    console.log('body =>', ctx.request.body);
    console.log('code => ', code);
    // const result = await this.ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
    //   method: 'GET',
    //   // rejectUnauthorized: false, //如果想忽略证书
    //   // cert: fs.readFileSync(cerPaht),//对证书格式有要求 如果接口的url是https的，可能需要证书
    //   headers: {//自定义header
    //     "Accept": "*/*",
    //     "Content-Type": "application/json"
    //   },
    //   data: {//发送的数据
    //     appid: 'wx3a32b0c50a7ed7e4', // 小程序 appId
    //     secret: '2a8a026305cf0c74ec11aa1d86d3c176', // 小程序 appSecret
    //     js_code: code, // 登录时获取的 code
    //     grant_type: 'authorization_code', // 授权类型，此处只需填写 authorization_code
    //   },
    //   dataType: 'json'
    // });
    // console.log('result =>', result.data);
    ctx.body = result;
  }

}

module.exports = IndexController;
