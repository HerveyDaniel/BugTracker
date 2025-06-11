import { NavBar } from "./PageComponents/NavBar";
import './Tickets.css'
import { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useAuth from "../Hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Project, Ticket, User } from "../TypeInterfaces/Types";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

export const Tickets = () => {
    const { setSelectedTicket } : any = useContext(AppContext);
    const [search, setSearch] = useState("");
    const [priority, setPriority] = useState("");
    const [progress, setProgress] = useState("");
    const [type, setType] = useState("");
    const [projectId, setProjectId] = useState<number>(0);
    const { auth } : any = useAuth();
    const navigate = useNavigate();
    const token = auth?.jwt;
    const id = auth?.currentUserId;
    const authRole = ["ADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
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

    const getUserProject = async (id : number) => {
        try{
            const response = await Axios.get<Project>(`http://localhost:8080/api/project/userproject/${id}`, 
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            );
            console.log(JSON.stringify(response?.data));
            setProjectId(response?.data?.projectId)
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

    const findTickets = async () => {
            try {
            const response = await Axios.get<Ticket[]>("http://localhost:8080/api/ticket/search",
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

    const {data : filteredtickets, refetch, isLoading : filterIsLoading, error : filterError} = useQuery({
        queryKey : ["filteredTickets"],
        queryFn : () => findTickets(),
        enabled :  false
    })

    const getUserById = async (id : number) => {
        try{
            const response : any = await Axios.get<User>(`http://localhost:8080/api/users/${id}`,
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

    const userbyid = useQuery({
        queryKey : ["userById"],
        queryFn : () => getUserById(id)
    })

    const getUserProjectTickets = async (id : number) => {

        try {
        const response = await Axios.get<Ticket[]>("http://localhost:8080/api/ticket/projecttickets",
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
        alert(err);
        }      
    }

    let userprojecttickets = useQuery({
        queryKey : ["userProjectTickets"],
        queryFn : () => getUserProjectTickets(id),
        enabled : userbyid?.data?.assignedproject
    })

    const getAllProjectTickets = async () => {

        try {
        const response = await Axios.get<Ticket[]>("http://localhost:8080/api/admin/ticket/allProjecttickets",
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

    let allprojecttickets = useQuery({
        queryKey : ["allProjectTickets"],
        queryFn : getAllProjectTickets,
        enabled : checkRole(auth)
    })

    const pickUpTicket = async ({id, ticketId} : any) => {
        try{
            const response = await Axios.put<Ticket>("http://localhost:8080/api/ticket/assign",
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
            alert("Ticket successfully acquired.")
        } catch (err) {
            alert(err);
        }
    }

    const pickupticket = useMutation({
        mutationFn : pickUpTicket,
        onSuccess: () => {
            refetch();
            auth?.userRoles?.find((role : any) => authRole.includes(role))
                ?  queryClient.invalidateQueries({queryKey : ["allProjectTickets"]})
                :  queryClient.invalidateQueries({queryKey : ["userProjectTickets"]})
        }
    })

    useEffect (() => {
        queryClient.resetQueries({queryKey : ["filteredTickets"]});
    }, [queryClient])

    if(filterIsLoading) return "Loading...";
    if(allprojecttickets?.isLoading) return "All project tickets loading...";
    if(userprojecttickets?.isLoading) return "User's project tickets loading...";
    if(filterError) navigate("/"), alert("Error: " + filterError?.message);
    if(allprojecttickets?.error) navigate("/"), alert("Error: " + allprojecttickets?.error?.message);

    return (
        <>
        <NavBar></NavBar>
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
            {filteredtickets
                ? filteredtickets?.map((ticket : Ticket) => {
                    return <div className="projectTickets" key={ticket?.ticketId}>
                    <p>Ticket Title: {ticket?.ticketTitle}</p>
                    <p>Priority: {ticket?.priorityStatus}</p>
                    <p>Progress: {ticket?.ticketProgress}</p>
                    <p>Type: {ticket?.ticketType}</p>
                    <button onClick={() => pickupticket.mutate({id : id, ticketId : ticket?.ticketId})}>Pick up ticket</button>
                    <button onClick={() => {setSelectedTicket(ticket), navigate('/ticket')}}>View</button>
                    </div>
                })
                : auth?.userRoles?.find((role : any) => authRole.includes(role))
                    ? allprojecttickets?.data?.map((ticket : Ticket) => {
                        return <div className="projectTickets" key={ticket?.ticketId}>
                        <p>Ticket Title: {ticket?.ticketTitle}</p>
                        <p>Priority: {ticket?.priorityStatus}</p>
                        <p>Progress: {ticket?.ticketProgress}</p>
                        <p>Type: {ticket?.ticketType}</p>
                        <button onClick={() => pickupticket.mutate({id : id, ticketId : ticket?.ticketId})}>Take ticket</button>
                        <button onClick={() => {setSelectedTicket(ticket), navigate('/ticket')}}>View</button>
                        </div>
                    })
                    : userprojecttickets?.data?.map((ticket : Ticket) => {
                        return <div className="projectTickets" key={ticket?.ticketId}>
                        <p>Ticket Title: {ticket?.ticketTitle}</p>
                        <p>Priority: {ticket?.priorityStatus}</p>
                        <p>Progress: {ticket?.ticketProgress}</p>
                        <p>Type: {ticket?.ticketType}</p>
                        <button onClick={() => pickupticket.mutate({id : id, ticketId : ticket?.ticketId})}>Pick up ticket</button>
                        <button onClick={() => {setSelectedTicket(ticket), navigate('/ticket')}}>View</button>
                        </div>
                    })
            }
        </div>
        </>
    )
}