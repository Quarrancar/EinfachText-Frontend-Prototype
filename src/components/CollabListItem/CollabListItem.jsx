import React from 'react'

const CollabListItem = ({ collaborator, removeCollab }) => {
    return (
        <div className="collaborators-div" >
            <div className="username-div" >
                <p>{collaborator.username}</p>
            </div>
            <span className="material-icons delete-doc-icon-manage-docs"
                onClick={
                    () => {
                        removeCollab(collaborator)
                    }
                }
            >delete</span>
        </div>
    )
}

export default CollabListItem
