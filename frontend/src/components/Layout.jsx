import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import ProfileDropdown from './ProfileDropdown'
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from '@/lib/api'

function Layout({ user, setUser }) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // If you have a logout endpoint
      if (apiClient.logout) {
        await apiClient.logout()
      }
      setUser(null)
      localStorage.removeItem('userInfo')
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Logout failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-foreground">SANDBOX</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  to="/" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
                {user && (
                  <>
                    <Link 
                      to="/profile" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Link to="/astrology" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Astrology
                      </Link>
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <ProfileDropdown 
                  user={user} 
                  onLogout={handleLogout} 
                />
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t py-6 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 SANDBOX. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout