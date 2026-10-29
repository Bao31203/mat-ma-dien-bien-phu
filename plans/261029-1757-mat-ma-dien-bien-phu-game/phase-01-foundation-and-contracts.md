---
phase: 1
title: Foundation and contracts
status: completed
effort: ''
priority: P2
dependencies: []
---

# Phase 1: Foundation and contracts

## Overview

Đã tạo nền chạy cục bộ, dữ liệu visual novel lịch sử và luật thuần cho bốn chương khám phá sau phê duyệt ngày 2026-10-29.

## Context Links

- [Đề xuất](../../docs/game-proposal.md), [công nghệ](../../docs/tech-stack.md), [nghiên cứu](../reports/261029-bootstrap-research.md).
- [Phaser 3.90.0 release](https://github.com/phaserjs/phaser/releases/tag/v3.90.0), [Vite guide](https://vite.dev/guide/).
- [Kiểm chứng runtime và package registry](./reports/camera-and-runtime-research.md).
- [Bảo tàng Lịch sử quốc gia — trận Him Lam](https://baotanglichsu.vn/vi/Articles/2002/68138/ky-niem-60-nam-chien-thang-lich-su-djien-bien-phu-1954-2014tran-mo-man-tieu-diet-trung-tam-dje-khang-him-lam-13-3-1954.html): controller đã kiểm tra chuẩn bị đêm 12–13/3, pháo chiều 13/3, bộ binh tiến công và làm chủ Him Lam đêm 13/3; không cần phút chính xác.

## Requirements và quyết định

- ES modules, JavaScript; dependency chính xác `phaser: 3.90.0`, dev dependency `vite: 8.3.5`; sinh `package-lock.json`, không CDN. Node hiện tại 24.15.0 đáp ứng Vite (20.19+/22.12+).
- Phaser 4.2.1 là bản stable tại ngày nghiên cứu; dùng 3.90.0 để giữ một bộ API camera/input/physics đã xác minh, không vì giả định v4 chưa ổn định.
- Vite `base: './'`; `dev`, `build`, `preview`, `test: node --test`. Không PWA hoặc yêu cầu mở game bằng `file://`.
- Luật tiến trình và câu đố thuần, không import Phaser/DOM/storage; văn bản lịch sử tách khỏi câu chữ hư cấu do tác giả game viết.
- Lời kể viết của Minh là bắt buộc, chân dung/tên/câu thoại hiển thị trong lớp VN trên bản đồ. Không yêu cầu giọng đọc thu âm hoặc TTS; âm thanh trong phạm vi là SFX/nền thực, không chỉ nút UI.

## Architecture và hợp đồng bàn giao

- `story-data.js`: `chapterOrder = ['museum','him-lam','campaign-map','command-post','peace','ending']`; clue `{id,chapterId,title,body,beatId,sourceIds,fictional}`; beat `{id,chapterId,requiredDiscoveredClueIds,lines:[{speakerId,portraitId,text,sourceIds,fictional}]}`; puzzle `{id,requiredClueIds,hints,answerSpec}`; source registry `{id,title,url}`. ID ổn định, không phụ thuộc nhãn tiếng Việt.
- Him Lam có đúng bốn clue riêng `him-lam-position`, `him-lam-artillery`, `him-lam-infantry`, `him-lam-victory`, mỗi clue gắn một beat Minh kể và stage ID không tiền tố tương ứng; chỉ Ghi manh mối mới cấp thẻ. Answer phải đúng `{orderedStageIds:['position','artillery','infantry','victory']}`; nhãn pháo binh ghi “chiều 13/3/1954”. Thiếu clue, thẻ trùng/thiếu/lạ hoặc sai thứ tự đều không mở cửa; thay hoàn toàn puzzle ba select địa điểm/ngày/sự kiện cũ.
- `game-rules.js`: `createInitialState()`, `applyAction(state, action) -> nextState`, `evaluatePuzzle(puzzleId, answer, collectedClueIds) -> {ok,messageKey}`, `validateSave(raw) -> state|null`. Chỉ mở cửa khi đã có manh mối bắt buộc và đáp án đúng. Peace dùng hành động tiếp tục, không đánh giá đáp án.
- Action union: `{type:'discover-clue',clueId}`, `{type:'collect-clue',clueId}`, `{type:'complete-beat',beatId}`, `{type:'use-hint',puzzleId}`, `{type:'submit-puzzle',puzzleId,answer}`, `{type:'enter-chapter',chapterId,checkpointId}`, `{type:'reach-checkpoint',chapterId,checkpointId}`, `{type:'finish-peace'}`, `{type:'set-settings',settings}`. Từ chối action không phù hợp chương/beat chưa mở; action sai giữ state cũ. Composition xử lý new/reset ngoài reducer bằng `createInitialState()`.
- `reach-checkpoint` chỉ đổi `checkpointId` khi payload có ID string không rỗng/đúng giới hạn và `chapterId === state.chapterId`; ID không đổi thì trả state cũ. Composition phải xác minh checkpoint thuộc map hiện tại và geometry an toàn trước dispatch; reducer không import world-data hoặc Phaser. `enter-chapter` khởi tạo checkpoint của chương mới.
- State/save v1: `{version:1,chapterId,checkpointId,completedRoomIds:[],discoveredClueIds:[],collectedClueIds:[],completedBeatIds:[],hintLevels:{},settings:{brightness:'normal'|'bright',reducedMotion:boolean,audioEnabled:false,audioVolume:0.5}}`. `audioEnabled` là boolean đã chọn, `audioVolume` hữu hạn trong [0,1]; mặc định tắt. Runtime `audioUnlocked`/AudioContext/nodes và con trỏ `activeBeatId/lineIndex` không thuộc save. Chưa có save production nên không cần migration bản đã phát hành.
- `discover-clue` khi tương tác gần vật mở beat, chưa cấp thẻ puzzle. Tới lời cuối, người chơi bấm **Ghi manh mối**: composition kiểm tra active beat/cursor rồi dispatch `collect-clue`, reducer yêu cầu clue đã discover và thêm đồng thời collected ID + completed beat ID. `complete-beat` chỉ dành cho beat không gắn clue, từ nút kết thúc lời kể; không cho dùng nó bỏ qua ghi clue. Esc giữa chừng chỉ giữ discovery; notebook mở lại beat từ đầu. Đọc lại không xóa hoặc nhân đôi completion.
- `completedRoomIds` là prefix ba puzzle + peace; ending cần đủ bốn. Checkpoint vẫn là vùng an toàn vừa đi tới gần đây nhất trong chương. Validate collected là tập con discovered, clue beat completed khi và chỉ khi clue đã collect, completed non-clue beat có prerequisite/chapter hợp lệ; hint 0–2 và audio bool/volume hữu hạn đúng miền. Loại ID lạ/tiến trình mâu thuẫn; `checkpointId` kiểm tra kiểu/độ dài, pha 4 kiểm tra map/fallback. Không lưu HTML, lời suy nghĩ hòa bình hoặc runtime audio.

## Related Code Files và quyền sửa

Gốc mọi đường dẫn: `./`.

- Create: `package.json`, `package-lock.json`, `vite.config.js`, `.gitignore` — công cụ, khóa dependency, bỏ qua `node_modules/`/`dist/`; không Git init.
- Create: `index.html`, `src/main.js`, `src/styles.css` — shell Việt và smoke scene Phaser thực; chưa gọi đây là game hoàn chỉnh. Bàn giao các tệp này lần lượt cho pha 2, 3, 4.
- Create: `src/content/story-data.js`, `src/core/game-rules.js`, `tests/game-rules.test.js` — nội dung có nguồn, luật và test.
- Không sửa `docs/wireframe/`, không xóa tệp hiện có.

## Implementation Steps

1. Kiểm tra Node/package metadata rồi cài đúng phiên bản, lưu lockfile; không nâng Phaser theo nhãn latest.
2. Tạo shell/smoke renderer tối thiểu và cấu hình build, font hệ thống hỗ trợ dấu Việt; giữ full-width game host và vùng DOM HUD.
3. Biên soạn beat Minh kể cho intro, bốn clue Him Lam, ba chương còn lại và ending. Him Lam xếp bốn giai đoạn đã chốt; room 2 giữ thẻ sơ đồ + mốc đã xác minh, room 3 ghép điện báo hư cấu về bắt Đờ Cát cùng bộ chỉ huy 7/5/1954, room 4 suy nghĩ tùy chọn/bước tiếp.
4. Mỗi dữ kiện lịch sử có sourceIds trỏ nguồn đã đọc trong đề xuất/nghiên cứu. Không bổ sung mốc/phút hoặc giả lập tuyến tiến công không có căn cứ. UI sẽ ghi sơ đồ không theo tỷ lệ và lời điện báo được biên soạn cho game.
5. Test Him Lam đủ bốn clue đã ghi + đúng thứ tự mới mới mở cửa; thiếu clue, chỉ discover, thứ tự đảo, thẻ trùng/thiếu/lạ đều thất bại. Test collect trước discover bị từ chối, collect/completion nguyên tử và idempotent, complete-beat không bỏ qua clue. Test hint/progress/peace, malformed save/discovered-collected-beat/audioVolume NaN/Infinity/ngoài miền/sai kiểu và checkpoint.

## Success Criteria

- [x] `npm test` và `npm run build` đạt; shell tải engine cục bộ, không CDN.
- [x] Test chứng minh sai đáp án hoặc thiếu manh mối không mở cửa; submit lại không nhân đôi tiến trình.
- [x] Test action checkpoint đúng chương/shape/trùng ID đạt, không kéo world-data hoặc Phaser vào reducer.
- [x] Test bốn clue/thứ tự Him Lam, unlock/complete/reopen beat và audio settings đạt; không còn luật ba select Him Lam.
- [x] Source registry, nội dung hư cấu và save v1 đủ để pha sau dùng mà không đoán hợp đồng.

Bằng chứng: [foundation tests](./reports/foundation-tests.md), [review game](./reports/game-code-review.md); bộ cuối 23/23 test đạt và production build đạt. `story-data.js`, `game-rules.js`, `save-validation.js` đã được các pha sau tích hợp thực tế.

## Risk Assessment và quay lui

Mốc lịch sử thiếu nguồn: chỉ dùng dữ kiện đã kiểm chứng, không thêm trivia hoặc đánh đồng thắng Him Lam với kết thúc chiến dịch. Lệch engine/tooling: dừng tích hợp, sửa pin/config theo metadata đã xác minh; không đổi sang v4 để né lỗi. Nếu phải quay lui, bỏ riêng scaffold mới và lockfile của pha, giữ nguyên prototype/docs và bản ghi nội dung.

## Next Steps

Bàn giao schema, ID và luật cho pha 2; các tệp shell có đúng một chủ sửa tại từng thời điểm. Câu hỏi chưa chốt: không.
