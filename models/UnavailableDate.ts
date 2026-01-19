import { Hall } from "./Hall";

export interface UnavailableDate {
  id: number;
  hall: Hall;
  date: Date;
  reason?: string;
}
