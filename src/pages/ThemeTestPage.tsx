import { useTheme } from '../contexts/ThemeContext'

export function ThemeTestPage() {
  const { theme, isDarkMode, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Theme Test Page</h1>
        
        <div className="space-y-6">
          {/* Current State */}
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Current State</h2>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium">Theme:</dt>
                <dd className="text-xl font-bold">{theme}</dd>
              </div>
              <div>
                <dt className="font-medium">Is Dark Mode:</dt>
                <dd className="text-xl font-bold">{isDarkMode ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="font-medium">HTML Classes:</dt>
                <dd className="text-sm font-mono">{document.documentElement.className || 'none'}</dd>
              </div>
            </dl>
          </div>

          {/* Toggle Button */}
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Actions</h2>
            <button
              onClick={() => {
                console.log('Button clicked!')
                toggleTheme()
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Toggle Theme (Current: {theme})
            </button>
          </div>

          {/* Visual Test Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Card 1</h3>
              <p className="text-gray-600 dark:text-gray-300">
                This card should change appearance based on the theme.
                Background should be white in light mode and dark gray in dark mode.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-600 dark:text-purple-400">Card 2</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Text colors should also adapt - darker in light mode, lighter in dark mode.
              </p>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Color Swatches</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="h-20 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                Blue 500
              </div>
              <div className="h-20 bg-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                Purple 500
              </div>
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center font-semibold">
                Gray
              </div>
              <div className="h-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center font-semibold">
                Surface
              </div>
            </div>
          </div>

          {/* CSS Variables Test */}
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">CSS Variables Test</h2>
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)'
              }}
            >
              This div uses CSS variables directly. It should also change with the theme.
            </div>
          </div>

          {/* Console Instructions */}
          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-900 dark:text-yellow-200">
              Debugging Instructions
            </h2>
            <p className="text-yellow-800 dark:text-yellow-300 mb-4">
              Open your browser console (F12) and click the "Toggle Theme" button above.
              You should see detailed logs about the theme change process.
            </p>
            <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-300">
              <li>Check if the HTML element gets the 'dark' class</li>
              <li>Verify CSS variables are changing</li>
              <li>Look for any JavaScript errors</li>
              <li>Check computed styles in DevTools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

