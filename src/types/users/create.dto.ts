import { RoleType } from "./roletype";

export interface InterfaceCreateUser {
  username: string;
  password: string;
  role: RoleType;
}
