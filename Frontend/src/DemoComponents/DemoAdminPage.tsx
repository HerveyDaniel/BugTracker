import '../Components/AdminPage.css'
import { useContext, useState, useEffect } from 'react';
import useAuth from '../Hooks/useAuth';
import { DemoNavBar } from './DemoPageComponents/DemoNavBar';
import { AppContext } from '../App';
import Axios from "axios";
import Select from 'react-select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DemoProject, DemoTicket, DemoUser } from '../TypeInterfaces/Types';
import { useNavigate } from 'react-router-dom';

export const DemoAdminPage = () => {
    const {setModalContent, setDemoModalState, selectedUserId, setSelectedUserId, setCurrentProject, setSelectedUser} : any = useContext(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const [id, setId] = useState<any>({});
    const [selectedIdValue, setSelectedIdValue] = useState<any>(0);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    
    
    function click(action : any, action2 : any) {
        action();
        action2();
    }
    
    const getAllDemoUsers = async () => {
        try {
        const response = await Axios.get<DemoUser[]>("http://localhost:8080/demo/api/admin/users",
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

    const demousers = useQuery({
        queryKey : ["allDemoUsers"],
        queryFn : getAllDemoUsers
      })
    
    const getAllDemoTickets = async () => {
        try {
        const response = await Axios.get<DemoTicket[]>("http://localhost:8080/demo/api/admin/ticket",
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

    const demotickets = useQuery({
        queryKey : ["allDemoTickets"],
        queryFn : getAllDemoTickets
    })
    
    const getAllDemoProjects = async () => {
        try {
        const response = await Axios.get<DemoProject[]>("http://localhost:8080/demo/api/admin/project",
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

    const demoprojects = useQuery({
        queryKey : ["allDemoProjects"],
        queryFn : getAllDemoProjects
    })
    
    const getDemoUserById = async () => {
        try {
        const response = await Axios.get<DemoUser>(`http://localhost:8080/demo/api/users/${selectedUserId}`,
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
    
    const deleteDemoProject = async ({deleteProjectId} : any) => {
        if(confirm("Are you sure you want to delete this demo project?")) {
            try{
                const response = await Axios.delete<void>(`http://localhost:8080/demo/api/admin/project/${deleteProjectId}`, 
                    {
                        headers: {'Authorization': `Bearer ${token}`},
                    }
                );
                alert("Demo project successfully deleted.");
            } catch (err) {
                /* IMPLEMENT ERROR HANDLING FOR FAILED LOGIN/SERVER RESPONSE */
                alert(err);
            }
        } else {
            return
        }
    }

    const deletedemoproject = useMutation({
        mutationFn : deleteDemoProject,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["allDemoProjects"]})
            queryClient.invalidateQueries({queryKey : ["allDemoTickets"]})
        }
    })
    
    const deleteDemoTicket = async ({deleteTicketId} : any) => {
        if(confirm("Are you sure you want to delete this demo ticket?")) {
            try{
                const response = await Axios.delete<void>(`http://localhost:8080/demo/api/admin/ticket/${deleteTicketId}`, 
                    {
                        headers: {'Authorization': `Bearer ${token}`},
                    }
                );
                alert("Demo ticket successfully deleted.");
            } catch (err) {
                /* IMPLEMENT ERROR HANDLING FOR FAILED LOGIN/SERVER RESPONSE */
                alert(err);
            }
        } else {
            return
        }
    }

    const deletedemoticket = useMutation({
        mutationFn : deleteDemoTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["allDemoTickets"]})
        }
    })
    
    const deleteDemoUser = async ({deleteUserId} : any) => {
        if(auth?.currentUserId === deleteUserId){
            alert("User cannot delete self.")
            return
        } else if(confirm("Are you sure you want to delete this demo user?")) {
            try{
                const response = await Axios.delete<void>(`http://localhost:8080/demo/api/admin/users/${deleteUserId}`, 
                    {
                        headers: {'Authorization': `Bearer ${token}`},
                    }
                );
                alert("Demo user successfully deleted.");
            } catch (err) {
                /* IMPLEMENT ERROR HANDLING FOR FAILED LOGIN/SERVER RESPONSE */
                alert(err);
            }
        } else {
            return;
        }
    }

    const deletedemouser = useMutation({
        mutationFn : deleteDemoUser,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allDemoUsers"]})
        }
    })

    const assignDemoTicket = async ({id, ticketId} : any) => {
        try{
            const response = await Axios.put<DemoTicket>("http://localhost:8080/demo/api/ticket/assign",
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
            alert("Demo ticket has been successfully assigned.");
            return response?.data;
        } catch (err) {
            /* IMPLEMENT ERROR HANDLING FOR FAILED LOGIN/SERVER RESPONSE */
            alert(err);
        }
    }

    const assigndemoticket = useMutation({
        mutationFn : assignDemoTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allDemoTickets"]})
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
            getDemoUserById(), 
            setModalContent({editUser: true}),
            setDemoModalState(true)
        }
    }, [selectedUserId])

    if(demousers?.isLoading || demotickets.isLoading || demoprojects.isLoading) return "Loading...";
    if(demousers?.error) navigate("/"), alert("Error: " + demousers?.error?.message);
    if(demotickets?.error) navigate("/"), alert("Error: " + demotickets?.error?.message);
    if(demoprojects?.error) navigate("/"), alert("Error: " + demoprojects?.error?.message);
    
        return (
                <>
                <DemoNavBar></DemoNavBar>
                <div className="windowContainerAdmin">
                    <div className="priorityWindowAdmin">
                        <div className="projectHeader">
                            <h2>Projects</h2>
                            <button onClick={() => {click(setModalContent({addProject : true, addTicket : false, editUser: false}), setDemoModalState(true))}} className="addTicketButton">Add Project</button>
                        </div>
                        {demoprojects?.data?.map((project : DemoProject) => {
                        return <div className="projectTicketsAdmin" key={project?.projectId}>
                                <div className="ticketText">
                                    <p>{project?.projectName}</p>
                                </div>
                                <div className="ticketText">
                                    <p>Ticket Count: {project?.projectTickets.length}</p>
                                    <p>User Count: {project?.assignedUsers.length}</p>
                                </div>
                                <div className='adminPageButtons'>
                                    <button onClick={() => {setModalContent({editProject : true}), setDemoModalState(true), setCurrentProject(project)}}>Edit</button>
                                    <button onClick={() => deletedemoproject.mutate({deleteProjectId : project?.projectId})} className = "logoutButton">Delete</button>
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="ticketTypeWindowAdmin">
                        <div className="projectHeader">
                            <h2>Tickets</h2>
                        </div>
                        {demotickets?.data?.map((ticket : DemoTicket) => {
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
                                    options={demousers?.data?.map((user : DemoUser) => {
                                        return(
                                            { label : user?.username, value : user }
                                        )
                                    })}
                                    onChange={handleChange}
                                    placeholder= "Assign To"
                                    />
                                    <button onClick={() => assigndemoticket.mutate({id : selectedIdValue?.id, ticketId : ticket?.ticketId})} >Assign</button>
                                    <button onClick={() => deletedemoticket.mutate({deleteTicketId :  ticket?.ticketId})} className = "logoutButton">Delete</button>
                                </div>
                            </div>
                        </div>
                        })}
                    </div>

                    <div className="progressWindowAdmin">
                        <div className="projectHeader">
                            <h2>Users</h2>
                            <button onClick={() => {click(setModalContent({addUser : true}), setDemoModalState(true))}} className="addTicketButton">Add User</button>
                        </div>
                        {demousers?.data?.map((user : DemoUser) => {
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
                                    <button onClick={() => deletedemouser.mutate({deleteUserId : user?.id})} className = "logoutButton">Delete</button>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                </>
            )
    } 