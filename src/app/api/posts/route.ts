import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import PostModel from '../../../models/Post';
import initialPosts from '../../../data/posts.json';

const Post = PostModel as any;

export async function GET() {
  try {
    await dbConnect();
    let posts = await Post.find({}).sort({ createdAt: -1 });

    if (posts.length === 0) {
      console.log('No posts found in database. Auto-seeding initial posts...');
      const cleanPosts = initialPosts.map(({ id, ...rest }) => ({
        ...rest
      }));
      await Post.insertMany(cleanPosts);
      posts = await Post.find({}).sort({ createdAt: -1 });
    }

    const formattedPosts = posts.map(post => {
      const obj = post.toObject();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });

    return NextResponse.json(formattedPosts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const existing = await Post.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: 'An article with this slug URL already exists' }, { status: 400 });
    }

    const newPost = await Post.create(body);
    const obj = newPost.toObject();
    return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, _id, ...updateData } = body;
    
    const dbId = id || _id;
    if (!dbId) {
      return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });
    }

    const existing = await Post.findOne({ slug: updateData.slug, _id: { $ne: dbId } });
    if (existing) {
      return NextResponse.json({ error: 'An article with this slug URL already exists' }, { status: 400 });
    }

    const updatedPost = await Post.findByIdAndUpdate(dbId, updateData, { new: true });
    if (!updatedPost) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const obj = updatedPost.toObject();
    return NextResponse.json({ ...obj, id: obj._id.toString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });
    }

    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
