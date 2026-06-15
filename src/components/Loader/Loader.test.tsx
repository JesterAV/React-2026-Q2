import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import Loader from "./Loader";

describe('Loader component', () => {
  test('Correctly render', () => {
    render(<Loader />);
  })
})