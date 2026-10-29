# Quy ước mã game

## Phạm vi

JavaScript ES modules, Phaser 3.90.0, HTML/CSS và Web Audio. Dữ liệu/lời kể là tiếng Việt; ID nội bộ là tiếng Anh ổn định.

## Cấu trúc

- `src/content/`: nội dung, dữ kiện có nguồn, bản đồ và ID.
- `src/core/`: luật, kiểm tra save và hình học thuần; không import Phaser, DOM hoặc Web Audio.
- `src/game/`: scene, tranh và hoạt ảnh.
- `src/ui/`: dialog, VN, puzzle và HUD semantic HTML.
- `src/audio/`: một audio controller cho cả phiên.
- `src/app/`: session và intent nối state, scene, UI, storage; không nhân đôi luật mở khóa.
- `src/main.js`: khởi tạo Phaser và session; cấu hình Scale.FIT/Arcade Physics.
- `tests/`: Node test runner; kiểm tra bất biến, lỗi đầu vào và đường phục hồi thật.

## Quy tắc

- Tên tệp kebab-case, export có tên; hạn chế tệp vượt 200 dòng khi có ranh giới chức năng rõ.
- State do reducer thuần tạo bản mới; UI gửi intent, scene không tự sửa state hoặc ghi save.
- Dữ liệu lưu chỉ chứa ID/trạng thái đã xác minh; mọi truy cập storage có xử lý lỗi.
- Chỉ ghi manh mối qua xác nhận câu cuối; mở lời kể không đồng nghĩa hoàn tất. Chỉ checkpoint an toàn được khai báo trên bản đồ mới được ghi từ scene.
- Văn bản người chơi hoặc dữ liệu lưu đưa vào DOM bằng textContent, không chèn HTML tự do.
- Modal/blur phải xóa phím giữ, vận tốc và bước chân; đóng modal cần nhấn mới.
- Animation và bước chân dùng chuyển động thực sau physics, tránh nhấp nháy ở khung render không có bước vật lý.
- Audio preferences khác quyền phát runtime; dùng một AudioContext, unlock/resume từ thao tác người chơi và phản ánh suspend để thử lại.
- Hiệu ứng sau dialog phải đợi đóng bảng và đồng bộ focus/mode; hủy callback khi đã mở bảng mới hoặc dừng lượt chơi.
- Tài nguyên cục bộ, không CDN/font ngoài. Prototype trong docs/wireframe giữ nguyên.
- Chạy test hẹp trước; build và chơi toàn tuyến trước bàn giao. Không commit/deploy nếu chưa được yêu cầu.
