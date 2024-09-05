import { useEffect, useRef } from "react";
import { Box, CircularProgress } from "@mui/material";
import useIsVisible from "../hooks/useIsVisible";

const LoadMore = ({ fetchNextPage, isFetchingNextPage }) => {
  const ref = useRef(null);
  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible) fetchNextPage();
  }, [isVisible, fetchNextPage]);

  return (
    <div ref={ref}>
      <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
        {isFetchingNextPage && <CircularProgress />}
      </Box>
    </div>
  );
};

export default LoadMore;
