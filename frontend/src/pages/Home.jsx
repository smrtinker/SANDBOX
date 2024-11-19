import React from 'react'
import ApiTest from '../components/ui/api-test'

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Home</h1>
      <ApiTest />
    </div>
  )
}

export default Home