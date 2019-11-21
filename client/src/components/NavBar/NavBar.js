import React from "react";
import {connect} from "react-redux";
import {AppBar, Button, Grid, Toolbar, Typography} from "@material-ui/core";
import {logout} from "../../actions/session";

const mapStateToProps = ({session}) => ({
  session, // this puts session as a prop
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()), // This puts logout as a prop for the component
});

const NavBar = () => {

  return(
      <AppBar color="primary" position={'static'}>
        <Toolbar>
          <Grid
              justify={'space-between'}
              container
          >
            <Grid item>
              <Typography type={'title'} variant={'h4'}>Manager Dashboard</Typography>
            </Grid>
            <Grid item>
              <Button onClick={logout}><Typography variant={'h5'}>Logout</Typography></Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);