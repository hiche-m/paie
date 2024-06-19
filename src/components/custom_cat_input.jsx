const CustomCatInput = ({ label, type, placeholder, id, className = "", values = null, value = undefined, onChange = null, autoFocus = false }) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="mb-2">{label}</label>
            <select className={`p-2 pr-10 border border-disabled rounded-lg outline-textSecound space-x-4`} value={value} onChange={onChange} >
                {
                    Object.keys(values).map((key, index) => (
                        <optgroup key={`${key}-${index}`} label={key}>
                            {
                                Object.keys(values[key]).map((subkey, index) => (
                                    <option key={`${subkey}-${index}`} value={`${key};${subkey}`} >{subkey}</option>
                                ))
                            }
                        </optgroup>
                    ))
                }
            </select>
        </div>
    );
}

export default CustomCatInput;