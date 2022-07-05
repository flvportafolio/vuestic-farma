export default {
  canListarReportes(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.reportes) ?? false;
    return (item.listar === 1);
  },
  canCrearReportes(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.reportes) ?? false;
    return (item.crear === 1);
  },
  canEditarReportes(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.reportes) ?? false;
    return (item.editar === 1);
  },
  canEliminarReportes(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.reportes) ?? false;
    return (item.eliminar === 1);
  },
  canImprimirReportes(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.reportes) ?? false;
    return (item.imprimir === 1);
  },
};
