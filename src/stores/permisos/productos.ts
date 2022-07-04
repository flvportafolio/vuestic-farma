export default {
  canListarProductos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.productos) ?? false;
    return (item.listar === 1);
  },
  canCrearProductos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.productos) ?? false;
    return (item.crear === 1);
  },
  canEditarProductos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.productos) ?? false;
    return (item.editar === 1);
  },
  canEliminarProductos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.productos) ?? false;
    return (item.eliminar === 1);
  },
  canImprimirProductos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.productos) ?? false;
    return (item.imprimir === 1);
  },
};
