const searchService = require("../services/searchService");

const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const result = await searchService.globalSearch(q);

    return res.json({
      message: "Search success",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  globalSearch,
};