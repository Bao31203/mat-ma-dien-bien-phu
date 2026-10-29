# Chạy và build game

## Điều kiện

- Node.js **>=22.12.0**, npm và trình duyệt máy tính hỗ trợ Canvas/Web Audio/native dialog.
- Phaser **3.90.0**, Vite **8.3.5** đã khóa bằng lockfile. Không cần cài toàn cục hoặc backend.
- Chạy lệnh từ thư mục chứa `package.json`.

## Phát triển

```powershell
npm ci
npm run dev
```

Mở **http://127.0.0.1:5173**. Cổng 5173 dùng `strictPort`; nếu đã bị chiếm, dừng tiến trình đang dùng cổng rồi chạy lại. Không mở `index.html` trực tiếp bằng `file://`: game chính dùng ES modules và tài nguyên qua Vite/HTTP.

## Kiểm tra bản build

```powershell
npm test
npm run build
npm run preview
```

Vite tạo `dist/`, preview tại **http://127.0.0.1:4173**, cũng dùng cổng cố định. Preview chỉ phục vụ kiểm tra cục bộ; dự án chưa có hosting. `base: './'` tạo đường dẫn tài nguyên tương đối. Bản build bao gồm engine và tài nguyên cục bộ; đã kiểm tra chơi tới kết qua HTTP khi mạng ngoài bị chặn nhưng máy chủ localhost vẫn hoạt động. Không coi đường dẫn `file://` là cách chạy được hỗ trợ.

## Tiến độ và khắc phục lỗi

Save nằm trong localStorage của origin hiện tại, không đồng bộ thiết bị/tài khoản; đổi cổng dev sang preview là save khác. Tiếp tục về checkpoint an toàn gần nhất đã đi vào, không về tọa độ tùy ý hoặc câu thoại đang đọc. Khi storage lỗi, game thông báo và vẫn giữ phiên đang chơi; dữ liệu hỏng không tự được coi là tiến độ hợp lệ.

Chọn **Bắt đầu lại** rồi xác nhận để xóa save và đặt lại tùy chọn. Nếu trình duyệt chặn xóa, game báo rằng save cũ có thể còn sau tải lại. Nội dung suy nghĩ riêng ở hòa bình không được lưu.

Nếu không di chuyển được, đóng bảng rồi bấm bản đồ/**Đi vào bản đồ** và nhấn lại phím. Nếu không có tiếng, bấm **Bật âm thanh/Bật lại âm thanh**, kiểm tra mute/âm lượng trong tùy chọn và âm lượng trình duyệt. Quyền phát runtime không khôi phục tự động từ save; suspend audio cần thao tác bật lại.

## Phạm vi bàn giao

Mã nguồn chia sẻ tại [GitHub](https://github.com/thaideptrai218/mat-ma-dien-bien-phu). Có thể clone theo README rồi chạy bằng npm. Chưa có cấu hình deploy, domain hoặc tài khoản trong game. Chưa xác định giấy phép phân phối cốt truyện/tài sản. [README](../README.md) là hướng dẫn người chơi; [roadmap](project-roadmap.md) ghi trạng thái QA.
