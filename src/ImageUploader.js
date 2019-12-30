import React, { Component } from 'react'
import {DropzoneArea} from 'material-ui-dropzone'
export default class ImageUploader extends Component {
    render() {
        return (
            <div>
                <DropzoneArea onDrop={this.props.onChange} acceptedFiles={['image/*']} filesLimit={1} dropzoneText="Drag and drop an image here or select a file to upload">
                </DropzoneArea>
            </div>
        )
    }
}
