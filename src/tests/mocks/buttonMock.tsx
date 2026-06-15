import { vi } from "vitest";

export const buttonMock = () => {
  vi.mock('../Button/Button', () => ({
    default: ({ text, type, onClick }: {text: string, type?: 'button' | 'submit', onClick?: () => void}) => (
      <button type={type || 'button'} onClick={onClick}>
        {text}
      </button>
    )
  }));
}

