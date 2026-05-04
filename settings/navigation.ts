export interface ChildrenItem {
  title: string;
  path: string;
  allowedRoles: string[];
}
export interface NavigationItem {
  title: string;
  icon: string;
  path: string;
  children?: ChildrenItem[];
  allowedRoles: string[];
}
export interface MenuChildItem {
  title: string;
  href: string;
  description?: string;
  icon?: string; // Nom de l'icône de lucide-react (optionnel)
}

export interface MenuItem {
  href: string;
  label: string;
  children?: MenuChildItem[];
}

export const adminNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: "material-symbols:dashboard",
    path: "/dashboard",
    allowedRoles: ["USER","ADMIN"],
  },
  {
    title: "Utilisateurs",
    icon: "material-symbols:home-work",
    path: "/dashboard/users",
    allowedRoles: ["USER"],
  },
  {
    title: "Profile",
    icon: "material-symbols:dashboard",
    path: "/dashboard/profile",
    allowedRoles: ["ADMIN", "USER"],
  },
  {
    title: "Projets",
    icon: "material-symbols:dashboard",
    path: "/dashboard/projects",
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Paramètres",
    icon: "material-symbols:settings",
    path: "/settings",
    allowedRoles: ["USER","ADMIN"],
  },
  // {
  //   title: "Pages",
  //   icon: "eos-icons:admin",
  //   path: "#",
  //   children: [
  //     {
  //       title: "Client",
  //       path: "/dashboard/client",
  //       allowedRoles: ["USER","ADMIN"],
  //     },
  //     {
  //       title: "Server",
  //       path: "/dashboard/server",
  //       allowedRoles: ["USER","ADMIN"],
  //     },
  //   ],
  //   allowedRoles: ["USER","ADMIN"],
  // },
];

/** Entrées visibles pour un rôle donné (parents avec sous-menus : enfants filtrés). */
export function filterAdminNavigationByRole(role: string): NavigationItem[] {
  return adminNavigation
    .map((item) => {
      if (!item.allowedRoles.includes(role)) return null;

      if (item.children?.length) {
        const children = item.children.filter((c) =>
          c.allowedRoles.includes(role)
        );
        if (children.length === 0) return null;
        return { ...item, children };
      }

      return item;
    })
    .filter((item): item is NavigationItem => item !== null);
}

export const menuItems: MenuItem[] = [
  { href: "/", label: "Accueil" },
  { 
    href: "/about", 
    label: "A propos",
    children: [
      {
        title: "Youth Connekt Niger",
        href: "/about/Niger",
        description: "Youth Connekt Niger",
        icon: "Info"
      },
      {
        title: "Youth Connekt Sahel",
        href: "/about/Sahel",
        description: "Youth Connekt Sahel",
        icon: "Info"
      },
      {
        title: "Youth Connekt Africa",
        href: "/about/Africa",
        description: "Youth Connekt Africa",
        icon: "Info"
      },
    ]
  },
  { 
    href: "/events", 
    label: "Événements",
    children: [
      {
        title: "Youth Connekt Convention",
        href: "/events/convention",
        description: "Événement annuel de Youth Connekt Niger",
        icon: "Calendar"
      },
      {
        title: "Projets et Programmes",
        href: "/events/projets",
        description: "Projets et programmes en cours",
        icon: "FolderKanban"
      }
    ]
  },
  { href: "/galerie", label: "Galerie" },
  { href: "/news", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];