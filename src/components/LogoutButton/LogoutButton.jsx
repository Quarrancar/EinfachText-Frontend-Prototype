import axios from "axios"
import { useContext } from "react"
import AuthContext from "../../context/AuthContext"
import React from "react";
import '../LogoutButton/LogoutButton.css'

const LogoutButton = () => {
    const { getLoggedInState } = useContext(AuthContext)

    async function abmelden() {
        await axios.get('/api/users/abmelden')
        getLoggedInState()
        window.location.reload()
    }

    return (
        <div>
            <button className="logout-button"
                    onClick={abmelden}
            >
                Abmelden
            </button>
        </div>
    )
}


export default LogoutButton