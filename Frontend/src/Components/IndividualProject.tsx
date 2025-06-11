import { useContext } from "react";
import { NavBar } from "./PageComponents/NavBar"
import "./IndividualProject.css"
import { AppContext } from "../App";
import Axios from "axios";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Project, Ticket } from "../TypeInterfaces/Types";

export const IndividualProject = () => {
    const { setSelectedTicket, setModalContent, setModalState} = useContext<any>(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    let currentProjectId : number = 0;
    const navigate = useNavigate();

    const findProjectById = async (currentProjectId : number) => {
        try{
            const response = await Axios.get<Project>(`http://localhost:8080/api/admin/project/${currentProjectId}`, 
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

    const {data : projectById, isLoading : projectIsLoading, error : projectError} = useQuery({
        queryKey : ["projectById"],
        queryFn : () => findProjectById(currentProjectId),
        staleTime: 1000*60*5,
        refetchInterval: 1000*60*5
    })

    if(projectIsLoading) return "Loading...";
    if(projectError) navigate("/"), alert("Error: " + projectError?.message);

    return (
        <>
        <NavBar></NavBar>
        <div className="mainProjectContainer">
            <div className="projectHeader"> 
                <h2>Project Id#:{projectById?.projectId} {projectById?.projectName}</h2>
            </div>
            <div className="projectContainerContent">
                <div className="projectTextDiv">
                    <p>{projectById?.projectDescription}</p>
                </div>
                <div className="projectTextDiv">
                    <p>Active Tickets: {projectById?.projectTickets?.filter((ticket : Ticket) => ticket?.ticketProgress === "IN_PROGRESS" || ticket?.ticketProgress === "BACKLOG").length}</p>
                    <p>Unassigned Tickets: {projectById?.projectTickets?.filter((ticket : Ticket) => ticket?.assignedUsers == null).length}</p>
                    <p>Completed Tickets: {projectById?.projectTickets?.filter((ticket : Ticket) => ticket?.ticketProgress === "COMPLETED").length}</p>
                </div>
            </div>
            <div className="editDiv">
                <button onClick={() => {setModalContent({editProject : true}), setModalState(true)}}>Edit Project</button>
            </div>
        </div>
        <div className="mainContainer">
            <div className="containerHeader">
                <h2 className="comments"> {projectById?.projectName} Tickets</h2>
            </div>
            {projectById?.projectTickets?.map((ticket : Ticket) => {
                return <div className="projectTickets" key={ticket?.ticketId}>
                    <p>Ticket Title: {ticket?.ticketTitle}</p>
                    <p>Assigned User: {ticket?.assignedUsers?.username}</p>
                    <p>Priority: {ticket?.priorityStatus}</p>
                    <p>Type: {ticket?.ticketType}</p>
                    <p>Progress: {ticket?.ticketProgress}</p>
                    <button onClick={() => {setSelectedTicket(ticket), navigate('/ticket')}}>Select</button>
                </div>})}
        </div>
        </>
    )
}