// main.jsx - v1.0.1 - Force Refresh 1769841721053
import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n';
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: '#1a1a1a', color: '#ff5555', height: '100vh', fontFamily: 'monospace' }}>
          <h1>Thinking Process Stalled (Runtime Error)</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8em', color: '#999' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: 20, cursor: 'pointer' }}>
            Reload Application
          </button>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '10px 20px', marginTop: 20, marginLeft: 10, cursor: 'pointer' }}>
            Clear Data & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
