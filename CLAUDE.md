# CLAUDE.md

Hướng dẫn này giúp Claude Code (và bạn) hiểu nhanh project để làm việc hiệu
quả. Đây là project **luyện tập** — một Todo CLI cực đơn giản viết bằng
Node.js — được tạo ra chỉ để bạn thực hành 4 tính năng cốt lõi của Claude
Code: `CLAUDE.md`, **Skills**, **MCP**, và **Subagents**. Xem `PRACTICE.md`
để có danh sách bài tập cụ thể.

## Tổng quan project

`todo` là một CLI quản lý task, lưu dữ liệu dạng JSON tại `data/tasks.json`.
Không có framework, không có dependency ngoài — chỉ Node.js built-in
(`node:fs`, `node:test`). Mục tiêu là giữ codebase đủ nhỏ để đọc hết trong
vài phút, nhưng đủ thật để các thay đổi (feature, test, review) có ý nghĩa.

## Kiến trúc

- `src/tasks.js` — logic dữ liệu thuần (đọc/ghi file, add/list/done/remove).
  Không có bất kỳ logic in ra console hay parse argv nào ở đây.
- `src/index.js` — CLI wiring: parse `process.argv`, gọi hàm ở `tasks.js`,
  format output ra console.
- `data/tasks.json` — nguồn dữ liệu duy nhất (single source of truth).
- `tests/` — dùng Node test runner built-in (`node --test`), không dùng
  Jest/Mocha để tránh thêm dependency.

Lý do tách `tasks.js` khỏi `index.js`: để logic có thể test được mà không
cần giả lập CLI, và để dễ dàng thêm giao diện khác (ví dụ HTTP API) sau này
mà không đụng vào logic lõi.

## Quy ước code

- Dùng ES modules (`import`/`export`), không dùng `require`.
- Mỗi hàm xử lý dữ liệu trong `tasks.js` phải là `async` và trả về
  Promise, ngay cả khi hiện tại không cần `await` — để nhất quán và dễ mở
  rộng (ví dụ đổi sang gọi API/database sau này).
- Validate input ở tầng `tasks.js`, không phải ở `index.js`.
- Khi thêm một field mới vào task, cập nhật cả JSDoc comment phía trên hàm
  liên quan trong `tasks.js`.
- Không thêm dependency ngoài trừ khi thực sự cần thiết — đây là project
  luyện tập, nên giữ mọi thứ "zero-dependency" nếu có thể.

## Quy tắc khi thêm feature mới

1. Thêm/sửa hàm trong `src/tasks.js` trước.
2. Viết test cho hàm đó trong `tests/tasks.test.js`.
3. Nối command mới vào `src/index.js` (switch-case) và cập nhật chuỗi
   `HELP`.
4. Chạy `npm test` — tất cả test phải pass trước khi coi là xong.
5. Nếu bạn dùng skill `add-cli-command` (xem `.claude/skills/`), nó sẽ tự
   đi qua đúng 4 bước này.

## Testing

```
npm test
```

Test dùng `node --test`, tự backup và restore `data/tasks.json` trước/sau
khi chạy (xem `before`/`after` trong `tests/tasks.test.js`) để không làm
mất dữ liệu task thật của bạn.

## Ghi chú cho Claude Code

- Đây là sandbox luyện tập — được phép thử nghiệm mạnh tay (thêm command,
  đổi format, refactor) miễn là test vẫn pass.
- Khi review code trong project này, hãy dùng subagent `code-reviewer`
  (định nghĩa tại `.claude/agents/code-reviewer.md`) để kiểm tra các thay
  đổi so với các quy ước ở trên.
- MCP filesystem server (xem `.mcp.json`) được scope vào thư mục `data/` —
  dùng nó để đọc/ghi `tasks.json` qua MCP tool thay vì gọi trực tiếp `fs`
  khi bạn muốn thực hành MCP.
