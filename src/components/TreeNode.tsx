// TreeNode.tsx
import classNames from 'classnames';
import React, { useCallback, useMemo, ReactNode, memo } from 'react';
import { TreeNodeInfo } from '../types';
import Button from './Button.js'
import NativeCheckbox from './NativeCheckbox.js';

export interface Icons {
	check: ReactNode;
	uncheck: ReactNode;
	halfCheck: ReactNode;
	expandClose: ReactNode;
	expandOpen: ReactNode;
	leaf: ReactNode;
	parentClose: ReactNode;
	parentOpen: ReactNode;
}

export interface Language {
	toggle: string;
}

export interface TreeNodeProps {
	checked: 0 | 1 | 2;
	disabled: boolean;
	expandDisabled: boolean;
	expanded?: boolean;
	icons: Icons;
	isLeaf?: boolean;
	isParent?: boolean;
	label: ReactNode;
	lang: Language;
	optimisticToggle: boolean;
	showNodeIcon: boolean;
	treeId: string;
	value: string;
	onCheck: (nodeInfo: TreeNodeInfo) => void;
	onExpand: (nodeInfo: TreeNodeInfo) => void;
	onClick?: (nodeInfo: TreeNodeInfo) => void;
	nativeCheckboxes: boolean;
	children?: ReactNode;
	className?: string;
	expandOnClick?: boolean;
	icon?: ReactNode;
	showCheckbox?: boolean;
	title?: string;
}

const defaultProps: Partial<TreeNodeProps> = {
	children: null,
	expandOnClick: false,
	icon: null,
	showCheckbox: true,
	expanded: false,
	isLeaf: false,
	isParent: false,
};

