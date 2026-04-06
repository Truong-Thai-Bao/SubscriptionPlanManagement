const axios = require("axios");

const MOODLE_URL = process.env.MOODLE_URL;
const TOKEN = process.env.MOODLE_TOKEN;

const globalSearch = async (query) => {
  try {
    const res = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: TOKEN,
        wsfunction: "core_search_get_results",
        moodlewsrestformat: "json",
        query: query,
      },
    });

    return res.data;
  } catch (err) {
    throw new Error("Search failed: " + err.message);
  }
};

module.exports = {
  globalSearch,
};