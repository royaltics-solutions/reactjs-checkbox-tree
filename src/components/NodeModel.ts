// NodeModel.ts
import CheckboxTreeError from './CheckboxTreeError';
import { CHECK_MODEL } from './constants';
import { CheckboxTreeNode, FlatNodes, NodeModelProps, TreeNodeInfo } from '../types';

class NodeModel {
    private props: NodeModelProps;
    private flatNodes: FlatNodes;

    public _prevNodes: CheckboxTreeNode[] = [];
    public _prevDisabled: boolean = false;

    constructor(props: NodeModelProps, nodes: FlatNodes = {}) {
        this.props = props;
        this.flatNodes = nodes;
    }

    setProps(props: NodeModelProps): void {
        this.props = props;
    }

    clone(): NodeModel {
        const clonedNodes: FlatNodes = {};
        Object.keys(this.flatNodes).forEach((value) => {
            const node = this.flatNodes[value];
            clonedNodes[value] = { ...node };
        });

        return new NodeModel(this.props, clonedNodes);
    }

    getNodes(): FlatNodes {
        return this.flatNodes;
    }

    getNode(value: string): CheckboxTreeNode | undefined {
        return this.flatNodes[value];
    }

    reset(): void {
        this.flatNodes = {};
    }

    flattenNodes(nodes: CheckboxTreeNode[], parent: CheckboxTreeNode = {} as CheckboxTreeNode, depth: number = 0): void {
        if (!Array.isArray(nodes) || nodes.length === 0) {
            return;
        }

        const { disabled, noCascade } = this.props;

        nodes.forEach((node, index) => {
            const isParent = this.nodeHasChildren(node);

            if (this.flatNodes[node.value] !== undefined) {
                throw new CheckboxTreeError(
                    `Duplicate value '${node.value}' detected. All node values must be unique.`,
                );
            }

            this.flatNodes[node.value] = {
                ...node,
                parent,
                isChild: parent.value !== undefined,
                isParent,
                isLeaf: !isParent,
                showCheckbox: node.showCheckbox !== undefined ? node.showCheckbox : true,
                disabled: this.getDisabledState(node, parent, disabled, noCascade),
                treeDepth: depth,
                index,
            };

            this.flattenNodes(node.children || [], node, depth + 1);
        });
    }

    nodeHasChildren(node: CheckboxTreeNode): boolean {
        return Array.isArray(node.children) && node.children.length > 0;
    }

    getDisabledState(
        node: CheckboxTreeNode,
        parent: CheckboxTreeNode,
        disabledProp: boolean | undefined,
        noCascade: boolean | undefined,
    ): boolean {
        if (disabledProp) {
            return true;
        }

        if (!noCascade && parent.disabled) {
            return true;
        }

        return Boolean(node.disabled);
    }

    deserializeLists(lists: { checked: string[]; expanded: string[] }): void {
        const listKeys: Array<'checked' | 'expanded'> = ['checked', 'expanded'];

        Object.keys(this.flatNodes).forEach((value) => {
            listKeys.forEach((listKey) => {
                if (this.flatNodes[value]) {
                    this.flatNodes[value][listKey] = false;
                }
            });
        });

        listKeys.forEach((listKey) => {
            lists[listKey]?.forEach((value) => {
                if (this.flatNodes[value] !== undefined) {
                    this.flatNodes[value][listKey] = true;
                }
            });
        });
    }

    serializeList(key: 'checked' | 'expanded'): string[] {
        const list: string[] = [];

        Object.keys(this.flatNodes).forEach((value) => {
            const node = this.flatNodes[value];
            if (node && node[key]) {
                list.push(value);
            }
        });

        return list;
    }

    expandAllNodes(expand: boolean): NodeModel {
        Object.keys(this.flatNodes).forEach((value) => {
            const node = this.flatNodes[value];
            if (node && node.isParent) {
                node.expanded = expand;
            }
        });

        return this;
    }

    toggleChecked(
        nodeInfo: TreeNodeInfo,
        isChecked: boolean,
        checkModel: typeof CHECK_MODEL.ALL | typeof CHECK_MODEL.PARENT | typeof CHECK_MODEL.LEAF,
        noCascade: boolean,
        percolateUpward: boolean = true,
    ): NodeModel {
        const flatNode = this.flatNodes[nodeInfo.value];
        if (!flatNode || flatNode.disabled) {
            return this;
        }

        const modelHasParents = [CHECK_MODEL.PARENT, CHECK_MODEL.ALL].includes(checkModel);
        const modelHasLeaves = [CHECK_MODEL.LEAF, CHECK_MODEL.ALL].includes(checkModel);

        flatNode.checked = isChecked;
        flatNode.halfCheck = false;

        if (!noCascade) {
            // Downward propagation (direct children)
            if (modelHasLeaves && flatNode.children && flatNode.children.length > 0) {
                // UPDATE: Ensure only direct children are affected recursively.
                flatNode.children.forEach((child) => {
                    this.toggleChecked(child, isChecked, checkModel, noCascade, false);
                });
            }

            // Upward propagation (parents)
            if (percolateUpward && flatNode.isChild && modelHasParents) {
                this.toggleParentStatus(flatNode.parent as CheckboxTreeNode);
            }
        }


        return this;
    }

    toggleParentStatus(node: CheckboxTreeNode): void {
        const flatNode = this.flatNodes[node.value];
        if (!flatNode || flatNode.disabled) {
            return;
        }

        if (flatNode.children && flatNode.children.length > 0) {
            const allChildrenChecked = this.isEveryChildChecked(flatNode);
            const someChildrenChecked = this.isSomeChildChecked(flatNode);

            if (allChildrenChecked) {
                flatNode.checked = true;
                flatNode.halfCheck = false;
            } else if (someChildrenChecked) {
                flatNode.checked = false;
                flatNode.halfCheck = true;
            } else {
                flatNode.checked = false;
                flatNode.halfCheck = false;
            }
        }

        if (flatNode.isChild) {
            this.toggleParentStatus(flatNode.parent as CheckboxTreeNode);
        }
    }

    isEveryChildChecked(node: CheckboxTreeNode): boolean {
        if (!node.children || node.children.length === 0) {
            return true;
        }
        return node.children.every((child) => {
            const flatChild = this.getNode(child.value);
            return flatChild && flatChild.showCheckbox && flatChild.checked;
        });
    }

    isSomeChildChecked(node: CheckboxTreeNode): boolean {
        if (!node.children || node.children.length === 0) {
            return false;
        }
        return node.children.some((child) => {
            const flatChild = this.getNode(child.value);
            return flatChild && flatChild.showCheckbox && (flatChild.checked || flatChild.halfCheck);
        });
    }

    toggleNode(nodeValue: string, key: 'checked' | 'expanded', toggleValue: boolean): NodeModel {
        const node = this.flatNodes[nodeValue];
        if (node) {
            node[key] = toggleValue;
        }
        return this;
    }
}

export default NodeModel;