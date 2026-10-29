# Camera và công nghệ triển khai

## Bối cảnh

- Ngày: 2026-10-29.
- Nghiên cứu bổ sung sau khi người dùng duyệt hướng thiết kế, yêu cầu bản đồ lớn hơn và camera theo nhân vật.
- Báo cáo do controller tổng hợp từ đánh giá công nghệ độc lập. Chưa cài gói hoặc triển khai game.

## Phiên bản đề xuất cho kế hoạch

- Phaser 3.90.0, Vite 8.3.5, JavaScript thuần.
- Registry npm chính thức được researcher kiểm tra trực tiếp: Phaser latest 4.2.1, Vite latest 8.3.5 vào thời điểm nghiên cứu.
- Chọn Phaser 3.90.0 vì nhu cầu game 2D nhỏ và API đã có tài liệu theo phiên bản, không phải vì Phaser 4 chưa ổn định.
- Node đã quan sát tại máy: 24.15.0. Đối chiếu lại yêu cầu engine của các gói khi cài; khóa phiên bản trong package.json và package-lock.json.
- Dùng tài liệu đường dẫn `/api-documentation/3.90.0/` nhất quán với engine đã chọn; không trộn ví dụ renderer Phaser 4.

## Quy tắc world và camera

- Bản đồ di chuyển trong hầm khác với sơ đồ lịch sử của câu đố phòng 2.
- Bounds trong dữ liệu bản đồ là nguồn chung cho dựng hình, camera, physics, điểm xuất hiện và kiểm tra dữ liệu lưu.
- Áp dụng camera.setBounds và physics.world.setBounds; nhân vật setCollideWorldBounds(true). Tường, đồ vật và cửa khóa vẫn cần collider riêng.
- camera.startFollow(player, true, lerpX, lerpY); thử lerp 0.12–0.2 và deadzone khoảng 20–30% khung nhìn, hiệu chỉnh bằng chơi thử.
- Giảm chuyển động: setLerp(1,1), bỏ rung và zoom trang trí; không dừng follow vì vẫn cần cuộn để khám phá.
- Đề xuất FIT với khung logic cố định, giữ tỷ lệ; world lớn hơn nhiều khung nhìn. Không thu nhỏ toàn bản đồ vào một khung.
- HUD và DOM dialog giữ trên màn hình, không nằm trong tọa độ world.
- Nếu dùng FIT, không gọi scale.resize() như cơ chế đổi kích thước canvas của Scale.NONE.

## Vòng đời nhập liệu

- Mở bảng: đặt trạng thái modal trước; velocity về 0; resetKeys; tắt keyboard gameplay và global capture; sau đó mở/focus dialog.
- Đóng bảng theo mọi đường: dọn trạng thái qua sự kiện close; resetKeys; chỉ bật lại khi không còn modal/pause; khôi phục focus.
- Blur hoặc đổi ứng dụng: xóa phím và dừng di chuyển; trở lại phải có thao tác mới.
- Khi scene kết thúc: gỡ listener do scene đăng ký, tránh tương tác lặp sau chuyển phòng.

## Kiểm chứng cần có

- Đi qua các hành lang và đến bốn rìa bản đồ, camera không vượt bounds, nhân vật không xuyên collider.
- Resize liên tục, bật/tắt giảm chuyển động, kiểm tra HUD không trôi theo world.
- Giữ W → mở bảng → nhả W → đóng bảng: nhân vật đứng yên.
- Đổi ứng dụng khi đang đi; quay lại không kẹt phím.
- Gõ tiếng Việt trong form mà E/WASD không kích hoạt gameplay.

## Nguồn chính thức

- [Phaser metadata](https://registry.npmjs.org/phaser).
- [Vite metadata](https://registry.npmjs.org/vite/latest).
- [Phaser 3.90.0 release](https://github.com/phaserjs/phaser/releases/tag/v3.90.0).
- [Camera 3.90](https://docs.phaser.io/api-documentation/3.90.0/class/cameras-scene2d-camera).
- [BaseCamera 3.90](https://docs.phaser.io/api-documentation/3.90.0/class/cameras-scene2d-basecamera).
- [Arcade World 3.90](https://docs.phaser.io/api-documentation/3.90.0/class/physics-arcade-world).
- [KeyboardPlugin 3.90](https://docs.phaser.io/api-documentation/3.90.0/class/input-keyboard-keyboardplugin).
- [ScaleManager 3.90](https://docs.phaser.io/api-documentation/3.90.0/class/scale-scalemanager).
- [Vite guide](https://vite.dev/guide/).

## Câu hỏi chưa chốt

Không có câu hỏi kỹ thuật chặn lập kế hoạch. Kích thước world, tốc độ và độ trễ camera là thông số chỉnh sau chơi thử trong phạm vi đã yêu cầu.
