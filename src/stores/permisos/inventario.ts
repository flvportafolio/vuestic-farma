export default {
  canListarInventario(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.inventario) ?? false;
    return (item.listar === 1);
  },
  canCrearInventario(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.inventario) ?? false;
    return (item.crear === 1);
  },
  canEditarInventario(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.inventario) ?? false;
    return (item.editar === 1);
  },
  canEliminarInventario(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.inventario) ?? false;
    return (item.eliminar === 1);
  },
  canImprimirInventario(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.inventario) ?? false;
    return (item.imprimir === 1);
  },
};
