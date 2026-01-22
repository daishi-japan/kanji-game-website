import { render, screen } from '@testing-library/react'
import { CompanionGuide } from '@/components/game/CompanionGuide'

describe('CompanionGuide', () => {
  it('デフォルトで表示される', () => {
    const { container } = render(<CompanionGuide />)
    expect(container.textContent).toContain('🦊')
  })

  it('カスタムキャラクターアイコンが表示される', () => {
    const { container } = render(<CompanionGuide characterIcon="🐶" />)
    expect(container.textContent).toContain('🐶')
  })

  it('state="loading" のときローディングアイコンが表示される', () => {
    const { container } = render(<CompanionGuide state="loading" />)
    const loader = container.querySelector('.animate-spin')
    expect(loader).toBeInTheDocument()
  })

  it('state="hover" かつ message があるとき吹き出しが表示される', () => {
    render(<CompanionGuide state="hover" message="こんにちは！" />)
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
  })

  it('state="idle" のとき吹き出しが表示されない', () => {
    render(<CompanionGuide state="idle" message="表示されない" />)
    expect(screen.queryByText('表示されない')).not.toBeInTheDocument()
  })

  it('position="bottom-left" で左下に配置される', () => {
    const { container } = render(<CompanionGuide position="bottom-left" />)
    const guide = container.querySelector('.bottom-4.left-4')
    expect(guide).toBeInTheDocument()
  })

  it('position="bottom-right" で右下に配置される', () => {
    const { container } = render(<CompanionGuide position="bottom-right" />)
    const guide = container.querySelector('.bottom-4.right-4')
    expect(guide).toBeInTheDocument()
  })

  it('position="top-left" で左上に配置される', () => {
    const { container } = render(<CompanionGuide position="top-left" />)
    const guide = container.querySelector('.top-4.left-4')
    expect(guide).toBeInTheDocument()
  })

  it('position="top-right" で右上に配置される', () => {
    const { container } = render(<CompanionGuide position="top-right" />)
    const guide = container.querySelector('.top-4.right-4')
    expect(guide).toBeInTheDocument()
  })
})
