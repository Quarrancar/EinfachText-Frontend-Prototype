import React, { useContext } from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import './HomePage.css'

const HomePage = () => {
    const { loggedIn } = useContext(AuthContext)
    const history = useHistory()
    let imageNameHomePage = require("../../images/einfach-text-2.png")

    const homeNotLoggedIn = (
        <div className="main-div" >
            
            <div className="main-content--div" >

                <div className="main-content-content--div">

                    <h2 className="heading-secondary-home" >Die Web-Applikation für Texterstellung und Kollaboration</h2>
                    <p>
                        Erstelle, verwalte und teile deine Text-Dokumente
                        mit «EinfachText» überall und zu jeder Zeit entweder
                        alleine oder mittels live Kollaboration zwischen
                        mehreren Autoren; oder schau dir die Notifikationen an,
                        welche zum jeweiligen Dokument erstellt wurden!
                    </p>

                    <button className="anmelden-button--sm"
                        onClick={
                            () => {
                                history.push("/anmelden")
                            }
                        }
                    >Anmelden</button>
                </div>

                <div className="main-content-image--div" >
                    <img id="main-content-image" src={imageNameHomePage.default} alt="einfach-text"  ></img>   
                </div>
                        
            </div>
        </div>
    )

    return (
        <>
            {
                loggedIn ? <Redirect to="/dashboard" /> : homeNotLoggedIn
            }
        </>
    )
}

export default HomePage