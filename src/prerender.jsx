import { renderToString } from 'react-dom/server';
import App from './App';

export function render(locale) {
  return renderToString(<App locale={locale} />);
}
