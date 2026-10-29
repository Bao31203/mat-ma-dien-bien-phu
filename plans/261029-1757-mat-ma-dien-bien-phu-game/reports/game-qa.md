# QA game chính — 2026-10-29

Kết quả: **đạt bàn giao cục bộ**. Đã chơi từ bảo tàng tới kết thúc trên game Phaser thật, gồm lượt production cuối `index-DE-mEXGN.js`. Không có lỗi chặn chưa giải quyết. Không dùng ảnh hoặc kết quả prototype làm bằng chứng game chính.

## Môi trường và phương pháp

- Windows, Node 24.15.0, Phaser 3.90.0, Vite 8.3.5; Chromium của agent-browser. Dev `http://127.0.0.1:5173/`, production `http://127.0.0.1:4173/`.
- `npm test`: **23/23** đạt; `npm run build`: đạt sau sửa cuối. Cảnh báo engine chunk 1,194.43 kB được giữ nguyên, không coi là lỗi build. Chưa đo benchmark hiệu năng.
- Điều khiển bằng nút DOM, phím thật của CLI và sự kiện bàn phím canvas đi qua listener/physics của game. [Driver QA](browser-journey-driver.js) chỉ đi bộ, đọc, chọn và xếp bằng các control đang render; không gán state, tọa độ, puzzle draft hoặc tiến độ save.
- `window.gameDebug.getSnapshot()` chỉ đọc. Fault injection chỉ ở khả năng storage/Web Audio và chỉ trong browser QA riêng; không đưa vào mã sản phẩm.
- [QA độc lập](game-edge-qa.md), [review mã và sửa cuối](game-code-review.md), [kiểm tra luật/storage](foundation-tests.md), [đối chiếu cuối](pm-completion.md), [kiểm tra bàn giao](delivery-hygiene.md).

## Hành trình đã chơi

| Chặng | Kết quả thực tế |
| --- | --- |
| Bảo tàng | Chơi mới; đọc mô hình/ánh sáng và lời Minh; hoàn tất intro, đi tới cửa rồi E. |
| Him Lam | Mở clue rồi Esc chỉ thêm discovered, collected vẫn rỗng. Quay lại, đọc tới cuối và ghi riêng cả bốn clue. Sai thứ tự không mở cửa, gợi ý hai mức hoạt động, sửa đúng rồi đi qua cửa đông. |
| Bản đồ chiến dịch | Đi lấy ba clue; chọn ba ô và xếp bốn ngày qua control HTML; đúng cả vị trí lẫn thời gian mới hoàn tất. |
| Sở chỉ huy | Đi lấy ba clue; thử ghép/ngày sai có phản hồi, giữ draft; sửa ba mẩu và ngày đúng, cửa mở. |
| Hòa bình | Không thu hai clue tùy chọn, không chọn checkbox, không nhập suy nghĩ; nút tiếp tục vẫn hoàn tất, rồi đi tới cửa đông. |
| Trở về | Đọc đủ ending-intro; summary bảo tàng hiển thị, có sổ tay/chơi lại. Final state có 4 completedRoomIds, 10 graded collectedClueIds, peace clues = 0. |

Lượt production cuối đã lặp toàn tuyến và tới summary trên `index-DE-mEXGN.js`, không có page error. Lượt độc lập còn tới cùng kết khi **localStorage getter ném SecurityError ngay trước boot, Web Audio API không có, mạng ngoài bị chặn**; thông báo khả năng thiếu không ngăn phiên chơi. Xem phương pháp và giới hạn phiên bản trong QA độc lập; sửa cuối chỉ đổi thứ tự phát cue sau đóng bảng, đã review và thử PCM trên build cuối.

## Camera, va chạm, hoạt ảnh và focus

