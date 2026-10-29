# Đề xuất game Mật mã Điện Biên Phủ

## Bối cảnh

- Nguồn cốt truyện: `Cốt truyện game_ Mật mã Điện Biên Phủ.pdf`, đã đọc cả hai trang.
- Ngày đề xuất: 2026-10-29.
- Đã xác nhận: game HTML 2D; góc nhìn từ trên xuống; Phaser + JavaScript (người dùng trả lời “được” ngày 2026-10-29).
- Thiết kế màu đất/ô liu và pixel art đã được duyệt, kèm yêu cầu bản đồ lớn hơn và camera đi theo nhân vật ngày 2026-10-29.
- Yêu cầu bổ sung: visual novel lịch sử kết hợp khám phá; Minh có hoạt ảnh di chuyển và âm thanh; tương tác nhiều manh mối để mở lời kể. Thử thách Him Lam đổi sang sắp thứ tự bốn giai đoạn theo nội dung người dùng cung cấp.
- Phạm vi toàn game đã được duyệt với “duyệt và làm full” ngày 2026-10-29. Game chính đã hoàn tất và kiểm chứng cục bộ. Tài liệu này giữ bối cảnh đề xuất và nguồn; xem [yêu cầu sản phẩm](project-overview-pdr.md) và [README](../README.md) cho hợp đồng hiện tại.

## Trải nghiệm bản đầu

- Một người chơi, giao diện và hội thoại tiếng Việt.
- Vòng chơi: khám phá bản đồ → tới gần manh mối → Minh kể qua khung hội thoại có chân dung/tên nhân vật → ghi vào sổ tay → giải mã trình tự → tiếp tục câu chuyện.
- Lời kể có nút đọc tiếp, hiện hết và xem lại. Minh là nhân vật hư cấu, lời tự sự được biên soạn cho game; các dữ kiện lịch sử có nguồn riêng.
- Minh có idle/walk bốn hướng, bước chân và tay thay đổi theo khung hình; ngừng bước khi đứng yên, bị chặn hoặc đang đọc hội thoại.
- Có âm nền nhẹ, bước chân, tiếng giấy và âm báo đúng/sai. Chỉ phát sau thao tác bật tiếng; có tắt tiếng. Không mặc định có diễn viên lồng tiếng hoặc giọng đọc tự động.
- Ưu tiên máy tính, màn hình ngang; WASD/phím mũi tên di chuyển, E tương tác, Esc đóng bảng hoặc tạm dừng.
- Bảo tàng mở đầu → bốn phòng thử thách → trở về bảo tàng.
- Mỗi phòng có đồ vật khám phá, manh mối trong sổ tay và cơ cấu mở cửa.
- Khung chơi chiếm toàn bộ chiều ngang; sổ tay mở bằng N hoặc nút rõ ràng, không dành cột cố định thu nhỏ bản đồ.
- Bản đồ lớn hơn khung nhìn theo cả hai chiều, có các khu chức năng nối bằng hành lang. Kích thước khởi điểm khoảng 2400×1440 đơn vị thế giới; có thể điều chỉnh sau chơi thử.
- Camera theo Minh khi di chuyển, có vùng đệm để hạn chế rung và dừng ở rìa bản đồ. HUD, nhiệm vụ và bảng tương tác giữ vị trí trên màn hình.
- Manh mối lịch sử là dữ kiện quá khứ được hiển thị trong hành trình ngày 7/5/1954, không phải nhân vật di chuyển lần lượt qua các ngày chiến dịch.
- Mục tiêu thời lượng 10–15 phút; cần kiểm chứng bằng chơi thử, không phải cam kết.
- Lưu tiến độ tại máy đang chơi, có Tiếp tục và Chơi lại với xác nhận xóa tiến độ.
- Gợi ý tăng dần; thử sai cho phản hồi và được thử lại, không phạt bằng mất toàn bộ tiến độ.

## Bốn thử thách

