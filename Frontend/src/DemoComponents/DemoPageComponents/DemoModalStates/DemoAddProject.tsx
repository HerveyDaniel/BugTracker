import { useEffect, useState } from "react";
import Axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import Select from 'react-select';
import '../../../Components/PageComponents/ModalStates/ModalContent.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DemoProject, DemoUser } from "../../../TypeInterfaces/Types";

export const DemoAddProject = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [assignedUsers, setAssignedUsers] = useState<any>([]);
    const [assignedUsersData, setAssignedUsersData] = useState<any>([]);
    const jsonString = JSON.stringify(assignedUsersData)
    const queryClient = useQueryClient();
    
    
    const createDemoProject = async ({projectName, projectDescription} : any) => {

        try{
            const response = await Axios.post<DemoProject>(`http://localhost:8080/demo/api/admin/project`,
                {
                    projectName : projectName,
                    projectDescription : projectDescription,
                    assignedUsers : jsonString
                },
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Demo Project successfully created.");
        } catch (err) {
            alert(err);
        }
    }

    const createdemoproject = useMutation({
        mutationFn : createDemoProject,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allDemoProjects"]})
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
        setAssignedUsers(selectedOption);
      };

    function updateAssignedUsers(){
        {assignedUsers?.map((user : any) => {
            setAssignedUsersData([...assignedUsersData, user?.value?.id])
        })}
    }

    useEffect(() => {
        updateAssignedUsers();
    }, [assignedUsers])

    return (
        <>
        <div className="modalStateContent">
            <h3>Create Demo Project</h3>

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

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Assign to Project:</label>
                </div>
                <div className="modalInputBar">
                    <Select
                        isMulti
                        isSearchable
                        name="colors"
                        options={alldemousers?.data?.map((user : DemoUser) => {
                            return(
                                { label : "ID: " + user?.id + " " + user?.username, value : user }
                            )
                        })}
                        className="modalSelectField"
                        classNamePrefix="select"
                        onChange={handleChange}
                        value={assignedUsers}
                    />
                </div>
            </div>

            <button onClick={() => createdemoproject.mutate({projectName : projectName, projectDescription : projectDescription})}>Create Project</button>
        </div>
        </>
    )
}