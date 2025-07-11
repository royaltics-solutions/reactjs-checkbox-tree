//UPDATE: Importación de tipos de React.
import React, { useState } from 'react';
//UPDATE: Importación de tipos específicos de CheckboxTree.
//import { CheckboxTree } from '@/src/index';
import { CheckboxTree } from '@reactjs-checkbox-tree';


import { fileSystem, empires } from './utils/common';
import { CheckboxTreeNode, CheckboxTreeProps } from '@/src/types';

function BasicExample() {
    const [checked, setChecked] = useState<string[]>([
        '/app/Http/Controllers/WelcomeController.js',
        '/app/Http/routes.js',
        '/public/assets/style.css',
        '/public/index.html',
        '/.gitignore',
    ]);
    const [expanded, setExpanded] = useState<string[]>(['/app']);

      const [checked2, setChecked2] = useState<string[]>([]);
    const [expanded2, setExpanded2] = useState<string[]>([]);

  


    return (
        <div className='grid'>
            <CheckboxTree
                checked={checked}
                expanded={expanded}
                showNodeIcon
                expandOnClick
                nodes={fileSystem}
                onCheck={setChecked}
                onExpand={setExpanded}
            />

            <CheckboxTree
                checked={checked2}
                expanded={expanded2}
                expandOnClick
                nativeCheckboxes={false}
                icons={{
                    expandOpen: '➖',
                    expandClose: '➕',
                    check: '❇️'
                }}
                nodes={empires}
                onCheck={setChecked2}
                onExpand={setExpanded2}
            />
        </div>
    );
}

export default BasicExample;