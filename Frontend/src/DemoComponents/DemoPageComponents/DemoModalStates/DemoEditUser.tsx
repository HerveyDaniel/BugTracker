import { useEffect, useContext, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import Select from 'react-select';
import Axios from "axios";
import { AppContext } from "../../../App";
import '../../../Components/PageComponents/ModalStates/ModalContent.css'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DemoUser } from "../../../TypeInterfaces/Types";

export const DemoEditUser = () => {

    const { selectedUserId, selectedUser } : any = useContext(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const authRole = ["DEMOADMIN"];/* Temporary fix; find out how to get prop from App.tsx */
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<any>({});
    const [roleValue, setRoleValue] = useState<any>("");
    const queryClient = useQueryClient();
    const roleOptions = [
        { label : "Demo Admin", value : "DEMOADMIN" },
        { label : "Demo User", value : "DEMOUSER" } 
    ]

    const editDemoUser = async ({selectedUserId, username, password, roleValue} : any) => {
        
        try{
            const response = await Axios.put<DemoUser>("http://localhost:8080/demo/api/admin/users/edit",
                {   
                    id : selectedUserId,
                    username : username,
                    password : password, 
                    role : roleValue
                },
                {
                    headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'}
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Demo user has been successfully updated.");
        } catch (err) {
            alert(err);
        }
    }

    const editdemouser = useMutation({
        mutationFn : editDemoUser,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allDemoUsers"]})
        }
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
            <h3>Edit Demo User: #{selectedUser?.id} {selectedUser?.username}</h3>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Name:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Name..." onChange={(e) => setUsername(e.target.value)}/>
                </div>
            </div>

            <div className="modalInputContainer">
                <div className="modalLabel">
                    <label>Password:</label>
                </div>
                <div className="modalInputBar">
                    <input type="text"  placeholder="Updated Password..." onChange={(e) => setPassword(e.target.value)}/>
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

            <button onClick={() => editdemouser.mutate({selectedUserId : selectedUserId, username : username, password : password, roleValue : roleValue})}>Submit Changes</button>
        </div>
        </>
    )
}