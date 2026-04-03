import swaggerAutogen from "swagger-autogen";
import fs from "fs";

const doc = {
  info: {
    title: "API Gateway",
    description: "API Gateway Documentation",
  },
  host: "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Nhap token theo dinh dang: Bearer <JWT_TOKEN>",
    },
  },
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.js", "../subscription-service/src/app.js"];

const subscriptionServicePaths = [
  "/api/auth",
  "/api/roles",
  "/api/permissions",
  "/api/features",
  "/api/role-permissions",
  "/api/moodle",
  "/api/categories",
];

const serviceCatalog = [
  {
    tag: "Gateway Health",
    description: "Trang thai va kha nang song cua API Gateway.",
    prefixes: ["/api/health", "/health"],
    resource: "health check",
  },
  {
    tag: "Subscription Auth Service",
    description: "Dang ky, dang nhap, OTP va xac thuc tai khoan.",
    prefixes: ["/api/subscriptions/api/auth", "/subscriptions/api/auth"],
    resource: "auth",
  },
  {
    tag: "Subscription Roles Service",
    description: "CRUD vai tro (roles) cho he thong subscription.",
    prefixes: ["/api/subscriptions/api/roles", "/subscriptions/api/roles"],
    resource: "role",
  },
  {
    tag: "Subscription Permissions Service",
    description: "CRUD quyen (permissions) cho he thong subscription.",
    prefixes: ["/api/subscriptions/api/permissions", "/subscriptions/api/permissions"],
    resource: "permission",
  },
  {
    tag: "Subscription Features Service",
    description: "CRUD feature va danh sach feature dang active.",
    prefixes: ["/api/subscriptions/api/features", "/subscriptions/api/features"],
    resource: "feature",
  },
  {
    tag: "Subscription Role-Permissions Service",
    description: "CRUD mapping giua role va permission.",
    prefixes: ["/api/subscriptions/api/role-permissions", "/subscriptions/api/role-permissions"],
    resource: "role permission",
  },
  {
    tag: "Subscription Moodle Service",
    description: "Endpoint tich hop Moodle user va token.",
    prefixes: ["/api/subscriptions/api/moodle", "/subscriptions/api/moodle"],
    resource: "moodle",
  },
  {
    tag: "Subscription Categories Service",
    description: "CRUD category trong subscription service.",
    prefixes: ["/api/subscriptions/api/categories", "/subscriptions/api/categories"],
    resource: "category",
  },
];

const operationText = (method, path, resource) => {
  if (path.endsWith("/active")) {
    return {
      summary: `Get active ${resource}s`,
      description: `Lấy danh sách ${resource} đang active.`,
    };
  }
  if (path.endsWith("/all")) {
    return {
      summary: `Get all ${resource}s`,
      description: `Lấy toàn bộ danh sách ${resource}.`,
    };
  }
  if (path.includes("/login")) {
    return {
      summary: "Login",
      description: "Đăng nhập để nhận JWT token.",
    };
  }
  if (path.includes("/register")) {
    return {
      summary: "Register",
      description: "Đăng ký tài khoản mới.",
    };
  }
  if (path.includes("/send-otp")) {
    return {
      summary: "Send OTP",
      description: "Gửi mã OTP tới email/kênh xác thực.",
    };
  }
  if (path.includes("/verify-otp")) {
    return {
      summary: "Verify OTP",
      description: "Xác thực mã OTP.",
    };
  }
  if (path.includes("/moodle-user")) {
    return {
      summary: "Create Moodle user",
      description: "Tạo người dùng Moodle.",
    };
  }
  if (path.includes("/moodle-token")) {
    return {
      summary: "Generate Moodle token",
      description: "Tạo token cho Moodle.",
    };
  }

  const isItem = path.includes("{id}");
  if (method === "get" && !isItem) {
    return {
      summary: `List ${resource}s`,
      description: `Lấy danh sách ${resource}.`,
    };
  }
  if (method === "get" && isItem) {
    return {
      summary: `Get ${resource} detail`,
      description: `Lấy chi tiết ${resource} theo id.`,
    };
  }
  if (method === "post") {
    return {
      summary: `Create ${resource}`,
      description: `Tạo mới ${resource}.`,
    };
  }
  if (method === "put" || method === "patch") {
    return {
      summary: `Update ${resource}`,
      description: `Cập nhật ${resource}.`,
    };
  }
  if (method === "delete") {
    return {
      summary: `Delete ${resource}`,
      description: `Xóa ${resource}.`,
    };
  }

  return {
    summary: `${method.toUpperCase()} ${resource}`,
    description: `Thao tác ${method.toUpperCase()} cho ${resource}.`,
  };
};

const findServiceByPath = (path) =>
  serviceCatalog.find((service) =>
    service.prefixes.some((prefix) => path.startsWith(prefix)),
  );

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  const swagger = JSON.parse(fs.readFileSync(outputFile, "utf8"));
  const paths = swagger.paths || {};
  const nextPaths = {};

  for (const [path, value] of Object.entries(paths)) {
    if (path === "/test" || path === "/") {
      continue;
    }

    const matchedPrefix = subscriptionServicePaths.find((prefix) =>
      path.startsWith(prefix),
    );

    if (matchedPrefix) {
      nextPaths[`/api/subscriptions${path}`] = value;
      continue;
    }

    nextPaths[path] = value;
  }

  swagger.tags = serviceCatalog.map(({ tag, description }) => ({
    name: tag,
    description,
  }));

  for (const [path, pathObj] of Object.entries(nextPaths)) {
    const service = findServiceByPath(path);
    const isAuthEndpoint =
      path.includes("/api/subscriptions/api/auth/") ||
      path.includes("/subscriptions/api/auth/");
    const isHealthEndpoint =
      path.startsWith("/api/health") || path.startsWith("/health");
    const isPublicEndpoint = isAuthEndpoint || isHealthEndpoint;

    for (const [method, methodObj] of Object.entries(pathObj)) {
      const isObjectMethod = typeof methodObj === "object" && methodObj !== null;
      if (!isObjectMethod) {
        continue;
      }

      if (service) {
        methodObj.tags = [service.tag];
      }

      const text = operationText(method, path, service?.resource || "endpoint");
      methodObj.summary = text.summary;
      methodObj.description = text.description;

      if (!isPublicEndpoint) {
        methodObj.security = [{ BearerAuth: [] }];
      }
    }
  }

  swagger.paths = nextPaths;
  fs.writeFileSync(outputFile, JSON.stringify(swagger, null, 2));
});
