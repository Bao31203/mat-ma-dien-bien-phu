// Minh, his dialogue and the room layouts are fictional learning devices.
export const chapterOrder = ['museum', 'him-lam', 'campaign-map', 'command-post', 'peace', 'ending'];
export const roomOrder = ['him-lam', 'campaign-map', 'command-post', 'peace'];

export const sources = {
  'museum-him-lam': { id: 'museum-him-lam', title: 'Bảo tàng Lịch sử quốc gia — Trận mở màn Him Lam', url: 'https://baotanglichsu.vn/vi/Articles/2002/68138/ky-niem-60-nam-chien-thang-lich-su-djien-bien-phu-1954-2014tran-mo-man-tieu-diet-trung-tam-dje-khang-him-lam-13-3-1954.html' },
  'nhandan-campaign': { id: 'nhandan-campaign', title: 'Báo Nhân Dân — Chuyên trang Chiến thắng Điện Biên Phủ', url: 'https://dienbienphu.nhandan.vn/' },
};

const chapter = (id, title, kicker, goal, clueIds, puzzleId, nextChapterId) => ({ id, title, kicker, goal, clueIds, puzzleId, nextChapterId, introBeatId: `${id}-intro` });
export const chapters = {
  museum: chapter('museum', 'Ánh sáng từ mô hình', 'Bảo tàng · Hiện tại', 'Theo Minh khám phá mô hình hầm Đờ Cát và cánh cửa ký ức.', [], null, 'him-lam'),
  'him-lam': chapter('him-lam', 'Dấu mở đầu', 'Chương I · Ký ức Him Lam', 'Ghi bốn manh mối và ghép trình tự trận mở màn.', ['him-lam-position', 'him-lam-artillery', 'him-lam-infantry', 'him-lam-victory'], 'him-lam', 'campaign-map'),
  'campaign-map': chapter('campaign-map', 'Những đường nét trên bản đồ', 'Chương II · Toàn cảnh chiến dịch', 'Đọc sơ đồ học tập, đặt ba thẻ và xếp bốn mốc ngày.', ['campaign-north', 'campaign-chronology', 'campaign-encirclement'], 'campaign-map', 'command-post'),
  'command-post': chapter('command-post', 'Bức điện cuối hành lang', 'Chương III · Sở chỉ huy', 'Ghép bản tin được biên soạn và chọn ngày chiến thắng.', ['command-report', 'command-advance', 'command-capture'], 'command-post', 'peace'),
  peace: chapter('peace', 'Điều mang về', 'Chương IV · Cánh cửa hòa bình', 'Có thể đọc thêm ký ức hoặc suy nghĩ, rồi tự chọn bước qua cánh cửa.', ['peace-memory', 'peace-community'], null, 'ending'),
  ending: chapter('ending', 'Trở lại bên mô hình', 'Bảo tàng · Trở về hiện tại', 'Đọc lời kết và giữ lại một điều muốn tìm hiểu thêm.', [], null, null),
};

