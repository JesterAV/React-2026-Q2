import { describe, test, expect } from "vitest";
import { render, screen } from '@testing-library/react'
import Button from "./Button";

describe('Button component', () => {
  test('Correctly render', () => {
    render(<Button text='Click me' type='button' />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
})