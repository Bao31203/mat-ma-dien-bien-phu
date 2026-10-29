---
phase: 2
title: Exploration and camera
status: completed
effort: ''
priority: P1
dependencies:
  - 1
---

# Phase 2: Exploration and camera

## Overview

Xây thế giới hầm có nhiều khu, di chuyển/va chạm/camera, sprite Minh có hoạt ảnh và nền/SFX thực. Giữ khám phá top-down trong game visual novel hybrid.

## Context Links

- [Thiết kế](../../docs/design-guidelines.md), [pha nền tảng](./phase-01-foundation-and-contracts.md).
- [Nghiên cứu camera/runtime](./reports/camera-and-runtime-research.md).
- API **3.90.0**: [Camera](https://docs.phaser.io/api-documentation/3.90.0/class/cameras-scene2d-camera), [BaseCamera](https://docs.phaser.io/api-documentation/3.90.0/class/cameras-scene2d-basecamera), [Arcade World](https://docs.phaser.io/api-documentation/3.90.0/class/physics-arcade-world).

## Requirements

- Mỗi bản đồ thử thách khởi điểm 2400×1440 đơn vị, có khu đọc tư liệu, bàn giải đố, lối ra và hành lang nối; có landmark, ánh sáng, bảng chỉ dẫn, không lấp diện tích bằng sàn trống. Bảo tàng có thể nhỏ hơn.
- WASD/mũi tên; tốc độ chéo chuẩn hóa; collider tường/đồ vật/cửa khóa; E chỉ chọn tương tác trong tầm. Đủ lối đi cho body nhân vật, không đứng kẹt ở điểm spawn.
- Minh có idle và walk đủ bốn hướng; mỗi hướng ít nhất một idle frame và bốn frame gait thay đổi chân/tay khi đi. Hướng nhìn giữ khi đứng; không chỉ trượt một ảnh tĩnh. Giảm chuyển động giữ di chuyển/gait thiết yếu, bỏ bob/shake trang trí.
- SFX nghe thật gồm bước chân ngắn, nền hầm nhẹ, lật giấy và thành công phân biệt. Dùng Web Audio procedural cục bộ; không cần thư viện/mạng/giọng đọc. Không phát âm thanh trước nút bật riêng của người dùng.
- Canvas toàn chiều ngang với viewport logic **960×540, `Phaser.Scale.FIT`, `CENTER_BOTH`**. Giữ tỷ lệ, letterbox khi cần; không fit toàn bộ world vào màn hình. Không gọi `scale.resize()` với FIT.

## Architecture và hợp đồng bàn giao

- `world-data.js` xuất map `{id, width, height, walls, props, checkpoints, interactables, exits}`; tọa độ theo lưới 32, world 75×45 ô cho map chính. Checkpoint `{id,x,y,radius}` là vùng tròn không chồng vùng checkpoint khác, tâm là safe spawn đã kiểm tra body/collider; có entry và vùng ở các khu xa. Interactable `{id,clueId|puzzleId,x,y,radius}`; exit `{id,toChapterId,spawnId,requiresRoomId}`. Collision và rendering dùng cùng geometry.
- Một `AdventureScene` thay dữ liệu theo chapter; không bốn lớp scene gần trùng. Constructor nhận `onInteract(id)`, `onExit(exitId)`, `onCheckpoint({chapterId,checkpointId})`, `onMotion({distance,facing,blocked})` và getter state; không tự giải puzzle/ghi storage. `distance` là độ dời thực sau collision, không lấy từ phím hay vận tốc dự định.
- Khi đang khám phá, chỉ emit onCheckpoint lúc nhân vật đi từ ngoài vào một vùng checkpoint mới đã kiểm tra an toàn; đứng trong vùng không emit mỗi frame, cùng checkpoint đang lưu không emit lại. Spawn/load/chuyển map khởi tạo trạng thái vùng đang đứng, không giả sự kiện vừa đi tới. Composition kiểm tra current chapter + checkpoint ID thuộc map + geometry an toàn trước dispatch `reach-checkpoint`; không nhận sự kiện cũ từ chương trước.
- Scene công khai `enterChapter(chapterId,checkpointId)`, `setInputBlocked(blocked)`, `applySettings(settings)`, `refreshProgress(state)`, `destroy()`. `src/main.js` là composition; pha này sở hữu nó sau pha 1 và bàn giao pha 3.
- Cùng `map.width/height` cho `camera.setBounds` và `physics.world.setBounds`; player `setCollideWorldBounds(true)`. `startFollow(player,true,0.15,0.15)`, deadzone khoảng 25% viewport; điều chỉnh qua chơi thử. Khi reduced motion: `setLerp(1,1)` vẫn follow, không dùng lerp 0/stopFollow. Không shake/pan tự chạy.
- HUD nằm DOM ngoài scene. Resize FIT chỉ đổi tỷ lệ hiển thị; tọa độ world/body/interact vẫn giữ nguyên. Cập nhật bounds/follow/checkpoint sau mỗi chuyển map và snap camera vào spawn trước khi nhận input.
- `character-animation.js` tạo atlas/frame bằng mã hoặc asset local, đăng ký key idle/walk theo hướng một lần bằng Animation Manager; đổi chapter không đăng ký trùng. Chọn walk khi có độ dời thực, idle khi đứng/chặn/modal; diagonal dùng trục trội, giữ facing khi dừng. Cleanup listener/timer theo vòng đời scene.
- `audio-controller.js`: một AudioContext lazy; `unlockFromGesture() -> Promise<{ok,notice}>`, `setPreferences({audioEnabled,audioVolume})`, `setMode('exploration'|'dialogue'|'inactive')`, `reportMotion({distance,blocked})`, `playCue('paper'|'success')`, `destroy()`. Mode dialogue dừng ambient/steps nhưng cho paper/success chủ ý; inactive/blur dừng mọi node/âm đang phát. Reset tích lũy bước khi blocked/modal, không phát bù khi đóng.
- Audio runtime unlocked chỉ sau trusted click nút **Bật âm thanh** gọi create/resume trong gesture; preference true từ save không cấp quyền autoplay. Gain theo volume, mute về im lặng ngay. Bước chân theo quãng đường thực tích lũy và chỉ khi exploration có focus; distance 0/tường/modal không phát. Procedural noise/envelope cho chân/giấy, nền lọc nhẹ và cue thành công riêng; lỗi Web Audio cho notice và tiếp tục game im lặng, không giả đã phát.

## Related Code Files và quyền sửa

Gốc: `./`.

- Create: `src/content/world-data.js`, `src/game/adventure-scene.js`, `src/game/room-art.js` — maps, engine, textures pixel tạo cục bộ.
- Create: `src/game/character-animation.js`, `src/audio/audio-controller.js` — frame/animation lifecycle và single-context SFX; pha 3/4 được bàn giao để nối VN/preferences/lifecycle.
- Create: `src/core/world-geometry.js`, `tests/world-geometry.test.js` — vector chuẩn hóa, safe spawn, hình học dùng cùng scene, kiểm tra đường đi bằng graph/lưới từ geometry thật.
- Modify: `index.html`, `src/main.js`, `src/styles.css` — thay smoke scene bằng world, shell FIT và nút audio bật/mute/volume thật. Bàn giao shell/main/CSS cho pha 3.
- Read only: `src/core/game-rules.js`, `src/content/story-data.js`. Không port code prototype một cách mù quáng.

## Implementation Steps

1. Thiết kế các khu và checkpoint cho đủ sáu chapter; tạo geometry/collision/đồ vật bằng cùng dữ liệu, cửa khóa là body có thể bật/tắt khi trạng thái đổi.
2. Tạo sprite Minh bốn hướng × idle/walk gait frames và vật tương tác rõ; texture/art cục bộ. Chân dung được tạo cho prototype có thể đưa vào `assets/images/minh-portrait.png` ở pha 3 sau kiểm tra provenance; không dùng đường dẫn phụ thuộc prototype trong production.
3. Đọc phím chỉ khi game host có focus và scene cho phép; chuẩn hóa vector, zero velocity khi không nhận input. Dùng hành động nhấn mới cho E, không mở bảng liên tục khi giữ phím.
4. Dựng camera bounds/follow/deadzone, FIT và giảm chuyển động như hợp đồng. Khung HUD nhận biết khu hiện tại, mục tiêu và nút tương tác gần nhất bằng chữ.
5. Test geometry xác nhận spawn không cắt collider, vùng checkpoint không chồng nhau và mỗi clue/puzzle/door tới được từ checkpoint trong trạng thái mở khóa tương ứng; không cần xây pathfinding runtime. Browser kiểm tra vào vùng mới emit một lần, đứng yên không emit, đi tới checkpoint khác đổi đúng ID; callback khác chương bị composition bỏ qua.
6. Nối animation theo motion thực; audio controller từ nút HTML explicit, ambient + step + paper/success có thể nghe/đổi volume/mute; stop khi mất focus. Không import Web Audio vào pure rules/tests.
7. Browser: bốn hướng frame thật đổi và idle đúng; đi/chặn tường/modal không có step lạc; bốn góc/mép/world xa/resize không blank void hoặc lệch prompt. Restart/chuyển phòng nhiều lần không nhân đôi animation registration hoặc AudioContext/nodes.

## Success Criteria

- [x] Camera di chuyển thật tới các khu xa ở cả hai trục; HUD không cuộn theo world, camera dừng chính xác ở biên.
- [x] Body không vượt tường/cửa khóa; các điểm quan trọng đều reachable trong từng trạng thái. Tốc độ chéo bằng thẳng theo test vector.
- [x] Vào checkpoint xa cập nhật đúng ID qua callback/action; không emit mỗi frame, không nhận event cũ và không dùng khoảng cách xuyên tường để chọn checkpoint.
- [x] Resize giữ tỉ lệ và target tương tác; reduced motion bỏ smoothing nhưng không mất khu khám phá.
- [x] Idle/walk bốn hướng nhiều frame thật; bước chân theo di chuyển thật, không phát khi blocked/modal. Bốn loại audio thực nghe được sau bật; mute/volume/blur/lỗi API đúng, không autoplay.
- [x] `npm test`, `npm run build` đạt; ghi bằng chứng smoke browser, không gọi đây là QA toàn game.

Bằng chứng: [review mã](./reports/game-code-review.md), [edge QA](./reports/game-edge-qa.md), [hình camera phía nam](./reports/game-camera-south.png). Controller đã đi toàn hành trình bằng world/input thật, đo bốn hướng với frame 0–3, bước chân tăng khi đi rồi dừng tại tường, tín hiệu PCM RMS >0.004 sau bật. Camera X đạt 0–1440; với reduced motion đã lưu, camera Y đạt 0 ở player (341,82), 900 ở player (723,1345), rồi trở lại qua hành lang an toàn. Reload Him Lam đã giải trở về checkpoint hall (1120,680), giữ bốn clue và completion. Vector/reachability/checkpoint guard được tests và review kiểm tra; UI hẹp, mute/volume/Tab/no-autoplay được tester kiểm tra độc lập. Đầu ra âm thanh xác minh bằng analyser PCM, không tuyên bố đã nghe chất lượng loa bằng tai.

## Risk Assessment và quay lui

Softlock: sửa geometry/checkpoint, không tắt collision. Camera lỗi: cô lập bằng lerp 1/biên chung rồi sửa smoothing. Audio context bị suspend/không hỗ trợ: notice + chơi im lặng, không crash hoặc tự unlock; không xem fallback là đã đạt QA âm thanh. Quay lui đúng animation/audio node bị lỗi để sửa, giữ world/contracts/prototype; không bỏ yêu cầu hoạt ảnh/SFX khỏi nghiệm thu.

## Next Steps

Pha 3 nhận scene/motion/audio API và quyền sửa main/CSS để nối VN; chưa thêm save hay cho cửa tự mở để demo. Câu hỏi chưa chốt: không.
