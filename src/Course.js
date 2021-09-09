import "./App.css";
import Axios from "./axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import { AgGridReact} from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useHistory} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Chip }from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";


function Course()
{
    const history = useHistory(); 
    const[syllabusList, setSyllabusList] =  useState([]);
    const[isLoading, setIsLoading] = useState(true);
    // const[objectives, setObjectives] = useState([]);
    const[isOperationDone, setIsOperationDone] = useState(false);
    const userName = window.sessionStorage.getItem("userName");

    useEffect(() => {
        Axios.get("http://localhost:8002/api/syllabus")
        .then((results) => {
            const syllabusItems = results.data;
            mapSyllabusItems(syllabusItems);
        });
    }, []);

    const handleSave = (index) =>
    {
        const syllabusItemsClone = [...syllabusList];
        const syllabusItem = syllabusItemsClone[index];
        console.log(syllabusItem.isUpdate);
        const updateStatus = syllabusItem.isUpdate;
        if(!updateStatus)
        {

            Axios.post("http://localhost:8002/api/syllabus",
            {
                "title": syllabusItem.title,
                "description": syllabusItem.description,
                "objectives": syllabusItem.objectives
            })
            .then((result) => 
            {
                if(result.status === 201)
                {
                    setIsOperationDone(true);
                    syllabusItemsClone[index] = result.data[0];
                    console.log(result.data[0])
                    
                }
            })
            .then(() => {
                if(isOperationDone)
                {
                    confirmAlert({
                        title: "Added Successfully!",
                        buttons: [{
                            label: "OK",
                        }]
                        
                    });
                }
                mapSyllabusItems(syllabusItemsClone);
            })
            .catch((error) =>
            {
                console.log(error);
            })
        }
        else
        {
            const syllabusId = syllabusItem.syllabusID;
            Axios.put("http://localhost:8002/api/syllabus/" + syllabusId, {
                "title": syllabusItem.title,
                "description": syllabusItem.description,
                "objectives": syllabusItem.objectives
            })
            .then((result) => {
                if(result.status === 200)
                {
                    setIsOperationDone(true);
                    syllabusItemsClone[index] = result.data[0];
                    
                }
            }).then(() =>
            {
                if(isOperationDone)
                {
                    confirmAlert({
                        title: "Updated Successfully!",
                        buttons: [{
                            label: "OK",
                        }]
                    });
                }
                mapSyllabusItems(syllabusItemsClone);
            })
        }
    }
    
    const handleDelete = (index) =>
	{
		const syllabusItemsClone = [...syllabusList];
		index = index - 1;
		const syllabusItem = syllabusItemsClone[index];
		const syllabusId = syllabusItem.syllabusID;
		const updateStatus = syllabusItem.isUpdate;
		console.log();
		if(updateStatus)
		{
            const deleteOptions = {
                    title: `Delete Syllabus ${index + 1}`,
                    message: "Are you sure ?",
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: () => {
                                Axios.delete("http://localhost:8002/api/syllabus/" + syllabusId)
                                .then((result) =>
                                {
                                    if(result.status === 200)
                                    {
                                        setIsOperationDone(true);
                                        syllabusItemsClone.splice(index, 1);
                                        
                                    }
                                    
                                })
                                .then(() =>
                                {
                                    if(isOperationDone)
                                    {
                                        confirmAlert({
                                            title: "Deleted Successfully!",
                                            buttons: [{
                                                label: "Ok"
                                            }]
                                        });
                                    }
                                    mapSyllabusItems(syllabusItemsClone);
                                })
                                .catch((error) =>
                                {
                                    console.log(error);
                                })
                            }
                        },
                        {
                            label: 'No'
                        }
                    ]
                };
                confirmAlert(deleteOptions);
		}
		else
		{
			syllabusItemsClone.pop();
			setSyllabusList(syllabusItemsClone);
		}
	}

    const mapSyllabusItems = (syllabusItems) =>
    {
        syllabusItems.map((syllabusItem, index) =>
        {
            syllabusItem["syllabusNumber"] = index + 1;
            syllabusItem["isUpdate"] = true;
            return(<></>);
        })
        setSyllabusList(syllabusItems);
        setIsLoading(false);
    }
    
    const autoCompleteObjectives = (objectives) =>
    {
        // objectives = [objectives];
        let duplicateObjectives = [];
        duplicateObjectives = objectives.split(",");

        console.log(duplicateObjectives);
        return(
        <Autocomplete
        multiple
        id="tags-filled"
        options={[objectives].map((objective) => objective)}
        defaultValue={duplicateObjectives}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
          >
          </TextField>
        )}
      />
        );
    }

	const columnDefs = [
		{headerName: "Syllabus Number", field: "syllabusNumber", cellClass: "grid-cell-centered"},
		{headerName: "Title", field: "title", editable: true, cellClass: "grid-cell-centered"},
		{headerName: "Description", field: "description", editable: true, cellClass: "grid-cell-centered"},
		{headerName: "Learning Objectives", field: "objectives", editable:true, cellClass: "grid-cell-centered"
        , cellRendererFramework: (params) => autoCompleteObjectives(params.value) },
		{headerName: "Save/Update", field: "syllabusNumber", cellClass: "grid-cell-centered",
        cellRendererFramework: (params) =><Button variant="outline-primary" size="sm" onClick={() => handleSave((params.value) - 1)}>Save</Button>},
		{headerName: "Delete", field: "syllabusNumber", cellClass: "grid-cell-centered",
        cellRendererFramework: (params) =><Button variant="outline-danger" size="sm" onClick={() => handleDelete(params.value)}>Delete</Button>},
	];

    
    const defaultColumnDefs = {
		flex: 1,
		sortable: true,
		resizable: true,
        minWidth: 100,
        minHeight: 100
	}


    const addEmptySyllabusForm = (event) => {
		const syllabusItemsClone = [...syllabusList];
		const emptySyllabusForm = {
			title: null, 
			description: null,
			objectives: null,
			isUpdate: false
		};
		syllabusItemsClone.push(emptySyllabusForm);
		syllabusItemsClone.map((syllabusItem, index) =>
		{
			syllabusItem["syllabusNumber"] = index + 1;
			return(<></>);
		})
		setSyllabusList(syllabusItemsClone);
	};
	
    const logout =() =>
    {
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("userName");
        history.push("/");
    }

	return(
        <>
        {userName ? (<><h3 align="center">Welcome Back {userName}!</h3>
		<div>
			<Button variant="warning" style={{"marginLeft":"30px"}} onClick={logout}>LogOut</Button>
			<Button style={{"marginLeft": "1400px", "marginBottom": "20px"}} variant="dark" onClick={addEmptySyllabusForm}>Add Syllabus</Button>
		</div>
        {!isLoading ? (
        <div id="myGrid" className="ag-theme-alpine" style={{height: "500px", "marginLeft": "20px", "marginRight":"20px"}}>
			<AgGridReact 
			reactUi="true"
			rowData={syllabusList}
			columnDefs={columnDefs}
			defaultColDef = {defaultColumnDefs}
			>
			</AgGridReact>
		</div>) 
        :
        (
            <>
                <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="100" aria-valuemax="100" style={{"width": "100%"}}></div>
                </div>
            </>
        )}
		
		</>)
        :
        (<Button variant="warning" style={{"marginLeft":"600px", "marginTop":"100px", "boxShadow": "10px 10px 5px lightBlue"}} onClick={logout}>Please Click Here To Login</Button>)}
		</>
	);
};

export default Course;
