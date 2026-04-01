const BaseRepository = require('./BaseRepository');
const ErrorLog  = require('../models/ErrorLog.js');

class ErrorLogRepository extends BaseRepository {
    constructor() {
        super(ErrorLog);
    }
}

module.exports = new ErrorLogRepository();