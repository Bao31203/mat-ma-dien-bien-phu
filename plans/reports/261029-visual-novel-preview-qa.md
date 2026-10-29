# Kiểm tra chương I visual novel

## Bối cảnh

- Ngày: 2026-10-29; theo yêu cầu visual novel lịch sử, hoạt ảnh di chuyển, âm thanh và manh mối mở lời kể.
- Đối tượng: `docs/wireframe/index.html`; Chromium qua agent-browser, file URL.
- Di chuyển kiểm tra bằng KeyboardEvent trong canvas có focus; quan sát vị trí/hoạt ảnh từ vòng lặp thật. Không sửa trực tiếp state, vị trí hoặc bộ sưu tập manh mối.
- Đây là mẫu hoàn thành được chương I, không phải game Phaser bốn chương hoặc bản có lưu tiến độ.

## Kết quả vòng chơi thật

1. Đọc intro với chân dung/tên Minh, dùng Đọc toàn cảnh rồi Bắt đầu khám phá.
2. Mở manh mối đầu rồi Esc: collected vẫn rỗng; câu đố giữ khóa 0/4.
3. Đọc xong và ghi bản chuẩn bị gần điểm bắt đầu: collected có prepare, historyCount 1.
4. Đi qua hành lang đến điện đài (khoảng x1269,y362), E mở đúng lời pháo binh; ghi nhận artillery.
5. Đi tới sơ đồ phía đông (khoảng x1947,y678), mở/đọc/ghi infantry.
6. Quay về gian bản đồ dưới trái (khoảng x354,y921), mở/đọc/ghi victory. Đủ bốn ID, historyCount 4.
7. Đối chiếu thứ tự bị xáo trộn: phản hồi sai, giữ các thẻ để sửa. Gợi ý dẫn về bước chuẩn bị/kết quả.
8. Dùng nút ↑/↓, gồm thao tác Enter, xếp prepare → artillery → infantry → victory. Submit thành công, solved true và mở bảng hoàn thành chương I.
9. Đọc lại lời prepare từ sổ tay ở vị trí xa: collected và historyCount giữ nguyên 4.

## Hoạt ảnh, âm thanh và nhập liệu

| Kiểm tra | Quan sát |
| --- | --- |
| Hoạt ảnh khi đi | Lấy mẫu thấy đủ frame 0,1,2,3; đổi hướng up/right/down; nhả phím trở về frame0/walking false |
| Âm thanh mặc định | Không phát tự động; bấm Bật âm thanh mới có AudioContext running |
| Bước chân | Sau đường đi thực tế, stepCount 19 rồi 60; cue/source được tạo thật trong context |
| Âm giấy/đúng/sai | lastCue đổi paper/reveal/error/success ở các thao tác tương ứng |
| Va chạm | Giữ hướng vào đồ vật ở (354,951.9), vị trí không đổi; frame0/walking false; stepCount giữ nguyên60 qua thời gian kiểm tra |
| Mở VN khi giữ S | Player giữ tại (580,389.732), animation idle, audio paused true và stepCount không tăng khi VN mở |
| Tắt tiếng | enabled false, activeSources0, ambientSources0, nút trở về Bật âm thanh |
| Bàn phím xếp thẻ | Lỗi focus đã sửa; Down/Enter liên tiếp cùng chiều, tới biên focus thẻ và Enter không đảo ngược |
| Cú pháp/runtime | node --check đạt toàn bộ module mẫu; không có page error trong luồng kiểm tra |

## Hiển thị

- 1280×800: map/HUD và khung VN dưới màn hình; chân dung PNG tải được.
- 375×812: không tràn ngang, dialog có chân dung/lời kể/điều khiển; đọc và đóng được.
- 640×400: dialog cuộn nội bộ, xem được lời đầy đủ sau cuộn; không tràn ngang.
- Có hiện hết chữ và đọc toàn cảnh; không bắt người chơi chờ typewriter.

## Ảnh bằng chứng

- [Mở đầu VN](../../docs/wireframes/visual-novel-intro-desktop.png).
- [Lời kể pháo binh](../../docs/wireframes/visual-novel-artillery-dialogue.png).
- [Câu đố khi thiếu manh mối](../../docs/wireframes/visual-novel-puzzle-locked.png).
- [Bốn thẻ đúng thứ tự](../../docs/wireframes/visual-novel-sequence-ready.png).
- [Hoàn thành Him Lam](../../docs/wireframes/visual-novel-him-lam-success.png).
- [VN màn hẹp](../../docs/wireframes/visual-novel-mobile.png).
- [VN khung thấp](../../docs/wireframes/visual-novel-compact.png).

## Giới hạn

Web Audio được kiểm tra qua context/source/counter và mã tổng hợp âm; chưa đối chiếu mức âm cảm nhận qua loa của người dùng. Không có lồng tiếng; lời Minh là văn bản. Tiến trình hiện chỉ trong phiên, chưa kiểm tra lưu hoặc ba chương chưa xây.

## Câu hỏi chưa chốt

Chờ người dùng duyệt hướng VN và [kế hoạch cập nhật](../261029-1757-mat-ma-dien-bien-phu-game/plan.md) để triển khai game Phaser hoàn chỉnh.
