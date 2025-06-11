import { useContext } from 'react'
import './Modal.css'
import { AppContext } from '../../App'
import { AddTicket } from './ModalStates/AddTicket';
import { EditUser } from './ModalStates/EditUser';
import { AddProject } from './ModalStates/AddProject';
import { EditTicket } from './ModalStates/EditTicket';
import { EditProject } from './ModalStates/EditProject';
import { AddUser } from './ModalStates/AddUser';

export const Modal = ({setModalState}: any) => {
    const { modalContent, setModalContent, setSelectedUserId} = useContext<any>(AppContext);

    function exit(action1 : any, action2 : any, action3 : any) {
        action1();
        action2();
        action3();
    }

    return (
        <div className="greyArea">
            <div className="modalWindow">
                <div className="exitButton">
                    <button onClick={() => exit(setModalState(false), setModalContent(
                        {
                        addProject : false,
                        editProject : false,
                        addTicket : false,
                        editTicket : false,
                        editUser : false
                        }
                    ), setSelectedUserId(0))}> X </button>
                </div>
                <div className="modalContent">
                    {
                        modalContent?.addTicket
                            ? <AddTicket/>
                            : modalContent?.editUser
                                ? <EditUser/>
                                : modalContent?.addProject
                                    ? <AddProject/>
                                    : modalContent?.editTicket
                                        ? <EditTicket/>
                                        : modalContent?.editProject
                                            ? <EditProject/>
                                            : modalContent?.addUser
                                                ? <AddUser/>
                                                : <div>
                                                <div className="modalHeader">
                                                    <h1>Dummy Text</h1>
                                                </div>
                                                <div className="modalBody">
                                                    <p>Dummy Text</p>
                                                </div>
                                                <div className="modalFooter">
                                                    <p>Dummy Text</p>
                                                </div>
                                                </div> 
                    }
                </div>
            </div>
        </div>
    )
}
/* Create a state within the main App component that represents whether
or not the modal is rendered by the onClick of a button. It would look
something like this: onClick={()=>{setModal(true)}}
{setModalState(false)}*/

/* The onClick of the X button in the modal above would look like this:
onClick={()=>{setModal(false)}}. WILL NEED TO ACCESS THE setModal
METHOD FROM THE MAIN APP COMPONENT. WILL PROBABLY NEED USECONTEXT HOOK
OR REDUX TOOLKIT(OR PROPS IF REALLY LAZY)*/