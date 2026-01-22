import { render, screen } from '@testing-library/react'
import { NarrativeProgress } from '@/components/game/NarrativeProgress'

describe('NarrativeProgress', () => {
  it('進捗バーが表示される', () => {
    render(<NarrativeProgress current={5} total={10} />)
    expect(screen.getByText('5 / 10')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('0% の進捗が正しく表示される', () => {
    render(<NarrativeProgress current={0} total={10} />)
    expect(screen.getByText('0 / 10')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('100% の進捗が正しく表示される', () => {
    render(<NarrativeProgress current={10} total={10} />)
    expect(screen.getByText('10 / 10')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('100% を超える値を渡しても 100% として扱われる', () => {
    render(<NarrativeProgress current={15} total={10} />)
    expect(screen.getByText('15 / 10')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('負の値を渡しても 0% として扱われる', () => {
    render(<NarrativeProgress current={-5} total={10} />)
    expect(screen.getByText('-5 / 10')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('showLabel=false でラベルが非表示になる', () => {
    render(<NarrativeProgress current={5} total={10} showLabel={false} />)
    expect(screen.queryByText('5 / 10')).not.toBeInTheDocument()
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })

  it('カスタムキャラクターアイコンが表示される', () => {
    const { container } = render(
      <NarrativeProgress current={5} total={10} characterIcon="🐶" />
    )
    expect(container.textContent).toContain('🐶')
  })

  it('goalIcon="treasure" で宝箱アイコンが表示される', () => {
    const { container } = render(
      <NarrativeProgress current={5} total={10} goalIcon="treasure" />
    )
    // Lucide の Gift アイコンの存在確認
    const giftIcon = container.querySelector('svg')
    expect(giftIcon).toBeInTheDocument()
  })

  it('goalIcon="flag" で旗アイコンが表示される', () => {
    const { container } = render(
      <NarrativeProgress current={5} total={10} goalIcon="flag" />
    )
    // Lucide の Flag アイコンの存在確認
    const flagIcon = container.querySelector('svg')
    expect(flagIcon).toBeInTheDocument()
  })
})
