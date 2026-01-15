// PasswordInput.jsx
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  showPassword,
  onToggleShowPassword,
  ...rest
}) => (
  <div className="relative">
    {label && (
      <label
        htmlFor={name}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
    )}
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="bg-gray-50 border border-gray-300 text-slate-600 text-sm rounded-lg block w-full p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
      {...rest}
    />
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggleShowPassword}
      className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 focus:outline-none"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

export default PasswordInput;
