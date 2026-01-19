import { User } from "./User";
import { Hall } from "./Hall";

export interface Reservation {
  id: number;
  user: User;
  hall: Hall;
  startDateTime: Date;
  endDateTime: Date;
  numberOfGuests: number;
  status: "ACTIVE" | "CANCELLED";
  createdAt: Date;
}
