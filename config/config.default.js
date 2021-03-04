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

  // 允许跨域
  config.security = {
    csrf: {
      enable: true,
    },
  };

  config.cors = {
    enable: true,
    origin: '*',
    allowMethods: 'GET,POST,PUT,DELETE',
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
