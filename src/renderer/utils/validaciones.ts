// Validadores reutilizables
export const validadores = {
  // Validar que no esté vacío
  requerido: (valor: any): string | null => {
    if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
      return 'Este campo es requerido';
    }
    return null;
  },

  // Validar cantidad (número positivo)
  cantidad: (valor: any): string | null => {
    const num = parseFloat(valor);
    if (isNaN(num)) {
      return 'Debe ser un número válido';
    }
    if (num <= 0) {
      return 'Debe ser un número mayor a 0';
    }
    return null;
  },

  // Validar color HEX
  colorHex: (valor: string): string | null => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(valor)) {
      return 'Formato de color inválido. Use #RRGGBB';
    }
    return null;
  },

  // Validar nombre (mínimo 3 caracteres)
  nombre: (valor: string): string | null => {
    if (!valor || valor.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (valor.trim().length > 50) {
      return 'El nombre no puede exceder 50 caracteres';
    }
    return null;
  },

  // Validar email
  email: (valor: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valor)) {
      return 'Email inválido';
    }
    return null;
  },

  // Validar descripción
  descripcion: (valor: string): string | null => {
    if (!valor || valor.trim().length < 5) {
      return 'La descripción debe tener al menos 5 caracteres';
    }
    if (valor.trim().length > 500) {
      return 'La descripción no puede exceder 500 caracteres';
    }
    return null;
  },

  // Validar fecha (no en el futuro)
  fecha: (valor: string): string | null => {
    const fecha = new Date(valor);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      return 'Fecha inválida';
    }

    if (fecha > hoy) {
      return 'La fecha no puede ser en el futuro';
    }

    return null;
  },
};

// Formatos
export const formatos = {
  // Formatear moneda
  moneda: (cantidad: number, moneda: string = 'COP'): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 0,
    }).format(cantidad);
  },

  // Formatear fecha
  fecha: (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Formatear fecha corta
  fechaCorta: (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CO');
  },

  // Formatear porcentaje
  porcentaje: (valor: number, decimales: number = 2): string => {
    return `${(valor * 100).toFixed(decimales)}%`;
  },
};

// Utilidades
export const utilidades = {
  // Generar color aleatorio
  colorAleatorio: (): string => {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  },

  // Obtener colores predefinidos
  coloresPredefinidos: (): string[] => [
    '#FF6B6B', // Rojo
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul
    '#FFA07A', // Naranja
    '#98D8C8', // Verde menta
    '#F7DC6F', // Amarillo
    '#BB8FCE', // Púrpura
    '#85C1E2', // Azul claro
    '#F8B88B', // Durazno
    '#A8E6CF', // Verde pastel
  ],

  // Calcular días transcurridos
  diasTranscurridos: (fecha: string): number => {
    const ahora = new Date();
    const fechaObj = new Date(fecha);
    const diferencia = ahora.getTime() - fechaObj.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  },

  // Truncar texto
  truncar: (texto: string, longitud: number = 50): string => {
    if (texto.length <= longitud) return texto;
    return texto.substring(0, longitud) + '...';
  },

  // Capitalizar
  capitalizar: (texto: string): string => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  },
};
