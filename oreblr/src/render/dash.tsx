import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { name } from '../../package.json';
import { Menu } from './components/mainField';
import { MainBoard } from './components/mainBoard';
import { menu } from './menu';

ReactDOM.render(
    <div>
        <Menu menuTitle={name} list={menu} />
        <MainBoard />
    </div>,
    document.getElementById('mainMenu')
);
