---
phase: 4
title: Progress and narrative
status: completed
effort: ''
priority: P1
dependencies:
  - 3
---

# Phase 4: Progress and narrative

## Overview

Nối bảo tàng/VN mở đầu-kết thúc, chuyển phòng, backlog manh mối và lưu tiếp tục thành hành trình hoàn chỉnh. Giữ preferences âm thanh tách khỏi quyền phát âm của trình duyệt.

## Context Links

- [Save v1 và luật](./phase-01-foundation-and-contracts.md), [safe checkpoint](./phase-02-exploration-and-camera.md), [dialog API](./phase-03-puzzles-and-interface.md).
- [Phạm vi và lịch sử](../../docs/game-proposal.md).

## Requirements

- Chơi mới, Tiếp tục chỉ khi save hợp lệ; reset bắt xác nhận, hủy không mất tiến độ. Museum intro giải thích điều khiển và hành trình ngày 7/5; tháng 3 là ký ức, không du hành qua các ngày tác chiến.
- Lưu sau discover/collect clue, complete beat, hint/settings/puzzle hoàn thành/chuyển phòng và reach-checkpoint hợp lệ làm state đổi; không ghi mỗi frame/đổi câu thoại. Resume từ checkpoint vừa đi tới gần đây nhất, không chọn gần theo Euclidean qua tường; không khôi phục tọa độ, đáp án dở hoặc active VN cursor.
- JSON hỏng, shape sai, ID lạ, version tương lai, chapter chưa mở, storage bị chặn hoặc hết dung lượng đều không làm game chết. Không âm thầm coi save lỗi là hoàn thành.
- Kết thúc trở về bảo tàng với thông điệp hòa bình; không diễn đạt Việt Nam thống nhất/hòa bình toàn quốc ngay 7/5/1954. Suy nghĩ tự do chỉ ở bộ nhớ phiên, không bắt buộc, không lưu.
- Lưu `audioEnabled` và `audioVolume`; mỗi lần tải trang runtime unlocked bắt đầu false. Preference đã bật không tự tạo/resume context/phát nền; UI mời **Bật lại âm thanh** qua click tin cậy. Mute/volume có hiệu lực ngay sau unlock; API lỗi vẫn đọc/chơi được đầy đủ.

## Architecture và hợp đồng bàn giao

- `save-store.js`: `loadSave(storage) -> {state|null,notice|null}`, `writeSave(storage,state) -> {ok,notice|null}`, `clearSave(storage) -> {ok,notice|null}`. Key cố định `mat-ma-dien-bien-phu:save:v1`; JSON parse/stringify/get/set/remove đều có xử lý lỗi. Nhận storage adapter để test được bằng Node, không import window ở module top level.
- `validateSave` pha 1 kiểm tra semantics trước khi dùng. Kiểm tra checkpoint của current chapter trong world-data và body geometry; fallback sang entry checkpoint hợp lệ nếu chỉ checkpoint sai, hoặc từ chối nếu chapter/progress mâu thuẫn. Không lưu body/camera/dialog/puzzle draft.
- `main.js` sở hữu state duy nhất và lưu sau intent hợp lệ. Nhận `onCheckpoint({chapterId,checkpointId})`, kiểm tra đúng chương hiện tại/ID có trong map/tâm spawn an toàn theo geometry, rồi dispatch `reach-checkpoint` và autosave nếu state đổi; reducer chỉ kiểm tra shape/current chapter, không đọc world-data. Khi load vẫn kiểm tra lại geometry trước resume. Không polling hoặc ghi storage mỗi frame.
- Scene chỉ xin chuyển exit, rules kiểm tra cửa còn khóa. Khi chuyển map: chặn input → đóng bảng/reset → áp trạng thái/entry checkpoint của chương mới → spawn hợp lệ/camera snap → lưu → trả focus/nhả input. Không có cửa tự bỏ khóa để phục vụ chuyển cảnh.
- Invalid save: thông báo rõ, cho Chơi mới; không xóa bản cũ trước khi người chơi chọn. Storage unavailable: game tiếp tục bằng memory và một notice DOM ngắn. Reset thành công ở memory dù storage lỗi, báo rõ tiến độ cũ có thể còn khi tải lại.
- Cài đặt khởi tạo reducedMotion từ hệ thống khi chưa có save; dùng cài đặt đã lưu sau đó. Nội dung notebook/mục tiêu được dựng lại từ ID state, không lưu HTML.
- Resume dựng backlog từ discovered/collected/completedBeat IDs; đã discover nhưng Esc sớm vẫn có beat chưa ghi để mở lại từ đầu, không cấp card. Collect tại lời cuối lưu một state nguyên tử có cả clue + completion, không ghi trạng thái nửa chừng. Reopen không reset completion. Không lưu AudioContext/node/timer/audioUnlocked hoặc lời suy nghĩ cá nhân.
- Khi VN/dialog mở đặt mode dialogue, khi blur/hidden/game reset đặt inactive và hủy âm/nodes; chỉ cho exploration audio khi focus/không modal + preference enabled + unlocked. Nếu context bị browser suspend và không resume được, mời click bật lại, không lặp resume mỗi frame. Reset đặt audio về mặc định tắt, giải phóng node; một context/controller duy nhất suốt phiên.

