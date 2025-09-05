interface LiveFeedProps {
  clerkId: string | undefined;
}

export default function LiveFeed({ user }: LiveFeedProps) {
  return (
    <h2 className="text-lg font-semibold mb-4">
        Live Feed for {user ?? 'Unknown User'} </h2>
  );
}