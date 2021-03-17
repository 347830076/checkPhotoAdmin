/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // domainWhiteList: ['http://www.wanggege.cn', 'http://localhost:8083'], //配置白名单
  };

  // 允许跨域
  config.cors = {
    origin: '*', //允许所有跨域访问，注释掉则允许上面 白名单 访问
    // credentials: true, // 允许跨域请求携带cookies
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // leancloud
  config.leancloud = {
    appId: 'wG80ABRLiltFyle1Og4w2t17-gzGzoHsz',
    appKey: 'teVOQOS5KxE0JwJsul9vWEPO',
    masterKey: 'GatroahHru81KXsOrSvyDgvt',
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1609001210132_2374';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
