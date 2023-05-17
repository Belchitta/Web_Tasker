import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Redirect
} from "react-router-dom";
import axios from 'axios'
import logo from './logo.svg';
import './bootstrap/css/bootstrap.min.css'
import './bootstrap/css/sticky-footer-navbar.css'
import Footer from './components/Footer.js'
import Navbar from './components/Menu.js'
import UserList from './components/User.js'
import {ProjectList, ProjectDetail} from './components/Project.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/Auth.js'
import ProjectForm from './components/ProjectForm.js'
import ToDoForm from './components/ToDoForm.js'



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
            todos: [],
            auth: {username: '', is_login: false},
            searchText: '',
            tempProjects: []
        }

    //this.getProject = this.getProject.bind(this);
    }

    findProjectsFrontend(text) {
        let filtered_projects = this.state.tempProjects
        if (text != '') {
            filtered_projects = filtered_projects.filter((item) => item.name.includes(text))
        }
        this.setState({projects: filtered_projects})
    }

    searchTextChange(text) {
        this.setState({'searchText': text})
        this.findProjectsFrontend(text)
    }

    findProjects() {
        console.log('Find?')
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        let url = '/api/projects/'
        console.log(this.state.searchText)
        if (this.state.searchText != '') {
            url = `/api/projects/?name=${this.state.searchText}`
        }

        console.log(url)
        axios.get(get_url(url), {headers})
            .then(response => {
                this.setState({projects: response.data.results})
            }).catch(error => console.log(error))

    }

    login(username, password) {
        axios.post(get_url('/api/token/'), {username: username, password: password})
        .then(response => {
            const result = response.data
            const access = result.access
            const refresh = result.refresh
            localStorage.setItem('login', username)
            localStorage.setItem('access', access)
            localStorage.setItem('refresh', refresh)
            this.setState({'auth': {username: username, is_login: true}})
            this.load_data()
        }).catch(error => {
            if (error.response.status === 401) {
                alert('Неверный логин или пароль')
            }
            else {
                console.log(error)
            }
        })
    }

    logout() {
        localStorage.setItem('login', '')
        localStorage.setItem('access', '')
        localStorage.setItem('refresh', '')
        this.setState({'auth': {username: '', is_login: false}})
    }

    createProject(name, repository) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        const data = {name: name, repository: repository}
        const options = {headers: headers}
        axios.post(get_url('/api/projects/'), data, options)
        .then(response => {
            this.setState({projects: [...this.state.projects, response.data]})
        }).catch(error => console.log(error))
    }

    createToDo(project, text) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        const data = {text: text, project: project}
        const options = {headers: headers}
        console.log(data)
        axios.post(get_url('/api/todos/'), data, options)
        .then(response => {
            this.setState({todos: [...this.state.todos, response.data]})
        }).catch(error => console.log(error))
    }

    deleteProject(id) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }
        axios.delete(get_url(`/api/projects/${id}`), {headers, headers})
        .then(response => {
            this.setState({projects: this.state.projects.filter((item)=>item.id != id)})
        }).catch(error => console.log(error))
    }

    deleteToDo(id) {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }
        axios.delete(get_url(`/api/todos/${id}`), {headers, headers})
        .then(response => {
            let todos = [...this.state.todos]
            const todo_index = todos.findIndex((item) => item.id == id)
            let todo = todos[todo_index]
            todo.isActive = false
            this.setState({todos: todos})
        }).catch(error => console.log(error))
    }

    render() {
         return (
              <BrowserRouter>
                  <header>
                    <Navbar navbarItems={this.state.navbarItems} auth={this.state.auth} logout={()=>this.logout()}
searchTextChange={(text)=>this.searchTextChange(text)} findProjects={() => this.findProjects()} />
                  </header>
                  <main role="main" class="flex-shrink-0">
                      <div className="container">
                        <Routes>
                            <Route path='/' element={<UserList users={this.state.users} />} />
                            <Route path='/projects' element={<ProjectList items={this.state.projects} deleteFunction={(id) => this.deleteProject(id)} />} />
                            <Route path='/todos' element={<ToDoList items={this.state.todos} deleteFunction={(id) => this.deleteToDo(id)} />} />
                            <Route path='/login' element={<LoginForm login={(username, password) => this.login(username, password)} />} />
                            <Route path='/project/create' element={<ProjectForm save={(name, repository) => this.createProject(name, repository)} />} />
                            <Route path='/todo/create' element={<ToDoForm save={(project, text) => this.createToDo(project, text)} projects={this.state.projects} />} />
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

        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.get(get_url(`/api/projects/${id}`), {headers})
        .then(response => {
            this.setState({project: response.data})
        }).catch(error => console.log(error))
    }

    load_data() {
        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login)
        {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

            axios.get(get_url('/api/users/'), {headers})
        .then(response => {
            //console.log(response.data)
            this.setState({users: response.data.results})
        }).catch(error => console.log(error))

        axios.get(get_url('/api/projects/'), {headers})
        .then(response => {
            //console.log(response.data)
            this.setState({projects: response.data.results})
            this.setState({tempProjects: response.data.results})
        }).catch(error => console.log(error))

        axios.get(get_url('/api/todos/'), {headers})
        .then(response => {
            //console.log(response.data)
            this.setState({todos: response.data.results})
        }).catch(error => console.log(error))
    }

    componentDidMount() {

        // Получаем значения из localStorage
        const username = localStorage.getItem('login')
        if ((username !== "") & (username !== null)) {
            this.setState({'auth': {username: username, is_login: true}}, () => this.load_data())
        }
    }
}


export default App;