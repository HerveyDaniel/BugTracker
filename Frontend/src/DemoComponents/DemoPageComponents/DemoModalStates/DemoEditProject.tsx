import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../App";
import useAuth from "../../../Hooks/useAuth";
import Axios from "axios";
import Select from 'react-select';
import '../../../Components/PageComponents/ModalStates/ModalContent.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DemoProject, DemoUser } from "../../../TypeInterfaces/Types";

export const DemoEditProject = () => {
    const {currentProject} : any = useContext(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [selectedUsers, setSelectedUsers] = useState<any>([]);
    const projectId = currentProject?.projectId;
    const [selectedUsersData, setSelectedUsersData] = useState<any>([]);
    const queryClient = useQueryClient();
    const jsonString = JSON.stringify(selectedUsersData)


    const editDemoProject = async ({projectId, projectName, projectDescription, jsonString} : any) => {
        
        try{
            const response = await Axios.put<DemoProject>("http://localhost:8080/demo/api/admin/project/edit",
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
            alert("Demo project has been successfully edited.");
        } catch (err) {
            alert("One or more of these users are already assigned to this project.");
        }
    }

    const editdemoproject = useMutation({
        mutationFn : editDemoProject,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allDemoProjects"]});
        }
    })

    const getAllDemoUsers = async () => {
        try {
        const response = await Axios.get<DemoUser[]>("http://localhost:8080/demo/api/admin/users",
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

    const alldemousers = useQuery({
        queryKey : ["modalAllDemoUsers"],
        queryFn : getAllDemoUsers
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
            <h3>Edit Demo Project: #{currentProject?.projectId} {currentProject?.projectName}</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Project Name:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Project Name..." onChange={(e) => setProjectName(e.target.value)}/>
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Project Description:</label>
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
                        options={alldemousers?.data?.map((user : DemoUser) => {
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

            <button onClick={() => editdemoproject.mutate({projectId : projectId, projectName : projectName, projectDescription : projectDescription, jsonString : jsonString})}>Submit Changes</button>
        </div>
        </>
    )
}