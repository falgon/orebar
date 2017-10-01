import * as React from 'react';
import { ipcRenderer } from 'electron';

export interface MenuProps {
    menuTitle: string;
    list: string[];
}

export class Menu extends React.Component<MenuProps, undefined> {
    constructor(props: MenuProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <nav id='menu'>
                    <section>
                        <h2 id='sidemenuTitle'>{this.props.menuTitle}</h2>
                        <ul id='sidemenu'>
                            {
                                this.props.list.map((item) => {
                                    return (
                                        <li key={item} className='sidemenuItem' id={item} onClick={() => ipcRenderer.send(item)}>
                                            {item}
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </section>
                    <footer>
                        <ul>
                            <li>
                                <div className='footer_button'>
                                    <a onClick={() => { ipcRenderer.send('clicked_quit'); }} id='power'>
                                        {React.createElement(require('react-icons/lib/fa/power-off'), null)}
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className='footer_button'>
                                    <a onClick={() => { ipcRenderer.send('clicked_info'); }} id='info'>
                                        {React.createElement(require('react-icons/lib/fa/info-circle'), null)}
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className='footer_button'>
                                    <a onClick={() => { ipcRenderer.send('clicked_reload'); }} id='reload'>
                                        {React.createElement(require('react-icons/lib/go/sync'), null)}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </footer>
                </nav>
                <header className='fixed'>
                    <div className='toggle-button'>☰</div>
                </header>
            </div>
        );
    }
}
