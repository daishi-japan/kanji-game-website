'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eraser, RotateCcw } from 'lucide-react'
import { GameButton } from './GameButton'

interface DrawingCanvasProps {
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  onDrawingComplete?: (paths: string[]) => void
  showGuide?: boolean
  guideCharacter?: string
}

/**
 * なぞり書き用キャンバスコンポーネント
 */
export function DrawingCanvas({
  width = 400,
  height = 400,
  strokeColor = '#2563eb',
  strokeWidth = 8,
  onDrawingComplete,
  showGuide = true,
  guideCharacter,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [paths, setPaths] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')

  // キャンバス初期化
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 高DPI対応
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // キャンバスクリア
    ctx.clearRect(0, 0, width, height)

    // 保存されたパスを再描画
    paths.forEach((path) => {
      drawPath(ctx, path)
    })
  }, [width, height, paths])

  // パスを描画
  const drawPath = (ctx: CanvasRenderingContext2D, pathData: string) => {
    const points = pathData.split(' ')
    if (points.length < 2) return

    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    points.forEach((point, index) => {
      const [x, y] = point.split(',').map(Number)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }

  // 座標取得（タッチ・マウス両対応）
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number

    if ('touches' in e) {
      if (e.touches.length === 0) return null
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  // 描画開始
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const coords = getCoordinates(e)
    if (!coords) return

    setIsDrawing(true)
    setCurrentPath(`${coords.x},${coords.y}`)
  }

  // 描画中
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return

    const coords = getCoordinates(e)
    if (!coords) return

    setCurrentPath((prev) => `${prev} ${coords.x},${coords.y}`)

    // リアルタイム描画
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const points = currentPath.split(' ')
    if (points.length === 0) return

    const lastPoint = points[points.length - 1].split(',').map(Number)

    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(lastPoint[0], lastPoint[1])
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }

  // 描画終了
  const stopDrawing = () => {
    if (!isDrawing) return

    setIsDrawing(false)

    if (currentPath) {
      const newPaths = [...paths, currentPath]
      setPaths(newPaths)
      setCurrentPath('')
      onDrawingComplete?.(newPaths)
    }
  }

  // クリア
  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    setPaths([])
    setCurrentPath('')
    onDrawingComplete?.([])
  }

  // 1つ戻る
  const undoLast = () => {
    if (paths.length === 0) return

    const newPaths = paths.slice(0, -1)
    setPaths(newPaths)
    onDrawingComplete?.(newPaths)
  }

  return (
    <div className="space-y-4">
      {/* キャンバスエリア */}
      <div className="relative">
        {/* ガイド文字（背景） */}
        {showGuide && guideCharacter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-[300px] font-bold text-muted-foreground/10 select-none">
              {guideCharacter}
            </p>
          </div>
        )}

        {/* グリッド線 */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width={width} height={height} className="opacity-20">
            {/* 縦線 */}
            <line
              x1={width / 2}
              y1="0"
              x2={width / 2}
              y2={height}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            {/* 横線 */}
            <line
              x1="0"
              y1={height / 2}
              x2={width}
              y2={height / 2}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          </svg>
        </div>

        {/* キャンバス */}
        <motion.canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-4 border-primary rounded-2xl bg-white cursor-crosshair touch-none"
          style={{ width, height }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* コントロールボタン */}
      <div className="flex gap-4 justify-center">
        <GameButton
          variant="secondary"
          onClick={undoLast}
          disabled={paths.length === 0}
          aria-label="1つ戻る"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          もどる
        </GameButton>

        <GameButton
          variant="secondary"
          onClick={clearCanvas}
          disabled={paths.length === 0}
          aria-label="全消去"
        >
          <Eraser className="w-5 h-5 mr-2" />
          ぜんぶけす
        </GameButton>
      </div>

      {/* 描画情報 */}
      <div className="text-center text-sm text-muted-foreground">
        <p>{paths.length}画 かきました</p>
      </div>
    </div>
  )
}
