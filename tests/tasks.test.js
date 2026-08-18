// tests/tasks.test.js
// Basic tests for src/tasks.js using Node's built-in test runner.
// Run with: npm test

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { writeFile, readFile } from "node:fs/promises";
import { addTask, completeTask, removeTask, listTasks, DATA_FILE, PRIORITIES } from "../src/tasks.js";

let originalData;

before(async () => {
  // Snapshot the real data file so tests don't clobber your actual tasks.
  originalData = await readFile(DATA_FILE, "utf-8").catch(() => "[]\n");
  await writeFile(DATA_FILE, "[]\n", "utf-8");
});

after(async () => {
  await writeFile(DATA_FILE, originalData, "utf-8");
});

test("addTask creates a task with an incrementing id", async () => {
  const t1 = await addTask("Buy milk");
  const t2 = await addTask("Walk the dog");
  assert.equal(t1.id, 1);
  assert.equal(t2.id, 2);
  assert.equal(t1.done, false);
});

test("addTask rejects empty text", async () => {
  await assert.rejects(() => addTask("   "));
});

test("addTask defaults priority to medium", async () => {
  const task = await addTask("Default priority task");
  assert.equal(task.priority, "medium");
});

test("addTask accepts an explicit valid priority", async () => {
  const task = await addTask("High priority task", "high");
  assert.equal(task.priority, "high");
  assert.ok(PRIORITIES.includes(task.priority));
});

test("addTask rejects an invalid priority", async () => {
  await assert.rejects(() => addTask("Bad priority task", "urgent"));
});

test("completeTask marks a task done", async () => {
  const created = await addTask("Read a book");
  const completed = await completeTask(created.id);
  assert.equal(completed.done, true);
});

test("listTasks filters by done state", async () => {
  const all = await listTasks();
  const pending = await listTasks({ done: false });
  const done = await listTasks({ done: true });
  assert.equal(all.length, pending.length + done.length);
});

test("removeTask deletes a task", async () => {
  const created = await addTask("Temporary task");
  const before = await listTasks();
  await removeTask(created.id);
  const after = await listTasks();
  assert.equal(after.length, before.length - 1);
});

test("removeTask throws for unknown id", async () => {
  await assert.rejects(() => removeTask(999999));
});
