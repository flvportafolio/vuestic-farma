export default {
  canListarPedidos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.pedidos) ?? false;
    return (item.listar === 1);
  },
  canCrearPedidos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.pedidos) ?? false;
    return (item.crear === 1);
  },
  canEditarPedidos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.pedidos) ?? false;
    return (item.editar === 1);
  },
  canEliminarPedidos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.pedidos) ?? false;
    return (item.eliminar === 1);
  },
  canImprimirPedidos(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.pedidos) ?? false;
    return (item.imprimir === 1);
  },
};
