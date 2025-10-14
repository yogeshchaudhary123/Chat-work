'use client';
import { useState } from "react";
import api from '../../../api';
import RouteGuard from "@/app/components/RouteGuard";

type Message = {
 role: string; text: string
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await api.post(`/api/chat`, {
        message: input
      });
      const data = res.data;
      const botMessage = { role: "bot", text: data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [...prev, { role: "bot", text: "Error: failed to connect" }]);
    }
  };

  return (
    <RouteGuard>
      <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50">
        <h1 className="text-2xl font-bold text-black">Chat with AI</h1>

        <div className="w-full max-w-xl h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white shadow-inner">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-3 py-1 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-xl flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black shadow-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </RouteGuard>
  );
}
