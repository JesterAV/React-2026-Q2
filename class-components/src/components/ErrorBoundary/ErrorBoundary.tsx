import './ErrorBoundary.scss';

import { Component, type ErrorInfo } from "react";
import Button from "../Button/Button";

class ErrorBoundary extends Component<{children: React.ReactNode}> {
  state = {
    hasError: false
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  handleTryAgain() {
    this.setState({hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error">
          <h1 className="error__title">Oops, something went wrong</h1>
          <Button text="Try again" type='button' onClick={() => this.handleTryAgain()}/>
        </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;