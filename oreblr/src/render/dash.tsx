import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Menu } from './components/mainField';
import { MainBoard } from './components/mainBoard';
import { menu } from './menu'

const Pack = require('../../package.json');

ReactDOM.render(
    <div>
        <Menu menuTitle={Pack['name']} list={menu} />
        <MainBoard />
    </div>,
    document.getElementById('mainMenu')
);
