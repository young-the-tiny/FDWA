import './App.css';
import Navi from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm  from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank'
import SignIn from './components/Signin/Signin'
import Register from './components/Register/Register';
import Particles from './components/ParticlesBG/Particles'
import React, {Component} from 'react'
import Clarifai from 'clarifai'

const app = new Clarifai.App({
 apiKey: '28790ec28b7a4d47ae29902baf2e91fc'
});
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route:'signin',
  isSignedIn:false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  loadUser = (data) =>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
    }})
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) => {
    this.setState({box:box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
     .predict(
      '53e1df302c079b3db8a0a36033ed2d15',
       this.state.input)
     .then(response => {
        if (response){
          fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
              id:this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries:count}))
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
     .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render(){
    const {isSignedIn,imageUrl,route,box } = this.state;
    return(
      <div className='App'>
        <Particles/>
        <Navi isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ?<div>
        <Logo/>
        <Rank 
          name={this.state.user.name} 
          entries={this.state.user.entries}/>
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        :(
          route === 'signin'
        ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        }
      </div>
    )
  }
}

export default App;
