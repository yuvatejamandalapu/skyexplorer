import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred in the cosmic interface.";
      
      // Check if it's a Firestore error JSON
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Cosmic Data Error: ${parsed.error} during ${parsed.operationType} operation.`;
          }
        }
      } catch (e) {
        // Not a JSON error, use default or raw message
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6 text-center">
          <div className="atmosphere absolute inset-0 z-0 opacity-50" />
          <div className="z-10 max-w-md space-y-8">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-light tracking-tighter font-serif italic">System Anomaly Detected</h1>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button 
              onClick={this.handleReset}
              className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 mx-auto group"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Re-initialize Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
