# Công nghệ game

## Quyết định

Người dùng duyệt Phaser + JavaScript ngày 2026-10-29 cho game HTML 2D nhìn từ trên xuống. Quyết định này thay cho câu hỏi chọn Canvas thuần trong báo cáo nghiên cứu ban đầu.

## Thành phần

| Thành phần | Vai trò |
| --- | --- |
| HTML | Khung trang, hội thoại, bảng manh mối, biểu mẫu câu đố có thể dùng bàn phím |
| CSS | Bố cục, chữ tiếng Việt, trạng thái điều khiển và hiệu ứng giao diện |
| JavaScript | Luật giải đố, tiến trình cốt truyện, tương tác và lưu dữ liệu tại máy |
| Phaser | Hiển thị cảnh chơi, di chuyển, va chạm và chuyển phòng |
| Web Audio API | Âm nền, bước chân, giấy và âm báo cục bộ; bật theo thao tác người chơi |

- Game chính đã triển khai, khóa chính xác Phaser 3.90.0 và Vite 8.3.5 trong package/lockfile theo [nghiên cứu phiên bản/camera](../plans/261029-1757-mat-ma-dien-bien-phu-game/reports/camera-and-runtime-research.md).
- Node.js >=22.12.0 theo `package.json`; `npm ci` cài đúng lockfile, không cài toàn cục.
- Dữ liệu tĩnh và localStorage, không cần máy chủ dữ liệu. Save xác minh schema và tiếp tục tại checkpoint an toàn.
- Chạy HTTP qua `npm run dev` ở 127.0.0.1:5173; `npm run build` tạo `dist/`, `npm run preview` ở 127.0.0.1:4173. Không mở game chính bằng `file://`; xem [hướng dẫn chạy](deployment-guide.md).
- Engine và tài nguyên nằm cục bộ, không CDN/font ngoài. Game chính đã hoàn tất và kiểm chứng cục bộ; bản mẫu không thay cho bằng chứng nghiệm thu. Xem [roadmap và báo cáo QA](project-roadmap.md).

## Bản mẫu thiết kế

Mẫu trong `docs/wireframe/` dùng HTML/CSS/JavaScript, Canvas và Web Audio: bản đồ lớn/camera, sprite bốn hướng có gait, lời kể VN với chân dung, bốn manh mối và xếp trình tự Him Lam. Mẫu không dùng Phaser và không thay thế game hoàn chỉnh. Chương I chơi được tới trạng thái giải đúng; chưa có lưu tiến độ hoặc ba chương tiếp theo.

Âm thanh được tổng hợp tại máy, không tải nhạc hoặc giọng đọc từ dịch vụ ngoài. Chưa có lồng tiếng; lời kể luôn đọc được khi tắt tiếng. Chân dung Minh nằm trong tài nguyên cục bộ và có [prompt/provenance](image-prompts.md).

Game chính cũng dùng Web Audio tổng hợp, một AudioContext cho phiên sau thao tác bật tiếng; có mute/volume và bật lại sau suspend. Tùy chọn lưu không đồng nghĩa quyền phát tự động. Chi tiết tích hợp trong [kiến trúc](system-architecture.md).

## Tham khảo

- [Camera — Phaser 3.90.0](https://docs.phaser.io/api-documentation/3.90.0/class/cameras-scene2d-camera).
- [Arcade World — Phaser 3.90.0](https://docs.phaser.io/api-documentation/3.90.0/class/physics-arcade-world).
- [Báo cáo lựa chọn công nghệ](../plans/reports/261029-bootstrap-research.md).
- [Web Audio — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).
