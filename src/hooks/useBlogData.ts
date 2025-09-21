import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { blogQueries } from '@/lib/blogQueries';

// Query keys for consistent caching
export const blogQueryKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogQueryKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...blogQueryKeys.lists(), { page, limit }] as const,
  details: () => [...blogQueryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...blogQueryKeys.details(), slug] as const,
  recent: (excludeSlug?: string) => [...blogQueryKeys.all, 'recent', excludeSlug] as const,
  related: (category: string, excludeSlug: string) => [...blogQueryKeys.all, 'related', category, excludeSlug] as const,
  latest: () => [...blogQueryKeys.all, 'latest'] as const,
  count: () => [...blogQueryKeys.all, 'count'] as const,
};

// Hook for paginated blog posts
export const useBlogPosts = (page: number = 1, limit: number = 9) => {
  return useQuery({
    queryKey: blogQueryKeys.list(page, limit),
    queryFn: () => blogQueries.getBlogPosts(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for infinite scroll blog posts
export const useInfiniteBlogPosts = (limit: number = 9) => {
  return useInfiniteQuery({
    queryKey: [...blogQueryKeys.lists(), 'infinite'],
    queryFn: ({ pageParam = 1 }) => blogQueries.getBlogPosts(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than the limit, we've reached the end
      return lastPage.length < limit ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Hook for single blog post
export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: blogQueryKeys.detail(slug),
    queryFn: () => blogQueries.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

// Hook for recent posts
export const useRecentPosts = (excludeSlug?: string, limit: number = 5) => {
  return useQuery({
    queryKey: blogQueryKeys.recent(excludeSlug),
    queryFn: () => blogQueries.getRecentPosts(excludeSlug, limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Hook for related posts
export const useRelatedPosts = (category: string, excludeSlug: string, limit: number = 3) => {
  return useQuery({
    queryKey: blogQueryKeys.related(category, excludeSlug),
    queryFn: () => blogQueries.getRelatedPosts(category, excludeSlug, limit),
    enabled: !!category && !!excludeSlug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Hook for latest posts (homepage)
export const useLatestPosts = (limit: number = 3) => {
  return useQuery({
    queryKey: blogQueryKeys.latest(),
    queryFn: () => blogQueries.getLatestPosts(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Hook for blog count
export const useBlogCount = () => {
  return useQuery({
    queryKey: blogQueryKeys.count(),
    queryFn: blogQueries.getBlogCount,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};
