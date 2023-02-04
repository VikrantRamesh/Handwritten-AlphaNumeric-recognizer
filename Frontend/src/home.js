import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import cblogo from "./cblogo.png";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import {Clear,Backspace} from '@material-ui/icons';
import axios, * as others from 'axios';
import Canvas from './Can';
import Canvas2 from './Can2';
import { white } from "material-ui/styles/colors";
import {useOnDraw} from './Hooks';
import { CenterFocusStrong, RoundedCorner } from "@material-ui/icons";
import { autocompleteClasses } from "@mui/material";



const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);


const useStyles = makeStyles((theme) => ({
  Canvas:{
    backgroundColor: 'white',
  },
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
    maxWidth: "416px",
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    width:"100%",
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center',  
    margin: "0 auto 0",
  },
  gridContainer2: {
    border:'6px solid white',
    borderRadius: "15px",
    width:"100%",
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center',  
    margin: "1rem 2rem 1rem",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundAttachment: "fixed",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'fill',
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 550,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px', 
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: '#36454F',
    boxShadow: 'none',
    color: 'white',
  },
  loader: {
    color: '#be6a77 !important',
  },
  result: {
    background: '#FFF',
    borderRadius: 5,
    width: "80%",
    height: 100,
    borderColor: 'black !important',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    margin: "2% 10%",
  },
  btn: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: "0.25rem auto",
    width: "40%",
    padding: "0.9rem",
  },
  tablet: {
    maxWidth: "100%",
  }
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [selectedFile_num, setSelectedFile_num] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [result, setResult] = useState("");
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  const sendFile = async () => {
  
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);

      let res = await axios({
        method: "post",
        url: 'http://127.0.0.1:5000/predict_alpha',
        data: formData,
      });
      console.log(res.data); 

      let c = String.fromCharCode(res.data.class + 65);
      res.data.class = c;
      setData(res.data);
      chooseMessage(res.data.class)

      setIsloading(false);
    }
  };
  const sendFile_num = async () => {
  
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile_num);

      let res = await axios({
        method: "post",
        url: 'http://127.0.0.1:5000/predict_num',
        data: formData,
      });
      console.log(res.data); 

      let c = String.fromCharCode(res.data.class + 65);
      res.data.class = c;
      setData(res.data);
      chooseMessage(res.data.class)

      setIsloading(false);
    }
  };

  const chooseMessage = (r) => {
    setResult(result+r);
  };

  const backpaceRes = () => {
    setResult(result.slice(0,result.length-1));
  }

  const clearRes = () => {
    setResult("");
  }
  

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h4" noWrap>
            Hand-Written Text Identifier
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
          
      <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
      >
        <div className={classes.tablet}>
        <h1 className={classes.text}> Alphabets</h1>
        <Grid className={classes.gridContainer2} item xs={12}>
          
          {/* <Grid item xs={6}>
            <h1 className={classes.text}> DROP!</h1>
                       
            
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="image"
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              }
              {!image && <CardContent className={classes.content}>
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag and drop an image of a Hand Written Alphabet   process"}
                  onChange={onSelectFile}
                />
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <TableContainer component={Paper} className={classes.tableContainer}>
                  <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableCell1}>Label:</TableCell>
                        <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                      <TableRow className={classes.tableRow}>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          {data.class}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>}
              {isLoading && <CardContent className={classes.detail}>
                <CircularProgress color="secondary" className={classes.loader} />
                <Typography className={classes.title} variant="h6" noWrap>
                  Processing
                </Typography>
              </CardContent>}
              {data &&
            <Grid item className={classes.buttonGrid} >
            
            <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
              Clear
            </ColorButton>

            </Grid>
          }
            </Card>
            
          </Grid> */}
          
          <Grid item xs={12}>
          <h1 className={classes.text}>DRAW!</h1>
          <div className="Canvas">
          <Canvas
              id="tutorial"
              width={300}
              height={300}
              chooseMessage={chooseMessage}
            />
          
        </div>
      
          </Grid>
        </Grid>
        </div>
        <div className={classes.tablet}>
        <h1 className={classes.text}> Numbers</h1>
        
        <Grid className={classes.gridContainer2} item xs={12}>
          
          {/* <Grid item xs={6}>
            <h1 className={classes.text}> DROP!</h1>
                       
            
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="image"
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              }
              {!image && <CardContent className={classes.content}>
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag and drop an image of a Hand Written Number process"}
                  onChange={onSelectFile}
                />
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <TableContainer component={Paper} className={classes.tableContainer}>
                  <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableCell1}>Label:</TableCell>
                        <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                      <TableRow className={classes.tableRow}>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          {data.class}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>}
              {isLoading && <CardContent className={classes.detail}>
                <CircularProgress color="secondary" className={classes.loader} />
                <Typography className={classes.title} variant="h6" noWrap>
                  Processing
                </Typography>
              </CardContent>}
              {data &&
            <Grid item className={classes.buttonGrid} >
            
            <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
              Clear
            </ColorButton>

            </Grid>
          }
            </Card>
            
          </Grid> */}
          
          <Grid item xs={12}>
          <h1 className={classes.text}>DRAW!</h1>
          <div className="Canvas">
            <Canvas2
                id="tutorial"
                width={300}
                height={300}
                chooseMessage={chooseMessage}
              />
            
          </div>
        
        </Grid>
        
    </Grid>    
    </div>
            
          <Grid item xs={10}>
                <div className={classes.result}>                 
                  <h1>{result}</h1> 
                </div>
                <div  className={classes.btn}>
                    <ColorButton variant="contained"  color="primary" component="span" size="large" onClick={backpaceRes} startIcon={<Backspace fontSize="large" />}>
                        Backspace
                    </ColorButton>
                    <ColorButton variant="contained"  color="primary" component="span" size="large" onClick={clearRes} startIcon={<Clear fontSize="large" />}>
                        Clear
                    </ColorButton>
                </div>
                  
          </Grid>
          
      </Grid >
        
        
      </Container >

    </React.Fragment >  
  );
};