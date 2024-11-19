import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

export default function SocialFeed() {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      const mockPosts = [
        { id: 1, author: 'Alice', content: 'Hello SANDBOX!', likes: 5, comments: ['Great to see you here!'] },
        { id: 2, author: 'Bob', content: 'Excited to connect with my community!', likes: 3, comments: [] },
      ]
      setPosts(mockPosts)
    }

    fetchPosts()
  }, [])

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (newPost.trim()) {
      const newPostObj = {
        id: posts.length + 1,
        author: 'Current User',
        content: newPost,
        likes: 0,
        comments: [],
      }
      setPosts([newPostObj, ...posts])
      setNewPost('')
    }
  }

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const handleComment = (postId, comment) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ))
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full"
            />
            <Button type="submit">Post</Button>
          </form>
        </CardContent>
      </Card>
      
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-2">
                <p className="font-semibold">{post.author}</p>
                <p className="text-gray-600">{post.content}</p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleLike(post.id)}>
                    Like ({post.likes})
                  </Button>
                  <Button variant="outline" size="sm">Comment</Button>
                </div>
                {post.comments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded">
                        <p className="text-sm">{comment}</p>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const input = e.currentTarget.elements.namedItem('comment')
                  if (input instanceof HTMLInputElement && input.value.trim()) {
                    handleComment(post.id, input.value)
                    input.value = ''
                  }
                }} className="mt-2 flex space-x-2">
                  <Input name="comment" placeholder="Write a comment..." className="flex-grow" />
                  <Button type="submit" size="sm">Send</Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}