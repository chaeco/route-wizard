module.exports = (req, res) => {
  res.json({ query: req.params.query || null, results: [] });
};