import { describe, expect, test } from "vitest";
import CharacterCard from "./CharacterCard";
import { render, screen } from "@testing-library/react";

describe('Character card component', () => {
  const props = {
    name: 'Dean Winchester',
    img: 'https://supernatural-api.onrender.com/assets/350px-DeanWinchester.png',
    actor: ['Jensen Ackles']
  }

  test('render character and actor names', () => {
    render(<CharacterCard {...props} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText(`Actor: ${props.actor.join(', ')}`)).toBeInTheDocument();
  });

  test('render image', () => {
    render(<CharacterCard {...props} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', props.img);
    expect(img).toHaveAttribute('alt', props.name);
  });
})