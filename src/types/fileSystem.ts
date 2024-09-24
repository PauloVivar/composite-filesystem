export interface ElementoSistemaArchivo {
  id: number;
  nombre: string;
  tipo: 'archivo' | 'carpeta';
  tamanio?: number;
  carpetaPadreId?: number | null;
}

export interface Archivo extends ElementoSistemaArchivo {
  tipo: 'archivo';
  tamanio: number;
}

export interface Carpeta extends ElementoSistemaArchivo {
  tipo: 'carpeta';
  elementos?: ElementoSistemaArchivo[];
}