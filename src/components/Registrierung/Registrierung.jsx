import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../../context/AuthContext'
import { Redirect, useHistory } from 'react-router'
import './Registrierung.css'

const Registrierung = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleUserChange = (event) => {
        setUsername(event.target.value);
      };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };

    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
    
    const handlePasswordConfirmChange = (event) => {
        setPasswordConfirm(event.target.value);
      };  

    const { loggedIn } = useContext(AuthContext)

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const registrierungData = {
            username,
            email,
            password,
            passwordConfirm
        }

        try {
            await axios.post("/api/users/registrierung", registrierungData)

            history.push({
                pathname: '/anmelden'
            })

        } catch (err) {
            if (err.response.data.status === "fail") {
                setErrorMessage(err.response.data.message)
            }
        }

    }

    return (
        <div className="center" >


            <h1>Registrierung</h1>

            {
                loggedIn ? <Redirect to="/dashboard" /> : null
            }

            {
                errorMessage
                    ? <div className="error-box" > <p className="error-text" > {errorMessage} </p> </div>
                    : null
            }


            <form className="anmelden-form" onSubmit={(e) => handleSubmit(e)} >

                <div className="text-field" >
                    <input type="text" placeholder="Username"
                        value={username}
                        onClick={handleUserChange}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="text-field" >
                    <input type="email" placeholder="Email"
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
                    <span></span>
                </div>

                <div className="text-field" >
                    <input type="password" placeholder="Passwort bestätigen"
                        value={passwordConfirm}
                        onClick={handlePasswordConfirmChange}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    // New
                    disabled={! username || !email || !password || !passwordConfirm}
                    // New
                    className="registrierung-button"
                >
                    Registrierung
                </button>

            </form>
        </div>
    )
}

export default Registrierung