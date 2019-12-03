import React, {useEffect} from "react";
import {connect} from "react-redux";
import {AppBar, Toolbar, Typography, makeStyles, Menu, MenuItem, Box} from "@material-ui/core";
import {logout} from "../../actions/session";
import {AccountCircle} from '@material-ui/icons';
import IconButton from "@material-ui/core/IconButton";
import {Link, withRouter} from "react-router-dom";

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
  const {logout, session} = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [title, setTitle] = React.useState('It Works Employee Perception');
  const isMenuOpen = Boolean(anchorEl);


  useEffect(()=>{
    props.history.listen(() => {
      console.log(window.location.pathname);
      changeTitle(window.location.pathname);
    })
  }, [])

  const changeTitle = (newTitle) => {
    if (newTitle.startsWith('/analytics')){
      setTitle('Survey Analytics');
    }
    else if (newTitle.startsWith('/managerdashboard')){
      setTitle('Manager Insights Dashboard');
    }
    else if (newTitle.startsWith('/dashboard')) {
      setTitle('Employee Dashboard')
    }else if (newTitle.startsWith('/builder')){
      setTitle('Survey Builder')
    }else{
      setTitle(newTitle);
    }
  }

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
        <MenuItem disabled={true}>Currently Logged in as {session.fullName}</MenuItem>
        <MenuItem><Link to={'/builder'}>Survey Builder</Link></MenuItem>
        <MenuItem><Link to={'/dashboard'}>Switch to Employee View</Link></MenuItem>
        <MenuItem><Link to={'/managerdashboard'}>Switch To Manager View</Link></MenuItem>
        <MenuItem onClick={logout} style={{color: 'red'}}>Log Out</MenuItem>
      </Menu>
  )

  return (
      <div className={classes.root}>
        <AppBar color="primary" position={'static'}>
          <Toolbar>
            <div>
            <Typography variant={'h3'} noWrap>{title}</Typography>
            </div>
            <div className={classes.root}/>

            <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
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