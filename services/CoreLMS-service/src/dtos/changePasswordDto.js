class ChangePasswordDTO {
  constructor({ username, oldPassword, newPassword }) {
    this.username = username;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}

module.exports = ChangePasswordDTO;
