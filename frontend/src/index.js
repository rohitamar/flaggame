import { createRoot } from 'react-dom/client';
import FlagGame from './flaggame'; // assuming FlagGame.js is in the same folder

function App() {
  return (
    <div>
      <FlagGame />
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <App />,
);