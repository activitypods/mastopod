import { useCallback } from "react";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";

const ReplyButton = ({ activity, ...rest }) => {
  return (
    <IconButton
      aria-label="reply"
      component={Link}
      to={`/activity/${encodeURIComponent(activity.id)}#reply`}
      {...rest}
    >
      <ReplyIcon />
    </IconButton>
  );
};

export default ReplyButton;
