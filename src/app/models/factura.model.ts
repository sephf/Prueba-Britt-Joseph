export interface Factura {
  DETALLES: DetalleFactura[];
  ALERTA?: string;
}

export interface DetalleFactura {
  LINEA: number;
  CODIGO_ARTICULO: string;
  ARTICULO: string;
  PRECIO: number;
  CANTIDAD: number;
  TOTAL_LINEA: number;
}