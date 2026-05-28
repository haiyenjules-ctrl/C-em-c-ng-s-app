import { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // Cổ vai gáy (Neck & Shoulder)
  {
    id: 'neck_01',
    name: 'Nâng Cằm Ngắm Sếp',
    description: 'Động tác kéo giãn cơ cổ trước, giúp giải phóng áp lực tích tụ sau vài tiếng cúi gầm mặt vô màn hình để "đọc sớ".',
    area: 'Cổ vai gáy',
    duration: 30,
    instructions: [
      'Ngồi thẳng lưng trên ghế ăn phòng, hai tay đặt nhẹ lên đùi.',
      'Hít vào sâu, nhẹ nhàng nâng cằm hướng lên trần nhà.',
      'Giữ nguyên tư thế trong 5 nhịp thở sâu, cảm nhận phần cổ trước được kéo giãn căng căng.',
      'Thở ra, từ từ đưa đầu về vị trí ban đầu. Hãy nhớ đừng nâng cằm quá đà kẻo sếp tưởng đang lườm nha!'
    ],
    commonMistakes: [
      'Ngửa đầu ra sau quá mạnh gây ép cột sống cổ.',
      'Gồng cứng bả vai thay vì thả lỏng sảng khoái.'
    ],
    contraindications: [
      'Thoái hóa đốt sống cổ nặng hoặc đang bị thoát vị đĩa đệm cổ cấp tính.'
    ],
    locationStyle: 'Desk',
    type: 'stretch',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'neck_02',
    name: 'Nghiêng Đầu Làm Nũng',
    description: 'Kéo giãn cơ cổ hai bên, giảm ngay tình trạng rụt cổ rụt vai mỗi khi nghe tiếng chuông Teams reo.',
    area: 'Cổ vai gáy',
    duration: 40,
    instructions: [
      'Ngồi thẳng ngồi vững, tay phải vòng qua đỉnh đầu chạm vào tai bên trái.',
      'Nhẹ nhàng kéo đầu nghiêng sang vai phải, cố gắng giữ vai trái thả lỏng tối đa.',
      'Hít thở điềm tĩnh trong 20 giây rồi đổi bên.',
      'Gương mặt hãy thật đáng thương như lúc đang xin deal lương mới.'
    ],
    commonMistakes: [
      'Co rúm vai bên kia lên theo đầu.',
      'Ấn quá mạnh khiến cổ kêu rắc rắc làm đồng nghiệp giật mình.'
    ],
    contraindications: [
      'Đại chấn thương cổ chưa lành hoàn toàn.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'neck_03',
    name: 'Khởi Động Xoay Cổ "Lươn Lẹo"',
    description: 'Massage chuyển động tròn phục hồi sự linh hoạt cho khớp cổ, giúp bẻ lái dư luận mượt mà.',
    area: 'Cổ vai gáy',
    duration: 45,
    instructions: [
      'Thả lỏng hai vai, nhẹ nhàng cúi đầu để cằm chạm ngực.',
      'Xoay đầu chầm chậm theo chiều kim đồng hồ 5 vòng và ngược lại 5 vòng.',
      'Vừa xoay vừa hít thở đều đặn và xóa sạch ký ức về chiếc email hối deadline ban nãy.'
    ],
    commonMistakes: [
      'Xoay giật cục hoặc với tốc độ quá nhanh như đang đi quẩy.',
      'Nín thở trong lúc xoay.'
    ],
    contraindications: [
      'Cảm giác chóng mặt, hoa mắt hoặc rối loạn tiền đình cấp.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'neck_04',
    name: 'Gác Kiếm Mở Ngực',
    description: 'Động tác kéo dãn bả vai và lồng ngực giúp tái tạo oxy, xóa bỏ dáng đi gù lưng tôm.',
    area: 'Cổ vai gáy',
    duration: 30,
    instructions: [
      'Hai tay đan vào nhau đặt sau gáy tầm đầu.',
      'Mở rộng hai khuỷu tay sang hai bên, ưỡn ngực về phía trước và hướng mắt lên.',
      'Giữ 15-20 giây và cảm nhận bả vai sau đang ép chặt vào nhau cực đã.'
    ],
    commonMistakes: [
      'Ấn tay ghì mạnh vào đầu làm cúi cổ về phía trước.',
      'Còng lưng dưới thay vì mở lồng ngực.'
    ],
    contraindications: [
      'Đau khớp vai cấp tính.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'neck_05',
    name: 'Mát-xa Gáy "Cô Em" Yêu Chiều',
    description: 'Chà xát cơ gáy nóng lên, đánh tan máu bầm tích tụ khiến đầu óc u mê tăm tối.',
    area: 'Cổ vai gáy',
    duration: 60,
    instructions: [
      'Dùng hai bàn tay ôm sau gáy, luồn các ngón tay vào sát chân tóc.',
      'Dùng ngón cái và các ngón còn lại bóp nhẹ dọc theo hai bên cột sống cổ từ trên xuống vai.',
      'Dùng lòng bàn tay chà xát qua lại cho vùng da gáy ấm sực lên nóng hổi.'
    ],
    commonMistakes: [
      'Gạt mạnh móng tay vào da gây trầy xước đau rát.',
      'Ngồi vẹo cổ trong lúc mát-xa.'
    ],
    contraindications: [
      'Có vết mụn nhọt, vết thương hở hoặc viêm nhiễm vùng da cổ.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },

  // Cổ tay (Wrists & Forearms)
  {
    id: 'wrist_01',
    name: 'Xoay Cổ Tay Đếm Tiền',
    description: 'Giải phóng áp lực lên ống cổ tay do nhấp chuột và gõ bàn phím điên cuồng suốt 8 tiếng bão táp.',
    area: 'Cổ tay',
    duration: 30,
    instructions: [
      'Hai bàn tay nắm hờ, đưa thẳng về phía trước.',
      'Xoay cổ tay từ trong ra ngoài 10 lần và từ ngoài vào trong 10 lần.',
      'Hãy tưởng tượng bạn đang kiểm đếm xấp tiền bonus siêu khủng cuối năm để tăng động lực.'
    ],
    commonMistakes: [
      'Cử động cả cùi chỏ và bả vai thay vì chỉ cô lập ở khớp cổ tay.',
      'Gồng ngón tay quá chặt.'
    ],
    contraindications: [
      'Hội chứng ống cổ tay viêm cấp tính có sưng đỏ.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'wrist_02',
    name: 'Bấm Trộm Bàn Phím Ngược',
    description: 'Kéo dãn các dải cơ cẳng tay trước, chặn đứng nguy cơ tê rần đầu ngón tay.',
    area: 'Cổ tay',
    duration: 40,
    instructions: [
      'Đưa tay phải thẳng về trước, lòng bàn tay hướng ra ngoài, ngón tay hướng xuống dưới.',
      'Dùng tay trái kéo nhẹ các ngón tay phải hướng về phía người.',
      'Giữ 20 giây rồi đổi sang kéo dãn tay trái.',
      'Tư thế này trông giống như đang từ chối một task việc vô lý vậy đó!'
    ],
    commonMistakes: [
      'Khủy tay bị cong gập làm giảm độ giãn cơ hiệu quả.',
      'Giật mạnh ngón tay cái gây chấn thương khớp bàn tay.'
    ],
    contraindications: [
      'Bong gân cổ tay chưa phục hồi.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'wrist_03',
    name: 'Múa Quạt Giải Nghiệp',
    description: 'Động tác vận động các dải gân liên ngón tay linh hoạt nhẹ nhàng giảm mệt mỏi khớp nhỏ.',
    area: 'Cổ tay',
    duration: 30,
    instructions: [
      'Xòe rộng hai bàn tay ra hết cỡ như cánh quạt giấy.',
      'Nắm chặt bàn tay thành nắm đấm rồi lại bung tỏa hết nấc mười ngón tay.',
      'Thực hiện liên tục nhịp nhàng để sạc năng lượng mỏ neo.'
    ],
    commonMistakes: [
      'Làm quá chậm rề rà không có nhịp điệu sinh động.'
    ],
    contraindications: [
      'Có khớp ngón tay bị viêm đa khớp dạng thấp đang sưng.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'wrist_04',
    name: 'Mát-xa Mô Ngón Cái Bạc Cắc',
    description: 'Nhấn huyệt sâu vùng cơ lòng bàn tay dưới ngón cái vốn đang mỏi nhừ vì ôm chuột lướt mạng.',
    area: 'Cổ tay',
    duration: 50,
    instructions: [
      'Dùng ngón cái tay trái ấn mạnh vào mô thịt gò lên sát ngón cái tay phải.',
      'Dùng lực xoay tròn nhẹ nhàng để xoa bóp, tìm vị trí buốt nhất rồi nhấn giữ 10 giây hít thở.',
      'Đổi tay làm tương tự để hai tay đều nhau.'
    ],
    commonMistakes: [
      'Bấm móng tay thẳng trực tiếp làm hằn đau thay vì phần thịt ngón tay dứt khoát.'
    ],
    contraindications: [
      'Gãy xương quay cốt bàn tay đang điều trị.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },
  {
    id: 'wrist_05',
    name: 'Kéo Giãn Sóng Lưng Mu bàn tay',
    description: 'Kéo căng mặt sau cổ tay và gân duỗi ngón tay mượt mà.',
    area: 'Cổ tay',
    duration: 30,
    instructions: [
      'Đưa bàn tay phải ra trước, gập cổ tay xuống sao cho mu bàn tay quay về phía trước.',
      'Dùng tay trái áp nhẹ lên mu bàn tay phải ép dãn nhẹ nhàng cơ duỗi cẳng tay.',
      'Thực hiện hít thở chậm rãi giữ 15 giây rồi đổi sang bên đối diện.'
    ],
    commonMistakes: [
      'Ấn đè thô bạo dồn nén sụn cổ tay quá dốc.'
    ],
    contraindications: [
      'Đau gai xương khớp cổ tay.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },

  // Lưng trên (Upper Back)
  {
    id: 'up_back_01',
    name: 'Cánh Chim Deadline Gọi Hè',
    description: 'Mở rộng bả vai giải phóng mỏi khớp bả vai xương sườn sau thời gian dài gù người.',
    area: 'Lưng trên',
    duration: 40,
    instructions: [
      'Ngồi mép ghế thẳng, đặt hai tay lên hai vai tạo hình cánh chim.',
      'Vẽ vòng tròn thật lớn bằng hai cùi chỏ của bạn, di chuyển từ trước ra sau ép bả vai ép lòng ngực.',
      'Hít vào khi mở cùi chỏ lên cao, thở ra khi hạ cùi chỏ xuống ấm áp.'
    ],
    commonMistakes: [
      'Xoay nửa vời vòng tròn quá bé khiến bả vai chưa siết khít bả vai sau.',
      'Cổ gập về phía trước tì đè.'
    ],
    contraindications: [
      'Chấn thương khớp cùng vai đòn vừa phẫu thuật.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'up_back_02',
    name: 'Ôm Ghế Giãn Cánh Cung',
    description: 'Co cụp lưng trên nâng tầm giãn tối đa cho cơ thoi bả vai mỏi khớp mạn sườn cực phê.',
    area: 'Lưng trên',
    duration: 45,
    instructions: [
      'Duỗi thẳng hai tay về trước song song, đan chặt mười ngón tay lộn ngược lòng bàn tay ra ngoài.',
      'Gập cổ cúi đầu xuống măt hướng về bụng đồng thời đẩy căng cánh tay về phía trước, cong lưng trên hết cỡ giống như cánh cung kéo căng.',
      'Cảm giác toàn bộ cơ giữa hai bả vai sau dãn ra căng đét phấn khởi.',
      'Giữ yên hít thở sâu 20 giây.'
    ],
    commonMistakes: [
      'Lưng duỗi thẳng tắp không chịu cong tròn để lôi dãn cơ sau.'
    ],
    contraindications: [
      'Đột quỵ cổ hoặc thoát vị thắt lưng nặng cấp tính.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'up_back_03',
    name: 'Vặn Mình Kiểu Rồng Cuộn Đất',
    description: 'Vặn gập lườn ngực bả vai giải phóng sự ách tắc luân chuyển khí huyết vùng ngực lưng.',
    area: 'Lưng trên',
    duration: 50,
    instructions: [
      'Ngồi nghiêng hướng sang bên phải ghế của bạn.',
      'Hai tay bám chặt vào thành lưng ghế, hóp bụng nhẹ dùng lực tay hỗ trợ xoay vặn thân trên tối đa ra phía sau.',
      'Mắt nhìn qua vai phải, giữ thăng bằng căng khung xương giữ hít thở đều hoan hỉ.',
      'Từ từ đổi sang xoay bên trái.'
    ],
    commonMistakes: [
      'Vẹo hông trượt khỏi đệm ghế mất định hình tư thế thăng bằng xương chậu.'
    ],
    contraindications: [
      'Lao cột sống hoặc chấn thương cột sống lách lưng chưa hồi phục.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'up_back_04',
    name: 'Kéo Bả Vai Giật Nước',
    description: 'Động tác kích hoạt cơ lưng trên giúp săn chắc bả vai bớt sệ mỡ thừa đau khớp dính bả vai.',
    area: 'Lưng trên',
    duration: 35,
    instructions: [
      'Hai tay đưa thẳng đứng lên trần nhà hít sâu.',
      'Gập khuỷu tay kéo mạnh tay xuống hai bên sườn đồng thời giật bả vai ép chặt hết ga hệt như đang đu xà kéo xô.',
      'Thở ra mạnh bằng miệng đẩy tiêu cực bay đi tắp lự.'
    ],
    commonMistakes: [
      'Chỉ di chuyển cánh tay hời hợt, bả vai không ép dính mủi lòng.'
    ],
    contraindications: [
      'Khớp vai bị trật hoặc sái khớp chưa lành.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'up_back_05',
    name: 'Mát-xa Cơ Ngực Giải Tỏa Lưng',
    description: 'Thư giãn nhóm cơ ngực lớn ngực nhỏ vốn bị co rút kéo gù bả vai sau ra trước.',
    area: 'Lưng trên',
    duration: 60,
    instructions: [
      'Dùng tay trái nắm lấy cụm cơ nách ngực phía trước bên phải.',
      'Bóp nhào đều đặn ấn xoay luồng mỏi cơ ngực sát bả vai.',
      'Xoa bóp thư giãn sâu giữ nhịp thở đổi bên nhẹ nhõm.'
    ],
    commonMistakes: [
      'Ấn sượng sùng dập xương đòn đau rát.'
    ],
    contraindications: [
      'Mổ tuyến vú, mới xạ trị ngực sưng.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },

  // Thắt lưng (Lower Back)
  {
    id: 'low_back_01',
    name: 'Cúi Đầu Phục Tùng Hết Việc',
    description: 'Động tác cúi sâu đẩy lùi ách tắc mạch ở đệm thắt lưng do áp lực cơ thể ngồi đè nén suốt ngày dài.',
    area: 'Thắt lưng',
    duration: 40,
    instructions: [
      'Ngồi vững vàng trên ghế tựa, mở hai đầu gối rộng hơn vai một chút.',
      'Từ từ trượt hai bàn tay dọc chân xuống sàn, cúi rạp thân trên xuống lọt lòng giữa hai đùi.',
      'Thả lỏng toàn bộ cánh tay đầu cổ thắt lưng rủ xuống tự do như chú rối nước quên dây.',
      'Tập trung cảm nhận thắt lưng căng giãn mềm mại, giữ 30 giây.'
    ],
    commonMistakes: [
      'Cố gồng cổ kéo mặt lên dòm xung quanh thay vì buông rủ đầu hoàn toàn thả lỏng.',
      'Bật người dậy đột ngột khiến máu không kịp lên não dễ chóng mặt sảng.'
    ],
    contraindications: [
      'Huyết áp cao chưa kiểm soát ổn định hoặc đau cột sống thắt lưng cấp nhói buốt không chịu nổi.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'low_back_02',
    name: 'Cầu Vồng Lắc Hông Bản Sắc',
    description: 'Kéo dãn mạn sườn sột soạt sảng khoái kích hoạt dịch khớp hông lưng phục hồi năng lượng tươi tắn.',
    area: 'Thắt lưng',
    duration: 30,
    instructions: [
      'Một tay đặt vững tựa hông phải, tay trái vươn thẳng áp sát tai.',
      'Nghiêng lườn hết cỡ về phía bên phải kéo dãn trọn vẹn dải cơ liên sườn hông trái.',
      'Thu người về thực hiện đối xứng sang lườn bên kia hân hoan.'
    ],
    commonMistakes: [
      'Úp ngực hướng xuống đất làm sai lệch tư thế nghiêng lườn sườn hông.'
    ],
    contraindications: [
      'Chấn thương liên sườn trầy nứt xương sườn chưa phục hồi.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'low_back_03',
    name: 'Rắn Hổ Mang Đứt Deadline',
    description: 'Bẻ ngửa giải phóng vùng thắt lưng mệt mỏi tại bàn làm việc hiệu quả bất ngờ.',
    area: 'Thắt lưng',
    duration: 40,
    instructions: [
      'Đứng dậy đặt hai lòng bàn tay chắc chắn lên mép bàn làm việc hoặc sau vùng hông chậu.',
      'Đẩy hông nhẹ nhàng về phía trước hơi ưỡn căng bụng bả vai hướng ngửa mặt dốc nhẹ lên.',
      'Giữ dãn căng thắt lưng 15 giây hồi phục dẻo dai rồi nhẹ nhàng trả về tư thế đứng.'
    ],
    commonMistakes: [
      'Bẻ ngửa thắt lưng quá gắt gao đột quỵ tư thế gãy gập ép cột sống sau tồi tệ.'
    ],
    contraindications: [
      'Hẹp ống sống cổ thắt lưng tiến triển đau dội khi ngửa bụng.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'low_back_04',
    name: 'Vỗ Đập Thắt Lưng Vui Nhộn',
    description: 'Kiểu gõ vỗ năng lượng giải bài thắt lưng kích hoạt lưu thông thận khí chống nhức buốt mông đùi.',
    area: 'Thắt lưng',
    duration: 45,
    instructions: [
      'Khép hờ hai bàn tay nắm thành nắm đấm xốp đầy rào khí.',
      'Dùng mặt khớp ngón tay vỗ lốp đốp nhịp nhàng đều tay khắp dải cơ thắt lưng và vùng mông dưới.',
      'Hít thở thông thong vỗ lốp đốp 45 giây nghe âm thanh vui tai phấn khởi sướng quắn méo.'
    ],
    commonMistakes: [
      'Đấm đập quá mạnh vào vùng cột sống trực diện hoặc xương sườn cụt gây ê đau ẩm.'
    ],
    contraindications: [
      'Sỏi thận sưng viêm nặng mủ đau nhức dội từ bên trong.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },
  {
    id: 'low_back_05',
    name: 'Ép Đùi Con Rùa Nghiêng Cánh',
    description: 'Giãn cơ mông sâu liên kết khớp hông làm thuyên giảm nhức ê buốt thần kinh tọa đè tụ xót xa.',
    area: 'Thắt lưng',
    duration: 50,
    instructions: [
      'Ngồi vắt chéo chân phải sang gác mắt cá chân lên đầu gối chân trái tạo hình số 4.',
      'Tay đặt nâng đùi mông rồi chầm chậm cúi gập thân người phẳng thẳng dốc người xuống ngực hướng ôm chân.',
      'Giữ 20 giây dãn lôi tót cơ mông dính chặt ê lưng dưới rồi thong thả đổi chân.'
    ],
    commonMistakes: [
      'Gù rụt vai rụt cổ rụt người khom khớp sống thay vì rướn dài cột sống dốc thẳng.'
    ],
    contraindications: [
      'Mới phẫu thuật thay khớp háng hoặc đau gối dữ dội.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },

  // Mắt (Eyes)
  {
    id: 'eye_01',
    name: 'Úp Lòng Bàn Tay Nhập Định',
    description: 'Kỹ thuật sưởi ấm bóng tối sâu thư giãn tuyệt đối cho bọc cơ nhãn cầu suy nhược mệt lả.',
    area: 'Mắt',
    duration: 50,
    instructions: [
      'Chà xát thật nhanh dứt khoát hai lòng bàn tay vào nhau cho đến khi cảm thấy ấm nóng sượng sực lôi cuốn.',
      'Nhắm hờ hai mắt nhắm tĩnh lại khum nhẹ tay úp bọc lên hai mắt không đè tì nhãn cầu.',
      'Để hơi ấm dịu lành của lòng sưởi thấu dần bóng tối 30 giây thả phanh u tối sảng khoái.'
    ],
    commonMistakes: [
      'Lòng bàn tay đè chặt tì dí thẳng vào cầu mắt nhức mắt sau khi dỡ tay.'
    ],
    contraindications: [
      'Mới giải phẫu rách giác mạc bong võng mạc nặng nề cấp cứu.'
    ],
    locationStyle: 'Desk',
    type: 'eye'
  },
  {
    id: 'eye_02',
    name: 'Đảo Mắt Vạn Hoa Thần Sầu',
    description: 'Vận động thể dục cho 6 đại nhóm cơ vận nhãn khơi thông bóng loáng tầm nhìn cận ảnh.',
    area: 'Mắt',
    duration: 40,
    instructions: [
      'Giữ cố định đầu nghiêm túc không lia quay bạ bừa.',
      'Liếc mắt nhìn kịch sang phải rồi xoáy liếc lên trần bên trái dốc xuống đất đảo vòng tròn biên độ tối đa vươn căng.',
      'Thực hiện xoáy đảo chiều ngược xuôi kĩ lưỡng 5 lần ấm áp thông thoáng nhẹ nhàng.'
    ],
    commonMistakes: [
      'Đầu gật gù ngoáy quay theo mắt khiến cơ mắt lười nhác chưa được bắt dãn tập luyện.'
    ],
    contraindications: [
      'Tăng nhãn áp dột đột ngột huyết áp mỏi sùi chóng mặt dã sụp.'
    ],
    locationStyle: 'Desk',
    type: 'eye'
  },
  {
    id: 'eye_03',
    name: 'Lia Tiêu Cự Đông Tây Nam Bắc',
    description: 'Giúp cơ điều tiết mống mắt khôi phục khả năng co bóp nhịp nhàng bớt khô dại lờ đờ rướm lệ.',
    area: 'Mắt',
    duration: 35,
    instructions: [
      'Đưa ngón cái tay phải ra trước mắt cách khoảng 20cm làm điểm mốc dòm rõ vân ngón tay.',
      'Tập trung nhìn đắm đuối ngón tay rồi lia mắt dòm tít ra khung cửa sổ nhìn cây cối cách 10m lơ đãng hoang dại.',
      'Chớp chớp lia nhịp nhàng xa rồi lại gần, lặp đi lặp lại 10 nhịp phục thù tinh ranh.'
    ],
    commonMistakes: [
      'Không chịu chớp mắt làm khô khát màng giác mạc nhầy chảy nước mắt mệt bơ phờ.'
    ],
    contraindications: [
      'Đang dán kính sát tròng rách rát vi vu dơ bẩn.'
    ],
    locationStyle: 'Desk',
    type: 'eye'
  },
  {
    id: 'eye_04',
    name: 'Mát-xa Cung Mày Bay Deadline',
    description: 'Nhấn day các điểm mỏi huyệt quanh bờ mắt dập tắt nghẹt khí bốc đầu nhói rộc.',
    area: 'Mắt',
    duration: 45,
    instructions: [
      'Dùng ngón tay cái trỏ bấu nhẹ dọc xương cung mày sát dưới mày ấn miết nương theo xương chấn từ gốc mũi ra đuôi mắt.',
      'Dùng lực nhấn ôm vừa đủ tạo sự tê nhói rưng rưng sung sướng tột độ tê mê.',
      'Hít thở rảnh rang nhấn sâu giải tỏa u sầu mỏi mệt bão táp.'
    ],
    commonMistakes: [
      'Ấn chệch tay xém chọc đâm trực diện mắt đau thấu tim.'
    ],
    contraindications: [
      'Vùng mí mắt sưng tấy viêm túi mắt chắp lẹo mủ đau.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },
  {
    id: 'eye_05',
    name: 'Hắc Ma Chớp Mắt Chớp Nhoáng',
    description: 'Động tác chớp mắt ép chảy dịch nhầy bôi trơn giác mạc tự nhiên tự rửa sạch bụi mạt phòng mốc.',
    area: 'Mắt',
    duration: 30,
    instructions: [
      'Nhắm hờ mắt rồi đột ngột khép trợn chớp nhanh sồn sột 20 lần như bướm vỗ cánh.',
      'Cảm giác lỏng ướt sướng rực màng mắt dễ chịu nhãn quan.',
      'Sau đó nhắm tịt mắt nén chặt khít 5 giây bung ra xả láng.'
    ],
    commonMistakes: [
      'Nheo nheo chớp méo lệch mỏi da mặt gồng cơ hàm bậy bạ.'
    ],
    contraindications: [
      'Loét màng bồ đào nhạy đau rát sưng đỏ rực viêm quặm mắt.'
    ],
    locationStyle: 'Desk',
    type: 'eye'
  },

  // Đầu / Thái Dương (Head & Temple / Massage)
  {
    id: 'head_01',
    name: 'Thông Lộ Thái Dương "Cô Em" Chuyên Sâu',
    description: 'Xoa day gỡ nút co thắt cơ thái dương làm xẹp cơn đau đầu căng thẳng do suy nghĩ kế hoạch đè bẹp đầu óc.',
    area: 'Đầu',
    duration: 60,
    instructions: [
      'Dùng ba đầu ngón tay giữa áp nhẹ lên vùng hõm nhẹ mạn đuôi mắt bờ tai - huyệt Thái Dương.',
      'Nhấn day tròn xuôi 10 vòng chậm rãi dốc sâu lực vừa vặn rưng buốt dịu dấn.',
      'Day ngược chiều nhẹ nhàng sảng khoái và khẽ mỉm cười xoa hết bực tức task hụt.'
    ],
    commonMistakes: [
      'Day quá chệch sát quá tròng tai gây ù hoặc móng tay rào trầy xước sứt sẹo.'
    ],
    contraindications: [
      'Đại chấn thương sọ não vừa trải qua phẫu thuật còn dột vá.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },
  {
    id: 'head_02',
    name: 'Khua Cơ Hàm Xối Deadlock',
    description: 'Nới lỏng dải cơ cắn mỏi hàm bả nhai do thói quen nghiến cắn răng nén giận khép kín bấy lâu.',
    area: 'Đầu',
    duration: 45,
    instructions: [
      'Há hờ miệng tạo chữ O nhỏ thư giãn cơ hàm xệ xuống.',
      'Dùng khớp ngón trỏ giữa áp xoa nhào phần cơ má bọc góc xương hàm dưới rà tót cơ cắn buốt dại.',
      'Nhấn xoay buông mém thong thả há hàm thở lỏng tống tọng cục tức sếp sướng mê.'
    ],
    commonMistakes: [
      'Há họng quá rộng bẻ qoai khớp quai hàm trật khớp quai đau buốt tai ác liệt.'
    ],
    contraindications: [
      'Viêm đa khớp thái dương hàm buốt rát không há nổi miệng mồm.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },
  {
    id: 'head_03',
    name: 'Chải Đầu Lưu Thông Bách Hội',
    description: 'Vỗ chải đánh thức hàng vạn dây thần kinh trung ương da đầu kích não bung tỏa ý tưởng sáng kiến xịn.',
    area: 'Đầu',
    duration: 50,
    instructions: [
      'Khom 10 đầu ngón tay tạo thành chiếc lược cào bám chân gáy.',
      'Chải vuốt sần sật bấu nhẹ cào từ sát chân tóc đỉnh trán rướn mượt ra sau xương gáy gót chân cổ.',
      'Vừa cào vừa bấu kích thích lưu thông sảng khoái mê ly tột cùng.'
    ],
    commonMistakes: [
      'Bứt rách kéo dật tóc rụng thảm thương đau quặn da đầu.'
    ],
    contraindications: [
      'Da đầu gàu lở loét loét chàm vẩy nến xót ngứa sưng rực.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },
  {
    id: 'head_04',
    name: 'Hít Thở Bong Bóng Trút Điềm Ủ',
    description: 'Hít thở hộp tống khứ khí CO2 tù đọng, tẩm bổ oxy gấp 3 tiếp đạn cho nơ-ron tỉnh táo rần rần.',
    area: 'Đầu',
    duration: 40,
    instructions: [
      'Ngồi thẳng hóp nhẹ rốn hít vào bằng mũi phình bụng căng căng giữ 4 giây lôi.',
      'Thở nén chu môi hé thổi hơi từ từ cạn bụng 6 giây dốc tận dột.',
      'Nhắm hờ mắt thả trút toàn tâm bực dọc u ám rỗng tuếch hoan lạc.'
    ],
    commonMistakes: [
      'Hít thở nông ở vùng ngực gồng ép vai nhấp nhô mệt phù phượt.'
    ],
    contraindications: [
      'Tràn dịch màng phổi viêm phổi rát buốt không nén thở được.'
    ],
    locationStyle: 'Desk',
    type: 'breathing'
  },
  {
    id: 'head_05',
    name: 'Vỗ Mặt "Tỉnh Táo Lập Bập"',
    description: 'Tận hưởng kỹ thuật vỗ thức tỉnh cơ mặt bừng sức sống lấy lại da dẻ rực hồng sau giấc ngủ gật trưa.',
    area: 'Đầu',
    duration: 35,
    instructions: [
      'Xòe nhẹ hai bàn tay chụm khum nhẹ rào.',
      'Gõ vỗ lạch bạch dịu dàng đều đặn khắp hai má trán cằm mắt mũi lướt sượt sướng mên.',
      'Hào sảng vỗ dậy dậy cho máu dồn rực hồng tươi tỉnh xinh xắn vô cùng ngọt ngào.'
    ],
    commonMistakes: [
      'Đập tát bạt tai tự sỉ nhục bạo lực sưng đỏ vẹo mũi dột sưng.'
    ],
    contraindications: [
      'Vừa bơm filler căng chỉ mí lột da hóa học bong rát ê buốt mụn bọc sưng đầu mụn.'
    ],
    locationStyle: 'Desk',
    type: 'massage'
  },
  {
    id: 'add_01',
    name: 'Gật Đầu Cứu Cổ 1 Phút',
    description: 'Bài khởi động khớp cổ cực kỳ kín đáo, gật gù như đang vô cùng tâm đắc với bài phát biểu của sếp lớn.',
    area: 'Cổ vai gáy',
    duration: 60,
    instructions: [
      'Ngồi thẳng lưng trên ghế làm việc, hai vai thả lỏng tối đa như vừa được duyệt tăng lương.',
      'Cúi đầu đưa cằm hướng về phía khe ngực, giữ yên 3 giây để kéo dãn toàn bộ dải gân gáy sau.',
      'Nhẹ nhàng ngẩng đầu về tư thế trung lập, sau đó lặp lại liên hoàn 8-10 lần.',
      'Nhớ làm chậm rãi khoan thai, đừng gật giật cục sấp ngửa kẻo sếp lại giao thêm 10 dự án vì tưởng bạn đang hăng hái nha!'
    ],
    commonMistakes: [
      'Cúi ép quá thô bạo khiến đốt sống cổ vặn vẹo đau buốt.',
      'Nín thở hoặc co rụt bả vai trong suốt quá trình tập.'
    ],
    contraindications: [
      'Có triệu chứng đau nhói buốt cấp tính hoặc rách bao xơ thắt cổ.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_02',
    name: 'Nhìn Nách Tìm Bình Yên',
    description: 'Kéo dãn cơ nâng vai và vùng liên sườn mạn gáy mệt nhọc, giúp giải phóng cơn bí bách của dân gõ phím chuyên nghiệp.',
    area: 'Cổ vai gáy',
    duration: 90,
    instructions: [
      'Xoay đầu 45 độ hướng sang bên phải, cúi nhẹ đưa tầm mắt rà đúng nách phải.',
      'Đặt tay phải lên đỉnh đầu sau, từ từ nhấn ghì nhẹ đầu xuống sâu hơn để tăng sức dãn căng.',
      'Vai trái thả trôi tự nhiên hoàn toàn thả lỏng, giữ yên tư thế thở sâu 20 giây rồi đổi bên.'
    ],
    commonMistakes: [
      'Co rúm bả vai đối diện lên rụt rịt làm sai lệch trục dãn.',
      'Ghì kéo vẹo dốc mạnh đầu làm mỏi cơ đột ngột.'
    ],
    contraindications: [
      'Triệu chứng đau vai cấp tính rát đỏ cơ bắp.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'add_03',
    name: 'Cằm Lùi Về Quê Hương',
    description: 'Khắc chế ngay dáng đứng "cổ rùa" sấp ngửa vươn về màn hình ngóng hóng drama của dân văn phòng.',
    area: 'Cổ vai gáy',
    duration: 60,
    instructions: [
      'Ngồi thẳng vững, mắt hướng nhìn thẳng tắp về phía trước, vai mở tự tin.',
      'Dùng ngón tay trỏ rà nhẹ lên cằm, kéo thụt khít cằm lùi thẳng ra sau tạo thành dáng "hai cằm" mỡ màng siêu quyến rũ.',
      'Giữ chặt tư thế rụt cổ quyến rũ này trong 3 giây rồi nhả ra. Thực hiện 8-10 nhịp phục thù dáng tôm.'
    ],
    commonMistakes: [
      'Cố gập đầu cúi xuống đất làm mất hiệu năng dãn cơ sâu.',
      'Nhún vai co ro rụt gáy hân hoan.'
    ],
    contraindications: [
      'Chấn thương đĩa đệm cổ cấp chưa bình phục.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_04',
    name: 'Kẹp Bút Bi Siết Bả Vai',
    description: 'Chống mỏi nhừ vùng lưng trên và nắn thẳng khung lưng, tống tiễn dáng gù cổ tôm văn phòng vĩnh viễn.',
    area: 'Lưng trên',
    duration: 60,
    instructions: [
      'Ngồi thẳng tắp ở mép ghế, thả trôi lơ đãng hai tay dọc sườn.',
      'Ưỡn nhẹ lồng ngực gân guốc, kéo ép chặt hai bả vai sau dính chặt vào nhau như đang kẹp khít một chiếc bút bi vô giá không cho rơi.',
      'Duy trì kẹp bút 3-5 giây rồi buông dãn, lặp lại liên tục 10 lần đầm ấm.'
    ],
    commonMistakes: [
      'Ưỡn quá đà vùng thắt lưng dưới gây mỏi lệch cột sống.',
      'Gồng xiết cổ vai gáy thay vì siết bả vai giữa lưng.'
    ],
    contraindications: [
      'Chấn thương cơ trám lưng tổn hại nặng.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_05',
    name: 'Vặn Lườn Ghế Xoay Xả Tức',
    description: 'Massage dịu êm các đốt sống ngực lưng trên bằng động tác xoay vặn thân người nhẹ nhàng, dọn sạch mỏi mệt.',
    area: 'Lưng trên',
    duration: 90,
    instructions: [
      'Ngồi thẳng lưng, hai chân bám dính chắc chắn trên nền sàn nhà.',
      'Đặt tay phải bám chặt lấy đùi trái hoặc thành gác tay ghế, xoay vặn vai và ngực lách mạnh sang trái hết biên độ thở ra.',
      'Giữ ép lực chậm thong thả 20 giây rồi thực hiện chuyển vùng xoay sang đối diện.'
    ],
    commonMistakes: [
      'Xoay giật mình dột ngột sụn sườn đau rát.',
      'Nhấc mông bay hẳn khỏi ghế mất cân đối xương chậu.'
    ],
    contraindications: [
      'Vừa phẫu thuật can thiệp cột sống lưng chưa quá 6 tháng.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_06',
    name: 'Cong Lưng Tự Ôm Vỗ Về',
    description: 'Một khoảnh khắc sưởi ấm tâm hồn mệt mỏi, dãn căng nhóm cơ bả vai sau dính đầy ách tắc deadline.',
    area: 'Lưng trên',
    duration: 60,
    instructions: [
      'Ngồi thẳng, hít sâu nâng mở hai tay dang rộng đón gió.',
      'Thở ra chéo tay tự ôm chặt lấy hai bả vai sau của mình như đang dỗ dành bản thân "Mày làm tốt lắm rồi cưng ơi!".',
      'Cong tròn rạp phần lưng trên dốc đầu nhẹ về trước, hít thở sâu 5 nhịp căng dãn lôi dải lưng.'
    ],
    commonMistakes: [
      'Cong cúi ép bụng quá sâu gây mỏi gối mỏi thắt lưng dưới.'
    ],
    contraindications: [
      'Đột quỵ đau cột sống nặng nề khó kiểm soát.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'add_07',
    name: 'Cổ Tay Chào Sếp Thân Ái',
    description: 'Khởi động thăng tịnh cho các khớp ngón tay cổ tay dẻo quẹo sau hàng vạn dòng code và lướt báo cáo.',
    area: 'Cổ tay',
    duration: 60,
    instructions: [
      'Đưa thẳng mặt hai tay ra trước, nắm hờ nhẹ nhàng mười ngón tay.',
      'Xoay vòng tròn dẻo quẹo cổ tay từ ngoài vào trong 8 lần rồi đảo ngược xoay từ trong ra ngoài.',
      'Vờ như đang múa quạt giao duyên tỏ lòng tôn kính sếp sòng.'
    ],
    commonMistakes: [
      'Khua cả bả vai bả cánh tay múa sượng sùng thay vì tập trung khớp cổ tay.'
    ],
    contraindications: [
      'Gãy xương nứt cổ tay gân duỗi đang nẹp cứng.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_08',
    name: 'Duỗi Cổ Tay Cứu Bàn Chủ',
    description: 'Mượn mặt bàn cứu rỗi cẳng tay rã rời vì click chuột bấm phím điên cuồng.',
    area: 'Cổ tay',
    duration: 90,
    instructions: [
      'Áp chặt hai bàn tay xuống mặt bàn, lật ngược ngón tay chỉ thẳng về hướng cơ thể.',
      'Chầm chậm ngả nhẹ thân người lùi ra sau, cảm nhận dải cơ sườn cẳng tay trước kéo dãn căng đét sướng rơn.',
      'Giữ hơi thở đều thở thong thả 15-20 giây gỡ dính gân xô.'
    ],
    commonMistakes: [
      'Ép giật sượng sùng làm đau gân sụn ngón tay mỏng manh.'
    ],
    contraindications: [
      'Viêm bao khớp hoạt dịch ống cổ tay bưng sưng đỏ.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'add_09',
    name: 'Nắm Bóp Xòe Hoa Xả Tức',
    description: 'Động tác rèn luyện lực cơ bàn tay kẹp lò xo tống khứ năng lượng tiêu cực ù lì ứ đọng.',
    area: 'Cổ tay',
    duration: 45,
    instructions: [
      'Xòe bung mười ngón tay căng tràn dứt khoát như rặng hoa nở đón ban mai.',
      'Siết chặt mười ngón tay thành nắm đấm gan góc rắn rỏi dồn sức mười phân vẹn mười.',
      'Thực hiện liên khúc mở bung xòe xiết 20 lần nhanh dứt khoát cứu mỏi.'
    ],
    commonMistakes: [
      'Nắm xòe hời hợt nhẹ hều như đang gãi ngứa.'
    ],
    contraindications: [
      'Đau gai dính khớp bàn ngón tay buốt nóng.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_10',
    name: 'Bệ Tì Chống Gù Căng Ngực',
    description: 'Mượn chiếc bàn vững chắc nương chiều nâng đỡ tư thế lồng ngực, kéo giãn cơ liên sườn tuyệt đỉnh.',
    area: 'Lưng trên',
    duration: 90,
    instructions: [
      'Đứng thẳng thớm cách bàn nửa bước chân bệ vệ.',
      'Gác bám hai cẳng tay lên mép bàn, lùi hông thẳng ra sau rạp dốc ngực sâu hướng sàn.',
      'Giữ thẳng lưng dài, thả hổng vai sâu nén căng 20 giây thăng hoa.'
    ],
    commonMistakes: [
      'Khụy cong gối gù thụt rụt mông sượng sạo.'
    ],
    contraindications: [
      'Trật khớp vai cơ đầu cấp chưa nắn hồi.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'add_11',
    name: 'Đu Trụ Tường Đẩy Vai',
    description: 'Vượt ải bế tắc văn phòng nhờ bờ tường vững chãi, khơi thông khí huyết bờ vai khép nép.',
    area: 'Cổ vai gáy',
    duration: 90,
    instructions: [
      'Đứng sát bờ tường, đặt áp bàn tay phải và cùi chỏ phẳng lên mặt tường vừa ngang vai.',
      'Xoay nhẹ lườn và ngực lách dốc sang bên trái cảm nhận khớp ngực vai trước bên phải dãn căng bung tót.',
      'Thở chậm đếm nhẩm 20 nhịp rồi đảo thân đổi vai cứu vây.'
    ],
    commonMistakes: [
      'Tì ép vai tì mạnh dính sát đầu vào tường bầm đau.'
    ],
    contraindications: [
      'Tổn thương rách sụn chêm m khớp vai sau chưa lành.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'add_12',
    name: 'Wall Angel Mini Trượt Tường',
    description: 'Tận dụng bức tường làm thước đo căn chỉnh cột sống lưng, giải tỏa sượng dính lưng trên.',
    area: 'Lưng trên',
    duration: 90,
    instructions: [
      'Đứng áp trọn lưng xô hông và gót chân tựa sát phẳng vào bờ tường vững.',
      'Co hai cùi chỏ đưa tay gác áp sát tường hình chữ W quyến rũ.',
      'Từ từ trượt dang tay nâng lên hạ xuống dọc theo tường liên tục 8-10 lần đầy sang trọng.'
    ],
    commonMistakes: [
      'Ưỡn cong hổng hẳn thắt lưng ra ngoài tường rướn thở.'
    ],
    contraindications: [
      'Đau buốt bả vai không giơ cao tay được.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_13',
    name: 'Nhón Nhịp Bắp Chân Cạnh Bàn',
    description: 'Kích thích tuần hoàn van tĩnh mạch chân lưu thông ngược dòng, phá băng cơn buồn cứng khớp chân tê rần.',
    area: 'Thắt lưng',
    duration: 60,
    instructions: [
      'Đứng thẳng vịn nhẹ bám lấy góc bàn chống trượt chống vẹo dột.',
      'Nhấc bổng nhón hai gót chân lên cao hết cỡ giữ căng cơ bắp chân 2 giây rực cháy.',
      'Hạ chậm gót chạm sàn rồi lại nhón liên hồi 15 nhịp hào sảng sướng đùi.'
    ],
    commonMistakes: [
      'Bật nhún dập dồn thô bạo dồn nén sụn gót cổ chân thốn rát.'
    ],
    contraindications: [
      'Đứt gãy gân Achilles hoặc bong mắt cá chân sưng u.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_14',
    name: 'Duỗi Đùi Cứu Lưng Khẩn Cấp',
    description: 'Thắt lưng vạn cổ ê ẩm thường rễ nguồn từ cơ đùi sau co bóp dính chặt, làm giãn toàn dải xích thắt lưng.',
    area: 'Thắt lưng',
    duration: 90,
    instructions: [
      'Đứng thẳng đặt gót chân phải nhô lên thềm sàn phía trước, mũi chân móc ngược lên hướng trần.',
      'Gập nhẹ khớp hông dốc người thẳng lưng hướng ngực về mũi chân cho gân đùi sau căng dãn tót bời bời.',
      'Giữ dãn sâu thở thong thả 15 giây rồi thay dời chân.'
    ],
    commonMistakes: [
      'Còng gù rúm hốc lưng sườn trong lúc gập dốc.'
    ],
    contraindications: [
      'Thoát vị đĩa đệm thắt lưng bộc rễ thần kinh dội buốt đau sột xuống chân.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'add_15',
    name: 'Xoay Số 4 Ghế Khơi Hông',
    description: 'Mở khớp hông chậu kẹt khí bách tắc do mông ghim ghế suốt ngày mỏi sụm, thuyên giảm lập tức cơn nhức thần kinh tọa.',
    area: 'Thắt lưng',
    duration: 90,
    instructions: [
      'Ngồi thẳng ghế văn phòng đàng hoàng tôn nghiêm.',
      'Vắt chân phải gác đặt mắt cá lên đùi trái tạo thành hình số 4 cân đối tuyệt đỉnh.',
      'Rướn thẳng lưng chầm chậm gập rạp thân ngực phẳng dốc hướng đùi căng mở mông phải.',
      'Duy trì dãn căng 20 giây thở thong rồi đổi chân dứt khoát.'
    ],
    commonMistakes: [
      'Ấn ghì thô bạo bẻ đầu gối phải vẹo dốc gây sái khớp gối tội nghiệp.'
    ],
    contraindications: [
      'Mới thay khớp háng nhân tạo, đau khớp gối gân dính sưng tàn.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'add_16',
    name: 'Ứng Biến Squat Ghế Lập Bập',
    description: 'Động tác rực lửa kích hoạt cơ mông đùi đại lộ bơm máu đẩy lùi bóng ma trì trệ tê thắt thắt lưng dưới.',
    area: 'Thắt lưng',
    duration: 60,
    instructions: [
      'Đứng ngay ngắn trước ghế khoảng cách nửa gót chân.',
      'Hạ hông tấn đẩy mông ra sau rạp người nhẹ dốc xuống chạm mông mơn trớn sượt đệm ghế rồi dùng đùi siết đứng phắt dậy sảng khoái.',
      'Lặp lại liên khúc đứng ngồi có chủ đích này 8-10 lần.'
    ],
    commonMistakes: [
      'Vẹo đầu gối xoáy cụp vào trong gây tổn sụn khớp vai gối.'
    ],
    contraindications: [
      'Viêm thoái hóa khớp gối khô dịch kêu lạo xạo sưng đau.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_17',
    name: 'Tượng Đá Reset Cổ Gù',
    description: 'Nắn sửa tư thế trục đầu sọ cổ bằng điểm tựa tường, khôi phục chiều cao cột sống tôn quý.',
    area: 'Cổ vai gáy',
    duration: 60,
    instructions: [
      'Đứng dựa sát bép lưng và chẩm đầu áp dính phẳng tường.',
      'Kéo hóp cằm thụt nhẹ lùi sâu sát tịt tường dán chặt như tạo cằm bận sếp ngắm ngầm.',
      'Nén dính giữ thần thế tượng đá oai phong lẫm liệt 5 giây rồi nhả nhẹ, thực hiện 8 nhịp.'
    ],
    commonMistakes: [
      'Ngửa cổ dốc cằm lên trần hướng trợn mắt trông rất mất tính thiền.'
    ],
    contraindications: [
      'Thoái vị rễ thần kinh rách màng cổ tăng buốt rát cánh tay.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'add_18',
    name: 'Lắc Hông Gạt Nước Nệm Giường',
    description: 'Vận xả êm đềm giải tỏa hoàn toàn co thắt cơ lưng dưới trước khi chìm sâu vào giấc ngủ mộng mị.',
    area: 'Thắt lưng',
    duration: 120,
    instructions: [
      'Nằm ngửa khoan khoái gót co phẳng áp dính nệm giường.',
      'Lắc nhẹ thả nghiêng đung đưa hai đầu gối lọt sườn sang bên nọ rồi sang bên kia nhịp nhàng dịu dàng như cần gạt nước ô tô ngày mưa rơi.',
      'Hít thở thông thong thả lòng mạn hông sướng thắt thắt lưng xả stress.'
    ],
    commonMistakes: [
      'Lắc gập giật vẹo bóp hông quá gắt gây hụt hơi cứng hông.'
    ],
    contraindications: [
      'Mới vấp ngã chấn thương hông xương chậu gãy nứt.'
    ],
    locationStyle: 'Floor',
    type: 'mobility'
  },
  {
    id: 'add_19',
    name: 'Gác Chân Trút Bão Deadline',
    description: 'Kỹ thuật yoga dốc máu ngược phục hồi cho đôi chân thon thả bớt phù ú nước mệt bơ vì đeo giày cao gót lâu ngày.',
    area: 'Thắt lưng',
    duration: 180,
    instructions: [
      'Nằm sát ngửa hông mông hướng dính tựa mép đầu giường hoặc bờ tường.',
      'Gác dựng hai chân thẳng tắp tựa bệ tường tạo hình chữ L thăng hoa thăng tịnh.',
      'Nhắm hờ mắt úp tay rảnh rang thả lỏng thở hộp dồn tinh sương 3 phút sung sướng.'
    ],
    commonMistakes: [
      'Căng duỗi khóa chặt khớp gối run lập bập sượng sùng.'
    ],
    contraindications: [
      'Bệnh tim mạch hẹp van nặng hoặc tăng nhãn áp tròng dột.'
    ],
    locationStyle: 'Floor',
    type: 'stretch'
  },
  {
    id: 'add_20',
    name: 'Nghiêng Trần Nhặt Lương Về',
    description: 'Kéo căng dải liên sườn hông sườn cột sống đứng tại bàn làm việc xua tan rỉ sét dơ cứng mệt phờ.',
    area: 'Thắt lưng',
    duration: 90,
    instructions: [
      'Ngồi thẳng vươn tay dốc cao đỉnh tay phải rẽ trời xanh.',
      'Nghiêng lườn gập xiên sang bên trái cảm nhận dải sườn liên kết eo hông phải dãn dã man sướng tai.',
      'Giữ tĩnh hít thở sâu 15 giây rồi hạ dời tay đổi chiều nhặt lộc lá tấn tài.'
    ],
    commonMistakes: [
      'Úp cúi lật ngực gục hướng sàn dốc tư thế sai lệch.'
    ],
    contraindications: [
      'Viêm liên sườn buốt nhói sâu đau tăng khi hít dốc.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  },
  {
    id: 'neck_08',
    name: 'Rụt vai giải nghiệp',
    description: 'Tư thế thu cằm ép gáy sửa ngay quả dáng đầu nhô ra trước do dí sát mắt vào màn hình rình bug hay hối deadline.',
    area: 'Cổ vai gáy',
    duration: 30,
    instructions: [
      'Ngồi thẳng lưng chuẩn chỉnh, mắt nhìn thẳng về phía trước.',
      'Đặt nhẹ một ngón tay lên cằm để làm mốc định vị.',
      'Dùng cơ bắp sau cổ đẩy cằm thụt thẳng ra sau (tạo nọng cằm quyến rũ) mà không cúi đầu.',
      'Giữ tư thế tượng đài hiên ngang này trong 5 giây rồi thả lỏng đưa đầu về vị trí cũ.'
    ],
    commonMistakes: [
      'Cúi gập đầu xuống ngực làm sai lệch khớp trục cổ.',
      'Ngửa mặt lên trời trông mất vẻ oai vệ.'
    ],
    contraindications: [
      'Cột sống cổ đang chấn thương chưa lành.'
    ],
    locationStyle: 'Desk',
    type: 'mobility'
  },
  {
    id: 'upper_06',
    name: 'Cúi đầu lạy vạn task',
    description: 'Ưỡn ngực mở rộng bả vai giải phóng điểm tắc xoắn cơ bả vai do ôm bàn phím liên tùng tục.',
    area: 'Lưng trên',
    duration: 40,
    instructions: [
      'Đứng hoặc ngồi thẳng lưng, đưa hai tay ra sau lưng đan chặt các ngón tay lại.',
      'Hít sâu, ưỡn ngực căng tối đa về trước, từ từ kéo hai bả vai ép chặt vào nhau.',
      'Nâng nhẹ hai cánh tay ra xa khỏi mông cảm nhận vùng lưng trên căng giãn râm ran.',
      'Giữ tư thế 15-20 giây, thở ra thả lỏng mệt mỏi trôi tuột.'
    ],
    commonMistakes: [
      'Gù lưng dưới nhằm ăn gian biên độ nâng tay.',
      'Nín thở gồng cứng cổ.'
    ],
    contraindications: [
      'Viêm chấn thương sụn khớp vai cấp tính bộc phát.'
    ],
    locationStyle: 'Desk',
    type: 'stretch'
  }
];
