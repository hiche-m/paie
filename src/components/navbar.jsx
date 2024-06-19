import { ThreeDots } from "react-loader-spinner";

const NavBar = ({ username }) => {
    return (<div className="flex justify-end items-center pr-3 h-14 bg-gradient-to-r from-background to-white shadow-sm">
        <span className="text-textSecound text-sm pr-2">
            connecté en tant que
        </span>
        {username === null || username === undefined ?
            (<ThreeDots
                visible={true}
                height="20"
                width="20"
                color="#FC6F1F"
                radius="5"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />)
            : (<span>
                {username}
            </span>)
        }
    </div>);
}

export default NavBar;