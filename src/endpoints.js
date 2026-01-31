export const ENDPOINT = {
  auth: {
    register: { method: "POST", path: "/auth/register" },
    login: { method: "POST", path: "/auth/login" },
  },
  boards: {
    list: { method: "GET", path: "/boards" },
    get: { method: "GET", path: "/boards/:id" },
    create: { method: "POST", path: "/boards" },
    update: { method: "PUT", path: "/boards/:id" },
    delete: { method: "DELETE", path: "/boards/:id" },
  },
  lists: {
    list: { method: "GET", path: "/lists" },
    get: { method: "GET", path: "/lists/:id" },
    create: { method: "POST", path: "/lists" },
    update: { method: "PUT", path: "/lists/:id" },
    delete: { method: "DELETE", path: "/lists/:id" },
  },
  cards: {
    get: { method: "GET", path: "/cards/:id" },
    create: { method: "POST", path: "/cards" },
    update: { method: "PUT", path: "/cards/:id" },
    delete: { method: "DELETE", path: "/cards/:id" },
  },
  kpis: {
    list: { method: "GET", path: "/kpis" },
    get: { method: "GET", path: "/kpis/:id" },
    create: { method: "POST", path: "/kpis" },
    update: { method: "PUT", path: "/kpis/:id" },
    delete: { method: "DELETE", path: "/kpis/:id" },
  },
};
