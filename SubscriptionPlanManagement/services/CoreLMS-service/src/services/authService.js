const userRepository = require('../repositories/userRepository');

exports.changePassword = async (dto) => {
  try {
    console.log('DTO received:', dto);

  const user = await userRepository.getUserByUsername(dto.username);
  if (!user) return { success: false, message: 'User not found' };

  const valid = await userRepository.verifyPassword(dto.username, dto.oldPassword);
  if (!valid) return { success: false, message: 'Old password incorrect' };

  await userRepository.updatePassword(user.id, dto.newPassword);
  return { success: true };
  } catch (err) {
    console.error('ChangePassword error:', err); 
    return { success: false, message: err.message || 'Unexpected error occurred' };
  }
};
