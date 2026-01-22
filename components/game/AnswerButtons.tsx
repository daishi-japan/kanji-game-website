'use client'

import { GameButton } from './GameButton'

interface AnswerButtonsProps {
  choices: string[]
  onAnswer: (answer: string) => void
  disabled?: boolean
  correctAnswer?: string | null // 正解を表示する場合
}

export function AnswerButtons({
  choices,
  onAnswer,
  disabled = false,
  correctAnswer = null,
}: AnswerButtonsProps) {
  const getButtonState = (choice: string) => {
    if (!correctAnswer) return 'idle'
    if (choice === correctAnswer) return 'correct'
    return 'idle'
  }

  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-md">
      {choices.map((choice, index) => (
        <GameButton
          key={index}
          size="lg"
          variant="adventure"
          onClick={() => onAnswer(choice)}
          disabled={disabled}
          state={getButtonState(choice)}
        >
          {choice}
        </GameButton>
      ))}
    </div>
  )
}