| Phòng | Cơ chế đề xuất | Điều kiện hoàn thành |
| --- | --- | --- |
| Him Lam | Khám phá bốn manh mối, đọc lời kể rồi sắp bốn thẻ sự kiện | Chuẩn bị trận địa → pháo binh khai hỏa chiều 13/3/1954 → bộ binh tiến công → làm chủ Him Lam, thắng lợi trận mở màn |
| Bản đồ chiến dịch | Đặt thẻ cứ điểm lên sơ đồ và sắp xếp các mốc chiến dịch có ngày rõ ràng | Hoàn thành vị trí trên sơ đồ và thứ tự mốc được chọn |
| Sở chỉ huy | Ghép các mẩu điện báo, xác định ngày và sự kiện quyết định | Nhận diện sự kiện bắt Đờ Cát cùng bộ chỉ huy ngày 7/5/1954 |
| Cánh cửa hòa bình | Khám phá ký ức, chọn hành động thiết thực hoặc viết suy nghĩ tùy chọn | Người chơi chủ động bước qua cửa; không chấm quan điểm đúng/sai và không bắt buộc nhập lời suy nghĩ |

## Nội dung thử thách Him Lam đã chốt

1. **Chuẩn bị trận địa:** bộ đội triển khai lực lượng, chuẩn bị cho trận đánh.
2. **Pháo binh khai hỏa:** chiều 13/3/1954, pháo binh mở màn.
3. **Bộ binh tiến công:** bộ binh tiếp tục tiến đánh các vị trí phòng ngự.
4. **Giành thắng lợi:** quân ta làm chủ Him Lam, hoàn thành trận mở màn; không phải kết thúc toàn chiến dịch ngày 7/5.

Trong chương I, bốn manh mối nằm ở bàn hồ sơ, điện đài, sơ đồ hành lang và gian bản đồ. Chỉ đọc đến cuối và bấm ghi nhận mới thêm manh mối. Mở rồi đóng bằng Esc không tính hoàn thành. Khi đủ bốn manh mối, dùng nút lên/xuống để đổi thứ tự thẻ; không bắt buộc kéo thả. Game chính giữ quy tắc này, có đủ ba chương sau và kết bảo tàng; hai manh mối hòa bình là tùy chọn.

## Hình ảnh đề xuất

- Phong cách pixel art rõ nét, màu đất, xanh ô liu, ánh đèn vàng trong hầm.
- Khung nhìn sáng đủ đọc đường đi; nhân vật và vật tương tác nổi bật với nền.
- Phông chữ hỗ trợ đầy đủ dấu tiếng Việt; nội dung dài hiển thị bằng HTML.
- Thanh nhiệm vụ ngắn, tiến độ bốn phòng và sổ tay; ưu tiên diện tích chơi.
- Có tùy chọn giảm hiệu ứng; âm thanh chỉ bắt đầu sau thao tác người dùng.

## Ranh giới bản đầu

- Đề xuất không đưa chiến đấu, tài khoản, máy chủ hoặc nhiều người chơi vào bản đầu.
- Điều khiển cảm ứng và phát hành trực tuyến cần xác nhận phạm vi sau.
- Bản đồ và kiến trúc phòng là sơ đồ hóa cho giải đố, phải ghi rõ trong game; không trình bày như bản phục dựng chính xác.
- Không dùng cơ chế nối điểm để ngụ ý một tuyến tấn công lịch sử duy nhất.
- Không thêm dữ kiện chưa có nguồn; phân biệt hiệu ứng kể chuyện với tư liệu lịch sử.

## Tiêu chí nghiệm thu đề xuất