function TreeNode(props: TreeNodeProps) {
	const {
		checked,
		disabled,
		expandDisabled,
		expanded = defaultProps.expanded,
		icons,
		isLeaf = defaultProps.isLeaf,
		isParent = defaultProps.isParent,
		label,
		lang,
		optimisticToggle,
		showNodeIcon,
		treeId,
		value,
		onCheck,
		onExpand,
		children,
		className,
		nativeCheckboxes,
		expandOnClick = defaultProps.expandOnClick,
		icon = defaultProps.icon,
		showCheckbox = defaultProps.showCheckbox,
		title,
		onClick,
	} = props;

	const getCheckState = useCallback((toggle: boolean): boolean => {
		if (checked === 0 && toggle) {
			return true;
		}
		if (checked === 1 && !toggle) {
			return true;
		}
		if (checked === 2) {
			return optimisticToggle;
		}
		return false;
	}, [checked, optimisticToggle]);

	const onCheckHandler = useCallback(() => {
		onCheck({ value, checked: getCheckState(true), expanded });
	}, [value, expanded, onCheck, getCheckState]);

	const onCheckboxKeyPress = useCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
		if (event.which === 32) {
			event.preventDefault();
		}
	}, []);

	const onCheckboxKeyUp = useCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
		if ([13, 32].includes(event.keyCode)) {
			onCheckHandler();
		}
	}, [onCheckHandler]);

	const onExpandHandler = useCallback(() => {
		onExpand({ value, expanded: !expanded });
	}, [value, expanded, onExpand]);

	const onClickHandler = useCallback((event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => {
		if (event.target instanceof HTMLElement && event.target.closest('.rct-checkbox')) {
			return;
		}

		if (isParent && expandOnClick) {
			onExpandHandler();
		}
		if (onClick) {
			onClick({ value, checked: getCheckState(false), expanded });
		}
	}, [isParent, expandOnClick, value, expanded, onClick, getCheckState, onExpandHandler]);

	const renderCollapseIcon = useCallback((): ReactNode => {
		return expanded ? icons.expandOpen : icons.expandClose;
	}, [expanded, icons]);

	const renderCollapseButton = useCallback((): ReactNode => {
		if (isLeaf) {
			return (
				<span className="rct-collapse">
					<span className="rct-icon" />
				</span>
			);
		}
		return (
			<Button
				className="rct-collapse rct-collapse-btn"
				disabled={expandDisabled}
				title={lang.toggle}
				onClick={onExpandHandler}
			>
				{renderCollapseIcon()}
			</Button>
		);
	}, [isLeaf, expandDisabled, lang, onExpandHandler, renderCollapseIcon]);

	const renderCheckboxIcon = useCallback((): ReactNode => {
		if (checked === 0) {
			return icons.uncheck;
		}
		if (checked === 1) {
			return icons.check;
		}
		return icons.halfCheck;
	}, [checked, icons]);

	const renderNodeIcon = useCallback((): ReactNode => {
		if (icon !== null) {
			return icon;
		}
		if (isLeaf) {
			return icons.leaf;
		}
		return expanded ? icons.parentOpen : icons.parentClose;
	}, [icon, isLeaf, expanded, icons]);

	const renderBareLabel = useCallback((childrenContent: ReactNode): ReactNode => {
		const clickable = onClick !== undefined;

		return (
			<span className="rct-bare-label" title={title}>
				{clickable ? (
					<span
						className="rct-node-clickable"
						role="button"
						tabIndex={0}
						onClick={onClickHandler}
						onKeyDown={(e) => {
							if (e.key == 'Enter' || e.key == 'Space') {
								onClickHandler(e)
							}
						}}
					>
						{childrenContent}
					</span>
				) : childrenContent}
			</span>
		);
	}, [onClick, title, onClickHandler]);

	const renderCheckboxLabel = useCallback((childrenContent: ReactNode): ReactNode[] => {
		const clickable = onClick !== undefined;
		const inputId = `${treeId}-${String(value).split(' ').join('_')}`;

		const renderItems: ReactNode[] = [
			(
				<label key={0} htmlFor={inputId} title={title}>
					{nativeCheckboxes ?
						<NativeCheckbox
							checked={checked === 1}
							disabled={disabled}
							id={inputId}
							indeterminate={checked === 2}
							onChange={() => { }}
							onClick={onCheckHandler}
						/> :
						<span
							aria-checked={checked === 1}
							aria-disabled={disabled}
							aria-hidden="true"
							className="rct-checkbox"
							role="checkbox"
							onClick={onCheckHandler}
							tabIndex={0}
							onKeyPress={onCheckboxKeyPress}
							onKeyUp={onCheckboxKeyUp}
						>
							{renderCheckboxIcon()}
						</span>
					}
					{!clickable ? childrenContent : null}
				</label>
			),
		];

		if (clickable) {
			renderItems.push((
				<span
					key={1}
					className="rct-node-clickable"
					role="button"
					tabIndex={0}
					onClick={onClickHandler}
					onKeyPress={onClickHandler}
				>
					{childrenContent}
				</span>
			));
		}

		return renderItems;
	}, [checked, disabled, title, treeId, value, onClick, onCheckHandler, onCheckboxKeyPress, onCheckboxKeyUp, renderCheckboxIcon, onClickHandler]);

	const renderLabel = useCallback((): ReactNode => {
		const labelChildrenContent = [
			showNodeIcon ? (
				<span key={0} className="rct-node-icon">
					{renderNodeIcon()}
				</span>
			) : null,
			<span key={1} className="rct-title">
				{label}
			</span>,
		];

		return showCheckbox
			? renderCheckboxLabel(labelChildrenContent)
			: renderBareLabel(labelChildrenContent);
	}, [label, showCheckbox, showNodeIcon, renderNodeIcon, renderBareLabel, renderCheckboxLabel]);

	// UPDATE: renderChildren ahora envuelve los hijos en un <ol>
	const renderChildren = useCallback((): ReactNode => {
		if (!expanded || !children) { // Si no está expandido o no tiene hijos, no renderiza nada.
			return null;
		}
		return (
			<ol className="rct-children">
				{/* UPDATE: Añadido un <ol> para los hijos */}
				{children}
			</ol>
		);
	}, [expanded, children]);

	const nodeClass = useMemo(() => classNames({
		'rct-node': true,
		'rct-node-leaf': isLeaf,
		'rct-node-parent': !isLeaf,
		'rct-node-expanded': !isLeaf && expanded,
		'rct-node-collapsed': !isLeaf && !expanded,
		'rct-disabled': disabled,
	}, className), [isLeaf, expanded, disabled, className]);

	return (
		<li className={nodeClass}>
			<span className="rct-text">
				{renderCollapseButton()}
				{renderLabel()}
			</span>
			{renderChildren()} {/* Esto ahora llamará a renderChildren que contendrá el <ul> */}
		</li>
	);
}

export default memo(TreeNode);