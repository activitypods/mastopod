import { useTranslate } from 'react-admin';
import { IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';

const ReplyButton = ({ objectUri, ...rest }) => {
  const translate = useTranslate();
  return (
    <Tooltip title={translate('app.action.reply')}>
      <IconButton
        aria-label={translate('app.action.reply')}
        component={Link}
        to={`/activity/${encodeURIComponent(objectUri)}#reply`}
        {...rest}
      >
        <ReplyIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ReplyButton;
