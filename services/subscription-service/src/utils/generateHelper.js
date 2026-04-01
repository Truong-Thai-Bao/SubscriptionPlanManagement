const tenantUserRepo = require("../repositories/tenantUserRepo");

/**
 * Func to gerate unique user id 
 * @param {string} lastName 
 * @returns {Promise<string>} User ID char (Ex: ngu83721)
 */
const generateUniqueUserId = async (lastName) => {
    // Normalization
    // Ex: "Nguyễn" -> "nguyen"
    const normalizedName = lastName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Clear diacritical mark 
        .replace(/đ/g, "d").replace(/Đ/g, "D") // Handle Đ
        .replace(/[^a-z0-9]/gi, '') // Clear special char and white space
        .toLowerCase();

    // Get 3 first char to do prefix
    const prefix = normalizedName.substring(0, 3);

    let isUnique = false;
    let uniqueUserId = '';

    // Loop to check unique in db
    while (!isUnique) {
        // Generate random numbers (from 10000 to 99999)
        const randomNumbers = Math.floor(10000 + Math.random() * 90000);

        // Concat to string (Ex: ngu14582)
        uniqueUserId = `${prefix}${randomNumbers}`;

        // Check unique in db
        const existingUser = await tenantUserRepo.model.findOne({
            where: { user_id: uniqueUserId },
            attributes: ['id'] // Just get id column
        });

        // If not existing, break loop
        if (!existingUser) {
            isUnique = true;
        }
    }

    return uniqueUserId;
};



/**
 * Func to auto generate password
 * @param {number} length - of pass (default = 8)
 * @returns {string} 
 */
const generateRandomPassword = (length = 8) => {
    const charset = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789oO0lI1";
    let password = "";
    //get char by random index in charset variable
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};


module.exports = { generateUniqueUserId,generateRandomPassword };