import { NavBar } from "./PageComponents/NavBar";
import "./IndividualTicket.css"
import useAuth from "../Hooks/useAuth";
import { useState, useContext } from "react";
import { AppContext } from "../App";
import Axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ticket } from "../TypeInterfaces/Types";
import { useNavigate } from "react-router-dom";

export const IndividualTicket = () => {
    const { selectedTicket, setModalContent, setModalState} = useContext<any>(AppContext);
    const id = selectedTicket?.ticketId;
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const createdBy = auth?.username;
    const [ticketId, setTicketId] = useState(id);
    const [content, setContent] = useState("");
    const requestData = {selectedTicket, createdBy, content};
    const authRole = ["ADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const findTicketById = async () => {
        try{
            const response = await Axios.get<Ticket>(`http://localhost:8080/api/ticket/${id}`, 
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

    const ticketbyid = useQuery({
        queryKey : ["ticketById"],
        queryFn : findTicketById
    })

    const createComment = async ({selectedTicket, createdBy, content} : any) => {
        let requestData = {selectedTicket, createdBy, content}
        try{
            const response = await Axios.put<any>("http://localhost:8080/api/ticket/comment",
                requestData,
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Comment successfully created.");
        } catch (err) {
            /* IMPLEMENT ERROR HANDLING FOR FAILED LOGIN/SERVER RESPONSE */
        }
    }

    const createcomment = useMutation({
        mutationFn : createComment,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["ticketById"]})
        }
    })

    const deleteCommentById = async ({commentIndex, id} : any) => {
        try{
            const response = await Axios.put<void>(`http://localhost:8080/api/admin/ticket/comment/${commentIndex}`,
                {
                    ticketId : id
                }, 
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'},
                }
            );
            console.log(JSON.stringify("Delete successful"));
            alert("Comment successfully deleted.");
        } catch (err) {
            /* IMPLEMENT ERROR HANDLING FOR FAILED LOGIN/SERVER RESPONSE */
        }
    }

    const deletecommentbyid = useMutation({
        mutationFn : deleteCommentById,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["ticketById"]})
        }
    })

    function click(action1 : any, action2 : any) {
        action1;
        action2;
    }
    
    if(ticketbyid?.isLoading) return "Loading..."
    if(ticketbyid?.error) navigate("/"), alert("Error: " + ticketbyid?.error?.message);

    return (
        <>
        <NavBar></NavBar>
        <div className="mainProjectContainer">
            <div className="containerHeader"> 
                <h2>{ticketbyid?.data?.ticketId} - {ticketbyid?.data?.ticketTitle}</h2>
            </div>
            <div className="projectContainerContent">
                <div className="projectTextDiv">
                    <p>{ticketbyid?.data?.ticketInfo}</p>
                </div>
                <div className="projectTextDiv">
                    <p>Priority: {ticketbyid?.data?.priorityStatus}</p>
                    <p>Type: {ticketbyid?.data?.ticketType}</p>
                    <p>Progress: {ticketbyid?.data?.ticketProgress}</p>
                </div>
            </div>
            <div className="editDiv">
                <button onClick={() => {click(setModalContent({editTicket : true}), setModalState(true))}}>Edit Ticket</button>
                <div>
                    <p>Assigned User: {ticketbyid?.data?.assignedUsers?.username}</p>
                </div>
            </div>
        </div>
        <div className="commentsContainer">
            <div className="containerHeader">
                <h2 className="comments">Comments</h2>
            </div>
            {ticketbyid?.data?.ticketComments?.map((comment : any, index : number) => {
                return <div className="projectTickets" key={index}>
                    <div className="commentContent">
                       <p>{comment?.createdBy}: {comment?.content}</p>  
                    </div>
                    <div className="deleteCommentDiv">
                        <p>{comment?.createdOn}</p>
                        {auth?.userRoles?.find((role : any) => authRole.includes(role))
                            ? <button onClick={() => deletecommentbyid.mutate({commentIndex : index, id : id})}>Delete</button>
                            : <div></div>
                        }
                    </div>
                </div>
            })}
            <div className="createCommentDiv">
                <input type="text" placeholder="Make Comment..." onChange={(e) => setContent(e.target.value)}/>
                <button onClick={() => createcomment.mutate({selectedTicket : selectedTicket, createdBy : createdBy, content : content})}>Create Comment</button>
            </div>
        </div>
        </>
    )
} 