import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import ErrorBoundary from "./ErrorBoundary";
import { buttonMock } from "../../tests/mocks/buttonMock";

buttonMock();

const StubComponent = () => <div>Stub component</div>;
const BuggyComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary component', () => {
  test('render children', () => {
    render(
      <ErrorBoundary title="Oops, something went wrong" buttonText="Try again">
        <StubComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Stub component')).toBeInTheDocument();
  });

  test('render error', () => {
    render(
      <ErrorBoundary title="Oops, something went wrong" buttonText="Try again">
        <BuggyComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops, something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  test('click try again', async () => {
    const user = userEvent.setup();

    let shouldThrow = true;
    const ConditionalComponent = () => {
      if (shouldThrow) throw new Error('Test error');
      return <div>Recovered content</div>;
    };

    const { rerender } = render(
      <ErrorBoundary title="Oops, something went wrong" buttonText="Try again">
        <ConditionalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops, something went wrong')).toBeInTheDocument();

    shouldThrow = false;

    const button = screen.getByRole('button', { name: 'Try again' });
    await user.click(button);

    rerender(
      <ErrorBoundary title="Oops, something went wrong" buttonText="Try again">
        <ConditionalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered content')).toBeInTheDocument();
  });
});
