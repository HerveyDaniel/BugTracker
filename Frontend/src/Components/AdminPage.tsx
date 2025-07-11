import { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import './AdminPage.css'
import { NavBar } from './PageComponents/NavBar'
import { AppContext } from '../App'
import useAuth from '../Hooks/useAuth'
import Axios from "axios";
import Select from 'react-select';
import { Project, Ticket, User } from '../TypeInterfaces/Types'
import { useNavigate } from 'react-router-dom'

export const AdminPage = () => {
const {setModalContent, setModalState, selectedUserId, setSelectedUserId, setCurrentProject, setSelectedUser} : any = useContext(AppContext);
const { auth } : any = useAuth();
const navigate = useNavigate();
const token = auth?.jwt;
const [id, setId] = useState<any>({});
const [selectedIdValue, setSelectedIdValue] = useState<any>(0);
const queryClient = useQueryClient();

function click(action : any, action2 : any) {
    action();
    action2();
}

const getAllUsers = async () => {
    const response = await Axios.get<User[]>("http://localhost:8080/api/admin/users",
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
    );
    console.log(JSON.stringify(response?.data));
    return response?.data;
}

const users = useQuery({
    queryKey : ["allUsers"],
    queryFn : getAllUsers
  })

const getAllTickets = async () => {
    try {
    const response = await Axios.get<Ticket[]>("http://localhost:8080/api/admin/ticket",
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
    );
    console.log(JSON.stringify(response?.data));
    return response?.data;
    } catch (err) {
        alert(err);
    }      
}

const tickets = useQuery({
    queryKey : ["allTickets"],
    queryFn : getAllTickets
})

const getAllProjects = async () => {
    try {
    const response = await Axios.get<Project[]>("http://localhost:8080/api/admin/project",
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
    );
    console.log(JSON.stringify(response?.data));
    return response?.data;
    } catch (err) {
        alert(err);
    }      
}

const projects = useQuery({
    queryKey : ["allProjects"],
    queryFn : getAllProjects
})

const getUserById = async () => {
    try {
    const response = await Axios.get<User>(`http://localhost:8080/api/users/${selectedUserId}`,
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
    );
    console.log(JSON.stringify(response?.data));
    setSelectedUser(response?.data);
    } catch (err) {
        alert(err);
    }      
}

const deleteProject = async ({deleteProjectId} : any) => {
    if(confirm("Are you sure you want to delete this project?")) {
        try{
            const response = await Axios.delete<void>(`http://localhost:8080/api/admin/project/${deleteProjectId}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            alert("Project successfully deleted.");
        } catch (err) {
            alert(err);
        }
    } else {
        return
    }
}

const deleteproject = useMutation({
    mutationFn : deleteProject,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey : ["allProjects"]})
    }
})

const deleteTicket = async ({deleteTicketId} : any) => {
    if(confirm("Are you sure you want to delete this ticket?")) {
        try{
            const response = await Axios.delete<void>(`http://localhost:8080/api/admin/ticket/${deleteTicketId}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            alert("Ticket successfully deleted.");
        } catch (err) {
            alert(err);
        }
    } else {
        return
    }
}

const deleteticket = useMutation({
    mutationFn : deleteTicket,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey : ["allTickets"]})
    }
})

