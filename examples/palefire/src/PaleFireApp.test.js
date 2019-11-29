import React from 'react';
import ReactDOM from 'react-dom';
import PaleFireApp from './PaleFireApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PaleFireApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
