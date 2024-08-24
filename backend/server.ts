import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import { z } from "zod";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateObject = { [key: string]: any };
type ConditionObject = { [key: string]: string | number };

const { Client } = pg;
const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
client.connect();

const port = 3010;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const idSchema = z.string().uuid();
const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
});
const putSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
});

function generateUpdateQuery(
  table: string,
  updates: UpdateObject,
  conditions: ConditionObject
) {
  const setClauses: string[] = [];
  //const values: any[] = []; // Use 'any' if values can be of any type
  const values: (string | number | Date | boolean)[] = [];

  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    setClauses.push(`"${key}" = $${index}`);
    values.push(value);
    index++;
  }

  const conditionClauses: string[] = [];
  for (const [key, value] of Object.entries(conditions)) {
    conditionClauses.push(`"${key}" = $${index}`);
    values.push(value);
    index++;
  }

  const query = `UPDATE "${table}" SET ${setClauses.join(
    `, `
  )} WHERE ${conditionClauses.join(` AND `)}`;
  return { query, values };
}

app.post(`/todos`, async (req, res) => {
  let parsedData;
  try {
    parsedData = postSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ errors: e.errors });
  }
  try {
    await client.query(
      `INSERT INTO todos (id, title, completed, created_at) VALUES ($1, $2, false, $3)`,
      [parsedData.id, parsedData.title, new Date()]
    );
  } catch (e) {
    return res.status(500).json({ errors: e });
  }
  res.send(`ok`);
});

app.put(`/todos/:id`, async (req, res) => {
  const todoId = idSchema.parse(req.params.id);
  const body = putSchema.parse(req.body);
  try {
    const { query, values } = generateUpdateQuery(`todos`, body, {
      id: todoId,
    });
    await client.query(query, values);
  } catch (e) {
    return res.status(500).json({ errors: e });
  }
  res.send(`ok`);
});

app.delete(`/todos/:id`, async (req, res) => {
  const todoId = idSchema.parse(req.params.id);
  try {
    await client.query(`DELETE from todos WHERE id = $1`, [todoId]);
  } catch (e) {
    return res.status(500).json({ errors: e });
  }
  res.send(`ok`);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
