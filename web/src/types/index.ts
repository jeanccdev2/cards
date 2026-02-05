 export type CardStatus = 'done' | 'pending' | 'doing';
 
 export interface Card {
   id: string;
   createdAt: Date;
   updatedAt: Date;
   title: string;
   content: string;
   status: CardStatus;
   userId: string;
 }
 
 export interface User {
   id: string;
   createdAt: Date;
   updatedAt: Date;
   name: string;
   email: string;
 }
 
 export interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
 }