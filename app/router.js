'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.home.login);
  router.post('/getFriendList', controller.home.getFriendList);
  router.post('/getModelDetail', controller.home.getModelDetail);
  router.get('/wx', controller.wx.index);
  router.post('/wx', controller.wx.getMsg);
  router.get('/auth', controller.wx.auth);
  router.get('/authGetUserInfo', controller.wx.authGetUserInfo);
  router.get('/getSdkConfig', controller.wx.getSdkConfig);
};
