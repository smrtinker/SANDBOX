// src/components/Dashboard.jsx
import React from 'react'
import { Card } from '@/components/ui/card'

function Dashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Active Users', value: '891', change: '+5%' },
    { label: 'Revenue', value: '$12,345', change: '+23%' },
    { label: 'Conversion Rate', value: '3.2%', change: '+1.2%' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transform transition hover:scale-105">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              <p className={`mt-2 text-sm ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div>
                <p className="font-medium text-gray-800">User Activity {item}</p>
                <p className="text-sm text-gray-500">Description of the activity</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard