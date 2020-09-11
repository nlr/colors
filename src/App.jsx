import React from "react";
import "./App.scss";
import { Button } from "react-bootstrap";

const HEX = [1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];

function randomHex() {
  let hex = "#";
  for (let i = 0; i < 6; i++) {
    hex += HEX[Math.floor(Math.random() * HEX.length)];
  }
  return hex;
}

function App() {
  const [backgroundColor, setBackgroundColor] = React.useState(randomHex());
  const textAreaRef = React.useRef(null);

  React.useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  function handleClick() {
    setBackgroundColor(randomHex());
  }

  function handleColorClick(e) {
    console.log(textAreaRef);
    document.execCommand("copy");
  }

  return (
    <>
      <main>
        <div className="container">
          <div className="box">
            <div className="noselect">background color:</div>
            <span
              ref={textAreaRef}
              onClick={handleColorClick}
              style={{ color: backgroundColor }}
              className="color"
            >
              {backgroundColor}
            </span>
          </div>
          <Button
            className="button"
            onClick={handleClick}
            size="lg"
            bsPrefix="btn btn-hero"
          >
            click me
          </Button>
        </div>
      </main>
    </>
  );
}

export default App;
