import { describe, test } from "vitest";
import ResultContainerError from "./ResultContainerError";
import { render } from "@testing-library/react";

describe('ResultContainerError component', () => {
  test('Correctly render', () => {
    render(<ResultContainerError />);
  })
})