import { useState } from "react"
import './ErrorPage.css'

const ErrorPage = (props) => {
    const [state] = useState(props.location.state || "false")

    let errorMessage = null;
    if(state.message) {
        if(state.message === "Es existiert kein Dokument oder ID mit dieser bezeichnung!") {
            errorMessage = "Der User hat das Dokument mit der gewählten ID gelöscht!"
        }
        if(state.message === "Sie sind bereits ein Autor!") {
            errorMessage = "Der User hat bereits Zugriff auf das gewünschte Dokument oder ID!"
        }
        else {
            errorMessage = state.message
        }
    }

    return (
        <div className="error-div--main" >
            <div className="error--div" >
                <div className="oops-div" >
                    <h1>Fehler</h1>
                </div>
            </div>

            <div className="error">
                {
                    state !== "false" && state.statusCode
                        ? <div> <h1 className="error-code" > {state.statusCode} Error </h1> </div>
                        : <div><h1 className="error-code" >Error</h1></div>
                }

                {
                    state !== "false" && state.message
                    ? <div> <h2 className="error-message" > { errorMessage } </h2> </div>
                    : null
                }
            </div>
        </div>
    )
}

export default ErrorPage