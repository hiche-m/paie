import MenuTile from "./side_menu_tile";
import dashboardIcon from "../assets/Icons/dashboard.svg"
import newIcon from "../assets/Icons/new.svg"
import exitIcon from "../assets/Icons/exit.svg"
import addIcon from "../assets/Icons/add.svg"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logOut } from "../services/firebase";

const SideMenu = ({ className }) => {
    const navigate = useNavigate();

    const location = useLocation();

    const handleDisconnect = async () => {
        const response = await logOut();
        if (response === null) {
            navigate("/");
        } else {
            window.alert(response);
        }
    };

    return (
        <div className={`${className} pt-[30vh] pl-5`}>
            <div className={`flex flex-col h-screen`}>
                <span className="text-white text-opacity-75 text-lg">MENU</span>
                <MenuTile title="Tableau de bord" icon={dashboardIcon} isSelected={location.pathname === "/dashboard"} route="/dashboard" />
                <MenuTile title="Nouvelle entrée" icon={addIcon} isSelected={location.pathname === "/add_cycle"} route="/add_cycle" iconSize="6" />
                <MenuTile title="Ajouter un enseignant" icon={newIcon} isSelected={location.pathname === "/entries"} route="/entries" />
                <span className="h-1/3"></span>
                <span className="cursor-pointer text-white text-opacity-75 text-lg mb-5 flex flex-row items-center" onClick={() => handleDisconnect()}><img className={`h-5 w-5 m-2`} src={exitIcon} /> Se déconnecter</span>
            </div>
            <div className="flex grow"></div>
        </div>
    );
}

export default SideMenu;