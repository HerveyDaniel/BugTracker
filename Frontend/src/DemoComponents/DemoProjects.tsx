import { DemoNavBar } from "./DemoPageComponents/DemoNavBar";
import { useNavigate } from "react-router-dom";
import '../Components/Projects.css'
import { useState, useEffect, useContext } from "react";
import  Axios  from "axios";
import useAuth from "../Hooks/useAuth";
import { AppContext } from "../App";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DemoProject, DemoTicket, DemoUser } from "../TypeInterfaces/Types";

export const DemoProjects = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const {setUsers, setCurrentProject, setSelectedTicket, setDemoModalState, setModalContent} : any = useContext(AppContext);
    const navigate = useNavigate();
    const authRole = ["DEMOADMIN"];
    const [userProject, setUserProject] = useState<any>({});
    let currentProjectId : number = 0;
    const queryClient = useQueryClient();

    function handleClick(id : number) {
        currentProjectId = id;
        refetch();
    }

    const getDemoProjects = async () => {
        try{
            const response = await Axios.get<DemoProject[]>('http://localhost:8080/demo/api/admin/project', 
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

    const demoprojects = useQuery({
        queryKey : ["allDemoProjects"],
        queryFn : getDemoProjects
    })

    const findDemoProjectById = async (currentProjectId : number) => {
        try{
            const response = await Axios.get<DemoProject>(`http://localhost:8080/demo/api/admin/project/${currentProjectId}`, 
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

    const {data : demoProjectById, refetch} = useQuery({
        queryKey : ["demoProjectById"],
        queryFn : () => findDemoProjectById(currentProjectId),
        enabled : false
    })

    const getDemoUserProject = async (id : number) => {
        try{
            const response = await Axios.get<DemoProject>(`http://localhost:8080/demo/api/project/userproject/${id}`, 
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

    const demouserproject = useQuery({
        queryKey : ["demouserproject", id],
        queryFn : () => getDemoUserProject(id)
    })


    function click(action: any, action2: any) {
        action();
        action2();
    }

    useEffect (() => {
        queryClient.resetQueries({queryKey : ["demoProjectById"]});
    }, [queryClient])

    if(demoprojects?.isLoading) return "Loading...";
    if(demoprojects?.error) navigate("/"), alert("Error: " + demoprojects?.error?.message);

    return (
        <>
        <DemoNavBar></DemoNavBar>
        <div className="projectContainer">
            {auth?.userRoles?.find((role : any) => authRole.includes(role))
                ? <div className="project">
                    <div className="projectHeader">
                        <h2>Project Name</h2>
                        <button onClick={() => {click(setModalContent({addTicket : true}), setDemoModalState(true))}} className="addTicketButton">Add Ticket</button>
                    </div>
                    {demoprojects?.data?.map((project : DemoProject) => {
                        return <div className="projectTickets" key={project?.projectId}>
                            <h4>{project?.projectName}</h4>
                            <p>Ticket Count: {project?.projectTickets.length}</p>
                            <p>User Count: {project?.assignedUsers.length}</p>
                            <button onClick={() => {handleClick(project?.projectId)}}>Select</button>
                            <button onClick={() => {handleClick(project?.projectId), navigate("/demoproject")}}>View</button>
                        </div>
                    })}
                </div>
                : <div className="project">
                    <div className="projectHeader">
                        <h2>{demouserproject?.data?.projectId} - {demouserproject?.data?.projectName}</h2>
                        <button onClick={() => {click(setModalContent({addTicket : true}), setDemoModalState(true))}} className="addTicketButton">Add Ticket</button>
                    </div>
                    <div className="projectTickets">
                        <p>{demouserproject?.data?.projectDescription}</p>
                        <p>Ticket Count: {demouserproject?.data?.projectTickets.length}</p>
                        <p>User Count: {demouserproject?.data?.assignedUsers.length}</p>
                    </div>
                </div>
            }
            <div className="members">
                <div className="teamHeader">
                    <h2>Team Members</h2>
                </div>
                {demoProjectById?.assignedUsers || !(auth?.userRoles?.find((role : any) => authRole.includes(role)))
                    ?   auth?.userRoles?.find((role : any) => authRole.includes(role))
                            ?   demoProjectById?.assignedUsers?.map((user : DemoUser) => {
                                return <div className="projectTickets" key={user?.id}>
                                    <p>Id# {user?.id}</p> 
                                    <p>{user?.username}</p>
                                    <p>Role: {user?.role}</p>
                                    </div>})
                            :   demouserproject?.data?.assignedUsers?.map((user : DemoUser) => {
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
            {demoProjectById?.assignedUsers || !(auth?.userRoles?.find((role : any) => authRole.includes(role)))
                ?   auth?.userRoles?.find((role : any) => authRole.includes(role))
                        ? demoProjectById?.projectTickets?.map((ticket : DemoTicket) => {
                            return <div className="projectTickets" key={ticket?.ticketId}>
                            <p>Ticket title: {ticket?.ticketTitle}</p>
                            <p>Assigned User: {ticket?.assignedUsers?.username}</p>
                            <p>Priority: {ticket?.priorityStatus}</p>
                            <p>Type: {ticket?.ticketType}</p>
                            <p>Progress: {ticket?.ticketProgress}</p>
                            <button onClick={() => {setSelectedTicket(ticket), navigate('/demoticket')}}>View</button>
                                </div>})
                        : demouserproject?.data?.projectTickets?.map((ticket : DemoTicket) => {
                            return <div className="projectTickets" key={ticket?.ticketId}>
                            <p>Ticket title: {ticket?.ticketTitle}</p>
                            <p>Assigned User: {ticket?.assignedUsers?.username}</p>
                            <p>Priority: {ticket?.priorityStatus}</p>
                            <p>Type: {ticket?.ticketType}</p>
                            <p>Progress: {ticket?.ticketProgress}</p>
                            <button onClick={() => {setSelectedTicket(ticket), navigate('/demoticket')}}>View</button>
                                </div>})
                :   <p id="defaultMessage">Select a project to see assigned tickets.</p>
            }
        </div>
        </>
    )
} 