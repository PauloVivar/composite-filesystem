import axios from 'axios';
import { Carpeta, Archivo, ElementoSistemaArchivo } from '../types/fileSystem';

const API_BASE_URL = 'http://localhost:8081/api/v1/filesystem';

export const api = {
  listarTodosLosElementos: () => 
    axios.get<ElementoSistemaArchivo[]>(`${API_BASE_URL}/elementos`),
  
  listarTodasLasCarpetas: () => 
    axios.get<Carpeta[]>(`${API_BASE_URL}/carpetas`),
  
  listarTodosLosArchivos: () => 
    axios.get<Archivo[]>(`${API_BASE_URL}/archivos`),
  
  listarContenidoCarpeta: (id: number) => 
    axios.get<ElementoSistemaArchivo[]>(`${API_BASE_URL}/carpeta/${id}`),
  
  crearArchivo: (archivo: Archivo) => 
    axios.post<Archivo>(`${API_BASE_URL}/archivo`, archivo),
  
  crearCarpeta: (carpeta: Carpeta) => 
    axios.post<Carpeta>(`${API_BASE_URL}/carpeta`, carpeta),
  
  eliminarElemento: (id: number) => 
    axios.delete(`${API_BASE_URL}/${id}`),
  
  obtenerTamanio: (id: number) => 
    axios.get<number>(`${API_BASE_URL}/tamanio/${id}`),
  
  moverElemento: (id: number, carpetaDestinoId: number) => 
    axios.put(`${API_BASE_URL}/mover/${id}`, null, { params: { carpetaDestinoId } }),
};