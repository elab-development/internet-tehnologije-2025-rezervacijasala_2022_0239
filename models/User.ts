import { Role } from "./Role";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: Role;
  createdAt: Date;
}
