import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultContainer from "./ResultContainer";
import type { Character } from "../../types/characters";

const charactersMock: Character[] = [
  {
    id: "5441xkkfwlhdv3rk5",
    name: "Aaron Bass",
    img: "https://supernatural-api.onrender.com/images/350px-Aaron_Bass.png",
    actor: ["Adam Rose"],
    episodes: [
      {
        title: "8.13 Everybody Hates Hitler",
        id: "5441xkfs0li0res0t"
      }
    ],
    occupation: ["Judah Initiative"]
  },
];

const mockWithoutId = [
  {
    name: "Aaron Bass",
    img: "https://supernatural-api.onrender.com/images/350px-Aaron_Bass.png",
    actor: ["Adam Rose"],
    episodes: [
      {
        title: "8.13 Everybody Hates Hitler",
        id: "5441xkfs0li0res0t"
      }
    ],
    occupation: ["Judah Initiative"]
  } as Character,
]

describe('ResultContainer component', () => {
  test('renders characters with id', () => {
    render(<ResultContainer characters={charactersMock} />);
    expect(screen.getByText('Aaron Bass')).toBeInTheDocument();
  });

  test('renders characters without id (uses index as key)', () => {
    render(<ResultContainer characters={mockWithoutId} />);
    expect(screen.getByText('Aaron Bass')).toBeInTheDocument();
  });

  test('renders error when empty', () => {
    render(<ResultContainer characters={[]} />);
    expect(screen.getByText('No characters found, please try another request.')).toBeInTheDocument();
  });
});