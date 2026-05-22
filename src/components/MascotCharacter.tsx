/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface MascotCharacterProps {
  pose?: 'sticker' | 'expert' | 'exercise';
  speechBubble?: string;
  className?: string;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  pose = 'sticker',
  speechBubble,
  className = '',
}) => {
  // Cartoon Image URLs from the brand direction mockup
  const imageUrls = {
    sticker:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a',
    expert:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiIsqdrGNKKpNrIzNOxfKzns3c00K2nKoFk0ZHQEmUC_tyn1RWXoIhg6aaHRLgaxkYJkM4py2MosnhTTe4I__1u3UKq5WUrz2LGxyZ7rKMDnCBJAFTuzWEn1ezK8hDKPBt1z8-Tcct8qZD7DrdyDOWrFPpb84yIS_yaipjpOMz546MfTcMKCL1At_iGiG7fkAPssIm_q_fgnjledUdnICcoo-x1gI7Ypib06y3i1F1bWEAilH7LP3o7GQgi8688QxizcX35e848Nht',
    exercise:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative max-w-xs md:max-w-md bg-[#FFFBF2] text-[#2D3436] p-4 rounded-2xl shadow-md border-2 border-[#ffcba4] mb-4 text-sm"
        >
          {/* Talk bubble spike */}
          <div className="absolute w-4 h-4 bg-[#FFFBF2] border-r-2 border-b-2 border-[#ffcba4] rotate-45 bottom-[-10px] left-1/2 -translate-x-1/2"></div>
          <p className="font-sans leading-relaxed text-center font-medium italic">
            "{speechBubble}"
          </p>
        </motion.div>
      )}

      <motion.div
        whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-[#ffcba4] p-1 shadow-lg overflow-hidden border-2 border-[#7c5637]">
          <img
            src={imageUrls[pose]}
            alt="Cô Em Công Sở Cartoon Mascot"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Playful mini badge sticker */}
        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-[#7c5637] text-xs font-bold text-[#7c5637] px-3 py-1 rounded-full shadow-md rotate-[6deg]">
          Cô Em ⭐
        </div>
      </motion.div>
    </div>
  );
};
