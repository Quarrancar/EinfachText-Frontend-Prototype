import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { Redirect } from "react-router"
import AuthContext from "../../context/AuthContext"
import './Notifications.css'
import { useHistory } from 'react-router-dom'
import io from "socket.io-client"

const socket = io()

const Notifications = () => {
    const { loggedIn } = useContext(AuthContext)

    const [loading, setLoading] = useState(true)
    const [notificationsArray, setNotificationsArray] = useState([])
    const [btnDis, setBtnDis] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const history = useHistory()

    async function getNotifications() {
 
        if (loggedIn) {
            try {
                const response = await axios.get('/api/users/notifications')
                setNotificationsArray(response.data.notifications)
                setLoading(false)

            } catch (err) {
                setErrorMessage(err.response.data.message)
            }

        } else {
            history.push({
                pathname: "/anmelden"
            })
        }
    }

    useEffect(() => {
        getNotifications()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    const acceptHandler = (senderId, docId, notificationId) => {
        async function acceptRequest() {

            try {
                setBtnDis(true)
                const response = await axios.post(`/api/users/${docId}`, {
                    senderId: senderId
                })

                if (response.data.status === "success") {
                    const response = await axios.delete(`/api/notifications/${notificationId}`)
                    if (response.data.status === "success") {
                        getNotifications()
                        setBtnDis(false)

                        socket.emit("notification-deleted-sent", { status: "success" })
                    }
                }

            } catch (err) {
                setErrorMessage(err.response.data.message)
            }
        }
        acceptRequest()
    }

    const declineHandler = (notificationId) => {
        async function declineRequest() {
            const response = await axios.delete(`/api/notifications/${notificationId}`)

            if (response.data.status === "success") {
                getNotifications()
                socket.emit("notification-deleted-sent", { status: "success" })
            }
        }
        declineRequest()
    }

    return (
        <>
            {
                loading === true ? <div className="medium progress" ><div>Loading...</div></div>
                    : (
                        <div className="notifications-container" >
                            {
                                errorMessage
                                    ? <Redirect to={{ pathname: "/error", state: { message: errorMessage } }} />
                                    : null
                            }

                            {
                                !loggedIn
                                    ? <Redirect to="/anmelden" />
                                    : null
                            }

                            <div className="heading-secondary" >
                                <h2>Mitteilungen</h2>
                            </div>

                            {
                                notificationsArray
                                    ? notificationsArray.map((notification, index) => {
                                        if (notification) {
                                            return (
                                                <div key={index} className="single-notification" >

                                                    <div className="notif-div" >{notification.notification}</div>

                                                    <div>
                                                        <button
                                                            onClick={
                                                                () => {
                                                                    acceptHandler(notification.sender, notification.doc, notification._id)
                                                                }
                                                            }
                                                            className="accept-btn"
                                                            disabled={btnDis}

                                                        >Annehmen</button>

                                                        <button
                                                            onClick={
                                                                () => declineHandler(notification._id)
                                                            }
                                                            className="decline-btn"
                                                            disabled={btnDis}
                                                        >Ablehnen</button>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return null
                                        }
                                    })
                                    : null
                            }
                        </div>
                    )
            }
        </>
    )
}

export default Notifications