const beat = (id, chapterId, texts, requiredDiscoveredClueIds = [], sourceIds = []) => ({
  id, chapterId, requiredDiscoveredClueIds,
  lines: texts.map(text => ({ speakerId: 'minh', portraitId: 'minh', text, sourceIds, fictional: true })),
});
export const beats = {
  'museum-intro': beat('museum-intro', 'museum', [
    'Mình là Minh. Hôm nay, ở Bảo tàng Chiến thắng Điện Biên Phủ, mình dừng trước mô hình hầm Đờ Cát. Khi tay mình chạm vào mô hình, một luồng sáng lạ bất chợt phủ kín mọi thứ.',
    'Ánh sáng tan đi. Mình đang đứng trong một căn hầm, trước tờ lịch ngày 7/5/1954. Những trang tư liệu từ tháng 3 và tháng 4 nằm quanh mình, như đang chờ được đọc lại.',
    'Một giọng nói vang lên, nhắc mình giải những cánh cửa lịch sử để tìm đường trở về. Mình hít sâu, mở sổ tay và bước đến dấu vết đầu tiên. Có lẽ mình phải hiểu điều đã xảy ra trước khi tìm được lối ra.',
  ]),
  'him-lam-intro': beat('him-lam-intro', 'him-lam', [
    'Mùi giấy và ánh đèn vàng dẫn mình vào gian đầu tiên. Trên bàn là bốn dấu vết của trận Him Lam, trận mở màn chiến dịch.',
    'Mỗi tờ giấy chỉ giữ một phần câu chuyện. Mình sẽ đọc từng dấu vết trước khi ghép lại thứ tự, bắt đầu từ những công việc đã diễn ra trước tiếng pháo.',
  ]),
  'campaign-map-intro': beat('campaign-map-intro', 'campaign-map', [
    'Mình đã hiểu một trận mở màn. Gian bản đồ nhắc mình rằng chiến dịch còn là một quá trình dài, với nhiều vị trí và nhiều đợt tiến công.',
    'Mình đọc chú giải trước, rồi nhìn dải ngày tháng bên cạnh. Mỗi vị trí và mỗi mốc thời gian đều cần được hiểu trong bức tranh chung, thay vì chỉ ghi nhớ một hàng tên gọi.',
  ]),
  'command-post-intro': beat('command-post-intro', 'command-post', [
    'Tiếng giấy khẽ động bên chiếc máy điện đài. Mình tìm thấy ba mẩu bản tin, như ba phần của một câu chưa viết xong.',
    'Mình đặt chúng cạnh nhau, tìm phần mở đầu và kết quả. Có một ngày trên bản tin mà mình đã gặp ở gian bản đồ; lần này, mình muốn hiểu rõ sự kiện gắn với ngày ấy.',
  ]),
  'peace-intro': beat('peace-intro', 'peace', [
    'Căn phòng cuối không có ổ khóa bằng con số. Mình thấy một bức ảnh, một bàn học và khoảng sáng bên ngoài cánh cửa.',
    'Mình muốn mang về điều gì từ chuyến đi này? Có lẽ phải nhìn kỹ những con người và những việc nhỏ trong hiện tại trước khi trả lời.',
  ]),
  'ending-intro': beat('ending-intro', 'ending', [
    'Ánh sáng trở lại, rồi dịu dần. Mình lại đứng bên mô hình hầm Đờ Cát trong bảo tàng. Mọi thứ vẫn như lúc đầu, nhưng lần này những ngày tháng đã gắn với những con người và sự việc mình vừa tìm hiểu.',
    'Chiến thắng Điện Biên Phủ ngày 7/5/1954 là một dấu mốc lớn. Nó không có nghĩa rằng ngay ngày ấy đất nước đã thống nhất hay mọi nơi đều lập tức có hòa bình.',
    'Mình rời mô hình với lòng biết ơn và một câu hỏi để tiếp tục tìm hiểu. Mình muốn góp phần giữ gìn một tương lai hòa bình, bắt đầu từ cách mình học, lắng nghe và đối xử với người khác hôm nay.',
  ], [], ['nhandan-campaign']),
};

