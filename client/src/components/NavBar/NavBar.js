import React, {useEffect} from "react";
import {connect} from "react-redux";
import {AppBar, Toolbar, Typography, makeStyles, Menu, MenuItem, IconButton, Button} from "@material-ui/core";
import {logout} from "../../actions/session";
import {AccountCircle} from '@material-ui/icons';
import {withRouter} from "react-router-dom";
import logo from './it-works-logo.png';
import {red} from "@material-ui/core/colors";

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
    transform: 'scale(1.8)',
  },
  logo: {
    '&:hover': {
      cursor: 'pointer',
    }
  },
  menuLabel: {
    color: theme.palette.primary.dark,
  },
  menuItem: {
    '&:hover' : {
      backgroundColor: theme.palette.primary.light,
    },
    backgroundColor: theme.palette.background
  },

  logoutButton: {
    color: 'red',
    '&:hover' : {
      backgroundColor: '#ff8a80',
      color: 'white'
    }
  },

}));

const processWindowName = (newTitle) => {
  if (newTitle.startsWith('/analytics')) {
    return ('Survey Analytics');
  } else if (newTitle.startsWith('/managerdashboard')) {
    return ('Manager Insights Dashboard');
  } else if (newTitle.startsWith('/dashboard')) {
    return ('Employee Dashboard')
  } else if (newTitle.startsWith('/builder')) {
    return ('Survey Builder')
  } else {
    return (newTitle);
  }
};

const NavBar = (props) => {
  const {logout, session} = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [title, setTitle] = React.useState(processWindowName(window.location.pathname));
  const isMenuOpen = Boolean(anchorEl);


  useEffect(() => {
    props.history.listen(() => {
      setTitle(processWindowName(window.location.pathname));
    })
  }, [props.history]);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  }

  const menuCloseAndRedirect = (redirectTo) => {
    setAnchorEl(null);
    props.history.push(redirectTo);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isManager = () => {
    return props.session.permRole === 'manager';
  }

  const renderMenu = (
      <Menu
          anchorEl={anchorEl}
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          keepMounted
          transformOrigin={{vertical: 'top', horizontal: 'right'}}
          open={isMenuOpen}
          onClose={handleMenuClose}
      >
        <MenuItem className={classes.menuLabel} disabled={true}>Currently Logged in as {session.fullName}</MenuItem>
        <MenuItem className={classes.menuItem} onClick={() => {menuCloseAndRedirect('/dashboard')}}>Switch to Employee View</MenuItem>
        {isManager() && <>
        <MenuItem className={classes.menuItem} onClick={() => {menuCloseAndRedirect('/builder')}}>Survey Builder</MenuItem>
        <MenuItem className={classes.menuItem} onClick={() => {menuCloseAndRedirect('/managerdashboard')}}>Switch To Manager View</MenuItem>
        </>
        }
        <MenuItem className={classes.logoutButton} onClick={logout}>Log Out</MenuItem>
      </Menu>
  );

  return (
      <div className={classes.root} style={{marginBottom: '5%'}}>
        <AppBar color="secondary" position={'fixed'}>
          <Toolbar>
            <img alt={'It Works Logo'} className={classes.logo} src={logo} width={'8%'} onClick={()=>{props.history.push('/dashboard')}}/>
              <Typography variant={'h4'} color="primary" style={{marginLeft: '1%'}}>{title}</Typography>
            <div className={classes.root}/>
            <Button edge='end' color={'primary'} onClick={() => {menuCloseAndRedirect('/builder')}}>
              New Survey
            </Button>
            <IconButton
                edge="end"
                color="primary"
                onClick={handleProfileMenuOpen}
            >

              <AccountCircle color={'primary'} className={classes.profileIcon}/>
            </IconButton>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </div>

  );

}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));