import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
}

const FAQ_DATABASE: Record<string, string> = {
  'check in': 'Check-in time is at 2:00 PM and check-out is at 11:00 AM.',
  'check out': 'Check-out is at 11:00 AM.',
  'price': 'Our rooms start at ₹2,500 per night. Please check the booking calendar for exact pricing on your dates.',
  'location': 'We are located at 123 Paradise Road, Goa, India.',
  'pool': 'Yes! We have a beautiful infinity pool open from 7 AM to 9 PM daily.',
  'food': 'We have an on-site multi-cuisine restaurant open for breakfast, lunch, and dinner.',
  'wifi': 'Yes, complimentary high-speed Wi-Fi is available in all rooms and common areas.',
  'pets': 'We love pets! However, currently, we only allow service animals on the property.',
  'book': 'You can easily book a room by clicking the "Book Now" button at the top of the website, or by contacting our front desk at +91 98765 43210.',
  'room': 'You can easily book a room by clicking the "Book Now" button at the top of the website, or by contacting our front desk at +91 98765 43210.',
  'hello': 'Hello there! I am the Green Coast Resort AI Concierge. How can I help you today?',
  'hi': 'Hi! How can I help you today with your booking or stay?',
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      type: 'bot', 
      text: 'Hello! I am your Resort Concierge. You can ask me about our location, prices, pool, food, wifi, pets, check in times, or how to book a room!' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg: Message = { id: Date.now().toString(), type: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // AI Logic (Simple rule-based)
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't understand that question yet. Please contact our front desk at +91 98765 43210 for more details!";
      
      const lowerInput = userText.toLowerCase();
      for (const [key, answer] of Object.entries(FAQ_DATABASE)) {
        if (lowerInput.includes(key)) {
          botResponse = answer;
          break;
        }
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-neutral-950 shadow-2xl hover:scale-110 hover:bg-green-400 transition-all cursor-pointer animate-bounce group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-[#030303]"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] max-h-[80vh] bg-neutral-950 border border-neutral-900 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-neutral-900 p-4 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                <Bot className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h3 className="font-serif text-white text-sm">Resort Concierge</h3>
                <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm font-sans ${
                    msg.type === 'user'
                      ? 'bg-neutral-800 text-white rounded-tr-none'
                      : 'bg-green-950/30 border border-green-900/50 text-neutral-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-green-950/30 border border-green-900/50 p-3 rounded-lg rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-neutral-900 border-t border-neutral-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-grow bg-neutral-950 border border-neutral-800 p-2.5 rounded-xs text-xs text-white outline-hidden focus:border-neutral-600"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-white text-black p-2.5 rounded-xs hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
