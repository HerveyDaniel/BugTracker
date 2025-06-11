import { useContext } from "react";
import '../../Components/PageComponents/Modal.css'
import { AppContext } from "../../App";
import { DemoAddProject } from "./DemoModalStates/DemoAddProject";
import { DemoAddTicket } from "./DemoModalStates/DemoAddTicket";
import { DemoEditProject } from "./DemoModalStates/DemoEditProject";
import { DemoEditTicket } from "./DemoModalStates/DemoEditTicket";
import { DemoEditUser } from "./DemoModalStates/DemoEditUser";
import { DemoAddUser } from "./DemoModalStates/DemoAddUser";

export const DemoModal = ({setDemoModalState}: any) => {
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
                    <button onClick={() => exit(setDemoModalState(false), setModalContent(
                        {
                        addProject : false,
                        editProject : false,
                        addTicket : false,
                        editTicket : false,
                        addUser : false,
                        editUser : false
                        }
                    ), setSelectedUserId(0))}> X </button>
                </div>
                <div className="modalContent">
                    {
                        modalContent?.addTicket
                            ? <DemoAddTicket/>
                            : modalContent?.editUser
                                ? <DemoEditUser/>
                                : modalContent?.addProject
                                    ? <DemoAddProject/>
                                    : modalContent?.editTicket
                                        ? <DemoEditTicket/>
                                        : modalContent?.editProject
                                            ? <DemoEditProject/>
                                            : modalContent?.addUser
                                                ? <DemoAddUser/>
                                                : <div>
                                                <div className="modalHeader">
                                                    <h1>DEMO: Dummy Text</h1>
                                                </div>
                                                <div className="modalBody">
                                                    <p>DEMO: Dummy Text</p>
                                                </div>
                                                <div className="modalFooter">
                                                    <p>DEMO: Dummy Text</p>
                                                </div>
                                                </div> 
                    }
                </div>
            </div>
        </div>
    )
}  