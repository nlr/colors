import { Dispatch, memo, useState } from 'react';
import chroma from 'chroma-js';

import lock from './lock.png';
import unlock from './unlock.png';
import { ColorsActions } from './App';
import type { Color } from './App';

type ColorBoxProps = Color & {
  dispatch: Dispatch<{ type: ColorsActions; payload?: any }>;
};

export const ColorBox = memo(
  ({ hex = '#000000', isLocked = false, dispatch }: ColorBoxProps) => {
    const [isCopied, setIsCopied] = useState(false);

    async function copyTextToClipboard(text: string) {
      if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
      }
    }

    const handleCopyClick = () => {
      // Asynchronously call copyTextToClipboard
      copyTextToClipboard(hex)
        .then(() => {
          // If successful, update the isCopied state value
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const luminance = chroma(hex).luminance();

    return (
      <div style={{ backgroundColor: hex }} className="colorbox">
        <div
          style={{ color: luminance > 0.5 ? 'black' : 'white' }}
          className="colorbox__items">
          <span
            onClick={handleCopyClick}
            className="colorbox__items--background colorbox__items--color noselect">
            {hex}
          </span>
          <img
            onClick={() =>
              dispatch({ type: ColorsActions.TOGGLE_LOCK, payload: hex })
            }
            style={{ filter: `invert(${luminance > 0.5 ? 0 : 1})` }}
            className="colorbox__items--background colorbox__items--img noselect"
            src={isLocked ? lock : unlock}
            alt="locker"
            draggable="false"
          />
        </div>
      </div>
    );
  },
);
