# API Gateway - RBAC + Subscription Middleware Demo

## Tổng quan

Hệ thống gồm 2 service:
- **subscription-service**: Backend chính (port 3001), quản lý role/permission/features
- **api-gateway**: Proxy + RBAC enforce (port 3000), kiểm permission trước khi forward request

---

## 1. Chuẩn bị dữ liệu

### 1.1 Khởi tạo database

Đảm bảo MySQL có database `db_suri_lms_cloud` với schema đã cung cấp.

### 1.2 Seed dữ liệu demo

Chạy SQL này trong MySQL client:

```sql
USE db_suri_lms_cloud;

-- Các role hệ thống
INSERT INTO role (id, name, description, isSystemRole, status) VALUES
(1, 'admin', 'Super administrator - full access', 1, 1),
(2, 'manager', 'Manager - read/write roles and permissions', 1, 1),
(3, 'learner', 'Learner - read only features', 1, 1);

-- Features
INSERT INTO feature (id, name, feature_key, description, value_type, status) VALUES
(1, 'Subscription Management', 'subscription', 'Quản lý subscription', 'boolean', 1),
(2, 'Role Management', 'role_management', 'Quản lý roles', 'boolean', 1),
(3, 'Feature Management', 'feature_management', 'Quản lý features', 'boolean', 1);

-- Permissions
INSERT INTO permission (id, name, description, feature_id, action, status) VALUES
(1, 'roles:read', 'View all roles', 2, 'read', 1),
(2, 'roles:write', 'Create/update/delete roles', 2, 'write', 1),
(3, 'permissions:read', 'View permissions', 2, 'read', 1),
(4, 'features:read', 'View features', 3, 'read', 1),
(5, 'features:write', 'Manage features', 3, 'write', 1),
(6, 'subscription:read', 'View subscription status', 1, 'read', 1);

-- Mapping role -> permissions
INSERT INTO role_permission (role_id, permission_id, status) VALUES
-- Admin có tất cả permissions
(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 1), (1, 5, 1), (1, 6, 1),
-- Manager có quyền đọc/ghi role, đọc permission, đọc feature/subscription
(2, 1, 1), (2, 2, 1), (2, 3, 1), (2, 4, 1), (2, 6, 1),
-- Learner chỉ đọc feature và subscription
(3, 4, 1), (3, 6, 1);

-- Users (password: Abc*12345 đã hash bcrypt)
INSERT INTO user (id, role_id, username, password_hash, email, first_name, last_name, status) VALUES
(1, 1, 'admin@demo.com', '$2b$10$QEgjHY5v//R/n7xYZXf8EeBUMhm.x8bh2LjroDUN3AoGzYzW0p0AS', 'admin@demo.com', 'Admin', 'User', 1),
(2, 2, 'manager@demo.com', '$2b$10$QEgjHY5v//R/n7xYZXf8EeBUMhm.x8bh2LjroDUN3AoGzYzW0p0AS', 'manager@demo.com', 'Manager', 'User', 1),
(3, 3, 'learner@demo.com', '$2b$10$QEgjHY5v//R/n7xYZXf8EeBUMhm.x8bh2LjroDUN3AoGzYzW0p0AS', 'learner@demo.com', 'Learner', 'User', 1);

-- Subscription tables (optional - để demo subscription middleware)
INSERT INTO tenant (guid, name, status, is_enable) VALUES (UUID(), 'Demo Tenant', 'trial', 1);
INSERT INTO subscription_state (id, name, description) VALUES 
(1, 'active', 'Active'),
(2, 'suspended', 'Suspended'),
(3, 'expired', 'Expired');
INSERT INTO subscription_policy (max_days, max_users, max_storage, max_courses, ai_tokens, grace_period) 
VALUES (30, 100, 50, 20, 500, 7);
INSERT INTO subscription_plan (name, user_type, payment_term, feature_id, subscription_policy_id, price, currency, status) 
VALUES ('Basic Plan', 'b2b', 'monthly', 1, 1, 100000, 'VND', 1);
INSERT INTO subscription_log (log_entry, category, entity, user_id) VALUES 
('Create subscription', 'setup', 'subscription', 1);
INSERT INTO subscription (type, subscription_plan_id, tenant_id, subscription_state_id, user_id, subscription_log_id, start_date, end_date, auto_renew) 
VALUES ('standard', 1, 1, 1, 1, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1);
```

