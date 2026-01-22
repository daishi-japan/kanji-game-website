import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GameButton } from '@/components/game/GameButton'

describe('GameButton', () => {
  it('デフォルトのボタンが表示される', () => {
    render(<GameButton>クリック</GameButton>)
    expect(screen.getByText('クリック')).toBeInTheDocument()
  })

  it('variant="adventure" のスタイルが適用される', () => {
    render(<GameButton variant="adventure">ぼうけん</GameButton>)
    const button = screen.getByText('ぼうけん')
    expect(button).toHaveClass('bg-primary')
  })

  it('variant="writing" のスタイルが適用される', () => {
    render(<GameButton variant="writing">かく</GameButton>)
    const button = screen.getByText('かく')
    expect(button).toHaveClass('bg-secondary')
  })

  it('size="lg" のスタイルが適用される', () => {
    render(<GameButton size="lg">おおきい</GameButton>)
    const button = screen.getByText('おおきい')
    expect(button).toHaveClass('h-14')
  })

  it('disabled 状態が正しく動作する', () => {
    render(<GameButton disabled>むこう</GameButton>)
    const button = screen.getByText('むこう')
    expect(button).toBeDisabled()
  })

  it('onClick イベントが発火する', () => {
    const handleClick = jest.fn()
    render(<GameButton onClick={handleClick}>クリック</GameButton>)

    const button = screen.getByText('クリック')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('state="correct" でスタイルが変わる', async () => {
    const { rerender } = render(<GameButton state="idle">ボタン</GameButton>)
    const button = screen.getByText('ボタン')

    rerender(<GameButton state="correct">ボタン</GameButton>)

    await waitFor(() => {
      expect(button).toHaveClass('bg-success')
    })
  })

  it('state="wrong" でスタイルが変わる', async () => {
    const { rerender } = render(<GameButton state="idle">ボタン</GameButton>)
    const button = screen.getByText('ボタン')

    rerender(<GameButton state="wrong">ボタン</GameButton>)

    await waitFor(() => {
      expect(button).toHaveClass('bg-accent')
    })
  })

  it('confetti プロパティで紙吹雪ログが出力される', () => {
    const consoleSpy = jest.spyOn(console, 'log')
    render(<GameButton confetti>おいわい</GameButton>)

    const button = screen.getByText('おいわい')
    fireEvent.click(button)

    expect(consoleSpy).toHaveBeenCalledWith('🎉 Confetti effect triggered!')
    consoleSpy.mockRestore()
  })
})
