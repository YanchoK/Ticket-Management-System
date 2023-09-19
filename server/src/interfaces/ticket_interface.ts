import { User } from "./user_interface"

export interface Ticket {
    id?: number;
    shortDescription: string;
    description: string;
    state: TicketState;
    priority: TicketPriority;
    assignedToId?: number;
    createdDate?:Date;
    updatedDate?:Date;
    assignedTo?:User|undefined
    JIRA_ID?:string
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
  