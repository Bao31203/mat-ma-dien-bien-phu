---
phase: 5
title: Verification and handoff
status: completed
effort: ''
priority: P1
dependencies:
  - 4
---

# Phase 5: Verification and handoff

## Overview

Kiểm chứng bản game đã build, sửa lỗi có bằng chứng và bàn giao lệnh chạy cùng giới hạn thực tế. Không deploy, tạo commit hoặc Git init.

## Context Links

- [Tiêu chí toàn kế hoạch](./plan.md), [QA prototype chỉ để tham khảo](../reports/261029-design-preview-qa.md).
- Đọc lại README và các docs hiện có trước cập nhật; không sửa lịch sử ghi nhận kiểm tra prototype.

## Requirements

- Chơi thử đủ bốn phòng thật trên browser; test unit không thay cho va chạm/camera/focus ngoài đời. Hướng dẫn giải để reviewer tái hiện đặt trong báo cáo QA, không ẩn điều kiện trong code.
- Kiểm chứng VN hybrid giữ bản đồ/camera/bốn chương, chân dung/tên/lời/advance; hoạt ảnh có đổi frame và âm thanh thực có đầu ra. Nếu môi trường không nghe/ghi được audio, ghi rõ giới hạn và chưa đánh dấu đạt âm thanh; không suy từ nút đổi trạng thái hoặc tạo node.
- Không hứa screen reader chơi trọn toàn bộ canvas, touch movement, thời lượng hoặc hiệu năng chưa đo. Báo rõ các giới hạn quan sát; không thêm benchmark giả.
- Rà soát code độc lập theo `ck:code-review`; fix bug và chạy lại check bị ảnh hưởng. Không mở rộng sản phẩm hoặc thêm công cụ QA nặng khi kiểm tra trực tiếp đủ.

## Related Code Files và quyền sửa

Gốc: `./`.

- Modify: `README.md`, `docs/tech-stack.md`, `docs/design-guidelines.md`, `docs/game-proposal.md` — trạng thái thật, lệnh chạy, controls, scope và cách tiếp tục/reset.
- Create: `docs/system-architecture.md` — module, VN/discover-collect-beat flow, input guard, animation/audio lifecycle, source registry, save v1 và camera. Docs-manager theo `ck:docs` rà nhu cầu và tạo ngắn khi có giá trị: `docs/project-overview-pdr.md`, `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/project-roadmap.md`; ghi contract thật, không bịa changelog. Kiểm tra `docs/image-prompts.md` khớp provenance portrait local.
- Nhật ký hoàn tất thực tế: `docs/journals/2026-10-29-full-game.md`; ghi quyết định và giới hạn sau khi đã có bằng chứng nghiệm thu, không viết nhật ký hoàn tất ở giai đoạn lập kế hoạch.
- Create: `plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-qa.md`, `plans/261029-1757-mat-ma-dien-bien-phu-game/reports/game-code-review.md`; ảnh bằng chứng trong cùng plan tại `reports/assets/` khi hữu ích.
- Bugfix only: các tệp `src/`, `tests/`, shell/config từ pha 1–4 nếu check thất bại; ghi cause, thay đổi và check chạy lại trong QA, không thiết kế lại silent.
- Không sửa/xóa prototype trong `docs/wireframe/` hoặc gọi ảnh prototype là ảnh game.

## Ma trận kiểm tra

| Nhóm | Tình huống bắt buộc | Bằng chứng |
| --- | --- | --- |
| Hành trình/Him Lam | New game; bốn clue Him Lam riêng; chỉ mở+Esc/thiếu một clue/sai order/trùng card đều không mở cửa; đúng position→artillery→infantry→victory; hint/thử lại; ba chương còn lại; hòa bình input trống; ending | Thu đủ bốn clue bằng nút ghi lời cuối + đúng bốn thẻ mới mở; Him Lam victory khác campaign ending |
| Camera/collision | Đi các góc/biên/corridor của mỗi map; khu ngoài viewport đầu; quay lại; tốc độ chéo; brightness/reduced motion | Ảnh đầu/xa + quan sát không xuyên/kẹt/blank void |
| VN/backlog/input | Portrait/tên/lời/Trước/Tiếp; Enter/Space không advance kép; giữ W rồi mở VN/E/N; gõ trong form; Esc sớm; backlog/reopen trước và sau collect; Tab/blur/chuyển phòng | VN đóng băng chuyển động/steps, chưa ghi không complete; reopen không reset/nhân đôi; focus đúng và nhấn mới mới đi |
| Hoạt ảnh/âm thanh | Walk/idle bốn hướng, frame thay đổi; chặn tường/đứng/VN/blur; bật tiếng/mute/volume 0–1; nghe step/ambient/paper/success; API không có/suspend; restart nhiều lần | Gait thật và idle đúng; không step khi không dịch chuyển, ambient ngừng trong VN; paper cue chủ ý; mute thật, một context, lỗi không crash |
| Resume/reset | Reload mỗi chương; đi tới checkpoint xa rồi reload; đứng trong vùng không ghi lặp; event cũ/ID lạ; sau giải trước qua cửa; save hỏng/version lạ/khóa sai; storage throws; hủy/xác nhận reset | Resume đúng checkpoint vừa đi tới gần đây nhất, không về entry/chọn điểm gần xuyên tường; event sai không đổi save; fallback entry chỉ khi ID hỏng; notice rõ |
| Responsive | 1280×800; 375×812; 640×400; resize giữa chơi; thử zoom trình duyệt 200% | Không méo canvas/tràn ngang; chữ dấu Việt/control/đóng bảng rõ |
| Build/offline | Build production, phục vụ dist qua HTTP; chặn mạng ngoài nhưng giữ localhost, disable cache rồi reload; xem network/console | Không tải CDN/font/asset bên ngoài; game chạy trọn luồng, không yêu cầu service worker |
| Save VN/audio | Reload sau discover+Esc, sau collect, sau beat hoàn tất; saved sound on + volume; dữ liệu audio/beat sai; reset/hủy | Unread backlog đúng, không cấp clue khi Esc; collect nguyên tử; preference giữ nhưng không autoplay, không có context/cursor/suy nghĩ trong save |

