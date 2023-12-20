import express from "express"
import cors from "cors"
import { getDatabaseConnection } from "./database"

const PORT = process.env.PORT ?? 3000
const app = express()
const debug = true
const debugTime = 1

// MIDDLEWARES
app.use(cors())
app.use(express.json())

// ROTA PRINCIPAL
app.get("/", (req, res) => res.send("Hello World!"))

// BUSCAR TODAS OS DADOS
app.get("/item", async (req, res) => {
  try {
    const db = await getDatabaseConnection();
    const resp = await db.all("SELECT id, text, date FROM todo ORDER BY id DESC");
    debug
      ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
      : res.json(resp);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// BUSCAR DADOS POR ID
app.get("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabaseConnection();
    const resp = await db.get("SELECT id, text, date FROM todo WHERE id=?", id);
    debug
      ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
      : res.json(resp);
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    res.status(500).json({ error: "Failed to fetch data by ID" });
  }
});

// CRIAR DADOS
app.post("/item", async (req, res) => {
  try {
    const { todo, date } = req.body;
    const db = await getDatabaseConnection();
    const resp = await db.run("INSERT INTO todo (text, date) VALUES (?, ?)", todo, date);
    debug
      ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
      : res.json(resp);
  } catch (error) {
    console.error("Error creating data:", error);
    res.status(500).json({ error: "Failed to create data" });
  }
});

// ATUALIZAR DADOS
app.put("/item/:id", async (req, res) => {
  try {
    const { todo } = req.body;
    const { id } = req.params;
    const db = await getDatabaseConnection();
    const resp = await db.run("UPDATE todo SET text = ? WHERE id = ?", todo, id);
    debug
      ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
      : res.json(resp);
  } catch (error) {
    console.error("Error updating data by ID:", error);
    res.status(500).json({ error: "Failed to update data by ID" });
  }
});

// ATUALIZAR DADOS (coluna)
app.patch("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, date } = req.body;
    const db = await getDatabaseConnection();
    const resp = await db.run("UPDATE todo SET text = ?, date = ? WHERE id = ?", text, date, id);
    debug
      ? setTimeout(() => { res.json(resp) }, 100 * debugTime)
      : res.json(resp);
  } catch (error) {
    console.error("Error updating data (column) by ID:", error);
    res.status(500).json({ error: "Failed to update data (column) by ID" });
  }
});

// DELETAR DADOS
app.delete("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabaseConnection();
    const resp = await db.run("DELETE FROM todo WHERE id = ?", id);
    debug
      ? setTimeout(() => { res.json(resp) }, 1000 * debugTime)
      : res.json(resp);
  } catch (error) {
    console.error("Error deleting data by ID:", error);
    res.status(500).json({ error: "Failed to delete data by ID" });
  }
});


// ⚡🔥☄️🌑🌚🌞☀️⭐💧
app.listen(PORT, () => console.log(`⚡ Server listening on port ${PORT}`))