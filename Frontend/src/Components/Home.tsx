import './Home.css'
import { NavBar } from './PageComponents/NavBar'
import Axios from "axios";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import useAuth from '../Hooks/useAuth';
import { Project, Ticket } from '../TypeInterfaces/Types';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';


export const Home = ({setModalState}: any, {authProp}: any) => {
    const {setModalContent, setSelectedTicket} = useContext<any>(AppContext);
    const { auth } : any = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const authRole = ["ADMIN"];
    const [addToProject, setAddToProject] = useState<any>(0);
   
    const [priority, setPriority] = useState({
        "LOW" : 0,
        "MEDIUM" : 0,
        "HIGH" : 0
    });
    const [type, setType] = useState({
        "BUG" : 0,
        "FEATURE" : 0,
        "OTHER" : 0
    });
    const [progress, setProgress] = useState({
        "BACKLOG" : 0,
        "IN_PROGRESS" : 0,
        "COMPLETED" : 0
    });

    function checkRole(auth : any){
        if(auth?.userRoles?.find((role : any) => authRole.includes(role))) {
            return true;
        }
        return false;
    }


    const getUserTickets = async () => {
        try{
            const response = await Axios.get<Ticket[]>('http://localhost:8080/api/ticket/usertickets', 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                    params: {
                        param1: id
                    }
                }
            );
            console.log(JSON.stringify(response?.data));
            
            let low = 0;
            let medium = 0;
            let high = 0;

            let bug = 0;
            let feature = 0;
            let other = 0;

            let inProgress = 0;
            let backlog = 0;
            let completed = 0;
            
            for (const element of response?.data) {
                if(element.priorityStatus == "LOW") {
                    low++;
                } else if (element?.priorityStatus == "MEDIUM") {
                    medium++;
                } else {
                    high++
                }
            }

            for (const element of response?.data) {
                if(element?.ticketType == "BUG") {
                    bug++;
                } else if (element?.ticketType == "FEATURE") {
                    feature++;
                } else {
                    other++
                }
            }

            for (const element of response?.data) {
                if(element?.ticketProgress == "BACKLOG") {
                    backlog++;
                } else if (element?.ticketProgress == "IN_PROGRESS") {
                    inProgress++;
                } else {
                    completed++;
                }
            }

            setPriority({"LOW" : low, "MEDIUM": medium, "HIGH": high})
            setType({"BUG" : bug, "FEATURE": feature, "OTHER": other})
            setProgress({"BACKLOG" : backlog, "IN_PROGRESS" : inProgress, "COMPLETED" : completed})

            return response?.data;

        } catch (err) {
            alert(err);
        }
    }

    const usertickets = useQuery({
        queryKey : ["usertickets"],
        queryFn : getUserTickets
    })

    const getUserProject = async (id : number) => {
        try{
            const response = await Axios.get<Project>(`http://localhost:8080/api/project/userproject/${id}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            console.log(JSON.stringify(response?.data));
            setAddToProject(response?.data?.projectId)
            return response?.data;
        } catch (err) {
            alert(err);
        }
    }

    const userproject = useQuery({
        queryKey : ["userproject", id],
        queryFn : () => getUserProject(id),
        enabled : !checkRole(auth)
    })

    const editTicket = async ({ticketId, ticketTitle, priorityStatus, ticketType, ticketProgress, ticketInfo, addToProject} : any) => {
        
        try{
            const response = await Axios.put<Ticket>("http://localhost:8080/api/ticket/edit",
                {   
                    ticketId : ticketId,
                    ticketTitle : ticketTitle, 
                    priorityStatus : priorityStatus, 
                    ticketType : ticketType, 
                    ticketProgress : ticketProgress, 
                    ticketInfo : ticketInfo,
                    addToProject : addToProject
                },
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Ticket successfully marked as complete.");
            setSelectedTicket(response?.data);
        } catch (err) {
            alert(err);
        }
    }

    const editticket = useMutation({
        mutationFn: editTicket,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["usertickets"]})
        }
    })

    if(usertickets?.isLoading) return "Loading..."
    if(usertickets?.error) navigate("/"), alert("Error: " + usertickets?.error?.message);
    
    return (
        <>
        <NavBar></NavBar>
        <div className="homeMainContainer">
            <div className="yourAssignedTickets">
                <div className="containerHeader">
                    <h2>Your Assigned Tickets</h2>
                </div>
                {usertickets?.data?.map((ticket : Ticket) => {
                    return <div className="projectTickets" key={ticket?.ticketId}>
                        <p>Ticket Title: {ticket?.ticketTitle}</p>
                        <p>Priority: {ticket?.priorityStatus}</p>
                        <p>Type: {ticket?.ticketType}</p>
                        <p>Progress: {ticket?.ticketProgress}</p> 
                        <button onClick={() => {setSelectedTicket(ticket), navigate('/ticket')}}>View Ticket</button>
                        <button onClick={() => {(setModalContent({editTicket : true}), setModalState(true)), setSelectedTicket(ticket)}}>Edit</button>
                        <button onClick={() => editticket.mutate({ticketId : ticket?.ticketId, ticketTitle : ticket?.ticketTitle, priorityStatus : ticket?.priorityStatus, ticketType : ticket?.ticketType, ticketProgress : "COMPLETED", ticketInfo : ticket?.ticketInfo, addToProject : ticket?.project?.projectId})}>Mark Complete</button>
                    </div>
                })}
            </div>
            <div className="windowContainer">
                <div className="priorityWindow">
                    <div className="containerHeader">
                        <h2>Priority</h2>
                    </div>
                    <div className="windowText">
                        <p>
                            Low: {priority.LOW}
                        </p>
                        <p>
                            Medium: {priority.MEDIUM}
                        </p>
                        <p>
                            High: {priority.HIGH}
                        </p>
                    </div>
                </div>
                <div className="ticketTypeWindow">
                    <div className="containerHeader">
                        <h2>Type</h2>
                    </div>
                    <div className="windowText">
                        <p>
                            Bug: {type.BUG}
                        </p>
                        <p>
                            Feature: {type.FEATURE}
                        </p>
                        <p>
                            Other: {type.OTHER}
                        </p>
                    </div>
                </div>
                <div className="progressWindow">
                    <div className="containerHeader">
                        <h2>Progress</h2>
                    </div>
                    <div className="windowText">
                        <p>
                            Backlog: {progress.BACKLOG}
                        </p>
                        <p>
                            In Progress: {progress.IN_PROGRESS}
                        </p>
                        <p>
                            Completed: {progress.COMPLETED}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}