import { useEffect, useReducer } from 'react';
import './App.scss';
import chroma from 'chroma-js';
import { ColorBox } from './ColorBox';

export type Color = {
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

export enum ColorsActions {
  TOGGLE_LOCK = 'toggle_lock',
  UPDATE_COLOR = 'update_color',
  UPDATE_ALL_COLORS = 'update_all_colors',
  ADD_COLORS = 'add_colors',
  REMOVE_COLORS = 'remove_colors',
}

const colorsReducer = (
  state: Color[],
  action: { type: ColorsActions; payload?: any },
): Color[] => {
  switch (action.type) {
    case ColorsActions.TOGGLE_LOCK: {
      return state.map((color) =>
        color.hex !== action.payload
          ? color
          : { ...color, isLocked: !color.isLocked },
      );
    }
    case ColorsActions.UPDATE_COLOR: {
      return state.map((color) => {
        if (color.isLocked && color.hex !== action.payload) {
          return color;
        }
        return generateNewColor();
      });
    }
    case ColorsActions.UPDATE_ALL_COLORS: {
      return state.map((color) =>
        color.isLocked ? color : generateNewColor(),
      );
    }
    case ColorsActions.ADD_COLORS: {
      let newColors = [];
      for (let i = 0; i < action.payload; i++) {
        newColors.push(generateNewColor());
      }
      return [...state, ...newColors];
    }
    case ColorsActions.REMOVE_COLORS: {
      return state.slice(0, Math.min(state.length, action.payload));
    }

    default:
      throw new Error('unknown action type');
  }
};

export default function App() {
  const [colors, dispatch] = useReducer(colorsReducer, initialColors());
  const colorsCount = colors.length;

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

  const detectKeyPress = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      dispatch({
        type: ColorsActions.UPDATE_ALL_COLORS,
      });
    }
  };

  const handleRangeChange = (range: number) => {
    if (range > colorsCount) {
      dispatch({
        type: ColorsActions.ADD_COLORS,
        payload: range - colorsCount,
      });
    }

    if (range < colorsCount) {
      dispatch({
        type: ColorsActions.REMOVE_COLORS,
        payload: range - colorsCount,
      });
    }
  };

  return (
    <>
      <header className="header">
        <div className="header__item">
          <span>Пробел новые цвета</span>
        </div>
        <div className="header__item">
          <input
            className="header__item"
            onChange={(e) => handleRangeChange(Number(e.target.value))}
            type="range"
            name="colors"
            id="colors"
            value={colorsCount}
            min={1}
            max={MAX_COLORS}
          />
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
                dispatch={dispatch}
              />
            ))}
        </div>
      </main>
    </>
  );
}
