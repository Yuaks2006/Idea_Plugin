import React, { useState } from 'react';
import ClayCard from './ClayCard';
import ClayButton from './ClayButton';
import { GuestMessage } from '../types';

interface GuestbookProps {
  messages: GuestMessage[];
  onAddMessage: (text: string, name: string) => void;
}

const Guestbook: React.FC<GuestbookProps> = ({ messages, onAddMessage }) => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && text.trim()) {
      onAddMessage(text, name);
      setName('');
      setText('');
    }
  };

  return (
    <div className="mt-12 w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-pink-400">甜蜜留言板</h2>
        <p className="text-gray-500">留下一些你想对我说的话吧！</p>
      </div>

      <ClayCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="你是"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-pink-300 outline-none clay-shadow-inset text-gray-700 placeholder-gray-400"
              maxLength={20}
            />
          </div>
          <div>
            <textarea
              placeholder="想和我说的话"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-pink-300 outline-none clay-shadow-inset text-gray-700 placeholder-gray-400 resize-none h-24"
              maxLength={100}
            />
          </div>
          <ClayButton type="submit" fullWidth>发送留言</ClayButton>
        </form>
      </ClayCard>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white rounded-2xl p-4 clay-shadow-md flex items-start gap-4 transform transition-hover hover:scale-[1.02] duration-300">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner"
              style={{ backgroundColor: msg.avatarColor }}
            >
              {msg.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-700">{msg.name}</h4>
                <span className="text-xs text-gray-400">{msg.date}</span>
              </div>
              <p className="text-gray-600 mt-1 leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guestbook;