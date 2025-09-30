export interface UserAcc {
  id: number; // Primary key
  name: string; // Not null
  nrp?: string | null; // Nullable
  pangkat?: string | null; // Nullable
  kelas?: string | null; // Nullable
}
