'use client';

import { useState } from 'react';

export default function HomePage() {
  const [employeeName, setEmployeeName] = useState('');
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawCode = code.replace(/\s/g, '');
    if (rawCode.length !== 21) {
      setResult('Code must be exactly 21 numeric characters');
      return;
    }
    setLoading(true);
    setResult('');

    console.log('Starting submission'); 
    console.log('Employee Name entered?', employeeName);
    console.log('Code entered?', rawCode);

    try {
      const url = `https://timhortons-survey-automation-spring-boot.onrender.com/api/th-survey/submit?employeeName=${encodeURIComponent(employeeName)}&surveyCode=${rawCode}`;

      console.log('Fetching from URL ->', url);
      const response = await fetch(url);
      console.log('Response received!', response);

      if (!response.ok) {
        console.error('Response not OK!', response.status, response.statusText);
      }
  
      const data = await response.text();
      console.log('Response text parsed!', data);
      setResult(data);
    } catch (error) {
      console.error('Error during submission!', error);
      setResult('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <header
        style={{ 
          width:'100%',
          height:'15%', 
          padding:'0rem 0rem', 
          background:'red', 
          color:'red', 
          display:'flex', 
          alignItems:'center', 
          justifyContent:'center', 
          boxShadow:'0 4px 12px -5px #000'
        }}
      >
        <img src="https://github.com/daemonexe/daemonexe/blob/main/tim.png?raw=true" alt="Tim Hortons Logo" style={{ height:'80px' }}/>
      </header>

      {/* Main Section */}
      <main
        style={{ 
          minHeight:'calc(100vh - 80px)', 
          display:'flex', 
          justifyContent:'center', 
          alignItems:'center', 
          background:'#fff5f5', 
          padding:'2rem'
        }}
      >
        <div
          style={{ 
            background:'white', 
            padding:'2rem', 
            borderRadius:'12px', 
            boxShadow:'0 6px 20px -5px rgba(0, 0, 0, 0.3)', 
            width:'100%', 
            maxWidth:'400px'
          }}
        >
          <h2
            style={{ color: "#000000", fontSize:'32px', fontWeight:'bold', textAlign:'center', marginBottom:'1.5rem'}}
          >
            Submit Survey
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ display:'block', marginBottom:'0.5rem', fontWeight:'500', color:'#D40004' }}>Employee Name</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
                style={{ 
                   width:'100%', 
                   padding:'0.75rem', 
                   borderRadius:'6px', 
                   border:'1px solid #000000',
                   color:'#000000',
                   fontSize:'1rem',
                   transition:'border 0.3s ease'
                 }}
                 onFocus={(e) => e.target.style.border = '1px solid #000000'}
                 onBlur={(e) => e.target.style.border = '1px solid #000000'}
              />
            </div>

            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ display:'block', marginBottom:'0.5rem', fontWeight:'500', color:'#D40004' }}>Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  // Allow only digits
                  let cleaned = e.target.value.replace(/\D/g, '');
                  cleaned = cleaned.slice(0, 21);

                  // Format into groups of 4 and the last group of 5 digits
                  // This will create groups of 4 characters spaced, total 21 digits split like 4 4 4 4 5
                  const groups = [];
                  let remaining = cleaned;
                  for(let i=0; i<4; i++) {
                    groups.push(remaining.slice(0, 4));
                    remaining = remaining.slice(4);
                  }
                  groups.push(remaining); // last 5 digits

                  // Join groups with space but ignore empty groups
                  const formatted = groups.filter(g => g.length > 0).join(' ');
                  setCode(formatted);
                }}
                required
                style={{ 
                   width:'100%', 
                   padding:'0.75rem', 
                   borderRadius:'6px', 
                   border:'1px solid #000000',
                   color: '#000000',
                   fontSize:'1rem',
                   transition:'border 0.3s ease'
                 }}
                 onFocus={(e) => e.target.style.border = '1px solid #000000'}
                 onBlur={(e) => e.target.style.border = '1px solid #000000'}
              />
            </div>

            <button
              type="submit"
              style={{ 
                width:'100%', 
                padding:'0.9rem', 
                borderRadius:'6px', 
                backgroundColor:'#D40004', 
                color:'white', 
                border:'none',
                fontWeight:'bold',
                fontSize:'1rem',
                transition:'background 0.3s ease',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading} // disable while submitting
              onMouseOver={(e) => !loading && (e.currentTarget.style.background = '#ff0000')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.background = '#D40004')}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {result && (
            <div
              style={{ 
                marginTop:'1.5rem', 
                background:'#ffe5e5', 
                padding:'1.5rem', 
                borderRadius:'6px', 
                color:'#D40004',
                boxShadow:'0 2px 5px -2px #000'
              }}
            >
              <strong>Result:</strong> {result}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
