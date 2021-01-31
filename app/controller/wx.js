'use strict';
const sha1 = require('sha1');
const Controller = require('egg').Controller;

class IndexController extends Controller {

  // 登录
  async index() {
    const { ctx } = this;
    /**
     * 参数	描述
       signature	微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
       timestamp	时间戳
       nonce	随机数
       echostr	随机字符串
     */
    const { signature, timestamp, nonce, echostr } = ctx.query;
    console.log('ctx =>', ctx);
    console.log('query =>', ctx.query);
    
    const token = 'wgg';
    const str = [token, timestamp, nonce].sort().join(''); //按字典排序，拼接字符串
    const sha = sha1(str); //加密
    ctx.body = (sha === signature) ? echostr + '' : 'failed';  //比较并返回结果
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
  }

}

module.exports = IndexController;
