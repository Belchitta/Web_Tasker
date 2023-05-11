import React from 'react';
import logo from './logo.svg';
import './bootstrap/css/bootstrap.min.css'
import './bootstrap/css/sticky-footer-navbar.css'
import Footer from './components/Footer.js'
import Navbar from './components/Menu.js'
import UserList from './components/User.js'
import {ProjectList, ProjectDetail} from "./components/Project";
import ToDoList from "./components/ToDo";
import axios from 'axios'
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  Redirect
} from "react-router-dom";

const DOMAIN = 'http://127.0.0.1:8000'
const get_url = (url) => `${DOMAIN}${url}`

const NotFound404 = ({ location }) => {
    return (
        <div>
            <h1>Страница по адресу '{location.pathname}' не найдена</h1>
        </div>
    )
}


    class App extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                navbarItems: [
                    {name: 'Users', href: '/'},
                    {name: 'Projects', href: '/projects'},
                    {name: 'TODOs', href: '/todos'},
                ],
                users: [],
                projects: [],
                project: {},
                todos: []
            }

        //this.getProject = this.getProject.bind(this);
        }

        render() {
             return (
                  <BrowserRouter>
                          <Navbar navbarItems={this.state.navbarItems} />
                      <main role="main" class="flex-shrink-0">
                          <div className="container">
                            <Routes>
                                <Route path='/' element={<UserList users={this.state.users} />} />
                                <Route path='/projects' element={<ProjectList items={this.state.projects} />} />
                                <Route path='/todos' element={<ToDoList items={this.state.todos} />} />
                                <Route component={NotFound404} />
                                <Route path="/project/:id" element={<ProjectDetail getProject={(id) => this.getProject(id)} item={this.state.project} />} />
                            </Routes>
                          </div>
                      </main>

                    <Footer />
                  </BrowserRouter>


                )
        }

        getProject(id) {
            console.log('call')
            console.log(get_url(`/api/projects/${id}`))
            axios.get(get_url(`/api/projects/${id}`))
            .then(response => {
                console.log(response.data)
                this.setState({project: response.data})
            }).catch(error => console.log(error))
        }



        componentDidMount() {
                axios.get(get_url('/api/users/'))
            .then(response => {
                //console.log(response.data)
                this.setState({users: response.data.results})
            }).catch(error => console.log(error))

            axios.get(get_url('/api/projects/'))
            .then(response => {
                //console.log(response.data)
                this.setState({projects: response.data.results})
            }).catch(error => console.log(error))

            axios.get(get_url('/api/todos/'))
            .then(response => {
                //console.log(response.data)
                this.setState({todos: response.data.results})
            }).catch(error => console.log(error))

        }
    }


    export default App;
