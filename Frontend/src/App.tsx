import { useState, createContext} from 'react'
import { BrowserRouter as Router, Routes, Route, Link , Navigate} from 'react-router-dom'
import { Layout } from './Components/Layout'
import { Login } from './Components/Login'
import { Home } from './Components/Home'
import { Projects } from './Components/Projects'
import { Tickets } from './Components/Tickets'
import { Modal } from './Components/PageComponents/Modal'
import { IndividualTicket } from './Components/IndividualTicket'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthComponents } from './Components/AuthComponents';
import { IndividualProject } from './Components/IndividualProject'
import { AdminPage } from './Components/AdminPage'
import { DemoHome } from './DemoComponents/DemoHome' 
import { DemoAdminPage } from './DemoComponents/DemoAdminPage'
import { DemoAuthComponents } from './DemoComponents/DemoAuthComponents'
import { DemoIndividualProject } from './DemoComponents/DemoIndividualProject'
import { DemoIndividualTicket } from './DemoComponents/DemoIndividualTicket'
import { DemoProjects } from './DemoComponents/DemoProjects'
import { DemoTickets } from './DemoComponents/DemoTickets'
import { DemoModal } from './DemoComponents/DemoPageComponents/DemoModal'
import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from './AxiosRequests/Requests'

interface Project{

}

interface Ticket {

}

interface User {
  id : number;
  username : string;
  password : string;
  assignedProject : Project
  assignedTickets : Ticket[];
}

interface DemoUser{

}

