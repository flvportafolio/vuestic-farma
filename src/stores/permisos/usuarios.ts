export default {
  canListarUsuarios(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.usuarios) ?? false;
    return (item.listar === 1); // si item es undefined igual devolvera false
  },
  canCrearUsuarios(state: any) {
    const item = state.permisos.find((el:any) => el.modulo === state.slugModulos.usuarios) ?? false;
    return (item.crear === 1);
  },
  canEditarUsuarios(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.usuarios) ?? false;
    return (item.editar === 1);
  },
  canEliminarUsuarios(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.usuarios) ?? false;
    return (item.eliminar === 1);
  },
  canImprimirUsuarios(state: any) {
    const item = state.permisos.find((el: any) => el.modulo === state.slugModulos.usuarios) ?? false;
    return (item.imprimir === 1);
  },
};
