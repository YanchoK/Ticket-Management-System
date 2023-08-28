import { User } from "./user_interface"

export interface Ticket {
    id?: number;
    shortDescription: string;
    description: string | null;
    state: TicketState;
    priority: TicketPriority;
    assignedToId?: string | null;
    assignedTo?: User | null;
  }
  
  export enum TicketState {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW = 'REVIEW',
    DONE = 'DONE',
  }
  
  export enum TicketPriority {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    MODERATE = 'MODERATE',
    LOW = 'LOW',
  }
  