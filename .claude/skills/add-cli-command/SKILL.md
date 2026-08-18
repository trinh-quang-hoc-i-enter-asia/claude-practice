---
name: add-cli-command
description: Use when adding a new command to the todo CLI in this project (e.g. "add a priority field", "add a search command", "add a due-date command"). Walks through the project's required 4-step workflow (tasks.js -> test -> index.js wiring -> npm test) defined in CLAUDE.md, so new commands land consistently with existing ones.
---

# Add CLI Command

Skill này mã hoá lại quy trình bắt buộc trong `CLAUDE.md` (mục "Quy tắc khi
thêm feature mới") để thêm một command mới vào Todo CLI này một cách nhất
quán, không bỏ sót bước.

## Khi nào dùng

Dùng skill này khi người dùng yêu cầu thêm một command mới hoặc một field
mới cho task trong project `claude-code-practice` này — ví dụ: thêm field
`priority`, thêm command `search <keyword>`, thêm command `clear` để xoá
hết task đã done, v.v.

## Quy trình (bắt buộc theo đúng thứ tự)

1. **Đọc `src/tasks.js` trước.** Xác định hàm nào cần sửa hoặc cần thêm
   hàm mới. Mọi logic dữ liệu/validate PHẢI nằm ở đây, không nằm ở
   `index.js`.
   - Nếu thêm field mới vào task object, cập nhật luôn JSDoc comment của
     `loadTasks`/`addTask` (bất kỳ hàm nào trả về/tạo task) để phản ánh
     field mới.
2. **Viết test trong `tests/tasks.test.js` cho hàm/behaviour mới**, trước
   khi đụng vào `index.js`. Test nên cover: trường hợp hợp lệ, trường hợp
   input rỗng/không hợp lệ, và ít nhất một edge case (ví dụ id không tồn
   tại).
3. **Nối command vào `src/index.js`**: thêm một `case` mới trong
   `switch (command)`, gọi hàm ở `tasks.js`, format output bằng
   `formatTask` (tái sử dụng, đừng viết logic format mới nếu không cần).
   Cập nhật chuỗi `HELP` ở đầu file để command mới xuất hiện trong
   `todo help`.
4. **Chạy `npm test`** và xác nhận tất cả test pass. Nếu fail, sửa cho đến
   khi pass — không được bỏ qua bước này.
5. Báo cáo ngắn gọn: command/field nào đã thêm, hàm nào đã sửa, test nào
   đã viết.

## Quy tắc bổ sung cần tuân theo

- Không thêm dependency ngoài (xem CLAUDE.md — project này giữ
  zero-dependency).
- Hàm trong `tasks.js` luôn là `async`, luôn trả Promise.
- Validate input ở `tasks.js`, không ở `index.js`.

## Ví dụ

Yêu cầu: "Thêm command `todo search <keyword>` để tìm task theo nội dung."

Thực hiện theo đúng 4 bước trên:
1. Thêm hàm `searchTasks(keyword)` vào `tasks.js` (dùng `loadTasks()` rồi
   filter theo `text.includes(keyword)`, throw nếu keyword rỗng).
2. Thêm test `searchTasks finds matching tasks` và
   `searchTasks rejects empty keyword` vào `tasks.test.js`.
3. Thêm `case "search"` vào `index.js`, gọi `searchTasks(args.join(" "))`,
   in kết quả bằng `formatTask`. Cập nhật `HELP`.
4. Chạy `npm test`, xác nhận pass.
