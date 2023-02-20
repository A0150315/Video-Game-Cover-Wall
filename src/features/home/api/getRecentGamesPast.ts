import { useQuery } from 'react-query';

import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

import { GameListData } from '../types';

export const getRecentGamesPast = ({ page = 1 }: { page: number }): Promise<GameListData> => {
  return axios.get(`https://api.rawg.io/api/games`, {
    params: {
      page_size: 30,
      page,
      metacritic: '80,100',
      ordering: '-released',
      key: 'c9dd580def464602b88d070054e355c6',
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
