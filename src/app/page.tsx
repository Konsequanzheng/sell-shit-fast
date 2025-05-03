"use client";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon } from "@radix-ui/react-icons";
import { KeyboardEvent, useRef, useState, useEffect } from "react";
import Link from "next/link";
import React from "react";

interface Message {
  message: string;
  type: "bot" | "user";
  images?: string[];
  isThinking?: boolean;
}

export default function Chat() {
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setConversation([
      {
        message: "What can I sell fast for you?",
        type: "bot",
      },
    ]);
  }, []);

  const addMessage = (message: Message) => {
    setConversation((oldArray: Message[]) => [...oldArray, message]);
    if (message.type === "user") {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const messageEndPosition =
        messagesEndRef.current?.getBoundingClientRect()?.top || 0;
      const scrollAreaPosition =
        scrollRef.current?.getBoundingClientRect()?.top || 0;
      const scrollAreaHeight = scrollRef.current?.clientHeight || 0;
      const scrollPosition = messageEndPosition - scrollAreaPosition;
      if (scrollAreaHeight - scrollPosition >= -200) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  const sendImages = () => {
    if (uploadedImages.length > 0) {
      const imageUrls = uploadedImages.map((file) => URL.createObjectURL(file));
      addMessage({ message: "", type: "user", images: imageUrls });
      setUploadedImages([]);
      setIsThinking(true);
      addMessage({ message: "...", type: "bot", isThinking: true });
      setTimeout(() => {
        setIsThinking(false);
        setConversation((old) => [
          ...old.slice(0, -1),
          {
            message: "Great! What's the frame height and condition of the bike?",
            type: "bot",
          },
        ]);
      }, 1500);
    }
  };

  const sendMessage = () => {
    if (userInput || uploadedImages.length > 0) {
      let imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        imageUrls = uploadedImages.map((file) => URL.createObjectURL(file));
      }
      addMessage({ message: userInput, type: "user", images: imageUrls });
      setUserInput("");
      setUploadedImages([]);
      setIsThinking(true);
      addMessage({ message: "...", type: "bot", isThinking: true });
      setTimeout(() => {
        setIsThinking(false);
        setConversation((old) => [
          ...old.slice(0, -1),
          userInput && imageUrls.length > 0
            ? {
                message: "Thanks! I have all the info I need to create your listing.",
                type: "bot",
              }
            : imageUrls.length > 0
            ? {
                message: "Great! What's the frame height and condition of the bike?",
                type: "bot",
              }
            : {
                message: "Thanks! I have all the info I need to create your listing.",
                type: "bot",
              },
        ]);
      }, 1500);
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedImages(Array.from(e.target.files));
    }
  };

  return (
    <main className="h-screen flex flex-col" style={{ background: '#181614' }}>
      <ScrollArea ref={scrollRef} className="flex-1 overflow-x-hidden">
        <div className="flex flex-col gap-1 p-2 max-w-3xl mx-auto">
          {conversation.map((msg, i) => {
            return (
              <div key={i} className="flex gap-2 first:mt-2">
                {msg.type === "bot" ? (
                  <div
                    className="w-full overflow-hidden p-4 rounded-[20px] text-white relative font-medium max-w-[60%] mr-auto"
                    style={{
                      border: "3px solid transparent",
                      borderRadius: "20px",
                      background:
                        "linear-gradient(#2C2C2E, #2C2C2E) padding-box, linear-gradient(to right, #4fc3f7, #81c784, #ffeb3b, #ff9800, #f06292) border-box",
                      backgroundClip: "padding-box, border-box",
                    }}
                  >
                    {msg.isThinking ? (
                      <span className="inline-block animate-pulse text-2xl">...</span>
                    ) : (
                      msg.message
                    )}
                  </div>
                ) : msg.images && msg.images.length > 0 ? (
                  <div className="flex flex-wrap gap-2 ml-auto max-w-[60%]">
                    {msg.images.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`user-upload-${idx}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="max-w-[60%] flex flex-col text-white bg-[#2196f3] ml-auto items-start gap-2 rounded-[20px] p-4 text-left text-base font-medium transition-all whitespace-pre-wrap"
                  >
                    {msg.message}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} className="mb-2"></div>
      </ScrollArea>
      <div className="w-full sm:max-w-3xl mx-auto">
        {uploadedImages.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {uploadedImages.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`upload-preview-${idx}`}
                className="w-20 h-20 object-cover rounded-lg border border-gray-700"
              />
            ))}
          </div>
        )}
        <div className="p-8">
          <div
            className="flex flex-row items-center gap-4 border-none px-4 py-3"
            style={{
              border: "3px solid transparent",
              borderRadius: "40px",
              background:
                "linear-gradient(#262628, #262628) padding-box, linear-gradient(to right, #4fc3f7, #81c784, #ffeb3b, #ff9800, #f06292) border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <button
              type="button"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none"
              style={{ color: '#2196f3', fontSize: 32 }}
              tabIndex={0}
              aria-label="Upload images"
            >
              <PlusIcon className="h-8 w-8" />
            </button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <AutosizeTextarea
              className="flex-1 outline-none border-0 bg-transparent text-white placeholder-gray-400 text-2xl px-0"
              placeholder="What can Finn sell for you?"
              minHeight={25}
              maxHeight={55}
              rows={1}
              onKeyDown={(e) => handleEnter(e)}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button
              onClick={sendMessage}
              className="h-12 w-12 p-0 bg-[#2196f3] hover:bg-blue-600 rounded-full flex items-center justify-center"
              style={{ minWidth: 48, minHeight: 48 }}
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
