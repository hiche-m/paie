import { Link } from "react-router-dom";

const MenuTile = ({ className, title, icon, onClick, isSelected = false, route = "/", iconSize = "5" }) => {
    return (
        <Link to={route}>
            <div className={`cursor-pointer flex flex-row items-center text-white text-lg pt-3 ${className} ${isSelected ? "" : "text-opacity-75"}`} onClick={onClick}>
                <div className={`mr-3 p-0.5 ${isSelected ? "bg-black bg-opacity-35 rounded-lg" : ""}`}>
                    <img className={`h-${iconSize} w-${iconSize} m-2`} src={icon} />
                </div>
                {title}
            </div>
        </Link>
    );
}

export default MenuTile;