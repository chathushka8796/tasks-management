import {
  ChevronDown,
  PersonCircle,
  SearchOutline,
 
} from "react-ionicons";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  return (
    <div className="md:w-[calc(100%-230px)] w-[calc(100%-60px)] fixed flex items-center justify-between pl-2 pr-6 h-[70px] top-0 md:left-[230px] left-[60px] border-b border-slate-300 bg-[#fff]">
      <div className="flex items-center gap-3 cursor-pointer">
        <PersonCircle color="#60a5fa" width={"28px"} height={"28px"} />
        <span className="text-blue-400 font-semibold md:text-lg text-sm whitespace-nowrap">
          Tasks Board
        </span>
       
      </div>
      <div className="md:w-[800px] w-[130px] bg-gray-100 rounded-lg px-3 py-[10px] flex items-center gap-2">
        <SearchOutline color={"#999"} />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-100 outline-none text-[15px]"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="md:flex hidden items-center gap-4">
        <div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
          
        </div>
        <div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
          
        </div>
        <div className="grid place-items-center bg-gray-100 rounded-full p-2 cursor-pointer">
           
        </div>
      </div>
    </div>
  );
};

export default Navbar;
