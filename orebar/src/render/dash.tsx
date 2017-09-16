import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Menu } from './components/mainField';

const Pack = require('../../package.json');
const menu:[string,string][] = [
    ['Settings','#'],
    ['About','#']
];

ReactDOM.render(
    <Menu menuTitle={Pack['name']} list={menu} />,
    document.getElementById('mainMenu')
);
