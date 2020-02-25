import React, { Component } from 'react';
import axios from 'axios';
import { encode } from 'url-safe-base64';
import './App.css';
import { AppBar, Typography, Toolbar, Button, Container } from '@material-ui/core';
import ImageUploader from './ImageUploader';
import ModelSelector from './ModelSelector';
import CircularProgress from '@material-ui/core/CircularProgress';



var endpoint = ""
if (process.env.REACT_APP_API === undefined) {
  endpoint = "127.0.0.1:5050"
}
else {
  endpoint = process.env.REACT_APP_API
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      original: [],
      originalb64safe: [],
      result: [],
      models: [],
      loading : false
    }
  }

  componentDidMount() {
    axios.get("http://" + endpoint + "/list").then(
      res => {
        this.setState({ models: res.data })
      }
    ).catch(err => console.log(err))
  }
  handleImageDelete(file) {
    const index = this.state.original.indexOf(file)
    var o = this.state.original
    if (index > -1) {
      o.splice(index, 1);
    }
    this.setState({
      original:o
    })
  }
  handleImageAdd(file) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.setState(prevState => ({
        original: [...prevState.original, file],
      }))
    }
  }
  clear()
  {
    this.setState({
      result : []
    })
  }
  makeRequests() {
    this.state.original.forEach(element => {
    var reader = new FileReader()
    reader.readAsDataURL(element)
    reader.onloadend = () => {
      var encoded = encode(reader.result.split(',')[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''))
      axios.post("http://" + endpoint + "/gen", { "image_b64": encoded }).then(
        res => {
          this.setState(prevState => ({
            result: [...prevState.result, res.data],
          }))
        }
      ).catch(err => { console.error(err) })
    }});
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
      axios.post(process.env.REACT_APP_API, {

        "image_b64": this.state.originalb64safe
      }).then(

        res => {
          this.setState({ result: res.data });
        }
      ).catch(err => { console.error(err) })
    }
  }

  swapModel(model) {
    this.setState({
      loading : true
    })
    axios.post("http://" + endpoint + "/model/" + model.target.value).then(
      res => {
        console.log("RES")
        console.log(res)
        console.log(res.data)
        this.setState({
          loading:false
        })
      }
    ).catch(err => {
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
            <ModelSelector models={this.state.models} onChange={this.swapModel.bind(this)}></ModelSelector>
          </Toolbar>
        </AppBar>


        <ImageUploader onDelete={this.handleImageDelete.bind(this)} onChange={this.handleImageAdd.bind(this)}></ImageUploader>
        <hr></hr>

        <Button variant="contained" color="primary" disabled={(this.state.original.length === 0) || (this.state.loading)} onClick={this.makeRequests.bind(this)}>Colorize</Button>
        {this.state.loading && <CircularProgress size={30}/>}
        <Button variant="contained" color="primary" disabled={(this.state.result.length === 0)} onClick={this.clear.bind(this)}>Clear</Button>

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
