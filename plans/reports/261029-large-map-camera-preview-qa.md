# Kiểm tra bản mẫu bản đồ lớn và camera

## Bối cảnh

- Ngày: 2026-10-29; người dùng duyệt hình ảnh và yêu cầu bản đồ lớn hơn, camera theo Minh.
- Đối tượng: `docs/wireframe/`, bản mẫu Canvas/DOM độc lập; chưa phải game Phaser bốn chương.
- Kiểm tra Chromium qua agent-browser, file URL. Di chuyển kéo dài được mô phỏng bằng KeyboardEvent vào canvas có focus; quan sát trực tiếp vị trí và ảnh từ vòng lặp thật.
- API chỉ đọc `window.cameraPreview.getState()` dùng lấy snapshot; không sửa tọa độ nhân vật hoặc camera để giả lập kết quả.

## Kết quả

| Kiểm tra | Kết quả quan sát |
| --- | --- |
| Cấu trúc map | World 2400×1440, sáu khu nối qua hành lang; khung chơi toàn chiều ngang, sổ tay là dialog |
| 1280×800 | scrollWidth 1280, scrollHeight 800; không cần cột sổ tay cố định |
| 375×812 | scrollWidth 360, không tràn ngang; nút sổ tay/câu đố và chỉ dẫn đọc được; chưa có di chuyển cảm ứng |
| Camera theo trục Y | Từ player (580,350), camera (100,171.5), đi xuống tới player (580,681.5) làm cameraY thành 503.0 |
| Camera theo trục X | Đi dọc hành lang tới tường ngoài, playerX khoảng 2323.1; cameraX dừng ở 1440 = 2400−960 |
| Va chạm | Nhân vật bị chặn trước tường ngoài khi tiếp tục giữ hướng sang phải; không đi ra vùng ngoài world |
| Follow thông thường | Khi giảm chuyển động tắt, camera có độ trễ theo nhân vật; snapshot đang đi cho playerX616.7 và cameraX118.3 trước khi dừng |
| Mở bảng khi giữ S | Dialog mở; player giữ nguyên tại (580,424.866) trong thời gian kiểm tra sau đó |
| Đóng bảng và key repeat | Esc đóng; repeat keydown sau ngắt không làm player đi tiếp; cần nhấn mới |
| Mất focus | Giả lập blur khi đang đi: player/camera giữ nguyên; bấm lại Đi vào bản đồ khôi phục focus với phím đã được xóa |
| Sổ tay | N mở native dialog; bản đồ bị khóa input trong lúc đọc |
| Câu đố mẫu | Đúng Him Lam / 13-03 / trận mở màn mở bảng thành công; reset trả spawn và trạng thái ban đầu |
| Cú pháp/runtime | node --check đạt camera-preview.js, room-art.js, wireframe.js; không có page error ở các luồng đã chạy |

## Ảnh bằng chứng

- [Khởi đầu — máy tính](../../docs/wireframes/large-map-start-desktop.png).
- [Hành lang sau di chuyển](../../docs/wireframes/large-map-corridor-desktop.png).
- [Dừng ở mép phải](../../docs/wireframes/large-map-right-edge.png).
- [Bố cục màn hẹp](../../docs/wireframes/large-map-mobile.png).
- [Sổ tay trên màn hẹp](../../docs/wireframes/large-map-notebook-mobile.png).

## Giới hạn và bước tiếp theo

- Đây là mẫu thử cảm giác map/camera; chưa có tiến trình bốn phòng hoặc lưu tiến độ.
- Không dùng kết quả Canvas để khẳng định game Phaser sau này đã đạt QA; kế hoạch yêu cầu kiểm tra lại trên engine thật.
- Chưa thử camera bằng điều khiển cảm ứng; phạm vi hiện tại ưu tiên bàn phím máy tính.
- Bước tiếp theo: duyệt [kế hoạch game hoàn chỉnh](../261029-1757-mat-ma-dien-bien-phu-game/plan.md), sau đó triển khai theo từng pha.

## Câu hỏi chưa chốt

Chờ người dùng duyệt kế hoạch triển khai. Yêu cầu bản đồ lớn và camera đã được ghi vào tiêu chí nghiệm thu.
