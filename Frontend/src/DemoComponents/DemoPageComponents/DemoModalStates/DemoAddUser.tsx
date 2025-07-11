import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import Select from 'react-select';
import Axios from "axios";
import '../../../Components/PageComponents/ModalStates/ModalContent.css'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DemoProject, DemoUser } from "../../../TypeInterfaces/Types";

export const DemoAddUser = () => {
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [assignedproject, setAssignedproject] = useState<any>()
    const [role, setRole] = useState<any>({});
    const [roleValue, setRoleValue] = useState<any>("");
    const roleOptions = [
        { label : "Demo Admin", value : "DEMOADMIN" },
        { label : "Demo User", value : "DEMOUSER" }
    ]
    const queryClient = useQueryClient();

    const addDemoUser = async ({username, password, assignedproject, roleValue} : any) => {
        
        try{
            const response = await Axios.post<DemoUser>("http://localhost:8080/demo/api/admin/users",
                {   
                    username : username,
                    password : password,
                    assignedproject : assignedproject, 
                    role : roleValue
                },
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Demo User successfully created.");
        } catch (err) {
            alert("New user must be assigned to a project. Create project if none exists yet.");
        }
    }

    const adddemouser = useMutation({
        mutationFn : addDemoUser,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allDemoUsers"]})
        }
    })

    const getDemoProjects = async () => {
        try{
            const response = await Axios.get<DemoProject[]>('http://localhost:8080/demo/api/admin/project', 
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

    const getdemoprojects = useQuery({
        queryKey : ["modalAllDemoProjects"],
        queryFn : getDemoProjects
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
            <h3>Create Demo User</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Username:</label>
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
                        options={roleOptions}
                        className="modalSelectField"
                        classNamePrefix="select"
                        onChange={handleChange}
                        value={role}
                    />
                </div>
            </div>
                
            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Assign to project:</label>
                </div>
                <div className="modalInputBar">
                    <select onChange={(e) => setAssignedproject(e.target.value)}>
                        <option value="" selected>--Select Project--</option>
                        {getdemoprojects?.data?.map((project : DemoProject) => {
                            return <option value={project.projectId} >ID#{project?.projectId}: {project?.projectName}</option>
                        })}
                    </select>
                </div>
            </div>

            <button onClick={() => adddemouser.mutate({username : username, password : password, assignedproject : assignedproject, roleValue : roleValue})}>Submit Changes</button>
        </div>
        </>
    )
}