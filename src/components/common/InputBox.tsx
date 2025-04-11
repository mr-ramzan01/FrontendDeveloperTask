import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi';

const InputBox = ({ value, type, onChange, name, className="", placeholder = "", error }: { value: string, type: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; className?: string, placeholder?: string, error?: string }) => {
    const [showPassword, setShowPassword] = useState(false);
    const borderClass = error ? 'border-red-500' : 'border-[#30303D]';
    return (
        <div className={`bg-[#1D1E26] relative border ${borderClass} h-[50px] w-full rounded-[10px]`}>
            <input
                className={`${className} ${type === "password" ? "pr-10" : ""} px-3 outline-none placeholder:text-[#707593] h-full w-full bg-transparent rounded-[10px]`}
                placeholder={placeholder}
                value={value}
                type={type === "password" ? showPassword ? "text" : "password" : type}
                onChange={onChange}
                name={name}
                autoComplete='true'
            />
            {
                type === "password" && <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-[#707593]"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {!showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
            }
        </div>
    )
}

export default InputBox