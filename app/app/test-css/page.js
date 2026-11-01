export const metadata = {
  title: "CSS Diagnostic | Serle's Bake",
  alternates: { canonical: "https://www.serlesbake.in/test-css" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function TestCSSPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>CSS Loading Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Test Results:</h2>
        <div id="css-test-results">
          <p>Checking CSS files...</p>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Manual Tests:</h2>
        <p>If you see styled content below, CSS is working:</p>
        
        {/* Test Bootstrap classes */}
        <div className="alert alert-primary" style={{ marginBottom: '10px' }}>
          This should be a Bootstrap alert (blue background)
        </div>
        
        <div className="btn btn-success" style={{ marginBottom: '10px' }}>
          This should be a Bootstrap button (green)
        </div>
        
        {/* Test custom CSS classes */}
        <div className="primary-btn" style={{ marginBottom: '10px' }}>
          This should be a custom primary button (pink background)
        </div>
        
        <div className="site-btn" style={{ marginBottom: '10px' }}>
          This should be a custom site button (black background)
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>CSS File Status:</h2>
        <ul id="css-file-status">
          <li>style.css: <span id="style-status">Checking...</span></li>
          <li>bootstrap.min.css: <span id="bootstrap-status">Checking...</span></li>
          <li>font-awesome.min.css: <span id="fontawesome-status">Checking...</span></li>
        </ul>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          // Test CSS file loading
          function testCSSFile(filename) {
            return new Promise((resolve) => {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = '/css/' + filename;
              
              const timeout = setTimeout(() => {
                resolve({ loaded: false, error: 'Timeout' });
              }, 5000);
              
              link.onload = () => {
                clearTimeout(timeout);
                resolve({ loaded: true });
              };
              
              link.onerror = () => {
                clearTimeout(timeout);
                resolve({ loaded: false, error: 'Failed to load' });
              };
              
              document.head.appendChild(link);
            });
          }
          
          // Test all CSS files
          async function testAllCSS() {
            const files = ['style.css', 'bootstrap.min.css', 'font-awesome.min.css'];
            const results = {};
            
            for (const file of files) {
              const result = await testCSSFile(file);
              results[file] = result;
              
              // Update status
              const statusElement = document.getElementById(file.replace('.css', '-status'));
              if (statusElement) {
                statusElement.textContent = result.loaded ? '✅ Loaded' : '❌ Failed: ' + result.error;
                statusElement.style.color = result.loaded ? 'green' : 'red';
              }
            }
            
            // Update overall results
            const resultsDiv = document.getElementById('css-test-results');
            const allLoaded = Object.values(results).every(r => r.loaded);
            resultsDiv.innerHTML = allLoaded ? 
              '<p style="color: green;">✅ All CSS files loaded successfully!</p>' :
              '<p style="color: red;">❌ Some CSS files failed to load. Check the status above.</p>';
          }
          
          // Run test when page loads
          window.addEventListener('load', testAllCSS);
        `
      }} />
    </div>
  );
}
