import React, {PureComponent} from 'react';
import {Button, IconButton, TextArea} from "@neos-project/react-ui-components";
import {connect} from 'react-redux';
import {$set, $get} from 'plow-js';


const CommentView = ({note, deleteNote, noteIndex}) => {
    return (<div style={{backgroundColor: noteIndex % 2 == 0 ? 'rgba(255, 255, 255, 0.2)' : 'transparent', paddingLeft: 5, paddingRight: 5,paddingTop: 5, paddingBottom: 18}}>
        <header>
            <span style={{fontStyle: 'italic', fontSize: 12, verticalAlign: 'middle'}}>
                {new Date(note.date).toISOString().slice(0, 16).replace('T', ' ')}: {note.user}
            </span>
            <span style={{float: 'right'}}>
              <IconButton icon="trash" hoverStyle="warn" onClick={deleteNote(noteIndex)} />
            </span>
        </header>
        <div>
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
        return (
          <div className="comments-editor">
            {this.state.notes.map((note, index) => (
              <CommentView note={note} key={index} noteIndex={index} deleteNote={this.deleteNote}/>
            ))}
            <div style={{marginTop: 20}}>
              <TextArea onChange={this.newNoteFieldChange} value={this.state.newNote}/>
            </div>
            <div style={{marginTop: 15}}>
              <Button onClick={this.addNewNote}>Add comment</Button>
            </div>
          </div>);
    }

}

const mapStateToProps = (state) => {
    return {
        userName: $get('user.name.fullName', state)
    }
}

export default connect(mapStateToProps)(ContentCommentEditor)
