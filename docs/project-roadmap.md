# Tiến độ dự án

## Trạng thái ngày 2026-10-29

Đã hoàn tất và kiểm chứng cục bộ hành trình bảo tàng → Him Lam → bản đồ chiến dịch → sở chỉ huy → hòa bình → bảo tàng theo phạm vi được duyệt. Mã nguồn chia sẻ công khai trên [GitHub](https://github.com/thaideptrai218/mat-ma-dien-bien-phu) theo yêu cầu cộng tác bổ sung; chưa có website hosting.

| Hạng mục | Trạng thái |
| --- | --- |
| Prototype chương I, chọn phong cách và camera lớn | Hoàn tất, giữ riêng để đối chiếu. |
| Foundation, nội dung, reducer và xác minh save | Đã triển khai. |
| Phaser, bản đồ, va chạm, camera, idle/walk | Đã triển khai. |
| VN, sổ tay, tư liệu, bốn thử thách, kết bảo tàng | Đã triển khai. |
| Web Audio, mute/volume, suspend/retry, tùy chọn | Đã triển khai. |
| Lưu cục bộ/checkpoint, tiếp tục/reset có xác nhận | Đã triển khai. |
| Kiểm thử tự động, build và review | 23 test đạt, build đạt; review không còn blocker. |
| Chơi toàn tuyến và QA cạnh biên trình duyệt | Đạt cục bộ: đủ bốn cửa/kết, 10 manh mối bắt buộc; hòa bình để trống. |
| Save, input, camera, animation và audio | Kiểm tra reload bốn chương, reset/save lỗi, focus/hidden, bốn hướng, biên camera và tín hiệu PCM. |
| Bố cục và khả năng chạy độc lập | Ba viewport và Chrome zoom 200%; chơi tới kết với mạng ngoài bị chặn, storage và Web Audio không khả dụng. |

## Bàn giao

Dùng [hướng dẫn chạy](deployment-guide.md) và [README](../README.md). Bằng chứng nghiệm thu: [QA game chính](../plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-qa.md), [QA cạnh biên độc lập](../plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-edge-qa.md), [review mã](../plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-code-review.md). Bản production đã kiểm tra dùng entry `index-DE-mEXGN.js`; kế hoạch và trạng thái pha trong [plan](../plans/261029-1757-mat-ma-dien-bien-phu-game/plan.md).

## Ngoài phạm vi đã duyệt

Cảm ứng để đi bộ, lồng tiếng/TTS, backend/tài khoản, PWA và hosting. Tuyến năm chặng 1954–1975, mini-map và chạy nhanh đang ở mức đề xuất. Giấy phép phân phối cốt truyện/hình ảnh chưa xác định.

## Tham chiếu

[Yêu cầu](project-overview-pdr.md) · [Nhật ký triển khai](journals/2026-10-29-full-game.md) · [Chạy và build](deployment-guide.md)
