import {tr} from '../../tr/tr.js';
import MapLayers from './maplayers.js';
import {BuildDock, TouchBuildDock} from './builddock.js';
import {isTouchScreen,isMobile,isSmallScreen,isLandscape} from '../screenDetection.js';

function isCentral(type){
    return type == 'nuke' || type == 'ccgt' || type == 'fusion';
}

/* The map view is responsible for :
-the map canvas (not the centent, see Scene)
-The map layers buttons
- the build menus
*/
export default class MapView extends React.Component{

    /* accepted props :
    onBuildConfirmed : function(curPos)        -> called on click
    scene : a Scene
    */
    constructor(props){
        //react
        super(props);

        this.state = {
            energyGrid: true,
            flows: false,
            base: 'groundUse',
            touchBuildMenuPos: null,
            targetBuild: { //the current sheduled build
                type: null,
                pos:{x:0, y:0},
                radius:50
            }
        };

        this._toogleLayer = this._toogleLayer.bind(this);

        //callbacks ----------------------------------------------------
        this.draw = this.draw.bind(this);
        this.mousemove = this.onmousemove.bind(this);
        this.mouseup = this.onmouseup.bind(this);

        //about mouse
        this.physMousePos = {x: 0, y:0}; // cursor pos (px) in window coord
        //transforms logical coord -> physical coord
        // physMousePos  = (logicMousePos + translate) * scale
        this.transform = {x: -0, y: -0, scale:0.64};
        //is the mouse curently down
        this.isMouseDown = false;

        //Touch state
        this.touchstate = {
            touches: [],
        };

        this.canvas = React.createRef();
    }


    setTargetBuildState(attrName, val){
        this.setState((state) => {
            let ans = {targetBuild: {...state.targetBuild, [attrName]: val}};
            return ans;
        });
    }


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
        this.props.scene.init(this.canvas.current);

        console.log("mount mapview !");