## Related Code Files và quyền sửa

Gốc: `./`.

- Create: `src/core/save-store.js`, `tests/save-store.test.js` — persistence adapter và các lỗi thực tế.
- Modify: `src/main.js`, `src/ui/game-interface.js`, `src/ui/narrative-view.js`, `src/game/adventure-scene.js`, `src/audio/audio-controller.js` — compose VN/backlog, audio lifecycle, resume/safe transitions; quyền sửa chuyển từ pha 3.
- Modify: `src/core/game-rules.js`, `tests/game-rules.test.js` — hoàn chỉnh validate/invariant cần thêm khi kiểm tra save; không thay schema tùy tiện.
- Read only: story/world content, geometry; chỉ sửa checkpoint dữ liệu nếu kiểm tra thực tế phát hiện spawn không an toàn và ghi rõ thay đổi.

## Implementation Steps

1. Viết storage adapter và test malformed JSON/null/unknown version/invalid prefix/duplicates/hint ngoài giới hạn, audio bool/volume sai miền/NaN/Infinity và get/set/remove ném lỗi. Round-trip discovered/collected/completed beat + preferences; từ chối completion không khớp clue/chapter/prerequisite. Không serialize runtime audio/cursor.
2. Tạo “Chơi mới / Tiếp tục”, VN intro/ending; đồng bộ title/mục tiêu/tiến độ/backlog. Restore preference âm thanh nhưng chờ nút bật lại, xác nhận không autoplay ngay cả saved audioEnabled true.
3. Nối checkpoint callback/action/autosave và exit; kiểm tra khóa tại rules lẫn collision. Test resume mỗi chương, đi qua checkpoint xa rồi reload trở lại checkpoint đó, không quay về entry hoặc chọn điểm gần xuyên tường; quay lại chương được phép và resume sau puzzle đúng nhưng chưa qua cửa.
4. Nối autosave gồm discovery/collect/complete beat/preferences/checkpoint; đứng yên hoặc advance câu không ghi lặp. Đóng VN trước ghi → reload → backlog còn beat chưa ghi; mở lại sau ghi không nhân đôi. Reset xác nhận xóa tiến độ/options, âm tắt ngay; hủy giữ nguyên.
5. Chơi toàn tuyến từ save trắng tới ending; không softlock khi giữ phím qua VN/chuyển phòng/reload/mất focus/notebook; không có bước chân/ambient trong VN, blur dừng mọi âm, mở lại không nhân context/nodes.

## Success Criteria

- [x] Bảo tàng → đủ bốn thử thách → bảo tàng kết thúc bằng UI thật; room 4 tiếp tục được với input trống.
- [x] Reload tại từng phòng/ở checkpoint xa phục hồi tiến độ và vùng an toàn vừa đi tới gần đây nhất; checkpoint ID hỏng fallback entry an toàn; event khác chương/ID lạ không đổi state/save. Không mở khóa bằng save sai hoặc skip exit.
- [x] Storage bị chặn/hỏng vẫn chơi tới cuối với notice; reset có thể hủy, reset xác nhận trở về trạng thái mới.
- [x] Discovery/collection/beat completion và backlog resume đúng; Esc sớm không đủ điều kiện puzzle, ghi clue nguyên tử/idempotent. Settings bật/mute/volume được giữ nhưng reload không autoplay.
- [x] `npm test`, `npm run build` đạt; không persist suy nghĩ/HTML/cursor/AudioContext/nodes/unlock runtime.


Bằng chứng: [QA game chính](./reports/game-qa.md), [QA độc lập](./reports/game-edge-qa.md), [tests nền tảng](./reports/foundation-tests.md), [review mã](./reports/game-code-review.md). Reload thực tế đủ museum/Him Lam/campaign/command/peace/ending; checkpoint hall (1120,680) giữ clue/cửa sau giải. Build cuối reload ending giữ bốn phòng, mười clue và ending-intro; audio preference=true nhưng context uninitialized, unlocked=false, nguồn/PCM=0. Lượt độc lập hoàn thành mới tới ending khi localStorage getter ném SecurityError, Web Audio không có và mạng ngoài bị chặn; hòa bình không clue tùy chọn/checkbox/text. Kiểm tra save/checkpoint ID sai và event khác chương là tests/harness, không chèn tiến độ vào browser. Reset/cancel và discovery→reload→reopen→collect được tester thao tác thật.

## Risk Assessment và quay lui

Save hỏng gây unlock/softlock: validate enum, prerequisite và discovered/collected/beat trước render, checkpoint thuộc geometry thật. Reload phát âm ngoài ý muốn: effective audio luôn cần runtime unlock mới. Context/listener trùng: một composition owner, hủy nodes/listeners khi reset/destroy. Quay lui persistence về memory chỉ để cô lập, không đạt nghiệm thu resume; không migration version chưa phát hành.

## Next Steps

Bàn giao game tích hợp cho pha 5; contract save v1 là cố định từ đây trừ lỗi có bằng chứng và test. Câu hỏi chưa chốt: không.