- Đã đi qua các khu đầu, điện đài, hành lang đông và gian bản đồ dưới trong các chương; quay lại qua cửa phòng, không teleport. Map challenge 2400×1440; museum/ending 1280×800.
- Camera quan sát thực tế x từ **0 đến 1440**, y từ **0 đến 900**, viewport engine 960×540. Tới phía bắc tại player≈(342,82), camera(0,0); phía nam player≈(723,1346), camera y=900. Không thấy vùng trống ngoài world.
- Bật reduced motion, tiếp tục đi các cửa/hành lang và tới biên trên/dưới; tùy chọn giữ sau reload. Các vật/tường chặn body thật; ví dụ đi lên bàn bị dừng ở y316, đi xuống dải tường dừng ở y492 rồi tìm cửa đúng để đi tiếp.
- Độ sáng: chọn bright qua control thật cập nhật state và lớp bright-scene, nhân vật vẫn bị khóa input khi đang mở tùy chọn; đã trả normal và đóng bảng, không có page error.
- Bốn hướng riêng đều quan sát `walking:true` và frame **0,1,2,3** trong các mẫu 90 ms; thả phím về idle. Khi bị vật chặn, walking=false và stepCount không tăng. Tốc độ chéo chuẩn hóa được kiểm thử ở hàm dùng bởi scene; không tuyên bố đã đo FPS hoặc tốc độ bằng đồng hồ ngoài.
- Giữ D rồi mở N: player x≈1172; trong bảng và sau đóng + key-repeat=true vẫn x≈1172; nhấn mới mới tới x≈1237. Form, native dialog và Tab không điều khiển nhân vật.
- **Đổi tab trình duyệt thật khi đang giữ D**: 54 mẫu hidden/focus=false đều dừng tại x≈1510,y680, inputBlocked=true, walking=false; nguồn âm=0, RMS=0. Trở lại tab không tự đi tiếp theo phím cũ.
- Enter xếp thẻ Him Lam giữ đúng focus; ArrowDown/Enter chọn ô campaign; Enter kích hoạt bước tiếp hòa bình. Các câu đố khác đã dùng control HTML thực và được reviewer xác nhận hợp đồng button/select/form chuẩn. Không tuyên bố một lượt toàn tuyến chỉ dùng bàn phím.

## Âm thanh thực

Đo PCM từ Analyser trong đường master → analyser → AudioContext destination, không suy từ tên nút hoặc số node. Đây là tín hiệu trình duyệt thật; chưa phải kiểm định loa vật lý của người chơi hoặc đánh giá âm sắc bằng người nghe.

| Tình huống | Bằng chứng |
| --- | --- |
| Nền + bước chân | RMS≈0.0042, peak≈0.0074; bước phát theo quãng đường, tăng stepCount. |
| Mở giấy trong VN | lastCue=paper, ambientSources=0, activeSources=1; RMS≈0.00493, peak≈0.02134. |
| Ghi clue rồi đóng bảng từ HUD, build cuối | Sau 50 ms: lastCue=paper, activeSources=3 (2 nền + 1 cue), RMS≈0.00642, peak≈0.02440. |
| Giải từng puzzle trong ba chương, build cuối | Trong dialogue: lastCue=success, ambientSources=0, activeSources=3; RMS≈0.00453, peak≈0.00985. |
| Hoàn tất hòa bình qua bảng mở từ HUD, build cuối | Sau đóng/focus 50 ms: lastCue=success, activeSources=5 (2 nền + 3 cue); RMS≈0.01694, peak≈0.03823. |
| Mute, volume 0, dialog yên sau cue, Tab/hidden | PCM=0, node nền/bước dừng; có thể bật lại. QA độc lập xác nhận volume0/mute thực. |
| Reload sound-on | Preference=true giữ lại, context=uninitialized, unlocked=false, nguồn=0, PCM=0; chỉ tạo/resume sau nút bật lại. |

Suspend/resume và một context được kiểm thử lifecycle riêng; khi suspend UI phản ánh trạng thái và mời bấm bật lại, không tự resume mỗi frame. Trường hợp API không có được QA độc lập đặt trước boot và vẫn chơi tới cuối.

## Lưu, tiếp tục và lỗi

