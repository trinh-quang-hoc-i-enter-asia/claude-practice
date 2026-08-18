# claude-code-practice

Một Todo CLI cực đơn giản (Node.js, zero-dependency) dùng để **luyện tập
Claude Code**. Xem `PRACTICE.md` cho bài tập từng bước.

## Chạy thử

```bash
npm install       # không có dependency ngoài, nhưng chạy cho chắc
node src/index.js help
node src/index.js add "Học Claude Code"
node src/index.js list
node src/index.js done 1
npm test
```

## Cấu trúc project

```
claude-code-practice/
├── CLAUDE.md                     # Hướng dẫn project cho Claude Code
├── PRACTICE.md                   # Bài tập thực hành theo từng tính năng
├── .mcp.json                     # Cấu hình MCP filesystem server (scope: ./data)
├── .claude/
│   ├── skills/add-cli-command/   # Skill: quy trình thêm command mới
│   └── agents/code-reviewer.md   # Subagent: review code theo quy ước
├── src/
│   ├── index.js                  # CLI (parse argv, in output)
│   └── tasks.js                  # Logic dữ liệu (add/list/done/remove)
├── data/tasks.json                # Nơi lưu task
└── tests/tasks.test.js            # Test (node --test)
```

## Yêu cầu

Node.js >= 18 (dùng `node:test` built-in và ES modules).
