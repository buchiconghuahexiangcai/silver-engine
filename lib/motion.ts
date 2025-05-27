"use client";

import React from 'react';

interface MotionProps {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function motion(Component: any) {
  return function Motion({ 
    initial, 
    animate, 
    exit, 
    transition,
    children,
    ...props 
  }: MotionProps) {
    // This is a simplified implementation that applies CSS transitions
    // In a real app, you'd use a proper animation library
    
    const transitionStyle = transition ? {
      transitionProperty: 'all',
      transitionDuration: `${transition.duration || 0.3}s`,
      transitionDelay: transition.delay ? `${transition.delay}s` : '0s',
      transitionTimingFunction: transition.ease ? 'ease' : 'ease-in-out',
    } : {};
    
    const style = {
      ...props.style,
      ...transitionStyle,
      ...animate,
    };

    return React.createElement(Component, {
      ...props,
      style,
      children
    });
  };
}

motion.div = motion('div');