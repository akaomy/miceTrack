function App() {

    const [status, setStatus] = React.useState(null)
    const [popupModal, setPopupModal] = React.useState(false)
    
    const [mouseData, setMouseData] = React.useState([])

    const [showPupInputs, setsShowPupInputs] = React.useState(false)

    const [femaleMouseManualId, setFemaleMouseManualId] = React.useState('')
    const [matingDate, setMatingDate] = React.useState('')
    const [isPregnant, setIsPregnant] = React.useState(false)
    const [hasPups, setHasPups] = React.useState(false)

    const [isUpdate, setIsUpdate] = React.useState(false)
    const [isCreate, setIsCreate] = React.useState(false)

    const [mouseId, setMouseId] = React.useState(null)

    // get mice data to populate the table
    React.useEffect(() => {
        fetch('/track-mice')
        .then((response) => response.json())
        .then((responseData) => {
            setMouseData(responseData)
        });
    }, [])

    const displayPupsInputs = () => {
        setsShowPupInputs(!showPupInputs)
      }

    const openModal = () => {
        setPopupModal(true)
    }

    const closeModal = () => {
        setPopupModal(false)
        window.location.reload()
    }

    const deleteRowData = mouseId => {
    
        fetch('/track-mice', {
            method: 'DELETE',
            body: JSON.stringify(mouseId),
            headers: {
            'Content-Type': 'application/json'
            }
        })
        window.location.reload()
    }

    const handleCreateMiceBtn = () => {
        setPopupModal(!popupModal)
        setIsCreate(true)
    }

    const handleUpdateMiceBtn = (mouse) => {
        openModal()
        setIsUpdate(true)
        setMouseId(mouse['female_mouse_id'])
      }

    const submitData = e => {
        e.preventDefault()
        if (isCreate) createMiceRow(e)
        if (isUpdate) updateMiceRow(mouseId)
      }

    const createMiceRow = () => {

        const formInputs = {
            female_mouse_manual_id: femaleMouseManualId,
            mating_date: matingDate,
            check_if_pregnant: isPregnant,
            has_pups: hasPups
        }
        console.log('formInputs', formInputs)
        fetch('/track-mice/create', {
            method: 'POST',
            body: JSON.stringify(formInputs),
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            setStatus(responseData.status)
        })

        document.querySelector('#cancel-btn').style.visibility = 'hidden';
        document.querySelector('#create-btn').style.visibility = 'hidden';
        document.querySelector('#track-mice-form').style.visibility = 'hidden';
    }
    
    const updateMiceRow = (mouse_id) => {

    const formInputs = {
        female_mouse_id: mouse_id,
        female_mouse_manual_id: femaleMouseManualId,
        mating_date: matingDate,
        check_if_pregnant: isPregnant,
        has_pups: hasPups
    }
    
    fetch('/track-mice/update', {
        method: 'POST',
        body: JSON.stringify(formInputs),
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((responseData) => {
        setStatus(responseData.status)
    })
    document.querySelector('#cancel-btn').style.visibility = 'hidden';
    document.querySelector('#create-btn').style.visibility = 'hidden';
    document.querySelector('#track-mice-form').style.visibility = 'hidden';
    }

    return (
        <React.Fragment>
            <h1>MiceTrack</h1>
            <button
                type="button"
                onClick={handleCreateMiceBtn} 
                className="btn btn-primary">
                    Track a mouse
            </button>
            {popupModal &&
            <div>
                {status ? 
                <div className="alert alert-success"> {status} 
                    <button onClick={closeModal}>
                        Close
                    </button>
                    </div> : null}

                <form id="track-mice-form" onSubmit={submitData}>
                    <h2>Female mice info</h2>
                    <label htmlFor="female-mouse-manual-id">Female ID</label>
                    <input 
                        type="text" 
                        id="female-mouse-manual-id" 
                        name="female-mouse-manual-id" 
                        value={femaleMouseManualId}
                        onChange={e => setFemaleMouseManualId(e.target.value)}
                    /><br/>

                    <label htmlFor="mating-date">Mating date</label>
                    <input 
                        type="date" 
                        id="mating-date" 
                        name="mating-date" 
                        value={matingDate}
                        onChange={e => setMatingDate(e.target.value)}
                    /><br/>

                    <label htmlFor="check-if-pregnant">Check if pregnant</label>
                    <input 
                        type="checkbox" 
                        id="check-if-pregnant" 
                        name="check-if-pregnant" 
                        checked={isPregnant}
                        onChange={e => setIsPregnant(e.target.checked)}
                    /><br/>

                    <label htmlFor="has-pups">Has pups</label>
                    <input 
                        type="checkbox" 
                        id="has-pups" 
                        name="has-pups"
                        onClick={displayPupsInputs}
                        checked={hasPups}
                        onChange={e => setHasPups(e.target.value)}
                    /><br/>

                    {showPupInputs && 
                    <React.Fragment>
                        <h2>Pups info</h2>

                        <label htmlFor="pups-stain">Pups stain</label>
                        <select name="pups-stain" id="pups-stain">
                            <option value="WT">WT</option>
                        </select><br/>

                        <label htmlFor="date-of-birth">Date of birth</label>
                        <input type="date" id="date-of-birth" name="date-of-birth"/><br/>
                    </React.Fragment>}
                    <button id="cancel-btn" onClick={closeModal}>Cancel</button>
                    <input id="create-btn" type="submit" value="Submit" />
                </form>
            </div>}

            <table className="table table-striped">
                <tr>
                <th scope="col">female mouse id</th>
                <th scope="col">mating date</th>
                <th scope="col">pregnant?</th>
                <th scope="col">has pups?</th>
                </tr>
                {mouseData.map(mouse =>
                    <tr key={mouse['female_mouse_id']}>
                        <th id={mouse['female_mouse_manual_id']} scope="row">
                            {mouse['female_mouse_manual_id']}
                        </th>
                        <td>{mouse['mating_date']}</td>
                        <td>{mouse['pregnant'] ? 'yes' : 'no'}</td>
                        <td>{mouse['has_pups'] ? 'yes' : 'no'}</td>
                        <td>
                        <button 
                            onClick={() => handleUpdateMiceBtn(mouse)}
                            >
                            edit
                            </button>
                        </td>
                        <td>
                        <button onClick={() => deleteRowData(mouse['female_mouse_id'])}>
                            delete
                        </button>
                        </td>
                    </tr>
                    )}
                    
            </table> 
        </React.Fragment>
    )
}

ReactDOM.render(<App />, document.querySelector('#root'));