export const AppContext = createContext({});
/* Sets an authentication useState above the return statement
if false, will be redirected login; if true, gets sent to Home.
Might have to use a Store to give a component access to modify this state*/
function App() {
  const [isAuthenticated, setAuthentication] = useState<boolean>(true)
  const [showModal, setModalState] = useState<boolean>(false)
  const [showDemoModal, setDemoModalState] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState<any>([]);
  const [tickets, setTickets] = useState<any>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>({});
  const [selectedUserId, setSelectedUserId] = useState<any>(0)
  const [selectedUser, setSelectedUser] = useState<any>({})
  const [projects, setProjects] = useState<any>([]);
  const [currentProjectId, setCurrentProjectId] = useState(0);
  const [currentProject, setCurrentProject] = useState({});
  const [modalContent, setModalContent] = useState<any>({
    addProject : false,
    editProject : false,
    addTicket : false,
    editTicket : false,
    addUser : false,
    editUser : false
  });

  const [allUsers, setAllUsers] = useState<any>([]);
  const [allProjects, setAllProjects] = useState<any>([]);
  const [allTickets, setAllTickets] = useState<any>([]);


  const authProp = {
    allowedRoles: ["USER", "ADMIN"],
    adminRole: ["ADMIN"]
  }

  const demoAuthProp = {
    allowedRoles: ["DEMOADMIN"]
  }

  const updateAllUsers = (newUser : any, id : any) => {
    if(Array.isArray(newUser)){
      const newUsersArray = [];
      for(let i = 0; i < allUsers.length; i++) {
        if(!(allUsers[i]?.id === id)) {
            newUsersArray.push(allUsers[i]);
        }
      }
      setAllUsers(newUsersArray)

    } else if (typeof id !== 'undefined' && typeof newUser !== 'undefined') {
      const newUsersArray = [];
      for(let i = 0; i < allUsers.length; i++) {
        if(allUsers[i]?.id === id){
          allUsers[i] = newUser;
          newUsersArray.push(allUsers[i]);
        } else {
          newUsersArray.push(allUsers[i]);
        }
      }
      setAllUsers(newUsersArray)

    } else {
      setAllUsers([...allUsers, newUser]);
    }
  }

  const updateAllTickets = (newTicket : any, id : any) => {
    if(Array.isArray(newTicket)){
      const newTicketArray = [];
      for(let i = 0; i < allTickets.length; i++) {
        if(!(allTickets[i]?.ticketId === id)) {
            newTicketArray.push(allTickets[i]);
        }
      }
      setAllTickets(newTicketArray)
    } else if(typeof id !== 'undefined' && typeof newTicket !== 'undefined') {
      const newTicketsArray = [];
      for(let i = 0; i < allTickets.length; i++) {
        if(allTickets[i]?.ticketId === id){
          allTickets[i] = newTicket;
          newTicketsArray.push(allTickets[i]);
        } else {
          newTicketsArray.push(allTickets[i]);
        }
      }
      setAllTickets(newTicketsArray)

    } else {
      setAllTickets([...allTickets, newTicket]);
    }
  }

  const updateAllProjects = (newProject : any, id : any) => {
    if(Array.isArray(newProject)){
      const newProjectsArray = [];
      for(let i = 0; i < allProjects.length; i++) {
        if(!(allProjects[i]?.projectId === id)) {
            newProjectsArray.push(allProjects[i]);
        }
      }
      setAllProjects(newProjectsArray)

    } else if (typeof id !== 'undefined' && typeof newProject !== 'undefined'){
      const newProjectsArray = [];
      for(let i = 0; i < allProjects.length; i++) {
        if(allProjects[i]?.projectId === id){
          allProjects[i] = newProject;
          newProjectsArray.push(allProjects[i]);
        } else {
          newProjectsArray.push(allProjects[i]);
        }
      }
      setAllProjects(newProjectsArray)

    } else {
      setAllProjects([...allProjects, newProject]);
    }
  }

  const projectContextObj = {users, setUsers, currentUser, setCurrentUser, 
  tickets, setTickets, projects, setProjects, currentProjectId, setCurrentProjectId, 
  currentProject, setCurrentProject, selectedTicket, setSelectedTicket, modalContent, 
  selectedUserId, setSelectedUserId, setModalContent, setModalState, setDemoModalState, 
  selectedUser, setSelectedUser, allUsers, setAllUsers, allProjects, setAllProjects, allTickets, setAllTickets,
  updateAllUsers, updateAllProjects, updateAllTickets}

  return (
    <>
    <AppContext.Provider value={projectContextObj}>
    {showModal && <Modal setModalState={setModalState}/>}
    {showDemoModal && <DemoModal setDemoModalState={setDemoModalState}/>}
    <div>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/" element={<Login />}/>

            <Route element={<AuthComponents authProp={authProp}/>}>
              <Route path="/home" element={isAuthenticated ? <Home setModalState={setModalState} authProp={authProp}/> : <Navigate to='/login'/>}/>
              <Route path="/projects" element={<Projects />}/>
              <Route path="/tickets" element={<Tickets />}/>
              <Route path="/ticket" element={<IndividualTicket />}/>
              <Route path="/project" element={<IndividualProject />}/>
              <Route path="/admin" element={<AdminPage />}/>
            </Route>

            <Route element={<DemoAuthComponents demoAuthProp={demoAuthProp}/>}>
              <Route path="/demohome" element={isAuthenticated ? <DemoHome setDemoModalState={setDemoModalState} demoAuthProp={demoAuthProp}/> : <Navigate to='/login'/>}/>
              <Route path="/demoprojects" element={<DemoProjects />}/>
              <Route path="/demotickets" element={<DemoTickets />}/>
              <Route path="/demoticket" element={<DemoIndividualTicket />}/>
              <Route path="/demoproject" element={<DemoIndividualProject />}/>
              <Route path="/demoadmin" element={<DemoAdminPage />}/>
            </Route>
          
          <Route path="/" element={<Login />}/>
          <Route path="*" element={<h2>Page not found!</h2>}/>
          <Route path="/unauthorized" element={<h2>User not authorized to view content.</h2>}/>
        </Route>
      </Routes>
      <ReactQueryDevtools/>
    </div>
    </AppContext.Provider>
    </>
  )
}

export default App
/* Put this code back under the Router tag when ready
          <nav>
            <Link to="/">Home</Link>
          </nav>
*/