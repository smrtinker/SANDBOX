import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

export default function Astrology({ user }) {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: '',
    longitude: ''
  });
  const [astroData, setAstroData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.birthDate || !formData.birthTime || !formData.birthPlace || !formData.latitude || !formData.longitude) {
      setError('Please fill in all fields');
      return false;
    }
    if (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude))) {
      setError('Latitude and longitude must be valid numbers');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.getAstroData({
        date: new Date(formData.birthDate),
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });

      setAstroData(response);
      toast({
        title: "Astrological Profile Generated",
        description: "Your birth chart has been calculated successfully.",
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch astrological data');
      console.error('Astrology calculation error:', err);
      toast({
        title: "Error",
        description: err.message || "An error occurred while calculating your birth chart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Astrological Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthTime">Birth Time (HH:MM)</Label>
              <Input
                id="birthTime"
                name="birthTime"
                type="time"
                value={formData.birthTime}
                onChange={handleChange}
                required
                pattern="[0-9]{2}:[0-9]{2}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace">Birth Place</Label>
              <Input
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  placeholder="-90 to 90"
                  min="-90"
                  max="90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  placeholder="-180 to 180"
                  min="-180"
                  max="180"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Calculating...' : 'Calculate Birth Chart'}
            </Button>
          </form>

          {astroData && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Your Astrological Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Zodiac Sign</Label>
                  <p className="text-lg font-medium">{astroData.zodiacSign || 'N/A'}</p>
                </div>
                <div>
                  <Label>Ascendant</Label>
                  <p className="text-lg font-medium">{astroData.ascendant || 'N/A'}</p>
                </div>
                <div>
                  <Label>Moon Sign</Label>
                  <p className="text-lg font-medium">{astroData.moonSign || 'N/A'}</p>
                </div>
                <div>
                  <Label>Sun Position</Label>
                  <p className="text-lg font-medium">
                    {astroData.sunPosition ? (
                      <>
                        Azimuth: {astroData.sunPosition.azimuth?.toFixed(2) || 'N/A'}°, 
                        Altitude: {astroData.sunPosition.altitude?.toFixed(2) || 'N/A'}°
                      </>
                    ) : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <Label>Birth Place</Label>
                <p className="text-lg font-medium">{astroData.birthPlace || 'N/A'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}