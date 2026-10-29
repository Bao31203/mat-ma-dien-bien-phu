# Rà soát kế hoạch triển khai

## Bối cảnh

- Ngày: 2026-10-29.
- Phạm vi: plan.md và đủ năm tệp phase; đối chiếu README, đề xuất, thiết kế và bản mẫu camera hiện có.
- Ba đánh giá độc lập: tính nhất quán giả định, các đường lỗi khi chơi và dữ liệu/DOM trong mô hình game đơn người chơi cục bộ.
- Đây là rà soát kế hoạch, không phải kiểm thử hoặc review mã game Phaser chưa tồn tại.

## Kết quả

- 0 Critical, 0 High, 1 Medium.
- Chấp nhận 1 phát hiện cụ thể để làm rõ hợp đồng; không đảo quyết định sản phẩm của người dùng.
- Hai đánh giá còn lại không có phát hiện có chứng cứ. Không thêm xác thực, mã hóa hoặc chống sửa save vào game cục bộ vì chúng không giải quyết mục tiêu sản phẩm hiện tại.

## Phát hiện được chấp nhận

**Medium — Lưu checkpoint chưa có đường cập nhật khi đang khám phá.**

- Bản dự thảo phase-04:24 hứa resume ở checkpoint an toàn gần nhất; phase-02:31–32 chỉ khai báo onInteract/onExit và API vào chương; phase-01:33 chỉ truyền checkpoint qua enter-chapter.
- Tình huống: nhận manh mối xa điểm vào chương → autosave → tải lại vẫn về checkpoint đầu vì scene chưa báo vị trí an toàn mới.
- Giải quyết: checkpoint có vùng an toàn, scene phát onCheckpoint({chapterId,checkpointId}) khi bước vào vùng mới; composition kiểm tra chapter và checkpoint từ dữ liệu map, gửi reach-checkpoint tới reducer rồi autosave theo sự kiện.
- Ý nghĩa resume được chốt chính xác: checkpoint an toàn vừa đi qua gần nhất, không tính khoảng cách xuyên tường và không lưu tọa độ tùy ý.
- Reducer vẫn thuần, không import Phaser/DOM/world-data; kiểm tra geometry và ID checkpoint thuộc composition và đường load.
- Bổ sung kiểm tra đi đến checkpoint xa, reload, không phát sự kiện/ghi save mỗi frame.

## Nhất quán toàn kế hoạch

Đã đọc lại đủ sáu tệp, đối chiếu action union, callback scene, autosave, resume và ma trận kiểm tra sau sửa. Phát hiện checkpoint được xử lý xuyên suốt; 0 mâu thuẫn chưa giải quyết. Mọi pha giữ pending (0/5) cho đến khi được duyệt và triển khai thật.

## Câu hỏi chưa chốt

Chờ người dùng duyệt kế hoạch để triển khai; không có quyết định sản phẩm mới phát sinh từ rà soát.
