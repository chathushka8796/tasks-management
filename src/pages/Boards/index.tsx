import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { Columns, TaskT } from "../../types";
import { onDragEnd } from "../../helpers/onDragEnd";
import { AddOutline } from "react-ionicons";
import AddModal from "../../components/Modals/AddModal";
import Task from "../../components/Task";
import { v4 as uuidv4 } from "uuid";

const initialBoard: Columns = {
	backlog: {
		name: "Backlog",
		items: []
	},
	pending: {
		name: "Pending",
		items: []
	},
	todo: {
		name: "To Do",
		items: []
	},
	doing: {
		name: "Doing",
		items: []
	},
	done: {
		name: "Done",
		items: []
	}
};

const Home = () => {
	const [columns, setColumns] = useState<Columns>(initialBoard);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedColumn, setSelectedColumn] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [taskToEdit, setTaskToEdit] = useState<TaskT | null>(null);

	useEffect(() => {
		const savedBoard = localStorage.getItem("board");
		if (savedBoard) {
			setColumns(JSON.parse(savedBoard));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("board", JSON.stringify(columns));
	}, [columns]);

	const openModal = (columnId: string, task: TaskT | null = null) => {
		setSelectedColumn(columnId);
		setIsEditing(task !== null);
		setTaskToEdit(task);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setTaskToEdit(null);
		setIsEditing(false);
	};

	const handleAddTask = (taskData: TaskT) => {
		const newBoard = { ...columns };
		newBoard[selectedColumn].items.push({ ...taskData, id: uuidv4() });
		setColumns(newBoard);
	};

	const handleUpdateTask = (taskData: TaskT) => {
		const newBoard = { ...columns };
		const columnItems = newBoard[selectedColumn].items;
		const taskIndex = columnItems.findIndex((task) => task.id === taskData.id);
		if (taskIndex !== -1) {
			columnItems[taskIndex] = taskData;
		}
		setColumns(newBoard);
		closeModal();
	};

	const handleDeleteTask = (taskId: string) => {
		const newBoard = { ...columns };
		const columnItems = newBoard[selectedColumn].items;
		const updatedItems = columnItems.filter((task) => task.id !== taskId);
		newBoard[selectedColumn].items = updatedItems;
		setColumns(newBoard);
		closeModal();
	};

	return (
		<>
			<DragDropContext onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}>
				<div className="w-full flex items-start justify-between px-5 pb-8 md:gap-0 gap-10">
					{Object.entries(columns).map(([columnId, column]) => (
						<div className="w-full flex flex-col gap-0" key={columnId}>
							<Droppable droppableId={columnId} key={columnId}>
								{provided => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
									>
										<div className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
											{column.name}
										</div>
										{column.items.map((task, index) => (
											<Draggable key={task.id} draggableId={task.id} index={index}>
												{provided => (
													<Task
														provided={provided}
														task={task}
														openModal={() => openModal(columnId, task)}
													/>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
							<div
								onClick={() => openModal(columnId)}
								className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]"
							>
								<AddOutline color={"#555"} />
								Add Task
							</div>
						</div>
					))}
				</div>
			</DragDropContext>

			<AddModal
				isOpen={modalOpen}
				onClose={closeModal}
				setOpen={setModalOpen}
				handleAddTask={handleAddTask}
				handleUpdateTask={handleUpdateTask}
				handleDeleteTask={handleDeleteTask}
				isEditing={isEditing}
				taskToEdit={taskToEdit}
			/>
		</>
	);
};

export default Home;
