import { useEffect, useRef } from "react";
import { Box, CircularProgress } from "@mui/material";
import useIsVisible from "../hooks/useIsVisible";

/**
 * When this component becomes visible and `isLoading` is false, `fetchNextPage` is called.
 * When `isLoading` is set to true, a loading spinner is displayed.
 */
const LoadMore = ({ fetchNextPage, isLoading }) => {
  const ref = useRef(null);
  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible && !isLoading) fetchNextPage();
  }, [isVisible, fetchNextPage]);

  return (
    <div ref={ref}>
      <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
        {isLoading && <CircularProgress />}
      </Box>
    </div>
  );
};

export default LoadMore;
