# Hướng dẫn thiết kế — Mật mã Điện Biên Phủ

Ngày: 2026-10-29. Người dùng đã duyệt pixel art màu ô liu, bản đồ lớn/camera, visual novel và triển khai toàn game. Game Phaser có đủ bốn thử thách, kết bảo tàng, hoạt ảnh, âm thanh và lưu cục bộ; đã hoàn tất và kiểm chứng cục bộ, xem [roadmap/QA](project-roadmap.md). Các thông số/API ghi rõ “bản mẫu” dưới đây chỉ mô tả Canvas prototype giữ để đối chiếu, không phải hợp đồng game chính.

## Áp dụng ở game chính

Game Phaser dùng khung logic 960×540, Scale.FIT; bảo tàng 1280×800 và bốn bản đồ hầm 2400×1440. HUD và dialog HTML giữ vị trí trên trang khi camera di chuyển; căn hầm/đồ vật và sprite vẽ bằng mã. Màu/chữ giữ hướng ô liu, giấy và serif; native dialog cho lời Minh, sổ tay, puzzle và tùy chọn.

Đọc từng lời hoặc Đọc toàn cảnh, bấm Ghi manh mối ở câu cuối để nhận. Lời đã đọc cho mở lại intro các chương đã tới, kể cả còn dang dở, và clue đã phát hiện. Giảm chuyển động bỏ độ trễ camera; có tăng sáng cảnh. Save giữ checkpoint an toàn gần nhất, không cursor hội thoại. Âm thanh tổng hợp cục bộ cần bật chủ động, có mute/volume và bật lại sau suspend; chưa có lồng tiếng/TTS. Xem [README](../README.md) và [kiến trúc](system-architecture.md) cho hành vi hiện tại.

## Ý tưởng và nguồn truyện

Theo tóm tắt PDF trong [đề xuất game](game-proposal.md), Minh từ bảo tàng bước vào hầm chỉ huy trong quá khứ. Bốn thử thách dẫn qua ký ức Him Lam, bản đồ chiến dịch, điện báo tại sở chỉ huy và cánh cửa hòa bình để trở về hiện tại. Hành trình diễn ra ngày 7/5/1954; dữ kiện tháng 3 là ký ức được tìm lại. Giữ thông điệp trân trọng hòa bình, không đánh giá đúng/sai quan điểm cá nhân ở phần kết.

Chữ ký thị giác: căn hầm pixel nhìn từ trên xuống, ánh đèn vàng ấm và chữ serif gợi hồ sơ lưu trữ. Bản mẫu mở lời Minh trên panel visual novel phía dưới, nền là hầm Him Lam; game chính mở menu rồi lời ở bảo tàng trước khi vào hầm. Người chơi chủ động đọc rồi khám phá. Diện tích lớn nhất dành cho bối cảnh, không dùng trang tiếp thị hay bảng chỉ số.

## Bố cục và phê bình thiết kế

Đã so sánh khung cảnh toàn chiều ngang có sổ tay mở theo yêu cầu và khung cảnh cạnh sổ tay. Sau phản hồi của người dùng, chọn khung cảnh toàn chiều ngang: sổ tay mở bằng N hoặc nút rõ ràng trên bản đồ, không chiếm cố định 288px. Giữ nhiệm vụ, chương, nút khám phá và thanh công cụ đứng yên trong viewport khi thế giới di chuyển.

Thế giới minh họa 2400×1440 pixel gồm sáu gian: hồ sơ Him Lam, điện đài, kho tiếp tế, bản đồ, nghỉ chân và cửa ký ức. Hành lang gỗ nối các lối mở; từng gian có đồ vật và cột mốc riêng, không tăng diện tích bằng sàn trống đơn thuần. Các nhãn đồ vật thuộc tọa độ thế giới, đi theo tranh khi camera dịch chuyển. Đây là bố cục thử camera trong chương I, không đồng nghĩa triển khai sáu màn hay thay đổi bốn thử thách của cốt truyện.

