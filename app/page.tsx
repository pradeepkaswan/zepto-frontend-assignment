"use client";

import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { User, userData } from "@/data/user-data";
import ViewContainer from "@/components/layouts/view-container";
import Image from "next/image";

const initialUsers = userData;

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<null | number>(
    null
  );

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      setPressCount((prevCount) => prevCount + 1);
      console.log("Presscount", pressCount);
      if ((pressCount + 1) % 2 === 0) {
        setSelectedUsers((prevUsers) => prevUsers.slice(0, -1));
      } else {
        setLastSelectedIndex(selectedUsers.length - 1);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }

    setDropdownOpen(value.trim() !== "");
  };

  const handleUserAction = (user: User, action: "add" | "remove") => {
    if (action === "add") {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.filter((u) => u.id !== user.id)
      );
    } else {
      const updatedUserList = selectedUsers.filter((u) => u.id !== user.id);
      setUsers((prevState) => [...prevState, user]);
      setSelectedUsers(updatedUserList);
    }

    setInputValue("");
    setDropdownOpen(true);
  };

  const handleRemove = (removedUser: User) => {
    handleUserAction(removedUser, "remove");
  };

  return (
    <ViewContainer className="relative flex flex-col items-center gap-10 m-4">
      <h1 className="text-4xl font-bold text-blue-600">Pick Users</h1>
      <div className="wrapper w-full border-b-4 border-blue-600 bg-transparent pt-2 pb-2 font-sans ">
        <ul className="flex flex-wrap gap-6">
          {selectedUsers.map((user, index) => (
            <li
              key={user.id}
              className={`flex items-center bg-gray-300 rounded-full gap-4 ${
                index === lastSelectedIndex ? "bg-gray-400" : "bg-gray-300"
              }`}
            >
              <Image
                className="rounded-full h-8 w-8"
                src={user.avatar}
                height={10}
                width={10}
                alt="avatar"
              />
              <span>{user.name}</span>
              <button className="pr-3" onClick={() => handleRemove(user)}>
                &#x2715;
              </button>
            </li>
          ))}
          <div>
            <input
              className="outline outline-0"
              type="text"
              placeholder="Add new user..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onClick={() => setDropdownOpen(true)}
            />

            {isDropdownOpen && (
              <ul className="bg-white border rounded shadow-2xl max-h-80 overflow-auto absolute">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="px-6 font-sans text-sm py-2 cursor-pointer transition duration-300 hover:bg-gray-200 flex items-center space-x-4"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUserAction(user, "add");
                    }}
                  >
                    <Image
                      src={user.avatar}
                      height={50}
                      width={50}
                      className="rounded-full"
                      alt="avatar"
                    />
                    <div>{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ul>
      </div>
    </ViewContainer>
  );
}
