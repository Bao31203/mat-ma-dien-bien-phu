# Nguồn hình ảnh tạo cho thiết kế

## Biểu tượng game

- Ngày tạo: 2026-10-29.
- Công cụ: imagegen tích hợp, chế độ tạo mới, nền trong suốt.
- Tệp trong dự án: [game-emblem.png](wireframe/assets/game-emblem.png).
- Mục đích: biểu tượng phong bì, chìa khóa và dấu niêm phong cho phần nhận diện game.
- Trạng thái: hình đề xuất trong bước duyệt thiết kế; chưa được người dùng duyệt riêng.
- Bản sao dùng trong game chính: `assets/images/game-emblem.png`; nguồn tạo và prompt giữ như bên dưới, không phải huy hiệu lịch sử.

## Prompt đã dùng

```text
Create ONE square transparent-background brand emblem asset for a Vietnamese educational 2D pixel-art mystery adventure called Mat Ma Dien Bien Phu. Do NOT include any lettering, words, numerals, watermark, badge text, flag or weapon. Visual idea: an aged folded secret-message envelope with a small brass key resting diagonally across it, a single olive-green wax seal, and a tiny ochre compass diamond behind the envelope. Warm muted parchment beige, antique brass and deep olive palette, very readable silhouette. Elegant handcrafted 16-bit pixel art, limited palette, crisp stepped pixel edges, rich but restrained pixel shading. Perfectly front-facing, centered composition, generous transparent margin on all sides. The envelope and key should read as one compact distinctive symbol, not a busy scene. True alpha transparency outside the symbol; no background plane, no white square. Suitable as an emblem on an olive-black game header at 48px or 72px wide. Output a PNG image and save it locally if supported.
```

## Hình vẽ bằng mã

Khung cảnh trong hầm và nhân vật ở bản mẫu được vẽ bằng mã trong `docs/wireframe/`; không phải ảnh tư liệu hoặc bản phục dựng di tích. Nội dung lịch sử đối chiếu riêng theo [đề xuất game](game-proposal.md).

Game chính vẽ phòng và sprite bằng mã trong `src/game/room-art.js` và `src/game/character-animation.js`, cùng ranh giới hư cấu; không dùng tranh này như tư liệu lịch sử.

## Chân dung Minh cho visual novel

- Ngày tạo: 2026-10-29.
- Công cụ: imagegen tích hợp, tạo mới với nền trong suốt; alpha góc ảnh đã kiểm tra.
- Tệp: [minh-portrait.png](wireframe/assets/minh-portrait.png), 1024×1536.
- Nhân vật hư cấu, áo kem/khăn đỏ/túi nâu, dùng trong khung kể chuyện; không phải chân dung nhân chứng hoặc nhân vật lịch sử có thật.
- Bản sao dùng trong game chính: `assets/images/minh-portrait.png`. Việc tích hợp không bổ sung khẳng định về giấy phép phân phối.

```text
Create a single transparent PNG character portrait asset for a Vietnamese historical visual novel / 2D pixel-art exploration game. Character is Minh, a fictional young Vietnamese male civilian age 18, not a real historical person: short naturally tousled black hair, brown eyes, warm thoughtful expression, simple cream cotton long-sleeve shirt with sleeves rolled to elbows, faded brick-red short neck scarf, brown canvas satchel strap diagonally across torso. Waist-up three-quarter portrait facing slightly toward the viewer's right, one hand thoughtfully holding the satchel strap. Authentic Southeast Asian/Vietnamese facial features, grounded respectful portrayal, gentle curiosity, no military uniform, no insignia, no weapons. A refined hand-painted 16-bit pixel-art visual novel portrait with crisp pixel clusters and limited shaded palette, detailed face expressive enough at 180px display height. Muted olive shadows, parchment-cream highlights, brown leather accents, warm amber side light consistent with a lamplit underground bunker. Whole head and shoulders and torso must fit with clear margins; waist cropped cleanly at lower edge. Single character only, centered, no text, no typography, no logo, no background scene, true alpha transparent background. This should feel like a finished game dialogue portrait, not a photo, not 3D, not an emoji.
```
