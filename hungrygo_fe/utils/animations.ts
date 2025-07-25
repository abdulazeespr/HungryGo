import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
export const registerGSAPPlugins = () => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
};

// Fade in animation
export const fadeIn = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      delay, 
      duration,
      ease: 'power2.out'
    }
  );
};

// Fade in from left animation
export const fadeInLeft = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: -50 },
    { 
      opacity: 1, 
      x: 0, 
      delay, 
      duration,
      ease: 'power2.out'
    }
  );
};

// Fade in from right animation
export const fadeInRight = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: 50 },
    { 
      opacity: 1, 
      x: 0, 
      delay, 
      duration,
      ease: 'power2.out'
    }
  );
};

// Scale in animation
export const scaleIn = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    { 
      opacity: 1, 
      scale: 1, 
      delay, 
      duration,
      ease: 'back.out(1.7)'
    }
  );
};

// Stagger animation for multiple elements
export const staggerElements = (
  elements: NodeListOf<Element> | Element[], 
  fromVars: gsap.TweenVars, 
  toVars: gsap.TweenVars, 
  staggerTime: number = 0.1
) => {
  return gsap.fromTo(
    elements,
    fromVars,
    { ...toVars, stagger: staggerTime, ease: 'power2.out' }
  );
};

// Create scroll trigger animation
export const createScrollTrigger = (
  trigger: Element, 
  animation: gsap.core.Tween, 
  start: string = 'top 80%'
) => {
  return ScrollTrigger.create({
    trigger,
    start,
    animation,
  });
};

// Page transition animation
export const pageTransition = (element: Element, direction: 'in' | 'out') => {
  if (direction === 'in') {
    return gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
    );
  } else {
    return gsap.fromTo(
      element,
      { opacity: 1 },
      { opacity: 0, duration: 0.5, ease: 'power2.inOut' }
    );
  }
};

// Parallax effect
export const createParallax = (element: Element, speed: number = 0.5) => {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.to(element, {
        y: self.progress * 100 * speed,
        ease: 'none',
        overwrite: 'auto',
      });
    },
  });
};