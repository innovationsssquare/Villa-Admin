"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  MessageSquare,
  Send,
  ClockIcon as UserClock,
} from "lucide-react";
import Image from "next/image";
import messages from "@/public/Asset/messages.png";
import accountpending from "@/public/Asset/accountpending.png";
import User from "@/public/Asset/User.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTickets } from "@/lib/Redux/Slices/ticketSlice";
import { Sendmessage } from "@/lib/API/Messages/Messages";

export default function MessagingInterface() {
  const { tickets, loading, error } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("User");

  useEffect(() => {
    dispatch(fetchAllTickets(activeTab));
  }, [dispatch, activeTab]);

  const contacts = tickets?.map((ticket) => ({
    id: ticket._id,
    name: ticket.TicketTitle || "Unknown",
    avatar: "/placeholder.svg",
    lastMessage:
      ticket.Message?.[ticket?.Message?.length - 1]?.msg || "No message yet",
    lastMessageTime: ticket.Message?.[ticket?.Message?.length - 1]?.date || "",
    email: "", // You can include this if available in your ticket model
    phone: "", // Same as above
    messages: ticket.Message.map((msg) => ({
      id: msg._id,
      content: msg.msg,
      sender: msg.user === "6800afc07f7c2467f521e9f5" ? "user" : "agent", // Replace accordingly
      timestamp: msg.date,
    })),
  }));

  useEffect(() => {
    if (contacts?.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    } 
  }, [contacts]);

  // const handleSendMessage = () => {
  //   if (!newMessage.trim()) return;

  //   const newMsg = {
  //     id: Date.now().toString(),
  //     content: newMessage,
  //     user: "6800afc07f7c2467f521e9f5",
  //     timestamp: new Date().toLocaleTimeString(),
  //   };

  //   setSelectedContact((prev) => ({
  //     ...prev,
  //     messages: [...prev.messages, newMsg],
  //   }));

  //   setNewMessage("");
  // };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      msg: newMessage,
      date: new Date().toLocaleDateString(),
      user: "6800afc07f7c2467f521e9f5", // Set the user ID accordingly
    };

    try {
      const response = await Sendmessage(selectedContact.id, {
        Message: messageData,
      });

      if (response?.success) {
        // If the API call is successful, update the selected contact with the new message
        setSelectedContact((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              content: newMessage,
              sender: "user",
              timestamp: new Date().toLocaleTimeString(),
            },
          ],
        }));

        setNewMessage(""); // Clear the input field after sending the message
      } else {
        // Handle API failure (you could show an error message to the user)
        console.error(
          "Failed to send message:",
          response?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  console.log(contacts);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedContact?.messages]);

  return (
    <ScrollArea className="p-4 w-full h-[calc(100vh-64px)] pb-14 bg-gray-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4 flex shadow-sm rounded-xl flex-row items-start bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
          <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-xl mr-4 border border-gray-200 dark:border-neutral-800">
            <Image
              src={messages}
              alt="message-icon"
              className="h-6 w-6 text-gray-700 dark:text-neutral-300"
            />
          </div>
          <div className="flex-grow">
            <p className="text-gray-600 dark:text-neutral-400 font-medium">Messages</p>
            <p className="text-xl font-bold text-[#FF6900]">7,782</p>
          </div>
          <Button variant="outline" className="ml-auto border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            This Week <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </Card>

        <Card className="p-4 flex shadow-sm rounded-xl flex-row items-start bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
          <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-xl mr-4 border border-gray-200 dark:border-neutral-800">
            <Image
              src={accountpending}
              alt="accountpending-icon"
              className="h-6 w-6 text-gray-700 dark:text-neutral-300"
            />
          </div>
          <div className="flex-grow">
            <p className="text-gray-600 dark:text-neutral-400 font-medium">Pending Response</p>
            <p className="text-xl font-bold text-[#FF6900]">555</p>
          </div>
          <Button variant="outline" className="ml-auto border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            This Week <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>

      {/* Messaging Interface */}
      <Card className="overflow-hidden shadow-sm rounded-xl mb-4 p-0 w-full bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        <div className="flex flex-col h-[560px]">
          {/* Messages Header */}
          <div className="flex justify-between items-center p-3 px-4 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Messages</h2>
            <Button variant="outline" className="border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              Today <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex h-full w-full">
            {/* Left Sidebar */}
            <div className="w-1/3 border-r border-gray-200 dark:border-neutral-800 flex flex-col h-full">
              {/* Tabs */}
              <Tabs defaultValue="User" className="w-full">
                <TabsList className="grid grid-cols-2 h-auto p-0 w-full bg-gray-50 dark:bg-neutral-900/60 border-b border-gray-200 dark:border-neutral-800">
                  <TabsTrigger
                    value="User"
                    onClick={() => setActiveTab("User")}
                    className={`rounded-none py-2.5 cursor-pointer font-medium ${
                      activeTab === "User"
                        ? "text-[#FF6900] border-b-2 border-[#FF6900] bg-white dark:bg-[#121215]"
                        : "text-gray-600 dark:text-neutral-400 bg-transparent"
                    }`}
                  >
                    Customers
                  </TabsTrigger>
                  <TabsTrigger
                    value="Vendor"
                    onClick={() => setActiveTab("Vendor")}
                    className={`rounded-none py-2.5 cursor-pointer font-medium ${
                      activeTab === "Vendor"
                        ? "text-[#FF6900] border-b-2 border-[#FF6900] bg-white dark:bg-[#121215]"
                        : "text-gray-600 dark:text-neutral-400 bg-transparent"
                    }`}
                  >
                    Sellers
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Contact List */}
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="loader2"></span>
                </div>
              ) : (
                <ScrollArea className="flex-grow overflow-y-auto pb-12">
                  {contacts.length > 0 ? (
                    contacts?.map((contact) => (
                      <div
                        key={contact?.id}
                        className={`flex items-center p-3 px-4 cursor-pointer transition-colors ${
                          selectedContact?.id === contact?.id
                            ? "bg-[#FF6900] text-white"
                            : "hover:bg-gray-100 dark:hover:bg-neutral-800/60 text-neutral-900 dark:text-neutral-100"
                        }`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden mr-3 shrink-0">
                          <span className="text-sm font-bold text-[#FF6900]">
                            {contact?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <h3 className="font-semibold text-sm truncate">{contact?.name}</h3>
                            <span className={`text-[10px] shrink-0 ml-1 ${
                              selectedContact?.id === contact?.id ? "text-white/80" : "text-gray-400 dark:text-neutral-500"
                            }`}>
                              {contact?.lastMessageTime}
                            </span>
                          </div>
                          <p
                            className={`text-xs truncate ${
                              selectedContact?.id === contact?.id
                                ? "text-white/80"
                                : "text-gray-500 dark:text-neutral-400"
                            }`}
                          >
                            {contact?.lastMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center mt-12 text-gray-500 dark:text-neutral-400 text-sm">
                      <span>No Messages</span>
                    </div>
                  )}
                </ScrollArea>
              )}
            </div>

            {/* Right Chat Area */}
            <div className="w-2/3 flex flex-col pb-12">
              {/* Chat Header */}
              <div className="p-3 px-4 border-b border-gray-200 dark:border-neutral-800 flex items-center">
                <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden mr-3 shrink-0">
                  <span className="text-sm font-bold text-[#FF6900]">
                    {selectedContact?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-neutral-100">{selectedContact?.name}</h3>
                  {selectedContact?.email && (
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      {selectedContact?.email}{" "}
                      {selectedContact?.phone && `| ${selectedContact?.phone}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea
                ref={scrollRef}
                className="flex-grow p-4 overflow-y-auto h-96"
              >
                {selectedContact?.messages?.map((message) => (
                  <div
                    key={message?.id}
                    className={`p-3 rounded-2xl max-w-[65%] my-1.5 shadow-sm text-sm ${
                      message?.sender === "user"
                        ? "bg-[#FF6900] text-white self-end ml-auto rounded-tr-none"
                        : "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 self-start rounded-tl-none border border-gray-200/50 dark:border-neutral-700/50"
                    }`}
                  >
                    <p className="leading-relaxed">{message?.content}</p>
                    <span className={`text-[10px] block mt-1 text-right ${
                      message?.sender === "user" ? "text-white/70" : "text-gray-400 dark:text-neutral-500"
                    }`}>
                      {message?.timestamp}
                    </span>
                  </div>
                ))}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-3 border-t border-gray-200 dark:border-neutral-800 flex items-center bg-white dark:bg-[#121215]">
                <Input
                  placeholder="Write message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  className="ml-2 bg-[#FF6900] hover:bg-[#E05D00] text-white shadow-sm shadow-[#FF6900]/25 transition-colors cursor-pointer"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ScrollArea>
  );
}
