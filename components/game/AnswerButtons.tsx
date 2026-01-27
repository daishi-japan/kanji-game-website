'use client'

interface AnswerButtonsProps {
  choices: string[]
  onAnswer: (answer: string, index: number) => void
  disabled?: boolean
  feedbackType?: 'correct' | 'wrong' | 'miss' | null
  selectedIndex?: number | null
}

export function AnswerButtons({
  choices,
  onAnswer,
  disabled = false,
  feedbackType,
  selectedIndex,
}: AnswerButtonsProps) {
  const getButtonStyle = (index: number) => {
    if (selectedIndex === index && feedbackType === 'correct') {
      return 'bg-green-200 border-green-500 text-green-900'
    } else if (selectedIndex === index && feedbackType === 'wrong') {
      return 'bg-red-200 border-red-500 text-red-900'
    }
    return 'bg-white border-orange-400 text-orange-900 hover:bg-orange-50'
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => !disabled && onAnswer(choice, index)}
          disabled={disabled}
          className={`py-4 px-6 rounded-3xl text-2xl font-black transition-all border-4 shadow-md active:scale-95 ${getButtonStyle(index)} ${
            disabled ? 'cursor-not-allowed opacity-70' : ''
          }`}
        >
          {choice}
        </button>
      ))}
    </div>
  )
}
