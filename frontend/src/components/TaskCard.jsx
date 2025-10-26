import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

// Get initials for the avatar
const getInitials = (name = 'Unassigned') => {
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Get priority color
const priorityColors = {
  High: 'bg-red-100 text-red-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const TaskCard = ({ task, onClick }) => { // <-- ADD onClick PROP
  const priorityColor = priorityColors[task.priority] || 'bg-gray-100 text-gray-600';
  const deadline = formatDate(task.deadline);
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Done';

  return (
    <div 
      onClick={onClick} // <-- ADD ONCLICK HANDLER
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <h3 className="text-md font-semibold text-gray-800 mb-2">{task.title}</h3>

      {/* Priority Tag */}
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityColor}`}>
        {task.priority} Priority
      </span>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        {/* Assignee Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
            {getInitials(task.assignee?.name)}
          </div>
          <span className="text-sm text-gray-500">{task.assignee?.name || 'Unassigned'}</span>
        </div>

        {/* Deadline */}
        {deadline && (
          <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {isOverdue && <AlertCircle size={14} />}
            <Calendar size={14} />
            <span>{deadline}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

