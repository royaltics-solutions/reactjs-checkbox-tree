
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import React, { useState, useCallback, useMemo } from 'react';
import Button from './Button.js'
import { CheckboxTreeProps, Icons, CheckboxTreeNode, TreeNodeInfo } from '../types';
import { DefaultCheckBoxProps } from './constants.js';
import NodeModel from './NodeModel.js';
import TreeNode from './TreeNode.js';
import { memoize } from 'lodash';

const MemoizedTreeNode = React.memo(TreeNode);

function CheckboxTree(props: CheckboxTreeProps) {
	const mergedProps: Required<CheckboxTreeProps> = { ...DefaultCheckBoxProps, ...props };
	const { nodes, checked, expanded, id, disabled, checkModel, noCascade, onCheck, onExpand, onClick, expandDisabled, expandOnClick, icons, lang,
		onlyLeafCheckboxes, optimisticToggle, showNodeIcon, showNodeTitle, showExpandAllButtons, direction, nativeCheckboxes } = mergedProps;


	const [componentId] = useState<string>(id || `rct-${nanoid()}`);

	// UPDATE: Usamos useMemo para crear y actualizar el NodeModel y derivar flatNodesState
	const [model, flatNodesState] = useMemo(() => {
		// Crea una nueva instancia de NodeModel o re-usa la existente para evitar recrearla en cada render
		// Siempre crea uno nuevo si hay cambio en mergedProps
		const currentModel = new NodeModel(mergedProps);
		// Asegura que el modelo se inicializa con los nodos y estados correctos
		currentModel.flattenNodes(nodes);
		currentModel.deserializeLists({ checked, expanded });

		return [currentModel, currentModel.getNodes()];
	}, [nodes, checked, expanded, disabled, mergedProps]); // Dependencias de useMemo

	// UPDATE: Eliminamos el useEffect complejo. El estado ahora se deriva de las props directamente via useMemo.
	// useEffect para actualizaciones, ya no es necesario el estado interno prevPropsRef o su lógica compleja.
	// const prevPropsRef = useRef({ nodes, checked, expanded, disabled }); // REMOVED

	const combineMemorizedIcons = useMemo(() => {
		const defaultIcons = DefaultCheckBoxProps.icons;
		return memoize((customIcons: Partial<Icons>) => ({ ...defaultIcons, ...customIcons }));
	}, []);

	const combinedIcons = useMemo(() => combineMemorizedIcons(icons), [icons, combineMemorizedIcons]);

	const onCheckHandler = useCallback((nodeInfo: TreeNodeInfo) => {
		const newModel = model.clone();
		newModel.toggleChecked(nodeInfo, nodeInfo.checked!, checkModel, noCascade);
		onCheck(newModel.serializeList('checked'), { ...newModel.getNode(nodeInfo.value), ...nodeInfo } as CheckboxTreeNode);
		// UPDATE: Forzamos un re-render actualizando el estado, lo que disparará el useMemo
		// que a su vez re-calcula el NodeModel y flatNodesState.
	}, [checkModel, noCascade, onCheck, model]);

	const onExpandHandler = useCallback((nodeInfo: TreeNodeInfo) => {
		const newModel = model.clone();
		newModel.toggleNode(nodeInfo.value, 'expanded', nodeInfo.expanded!);
		onExpand(newModel.serializeList('expanded'), { ...newModel.getNode(nodeInfo.value), ...nodeInfo } as CheckboxTreeNode);
		// UPDATE: No es necesario setFlatNodesState aquí si las props son controladas.
	}, [onExpand, model]);

	const onNodeClickHandler = useCallback((nodeInfo: TreeNodeInfo) => {
		if (onClick) {
			const node = model.getNode(nodeInfo.value);
			onClick({ ...node, ...nodeInfo } as CheckboxTreeNode);
		}
	}, [onClick, model]);

	const expandAllNodes = useCallback((expand = true) => {
		const newModel = model.clone();
		onExpand(
			newModel.expandAllNodes(expand)
				.serializeList('expanded'),
		);
		// UPDATE: No es necesario setFlatNodesState aquí si las props son controladas.
	}, [onExpand, model]);

	const onExpandAllHandler = useCallback(() => {
		expandAllNodes(true);
	}, [expandAllNodes]);

	const onCollapseAllHandler = useCallback(() => {
		expandAllNodes(false);
	}, [expandAllNodes]);

	const isEveryChildChecked = useCallback((node: CheckboxTreeNode): boolean => {
		if (!node.children || node.children.length === 0) return true;
		return node.children.every(
			(child) => flatNodesState[child.value]?.checked, // UPDATE: Usar flatNodesState directamente
		);
	}, [flatNodesState]);

	const isSomeChildChecked = useCallback((node: CheckboxTreeNode): boolean => {
		if (!node.children || node.children.length === 0) return false;
		return node.children.some(
			(child) => flatNodesState[child.value]?.checked, // UPDATE: Usar flatNodesState directamente
		);
	}, [flatNodesState]);

	const determineShallowCheckState = useCallback((node: CheckboxTreeNode, noCascadeProp: boolean): 0 | 1 | 2 => {
		const flatNode = flatNodesState[node.value]; // UPDATE: Usar flatNodesState directamente

		if (!flatNode) return 0;

		if (flatNode.isLeaf || noCascadeProp || (node.children && node.children.length === 0)) {
			return flatNode.checked ? 1 : 0;
		}

		if (isEveryChildChecked(node)) return 1;
		if (isSomeChildChecked(node)) return 2;

		return 0;
	}, [isEveryChildChecked, isSomeChildChecked, flatNodesState]); // UPDATE: Dependencia flatNodesState

	const renderTreeNodes = useCallback((treeNodesToRender: CheckboxTreeNode[], parent?: CheckboxTreeNode): React.ReactNode => {
		return treeNodesToRender.map((node) => {
			const key = node.value;
			const flatNode = flatNodesState[node.value];
			if (!flatNode) return null;

			const checkState = determineShallowCheckState(node, noCascade);

			const children = flatNode.isParent && flatNode.expanded ? renderTreeNodes(node.children!, node) : null;

			const showCheckbox = onlyLeafCheckboxes ? flatNode.isLeaf : flatNode.showCheckbox;

			const parentExpanded = parent?.value ? flatNodesState[parent.value]?.expanded : true;
			if (!parentExpanded && parent?.value) {
				return null;
			}

			return (
				<MemoizedTreeNode
					key={key}
					checked={checkState}
					className={node.className}
					disabled={flatNode.disabled || disabled}
					expandDisabled={expandDisabled}
					expandOnClick={expandOnClick}
					expanded={flatNode.expanded}
					icon={node.icon}
					icons={combinedIcons}
					isLeaf={flatNode.isLeaf}
					isParent={flatNode.isParent}
					label={node.label}
					lang={lang}
					optimisticToggle={optimisticToggle}
					showCheckbox={showCheckbox}
					showNodeIcon={showNodeIcon}
					title={showNodeTitle ? node.title || node.label : flatNode.title}
					treeId={componentId}
					nativeCheckboxes={nativeCheckboxes}
					value={node.value}
					onCheck={onCheckHandler}
					onClick={onNodeClickHandler}
					onExpand={onExpandHandler}
				>
					{children}
				</MemoizedTreeNode>
			);
		});
	}, [
		noCascade, onlyLeafCheckboxes, expandDisabled, expandOnClick, combinedIcons,
		lang, optimisticToggle, showNodeIcon, showNodeTitle, componentId, disabled,
		onCheckHandler, onNodeClickHandler, onExpandHandler,
		determineShallowCheckState, flatNodesState
	]);

	const renderExpandAll = useCallback((): React.ReactNode => {
		if (!showExpandAllButtons) {
			return null;
		}

		return (
			<div className="rct-options">
				<Button
					className="rct-option rct-option-expand-all"
					title={lang.expandAll}
					onClick={onExpandAllHandler}
				>
					{icons.expandAll} Expandir
				</Button>
				<Button
					className="rct-option rct-option-collapse-all"
					title={lang.collapseAll}
					onClick={onCollapseAllHandler}
				>
					{icons.collapseAll} Contraer
				</Button>
			</div>
		);
	}, [showExpandAllButtons, lang, icons, onExpandAllHandler, onCollapseAllHandler]);


	const treeNodes = useMemo(() => renderTreeNodes(nodes), [renderTreeNodes, nodes]);

	const className = classNames({
		'react-checkbox-tree': true,
		'rct-disabled': disabled,
		'rct-native-display': nativeCheckboxes,
		'rct-direction-rtl': direction === 'rtl',
	});


	return (
		<div className={className} id={componentId}>
			{renderExpandAll()}
			<ol>
				{treeNodes}
			</ol>
		</div>
	);
}

export default CheckboxTree;