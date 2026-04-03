const axios = require('axios');
const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

class UserRepository {
  async getUserByUsername(username) {
    const resp = await axios.post(`${MOODLE_URL}/webservice/rest/server.php`, null, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: 'core_user_get_users_by_field',
        moodlewsrestformat: 'json',
        field: 'username',
        values: [username]
      }
    });
    return resp.data[0];
  }

  async verifyPassword(username, password) {
    try {
      await axios.post(`${MOODLE_URL}/login/token.php`, null, {
        params: {
          username,
          password,
          service: 'moodle_mobile_app'
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  async updatePassword(userId, newPassword) {
    await axios.post(`${MOODLE_URL}/webservice/rest/server.php`, null, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: 'core_user_update_users',
        moodlewsrestformat: 'json',
        users: JSON.stringify([{ id: userId, password: newPassword }])
      }
    });
    return true;
  }
}

module.exports = new UserRepository();
