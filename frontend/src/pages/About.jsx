import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">About SANDBOX</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Hey Ji is a social media platform designed to connect people within local communities. 
            Our goal is to foster genuine connections and facilitate local discovery, engagement, and growth.
          </p>
          <p className="mb-4">With Hey Ji, you can:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Connect with neighbors and fellow professionals</li>
            <li>Discover local events and news</li>
            <li>Share your thoughts and experiences</li>
            <li>Engage in community discussions</li>
            <li>Build a network of like-minded individuals</li>
          </ul>
          <p>
            Join Hey Ji today and start building meaningful connections in your local community!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}