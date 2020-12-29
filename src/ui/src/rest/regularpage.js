// Copyright 2020, ASBL Math for climate, All rights reserved.


"use strict";



import {Index} from './index.js';
import {Articles} from './articles.js';
import {About} from './about.js';
import {setLang} from '../../../tr.js';
import {NavBar} from './navbar.js';


class StdLayout extends React.Component{
    constructor(props){
        super(props);
    }
    render(){

        let Content = this.props.content;
        return [
            <NavBar key="nav" onLangChanged={() => this.forceUpdate() }/>,
            <Content key="content"  />,
            <footer key="footer"><div>Copyright Math for climate ASBL, 2020</div></footer>];

    }

}

setLang().then(() => {
    let content = null;

    let path = window.location.pathname;
    //localhost remove
    if(window.location.host == "localhost")
        path = path.substr("climath/".length);

    path = path.substr(1);

    switch (path) {
        case "":
            content = Index;
            break;
        case "index.html":
            content = Index;
            break;
        case "articles.html":
            content = Articles;
            break;
        case "about.html":
            content = About;
            break;
        default:
            console.log("No route found", path);
            return;
    }



    ReactDOM.render(
      <StdLayout content={content} />,
      // document.getElementById("root")
      document.body
    );
})
