import React,{Component} from 'react';
import axios from 'axios';
import {encode} from 'url-safe-base64';
import './App.css';
import {AppBar,Typography,Toolbar} from '@material-ui/core';
import ImageUploader from './ImageUploader';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      original: null,
      originalb64safe:"",
      result:null
    }
  }

  handleImageUpload(file) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.setState({
        original:file,
        originalb64safe:encode(reader.result.split(',')[1].slice(0,-2))
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

        <ImageUploader onChange={this.handleImageUpload.bind(this)}></ImageUploader>
        {
          !this.state.result?
          
            <h3>Expecting image</h3>
          :
            <img src={"data:image/png;base64,"+this.state.result} alt=""/>
        }
      </div>
    )
  }
}

export default App;
