/**
 * @description Centralized Enum definitions for the entire application
 */
//in subscription plan table 
const PAYMENT_TERM = Object.freeze({
    YEARLY : 'yearly',
    MONTHLY :"monthly",
    QUARTERLY:"quarterly",
    PAY_PER_USE:"pay per user"
});

const USER_TYPE = Object.freeze({
    B2B: 'b2b',
    B2C: 'b2c',
    INTERNAL: 'internal'
});

const CURRENCY = Object.freeze({
    VND: 'VND',
    USD: 'USD'
})

// enum in tenant table
const TENANT_STATUS = Object.freeze({
    TRIAL : 'trial',
    SUSPENDED :'suspended',
    EXPIRE : 'expire'
})


// enum in gender table
const GENDER = Object.freeze({
    MALE:'male',
    FEMALE : "female",
    OTHER : 'other'
})

//enum for sub state
const SUBSCRIPTION_STATE = Object.freeze({
    TRIAL : 'Trial',
    ACTIVE : 'Active',
    GRACE_PERIOD : 'Grace period', 
    EXPIRED : 'Expired',
    CANCELLED : 'Cancelled',
    SUSPENDED : 'Suspended'
});

//enum for status of tenant user
const TENANT_USER_STATUS = Object.freeze({
    ACTIVE:'active',
    INACTIVE:"inactive",
    BANNED:"banned"
})

module.exports = {
    PAYMENT_TERM,
    CURRENCY,
    TENANT_USER_STATUS,
    USER_TYPE,
    SUBSCRIPTION_STATE,
    TENANT_STATUS,
    GENDER
}

