interface VolatilityData {
  曜日: string
  n: number
  median_vol: number
  iqr_low: number
  iqr_high: number
  mean_vol: number
}

interface VolatilityHeatmapProps {
  data: {
    short: VolatilityData[]
    mid: VolatilityData[]
  }
}

export function VolatilityHeatmap({ data }: VolatilityHeatmapProps) {
  // 全データから最大値と最小値を取得してカラースケールを作成
  const allValues = [...data.short.map((d) => d.mean_vol), ...data.mid.map((d) => d.mean_vol)]
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)

  // 値を0-1の範囲に正規化
  const normalizeValue = (value: number) => {
    return (value - minValue) / (maxValue - minValue)
  }

  // 正規化された値に基づいて色の強度を決定
  const getHeatmapColor = (value: number) => {
    const normalized = normalizeValue(value)
    if (normalized < 0.2) return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    if (normalized < 0.4) return "bg-green-500/20 text-green-300 border-green-500/30"
    if (normalized < 0.6) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    if (normalized < 0.8) return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    return "bg-red-500/20 text-red-300 border-red-500/30"
  }

  // 曜日の順序を定義
  const dayOrder = ["月", "火", "水", "木", "金"]

  // データを曜日順に並び替え
  const sortedShort = dayOrder.map((day) => data.short.find((d) => d.曜日 === day)).filter(Boolean) as VolatilityData[]
  const sortedMid = dayOrder.map((day) => data.mid.find((d) => d.曜日 === day)).filter(Boolean) as VolatilityData[]

  return (
    <div className="space-y-6">
      {/* カラースケール凡例 */}
      <div className="flex items-center justify-between">
        <span className="text-slate-300 font-medium">低ボラティリティ</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500/40 border border-blue-500/50 rounded"></div>
          <div className="w-4 h-4 bg-green-500/40 border border-green-500/50 rounded"></div>
          <div className="w-4 h-4 bg-yellow-500/40 border border-yellow-500/50 rounded"></div>
          <div className="w-4 h-4 bg-orange-500/40 border border-orange-500/50 rounded"></div>
          <div className="w-4 h-4 bg-red-500/40 border border-red-500/50 rounded"></div>
        </div>
        <span className="text-slate-300 font-medium">高ボラティリティ</span>
      </div>

      {/* ヒートマップグリッド */}
      <div className="grid grid-cols-6 gap-3">
        {/* ヘッダー行 */}
        <div className="font-bold text-white text-center py-3">期間</div>
        {dayOrder.map((day) => (
          <div key={day} className="font-bold text-white text-center py-3">
            {day}曜日
          </div>
        ))}

        {/* Short期間行 */}
        <div className="font-bold text-cyan-400 text-center py-3 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Short
          </div>
        </div>
        {sortedShort.map((item) => (
          <div
            key={`short-${item.曜日}`}
            className={`aspect-square flex flex-col items-center justify-center rounded-xl border backdrop-blur-sm font-bold transition-all duration-300 hover:scale-105 cursor-pointer ${getHeatmapColor(item.mean_vol)}`}
            title={`${item.曜日}曜日 Short: ${item.mean_vol.toFixed(2)}%`}
          >
            <span className="text-lg font-mono">{item.mean_vol.toFixed(1)}</span>
            <span className="text-xs opacity-80">%</span>
          </div>
        ))}

        {/* Mid期間行 */}
        <div className="font-bold text-green-400 text-center py-3 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Mid
          </div>
        </div>
        {sortedMid.map((item) => (
          <div
            key={`mid-${item.曜日}`}
            className={`aspect-square flex flex-col items-center justify-center rounded-xl border backdrop-blur-sm font-bold transition-all duration-300 hover:scale-105 cursor-pointer ${getHeatmapColor(item.mean_vol)}`}
            title={`${item.曜日}曜日 Mid: ${item.mean_vol.toFixed(2)}%`}
          >
            <span className="text-lg font-mono">{item.mean_vol.toFixed(1)}</span>
            <span className="text-xs opacity-80">%</span>
          </div>
        ))}
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-700/50">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-green-400 font-mono">{minValue.toFixed(1)}%</div>
          <div className="text-slate-400 font-medium">最小ボラティリティ</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-red-400 font-mono">{maxValue.toFixed(1)}%</div>
          <div className="text-slate-400 font-medium">最大ボラティリティ</div>
        </div>
      </div>
    </div>
  )
}
