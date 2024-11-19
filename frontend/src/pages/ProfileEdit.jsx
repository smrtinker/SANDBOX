import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from '@/lib/api';

export default function ProfileEdit({ user, onUpdateUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    avatar: '',
    social: {
      twitter: '',
      linkedin: '',
      github: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const data = await apiClient.getUserProfile();
      console.log('Current profile data:', data);
      
      setFormData({
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        avatar: data.avatar || '',
        social: {
          twitter: data.social?.twitter || '',
          linkedin: data.social?.linkedin || '',
          github: data.social?.github || ''
        }
      });
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Profile fetch error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, value);
    
    if (name.startsWith('social.')) {
      const socialPlatform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialPlatform]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setDebugInfo(null);

    try {
      const updatedData = {
        ...formData,
        skills: formData.skills
          ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
          : []
      };

      // Log the data being sent
      console.log('Sending update data:', updatedData);
      setDebugInfo(prevDebug => ({ ...prevDebug, dataSent: updatedData }));

      const response = await apiClient.updateUserProfile(updatedData);
      
      // Log the response
      console.log('Update response:', response);
      setDebugInfo(prevDebug => ({ ...prevDebug, serverResponse: response }));

      // Verify the update by fetching the profile again
      const verifyData = await apiClient.getUserProfile();
      console.log('Verification fetch:', verifyData);
      setDebugInfo(prevDebug => ({ ...prevDebug, verificationData: verifyData }));

      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          name: response.name,
          email: response.email
        });
      }

      setSuccess('Profile updated successfully');
      
      // Don't navigate immediately - let's verify the data
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Profile update error:', err);
      setDebugInfo(prevDebug => ({ ...prevDebug, error: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                name="avatar"
                type="url"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Social Links</Label>
              <div className="space-y-2">
                <Input
                  name="social.twitter"
                  value={formData.social.twitter}
                  onChange={handleChange}
                  placeholder="Twitter URL"
                  type="url"
                />
                <Input
                  name="social.linkedin"
                  value={formData.social.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  type="url"
                />
                <Input
                  name="social.github"
                  value={formData.social.github}
                  onChange={handleChange}
                  placeholder="GitHub URL"
                  type="url"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>

          {debugInfo && (
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold mb-2">Debug Information</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}