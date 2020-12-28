'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  // 登录
  async login() {
    const { ctx } = this;
    const { code, data, userInfo, p_openid } = ctx.request.body;
    // console.log('query =>', ctx.query);
    // console.log('body =>', ctx.request.body);
    // console.log('code => ', code);
    const result = await this.ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      method: 'GET',
      // rejectUnauthorized: false, //如果想忽略证书
      // cert: fs.readFileSync(cerPaht),//对证书格式有要求 如果接口的url是https的，可能需要证书
      headers: {//自定义header
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      data: {//发送的数据
        appid: 'wx3a32b0c50a7ed7e4', // 小程序 appId
        secret: '2a8a026305cf0c74ec11aa1d86d3c176', // 小程序 appSecret
        js_code: code, // 登录时获取的 code
        grant_type: 'authorization_code', // 授权类型，此处只需填写 authorization_code
      },
      dataType: 'json'
    });
    // console.log('result =>', result.data);
    // 根据openid去判断是否保存过
    const IsMyopnid = await this.getList('my_openid', result.data.openid);
    console.log('IsMyopnid =>', IsMyopnid);
    if (IsMyopnid && IsMyopnid.length) {
      ctx.body = result;
      return;
    }

    this.setLeancloud(data, userInfo, result.data.openid, p_openid);
    ctx.body = result;
  }

  // 存数据到leancloud
  setLeancloud(data, userInfo, my_openid, p_openid) {
    const { ctx } = this;
    // 声明 class
    const CheckPhoto = ctx.AV.Object.extend('checkPhoto');
    // 构建对象
    const checkPhoto = new CheckPhoto();
    // 为属性赋值
    checkPhoto.set('data', data);
    checkPhoto.set('userInfo', userInfo);
    checkPhoto.set('my_openid', my_openid);
    checkPhoto.set('p_openid', p_openid || '');
    // 将对象保存到云端
    checkPhoto.save().then((checkPhoto) => {
      // 成功保存之后，执行其他逻辑
      console.log(`保存成功。objectId：${checkPhoto.id}`);
    }, (error) => {
      // 异常处理
      console.log('error =>', error);
    })
  }

  // 通过单一字段值，查询获取列表
  async getList(filed, value) {
    const { ctx } = this;
    const query = new ctx.AV.Query('checkPhoto');
    query.equalTo(filed, value);
    return new Promise((resolve, reject) => {
      query.find().then((res) => {
        // console.log('找到', res);
        resolve(res)
      }, (err) => {
        console.log('没有找到', err);
        resolve(false)
      }).catch((err) => {
        console.log('catch =>', err);
      });
    })
  } 

  // 获取好友列表
  async getFriendList() {
    const { ctx } = this;
    const { openid } = ctx.request.body;
    console.log('openid =>', openid);
    const list = await this.getList('p_openid', openid);
    ctx.body = list;
  }

  // 获取机型详情列表
  async getModelDetail() {
    const { ctx } = this;
    const { openid } = ctx.request.body;
    console.log('openid =>', openid);
    const list = await this.getList('my_openid', openid);
    ctx.body = list;
  }
}

module.exports = HomeController;
