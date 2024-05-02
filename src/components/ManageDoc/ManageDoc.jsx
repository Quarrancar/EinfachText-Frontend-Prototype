import axios from "axios"
import { useState, useEffect, useRef } from "react"
import './ManageDoc.css'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import CollabListItem from '../CollabListItem/CollabListItem'

const ManageDoc = (props) => {

    const stateProp = props.location.state ? props.location.state.id : null
    const [id] = useState(stateProp)
    const [inputTerm, setInputTerm] = useState("")
    const [title, setTitle] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [collaborators, setCollaborators] = useState([])
    const [loading, setLoading] = useState(true)

    async function getInitialStates() {
        const response = await axios.get(`/api/docs/populated/${id}`)

        setTitle(response.data.data.doc.name)
        setCollaborators(response.data.data.doc.collaborators)

        setLoading(false)
    }

    useEffect(() => {
        getInitialStates()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const inputRef = useRef(null)

    const viewDocHandler = (id) => {
        const idString = `id=${id}`

        props.history.push({
            pathname: '/view',
            search: idString,
        })
    }

    const updateNameHandler = (inputTerm) => {
        async function updateName() {
            try {
                await axios.patch(`/api/docs/${id}`, {
                    name: inputTerm
                })

                setTitle(inputTerm)

                toast.success("Document Renamed!", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 2000
                })

                setInputTerm("")
                inputRef.current.value = ""
                setErrorMessage("")
            } catch (err) {
                setErrorMessage(err.response.data.message)
            }
        }
        updateName()
    }

    const removeCollab = (collaborator) => {
        async function removeInner() {

            try {
                const response = await axios.patch(
                    `/api/docs/${id}/removeCollaborator`,
                    { collabId: collaborator._id }
                )

                if (response.data.status === "success") {
                    setCollaborators(
                        (prevState) => {
                            return prevState.filter(ele => ele._id !== collaborator._id)
                        }
                    )

                    toast.error("Collaborator Removed!", {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 2000
                    })
                }

            } catch (err) {
                setErrorMessage(err.response.data.message)
            }
        }
        removeInner()
    }

    return (
        <div className="container-manage-overall">
            {
                props.location.state
                    ? (
                        <div>
                            {
                                errorMessage
                                    ? <Redirect to={{ pathname: "/error", state: { message: errorMessage } }} />
                                    : null
                            }
                            {
                                loading === true ? <div className="medium progress"><div>Loading…</div></div>
                                    : (
                                        <div className="container-manage-docs" >
                                            <div className="new-doc-card mt-50" >

                                                <div className="add-new-doc">
                                                    <span className="add-btn" disabled >
                                                        <span className="material-icons" >
                                                            edit
                                                        </span>
                                                    </span>

                                                    <h3 className="heading-secondary-manage-docs" >Anpassung des Dokumentnamens</h3>
                                                </div>

                                                <form className="add-new-doc-form-manage-doc"
                                                    onSubmit={
                                                        (e) => {
                                                            e.preventDefault()
                                                            updateNameHandler(inputTerm)
                                                        }
                                                    }
                                                >
                                                    <div style={{ display: "flex" }} >
                                                        <label className="doc-title doc-title-new" 
                                                            style={{ cursor: "pointer" }}
                                                            onClick={ () => viewDocHandler(id) }>
                                                                {title}
                                                        </label>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        placeholder="Neuer Dokumentname"
                                                        ref={inputRef}
                                                        onChange={(e) => setInputTerm(e.target.value)}
                                                        className="doc-title-input"
                                                    />

                                                    <button
                                                        type="submit"
                                                        disabled={!inputTerm}
                                                        className="add-new-doc-btn">
                                                        Speichern
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="docs-card-manage-docs" >
                                                <div className="saved-docs-div" >
                                                    <span className="material-icons  saved-icon" >
                                                        group
                                                    </span>
                                                    <h3 className="heading-secondary-manage-docs-authors" >Autoren</h3>
                                                </div>

                                                {
                                                    collaborators.map(
                                                        (collaborator, index) => {
                                                            return (
                                                                <CollabListItem
                                                                    key={index}
                                                                    collaborator={collaborator}
                                                                    removeCollab={removeCollab}
                                                                />
                                                            )
                                                        }
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                            }
                        </div>
                    )
                    : null
        }
        </div>
    )
}

export default ManageDoc