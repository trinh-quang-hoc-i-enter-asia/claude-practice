#!/usr/bin/env node
// src/index.js
// CLI entry point. Parses argv and delegates to src/tasks.js.
// Kept intentionally minimal — no dependencies — so the whole project stays
// easy to read in one sitting while you practice Claude Code on it.

import { addTask, completeTask, removeTask, listTasks, searchTasks } from "./tasks.js";

const HELP = `todo — a tiny task manager

Usage:
  todo add "<text>" [--priority low|medium|high]   Add a new task (default: medium)
  todo list [--done|--pending]   List tasks (default: all)
  todo done <id>          Mark a task as done
  todo remove <id>        Remove a task
  todo search <keyword>   Find tasks whose text contains keyword
  todo help               Show this help
`;

function formatTask(task) {
  const box = task.done ? "[x]" : "[ ]";
  return `${box} #${task.id}  ${task.text}  (${task.priority})`;
}

async function main(argv) {
  const [command, ...args] = argv;

  switch (command) {
    case "add": {
      const priorityIdx = args.indexOf("--priority");
      let priority;
      let textArgs = args;
      if (priorityIdx !== -1) {
        priority = args[priorityIdx + 1];
        if (priority === undefined) {
          throw new Error("--priority requires a value (low, medium, or high)");
        }
        textArgs = [...args.slice(0, priorityIdx), ...args.slice(priorityIdx + 2)];
      }
      const text = textArgs.join(" ");
      const task =
        priority === undefined ? await addTask(text) : await addTask(text, priority);
      console.log(`Added: ${formatTask(task)}`);
      break;
    }
    case "list": {
      const flag = args[0];
      const filter =
        flag === "--done" ? { done: true } : flag === "--pending" ? { done: false } : {};
      const tasks = await listTasks(filter);
      if (tasks.length === 0) {
        console.log("No tasks.");
      } else {
        tasks.forEach((t) => console.log(formatTask(t)));
      }
      break;
    }
    case "done": {
      const task = await completeTask(args[0]);
      console.log(`Completed: ${formatTask(task)}`);
      break;
    }
    case "remove": {
      const task = await removeTask(args[0]);
      console.log(`Removed: ${formatTask(task)}`);
      break;
    }
    case "search": {
      const keyword = args.join(" ");
      const tasks = await searchTasks(keyword);
      if (tasks.length === 0) {
        console.log("No matching tasks.");
      } else {
        tasks.forEach((t) => console.log(formatTask(t)));
      }
      break;
    }
    case "help":
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main(process.argv.slice(2)).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
});
