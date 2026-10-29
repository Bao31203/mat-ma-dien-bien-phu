---
title: Mật mã Điện Biên Phủ browser game
description: >-
  Visual novel lịch sử kết hợp khám phá Phaser: Minh có hoạt ảnh, lời kể, âm
  thanh và bốn thử thách; lưu cục bộ.
status: completed
priority: P2
effort: large
branch: ''
tags:
  - feature
  - frontend
  - game
blockedBy: []
blocks: []
created: '2026-10-29T10:59:59.174Z'
createdBy: 'ck:plan'
source: skill
---

# Mật mã Điện Biên Phủ browser game

## Overview

Trạng thái: **hoàn tất và đạt bàn giao cục bộ** sau chỉ đạo “duyệt và làm full” ngày 2026-10-29. Đủ 5/5 pha, 26/26 tiêu chí pha và 7/7 tiêu chí toàn kế hoạch. 23/23 test, production build, review độc lập và lượt chơi thật toàn tuyến trên bundle cuối đều đạt. Giữ phạm vi visual novel + bản đồ lớn/camera + hoạt ảnh + âm thanh đã duyệt. Bản mẫu chương I là tài liệu đối chiếu riêng, không dùng làm bằng chứng QA game Phaser.

- Visual novel lịch sử kết hợp khám phá nhìn từ trên xuống: bảo tàng → Him Lam → bản đồ chiến dịch → sở chỉ huy → hòa bình → bảo tàng; Minh có chân dung, tên và lời kể viết, nhấn chuyển từng lời.
- Phaser + JavaScript + Vite; DOM cho HUD, hội thoại VN, sổ tay và native dialog; `npm run dev`, `npm run build`, `npm test`.
- Khung chơi toàn chiều ngang; bản đồ di chuyển khởi điểm 2400×1440, nhiều khu có chức năng và hành lang. Camera theo người chơi, dừng ở biên; HUD cố định. Đây là bản đồ hầm hư cấu, khác sơ đồ lịch sử trong câu đố phòng 2.
- Giữ pixel art/ô liu/serif; Minh idle/walk bốn hướng, nhiều frame bước chân; SFX bước chân, nền hầm, giấy và thành công thực sự phát sau thao tác bật âm thanh, có mute/volume. Tài nguyên cục bộ; prototype độc lập với game.
- Him Lam: tìm bốn manh mối/lời kể rồi xếp bốn giai đoạn: chuẩn bị trận địa → pháo binh khai hỏa chiều 13/3/1954 → bộ binh tiến công → chiếm Him Lam/chiến thắng.
- Không thêm React, backend, tài khoản, chiến đấu, cảm ứng, lồng tiếng thu âm, TTS/dịch vụ AI ngoài, PWA, hosting hoặc Git trong phạm vi này.

## Scope và cách thực hiện

- Đã triển khai Phaser, luật thuần, giao diện DOM, bốn thử thách, lưu tiến độ và âm thanh; tái dùng token, nội dung có nguồn, ý tưởng tranh bằng mã và chân dung cục bộ có provenance. Không thay bốn chương bằng VN tuyến tính.
- Nhiều hơn tám tệp vì tách scene, DOM và luật thuần cần kiểm thử; một scene chơi dùng dữ liệu các phòng, không tạo framework hoặc lớp cho từng câu đố.
- Năm pha giữ riêng các rủi ro engine, puzzle/input, lưu tiến độ và kiểm tra toàn hành trình. **Thực hiện tuần tự 1→2→3→4→5**, không sửa song song tệp dùng chung. Mỗi pha ghi rõ bàn giao `src/main.js` và tệp tích hợp.
- Khóa **Phaser 3.90.0 + Vite 8.3.5**, có lockfile. Phaser 4.2.1 đã ổn định; chọn nhánh 3 có chủ đích để thống nhất API 2D đã kiểm tra. Node hiện có 24.15.0 đáp ứng Vite. Không cài toàn cục.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Foundation and contracts](./phase-01-foundation-and-contracts.md) | Completed |
| 2 | [Exploration and camera](./phase-02-exploration-and-camera.md) | Completed |
| 3 | [Puzzles and interface](./phase-03-puzzles-and-interface.md) | Completed |
| 4 | [Progress and narrative](./phase-04-progress-and-narrative.md) | Completed |
| 5 | [Verification and handoff](./phase-05-verification-and-handoff.md) | Completed |

