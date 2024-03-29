function App() {

    const [status, setStatus] = React.useState(null)
    const [popupModal, setPopupModal] = React.useState(false)
    const [uploadCSVFilePopup, setUploadCSVFilePopup] = React.useState(false)
    
    const [mouseData, setMouseData] = React.useState([])

    const [femaleMouseManualId, setFemaleMouseManualId] = React.useState('')
    const [matingDate, setMatingDate] = React.useState(null)
    const [isPregnant, setIsPregnant] = React.useState(false)
    const [hasPups, setHasPups] = React.useState(false)
    const [pupsDob, setPupsDob] = React.useState(null)
    const [pupStrain, setPupStrain] = React.useState('')

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
        setFemaleMouseManualId(mouse['female_mouse_manual_id'])
        setMatingDate(formatDate(mouse['mating_date']))
        setIsPregnant(mouse['is_pregnant'])
        setHasPups(mouse['has_pups'])
        setPupStrain(mouse['pups_strain'])
        setPupsDob(mouse['pups_dob'] !== null ? formatDate(mouse['pups_dob']) : null)
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
            is_pregnant: isPregnant,
            has_pups: hasPups,
            pups_dob: pupsDob,
            pups_strain: pupStrain
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
            is_pregnant: isPregnant,
            has_pups: hasPups,
            pups_dob: pupsDob,
            pups_strain: pupStrain
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

    const daysInBreeding = (mating_date) => {
        let today = new Date()
        let mating_date_object = new Date(mating_date) 
        const diffIndays = Math.abs(mating_date_object-today)

        return Math.floor(diffIndays / ((1000 * 60 * 60 * 24)))
    }

    const needToCheckIfPregnant = (mating_date, is_pregnant) => {
        return daysInBreeding(mating_date) < 15 || is_pregnant == true ? '-' : 'check'
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

    const calculatePupsDaysOld = (mouse) => {
        let res = '-';
        if (mouse['has_pups']) {
            const now = new Date()
            const pupsDob = new Date(mouse['pups_dob'])
            res = Math.floor((now - pupsDob) / (1000 * 60 * 60 * 24))
        }
        return res
    }

    const toggleUploadCSVFile = () => {
        setUploadCSVFilePopup(!uploadCSVFilePopup)
    }

    return (
        <div className="container">
            <div>
                <h1 className="logo">MiceTrack</h1>
                <div className="buttons-wrapper">
                    <button
                        type="button"
                        onClick={handleCreateMiceBtn} 
                        className="btn btn-primary"
                    >
                        track a mouse
                    </button>
                    <div className="dropdown-wrapper">
                        <a onClick={toggleUploadCSVFile} className="btn btn-csv-import btn-secondary">Import CSV</a>
                        {uploadCSVFilePopup && <UploadFile toggleUploadCSVFile={toggleUploadCSVFile} />}
                        <div className="dropdown">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                Export as
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <li><a href="/track-mice/export-csv" className="btn">CSV</a></li>
                                <li><a href="/track-mice/export-xls" className="btn">XLS</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
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
                hasPups={hasPups}
                setHasPups={setHasPups}
                pupsDob={pupsDob}
                formatDate={formatDate}
                setPupsDob={setPupsDob}
                pupStrain={pupStrain}
                setPupStrain={setPupStrain}
                isPregnant={isPregnant}
                setIsPregnant={setIsPregnant}
            />}

            <Table 
                mouseData={mouseData}
                formatDate={formatDate}
                daysInBreeding={daysInBreeding}
                needToCheckIfPregnant={needToCheckIfPregnant}
                calculatePupsDaysOld={calculatePupsDaysOld}
                checkIfHasPups={checkIfHasPups}
                handleUpdateMiceBtn={handleUpdateMiceBtn}
                deleteRowData={deleteRowData}
                isPregnant={isPregnant}
            />
        </div>
    )
}

ReactDOM.render(<App />, document.querySelector('#root'));
