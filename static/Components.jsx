function Modal(props) {

    return (
      <div className="popup">
        <div>
            {props.status ? 
                <div className="alert alert-success">{props.status} 
                    <button onClick={props.closeModal}>
                        Close
                    </button>
                    </div> : null}
                <div className="custom-modal">
                    <form id="track-mice-form" onSubmit={props.submitData}>
                        <h2>Female mice info</h2>
                        <label htmlFor="female-mouse-manual-id">Female ID</label>
                        <input 
                            type="text" 
                            id="female-mouse-manual-id"
                            name="female-mouse-manual-id" 
                            value={props.femaleMouseManualId}
                            onChange={e => props.setFemaleMouseManualId(e.target.value)}
                            required
                        /><br/>

                        <label htmlFor="mating-date">Mating date</label>
                        <input 
                            type="date" 
                            id="mating-date" 
                            name="mating-date" 
                            value={props.matingDate}
                            onChange={e => props.setMatingDate(e.target.value)}
                            required
                        /><br/>

                        <label htmlFor="is-pregnant">Pregnant?</label>
                        <input 
                            type="checkbox" 
                            id="is-pregnant" 
                            name="is-pregnant"
                            checked={props.isPregnant}
                            onClick={e => props.setIsPregnant(e.target.value)}
                        /><br/>
                        {console.log('props.isPregnant',props.isPregnant)}

                        <label htmlFor="has-pups">Has pups</label>
                        <input 
                            type="checkbox" 
                            id="has-pups" 
                            name="has-pups"
                            onClick={props.displayPupsInputs}
                            checked={props.hasPups}
                            onChange={e => props.setHasPups(e.target.value)}
                        /><br/>

                        {props.showPupInputs && 
                        <React.Fragment>
                            <h2>Pups info</h2>
                            <label htmlFor="pups-strain">Pups strain</label>
                            <input 
                                type="text" 
                                name="pups-strain" 
                                id="pups-strain"
                                value={props.pupStrain}
                                onChange={e => props.setPupStrain(e.target.value)}
                                required
                            /><br/>

                            <label htmlFor="date-of-birth">Date of birth</label>
                            <input 
                                type="date" 
                                id="date-of-birth" 
                                name="date-of-birth"
                                value={props.formatDate(props.pupsDob)} 
                                onChange={e => props.setPupsDob(e.target.value)}
                                required
                            /><br/>
                        </React.Fragment>}
                        <button id="cancel-btn" className="btn btn-secondary" onClick={props.closeModal}>Cancel</button>
                        <input id="create-btn" className="btn btn-success" type="submit" value="Submit" />
                    </form>
                </div>
            </div>
      </div>
    );
}

function Table(props) {

    return (
        <table className="table table-striped">
                <tr>
                    <th scope="col">female id</th>
                    <th scope="col">mating date</th>
                    <th scope="col">days in breeding</th>
                    <th scope="col">check pregnancy</th>
                    <th scope="col">pregnant?</th>
                    <th scope="col">pups strain</th>
                    <th scope="col">has pups?</th>
                    <th scope="col">pups dob</th>
                    <th scope="col">pups days old</th>
                </tr>
                {props.mouseData.map(mouse =>
                    <tr key={mouse['female_mouse_id']}>
                        <th id={mouse['female_mouse_manual_id']} scope="row">
                            {mouse['female_mouse_manual_id']}
                        </th>
                        <td>{props.formatDate(mouse['mating_date'])}</td>
                        <td>{props.daysInBreeding(mouse['mating_date'])}</td>
                        <td>{props.needToCheckIfPregnant(mouse['mating_date'])}</td>
                        {/* vystavlyaetsya rukami chto mysh' beremennaya */}
                        {/* esli beremennaya check propadaet */}
                        <td>{props.isPregnant ? 'yes' : 'no'}</td>
                        <td>{mouse['pups_strain']}</td>
                        <td>{props.needToCheckIfPregnant(mouse['mating_date']) == 'check' ? '' : props.checkIfHasPups(mouse['has_pups'])}</td>
                        <td>{props.formatDate(mouse['pups_dob']) === '1980-01-01' || mouse['pups_dob'] === null ? '' : props.formatDate(mouse['pups_dob'])}</td>
                        <td>{props.calculatePupsDaysOld(mouse)}</td>
                        <td>
                        <button
                            className="btn btn-warning" 
                            onClick={() => props.handleUpdateMiceBtn(mouse)}
                            >
                            edit
                            </button>
                        </td>
                        <td>
                        <button 
                            className="btn bl btn-danger"
                            onClick={() => props.deleteRowData(mouse['female_mouse_id'])}
                        >
                            delete
                        </button>
                        </td>
                    </tr>
                    )}
                    
            </table> 
    )
}

function UploadFile(props) {

    const [selectedFile, setSelectedFile] = React.useState();
    const [status, setStatus] = React.useState(null)

    const changeHandler = (e) => {
		setSelectedFile(e.target.files[0]);
	}

    const handleSubmission = () => {
        const formData = new FormData();
        formData.append('file', selectedFile)
        
        fetch('/track-mice/import-csv', {
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((responseData) => {
            setStatus(responseData.status)
        })
    }

    return (
        <div className="upload-file">
            {status ? 
                <div className="alert alert-success">{status} 
                    <button onClick={props.openUploadCSVFile}>
                        Close
                    </button>
                    </div> : null}
            <div id="file">
                <input type="file" name="file" onChange={changeHandler} required />
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    )
}