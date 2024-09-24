import React from 'react';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { Carpeta } from '../types/fileSystem';

interface FileTreeProps {
  carpetas: Carpeta[];
  onSelectCarpeta: (id: number) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ carpetas, onSelectCarpeta }) => {
  const convertirATreeNodes = (carpetas: Carpeta[]): TreeNode[] => {
    return carpetas.map(carpeta => ({
      key: carpeta.id.toString(),
      label: carpeta.nombre,
      data: carpeta,
      icon: 'pi pi-folder',
      children: carpeta.elementos ? convertirATreeNodes(carpeta.elementos.filter(elem => elem.tipo === 'carpeta') as Carpeta[]) : []
    }));
  };

  const seleccionarNodo = (node: TreeNode) => {
    if (node.data) {
      onSelectCarpeta(node.data.id);
    }
  };

  return (
    <Tree
      value={convertirATreeNodes(carpetas)}
      selectionMode="single"
      onSelect={(e) => seleccionarNodo(e.node)}
      className="w-full md:w-30rem"
    />
  );
};