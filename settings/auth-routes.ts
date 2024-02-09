// auth-routes.js
export const authRoutes = [
    {
      path: '/dashboard',
      allowedRoles: ["ADMIN","ORGANIZER"],
    },
    {
      path: '/dashboard/create-event',
      allowedRoles: ["ADMIN","ORGANIZER"],
    },
    {
      path: '/dashboard/categories',
      allowedRoles: ["ADMIN",],
    },
    {
      path: '/dashboard/managers',
      allowedRoles: ["ADMIN",],
    },
    {
      path: '/dashboard/events',
      allowedRoles: ["ORGANIZER"],
    },
    // Ajoutez d'autres routes au besoin
  ];
  