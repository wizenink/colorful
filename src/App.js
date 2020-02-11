import React, { Component } from 'react';
import axios from 'axios';
import { encode } from 'url-safe-base64';
import './App.css';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import ImageUploader from './ImageUploader';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      original: [],
      originalb64safe: [],
      result: []
    }
  }
  handleImageAdd(file) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.setState(prevState => ({
        original: [...prevState.original, file],
        originalb64safe: [...prevState.originalb64safe, encode(reader.result.split(',')[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''))]
      }))
    }
  }

  makeRequests() {
    var responses = []
    this.state.originalb64safe.forEach(element => {
      console.log(element)
      axios.post('process.env.REACT_APP_API', { "image_b64": element }).then(
        res => {
          this.setState(prevState => ({
            result: [...prevState.result, res.data],
          }))
        }
      ).catch(err => { console.error(err) })
    });
  }
  handleImageUpload(file) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      console.log(reader.result)
      this.setState({
        original: file,
        originalb64safe: encode(reader.result.split(',')[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''))
      })
      console.log(process.env.REACT_APP_API)
      axios.post(process.env.REACT_APP_API,{
        
        "image_b64":this.state.originalb64safe}).then(

      res => {
        this.setState({result:res.data});
      }
    ).catch(err => {console.error(err)})
    }
  }

  render() {
    return (
      <div>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Colorful
            </Typography>
          </Toolbar>
        </AppBar>

        
        <ImageUploader onChange={this.handleImageAdd.bind(this)}></ImageUploader>
        <hr></hr>
        <button onClick={this.makeRequests.bind(this)}>
          Activate Lasers
        </button>

        {this.state.result.map(image => {
          return (<img src={"data:image/png;base64," + image} alt="" />
          )
        })
        }
      </div>
    )
  }
}

export default App;
