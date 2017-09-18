import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Menu } from './components/mainField';
import { MainBoard } from './components/mainBoard';

const Pack = require('../../package.json');
const menu:[string,string][] = [
    ['Settings','#'],
    ['About','#']
];

ReactDOM.render(
    <div>
   	<Menu menuTitle={Pack['name']} list={menu} />
    	<MainBoard />
    </div>,
    document.getElementById('mainMenu')
);
