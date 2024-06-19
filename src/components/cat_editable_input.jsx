import { useState } from "react";

const CatEditInput = ({ data, value, onChange }) => {
    return (
        <select className="border-t border-b-0 border-l-0 border-r-0 border-gray-300 p-2 outline-none focus:border-gray-500 text-left" value={value} onChange={onChange} >
            {
                Object.keys(data).map((key, index) => {
                    return (<optgroup key={`${key}-${index}`} label={key === '-' ? "" : key}>
                        {
                            Object.keys(data[key]).map((subkey, subindex) => {
                                return (
                                    <option key={`${subkey}-${subindex}`} value={`${key};${subkey}`} >{subkey}</option>
                                );
                            })
                        }
                    </optgroup>);
                })
            }
        </select>
    );
}

export default CatEditInput;