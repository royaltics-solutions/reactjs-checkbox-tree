# reactjs-checkbox-tree (Fork by royaltics-solutions)

[![npm](https://img.shields.io/npm/v/reactjs-checkbox-tree.svg?style=flat-square)](https://www.npmjs.com/package/reactjs-checkbox-tree)  
[![Build Status](https://img.shields.io/github/actions/workflow/status/jakezatecky/reactjs-checkbox-tree/main.yml?branch=master&style=flat-square)](https://github.com/jakezatecky/reactjs-checkbox-tree/actions/workflows/main.yml)  
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/reactjs-checkbox-tree/master/LICENSE.txt)

> A simple and elegant checkbox tree for React.

![Demo](demo.gif)

---

## About this fork

This project is a refactor of the original [reactjs-checkbox-tree](https://github.com/jakezatecky/reactjs-checkbox-tree) by Jake Zatecky and contributors, updated and recompiled to be fully compatible with **Vite 5 (2025)** and its latest dependencies, with React 19 support.

### Major changes include:

- Full refactor to support Vite build system and ecosystem.
- Updated peerDependencies and devDependencies to React 18/19 and Vite 5.
- Removal of LESS/SCSS in favor of pure CSS with CSS variables (`--vars`) for styling.
- Updated typings for better TypeScript support.
- Complete rewrite of icons handling with ReactNode type and partial overrides.
- Codebase split and optimized for modern React and TypeScript usage.

Full credit to original author Jake Zatecky and all contributors at [reactjs-checkbox-tree homepage](https://jakezatecky.github.io/reactjs-checkbox-tree).

This fork is maintained by [royaltics-solutions](https://github.com/royaltics-solutions/reactjs-checkbox-tree) due to lack of continuity in the original project.

---

## Installation

```bash
yarn add reactjs-checkbox-tree
or
npm install reactjs-checkbox-tree --save
```

## Usage
Import the pure CSS style:

```jsx
import 'reactjs-checkbox-tree/lib/reactjs-checkbox-tree.css';
//Basic example:

import React, { useState } from 'react';
import CheckboxTree from 'reactjs-checkbox-tree';

const nodes = [{
  value: 'mars',
  label: 'Mars',
  children: [
    { value: 'phobos', label: 'Phobos' },
    { value: 'deimos', label: 'Deimos' },
  ],
}];

function Widget() {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  return (
    <CheckboxTree
      nodes={nodes}
      checked={checked}
      expanded={expanded}
      onCheck={setChecked}
      onExpand={setExpanded}
    />
  );
}

```
## Icons customization
Use iconsClass="fa4" for FontAwesome 4 support, or override icons with the icons prop:


```jsx
<CheckboxTree
  ...
  iconsClass="fa4"
  icons={{
    check: <span className="rct-icon rct-icon-check" />,
    uncheck: <span className="rct-icon rct-icon-uncheck" />,
    halfCheck: <span className="rct-icon rct-icon-half-check" />,
    expandClose: <span className="rct-icon rct-icon-expand-close" />,
    expandOpen: <span className="rct-icon rct-icon-expand-open" />,
    expandAll: <span className="rct-icon rct-icon-expand-all" />,
    collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
    parentClose: <span className="rct-icon rct-icon-parent-close" />,
    parentOpen: <span className="rct-icon rct-icon-parent-open" />,
    leaf: <span className="rct-icon rct-icon-leaf" />,
  }}
/>

```
Or integrate with @fortawesome/reactjs-fontawesome:


```jsx
import { FontAwesomeIcon } from '@fortawesome/reactjs-fontawesome'

<CheckboxTree
  ...
  icons={{
    check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon="check-square" />,
    uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['fas', 'square']} />,
    halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
    expandClose: <FontAwesomeIcon className="rct-icon rct-icon-expand-close" icon="chevron-right" />,
    expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="chevron-down" />,
    expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon="plus-square" />,
    collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon="minus-square" />,
    parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
    parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
    leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />
  }}
/>
```

## TypeScript typings (new)

```ts
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
  checkModel?: typeof CHECK_MODEL.LEAF | typeof CHECK_MODEL.ALL;
  checked?: string[];
  direction?: "ltr" | "rtl";
  disabled?: boolean;
  expandDisabled?: boolean;
  expandOnClick?: boolean;
  expanded?: string[];
  icons?: Partial<Icons>;
  id?: string | null;
  lang?: Language;
  nativeCheckboxes?: boolean;
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
```


## Fork credits
This fork is maintained by royaltics-solutions, preserving and modernizing the original work by:

Jake Zatecky and contributors
Homepage: https://jakezatecky.github.io/reactjs-checkbox-tree
Repo: https://github.com/jakezatecky/reactjs-checkbox-tree

Fork repo: https://github.com/royaltics-solutions/reactjs-checkbox-tree