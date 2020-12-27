# check-photo-admin

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org


## config 文件的配置

config/config.default.js
```
// 允许跨域
config.security = {
    csrf: {
        enable: false,
    },
};
config.cors = {
    origin: '*',
    allowMethods: 'GET,POST,PUT,DELETE',
};
```

## 请求外部接口方式

```js
const result = await this.ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
    method: 'GET',
    // rejectUnauthorized: false, //如果想忽略证书
    // cert: fs.readFileSync(cerPaht),//对证书格式有要求 如果接口的url是https的，可能需要证书
    headers: {//自定义header
        "Accept": "*/*",
        "Content-Type": "application/json"
    },
    data: {//发送的数据
    },
    dataType: 'json'
});
// 返回的数据是流的格式，需要转换成字符，再进行处理，示例代码如下：
    // let json=JSON.parse(result.data.toString());
```

## 使用了leancloud作为数据库

['https://www.leancloud.cn/'](https://www.leancloud.cn/)