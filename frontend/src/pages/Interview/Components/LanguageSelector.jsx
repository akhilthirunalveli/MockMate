import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeIcon, ArrowDown01Icon } from 'hugeicons-react';

const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'en-AU', label: 'English (AU)' },
    { value: 'en-IN', label: 'English (India)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese' },
];

const LanguageSelector = ({ value, onChange, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedLanguage = languages.find(lang => lang.value === value) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex items-center gap-1 px-1.5 py-1.5 rounded-md border transition-all duration-200 text-xs font-medium
          ${disabled
                        ? 'bg-gray-900/50 border-white/10 text-gray-500 cursor-not-allowed'
                        : 'bg-black border-white/20 text-white hover:border-white/40 hover:bg-white/5 cursor-pointer shadow-lg shadow-black/20'}
        `}
            >
                <GlobeIcon size={14} className={disabled ? 'text-gray-600' : 'text-white'} />
                <span>{selectedLanguage.label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ArrowDown01Icon size={14} className="text-gray-400" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full z-50 w-29 py-1.5 bg-black border border-white/10 rounded-lg cursor-pointer backdrop-blur-xl overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {languages.map((lang) => (
                                <button
                                    key={lang.value}
                                    onClick={() => {
                                        onChange(lang.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center cursor-pointer justify-between px-4 py-2 text-left text-xs transition-colors
                    ${value === lang.value
                                            ? 'bg-white/10 text-white font-medium'
                                            : 'text-white/50 hover:bg-white/5 hover:text-white'}
                  `}
                                >
                                    {lang.label}
                                    {value === lang.value && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="w-1.5 h-1.5 rounded-full bg-white"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;
