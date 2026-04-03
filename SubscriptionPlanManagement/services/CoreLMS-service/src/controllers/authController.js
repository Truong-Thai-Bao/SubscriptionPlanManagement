const ChangePasswordDTO = require('../dtos/changePasswordDto');
const authService = require('../services/authService');

exports.changePassword = async (req, res) => {
  try {
    const dto = new ChangePasswordDTO(req.body);
    const result = await authService.changePassword(dto);

    if (result.success) {
      res.json({ status: 'success', message: 'Password changed successfully' });
    } else {
      res.status(400).json({ status: 'error', message: result.message });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
