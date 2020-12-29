

export function About(props){
    return [
        <div className="pane" id="paneASBL" key="paneASBL">
        <div className="vFlex">
            <h2>ASBL Math for climate</h2>
            <img src="res/icons/climath512.png" alt="logo climath" />
        </div>

        <div className="vFlex">
            <div>
                <h3>Mission</h3>
                <p>
                    Most people have unrealistic hopes about how climate change can be tackled.
                    Putting in place coherent measures is therefore a political suicide,
                    since the collective imagination is not ready to accept the associated socio-economical compromises.
                </p>
                <p>
                    It is therefore essential that citizens have an informed opinion on the subject.
                </p>
                <p>
                    Sadly, that's easier said than done :
                    The IPCC's recomandations are very technical, incorrect simplifications are common and misinformation is omnipresent.
                </p>
                <p>
                    <i>Climath</i>'s mission is the popularisation of the issue of carbon neutrality, its model and its data.
                </p>
            </div>
            <div>
                <h3>Vision</h3>
                <p>
                    We hope that this project will enable a future in which citizens,
                    properly informed and sharing the value of a sustainable economy,
                    will support the most effective measures to make our carbon emissions zero.
                </p>
            </div>

        </div>
    </div>,
    <div className="pane vFlex" id="paneContact" key="paneContact">
        <h2>
            Our team
        </h2>
        <div id="pplList">

            <div className="vFlex pplDescr">
                <img src="res/brol/louis.jpg" alt="louis regout " className="pp"/>
                <h3>Louis Regout</h3>
                <p>
                    Louis Regout is passionnate about green energies and video games coding.
                </p>
                <p>
                    He started working on <i>Climath</i> because he was fascinated but unsatisfied by a course in energy economics.
                    He performs mathematical modeling and coding.
                </p>
            </div>
            <div className="vFlex pplDescr">
                <img src="res/brol/ched.jpeg" alt="Charles-Edwin de Brouwer" className="pp"/>
                <h3>
                    Charles-Edwin de Brouwer
                </h3>
                <p>
                    Charles-Edwin de Brouwer  is passionate about education and  sees in this project an essential key to raising everyone's interest in this issue.
                </p>
                <p>
                    He is specialized in coding.
                </p>
            </div>
            <div className="vFlex pplDescr">
                <img src="res/brol/unknownperson.png" alt="We want you" className="pp"/>
                <h3>
                    Want to help ?
                </h3>
                <p>
                    Do you feel that fighting for the climate needs smart decisions ?
                </p>
                <p>
                    There are <a href="todo.html">countless actions</a> you can do to help us,
                    ranging from sharing this website to joinging the team.
                </p>

            </div>
        </div>

    </div>,
    <div className="pane vFlex" id="paneThanks" key="tks">
        <h2>Contributors</h2>
        <div>
            We thanks
            <ul>
                <li>
                    Madeline Regout and Audrey Dessain for their reviews.
                </li>
                <li>
                    Mme de Brouwer, for the contacts she gave us.
                </li>
                <li>
                    Lancelot de Halleux for his support and reviews.
                </li>
                <li>
                    Dr. Thomas Pardoen for his expertise.
                </li>
                <li>
                    Tanguy della Faille for his entrepeuneurship advises.
                </li>
            </ul>



        </div>

    </div>]
}
