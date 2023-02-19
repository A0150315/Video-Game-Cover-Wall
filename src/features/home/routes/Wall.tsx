import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useRecentGamesPast } from '../api/getRecentGamesPast';
import { GameListData, GameListDataResult } from '../types';

const COVER_IMAGE_RATIO = 1920 / 1080;
const COLUMN_NUM = 6;
const ROW_NUM = 5;

export const Wall = () => {
  const curPage = useRef(1);
  const popingList = useRef<GameListDataResult[]>([]);
  const isMount = useRef(false);

  const [windowSize, setWindowSize] = useState({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  });

  const listQuery = useRecentGamesPast({ page: curPage.current });

  const [displayingData, setDisplayingData] = useState(listQuery);

  const imageSize = useMemo(() => {
    const height = windowSize.innerHeight / ROW_NUM;
    const width = COVER_IMAGE_RATIO * height;
    return { height, width };
  }, [windowSize.innerHeight]);

  const popingListChecker = () => {
    if (popingList.current.length) {
      const item = popingList.current.shift();
      if (item) {
        console.log(item);
        const randomIdx = parseInt(`${Math.random() * 30}`, 10);
        setDisplayingData((state) => {
          if (state.data?.results) {
            const tempList = [...state.data.results];
            tempList[randomIdx] = item;
            const stateTemp = { ...state };
            stateTemp.data.results = tempList;
            return stateTemp;
          }
          return state;
        });
      }
      setTimeout(() => {
        popingListChecker();
      }, 10000);
    } else {
      onNext();
    }
  };

  const onNext = async () => {
    isMount.current = true;
    curPage.current += 1;
    const response = await axios.get<GameListData>(`https://rawg.io/api/games/lists/popular`, {
      params: {
        discover: true,
        page_size: 30,
        page: curPage.current,
        key: 'c542e67aec3a4340908f9de9e86038af',
      },
    });
    popingList.current = response.data.results || [];
    setTimeout(() => {
      popingListChecker();
    }, 10000);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!listQuery.isLoading) {
      if (!isMount.current) {
        onNext();
      }
      if (!displayingData.data) {
        setDisplayingData(listQuery);
      }
    }
  }, [displayingData.data, listQuery, listQuery.isLoading, onNext]);

  return (
    <div
      style={{
        width: windowSize.innerWidth,
        height: windowSize.innerHeight,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'black',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: COLUMN_NUM * imageSize.width,
          height: ROW_NUM * imageSize.height,
          left: '50%',
          top: '50%',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {displayingData.data?.results.map((item) => (
          <img
            src={item.background_image}
            alt={`${item.name}-cover`}
            key={`cover-${item.id}`}
            style={{
              height: imageSize.height,
              width: imageSize.width,
            }}
          />
        ))}
      </div>
    </div>
  );
};
