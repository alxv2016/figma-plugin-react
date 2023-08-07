import React from 'react';
import {createRoot} from 'react-dom/client';
import './plugin.scss';

const container = document.getElementById('react-page') as HTMLElement;
const root = createRoot(container);

const App = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onCreate = () => {
    const count = Number(inputRef.current?.value || 0);
    parent.postMessage({pluginMessage: {type: 'create-rectangles', count}}, '*');
  };

  const onCancel = () => {
    parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
  };

  return (
    <main>
      <header>
        <img src={require('../assets/logo.svg')} />
        <h2>Rectangle Creator</h2>
      </header>
      <section>
        <input id="input" type="number" min="0" ref={inputRef} />
        <label htmlFor="input">Rectangle Count</label>
      </section>
      <footer>
        <button className="brand" onClick={onCreate}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
};

root.render(<App />);
