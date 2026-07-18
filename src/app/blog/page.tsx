import dbConnect from '../../lib/mongodb';
import PostModel from '../../models/Post';
import { BlogList } from '../../components/BlogList';
import initialPosts from '../../data/posts.json';

const Post = PostModel as any;


export const metadata = {
  title: "Blog & Resources - ClearBG Pro",
  description: "Read the latest tips, tricks, and expert resources on image editing, photo optimization, and software workflows.",
};

async function getPosts() {
  try {
    await dbConnect();
    let posts = await Post.find({}).sort({ createdAt: -1 });
    
    if (posts.length === 0) {
      console.log('Database empty, seeding posts for Blog page...');
      const cleanPosts = initialPosts.map(({ id, ...rest }: any) => rest);
      await Post.insertMany(cleanPosts);
      posts = await Post.find({}).sort({ createdAt: -1 });
    }
    
    return posts.map(post => {
      const obj = post.toObject();
      return {
        ...obj,
        id: obj._id.toString()
      };
    });
  } catch (error) {
    console.error("Failed to fetch posts for Blog list:", error);
    return [];
  }
}

export default async function Blog() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
