import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../../context/AuthContext'
import { Redirect, useHistory } from 'react-router'
import './Anmelden.css'

const Anmelden = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const { loggedIn, getLoggedInState } = useContext(AuthContext)


    // New
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };

    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };  
    // New  

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const anmeldenData = {
            email,
            password,
        }

        try {
            await axios.post("/api/users/anmelden", anmeldenData)

            getLoggedInState()
            history.push("/dashboard")
        }

        catch (err) {
            if (err.response.data.status === "fail") {
                setErrorMessage(err.response.data.message)
            }
        }
    }

    return (
        <div className="center" >
            <h1>Anmelden</h1>

            {
                loggedIn ? <Redirect to="/dashboard" /> : null
            }

            {
                errorMessage
                    ? <div className="error-box" > <p className="error-text" > { errorMessage } </p> </div>
                    : null
            }

            <form className="anmelden-form" onSubmit={(e) => handleSubmit(e)} >

                <div className="text-field" >
                    <input type="email" placeholder="E-Mail"
                        value={email}
                        onClick={handleEmailChange}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="text-field" >
                    <input type="password" placeholder="Passwort"
                        value={password}
                        onClick={handlePasswordChange}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!email || !password}
                    className="anmelden-button">
                    Anmelden
                </button>
            </form>
        </div>
    )
}

export default Anmelden