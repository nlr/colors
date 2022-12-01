import { useCallback, useEffect, useState } from 'react';
import './App.scss';
import chroma from 'chroma-js';
import { ColorBox } from './ColorBox';

type Color = {
  isLocked: boolean;
  hex: string;
};

const MAX_COLORS = 5;

const generateNewColor = (color?: string) => {
  if (color && chroma.valid(color)) {
    return { hex: color, isLocked: false };
  }
  return { hex: chroma.random().toString(), isLocked: false };
};

const hashToColors = (str: string) => {
  let result = str
    .substring(1)
    .split('-')
    .map((item) => '#' + item)
    .filter((item) => chroma.valid(item))
    .map((item) => generateNewColor(item));

  if (result.length > MAX_COLORS) {
    result.splice(MAX_COLORS, result.length - MAX_COLORS);
  }
  return result;
};

const initialColors = (): Color[] => {
  if (window.location.hash) {
    return hashToColors(window.location.hash);
  }
  return [generateNewColor()];
};

export default function App() {
  const [colors, setColors] = useState(() => initialColors());
  const [colorsCount, setColorsCount] = useState(colors.length);

  useEffect(() => {
    window.location.hash = colors
      .map((color) => color.hex?.substring(1))
      .join('-');
  }, [colors]);

  useEffect(() => {
    document.addEventListener('keydown', detectKeyPress, true);
    return () => {
      document.removeEventListener('keydown', detectKeyPress);
    };
  }, []);

  const detectKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setColors((prev) =>
          prev.map((color) =>
            color.isLocked === true ? color : generateNewColor(),
          ),
        );
      }
    },
    [colorsCount, colors],
  );

  const handleRangeChange = () => {
    if (colorsCount > colors.length) {
      let newColors: Color[] = [];
      for (let i = 0; i < colorsCount - colors.length; i++) {
        newColors.push(generateNewColor());
      }
      setColors((prev) => [...prev, ...newColors]);
    }

    if (colorsCount < colors.length) {
      setColors((state) =>
        state.slice(0, Math.min(colors.length, colorsCount)),
      );
    }
  };

  const updateColor = (hex: string) => {
    const updatedColors = colors.map((color) => {
      if (color.hex === hex) {
        return { ...color, isLocked: !color.isLocked };
      }
      return color;
    });

    setColors(updatedColors);
  };

  useEffect(() => {
    handleRangeChange();
  }, [colorsCount]);

  return (
    <>
      <header className="header">
        <div className="header__item">
          <span>Пробел новые цвета</span>
        </div>
        <div className="header__item">
          <input
            className="header__item"
            onChange={(e) => setColorsCount(Number(e.target.value))}
            type="range"
            name="colors"
            id="colors"
            value={colorsCount}
            min={1}
            max={6}
          />
          {colorsCount}
        </div>
      </header>
      <main>
        <div className="container">
          {colors &&
            colors.map((color) => (
              <ColorBox
                key={color.hex}
                hex={color.hex}
                isLocked={color.isLocked}
                clickHandler={updateColor}
              />
            ))}
        </div>
      </main>
    </>
  );
}
