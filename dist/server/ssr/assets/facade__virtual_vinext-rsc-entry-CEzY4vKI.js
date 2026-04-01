import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React$1__default, { useContext, createContext, forwardRef, createElement, useState, useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "//lib/stores/authStore";
import { useClientsStore } from "//lib/stores/clientsStore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "//components/ui/Card";
import { Button } from "//components/ui/Button";
import { Badge } from "//components/ui/Badge";
import { Input } from "//components/ui/Input";
import { Modal } from "//components/ui/Modal";
import { u as useRouter, a as usePathname, g as getLayoutSegmentContext } from "../index.js";
import { Sidebar } from "//components/Sidebar";
import { Topbar } from "//components/Topbar";
import { getBrandingForClient, getDefaultBranding } from "//lib/config/tenantBranding";
import { useUsersStore } from "//lib/stores/usersStore";
import { useAutomationFlowStore } from "//lib/stores/automationFlowStore";
import { FlowCanvas } from "//components/automation/FlowCanvas";
import { useLeadsStore } from "//lib/stores/leadsStore";
import { ChannelBadge } from "//components/ChannelBadge";
import { formatRelativeTime } from "//lib/utils";
import { useConnectionsStore } from "//lib/stores/connectionsStore";
import { WhatsAppIcon } from "//components/WhatsAppIcon";
import { useConversationsStore } from "//lib/stores/conversationsStore";
import { LeadCard } from "//components/LeadCard";
import { usePipelineStore } from "//lib/stores/pipelineStore";
import { PIPELINE_COLOR_PALETTE } from "//src/domain/pipeline/constants";
import { PipelineService } from "//src/application/pipeline/PipelineService";
import { ZustandPipelineRepository } from "//src/infrastructure/repositories/zustand/ZustandPipelineRepository";
import { ZustandLeadRepository } from "//src/infrastructure/repositories/zustand/ZustandLeadRepository";
import { useTagsStore } from "//lib/stores/tagsStore";
import "../__vite_rsc_assets_manifest.js";
import "node:async_hooks";
import "react-dom/server.edge";
import "react-dom";
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const LucideContext = createContext({});
const useLucideContext = () => useContext(LucideContext);
const Icon = forwardRef(
  ({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = useLucideContext() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size ?? contextSize ?? defaultAttributes.width,
        height: size ?? contextSize ?? defaultAttributes.height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: mergeClasses("lucide", contextClass, className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$r = [
  ["path", { d: "M10 12h4", key: "a56b0p" }],
  ["path", { d: "M10 8h4", key: "1sr2af" }],
  ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3", key: "1rgiei" }],
  [
    "path",
    {
      d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
      key: "secmi2"
    }
  ],
  ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16", key: "16ra0t" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$r);
const __iconNode$q = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$q);
const __iconNode$p = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$p);
const __iconNode$o = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$o);
const __iconNode$n = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$n);
const __iconNode$m = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$m);
function AdminClientsPage() {
  const { selectClient } = useAuthStore();
  const { clients, addClient, updateClient } = useClientsStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    active: true
  });
  const handleViewClient = (clientId) => {
    const selectedClient = clients.find((c) => c.id === clientId);
    if (selectedClient) {
      selectClient(clientId, clients);
      router.push("/dashboard/inbox");
    }
  };
  const handleOpenModal = (client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        active: client.active
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        active: true
      });
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({
      name: "",
      active: true
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient({
        name: formData.name,
        active: formData.active
      });
    }
    handleCloseModal();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Clientes" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gerencie todos os clientes da NO PONTO" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => handleOpenModal(), children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Novo Cliente"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: clients.map((client) => /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(Building2, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: client.name }),
            /* @__PURE__ */ jsx(Badge, { variant: client.active ? "success" : "default", className: "mt-1", children: client.active ? "Ativo" : "Inativo" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => handleOpenModal(client),
            children: /* @__PURE__ */ jsx(Pen, { className: "h-4 w-4" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Usuários" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: client.userCount })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: "Leads" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: client.leadCount })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Criado em: ",
          new Date(client.createdAt).toLocaleDateString("pt-BR")
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "w-full",
            onClick: () => handleViewClient(client.id),
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
              "Acessar CRM"
            ]
          }
        )
      ] })
    ] }, client.id)) }),
    clients.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Nenhum cliente cadastrado" }) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: handleCloseModal,
        title: editingClient ? "Editar Cliente" : "Novo Cliente",
        size: "md",
        children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "text-sm font-medium", children: "Nome do Cliente *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                placeholder: "Nome da empresa",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "active",
                checked: formData.active,
                onChange: (e) => setFormData({ ...formData, active: e.target.checked }),
                className: "h-4 w-4 rounded border-gray-300"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "active", className: "text-sm font-medium cursor-pointer", children: "Cliente ativo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-4 border-t", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: handleCloseModal, children: "Cancelar" }),
            /* @__PURE__ */ jsx(Button, { type: "submit", children: editingClient ? "Salvar Alterações" : "Criar Cliente" })
          ] })
        ] })
      }
    )
  ] });
}
function AdminLayout({
  children
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "owner") {
      if (!isAuthenticated) {
        router.push("/");
      } else {
        router.push("/dashboard/inbox");
      }
    }
  }, [isAuthenticated, user, router]);
  if (!isAuthenticated || user?.role !== "owner") {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx(Sidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx(Topbar, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto bg-background p-6", children })
    ] })
  ] });
}
const __iconNode$l = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$l);
function AdminMetricsPage() {
  const { clients } = useClientsStore();
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.active).length;
  const totalUsers = clients.reduce((sum, c) => sum + c.userCount, 0);
  const totalLeads = clients.reduce((sum, c) => sum + c.leadCount, 0);
  const avgLeadsPerClient = totalClients > 0 ? Math.round(totalLeads / totalClients) : 0;
  const metrics = [
    {
      title: "Total de Clientes",
      value: totalClients,
      icon: Building2,
      change: "+2",
      trend: "up"
    },
    {
      title: "Clientes Ativos",
      value: activeClients,
      icon: Activity,
      change: "+1",
      trend: "up"
    },
    {
      title: "Total de Usuários",
      value: totalUsers,
      icon: Users,
      change: "+5",
      trend: "up"
    },
    {
      title: "Total de Leads",
      value: totalLeads,
      icon: TrendingUp,
      change: "+127",
      trend: "up"
    }
  ];
  const clientRanking = [...clients].sort((a, b) => b.leadCount - a.leadCount).slice(0, 5);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Métricas Gerais" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Visão geral de todos os clientes da NO PONTO" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: metrics.map((metric) => {
      const Icon2 = metric.icon;
      return /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: metric.title }),
          /* @__PURE__ */ jsx(Icon2, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: metric.value }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-600", children: metric.change }),
            " vs mês anterior"
          ] })
        ] })
      ] }, metric.title);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Ranking de Clientes" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: clientRanking.map((client, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold", children: index + 1 }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: client.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                client.userCount,
                " usuários"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: client.leadCount }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "leads" })
          ] })
        ] }, client.id)) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Distribuição de Leads" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: clients.map((client) => {
          const percentage = totalLeads > 0 ? client.leadCount / totalLeads * 100 : 0;
          return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: client.name }),
              /* @__PURE__ */ jsxs("span", { children: [
                client.leadCount,
                " leads"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-primary transition-all",
                style: { width: `${percentage}%` }
              }
            ) })
          ] }, client.id);
        }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Estatísticas Gerais" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Média de Leads por Cliente" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: avgLeadsPerClient })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Taxa de Clientes Ativos" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold", children: [
            totalClients > 0 ? Math.round(activeClients / totalClients * 100) : 0,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Média de Usuários por Cliente" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: totalClients > 0 ? Math.round(totalUsers / totalClients) : 0 })
        ] })
      ] }) })
    ] })
  ] });
}
function AdminSettingsPage() {
  const { user, client } = useAuthStore();
  const branding = getBrandingForClient(client);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Configurações" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
        "Configurações gerais da ",
        branding.companyName
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Perfil" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Atualize suas informações pessoais" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Nome" }),
            /* @__PURE__ */ jsx(Input, { defaultValue: user?.name || "" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Email" }),
            /* @__PURE__ */ jsx(Input, { type: "email", defaultValue: user?.email || "" })
          ] }),
          /* @__PURE__ */ jsx(Button, { children: "Salvar Alterações" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { children: [
            "Empresa ",
            branding.companyName
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Informações da agência" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Nome da Empresa" }),
            /* @__PURE__ */ jsx(Input, { defaultValue: branding.companyName })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "CNPJ" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "00.000.000/0000-00" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Telefone" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "(11) 99999-9999" })
          ] }),
          /* @__PURE__ */ jsx(Button, { children: "Salvar Alterações" })
        ] })
      ] })
    ] })
  ] });
}
const __iconNode$k = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$k);
const __iconNode$j = [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
];
const Power = createLucideIcon("power", __iconNode$j);
const __iconNode$i = [
  ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15", key: "dxknvb" }],
  ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68", key: "1x7qb5" }],
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const PowerOff = createLucideIcon("power-off", __iconNode$i);
function AdminUsersPage() {
  const { clients } = useClientsStore();
  const { users, addUser, updateUser, toggleUserActive } = useUsersStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    clientId: "",
    active: true
  });
  const filteredUsers = users.filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getClientName = (clientId) => {
    if (!clientId) return "NO PONTO";
    return clients.find((c) => c.id === clientId)?.name || "N/A";
  };
  const getRoleLabel = (role) => {
    const labels = {
      owner: "Dono",
      client: "Cliente",
      user: "Usuário"
    };
    return labels[role] || role;
  };
  const handleOpenModal = (user) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        clientId: user.clientId || "",
        active: user.active
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "user",
        clientId: "",
        active: true
      });
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "user",
      clientId: "",
      active: true
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        clientId: formData.clientId || void 0,
        active: formData.active
      });
    }
    handleCloseModal();
  };
  const handleToggleActive = (userId) => {
    toggleUserActive(userId);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Usuários" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gerencie todos os usuários do sistema" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => handleOpenModal(), children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Novo Usuário"
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "Buscar por nome ou email...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "pl-10"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: filteredUsers.map((user) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground", children: user.name.charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: user.name }),
            /* @__PURE__ */ jsx(Badge, { variant: user.active ? "success" : "default", children: user.active ? "Ativo" : "Inativo" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: user.email }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsx(Badge, { variant: "info", children: getRoleLabel(user.role) }),
            user.clientId && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Building2, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { children: getClientName(user.clientId) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handleOpenModal(user),
            children: [
              /* @__PURE__ */ jsx(Pen, { className: "h-4 w-4 mr-2" }),
              "Editar"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: user.active ? "destructive" : "default",
            size: "sm",
            onClick: () => handleToggleActive(user.id),
            children: user.active ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(PowerOff, { className: "h-4 w-4 mr-2" }),
              "Desativar"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Power, { className: "h-4 w-4 mr-2" }),
              "Ativar"
            ] })
          }
        )
      ] })
    ] }) }) }, user.id)) }),
    filteredUsers.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Nenhum usuário encontrado" }) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: handleCloseModal,
        title: editingUser ? "Editar Usuário" : "Novo Usuário",
        size: "lg",
        children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "text-sm font-medium", children: "Nome *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                placeholder: "Nome completo",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-sm font-medium", children: "Email *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: formData.email,
                onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                placeholder: "usuario@email.com",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "role", className: "text-sm font-medium", children: "Perfil *" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "role",
                value: formData.role,
                onChange: (e) => setFormData({ ...formData, role: e.target.value }),
                className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "user", children: "Usuário" }),
                  /* @__PURE__ */ jsx("option", { value: "client", children: "Cliente" }),
                  /* @__PURE__ */ jsx("option", { value: "owner", children: "Dono" })
                ]
              }
            )
          ] }),
          formData.role !== "owner" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "clientId", className: "text-sm font-medium", children: "Cliente" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "clientId",
                value: formData.clientId,
                onChange: (e) => setFormData({ ...formData, clientId: e.target.value }),
                className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Selecione um cliente" }),
                  clients.map((client) => /* @__PURE__ */ jsx("option", { value: client.id, children: client.name }, client.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "active",
                checked: formData.active,
                onChange: (e) => setFormData({ ...formData, active: e.target.checked }),
                className: "h-4 w-4 rounded border-gray-300"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "active", className: "text-sm font-medium cursor-pointer", children: "Usuário ativo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-4 border-t", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: handleCloseModal, children: "Cancelar" }),
            /* @__PURE__ */ jsx(Button, { type: "submit", children: editingUser ? "Salvar Alterações" : "Criar Usuário" })
          ] })
        ] })
      }
    )
  ] });
}
const __iconNode$h = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$h);
function AutomationFlowPage() {
  const { currentFlow, flows, setCurrentFlow, updateFlow, createFlow } = useAutomationFlowStore();
  const router = useRouter();
  useEffect(() => {
    if (flows.length > 0 && !currentFlow) {
      setCurrentFlow(flows[0].id);
    } else if (flows.length === 0) {
      createFlow("Nova Automação");
    }
  }, [flows, currentFlow, setCurrentFlow, createFlow]);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(100vh-8rem)] flex-col space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: () => router.push("/dashboard/automations"), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Voltar"
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        Input,
        {
          value: currentFlow?.name || "",
          onChange: (e) => updateFlow({ name: e.target.value }),
          placeholder: "Nome da automação",
          className: "text-xl font-semibold"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 rounded-lg border bg-background", children: /* @__PURE__ */ jsx(FlowCanvas, {}) })
  ] });
}
const invalidClientStages = /* @__PURE__ */ new Set(["Novo Lead", "Proposta Enviada", "Ganhou", "Perdido"]);
function ClientsPage() {
  const { leads, setSelectedLead } = useLeadsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const clients = useMemo(() => {
    return leads.filter(
      (lead) => lead.tags.some((tag) => tag.toLowerCase() === "cliente") && !invalidClientStages.has(lead.pipelineStage)
    );
  }, [leads]);
  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return client.name.toLowerCase().includes(query) || client.email?.toLowerCase().includes(query) || client.phone?.includes(searchQuery);
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Clientes" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Leads marcados com a tag cliente" })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "Buscar cliente por nome, email ou telefone...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "pl-10"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: filteredClients.map((client) => /* @__PURE__ */ jsx(
      Card,
      {
        className: "cursor-pointer hover:shadow-md transition-shadow",
        onClick: () => setSelectedLead(client.id),
        children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: client.name }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(ChannelBadge, { channel: client.channel }),
                /* @__PURE__ */ jsx(Badge, { variant: "success", children: "cliente" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-muted-foreground" })
          ] }),
          client.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: client.email }),
          client.phone && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: client.phone }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: client.pipelineStage }),
            /* @__PURE__ */ jsx("span", { children: formatRelativeTime(client.updatedAt) })
          ] })
        ] })
      },
      client.id
    )) }),
    filteredClients.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-12 text-center text-muted-foreground", children: "Nenhum cliente encontrado" }) })
  ] });
}
const __iconNode$g = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$g);
const __iconNode$f = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$f);
const __iconNode$e = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$e);
const connectionConfig = {
  whatsapp: {
    name: "WhatsApp",
    icon: WhatsAppIcon,
    color: "bg-green-500",
    description: "Conecte sua conta do WhatsApp para receber e enviar mensagens",
    connectLabel: "Conectar WhatsApp"
  }
};
function ConnectionsPage() {
  const { connections, toggleConnection, getConnectionByType } = useConnectionsStore();
  const handleConnect = (type) => {
    toggleConnection(type);
  };
  const handleDisconnect = (type) => {
    if (confirm("Tem certeza que deseja desconectar esta conta?")) {
      toggleConnection(type);
    }
  };
  const handleSync = (type) => {
    const connection = getConnectionByType(type);
    if (connection) {
      useConnectionsStore.getState().updateConnection(type, {
        lastSync: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Conexões" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gerencie sua conexão do WhatsApp" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: ["whatsapp"].map((type) => {
      const connection = getConnectionByType(type);
      const config = connectionConfig[type];
      const Icon2 = config.icon;
      if (!connection) return null;
      return /* @__PURE__ */ jsxs(Card, { className: "relative", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `flex h-12 w-12 items-center justify-center rounded-lg ${config.color} text-white`,
                children: type === "whatsapp" ? /* @__PURE__ */ jsx(Icon2, { className: "h-7 w-7" }) : /* @__PURE__ */ jsx(Icon2, { className: "h-6 w-6" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: config.name }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: connection.connected ? "success" : "default",
                  className: "mt-1",
                  children: connection.connected ? "Conectado" : "Desconectado"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-3", children: config.description })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: connection.connected ? /* @__PURE__ */ jsxs(Fragment, { children: [
          connection.accountName && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Conta conectada:" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: connection.accountName })
          ] }),
          connection.connectedAt && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Conectado em:" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: new Date(connection.connectedAt).toLocaleDateString("pt-BR") })
          ] }),
          connection.lastSync && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Última sincronização:" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: formatRelativeTime(connection.lastSync) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "flex-1",
                onClick: () => handleSync(type),
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
                  "Sincronizar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "destructive",
                size: "sm",
                className: "flex-1",
                onClick: () => handleDisconnect(type),
                children: [
                  /* @__PURE__ */ jsx(X, { className: "h-4 w-4 mr-2" }),
                  "Desconectar"
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxs(
          Button,
          {
            className: "w-full",
            onClick: () => handleConnect(type),
            children: [
              /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-2" }),
              config.connectLabel
            ]
          }
        ) })
      ] }, connection.id);
    }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Como funciona" }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("p", { children: "• Conecte sua conta do WhatsApp para centralizar as mensagens no Inbox" }),
        /* @__PURE__ */ jsx("p", { children: "• Após conectar, todas as mensagens recebidas aparecerão automaticamente no Inbox" }),
        /* @__PURE__ */ jsx("p", { children: "• Você pode sincronizar manualmente a qualquer momento para atualizar as mensagens" }),
        /* @__PURE__ */ jsx("p", { children: "• As conexões são seguras e utilizam as APIs oficiais de cada plataforma" })
      ] })
    ] })
  ] });
}
const __iconNode$d = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$d);
const __iconNode$c = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$c);
const __iconNode$b = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$b);
const __iconNode$a = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$a);
const __iconNode$9 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$9);
function InboxPage() {
  const { conversations, selectedConversationId, setSelectedConversation, sendMessage, getMessagesByLead, initializeConversations } = useConversationsStore();
  const { selectedLead, setSelectedLead, leads } = useLeadsStore();
  const [messageInput, setMessageInput] = useState("");
  const [isLeadPanelOpen, setIsLeadPanelOpen] = useState(true);
  useEffect(() => {
    if (leads.length > 0 && conversations.length === 0) {
      initializeConversations(leads);
    }
  }, [leads, conversations.length, initializeConversations]);
  const selectedConversation = conversations.find((c) => c.leadId === selectedConversationId);
  const messages = selectedConversationId ? getMessagesByLead(selectedConversationId) : [];
  const handleSelectConversation = (leadId) => {
    setSelectedConversation(leadId);
    setSelectedLead(leadId);
    setIsLeadPanelOpen(true);
  };
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) return;
    if (!selectedConversation?.lead.window24hOpen) return;
    sendMessage(selectedConversationId, messageInput);
    setMessageInput("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(100vh-8rem)] gap-4 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-80 flex-shrink-0 border-r bg-card flex flex-col h-full", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b p-4 flex-shrink-0", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Conversas" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto scrollbar-hover", children: conversations.map((conv) => {
        const isSelected = selectedConversationId === conv.leadId;
        return /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => handleSelectConversation(conv.leadId),
            className: `cursor-pointer border-b p-4 transition-colors hover:bg-accent ${isSelected ? "bg-accent" : ""}`,
            children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium truncate", children: conv.lead.name }),
                conv.unreadCount > 0 && /* @__PURE__ */ jsx(Badge, { variant: "info", className: "h-5 min-w-[20px] px-1.5 text-xs", children: conv.unreadCount })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx(ChannelBadge, { channel: conv.lead.channel }),
                !conv.lead.window24hOpen && /* @__PURE__ */ jsxs(Badge, { variant: "danger", className: "gap-1", children: [
                  /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }),
                  "Janela fechada"
                ] })
              ] }),
              conv.lastMessage && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground truncate", children: conv.lastMessage.content }),
              conv.lastMessage && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: formatRelativeTime(conv.lastMessage.createdAt) })
            ] }) })
          },
          conv.leadId
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `flex-1 flex flex-col bg-card h-full overflow-hidden ${isLeadPanelOpen ? "border-r" : ""}`, children: selectedConversation ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "border-b p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground", children: selectedConversation.lead.name.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: selectedConversation.lead.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(ChannelBadge, { channel: selectedConversation.lead.channel }),
              selectedConversation.lead.window24hOpen ? /* @__PURE__ */ jsxs(Badge, { variant: "success", className: "gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                "Janela aberta"
              ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "danger", className: "gap-1", children: [
                /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }),
                "Janela fechada"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setIsLeadPanelOpen((prev) => !prev),
            children: isLeadPanelOpen ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 mr-2" }),
              "Recolher detalhes"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 mr-2" }),
              "Ver detalhes"
            ] })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hover", children: messages.map((message) => {
        const isUser = message.senderType === "user";
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `flex ${isUser ? "justify-end" : "justify-start"}`,
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: `max-w-[70%] rounded-lg px-4 py-2 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
                children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm", children: message.content }),
                  /* @__PURE__ */ jsx("p", { className: `text-xs mt-1 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`, children: formatRelativeTime(message.createdAt) })
                ]
              }
            )
          },
          message.id
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "border-t p-4", children: !selectedConversation.lead.window24hOpen ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: "A janela de 24h está fechada. Não é possível enviar mensagens." })
      ] }) }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            value: messageInput,
            onChange: (e) => setMessageInput(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && handleSendMessage(),
            placeholder: "Digite sua mensagem...",
            disabled: !selectedConversation.lead.window24hOpen
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleSendMessage,
            disabled: !messageInput.trim() || !selectedConversation.lead.window24hOpen,
            children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
          }
        )
      ] }) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-muted-foreground", children: "Selecione uma conversa para começar" }) }) }) }),
    selectedConversation && /* @__PURE__ */ jsx(
      "div",
      {
        className: `flex-shrink-0 bg-card h-full flex flex-col overflow-hidden border-l transition-all duration-300 ease-in-out ${isLeadPanelOpen ? "w-96 opacity-100" : "w-0 opacity-0"}`,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-full transition-transform duration-300 ease-in-out ${isLeadPanelOpen ? "translate-x-0" : "translate-x-4"}`,
            children: /* @__PURE__ */ jsx(LeadCard, { leadId: selectedConversation.leadId })
          }
        )
      }
    )
  ] });
}
function DashboardLayout({
  children
}) {
  const { isAuthenticated, user, client } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/");
        setIsChecking(false);
        return;
      }
      const currentClient2 = useAuthStore.getState().client;
      if (user?.role === "owner") {
        if (!currentClient2) {
          router.push("/admin/clients");
          setIsChecking(false);
          return;
        }
      }
      if (user?.role !== "owner" && !currentClient2) {
        router.push("/");
        setIsChecking(false);
        return;
      }
      setIsChecking(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, client, router]);
  if (isChecking || !isAuthenticated) {
    return null;
  }
  const currentClient = useAuthStore.getState().client;
  if (user?.role === "owner" && !currentClient) {
    return null;
  }
  if (user?.role !== "owner" && !currentClient) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx(Sidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx(Topbar, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto bg-background p-6", children })
    ] })
  ] });
}
function LeadsPage() {
  const { leads, setSelectedLead } = useLeadsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const allTags = Array.from(new Set(leads.flatMap((lead) => lead.tags)));
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) || lead.phone?.includes(searchQuery);
    const matchesChannel = !selectedChannel || lead.channel === selectedChannel;
    const matchesTag = !selectedTag || lead.tags.includes(selectedTag);
    return matchesSearch && matchesChannel && matchesTag;
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Leads" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gerencie todos os seus leads em um só lugar" })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-[200px]", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Buscar por nome, email ou telefone...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-10"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedChannel || "",
            onChange: (e) => setSelectedChannel(e.target.value || null),
            className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Todos os canais" }),
              /* @__PURE__ */ jsx("option", { value: "whatsapp", children: "WhatsApp" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedTag || "",
            onChange: (e) => setSelectedTag(e.target.value || null),
            className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Todas as tags" }),
              allTags.map((tag) => /* @__PURE__ */ jsx("option", { value: tag, children: tag }, tag))
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: filteredLeads.map((lead) => /* @__PURE__ */ jsx(
      Card,
      {
        className: "cursor-pointer hover:shadow-md transition-shadow",
        onClick: () => setSelectedLead(lead.id),
        children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: lead.name }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsx(ChannelBadge, { channel: lead.channel }) })
            ] }),
            /* @__PURE__ */ jsx(
              Badge,
              {
                variant: lead.priority === "high" ? "danger" : lead.priority === "medium" ? "warning" : "default",
                children: lead.priority === "high" ? "Alta" : lead.priority === "medium" ? "Média" : "Baixa"
              }
            )
          ] }),
          lead.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: lead.email }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: lead.tags.map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: tag }, tag)) }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-sm", children: /* @__PURE__ */ jsx(Badge, { variant: "info", children: lead.pipelineStage }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Score:" }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: lead.score > 70 ? "success" : lead.score > 40 ? "warning" : "default",
                  className: "text-xs",
                  children: lead.score
                }
              )
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: formatRelativeTime(lead.updatedAt) })
          ] })
        ] }) })
      },
      lead.id
    )) }),
    filteredLeads.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Nenhum lead encontrado com os filtros aplicados" }) }) })
  ] });
}
const __iconNode$8 = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode$8);
const __iconNode$7 = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$7);
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode$6);
function MetricsPage() {
  const { leads } = useLeadsStore();
  const { conversations } = useConversationsStore();
  const totalLeads = leads.length;
  const activeConversations = conversations.filter((c) => c.lead.window24hOpen).length;
  const qualifiedLeads = leads.filter((l) => l.status === "qualified" || l.status === "proposal").length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads * 100).toFixed(1) : "0";
  const leadsByWindow24h = {
    open: leads.filter((l) => l.window24hOpen).length,
    closed: leads.filter((l) => !l.window24hOpen).length
  };
  const leadsByStage = {
    "Novo Lead": leads.filter((l) => l.pipelineStage === "Novo Lead").length,
    "Em Atendimento": leads.filter((l) => l.pipelineStage === "Em Atendimento").length,
    "Qualificado": leads.filter((l) => l.pipelineStage === "Qualificado").length,
    "Proposta Enviada": leads.filter((l) => l.pipelineStage === "Proposta Enviada").length,
    "Ganhou": leads.filter((l) => l.pipelineStage === "Ganhou").length,
    "Perdido": leads.filter((l) => l.pipelineStage === "Perdido").length
  };
  const metrics = [
    {
      title: "Total de Leads",
      value: totalLeads,
      icon: Users,
      change: "+12%",
      trend: "up"
    },
    {
      title: "Taxa de Conversão",
      value: `${conversionRate}%`,
      icon: Target,
      change: "+2.5%",
      trend: "up"
    },
    {
      title: "Conversas Ativas",
      value: activeConversations,
      icon: MessageSquare,
      change: "+5",
      trend: "up"
    },
    {
      title: "Leads Qualificados",
      value: qualifiedLeads,
      icon: TrendingUp,
      change: "+8%",
      trend: "up"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Métricas" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Acompanhe o desempenho do seu CRM" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: metrics.map((metric) => {
      const Icon2 = metric.icon;
      return /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: metric.title }),
          /* @__PURE__ */ jsx(Icon2, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: metric.value }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            metric.trend === "up" ? /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3 text-green-600" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "h-3 w-3 text-red-600" }),
            /* @__PURE__ */ jsx("span", { className: metric.trend === "up" ? "text-green-600" : "text-red-600", children: metric.change }),
            /* @__PURE__ */ jsx("span", { children: " vs mês anterior" })
          ] })
        ] })
      ] }, metric.title);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Leads por Janela 24h" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: Object.entries(leadsByWindow24h).map(([key, count]) => {
          const percentage = totalLeads > 0 ? count / totalLeads * 100 : 0;
          const isOpen = key === "open";
          const ItemIcon = isOpen ? Clock : Lock;
          const label = isOpen ? "Janela aberta" : "Janela fechada";
          return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(ItemIcon, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: label })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                count,
                " leads"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-primary transition-all",
                style: { width: `${percentage}%` }
              }
            ) })
          ] }, key);
        }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Leads por Etapa" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Object.entries(leadsByStage).map(([stage, count]) => {
          const percentage = totalLeads > 0 ? count / totalLeads * 100 : 0;
          return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { children: stage }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: count })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-primary transition-all",
                style: { width: `${percentage}%` }
              }
            ) })
          ] }, stage);
        }) }) })
      ] })
    ] })
  ] });
}
function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/inbox");
  }, [router]);
  return null;
}
const __iconNode$5 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$3);
const __iconNode$2 = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode$2);
const __iconNode$1 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$1);
function PipelinePage() {
  const { client } = useAuthStore();
  const { leads, updateLead, setSelectedLead } = useLeadsStore();
  const {
    getPipelineForClient,
    updateStage,
    addStage,
    deleteStage,
    updatePipelineForClient,
    reorderStages
  } = usePipelineStore();
  const pipelineService = useMemo(
    () => new PipelineService(
      new ZustandPipelineRepository({
        getPipelineForClient,
        updateStage,
        addStage,
        deleteStage,
        reorderStages
      }),
      new ZustandLeadRepository(updateLead)
    ),
    [getPipelineForClient, updateStage, addStage, deleteStage, reorderStages, updateLead]
  );
  const [draggedLeadId, setDraggedLeadId] = useState(null);
  const [draggedOverStageId, setDraggedOverStageId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const colorPickerRefs = useRef({});
  const [draggedStageId, setDraggedStageId] = useState(null);
  const [dragOverStageId, setDragOverStageId] = useState(null);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("#3b82f6");
  const clientId = client?.id || "default";
  const pipelineStages = pipelineService.getStages(clientId).sort((a, b) => a.order - b.order);
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = (e, leadId) => {
    setIsDragging(true);
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.setData("application/json", JSON.stringify({ leadId }));
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
      e.currentTarget.style.cursor = "grabbing";
    }
  };
  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDraggedLeadId(null);
    setDraggedOverStageId(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
      e.currentTarget.style.cursor = "grab";
    }
  };
  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverStageId(stageId);
  };
  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDraggedOverStageId(null);
    }
  };
  const handleDrop = (e, stageId) => {
    e.preventDefault();
    e.stopPropagation();
    let leadId = draggedLeadId;
    if (!leadId) {
      try {
        const data = e.dataTransfer.getData("application/json");
        if (data) {
          const parsed = JSON.parse(data);
          leadId = parsed.leadId;
        } else {
          leadId = e.dataTransfer.getData("text/plain");
        }
      } catch {
        leadId = e.dataTransfer.getData("text/plain");
      }
    }
    if (!leadId) return;
    const stage = pipelineStages.find((s) => s.id === stageId);
    if (!stage) return;
    updateLead(leadId, {
      pipelineStage: stage.name,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    setDraggedLeadId(null);
    setDraggedOverStageId(null);
    setIsDragging(false);
  };
  const getLeadsForStage = (stageName) => {
    return leads.filter((lead) => lead.pipelineStage === stageName);
  };
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    pipelineService.addStage(clientId, {
      name: newStageName.trim(),
      color: newStageColor,
      leadIds: []
    });
    setNewStageName("");
    setNewStageColor("#3b82f6");
  };
  const handleUpdateStage = () => {
    if (!editingStage) return;
    pipelineService.updateStage(clientId, editingStage.id, editingStage.name, editingStage.color, leads);
    setEditingStage(null);
    setShowColorPicker(null);
    colorPickerRefs.current = {};
  };
  const handleDeleteStage = (stageId) => {
    const stage = pipelineStages.find((s) => s.id === stageId);
    if (!stage) return;
    const fallbackStageName = pipelineStages[0]?.name ?? null;
    pipelineService.deleteStage(clientId, stageId, leads, fallbackStageName);
  };
  const handleStageDragStart = (stageId) => (e) => {
    setDraggedStageId(stageId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
    const target = e.currentTarget;
    target.style.opacity = "0.5";
    target.style.transform = "rotate(2deg) scale(1.05)";
  };
  const handleStageDragEnd = (e) => {
    const target = e.currentTarget;
    target.style.opacity = "1";
    target.style.transform = "rotate(0deg) scale(1)";
    setDraggedStageId(null);
    setDragOverStageId(null);
  };
  const handleStageDragOver = (stageId) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedStageId && draggedStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };
  const handleStageDragLeave = () => {
    setDragOverStageId(null);
  };
  const handleStageDrop = (targetStageId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedStageId || draggedStageId === targetStageId) {
      setDragOverStageId(null);
      return;
    }
    const currentOrder = pipelineStages.map((s) => s.id);
    const draggedIndex = currentOrder.indexOf(draggedStageId);
    const targetIndex = currentOrder.indexOf(targetStageId);
    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedStageId);
    pipelineService.reorderStages(clientId, newOrder);
    setDraggedStageId(null);
    setDragOverStageId(null);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showColorPicker) {
        const ref = colorPickerRefs.current[showColorPicker];
        if (ref && !ref.contains(e.target)) {
          setShowColorPicker(null);
        }
      }
    };
    if (showColorPicker) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);
  const colors = PIPELINE_COLOR_PALETTE;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Pipeline" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Arraste os leads entre as etapas do funil" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => setIsSettingsOpen(true), children: [
        /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4 mr-2" }),
        "Personalizar Etapas"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-4 overflow-x-auto pb-4", children: pipelineStages.map((stage) => {
      const stageLeads = getLeadsForStage(stage.name);
      const isDraggedOver = draggedOverStageId === stage.id;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex-shrink-0 w-80 transition-all ${isDraggedOver ? "scale-105" : ""}`,
          onDragOver: (e) => handleDragOver(e, stage.id),
          onDragLeave: (e) => handleDragLeave(e),
          onDrop: (e) => handleDrop(e, stage.id),
          children: /* @__PURE__ */ jsxs(Card, { className: `${isDraggedOver ? "ring-2 ring-primary" : ""}`, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "p-4 border-b",
                style: { borderLeftColor: stage.color, borderLeftWidth: "4px" },
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: stage.name }),
                  /* @__PURE__ */ jsx(Badge, { variant: "default", children: stageLeads.length })
                ] })
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "p-2 space-y-2",
                onDragOver: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                },
                children: [
                  stageLeads.map((lead) => /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `rounded-lg border bg-card text-card-foreground shadow-sm p-3 hover:shadow-md transition-all select-none ${draggedLeadId === lead.id ? "opacity-50 cursor-grabbing" : "cursor-grab"}`,
                      draggable: true,
                      onDragStart: (e) => {
                        e.stopPropagation();
                        handleDragStart(e, lead.id);
                      },
                      onDragEnd: (e) => {
                        e.stopPropagation();
                        handleDragEnd(e);
                      },
                      onMouseDown: (e) => {
                        e.currentTarget.style.cursor = "grabbing";
                      },
                      onMouseUp: (e) => {
                        if (!isDragging) {
                          e.currentTarget.style.cursor = "grab";
                        }
                      },
                      onClick: (e) => {
                        if (!isDragging && !draggedLeadId) {
                          setSelectedLead(lead.id);
                        }
                      },
                      style: {
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        MozUserSelect: "none",
                        msUserSelect: "none",
                        touchAction: "none"
                      },
                      children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                          /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: lead.name }),
                          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsx(ChannelBadge, { channel: lead.channel }) })
                        ] }) }),
                        lead.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
                          lead.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: tag }, tag)),
                          lead.tags.length > 2 && /* @__PURE__ */ jsxs(Badge, { variant: "default", className: "text-xs", children: [
                            "+",
                            lead.tags.length - 2
                          ] })
                        ] }),
                        lead.assignedTo && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                          /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
                          /* @__PURE__ */ jsx("span", { children: "Atribuído" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: formatRelativeTime(lead.updatedAt) })
                      ] })
                    },
                    lead.id
                  )),
                  stageLeads.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg", children: isDraggedOver ? "Solte aqui" : "Nenhum lead nesta etapa" })
                ]
              }
            )
          ] })
        },
        stage.id
      );
    }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isSettingsOpen,
        onClose: () => {
          setIsSettingsOpen(false);
          setEditingStage(null);
          setShowColorPicker(null);
          setNewStageName("");
          colorPickerRefs.current = {};
        },
        title: "Personalizar Etapas do Pipeline",
        size: "lg",
        children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Etapas Atuais" }),
            pipelineStages.map((stage) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 ${draggedStageId === stage.id ? "opacity-50 scale-95 rotate-1 shadow-lg" : draggedStageId && dragOverStageId === stage.id ? "border-primary border-2 bg-primary/5 scale-[1.02] shadow-md" : draggedStageId ? "opacity-60" : "hover:shadow-md hover:border-primary/50"}`,
                draggable: true,
                onDragStart: handleStageDragStart(stage.id),
                onDragEnd: handleStageDragEnd,
                onDragOver: handleStageDragOver(stage.id),
                onDragLeave: handleStageDragLeave,
                onDrop: handleStageDrop(stage.id),
                children: [
                  /* @__PURE__ */ jsx(GripVertical, { className: "h-5 w-5 text-muted-foreground cursor-move" }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-4 h-4 rounded flex-shrink-0",
                      style: { backgroundColor: stage.color }
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex-1", children: editingStage?.id === stage.id ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        value: editingStage.name,
                        onChange: (e) => setEditingStage({ ...editingStage, name: e.target.value }),
                        className: "w-full",
                        placeholder: "Nome da etapa"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Cor:" }),
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: "relative",
                          ref: (el) => {
                            colorPickerRefs.current[stage.id] = el;
                          },
                          children: [
                            /* @__PURE__ */ jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  const newPickerId = showColorPicker === stage.id ? null : stage.id;
                                  setShowColorPicker(newPickerId);
                                },
                                className: "flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-accent transition-colors",
                                children: [
                                  /* @__PURE__ */ jsx(
                                    "div",
                                    {
                                      className: "w-5 h-5 rounded border-2 border-border flex-shrink-0",
                                      style: { backgroundColor: editingStage.color }
                                    }
                                  ),
                                  /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 transition-transform flex-shrink-0 ${showColorPicker === stage.id ? "rotate-180" : ""}` })
                                ]
                              }
                            ),
                            showColorPicker === stage.id && /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: "absolute top-full left-0 mt-2 p-3 bg-popover border rounded-lg shadow-xl z-50 min-w-[280px]",
                                onClick: (e) => e.stopPropagation(),
                                children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Selecione uma cor" }),
                                    /* @__PURE__ */ jsx(
                                      "div",
                                      {
                                        className: "w-6 h-6 rounded border-2 border-border flex-shrink-0",
                                        style: { backgroundColor: editingStage.color }
                                      }
                                    )
                                  ] }),
                                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: colors.map((color) => /* @__PURE__ */ jsx(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: (e) => {
                                        e.stopPropagation();
                                        setEditingStage({ ...editingStage, color: color.value });
                                        setShowColorPicker(null);
                                      },
                                      className: `group relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${editingStage.color === color.value ? "border-foreground scale-110 ring-2 ring-primary ring-offset-1" : "border-border hover:border-foreground/50"}`,
                                      style: { backgroundColor: color.value },
                                      title: color.name,
                                      children: editingStage.color === color.value && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-white/90 shadow-sm" }) })
                                    },
                                    color.value
                                  )) }),
                                  /* @__PURE__ */ jsx("div", { className: "pt-2 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                                    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Cor atual:" }),
                                    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: colors.find((c) => c.value === editingStage.color)?.name || "Personalizada" })
                                  ] }) })
                                ] })
                              }
                            )
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx(Button, { size: "sm", onClick: handleUpdateStage, className: "flex-1", children: "Salvar" }),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          onClick: () => {
                            setEditingStage(null);
                            setShowColorPicker(null);
                            colorPickerRefs.current = {};
                          },
                          className: "flex-1",
                          children: "Cancelar"
                        }
                      )
                    ] })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: stage.name }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "ghost",
                          onClick: () => {
                            setEditingStage({
                              id: stage.id,
                              name: stage.name,
                              color: stage.color
                            });
                            setShowColorPicker(null);
                          },
                          children: "Editar"
                        }
                      ),
                      pipelineStages.length > 1 && /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "destructive",
                          onClick: () => handleDeleteStage(stage.id),
                          children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                        }
                      )
                    ] })
                  ] }) })
                ]
              },
              stage.id
            ))
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Adicionar Nova Etapa" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Nome da etapa",
                  value: newStageName,
                  onChange: (e) => setNewStageName(e.target.value),
                  onKeyPress: (e) => e.key === "Enter" && handleAddStage()
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Cor:" }),
                /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: colors.map((color) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setNewStageColor(color.value),
                    className: `w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${newStageColor === color.value ? "border-foreground scale-110 ring-2 ring-primary ring-offset-1" : "border-border hover:border-foreground/50"}`,
                    style: { backgroundColor: color.value },
                    title: color.name
                  },
                  color.value
                )) })
              ] }),
              /* @__PURE__ */ jsxs(Button, { onClick: handleAddStage, className: "w-full", children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Adicionar Etapa"
              ] })
            ] })
          ] })
        ] })
      }
    )
  ] });
}
function SettingsPage() {
  const { user, client } = useAuthStore();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Configurações" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gerencie as configurações da sua conta" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Perfil" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Atualize suas informações pessoais" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Nome" }),
            /* @__PURE__ */ jsx(Input, { defaultValue: user?.name || "" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Email" }),
            /* @__PURE__ */ jsx(Input, { type: "email", defaultValue: user?.email || "" })
          ] }),
          /* @__PURE__ */ jsx(Button, { children: "Salvar Alterações" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Empresa" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Informações da empresa" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Nome da Empresa" }),
            /* @__PURE__ */ jsx(Input, { defaultValue: client?.name || "", disabled: user?.role !== "client" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Usuários" }),
            /* @__PURE__ */ jsx(Input, { defaultValue: client?.userCount.toString() || "0", disabled: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Leads" }),
            /* @__PURE__ */ jsx(Input, { defaultValue: client?.leadCount.toString() || "0", disabled: true })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const __iconNode = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
const tagColors = [
  { value: "#3b82f6", name: "Azul" },
  { value: "#8b5cf6", name: "Roxo" },
  { value: "#f59e0b", name: "Laranja" },
  { value: "#10b981", name: "Verde" },
  { value: "#22c55e", name: "Verde Claro" },
  { value: "#ef4444", name: "Vermelho" },
  { value: "#ec4899", name: "Rosa" },
  { value: "#06b6d4", name: "Ciano" },
  { value: "#84cc16", name: "Lima" },
  { value: "#f97316", name: "Laranja Escuro" },
  { value: "#6366f1", name: "Índigo" },
  { value: "#14b8a6", name: "Turquesa" },
  { value: "#a855f7", name: "Roxo Claro" },
  { value: "#0ea5e9", name: "Azul Claro" },
  { value: "#64748b", name: "Cinza" },
  { value: "#fbbf24", name: "Amarelo" }
];
function TagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useTagsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#3b82f6");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);
  const handleOpenModal = (tag) => {
    if (tag) {
      setEditingTag(tag);
      setTagName(tag.name);
      setTagColor(tag.color);
    } else {
      setEditingTag(null);
      setTagName("");
      setTagColor("#3b82f6");
    }
    setShowColorPicker(false);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setTagName("");
    setTagColor("#3b82f6");
    setShowColorPicker(false);
  };
  const handleSaveTag = () => {
    if (!tagName.trim()) return;
    if (editingTag) {
      updateTag(editingTag.id, {
        name: tagName.trim(),
        color: tagColor
      });
    } else {
      addTag(tagName.trim(), tagColor);
    }
    handleCloseModal();
  };
  const handleDeleteTag = (tagId) => {
    if (confirm("Tem certeza que deseja excluir esta tag?")) {
      deleteTag(tagId);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Tags" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Gerencie as tags para organizar seus leads" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => handleOpenModal(), children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Nova Tag"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: tags.map((tag) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-4 h-4 rounded-full",
              style: { backgroundColor: tag.color }
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: tag.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              onClick: () => handleOpenModal(tag),
              children: /* @__PURE__ */ jsx(Pen, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "destructive",
              onClick: () => handleDeleteTag(tag.id),
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs("span", { children: [
            tag.leadCount,
            " leads"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
          Badge,
          {
            style: { backgroundColor: tag.color, borderColor: tag.color },
            className: "text-white",
            children: tag.name
          }
        ) })
      ] })
    ] }) }, tag.id)) }),
    tags.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx(Tag, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Nenhuma tag criada" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Crie tags para organizar e filtrar seus leads" }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => handleOpenModal(), children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Criar Tag"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: handleCloseModal,
        title: editingTag ? "Editar Tag" : "Nova Tag",
        size: "md",
        children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium mb-2 block", children: "Nome da Tag" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: tagName,
                onChange: (e) => setTagName(e.target.value),
                placeholder: "Ex: Interessado, Quente, VIP...",
                onKeyPress: (e) => e.key === "Enter" && handleSaveTag()
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium mb-2 block", children: "Cor" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", ref: colorPickerRef, children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowColorPicker(!showColorPicker),
                  className: "flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition-colors w-full justify-between",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-5 h-5 rounded border-2 border-border",
                        style: { backgroundColor: tagColor }
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-sm", children: tagColors.find((c) => c.value === tagColor)?.name || "Personalizada" })
                  ] })
                }
              ),
              showColorPicker && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-full left-0 mt-2 p-3 bg-popover border rounded-lg shadow-xl z-50 w-full",
                  onClick: (e) => e.stopPropagation(),
                  children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: tagColors.map((color) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setTagColor(color.value);
                        setShowColorPicker(false);
                      },
                      className: `w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${tagColor === color.value ? "border-foreground scale-110 ring-2 ring-primary ring-offset-1" : "border-border hover:border-foreground/50"}`,
                      style: { backgroundColor: color.value },
                      title: color.name,
                      children: tagColor === color.value && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-white/90 shadow-sm" }) })
                    },
                    color.value
                  )) })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx(Button, { onClick: handleSaveTag, className: "flex-1", children: editingTag ? "Salvar Alterações" : "Criar Tag" }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleCloseModal, children: "Cancelar" })
          ] })
        ] })
      }
    )
  ] });
}
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const { clients } = useClientsStore();
  const router = useRouter();
  const branding = getDefaultBranding();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const user = await login(email, password, clients);
    if (user) {
      if (user.role === "owner") {
        router.push("/admin/clients");
      } else {
        router.push("/dashboard/inbox");
      }
    } else {
      setError("Email ou senha inválidos");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-3xl font-bold text-center", children: branding.appName }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: branding.loginSubtitle })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-sm font-medium", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: "seu@email.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "text-sm font-medium", children: "Senha" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            placeholder: "••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive", children: error }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Entrar" }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground space-y-1 pt-4 border-t", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Usuários de teste:" }),
        /* @__PURE__ */ jsx("p", { children: "• joao@noponto.com (Owner)" }),
        /* @__PURE__ */ jsx("p", { children: "• maria@cliente1.com (Cliente)" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", children: "Qualquer senha funciona" })
      ] })
    ] }) })
  ] }) });
}
var ErrorBoundary = class extends React$1__default.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    if (error && typeof error === "object" && "digest" in error) {
      const digest = String(error.digest);
      if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;") || digest.startsWith("NEXT_REDIRECT;")) throw error;
    }
    return { error };
  }
  reset = () => {
    this.setState({ error: null });
  };
  render() {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback;
      return /* @__PURE__ */ jsx(FallbackComponent, {
        error: this.state.error,
        reset: this.reset
      });
    }
    return this.props.children;
  }
};
var NotFoundBoundaryInner = class extends React$1__default.Component {
  constructor(props) {
    super(props);
    this.state = {
      notFound: false,
      previousPathname: props.pathname
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.pathname !== state.previousPathname && state.notFound) return {
      notFound: false,
      previousPathname: props.pathname
    };
    return {
      notFound: state.notFound,
      previousPathname: props.pathname
    };
  }
  static getDerivedStateFromError(error) {
    if (error && typeof error === "object" && "digest" in error) {
      const digest = String(error.digest);
      if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;404")) return { notFound: true };
    }
    throw error;
  }
  render() {
    if (this.state.notFound) return this.props.fallback;
    return this.props.children;
  }
};
function NotFoundBoundary({ fallback, children }) {
  return /* @__PURE__ */ jsx(NotFoundBoundaryInner, {
    pathname: usePathname(),
    fallback,
    children
  });
}
function LayoutSegmentProvider({ childSegments, children }) {
  const ctx = getLayoutSegmentContext();
  if (!ctx) return children;
  return createElement(ctx.Provider, { value: childSegments }, children);
}
const export_0434cb239a18 = {
  default: AdminClientsPage
};
const export_6fa56e6c12ff = {
  default: AdminLayout
};
const export_f357939d3fc9 = {
  default: AdminMetricsPage
};
const export_9d2502c6f76e = {
  default: AdminSettingsPage
};
const export_7ea9654251bb = {
  default: AdminUsersPage
};
const export_2e3edda954e5 = {
  default: AutomationFlowPage
};
const export_b871a654c989 = {
  default: ClientsPage
};
const export_ba6dd567ebb3 = {
  default: ConnectionsPage
};
const export_3c6d80461297 = {
  default: InboxPage
};
const export_3c126157994c = {
  default: DashboardLayout
};
const export_88ea4c370910 = {
  default: LeadsPage
};
const export_74cbdc5f9701 = {
  default: MetricsPage
};
const export_e16c1c1133d5 = {
  default: DashboardPage
};
const export_ed1d88514cc8 = {
  default: PipelinePage
};
const export_28714cf45a56 = {
  default: SettingsPage
};
const export_6d64d4a1d4dc = {
  default: TagsPage
};
const export_6efdf509a785 = {
  default: LoginPage
};
const export_f29e6e234fea = {
  ErrorBoundary,
  NotFoundBoundary
};
const export_0deffcb8ffd7 = {
  LayoutSegmentProvider
};
export {
  export_0434cb239a18,
  export_0deffcb8ffd7,
  export_28714cf45a56,
  export_2e3edda954e5,
  export_3c126157994c,
  export_3c6d80461297,
  export_6d64d4a1d4dc,
  export_6efdf509a785,
  export_6fa56e6c12ff,
  export_74cbdc5f9701,
  export_7ea9654251bb,
  export_88ea4c370910,
  export_9d2502c6f76e,
  export_b871a654c989,
  export_ba6dd567ebb3,
  export_e16c1c1133d5,
  export_ed1d88514cc8,
  export_f29e6e234fea,
  export_f357939d3fc9
};
