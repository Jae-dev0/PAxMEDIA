import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createPost } from '../../api/posts';
import { getCommunities } from '../../api/communities';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import Card from '../../components/ui/Card';
import { Image, Video, Link, BarChart3, Type, Upload, X } from 'lucide-react';
import { cn } from '../../utils/format';

type PostType = 'text' | 'image' | 'gallery' | 'video' | 'link' | 'poll';

const postTypes = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'link', label: 'Link', icon: Link },
  { id: 'poll', label: 'Poll', icon: BarChart3 },
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postType, setPostType] = useState<PostType>('text');
  const [communityId, setCommunityId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [link, setLink] = useState('');
  const [flair, setFlair] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);

  const { data: communities } = useQuery({
    queryKey: ['communities'],
    queryFn: () => getCommunities(1, 50),
  });

  const createMutation = useMutation({
    mutationFn: () => createPost({
      communityId,
      title,
      body,
      type: postType,
      flair: flair || undefined,
      isSpoiler,
      isNSFW,
    }),
    onSuccess: (post) => {
      toast('success', 'Post created successfully!');
      navigate(`/post/${post.id}`);
    },
    onError: () => {
      toast('error', 'Failed to create post. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!communityId || !title.trim()) {
      toast('error', 'Please fill in all required fields');
      return;
    }
    createMutation.mutate();
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Create Post</h1>

      {/* Post type selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {postTypes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPostType(id as PostType)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              postType === id
                ? 'bg-brand-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <Card className="space-y-4">
        {/* Community selector */}
        <Select
          label="Community"
          value={communityId}
          onChange={(e) => setCommunityId(e.target.value)}
          options={(communities?.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Select a community"
        />

        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="An interesting title"
          maxLength={300}
        />

        {/* Body */}
        {(postType === 'text' || postType === 'poll') && (
          <Textarea
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Your post content..."
            rows={6}
          />
        )}

        {/* Link */}
        {postType === 'link' && (
          <Input
            label="URL"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            type="url"
          />
        )}

        {/* Media upload */}
        {(postType === 'image' || postType === 'gallery' || postType === 'video') && (
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Media
            </label>
            <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-surface-400 mx-auto mb-2" />
              <p className="text-sm text-surface-500">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-surface-400 mt-1">
                {postType === 'video' ? 'MP4, WebM up to 100MB' : 'PNG, JPG, GIF up to 20MB'}
              </p>
            </div>
          </div>
        )}

        {/* Poll builder */}
        {postType === 'poll' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Poll Options
            </label>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {pollOptions.length > 2 && (
                  <Button variant="ghost" size="sm" onClick={() => removePollOption(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {pollOptions.length < 6 && (
              <Button variant="outline" size="sm" onClick={addPollOption}>
                Add Option
              </Button>
            )}
          </div>
        )}

        {/* Flair */}
        <Input
          label="Flair (optional)"
          value={flair}
          onChange={(e) => setFlair(e.target.value)}
          placeholder="e.g., Discussion, News, Question"
        />

        {/* Options */}
        <div className="flex items-center gap-6">
          <Checkbox
            checked={isSpoiler}
            onChange={(e) => setIsSpoiler(e.target.checked)}
            label="Mark as spoiler"
          />
          <Checkbox
            checked={isNSFW}
            onChange={(e) => setIsNSFW(e.target.checked)}
            label="NSFW"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => toast('info', 'Draft saved')}>
            Save Draft
          </Button>
          <Button onClick={handleSubmit} isLoading={createMutation.isPending}>
            Publish
          </Button>
        </div>
      </Card>
    </div>
  );
}
