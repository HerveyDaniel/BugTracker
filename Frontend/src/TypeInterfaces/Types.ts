export interface Project{
    projectId : number;
    projectName : string;
    projectDescription : string;
    projectTickets : Ticket[];
    assignedUsers : User[]
}

export interface DemoProject{
    projectId : number;
    projectName : string;
    projectDescription : string;
    projectTickets : DemoTicket[];
    assignedUsers : DemoUser[]
}

export enum Priority {
    NotApplicable = "NOT_APPLICABLE",
    Low = "LOW",
    Medium = "MEDIUM",
    High = "HIGH"
}

export enum Progress {
    NotApplicable = "NOT_APPLICABLE",
    InProgress = "IN_PROGRESS",
    Backlog = "BACKLOG",
    Completed = "COMPLETED"
}

export enum Type {
    NotApplicable = "NOT_APPLICABLE",
    Bug = "BUG",
    Feature = "FEATURE",
    Other = "OTHER"
}


export interface Ticket {
    ticketId : number;
    ticketTitle : string;
    priorityStatus : Priority,
    ticketType : Type,
    ticketProgress : Progress,
    ticketInfo : string,
    project : Project,
    assignedUsers : User,
    ticketComments : any
}

export interface DemoComment{
    createdBy : string,
    content : string,
    createdOn : string
}

export interface DemoTicket{
    ticketId : number;
    ticketTitle : string;
    priorityStatus : Priority,
    ticketType : Type,
    ticketProgress : Progress,
    ticketInfo : string,
    project : DemoProject,
    assignedUsers : DemoUser,
    ticketComments : any
}

export interface Permissions{
    permission : string;
}

export enum Role {
    Admin = "ADMIN",
    User = " USER"
}

export enum DemoRole{
    DemoAdmin = "DEMOADMIN",
    DemoUser = "DEMOUSER"
}

export interface User {
  id : number;
  username : string;
  password : string;
  assignedProject : Project
  assignedTickets : Ticket[];
  role : Role;
}

export interface DemoUser{
    id : number;
    username : string;
    password : string;
    assignedproject : DemoProject
    assignedTickets : DemoTicket[];
    role : DemoRole;
}