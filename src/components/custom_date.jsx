import DatePicker from "react-datepicker";

const CustomDate = ({ label, id, className = "", value = undefined, onChange = null, autoFocus = false }) => {

    return (<div className={`flex flex-col ${className}`}>
        <label className="mb-2">{label}</label>
        <DatePicker
            id={id}
            autoFocus={autoFocus}
            selected={value}
            onChange={onChange}
            className="p-2 pr-10 border border-disabled rounded-lg outline-textSecound"
            dateFormat="dd/MM/yyyy"
            placeholderText="Ex: 01/01/2024"
        />
    </div>
    );
}

export default CustomDate;