import React from "react";
import {connect} from "react-redux";
import {AppBar, Button, Grid, Toolbar, Typography, makeStyles} from "@material-ui/core";
import {logout} from "../../actions/session";
import {AccountCircle} from '@material-ui/icons';
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";

const mapStateToProps = ({session}) => ({
  session, // this puts session as a prop
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()), // This puts logout as a prop for the component
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  profileIcon: {
    transform: 'scale(1.8)'
  }
}));


const NavBar = (props) => {
  const {logout} = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const switchView = () => {
    props.history.push('/dashboard');
  }

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
      <Menu
          anchorEl={anchorEl}
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          keepMounted
          transformOrigin={{vertical: 'top', horizontal: 'right'}}
          open={isMenuOpen}
          onClose={handleMenuClose}
      >
        <MenuItem onClick={switchView}> Switch to Employee View</MenuItem>
        <MenuItem onClick={logout}> Log Out</MenuItem>
      </Menu>
  )

  return (
      <div className={classes.root}>
        <AppBar color="primary" position={'static'}>
          <Toolbar>
            <Typography variant={'h3'} noWrap>It Works!</Typography>
            <div className={classes.root}/>

            <IconButton
                edge="end"
                color="inherit"
            >

              <AccountCircle className={classes.profileIcon}/>
            </IconButton>


          </Toolbar>
        </AppBar>
        {renderMenu}
      </div>

  );

}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));