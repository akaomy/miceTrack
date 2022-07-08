function Modal(props) {

    return (
      <div className="popup">
        <div>
            {props.status ? 
                <div className="alert alert-success"><span>{props.status}</span> 
                    <button className="btn-close" onClick={props.closeModal}></button>
                </div> : null}
                <div className="custom-modal">
                    <form id="track-mice-form" onSubmit={props.submitData}>
                        <div class="modal-header">
                            <h2 class="modal-title">Female mice info</h2>
                        </div>
                        <div class="modal-body">
                            <label className="modal-labels" htmlFor="female-mouse-manual-id">Female ID</label>
                            <input
                                className="modal-body-input"
                                type="text" 
                                id="female-mouse-manual-id"
                                name="female-mouse-manual-id" 
                                value={props.femaleMouseManualId}
                                onChange={e => props.setFemaleMouseManualId(e.target.value)}
                                required
                            /><br/>

                            <label className="modal-labels" htmlFor="mating-date">Mating date</label>
                            <input
                                className="modal-body-input" 
                                type="date" 
                                id="mating-date" 
                                name="mating-date" 
                                value={props.matingDate}
                                onChange={e => props.setMatingDate(e.target.value)}
                                required
                            /><br/>

                            <label className="modal-labels" htmlFor="is-pregnant">Pregnant?</label>
                            <input
                                className="modal-body-input"
                                type="checkbox" 
                                id="is-pregnant" 
                                name="is-pregnant"
                                checked={props.isPregnant}
                                onChange={() => props.setIsPregnant(!props.isPregnant)}
                            /><br/>
                            <label className="modal-labels" htmlFor="has-pups">Has pups</label>
                            <input
                                className="modal-body-input"
                                type="checkbox"
                                id="has-pups" 
                                name="has-pups"
                                checked={props.hasPups}
                                onChange={() => props.setHasPups(!props.hasPups)}
                            /><br/>
                            {props.hasPups && 
                            <React.Fragment>
                                <hr className="subtitle-pups-hr"/>
                                <h5 className="subtitle-pups-info">Pups info</h5>
                                <label className="modal-labels" htmlFor="pups-strain">Pups strain</label>
                                <input
                                    className="modal-body-input"
                                    type="text" 
                                    name="pups-strain" 
                                    id="pups-strain"
                                    value={props.pupStrain}
                                    onChange={e => props.setPupStrain(e.target.value)}
                                    required
                                /><br/>

                                <label className="modal-labels" htmlFor="date-of-birth">Date of birth</label>
                                <input
                                    className="modal-body-input" 
                                    type="date" 
                                    id="date-of-birth" 
                                    name="date-of-birth"
                                    value={props.formatDate(props.pupsDob)} 
                                    onChange={e => props.setPupsDob(e.target.value)}
                                /><br/>
                            </React.Fragment>}
                        </div>
                        <div class="modal-footer">
                            <button id="cancel-btn" className="btn btn-secondary" onClick={props.closeModal}>Cancel</button>
                            <input id="create-btn" className="btn btn-success" type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
      </div>
    );
}

function Table(props) {

    return (
        <table className="cust-table">
                <tr className="table-header" >
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
                        <td id={mouse['female_mouse_manual_id']}>
                            {mouse['female_mouse_manual_id']}
                        </td>
                        <td>{props.formatDate(mouse['mating_date'])}</td>
                        <td>{props.daysInBreeding(mouse['mating_date'])}</td>
                        <td>{props.needToCheckIfPregnant(mouse['mating_date'], mouse['is_pregnant'])}</td>
                        <td>{mouse['is_pregnant'] ? 'yes' : 'no'}</td>
                        <td>{mouse['pups_strain'] === '' || mouse['pups_strain'] === null ? '_' : mouse['pups_strain']}</td>
                        <td>{mouse['has_pups'] ? 'yes' : 'no'}</td>
                        <td>{props.formatDate(mouse['pups_dob']) === '1980-01-01' || mouse['pups_dob'] === null ? '-' : props.formatDate(mouse['pups_dob'])}</td>
                        <td>{mouse['pups_dob'] == null ? '-' : props.calculatePupsDaysOld(mouse)}</td>
                        <button
                            className="btn btn-warning" 
                            onClick={() => props.handleUpdateMiceBtn(mouse)}
                        >
                            edit
                        </button>
                        {/* todo: add 'mice has been deleted successfully' message once it's been deleted */}
                        <button 
                            className="btn btn-danger"
                            onClick={() => props.deleteRowData(mouse['female_mouse_id'])}
                        >
                            delete
                        </button>
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

    const closeUploader = () => {
        props.toggleUploadCSVFile()
        window.location.reload()
    }

    return (
        <div className="upload-file">
            {status ? 
                <div className="alert alert-success">{status} 
                    <button onClick={closeUploader}>Close</button>
                </div> :
                <div id="file">
                    <button className="upload-file__btn btn-close" onClick={props.toggleUploadCSVFile}></button>
                    <div class="modal-header">
                        <h2 class="modal-title">Upload CSV here</h2>
                    </div>
                    <div class="modal-body">
                        <input className="upload-file__input_file" type="file" name="file" onChange={changeHandler} required />
                    </div>
                    <div class="modal-footer">
                        <button className="upload-file__btn btn btn-secondary" onClick={handleSubmission}>Submit</button>
                    </div>
                </div>
                }
        </div>
    )
}