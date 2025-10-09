export interface LaptopAcc {
  id: number;
  name: string;
  last_rented?: Date | null;
  condition: string;
  user_id?: number | null;
}
