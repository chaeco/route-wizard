module.exports = async (ctx) => {
  const user = {
    id: ctx.params.id,
    name: `User ${ctx.params.id}`,
  };
  ctx.body = user;
};
