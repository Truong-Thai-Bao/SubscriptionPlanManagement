class CertificateService {
    async getById(id) {
        return await certificationFactory.getById(id);
    }
    async getListByUserId(userId) {
        return await certificationFactory.getListByUserId(userId);
    }
}