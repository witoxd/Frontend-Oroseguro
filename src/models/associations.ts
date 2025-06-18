import Cliente from "./Cliente"
import Empeno from "./Empeno"
import Prenda from "./Prenda"
import Abono from "./Abono"
import PrendaPerdida from "./PrendaPerdida"
import { User } from "./User"
import { Role } from "./Role"
import { RoleUser } from "./RoleUser"
import { Permission } from "./Permission"
import { RefreshToken } from "./RefreshToken"

export const setupAssociations = () => {
  // Asociaciones del sistema de autenticación (mantener)
  User.hasMany(RoleUser, {
    foreignKey: "user_id",
    onDelete: "RESTRICT",
  })
  RoleUser.belongsTo(User, {
    foreignKey: "user_id",
  })

  Role.hasMany(RoleUser, {
    foreignKey: "role_id",
    onDelete: "RESTRICT",
  })
  RoleUser.belongsTo(Role, {
    foreignKey: "role_id",
  })

  Role.hasMany(Permission, {
    foreignKey: "role_id",
    onDelete: "RESTRICT",
  })
  Permission.belongsTo(Role, {
    foreignKey: "role_id",
  })

  User.hasMany(RefreshToken, {
    foreignKey: "user_id",
    onDelete: "RESTRICT",
  })
  RefreshToken.belongsTo(User, {
    foreignKey: "user_id",
  })

  // Nuevas asociaciones del sistema OroSeguro

  // Cliente -> Empeño (1:N)
  Cliente.hasMany(Empeno, {
    foreignKey: "cliente_id",
    onDelete: "RESTRICT", // No permitir eliminar cliente si tiene empeños
    as: "empenos",
  })
  Empeno.belongsTo(Cliente, {
    foreignKey: "cliente_id",
    as: "cliente",
  })

  // Empeño -> Prenda (1:N)
  Empeno.hasMany(Prenda, {
    foreignKey: "empeno_id",
    onDelete: "CASCADE", // Si se elimina el empeño, eliminar las prendas
    as: "prendas",
  })
  Prenda.belongsTo(Empeno, {
    foreignKey: "empeno_id",
    as: "empeno",
  })

  // Empeño -> Abono (1:N)
  Empeno.hasMany(Abono, {
    foreignKey: "empeno_id",
    onDelete: "CASCADE", // Si se elimina el empeño, eliminar los abonos
    as: "abonos",
  })
  Abono.belongsTo(Empeno, {
    foreignKey: "empeno_id",
    as: "empeno",
  })

  // Empeño -> PrendaPerdida (1:1)
  Empeno.hasOne(PrendaPerdida, {
    foreignKey: "empeno_id",
    onDelete: "CASCADE",
    as: "prendaPerdida",
  })
  PrendaPerdida.belongsTo(Empeno, {
    foreignKey: "empeno_id",
    as: "empeno",
  })
}
