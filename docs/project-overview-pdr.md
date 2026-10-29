# Tổng quan và yêu cầu sản phẩm

## Bối cảnh

Mật mã Điện Biên Phủ là game trình duyệt tiếng Việt một người chơi, chuyển thể cốt truyện PDF do người dùng cung cấp. Phạm vi toàn game đã được duyệt ngày 2026-10-29. Đã hoàn tất và kiểm chứng cục bộ; chưa phát hành trực tuyến.

Minh đi từ bảo tàng vào không gian ký ức ngày 7/5/1954, đọc lại dữ kiện từ tháng 3–5 qua bốn thử thách, rồi trở về bảo tàng. Mục tiêu là kết nối khám phá, lời kể và suy luận; thời lượng 10–15 phút vẫn là mục tiêu cần đo khi chơi thử.

## Yêu cầu đã triển khai

- Khám phá từ trên xuống bằng WASD/phím mũi tên, E tương tác; bản đồ hầm 2400×1440, camera theo nhân vật, va chạm tường/đồ vật/cửa khóa.
- Minh có chân dung, lời kể theo nhịp người chơi, idle/walk bốn hướng; sổ tay và lịch sử cho đọc lại. Chỉ ghi nhận manh mối bằng nút ở câu cuối.
- Him Lam: bốn manh mối + xếp trình tự. Bản đồ: ba manh mối + vị trí theo chú giải + mốc ngày. Sở chỉ huy: ba manh mối + ghép bản tin + ngày. Hòa bình: đọc và suy nghĩ tùy chọn, chủ động mở cửa, không chấm quan điểm.
- HUD, native dialog, nút xếp thẻ và biểu mẫu HTML dùng được bằng bàn phím. N mở sổ tay, Esc đóng bảng/tùy chọn, Tab rời canvas.
- Âm nền và SFX tổng hợp cục bộ sau bật tiếng; mute/volume, thử bật lại sau suspend. Giảm chuyển động và tăng độ sáng cảnh.
- Save cục bộ có xác minh, tiếp tục từ checkpoint an toàn; reset có xác nhận; không lưu nội dung suy nghĩ riêng hoặc trạng thái audio runtime.

## Ranh giới và tính trung thực

Không có chiến đấu, tài khoản, backend, điều khiển đi bộ bằng cảm ứng, lồng tiếng/TTS hoặc hosting trong phạm vi game hiện tại. Mã nguồn được chia sẻ qua GitHub theo yêu cầu cộng tác bổ sung. Tài nguyên game nằm cục bộ, không CDN. Chưa chốt giấy phép phân phối cốt truyện/tài sản.

Minh, hiện vật kể chuyện, bản tin ghép và căn hầm là sáng tạo học tập. Sơ đồ phòng 2 không theo tỷ lệ hoặc biểu diễn một tuyến tấn công. Nguồn lịch sử hiển thị trong game; không đồng nhất thắng lợi Him Lam với kết thúc chiến dịch, hoặc 7/5/1954 với thống nhất đất nước.

## Nghiệm thu

23 kiểm thử Node và build Vite đạt; review không còn phát hiện chặn bàn giao. Đã chơi qua đủ bốn cửa tới kết với 10 manh mối bắt buộc, không cần manh mối hòa bình hoặc suy nghĩ nhập. Đã kiểm tra input/focus, camera/va chạm, âm thanh bằng PCM, tiếp tục ở bốn chương, reset/save lỗi, ba viewport và zoom Chrome 200%. Lượt chơi độc lập tới kết khi chặn mạng ngoài, storage getter ném lỗi và Web Audio không tồn tại trước boot.

Bằng chứng: [QA game chính](../plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-qa.md), [QA cạnh biên](../plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-edge-qa.md), [review mã](../plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-code-review.md). Đây là kiểm tra game chính qua HTTP, tách với QA prototype.

## Tham chiếu

[README](../README.md) · [Phạm vi và nguồn truyện](game-proposal.md) · [Roadmap](project-roadmap.md) · [Kiến trúc](system-architecture.md)
