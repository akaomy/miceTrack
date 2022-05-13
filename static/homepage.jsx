function Modal(props) {

  const [status, setStatus] = React.useState(null)
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
      console.log(responseData.status)
    })
  }

  return (
    <React.Fragment>
      <div>
        {status ? <div>{status}</div> : null}
          <form onSubmit={submitData}>
          <h2>Female mice info</h2>
          <label htmlFor="mating-date">Mating date</label>
          <input type="date" id="mating-date" name="mating-date" /><br/>

          <label htmlFor="days-in-breeding">Days in breeding</label>
          <input type="text" id="days-in-breeding" name="days-in-breeding"/><br/>

          <label htmlFor="need-check-pregnancy">Need to check pregnancy?</label>
          <input type="checkbox" id="need-check-pregnancy" name="need-check-pregnancy"/><br/>

          <label htmlFor="check-if-pregnant">Check if pregnant</label>
          <input type="checkbox" id="check-if-pregnant" name="check-if-pregnant"/><br/>

          {/* <h2>Pups info</h2>

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
          <input type="checkbox" id="need-to-id" name="need-to-id"/><br/><br/> */}

          <button onClick={props.closeModal}>Cancel</button>
          <input type="submit" value="Create" />

        </form>
      </div>
    </React.Fragment>
  );
}

function Homepage() {
  const [popupModal, setpopupModal] = React.useState(false);
 
  const openModal = () => {
    setpopupModal(true)
  }

  const closeModal = () => {
    setpopupModal(false)
  }
  
    return (
      <React.Fragment>
        <h1>MiceTrack</h1>
        <button type="button" onClick={openModal} className="btn btn-primary">
          Track a mouse
        </button>
        {popupModal && <Modal closeModal={closeModal}/>}
      </React.Fragment>
    );
  }

  ReactDOM.render(<Homepage />, document.querySelector('#root'));

