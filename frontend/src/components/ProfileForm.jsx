import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

const ProfileForm = ({ user = {}, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    bio: user.bio || '',
    skills: user.skills ? user.skills.join(', ') : '',
    youtube: user.social?.youtube || '',
    twitter: user.social?.twitter || '',
    facebook: user.social?.facebook || '',
    linkedin: user.social?.linkedin || '',
    instagram: user.social?.instagram || '',
  });

  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bio || !formData.skills) {
      toast({
        title: "Validation Error",
        description: "Bio and Skills are required fields.",
        variant: "warning",
      });
      return;
    }
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      onProfileUpdate(updatedUser);
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated with the new information.",
      })
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error.message || "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us something about yourself"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="HTML, CSS, JavaScript, React"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="youtube">YouTube</Label>
        <Input
          type="url"
          id="youtube"
          name="youtube"
          value={formData.youtube}
          onChange={handleChange}
          placeholder="YouTube URL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          type="url"
          id="twitter"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          placeholder="Twitter URL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facebook">Facebook</Label>
        <Input
          type="url"
          id="facebook"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
          placeholder="Facebook URL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          type="url"
          id="linkedin"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          type="url"
          id="instagram"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          placeholder="Instagram URL"
        />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  )
}

export default ProfileForm