        this.draw();
        window.addEventListener('resize', this.draw);

        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mouseup', this.mouseup);
    }

    componentDidUpdate(){
        this.draw();
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.draw);

        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('mouseup', this.mouseup);
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
                        ref={this.canvas}
                        onMouseLeave={this.onmouseleave.bind(this)}
                        onWheel={this.onwheel.bind(this)}
                        onMouseDown={this.onmousedown.bind(this)}
                        onTouchStart={this.ontouchstart.bind(this)}
                        onTouchMove={this.ontouchmove.bind(this)}
                        onTouchEnd={this.ontouchend.bind(this)}
                        onTouchCancel={this.ontouchend.bind(this)}
                    >
                        {tr("Your browser is not supported")}
                    </canvas>

                    {this._makeDesktopBuildDock()}
                    {this._makeTouchBuildMenu()}
                </div>);
    }

    draw(){
        //update the cursor
        this.props.scene.cursor={
                        type:this.state.targetBuild.type,
                        radius: this.state.targetBuild.radius,
                        pos:this.state.targetBuild.pos
                    };

        this.props.scene.draw(
                this.transform,
                this.state.base,
                this.state.energyGrid,
                this.state.flows);
    }

    /** @brief returns a react component for a detailed build dock
    @note : desktop build dock is alwas visible, and detailed
    */
    _makeDesktopBuildDock(){
        //no detailed build dock
        if(isTouchScreen() && isMobile())
            return null;


        return (<BuildDock
                    simu={this.props.simu}
                    targetBuild={this.state.targetBuild}

                    onTypeChanged = {this.setTargetBuildState.bind(this, 'type')}
                    onDetailsRequested = {this.props.onDetailsRequested}
                    onBuildConfirmed = {() => this.confirmBuild(this.scene.cursor.pos)}
                />);
    }

    _makeTouchBuildMenu(){
        if(!this.state.touchBuildMenuPos)
            return null;



        return (<TouchBuildDock
                    simu={this.props.simu}
                    targetBuild={this.state.targetBuild}
                    center={this.state.touchBuildMenuPos}

                    onTypeChanged = {this.setTargetBuildState.bind(this, 'type')}
                    onDetailsRequested = {this.props.onDetailsRequested}
                    onBuildConfirmed = {() => {
                        this.props.onBuildConfirmed(); //normal, confirm the build
                        this.setTargetBuildState('type', null);
                        //hide the menu
                        this.setState({touchBuildMenuPos: null});
                    }}
                />);
    }


    toogleTouchBuildMenu(pos){
        this.setState((state) => {
            let ans, np;
            if(!state.touchBuildMenuPos){
                np={
                    x: Math.round((pos.x / this.transform.scale) - this.transform.x),
                    y: Math.round((pos.y / this.transform.scale) - this.transform.y),
                };
                ans = pos;
            }
            else{
                ans = null;
                np = null;
            }

            return {touchBuildMenuPos: ans, targetBuild: {...state.targetBuild, pos: np, type: null}};
        });
    }


    onBuildTargetChange({rawPos, confirmOnDock=false}){
        //update target build pos
        this.setTargetBuildState('pos', {
                x: Math.round((rawPos.x / this.transform.scale) - this.transform.x),
                y: Math.round((rawPos.y / this.transform.scale) - this.transform.y),
            });
    }

    onmousedown(e){
        if(e.target != this.canvas.current)
            return;
        this.isMouseDown = true;
        this.physMousePos = {x:e.pageX , y:e.pageY};
    }
    onmousemove(e){
        if ("ontouchstart" in document.documentElement)
            return; // prenvent mouse move event on touch event

        if(this.isMouseDown){
            if(this.genericDrag({x: this.physMousePos.x, y: this.physMousePos.y}, {x: e.pageX, y: e.pageY})){
                //on drag success, update mouse pos
                this.physMousePos.x = e.pageX;
                this.physMousePos.y = e.pageY;
            }
        }
        else {
            if(e.target != this.canvas.current)
                return;

            this.onBuildTargetChange({rawPos: {x:e.pageX, y : e.pageY}})
        }
    }
    onmouseup(e){
        //we were not dragging, count as a click
        //note : the check 'isMouseDown' is necessary; else, toucheend triger the build confirmation
        if(!this.dragging && this.isMouseDown && this.state.targetBuild.type ){
            let rawPos = {x:e.pageX, y : e.pageY};

            let transformedPos = {
                x: Math.round((rawPos.x / this.transform.scale) - this.transform.x),
                y: Math.round((rawPos.y / this.transform.scale) - this.transform.y),
            };

            this.props.onBuildConfirmed(transformedPos);
        }

        this.isMouseDown = false;
        this.dragging = false;
    }
    onwheel(e){
        this.zoom({
            curX:e.pageX,
            curY:e.pageY,
            deltaY:e.deltaY,
        });
    }
    zoom({curX, curY, deltaY, scale = 0}){
        let origin = {
            x: (curX  / this.transform.scale- this.transform.x),
            y: (curY  / this.transform.scale- this.transform.y)
        };

        this.transform.scale *= (scale === 0? (deltaY > 0? 0.8:1.25):scale);

        //bounds
        this.transform.scale = Math.max(this.transform.scale, Math.pow(0.8, 4));
        this.transform.scale = Math.min(this.transform.scale, Math.pow(1/0.8, 8));

        this.transform.x = curX / this.transform.scale - origin.x;
        this.transform.y = curY / this.transform.scale - origin.y;

        this.draw();
    }

    //called when cursor leaves direct contact with central area
    onmouseleave(e){
        this.setTargetBuildState('pos', null);
    }

    updatetouchstate(touches){
        this.touchstate.touches = touches.map(touch => {
            return {x:touch.pageX, y:touch.pageY};
        });
    }

    ontouchstart(e){
        //maybe we clicked on a map layer button or else. do nothing in that case
        if(e.target != this.canvas.current)
            return;
            e.preventDefault();
        this.updatetouchstate(new Array(...e.touches));


        if(e.touches.length === 1){
            // this.onBuildTargetChange({rawPos: {
            //     x : e.touches[0].pageX,
            //     y : e.touches[0].pageY,
            // }, confirmOnDock: true,})
        }
    }
    ontouchmove(e){
        if(e.target != this.canvas.current)
            return;
            e.preventDefault();
        let touchstate = this.touchstate;
        let touches = new Array(...e.targetTouches);
        if(e.targetTouches.length > 1){//wheel
            let middle = (x0,x1) => Math.abs(x0 + x1)/2,
                d0 = {
                    x: touches[0].pageX,
                    y: touches[0].pageY,
                },
                d1 = {
                    x: touches[1].pageX,
                    y: touches[1].pageY,
                },
                oldd0 = touchstate.touches[0],
                oldd1 = touchstate.touches[1];

            let zoomArg = {
                    curX: middle(d0.x, d1.x),
                    curY: middle(d0.y, d1.y),
                };

            let dist = (x0, y0, x1, y1) =>
                Math.sqrt( Math.pow(x1-x0,2) + Math.pow(y1-y0,2) );
            let currDist = dist(d0.x, d0.y, d1.x, d1.y);
            let oldDist = dist(oldd0.x, oldd0.y, oldd1.x, oldd1.y);

            zoomArg.deltaY = Math.round(oldDist - currDist);
            zoomArg.scale = (currDist/oldDist);

            this.updatetouchstate(touches);
            this.zoom(zoomArg);
            this.dragging = true;

            this.setTargetBuildState('radius',Math.round(50/this.transform.scale));
        }
        else if(this.touchstate.touches.length > 0){
            if(this.genericDrag({x:touchstate.touches[0].x, y:touchstate.touches[0].y}, {x:touches[0].pageX, y:touches[0].pageY})){
                this.updatetouchstate(touches);

            }
        }

        let pos = this.state.touchBuildMenuPos;
        if(pos){
            this.setTargetBuildState('pos', {
                x: Math.round((pos.x / this.transform.scale) - this.transform.x),
                y: Math.round((pos.y / this.transform.scale) - this.transform.y),
            });
        }


        //whut ? move on 0 touches ?
        // else{
        //     this.dragging = true;//used to prevent click when drawing
        //     this.updatetouchstate(touches);
        //     this.draw();
        // }
    }
    ontouchend(e){
        if(e.target != this.canvas.current)
            return;
            e.preventDefault();
        // e.stopImmediatePropagation();

        //it is a click from touch : display the small build menu
        if(!this.dragging){
            let touch = this.touchstate.touches[0];
            this.toogleTouchBuildMenu({x: touch.x, y: touch.y});
        }

        this.touchstate = {touches:[], };
        this.dragging = false;
    }


    // do a drag. return true if drag hapenned
    genericDrag(oldPos, newPos){
        //prevent drag on very small movement
        if(!this.dragging && Math.abs(newPos.x - oldPos.x) + Math.abs(newPos.y - oldPos.y) < 5)
            return false;

        //update transform
        this.dragging = true;

        this.transform.x += (newPos.x - oldPos.x) / this.transform.scale;
        this.transform.y += (newPos.y - oldPos.y) / this.transform.scale;

        this.draw();

        return true;
    }


}
