import React, { Component } from 'react'
import {Card,Form,Button,Col} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit,faUndo,faPlusSquare,faSave} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import MyToast from './MyToast'
export default class Book extends Component {
    constructor(props) {
        super(props)
    
        this.state = this.intialState
        this.state.show=false;
        this.bookChange=this.bookChange.bind(this);
        this.submitBook=this.submitBook.bind(this);
    };
    intialState={
            Username:'',
             Password:''
                };
    componentDidMount(){
        const bookId = +this.props.match.params.id;
        if(bookId)
        {
            this.findBookById(bookId);
    }}
    findBookById =(bookId)=>{
        axios.get("http://localhost:9191/bookById/" +bookId)
        .then(response=>{
            if(response.data !=null){
                this.setState(
                    {
                        Username:response.data.Username,
                        Password:response.data.Password
                    }
                )
            };
        })
        .catch((error)=>{
            console.error("Error -"+error);
        });
    }
    submitBook = event => {
        event.preventDefault();

        const book = {
            Username: this.state.Username,
            Password: this.state.Password
           };

        axios.post("http://localhost:8080/oauth/token?grant_type=client_credentials", book)
            .then(response => {
                if(response.data != null) {
                    this.setState({"show":true,"method":"post"});
                    setTimeout(()=> this.setState({show:false}),3000);
                }
                else
                {
                    this.setState({"show":false});
                }
            });
            this.setState(()=>this.intialState);
    };
    bookChange=event=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    };
    resetBook=()=>{
        this.setState(()=>this.intialState);
    };
    render() {
        const{Username,Password}=this.state;
        return (
            <div>
                <div style={{"display":this.state.show ? "block":"none" }}>
                   <MyToast show={this.state.show} message={"Book Saved Sucessfully"} type={"success"} /> 
                </div>
                <Card className="border border-dark bg-dark text-white">
                <Card.Header><FontAwesomeIcon icon={this.state.id ? faEdit:faPlusSquare} />{"Add New Book"}</Card.Header>
                <Form id="bookFormid" onSubmit={this.submitBook} OnRest={this.resetBook}>
                <Card.Body>
                    <Form.Row>
  <Form.Group as={Col} controlId="formGridTitle">
    <Form.Label>Username</Form.Label>
    <Form.Control required autoComplete="off" type="text" name="Username" value={Username} onChange={this.bookChange} className="bg-dark text-white" placeholder="Enter Book Title" />
  </Form.Group>
  <Form.Group as={Col} controlId="formGridAuthor">
    <Form.Label>Password</Form.Label>
    <Form.Control required autoComplete="off" type="text" name="Password" value={Password} onChange={this.bookChange} className="bg-dark text-white" placeholder="Enter Book Author" />
  </Form.Group>
  </Form.Row>
                </Card.Body>
                <Card.Footer style={{"textAlign":"right"}}>
        <Button size="sm" variant="success" type="submit"><FontAwesomeIcon icon={faSave} />{this.state.id ? "Update":"Save"}</Button>{'  '}
                    <Button size="sm" variant="info" type="reset"><FontAwesomeIcon icon={faUndo} />Reset</Button>{' '}
                </Card.Footer>
                </Form>
            </Card>
            </div>
            
        )
    }
}