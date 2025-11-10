import Btn from '@/app/d01/CtrBtn';
import OverlayBackdrop from '@/app/d01/Overlay';
import { AnimatePresence, motion } from 'motion/react';
import { Fragment, useState } from 'react';

interface CardProps {
  title: string;
  body: string;
  img?: string;
}

const Card = ({ title, body }: CardProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Fragment>
      <motion.div
        className="absolute h-80 w-72 rounded-lg bg-amber-300 overflow-hidden shadow-lg"
        whileHover={{
          y: -12,
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
      >
        <motion.img
          layoutId="love"
          src="./love.jpg"
          alt="Love"
          className="absolute inset-0 h-full w-full object-cover"
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
        <Btn
          size={14}
          type="maximize"
          className="text-white"
          ctrlBtn={() => setOpen(true)}
        />
        <motion.div 
          className="absolute bottom-4 z-10 w-full px-4 py-2 backdrop-blur-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-2xl text-balance text-white uppercase font-bold">
            {title}
          </h1>
        </motion.div>
      </motion.div>

      {/* render backdrop with visible shade and high z-index so it sits above images/modals */}
      {isOpen && (
        <OverlayBackdrop
          ctrFn={() => setOpen(false)}
          shadeOpacity={15}
          zIndex={20}
          className="backdrop-blur-xs"
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="relative z-30 h-[70vh] w-[72vw] bg-amber-400 rounded-xl overflow-hidden shadow-2xl"
            layoutId="love"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 35,
            }}
          >
            <img
              src="./love_alt.jpg"
              alt="Love"
              className="absolute h-full w-full object-cover"
            />
            <Btn
              size={14}
              type="X"
              className="text-white"
              ctrlBtn={() => setOpen(false)}
            />
            <motion.div 
              className="absolute bottom-0 z-40 block backdrop-blur-md w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <motion.h1 
                className="m-8 text-4xl text-white font-bold"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                {title}
              </motion.h1>
              <motion.p 
                className="m-8 mt-0 text-white text-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                {body}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default Card;
