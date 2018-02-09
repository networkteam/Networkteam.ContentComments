import React, {PureComponent} from 'react';
import {Button, IconButton, TextArea} from "@neos-project/react-ui-components";
import {connect} from 'react-redux';
import {$set, $get} from 'plow-js';


const CommentView = ({note, deleteNote, noteIndex}) => {
    return (<div className="neos-single-comment">
        <header>
            <span>
                {new Date(note.date).toISOString().slice(0, 16).replace('T', ' ')}: {note.user}
            </span>
            <IconButton icon="trash" className="neos-delete-comment" onClick={deleteNote(noteIndex)} />
        </header>
        <div className="neos-comment-text">
            {note.comment}
        </div>
    </div>)
}

class ContentCommentEditor extends PureComponent {

    constructor(props) {
        super(props);

        const notes = JSON.parse(props.value);

        this.state = {
            notes,
            newNote: ''
        }
    }

    updateComments = (value) => {
        const notes = JSON.parse(value)
        this.setState({notes})
    }

    addComment = comment => {
        const newArray = [
            ...this.state.notes, comment
        ]

        this.props.commit(JSON.stringify(newArray))
        this.setState({notes: newArray, newNote: ''})
    };

    addNewNote = () => {
        if (!this.state.newNote) {
            return
        }
        
        let comment = {
            date: new Date(),
            comment: this.state.newNote,
            user: this.props.userName
        }

        this.addComment(comment)
    }

    deleteNote = (index) => () => {
        let currentNotes = this.state.notes
        currentNotes.splice(index, 1);
        this.props.commit(JSON.stringify(currentNotes))
        this.setState({notes: currentNotes})
    }

    newNoteFieldChange = (value) => {
        this.setState({
            newNote: value
        })
    }

    render() {
        console.log(this.props)
        return (<div className="comments-editor">{this.state.notes.map((note, index) => (
            <CommentView note={note} key={index} noteIndex={index} deleteNote={this.deleteNote}/>
        ))}
        <TextArea onChange={this.newNoteFieldChange} value={this.state.newNote}/>
            <Button onClick={this.addNewNote}>Add comment</Button>
        </div>);
    }

}

const mapStateToProps = (state) => {
    return {
        userName: $get('user.name.fullName', state)
    }
}

export default connect(mapStateToProps)(ContentCommentEditor)
