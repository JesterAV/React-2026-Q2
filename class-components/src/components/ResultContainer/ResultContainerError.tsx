import { Component } from "react";

class ResultContainerError extends Component {
  render() {
    return (
      <div className="result-container__error">
        <h2 className="result-container__message">
          No characters found, please try another request.
        </h2>
      </div>
    )
  }
}

export default ResultContainerError;