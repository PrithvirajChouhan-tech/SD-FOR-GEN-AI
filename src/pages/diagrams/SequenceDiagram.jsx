export default function SequenceDiagram() {
  const actors = ['Client', 'API Gateway', 'Auth Service', 'Order Service', 'Database'];
  const xPositions = [60, 170, 280, 390, 500];
  const messages = [
    { from: 0, to: 1, label: 'POST /orders', y: 100 },
    { from: 1, to: 2, label: 'validateToken()', y: 130 },
    { from: 2, to: 1, label: '200 OK', y: 160, dashed: true },
    { from: 1, to: 3, label: 'createOrder()', y: 190 },
    { from: 3, to: 4, label: 'INSERT order', y: 220 },
    { from: 4, to: 3, label: 'orderID: uuid', y: 250, dashed: true },
    { from: 3, to: 1, label: 'order created', y: 280, dashed: true },
    { from: 1, to: 0, label: '201 Created', y: 310, dashed: true },
  ];
  return (
    <svg viewBox="0 0 560 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="5" y="5" width="550" height="350" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {actors.map((a, i) => (
        <g key={a}>
          <rect x={xPositions[i] - 40} y={20} width={80} height={28} rx="6" fill={i === 0 ? 'rgba(37,99,235,0.1)' : 'rgba(139,92,246,0.08)'} stroke={i === 0 ? '#2563EB' : '#8B5CF6'} strokeWidth="1.5" />
          <text x={xPositions[i]} y={38} textAnchor="middle" fontSize="9" fontWeight="700" fill={i === 0 ? '#2563EB' : '#8B5CF6'} fontFamily="Space Grotesk">{a}</text>
          <line x1={xPositions[i]} y1={48} x2={xPositions[i]} y2={340} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      ))}
      {messages.map((msg, i) => {
        const x1 = xPositions[msg.from];
        const x2 = xPositions[msg.to];
        const dir = x2 > x1 ? 1 : -1;
        return (
          <g key={i}>
            <line x1={x1} y1={msg.y} x2={x2} y2={msg.y} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray={msg.dashed ? '4 3' : undefined} />
            <polygon points={`${x2 - dir * 8},${msg.y - 4} ${x2},${msg.y} ${x2 - dir * 8},${msg.y + 4}`} fill="#CBD5E1" />
            <rect x={Math.min(x1, x2) + Math.abs(x2 - x1) / 2 - 40} y={msg.y - 17} width={80} height={14} rx="3" fill="white" />
            <text x={(x1 + x2) / 2} y={msg.y - 7} textAnchor="middle" fontSize="8" fontWeight="600" fill="#475569" fontFamily="JetBrains Mono">{msg.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
