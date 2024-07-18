import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const Layout = () => {
	return (
		<div className="w-screen h-screen relative">
			
			<Navbar onSearch={function (): void {
				throw new Error("Function not implemented.");
			} } />
			<div className="md:pl-[250px] pl-[60px] pr-[20px] pt-[70px] w-full h-full overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
