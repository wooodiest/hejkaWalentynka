import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import emailjs from "@emailjs/browser";

import lunka from './assets/lunka.jpg';
import misiek from './assets/misiek.mp4';

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const NO_PHRASES = [
  "Nie",
  "Ejj",
  "EJJJJJ!!!!",
  "Ejjjj no co ty!!!!???",
  "SERIO????",
  "Nie rób tak Miśkowi :(((",
  "Bo będe smutny!!!",
  "Wrrrrrrrrr",
  "Naprawdę chcesz żebym był smutny??",
  "Mam nadziejkę że przypadkiem to klikasz",
  "Ranisz moje serduszko",
  "Nie bądź taka pls",
  "Nie kochasz mnie?? :(",
  "Zastanów się jeszcze raz",
  "To twoja ostateczna odpowiedź?",
  "No to jestem smutas",
  "Plsss?"
];

const HeartIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

function App() {
  const [noCount, setNoCount] = useState(0);
  const [hasSaidYes, setHasSaidYes] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { width, height } = useWindowSize();

  const yesScale = Math.min(1 + noCount * 0.25, 5); 
  const yesFontSizeRem = Math.min(1.25 + noCount * 0.18, 3.5); 
  const currentNoLabel = NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)];

  const sendEmail = async () => {
    try {
      setIsSending(true);
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          message: "OMGGGGG zgodziła się!!!!!!",
          noCount,
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("EmailJS error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    sendEmail();
    setHasSaidYes(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-50 flex items-center justify-center px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {!hasSaidYes ? (
          <motion.div
            key="question-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-lg w-full text-center flex flex-col items-center gap-8 relative z-10"
          >
            <motion.img
              src={lunka}
              alt="Lunka"
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="w-72 h-72 object-cover rounded-3xl shadow-2xl border-4 border-white ring-4 ring-pink-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 12 }}
            />

            <div className="space-y-3">
              <h1 className="font-fredoka text-3xl sm:text-4xl md:text-5xl text-rose-600 drop-shadow-sm px-2 leading-tight">
                Serdeczna hejka mam małe pytanko... Zostaniesz moją Walentynką?
              </h1>
              <p className="font-nunito text-rose-400 font-medium text-sm sm:text-lg">
                Mam nadziejkę że jest tylko jedna prawidłowa odpowiedź!!!
              </p>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full">
              <motion.button
                type="button"
                onClick={handleYesClick}
                className="relative z-50 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold shadow-[0_0_25px_rgba(236,72,153,0.5)] border-2 border-transparent hover:border-pink-200"
                animate={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ 
                  scale: yesScale * 1.05,
                  boxShadow: "0 0 40px rgba(236,72,153,0.7)"
                }}
                whileTap={{ scale: yesScale * 0.95 }}
                style={{
                  fontSize: `${yesFontSizeRem}rem`,
                  padding: `${yesFontSizeRem * 0.8}rem ${yesFontSizeRem * 1.5}rem`,
                  maxWidth: "100vw"
                }}
              >
                <span>TAK</span>
                <HeartIcon className="w-[1em] h-[1em] animate-pulse" />
              </motion.button>

              <motion.button
                type="button"
                onClick={handleNoClick}
                className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-rose-200 text-rose-500 font-bold px-6 py-3 shadow-sm hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-all focus:outline-none focus:ring-4 focus:ring-rose-100 text-base sm:text-lg min-w-[120px]"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentNoLabel}
              </motion.button>
            </div>

            {noCount > 0 && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-nunito text-sm sm:text-base font-semibold text-rose-400 mt-2 bg-white/50 px-4 py-1 rounded-full"
              >
                Przykro mi coraz bardziej!! (x{noCount}) 💔
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative max-w-xl w-full text-center flex flex-col items-center gap-6 py-8 z-20"
          >
            <div className="fixed inset-0 pointer-events-none">
              <Confetti
                width={width}
                height={height}
                numberOfPieces={500}
                recycle={false}
                gravity={0.15}
              />
            </div>

            <motion.div 
              className="relative"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            >
               <motion.video
                src={misiek}
                autoPlay
                loop
                muted
                playsInline
                className="w-72 h-auto object-contain rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.3)] border-4 border-white ring-4 ring-pink-300"
              />
              
            </motion.div>

            <div className="space-y-4 px-4 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl">
              <h2 className="font-fredoka text-4xl sm:text-5xl text-rose-600 tracking-wide">
                OMGGGGGG!!!!!
              </h2>
              <p className="font-nunito text-rose-600 text-base sm:text-xl font-medium leading-relaxed">
                Jestem bardzo szczęśliwy że zgodziłaś się!!! Ja Cię bardzo kocham!!!
                <br />
                Dziękuję serdecznie że jesteś moją Walentynką!!! To najlepszy dzień w moim życiu!!!
              </p>
              {isSending && (
                <div className="flex items-center justify-center gap-2 text-rose-400 text-sm font-semibold mt-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-ping" />
                  Powiadamianie Michasia że się zgodziłaś...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;