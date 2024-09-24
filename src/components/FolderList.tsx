import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Carpeta, ElementoSistemaArchivo } from '../types/fileSystem';
import { Button } from 'primereact/button';

interface FolderListProps {
  carpetas: Carpeta[];
  onSelectCarpeta: (carpeta: Carpeta) => void;
  onSelectElemento: (elemento: ElementoSistemaArchivo | null) => void;
  elementoSeleccionado: ElementoSistemaArchivo | null;
}

export const FolderList: React.FC<FolderListProps> = ({ 
  carpetas, 
  onSelectCarpeta,
  onSelectElemento,
  elementoSeleccionado 
}) => {

  const actionTemplate = (rowData: Carpeta) => {
    return (
      <Button 
        icon="pi pi-folder-open" 
        className="p-button-rounded p-button-text"
        onClick={() => onSelectCarpeta(rowData)}
      />
    );
  };

  return (
    <div className="folder-list">
      <DataTable 
        value={carpetas} 
        selectionMode="single"
        selection={elementoSeleccionado as Carpeta}
        onSelectionChange={(e) => onSelectElemento(e.value as Carpeta)}
        className="p-datatable-sm"
        scrollable 
        scrollHeight="100%"
      >
        <Column field="nombre" header="Nombre" />
        <Column body={actionTemplate} style={{ width: '4rem' }} />
      </DataTable>
    </div>
  );
};