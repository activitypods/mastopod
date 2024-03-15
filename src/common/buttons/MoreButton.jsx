import React, { useState } from "react";
import {
  IconButton,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const MoreButton = ({ activity, children, ...rest }) => {
  const anchorRef = React.useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        ref={anchorRef}
        onClick={handleToggle}
        {...rest}
      >
        <MoreHorizIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start">
        <Paper>
          <ClickAwayListener onClickAway={handleToggle}>
            <MenuList id="split-button-menu" autoFocusItem>
              {children}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
};

export default MoreButton;
