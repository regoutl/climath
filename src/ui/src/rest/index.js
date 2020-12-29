// Copyright 2020, ASBL Math for climate, All rights reserved.

// page index.html

import {tr} from '../../../tr.js';


function WeCool(props){
    return (
        <div>
            <div>
                <img src={"res/icons/" + props.icon} alt={"climath " + props.title} width="60"/>
            </div>
            <div>
                <h3>{tr(props.title)}</h3>
                {props.children}
            </div>
        </div>
    );
}

export function Index (props){
        let body = [
        	<div className="pane hFlex" id="pane1" key="intro">
        		<div id="carousel">
        			<img src="res/brol/earth_wind.png" alt="earth wind"  />
        		</div>
        		<div id="doTheMath" className="vFlex">
        			<h2>{tr("How can we reach carbon neutrality by 2050 ?")} </h2>
        			<ul className="default">
                        {
                            ["Build your own low carbon scenario in 10 minutes",
                            "Understand the tradeoffs of each technologies",
                            "Learn the math behind energies"
                        ].map(i => <li key={i.substr(0, 2)}>{tr(i)}</li>)
                        }
        			</ul>
        			<a className="button black" href="play.html">
        				{tr("Play now")}
        			</a>

        		</div>
        	</div>,
            <div className="pane vFlex" id="paneWeCool" key="cool">
                <div className="weCoolList">
                    <WeCool title="Accessible" icon="fastEasy.png">
                        <p>
                            Climath allows you to compare plans via tangible socio-economical criteria, such as <i>tax increase</i> or <i>usable land reduction</i>.
                        </p>
                        <p>
                            Climath enable you to test a scenario in a matter of minutes.
                        </p>
                        <p>
                            Climath is free.
                        </p>
                    </WeCool>
                    <WeCool title="Accurate" icon="accuracy.png">
                        <p>
                            Climath uses accurates models.
                        </p>
                    </WeCool>
                </div>
                <div className="weCoolList">
                    <WeCool title="Transparent" icon="transparency.png">
                        <p>
                            Climath details all the equations and data it uses. We strive to document our assumptions.
                        </p>
                        <p> The code is open source. </p>
                        <p>
                            Climath is developped by <i>Math for Climate ASBL</i> a non profit organisation,
                            independent from any market player.
                        </p>
                    </WeCool>
                    <WeCool title="Respectfull of your convictions" icon="listening.png">
                        <p>
                            All the default assumptions climath uses can be personalized, which means that your simulations are made-to-measure.
                        </p>
                        <p>
                            <i>For example, if you think that our energy consumption will be divided by 10 in 2050, you can make a simulation with that hypothesis.</i>
                        </p>
                    </WeCool>
                </div>
            </div>

        ];

        return body;

}
