export interface User {
  firstName: string;
  lastName: string;
  password: string;
  birthDate: string; // ISO format: "1999-07-25T00:00:00Z"
  weight: number;
  bodyFatPercentage: number;
  bloodType:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-";
  targetSport: string;
 profileImageBase64?: string;
}
