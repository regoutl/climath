import {tr} from '../../tr/tr.js';
import MapLayers from './maplayers.js';

function isCentral(type){
    return type == 'nuke' || type == 'ccgt' || type == 'fusion';
}


export default class MapView extends React.Component{

    /* accepted props :
    onMouseMove : function(curPos)    -> called on mouse move && mouse leave  (then with undefined curPos)
    onClick : function(curPos)        -> called on click
    cursor : {type, radius} type : undefined or string (pv, nuke, ...)
                            radius : undefined or Number. unit : px
    */
    constructor(props){
        //react
        super(props);

        this.state = {
            energyGrid:true,
            flows:false,
            base: 'groundUse'
        };

        this._toogleLayer = this._toogleLayer.bind(this);

        //callbacks ----------------------------------------------------
        this.draw = this.draw.bind(this);
        this.mousedown = this.onmousedown.bind(this);
        this.mousemove = this.onmousemove.bind(this);
        this.mouseup = this.onmouseup.bind(this);
        this.wheel = this.onwheel.bind(this);
        this.click = this.onclick.bind(this);

        this.mouseleave = this.onmouseleave.bind(this);


        //about mouse
        this.physMousePos = {x: 0, y:0}; // cursor pos (px) in window coord
        //transforms logical coord -> physical coord
        // physMousePos  = (logicMousePos + translate) * scale
        this.transform = {x: -0, y: -0, scale:0.64};
        //is the mouse curently down
        this.isMouseDown = false;

        // content --------------------------------------------------

        // //array of positions of ponctual stuff (nuke, ccgt, ...). format : type, pos
        // this.items = [];
    }




    // /** @brief update the given layer*/
    // update(layerName){
    //     throw 'todo';
    //     // if(this[layerName+'Src'] === undefined)
    //     //     throw 'olala';
    //     // // this.energy.update(this.energySrc);
    //     // this[layerName].update(this[layerName+'Src']);
    // }
    //
    // // conceptually, mapView stores a Map (id, color)
    // // this function return the next free id and maps it to its coresponding color
    // appendEnergyPalette(type){
    //   let r, g, b, a = 255;
    //   if(type == 'pv'){r = 70; g = 85; b = 130;}
    //   else if(type == 'battery'){r = 0; g = 255; b = 250;}
    //   else if(type == 'wind'){r = 255; g = 255; b = 250; a = 128}
    //   else {
    //     throw 'todo';
    //   }
    //
    //   return this.energy.appendPalette(r, g, b, a);
    // }
    //
    // /// adds a point item at the given position
    // addItem(type, pos){
    //     if(!isCentral(type))
    //         throw 'not possible';
    //
    //     this.items.push({type: type, pos:pos});
    //     //update gl
    //     this._updatePtsBuf();
    //     this.draw();
    // }
    //
    // //removes a central
    // rmItem(type, pos){
    //     if(!isCentral(type))
    //         throw 'not possible';
    //
    //     let id = this.items.findIndex(v => v.type === type && v.pos.x === pos.x
    //         && v.pos.y === pos.y);
    //
    //     this.items.splice(id, 1);
    //
    //     //update gl
    //     this._updatePtsBuf();
    //     this.draw();
    // }



    //internal functions--------------------------------------------------------

    _toogleLayer(name){
        if(['energyGrid', 'flows'].includes(name))
            this.setState((state) => {
                return {[name]: !state[name]};
            });
        else
            this.setState({base: name});

    }

    componentDidMount(){
        this.props.scene.init(this.refs.mapCanvas);

        console.log("mount mapview !");

        this.draw();
        window.addEventListener('resize', this.draw);


        window.addEventListener('mousedown', this.mousedown);
        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mouseup', this.mouseup);
        window.addEventListener('wheel', this.wheel);
    }


    render(){

        // return <div>{this.myProp}</div>;
        this.draw();

        console.log('render :/');


        return (<div id="dMapBox">
                    <MapLayers
                        base={this.state.base}
                        energyGrid={this.state.energyGrid}
                        flows={this.state.flows}
                        setVisible={this._toogleLayer} />

                    <canvas
                        ref="mapCanvas"
                        onMouseLeave={this.mouseleave}
                        onClick={this.click}
                    >
                        {tr("Your browser is not supported")}
                    </canvas>
                </div>);
    }


    draw(){
        this.props.scene.draw(this.transform, this.state.base, this.state.energyGrid, this.state.flows);
    }



    onmousedown(e){
        if(e.target != this.refs.mapCanvas)
            return;

        this.isMouseDown = true;
        this.physMousePos = {x:e.pageX , y:e.pageY};
    }
    onmousemove(e){
        // if(e.target != this.refs.mapCanvas)
        //     return;

        if(this.isMouseDown){

            this.transform.x += (e.pageX - this.physMousePos.x) / this.transform.scale;
            this.transform.y += (e.pageY - this.physMousePos.y) / this.transform.scale;

            this.physMousePos.x = e.pageX;
            this.physMousePos.y = e.pageY;
            this.dragging = true;//used to prevent click when drawing


            this.draw();
        }
        else {
            let rawPos = {x:e.pageX, y : e.pageY};

            let transformedPos = {
                x: Math.round((rawPos.x / this.transform.scale) - this.transform.x),
                y: Math.round((rawPos.y / this.transform.scale) - this.transform.y),
            };

            this.props.onMouseMove(transformedPos);
        }
    }
    onmouseup(e){
        this.isMouseDown = false;
        setTimeout(() => {this.dragging = false}, 0);

        if(e.target != this.refs.mapCanvas)
            return;

    }
    onwheel(e){
        let curX = e.pageX ,
            curY = e.pageY ;

        let origin = {
            x: (curX  / this.transform.scale- this.transform.x),
            y: (curY  / this.transform.scale- this.transform.y)
        };

        if(e.deltaY > 0){
            this.transform.scale *= 0.8;
        }else{
            this.transform.scale /= 0.8;
        }

        //bounds
        this.transform.scale = Math.max(this.transform.scale, Math.pow(0.8, 4)); //unzoom
        this.transform.scale = Math.min(this.transform.scale, Math.pow(1/0.8, 8));//zoom

        this.transform.x = curX / this.transform.scale - origin.x;
        this.transform.y = curY / this.transform.scale - origin.y;

        this.draw();
    }
    onclick(e){
        if(this.dragging)
            return;
        let rawPos = {x:e.pageX, y : e.pageY};

        let transformedPos = {
            x: Math.round((rawPos.x / this.transform.scale) - this.transform.x),
            y: Math.round((rawPos.y / this.transform.scale) - this.transform.y),
        };

        this.props.onClick(transformedPos);


    }

    //called when cursor leaves direct contact with central area
    onmouseleave(e){
        this.props.onMouseMove(undefined);
    }


}
