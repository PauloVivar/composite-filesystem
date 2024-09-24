import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Archivo, ElementoSistemaArchivo } from '../types/fileSystem';

interface FileListProps {
  archivos: Archivo[];
  onSelectElemento: (elemento: Archivo | null) => void;
  elementoSeleccionado: ElementoSistemaArchivo | null;
}

export const FileList: React.FC<FileListProps> = ({ archivos, onSelectElemento, elementoSeleccionado }) => {
  return (
    <div className="file-list">
      <DataTable 
        value={archivos} 
        selectionMode="single"
        selection={elementoSeleccionado as Archivo}
        onSelectionChange={(e) => onSelectElemento(e.value as Archivo)}
        className="p-datatable-sm"
        scrollable 
        scrollHeight="100%"
      >
        <Column field="nombre" header="Nombre" />
        <Column field="tamanio" header="Tamaño (bytes)" />
      </DataTable>
    </div>
  );
};