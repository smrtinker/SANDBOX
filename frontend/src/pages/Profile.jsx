import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getUserProfile();
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', {
        message: err.message,
        user,
        baseURL: apiClient.baseURL
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user?._id) {
    return <div className="text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <Button asChild>
            <Link to="/profile/edit">Edit Profile</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {profile && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {profile.avatar && (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-20 h-20 rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                </div>
              </div>
              
              {profile.bio && (
                <div className="mt-4">
                  <h3 className="font-semibold">Bio</h3>
                  <p>{profile.bio}</p>
                </div>
              )}

              {profile.skills?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}