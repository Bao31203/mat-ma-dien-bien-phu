# Kiểm tra bản mẫu thiết kế

Bản ghi này mô tả mẫu đầu trước yêu cầu bản đồ lớn/camera. Trạng thái hiện tại xem [kiểm tra bản mẫu camera](261029-large-map-camera-preview-qa.md).

## Bối cảnh

- Ngày: 2026-10-29.
- Đối tượng: `docs/wireframe/index.html`, bản mẫu HTML/CSS/JavaScript để duyệt thiết kế; chưa phải trò chơi Phaser.
- Kiểm tra bằng Chromium qua agent-browser, tải trực tiếp bằng file URL.
- Kết quả: các kiểm tra dưới đây đạt, không có lỗi console hoặc page error tại các luồng đã chạy.

## Kết quả

| Kiểm tra | Kết quả quan sát |
| --- | --- |
| Cú pháp JavaScript | `node --check` đạt với wireframe.js và room-art.js |
| Máy tính 1280×800 | scrollWidth 1280, scrollHeight 800; thấy khung cảnh, sổ tay và điều khiển chính |
| Màn hẹp 375×812 | Nội dung xếp dọc; scrollWidth không vượt viewport; sổ tay và nút thao tác đọc được |
| Bảng giải đố 375px | Bảng cuộn nội bộ; select, nút đối chiếu, gợi ý và nút đóng dùng được |
| Khung làm việc 640×400 | Dialog nằm trong khung nhìn: x20, y20, rộng585, cao360; bố cục tương ứng kích thước CSS giảm khi zoom trình duyệt |
| Mở tư liệu và ghi vào sổ | Chuyển sang sổ tay và cập nhật trạng thái đã đọc |
| Đóng bằng Esc | Dialog đóng, focus quay về nút đã mở; không tự mở lại bảng tạm dừng |
| Phím E trong câu đố | Không thay nội dung dialog đang mở |
| Dữ kiện sai | Giữ lựa chọn, có nội dung chỉ cách sửa |
| Gợi ý | Hiển thị gợi ý tại câu đố |
| Dữ kiện đúng | Mở bảng thành công và đổi trạng thái nhiệm vụ mẫu |
| Đặt lại bản mẫu | Đưa cửa và nhiệm vụ về trạng thái đầu, bỏ tùy chọn tạm |
| Tăng độ sáng | Checkbox thay đổi lớp điều khiển độ sáng của canvas |
| Giảm chuyển động | Tùy chọn thay đổi lớp CSS; mô phỏng prefers-reduced-motion trả transitionDuration 0s |
| Biểu tượng | Tải từ assets/game-emblem.png, có alpha trong suốt ở góc ảnh |

## Ảnh đối chiếu

- [Khám phá — máy tính](../../docs/wireframes/exploration-desktop.png).
- [Giải đố — máy tính](../../docs/wireframes/puzzle-desktop.png).
- [Khám phá — màn hẹp](../../docs/wireframes/exploration-mobile.png).
- [Giải đố — màn hẹp](../../docs/wireframes/puzzle-mobile.png).
- [Dialog — khung nhỏ](../../docs/wireframes/dialog-compact.png).

## Giới hạn

- Chưa kiểm tra game engine, di chuyển, va chạm, bốn phòng, lưu tiến độ hoặc offline của game cuối; các tính năng này chưa triển khai.
- Kiểm tra 640×400 là phép kiểm tra kích thước CSS nhỏ, không thay thế việc thử zoom thật trên mọi trình duyệt.
- Không thêm bộ test tự động cho bản mẫu có thể thay đổi sau khi duyệt; dùng kiểm tra tương tác trực tiếp.

## Câu hỏi chưa chốt

- Người dùng có duyệt hình ảnh và bố cục này để chuyển sang lập kế hoạch triển khai?