- Có thể chơi từ đầu đến kết thúc với bốn cửa mở đúng điều kiện.
- Nhân vật không đi xuyên tường hoặc đồ vật chắn lối; không thể bỏ qua cửa đang khóa.
- Di chuyển đến khu vực ngoài khung nhìn ban đầu làm camera dịch chuyển và hiển thị các khu khác; không chỉ phóng to căn phòng cũ.
- Camera và nhân vật cùng tuân theo biên bản đồ; thay đổi kích thước cửa sổ không làm méo tỷ lệ hoặc lạc vị trí tương tác.
- Mở hội thoại hoặc chuyển focus khỏi game sẽ xóa phím đang giữ; đóng bảng không tự tiếp tục đi. Giảm chuyển động bỏ độ trễ camera nhưng vẫn giữ cuộn cần thiết để khám phá.
- Mở bảng hội thoại/câu đố sẽ dừng di chuyển; đóng bảng không kẹt phím.
- Mỗi câu đố có manh mối đủ để suy luận và có gợi ý.
- Mỗi manh mối có đoạn kể riêng, ghi nhận một lần và có thể đọc lại; Him Lam chỉ hoàn thành khi có đủ bốn manh mối và đúng thứ tự trên.
- Animation thay đổi tư thế và hướng khi đi thật; đâm tường hoặc mở hội thoại thì dừng hoạt ảnh bước và tiếng chân. Không dùng ảnh đứng yên trượt trên sàn để gọi là hoạt ảnh.
- Bật tiếng tạo âm thanh thật, tắt tiếng có hiệu lực ngay; không tự phát tiếng khi vừa tải trang. Hội thoại vẫn đọc được khi tắt tiếng.
- Tải lại trang có thể tiếp tục tiến độ hợp lệ; dữ liệu lưu hỏng không làm game ngừng chạy.
- Chơi lại đưa game về trạng thái ban đầu; thao tác phải có xác nhận.
- Phần kết giữ thông điệp trân trọng hòa bình và trách nhiệm trong hiện tại.

## Tham khảo lịch sử

- [Chuyên trang Điện Biên Phủ — Báo Nhân Dân](https://dienbienphu.nhandan.vn/): đã đọc mục ngày 13/3 và 7/5, xác nhận các mốc chính được dùng trong đề xuất.
- [Trận mở màn Him Lam — Bảo tàng Lịch sử quốc gia](https://baotanglichsu.vn/vi/Articles/2002/68138/ky-niem-60-nam-chien-thang-lich-su-djien-bien-phu-1954-2014tran-mo-man-tieu-diet-trung-tam-dje-khang-him-lam-13-3-1954.html): đã đọc toàn phần diễn biến, xác nhận chuỗi chuẩn bị/pháo/bộ binh/kết quả; lược thuật theo bốn bước của người dùng, không yêu cầu phút chính xác.
- [Trận Him Lam 13/3/1954 — Cổng thông tin Hà Tĩnh, theo VTV](https://hatinh.gov.vn/vi/bai-viet/tran-him-lam-1331954-tran-mo-man-chien-dich-dien-bien-phu-lung-lay-nam-chau): đã đọc, hỗ trợ bối cảnh trận mở màn; không dùng bài tổng quan này làm nguồn chi tiết toàn bộ diễn biến.
- [Diên Biên Phu : les mémoires perdurent et ne s’éteignent jamais — VietnamPlus](https://fr.vietnamplus.vn/dien-bien-phu-les-memoires-perdurent-et-ne-seteignent-jamais-post223975.vnp): đã tìm được tựa người dùng nêu; bản đăng lại trên Bảo tàng Lịch sử quốc gia đã được đọc để đối chiếu bối cảnh ký ức và tri ân, không dùng thay cho nguồn trình tự trận đánh.
- [Những dấu mốc lịch sử — Bảo tàng Chiến thắng Điện Biên Phủ](https://btctdbp.svhttdl.dienbien.gov.vn/portal/pages/2020-5-8/Nhung-dau-moc-lich-su-cua-Chien-dich-Dien-Bien-Phu1olgi0pxgedr.aspx): tìm thấy qua kết quả tìm kiếm; tải toàn trang bị timeout, cần kiểm tra lại trước khi dùng các chi tiết ngoài mốc chính.

## Bước tiếp theo và câu hỏi chưa chốt

- Kết quả nghiên cứu: [Đánh giá công nghệ và lối chơi](../plans/reports/261029-bootstrap-research.md).
- Công nghệ đã duyệt: Phaser + JavaScript; xem [quyết định công nghệ](tech-stack.md).
- Game Phaser có đủ hành trình, lời kể, hoạt ảnh/âm thanh, manh mối, câu đố và save cục bộ. Bản mẫu chương I giữ độc lập để đối chiếu thiết kế.
- Game chính đã đạt QA cục bộ và có hướng dẫn bàn giao; xem [roadmap và bằng chứng](project-roadmap.md).
- Cảm ứng, lồng tiếng/TTS và hosting nằm ngoài phạm vi game đã duyệt. Người dùng bổ sung yêu cầu chia sẻ mã nguồn công khai qua GitHub để cộng tác. Câu hỏi chưa chốt: giấy phép phân phối cốt truyện/tài sản.
