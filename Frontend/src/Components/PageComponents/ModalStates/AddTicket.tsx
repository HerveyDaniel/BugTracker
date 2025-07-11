import { useState } from 'react'
import './ModalContent.css'
import Axios from "axios";
import useAuth from '../../../Hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Project, Ticket } from '../../../TypeInterfaces/Types';

export const AddTicket = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const authRole = ["ADMIN"];
    const [ticketTitle, setTicketTitle] = useState<string>("");
    const [ticketInfo, setTicketInfo] = useState<string>("");
    const [priorityStatus, setPriorityStatus] = useState<any>("");
    const [ticketType, setTicketType] = useState<any>("");
    const [addToProject, setAddToProject] = useState<any>(0);
    const requestData = {ticketTitle, priorityStatus, ticketType, "ticketProgress" : "IN_PROGRESS", ticketInfo};

    function checkRole(auth : any){
        if(auth?.userRoles?.find((role : any) => authRole.includes(role))) {
            return false;
        }
        return true;
    }

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
        enabled : checkRole(auth)
    })

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
        queryKey : ["modalAllProjects"],
        queryFn : getAllProjects,
        enabled : !checkRole(auth)
    })

    const createTicket = async () => {
        try{
            const response = await Axios.post<Ticket>(`http://localhost:8080/api/ticket/${addToProject}`,
                requestData,
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Ticket successfully created.");
        } catch (err) {
            alert(err);
        }
    }

    const createticket = useMutation({
        mutationFn : createTicket
    })

    return (
    <>
    <div className="modalStateContent">
        <h3>Create Ticket</h3>

        <div className="modalInputContainer">
            <div className="modalLabel">
                <label>Ticket Title:</label>
            </div>
            <div className="modalInputBar">
                <input type="text"  placeholder="Ticket Title..." onChange={(e) => setTicketTitle(e.target.value)}/>
            </div>
        </div>

        <div className="modalInputContainer">
            <div className="modalLabel">
                <label>Ticket Description:</label>
            </div>
            <div className="modalInputBar">
                <input type="text"  placeholder="Ticket Description..." onChange={(e) => setTicketInfo(e.target.value)}/>
            </div>
        </div>
        
        <div className="modalSelectContainer">
            <div className="modalInputBar">
                <label>Priority:</label>
                <select onChange={(e) => setPriorityStatus(e.target.value)}>
                    <option value="" selected>--Priority--</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
            </div>
            <div className="modalInputBar">
                <label>Type:</label>
                <select onChange={(e) => setTicketType(e.target.value)}>
                    <option value="" selected>--Type--</option>
                    <option value="BUG">Bug</option>
                    <option value="FEATURE">Feature</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>
            {auth?.userRoles?.find((role : any) => authRole.includes(role))
                ?<div className="modalInputBar">
                    <label>Assign To Project:</label>
                    <select onChange={(e) => setAddToProject(e.target.value)}>
                    <option value="" selected>--Project--</option>
                    {projects?.data?.map((project : Project) => {
                        return <option value={project.projectId}>ID:{project.projectId}-{project.projectName}</option>
                    })}
                    </select>
                </div>
                : <div></div>
            }
        </div>
        <button onClick={() => createticket.mutate()}>Create Ticket</button>
    </div>
    </> 
    )
}  