---

## 2. Khởi chạy service

### 2.1 Subscription-service (port 3001)

```bash
cd d:/suritech/subscription-service
npm start
```

Kiểm tra: `http://localhost:3001/`

### 2.2 API Gateway (port 3000)

```bash
cd d:/suritech/api-gateway
npm start
```

Kiểm tra: `http://localhost:3000/api/health` → status 200 OK

---

## 3. Kiến trúc RBAC tại API Gateway

### Middleware Pipeline

1. **jwtMiddleware** (`src/middleware/jwtMiddleware.js`)
   - Parse JWT từ header `Authorization: Bearer <token>`
   - Extract `user_id` và `role_id` từ payload
   - Set `req.user = { user_id, role }`
   - Public routes (auth login/register, health) skip JWT check

2. **subscriptionMiddleware** (`src/middleware/authMiddleware.js`)
   - Check path starts with `/subscriptions`
   - Validate `req.user.subscription_status` hoặc header `x-subscription-status`
   - Nếu = `suspended|expire|expired` → 403 Forbidden

3. **authorizeRoles** (`src/middleware/authMiddleware.js`)
   - Match route pattern (`path` + `method`) với `routePermissionMap`
   - Kiểm `rolePermissionMap[req.user.role]` có permission không
   - Nếu không → 403 Forbidden

4. **proxyRoutes** (`src/routes/proxyRoutes.js`)
   - Forward request sang subscription-service (hoặc lms/community)
   - Loại bỏ prefix đúng: `/api/subscriptions` → `/api/...`

---

## 4. Cách sử dụng - Demo RBAC

### 4.1 Login lấy JWT token

**Request:**
```
POST http://localhost:3000/api/subscriptions/api/auth/login
Content-Type: application/json

{
  "loginInput": "admin@demo.com",
  "password": "Abc*12345"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Login Successfully",
  "isSuccess": true,
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin@demo.com",
      "email": "admin@demo.com",
      "role_id": 1
    }
  }
}
```

Lưu token để dùng cho request tiếp theo.

### 4.2 Test RBAC với Admin (role_id=1)

**Admin có tất cả quyền (roles:read, roles:write, ...)**

#### Get roles (admin pass ✅)
```
GET http://localhost:3000/api/subscriptions/api/roles
Authorization: Bearer <token_admin>
```
→ Status `200 OK`

#### Create role (admin pass ✅)
```
POST http://localhost:3000/api/subscriptions/api/roles
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "name": "test_role",
  "description": "Test role"
}
```
→ Status `200/201 OK`

#### Delete role (admin pass ✅)
```
DELETE http://localhost:3000/api/subscriptions/api/roles/4
Authorization: Bearer <token_admin>
```
→ Status `200 OK` - Admin có quyền `roles:write` (bao gồm DELETE)

Hoặc với body (nếu backend yêu cầu):
```
DELETE http://localhost:3000/api/subscriptions/api/roles
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "id": 4
}
```
→ Status `200 OK`

### 4.3 Test RBAC với Manager (role_id=2)

**Manager có: roles:read, permissions:read, features:read, subscription:read (READ ONLY - không có WRITE)**

#### Get roles (manager pass ✅)
```
GET http://localhost:3000/api/subscriptions/api/roles
Authorization: Bearer <token_manager>
```
→ Status `200 OK`

#### Create role (manager blocked ❌)
```
POST http://localhost:3000/api/subscriptions/api/roles
Authorization: Bearer <token_manager>
Content-Type: application/json

{
  "name": "test_role_by_manager",
  "description": "Try to create role as manager"
}
```
→ Status `403 Forbidden` - Manager không có quyền `roles:write`

#### Get permissions (manager pass ✅)
```
GET http://localhost:3000/api/subscriptions/api/permissions
Authorization: Bearer <token_manager>
```
→ Status `200 OK`

#### Create permission (manager blocked ❌)
```
POST http://localhost:3000/api/subscriptions/api/permissions
Authorization: Bearer <token_manager>
Content-Type: application/json

{
  "name": "custom:permission",
  "description": "Try to create permission as manager"
}
```
→ Status `403 Forbidden` - Manager không có quyền `permissions:write`

#### Delete role (manager blocked ❌)
```
DELETE http://localhost:3000/api/subscriptions/api/roles/4
Authorization: Bearer <token_manager>
```
→ Status `403 Forbidden` - Manager không có quyền `roles:write` (bao gồm DELETE)

