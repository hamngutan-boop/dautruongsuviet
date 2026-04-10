import { 
  Shield, Sword, Map as MapIcon, Crown, Book, Music, Heart, Coins, Zap, Gem, Package 
} from 'lucide-react';
import { Item } from './types';

export const RELATIONSHIPS = [
  { id: 'hau-the', label: 'Người hậu thế' },
  { id: 'ban-be', label: 'Bạn bè' },
  { id: 'gia-nhan', label: 'Gia nhân' },
  { id: 'co-nhan', label: 'Cố nhân' },
  { id: 'tri-ky', label: 'Tri kỷ' },
  { id: 'tuc-dich', label: 'Túc địch' },
  { id: 'ty-muoi', label: 'Tỷ muội' },
  { id: 'huynh-de', label: 'Huynh đệ' },
  { id: 'nghich-lan', label: 'Nghịch lân' },
];

export const RELATIONSHIP_QUESTIONS: Record<string, string[]> = {
  'Bạn bè': [
    "Hôm nay huynh/đệ/tỷ/muội có chuyện gì vui không?",
    "Chúng ta đi dạo phố phường xem dân tình thế nào nhé?",
    "Người có kỷ niệm nào đáng nhớ nhất với ta không?"
  ],
  'Gia nhân': [
    "Bẩm chủ nhân, người có điều gì sai bảo?",
    "Tiểu nhân đã chuẩn bị trà nước, mời người dùng.",
    "Chủ nhân, người có muốn nghe tin tức mới nhất từ kinh thành không?"
  ],
  'Cố nhân': [
    "Đã lâu không gặp, người vẫn khỏe chứ?",
    "Nhìn người, ta lại nhớ về những ngày xưa cũ...",
    "Vật đổi sao dời, lòng người liệu có còn như xưa?"
  ],
  'Tri kỷ': [
    "Chỉ có người mới hiểu được lòng ta...",
    "Ta đang có tâm sự, muốn cùng người đàm đạo.",
    "Nếu không có người, cuộc đời ta thật là cô độc."
  ],
  'Túc địch': [
    "Ngươi định dùng mưu kế gì để đối phó with ta đây?",
    "Thắng bại đã rõ, ngươi còn gì để nói không?",
    "Ta và ngươi, kiếp này định sẵn là không thể chung đường."
  ],
  'Tỷ muội': [
    "Tỷ tỷ/Muội muội, dạo này người có gì phiền muộn không?",
    "Chúng ta cùng thêu thùa và trò chuyện nhé?",
    "Người hãy giữ gìn sức khỏe, đừng quá lao tâm khổ tứ."
  ],
  'Huynh đệ': [
    "Huynh trưởng/Hiền đệ, chúng ta cùng uống chén rượu này chứ?",
    "Tình huynh đệ ta thề sẽ mãi bền lâu.",
    "Có chuyện gì khó khăn, cứ nói với đệ/huynh."
  ],
  'Nghịch lân': [
    "Trong lòng người, ta có vị trí như thế nào?",
    "Dù cả thế giới quay lưng, người vẫn sẽ bảo vệ ta chứ?",
    "Ta chính là 'nghịch lân' của người, đúng không?",
    "Người sẽ làm gì nếu có ai dám làm tổn thương ta?"
  ],
  'Người hậu thế': [
    "Người có lời khuyên nào cho thế hệ chúng ta không?",
    "Lịch sử sau này ghi chép về người như thế nào?",
    "Người mong muốn điều gì nhất cho đất nước tương lai?"
  ]
};

