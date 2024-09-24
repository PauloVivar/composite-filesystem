import React, { useState, useEffect } from 'react';
import { FolderList } from './FolderList';
import { FileList } from './FileList';
import { FileActions } from './FileActions';
import { api } from '../services/api';
import { ElementoSistemaArchivo, Carpeta, Archivo } from '../types/fileSystem';

export const FileExplorer: React.FC = () => {
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [carpetaActual, setCarpetaActual] = useState<Carpeta | null>(null);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ElementoSistemaArchivo | null>(null);

  useEffect(() => {
    cargarContenidoInicial();
  }, []);

  const cargarContenidoInicial = async () => {
    try {
      const [carpetasResponse, archivosResponse] = await Promise.all([
        api.listarTodasLasCarpetas(),
        api.listarTodosLosArchivos()
      ]);
      setCarpetas(carpetasResponse.data);
      setArchivos(archivosResponse.data);
      setCarpetaActual(null);
    } catch (error) {
      console.error('Error cargando contenido inicial:', error);
    }
  };

  const cargarContenidoCarpeta = async (carpeta: Carpeta) => {
    try {
      const response = await api.listarContenidoCarpeta(carpeta.id);
      setArchivos(response.data.filter(elem => elem.tipo === 'archivo') as Archivo[]);
      setCarpetaActual(carpeta);
    } catch (error) {
      console.error('Error cargando contenido de carpeta:', error);
    }
  };

  const crearCarpeta = async (nombre: string, parentId: number | null) => {
    try {
      const nuevaCarpeta: Carpeta = { 
        nombre, 
        tipo: 'carpeta', 
        id: 0,
        carpetaPadreId: parentId
      };
      const response = await api.crearCarpeta(nuevaCarpeta);
      setCarpetas([...carpetas, response.data]);
      if (parentId === carpetaActual?.id) {
        cargarContenidoCarpeta(carpetaActual);
      }
    } catch (error) {
      console.error('Error creando carpeta:', error);
    }
  };

  const crearArchivo = async (nombre: string, tamanio: number, parentId: number | null) => {
    try {
      const nuevoArchivo: Archivo = { 
        nombre, 
        tipo: 'archivo', 
        id: 0,
        tamanio,
        carpetaPadreId: parentId
      };
      const response = await api.crearArchivo(nuevoArchivo);
      if (parentId === carpetaActual?.id || (parentId === null && carpetaActual === null)) {
        setArchivos([...archivos, response.data]);
      }
    } catch (error) {
      console.error('Error creando archivo:', error);
    }
  };

  const seleccionarElemento = (elemento: ElementoSistemaArchivo | null) => {
    setElementoSeleccionado(elemento);
  };

  const eliminarElemento = async (id: number) => {
    try {
      await api.eliminarElemento(id);
      if (elementoSeleccionado?.tipo === 'archivo') {
        setArchivos(archivos.filter(archivo => archivo.id !== id));
      } else {
        setCarpetas(carpetas.filter(carpeta => carpeta.id !== id));
        if (carpetaActual?.id === id) {
          cargarContenidoInicial();
        } else if (carpetaActual) {
          cargarContenidoCarpeta(carpetaActual);
        }
      }
      setElementoSeleccionado(null);
    } catch (error) {
      console.error('Error eliminando elemento:', error);
    }
  };

  const moverElemento = async (id: number, carpetaDestinoId: number) => {
    try {
      await api.moverElemento(id, carpetaDestinoId);
      if (carpetaActual !== null) {
        cargarContenidoCarpeta(carpetaActual);
      } else {
        cargarContenidoInicial();
      }
    } catch (error) {
      console.error('Error moviendo elemento:', error);
    }
  };

  return (
    <div className="file-explorer">
      <div className='content-area'>
        <div className='folder-area'>
          <h2>Carpetas</h2>
          <FolderList 
            carpetas={carpetas} 
            onSelectCarpeta={cargarContenidoCarpeta}
            onSelectElemento={seleccionarElemento}
            elementoSeleccionado={elementoSeleccionado}
          />
        </div>
        <div className="file-area">
          <h2>Archivos</h2>
          <FileList 
            archivos={archivos}
            onSelectElemento={setElementoSeleccionado}
            elementoSeleccionado={elementoSeleccionado}
          />
        </div>
      </div>
      <FileActions
        onCreateFolder={crearCarpeta}
        onCreateFile={crearArchivo}
        onDelete={eliminarElemento}
        onMove={moverElemento}
        elementoSeleccionado={elementoSeleccionado}
        carpetaActual={carpetaActual}
        carpetas={carpetas}
        onRefresh={cargarContenidoInicial}
      />
    </div>
  );
};