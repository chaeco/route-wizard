module.exports = (req, res) => {
  const { id } = req.params;
  res.json({ posts: [{ id: 1, title: `Post by user ${id}`, userId: id }] });
};