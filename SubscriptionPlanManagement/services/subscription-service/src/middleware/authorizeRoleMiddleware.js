
const authorizeRoleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // req.user has created from prev authMiddleware
        const userRole = req.user?.role;

        // If role not in allowroles
        if (!userRole || !allowedRoles.includes(userRole)) {
            const error = new Error('auth.forbidden_role');
            error.statusCode = 403;
            return next(error); // throw to  errorHandler 
        }
        //else next()
        next();
    };
};

module.exports = authorizeRoleMiddleware;