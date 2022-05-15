function Modal(props) {

  const [status, setStatus] = React.useState(null)
  const [showPupInputs, setsShowPupInputs] = React.useState(false)
  const [isCheckIfPregDisabled, setIsCheckIfPregDisabled] = React.useState(false);

  const submitData = (evt) => {
    evt.preventDefault()

    const formInputs = {
      mating_date: document.querySelector('#mating-date').value,
      days_in_breeding: document.querySelector('#days-in-breeding').value,
      need_check_pregnancy: document.querySelector('#need-check-pregnancy').value,
      check_if_pregnant: document.querySelector('#check-if-pregnant').value,
    }

    fetch('/track-mice', {
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

  const displayPupsInputs = () => {
    setsShowPupInputs(!showPupInputs)
  }

  const toggleCheckIfPregnant = () => {
    setIsCheckIfPregDisabled(!isCheckIfPregDisabled)
  };

  return (
    <React.Fragment>
      <div>
        {status ? 
          <div className="alert alert-success">
            {status}
          <button onClick={props.closeModal}>Close</button>
        </div> : null}
        <form id="track-mice-form" onSubmit={submitData}>
        <h2>Female mice info</h2>
        <label htmlFor="mating-date">Mating date</label>
        <input type="date" id="mating-date" name="mating-date" /><br/>

        <label htmlFor="days-in-breeding">Days in breeding</label>
        <input type="text" id="days-in-breeding" name="days-in-breeding"/><br/>

        <label htmlFor="need-check-pregnancy">Need to check pregnancy?</label>
        <input type="checkbox" id="need-check-pregnancy" name="need-check-pregnancy" onClick={toggleCheckIfPregnant}/><br/>

        <label htmlFor="check-if-pregnant">Check if pregnant</label>
        <input type="checkbox" id="check-if-pregnant" name="check-if-pregnant" disabled={isCheckIfPregDisabled} onClick={displayPupsInputs}/><br/>

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

function Homepage() {
  const [popupModal, setpopupModal] = React.useState(false);
  const [mouseData, setMouseData] = React.useState({});

  const openModal = () => {
    setpopupModal(true)
  }

  const closeModal = () => {
    setpopupModal(false)
    window.location.reload()
  }
  
  React.useEffect(() => {
    fetch('/track-mice')
    .then((response) => response.json())
    .then((responseData) => {
      setMouseData(responseData)
    });
  }, [])

    const renderMouseData = () => {

      for (const mice in mouseData) {
        const checkPreg = mouseData[mice].check_pregnancy ? "needed" : "not needed"
        const pregnant = mouseData[mice].pregnant ? "yes" : "no"

        console.log(mouseData)
        return(
          <tr>
              <th scope="row">{mouseData[mice].female_mouse_id}</th>
              <td>{mouseData[mice].mating_date}</td>
              <td>{mouseData[mice].days_in_breeding}</td>
              <td>{checkPreg}</td>
              <td>{pregnant}</td>
            </tr>
        )
      }
    }

    return (
      <React.Fragment>
        <h1>MiceTrack</h1>
        <button type="button" onClick={openModal} className="btn btn-primary">
          Track a mouse
        </button>
        {popupModal && <Modal closeModal={closeModal}/>}

        <table className="table table-striped">
          <tr>
            <th scope="col">id</th>
            <th scope="col">mating date</th>
            <th scope="col">days in breeding</th>
            <th scope="col">need to check pregnancy</th>
            <th scope="col">pregnant?</th>
          </tr>
          {renderMouseData()}
        </table>
      </React.Fragment>
    );
  }

  ReactDOM.render(<Homepage />, document.querySelector('#root'));

