# Review phần visual novel, hoạt ảnh và âm thanh

## Phạm vi

Ngày 2026-10-29; review độc lập mã mẫu chương I và đủ sáu tệp kế hoạch đã cập nhật theo yêu cầu mới. Bản mẫu là Canvas/Web Audio/DOM; game Phaser vẫn chờ duyệt kế hoạch.

## Kết quả

- Không có Critical/High hoặc mâu thuẫn kế hoạch mới có chứng cứ.
- Một Medium trong mã mẫu: focus sau sắp thẻ chọn nút enabled đầu tiên, khiến ↓ xong lại focus ↑; nhấn Enter tiếp đảo ngược thao tác vừa làm.
- Đã chấp nhận và sửa `docs/wireframe/narrative-controller.js`: giữ đúng nút/hướng vừa dùng; khi chạm biên, focus thẻ thay vì hành động ngược.
- Controller kiểm tra lại: Enter liên tiếp đưa thẻ pháo binh từ vị trí 1 tới 2 tới 3 tới 4; tại biên focus LI và Enter tiếp không đổi thứ tự. Thiếu manh mối vẫn không mở khóa submit.

## Nội dung đã đối chiếu

- Bốn manh mối/lời kể và thẻ Him Lam theo đúng thứ tự người dùng; xác minh bằng bài diễn biến của Bảo tàng Lịch sử quốc gia.
- Thu thập một lần, đóng trước khi ghi không cấp manh mối, đọc lại không nhân đôi.
- Hoạt ảnh dựa trên di chuyển thật; dừng phím/modal/collision; audio bật rõ ràng, mute và node cleanup.
- Kế hoạch phân biệt audio preference với unlock theo phiên; không lưu context/cursor; giữ bốn chương, camera và checkpoint đã chốt.
- Không có yêu cầu lồng tiếng/TTS hoặc dịch vụ ngoài trong phạm vi được chọn.

## Giới hạn và bước tiếp theo

Review mã mẫu không thay review game Phaser sau triển khai. Controller đã chạy [QA trực tiếp](../../reports/261029-visual-novel-preview-qa.md); review độc lập không tự nhận đã nghe âm qua loa người dùng.

Câu hỏi chưa chốt: chờ duyệt kế hoạch triển khai game chính.
