import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");

        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: input }],
            }, {
                headers: {
                    Authorization: `Bearer YOUR_OPENAI_API_KEY`,
                    "Content-Type": "application/json",
                },
            });

            const botMessage = { sender: "bot", text: response.data.choices[0].message.content };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error("Error fetching response: ", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <Card className="p-4">
                <CardContent className="space-y-4 h-96 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded-md ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                            {msg.text}
                        </div>
                    ))}
                </CardContent>
            </Card>
            <div className="mt-4 flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
                <Button onClick={sendMessage}>Send</Button>
            </div>
        </div>
    );
};

export default Chatbot;
