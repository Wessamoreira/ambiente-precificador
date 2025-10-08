/// <reference types="react" />

declare module 'framer-motion' {
  import type * as React from 'react';
  
  export interface AnimationProps {
    initial?: boolean | Record<string, any>;
    animate?: Record<string, any>;
    exit?: Record<string, any>;
    transition?: Record<string, any>;
    whileHover?: Record<string, any>;
    whileTap?: Record<string, any>;
    whileFocus?: Record<string, any>;
    whileDrag?: Record<string, any>;
    whileInView?: Record<string, any>;
    variants?: Record<string, any>;
    layout?: boolean | 'position' | 'size';
    layoutId?: string;
    layoutDependency?: any;
    layoutScroll?: boolean;
    custom?: any;
    inherit?: boolean;
    drag?: boolean | 'x' | 'y';
    dragConstraints?: Record<string, any>;
    dragElastic?: number | boolean | Record<string, any>;
    dragMomentum?: boolean;
    dragTransition?: Record<string, any>;
    dragPropagation?: boolean;
    dragSnapToOrigin?: boolean;
    dragControls?: any;
    dragListener?: boolean;
    onDragStart?: (event: any, info: any) => void;
    onDragEnd?: (event: any, info: any) => void;
    onDrag?: (event: any, info: any) => void;
    onDirectionLock?: (axis: 'x' | 'y') => void;
    onAnimationStart?: (definition: any) => void;
    onAnimationComplete?: (definition: any) => void;
    onUpdate?: (latest: any) => void;
    onTap?: (event: any, info: any) => void;
    onTapStart?: (event: any, info: any) => void;
    onTapCancel?: (event: any, info: any) => void;
    onHoverStart?: (event: any, info: any) => void;
    onHoverEnd?: (event: any, info: any) => void;
    onPan?: (event: any, info: any) => void;
    onPanStart?: (event: any, info: any) => void;
    onPanEnd?: (event: any, info: any) => void;
    onViewportEnter?: (entry: any) => void;
    onViewportLeave?: (entry: any) => void;
    viewport?: Record<string, any>;
    style?: React.CSSProperties;
  }

  export interface HTMLMotionProps<T extends HTMLElement> 
    extends Omit<React.HTMLAttributes<T>, 'style' | 'onAnimationStart'>, 
            AnimationProps {
    style?: React.CSSProperties;
  }

  export interface MotionComponents {
    div: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
    span: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>;
    p: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
    h1: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
    h2: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
    h3: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
    h4: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
    h5: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
    h6: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
    button: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
    header: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
    main: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
    section: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
    article: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
    nav: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
    aside: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
    footer: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLElement> & React.RefAttributes<HTMLElement>>;
    a: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLAnchorElement> & React.RefAttributes<HTMLAnchorElement>>;
    ul: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLUListElement> & React.RefAttributes<HTMLUListElement>>;
    ol: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLOListElement> & React.RefAttributes<HTMLOListElement>>;
    li: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLLIElement> & React.RefAttributes<HTMLLIElement>>;
    tr: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLTableRowElement> & React.RefAttributes<HTMLTableRowElement>>;
    td: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>>;
    th: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>>;
    form: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLFormElement> & React.RefAttributes<HTMLFormElement>>;
    input: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>;
    textarea: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLTextAreaElement> & React.RefAttributes<HTMLTextAreaElement>>;
    img: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLImageElement> & React.RefAttributes<HTMLImageElement>>;
    [key: string]: any;
  }

  export const motion: MotionComponents;
  
  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    initial?: boolean;
    mode?: 'sync' | 'wait' | 'popLayout';
    onExitComplete?: () => void;
    custom?: any;
  }>;

  export interface PanInfo {
    point: { x: number; y: number };
    delta: { x: number; y: number };
    offset: { x: number; y: number };
    velocity: { x: number; y: number };
  }

  export interface DragHandlers {
    onDrag?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
    onDragStart?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
    onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  }

  export function useAnimation(): any;
  export function useMotionValue(initial: any): any;
  export function useTransform(value: any, input: any[], output: any[]): any;
  export function useSpring(value: any, config?: any): any;
  export function useScroll(config?: any): any;
  export function useVelocity(value: any): any;
  export function useAnimationFrame(callback: (time: number, delta: number) => void): void;
}