#### Get features (manager pass ✅)
```
GET http://localhost:3000/api/subscriptions/api/features
Authorization: Bearer <token_manager>
```
→ Status `200 OK`

### 4.4 Test RBAC với Learner (role_id=3)

**Learner có: features:read, subscription:read**

#### Get features (learner pass ✅)
```
GET http://localhost:3000/api/subscriptions/api/features
Authorization: Bearer <token_learner>
```
→ Status `200 OK`

#### Create role (learner blocked ❌)
```
POST http://localhost:3000/api/subscriptions/api/roles
Authorization: Bearer <token_learner>
Content-Type: application/json

{
  "name": "bad_role"
}
```
→ Status `403 Forbidden` - insufficient permission

#### Get roles (learner blocked ❌)
```
GET http://localhost:3000/api/subscriptions/api/roles
Authorization: Bearer <token_learner>
```
→ Status `403 Forbidden` - insufficient permission

#### Delete role (learner blocked ❌)
```
DELETE http://localhost:3000/api/subscriptions/api/roles/4
Authorization: Bearer <token_learner>
```
→ Status `403 Forbidden` - Learner không có quyền `roles:write`

---

## 5. Test Subscription Middleware

Mô phỏng subscription bị suspended/expired → access denied

### Test với header x-subscription-status

```
GET http://localhost:3000/api/subscriptions/api/features
Authorization: Bearer <token_any>
x-subscription-status: suspended
```

→ Status `403 Forbidden` - Subscription state invalid

```
GET http://localhost:3000/api/subscriptions/api/features
Authorization: Bearer <token_any>
x-subscription-status: active
```

→ Status `200 OK` - pass

---


## 6. So sánh Admin vs Manager

| Tính năng | Admin | Manager | Learner |
|----------|--------|---------|---------|
| GET /roles | ✅ | ✅ | ❌ |
| POST/PUT/DELETE /roles | ✅ | ❌ | ❌ |
| GET /permissions | ✅ | ✅ | ❌ |
| POST/PUT/DELETE /permissions | ✅ | ❌ | ❌ |
| GET /features | ✅ | ✅ | ✅ |
| POST/PUT/DELETE /features | ✅ | ❌ | ❌ |
| GET /subscription | ✅ | ✅ | ✅ |

**Kết luận:**
- **Admin**: Có quyền WRITE tất cả (tạo/cập nhật/xóa roles, permissions, features)
- **Manager**: Chỉ READ roles, permissions, features, subscription (không được tạo/sửa/xóa)
- **Learner**: Chỉ READ features và subscription status

---

## 7. Troubleshooting

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-----------|---------|
| 404 after login | Route path không match routeMap | Check `req.originalUrl` trong logs |
| 401 Unauthorized | Token hết hạn hoặc header sai | `Authorization: Bearer <token>` (space bắt buộc) |
| 403 Forbidden | Insufficient permission | Check role_id và `rolePermissionMap` |
| 403 Subscription denied | Status = suspended/expire/expired | Pass header `x-subscription-status: active` |
| Cannot reach backend | subscription-service down | `npm start` ở port 3001 |

---

## 9. Chuyên sâu - Mở rộng RBAC

Hiện tại permission map là hardcode. Để dynamic load từ DB:

1. Build `api-gateway/src/services/permissionService.js`
2. Gọi API `http://localhost:3001/api/roles` + `http://localhost:3001/api/permissions` on startup
3. Cache permission map với TTL (e.g., 5 phút refresh)
4. Modify `authorizeRoles` để dùng cache thay hardcode

---

## 10. Files quan trọng

- `src/middleware/authMiddleware.js` - RBAC + subscription check
- `src/middleware/jwtMiddleware.js` - JWT parse & user context
- `src/routes/proxyRoutes.js` - Route matching
- `src/services/proxyService.js` - Forward request + prefix strip
- `.env` - Config port + JWT_SECRET + service URLs

---

## 11. Summary

✅ **Đã triển khai:**
- RBAC tại gateway layer
- Subscription state check
- JWT validate
- Proxy forward chính xác

✅ **Không thay đổi:**
- subscription-service code (chỉ add seed data)
- DB schema (dùng schema đã cung cấp)

✅ **Ready to demo:**
- 3 users (admin/manager/learner) đã seed
- All routes tested
- Error handling + logging ready

