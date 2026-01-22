'use client'

import { ButtonHTMLAttributes, forwardRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'adventure' | 'writing'
  state?: 'idle' | 'correct' | 'wrong'
  confetti?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  (
    {
      children,
      variant = 'primary',
      state = 'idle',
      confetti = false,
      size = 'md',
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const [showEffect, setShowEffect] = useState(false)

    // state が変わった時にエフェクトを表示
    useEffect(() => {
      if (state !== 'idle') {
        setShowEffect(true)
        const timer = setTimeout(() => {
          setShowEffect(false)
        }, 600)
        return () => clearTimeout(timer)
      }
    }, [state])

    // バリアントに応じた基本スタイル
    const baseStyles = 'rounded-full font-bold transition-all duration-200'

    const variantStyles = {
      primary: 'bg-primary text-white hover:opacity-90',
      secondary: 'bg-secondary text-white hover:opacity-90',
      adventure: 'bg-primary text-white hover:opacity-90',
      writing: 'bg-secondary text-white hover:opacity-90',
    }

    const sizeStyles = {
      sm: 'h-10 px-6 text-base',
      md: 'h-12 px-8 text-lg',
      lg: 'h-14 px-10 text-xl',
    }

    // state に応じたエフェクトスタイル
    const stateStyles =
      state === 'correct'
        ? 'bg-success ring-4 ring-success/50'
        : state === 'wrong'
          ? 'bg-accent ring-4 ring-accent/50'
          : ''

    // アニメーション variants
    const buttonVariants = {
      idle: { scale: 1 },
      tap: { scale: 0.95 },
      correct: {
        scale: [1, 1.1, 1],
        transition: { duration: 0.4 },
      },
      wrong: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 },
      },
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (confetti && state === 'idle') {
        // 紙吹雪エフェクトをトリガー（将来的に実装）
        console.log('🎉 Confetti effect triggered!')
      }
      onClick?.(e)
    }

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${stateStyles} ${className}`}
        onClick={handleClick}
        variants={buttonVariants}
        initial="idle"
        whileTap="tap"
        animate={showEffect ? state : 'idle'}
        disabled={props.disabled}
        type={props.type}
        name={props.name}
        value={props.value}
        form={props.form}
        autoFocus={props.autoFocus}
        aria-label={props['aria-label']}
        aria-disabled={props['aria-disabled']}
        tabIndex={props.tabIndex}
      >
        {children}
      </motion.button>
    )
  }
)

GameButton.displayName = 'GameButton'