## Dependencies

Không có kế hoạch chồng lấn; `blockedBy`/`blocks` rỗng. Chưa có task API; các tệp pha là nguồn theo dõi chính.

- [Đề xuất game](../../docs/game-proposal.md), [công nghệ](../../docs/tech-stack.md), [thiết kế](../../docs/design-guidelines.md).
- [Nghiên cứu công nghệ/lối chơi](../reports/261029-bootstrap-research.md), [QA bản mẫu](../reports/261029-design-preview-qa.md).
- [Camera/runtime và phiên bản đã kiểm chứng](./reports/camera-and-runtime-research.md).
- Bằng chứng nghiệm thu: [QA game chính](./reports/game-qa.md), [edge QA độc lập](./reports/game-edge-qa.md), [review mã game](./reports/game-code-review.md), [PM sync](./reports/pm-completion.md), [docs handoff](./reports/production-docs.md), [delivery hygiene](./reports/delivery-hygiene.md). Các tệp pha là nguồn bền vững; không có Task API trong phiên này.

## Nghiệm thu

- [x] Chơi mới tới kết thúc với lời kể Minh đọc lại được; Him Lam cần đủ bốn clue và đúng thứ tự bốn thẻ; đủ gợi ý/bốn cửa; hòa bình không chấm quan điểm, không bắt nhập.
- [x] Camera thấy khu ngoài khung đầu, không lộ ngoài bản đồ; va chạm/chuyển phòng không kẹt; tốc độ chéo được chuẩn hóa; resize không méo hoặc lệch tương tác.
- [x] Mọi câu đố và bảng dùng được bằng bàn phím; mở bảng/blur/đổi focus xóa phím giữ; đóng bảng cần nhấn mới để di chuyển. Giảm chuyển động vẫn khám phá được toàn bản đồ.
- [x] Idle/walk bốn hướng có đổi frame; không có tiếng bước khi đứng, bị tường chặn hoặc mở bảng. Bật/tắt/volume có tác dụng; load save không tự phát âm thanh.
- [x] Tải lại ở checkpoint an toàn vừa đi tới gần đây nhất; save hỏng/phiên bản lạ/storage lỗi vẫn chơi được; chơi lại có xác nhận.
- [x] Build tĩnh có engine/tài nguyên cục bộ; kiểm tra khi ngắt mạng qua HTTP. Dấu tiếng Việt, màn nhỏ và nội dung có nguồn đạt QA.
- [x] `npm test` và `npm run build` đạt; có báo cáo chơi thử thực tế, không suy diễn từ QA bản mẫu.

## Rủi ro và câu hỏi

Rủi ro chính: camera/va chạm gây kẹt, input VN/dialog lẫn gameplay, save sai mở khóa, audio autoplay/context/lifecycle, thiếu frame, chữ có dấu và puzzle bàn phím. Pha 2–5 có kiểm chứng và cách quay lui.

## Red Team Review

Review bản trước VN/audio: ba reviewer độc lập, một Medium checkpoint đã giải quyết. [Báo cáo cũ](./reports/plan-review-adjudication.md). Phạm vi VN/audio mới đã review độc lập: không có mâu thuẫn kế hoạch; một Medium về focus xếp thẻ trong prototype đã sửa và kiểm tra lại bằng bàn phím. [Review VN](./reports/visual-novel-delta-review.md).

### Whole-Plan Consistency Sweep

- Đã đọc lại đủ sáu tệp, đối chiếu VN/beat, bốn clue/thẻ, hoạt ảnh/SFX, audio preferences/runtime, save/backlog, checkpoint và handoff. Người dùng đã duyệt triển khai; PM rà lại toàn bộ pha theo mã, tests và báo cáo thực tế. Review mã độc lập không còn blocker; hai Medium backlog/audio suspend đã sửa và kiểm tra lại.

Câu hỏi chưa chốt: không. Đã đối chiếu và đóng toàn bộ checkbox dựa trên báo cáo thực tế; không có mapping còn bỏ sót. Cảm ứng/Git/hosting nằm ngoài phạm vi. Chỉ xác nhận Chromium và bàn giao cục bộ; không tuyên bố hiệu năng chưa đo, lồng tiếng hoặc khả năng nghe loa vật lý.
