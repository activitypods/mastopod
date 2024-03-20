import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";

const ReplyButton = ({ objectUri, ...rest }) => {
  return (
    <IconButton
      aria-label="reply"
      component={Link}
      to={`/activity/${encodeURIComponent(objectUri)}#reply`}
      {...rest}
    >
      <ReplyIcon />
    </IconButton>
  );
};

export default ReplyButton;
