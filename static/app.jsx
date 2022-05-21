function App() {
  // add new state for current mouse initial value is null
  // when you click edit set it to the mouse you are editing
  const [status, setStatus] = React.useState(null)
  const [popupModal, setpopupModal] = React.useState(false)
  
  const [mouseData, setMouseData] = React.useState([])

  const [showPupInputs, setsShowPupInputs] = React.useState(false)
  const [isCheckIfPregDisabled, setIsCheckIfPregDisabled] = React.useState(false)

  const [matingDate, setMatingDate] = React.useState('')
  const [daysInBreeding, setDaysInBreeding] = React.useState(0)
  const [needToCheckPregnancy, setNeedToCheckPregnancy] = React.useState(false)
  const [checkIfPregnant, setCheckIfPregnant] = React.useState(false)

  const [isUpdate, setIsUpdate] = React.useState(false)
  const [isCreate, setIsCreate] = React.useState(false)

  const [mouseId, setMouseId] = React.useState(null)

  const displayPupsInputs = () => {
    setsShowPupInputs(!showPupInputs)
  }

  const toggleCheckIfPregnant = () => {
    setIsCheckIfPregDisabled(!isCheckIfPregDisabled)
  };

  const openModal = () => {
    setpopupModal(true)
  }

  const closeModal = () => {
    setpopupModal(false)
    window.location.reload()
  }

  // get mice data to populate the table
  React.useEffect(() => {
    fetch('/track-mice')
    .then((response) => response.json())
    .then((responseData) => {
      setMouseData(responseData)
    });
  }, [])

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
    openModal()
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
      mating_date: matingDate,
      days_in_breeding: daysInBreeding,
      need_check_pregnancy: needToCheckPregnancy,
      check_if_pregnant: checkIfPregnant,
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

    // get data from mouseData
    // to values and checked atributes
    

    const formInputs = {
      female_mouse_id: mouse_id,
      mating_date: matingDate,
      days_in_breeding: daysInBreeding,
      need_check_pregnancy: needToCheckPregnancy,
      check_if_pregnant: checkIfPregnant,
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
            <label htmlFor="mating-date">Mating date</label>
            <input 
              type="date" 
              id="mating-date" 
              name="mating-date" 
              value={matingDate}
              onChange={e => setMatingDate(e.target.value)}
            /><br/>

            <label htmlFor="days-in-breeding">Days in breeding</label>
            <input 
              type="text"
              id="days-in-breeding" 
              name="days-in-breeding" 
              value={daysInBreeding}
              onChange={e => setDaysInBreeding(e.target.value)}
            /><br/>

            <label htmlFor="need-check-pregnancy">Need to check pregnancy?</label>
            <input 
              type="checkbox" 
              id="need-check-pregnancy" 
              name="need-check-pregnancy" 
              onClick={toggleCheckIfPregnant}
              checked={needToCheckPregnancy}
              onChange={e => setNeedToCheckPregnancy(e.target.checked)}
            /><br/>

            <label htmlFor="check-if-pregnant">Check if pregnant</label>
            <input 
              type="checkbox" id="check-if-pregnant" 
              name="check-if-pregnant" 
              disabled={isCheckIfPregDisabled} 
              onClick={displayPupsInputs}
              checked={checkIfPregnant}
              onChange={e => setCheckIfPregnant(e.target.checked)}
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

            <label htmlFor="days-old">Days old</label>
            <span id="days-old">123</span><br/>

            <label htmlFor="wean-date">WEAN date</label>
            <span id="wean-date">11-09-2020</span><br/>

            <label htmlFor="need-to-id">Need to id</label>
            <input type="checkbox" id="need-to-id" name="need-to-id"/><br/><br/>
          </React.Fragment>}
          <button id="cancel-btn" onClick={closeModal}>Cancel</button>
          <input id="create-btn" type="submit" value="Submit" />
        </form>
      </div>} 

      <table className="table table-striped">
        <tr>
          <th scope="col">id</th>
          <th scope="col">mating date</th>
          <th scope="col">days in breeding</th>
          <th scope="col">need to check pregnancy</th>
          <th scope="col">pregnant?</th>
          </tr>
          {Object.values(mouseData).map(mouse =>
              <tr key={mouse['female_mouse_id']}>
                <th id={mouse['female_mouse_id']} scope="row">{mouse['female_mouse_id']}</th>
                <td>{mouse['mating_date']}</td>
                <td>{mouse['days_in_breeding']}</td>
                <td>{mouse['check_pregnancy'] ? "needed" : "not needed"}</td>
                <td>{mouse['pregnant'] ? "yes" : "no"}</td>
                <td>
                  <button onClick={() => handleUpdateMiceBtn(mouse)}>
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
