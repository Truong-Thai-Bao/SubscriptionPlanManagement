const Certification = require("../models/mdl_Certificate");
class CertificateRepository {
  constructor() {
    this.Certification = Certification;
  }

  async getListByUserId(userId) {
    return await this.Certification.findAll({ where: { userId } });
  }
  
  async getById(id) {
    return await this.Certification.findByPk(id);
    }
}
module.exports = new CertificateRepository();