export const clues = {};
function addClue(id, chapterId, title, body, texts, sourceIds = [], direction = '') {
  const beatId = `${id}-story`;
  clues[id] = { id, chapterId, title, body, beatId, sourceIds, fictional: sourceIds.length === 0, direction };
  beats[beatId] = beat(beatId, chapterId, texts, [id], sourceIds);
}
addClue('him-lam-position', 'him-lam', 'Hồ sơ chuẩn bị', 'Chuẩn bị trận địa: triển khai lực lượng, chuẩn bị cho trận đánh trước khi khai hỏa.', [
  'Mình lật trang hồ sơ. Trước tiếng pháo là công việc chuẩn bị trận địa và triển khai lực lượng; trận đánh không bắt đầu bằng một mệnh lệnh xuất hiện từ hư không.',
  'Mình ghi thẻ “Chuẩn bị trận địa”. Đây phải là bước đứng trước những hoạt động tiến công trong bộ thẻ của mình.',
], ['museum-him-lam'], 'Bàn hồ sơ ở gian phía tây.');
addClue('him-lam-artillery', 'him-lam', 'Dòng ghi bên điện đài', 'Pháo binh khai hỏa chiều 13/3/1954, mở màn trận đánh Him Lam.', [
  'Bên điện đài, mình đọc được mốc chiều 13/3/1954. Pháo binh khai hỏa, mở màn trận đánh vào Him Lam.',
  'Mình không cần đoán một phút cụ thể. Điều quan trọng ở đây là hiểu tiếng pháo đến sau chuẩn bị và trước bước bộ binh tiến công.',
], ['museum-him-lam'], 'Điện đài ở gian phía bắc.');
addClue('him-lam-infantry', 'him-lam', 'Sơ đồ hành lang', 'Sau hỏa lực pháo binh, bộ binh tiến công các vị trí phòng ngự ở Him Lam.', [
  'Những nét bút trên tờ giấy khiến mình nghĩ đến bước chân người lính. Sau phần hỏa lực mở màn là bộ binh tiến công các vị trí phòng ngự.',
  'Mũi tên trong gian này chỉ giúp mình đọc thứ tự, không tái hiện một đường tiến công chính xác. Mình đặt thẻ bộ binh sau thẻ pháo binh.',
], ['museum-him-lam'], 'Sơ đồ ở hành lang phía đông.');
addClue('him-lam-victory', 'him-lam', 'Bản tin Him Lam', 'Quân ta làm chủ Him Lam, giành thắng lợi trận mở màn; chiến dịch chưa kết thúc ở đây.', [
  'Bản tin nói đến việc làm chủ Him Lam. Mình thấy rõ điểm kết của bốn thẻ: thắng lợi của trận mở màn.',
  'Mình gạch dưới chữ “mở màn”. Chiến thắng này không phải ngày kết thúc toàn chiến dịch; gian bản đồ phía sau vẫn còn nhiều điều để đọc.',
], ['museum-him-lam'], 'Bản tin trong gian bản đồ phía nam.');
addClue('campaign-north', 'campaign-map', 'Chú giải phương hướng', 'Quy ước sơ đồ học tập: Độc Lập ở ô Bắc, Him Lam ở ô Đông Bắc, Mường Thanh ở ô Trung tâm. Các ô không theo tỷ lệ địa lý.', [
  'Mình tìm thấy chú giải của chính sơ đồ: ô Bắc nhận Độc Lập, ô Đông Bắc nhận Him Lam, còn ô Trung tâm nhận Mường Thanh.',
  'Mình chép lại chú giải rồi nhìn những ô còn trống. Chỉ cần đọc kỹ phần hướng dẫn này, mình đã biết nên đặt từng thẻ vào đâu.',
], [], 'Bảng chú giải ở phía bắc gian bản đồ.');
addClue('campaign-chronology', 'campaign-map', 'Dải mốc chiến dịch', '13/3/1954: mở màn; 30/3/1954: đợt tiến công thứ hai; 1/5/1954: đợt tiến công thứ ba; 7/5/1954: chiến thắng Điện Biên Phủ.', [
  'Trên dải mốc, mình đọc bốn ngày: 13/3, 30/3, 1/5 và 7/5 năm 1954. Lần lượt là mở màn, đợt tiến công thứ hai, đợt thứ ba và chiến thắng.',
  'Mình sẽ xếp theo thời gian thật của tư liệu. Chuyến khám phá trong câu chuyện vẫn diễn ra trong không gian ký ức ngày 7/5.',
], ['nhandan-campaign'], 'Dải tư liệu ở bàn phía đông.');
addClue('campaign-encirclement', 'campaign-map', 'Lời nhắc bên sa bàn', 'Đặt thẻ theo chú giải, xếp mốc theo ngày. Sơ đồ không mô phỏng tỷ lệ, khoảng cách hay một tuyến tiến quân duy nhất.', [
  'Một lời nhắc nằm bên sa bàn: vị trí và thời gian trả lời hai câu hỏi khác nhau. Mình không nên biến thứ tự các ngày thành một đường nối bắt buộc giữa ba địa điểm.',
  'Mình đã có đủ cách đọc: dùng chú giải cho ô thẻ, dùng ngày tháng cho dải mốc. Khi ghép được cả hai, mình mới có thể mở gian tiếp theo.',
], [], 'Tờ hướng dẫn cạnh sa bàn phía nam.');
addClue('command-report', 'command-post', 'Mẩu điện: sở chỉ huy', 'Mẩu văn bản hư cấu thứ hai: “tiến vào sở chỉ huy đối phương,”. Ghép sau mẩu tiến quân và trước mẩu kết quả.', [
  'Mình nhặt được một mẩu giữa câu: “tiến vào sở chỉ huy đối phương,”. Nó cần phần mở đầu phía trước và kết quả phía sau.',
  'Mình giữ mẩu giấy ở giữa trang sổ. Phía trước phải là hành động tiến công, còn phía sau sẽ cho mình biết kết quả ở sở chỉ huy ấy.',
], [], 'Bàn điện báo ở phía tây.');
addClue('command-advance', 'command-post', 'Mẩu điện: tiến quân', 'Mẩu văn bản hư cấu mở đầu: “Quân ta tiến công,”. Đây là mẩu đầu tiên của bản tin trong trò chơi.', [
  'Mẩu giấy này mở đầu bằng “Quân ta tiến công,”. Dấu phẩy cho mình biết câu chuyện vẫn còn tiếp.',
  'Mình đặt nó trước mẩu nhắc đến sở chỉ huy. Khi ghép liền những câu ngắn này, mình bắt đầu nhìn ra ý nghĩa của bản tin.',
], [], 'Khay hồ sơ ở phía bắc.');
addClue('command-capture', 'command-post', 'Mẩu điện: kết quả', 'Mẩu văn bản hư cấu cuối: “bắt Đờ Cát cùng bộ chỉ huy.” Sự kiện đối chiếu: ngày 7/5/1954, chiến thắng Điện Biên Phủ.', [
  'Mẩu cuối nói “bắt Đờ Cát cùng bộ chỉ huy.” Mình đối chiếu với tư liệu về ngày 7/5/1954 rồi ghi ngày ấy bên cạnh bản tin.',
  'Mình kiểm tra thêm một lần để không nhầm ngày mở màn với ngày chiến thắng. Mình sẽ ghép tiến công, sở chỉ huy, kết quả; sau đó chọn ngày 7/5/1954.',
], ['nhandan-campaign'], 'Bảng tin trong gian phía đông.');
addClue('peace-memory', 'peace', 'Ký ức trong tấm ảnh', 'Một cảnh hư cấu gợi nhớ những con người phía sau tư liệu. Có thể tìm hiểu thêm lịch sử, lắng nghe ký ức và giữ gìn nơi tưởng niệm.', [
  'Trong bức ảnh tưởng tượng của gian này, mình nhìn thấy những gương mặt bình dị. Những dòng tóm tắt chiến dịch không thể kể hết cuộc đời của từng người.',
  'Mình muốn học thêm từ tư liệu và lắng nghe với lòng tôn trọng. Không cần một lời hứa thật lớn để bắt đầu việc ấy.',
], [], 'Bức ảnh ở góc sáng phía tây.');
addClue('peace-community', 'peace', 'Bàn học hôm nay', 'Suy nghĩ và hành động hiện tại là lựa chọn cá nhân. Có thể để trống phần suy nghĩ; trò chơi không chấm đúng sai quan điểm.', [
  'Chiếc bàn học làm mình nhớ hiện tại. Một việc nhỏ như giúp bạn, chăm sóc không gian chung hay tìm hiểu lịch sử cũng có thể là điều mình mang về.',
  'Mình có thể viết vài chữ, hoặc chỉ yên lặng suy nghĩ. Cánh cửa không đòi chấm điểm cảm xúc của mình; mình tự chọn khi đã sẵn sàng bước tiếp.',
], [], 'Bàn học ở phía đông cánh cửa.');

