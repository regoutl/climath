

export function About(props) {
    return [React.createElement(
        "div",
        { className: "pane", id: "paneASBL", key: "paneASBL" },
        React.createElement(
            "div",
            { className: "vFlex" },
            React.createElement(
                "h2",
                null,
                "ASBL Math for climate"
            ),
            React.createElement("img", { src: "res/icons/climath512.png", alt: "logo climath" })
        ),
        React.createElement(
            "div",
            { className: "vFlex" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "h3",
                    null,
                    "Mission"
                ),
                React.createElement(
                    "p",
                    null,
                    "Most people have unrealistic hopes about how climate change can be tackled. Putting in place coherent measures is therefore a political suicide, since the collective imagination is not ready to accept the associated socio-economical compromises."
                ),
                React.createElement(
                    "p",
                    null,
                    "It is therefore essential that citizens have an informed opinion on the subject."
                ),
                React.createElement(
                    "p",
                    null,
                    "Sadly, that's easier said than done : The IPCC's recomandations are very technical, incorrect simplifications are common and misinformation is omnipresent."
                ),
                React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "i",
                        null,
                        "Climath"
                    ),
                    "'s mission is the popularisation of the issue of carbon neutrality, its model and its data."
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "h3",
                    null,
                    "Vision"
                ),
                React.createElement(
                    "p",
                    null,
                    "We hope that this project will enable a future in which citizens, properly informed and sharing the value of a sustainable economy, will support the most effective measures to make our carbon emissions zero."
                )
            )
        )
    ), React.createElement(
        "div",
        { className: "pane vFlex", id: "paneContact", key: "paneContact" },
        React.createElement(
            "h2",
            null,
            "Our team"
        ),
        React.createElement(
            "div",
            { id: "pplList" },
            React.createElement(
                "div",
                { className: "vFlex pplDescr" },
                React.createElement("img", { src: "res/brol/louis.jpg", alt: "louis regout ", className: "pp" }),
                React.createElement(
                    "h3",
                    null,
                    "Louis Regout"
                ),
                React.createElement(
                    "p",
                    null,
                    "Louis Regout is passionnate about green energies and video games coding."
                ),
                React.createElement(
                    "p",
                    null,
                    "He started working on ",
                    React.createElement(
                        "i",
                        null,
                        "Climath"
                    ),
                    " because he was fascinated but unsatisfied by a course in energy economics. He performs mathematical modeling and coding."
                )
            ),
            React.createElement(
                "div",
                { className: "vFlex pplDescr" },
                React.createElement("img", { src: "res/brol/ched.jpeg", alt: "Charles-Edwin de Brouwer", className: "pp" }),
                React.createElement(
                    "h3",
                    null,
                    "Charles-Edwin de Brouwer"
                ),
                React.createElement(
                    "p",
                    null,
                    "Charles-Edwin de Brouwer  is passionate about education and  sees in this project an essential key to raising everyone's interest in this issue."
                ),
                React.createElement(
                    "p",
                    null,
                    "He is specialized in coding."
                )
            ),
            React.createElement(
                "div",
                { className: "vFlex pplDescr" },
                React.createElement("img", { src: "res/brol/unknownperson.png", alt: "We want you", className: "pp" }),
                React.createElement(
                    "h3",
                    null,
                    "Want to help ?"
                ),
                React.createElement(
                    "p",
                    null,
                    "Do you feel that fighting for the climate needs smart decisions ?"
                ),
                React.createElement(
                    "p",
                    null,
                    "There are ",
                    React.createElement(
                        "a",
                        { href: "todo.html" },
                        "countless actions"
                    ),
                    " you can do to help us, ranging from sharing this website to joinging the team."
                )
            )
        )
    ), React.createElement(
        "div",
        { className: "pane vFlex", id: "paneThanks", key: "tks" },
        React.createElement(
            "h2",
            null,
            "Contributors"
        ),
        React.createElement(
            "div",
            null,
            "We thanks",
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    "Madeline Regout and Audrey Dessain for their reviews."
                ),
                React.createElement(
                    "li",
                    null,
                    "Mme de Brouwer, for the contacts she gave us."
                ),
                React.createElement(
                    "li",
                    null,
                    "Lancelot de Halleux for his support and reviews."
                ),
                React.createElement(
                    "li",
                    null,
                    "Dr. Thomas Pardoen for his expertise."
                ),
                React.createElement(
                    "li",
                    null,
                    "Tanguy della Faille for his entrepeuneurship advises."
                )
            )
        )
    )];
}