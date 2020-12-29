// Copyright 2020, ASBL Math for climate, All rights reserved.

// page index.html

import { tr } from '../../../tr.js';

function WeCool(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement("img", { src: "res/icons/" + props.icon, alt: "climath " + props.title, width: "60" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "h3",
                null,
                tr(props.title)
            ),
            props.children
        )
    );
}

export function Index(props) {
    var body = [React.createElement(
        "div",
        { className: "pane hFlex", id: "pane1", key: "intro" },
        React.createElement(
            "div",
            { id: "carousel" },
            React.createElement("img", { src: "res/brol/earth_wind.png", alt: "earth wind" })
        ),
        React.createElement(
            "div",
            { id: "doTheMath", className: "vFlex" },
            React.createElement(
                "h2",
                null,
                tr("How can we reach carbon neutrality by 2050 ?"),
                " "
            ),
            React.createElement(
                "ul",
                { className: "default" },
                ["Build your own low carbon scenario in 10 minutes", "Understand the tradeoffs of each technologies", "Learn the math behind energies"].map(function (i) {
                    return React.createElement(
                        "li",
                        { key: i.substr(0, 2) },
                        tr(i)
                    );
                })
            ),
            React.createElement(
                "a",
                { className: "button black", href: "play.html" },
                tr("Play now")
            )
        )
    ), React.createElement(
        "div",
        { className: "pane vFlex", id: "paneWeCool", key: "cool" },
        React.createElement(
            "div",
            { className: "weCoolList" },
            React.createElement(
                WeCool,
                { title: "Accessible", icon: "fastEasy.png" },
                React.createElement(
                    "p",
                    null,
                    "Climath allows you to compare plans via tangible socio-economical criteria, such as ",
                    React.createElement(
                        "i",
                        null,
                        "tax increase"
                    ),
                    " or ",
                    React.createElement(
                        "i",
                        null,
                        "usable land reduction"
                    ),
                    "."
                ),
                React.createElement(
                    "p",
                    null,
                    "Climath enable you to test a scenario in a matter of minutes."
                ),
                React.createElement(
                    "p",
                    null,
                    "Climath is free."
                )
            ),
            React.createElement(
                WeCool,
                { title: "Accurate", icon: "accuracy.png" },
                React.createElement(
                    "p",
                    null,
                    "Climath uses accurates models."
                )
            )
        ),
        React.createElement(
            "div",
            { className: "weCoolList" },
            React.createElement(
                WeCool,
                { title: "Transparent", icon: "transparency.png" },
                React.createElement(
                    "p",
                    null,
                    "Climath details all the equations and data it uses. We strive to document our assumptions."
                ),
                React.createElement(
                    "p",
                    null,
                    " The code is open source. "
                ),
                React.createElement(
                    "p",
                    null,
                    "Climath is developped by ",
                    React.createElement(
                        "i",
                        null,
                        "Math for Climate ASBL"
                    ),
                    " a non profit organisation, independent from any market player."
                )
            ),
            React.createElement(
                WeCool,
                { title: "Respectfull of your convictions", icon: "listening.png" },
                React.createElement(
                    "p",
                    null,
                    "All the default assumptions climath uses can be personalized, which means that your simulations are made-to-measure."
                ),
                React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "i",
                        null,
                        "For example, if you think that our energy consumption will be divided by 10 in 2050, you can make a simulation with that hypothesis."
                    )
                )
            )
        )
    )];

    return body;
}