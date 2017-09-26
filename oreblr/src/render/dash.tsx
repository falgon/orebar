import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { productName } from '../../package.json';
import { Menu } from './components/mainField';
import { MainBoard } from './components/mainBoard';
import { menu } from './menu';

ReactDOM.render(
    <div>
        <Menu menuTitle={productName} list={menu} />
        <MainBoard />
    </div>,
    document.getElementById('mainMenu')
);
