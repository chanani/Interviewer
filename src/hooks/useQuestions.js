import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchQuestions, fetchCultureFit, updateBookmark } from '../api/notion';

export function useCSQuestions() {
  return useQuery({
    queryKey: ['cs-questions'],
    queryFn: fetchQuestions,
  });
}

export function useCultureFitQuestions() {
  return useQuery({
    queryKey: ['culturefit-questions'],
    queryFn: fetchCultureFit,
  });
}

export function useBookmarkMutation(queryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, checked }) => updateBookmark(pageId, checked),
    onMutate: async ({ pageId, checked }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) =>
        old?.map((q) => (q.id === pageId ? { ...q, bookmarked: checked } : q))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },
  });
}
