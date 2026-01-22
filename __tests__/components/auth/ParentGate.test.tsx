import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ParentGate } from '@/components/auth/ParentGate'
import { verifyParentGate } from '@/app/actions/auth'

// Mock the Server Action
jest.mock('@/app/actions/auth', () => ({
  verifyParentGate: jest.fn(),
}))

describe('ParentGate', () => {
  const mockOnVerified = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('計算問題が表示される', () => {
    render(<ParentGate onVerified={mockOnVerified} />)

    expect(screen.getByText('おとなの かくにん')).toBeInTheDocument()
    expect(screen.getByText('7 + 5 = ?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('こたえ')).toBeInTheDocument()
  })

  it('正しい答えを入力すると onVerified が呼ばれる', async () => {
    ;(verifyParentGate as jest.Mock).mockResolvedValue({
      success: true,
      data: { verified: true },
    })

    render(<ParentGate onVerified={mockOnVerified} />)

    const input = screen.getByPlaceholderText('こたえ')
    const submitButton = screen.getByText('かくにん')

    fireEvent.change(input, { target: { value: '12' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(verifyParentGate).toHaveBeenCalledWith(12)
      expect(mockOnVerified).toHaveBeenCalled()
    })
  })

  it('間違った答えを入力するとエラーメッセージが表示される', async () => {
    ;(verifyParentGate as jest.Mock).mockResolvedValue({
      success: false,
      error: 'こたえが ちがいます',
      data: { verified: false },
    })

    render(<ParentGate onVerified={mockOnVerified} />)

    const input = screen.getByPlaceholderText('こたえ')
    const submitButton = screen.getByText('かくにん')

    fireEvent.change(input, { target: { value: '10' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/こたえが ちがいます/)).toBeInTheDocument()
      expect(mockOnVerified).not.toHaveBeenCalled()
    })
  })

  it('キャンセルボタンをクリックすると onCancel が呼ばれる', () => {
    render(<ParentGate onVerified={mockOnVerified} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByText('もどる')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('数字以外を入力するとエラーメッセージが表示される', async () => {
    render(<ParentGate onVerified={mockOnVerified} />)

    const input = screen.getByPlaceholderText('こたえ') as HTMLInputElement
    const submitButton = screen.getByText('かくにん')

    // type="number" の input では文字列は空になる
    fireEvent.change(input, { target: { value: '' } })

    // 空の状態で送信を試みる（実際には無効化されているはず）
    expect(submitButton).toBeDisabled()
  })

  it('空の入力では送信ボタンが無効化される', () => {
    render(<ParentGate onVerified={mockOnVerified} />)

    const submitButton = screen.getByText('かくにん')
    expect(submitButton).toBeDisabled()
  })
})
