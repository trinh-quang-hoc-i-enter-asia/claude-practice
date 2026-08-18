# PRACTICE.md — Bài tập luyện tập Claude Code

Project này (`claude-code-practice`) được tạo riêng để bạn thực hành 4
tính năng cốt lõi của Claude Code: **CLAUDE.md**, **Skill**, **MCP**,
**Subagent**. Mở project này bằng Claude Code (`claude` trong thư mục
`claude-code-practice/`) và làm theo các bài tập dưới đây, theo thứ tự.

## Chuẩn bị

```bash
cd claude-code-practice
npm install
node src/index.js help    # xác nhận CLI chạy được
claude                    # mở Claude Code trong project này
```

---

## Bài 1 — CLAUDE.md: quan sát nó ảnh hưởng thế nào

`CLAUDE.md` được Claude Code tự động đọc khi bạn mở project. Nó chứa quy
ước kiến trúc (tách `tasks.js`/`index.js`), quy tắc code (async, validate
ở đâu), và quy trình 4 bước khi thêm feature.

**Thử làm:**
1. Yêu cầu Claude: *"Thêm field `priority` (low/medium/high) cho task, mặc
   định là `medium`."*
2. Quan sát: Claude có tự sửa `tasks.js` trước, cập nhật JSDoc, rồi mới
   đụng `index.js` không? Nó có tự thêm test không?
3. Thử xoá tạm mục "Quy tắc khi thêm feature mới" trong `CLAUDE.md`, yêu
   cầu lại một feature tương tự, và so sánh cách Claude thực hiện khác đi
   thế nào. Sau đó khôi phục lại `CLAUDE.md` (dùng `git diff`/`git
   checkout` hoặc undo).

**Mục tiêu:** hiểu CLAUDE.md không phải "tài liệu" mà là ngữ cảnh sống
ảnh hưởng trực tiếp đến hành vi của Claude trong mọi request.

---

## Bài 2 — Skill: dùng quy trình có sẵn

Skill `add-cli-command` (tại `.claude/skills/add-cli-command/SKILL.md`)
mã hoá lại đúng quy trình 4 bước ở `CLAUDE.md` thành một workflow có thể
gọi lại nhiều lần.

**Thử làm:**
1. Yêu cầu: *"Thêm command `todo search <keyword>` để tìm task theo nội
   dung."* — không nhắc gì đến skill, xem Claude có tự nhận ra và dùng
   skill `add-cli-command` không (vì phần `description` của skill được
   viết để trigger đúng tình huống này).
2. Gọi thẳng skill bằng `/add-cli-command` rồi mô tả yêu cầu, so sánh với
   cách làm ở bước 1.
3. Sửa mô tả trong `SKILL.md` (phần `description` ở đầu file) để nó *kém*
   cụ thể hơn (ví dụ chỉ còn "helps with CLI stuff"), thử lại một yêu cầu
   tương tự, và quan sát skill có được kích hoạt đúng lúc không. Đây là
   bài học về việc viết `description` tốt để skill trigger chính xác.

**Mục tiêu:** hiểu skill = quy trình lặp lại được đóng gói lại, và
`description` là yếu tố quyết định skill có được dùng đúng lúc hay không.

---

## Bài 3 — Subagent: review độc lập

Subagent `code-reviewer` (tại `.claude/agents/code-reviewer.md`) chỉ đọc
và báo cáo, không tự sửa code — mô phỏng một reviewer độc lập.

**Thử làm:**
1. Sau khi hoàn thành Bài 1 hoặc Bài 2 (đã có thay đổi code thật), yêu cầu
   Claude: *"Dùng subagent code-reviewer để review thay đổi vừa rồi."*
2. Đọc báo cáo trả về — nó có bám đúng checklist trong
   `code-reviewer.md` không (tách lớp, async, validate, JSDoc, test
   coverage, cập nhật HELP, zero-dependency, `npm test` pass)?
3. Cố tình phá một quy ước (ví dụ: viết logic validate ngay trong
   `index.js` thay vì `tasks.js`), rồi chạy lại subagent review — nó có
   bắt được lỗi đó không?

**Mục tiêu:** hiểu subagent hữu ích nhất khi có phạm vi hẹp, checklist rõ
ràng, và tách biệt với agent đang viết code (tránh "tự khen bài mình").

---

## Bài 4 — MCP: đọc/ghi dữ liệu qua MCP server

`.mcp.json` khai báo MCP filesystem server chính thức
(`@modelcontextprotocol/server-filesystem`), scope vào thư mục `./data`
(không phải toàn bộ project) — nguyên tắc least-privilege.

**Thử làm:**
1. Mở Claude Code trong project, chạy `/mcp` để xác nhận server
   `filesystem` đã kết nối. Nếu chưa có, Claude Code sẽ hỏi cấp quyền lần
   đầu.
2. Yêu cầu: *"Dùng MCP filesystem tool để đọc `tasks.json` và cho tôi biết
   có bao nhiêu task chưa hoàn thành."* — so sánh với việc tự
   `cat data/tasks.json` bằng Bash.
3. Thử yêu cầu Claude đọc một file *ngoài* thư mục `data/` (ví dụ
   `src/tasks.js`) bằng MCP tool — vì server chỉ được scope vào `./data`,
   request sẽ bị từ chối. Đây là cách kiểm chứng phạm vi quyền của MCP
   server hoạt động đúng.

**Mục tiêu:** hiểu MCP server là một tool boundary có thể scope hẹp, và
khác với việc Claude tự chạy `fs`/Bash trực tiếp.

---

## Bài tổng hợp (tuỳ chọn)

Yêu cầu một feature cần dùng cả 4 thứ trong một lần: *"Thêm command `todo
export` để xuất toàn bộ task ra `data/export.json` qua MCP filesystem tool,
theo đúng skill add-cli-command, rồi review lại bằng subagent
code-reviewer."* Quan sát Claude phối hợp CLAUDE.md, skill, MCP, và
subagent trong một luồng việc duy nhất.
