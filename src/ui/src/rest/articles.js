// Copyright 2020, ASBL Math for climate, All rights reserved.

// page index.html

import {NavBar} from './navbar.js';
import {tr} from '../../../tr.js';


/** @brief switch between full layouts*/
export class Articles extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        let body =
            [
                <NavBar onLangChanged={() => this.forceUpdate()}/>,
                <div>Articles</div>,
,
        	<footer>

        	</footer>];

        return body;
    }
}
