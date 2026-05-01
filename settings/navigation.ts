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
    title: "Blogs",
    icon: "material-symbols:home-work",
    path: "/blogs",
    allowedRoles: ["USER","ADMIN"],
  },
  {
    title: "Test",
    icon: "material-symbols:dashboard",
    path: "/test",
    allowedRoles: ["ADMIN", "USER"],
  },
  {
    title: "Paramètres",
    icon: "material-symbols:settings",
    path: "/dashboard/settings",
    allowedRoles: ["USER","ADMIN"],
  },
  {
    title: "Pages",
    icon: "eos-icons:admin",
    path: "#",
    children: [
      {
        title: "Client",
        path: "/dashboard/client",
        allowedRoles: ["USER","ADMIN"],
      },
      {
        title: "Server",
        path: "/dashboard/server",
        allowedRoles: ["USER","ADMIN"],
      },
    ],
    allowedRoles: ["USER","ADMIN"],
  },
];


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