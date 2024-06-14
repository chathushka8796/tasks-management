import React, { useState, useEffect, useRef } from "react";
import { getRandomColors } from "../../helpers/getRandomColors";
import { v4 as uuidv4 } from "uuid";
import { TaskT } from "../../types";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface Tag {
  title: string;
  bg: string;
  text: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTask: (taskData: TaskT) => void;
  handleUpdateTask: (taskData: TaskT) => void;
  handleDeleteTask: (taskId: string) => void;
  isEditing: boolean;
  taskToEdit?: TaskT | null;
}

const AddModal = ({
  isOpen,
  onClose,
  setOpen,
  handleAddTask,
  handleUpdateTask,
  handleDeleteTask,
  isEditing,
  taskToEdit,
}: AddModalProps) => {
  const initialTaskData: TaskT = {
    id: uuidv4(),
    title: "",
    description: "",
    priority: "",
    deadline: 0,
    image: "",
    alt: "",
    tags: [] as Tag[],
  };

  const [taskData, setTaskData] = useState<TaskT>(initialTaskData);
  const [tagTitle, setTagTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [buttonText, setButtonText] = useState<string>("Submit Task");
  const [buttonColor, setButtonColor] = useState<string>("bg-orange-400");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isEditing && taskToEdit) {
      setTaskData(taskToEdit);
      setButtonText("Update Task");
    } else {
      setTaskData(initialTaskData);
      setButtonText("Submit Task");
    }
  }, [isEditing, taskToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "deadline" && (parseInt(value) < 0 || isNaN(parseInt(value)))) {
      setError("Deadline must be a positive number");
      return;
    } else if (name === "title") {
      const regex = /^[a-zA-Z\s]*$/;
      if (!regex.test(value)) {
        setError("Title cannot contain special characters or numbers");
        return;
      }
    } else if (name === "description") {
      const regex = /^[^\d]*$/;
      if (!regex.test(value)) {
        setError("Description cannot contain numbers");
        return;
      }
    }

    setTaskData({ ...taskData, [name]: value });
    setError("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          setError("Image upload failed");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setTaskData({ ...taskData, image: downloadURL, alt: file.name });
          });
        }
      );
    }
  };

  const handleAddTag = () => {
    if (tagTitle.trim() !== "") {
      const { bg, text } = getRandomColors();
      const newTag: Tag = { title: tagTitle.trim(), bg, text };
      setTaskData({ ...taskData, tags: [...taskData.tags, newTag] });
      setTagTitle("");
    }
  };

  const handleRemoveTag = (title: string) => {
    const updatedTags = taskData.tags.filter(tag => tag.title !== title);
    setTaskData({ ...taskData, tags: updatedTags });
  };

  const closeModal = () => {
    setOpen(false);
    onClose();
    setTaskData(initialTaskData);
    setError("");
    setUploadProgress(0);
    setButtonText(isEditing ? "Update Task" : "Submit Task");
    setButtonColor("bg-orange-400");
  };

  const handleSubmit = () => {
    if (!taskData.title || !taskData.description || !taskData.priority || !taskData.deadline) {
      setError("Please fill out all fields");
      return;
    }
    if (isEditing) {
      handleUpdateTask(taskData);
    } else {
      handleAddTask(taskData);
    }
    closeModal();
  };

  const handleMouseDown = () => {
    if (isEditing) {
      timeoutRef.current = setTimeout(() => {
        setButtonText("Delete Task");
        setButtonColor("bg-red-500");
      }, 2000); // Change to 1 second
    }
  };

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleClick = () => {
    if (buttonText === "Delete Task") {
      handleDelete();
    } else {
      handleSubmit();
    }
  };

  const handleDelete = () => {
    if (buttonText === "Delete Task" && taskToEdit) {
      handleDeleteTask(taskToEdit.id);
      closeModal();
    }
  };

  return (
    <div
      className={`w-screen h-screen place-items-center fixed top-0 left-0 ${
        isOpen ? "grid" : "hidden"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-title"
    >
      <div
        className="w-full h-full bg-black opacity-70 absolute left-0 top-0 z-20"
        onClick={closeModal}
      ></div>
      <div className="md:w-[30vw] w-[90%] bg-white rounded-lg shadow-md z-50 flex flex-col items-center gap-3 px-5 py-6">
        <h2 id="add-task-title" className="sr-only">{isEditing ? "Edit Task" : "Add Task"}</h2>
        {error && <div className="text-red-500">{error}</div>}
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
          aria-label="Title"
        />
        <input
          type="text"
          name="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
          aria-label="Description"
        />
        <select
          name="priority"
          onChange={handleChange}
          value={taskData.priority}
          className="w-full h-12 px-2 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
          aria-label="Priority"
        >
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="number"
          name="deadline"
          value={taskData.deadline}
          onChange={handleChange}
          placeholder="Deadline"
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
          aria-label="Deadline"
          min="0"
        />
        <input
          type="text"
          value={tagTitle}
          onChange={(e) => setTagTitle(e.target.value)}
          placeholder="Tag Title"
          className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
          aria-label="Tag Title"
        />
        <button
          className="w-full rounded-md h-9 bg-slate-500 text-amber-50 font-medium"
          onClick={handleAddTag}
        >
          Add Tag
        </button>
        <div className="w-full">
          {taskData.tags.length > 0 && <span>Tags:</span>}
          {taskData.tags.map((tag, index) => (
            <div
              key={index}
              className="inline-block mx-1 px-[10px] py-[2px] text-[13px] font-medium rounded-md cursor-pointer"
              style={{ backgroundColor: tag.bg, color: tag.text }}
              onClick={() => handleRemoveTag(tag.title)}
            >
              {tag.title}
            </div>
          ))}
        </div>
        <div className="w-full flex items-center gap-4 justify-between">
          <input
            type="text"
            name="alt"
            value={taskData.alt}
            onChange={handleChange}
            placeholder="Image Alt"
            className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
            aria-label="Image Alt"
          />
          <input
            type="file"
            name="image"
            onChange={handleImageUpload}
            className="w-full"
            aria-label="Image"
          />
        </div>
        {uploadProgress > 0 && (
          <div className="w-full h-4 bg-gray-200 rounded-full mt-2">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        <button
          className={`w-full mt-3 rounded-md h-9 text-blue-50 font-medium ${buttonColor}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default AddModal;