export const PET_DATA = [
  { id: 'pet_dragon', name: 'Thần Long Đại Việt', type: 'dragon', description: 'Rồng thần hộ mệnh, tăng 20% Lực Chiến.', buff: { type: 'combatPower', value: 0.2 }, price: 5000, currency: 'gold', petClass: 'combat', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_phoenix', name: 'Phượng Hoàng Lửa', type: 'phoenix', description: 'Phượng hoàng tái sinh, tăng 15% Kinh Nghiệm.', buff: { type: 'exp', value: 0.15 }, price: 3000, currency: 'gold', petClass: 'support', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_tiger', name: 'Hổ Quyền Sơn', type: 'tiger', description: 'Mãnh hổ rừng thiêng, tăng 10% Vàng nhận được.', buff: { type: 'gold', value: 0.1 }, price: 2000, currency: 'gold', petClass: 'combat', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_horse', name: 'Chiến Mã Sắt', type: 'horse', description: 'Ngựa sắt Thánh Gióng, giảm 10% thời gian trả lời.', buff: { type: 'time', value: 0.1 }, price: 1500, currency: 'gold', petClass: 'wise', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_turtle', name: 'Kim Quy Thần', type: 'turtle', description: 'Rùa vàng Hồ Gươm, bảo vệ bạn khỏi 1 câu sai.', buff: { type: 'combatPower', value: 0.05 }, price: 4000, currency: 'gold', petClass: 'wise', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_slime_green', name: 'Slime Lục Bảo', type: 'slime', description: 'Slime xanh lá cây, tăng 5% Vàng.', buff: { type: 'gold', value: 0.05 }, price: 500, currency: 'gold', petClass: 'support', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_slime_blue', name: 'Slime Hải Lam', type: 'slime', description: 'Slime xanh dương, tăng 5% Kinh Nghiệm.', buff: { type: 'exp', value: 0.05 }, price: 500, currency: 'gold', petClass: 'support', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_slime_red', name: 'Slime Hỏa Ngọc', type: 'slime', description: 'Slime đỏ rực, tăng 5% Lực Chiến.', buff: { type: 'combatPower', value: 0.05 }, price: 800, currency: 'gold', petClass: 'combat', evolution: 'normal', skinId: 'default', accessories: [] },
  { id: 'pet_slime_gold', name: 'Slime Hoàng Kim', type: 'slime', description: 'Slime vàng óng, tăng 10% Vàng và XP.', buff: { type: 'gold', value: 0.1 }, price: 1500, currency: 'gold', petClass: 'wise', evolution: 'normal', skinId: 'default', accessories: [] },
];

export const STORY_DATA = {
  intro: 'Bạn là một Sử Gia trẻ tuổi, vô tình tìm thấy "Thiên Thư" - cuốn sách có khả năng kết nối với linh hồn của các vị anh hùng dân tộc. Thế giới đang dần quên lãng lịch sử, và nhiệm vụ của bạn là du hành qua các thời đại để khôi phục lại ký ức hào hùng của dân tộc.',
  eras: [
    { 
      name: 'Cổ đại', 
      category: 'VN',
      description: 'Từ thời Tiền sử, Văn Lang - Âu Lạc đến hết thời kỳ Bắc thuộc (đầu thế kỷ X).' 
    },
    { 
      name: 'Trung đại', 
      category: 'VN',
      description: 'Thời kỳ phong kiến độc lập rực rỡ của các triều đại Đinh, Lê, Lý, Trần, Hậu Lê, Nguyễn.' 
    },
    { 
      name: 'Cận đại', 
      category: 'VN',
      description: 'Giai đoạn đấu tranh chống thực dân Pháp và sự chuyển biến xã hội (1858 - 1945).' 
    },
    { 
      name: 'Hiện đại', 
      category: 'VN',
      description: 'Từ Cách mạng tháng Tám 1945, kháng chiến chống Mỹ đến công cuộc đổi mới và phát triển.' 
    },
    // World Eras
    {
      name: 'Cổ đại',
      category: 'World',
      description: 'Từ thời Tiền sử đến các nền văn minh rực rỡ: Ai Cập, Lưỡng Hà, Hy Lạp, La Mã.'
    },
    {
      name: 'Trung đại',
      category: 'World',
      description: 'Thời kỳ phong kiến, sự trỗi dậy của các tôn giáo và phong trào Phục hưng (Thế kỷ V - XV).'
    },
    {
      name: 'Cận đại',
      category: 'World',
      description: 'Cách mạng công nghiệp, cách mạng tư sản và sự hình thành các quốc gia hiện đại.'
    },
    {
      name: 'Hiện đại',
      category: 'World',
      description: 'Từ hai cuộc đại chiến thế giới đến kỷ nguyên công nghệ số và hội nhập toàn cầu.'
    },
    // Century-based Eras (Combined)
    {
      name: 'Thế kỷ X - XI',
      category: 'Century',
      description: 'Thời kỳ hình thành các quốc gia độc lập ở Đông Nam Á và sự phát triển của phong kiến châu Âu.'
    },
    {
      name: 'Thế kỷ XII - XIII',
      category: 'Century',
      description: 'Đế chế Mông Cổ trỗi dậy, các cuộc thập tự chinh và sự hưng thịnh của nhà Lý, nhà Trần.'
    },
    {
      name: 'Thế kỷ XIV - XV',
      category: 'Century',
      description: 'Phong trào Phục hưng, các cuộc đại phát kiến địa lý và khởi nghĩa Lam Sơn.'
    },
    {
      name: 'Thế kỷ XVI - XVII',
      category: 'Century',
      description: 'Cải cách tôn giáo, Trịnh - Nguyễn phân tranh và sự mở rộng của các đế quốc thực dân.'
    },
    {
      name: 'Thế kỷ XVIII - XIX',
      category: 'Century',
      description: 'Cách mạng công nghiệp, cách mạng Pháp, Mỹ và phong trào Tây Sơn, nhà Nguyễn.'
    },
    {
      name: 'Thế kỷ XX',
      category: 'Century',
      description: 'Hai cuộc đại chiến thế giới, phong trào giải phóng dân tộc và kỷ nguyên công nghệ.'
    }
  ]
};

export const LEARNING_DOCUMENTS: Record<string, { title: string, content: string }[]> = {
  'Cổ đại': [
    { title: 'Văn Lang - Âu Lạc', content: 'Nhà nước Văn Lang ra đời vào khoảng thế kỷ VII TCN, đứng đầu là Hùng Vương. Nhà nước Âu Lạc kế thừa Văn Lang, do An Dương Vương Thục Phán lập nên, xây thành Cổ Loa.' },
    { title: 'Đời sống văn hóa', content: 'Cư dân Văn Lang - Âu Lạc có đời sống vật chất và tinh thần phong phú. Họ biết trồng lúa nước, đúc đồng (trống đồng Đông Sơn), có tục nhuộm răng, ăn trầu, làm bánh chưng bánh giầy.' },
    { title: 'Văn minh Ai Cập', content: 'Hình thành bên dòng sông Nile, nổi tiếng with các Kim tự tháp, chữ tượng hình và kỹ thuật ướp xác. Họ có kiến thức sâu rộng về thiên văn và toán học.' }
  ],
  'Trung đại': [
    { title: 'Kỷ nguyên độc lập', content: 'Sau chiến thắng Bạch Đằng năm 938, dân tộc ta bước vào thời kỳ độc lập tự chủ lâu dài. Các triều đại Đinh, Lê, Lý, Trần, Hậu Lê đã xây dựng quốc gia Đại Việt hùng mạnh.' },
    { title: 'Kháng chiến chống ngoại xâm', content: 'Lịch sử Đại Việt gắn liền with những cuộc kháng chiến anh dũng: phá Tống (Lý Thường Kiệt), 3 lần đại bại quân Nguyên Mông (nhà Trần), khởi nghĩa Lam Sơn quét sạch quân Minh (Lê Lợi).' },
    { title: 'Phong trào Phục hưng', content: 'Bắt đầu từ Ý vào thế kỷ XIV, là cuộc cách mạng về tư tưởng, văn hóa, nghệ thuật, đề cao giá trị con người và khoa học thực nghiệm.' }
  ],
  'Cận đại': [
    { title: 'Chống Pháp xâm lược', content: 'Từ năm 1858, thực dân Pháp nổ súng xâm lược Việt Nam. Nhân dân ta đã kiên cường đấu tranh dưới nhiều hình thức: phong trào Cần Vương, phong trào yêu nước đầu thế kỷ XX.' },
    { title: 'Cách mạng công nghiệp', content: 'Sự ra đời của máy móc và sản xuất lớn tại Anh vào thế kỷ XVIII, sau đó lan rộng ra toàn thế giới, làm thay đổi căn bản phương thức sản xuất của con người.' }
  ],
  'Hiện đại': [
    { title: 'Cách mạng tháng Tám', content: 'Dưới sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh, nhân dân ta đã vùng lên giành chính quyền, khai sinh ra nước Việt Nam Dân chủ Cộng hòa ngày 2/9/1945.' },
    { title: 'Kỷ nguyên số', content: 'Sự bùng nổ của internet và công nghệ thông tin đã kết nối thế giới, tạo ra những thay đổi chưa từng có trong mọi lĩnh vực của đời sống xã hội.' }
  ],
  'Thế kỷ X - XI': [
    { title: 'Sự hình thành quốc gia độc lập', content: 'Thế kỷ X đánh dấu bước ngoặt vĩ đại với chiến thắng Bạch Đằng (938). Các triều đại Ngô, Đinh, Tiền Lê đã đặt nền móng cho nền độc lập lâu dài. Sang thế kỷ XI, nhà Lý dời đô về Thăng Long, mở ra thời kỳ phát triển rực rỡ.' },
    { title: 'Phong kiến phương Tây', content: 'Tại châu Âu, hệ thống phong kiến được củng cố. Các vương quốc dần hình thành và phát triển, gắn liền với vai trò của Giáo hội Công giáo.' }
  ],
  'Thế kỷ XII - XIII': [
    { title: 'Hào khí Đông A', content: 'Thời kỳ nhà Trần với 3 lần đại thắng quân Nguyên Mông xâm lược. Tinh thần đoàn kết dân tộc được thể hiện qua Hội nghị Diên Hồng và Hịch Tướng Sĩ.' },
    { title: 'Đế chế Mông Cổ', content: 'Thành Cát Tư Hãn thống nhất các bộ lạc và thực hiện các cuộc chinh phạt quy mô lớn, tạo nên đế chế lục địa rộng lớn nhất trong lịch sử.' }
  ],
  'Thế kỷ XIV - XV': [
    { title: 'Khởi nghĩa Lam Sơn', content: 'Lê Lợi và Nguyễn Trãi lãnh đạo cuộc kháng chiến 10 năm chống quân Minh, giải phóng đất nước và lập ra nhà Hậu Lê - triều đại phát triển nhất thời phong kiến.' },
    { title: 'Đại phát kiến địa lý', content: 'Các nhà thám hiểm như Columbus, Vasco da Gama tìm ra những vùng đất mới, kết nối các châu lục và mở đầu cho thời kỳ giao thương toàn cầu.' }
  ],
  'Thế kỷ XVI - XVII': [
    { title: 'Trịnh - Nguyễn phân tranh', content: 'Đất nước bị chia cắt thành Đàng Trong và Đàng Ngoài với ranh giới là sông Gianh. Tuy nhiên, đây cũng là thời kỳ mở mang bờ cõi về phía Nam.' },
    { title: 'Cải cách tôn giáo', content: 'Tại châu Âu, phong trào cải cách tôn giáo làm thay đổi sâu sắc đời sống chính trị và xã hội, dẫn đến sự hình thành các giáo phái mới.' }
  ],
  'Thế kỷ XVIII - XIX': [
    { title: 'Phong trào Tây Sơn', content: 'Anh em Tây Sơn lật đổ các tập đoàn phong kiến Trịnh - Nguyễn và đánh tan quân xâm lược Xiêm, Thanh, thống nhất đất nước.' },
    { title: 'Cách mạng công nghiệp', content: 'Bắt đầu từ Anh, máy móc thay thế lao động thủ công, tạo nên bước nhảy vọt về năng suất và thay đổi hoàn toàn bộ mặt thế giới.' }
  ],
  'Thế kỷ XX': [
    { title: 'Giải phóng dân tộc', content: 'Thế kỷ của những cuộc đấu tranh giành độc lập trên khắp thế giới. Việt Nam trở thành ngọn cờ đầu với chiến thắng Điện Biên Phủ và đại thắng mùa Xuân 1975.' },
    { title: 'Cách mạng khoa học kỹ thuật', content: 'Con người chinh phục vũ trụ, phát minh máy tính, internet và công nghệ sinh học, đưa nhân loại bước vào kỷ nguyên văn minh mới.' }
  ]
};

export const SHOP_ITEMS: Item[] = [
  { id: 'item1', name: 'Mũ Cối Điện Biên', price: 500, currency: 'gold', description: 'Vật phẩm trang trí hồ sơ.', icon: Shield, category: 'decoration' },
  { id: 'item2', name: 'Kiếm Thuận Thiên', price: 2000, currency: 'gold', description: 'Tăng 10% điểm thưởng mỗi trận.', icon: Sword, category: 'equipment', slot: 'weapon', stats: { combatPower: 50, goldBonus: 0.1 } },
  { id: 'item3', name: 'Bản Đồ Đại Nam', price: 1000, currency: 'gold', description: 'Mở khóa các giai thoại ẩn.', icon: MapIcon, category: 'consumable' },
  { id: 'item4', name: 'Ngọc Tỷ Truyền Quốc', price: 3000, currency: 'gold', description: 'Tăng 20% kinh nghiệm (XP) nhận được.', icon: Crown, category: 'equipment', slot: 'head', stats: { combatPower: 30, expBonus: 0.2 } },
  { id: 'item5', name: 'Sách Lược Tôn Tử', price: 1500, currency: 'gold', description: 'Cho phép đổi câu hỏi 1 lần mỗi trận.', icon: Book, category: 'consumable' },
  { id: 'item6', name: 'Trống Đồng Đông Sơn', price: 2500, currency: 'gold', description: 'Mở khóa chủ đề giao diện "Cổ Đại".', icon: Music, category: 'decoration' },
  { id: 'item7', name: 'Lệnh Bài Miễn Tử', price: 1200, currency: 'gold', description: 'Bỏ qua 1 câu trả lời sai mà không bị trừ điểm.', icon: Heart, category: 'consumable' },
  { id: 'buff_gold', name: 'Thẻ x2 Vàng', price: 50, currency: 'ruby', description: 'Nhân đôi vàng nhận được trong 10 trận thắng.', icon: Coins, category: 'consumable' },
  { id: 'buff_exp', name: 'Thẻ x2 Kinh Nghiệm', price: 50, currency: 'ruby', description: 'Nhân đôi kinh nghiệm nhận được trong 10 trận thắng.', icon: Zap, category: 'consumable' },
  { id: 'equip_armor', name: 'Giáp Trụ Nhà Trần', price: 100, currency: 'ruby', description: 'Giảm 20% sát thương nhận được trong Raid.', icon: Shield, category: 'equipment', slot: 'armor', stats: { combatPower: 100, damageReduction: 0.2 } },
  { id: 'equip_bow', name: 'Nỏ Liên Châu', price: 150, currency: 'ruby', description: 'Tăng 15% sát thương gây ra trong Raid.', icon: Sword, category: 'equipment', slot: 'weapon', stats: { combatPower: 80, damageBonus: 0.15 } },
  { id: 'equip_horse', name: 'Chiến Mã Tây Sơn', price: 200, currency: 'ruby', description: 'Tăng tốc độ hồi phục năng lượng.', icon: Zap, category: 'equipment', slot: 'mount', stats: { combatPower: 120 } },
  { id: 'intimacy_25', name: 'Túi Thơm', price: 100, currency: 'gold', description: 'Tăng 25 điểm thân mật với bạn bè.', icon: Heart, category: 'consumable', stats: { intimacy: 25 } },
  { id: 'intimacy_50', name: 'Quạt Trầm', price: 200, currency: 'gold', description: 'Tăng 50 điểm thân mật với bạn bè.', icon: Heart, category: 'consumable', stats: { intimacy: 50 } },
  { id: 'intimacy_75', name: 'Trâm Cài Tóc', price: 300, currency: 'gold', description: 'Tăng 75 điểm thân mật với bạn bè.', icon: Heart, category: 'consumable', stats: { intimacy: 75 } },
  { id: 'intimacy_100', name: 'Ngọc Bội', price: 400, currency: 'gold', description: 'Tăng 100 điểm thân mật với bạn bè.', icon: Heart, category: 'consumable', stats: { intimacy: 100 } },
];
