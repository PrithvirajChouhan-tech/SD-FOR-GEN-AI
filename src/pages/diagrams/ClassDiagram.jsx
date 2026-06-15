
const classes = [
  { name: 'User', x: 40, y: 40, attrs: ['- id: UUID', '- email: String', '- role: Enum'], methods: ['+ login()', '+ logout()'], color: '#2563EB' },
  { name: 'Product', x: 220, y: 40, attrs: ['- id: UUID', '- name: String', '- price: Decimal', '- stock: Int'], methods: ['+ updateStock()', '+ getDetails()'], color: '#8B5CF6' },
  { name: 'Order', x: 400, y: 40, attrs: ['- id: UUID', '- userId: UUID', '- total: Decimal', '- status: Enum'], methods: ['+ process()', '+ cancel()'], color: '#22C55E' },
  { name: 'Payment', x: 220, y: 200, attrs: ['- id: UUID', '- orderId: UUID', '- method: Enum', '- status: Enum'], methods: ['+ charge()', '+ refund()'], color: '#F59E0B' },
];

export default function ClassDiagram() {
  return (
    <svg viewBox="0 0 560 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="5" y="5" width="550" height="310" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Relationships */}
      <line x1="160" y1="80" x2="220" y2="80" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="340" y1="80" x2="400" y2="80" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="300" y1="140" x2="300" y2="200" stroke="#CBD5E1" strokeWidth="1.5" />
      <text x="195" y="75" fontSize="8" fill="#94A3B8" fontFamily="Inter">1..*</text>
      <text x="350" y="75" fontSize="8" fill="#94A3B8" fontFamily="Inter">places</text>
      {classes.map(cls => (
        <g key={cls.name}>
          <rect x={cls.x} y={cls.y} width={160} height={140} rx="6" fill="white" stroke={cls.color} strokeWidth="1.5" />
          {/* Header */}
          <rect x={cls.x} y={cls.y} width={160} height={28} rx="6" fill={`${cls.color}15`} />
          <rect x={cls.x} y={cls.y + 22} width={160} height={6} fill={`${cls.color}15`} />
          <text x={cls.x + 80} y={cls.y + 18} textAnchor="middle" fontSize="11" fontWeight="700" fill={cls.color} fontFamily="Space Grotesk">{cls.name}</text>
          {/* Divider */}
          <line x1={cls.x} y1={cls.y + 28} x2={cls.x + 160} y2={cls.y + 28} stroke={`${cls.color}30`} strokeWidth="1" />
          {/* Attributes */}
          {cls.attrs.map((a, i) => (
            <text key={a} x={cls.x + 8} y={cls.y + 46 + i * 16} fontSize="9" fill="#475569" fontFamily="JetBrains Mono">{a}</text>
          ))}
          {/* Divider 2 */}
          <line x1={cls.x} y1={cls.y + 95} x2={cls.x + 160} y2={cls.y + 95} stroke={`${cls.color}30`} strokeWidth="1" />
          {/* Methods */}
          {cls.methods.map((m, i) => (
            <text key={m} x={cls.x + 8} y={cls.y + 112 + i * 16} fontSize="9" fill="#8B5CF6" fontFamily="JetBrains Mono">{m}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}
