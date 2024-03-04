import { Box, Avatar, Typography } from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import { useGetOne } from "react-admin";
import useActor from "../../../hooks/useActor";

const BoostBanner = ({ activity }) => {
  const actor = useActor(activity.actor || activity.attributedTo);

  return (
    <Box pl={8} pb={1} sx={{ position: "relative" }}>
      <Avatar
        src={actor?.image}
        alt={actor?.name}
        sx={{
          position: "absolute",
          top: 0,
          left: 30,
          width: 20,
          height: 20,
        }}
      />
      <Typography sx={{ fontSize: 13, color: "grey", verticalAlign: "middle" }}>
        <RepeatIcon sx={{ width: 13, height: 13 }} /> {actor?.name} boosted
      </Typography>
    </Box>
  );
};

export default BoostBanner;
