function App() {
  const [popupModal, setpopupModal] = React.useState(false);
  const [mouseData, setMouseData] = React.useState([]);
  
  // get mice data 
  React.useEffect(() => {
    fetch('/track-mice')
    .then((response) => response.json())
    .then((responseData) => {
      setMouseData(responseData)
    });
  }, [])
  
  const openModal = () => {
    setpopupModal(true)
  }

  const closeModal = () => {
    setpopupModal(false)
    window.location.reload()
  }

  return (
    <React.Fragment>
      <Header 
        popupModal={popupModal} 
        setpopupModal={setpopupModal} 
        openModal={openModal}
        closeModal={closeModal}
      />
      <RenderMouseDataTable 
        openModal={openModal} 
        mouseData={mouseData} 
        setMouseData={setMouseData} 
      /> 
    </React.Fragment>
  )
}

function Header(props) {
  
  // add new state for current mouse initial value is null
  // when you click edit set it to the mouse you are editing
  const [status, setStatus] = React.useState(null)

  // create a mice row
  const createMiceRow = (e) => {
    e.preventDefault()
    
    const formInputs = {
      mating_date: document.querySelector('#mating-date').value,
      days_in_breeding: document.querySelector('#days-in-breeding').value,
      need_check_pregnancy: document.querySelector('#need-check-pregnancy').value,
      check_if_pregnant: document.querySelector('#check-if-pregnant').value,
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

    return (
      <React.Fragment>
        <h1>MiceTrack</h1>
        <button type="button" onClick={props.openModal} className="btn btn-primary">
          Track a mouse
        </button>
        {props.popupModal && 
        <Modal 
          closeModal={props.closeModal} 
          status={status} 
          submitData={createMiceRow}
        />} 
      </React.Fragment>
    );
}


function RenderMouseDataTable (props) {
  // state of input fields?
  
  const fetchDataToUpdateRow = (e) => {
    
    // todo: display existing values inside the update form input fields

    props.openModal()

    let mouse_id = e.target.getAttribute('id')
    
    // todo: get current values from the row get this data directly from what I have sent by server (json)?
    const formInputs = {
      female_mouse_id: mouse_id,
      mating_date: document.querySelector('#mating-date').value,
      days_in_breeding: document.querySelector('#days-in-breeding').value,
      need_check_pregnancy: document.querySelector('#need-check-pregnancy').value,
      check_if_pregnant: document.querySelector('#check-if-pregnant').value,
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

  }

  const handleDeleteRowData = (e) => {

    let mouse_id = e.target.getAttribute('id')
  
    fetch('/track-mice', {
      method: 'DELETE',
      body: JSON.stringify(mouse_id),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    window.location.reload()
  }
    return(
      <table className="table table-striped">
        <tr>
          <th scope="col">id</th>
          <th scope="col">mating date</th>
          <th scope="col">days in breeding</th>
          <th scope="col">need to check pregnancy</th>
          <th scope="col">pregnant?</th>
          </tr>
          {Object.values(props.mouseData).map(mice =>
              <tr key={mice['female_mouse_id']}>
                <th id='female_mouse_id' scope="row">{mice['female_mouse_id']}</th>
                <td>{mice['mating_date']}</td>
                <td>{mice['days_in_breeding']}</td>
                <td>{mice['check_pregnancy'] ? "needed" : "not needed"}</td>
                <td>{mice['pregnant'] ? "yes" : "no"}</td>
                <td>
                  <button onClick={fetchDataToUpdateRow}>edit</button>
                  </td>
                <td>
                  <button 
                    id={mice['female_mouse_id']} 
                    onClick={handleDeleteRowData}
                  >
                    delete
                  </button>
                </td>
              </tr>
            )}
            
      </table>
    )
}


function Modal(props) {

  const [showPupInputs, setsShowPupInputs] = React.useState(false)
  const [isCheckIfPregDisabled, setIsCheckIfPregDisabled] = React.useState(false);

  const displayPupsInputs = () => {
    setsShowPupInputs(!showPupInputs)
  }

  const toggleCheckIfPregnant = () => {
    setIsCheckIfPregDisabled(!isCheckIfPregDisabled)
  };

  return (
    <React.Fragment>
      <div>
        {console.log('status',props.status)}
        {props.status ? 
          <div className="alert alert-success">
            {props.status}
          <button onClick={props.closeModal}>Close</button>
        </div> : null}

        <form id="track-mice-form" onSubmit={props.submitData}>
          <h2>Female mice info</h2>
          <label htmlFor="mating-date">Mating date</label>
          {/* give it a value => date of the mouse that you are editing */}
          <input type="date" id="mating-date" name="mating-date" /><br/>

          <label htmlFor="days-in-breeding">Days in breeding</label>
          <input type="text" id="days-in-breeding" name="days-in-breeding" /><br/>

          <label htmlFor="need-check-pregnancy">Need to check pregnancy?</label>
          <input 
            type="checkbox" 
            id="need-check-pregnancy" 
            name="need-check-pregnancy" 
            onClick={toggleCheckIfPregnant}
          /><br/>

          <label htmlFor="check-if-pregnant">Check if pregnant</label>
          <input 
            type="checkbox" id="check-if-pregnant" 
            name="check-if-pregnant" 
            disabled={isCheckIfPregDisabled} 
            onClick={displayPupsInputs}
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
          <button id="cancel-btn" onClick={props.closeModal}>Cancel</button>
          <input id="create-btn" type="submit" value="Create" />
        </form>
      </div>
    </React.Fragment>
  );
}


ReactDOM.render(<App />, document.querySelector('#root'));
