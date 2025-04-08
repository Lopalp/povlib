export const LoadingInline = () => {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #374151, #1F2937, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '4rem', height: '4rem', border: '4px solid #4B5563', borderTopColor: '#FBBF24', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#FFFFFF', fontSize: '1.125rem', fontWeight: '500' }}>Loading POVlib data...</p>
        </div>
      </div>
    );
};