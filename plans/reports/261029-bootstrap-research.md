# Đánh giá công nghệ và lối chơi

## Bối cảnh

- Ngày: 2026-10-29.
- Dự án mới; đã xác nhận HTML 2D và góc nhìn từ trên xuống.
- Đã tổng hợp hai đánh giá độc lập về công nghệ và cơ chế giải đố.
- Phạm vi, công nghệ và hình ảnh bên dưới đang chờ người dùng duyệt.

## Kết quả công nghệ

| Phương án | Ưu điểm | Đánh đổi |
| --- | --- | --- |
| Phaser + JavaScript, bảng tương tác HTML/CSS | Có scene, bàn phím, va chạm đơn giản và scale; phù hợp phòng nối tiếp | Có phụ thuộc engine; cần quản lý vòng đời scene và trạng thái |
| Canvas + JavaScript, bảng tương tác HTML/CSS | Ít phụ thuộc; đủ cho bốn phòng tĩnh | Tự xây vòng lặp, xử lý phím, va chạm, chuyển phòng và scale |

- Khuyến nghị Phaser + JavaScript vì nhiệm vụ chính là tương tác và câu đố, không phải xây engine.
- Đây là nhận định thiết kế dựa trên yêu cầu, không phải kết quả đo hiệu năng.
- Nội dung tiếng Việt và điều khiển câu đố dùng phần tử HTML có focus bàn phím.
- Tiến độ lưu bằng localStorage có phiên bản dữ liệu; khi không lưu được vẫn cho chơi tiếp và thông báo ngắn.
- Chạy qua máy chủ HTTP cục bộ để ổn định origin và tải tài nguyên. Không hứa localStorage hoạt động nhất quán khi mở file trực tiếp.
- Lưu engine cùng dự án và khóa phiên bản khi triển khai; tránh tải thư viện từ CDN tại thời điểm chơi nếu mục tiêu là hoạt động offline.
- Không cần máy chủ dữ liệu hoặc đăng nhập trong phạm vi đề xuất.

## Kết quả lối chơi

- Dùng bốn phòng nhỏ; mỗi câu đố phải có manh mối ngay trong game.
- Phòng Him Lam: ghép hồ sơ và đặt thẻ địa điểm/ngày/sự kiện.
- Phòng bản đồ: đặt thẻ cứ điểm lên sơ đồ; thứ tự sự kiện có ngày rõ ràng. Đường nối thể hiện liên hệ tư liệu, không thể hiện tuyến tiến công giả định.
- Phòng sở chỉ huy: khôi phục điện báo từ mảnh tư liệu và xác định sự kiện ngày 7/5/1954.
- Phòng hòa bình: lựa chọn biểu tượng hoặc viết lời suy nghĩ tùy chọn; tiếp tục được ngay, không khóa kết thúc theo quan điểm cá nhân.
- Tư liệu tháng 3 xuất hiện như ký ức trong chuyến đi ngày 7/5, tránh ngụ ý chiến dịch diễn ra trong một ngày.
- Hình ảnh hầm là diễn giải phục vụ trò chơi. Bản đồ ghi rõ “Sơ đồ minh họa, không theo tỷ lệ”.
- Tránh hỏi chính xác phút nổ súng vì tài liệu có cách ghi khác nhau; ngày và sự kiện đủ cho bản đầu.
- Không diễn đạt rằng đất nước thống nhất hoặc hòa bình toàn quốc ngay ngày 7/5/1954.

## Tiêu chí kiểm chứng khi triển khai

- Chơi trọn bốn phòng tới kết thúc, không thể vượt cửa khóa.
- Di chuyển chéo không nhanh hơn di chuyển thẳng, có va chạm.
- Câu đố thao tác được bằng chuột và bàn phím; mở bảng dừng di chuyển, đóng bảng khôi phục focus.
- Thử sai có phản hồi, có thể sửa; có gợi ý tăng dần.
- Tải lại để tiếp tục, xử lý dữ liệu lưu hỏng, xác nhận trước khi chơi lại.
- Kiểm tra dấu tiếng Việt và độ dễ đọc tại kích thước màn hình mục tiêu.

## Nguồn

- [Canvas API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
- [Scenes — Phaser](https://docs.phaser.io/phaser/concepts/scenes).
- [Input — Phaser](https://docs.phaser.io/phaser/concepts/input).
- [Arcade Physics — Phaser](https://docs.phaser.io/phaser/concepts/physics/arcade).
- [Scale Manager — Phaser](https://docs.phaser.io/phaser/concepts/scale-manager).
- [localStorage — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- [Chuyên trang Chiến thắng Điện Biên Phủ — Báo Nhân Dân](https://dienbienphu.nhandan.vn/): controller đã đọc các mục ngày 13/3 và 7/5.
- [Đợt I Chiến dịch Điện Biên Phủ — Bảo tàng Lịch sử quốc gia](https://baotanglichsu.vn/vi/Articles/2002/67980/tran-quyet-chien-chien-luoc-tieu-diet-tap-djoan-cu-djiem-djien-bien-phu-13-3-7-5-1954-djot-i-chien-dich-djien-bien-phu-djon-phu-djau.html): đối chiếu qua đánh giá độc lập.

## Bước tiếp theo

Người dùng chọn công nghệ và duyệt phạm vi → thiết kế mẫu → duyệt thiết kế → kích hoạt ck:plan → duyệt kế hoạch → ck:cook triển khai.

## Câu hỏi chưa chốt

- Chấp thuận Phaser + JavaScript hay chọn Canvas thuần?
- Có cần cảm ứng trong bản đầu? Mặc định đề xuất ưu tiên máy tính.
- Có chấp thuận pixel art màu đất/ô liu, ánh đèn vàng? Chưa làm tài sản đồ họa.
- Có khởi tạo Git trong thư mục dự án? Chưa khởi tạo.
