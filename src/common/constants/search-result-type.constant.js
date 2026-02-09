import { FileText, CheckSquare, LayoutGrid, BarChart3, Building2 } from "lucide-react";

export const SEARCH_RESULT_TYPE_ICONS = Object.freeze({
  card: FileText,
  todo: CheckSquare,
  board: LayoutGrid,
  kpi: BarChart3,
  workspace: Building2,
});

export const SEARCH_RESULT_TYPE_LABELS = Object.freeze({
  card: "Cards",
  todo: "Todos",
  board: "Projects",
  kpi: "KPIs",
  workspace: "Workspaces",
});

export const SEARCH_FILTER_OPTIONS = Object.freeze([
  { value: "", label: "All" },
  { value: "card", label: "Cards" },
  { value: "todo", label: "Todos" },
  { value: "board", label: "Projects" },
  { value: "kpi", label: "KPIs" },
  { value: "workspace", label: "Workspaces" },
]);
