/**
 * @class Policy Repository
 * @description This class for managing db operations related to Policy table
 */
const subscriptionPolicy = require('../models/SubscriptionPolicy');
const BaseRepository = require('./BaseRepository.js');

class PolicyRepository extends BaseRepository {
    constructor(){
        super(subscriptionPolicy);
    }
}

module.exports = new PolicyRepository();
