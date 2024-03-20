import { Form, SearchInput, useRedirect } from "react-admin";
import { Box, Card, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundImage: `radial-gradient(circle at 50% 8em, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: "5px 10px",
  },
}));

const FindUserCard = ({ stripCard }) => {
  const classes = useStyles();
  const redirect = useRedirect();

  const onSubmit = ({ username }) => {
    redirect(`/actor/${username}`);
  };

  return stripCard ? (
    <Form onSubmit={onSubmit}>
      <SearchInput
        placeholder="@user@instance.com"
        source="username"
        margin="dense"
        fullWidth
        sx={{ mt: 0, mb: -3 }}
      />
    </Form>
  ) : (
    <Card>
      <Box className={classes.title} p={1}>
        <Typography variant="h6">Find user</Typography>
      </Box>
      <Box p={2}>
        <Typography variant="body2">
          To find another fediverse member, enter their handle and hit enter.
        </Typography>
        <Form onSubmit={onSubmit}>
          <SearchInput
            placeholder="@user@instance.com"
            source="username"
            margin="dense"
            fullWidth
            sx={{ mt: 1, mb: -2 }}
          />
        </Form>
      </Box>
    </Card>
  );
};

export default FindUserCard;
