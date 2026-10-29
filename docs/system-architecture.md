# Kiến trúc hệ thống

## Tổng quan

Một ứng dụng tĩnh Vite, chạy hoàn toàn trong trình duyệt. Phaser hiển thị thế giới; HTML hiển thị lời kể, sổ tay, menu và câu đố. `GameSession` giữ state và phối hợp các thành phần.

## Luồng trạng thái

UI phát intent tới `game-actions.js`; session gửi action hợp lệ tới reducer thuần `applyAction`. State mới cập nhật scene, HUD, audio và save. Scene báo điểm gần nhất, chuyển động và checkpoint; không tự sửa tiến độ hay ghi storage.

Một `AdventureScene` nạp dữ liệu bản đồ theo `chapterId`. Bảo tàng 1280×800, bốn hầm 2400×1440; khung logic 960×540 dùng Scale.FIT. Arcade Physics chặn tường, đồ vật và cửa khóa; camera có deadzone, follow và bounds. Input chỉ nhận từ canvas có focus, được xóa khi mở bảng/blur/đổi tab. Animation và tiếng bước dựa trên chuyển động sau bước vật lý, không chỉ phím đang giữ.

## Lời kể và mở khóa

Thấy manh mối chỉ ghi `discoveredClueIds`. `NarrativeView` theo dõi câu đang đọc; composition kiểm tra đây là câu cuối và đúng lời kể trước khi ghi `collectedClueIds` cùng beat hoàn tất. Đóng bảng không nhận manh mối; đọc lại không nhân bản.

Ba câu đố đầu yêu cầu đủ manh mối và đáp án đúng. Reducer kiểm tra thứ tự phòng, tách hoàn tất thử thách khỏi thao tác đi qua cửa. Hòa bình cho phép hoàn tất mà không chọn hoặc nhập gì, không yêu cầu hai manh mối tùy chọn. Intro chưa hoàn tất được mở lại khi tiếp tục; lịch sử hiển thị intro các chương đã tới, kể cả còn dang dở.

## Lưu và phục hồi

Save schema version 1 chứa chương/checkpoint, phòng hoàn tất, manh mối đã thấy/đã ghi, beat hoàn tất, mức gợi ý và tùy chọn. Không lưu tọa độ tùy ý, cursor câu thoại, draft câu đố, suy nghĩ riêng hoặc AudioContext. Mọi thao tác storage đều bắt lỗi; dữ liệu sai không được dùng để mở khóa và không tự xóa khi đọc.

Chỉ checkpoint khai báo trên bản đồ, có vị trí đi được và đường tiếp cận an toàn, được ghi từ scene. Tiếp tục giải checkpoint theo bản đồ; ID không còn hợp lệ trở về `entry` an toàn. Reset cần xác nhận; lỗi xóa có thông báo rằng save cũ có thể còn sau tải lại.

## Âm thanh và tài nguyên

Một `AudioController` tạo tối đa một AudioContext cho phiên, sau thao tác bật tiếng. Preference lưu riêng với quyền phát runtime. Master gain điều khiển mute/volume; các nguồn tổng hợp được dừng khi inactive, mất focus hoặc không còn phù hợp. `statechange` cập nhật trạng thái suspend; người chơi có thể bấm bật lại để resume. Không tự phát khi tải save, không TTS hay dịch vụ ngoài.

Hiệu ứng ghi manh mối và hoàn tất hòa bình phát sau khi dialog đóng, canvas nhận focus và mode audio được đồng bộ. Callback ở khung kế tiếp bỏ qua hiệu ứng nếu đã mở bảng khác hoặc dừng lượt chơi, tránh âm bị cắt bởi focus quay về nút HUD hoặc phát muộn ngoài ngữ cảnh.

Phaser và PNG được bundle từ dự án; tranh phòng/sprite tạo bằng mã. Link tư liệu mở ngoài chỉ khi người chơi chọn. Provenance hình và ranh giới hư cấu được giữ trong [nguồn hình ảnh](image-prompts.md) và bảng tư liệu trong game.

## Tham chiếu

[Cấu trúc mã](codebase-summary.md) · [Quy ước](code-standards.md) · [Lưu ý chạy HTTP](deployment-guide.md)
