interface ProgressBarProps {
  progress: number;
  completed: number;
  total: number;
}

export default function ProgressBar({ progress, completed, total }: ProgressBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">진행 상황</h2>
        <span className="text-2xl font-bold text-pink-600">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-3 text-center text-sm text-gray-600">
        <span className="font-medium text-pink-600">{completed}</span>
        <span> / {total} 항목 완료</span>
      </div>
      
      {progress === 100 && (
        <div className="mt-4 text-center text-lg font-semibold text-pink-600 animate-bounce">
          🎉 모든 준비가 완료되었습니다! 🎉
        </div>
      )}
    </div>
  );
}
