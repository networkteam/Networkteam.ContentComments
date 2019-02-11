import React, {PureComponent} from 'react';
import {Button, IconButton, TextArea} from "@neos-project/react-ui-components";
import {connect} from 'react-redux';
import {$set, $get} from 'plow-js';

function stringToColor(baseString = '') {
    let color = '#';
    let hash = 0;

    for (let i = 0; i < baseString.length; i++) {
        hash = baseString.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}


const CommentView = ({note, deleteNote, updateNote, noteIndex}) => {
    const borderColor = note.userColor || stringToColor(note.user) || '#000';

    return (<div style={
            {
                backgroundColor: noteIndex % 2 == 0 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                paddingLeft: 5,
                paddingRight: 5,
                paddingTop: 5,
                paddingBottom: 18,
                borderLeftWidth: 5,
                borderLeftColor: borderColor,
                borderLeftStyle: 'solid'
            }
        }>
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
        const notes = props.value && JSON.parse(props.value);

        this.state = {
            notes,
            newNote: ''
        }
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
            user: this.props.userName,
            userColor: stringToColor(this.props.userName)
        }

        this.addComment(comment)
    }

    // I thought about updating every comment, if it has no color but skipped it.
    // This function might be useful in the future though
    updateNote = (index, newValues) => {
        let currentNotes = this.state.notes;
        const editedNote = {...currentNotes[index], ...newValues};

        currentNotes[index] = editedNote;
        this.props.commit(JSON.stringify(currentNotes));
        this.setState({notes: currentNotes});
    }

    deleteNote = index => () => {
        this.updateNote(index, {deleted: true})
    }

    newNoteFieldChange = (value) => {
        this.setState({
            newNote: value
        })
    }

    render() {
        return (
            // todo improve styling via css and selectors to respect deleted notes and indices
          <div className="comments-editor">
            {this.state.notes && this.state.notes.map((note, index) => (
              !note.deleted && <CommentView note={note} key={index} noteIndex={index} deleteNote={this.deleteNote} updateNote={this.updateNote}/>
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
