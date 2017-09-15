import * as React from 'react';
const power = require('react-icons/lib/fa/power-off');

export interface MenuProps { menuTitle: string; list: [string,string][]; }
export class Menu extends React.Component<MenuProps,undefined>{
    render(){
	const liTag = this.props.list.map(function(item){
	    return <li id='sidemenuItem'><a href={item[1]}>{item[0]}</a></li>
	});

	return (
	    <nav id='menu'>
	    	<section>
	    		<h2 id='sidemenuTitle'>{this.props.menuTitle}</h2>
	    		<ul id='sidemenu'>
	    		    {liTag}
	    		</ul>
	    	</section>
	    	<footer>
	    		<div className='footer_button'><a onClick={this.handleQuit} id='power'>{React.createElement(power,null)}</a></div>
	    	</footer>
	    </nav>
	);
    }

    handleQuit() : void {

    }
}
