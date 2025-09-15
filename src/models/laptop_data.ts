export interface LaptopAcc {
  id: bigint;
  name: string;
  last_rented?: Date | null;
  user_id?: bigint | null;
}
