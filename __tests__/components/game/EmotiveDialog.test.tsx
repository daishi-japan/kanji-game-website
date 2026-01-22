import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EmotiveDialog } from '@/components/game/EmotiveDialog'

describe('EmotiveDialog', () => {
  it('open=false のときダイアログが非表示', () => {
    render(
      <EmotiveDialog open={false}>
        <p>テストメッセージ</p>
      </EmotiveDialog>
    )
    expect(screen.queryByText('テストメッセージ')).not.toBeInTheDocument()
  })

  it('open=true のときダイアログが表示される', () => {
    render(
      <EmotiveDialog open={true}>
        <p>テストメッセージ</p>
      </EmotiveDialog>
    )
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument()
  })

  it('タイトルが表示される', () => {
    render(
      <EmotiveDialog open={true} title="せいかい！">
        <p>よくできました</p>
      </EmotiveDialog>
    )
    expect(screen.getByText('せいかい！')).toBeInTheDocument()
  })

  it('キャラクターアイコンが表示される', () => {
    const { container } = render(
      <EmotiveDialog open={true} characterIcon="🎉">
        <p>テスト</p>
      </EmotiveDialog>
    )
    expect(container.textContent).toContain('🎉')
  })

  it('variant="joy" のスタイルが適用される', () => {
    const { container } = render(
      <EmotiveDialog open={true} variant="joy" title="おめでとう">
        <p>テスト</p>
      </EmotiveDialog>
    )
    const dialog = container.querySelector('.border-yellow-400')
    expect(dialog).toBeInTheDocument()
  })

  it('variant="encourage" のスタイルが適用される', () => {
    const { container } = render(
      <EmotiveDialog open={true} variant="encourage" title="がんばろう">
        <p>テスト</p>
      </EmotiveDialog>
    )
    const dialog = container.querySelector('.border-orange-400')
    expect(dialog).toBeInTheDocument()
  })

  it('variant="zen" のスタイルが適用される', () => {
    const { container } = render(
      <EmotiveDialog open={true} variant="zen" title="しゅうちゅう">
        <p>テスト</p>
      </EmotiveDialog>
    )
    const dialog = container.querySelector('.border-secondary')
    expect(dialog).toBeInTheDocument()
  })

  it('閉じるボタンをクリックすると onClose が呼ばれる', () => {
    const handleClose = jest.fn()
    render(
      <EmotiveDialog open={true} onClose={handleClose} title="テスト">
        <p>内容</p>
      </EmotiveDialog>
    )

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('オーバーレイをクリックすると onClose が呼ばれる', () => {
    const handleClose = jest.fn()
    const { container } = render(
      <EmotiveDialog open={true} onClose={handleClose}>
        <p>内容</p>
      </EmotiveDialog>
    )

    const overlay = container.querySelector('.bg-black\\/50')
    if (overlay) {
      fireEvent.click(overlay)
      expect(handleClose).toHaveBeenCalledTimes(1)
    }
  })

  it('showCloseButton=false のとき閉じるボタンが非表示', () => {
    render(
      <EmotiveDialog open={true} showCloseButton={false} title="テスト">
        <p>内容</p>
      </EmotiveDialog>
    )

    const closeButton = screen.queryByRole('button')
    expect(closeButton).not.toBeInTheDocument()
  })

  it('autoClose で自動的に閉じる', async () => {
    jest.useFakeTimers()
    const handleClose = jest.fn()

    render(
      <EmotiveDialog open={true} onClose={handleClose} autoClose={1000}>
        <p>自動で閉じる</p>
      </EmotiveDialog>
    )

    expect(handleClose).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    jest.useRealTimers()
  })
})
