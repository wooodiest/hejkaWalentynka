import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import emailjs from "@emailjs/browser";

// Placeholder EmailJS config – replace with your real values
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

// Phrases for the "No" button
const NO_PHRASES = [
  "Nie",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely certain?",
  "This could be a mistake!",
  "Have a heart!",
  "Don't be so cold!",
  "Change of heart?",
  "Wouldn't you reconsider?",
  "Is that your final answer?",
  "You're breaking my heart ;(",
  "Plsss?"
];

// Simple hook to keep track of window size for Confetti
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

  // Compute how big the "Yes" button should be based on noCount
  // Clamped so it doesn't completely break layout, but can get very large
  const yesScale = Math.min(1 + noCount * 0.25, 5); // up to 5x size
  const yesFontSizeRem = Math.min(1.25 + noCount * 0.18, 3.5); // font size grows too

  const currentNoLabel =
    NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)];

  // Sends an email via EmailJS when she says yes
  const sendEmail = async () => {
    try {
      setIsSending(true);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          message: "She said YES!",
          noCount,
          // You can add more template params here if needed (e.g. name, timestamp)
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      // In a real app you might show a toast; for now we just log
      console.error("EmailJS error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    // Trigger email in the background and immediately show the success screen
    sendEmail();
    setHasSaidYes(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-50 flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {!hasSaidYes ? (
          // Main question view
          <motion.div
            key="question-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-lg w-full text-center flex flex-col items-center gap-6"
          >
            {/* Cute asking GIF */}
            <motion.img
              src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"
              alt="Cute bear asking"
              className="w-52 h-52 object-cover rounded-3xl shadow-xl border-4 border-pink-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 12 }}
            />

            {/* Question text */}
            <div className="space-y-2">
              <h1 className="font-fredoka text-3xl sm:text-4xl md:text-5xl text-rose-600 drop-shadow-sm">
                Serdeczna hejka mam małe pytanko... Zostaniesz moją Walentynką?
              </h1>
              <p className="font-nunito text-rose-500 text-sm sm:text-base">
                Mam nadziejkę że jest tylko jedna prawidłowa odpowiedź!!!
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* YES Button - grows as "No" is clicked */}
              <motion.button
                type="button"
                onClick={handleYesClick}
                className="relative z-10 rounded-full bg-pink-500 text-white font-semibold shadow-lg px-6 py-3 sm:px-8 sm:py-4 focus:outline-none focus:ring-4 focus:ring-pink-300 overflow-hidden"
                animate={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                whileHover={{ scale: yesScale * 1.05 }}
                whileTap={{ scale: yesScale * 0.95 }}
                style={{
                  fontSize: `${yesFontSizeRem}rem`,
                  maxWidth: "100vw"
                }}
              >
                TAK
              </motion.button>

              {/* NO Button - changes text each time */}
              <motion.button
                type="button"
                onClick={handleNoClick}
                className="rounded-full bg-rose-200 text-rose-700 font-medium px-5 py-2 sm:px-6 sm:py-3 shadow-md hover:bg-rose-300 hover:text-rose-800 transition-colors focus:outline-none focus:ring-4 focus:ring-rose-200 text-sm sm:text-base"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.92 }}
              >
                {currentNoLabel}
              </motion.button>
            </div>

            {/* Subtle hint under buttons */}
            {noCount > 0 && (
              <p className="font-nunito text-xs sm:text-sm text-rose-400 mt-1">
                The more you say no, the bigger the yes gets.
              </p>
            )}
          </motion.div>
        ) : (
          // Success view (she said Yes)
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative max-w-xl w-full text-center flex flex-col items-center gap-6 py-8"
          >
            {/* Confetti overlay */}
            <div className="fixed inset-0 pointer-events-none">
              <Confetti
                width={width}
                height={height}
                numberOfPieces={500}
                recycle={false}
              />
            </div>

            {/* Happy GIF */}
            <motion.img
              src="https://media.giphy.com/media/3oriO0MfzG1P3cKYko/giphy.gif"
              alt="Happy bear couple"
              className="w-64 h-64 object-cover rounded-3xl shadow-2xl border-4 border-pink-200"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            />

            {/* Sweet message */}
            <div className="space-y-2 px-4">
              <h2 className="font-fredoka text-3xl sm:text-4xl text-rose-600">
                Okay, yay!
              </h2>
              <p className="font-nunito text-rose-500 text-sm sm:text-base">
                You just made my day. I promise to make this Valentine&apos;s
                Day (and every day after) extra special.
              </p>
              {isSending && (
                <p className="font-nunito text-xs text-rose-400 mt-1">
                  Sending a little notification to me right now…
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;