import { CHECK_MODEL } from "../components/constants";


  export interface Icons {
    check: React.ReactNode;
    uncheck: React.ReactNode;
    halfCheck: React.ReactNode;
    expandClose: React.ReactNode;
    expandOpen: React.ReactNode;
    expandAll: React.ReactNode;
    collapseAll: React.ReactNode;
    parentClose: React.ReactNode;
    parentOpen: React.ReactNode;
    leaf: React.ReactNode;
  }

  export interface Language {
    collapseAll: string;
    expandAll: string;
    toggle: string;
  }

  export interface TreeNodeInfo {
    value: string;
    checked?: boolean;
    halfCheck?: boolean;
    expanded?: boolean;
    disabled?: boolean;
  }

  export interface CheckboxTreeNode extends TreeNodeInfo {
    label: string;
    title?: string;
    children?: CheckboxTreeNode[];
    showCheckbox?: boolean;
    className?: string;
    parent?: CheckboxTreeNode;
    icon?: React.ReactNode;
    isChild?: boolean;
    isParent?: boolean;
    isLeaf?: boolean;
    treeDepth?: number;
    index?: number;
  }

  export interface NodeModelProps {
    disabled?: boolean;
    noCascade?: boolean;
  }

  export interface FlatNodes {
    [value: string]: CheckboxTreeNode;
  }

  export interface CheckboxTreeProps {
    nodes: CheckboxTreeNode[];
    checkModel?:  typeof CHECK_MODEL.LEAF| typeof  CHECK_MODEL.ALL;
    checked?: string[];
    direction?: "ltr" | "rtl";
    disabled?: boolean;
    expandDisabled?: boolean;
    expandOnClick?: boolean;
    expanded?: string[];
    icons?: Partial<Icons>;
    id?: string | null;
    lang?: Language;
    nativeCheckboxes?: boolean; //Visualizar input checkbox
    noCascade?: boolean;
    onlyLeafCheckboxes?: boolean;
    optimisticToggle?: boolean;
    showExpandAllButtons?: boolean;
    showNodeIcon?: boolean;
    showNodeTitle?: boolean;
    onCheck?: (checked: string[], node: CheckboxTreeNode) => void;
    onClick?: (node: CheckboxTreeNode) => void;
    onExpand?: (expanded: string[], node?: CheckboxTreeNode) => void;
  }
