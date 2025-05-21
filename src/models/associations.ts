// associations.ts
import Course from "./Course"
import Unit from "./Unit"
import Lesson from "./Lesson"
import { User } from "./User"
import { Role } from "./Role"
import { RoleUser } from "./RoleUser"
import { Permission } from "./Permission"
import { RefreshToken } from "./RefreshToken"

export const setupAssociations = () => {
  // Mantener asociaciones existentes de User, Role, etc.
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

  // Nuevas asociaciones
  Course.hasMany(Unit, {
    foreignKey: "course_id",
    onDelete: "CASCADE",
  })
  Unit.belongsTo(Course, {
    foreignKey: "course_id",
  })

  Unit.hasMany(Lesson, {
    foreignKey: "unit_id",
    onDelete: "CASCADE",
  })
  Lesson.belongsTo(Unit, {
    foreignKey: "unit_id",
  })
}