- Đã reload thực tế ở museum, Him Lam, campaign-map, command-post, peace và ending. Him Lam/campaign/command sau giải nhưng chưa qua cửa khôi phục **hall (1120,680)**, đủ clue và trạng thái cửa đã mở. Campaign/command/peace khi mới vào khôi phục entry(580,350).
- Reload ending trên build cuối giữ 4 phòng/10 clue/ending-intro; mở đúng summary, sound-on vẫn chưa có AudioContext và không autoplay.
- QA độc lập: discover+Esc → reload → sổ tay còn “đã thấy/chưa ghi” → mở từ câu đầu → ghi đúng một clue/beat. Reset hủy giữ tiến độ, xác nhận về defaults; JSON hỏng và version99 có notice/không Continue, vẫn chơi mới được.
- Adapter tests/harness: ID/prefix/beat/settings sai bị từ chối; get/set/remove và getter ném lỗi được bắt; checkpoint ID lạ fallback entry an toàn, checkpoint xuyên tường không được dùng; event checkpoint sai chương/ID không thay save. Đây là kiểm tra contract, không chèn tiến độ vào lượt chơi browser.
- Không persist HTML, cursor VN, tọa độ tự do, suy nghĩ hòa bình, AudioContext/node hoặc unlock runtime. Autosave theo thay đổi state/checkpoint, không mỗi frame.

## Responsive và tài nguyên cục bộ

- 1280×800, 375×812, 640×400: VN/control đọc được, không tràn ngang; màn thấp dùng scroll native dialog. CLI click không tự scroll tin cậy nên QA dùng scrollIntoView trước nút khuất, tương đương cuộn của người chơi.
- Zoom Chrome thực **200%** qua trang cài đặt riêng của browser QA: DPR2, visualViewport.scale1, CSS≈632×284; sổ tay/VN không tràn ngang. Đã trả zoom riêng về 100%.
- Production dùng engine, CSS, portrait, emblem cục bộ. Phiên proxy lỗi `127.0.0.1:9` + bypass loopback chặn fetch example.com, vẫn tải mới app qua HTTP.
- Probe sau build cuối: `index-DE-mEXGN.js` cache:no-store HTTP200; favicon local HTTP200; request ứng dụng chỉ loopback/data, page errors rỗng. Lỗi favicon404 ở bản trước đã sửa bằng link tới emblem cục bộ.

## Cách tái hiện lời giải

1. Him Lam: hồ sơ bàn tây → điện đài phòng trên → sơ đồ hành lang đông → bản tin gian bản đồ dưới. Ghi ở câu cuối. Xếp **position → artillery → infantry → victory**.
2. Campaign: lấy clue bàn tây, điện đài trên, gian bản đồ dưới. Him Lam=Đông Bắc, Độc Lập=Bắc, Mường Thanh=Trung tâm. Ngày: **13/3 → 30/3 → 1/5 → 7/5/1954**.
3. Command: lấy ba mẩu tại bàn tây, điện đài trên, hành lang đông. Ghép **Quân ta tiến công → tiến vào sở chỉ huy đối phương → bắt Đờ Cát cùng bộ chỉ huy**, ngày **7/5/1954**. Game ghi rõ câu ghép là biên soạn hư cấu.
4. Peace: mở Điều mang về, có thể bỏ trống tất cả; bấm tiếp, đi tới cửa đông, E và đọc lời kết.

Hành lang chung y≈680. Cửa lên điện đài x≈1270; cửa gian bản đồ dưới x≈350. Cửa đông tương tác từ x≈2160,y680 sau khi giải. Những tọa độ này chỉ là chỉ dẫn QA của bản đồ hư cấu.

## Sửa lỗi và giới hạn

Ảnh game thật: [trang đầu production](game-production-menu.png), [lời kể Minh](game-him-lam-dialogue.png), [Him Lam giải đúng](game-him-lam-solved.png), [camera sát biên nam](game-camera-south.png), [kết production cuối](game-production-ending.png).

Đã sửa/review: intro đang đọc dở biến mất khỏi backlog; UI audio suspend còn coi đã unlock; cue bị ngắt bởi focus khi đóng bảng; favicon404. Mỗi sửa có kiểm tra hẹp, cuối cùng 23 tests/build và full production journey đạt.

Không còn câu hỏi hoặc blocker cho bản cục bộ. Chỉ kiểm thử browser Chromium nêu trên; không hứa hỗ trợ touch movement, lồng tiếng, screen reader chơi toàn canvas, hiệu năng chưa đo hoặc hosting. Không Git init/commit/deploy.
