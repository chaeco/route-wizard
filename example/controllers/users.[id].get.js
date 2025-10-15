module.exports = (req, res) => {
  const { id } = req.params;
  res.json({ user: { id, name: `User ${id}` } });
};