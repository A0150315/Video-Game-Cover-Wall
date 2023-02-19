import { useQuery } from 'react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { GameListData } from '../types';

export const getRecentGamesPast = ({ page = 1 }: { page: number }): Promise<GameListData> => {
  return axios.get(`https://rawg.io/api/games/lists/popular`, {
    params: {
      discover: true,
      page_size: 30,
      page,
      key: 'c542e67aec3a4340908f9de9e86038af',
    },
  });
};

type QueryFnType = typeof getRecentGamesPast;

type UseCommentsOptions = {
  page: number;
  config?: QueryConfig<QueryFnType>;
};

export const useRecentGamesPast = ({ page, config }: UseCommentsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['recent-games-past', page],
    queryFn: () => getRecentGamesPast({ page }),
    ...config,
  });
};
