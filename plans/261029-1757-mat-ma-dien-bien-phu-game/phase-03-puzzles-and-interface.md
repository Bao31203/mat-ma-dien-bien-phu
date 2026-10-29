---
phase: 3
title: Puzzles and interface
status: completed
effort: ''
priority: P1
dependencies:
  - 2
---

# Phase 3: Puzzles and interface

## Overview

Hoàn chỉnh vòng khám phá → VN Minh kể → ghi manh mối → sổ tay → giải đố → cửa mở. VN là lớp kể chuyện trên thế giới khám phá, không thay bốn chương/bản đồ bằng chuỗi câu hỏi.

## Context Links

- [Thiết kế](../../docs/design-guidelines.md), [luật và dữ liệu](./phase-01-foundation-and-contracts.md), [scene API](./phase-02-exploration-and-camera.md).
- [Phaser 3.90.0 KeyboardPlugin](https://docs.phaser.io/api-documentation/3.90.0/class/input-keyboard-keyboardplugin).

## Requirements

- Native `<dialog>` cho tư liệu, puzzle, notebook và tùy chọn; title/label/nút đóng rõ, focus trap native, Esc đóng, focus về opener còn tồn tại hoặc game host.
- Hội thoại VN có chân dung Minh cục bộ, tên người nói, câu kể tiếng Việt và nút Trước/Tiếp; mỗi lời hiện đầy đủ để đọc, không bắt chờ typewriter hoặc nghe giọng. Bản đồ vẫn làm nền, movement bị khóa; đóng sớm và đọc lại được từ sổ tay/backlog không mất tiến độ.
- HUD cố định gồm nhiệm vụ, tên chương, tiến độ, nút tương tác gần nhất và N/sổ tay. E/N/Esc có nút HTML tương đương. Không cột notebook thường trực.
- Form có label; không yêu cầu kéo thả hoặc đọc chữ nhỏ trong canvas. Phản hồi sai giữ câu trả lời và cho sửa; hai mức gợi ý; phản hồi thành công bằng chữ, không chỉ màu.
- Ảnh pixel hỗ trợ bối cảnh; dữ kiện và nguồn đọc trong DOM. Các phòng đều dùng cùng đường bàn phím, không chỉ phòng mẫu Him Lam.

## Architecture và hợp đồng bàn giao

- `dialog-controller.js`: `open(view,opener)`, `close()`, `isOpen()`, `destroy()`; một dialog tại một thời điểm, thay nội dung không nhả khóa input giữa hai bảng. Callback `onModalChange(blocked)` cho composition.
- `game-interface.js`: `render(state,nearby)`, `showClue(id)`, `showBeat(beatId)`, `getActiveNarrative() -> {beatId,lineIndex,lineCount}|null`, `showPuzzle(id)`, `showNotebook()`, `showOptions()`, `showStory(chapterId)`; gửi intent về main, không đổi state/storage. `narrative-view.js` quản cursor runtime và dựng portrait/name/line/buttons trong cùng dialog controller; showStory tra beat của chương. Render text bằng textContent.
- Tương tác gần clue → `discover-clue` → mở beat tương ứng. Mỗi lời dùng nút Tiếp/Trước native; chỉ lời cuối có **Ghi manh mối**. Composition đối chiếu active beat/cursor cuối với clue đã discover rồi dispatch `collect-clue`, thêm nguyên tử clue + completed beat; chỉ lúc đó cấp thẻ vào puzzle. Intro/ending không có clue dùng nút Hoàn tất lời kể → complete-beat. Esc trước đó chỉ đóng, không collect/complete. Mở lại beat đã ghi không reset/nhân đôi completion.
- Notebook/backlog chỉ hiển thị beat đã mở bằng discovery hoặc chapter hợp lệ; beat chưa đọc xong có nhãn rõ, mở lại từ đầu sau đóng/reload. Beat đã ghi xem lại đầy đủ; không lộ clue chưa khám phá, không đòi giữ cursor qua load.
- Pha này nối `applyAction` với scene/UI trong main; vòng duy nhất: intent → luật → state → scene/UI render. Giữ đường `onCheckpoint` → composition kiểm tra map → `reach-checkpoint` của pha 2; mở modal không tạo sự kiện đi tới checkpoint. Submit trùng không mở thêm cửa; đủ clue mới xác nhận đáp án.
- **Trước mở bảng/VN**: bật input-block flag, zero velocity, idle animation/reset step accumulator, reset held keys, tắt keyboard plugin và `disableGlobalCapture()`, audio mode dialogue rồi mới showModal. **Sau đóng**: reset lại; chỉ restore keyboard/capture/exploration audio khi không còn bảng, host có focus và game active. Chờ keydown mới, không khôi phục vận tốc cũ; ambient chỉ khi đã bật/unlock.
- `blur`/visibility hidden: zero/reset và giữ khóa tới khi người dùng quay lại focus game. Phím WASD/E/N trong input/textarea/select/button hoặc khi Tab rời host không chạy game. Bắt Esc bằng `cancel` của dialog trước pause shortcut; không tự mở pause sau khi đóng.
- Game events/listeners phải gỡ khi shutdown/restart; không đăng ký lặp mỗi lần vào phòng. Các shortcut DOM luôn xét modal/focus trước khi gọi scene.
- Âm thanh: nút **Bật âm thanh/Tắt âm thanh** và range volume [0,1] có label; bật gọi unlockFromGesture trong click tin cậy trước khi áp preference. VN đổi lời/ghi giấy dùng paper cue có chủ ý, puzzle đúng dùng success; ambient/steps ngừng trong VN. Text luôn đầy đủ cả khi mute hoặc API lỗi; không có voice acting/TTS trong yêu cầu.

## Related Code Files và quyền sửa

Gốc: `./`.

- Create: `src/ui/dialog-controller.js`, `src/ui/game-interface.js`, `src/ui/narrative-view.js` — modal, game UI và cursor/view VN; tách helper tiếp chỉ khi giảm phức tạp thực.
- Create: `assets/images/minh-portrait.png` từ asset prototype đã duyệt, kiểm tra provenance và bundle local; Modify `docs/image-prompts.md` để ghi nguồn/prompt nếu cần. Không gọi dịch vụ AI ngoài lúc game chạy.
- Modify: `index.html`, `src/styles.css` — DOM semantic, responsive, focus, olive/serif, settings và modal.
- Modify: `src/main.js`, `src/game/adventure-scene.js`, `src/audio/audio-controller.js` — tích hợp VN/input/motion/audio theo API, quyền sửa tuần tự sau pha 2.
- Read only: story/world/rules/geometry. Nếu phát hiện lỗi contract, sửa đúng tệp trước rồi chạy lại test liên quan và ghi lý do; không nhân đôi luật trong UI.

## Implementation Steps

1. Tạo modal/input/VN controller trước puzzle; giữ W rồi mở/đóng lời kể, blur/Tab không đi tiếp hoặc phát bước chân. Đảm bảo Enter/Space ở nút Tiếp chỉ chuyển một lời, không kích E/gameplay.
2. Nối bốn clue Him Lam ở bốn vị trí world khác nhau với bốn beat Minh; ở lời cuối có nút Ghi manh mối. Sổ tay phân biệt đã khám phá/chưa ghi/đã ghi, backlog mở lại được. Hiện nguồn và nhãn lời Minh là biên soạn hư cấu; sơ đồ lịch sử không theo tỷ lệ.
3. Him Lam: thu đủ bốn thẻ rồi xếp **chuẩn bị trận địa → pháo binh khai hỏa chiều 13/3/1954 → bộ binh tiến công → chiếm Him Lam/chiến thắng**. Dùng danh sách bốn card với nút Lên/Xuống có nhãn và nút đối chiếu; chuột và Tab/Enter/Space cùng dùng controls đó, không bắt drag. Sai giữ thứ tự để sửa, hai gợi ý dẫn về clue; không còn ba select trivia. Chiến thắng ở đây là Him Lam đêm 13/3, không phải kết thúc chiến dịch 7/5.
4. Bản đồ chiến dịch: đặt thẻ cứ điểm vào các slot trên sơ đồ theo legend/tư liệu; DOM select là đường thao tác chính, không kiểm tra độ chính xác tọa độ. Sắp thứ tự mốc có ngày bằng control bàn phím; không nối thành tuyến tấn công giả định.
5. Sở chỉ huy: ghép thứ tự các mảnh điện báo biên soạn từ dữ kiện có nguồn rồi xác định sự kiện/ngày 7/5/1954. Không biến cả ba puzzle thành cùng một form trivia.
6. Hòa bình: trình bày ký ức và lời mời suy nghĩ; có chọn/viết tùy ý và nút tiếp tục ngay. Không chấm đúng sai hoặc bắt nhập để mở cửa cuối.
7. Áp dụng brightness/reducedMotion/audio preferences; CSS bỏ chuyển động trang trí, camera giảm smoothing nhưng vẫn đi/đổi hướng được. Kiểm tra SFX paper/success, mute/volume thật; không autoplay. Font hệ thống 17px đoạn/form; 375px đọc/đóng VN/puzzle và sắp card được, không hứa touch movement.

## Success Criteria

- [x] Ba puzzle có manh mối, gợi ý, thử sai và sửa; phòng hòa bình có tiếp tục không chấm điểm. Cả bốn hoàn thành được bằng bàn phím, không bắt drag hoặc chuột.
- [x] VN có portrait/tên/lời/advance; Esc không cấp clue, lời cuối + Ghi mới collect/complete. Backlog/reopen không mất hoặc nhân đôi tiến trình; Him Lam chỉ mở khi bốn clue đã ghi và đúng thứ tự card mới.
- [x] VN khóa movement/steps/ambient; cue giấy/thành công vẫn có khi đã bật, mute/volume nghe đúng; UI tiếng Việt đầy đủ khi không có âm thanh.
- [x] Giữ phím → mở/đóng modal, gõ E/N/W vào form, Esc và blur đều không gây movement/shortcut lạc; focus quay về chỗ hợp lý.
- [x] Từ 1280×800 nhìn rõ HUD/cảnh; ở 375×812 và 640×400 không tràn ngang, dialog cuộn nội bộ và nút đóng thấy được; dấu Việt không lỗi.
- [x] `npm test`, `npm run build` đạt; chạy kiểm tra browser tương tác trên cả bốn phòng, không dùng kết quả prototype làm bằng chứng.

Bằng chứng: [review mã](./reports/game-code-review.md), [edge QA](./reports/game-edge-qa.md). Controller hoàn thành bốn phòng bằng UI/world thật; đã reorder Him Lam bằng Enter ba lần và giữ focus, chọn vị trí campaign bằng ArrowDown/Enter. Các form dùng button/select/textarea native và không có thao tác bắt drag; đây là khả năng bàn phím đã review, không tuyên bố đã chạy lại toàn hành trình chỉ bằng bàn phím. Giữ D → N dừng ở X1172; đóng bảng rồi keydown repeat vẫn X1172; keydown mới mới đi tới X1237. Các guard form/modal/blur được đọc mã, native Tab được tester đo không movement/PCM. Bundle cuối: cue giấy sau collect/đóng bảng có RMS 0.00642, peak 0.0244; cue success sau giải Him Lam trước đóng có RMS 0.0045293, peak 0.0098457, `lastCue:success`, dialogue mode và không có ambient. Đây là đo PCM thực, không chỉ đếm node.

## Risk Assessment và quay lui

Keyboard capture/advance kép: native buttons + khóa/reset và test từng đường mở/đóng. VN bị đóng trước khi ghi: giữ discovery, chưa collect, backlog đọc lại từ đầu. Portrait/font dài: responsive và cuộn nội bộ. Quay lui riêng view bị lỗi để cô lập, không bỏ VN/card/âm thanh hoặc quay về puzzle ba select cũ.

## Next Steps

Pha 4 nhận main, VN/backlog methods, audio preferences/runtime split và input guard để thêm resume/kết thúc. Câu hỏi chưa chốt: không.
