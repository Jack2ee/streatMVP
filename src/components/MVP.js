import React, { Component } from 'react';
import firebase from 'firebase';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Logo from '../assets/twoyak.png';

const config = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: `${process.env.REACT_APP_authDomain}`,
  databaseURL: `${process.env.REACT_APP_databaseURL}`,
  storageBucket: `${process.env.REACT_APP_storageBucket}`,
};
firebase.initializeApp(config);

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%',
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class MVP extends Component {
  state = {
    username: '',
    avatar: '',
    isUploading: false,
    progress: 0,
    avatarURL: '',
    uploadPic: false
  };

  handleChange = name => event => {
    this.setState({ username: event.target.value });
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    console.log(filename)
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };

  uploadPic = () => {
    if ( !this.state.username ) {
      alert('연락처를 입력해주세요')
    } else {
      this.setState({ uploadPic: !this.state.uploadPic})
    }
  }

  render () {
    const { classes } = this.props;

    return (
      <div style={{display: "flex", flexFlow: "column", alignItems: "center", justifyContent: "center"}}>
        <img src={Logo} alt='Logo' style={{width: '50%', height: '20%'}} />
        <p style={{width: "90%", color: "brown"}}>어려운 약 정보를 쉽게 전달해드리겠습니다!</p>
        { !this.state.uploadPic
          ? 
            <TextField
              id="standard-password-input"
              label="연락방법(이메일, 카카오톡 아이디 등)"
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange()}
            />
          : 
          <div style={{paddingTop: "35px", paddingBottom: "15px"}}>
            {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
            <CustomUploadButton
              accept="image/*"
              name="avatar"
              filename={this.state.username}
              storageRef={firebase.storage().ref("images")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
              style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4}}
            >
              사진추가
            </CustomUploadButton>
          </div>}
          <Button variant="contained" className={classes.button} onClick={this.uploadPic}>
            { !this.state.uploadPic
              ? <div>사진올리기</div>
              : <div>연락처 입력</div>}
          </Button>
      </div>
    )
  }
};

export default withStyles(styles)(MVP);