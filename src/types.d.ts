export interface Transaccion {
    id: string;
    cuentaId: string;
    tipo: 'ingreso' | 'gasto';
    cantidad: number;
    tipoGasto: string;
    fecha: string;
    descripcion: string;
    fuente?: string;
    createdAt: string;
    updatedAt: string;
}
export interface Cuenta {
    id: string;
    nombre: string;
    tipo: string;
    banco: string;
    saldo: number;
    color: string;
    createdAt: string;
    updatedAt: string;
}
export interface TipoGasto {
    id: string;
    nombre: string;
    color: string;
    icono?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ResumenFinanciero {
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    gastosPorTipo: {
        [key: string]: number;
    };
    gastosPorMes: {
        [key: string]: number;
    };
    promedioAnual: number;
    promedioPorTipo: {
        [key: string]: number;
    };
}
