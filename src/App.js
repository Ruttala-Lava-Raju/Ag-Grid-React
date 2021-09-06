import "./App.css";
import Axios from "./axios";
import React, {useEffect, useState} from "react";
import { AgGridReact} from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
function App()
{
	const[syllabusList, setSyllabusList] =  useState([]);
	const columnDefs = [
		{headerName: "Syllabus Number", field: "syllabusNumber", editable: true},
		{headerName: "Title", field: "title", editable: true},
		{headerName: "Description", field: "description", editable: true},
		{headerName: "Learning Objectives", field: "objectives", editable: true},
		{headerName: "Save/Update", field: "syllabusNumber", cellRendererFramework: (params) =><button variant="primary" onClick={() => handleSave((params.value) - 1)}>Save/Update</button>},
		{headerName: "Delete", field: "syllabusNumber", cellRendererFramework: (params) =><button variant="danger" onClick={() => handleDelete(params.value)}>Delete</button>},
	];

	const handleSave = (index) =>
	{
		const syllabusItemsClone = [...syllabusList];
		const syllabusItem = syllabusItemsClone[index];
		console.log(syllabusItem.isUpdate);
		// Axios.post("http://localhost:8002/api/syllabus", {
		// 		"title": syllabusItem.title,
		// 		"description": syllabusItem.description,
		// 		"objectives": syllabusItem.objectives
		// 	}).then((result) => {
		// 		if(result.status === 201)
		// 		{
		// 			syllabusItemsClone[index] = result.data[0];
		// 			console.log(result.data[0])
		// 			mapSyllabusItems(syllabusItemsClone);
		// 		}
		// 	}).catch((error) =>
		// 	{
		// 		console.log(error);
		// 	})
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
		// mapSyllabusItems(syllabusItemsClone);
		
	};
	useEffect(() => {
		Axios.get()
		.then((results) => {
			const syllabusItems = results.data;
			mapSyllabusItems(syllabusItems);
		});
	}, []);

	const handleDelete = (index) =>
	{
		const syllabusItemsClone = [...syllabusList];
		index = index - 1;
		const syllabusId = syllabusItemsClone[index].syllabusID;
		Axios.delete("http://localhost:8002/api/syllabus/" + syllabusId)
		.then((result) =>
		{
			if(result.status === 200)
			{
				syllabusItemsClone.splice(index, 1);
				mapSyllabusItems(syllabusItemsClone);
			}
		})
		.catch((error) =>
		{
			console.log(error);
		})
	}
	
	const defaultColumnDefs = {
		flex: 1,
		sortable: true,
		resizable: true
	}
	return(
		<><h2 align="center">Online Courses</h2>
		<button style={{"marginLeft": "1400px", "marginBottom": "20px"}} variant="primary" onClick={addEmptySyllabusForm}>Add Syllabus</button>
		<div id="myGrid" className="ag-theme-alpine-dark" style={{height: "500px", "marginLeft": "20px", "marginRight":"20px"}}>
			<AgGridReact 
			reactUi="true"
			rowData={syllabusList}
			columnDefs={columnDefs}
			defaultColDef = {defaultColumnDefs}
			>
			</AgGridReact>
		</div>
		</>
	);
};
export default App;
