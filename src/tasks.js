// src/tasks.js
// Core data logic for the Todo CLI. Kept separate from src/index.js (the CLI
// wiring) on purpose — see CLAUDE.md "Architecture" section for why.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_FILE = path.join(__dirname, "..", "data", "tasks.json");

export const PRIORITIES = ["low", "medium", "high"];

/**
 * Read all tasks from the data file. Returns an empty array if the file
 * doesn't exist yet or is empty.
 * @returns {Promise<Array<{id: number, text: string, done: boolean, createdAt: string, priority: "low"|"medium"|"high"}>>}
 */
export async function loadTasks() {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

/**
 * Persist the given tasks array to the data file as pretty-printed JSON.
 * @param {Array} tasks
 */
export async function saveTasks(tasks) {
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2) + "\n", "utf-8");
}

/**
 * Add a new task and persist it.
 * @param {string} text
 * @param {"low"|"medium"|"high"} [priority="medium"]
 * @returns {Promise<object>} the created task
 */
export async function addTask(text, priority = "medium") {
  if (!text || !text.trim()) {
    throw new Error("Task text must not be empty");
  }
  if (!PRIORITIES.includes(priority)) {
    throw new Error(`Priority must be one of: ${PRIORITIES.join(", ")}`);
  }
  const tasks = await loadTasks();
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task = {
    id: nextId,
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
    priority,
  };
  tasks.push(task);
  await saveTasks(tasks);
  return task;
}

/**
 * Mark a task as done by id.
 * @param {number} id
 * @returns {Promise<object>} the updated task
 */
export async function completeTask(id) {
  const tasks = await loadTasks();
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) throw new Error(`Task ${id} not found`);
  task.done = true;
  await saveTasks(tasks);
  return task;
}

/**
 * Remove a task by id.
 * @param {number} id
 * @returns {Promise<object>} the removed task
 */
export async function removeTask(id) {
  const tasks = await loadTasks();
  const idx = tasks.findIndex((t) => t.id === Number(id));
  if (idx === -1) throw new Error(`Task ${id} not found`);
  const [removed] = tasks.splice(idx, 1);
  await saveTasks(tasks);
  return removed;
}

/**
 * List tasks, optionally filtered.
 * @param {{ done?: boolean }} filter
 */
export async function listTasks(filter = {}) {
  const tasks = await loadTasks();
  if (typeof filter.done === "boolean") {
    return tasks.filter((t) => t.done === filter.done);
  }
  return tasks;
}

/**
 * Search tasks whose text contains the given keyword (case-insensitive).
 * @param {string} keyword
 * @returns {Promise<Array<object>>} matching tasks
 */
export async function searchTasks(keyword) {
  if (!keyword || !keyword.trim()) {
    throw new Error("Search keyword must not be empty");
  }
  const tasks = await loadTasks();
  const needle = keyword.trim().toLowerCase();
  return tasks.filter((t) => t.text.toLowerCase().includes(needle));
}
