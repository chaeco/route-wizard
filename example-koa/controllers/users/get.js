module.exports = async (ctx) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
  ctx.body = users;
};
