import { useTheme } from "../../hooks/useTheme";
import Button from "../Button/Button";

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button text={theme === 'light' ? '🌙' : '🌞'} type='button' onClick={toggleTheme}/>
  )
}

export default ThemeSwitcher;