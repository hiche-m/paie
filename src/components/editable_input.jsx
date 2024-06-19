import { useEffect } from "react";

const EditInput = ({ data, indexKey, onChange, value = data[0] }) => {
    return (
        <select className="border-t border-b-0 border-l-0 border-r-0 border-gray-300 p-2 outline-none focus:border-gray-500 text-left" value={value.toString()} onChange={onChange} >
            {Array.from(data).map((option, index) => (
                <option key={`option-${indexKey}${index}`} value={option.toString()}>
                    {option.toString()}
                </option>)
            )}
        </select>
    );
}

export default EditInput;