import { UserCircle, Bell, Search } from "lucide-react";

export function Navbar() {
    return (
        <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-100 rounded-full transition-all">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <UserCircle size={20} />
                    </div>
                    <div className="text-sm text-left hidden sm:block">
                        <p className="font-medium text-gray-700">John Doe</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
