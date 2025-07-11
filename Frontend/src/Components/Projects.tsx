import { NavBar } from "./PageComponents/NavBar";
import { useNavigate } from "react-router-dom";
import './Projects.css'
import { useState, useEffect, useContext } from "react";
import  Axios  from "axios";
import useAuth from '../Hooks/useAuth';
import { AppContext } from "../App";
import { useQuery, useQueryClient} from "@tanstack/react-query";
import { Project, Ticket, User } from "../TypeInterfaces/Types";

export const Projects = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const {setUsers, setCurrentProject, setSelectedTicket, setModalState, setModalContent} : any = useContext(AppContext);

    const navigate = useNavigate();
    const authRole = ["ADMIN"];
    const [userProject, setUserProject] = useState<any>({});
    let currentProjectId : number = 0;
    const queryClient = useQueryClient();
 
    function handleClick(id : number) {
        currentProjectId = id;
        refetch();
    }

    function checkRole(auth : any){
        if(auth?.userRoles?.find((role : any) => authRole.includes(role))) {
            return true;
        }
        return false;
    }

    const getAllProjects = async () => {
        try{
            const response = await Axios.get<Project[]>('http://localhost:8080/api/admin/project', 
                {
                    headers: {'Authorization': `Bearer ${token}`},
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
        queryFn : getAllProjects,
        enabled : checkRole(auth)
    })

    const findProjectById = async (currentProjectId : number) => {
        try{
            const response = await Axios.get<Project>(`http://localhost:8080/api/admin/project/${currentProjectId}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            console.log(JSON.stringify(response?.data));
            setCurrentProject(response?.data);
            return response?.data;
        } catch (err) {
            alert(err);
        }
    }

    const {data : projectById, refetch} = useQuery({
        queryKey : ["projectById"],
        queryFn : () => findProjectById(currentProjectId),
        enabled : false
    })

    const getUserProject = async (id : number) => {
        try{
            const response = await Axios.get<Project>(`http://localhost:8080/api/project/userproject/${id}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            console.log(JSON.stringify(response?.data));
            setUserProject(response?.data);
            setUsers(response?.data?.assignedUsers)
            return response?.data;
        } catch (err) {
            alert(err);
        }
    }

    const userproject = useQuery({
        queryKey : ["userproject", id],
        queryFn : () => getUserProject(id)
    })

    function click(action: any, action2: any) {
        action();
        action2();
    }


    useEffect (() => {
        queryClient.resetQueries({queryKey : ["projectById"]});
    }, [queryClient])

    if(projects?.isLoading) return "Loading...";
    if(projects?.error) navigate("/"), alert("Error: " + projects?.error?.message);
    
    return (
        <>
        <NavBar></NavBar>
        <div className="projectContainer">
            {auth?.userRoles?.find((role : any) => authRole.includes(role))
                ? <div className="project">
                    <div className="projectHeader">
                        <h2>Project Name</h2>
                        <button onClick={() => {click(setModalContent({addTicket : true}), setModalState(true))}} className="addTicketButton">Add Ticket</button>
                    </div>
                    {projects?.data?.map((project : Project) => {
                        return <div className="projectTickets" key={project?.projectId}>
                            <h4>{project?.projectName}</h4>
                            <button onClick={() => {handleClick(project?.projectId)}}>Select</button>
                            <button onClick={() => {handleClick(project?.projectId), navigate("/project")}}>View</button>
                            <p>Ticket Count: {project?.projectTickets.length}</p>
                            <p>User Count: {project?.assignedUsers.length}</p>
                        </div>
                    })}
                </div>
                : <div className="project">
                    <div className="projectHeader">
                        <h2>{userproject?.data?.projectId} - {userproject?.data?.projectName}</h2>
                        <button onClick={() => {click(setModalContent({addTicket : true}), setModalState(true))}} className="addTicketButton">Add Ticket</button>
                    </div>
                    <div className="projectTickets">
                        <p>{userproject?.data?.projectDescription}</p>
                        <p>Ticket Count: {userproject?.data?.projectTickets.length}</p>
                        <p>User Count: {userproject?.data?.assignedUsers.length}</p>
                    </div>
                </div>
            }
            <div className="members">
                <div className="teamHeader">
                    <h2>Team Members</h2>
                </div>
                {projectById?.assignedUsers || !(auth?.userRoles?.find((role : any) => authRole.includes(role)))
                    ?   auth?.userRoles?.find((role : any) => authRole.includes(role))
                            ?   projectById?.assignedUsers?.map((user : User) => {
                                return <div className="projectTickets" key={user?.id}>
                                    <p>Id# {user?.id}</p> 
                                    <p>{user?.username}</p>
                                    <p>Role: {user?.role}</p>
                                    </div>})
                            :   userproject?.data?.assignedUsers?.map((user : User) => {
                                return <div className="projectTickets" key={user?.id}>
                                    <p>Id# {user?.id}</p> 
                                    <p>{user?.username}</p>
                                    <p>Role: {user?.role}</p>
                                    </div>})
                    :   <p id="defaultMessage">Select a project to see assigned users.</p>
                }
            </div>
        </div>
        <div className="tickets">
            <div className="ticketHeader">
                <h2>Tickets</h2>
            </div>
            {projectById?.projectTickets || !(auth?.userRoles?.find((role : any) => authRole.includes(role)))
                ?   auth?.userRoles?.find((role : any) => authRole.includes(role))
                        ? projectById?.projectTickets?.map((ticket : Ticket) => {
                            return <div className="projectTickets" key={ticket?.ticketId}>
                            <p>Ticket title: {ticket?.ticketTitle}</p>
                            <p>Assigned User: {ticket?.assignedUsers?.username}</p>
                            <p>Priority: {ticket?.priorityStatus}</p>
                            <p>Type: {ticket?.ticketType}</p>
                            <p>Progress: {ticket?.ticketProgress}</p>
                            <button onClick={() => {setSelectedTicket(ticket), navigate('/ticket')}}>View</button>
                                </div>})
                        : userproject?.data?.projectTickets?.map((ticket : Ticket) => {
                            return <div className="projectTickets" key={ticket?.ticketId}>
                            <p>Ticket Title: {ticket?.ticketTitle}</p>
                            <p>Assigned User: {ticket?.assignedUsers?.username}</p>
                            <p>Priority: {ticket?.priorityStatus}</p>
                            <p>Type: {ticket?.ticketType}</p>
                            <p>Progress: {ticket?.ticketProgress}</p>
                            <button onClick={() => {setSelectedTicket(ticket), navigate('/ticket')}}>View</button>
                            </div>})
                :   <p id="defaultMessage">Select a project to see assigned tickets.</p>
            }
        </div>
        </>
    )
}