Camera theo tâm nhân vật với độ trễ ngắn, kẹp trong biên thế giới. Trong bản mẫu Canvas, viewport rộng logic 960px, chiều cao thay đổi theo tỷ lệ vùng hiển thị (300–1100px), luôn nhỏ hơn thế giới ở cả hai chiều. Game Phaser dùng khung logic 960×540 với Scale.FIT để giữ tỷ lệ; đây là hai cách trình diễn riêng, cùng yêu cầu world lớn và camera theo nhân vật. Giảm chuyển động bỏ độ trễ, vẫn giữ cuộn cần thiết để đi lại. Sàn đá, đèn và sơ đồ hóa giữ phong cách đã duyệt.

Rủi ro: sổ tay giấy và serif dễ thành trang biên tập chung chung. Bản mẫu gắn chúng với hồ sơ, điện đài, sơ đồ và bản tin có lời Minh riêng. Panel dưới kết hợp chân dung Minh, nhãn địa điểm, tên người nói và lời kể ngôi thứ nhất. Chỉ chuyển từ khám phá sang đọc khi người chơi tương tác; không ép tự chạy lời thoại. Không dùng quét CRT, rung màn hình hoặc chớp sáng chiến đấu.

## Màu và chữ

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `--ink` | `#171d18` | Nền trang, sắc xanh đất tối |
| `--surface` | `#222a21` | Nền phụ |
| `--text` | `#eee8d6` | Chữ chính trên nền tối |
| `--muted` | `#c1c5af` | Hướng dẫn phụ trên nền tối |
| `--gold` | `#e4ba6b` | Ánh đèn, focus, chương hiện tại |
| `--paper` | `#e7ddbd` | Giấy sổ tay, bảng hội thoại |
| `--paper-ink` | `#343b2d` | Chữ trên giấy |
| `--olive` | `#394b30` | Nút hành động chính |
| `--error` | `#813b2e` | Lỗi có chữ giải thích |

Màu trong tranh pixel thuộc bảng vật liệu riêng: gạch, đá, gỗ, đèn và áo nhân vật. Chúng không thay thế token chữ và trạng thái của giao diện.

Display: Georgia → Cambria → Times New Roman → serif. Body: Segoe UI → Tahoma → sans-serif. Phông cục bộ, không yêu cầu mạng; dấu tiếng Việt được giữ trong toàn bộ nội dung. Không dùng phông pixel cho đoạn văn. Văn bản hội thoại, sổ tay và trường nhập 17px, line-height 1.55–1.65; tiêu đề 26–34px. Nhãn cảnh, phím tắt và chú thích dùng cỡ nhỏ hơn vì là thông tin phụ.

## Truyện tương tác chương I

Vòng chơi: khám phá → tới gần dấu ✧ → E hoặc nút khám phá → đọc cảnh Minh → nhận manh mối → sổ tay → ghép trình tự. Bốn cảnh kể ngắn độc lập có thể khám phá theo thứ tự đi lại thực tế; câu đố cuối mới yêu cầu xếp đúng trình tự lịch sử. Đọc lại không tăng số manh mối hoặc tạo bản ghi trùng.

| Dấu vết | Vị trí thế giới, bán kính | Nội dung lịch sử |
| --- | --- | --- |
| Bản ghi chuẩn bị | (530,270), 190px; bàn hồ sơ | Chuẩn bị trận địa |
| Điện lệnh pháo binh | (1160,260), 190px; điện đài | Pháo binh mở màn chiều 13/3/1954 |
| Sơ đồ xung phong | (1950,594), 170px; hành lang phía đông | Bộ binh xung phong |
| Bản tin Him Lam | (285,1040), 190px; gian bản đồ dưới trái | Làm chủ Him Lam, giành thắng lợi trận mở màn |

