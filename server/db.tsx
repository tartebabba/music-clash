import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://ubmzmglsaigdsxuhgkmv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibXptZ2xzYWlnZHN4dWhna212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYxOTMzMTUsImV4cCI6MjAzMTc2OTMxNX0.dAxuKuUP5yTDrP5pQK-FO--SSpyKE9j1GWKd6S6elDU")
async function getGames() {
  const { data } = await supabase.from("games").select()
  console.log(data)
}

export default getGames