const deleteUser = async ({deleteUserId} : any) => {
    if(auth?.currentUserId === deleteUserId) {
        alert("User cannot delete self.");
        return
    } else if(confirm("Are you sure you want to delete this user?")) {
        try{
            const response = await Axios.delete<void>(`http://localhost:8080/api/admin/users/${deleteUserId}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            alert("User successfully deleted.");
        } catch (err) {
            alert(err);
        }
    } else {
        return
    }
}

const deleteuser = useMutation({
    mutationFn : deleteUser,
    onSuccess : () => {
        queryClient.invalidateQueries({queryKey : ["allUsers"]})
    }
})

const assignTicket = async ({id, ticketId} : any) => {
    
    try{
        const response = await Axios.put<Ticket>("http://localhost:8080/api/ticket/assign",
            {
                id : id,
                ticketId : ticketId
            },
            {
                headers: {'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'}
            }
        );
        console.log(JSON.stringify(response?.data));
        alert("Ticket has been successfully assigned.");
        return response?.data;
    } catch (err) {
        alert(err);
    }
}

const assignticket = useMutation({
    mutationFn : assignTicket,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allTickets"]})
    }
})

const handleChange = (selectedOption : any) => {
    setId(selectedOption)
  };

function updateRole(){
    setSelectedIdValue(id?.value)
}

    useEffect(() => {
        if(id?.value){
            updateRole();
        }
    }, [id])

    useEffect(() => {
        if(selectedUserId !== 0) {
            getUserById(), 
            setModalContent({editUser: true}),
            setModalState(true)
        }
    }, [selectedUserId])


    if(users?.isLoading || tickets.isLoading || projects.isLoading) return "Loading...";
    if(users?.error) navigate("/"), alert("Error: " + users?.error?.message);
    if(tickets?.error) navigate("/"), alert("Error: " + tickets?.error?.message);
    if(projects?.error) navigate("/"), alert("Error: " + projects?.error?.message);

    return (
            <>
            <NavBar></NavBar>
            <div className="windowContainerAdmin">
                <div className="priorityWindowAdmin">
                    <div className="projectHeader">
                        <h2>Projects</h2>
                        <button onClick={() => {click(setModalContent({addProject : true, addTicket : false, editUser: false}), setModalState(true))}} className="addTicketButton">Add Project</button>
                    </div>
                    {projects?.data?.map((project : Project) => {
                    return <div className="projectTicketsAdmin" key={project?.projectId}>
                            <div className="ticketText">
                                <p>{project?.projectName}</p>
                            </div>
                            <div className="ticketText">
                                <p>Ticket Count: {project?.projectTickets.length}</p>
                                <p>User Count: {project?.assignedUsers.length}</p>
                            </div>
                            <div className='adminPageButtons'>
                                <button onClick={() => {setModalContent({editProject : true}), setModalState(true), setCurrentProject(project)}}>Edit</button>
                                <button onClick={() => deleteproject.mutate({deleteProjectId : project?.projectId})} className = "logoutButton">Delete</button>
                            </div>
                        </div>
                    })}
                </div>
                <div className="ticketTypeWindowAdmin">
                    <div className="projectHeader">
                        <h2>Tickets</h2>
                    </div>
                    {tickets?.data?.map((ticket : Ticket) => {
                    return <div className="projectTicketsAdmin" key={ticket?.ticketId}>
                        <div className="ticketText">
                            <p>Ticket ID#: {ticket?.ticketId}</p>
                            <p>Ticket Title: {ticket?.ticketTitle}</p>
                        </div>
                        <div className="ticketText">
                            {ticket?.assignedUsers == null
                                ?<p>No User assigned</p>
                                :<>
                                <p>Assigned to: {ticket?.assignedUsers?.username}</p>
                                <p>User Id#: {ticket?.assignedUsers?.id}</p>
                                </>
                            }
                            <div className='assignButtons'>
                                <Select
                                isSearchable
                                name="colors"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={users?.data?.map((user : User) => {
                                    return(
                                        { label : user?.username, value : user }
                                    )
                                })}
                                onChange={handleChange}
                                placeholder= "Assign To"
                                />
                                <button onClick={() => assignticket.mutate({id : selectedIdValue?.id, ticketId : ticket?.ticketId})} >Assign</button>
                                <button onClick={() => deleteticket.mutate({deleteTicketId :  ticket?.ticketId})} className = "logoutButton">Delete</button>
                            </div>
                        </div>
                    </div>
                    })}
                </div>
                <div className="progressWindowAdmin">
                    <div className="projectHeader">
                        <h2>Users</h2>
                        <button onClick={() => {click(setModalContent({addUser : true}), setModalState(true))}} className="addTicketButton">Add User</button>
                    </div>
                    {users?.data?.map((user : User) => {
                        return <div className="projectTicketsAdmin" key={user?.id}>
                                    <div className="ticketText">
                                        <p>Id#: {user?.id}</p>
                                        <p>Name: {user.username}</p>
                                    </div>
                                    <div className="ticketText">
                                        <p>Role: {user?.role}</p>
                                    </div>
                                    <div className='adminPageButtons'>
                                        <button onClick={() => {setSelectedUserId(user?.id)}}>Edit User</button>
                                        <button onClick={() => deleteuser.mutate({deleteUserId : user?.id})} className = "logoutButton">Delete</button>
                                    </div>
                                </div>
                    })}
                </div>
            </div>
            </>
        )
} 