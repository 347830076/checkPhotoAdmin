'use strict';
const sha1 = require('sha1');
const Controller = require('egg').Controller;

const xmlTool = require('../utils/xmlTool') 
const answer = require('../utils/answer')
const getRawBody = require('raw-body')

class IndexController extends Controller {

  // 验证wx传送消息
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
  }


  // 获取access_token
  async getToken() {
    const res = await this.ctx.curl('https://api.weixin.qq.com/cgi-bin/token',{
      method: 'GET',
      headers: {//自定义header
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      data:{
        grant_type: 'client_credential',
        appid: 'wx3a32b0c50a7ed7e4',
        secret: '2a8a026305cf0c74ec11aa1d86d3c176'
      },
      dataType: 'json'
    })
    console.log('res.access_token', res)
    return res.data.access_token
  }
  
  
  async getUserInfo(access_token, openid) {
    console.log('access_token +>', access_token);
    console.log('openid =>', openid);
    const result = await this.ctx.curl('https://api.weixin.qq.com/cgi-bin/user/info', {
      method: 'GET',
      rejectUnauthorized: false, //如果想忽略证书
      // cert: fs.readFileSync(cerPaht),//对证书格式有要求 如果接口的url是https的，可能需要证书
      headers: {//自定义header
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      data: {
        access_token,
        openid,
        lang: 'zh_CN',
      },
      dataType: 'json'
    });
    console.log('获取用户信息 result =>', result);
    return result
  }

  async getMsg(){
    const { ctx } = this
    const res = await this.handleMessage(ctx)
    ctx.body = res;
  }

  async handleMessage (ctx) {
        let xml = await getRawBody(ctx.req, {
            length: ctx.request.length,
            limit: '1mb',
            encoding: ctx.request.charset || 'utf-8'
        });
        console.log('xml =>', xml);
        // 将xml数据转化为json格式的数据
        let result = await xmlTool.parseXML(xml)
        console.log('result =>', result);
        // 格式化数据
        let formatted = await xmlTool.formatMessage(result.xml)

        const token = await this.getToken()

        await this.getUserInfo(token, formatted.FromUserName)

        console.log('formatted =>', formatted);
        // 判断消息的类型，如果是文本消息则返回相同的内容
        if (formatted.MsgType !== 'text') {
            return answer.text(formatted)
        } else {
            return answer.txtMsg(formatted.FromUserName,formatted.ToUserName,  '欢迎你的留言，我会尽快查看回复')
        }
  }
}

module.exports = IndexController;
