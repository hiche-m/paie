const CustomButton = ({ text, onClick, icon = null }) => {
    return (
        <div className="cursor-pointer flex flex-row justify-center items-center p-3 bg-secoundaryIdle hover:bg-secoundaryLighter active:bg-secoundaryDarker rounded-lg" onClick={onClick}>
            {icon !== null ? <img src={icon} className="h-5 w-5 mr-3" /> : <></>}
            <button className="text-white">{text}</button>
        </div>
    );
}

export default CustomButton;