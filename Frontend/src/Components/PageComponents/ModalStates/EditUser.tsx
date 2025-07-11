import { useContext, useState, useEffect } from 'react';
import './ModalContent.css'
import Select from 'react-select';
import useAuth from '../../../Hooks/useAuth';
import { AppContext } from '../../../App';
import Axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../../../TypeInterfaces/Types';

export const EditUser = () => {

    const { selectedUserId, selectedUser } : any = useContext(AppContext);
    const { auth } : any = useAuth();
    const token = auth?.jwt;
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<any>({});
    const [roleValue, setRoleValue] = useState<any>("");
    const queryClient = useQueryClient();
    const roleOptions = [
        { label : "Admin", value : "ADMIN" }, 
        { label : "User", value : "USER" }
    ]

    const editUser = async ({selectedUserId, username, password, roleValue} : any) => {
        
        try{
            const response = await Axios.put<User>("http://localhost:8080/api/admin/users/edit",
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
            alert("User has been successfully updated.");
        } catch (err) {
            alert(err);
        }
    }

    const edituser = useMutation({
        mutationFn : editUser,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["allUsers"]})
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
            <h3>Edit User: #{selectedUser?.id} {selectedUser?.username}</h3>
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

            <button onClick={() => edituser.mutate({selectedUserId : selectedUserId, username : username, password : password, roleValue : roleValue})}>Submit Changes</button>
        </div>
        </>
    )
} 
