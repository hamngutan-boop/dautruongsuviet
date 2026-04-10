import fs from 'fs';

const mapping: Record<string, string> = {
  'Tiền sử': 'Cổ đại',
  'Văn Lang - Âu Lạc': 'Cổ đại',
  'Bắc thuộc': 'Cổ đại',
  'Hồng Bàng & Văn Lang': 'Cổ đại',
  'Phong kiến (Đại Việt)': 'Trung đại',
  'Tiền sử Thế giới': 'Cổ đại',
  'Cổ đại Thế giới': 'Cổ đại',
  'Trung đại Thế giới': 'Trung đại',
  'Phục hưng & Khám phá': 'Trung đại',
  'Cận đại Thế giới': 'Cận đại',
  'Hiện đại Thế giới': 'Hiện đại'
};

let content = fs.readFileSync('src/types.ts', 'utf8');

for (const [oldPeriod, newPeriod] of Object.entries(mapping)) {
  const target = `period: '${oldPeriod}'`;
  const replacement = `period: '${newPeriod}'`;
  content = content.split(target).join(replacement);
}

fs.writeFileSync('src/types.ts', content);
console.log('Successfully updated periods in types.ts');