## Implementation Steps

1. Chạy `npm test` trước, rồi `npm run build`; ghi lệnh/kết quả thực tế và phiên bản Node/Phaser/Vite. Sửa thất bại, không nới test để che lỗi.
2. Dùng `npm run dev` để rà nhanh; chạy QA cuối trên `npm run preview -- --host 127.0.0.1` phục vụ `dist`. Kiểm tra Chrome/Edge cục bộ khi có; ghi đúng browser đã thử.
3. Chạy ma trận ở cả bốn chương bằng chuột và bàn phím; riêng Him Lam đi đủ VN → explicit ghi bốn clue → thẻ → đúng order. Chụp frame idle/walk khác nhau và kiểm tra đầu ra audio thật ở các mode; không dùng kết quả prototype thay game. Kiểm tra checkpoint xa/reload và event chương cũ; đối chiếu bốn giai đoạn Him Lam với nguồn bảo tàng, lời Minh hư cấu được ghi rõ.
4. Nhờ reviewer độc lập đọc mã và bằng chứng; xử lý concern có chứng cứ, không đảo quyết định thiết kế đã duyệt chỉ vì suy đoán. Nếu phát hiện yêu cầu sản phẩm xung đột, đưa controller quyết định.
5. Handoff docs-manager/`ck:docs` đồng bộ docs sau QA. README tách game/prototype; ghi npm ci/dev/test/build/preview, VN đọc/ghi/reopen, bốn thẻ Him Lam, bật âm/mute/volume/unlock lại sau load, HTTP/offline/localStorage và desktop keyboard scope. Không quảng cáo voice acting/TTS.
6. Ghi kết quả, lỗi còn lại và hướng tái hiện trong QA. Handoff project-management/`ck:project-management` đồng bộ plan/roadmap theo kết quả thật; chỉ đánh dấu phase hoàn tất khi tiêu chí đạt, dùng CLI khi có. Sau khi game thực sự hoàn tất, `ck:journal` ghi quyết định và giới hạn đã quan sát. Không tự Git init/commit/deploy.

## Success Criteria

- [x] `npm test` + production build đạt; toàn tuyến và mỗi nhánh lỗi có kết quả tái hiện trong `game-qa.md`.
- [x] Không còn blocker camera/collision, VN/card bàn phím, animation/SFX thật, resume/audio unlock, lịch sử và hoàn thành cả bốn chương.
- [x] `dist` tải đủ tài nguyên cục bộ qua HTTP khi ngắt mạng; console không có lỗi chưa giải thích.
- [x] README/docs khớp bản chạy; docs-manager và project-management sync xong; nhật ký hoàn tất viết đúng lúc; review độc lập hoàn tất. Báo kết quả và giới hạn thật, không đẩy hosting/Git.

Bằng chứng: [QA toàn tuyến và đáp án tái hiện](./reports/game-qa.md), [edge QA](./reports/game-edge-qa.md), [review độc lập](./reports/game-code-review.md), [docs-manager DONE](./reports/production-docs.md), [hygiene DONE](./reports/delivery-hygiene.md), [PM sync và probe final-build độc lập](./reports/pm-completion.md). Bundle cuối `index-DE-mEXGN.js` đã chơi mới tới ending và reload đúng summary, bốn phòng/mười clue; hòa bình trống. Bản production cuối tải mới khi chặn mạng ngoài, có PCM giấy/thành công sau sửa focus. Docs kiểm tra 4 code references, 45 liên kết trong 10 docs và bổ sung 64 liên kết README/docs/journal không thiếu. Toàn bộ 5 pha đã sync bằng CLI; không còn tiêu chí hoặc mapping mở. Giới hạn browser, bàn phím và âm thanh được ghi cụ thể trong QA; không Git init/commit/deploy.

## Risk Assessment và quay lui

Một map/beat bị bỏ sót: checklist từng chương/clue, không suy từ Him Lam. Audio giả đạt: phải kiểm tra đầu ra, không chỉ state UI. Font/diacritics/zoom sửa CSS/DOM, không raster hóa chữ. Regression: quay lui đúng thay đổi gây lỗi, chạy test hẹp rồi toàn tuyến bị ảnh hưởng; không bỏ VN/sound/animation hoặc khôi phục puzzle Him Lam cũ để né lỗi. Prototype còn để đối chiếu thị giác.

## Unresolved Questions

Không có quyết định chặn. Báo cáo triển khai phải ghi lỗi chưa giải quyết nếu phát hiện; không tuyên bố hoàn tất khi còn blocker.
