import { DemoNavBar } from "./DemoPageComponents/DemoNavBar";
import '../Components/IndividualTicket.css';
import useAuth from "../Hooks/useAuth";
import { useState, useContext } from "react";
import { AppContext } from "../App";
import Axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DemoComment, DemoTicket } from "../TypeInterfaces/Types";
import { useNavigate } from "react-router-dom";

export const DemoIndividualTicket = () => {
    const { selectedTicket, setModalContent, setDemoModalState} = useContext<any>(AppContext);
    const id = selectedTicket?.ticketId;
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const createdBy = auth?.username;
    const [content, setContent] = useState("");
    const authRole = ["DEMOADMIN"];
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const findDemoTicketById = async () => {
        try{
            const response = await Axios.get<DemoTicket>(`http://localhost:8080/demo/api/ticket/${id}`, 
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

    const demoticketbyid = useQuery({
        queryKey : ["demoTicketById"],
        queryFn : findDemoTicketById
    })

    const createDemoComment = async ({createdBy, content} : any) => {
        try{
            const response = await Axios.put<DemoComment[]>("http://localhost:8080/demo/api/ticket/comment",
                {
                    selectedTicketId : id,
                    createdBy : createdBy,
                    content : content
                },
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Demo comment successfully created.");
        } catch (err) {
            alert(err);
        }
    }

    const createdemocomment = useMutation({
        mutationFn : createDemoComment,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["demoTicketById"]})
        }
    })

    const deleteDemoCommentById = async ({commentIndex, id} : any) => {
        try{
            const response = await Axios.put<void>(`http://localhost:8080/demo/api/admin/ticket/comment/${commentIndex}`,
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
            alert(err);
        }
    }

    const deletedemocommentbyid = useMutation({
        mutationFn : deleteDemoCommentById,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["demoTicketById"]})
        }
    })

    function click(action1 : any, action2 : any) {
        action1;
        action2;
    }

    if(demoticketbyid?.isLoading) return "Loading..."
    if(demoticketbyid?.error) navigate("/"), alert("Error: " + demoticketbyid?.error?.message);

    return (
        <>
        <DemoNavBar></DemoNavBar>
        <div className="mainProjectContainer">
            <div className="containerHeader"> 
                <h2>Ticket ID#:{demoticketbyid?.data?.ticketId} {demoticketbyid?.data?.ticketTitle}</h2>
            </div>
            <div className="projectContainerContent">
                <div className="projectTextDiv">
                    <p>{demoticketbyid?.data?.ticketInfo}</p>
                </div>
                <div className="projectTextDiv">
                    <p>Priority: {demoticketbyid?.data?.priorityStatus}</p>
                    <p>Type: {demoticketbyid?.data?.ticketType}</p>
                    <p>Progress: {demoticketbyid?.data?.ticketProgress}</p>
                </div>
            </div>
            <div className="editDiv">
                <button onClick={() => {click(setModalContent({editTicket : true}), setDemoModalState(true))}}>Edit Ticket</button>
                <div>
                    <p>Assigned User: {demoticketbyid?.data?.assignedUsers?.username}</p>
                </div>
            </div>
        </div>
        <div className="commentsContainer">
            <div className="containerHeader">
                <h2 className="comments">Comments</h2>
            </div>
            {demoticketbyid?.data?.ticketComments?.map((comment : DemoComment, index : number) => {
                return <div className="projectTickets" key={index}>
                    <div className="commentContent">
                       <p>{comment?.createdBy}: {comment?.content}</p>  
                    </div>
                    <div className="deleteCommentDiv">
                        <p>{comment?.createdOn}</p>
                        {auth?.userRoles?.find((role : any) => authRole.includes(role))
                            ? <button onClick={() => deletedemocommentbyid.mutate({commentIndex : index, id : id})}>Delete</button>
                            : <div></div>
                        }
                    </div>
                </div>
            })}
            <div className="createCommentDiv">
                <input type="text" placeholder="Make Comment" className="commentInput" onChange={(e) => setContent(e.target.value)}/>
                <button onClick={() => createdemocomment.mutate({createdBy : createdBy, content : content})}>Create Comment</button>
            </div>
        </div>
        </>
    )
} 