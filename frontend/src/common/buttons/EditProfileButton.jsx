import { useState, useRef } from 'react';
import { Button, Paper, Popper, MenuItem, MenuList, ClickAwayListener } from '@mui/material';
import { useGetIdentity, useTranslate } from 'react-admin';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useOpenExternalApp from '../../hooks/useOpenExternalApp';

const EditProfileButton = ({ ...props }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const translate = useTranslate();
  const openExternalApp = useOpenExternalApp();
  const { data: identity } = useGetIdentity();

  return (
    <>
      <Button
        variant="contained"
        endIcon={<ArrowDropDownIcon />}
        onClick={() => setOpen(prevOpen => !prevOpen)}
        ref={anchorRef}
        {...props}
      >
        {translate('app.action.edit_profile')}
      </Button>
      <Popper sx={{ zIndex: 1 }} open={open} anchorEl={anchorRef.current} placement="bottom">
        <Paper>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <MenuList id="split-button-menu" autoFocusItem>
              <MenuItem
                onClick={() => {
                  window.location.href = openExternalApp('as:Profile', identity?.profileData?.id, 'edit');
                }}
              >
                {translate('app.action.edit_private_profile')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  window.location.href = openExternalApp('as:Person', identity?.id, 'edit');
                }}
              >
                {translate('app.action.edit_public_profile')}
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
};

export default EditProfileButton;
