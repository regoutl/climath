
import {tr, getCurrentLang, supportedLanguages, setLang} from '../../../tr.js';



export class LangSelector extends React.Component{
    constructor(props){
        super(props);

        this.state = {open:false};

        this.esc = event => {
            if (event.keyCode !== 27) {
                return;
            }
            this.close();
        };

        this.click = event => {
            this.close();
        };
    }


    open(){
        this.setState({open:true});


        window.addEventListener("keydown", this.esc);
        window.addEventListener("mousedown", this.click);
    }

    close(){
        this.setState({open:false});
        window.removeEventListener("keydown", this.esc);
        window.removeEventListener("mousedown", this.click);
    }

    setLang(lang){

        setLang(lang).then(()=>{
            this.props.onLangChanged();
        });
    }

    render(){
        let chooser = "";

        if(this.state.open){
            chooser = "open";

            chooser = <div id="selectLang">{supportedLanguages.map((lang) => <div onMouseDown={()=>this.setLang(lang)}><img src={"res/icons/lang/" + lang + ".png"} key={lang} alt={lang}/></div>)}</div>;

        }
        let current = (<div id="currentLang" onClick={() => this.open()}>
        <img src={"res/icons/lang/" + getCurrentLang() + ".png"}/>{chooser}</div>)

        return current;
    }
}


export function NavBar(props){
    // <a href="articles.html">
    //     {tr("Articles")}
    // </a>
    return (<header className="hFlex">
        <a href="index.html"  className="hFlex">
            <img src='res/icons/climath192.png' alt="logo climath" />

            <h1>Climath</h1>
        </a>

        <nav className="hFlex">
            <a href="play.html">
                {tr("Play")}
            </a>
            <a href="about.html">
                {tr("About")}
            </a>
        </nav>
        <LangSelector onLangChanged={ props.onLangChanged}/>

    </header>);
}
