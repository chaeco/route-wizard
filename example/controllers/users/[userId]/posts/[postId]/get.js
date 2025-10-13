module.exports = (req, res) => {
  res.json({ userId: req.params.userId, postId: req.params.postId });
};