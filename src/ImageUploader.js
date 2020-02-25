import React, { Component } from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
export default class ImageUploader extends Component {
    render() {
        return (
            <div>
                <DropzoneArea onDelete={this.props.onDelete} onDrop={this.props.onChange} acceptedFiles={['image/*']} dropzoneText="Drag and drop an image here or select a file to upload">
                </DropzoneArea>
            </div>
        )
    }
}
