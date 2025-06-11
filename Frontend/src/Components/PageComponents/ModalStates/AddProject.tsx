import './ModalContent.css'
import { useState } from 'react'
import Axios from "axios";
import useAuth from '../../../Hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project, User } from '../../../TypeInterfaces/Types';

export const AddProject = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const [projectName, setProjectName] = useState<any>("");
    const [projectDescription, setProjectDescription] = useState<any>("");
    const [id, setId] = useState<any>(-1);
    const queryClient = useQueryClient();
    
    const createProject = async ({projectName, projectDescription} : any) => {

        const project = {
            projectName : projectName,
            projectDescription : projectDescription,
            ProjectTickets : [],
            assignedUsers : []
        }

        try{
            const response = await Axios.post<Project>(`http://localhost:8080/api/admin/project/${id}`,
                project,
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
                
            );
            console.log(JSON.stringify(response?.data));
            alert("Project successfully created.");
        } catch (err) {
            alert(err);
        }
    }

    const createproject = useMutation({
        mutationFn : createProject,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allProjects"]})
        }
    })

    const getAllUsers = async () => {
        try {
        const response = await Axios.get<User[]>("http://localhost:8080/api/admin/users",
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

    const allusers = useQuery({
        queryKey : ["modalAllUsers"],
        queryFn : getAllUsers
    })

    return (
        <>
        <div className="modalStateContent">
            <h3>Create Project</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Project Title:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Project Title..." onChange={(e) => setProjectName(e.target.value)}/>
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Project Description:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Project Description..." onChange={(e) => setProjectDescription(e.target.value)}/>
                </div>
            </div>

            <div className="modalSelectContainer">
                <div className="modalInputBar">
                    <label>Assign Users:</label>
                    <select onChange={(e) => setId(e.target.value)}>
                        <option value={-1}>--Select User To Add--</option>
                            {allusers?.data?.map((user : User) => {
                                return <option value={user.id}>ID:{user.id}-{user.username}</option>
                            })}
                    </select>
                </div>
            </div>
            
            <button onClick={() => createproject.mutate({projectName : projectName, projectDescription : projectDescription})}>Create Project</button>
        </div>
        </>
    )
}  