export const puzzles = {
  'him-lam': {
    id: 'him-lam', chapterId: 'him-lam', type: 'sequence', title: 'Trình tự trận mở màn', instruction: 'Sắp bốn giai đoạn theo các manh mối đã ghi.', requiredClueIds: chapters['him-lam'].clueIds,
    stages: [{ id: 'position', label: 'Chuẩn bị trận địa' }, { id: 'artillery', label: 'Pháo binh khai hỏa chiều 13/3/1954' }, { id: 'infantry', label: 'Bộ binh tiến công' }, { id: 'victory', label: 'Làm chủ Him Lam — thắng lợi trận mở màn' }],
    hints: ['Bắt đầu bằng việc chuẩn bị, kết thúc bằng kết quả của trận mở màn.', 'Chuẩn bị trận địa → pháo binh → bộ binh → làm chủ Him Lam.'], answerSpec: { orderedStageIds: ['position', 'artillery', 'infantry', 'victory'] },
  },
  'campaign-map': {
    id: 'campaign-map', chapterId: 'campaign-map', type: 'campaign', title: 'Đọc bản đồ và thời gian', instruction: 'Đặt thẻ theo chú giải sơ đồ học tập, rồi xếp bốn mốc từ sớm đến muộn. Sơ đồ không theo tỷ lệ.', requiredClueIds: chapters['campaign-map'].clueIds,
    sites: [{ id: 'him-lam', label: 'Him Lam' }, { id: 'doc-lap', label: 'Độc Lập' }, { id: 'muong-thanh', label: 'Mường Thanh' }], positions: [{ id: 'north', label: 'Bắc' }, { id: 'north-east', label: 'Đông Bắc' }, { id: 'center', label: 'Trung tâm' }],
    events: [{ id: 'opening', label: '13/3/1954 — Mở màn' }, { id: 'second', label: '30/3/1954 — Đợt tiến công thứ hai' }, { id: 'third', label: '1/5/1954 — Đợt tiến công thứ ba' }, { id: 'victory', label: '7/5/1954 — Chiến thắng Điện Biên Phủ' }],
    hints: ['Chú giải cho biết vị trí; ngày tháng cho biết thứ tự. Hai phần cần cùng chính xác.', 'Độc Lập: Bắc; Him Lam: Đông Bắc; Mường Thanh: Trung tâm. Mốc: 13/3 → 30/3 → 1/5 → 7/5.'], answerSpec: { placements: { 'him-lam': 'north-east', 'doc-lap': 'north', 'muong-thanh': 'center' }, orderedEventIds: ['opening', 'second', 'third', 'victory'] },
  },
  'command-post': {
    id: 'command-post', chapterId: 'command-post', type: 'telegram', title: 'Ghép bản tin', instruction: 'Ghép ba mẩu câu được biên soạn cho trò chơi rồi chọn ngày sự kiện. Đây không phải nguyên văn điện báo lịch sử.', requiredClueIds: chapters['command-post'].clueIds,
    fragments: [{ id: 'advance', label: 'Quân ta tiến công,' }, { id: 'headquarters', label: 'tiến vào sở chỉ huy đối phương,' }, { id: 'capture', label: 'bắt Đờ Cát cùng bộ chỉ huy.' }], dateLabel: 'Ngày chiến thắng Điện Biên Phủ', dateOptions: [{ id: '1954-03-13', label: '13/3/1954' }, { id: '1954-03-30', label: '30/3/1954' }, { id: '1954-05-07', label: '7/5/1954' }],
    hints: ['Tìm phần mở đầu, nơi tiến vào rồi đến kết quả. Đối chiếu ngày trong bản tin cuối.', 'Tiến công → sở chỉ huy → bắt Đờ Cát cùng bộ chỉ huy. Ngày 7/5/1954.'], answerSpec: { orderedFragmentIds: ['advance', 'headquarters', 'capture'], date: '1954-05-07' },
  },
};
