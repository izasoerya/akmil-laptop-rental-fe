import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { LaptopAcc } from "../models/laptop_data";

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
    const { error } = await this.api.from("laptop_acc").insert({
      name: item,
    });
    if (error) throw error;
  }

  async deleteLaptopAcc(id: number): Promise<void> {
    const { error } = await this.api.from("laptop_acc").delete().eq("id", id);
    if (error) throw error;
  }
}

export default new SupabaseService();
