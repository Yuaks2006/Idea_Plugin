import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ThreeDCake from './components/ThreeDCake';
import ClayButton from './components/ClayButton';
import ClayCard from './components/ClayCard';
import Guestbook from './components/Guestbook';
import { ViewState, GuestMessage } from './types';
import { generateBlessing } from './services/geminiService';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('intro');
  const [blessing, setBlessing] = useState<string>('');
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<GuestMessage[]>([
    { id: '1', name: '小爱', text: '生日快乐！要一直甜下去哦！🎂', avatarColor: '#fca5a5', date: '刚刚' },
    { id: '2', name: '波波', text: '这个蛋糕设计太可爱了！🎉', avatarColor: '#99f6e4', date: '5分钟前' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCutCake = async () => {
    setViewState('cutting');
    
    // Simulate animation time then switch to result
    setTimeout(async () => {
      setViewState('result');
      setIsGenerating(true);
      const text = await generateBlessing();
      setBlessing(text);
      setIsGenerating(false);
    }, 1500);
  };

  const handleTakePhoto = async () => {
    if (polaroidRef.current && canvasRef) {
      // Create a temporary composite for the screenshot
      // Since canvas is webgl, we need to manually grab its data
      const canvasData = canvasRef.toDataURL("image/png");
      
      // We need to inject this image into the polaroid div for html2canvas to see it properly
      // We will assume the polaroid component has an img tag we can populate, or we update a state
      // Actually, easier way: The 3D canvas is visible. We can use html2canvas on the container wrapping both.
      
      try {
        const canvas = await html2canvas(polaroidRef.current, {
          backgroundColor: null,
          scale: 2, // Reting quality
          useCORS: true,
        });
        
        const link = document.createElement('a');
        link.download = '我的黏土蛋糕切片.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch (e) {
        console.error("Screenshot failed", e);
      }
    }
  };

  const addMessage = (text: string, name: string) => {
    const colors = ['#fca5a5', '#99f6e4', '#fde047', '#c4b5fd'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newMessage: GuestMessage = {
      id: Date.now().toString(),
      name,
      text,
      avatarColor: randomColor,
      date: '刚刚'
    };
    setMessages([newMessage, ...messages]);
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-pink-50 text-gray-700">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-pink-400 tracking-tight drop-shadow-sm mb-2">
          Cake Share
        </h1>
        <p className="text-lg text-gray-500 font-bold opacity-80">
          欢迎来分享鱼菌的电子生日蛋糕！
        </p>
      </header>

      {/* Main Stage */}
      <main className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* 3D Viewport & Controls */}
        <div className="relative w-full max-w-md aspect-square mb-8">
          
          {/* Background Decor for Softness */}
          <div className="absolute inset-0 bg-white rounded-full opacity-40 blur-3xl transform scale-110 -z-10"></div>
          
          {/* The Polaroid Container (Used for screenshot) */}
          <div ref={polaroidRef} className={`relative p-4 bg-white rounded-none shadow-xl transition-all duration-500 ${viewState === 'result' ? 'pb-16 rotate-1' : 'rounded-[40px] pb-4'}`}>
            <div className="bg-blue-50/50 rounded-3xl w-full h-[350px] md:h-[400px] overflow-hidden relative border-4 border-white/50">
               <ThreeDCake viewState={viewState} onCutComplete={() => {}} setCanvasRef={setCanvasRef} />
            </div>
            
            {/* Polaroid Text (Only visible in result) */}
            {viewState === 'result' && (
              <div className="mt-4 px-2 text-center">
                 <p className="font-handwriting text-gray-400 text-sm mb-1 uppercase tracking-widest">
                   这是专门分享给你的蛋糕
                 </p>
                 <div className="min-h-[60px] flex items-center justify-center">
                   {isGenerating ? (
                     <span className="text-pink-300 animate-pulse">正在烘焙快乐...</span>
                   ) : (
                     <p className="font-bold text-gray-600 text-lg leading-tight">
                       “{blessing}”
                     </p>
                   )}
                 </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-center z-10">
            {viewState === 'intro' && (
              <ClayButton onClick={handleCutCake} className="text-lg px-10">
                ✂️ 切蛋糕
              </ClayButton>
            )}
            
            {viewState === 'result' && (
              <div className="flex gap-4">
                <ClayButton onClick={() => setViewState('intro')} variant="secondary">
                  🔙 返回
                </ClayButton>
                <ClayButton onClick={handleTakePhoto} variant="primary">
                  📸 拍照
                </ClayButton>
              </div>
            )}
          </div>
        </div>

        {/* Guestbook Section */}
        <Guestbook messages={messages} onAddMessage={addMessage} />

      </main>

      {/* Floating Decor */}
      <div className="fixed top-20 left-10 w-16 h-16 bg-yellow-200 rounded-full blur-2xl opacity-50 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-24 h-24 bg-pink-200 rounded-full blur-3xl opacity-50 animate-bounce pointer-events-none" style={{ animationDuration: '3s' }}></div>
    </div>
  );
};

export default App;