Các hiện vật, căn hầm và lời kể Minh là sáng tác cho trò chơi; không giả là bản sao hồ sơ hoặc lời chứng. Dữ kiện lịch sử tách riêng trong sổ tay, có liên kết [bài về trận Him Lam — Bảo tàng Lịch sử quốc gia](https://baotanglichsu.vn/vi/Articles/2002/68138/ky-niem-60-nam-chien-thang-lich-su-djien-bien-phu-1954-2014tran-mo-man-tieu-diet-trung-tam-dje-khang-him-lam-13-3-1954.html). Không yêu cầu phút khai hỏa chính xác; kết quả Him Lam không được mô tả là kết thúc toàn chiến dịch.

Panel visual novel dùng native dialog, chân dung mới có nền trong và fallback chữ nếu ảnh chưa tải. Lời kể chạy hiệu ứng chữ nhẹ, có “Hiện hết”, “Đọc toàn cảnh” và nút tiếp/nhận manh mối. Giảm chuyển động hiện chữ ngay. Người chơi tự chọn nhịp đọc; Esc có thể rời bảng, chưa nhận manh mối thì lần sau đọc lại. “Lịch sử lời kể” lưu các cảnh đã nhận trong phiên xem, không lưu qua tải lại.

## Điều khiển và trạng thái

- Bản mẫu: click canvas hoặc nút “Đi vào bản đồ”, rồi WASD/phím mũi tên di chuyển. Tốc độ 220 pixel thế giới/giây, chuẩn hóa đường chéo; va chạm hình chữ nhật với tường và vật dụng, chia bước để tránh xuyên tường khi khung hình chậm.
- E mở manh mối gần nhất; nút tương tác đổi nhãn theo đồ vật, bị vô hiệu khi không đủ gần. N mở sổ tay, Esc mở tùy chọn khi không có bảng; Esc đóng dialog theo hành vi trình duyệt. “Ghép trình tự” mở độc lập nhưng không thể đối chiếu trước khi đã nhận đủ bốn manh mối.
- Chỉ giữ phím di chuyển khi canvas có focus; Tab rời bản đồ. Không chặn phím mũi tên ở nút hoặc select bên ngoài. Mở/đóng modal, blur và thay đổi hiển thị trang đều xóa phím đang giữ; cần nhấn lại để đi tiếp, không tự trôi nhân vật.
- Bản mẫu dùng Canvas/JavaScript riêng, có animation di chuyển/đứng yên và âm thanh Web Audio để thử trải nghiệm. Chưa có engine Phaser, chuyển chương, cảm ứng hay lưu tiến độ. Chỉ chương I có thể hoàn thành trong bản mẫu.
- Câu đố thay hoàn toàn bảng chọn địa điểm/ngày/sự kiện: bốn thẻ ban đầu đảo thứ tự (pháo binh, thắng lợi, chuẩn bị, bộ binh); nút ↑ ↓ có nhãn đầy đủ để đổi vị trí bằng chuột/bàn phím. Không bắt buộc kéo thả. “Đối chiếu trình tự” chỉ bật khi đủ bốn manh mối. Sai giữ thẻ để sửa, hai mức gợi ý, đúng xác nhận hoàn thành chương I.
- Đặt lại bản mẫu: xóa manh mối/lịch sử/câu đố tạm, trả Minh về (580,350), đưa camera về vị trí tương ứng và mở lại lời đầu. Không có dữ liệu người chơi hoặc lưu qua tải lại. Trạng thái âm thanh do người dùng chủ động chọn, không tự bật khi đặt lại.
- Tùy chọn: giảm chuyển động/hiện chữ ngay, tăng độ sáng cảnh và hiệu ứng âm thanh. Nút “Bật âm thanh” và checkbox chỉ gọi audio sau thao tác người dùng. Có cue giấy, hé lộ, đúng/sai và bước chân; không hứa lồng tiếng hoặc tự dùng TTS. Chuyển động/âm nền tạm dừng trong bảng; hiệu ứng thao tác có chủ ý có thể phát khi âm thanh đã bật.

## Khả năng tiếp cận và responsive

- Native `dialog` giới hạn focus; có nút đóng 44px, Esc và click vùng nền ngoài. Focus quay về nút mở theo trình duyệt.
- Focus vàng 3px, offset 4px; phản hồi lỗi/thành công có nội dung chữ và ký hiệu, không chỉ dùng màu.
- Đã tính tương phản theo độ chói sRGB: chữ chính/nền tối 14,00:1; chữ giấy/nền giấy 8,55:1; ghi chú sổ tay/nền giấy 4,69:1; chữ nút chính/nền ô liu 8,23:1. Chú thích nằm trên tranh vẫn cần kiểm tra trực quan theo cảnh cuối.
- Canvas có mô tả bố cục bằng văn bản và nhận focus bàn phím; khám phá, sổ tay, lịch sử, tư liệu, tạm dừng và câu đố có nút HTML riêng. Sổ tay chỉ đường đến từng manh mối còn thiếu. Không bắt buộc click đúng tọa độ hoặc kéo thả để đọc tư liệu.
- Từ 761px: bản đồ chiếm toàn chiều ngang, cao 56dvh (tối đa 570px), sổ tay dùng dialog. Tại 1280×800 mục tiêu giữ bản đồ và thao tác chính trong khung trang.
- Đến 760px: header gọn, bốn chương vẫn có tên; bản đồ cao 390px, công cụ cố định trong viewport; hướng dẫn xếp dọc. Không khóa cuộn dọc hoặc zoom. Mục tiêu 375px không tràn ngang; chuyển động cảm ứng chưa trong phạm vi.
- Touch target cho hành động chính và dialog tối thiểu 44px. Nút đặt lại thuộc thanh xem mẫu, không phải điều khiển trong trò chơi.
- `prefers-reduced-motion` tắt animation/transition, hiện lời kể ngay và bỏ độ trễ camera; chuyển động thiết yếu khi di chuyển vẫn được giữ. Mặc định hover/active ngắn 180ms; không rung hoặc nhấp nháy.

## Kiểm tra hình học bản mẫu

API chỉ đọc `window.cameraPreview.getState()` giữ player/camera/world/viewport/paused và thêm `nearbyClueId` cho manh mối trong tầm. `bunkerArtwork.interactables` là mảng đóng băng mô tả bốn điểm tương tác. `window.narrativePreview.getState()` trả `{collected,order,solved,sceneId,page,revealed,historyCount}` để kiểm tra nhận manh mối và câu đố. Không có phương thức nhận manh mối ở xa hoặc tự hoàn thành câu đố. Các API này phục vụ kiểm tra bản mẫu, không phải hợp đồng game Phaser.

## Trung thực nội dung và tài sản

Hầm, đồ vật và sơ đồ trong tranh chỉ phục vụ câu đố, không phải phục dựng chính xác kiến trúc hay tuyến tiến công. Bản mẫu ghi điều này ngay trong khung cảnh; bảng tương tác nhắc chưa có lưu tiến độ. Dữ kiện Him Lam 13/3/1954 lấy từ đề xuất và báo cáo nghiên cứu, cần giữ nguồn lịch sử khi triển khai nội dung cuối.

Tranh phòng được vẽ bằng Canvas 2D, sprite và vật dụng bằng mã; tài nguyên nằm cục bộ. Biểu trưng phong bì/chìa khóa và chân dung Minh là minh họa mới, không phải hiện vật, dấu ấn lịch sử hoặc chân dung một người thật. Tránh mô tả biểu trưng như huy hiệu thật.

## Bản mẫu để đối chiếu khi triển khai

- Giữ thế giới rộng, các khu nối bằng hành lang và camera bám theo Minh theo yêu cầu đã nhận.
- Sổ tay mở theo yêu cầu; công cụ giữ vị trí trong viewport.
- Xem [kiểm tra bản mẫu camera](../plans/reports/261029-large-map-camera-preview-qa.md) và [kế hoạch triển khai](../plans/261029-1757-mat-ma-dien-bien-phu-game/plan.md).
- Phạm vi hiện tại ưu tiên bàn phím; save đã triển khai ở game Phaser, chưa có trong bản mẫu. Cảm ứng để đi bộ và hosting ngoài phạm vi game hiện tại; mã nguồn được chia sẻ trên GitHub theo yêu cầu bổ sung.
