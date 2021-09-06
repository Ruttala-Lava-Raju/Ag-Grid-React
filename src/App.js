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
		{headerName: "Save", field: "title", cellRendererFramework: (params) =><button variant="primary">Save</button>},
		{headerName: "Delete", field: "title", cellRendererFramework: (params) =><button variant="danger">Delete</button>},
	];
	const addEmptySyllabusForm = (event) => {
		const syllabusItemsClone = [...syllabusList];
		const emptySyllabusForm = {
			title: null, 
			description: null,
			objectives: null
		};
		syllabusItemsClone.push(emptySyllabusForm);
		syllabusItemsClone.map((syllabusItem, index) =>
		{
			syllabusItem["syllabusNumber"] = index + 1;
		})
		console.log(syllabusItemsClone);
		setSyllabusList(syllabusItemsClone);
	};
	useEffect(() => {
		Axios.get()
		.then((results) => {
			const syllabusItems = results.data;
			syllabusItems.map((syllabusItem, index) => {
				syllabusItem["syllabusNumber"] = index + 1;
			});
			setSyllabusList(syllabusItems);
		});
	}, []);
	const rowClass = 'my-green-class';
	const getRowClass = params => {
    if (params.node.rowIndex % 2 === 0) {
        return 'my-shaded-effect';
    }
};
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
			rowClass={rowClass}
			getRowClass={getRowClass}
			>
			</AgGridReact>
		</div>
		</>
	);
};
export default App;
