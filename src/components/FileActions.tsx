import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialog } from 'primereact/confirmdialog';
import { ElementoSistemaArchivo, Carpeta } from '../types/fileSystem';

interface FileActionsProps {
  onCreateFolder: (name: string, parentId: number | null) => void;
  onCreateFile: (name: string, size: number, parentId: number | null) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, targetFolderId: number) => void;
  onRefresh: () => void;
  elementoSeleccionado: ElementoSistemaArchivo | null;
  carpetaActual: Carpeta | null;
  carpetas: Carpeta[];
}

export const FileActions: React.FC<FileActionsProps> = ({
  onCreateFolder,
  onCreateFile,
  onDelete,
  onMove,
  onRefresh,
  elementoSeleccionado,
  carpetaActual,
  carpetas
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [createType, setCreateType] = useState<'folder' | 'file'>('folder');
  const [newItemName, setNewItemName] = useState('');
  const [newFileSize, setNewFileSize] = useState<number | null>(1024);
  const [carpetaDestinoId, setCarpetaDestinoId] = useState<number | null>(null);

  const handleCreate = () => {
    const parentId = carpetaActual ? carpetaActual.id : null;
    if (createType === 'folder') {
      onCreateFolder(newItemName, parentId);
    } else {
      onCreateFile(newItemName, newFileSize || 1024, parentId);
    }
    setShowCreateDialog(false);
    setNewItemName('');
    setNewFileSize(1024);
  };

  const handleMove = () => {
    if (elementoSeleccionado && carpetaDestinoId !== null) {
      onMove(elementoSeleccionado.id, carpetaDestinoId);
      setShowMoveDialog(false);
      setCarpetaDestinoId(null);
    }
  };

  const confirmDelete = () => {
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar ${elementoSeleccionado?.tipo === 'carpeta' ? 'esta carpeta y todo su contenido' : 'este archivo'}?`,
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onDelete(elementoSeleccionado!.id),
      reject: () => {}
    });
  };

  return (
    <div className="file-actions">
      <Button label="Nueva Carpeta" icon="pi pi-folder" onClick={() => {
        setCreateType('folder');
        setShowCreateDialog(true);
      }} />
      <Button label="Nuevo Archivo" icon="pi pi-file" onClick={() => {
        setCreateType('file');
        setShowCreateDialog(true);
      }} />
      <Button 
        label="Eliminar" 
        icon="pi pi-trash"
        onClick={confirmDelete}  
        //onClick={() => onDelete(elementoSeleccionado!.id)} 
        disabled={!elementoSeleccionado} 
      />
      <Button label="Mover" icon="pi pi-arrow-right" onClick={() => setShowMoveDialog(true)} disabled={!elementoSeleccionado} />
      <Button label="Refrescar" icon="pi pi-refresh" onClick={onRefresh} />

      <Dialog header={`Crear Nuevo ${createType === 'folder' ? 'Carpeta' : 'Archivo'}`} visible={showCreateDialog} onHide={() => setShowCreateDialog(false)}>
        <InputText value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Nombre" />
        {createType === 'file' && (
          <InputNumber value={newFileSize} onValueChange={(e) => setNewFileSize(e.value)} placeholder="Tamaño (bytes)" min={0} />
        )}
        <Button label="Crear" onClick={handleCreate} disabled={!newItemName} />
      </Dialog>

      <Dialog header="Mover Elemento" visible={showMoveDialog} onHide={() => setShowMoveDialog(false)}>
        <Dropdown
          value={carpetaDestinoId}
          options={carpetas.map(c => ({ label: c.nombre, value: c.id }))}
          onChange={(e) => setCarpetaDestinoId(e.value)}
          placeholder="Seleccione carpeta destino"
        />
        <Button label="Mover" onClick={handleMove} disabled={carpetaDestinoId === null} />
      </Dialog>
    </div>
  );
};