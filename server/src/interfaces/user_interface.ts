import { Ticket } from "./ticket_interface"

export interface User {
  // id?: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  // assignedTickets?: Ticket[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  QA = 'QA',
  MANAGER = 'MANAGER',
}
