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
                            <select 
                                name="pups-strain" 
                                id="pups-strain"
                                required
                                >
                                    {props.strainOptionsDisplay()}
                            </select><br/>

                            <label htmlFor="date-of-birth">Date of birth</label>
                            <input 
                                type="date" 
                                id="date-of-birth" 
                                name="date-of-birth"
                                value={props.setPupsDob} 
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

function UploadFile(props) {

    const [selectedFile, setSelectedFile] = React.useState();
    const [status, setStatus] = React.useState(null)

    const changeHandler = (e) => {
		setSelectedFile(e.target.files[0]);
	}

    const handleSubmission = () => {
        const formData = new FormData();
        formData.append('file', selectedFile)
        
        console.log('formData', formData)
        console.log('selectedFile', selectedFile)

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