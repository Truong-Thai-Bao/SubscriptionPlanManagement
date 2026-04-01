const axios = require("axios");
require("dotenv").config();

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

class MoodleAPI {
  constructor(token = MOODLE_TOKEN) {
    this.baseUrl = `${MOODLE_URL}/webservice/rest/server.php`;
    this.token = token;
  }
  flattenParams(obj, prefix = "") {
    const params = {};
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          Object.assign(params, this.flattenParams(v, `${newKey}[${i}]`));
        });
      } else if (typeof value === "object" && value !== null) {
        Object.assign(params, this.flattenParams(value, newKey));
      } else {
        params[newKey] = value;
      }
    }
    return params;
  }
  async request(method, token, wsfunction, params = {}, flatten = false) {
    try {
      const config = {
        url: this.baseUrl,
        method: method.toLowerCase(),
        params: {
          wstoken: token ?? this.token,
          wsfunction,
          moodlewsrestformat: "json",
        },
      };

      if (method.toLowerCase() === "post") {
        if (flatten) {
          const flat = this.flattenParams(params);
          console.log("Final flat params:", flat);
          config.data = new URLSearchParams(flat);
        } else {
          config.data = params;
        }
      } else {
        Object.assign(config.params, params);
      }

      const res = await axios(config);

      if (res.data?.exception || res.data?.errorcode) {
        return {
          status: false,
          message: res.data.message || "Moodle API Error",
          error: res.data,
        };
      }

      return {
        status: true,
        data: res.data,
        error: null,
      };
    } catch (err) {
      return {
        status: false,
        message: "Failed to connect Moodle API",
        error: err.message,
      };
    }
  }

  async get(token, wsfunction, params = {}, flatten = false) {
    return this.request("get", token, wsfunction, params, flatten);
  }
  async post(token, wsfunction, params = {}, flatten = false) {
    return this.request("post", token, wsfunction, params, flatten);
  }
  async put(token, wsfunction, params = {}, flatten = false) {
    return this.request("post", token, wsfunction, params, flatten);
  }
  async delete(token, wsfunction, params = {}, flatten = false) {
    return this.request("post", token, wsfunction, params, flatten);
  }
  async uploadImage(token, formData) {
    try {
      const result = await axios.post(
        `${MOODLE_URL}/webservice/upload.php`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );
      const file = result.data?.[0];
      if (file?.contextid && file?.filename && file?.filearea) {
        const fileurl = `${MOODLE_URL}/webservice/pluginfile.php/${file.contextid}/${file.component}/${file.filearea}${file.filepath}${file.filename}?token=${token}`;
        return { ...file, fileurl: fileurl };
      }
      return null;
    } catch (error) {
      console.error("Upload image failed:", error.response?.data || error);
      return null;
    }
  }
}

module.exports = MoodleAPI;
