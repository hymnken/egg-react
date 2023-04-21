
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user', controller.user.index);
  router.get("/user/lists", controller.user.lists);
  router.get("/user/detail", controller.user.detail);
  router.post('/user/add',controller.user.add);
};
