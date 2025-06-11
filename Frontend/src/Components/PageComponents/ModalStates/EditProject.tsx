import { useContext, useEffect, useState } from 'react';
import './ModalContent.css'
import { AppContext } from '../../../App';
import useAuth from '../../../Hooks/useAuth';
import Axios from "axios";
import Select from 'react-select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project, User } from '../../../TypeInterfaces/Types';

export const EditProject = () => {

    const { currentProject } : any = useContext(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const authRole = ["ADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
    const [projectName, setProjectName] = useState<any>("");
    const [projectDescription, setProjectDescription] = useState<any>("");
    const [selectedUsers, setSelectedUsers] = useState<any>([]);
    const projectId = currentProject?.projectId;
    const [selectedUsersData, setSelectedUsersData] = useState<any>([]);
    const queryClient = useQueryClient();
    const jsonString = JSON.stringify(selectedUsersData)


    const editProject = async ({projectId, projectName, projectDescription, jsonString} : any) => {
        
        try{
            const response = await Axios.put<Project>("http://localhost:8080/api/admin/project/edit",
                {   
                    projectId : projectId,
                    projectName : projectName, 
                    projectDescription : projectDescription, 
                    selectedUsersData : jsonString
                },
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Project has been successfully edited.");
        } catch (err) {
            alert(err);
        }
    }

    const editproject = useMutation({
        mutationFn : editProject,
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

    const handleChange = (selectedOption : any) => {
        setSelectedUsers(selectedOption);
      };

    function updateSelectedUsers(){
        {selectedUsers?.map((user : any) => {
            setSelectedUsersData([...selectedUsersData, user?.value?.id])
        })}
    }

    useEffect(() => {
        updateSelectedUsers();
    }, [selectedUsers])

    return (
        <>
        <div className="modalStateContent">
            <h3>Edit Project: #{currentProject?.projectId} {currentProject?.projectName}</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Name:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Project Name..." onChange={(e) => setProjectName(e.target.value)}/>
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Description:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Project Description..." onChange={(e) => setProjectDescription(e.target.value)}/>
                </div>
            </div>
            
            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Add to Project:</label>
                </div>
                <div className="modalInputBar">
                    <Select
                        isMulti
                        isSearchable
                        name="colors"
                        options={allusers?.data?.map((user : User) => {
                            return(
                                { label : user?.username, value : user }
                            )
                        })}
                        className="modalSelectField"
                        classNamePrefix="select"
                        onChange={handleChange}
                        value={selectedUsers}
                    />
                </div>
            </div>

            <button onClick={() => editproject.mutate({projectId : projectId, projectName : projectName, projectDescription : projectDescription, jsonString : jsonString})}>Submit Changes</button>
        </div>
        </>
    )
}