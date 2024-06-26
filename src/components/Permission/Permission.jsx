import axios from "axios"
import { useContext, useRef, useState } from "react"
import { Redirect } from "react-router"
import AuthContext from "../../context/AuthContext"
import './Permission.css'
import { useHistory } from 'react-router-dom'

import io from "socket.io-client";
const socket = io()

const Permission = (props) => {
    const { loggedIn } = useContext(AuthContext)
    const history = useHistory()
    const buttonRef = useRef(null)
    const [errorMessage, setErrorMessage] = useState("")

    async function handleClick() {
        const docId = props.location.state.docId

        try {
            buttonRef.current.disabled = true
            const response = await axios.post(`/api/users/notifications/requestAccess`, {
                docId
            })

            if(response.data.status === "success") {
                socket.emit("notification-sent", { notification: response.data.notification })
                history.push({
                    pathname: "/"
                })
            }
        } catch (err) {
            setErrorMessage(err.response.data.message)
        }
    }

    return (

        <div className="main" >
            {
                errorMessage
                ? <Redirect to={{ pathname: "/error", state: { message: errorMessage } }} />
                : null
            }

            {
                !loggedIn
                    ? <Redirect to='/anmelden' />
                    : null
            }

            {
                props.location.state
                    ? (
                        <div className="permission-container" >

                            <div className="err-div" >
                                <h1>Dokumentanfrage</h1>
                            </div>

                            <div className="content-div">
                                <h2>{props.location.state.message}</h2>
                                <button
                                    className="send-request-btn"
                                    onClick={
                                        () => handleClick()
                                    }
                                    ref={ buttonRef }
                                >Zugang anfragen</button>
                            </div>
                        </div>
                    )
                    : <Redirect to="/" />
            }
        </div>
    )
}

export default Permission