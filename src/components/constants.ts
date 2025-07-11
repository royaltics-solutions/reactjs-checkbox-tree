import { CheckboxTreeProps, Icons } from "../types";

const CHECK_MODEL = {
    ALL: 'all',
    PARENT: 'parent',
    LEAF: 'leaf',
};


const DefaultCheckBoxProps: Required<CheckboxTreeProps & Required<{ icons: Icons }>> = {
    checkModel: CHECK_MODEL.LEAF,
    checked: [],
    direction: 'ltr',
    disabled: false,
    expandDisabled: false,
    expandOnClick: false,
    expanded: [],
    icons: {
        check: '✅',
        uncheck: '⬜',
        halfCheck: '☑️',
        expandClose: '▶️',
        expandOpen: '🔽',
        expandAll: '➕',
        collapseAll: '➖',
        parentClose: '📁',
        parentOpen: '📂',
        leaf: '📄',
    },
    id: null,
    nodes: [],
    lang: {
        collapseAll: 'Collapse all',
        expandAll: 'Expand all',
        toggle: 'Toggle',
    },
    nativeCheckboxes: true,
    noCascade: false,
    onlyLeafCheckboxes: false,
    optimisticToggle: true,
    showExpandAllButtons: false,
    showNodeIcon: false,
    showNodeTitle: false,
    onCheck: () => { /* noop */ },
    onClick: () => { /* noop */ },
    onExpand: () => { /* noop */ },
};


// eslint-disable-next-line import/prefer-default-export
export { CHECK_MODEL, DefaultCheckBoxProps };
