'use strict';
const sha1 = require('sha1');
const request = require('request')
const fs = require('fs')
const Controller = require('egg').Controller;

const xmlTool = require('../utils/xmlTool') 
const answer = require('../utils/answer')
const getRawBody = require('raw-body')

// // 团结大家族
// const appid = 'wx3a32b0c50a7ed7e4'
// const appsecret = '2a8a026305cf0c74ec11aa1d86d3c176'

// 测试公众号
const appid = 'wx266bd1a737fed816'
const appsecret = 'c22f760dc95071924ccea9e2c7a05891'

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

  // 获取sdkConfig
  async getSdkConfig () {
    const { ctx } = this;
    const access_token = await this.getToken()
    const jsapiTicket = await this.getJsApiTicket(access_token)
    const noncestr = "123456"
    const url = 'http:www.wanggege.cn'
    // 精确到秒
    const timestamp = Math.floor(Date.now() / 1000);
    ctx.body  = {
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appid, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: sha1('jsapi_ticket=' + jsapiTicket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url),// 必填，签名
      jsApiList: [
        'chooseImage',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareWeibo',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage'
      ] // 必填，需要使用的JS接口列表
    }
  }

  // 微信授权
  auth () {
    const { ctx } = this;
    // 第一步：用户同意授权，获取code
    let router = 'get_wx_access_token';
    // 这是编码后的地址
    let return_uri = 'http%3a%2f%2fwww.wanggege.cn';  
    let scope = 'snsapi_userinfo';
    ctx.body = {
      url: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${return_uri}&response_type=code&scope=${scope}&state=1#wechat_redirect`
    }
  }

  async authGetUserInfo () {
    const { ctx } = this;
    // 第二步：通过code换取网页授权access_token
    let code = ctx.query.code;
    console.log('code =>', code);
    const res = await request.get(
        {   
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+appsecret+'&code='+code+'&grant_type=authorization_code',
        },
        function(error, response, body){
          // console.log('error', error);
          // console.log('response', response);
          // console.log('body', body);
            if(response.statusCode == 200){
                
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                let data = JSON.parse(body);
                console.log('data=>', data);
                let access_token = data.access_token || '42_WwH9tn8Luf2xBJAZvcxvRvL0rdz4zKPsM6AQSRRiBw_nNNySX241wwZ2Agao0ce2Eyc_uxd7HYd4KXvyzveHgyBoK2FAF64x6ObTKJsH0ck';
                let openid = data.openid || 'o47-V5ukybkD0AwmrTtnF4yQ3bQ8';
                if (access_token) {
                    request.get(
                      {
                          url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                      },
                      function(error, response, body){
                          if(response.statusCode == 200){
                              // 第四步：根据获取的用户信息进行对应操作
                              let userinfo = JSON.parse(body);
                              console.log(JSON.parse(body));
                              
                              if (userinfo.nickname) {
                                // 小测试，实际应用中，可以由此创建一个帐户
                                    ctx.body = "\
                                    <h1>"+userinfo.nickname+" 的个人信息</h1>\
                                    <p><img src='"+userinfo.headimgurl+"' /></p>\
                                    <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                                "
                              }
                              else {
                                console.log('获取用户信息失败');
                                ctx.body = {
                                  msg: '获取用户信息失败'
                                }
                              }
                              
                              
                          }else{
                              console.log('response.statusCode =======', response.statusCode);
                          }
                      }
                  );
                }
                else {
                  console.log('获取access_token失败');
                  ctx.body = {
                    msg: '获取access_token失败'
                  }
                }
            }else{
                console.log('response.statusCode', response.statusCode);
            }
        }
    );
    // ctx.body = {}
  }

  // 获取jsapi_ticket(有效期7200秒)
  async getJsApiTicket(accessToken) {
    const res = await this.ctx.curl('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ accessToken +'&type=jsapi',{
      method: 'GET',
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      dataType: 'json'
    })
    console.log('getJsApiTicket', res)
    return res.data.ticket
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
        appid,
        secret: appsecret
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

        const userInfo =  await this.getUserInfo(token, formatted.FromUserName)

        console.log('formatted =>', formatted);
        // 判断消息的类型，如果是文本消息
        if (formatted.MsgType !== 'text') {
            return answer.text(formatted)
        } else {
            return answer.txtMsg(formatted.FromUserName,formatted.ToUserName,  `欢迎你,${userInfo.data.nickname}的留言，我会尽快查看回复`)
        }
  }
}
// 素材上传获取 media_id
// type 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
async function uploadFile (ctx, accessToken, urlPath, type) {
  return  new Promise(async (resolve, reject) => {
    let form = { //构造表单
      media: fs.createReadStream(urlPath)
    }
    console.log('fs.createReadStream(urlPath)========', fs.createReadStream(urlPath));
    let url = 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=' + accessToken + '&type=' + type

    // const result = await ctx.curl(url, {
    //   method: 'POST',
    //   // rejectUnauthorized: false, //如果想忽略证书
    //   // // cert: fs.readFileSync(cerPaht),//对证书格式有要求 如果接口的url是https的，可能需要证书
    //   // headers: {//自定义header
    //   //   "Accept": "*/*",
    //   //   "Content-Type": "application/json"
    //   // },
    //   data: {
    //     media: fs.createReadStream(urlPath)
    //   },
    //   dataType: 'json'
    // });
    // console.log('result ====>', result);
    // resolve(JSON.parse(result).media_id)
    // console.log('request ==>', request);
    request.post(url, form, function optionalCallback(err, httpResponse, body){
      // console.log('err =>', err);
      // console.log('httpResponse =>', httpResponse);
      console.log('body =>', body);
    })
   
  })
}

module.exports = IndexController;
