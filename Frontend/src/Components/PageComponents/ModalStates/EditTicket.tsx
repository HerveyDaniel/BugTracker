import { useContext, useState } from 'react';
import './ModalContent.css'
import { AppContext } from '../../../App';
import useAuth from '../../../Hooks/useAuth';
import Axios from "axios";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project, Ticket } from '../../../TypeInterfaces/Types';

export const EditTicket = () => {

    const {selectedTicket, setSelectedTicket} : any = useContext(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const authRole = ["ADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
    const [ticketTitle, setTicketTitle] = useState<string>("");
    const [ticketInfo, setTicketInfo] = useState<string>("");
    const [priorityStatus, setPriorityStatus] = useState<any>("");
    const [ticketType, setTicketType] = useState<any>("");
    const [ticketProgress, setTicketProgress] = useState<any>("");
    const [addToProject, setAddToProject] = useState<any>(0);
    const queryClient = useQueryClient();
    const ticketId = selectedTicket.ticketId;

    function checkRole(auth : any){
        if(auth?.userRoles?.find((role : any) => authRole.includes(role))) {
            return true;
        }
        return false;
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
            alert("Ticket successfully edited.");
            setSelectedTicket(response?.data);
        } catch (err) {
            alert(err);
        }
    }

    const editticket = useMutation({
        mutationFn : editTicket,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : []})
        }
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
        enabled : checkRole(auth)
    })

    return (
        <>
        <div className="modalStateContent">
            <h3>Edit ticket: #{selectedTicket?.ticketId} {selectedTicket?.ticketTitle}</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Ticket Title</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Title..." onChange={(e) => setTicketTitle(e.target.value)}/>
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Ticket Description</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Description..." onChange={(e) => setTicketInfo(e.target.value)}/>
                </div>
            </div>

            <div className="modalSelectContainer">
                <div className="modalInputBar">
                    <label>Priority:</label>
                    <select onChange={(e) => setPriorityStatus(e.target.value)} className="modalSelectField">
                        <option value="" selected>--Priority--</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select> 
                </div>
                <div className="modalInputBar">
                    <label>Type:</label>
                    <select onChange={(e) => setTicketType(e.target.value)} className="modalSelectField">
                        <option value="" selected>--Type--</option>
                        <option value="BUG">Bug</option>
                        <option value="FEATURE">Feature</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div className="modalInputBar">
                    <label>Progress:</label>
                    <select onChange={(e) => setTicketProgress(e.target.value)} className="modalSelectField">
                        <option value="" selected>--Progress--</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="BACKLOG">Backlog</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
                {auth?.userRoles?.find((role : any) => authRole.includes(role))
                    ?<div className="modalInputBar">
                        <label>Assign To Project:</label>
                        <select onChange={(e) => setAddToProject(e.target.value)} className="modalSelectField">
                            <option value="" selected>--Project--</option>
                            {projects?.data?.map((project : Project) => {
                                return <option value={project.projectId}>ID:{project.projectId}-{project.projectName}</option>
                            })}
                        </select>
                    </div>
                    : <div></div>
                }
            </div>
            
            <button onClick={() => editticket.mutate({ticketId : ticketId, ticketTitle : ticketTitle, priorityStatus : priorityStatus, ticketType : ticketType, ticketProgress : ticketProgress, ticketInfo : ticketInfo, addToProject : addToProject})}>Submit Changes</button>
        </div>
        </>
    )
} 