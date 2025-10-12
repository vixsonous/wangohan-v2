export const UserLevel = {
  super_admin: 0,
  admin: 1,
  user: 2
}

export type UserLevel = (typeof UserLevel)[keyof typeof UserLevel];