import { useTranslate } from 'react-admin';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';

const ReplyButton = ({ objectUri, numReplies, ...rest }) => {
  const translate = useTranslate();
  return (
    <Tooltip title={translate('app.action.reply')}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          aria-label={translate('app.action.reply')}
          component={Link}
          to={`/activity/${encodeURIComponent(objectUri)}#reply`}
          {...rest}
        >
          <ReplyIcon />
        </IconButton>
        {numReplies > 0 && (
          <Box sx={{ ml: -1, fontSize: '0.875rem', color: 'text.secondary' }}>
            {numReplies}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default ReplyButton;
