const CustomOutput = ({ label, id, className, value = undefined }) => {

    return (<div className={`flex flex-col ${className}`}>
        <label className="mb-2">{label}</label>
        <span id={id} className="font-medium ">{value}</span>
    </div>
    );
}

export default CustomOutput;