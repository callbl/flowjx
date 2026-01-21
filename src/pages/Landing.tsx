import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-white">3D Editor</h1>
        <p className="text-xl text-white/90">Create amazing 3D designs in your browser</p>
        <Link
          to="/app"
          className="inline-block px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
        >
          Launch Editor
        </Link>
      </div>
    </div>
  )
}
