const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// GET all meals for the logged-in user
router.get("/", async (req, res) => {
  // In a real app, you would pass the User's Token here to identify them.
  // For now, let's assume we pass a user_id in the query or body for testing.
  const { user_id } = req.query;

  const { data, error } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("user_id", user_id)
    .order("eaten_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST a new meal
router.post("/", async (req, res) => {
  const { user_id, name, calories, protein_g, carbs_g, fat_g, meal_type } =
    req.body;

  const { data, error } = await supabase
    .from("meal_logs")
    .insert([{ user_id, name, calories, protein_g, carbs_g, fat_g, meal_type }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;
