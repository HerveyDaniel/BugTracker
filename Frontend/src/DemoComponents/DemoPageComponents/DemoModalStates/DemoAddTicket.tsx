import { useState } from "react";
import Axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import '../../../Components/PageComponents/ModalStates/ModalContent.css'
import { useMutation, useQuery } from '@tanstack/react-query';
import { DemoProject, DemoTicket, DemoUser } from "../../../TypeInterfaces/Types";

export const DemoAddTicket = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const authRole = ["DEMOADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
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
        enabled : checkRole(auth)
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
        queryKey : ["modalAllDemoProjects"],
        queryFn : getAllDemoProjects,
        enabled : !checkRole(auth)
    })

    const createDemoTicket = async () => {
        try{
            const response = await Axios.post<DemoTicket>(`http://localhost:8080/demo/api/ticket/${addToProject}`,
                requestData,
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Demo Ticket successfully created.");
        } catch (err) {
            alert(err);
        }
    }

    const createdemoticket = useMutation({
        mutationFn : createDemoTicket
    })

    return (
    <>
    <div className="modalStateContent">
        <h3>Create Demo Ticket</h3>

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
                    {demoprojects?.data?.map((project : DemoProject) => {
                        return <option value={project.projectId}>ID:{project.projectId}-{project.projectName}</option>
                    })}
                    </select>
                </div>
                : <div></div>
            }
        </div>
        <button onClick={() => createdemoticket.mutate()}>Create Ticket</button>
    </div>
    </>
    )
} 