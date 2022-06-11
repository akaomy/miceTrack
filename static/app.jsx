function App() {

    const [status, setStatus] = React.useState(null)
    const [popupModal, setPopupModal] = React.useState(false)
    const [uploadFilePopup, setUploadFilePopup] = React.useState(false)
    
    const [mouseData, setMouseData] = React.useState([])

    const [showPupInputs, setsShowPupInputs] = React.useState(false)

    const [femaleMouseManualId, setFemaleMouseManualId] = React.useState('')
    const [matingDate, setMatingDate] = React.useState(null)
    const [isPregnant, setIsPregnant] = React.useState(false)
    const [hasPups, setHasPups] = React.useState(false)
    const [pupsDob, setPupsDob] = React.useState(null)

    const [isUpdate, setIsUpdate] = React.useState(false)
    const [isCreate, setIsCreate] = React.useState(false)

    const [mouseId, setMouseId] = React.useState(null)
    const [exportData, setExportData] = React.useState('')


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
            has_pups: hasPups,
            pups_dob: pupsDob,
        }
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
            has_pups: hasPups,
            pups_dob: pupsDob,
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

    const strainOptionsDisplay = () => {
        const strains = ['WT', 'Pard3 cKO', 'Mlst8 KI', 'Cryba1 cKO', 'Akt2 cKo']
        return strains.map(strain => { return <option key={strain}>{strain}</option> })
    }

    const daysInBreeding = (mating_date) => {
        let today = new Date()
        let mating_date_object = new Date(mating_date) 
        const diffIndays = Math.abs(mating_date_object-today)

        return Math.floor(diffIndays / ((1000 * 60 * 60 * 24)))
    }

    const needToCheckIfPregnant = (mating_date) => {
        return daysInBreeding(mating_date) >= 15 ? 'yes' : '-'
    }

    const checkIfHasPups = (has_pups) => {
        return has_pups ? 'yes' : 'no'
    }

    const addZero = (num) => {
        if (num >= 0 && num <= 9) {
            return '0' + num;
        } else {
            return num;
        }
    }

    const formatDate = (db_date) => {
        const db_date_object = new Date(db_date)

        if (db_date_object instanceof Date && !isNaN(db_date_object.valueOf()) === false) return 
        
        return (addZero(db_date_object.getFullYear()) + '-' + addZero(db_date_object.getMonth() + 1) + '-' + addZero(db_date_object.getDate()))
    }

    const openUploadFile = () => {
        setUploadFilePopup(true)
    }

    return (
        <div className="container">
            <h1>MiceTrack</h1>
            <div className="buttons-wrapper">
                <button
                    type="button"
                    onClick={handleCreateMiceBtn} 
                    className="btn btn-primary"
                >
                    track a mouse
                </button>
                <div className="buttons-wrapper">
                    <a
                        href="/track-mice/export"
                        className="btn btn-warning btn-csv"
                    >
                        download table data as .csv
                    </a>
                    <a
                        onClick={openUploadFile}
                        className="btn btn-warning btn-csv"
                    >
                        upload table data as .csv
                    </a>
                </div>
                {uploadFilePopup && <UploadFile />}
            </div>
            {popupModal && 
            <Modal 
                status={status}
                closeModal={closeModal}
                submitData={submitData}
                femaleMouseManualId={femaleMouseManualId}
                setFemaleMouseManualId={setFemaleMouseManualId}
                matingDate={matingDate}
                setMatingDate={setMatingDate}
                displayPupsInputs={displayPupsInputs}
                hasPups={hasPups}
                setHasPups={setHasPups}
                showPupInputs={showPupInputs}
                strainOptionsDisplay={strainOptionsDisplay}
                setPupsDob={setPupsDob}
            />}

            <table className="table table-striped">
                <tr>
                    <th scope="col">female mouse id</th>
                    <th scope="col">mating date</th>
                    <th scope="col">days in breeding</th>
                    <th scope="col">need to check pregnancy / remove male</th>
                    <th scope="col">pregnant?</th>
                    <th scope="col">pups strain</th>
                    <th scope="col">has pups?</th>
                    <th scope="col">pups dob</th>
                    <th scope="col">pups days old</th>
                </tr>
                {mouseData.map(mouse =>
                    <tr key={mouse['female_mouse_id']}>
                        <th id={mouse['female_mouse_manual_id']} scope="row">
                            {mouse['female_mouse_manual_id']}
                        </th>
                        <td>{formatDate(mouse['mating_date'])}</td>
                        <td>{daysInBreeding(mouse['mating_date'])}</td>
                        <td>{needToCheckIfPregnant(mouse['mating_date'])}</td>
                        {/* if (has pups or need to check preg) ? 'no' : 'yes' */}
                        <td>{'todo'}</td>
                        <td>{'todo'}</td>
                        
                        <td>{checkIfHasPups(mouse['has_pups'])}</td>
                        <td>{formatDate(mouse['pups_dob'])}</td>
                        <td>{'todo'}</td>
                        <td>
                        <button
                            className="btn btn-warning" 
                            onClick={() => handleUpdateMiceBtn(mouse)}
                            >
                            edit
                            </button>
                        </td>
                        <td>
                        <button 
                            className="btn bl btn-danger"
                            onClick={() => deleteRowData(mouse['female_mouse_id'])}
                        >
                            delete
                        </button>
                        </td>
                    </tr>
                    )}
                    
            </table> 
        </div>
    )
}

ReactDOM.render(<App />, document.querySelector('#root'));
