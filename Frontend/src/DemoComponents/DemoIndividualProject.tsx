import '../Components/IndividualProject.css'
import { useContext } from 'react';
import { DemoNavBar } from './DemoPageComponents/DemoNavBar';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import  Axios  from "axios";
import useAuth from '../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { DemoProject, DemoTicket } from '../TypeInterfaces/Types';

export const DemoIndividualProject = () => {
    const { setSelectedTicket, setModalContent, setDemoModalState} = useContext<any>(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    let currentProjectId : number = 0;
    const navigate = useNavigate();

    const findDemoProjectById = async (currentProjectId : number) => {
        try{
            const response = await Axios.get<DemoProject>(`http://localhost:8080/demo/api/admin/project/${currentProjectId}`, 
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

    const {data : demoProjectById, isLoading : projectIsLoading, error : projectError} = useQuery({
        queryKey : ["demoProjectById"],
        queryFn : () => findDemoProjectById(currentProjectId),
        staleTime: 1000*60*5,
        refetchInterval: 1000*60*5
    })

    if(projectIsLoading) return "Loading...";
    if(projectError) navigate("/"), alert("Error: " + projectError?.message);

    return (
        <>
        <DemoNavBar></DemoNavBar>
        <div className="mainProjectContainer">
            <div className="projectHeader">
                <h2>Project ID#:{demoProjectById?.projectId} {demoProjectById?.projectName}</h2>
            </div>
            <div className="projectContainerContent">
                <div className="projectTextDiv">
                    <p>{demoProjectById?.projectDescription}</p>
                </div>
                <div className="projectTextDiv">
                    <p>Active Tickets: {demoProjectById?.projectTickets?.filter((ticket : DemoTicket) => ticket?.ticketProgress === "IN_PROGRESS" || ticket?.ticketProgress === "BACKLOG").length}</p>
                    <p>Unassigned Tickets: {demoProjectById?.projectTickets?.filter((ticket : DemoTicket) => ticket?.assignedUsers == null).length}</p>
                    <p>Completed Tickets: {demoProjectById?.projectTickets?.filter((ticket : DemoTicket) => ticket?.ticketProgress === "COMPLETED").length}</p>
                </div>
            </div>
            <div className="editDiv">
                <button onClick={() => {setModalContent({editProject : true}), setDemoModalState(true)}}>Edit Project</button>
            </div>
        </div>
        <div className="mainContainer">
            <div className="containerHeader">
                <h2 className="comments"> {demoProjectById?.projectName} Tickets</h2>
            </div>
            {demoProjectById?.projectTickets?.map((ticket : DemoTicket) => {
                return <div className="projectTickets" key={ticket?.ticketId}>
                    <p>Ticket Title: {ticket?.ticketTitle}</p>
                    <p>Assigned User: {ticket?.assignedUsers?.username}</p>
                    <p>Priority: {ticket?.priorityStatus}</p>
                    <p>Type: {ticket?.ticketType}</p>
                    <p>Progress: {ticket?.ticketProgress}</p>
                    <button onClick={() => {setSelectedTicket(ticket), navigate('/demoticket')}}>Select</button>
                </div>})}
        </div>
        </>
    )
}