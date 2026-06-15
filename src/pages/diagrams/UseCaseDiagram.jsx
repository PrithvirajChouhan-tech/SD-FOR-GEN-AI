
export default function UseCaseDiagram() {
  return (
    <svg viewBox="0 0 560 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <rect x="5" y="5" width="550" height="290" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="280" y="25" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A" fontFamily="Space Grotesk">E-Commerce System — Use Case Diagram</text>
      {/* System boundary */}
      <rect x="130" y="35" width="300" height="240" rx="8" fill="white" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="6 3" />
      <text x="280" y="52" textAnchor="middle" fontSize="9" fill="#2563EB" fontFamily="Space Grotesk" fontWeight="600">«System» E-Commerce Platform</text>
      {/* Actors */}
      <circle cx="50" cy="120" r="14" stroke="#475569" strokeWidth="1.5" fill="white" />
      <line x1="50" y1="134" x2="50" y2="165" stroke="#475569" strokeWidth="1.5" />
      <line x1="30" y1="150" x2="70" y2="150" stroke="#475569" strokeWidth="1.5" />
      <line x1="50" y1="165" x2="30" y2="185" stroke="#475569" strokeWidth="1.5" />
      <line x1="50" y1="165" x2="70" y2="185" stroke="#475569" strokeWidth="1.5" />
      <text x="50" y="200" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569" fontFamily="Inter">Customer</text>

      <circle cx="510" cy="120" r="14" stroke="#8B5CF6" strokeWidth="1.5" fill="white" />
      <line x1="510" y1="134" x2="510" y2="165" stroke="#8B5CF6" strokeWidth="1.5" />
      <line x1="490" y1="150" x2="530" y2="150" stroke="#8B5CF6" strokeWidth="1.5" />
      <line x1="510" y1="165" x2="490" y2="185" stroke="#8B5CF6" strokeWidth="1.5" />
      <line x1="510" y1="165" x2="530" y2="185" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="510" y="200" textAnchor="middle" fontSize="9" fontWeight="600" fill="#8B5CF6" fontFamily="Inter">Admin</text>

      {/* Use cases - Customer */}
      {[{ label: 'Browse Products', y: 70 },{ label: 'Add to Cart', y: 110 },{ label: 'Checkout', y: 150 },{ label: 'Track Order', y: 190 },{ label: 'Write Review', y: 230 }].map(uc => (
        <g key={uc.label}>
          <ellipse cx="220" cy={uc.y} rx="74" ry="16" fill="rgba(37,99,235,0.06)" stroke="#2563EB" strokeWidth="1.5" />
          <text x="220" y={uc.y + 4} textAnchor="middle" fontSize="9" fontWeight="600" fill="#2563EB" fontFamily="Inter">{uc.label}</text>
          <line x1="64" y1={120} x2="146" y2={uc.y} stroke="#CBD5E1" strokeWidth="1" />
        </g>
      ))}

      {/* Use cases - Admin */}
      {[{ label: 'Manage Products', y: 80 },{ label: 'Process Orders', y: 120 },{ label: 'View Analytics', y: 160 },{ label: 'Manage Users', y: 200 }].map(uc => (
        <g key={uc.label}>
          <ellipse cx="370" cy={uc.y} rx="74" ry="16" fill="rgba(139,92,246,0.06)" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="370" y={uc.y + 4} textAnchor="middle" fontSize="9" fontWeight="600" fill="#8B5CF6" fontFamily="Inter">{uc.label}</text>
          <line x1="496" y1={120} x2="444" y2={uc.y} stroke="#CBD5E1" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}
