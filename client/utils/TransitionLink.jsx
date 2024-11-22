'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa'; // Importing cart icon

const TransitionLink = ({ children, href }) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTransition = e => {
    e.preventDefault();
    setIsAnimating(true);

    setTimeout(() => {
      router.push(href);
      setIsAnimating(false);
    }, 1500); // Match animation duration
  };

  return (
    <>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="cart"
            initial={{
              opacity: 0,
              transform: 'scale(0.5) translate(-50%, -50%)'
            }}
            animate={{
              opacity: 1,
              transform: 'scale(1) translate(-50%, -50%)'
            }}
            exit={{ opacity: 0, transform: 'scale(0.5) translate(-50%, -50%)' }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '100px',
              height: '100px',
              transform: 'scale(0.5)',
              backgroundColor: '#fff',
              borderRadius: '50%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <FaShoppingCart size={50} color="#007bff" />
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href={href}
        onClick={handleTransition}
        style={{ textDecoration: 'none' }}
      >
        {children}
      </Link>
    </>
  );
};

export default TransitionLink;
