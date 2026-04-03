import { AppError } from './errorHandler.js';

const rolePermissionMap = {
  1: ['*'], // admin (superuser)
  2: ['roles:read','permissions:read','features:read','subscription:read'], // manager - read only
  3: ['features:read','subscription:read'], // learner
};

const routePermissionMap = [
  { path: '/subscriptions/api/roles', permission: 'roles:read', method: 'GET' },
  { path: '/subscriptions/api/roles', permission: 'roles:write', method: ['POST','PUT','DELETE'] },

  { path: '/subscriptions/api/permissions', permission: 'permissions:read', method: 'GET' },
  { path: '/subscriptions/api/permissions', permission: 'permissions:write', method: ['POST','PUT','DELETE'] },

  { path: '/subscriptions/api/features', permission: 'features:read', method: 'GET' },
  { path: '/subscriptions/api/features', permission: 'features:write', method: ['POST','PUT','DELETE'] },

  { path: '/subscriptions/api/auth', permission: 'auth:read', method: ['GET','POST'] },
];

const resolvePermissions = (path, method) => {
  let normalizedPath = path.startsWith('/api') ? path.slice(4) : path;
  normalizedPath = normalizedPath.toLowerCase().replace(/\/?$/, '');
  console.log(`[resolvePermissions] Original path: '${path}', Normalized: '${normalizedPath}', Method: '${method}'`);
  
  for (const entry of routePermissionMap) {
    const route = entry.path.toLowerCase().replace(/\/?$/, '');
    const methods = Array.isArray(entry.method) ? entry.method : [entry.method];
    
    if (normalizedPath.startsWith(route) && methods.includes(method.toUpperCase())) {
      console.log(`[resolvePermissions] MATCHED - route: '${route}', permission: '${entry.permission}'`);
      return entry.permission;
    }
  }
  console.log(`[resolvePermissions] NO MATCH found`);
  return null;
};

const hasPermission = (roleId, requiredPermission) => {
  const perms = rolePermissionMap[roleId] || [];
  if (perms.includes('*')) return true;
  return perms.includes(requiredPermission);
};

const authorizeRoles = (req, res, next) => {
  if (!req.user) {
    console.log(`[AuthMiddleware] No req.user for path: ${req.path}`);
    return next();
  }

  const requiredPermission = resolvePermissions(req.path, req.method);
  console.log(`[AuthMiddleware] Path: ${req.path}, Method: ${req.method}, RequiredPermission: ${requiredPermission}, UserRole: ${req.user.role}`);
  
  if (!requiredPermission) {
    console.log(`[AuthMiddleware] No permission required for this route, allowing access`);
    return next();
  }

  const hasAuth = hasPermission(req.user.role, requiredPermission);
  console.log(`[AuthMiddleware] User has '${requiredPermission}': ${hasAuth}`);
  
  if (!hasAuth) {
    console.log(`[AuthMiddleware] BLOCKING - User role ${req.user.role} missing permission '${requiredPermission}'`);
    return next(new AppError(403, 'Forbidden: insufficient role permission'));
  }

  console.log(`[AuthMiddleware] ALLOWING - User role ${req.user.role} has permission '${requiredPermission}'`);
  next();
};

const subscriptionMiddleware = (req, res, next) => {
  if (!req.path.startsWith('/subscriptions')) {
    return next();
  }

  const status = req.user?.subscription_status || req.headers['x-subscription-status'] || 'active';
  if (['suspended', 'expire', 'expired'].includes(status)) {
    return next(new AppError(403, 'Forbidden: subscription state invalid'));
  }
  next();
};

export { authorizeRoles, subscriptionMiddleware, rolePermissionMap, routePermissionMap };
