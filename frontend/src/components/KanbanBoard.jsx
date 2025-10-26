import React, { useMemo, useState } from "react";
import TaskCard from "./TaskCard"; // Removed .jsx
import { Plus } from "lucide-react";
import CreateTaskModal from "./CreateTaskModal"; // Removed .jsx
import TaskDetailModal from "./TaskDetailModal"; // Removed .jsx

// This is the component for a single column
const KanbanColumn = ({ title, tasks, status, onOpenModal, onTaskClick }) => {
  // <-- Add onTaskClick
  // A helper to give each column a distinct color
  const statusColors = {
    "To-Do": "bg-blue-100 border-blue-400",
    "In Progress": "bg-yellow-100 border-yellow-400",
    Done: "bg-green-100 border-green-400",
  };

  const headerColor = statusColors[status] || "bg-gray-100 border-gray-400";

  return (
    // Column container
    <div className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 border border-gray-200">
      {/* Column Header */}
      <div
        className={`flex justify-between items-center mb-4 p-3 rounded-lg ${headerColor} border-t-4`}
      >
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <span className="text-sm font-bold text-gray-600 bg-white/50 px-3 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-4 h-[500px] overflow-y-auto pr-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)} // <-- ADD ONCLICK HANDLER
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 p-4 text-center">
            No tasks in this list.
          </p>
        )}
      </div>

      {/* --- ADD TASK BUTTON (NOW FUNCTIONAL) --- */}
      <button
        onClick={() => onOpenModal(status)} // <-- ADD ONCLICK
        className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-200 p-3 rounded-lg transition-colors"
      >
        <Plus size={16} />
        Add Task
      </button>
    </div>
  );
};

// This is the main board component
const KanbanBoard = ({
  tasks,
  project,
  onTaskCreated,
  onTaskUpdate,
  onTaskDelete,
}) => {
  // <-- ADD UPDATE/DELETE PROPS

  const [modalStatus, setModalStatus] = useState(null);

  // --- NEW STATE FOR TASK DETAIL MODAL ---
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter tasks into columns
  const columns = useMemo(() => {
    return {
      "To-Do": tasks.filter((task) => task.status === "To-Do"),
      "In Progress": tasks.filter((task) => task.status === "In Progress"),
      Done: tasks.filter((task) => task.status === "Done"),
    };
  }, [tasks]);

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4">
        <KanbanColumn
          title="To-Do"
          tasks={columns["To-Do"]}
          status="To-Do"
          onOpenModal={setModalStatus}
          onTaskClick={setSelectedTask} // <-- Pass setter
        />
        <KanbanColumn
          title="In Progress"
          tasks={columns["In Progress"]}
          status="In Progress"
          onOpenModal={setModalStatus}
          onTaskClick={setSelectedTask} // <-- Pass setter
        />
        <KanbanColumn
          title="Done"
          tasks={columns["Done"]}
          status="Done"
          onOpenModal={setModalStatus}
          onTaskClick={setSelectedTask} // <-- Pass setter
        />
      </div>

      {/* --- RENDER THE CREATE MODAL --- */}
      {modalStatus && (
        <CreateTaskModal
          project={project}
          status={modalStatus}
          onClose={() => setModalStatus(null)}
          onTaskCreated={onTaskCreated}
        />
      )}

      {/* --- RENDER THE DETAIL MODAL --- */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          projectTeam={project.team}
          onClose={() => setSelectedTask(null)}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      )}
    </>
  );
};

export default KanbanBoard;
