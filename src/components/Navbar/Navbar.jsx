import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import LogoutButton from '../LogoutButton/LogoutButton'
import './Navbar.css'
import { io } from 'socket.io-client'

const socket = io()

const Navbar = () => {
    const { loggedIn, currentUser } = useContext(AuthContext)
    const [notificationsArrayLength, setNotificationsArrayLength] = useState([])
    const history = useHistory()
    let imageName = require('../../images/einfach-text-logo.png')

    async function getNotificationsLength() {
        try {
            const response = await axios.get('/api/users/notifications')
            setNotificationsArrayLength(response.data.notifications.length)

        } catch (err) {
            console.log(err.response)
        }
    }

    let username

    if (currentUser) {
        username = <li>{currentUser.username}</li>
    }

    useEffect(() => {
        if(loggedIn === true) {
            getNotificationsLength()
        }
    })

    const socketFunc = (data) => {
        if (currentUser._id === data.notification.reciever) {
            getNotificationsLength()
        }
    }

    const socketTest = () => {
        socket.on('notification-received', socketFunc)
    }

    useEffect(() => {
        if (loggedIn === true && currentUser) {
            socketTest()

            socket.on("notification-deleted-recieved", (data) => {
                if (data.status === "success") {
                    getNotificationsLength()
                }
            })

        }

    })

    return (
        <header>
            <div className="navbar" >

            {
                loggedIn ?
                    <div className="navbar-logo">
                        <div  onClick={() => history.push("/dashboard")} >
                            <img class="logo-image" src={imageName.default} alt="einfach-text-logo"></img>
                        </div>
                    </div>
                : null
            }

            {
                loggedIn === true ? null
                    :   <li>
                            <div className="navbar-logo">
                                <div  onClick={() => history.push("/")} >
                                    <img class="logo-image" src={imageName.default} alt="einfach-text-logo"></img>
                                </div>
                            </div>
                        </li>
            }

                <div className="container flex" >
                    <nav>
                        <ul>
                            {
                                loggedIn === true ? null
                                    : <li id="home-nav"> <Link to="/anmelden" >Anmelden</Link> </li>
                            }

                            {
                                loggedIn === true ? null
                                    : <li id="home-nav"> <Link to="/registrierung" >Registrierung</Link> </li>
                            }

                            {
                                loggedIn ?
                                    <Link to="/dashboard" >{username}</Link>
                                    : null
                            }

                            {
                                loggedIn === true ? (
                                    <div style={
                                        { display: "flex" }
                                    } >
                                        <li>
                                            <Link to="/notifications" className="notification" >

                                                <span className="material-icons">
                                                    notifications
                                                </span>

                                                {
                                                    notificationsArrayLength > 0
                                                        ?<span className="badge">{notificationsArrayLength}</span>
                                                        : null
                                                }
                                            </Link>
                                        </li>
                                    </div>
                                ) : null
                            }

                            {
                                loggedIn === true ? <LogoutButton /> : null
                            }
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Navbar