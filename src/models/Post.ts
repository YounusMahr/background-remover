import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  author: { type: String, default: 'ClearBG Pro Team' },
  readTime: { type: String, default: '5 min read' },
  tags: [{ type: String }]
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
