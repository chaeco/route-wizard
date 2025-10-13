module.exports = (req, res) => {
  res.json({ user: { id: req.params.id } });
};