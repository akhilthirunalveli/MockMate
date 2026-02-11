import React from "react";
import { motion } from "framer-motion";

const VoiceWaveform = ({ isSpeaking, isListening }) => {
    // Generate an array for the bars
    const bars = Array.from({ length: 8 });

    return (
        <div className="flex items-center justify-center gap-[3px] h-8 px-2">
            {bars.map((_, i) => (
                <motion.div
                    key={i}
                    className={`w-[3px] rounded-full ${isSpeaking ? "bg-indigo-400" : isListening ? "bg-amber-400" : "bg-white/20"
                        }`}
                    animate={
                        isSpeaking || isListening
                            ? {
                                height: [
                                    "10%",
                                    `${20 + Math.random() * 80}%`,
                                    `${10 + Math.random() * 20}%`,
                                    `${40 + Math.random() * 50}%`,
                                    "10%",
                                ],
                            }
                            : { height: "10%" }
                    }
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.05,
                    }}
                />
            ))}
        </div>
    );
};

export default VoiceWaveform;
