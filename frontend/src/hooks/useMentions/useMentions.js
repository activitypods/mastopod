import { useMemo } from 'react';
import renderMentions from './renderMentions';

const useMentions = data => {
  const items = useMemo(
    () => ({ query }) => data.filter(({ label }) => label.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    , [data]
  );

  return {
    items,
    render: renderMentions
  };
};

export default useMentions;
