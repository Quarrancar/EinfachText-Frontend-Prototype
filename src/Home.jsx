import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import './Home.css'
import AuthContext from './context/AuthContext'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import DocListItem from './components/DocListItem/DocListItem'

const Home = (props) => {
    const [title, setTitle] = useState("")
    const [docs, setDocs] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(true)

    const { currentUser } = useContext(AuthContext)

    const history = useHistory()

    const clickHandler = async () => {
        async function createNewDoc() {
            try {
                const newDoc = await axios.post('/api/docs', {
                    name: title
                }, { withCredentials: true })

                const docId = newDoc.data.data.doc._id
                return docId
            } catch (err) {
                setErrorMessage(err.response.data.message)
            }
        }

        const docId = await createNewDoc()

        if (docId) {
            const docIdString = `id=${docId}`

            props.history.push({
                pathname: "/new",
                search: docIdString,
            })
        }
    }

    async function getAllDocs() {
        const docs = await axios.get('/api/docs')

        setDocs(docs.data.data.docs)
        setLoading(false)
    }

    useEffect(() => {
        getAllDocs()
    }, [])

    const viewDocHandler = (id) => {
        const idString = `id=${id}`

        props.history.push({
            pathname: '/view',
            search: idString,
        })
    }

    const deleteDocHandler = async (id) => {
        try {
            await axios.delete(`/api/docs/${id}`)

            getAllDocs()

            toast.error("Document Deleted!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 2000
            })

        } catch (err) {
            console.log(err)
        }
    }

    // const downloadDocumentHandler = (id) => {
    //     const idString = `id=${id}`

    //     props.history.push({
    //         pathname: '/view',
    //         search: idString,
    //     })
    // }


    const manageDocumentHandler = (id, title, collaborators) => {
        history.push({
            pathname: '/dokumentverwaltung',
            state: {
                id,
                title,
                collaborators
            }
        })
    }

    return (
        <>
            {
                loading === true
                    ? <div className="medium progress"><div>Loading…</div></div>
                    : null
            }

            {
                loading === false ? (
                    <div className="dashboard-container" >
                        <div className="new-doc-card" >
                            <div className="add-new-doc" >
                                <span className="add-btn" disabled >
                                    <span className="material-icons" >
                                        add
                                    </span>
                                </span>
                                <h3 className="heading-secondary-dashboard" >Neues Dokument erstellen</h3>
                            </div>

                            <span className="line">
                            <form className="add-new-doc-form" >
                                <div style={{ display: "flex" }} >
                                    
                                    <label className="doc-title" ></label>
                                    {
                                        errorMessage !== "" && <div className="error-box-home" > <p className="error-text-home" > {errorMessage} </p> </div>
                                    }
                                </div>
                                <input
                                    type="text"
                                    placeholder="Dokumentname"
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}
                                    className="doc-title-input"
                                />

                            <button 
                                    type="submit"
                                    onClick={
                                        (e) => {
                                            e.preventDefault()
                                            clickHandler()
                                        }
                                    }
                                    disabled={!title}
                                    className="add-new-doc-btn"
                                >
                                    Speichern
                            </button>          

                            </form>
                            </span>
                        </div>
                    </div>
                )
                    : null
            }

            {   loading === false ?
                    (
                        <div className="docs-card" >
                            <div className="saved-docs-div" >
                                <span className="material-icons  saved-icon" >
                                    save
                                </span>
                                <h3 className="heading-secondary-dashboard-documents" >Gespeicherte Dokumente</h3>
                            </div>
                            <div className="document-titles-dashboard">
                            {
                                docs.map((doc, index) => {
                                    return (
                                        <DocListItem  
                                            key={index} 
                                            doc={doc} 
                                            currentUser={currentUser}
                                            viewDocHandler={viewDocHandler}
                                            manageDocumentHandler={manageDocumentHandler}
                                            deleteDocHandler={deleteDocHandler}
                                            // downloadDocumentHandler={downloadDocumentHandler}
                                        />
                                    )
                                })
                            }
                            </div>
                            
                        </div>
                    )
                    : null
            }
        </>
    )
}

export default Home