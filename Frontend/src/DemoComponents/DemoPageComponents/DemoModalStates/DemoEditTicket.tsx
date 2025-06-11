import { useContext, useState } from "react";
import { AppContext } from "../../../App";
import Axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import '../../../Components/PageComponents/ModalStates/ModalContent.css'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DemoProject, DemoTicket } from "../../../TypeInterfaces/Types";

export const DemoEditTicket = () => {

    const { selectedTicket, setSelectedTicket} : any = useContext(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const authRole = ["DEMOADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
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

    const getDemoUserProject = async (id : number) => {
        try{
            const response = await Axios.get<DemoProject>(`http://localhost:8080/demo/api/project/userproject/${id}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            console.log(JSON.stringify(response?.data));
            setAddToProject(response?.data?.projectId);
            return response?.data;
        } catch (err) {
            alert(err);
        }
    }

    const demouserproject = useQuery({
        queryKey : ["demouserproject", id],
        queryFn : () => getDemoUserProject(id),
        enabled : !checkRole(auth)
    })

    const editDemoTicket = async ({ticketId, ticketTitle, priorityStatus, ticketType, ticketProgress, ticketInfo, addToProject} : any) => {
        
        try{
            const response = await Axios.put<DemoTicket>("http://localhost:8080/demo/api/ticket/edit",
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
            alert("Demo ticket successfully edited.");
            setSelectedTicket(response?.data);
        } catch (err) {
            alert(err);
        }
    }

    const editdemoticket = useMutation({
        mutationFn : editDemoTicket,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : []})
        }
    })

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
        queryKey : ["modalAllDemoProjects"],
        queryFn : getDemoProjects,
        enabled : checkRole(auth)
    })

    return (
        <>
        <div className="modalStateContent">
            <h3>Edit Demo Ticket: #{selectedTicket?.ticketId} {selectedTicket?.ticketTitle}</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Ticket Title</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Ticket Title..." onChange={(e) => setTicketTitle(e.target.value)}/>
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Ticket Description</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Ticket Description..." onChange={(e) => setTicketInfo(e.target.value)}/>
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
                <div className="modalInputBar">
                    <label>Progress:</label>
                    <select onChange={(e) => setTicketProgress(e.target.value)}>
                        <option value="" selected>--Progress--</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="BACKLOG">Backlog</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
                {auth?.userRoles?.find((role : any) => authRole.includes(role))
                    ?<div className="modalInputBar">
                        <label>Assign To Project:</label>
                        <select onChange={(e) => setAddToProject(e.target.value)}>
                        <option value="" selected>--Project--</option>
                        {demoprojects?.data?.map((project : DemoProject) => {
                            return <option value={project.projectId}>ID:{project.projectId}-{project.projectName}</option>
                        })}
                        </select>
                    </div>
                    : <div></div>
                }
            </div>
            <button onClick={() => editdemoticket.mutate({ticketId : ticketId, ticketTitle : ticketTitle, priorityStatus : priorityStatus, ticketType : ticketType, ticketProgress : ticketProgress, ticketInfo : ticketInfo, addToProject : addToProject})}>Submit Changes</button>
        </div>
        </>
    )
}