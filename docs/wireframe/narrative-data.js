/* Minh's fictional reflections are separate from the historical summary used by the puzzle. */
(() => {
  const stages=[
    {id:'prepare',title:'Chuẩn bị trận địa',clue:'Bản ghi chuẩn bị',location:'Bàn hồ sơ · gian trên trái',
      direction:'Ngay gần điểm bắt đầu. Tới bàn có đèn vàng trong gian hồ sơ.',
      fact:'Chuẩn bị trận địa trước khi bước vào trận đánh Him Lam.',
      lines:['Mình nhận ra những nét bút trên bản ghi. Trước khi tiếng pháo vang lên, trận địa đã phải được chuẩn bị. Một trận đánh không bắt đầu từ khoảnh khắc xung phong.',
        'Mình sẽ giữ lại dấu vết này: chuẩn bị là bước mở đầu. Những mảnh giấy còn lại trong hầm có lẽ sẽ giúp mình nối tiếp câu chuyện.']},
    {id:'artillery',title:'Pháo binh mở màn chiều 13/3/1954',clue:'Điện lệnh pháo binh',location:'Điện đài · gian trên giữa',
      direction:'Từ hồ sơ đi xuống hành lang, sang phải, rồi lên lối vào điện đài ở giữa.',
      fact:'Chiều 13/3/1954, pháo binh mở màn trận đánh Him Lam.',
      lines:['Chiếc máy điện đài im lặng, nhưng mẩu tư liệu bên cạnh khiến mình hình dung được buổi chiều ngày 13 tháng 3 năm 1954. Pháo binh mở màn trận đánh.',
        'Vậy là sau bước chuẩn bị, tiếng pháo đánh dấu lúc trận đánh bắt đầu. Mình cần tìm xem bộ binh đã tiếp nối như thế nào.']},
    {id:'infantry',title:'Bộ binh xung phong',clue:'Sơ đồ xung phong',location:'Sơ đồ tiếp tế · hành lang phía đông',
      direction:'Đi sang phải dọc hành lang gỗ. Tìm tấm sơ đồ ở mép trên, gần kho tiếp tế.',
      fact:'Bộ binh xung phong sau hỏa lực pháo binh mở màn.',
      lines:['Mình dừng lại trước tấm sơ đồ. Sau hỏa lực mở màn là bước xung phong của bộ binh. Những ký hiệu trên giấy bỗng có thêm một lớp ý nghĩa.',
        'Mình không thể chỉ nhớ một tiếng pháo hay một cột mốc. Cần đặt bước xung phong vào đúng vị trí trong chuỗi sự kiện. Còn kết quả trận đánh nằm ở đâu?']},
    {id:'victory',title:'Làm chủ Him Lam, giành thắng lợi',clue:'Bản tin Him Lam',location:'Bản đồ · gian dưới trái',
      direction:'Quay về phía trái hành lang, đi xuống lối mở của gian bản đồ. Tìm tấm bản đồ lớn bên trái.',
      fact:'Sau trận đánh, quân ta làm chủ Him Lam, giành thắng lợi trận mở màn.',
      lines:['Mảnh bản tin ở đây nói về kết quả: quân ta làm chủ Him Lam, giành thắng lợi trận mở màn. Mình đã tìm được điểm cuối của chuỗi sự kiện này.',
        'Chuẩn bị, khai hỏa, xung phong, rồi làm chủ cứ điểm. Mình muốn tự tay xếp lại những bước ấy, để hiểu điều vừa đọc thay vì chỉ nhớ những từ rời rạc.']}
  ].map(stage=>Object.freeze({...stage,lines:Object.freeze(stage.lines)}));
  const intro=Object.freeze({id:'intro',clue:'Một căn hầm xa lạ',lines:Object.freeze([
    'Mình đang ở đâu…? Vừa rồi còn đứng trong bảo tàng, giờ trước mắt chỉ còn ánh đèn và những bức tường hầm. Trên bàn có một bản ghi mang tên Him Lam.',
    'Có bốn dấu vết đang chờ mình: bàn hồ sơ, điện đài, sơ đồ trong hành lang và bản tin ở gian bản đồ. Mình sẽ đọc từng mảnh, rồi ghép lại trình tự trận đánh để tìm đường đi tiếp.'
  ])});
  window.narrativeData=Object.freeze({stages:Object.freeze(stages),intro,
    source:Object.freeze({title:'Trận mở màn tiêu diệt trung tâm đề kháng Him Lam (13/3/1954) — Bảo tàng Lịch sử quốc gia',url:'https://baotanglichsu.vn/vi/Articles/2002/68138/ky-niem-60-nam-chien-thang-lich-su-djien-bien-phu-1954-2014tran-mo-man-tieu-diet-trung-tam-dje-khang-him-lam-13-3-1954.html'}),
    disclaimer:'Lời kể của Minh là sáng tác cho trò chơi; không phải lời chứng hay trích dẫn lịch sử.'});
})();
