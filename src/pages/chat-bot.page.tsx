import { JSX, useEffect, useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import Fuse from "fuse.js";
import { supabase } from "@/utils/supabase/supabase.config";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { IProfile } from "@/api/types";
import knowledgeBase from "@/constants/knowledgeBase.json";
import React from "react";
import "@/chat-bot.css";

type KnowledgeBaseEntry = {
    id: string;
    keywords: string[];
    question: string;
    answer: string;
};

type Message = {
    id: number;
    message: string;
    type: "user" | "bot";
    withProps?: { component: () => JSX.Element };
};

// Initialize Fuse.js
const fuse = new Fuse(knowledgeBase as KnowledgeBaseEntry[], {
    keys: ["keywords", "question"],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true,
});




const QuickReplies = () => {
    const handleQuickReply = (question: string) => {
        const messageInput = document.querySelector(".react-chatbot-kit-chat-input") as HTMLInputElement;
        if (messageInput) {
            messageInput.value = question;
            const form = messageInput.closest("form");
            if (form) {
                form.dispatchEvent(new Event("submit", { bubbles: true }));
            }
        }
    };

    return (
        <div className="flex flex-wrap gap-2 p-2">
            <button
                className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-500"
                onClick={() => handleQuickReply("How do I post a donation?")}
            >
                Post a Donation
            </button>
            <button
                className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-500"
                onClick={() => handleQuickReply("How do I claim a donation?")}
            >
                Claim a Donation
            </button>
        </div>
    );
};

const ChatbotComponent = () => {
    const currentUser = useSelector(selectCurrentUser);
    const [initialMessages, setInitialMessages] = useState<Message[]>([
        {
            id: 1,
            message: "Hi! I’m here to help with your food sharing questions. What’s on your mind?",
            type: "bot",
            withProps: { component: QuickReplies },
        },
    ]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (!initialMessages.length) {
            setInitialMessages(prev => [...prev, {
                id: 1,
                message: "Hi! I’m here to help with your food sharing questions. What’s on your mind?",
                type: "bot",
                withProps: { component: QuickReplies },
            },])
        }
    }, [initialMessages])

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!currentUser?.user?.id || !currentUser?.profile?.id) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from("chat_logs")
                    .select("*")
                    .eq("user_id", currentUser.profile.id)
                    .order("created_at", { ascending: true })
                    .limit(50); // Limit to prevent excessive data

                if (error) {
                    console.error("Error fetching chat history:", error);
                    return;
                }

                if (data && data.length > 0) {
                    const historyMessages: Message[] = data.map((log, index) => ({
                        id: index + 2, // Start IDs after initial message
                        message: log.message,
                        type: log.is_bot ? "bot" : "user",
                    }));

                    setInitialMessages([
                        ...historyMessages,
                    ]);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatHistory();
    }, [currentUser?.user?.id]);

    const ChatbotConfig = {
        initialMessages,
        botName: "Food Sharing Assistant",
        customStyles: {
            botMessageBox: {
                backgroundColor: "#4f46e5", // Indigo-600
                borderRadius: "0.5rem",
            },
            userMessageBox: {
                backgroundColor: "#4f46e5", // Indigo-600
                color: "white",
                borderRadius: "0.5rem",
            },
            chatButton: {
                backgroundColor: "#4f46e5", // Indigo-600
            },
        },
    };

    const MessageParser = ({ children, actions }: any) => {
        const currentUser = useSelector(selectCurrentUser);

        const logMessage = async (message: string, isBot: boolean) => {
            const userId = (currentUser?.profile as IProfile)?.id || null;
            const { error } = await supabase.from("chat_logs").insert([
                { user_id: userId, message, is_bot: isBot },
            ]);
            if (error) {
                console.error("Error logging message:", error);
            }
        };

        const parse = async (message: string) => {
            if (!message.trim()) {
                actions.handleResponse("Please enter a valid question.");
                return;
            }

            await logMessage(message, false);

            const results = fuse.search(message);
            if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.5) {
                actions.handleResponse(results[0].item.answer);
                return;
            }

            actions.handleResponse(
                "I’m not sure how to help with that. Try asking about donations or contact support@yourplatform.com."
            );
        };

        return (
            <div>
                {React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                        parse,
                        actions,
                    });
                })}
            </div>
        );
    };

    const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
        const currentUser = useSelector(selectCurrentUser);

        const logMessage = async (message: string, isBot: boolean) => {
            const userId = (currentUser?.profile as IProfile)?.id || null;
            const { error } = await supabase.from("chat_logs").insert([
                { user_id: userId, message, is_bot: isBot },
            ]);
            if (error) {
                console.error("Error logging message:", error);
            }
        };

        const handleResponse = (response: string) => {
            const botMessage = createChatBotMessage(response, {
                withProps: { component: QuickReplies },
            });
            logMessage(response, true);
            setState((prev: any) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
            }));
        };

        return (
            <div>
                {React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                        actions: { handleResponse },
                    });
                })}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="fixed bottom-16 right-4 z-50 shadow-lg rounded-lg max-w-sm w-full bg-white border border-gray-200 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-16 right-4 z-[150] shadow-lg rounded-lg max-w-sm w-full bg-white border border-gray-200">
            <Chatbot
                config={ChatbotConfig}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
            />
        </div>
    );
};

export default ChatbotComponent;