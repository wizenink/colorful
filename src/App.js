import React, { Component } from 'react';
import axios from 'axios';
import { encode } from 'url-safe-base64';
import './App.css';
import { AppBar, Typography, Toolbar,Button,Container} from '@material-ui/core';
import ImageUploader from './ImageUploader';
import ModelSelector from './ModelSelector';



var endpoint = ""
if(process.env.REACT_APP_API === undefined)
{
  endpoint = "127.0.0.1:5050"
}
else
{
  endpoint = process.env.REACT_APP_API
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      original: [],
      originalb64safe: [],
      result: [],
      models: []
    }
  }

  componentDidMount()
  {
    axios.get("http://"+endpoint+"/list").then(
      res => {
        this.setState({models:res.data})
      }
    ).catch(err => console.log(err))
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
    this.state.originalb64safe.forEach(element => {
      axios.post("http://"+endpoint+"/gen", { "image_b64": element }).then(
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

  swapModel(model) {
    axios.post("http://"+endpoint+"/model/"+model.target.value).then(
      res => {
        console.log("RES")
        console.log(res)
        console.log(res.data)}
    ).catch(err => 
      {
        console.log("ERROR")
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Typography variant="h5" color="inherit">
              Colorful
            </Typography>
            <ModelSelector models={this.state.models} onChange={this.swapModel}></ModelSelector>
          </Toolbar>
        </AppBar>

        
        <ImageUploader onChange={this.handleImageAdd.bind(this)}></ImageUploader>
        <hr></hr>
      
        <Button variant="contained" color="primary" disabled={(this.state.originalb64safe.length===0)} onClick={this.makeRequests.bind(this)}>Colorize</Button>
       
        <Container>
        {this.state.result.map(image => {
          return (<img src={"data:image/png;base64," + image} alt="" />
          )
        })
        }
        </Container>
      </div>
    )
  }
}

export default App;
