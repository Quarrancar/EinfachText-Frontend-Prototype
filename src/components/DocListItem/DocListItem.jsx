import React from 'react'

const DocListItem = ({ doc, currentUser, viewDocHandler, manageDocumentHandler, deleteDocHandler, downloadDocumentHandler }) => {
    return (
        <div className="single-doc" >
            <div className="name-div" >
                <h3
                    className="heading-secondary doc-name"
                    onClick={id => viewDocHandler(doc._id)}>
                    {doc.name}
                </h3>
            </div>

            {
                doc.collaborators.includes(currentUser._id)
                    ? <div className="user-role--div">Autor</div>
                    : <div className="user-role--div">Admin</div>
            }

            {
                doc.collaborators.includes(currentUser._id)
                    ? <div className="buttons-div"></div>
                    : (<div className="buttons-div">

                        <span
                            className="material-icons manage-btn" alt="einstellungen"
                            onClick={(id) => manageDocumentHandler(doc._id)}>
                                more_vert
                        </span>

                        {/* <span
                            className="material-icons file_download" alt="file_download"
                            onClick={(id) => downloadDocumentHandler(doc._id)}>
                                file_download
                        </span> */}


                        <span
                            className="material-icons delete-doc-icon" alt="löschen"
                            onClick={(id) => deleteDocHandler(doc._id)}>
                                delete
                        </span>

                    </div>)
            }
        </div>
    )
}

export default DocListItem