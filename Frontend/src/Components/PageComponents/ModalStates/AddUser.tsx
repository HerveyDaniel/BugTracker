import { useEffect, useContext, useState, useReducer} from "react";
import useAuth from "../../../Hooks/useAuth";
import Select from 'react-select';
import Axios from "axios";
import './ModalContent.css'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Project, User } from "../../../TypeInterfaces/Types";

export const AddUser = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const authRole = ["ADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [assignedProject, setAssignedProject] = useState<any>()
    const [role, setRole] = useState<any>({});
    const [roleValue, setRoleValue] = useState<any>("");
    const roleOptions = [
        { label : "Admin", value : "ADMIN" },
        { label : "User", value : "USER" }
    ]
    const queryClient = useQueryClient();

    const addUser = async ({username, password, assignedProject, roleValue} : any) => {
        
        try{
            const response = await Axios.post<User>("http://localhost:8080/api/admin/users",
                {   
                    username : username,
                    password : password,
                    assignedProject : assignedProject, 
                    role : roleValue
                },
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("User successfully created.");
        } catch (err) {
            alert("New user must be assigned to a project. Create project if none exists yet.")
        }
    }

    const adduser = useMutation({
        mutationFn : addUser,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allUsers"]})
        }
    })

    const getProjects = async () => {
        try{
            const response = await Axios.get<Project[]>('http://localhost:8080/api/admin/project', 
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

    const getprojects = useQuery({
        queryKey : ["modalAllProjects"],
        queryFn : getProjects
    })

    const handleChange = (selectedOption : any) => {
        setRole(selectedOption);
      };

    function updateRole(){
        setRoleValue(role?.value)
    }

    useEffect(() => {
        if(role?.value){
            updateRole();
        }
    }, [role])

    return (
        <>
        <div className="modalStateContent">
            <h3>Create User</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Name:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Username..." onChange={(e) => setUsername(e.target.value)}/>
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Password:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="User Password..." onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>
            
            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Role:</label>
                </div>
                <div className="modalInputBar">
                    <Select
                        isSearchable
                        name="colors"
                        className="modalSelectField"
                        classNamePrefix="select"
                        options={roleOptions}
                        onChange={handleChange}
                        placeholder= "Select Role"
                    />
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Assign to project:</label>
                </div>
                <div className="modalInputBar">
                    <select onChange={(e) => setAssignedProject(e.target.value)}>
                        <option value="" selected>--Select Project--</option>
                        {getprojects?.data?.map((project : Project) => {
                            return <option value={project.projectId} >ID#{project?.projectId}: {project?.projectName}</option>
                        })}
                    </select>
                </div>
            </div>

            <button onClick={() => adduser.mutate({username : username, password : password, assignedProject : assignedProject, roleValue : roleValue})}>Submit Changes</button>
        </div>
        </>
    )
} 