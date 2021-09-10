import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: '100%',
    maxWidth: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function getStyles(name, workflowName, theme) {
  return {
    fontWeight:
      workflowName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [workflowName, setworkflowName] = React.useState([]);
  
  const handleChange = (event) => {
    setworkflowName(event.target.value);
    props.onChange(event.target.value);
  };

  useEffect(()=>{
    var existWorkflows=[];
    if(props.existingWorkflows){
      props.existingWorkflows.map((item)=>{
        if(props.workFlows.find(wf=>wf._id == item.id) !== undefined){
        existWorkflows.push(item.name)
        }
      })
      setworkflowName(existWorkflows)
      }else{  
      setworkflowName([])
      };
  },[props.workFlows])

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">Workflows ( Multi Select)</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={workflowName}
          disabled={props.disabled}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
           <MenuItem
            disabled
            classes={{
              root: classes.selectMenuItem,
            }}
          >
            Choose Workflows
          </MenuItem>
          {props.workFlows.map((name, index) => (
            <MenuItem key={index} value={name.workflowName} style={getStyles(name, workflowName, theme)}>
              {name.workflowName}
            </MenuItem>
          )) }
        </Select>
      </FormControl>
    </div>
  );
}
