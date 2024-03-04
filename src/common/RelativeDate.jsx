import dayjs from "dayjs";
import { Typography } from "@mui/material";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const RelativeDate = ({ date, ...rest }) => (
  <Typography title={dayjs(date).format("LLL")} {...rest}>
    {dayjs().from(dayjs(date), true)}
  </Typography>
);

export default RelativeDate;
