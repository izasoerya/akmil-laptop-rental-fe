import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { LaptopAcc } from "../models/laptop_data";

// Define the shape of a user object to match your table
interface UserAcc {
  id?: number; // ID is optional
  name: string;
  nrp?: string | null;
  pangkat?: string | null;
  kelas?: string | null;
}

class SupabaseService {
  api: SupabaseClient;

  constructor() {
    this.api = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_KEY!
    );
  }

  async fetchLaptopAcc(): Promise<LaptopAcc[]> {
    const { data, error } = await this.api
      .from("laptop_acc")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  subscribeLaptopAccChanges(onChange: (payload: any) => void): {
    unsubscribe: () => void;
  } {
    const channel = this.api
      .channel("laptop_acc_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "laptop_acc" },
        onChange
      )
      .subscribe();

    return {
      unsubscribe: () => this.api.removeChannel(channel),
    };
  }

  async insertLaptopAcc(item: string): Promise<void> {
    const { data: lastRecord, error: fetchError } = await this.api
      .from("laptop_acc")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (fetchError) throw fetchError;

    const nextId = lastRecord ? lastRecord.id + 1 : 1;
    const { error } = await this.api.from("laptop_acc").insert({
      id: nextId,
      name: item,
    });
    if (error) throw error;
  }

  async deleteLaptopAcc(id: number): Promise<void> {
    const { error } = await this.api.from("laptop_acc").delete().eq("id", id);
    if (error) throw error;
  }

  async loginAdmin(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.api
      .from("admin_acc")
      .select("password")
      .eq("email", email)
      .single();

    if (error || !data) {
      console.error("Login error:", error);
      return false;
    }

    return data.password === password;
  }

  // Updated to accept the UserAcc type with an optional id
  async insertUserAcc(user: UserAcc): Promise<void> {
    const { error } = await this.api.from("user_acc").insert(user);
    if (error) throw error;
  }

  async fetchUserTable(): Promise<any[]> {
    const { data, error } = await this.api.from("user_acc").select("*");
    if (error) throw error;
    return data || [];
  }
}

export default new SupabaseService();
