import { useState, useCallback } from 'react';

/**
 * Hook para manejar estado de formulario
 */
export const useFormulario = <T extends Record<string, any>>(inicial: T) => {
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValores((prev) => ({ ...prev, [name]: value }));
      setErrores((prev) => ({ ...prev, [name]: '' }));
    },
    []
  );

  const setError = useCallback((campo: string, error: string) => {
    setErrores((prev) => ({ ...prev, [campo]: error }));
  }, []);

  const reset = useCallback(() => {
    setValores(inicial);
    setErrores({});
  }, [inicial]);

  return { valores, errores, handleChange, setError, reset, setValores };
};

/**
 * Hook para manejar peticiones asincrónicas
 */
export const useFetch = <T>(fn: () => Promise<T>, deps: any[] = []) => {
  const [datos, setDatos] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await fn();
      setDatos(resultado);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, deps);

  return { datos, loading, error, ejecutar };
};

/**
 * Hook para manejar paginación
 */
export const usePaginacion = <T>(items: any[], porPagina: number = 10) => {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(items.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const itemsPagina = items.slice(inicio, fin);

  const irAPagina = useCallback(
    (pagina: number) => {
      setPaginaActual(Math.min(Math.max(1, pagina), totalPaginas));
    },
    [totalPaginas]
  );

  return {
    paginaActual,
    totalPaginas,
    itemsPagina,
    irAPagina,
    irAPaginaAnterior: () => irAPagina(paginaActual - 1),
    irAPaginaSiguiente: () => irAPagina(paginaActual + 1),
  };
};

/**
 * Hook para estado local almacenado
 */
export const useAlmacenamiento = <T>(clave: string, valorInicial: T) => {
  const [valor, setValor] = useState<T>(() => {
    try {
      const item = localStorage.getItem(clave);
      return item ? JSON.parse(item) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  const guardar = useCallback(
    (nuevoValor: T) => {
      try {
        localStorage.setItem(clave, JSON.stringify(nuevoValor));
        setValor(nuevoValor);
      } catch (err) {
        console.error('Error guardando en localStorage:', err);
      }
    },
    [clave]
  );

  return [valor, guardar] as const;
};

/**
 * Hook para estado de modal/diálogo
 */
export const useModal = (inicial: boolean = false) => {
  const [abierto, setAbierto] = useState(inicial);

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);
  const alternar = useCallback(() => setAbierto((prev) => !prev), []);

  return { abierto, abrir, cerrar, alternar };
};

/**
 * Hook para gestión de filtros
 */
export const useFiltros = <T extends Record<string, any>>(filtroInicial: T) => {
  const [filtros, setFiltros] = useState(filtroInicial);

  const agregarFiltro = useCallback((clave: string, valor: any) => {
    setFiltros((prev) => ({ ...prev, [clave]: valor }));
  }, []);

  const eliminarFiltro = useCallback((clave: string) => {
    setFiltros((prev) => {
      const nuevo = { ...prev };
      delete nuevo[clave];
      return nuevo;
    });
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros(filtroInicial);
  }, [filtroInicial]);

  return {
    filtros,
    agregarFiltro,
    eliminarFiltro,
    limpiarFiltros,
    setFiltros,
  };
};

/**
 * Hook para acceder a la base de datos a través de IPC
 */
export const useDatabase = () => {
  if (!window.electronAPI?.db) {
    throw new Error('Database API not available');
  }
  return window.electronAPI.db;
};
