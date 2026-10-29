# Tóm tắt mã nguồn

## Tổng quan

Game chính dùng JavaScript ES modules, Phaser 3.90.0 và Vite 8.3.5. Không backend; trạng thái chạy trong trình duyệt, save qua localStorage. Mã mẫu trong `docs/wireframe/` độc lập với game chính.

## Cấu trúc

| Đường dẫn | Trách nhiệm |
| --- | --- |
| `index.html`, `src/styles.css` | Khung trang, vùng Phaser, HUD, native dialog và bố cục responsive. |
| `src/main.js` | Khởi tạo Phaser 960×540, Scale.FIT, Arcade Physics và session. |
| `src/app/game-session.js` | Nối state, scene, UI, storage, focus và audio; bắt đầu/tiếp tục/chuyển chương. |
| `src/app/game-actions.js` | Nhận intent, ghi manh mối ở câu cuối, nộp câu đố, tương tác cửa và tùy chọn. |
| `src/content/story-data.js` | Chương, lời Minh, manh mối, câu đố, đáp án, gợi ý và nguồn lịch sử. |
| `src/content/world-data.js` | Sáu bản đồ theo dữ liệu: bảo tàng, bốn phòng, bảo tàng kết; tường, đồ vật, checkpoint và điểm tương tác. |
| `src/core/game-rules.js` | State ban đầu, reducer và luật kiểm tra câu đố/mở chương. |
| `src/core/save-validation.js`, `src/core/save-store.js` | Schema save version 1, xác minh tiến độ và xử lý lỗi storage. |
| `src/core/world-geometry.js` | Footprint nhân vật, kiểm tra đường đi, checkpoint và tầm tương tác; không phụ thuộc Phaser. |
| `src/game/` | Một AdventureScene, input theo focus, tranh phòng và sprite/animation vẽ bằng mã. |
| `src/ui/` | HUD, dialog, lời kể, sổ tay/tư liệu, câu đố và menu HTML. |
| `src/audio/` | Một AudioController và các giọng tổng hợp Web Audio, không có giọng đọc. |
| `assets/images/` | Chân dung Minh, biểu trưng PNG cục bộ. |
| `tests/` | Node test runner: luật chơi, save, tính nhất quán nội dung, hình học/điểm tương tác và vòng đời audio suspend/resume. |
| `vite.config.js`, `package-lock.json` | Cổng dev/preview, build đường dẫn tương đối và phiên bản phụ thuộc khóa. |

## Hợp đồng kiểm tra

`window.gameDebug.getSnapshot()` chỉ trả bản sao trạng thái để quan sát state/scene/audio/modal; không có API dịch chuyển hoặc tự giải câu đố. Không dùng API kiểm tra Canvas prototype làm hợp đồng cho game chính.

`npm test` kiểm tra logic thuần; `npm run build` kiểm tra gói tĩnh. Các kiểm tra đó không thay chơi thực tế cho DOM/focus, Phaser, cảm giác camera và âm thanh.

## Tham chiếu

[Kiến trúc](system-architecture.md) · [Quy ước mã](code-standards.md) · [Chạy và build](deployment-guide.md)
