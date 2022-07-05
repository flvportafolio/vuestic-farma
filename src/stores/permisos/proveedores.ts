export default {
  canListarProveedores(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.proveedores) ?? false;
    return (item.listar === 1);
  },
  canCrearProveedores(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.proveedores) ?? false;
    return (item.crear === 1);
  },
  canEditarProveedores(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.proveedores) ?? false;
    return (item.editar === 1);
  },
  canEliminarProveedores(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.proveedores) ?? false;
    return (item.eliminar === 1);
  },
  canImprimirProveedores(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.proveedores) ?? false;
    return (item.imprimir === 1);
  },
};
