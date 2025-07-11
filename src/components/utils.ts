// Define la estructura mínima de un nodo para esta función
interface Node {
    value: string;
    children?: Node[];
}


/**
 * Expande los nodos de un árbol hasta un nivel objetivo.
 *
 * @param nodes Los nodos a recorrer.
 * @param targetLevel La profundidad máxima a la que se deben expandir los nodos.
 * @param currentLevel El nivel actual en la cadena recursiva.
 *
 * @returns Un array de los valores de los nodos expandidos.
 */
function expandNodesToLevel(nodes: Node[], targetLevel: number, currentLevel: number = 0): string[] {
    if (currentLevel > targetLevel) {
        return [];
    }

    let expanded: string[] = [];
    nodes.forEach((node) => {
        // Verifica si el nodo tiene hijos y si `children` es un array no vacío
        if (node.children && node.children.length > 0) {
            expanded = [
                ...expanded,
                node.value,
                ...expandNodesToLevel(node.children, targetLevel, currentLevel + 1),
            ];
        }
    });
    return expanded;
}



export { expandNodesToLevel };