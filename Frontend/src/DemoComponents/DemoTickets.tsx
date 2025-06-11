import { DemoNavBar } from "./DemoPageComponents/DemoNavBar";
import '../Components/Tickets.css'
import { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useAuth from "../Hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DemoProject, DemoTicket, DemoUser } from "../TypeInterfaces/Types";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

export const DemoTickets = () => {
    const { setSelectedTicket } : any = useContext(AppContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [priority, setPriority] = useState("");
    const [progress, setProgress] = useState("");
    const [type, setType] = useState("");
    const [projectId, setProjectId] = useState<number>(0);
    
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const authRole = ["DEMOADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
    const queryClient = useQueryClient();

    function checkRole(auth : any){
        if(auth?.userRoles?.find((role : any) => authRole.includes(role))) {
            return true;
        }
        return false;
    }

    function handleSubmit(e : any) {
        e.preventDefault();
        refetch();
    }

    const getDemoUserProject = async (id : number) => {
        try{
            const response = await Axios.get<DemoProject>(`http://localhost:8080/demo/api/project/userproject/${id}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            console.log(JSON.stringify(response?.data));
            setProjectId(response?.data?.projectId);
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

    const findDemoTickets = async () => {
            try {
            const response = await Axios.get<DemoTicket[]>("http://localhost:8080/demo/api/ticket/search",
                {
                    headers: {'Authorization': `Bearer ${token}`},
                    params: {
                        param1: search,
                        param2: priority,
                        param3: progress,
                        param4: type,
                        param5: auth?.userRoles[0],
                        param6: projectId
                    }
                }
            );
            console.log(JSON.stringify(response?.data));
            return response?.data;
        } catch (err) {
            alert(err);
        }      
    }

    const {data : filtereddemotickets, refetch, isLoading : filterIsLoading, error : filterError} = useQuery({
        queryKey : ["filteredDemoTickets"],
        queryFn : () => findDemoTickets(),
        enabled :  false
    })

    const getDemoUserById = async (id : number) => {
        try{
            const response : any = await Axios.get<DemoUser>(`http://localhost:8080/demo/api/users/${id}`,
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

    const demouserbyid = useQuery({
        queryKey : ["demoUserById"],
        queryFn : () => getDemoUserById(id)
    })

    const getDemoUserProjectTickets = async (id : number) => {

        try {
        const response = await Axios.get<DemoTicket[]>("http://localhost:8080/demo/api/ticket/projecttickets",
            {
                headers: {'Authorization': `Bearer ${token}`},
                params: {
                    param1: id
                }
            }
        );
            console.log(JSON.stringify(response?.data));
            return response?.data;
        } catch (err) {
            
        }      
    }

    let demouserprojecttickets = useQuery({
        queryKey : ["demoUserProjectTickets"],
        queryFn : () => getDemoUserProjectTickets(id),
        enabled : demouserbyid?.data?.assignedproject
    })

    const getAllDemoProjectTickets = async () => {

        try {
        const response = await Axios.get<DemoTicket[]>("http://localhost:8080/demo/api/admin/ticket/allProjecttickets",
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

    let alldemoprojecttickets = useQuery({
        queryKey : ["allDemoProjectTickets"],
        queryFn : getAllDemoProjectTickets,
        enabled : checkRole(auth)
    })

    const pickUpDemoTicket = async ({id, ticketId} : any) => {
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
            alert("Demo ticket successfully acquired.")
        } catch (err) {
            /* IMPLEMENT ERROR HANDLING FOR FAILED LOGIN/SERVER RESPONSE */
            alert(err);
        }
    }

    const pickupdemoticket = useMutation({
        mutationFn : pickUpDemoTicket,
        onSuccess: () => {
            refetch();
            auth?.userRoles?.find((role : any) => authRole.includes(role))
                ?  queryClient.invalidateQueries({queryKey : ["allDemoProjectTickets"]})
                :  queryClient.invalidateQueries({queryKey : ["demoUserProjectTickets"]})
        }
    })

    useEffect (() => {
        queryClient.resetQueries({queryKey : ["filteredTickets"]});
    }, [queryClient])

    if(filterIsLoading) return "Loading...";
    if(alldemoprojecttickets?.isLoading) return "All project tickets loading...";
    if(demouserprojecttickets?.isLoading) return "User's project tickets loading...";
    if(filterError) navigate("/"), alert("Error: " + filterError?.message);
    if(alldemoprojecttickets?.error) navigate("/"), alert("Error: " + alldemoprojecttickets?.error?.message);

    return (
        <>
        <DemoNavBar></DemoNavBar>
        <div className="filterBar">
            <div className="ticketInputContainer">
                <form className="searchForm" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Search ticket by keyword.." className="searchInput" onChange={(e) => {setSearch(e.target.value)}}/>
                    <div className="optionsContainer">
                        <div className="priorityContainer">
                            <label>Priority:</label>
                            <select onChange={(e) => setPriority(e.target.value)}>
                                <option value="" selected>--Priority--</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div className="progressContainer">
                            <label>Progress:</label>
                            <select onChange={(e) => setProgress(e.target.value)}>
                                <option value="" selected>--Progress--</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="BACKLOG">Backlog</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                        <div className="typeContainer">
                            <label>Type:</label>
                            <select onChange={(e) => setType(e.target.value)}>
                                <option value="" selected>--Type--</option>
                                <option value="BUG">Bug</option>
                                <option value="FEATURE">Feature</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <input type="submit" value="Search"/>
                    </div>
                </form>
            </div>
        </div>
        
        <div className="ticketMainContainer">
            <div className="containerHeader">
                <h2>Tickets</h2>
            </div>
            {filtereddemotickets
                ? filtereddemotickets?.map((ticket : DemoTicket) => {
                    return <div className="projectTickets" key={ticket?.ticketId}>
                    <p>Ticket Title: {ticket?.ticketTitle}</p>
                    <p>Priority: {ticket?.priorityStatus}</p>
                    <p>Progress: {ticket?.ticketProgress}</p>
                    <p>Type: {ticket?.ticketType}</p>
                    <button onClick={() => pickupdemoticket.mutate({id : id, ticketId : ticket?.ticketId})}>Take ticket</button>
                    <button onClick={() => {setSelectedTicket(ticket), navigate('/demoticket')}}>View</button>
                    </div>
                })
                : auth?.userRoles?.find((role : any) => authRole.includes(role))
                    ? alldemoprojecttickets?.data?.map((ticket : DemoTicket) => {
                        return <div className="projectTickets" key={ticket?.ticketId}>
                        <p>Ticket Title: {ticket?.ticketTitle}</p>
                        <p>Priority: {ticket?.priorityStatus}</p>
                        <p>Progress: {ticket?.ticketProgress}</p>
                        <p>Type: {ticket?.ticketType}</p>
                        <button onClick={() => pickupdemoticket.mutate({id : id, ticketId : ticket?.ticketId})}>Take ticket</button>
                        <button onClick={() => {setSelectedTicket(ticket), navigate('/demoticket')}}>View</button>
                        </div>
                    })
                    : demouserprojecttickets?.data?.map((ticket : DemoTicket) => {
                        return <div className="projectTickets" key={ticket?.ticketId}>
                        <p>Ticket Title: {ticket?.ticketTitle}</p>
                        <p>Priority: {ticket?.priorityStatus}</p>
                        <p>Progress: {ticket?.ticketProgress}</p>
                        <p>Type: {ticket?.ticketType}</p>
                        <button onClick={() => pickupdemoticket.mutate({id : id, ticketId : ticket?.ticketId})}>Take ticket</button>
                        <button onClick={() => {setSelectedTicket(ticket), navigate('/demoticket')}}>View</button>
                        </div>
                    })
            }
        </div>
        </>
    )
}