import { forwardRef } from "react";

const CustomInput = forwardRef(({ label, type, placeholder, id, className = "", values = null, value = undefined, onChange = null, autoFocus = false }, ref) => {

    if (values !== null && values instanceof Array) {
        return (
            <div className={`flex flex-col ${className}`}>
                <label className="mb-2">{label}</label>
                <select className={`p-2 pr-10 border border-disabled rounded-lg outline-textSecound space-x-4`} value={value} onChange={onChange} id={id} ref={ref} >
                    {Array.from(values).map((option, index) => (
                        <option key={`option-form${index}`} value={option.toString()} className="">
                            {option.toString()}
                        </option>)
                    )}
                </select>
            </div>
        );
    }

    return (<div className={`flex flex-col ${className}`}>
        <label className="mb-2">{label}</label>
        <input className="p-2 pr-10 border border-disabled rounded-lg outline-textSecound" type={type} placeholder={placeholder} id={id} value={value} onChange={onChange} autoFocus={autoFocus ?? undefined} ref={ref} />
    </div>
    );
});

export default CustomInput;