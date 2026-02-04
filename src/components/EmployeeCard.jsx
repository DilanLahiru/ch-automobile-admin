import { CheckCircle, Edit2, Hash, IdCard, MapPin, Phone, Trash2 } from "lucide-react";

// Employee Card Component
const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (str) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-orange-100 text-orange-600",
    ];
    const index =
      str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${getRandomColor(employee.name)} font-semibold text-lg`}
            >
              {getInitials(employee.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(employee)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(employee.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-gray-600">{employee.contactNumber}</span>
          </div>
          <div className="flex items-center text-sm">
            <IdCard className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-gray-600">NIC: {employee.nicNumber}</span>
          </div>
          <div className="flex items-center text-sm">
            <Hash className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-gray-600">EPF: {employee.epfNumber}</span>
          </div>
          <div className="flex items-start text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1" />
            <span className="text-gray-600">{employee.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-600">
              {employee.status}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Joined: {new Date(employee.joinDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;