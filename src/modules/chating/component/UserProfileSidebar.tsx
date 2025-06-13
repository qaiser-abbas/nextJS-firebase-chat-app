import React from "react";

const UserProfileSidebar = ({ user }: { user: any }) => {
    return (
        <div className="w-[300px] bg-[#F9FAFB] p-4 border-l shadow-md">
            <div className="flex flex-col items-center gap-2 mt-5">
                <img
                    src={user.photoURL || "/profile.jpg"}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="text-xs text-gray-400">{user.role || "Member"}</span>

                <div className="mt-4 flex flex-col gap-2 w-full">
                    <button className="bg-[#5D2294] text-white rounded px-4 py-2">
                        Chat
                    </button>
                    <button className="bg-[#8B8F94] text-black rounded px-4 py-2">
                        Video Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileSidebar;
